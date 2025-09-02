const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
      slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String },
    logo: { type: String, trim: true }, 
    tagline: { type: String, trim: true },
    description: { type: String, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    responseTime: { type: String, trim: true }, 
    returnRate: { type: String, trim: true }, 
    verified: { type: Boolean, default: false },
    shopneoLink: { type: String, trim: true }, 
    category: [String], 
    // SEO fields
    seoTitle: { type: String, trim: true },
    seoKeywords: [String], 
    seoDescription: { type: String, trim: true },
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
