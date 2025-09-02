const express = require("express");
const sellerRoutes = express.Router();
const {
  addSeller,
  getSellers,
  updateSeller,
  deleteSeller,
  getOneSeller,
} = require("../controllers/seller.controllers.js");
const authmiddleware = require("../middleware/auth.middleware.js");
const multer = require("multer");

// Multer setup
const upload = multer({ dest: "uploads/" });
const cpUpload = upload.fields([{ name: "logo", maxCount: 1 }]);

// Routes
sellerRoutes.post("/addseller", authmiddleware, cpUpload, addSeller);
sellerRoutes.get("/getsellers", authmiddleware, getSellers);
sellerRoutes.get("/getseller/:id", authmiddleware, getOneSeller);
sellerRoutes.put("/updateseller/:id", authmiddleware, cpUpload, updateSeller);
sellerRoutes.delete("/deleteseller/:id", authmiddleware, deleteSeller);

module.exports = sellerRoutes;
