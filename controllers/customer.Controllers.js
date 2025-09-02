const Customer = require("../models/Customer.js");
const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");

// Add Customer
async function addCustomer(req, res) {
  try {
    const {
      slug,
      name,
      businessName,
      location,
      email,
      contact,
      description,
      youtube,
      whatsapp,
      instagram,
      facebook,
      numberalternative,
      metaTitle,
      metaKeywords,
      metaDescription
    } = req.body;

    // Check slug uniqueness
    const existing = await Customer.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Slug already exists, use a different slug" });
    }

    // Handle Images
    const bannerImageData = req.files?.bannerImage
      ? await uploadImage(req.files.bannerImage[0], "customers/banner")
      : {};
    const profileImageData = req.files?.profileImage
      ? await uploadImage(req.files.profileImage[0], "customers/profile")
      : {};
    const galleryImagesData = req.files?.galleryImages
      ? await uploadMultipleImages(req.files.galleryImages, "customers/gallery")
      : [];

    // Parse SEO fields properly
    const parsedMetaKeywords = metaKeywords
      ? JSON.parse(metaKeywords)
      : [];

    const newCustomer = await Customer.create({
      slug,
      name,
      businessName,
      location,
      email,
      contact,
      description,
      youtube,
      whatsapp,
      instagram,
      facebook,
      numberalternative,
      adminId: req.admin?._id,
      metaTitle: metaTitle ? String(metaTitle) : "",
      metaKeywords: parsedMetaKeywords,
      metaDescription: metaDescription ? String(metaDescription) : "",
      bannerImage: bannerImageData,
      profileImage: profileImageData,
      galleryImages: galleryImagesData,
    });

    res.status(201).json({ message: "Customer added successfully", newCustomer });
  } catch (error) {
    console.error("Add Customer Error:", error);
    res.status(500).json({ message: "Error adding customer", error: error.message });
  }
}

// Get All Customers
async function getCustomer(req, res) {
  try {
    const customers = await Customer.find();
    res.status(200).json({ message: "Customers fetched successfully", customers });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Get One Customer
async function getOneCustomer(req, res) {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    res.status(200).json({ message: "Customer fetched successfully", customer });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Update Customer
async function updateCustomer(req, res) {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const {
      slug,
      name,
      businessName,
      location,
      email,
      contact,
      description,
      youtube,
      whatsapp,
      instagram,
      facebook,
      numberalternative,
      metaTitle,
      metaKeywords,
      metaDescription,
    } = req.body;

    // Check slug uniqueness
    if (slug && slug !== customer.slug) {
      const existing = await Customer.findOne({ slug });
      if (existing) return res.status(400).json({ message: "Slug already exists" });
      customer.slug = slug;
    }

    // Update simple fields
    Object.assign(customer, {
      name,
      businessName,
      location,
      email,
      contact,
      description,
      youtube,
      whatsapp,
      instagram,
      facebook,
      numberalternative,
    });

    // Parse SEO fields
    if (metaTitle) customer.metaTitle = String(metaTitle);
    if (metaDescription) customer.metaDescription = String(metaDescription);
    if (metaKeywords) customer.metaKeywords = JSON.parse(metaKeywords);

    // Handle Images
    if (req.files?.bannerImage) {
      customer.bannerImage = await uploadImage(req.files.bannerImage[0], "customers/banner");
    }
    if (req.files?.profileImage) {
      customer.profileImage = await uploadImage(req.files.profileImage[0], "customers/profile");
    }
    if (req.files?.galleryImages) {
      const galleryData = await uploadMultipleImages(req.files.galleryImages, "customers/gallery");
      customer.galleryImages = [...customer.galleryImages, ...galleryData];
    }

    await customer.save();
    res.status(200).json({ message: "Customer updated successfully", customer });
  } catch (error) {
    console.error("Update Customer Error:", error);
    res.status(500).json({ message: "Error updating customer", error: error.message });
  }
}

// Delete Customer
async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;
    const deleteCustomer = await Customer.findByIdAndDelete(id);
    if (!deleteCustomer) return res.status(404).json({ message: "Customer not found" });

    res.status(200).json({ message: "Customer deleted successfully", deleteCustomer });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Helper: upload single image
async function uploadImage(file, folder) {
  const result = await cloudinary.uploader.upload(file.path, { folder });
  fs.unlinkSync(file.path);
  return { url: result.secure_url, public_id: result.public_id };
}

// Helper: upload multiple images
async function uploadMultipleImages(files, folder) {
  const data = [];
  for (let file of files) {
    const result = await cloudinary.uploader.upload(file.path, { folder });
    data.push({ url: result.secure_url, public_id: result.public_id });
    fs.unlinkSync(file.path);
  }
  return data;
}

module.exports = { addCustomer, getCustomer, getOneCustomer, updateCustomer, deleteCustomer };
