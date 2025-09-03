const express = require("express");
const blogsRoutes = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  createBlog,
  getAllBlogsByCustomer,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogs.controllers.js");

// ======================= ROUTES =======================

// Create Blog for a specific Customer
blogsRoutes.post(
  "/addblog/:customerId",        // <-- customerId params me
  authMiddleware,
  upload.single("image"),
  createBlog
);

// Get all Blogs for a specific Customer
blogsRoutes.get(
  "/allblogs/:customerId",       // <-- specific customer ke liye
  authMiddleware,
  getAllBlogsByCustomer
);

// Update Blog (optional: customerId change bhi ho sakta hai)
blogsRoutes.put(
  "/updateblog/:id",
  authMiddleware,
  upload.single("image"),
  updateBlog
);


// Delete Blog
blogsRoutes.delete(
  "/deleteblog/:id",
  authMiddleware,
  deleteBlog
);

module.exports = blogsRoutes;
