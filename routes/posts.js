import { Router } from "express";
import { checkAuth } from "../utils/checkAuth.js";
import {
  createPost,
  getAll,
  getById,
  getMyPosts,
  removePost,
  updatePost,
  getPostComments,
} from "../controllers/posts.js";
const router = new Router();

// Create post

router.post("/", checkAuth, createPost);

// Get all posts
router.get("/", getAll);

// Get post by ID
router.get("/:id", getById);

// Get my posts
router.get("/user/me", checkAuth, getMyPosts);

// Delete post
router.delete("/:id", checkAuth, removePost);

// Update post
router.put("/:id", checkAuth, updatePost);

// Get post comments
router.get("/comments/:id", getPostComments);

export default router;
