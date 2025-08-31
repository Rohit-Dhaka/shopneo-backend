const express = require("express");
const adminRoutes = express.Router();
const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/admin.Controllers.js");

adminRoutes.post("/signup", registerAdmin);
adminRoutes.post("/login", loginAdmin);

module.exports = adminRoutes;
