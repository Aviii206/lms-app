import express from "express";
import {
  getBlogs,
  getPublicBlogs,
  createBlog,
  likeBlog,
  addComment,
  deleteBlog,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/public", getPublicBlogs);
router.get("/", protect, getBlogs);
router.post("/", protect, createBlog);
router.put("/:id/like", protect, likeBlog);
router.post("/:id/comment", protect, addComment);
router.delete("/:id", protect, deleteBlog);

export default router;
