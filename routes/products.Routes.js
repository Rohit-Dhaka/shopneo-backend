const express = require("express");
const productsRoutes = express.Router();
const authmiddleware = require("../middleware/auth.middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  createProduct,
  getAllProductsByCustomer,
  updateProduct,
  deleteProduct
} = require("../controllers/products.Controllers");

// ✅ Create product for a customer
productsRoutes.post(
  "/addproducts/:customerId",   // singular
  authmiddleware,
  upload.single("image"),
  createProduct
);

// ✅ Get all products for a customer
productsRoutes.get(
  "/getproducts/:customerId",
  authmiddleware,
  getAllProductsByCustomer
);

// ✅ Update a product by ID
productsRoutes.put(
  "/updateproduct/:id",    // singular, no customerId
  authmiddleware,
  upload.single("image"),
  updateProduct
);

// ✅ Delete a product by ID
productsRoutes.delete(
  "/deleteproduct/:id",    // singular, no customerId
  authmiddleware,
  deleteProduct
);

module.exports = productsRoutes;
