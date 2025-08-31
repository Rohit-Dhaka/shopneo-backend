const Customer = require("../models/Customer.js");
const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");

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
    } = req.body;

    const existing = await Customer.findOne({ slug });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Slug already exists, use a different slug" });
    }

    let bannerImageUrl = "";
    let profileImageUrl = "";
    let galleryImagesUrls = [];

    if (req.files && req.files.bannerImage) {
      const result = await cloudinary.uploader.upload(
        req.files.bannerImage[0].path,
        {
          folder: "customers/banner",
        }
      );
      bannerImageUrl = result.secure_url;
      fs.unlinkSync(req.files.bannerImage[0].path);
    }

    if (req.files && req.files.profileImage) {
      const result = await cloudinary.uploader.upload(
        req.files.profileImage[0].path,
        {
          folder: "customers/profile",
        }
      );
      profileImageUrl = result.secure_url;
      fs.unlinkSync(req.files.profileImage[0].path);
    }

    if (req.files && req.files.galleryImages) {
      for (let file of req.files.galleryImages) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "customers/gallery",
        });
        galleryImagesUrls.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }

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
      adminId: req.admin._id,
      bannerImage: bannerImageUrl,
      profileImage: profileImageUrl,
      galleryImages: galleryImagesUrls,
    });

    res
      .status(201)
      .json({ message: " Customer added successfully", newCustomer });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: " Error adding customer", error: error.message });
  }
}

async function getCustomer(req, res) {
  try {
    const customers = await Customer.find();
    if (!customers) {
      return res.status(400).json({ message: "Customers not founds" });
    }
    return res
      .status(200)
      .json({ message: "customer get successfully", customers });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateCustomer(req, res) {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

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
      alternativeNumber,
    } = req.body;

    if (slug) customer.slug = slug;
    if (name) customer.name = name;
    if (businessName) customer.businessName = businessName;
    if (location) customer.location = location;
    if (email) customer.email = email;
    if (contact) customer.contact = contact;
    if (description) customer.description = description;
    if (youtube) customer.youtube = youtube;
    if (whatsapp) customer.whatsapp = whatsapp;
    if (instagram) customer.instagram = instagram;
    if (facebook) customer.facebook = facebook;
    if (alternativeNumber) customer.alternativeNumber = alternativeNumber;

    if (req.files) {
      if (req.files.bannerImage) {
        const result = await cloudinary.uploader.upload(
          req.files.bannerImage[0].path,
          {
            folder: "customers/banner",
          }
        );
        customer.bannerImage = result.secure_url;
        fs.unlinkSync(req.files.bannerImage[0].path);
      }

      if (req.files.profileImage) {
        const result = await cloudinary.uploader.upload(
          req.files.profileImage[0].path,
          {
            folder: "customers/profile",
          }
        );
        customer.profileImage = result.secure_url;
        fs.unlinkSync(req.files.profileImage[0].path);
      }

      if (req.files.galleryImages) {
        let galleryUrls = [];
        for (let file of req.files.galleryImages) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "customers/gallery",
          });
          galleryUrls.push(result.secure_url);
          fs.unlinkSync(file.path);
        }
        customer.galleryImages = [...customer.galleryImages, ...galleryUrls];
      }
    }

    await customer.save();
    return res
      .status(200)
      .json({ message: "Customer updated successfully", customer });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;
    const deleteCustomer = await Customer.findByIdAndDelete(id);
    if (!deleteCustomer) {
      return res.status(400).json({ message: "Customers not founds" });
    }
    return res
      .status(200)
      .json({ message: "customer delete successfully", deleteCustomer });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { addCustomer, getCustomer, updateCustomer, deleteCustomer };






// Admin 
// http://localhost:4000/api/v1/admin/signup 
// http://localhost:4000/api/v1/admin/login

// blogs 
// http://localhost:4000/api/v1/blogs/addblog
// http://localhost:4000/api/v1/blogs/getblog 
// http://localhost:4000/api/v1/blogs/updateblog/:id 
// http://localhost:4000/api/v1/blogs/deleteblog/:id

// BusinessHours 
// http://localhost:4000/api/v1/time/addtime 
// http://localhost:4000/api/v1/time/gettime 
// http://localhost:4000/api/v1/time/updatetime/:id
// http://localhost:4000/api/v1/time/deletetime/:id

// Customer 
// http://localhost:4000/api/v1/customer/addcustomer
// http://localhost:4000/api/v1/customer/getcustomer 
// http://localhost:4000/api/v1/customer/updatecustomer/:id 
// http://localhost:4000/api/v1/customer/deletecustomer/:id

// Products 
// http://localhost:4000/api/v1/products/addproducts
// http://localhost:4000/api/v1/products/getproducts
// http://localhost:4000/api/v1/products/updateproducts/:id 
// http://localhost:4000/api/v1/products/deleteproducts/:id

// SEO
// http://localhost:4000/api/v1/seo/addseco
// http://localhost:4000/api/v1/seo/getseo
// http://localhost:4000/api/v1/seo/updateseo/:id 
// http://localhost:4000/api/v1/seo/deleteseo/:id
