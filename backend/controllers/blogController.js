import mongoose from "mongoose";
import Blog from "../models/Blog.js";

// @desc    Get all public blogs (for login/unauthenticated users)
// @route   GET /api/blogs/public
// @access  Public
export const getPublicBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublic: true })
      .populate("author", "name email role")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get public blogs AND user's private blogs
// @route   GET /api/blogs
// @access  Private
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      $or: [{ isPublic: true }, { author: req.user._id }],
    })
      .populate("author", "name email role")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req, res) => {
  const { title, content, isPublic, attachments } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  try {
    const blog = new Blog({
      title,
      content,
      isPublic: Boolean(isPublic),
      author: req.user._id,
      attachments: attachments || [],
    });
    const createdBlog = await blog.save();
    
    // Return populated instance
    const populatedObj = await Blog.findById(createdBlog._id).populate("author", "name");
    
    res.status(201).json(populatedObj);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Like or Unlike a blog
// @route   PUT /api/blogs/:id/like
// @access  Private
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if post has already been liked by this user
    if (blog.likes.some((like) => like.toString() === req.user._id.toString())) {
      // Unlike
      blog.likes = blog.likes.filter((like) => like.toString() !== req.user._id.toString());
    } else {
      // Like
      blog.likes.unshift(req.user._id);
    }

    await blog.save();
    res.json(blog.likes);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Add a comment to a blog
// @route   POST /api/blogs/:id/comment
// @access  Private
export const addComment = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Request missing text argument" });
  }

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newComment = {
      text,
      user: req.user._id,
    };

    blog.comments.push(newComment);
    await blog.save();

    // Fetch the fully populated comments array
    const updatedBlog = await Blog.findById(req.params.id).populate("comments.user", "name");
    
    res.status(201).json(updatedBlog.comments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete a blog (author only)
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorised to delete this post" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

