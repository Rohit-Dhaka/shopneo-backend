const Seller = require("../models/Seller.js");
const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");

async function addSeller(req, res) {
  try {
    const {
      name,
      slug,
      tagline,
      description,
      rating,
      totalReviews,
      totalProducts,
      followers,
      responseTime,
      returnRate,
      verified,
      shopneoLink,
      category,
      seoTitle,
      seoKeywords,
      seoDescription,
    } = req.body;

    // check duplicate seller by name
    const existing = await Seller.findOne({ name });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Seller already exists, use a different name" });
    }

    let logoUrl = "";

    // Upload logo
    if (req.files && req.files.logo) {
      const result = await cloudinary.uploader.upload(req.files.logo[0].path, {
        folder: "sellers/logo",
      });
      logoUrl = result.secure_url;
      fs.unlinkSync(req.files.logo[0].path);
    }

    const newSeller = await Seller.create({
      name,
      slug,
      logo: logoUrl,
      tagline,
      description,
      rating,
      totalReviews,
      totalProducts,
      followers,
      responseTime,
      returnRate,
      verified,
      shopneoLink,
      category: category ? category.split(",") : [],
      seoTitle,
      seoKeywords: seoKeywords ? seoKeywords.split(",") : [],
      seoDescription,
    });

    res
      .status(201)
      .json({ message: "Seller added successfully", newSeller });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding seller", error: error.message });
  }
}

async function getSellers(req, res) {
  try {
    const sellers = await Seller.find();
    if (!sellers) {
      return res.status(404).json({ message: "No sellers found" });
    }
    return res.status(200).json({ message: "Sellers fetched successfully", sellers });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getOneSeller(req, res) {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    return res.status(200).json({ message: "Seller fetched successfully", seller });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateSeller(req, res) {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const {
      name,
      tagline,
      slug,
      description,
      rating,
      totalReviews,
      totalProducts,
      followers,
      responseTime,
      returnRate,
      verified,
      shopneoLink,
      category,
      seoTitle,
      seoKeywords,
      seoDescription,
    } = req.body;

    if (name) seller.name = name;
    if (slug) seller.slug = slug;
    if (tagline) seller.tagline = tagline;
    if (description) seller.description = description;
    if (rating) seller.rating = rating;
    if (totalReviews) seller.totalReviews = totalReviews;
    if (totalProducts) seller.totalProducts = totalProducts;
    if (followers) seller.followers = followers;
    if (responseTime) seller.responseTime = responseTime;
    if (returnRate) seller.returnRate = returnRate;
    if (verified !== undefined) seller.verified = verified;
    if (shopneoLink) seller.shopneoLink = shopneoLink;
    if (category) seller.category = category.split(",");
    if (seoTitle) seller.seoTitle = seoTitle;
    if (seoKeywords) seller.seoKeywords = seoKeywords.split(",");
    if (seoDescription) seller.seoDescription = seoDescription;

    if (req.files && req.files.logo) {
      const result = await cloudinary.uploader.upload(req.files.logo[0].path, {
        folder: "sellers/logo",
      });
      seller.logo = result.secure_url;
      fs.unlinkSync(req.files.logo[0].path);
    }

    await seller.save();
    return res.status(200).json({ message: "Seller updated successfully", seller });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteSeller(req, res) {
  try {
    const { id } = req.params;
    const deletedSeller = await Seller.findByIdAndDelete(id);
    if (!deletedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    return res.status(200).json({ message: "Seller deleted successfully", deletedSeller });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { addSeller, getSellers, getOneSeller, updateSeller, deleteSeller };


// Sellers
// POST    http://localhost:4000/api/v1/sellers/addseller
// GET     http://localhost:4000/api/v1/sellers/getsellers
// GET     http://localhost:4000/api/v1/sellers/getseller/:id
// PUT     http://localhost:4000/api/v1/sellers/updateseller/:id
// DELETE  http://localhost:4000/api/v1/sellers/deleteseller/:id
