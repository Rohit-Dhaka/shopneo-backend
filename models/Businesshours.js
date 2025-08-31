const mongoose = require("mongoose");

const businessHoursSchema = new mongoose.Schema({
  monday: String,
  tuesday: String,
  wednesday: String,
  thursday: String,
  friday: String,
  saturday: String,
  sunday: String,
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
});

const BusinessHours = mongoose.model("BusinessHours", businessHoursSchema);
module.exports = BusinessHours;
