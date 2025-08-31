const Products = require("../models/Product.js");
const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");

const createProduct = async (req, res) => {
  try {
    const { name, description, whatsappUrl } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);

    const product = new Products({
      name,
      description,
      whatsappUrl,
      image: result.secure_url,
      adminId: req.admin._id,
    });

    const savedProduct = await product.save();
    res
      .status(201)
      .json({ message: "Product created successfully", savedProduct });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json({ data: products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, whatsappUrl } = req.body;
    const { id } = req.params;

    let product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    if (req.file) {
      if (product.image.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path);

      product.img = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (whatsappUrl) product.whatsappUrl = whatsappUrl;

    await product.save();

    return res
      .status(200)
      .json({ message: "Blog updated successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Products.findByIdAndDelete(id);

    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
