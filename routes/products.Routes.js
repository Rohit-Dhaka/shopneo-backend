const express = require("express");
const productsRoutes = express.Router();
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.Controllers");
const authmiddleware = require("../middleware/auth.middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

productsRoutes.post(
  "/addproducts",
  authmiddleware,
  upload.single("image"),
  createProduct
);
productsRoutes.get("/getproducts", authmiddleware, getAllProducts);
productsRoutes.put(
  "/updateproducts/:id",
  authmiddleware,
  upload.single("image"),
  updateProduct
);
productsRoutes.delete("/deleteproducts/:id", authmiddleware, deleteProduct);

module.exports = productsRoutes;
