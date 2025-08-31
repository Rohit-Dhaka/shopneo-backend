const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: {
    url: String,
    public_id: String,
  },
  whatsappUrl: String,
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
});

const Products = mongoose.model("Products", productSchema);

module.exports = Products;
