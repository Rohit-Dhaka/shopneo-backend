const Products = require("../models/Product.js");
const Customer = require("../models/Customer.js");
const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");

// ======================= CREATE PRODUCT =======================
const createProduct = async (req, res) => {
  try {
    const { name, description, whatsappUrl, customerId } = req.body;

    // ✅ Validate customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // ✅ Upload product image
    let imageData = {};
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      imageData = { url: result.secure_url, public_id: result.public_id };
      fs.unlinkSync(req.file.path);
    }

    // ✅ Create new product
    const product = new Products({
      name,
      description,
      whatsappUrl,
      image: imageData,
      customerId, // link product to customer
      adminId: req.admin._id,
    });

    const savedProduct = await product.save();

    // ✅ Push product inside customer
    customer.products.push(savedProduct._id);
    await customer.save();

    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

// ======================= GET ALL PRODUCTS =======================
const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find().populate("customerId", "name businessName");
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// ======================= UPDATE PRODUCT =======================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, whatsappUrl, customerId } = req.body;

    let product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ If customer is changed
    if (customerId && customerId !== String(product.customerId)) {
      const oldCustomer = await Customer.findById(product.customerId);
      if (oldCustomer) {
        oldCustomer.products.pull(product._id);
        await oldCustomer.save();
      }

      const newCustomer = await Customer.findById(customerId);
      if (!newCustomer) {
        return res.status(404).json({ message: "New customer not found" });
      }
      newCustomer.products.push(product._id);
      await newCustomer.save();

      product.customerId = customerId;
    }

    // ✅ Update image if provided
    if (req.file) {
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      product.image = { url: result.secure_url, public_id: result.public_id };
      fs.unlinkSync(req.file.path);
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (whatsappUrl) product.whatsappUrl = whatsappUrl;

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

// ======================= DELETE PRODUCT =======================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Remove image from Cloudinary
    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    // ✅ Remove product from customer
    const customer = await Customer.findById(product.customerId);
    if (customer) {
      customer.products.pull(product._id);
      await customer.save();
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
