const Admin = require("../models/Admin.js");
const bcrypt = require("bcrypt");
const genreateToken = require("../ulits/genratetoken.js");

async function registerAdmin(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(403).json({ message: "Only one admin can register" });
    }

    const newAdmin = await Admin.create({
      username,
      email,
      password,
    });

    return res.status(201).json({
      message: "Admin registered successfully",
      newAdmin,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Email not exists" });
    }

    const isPassword = await bcrypt.compare(password, admin.password);
    if (!isPassword) {
      return res.status(401).json({ message: "Password not match" });
    }

    const token = genreateToken(admin._id);

    return res.status(200).json({
      message: "Admin login successfully",
      admin,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { registerAdmin, loginAdmin };
