const express = require("express");
const blogsRoutes = express.Router();
const {
  addblog,
  getblog,
  updateBlog,
  deleteblog,
} = require("../controllers/blogs.controllers.js");
const authmiddleware = require("../middleware/auth.middleware.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

blogsRoutes.post("/addblog", authmiddleware, upload.single("image"), addblog);
blogsRoutes.get("/getblog", getblog);
blogsRoutes.put("/updateblog/:id",authmiddleware,upload.single("image"),updateBlog);
blogsRoutes.delete("/deleteblog/:id", authmiddleware, deleteblog);

module.exports = blogsRoutes;
