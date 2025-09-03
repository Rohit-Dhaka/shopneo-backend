const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  image: {
    url: String,
    public_id: String,
  },
  heading: { type: String, required: true },
  description: String,
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
});

const Blogs = mongoose.model("Blogs", blogSchema);
module.exports = Blogs;
