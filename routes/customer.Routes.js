const express = require("express");
const customerRoutes = express.Router();
const multer = require("multer");

const {
  addCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getOneCustomer,
} = require("../controllers/customer.Controllers.js");

const authMiddleware = require("../middleware/auth.middleware.js");

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Handle multiple file fields
const cpUpload = upload.fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "profileImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 10 },
]);

// Routes
customerRoutes.post("/addcustomer", authMiddleware, cpUpload, addCustomer);
customerRoutes.get("/getcustomer", authMiddleware, getCustomer);
customerRoutes.get("/getcustomer/:id", authMiddleware, getOneCustomer);
customerRoutes.put("/updatecustomer/:id", authMiddleware, cpUpload, updateCustomer);
customerRoutes.delete("/deletecustomer/:id", authMiddleware, deleteCustomer);

module.exports = customerRoutes;
