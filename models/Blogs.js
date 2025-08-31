const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  img: {
    url: String,
    public_id: String,
  },
  heading: { type: String, required: true },
  description: String,
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
});

const Blogs = mongoose.model("Blogs", blogSchema);
module.exports = Blogs;
