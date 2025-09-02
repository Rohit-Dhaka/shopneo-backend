const express = require("express");
const routes = express.Router();
const authRoutes = require("./admin.Routes.js");
const blogsRoutes = require("./blogs.Routes.js");
const businessHoursRoutes = require("./businesshours.Routes.js");
const productsRoutes = require("./products.Routes.js");
const customerRoutes = require("./customer.Routes.js");
const sellerRoutes = require("./seller.Routes.js");

routes.use("/admin", authRoutes);
routes.use("/blogs", blogsRoutes);
routes.use("/time", businessHoursRoutes);
routes.use("/products", productsRoutes);
routes.use("/customer", customerRoutes);
routes.use("/seller", sellerRoutes);

module.exports = routes;
