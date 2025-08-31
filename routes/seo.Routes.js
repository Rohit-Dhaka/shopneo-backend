const express = require("express");
const seoRoutes = express.Router();
const {
  createSEO,
  getAllSEO,
  updateSEO,
  deleteSEO,
} = require("../controllers/seo.controllers");
const authmiddleware = require("../middleware/auth.middleware");

seoRoutes.post("/addseco", authmiddleware, createSEO);
seoRoutes.get("/getseo", authmiddleware, getAllSEO);
seoRoutes.put("/updateseo/:id", authmiddleware, updateSEO);
seoRoutes.delete("/deleteseo/:id", authmiddleware, deleteSEO);

module.exports = seoRoutes;
