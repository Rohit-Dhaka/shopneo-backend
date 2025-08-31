const mongoose = require("mongoose");

const seoSchema = new mongoose.Schema({
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
  canonicalUrl: String,
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
});

const SEO = mongoose.model("SEO", seoSchema);
module.exports = SEO;
