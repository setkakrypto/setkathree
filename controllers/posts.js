import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Create post
export const createPost = async (req, res) => {
  try {
    const { title, text } = req.body;
    const user = await User.findById(req.userId);

    if (req.files) {
      let fileName = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));

      const newPostWithImage = new Post({
        username: user.username,
        title,
        text,
        imgUrl: fileName,
        author: req.userId,
      });

      await newPostWithImage.save();
      await User.findByIdAndUpdate(req.userId, {
        $push: { posts: newPostWithImage },
      });

      return res.json(newPostWithImage);
    }

    const newPostWithoutImage = new Post({
      username: user.username,
      title,
      text,
      imgUrl: "",
      author: req.userId,
    });
    await newPostWithoutImage.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: { posts: newPostWithoutImage },
    });
    res.json(newPostWithoutImage);
  } catch (error) {
    res.json({ message: `Error creating post:${error}` });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    const popularPosts = await Post.find().sort("-views").limit(5);

    if (!posts) {
      return res.json({
        message: "Posts not found",
      });
    }

    res.json({ posts, popularPosts });
  } catch (error) {
    res.json({
      message: `Error getting posts: ${error}`,
    });
  }
};

// Get all posts
export const getById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id);
    if (post) {
      post.views += 1;
      await post.save();
    }
    res.json(post);
  } catch (error) {
    res.json({
      message: `Error getting posts: ${error}`,
    });
  }
};

// Get own posts
export const getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const list = await Promise.all(
      user.posts.map((post) => {
        return Post.findById(post._id);
      })
    );
    res.json(list);
  } catch (error) {
    res.json({
      message: `Error getting posts: ${error}`,
    });
  }
};

// Remove post
export const removePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.json({
        message: "Post not found",
      });
    }
    await User.findByIdAndUpdate(req.userId, {
      $pull: { posts: req.params.id },
    });

    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.json({
      message: `Error getting posts: ${error}`,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, text, id } = req.body;
    const post = await Post.findById(id);

    if (req.files) {
      let fileName = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));
      post.imgUrl = fileName || "";
    }

    post.title = title;
    post.text = text;
    await post.save();

    res.json(post);
  } catch (error) {
    res.json({
      message: `Error getting posts: ${error}`,
    });
  }
};

// get post comment
export const getPostComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const list = await Promise.all(
      post.comments.map((comment) => {
        return Comment.findById(comment);
      })
    );

    res.json(list);
  } catch (error) {
    res.json({ message: `Error getting posts: ${error}` });
  }
};
