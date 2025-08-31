const SEO = require("../models/SEO");

async function createSEO(req, res) {
  try {
    const { metaTitle, metaDescription, metaKeywords, canonicalUrl } = req.body;

    const newSEO = new SEO({
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      adminId: req.admin._id,
    });

    const savedSEO = await newSEO.save();
    return res
      .status(201)
      .json({ message: "SEO record created", data: savedSEO });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error creating SEO", error: error.message });
  }
}

async function getAllSEO(req, res) {
  try {
    const seoData = await SEO.find();
    return res.status(200).json({ data: seoData });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching SEO records", error: error.message });
  }
}

async function updateSEO(req, res) {
  try {
    const { id } = req.params;
    const { metaTitle, metaDescription, metaKeywords, canonicalUrl } = req.body;

    const updateData = {};
    if (metaTitle) updateData.metaTitle = metaTitle;
    if (metaDescription) updateData.metaDescription = metaDescription;
    if (metaKeywords) updateData.metaKeywords = metaKeywords;
    if (canonicalUrl) updateData.canonicalUrl = canonicalUrl;

    const updatedSEO = await SEO.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedSEO) {
      return res.status(404).json({ message: "SEO record not found" });
    }

    return res.status(200).json({
      message: "SEO updated successfully",
      data: updatedSEO,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating SEO",
      error: error.message,
    });
  }
}

async function deleteSEO(req, res) {
  try {
    const { id } = req.params;

    const deletedSEO = await SEO.findByIdAndDelete(id);

    if (!deletedSEO) {
      return res.status(404).json({ message: "SEO record not found" });
    }

    return res.status(200).json({ message: "SEO deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting SEO", error: error.message });
  }
}

module.exports = { createSEO, getAllSEO, updateSEO, deleteSEO };
