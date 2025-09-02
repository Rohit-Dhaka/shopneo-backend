const express = require("express");
const blogsRoutes = express.Router();
const multer = require("multer");

const {
  addBlog,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogs.controllers.js");

const authMiddleware = require("../middleware/auth.middleware.js");

// Multer setup for single image upload
const upload = multer({ dest: "uploads/" });

// Routes
blogsRoutes.post("/addblog", authMiddleware, upload.single("image"), addBlog);
blogsRoutes.get("/getblog", getBlog);
blogsRoutes.put("/updateblog/:id", authMiddleware, upload.single("image"), updateBlog);
blogsRoutes.delete("/deleteblog/:id", authMiddleware, deleteBlog);

module.exports = blogsRoutes;
