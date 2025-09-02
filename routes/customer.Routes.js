const express = require("express");
const customerRoutes = express.Router();
const {
  addCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getOneCustomer,
} = require("../controllers/customer.Controllers.js");
const authmiddleware = require("../middleware/auth.middleware.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const cpUpload = upload.fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "profileImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 10 },
]);

customerRoutes.post("/addcustomer", authmiddleware, cpUpload, addCustomer);
customerRoutes.get("/getcustomer", authmiddleware, getCustomer);
customerRoutes.put(
  "/updatecustomer/:id",
  authmiddleware,
  cpUpload,
  updateCustomer
);
customerRoutes.get("/getcustomer/:id", authmiddleware, getOneCustomer);
customerRoutes.delete("/deletecustomer/:id", authmiddleware, deleteCustomer);

module.exports = customerRoutes;
