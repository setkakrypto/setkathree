import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const createComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const author = req.userId;

    if (!comment)
      return res.status(400).json({ message: "Comment is required" });
    const newComment = new Comment({
      comment,
      author,
      postId,
    });
    await newComment.save();

    try {
      await Post.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id },
      });
    } catch (error) {
      console.log(error);
    }
    return res.status(201).json(newComment);
  } catch (error) {
    return res.status(500).json({ message: `Error create comment: ${error}` });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const commentId = req.params.id;
    if (!comment)
      return res.status(400).json({ message: "Comment is required" });

    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
      comment,
    });

    return res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    return res.status(500).json({ message: `Error update comment: ${error}` });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    try {
      await Post.findByIdAndUpdate(comment.postId, {
        $pull: { comments: comment._id },
      });
    } catch (error) {
      console.log(error);
    }

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: `Error delete comment: ${error}` });
  }
};

export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.userId;

    if (comment.dislikes.includes(userId)) {
      comment.dislikes.pull(userId);
    }

    if (!comment.likes.includes(userId)) {
      comment.likes.push(userId);
    } else {
      comment.likes.pull(userId);
    }

    await comment.save();
    res.status(200).json({
      message: "Comment liked",
      comment,
    });
  } catch (error) {
    return res.status(500).json({ message: `Error like comment: ${error}` });
  }
};

export const dislikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.userId;

    if (comment.likes.includes(userId)) {
      comment.likes.pull(userId);
    }

    if (!comment.dislikes.includes(userId)) {
      comment.dislikes.push(userId);
    } else {
      comment.dislikes.pull(userId);
    }

    await comment.save();
    res.status(200).json({
      message: "Comment disliked",
      comment,
    });
  } catch (error) {
    return res.status(500).json({ message: `Error like comment: ${error}` });
  }
};
