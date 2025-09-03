const mongoose = require("mongoose");

// Product Schema (embedded)
const productSchema = new mongoose.Schema({
  name: { type: String},
  description: String,
  image: {
    url: String,
    public_id: String,
  },
  whatsappUrl: String,
});

// Blog Schema (embedded)
const blogSchema = new mongoose.Schema({
  img: {
    url: String,
    public_id: String,
  },
  heading: { type: String, required: true },
  description: String,
});

// Business Hours Schema (embedded)
const businessHoursSchema = new mongoose.Schema({
  monday: String,
  tuesday: String,
  wednesday: String,
  thursday: String,
  friday: String,
  saturday: String,
  sunday: String,
});

// Customer Schema
const customerSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    businessName: { type: String, trim: true },

    bannerImage: {
      url: { type: String, trim: true },
      public_id: { type: String, trim: true },
    },
    profileImage: {
      url: { type: String, trim: true },
      public_id: { type: String, trim: true },
    },
    galleryImages: [
      {
        url: { type: String, trim: true },
        public_id: { type: String, trim: true },
      },
    ],

    location: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, unique: true },
    contact: { type: String, trim: true },
    numberAlternative: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    youtube: { type: String, trim: true },
    description: { type: String, trim: true },
 metaTitle: { type: String, default: "" }, 
  metaKeywords: { type: [String], default: [] }, 
  metaDescription: { type: String, default: "" }, 

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    products: [productSchema],         
    blogs: [blogSchema],               
    businessHours: businessHoursSchema,                   
  },
  { timestamps: true }
);


const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
