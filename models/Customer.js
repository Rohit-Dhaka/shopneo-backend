const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true },
    businessName: String,

    // ✅ Updated image fields
    bannerImage: {
      url: String,
      public_id: String,
    },
    profileImage: {
      url: String,
      public_id: String,
    },
    galleryImages: [
      {
        url: String,
        public_id: String,
      },
    ],

    location: String,
    email: String,
    contact: String,
    numberalternative: String,
    whatsapp: String,
    instagram: String,
    facebook: String,
    youtube: String,
    description: String,

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
