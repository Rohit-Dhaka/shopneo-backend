const express = require("express");
const businessHoursRoutes = express.Router();
const {
  addtime,
  deletetime,
  gettime,
  updatetime,
} = require("../controllers/businesshours.controllers");
const authmiddleware = require("../middleware/auth.middleware");

businessHoursRoutes.post("/addtime", authmiddleware, addtime);
businessHoursRoutes.put("/updatetime/:id", authmiddleware, updatetime);
businessHoursRoutes.get("/gettime", authmiddleware, gettime);
businessHoursRoutes.delete("/deletetime/:id", authmiddleware, deletetime);

module.exports = businessHoursRoutes;
