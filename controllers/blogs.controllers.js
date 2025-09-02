const Blogs = require("../models/Blogs.js");
const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");

// Add Blog
async function addBlog(req, res) {
  try {
    const { heading, description, customerId } = req.body;

    if (!heading || !description || !customerId) {
      return res.status(400).json({ message: "Heading, description, and customerId are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const img = await uploadImage(req.file, "blogs");

    const newBlog = await Blogs.create({
      heading,
      description,
      customerId,
      img,
    });

    return res.status(201).json({ message: "Blog added successfully", newBlog });
  } catch (error) {
    console.error("Add Blog Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Get All Blogs
async function getBlog(req, res) {
  try {
    const blogs = await Blogs.find().populate("customerId", "name businessName");
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found" });
    }
    return res.status(200).json({ message: "Blogs fetched successfully", blogs });
  } catch (error) {
    console.error("Get Blog Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Update Blog
async function updateBlog(req, res) {
  try {
    const { heading, description } = req.body;
    const { id } = req.params;

    const blog = await Blogs.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update image if provided
    if (req.file) {
      if (blog.img?.public_id) {
        await cloudinary.uploader.destroy(blog.img.public_id);
      }
      blog.img = await uploadImage(req.file, "blogs");
    }

    if (heading) blog.heading = heading;
    if (description) blog.description = description;

    await blog.save();
    return res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("Update Blog Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Delete Blog
async function deleteBlog(req, res) {
  try {
    const { id } = req.params;

    const blog = await Blogs.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete image from Cloudinary
    if (blog.img?.public_id) {
      await cloudinary.uploader.destroy(blog.img.public_id);
    }

    return res.status(200).json({ message: "Blog deleted successfully", blog });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Helper: upload image to Cloudinary
async function uploadImage(file, folder) {
  const result = await cloudinary.uploader.upload(file.path, { folder });
  fs.unlinkSync(file.path);
  return { url: result.secure_url, public_id: result.public_id };
}

module.exports = { addBlog, getBlog, updateBlog, deleteBlog };
