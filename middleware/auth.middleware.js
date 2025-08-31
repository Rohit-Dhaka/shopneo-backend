const Admin = require("../models/Admin.js");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const authmiddleware = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(404).json({ message: "token not found" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decode.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    req.admin = admin;
    next();
  } catch (error) {
    console.log(error);
  }
};
module.exports = authmiddleware;
