import { Router } from "express";
import {
  createComment,
  deleteComment,
  updateComment,
  likeComment,
  dislikeComment,
} from "../controllers/comment.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = new Router();

// Create comment
router.post("/:id", checkAuth, createComment);

// Update comment
router.put("/:id", checkAuth, updateComment);

// Like comment
router.put("/:id/like", checkAuth, likeComment);

// Dislike comment
router.put("/:id/dislike", checkAuth, dislikeComment);

// Delete comment
router.delete("/:id", checkAuth, deleteComment);

export default router;
