const Blogs = require("../models/Blogs.js");
const Customer = require("../models/Customer.js");
const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");

// ======================= CREATE BLOG =======================
const createBlog = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { heading, description } = req.body;

    // Validate customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Upload blog image if exists
    let imageData = {};
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blogs",
      });
      imageData = { url: result.secure_url, public_id: result.public_id };

      // remove temp file
      fs.unlinkSync(req.file.path);
    }

    // ✅ Create new blog object (embedded, not new Blogs())
    const newBlog = {
      heading,
      description,
      img: imageData,
    };

    // Push blog into customer.blogs array
    customer.blogs.push(newBlog);
    await customer.save();

    res.status(201).json({
      message: "✅ Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);
    res
      .status(500)
      .json({ message: "Error creating blog", error: error.message });
  }
};


// ======================= GET ALL BLOGS BY CUSTOMER =======================
const getAllBlogsByCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const blogs = await Blogs.find({ customerId }).populate(
      "customerId",
      "name businessName"
    );

    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Get Blogs Error:", error);
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
};

// ======================= UPDATE BLOG =======================
const updateBlog = async (req, res) => {
  try {
    const { id, customerId } = req.params;
    const { heading, description } = req.body;

    let blog = await Blogs.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // If customer changed, update customer-blog relationship
    if (customerId && customerId !== String(blog.customerId)) {
      const oldCustomer = await Customer.findById(blog.customerId);
      if (oldCustomer) {
        oldCustomer.blogs.pull(blog._id);
        await oldCustomer.save();
      }

      const newCustomer = await Customer.findById(customerId);
      if (!newCustomer) {
        return res.status(404).json({ message: "New customer not found" });
      }
      newCustomer.blogs.push(blog._id);
      await newCustomer.save();

      blog.customerId = customerId;
    }

    // Update image if provided
    if (req.file) {
      if (blog.image?.public_id) {
        await cloudinary.uploader.destroy(blog.image.public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blogs",
      });
      blog.image = { url: result.secure_url, public_id: result.public_id };
      fs.unlinkSync(req.file.path);
    }

    // Update other fields
    if (heading) blog.heading = heading;
    if (description) blog.description = description;

    await blog.save();

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("Update Blog Error:", error);
    res.status(500).json({ message: "Error updating blog", error: error.message });
  }
};

// ======================= DELETE BLOG =======================
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blogs.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete image from Cloudinary
    if (blog.image?.public_id) {
      await cloudinary.uploader.destroy(blog.image.public_id);
    }

    // Remove blog from customer
    const customer = await Customer.findById(blog.customerId);
    if (customer) {
      customer.blogs.pull(blog._id);
      await customer.save();
    }

    await blog.deleteOne();

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    res.status(500).json({ message: "Error deleting blog", error: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogsByCustomer,
  updateBlog,
  deleteBlog,
};
