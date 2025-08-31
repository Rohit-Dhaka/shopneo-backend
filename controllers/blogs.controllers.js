const Blogs = require("../models/Blogs.js");
const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");

async function addblog(req, res) {
  try {
    const { heading, description } = req.body;

    if (!heading || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);
    const newBlog = await Blogs.create({
      heading,
      description,
      img: result.secure_url,
      adminId: req.admin._id,
    });

    return res.status(201).json({
      message: "Blog added successfully",
      newBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async function getblog(req, res) {
  try {
    const blogs = await Blogs.find();
    if (!blogs) {
      return res.status(404).json({ message: "Blogs not founds" });
    }
    return res.status(201).json({ message: "Blog get successfully", blogs });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateBlog(req, res) {
  try {
    const { heading, description } = req.body;
    const { id } = req.params;

    let blog = await Blogs.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (req.file) {
      if (blog.img.public_id) {
        await cloudinary.uploader.destroy(blog.img.public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path);

      blog.img = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    if (heading) blog.heading = heading;
    if (description) blog.description = description;

    await blog.save();

    return res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteblog(req, res) {
  try {
    const { id } = req.params;

    const deletedBlog = await Blogs.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { addblog, getblog, updateBlog, deleteblog };
