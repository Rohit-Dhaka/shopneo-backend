const mongoose = require("mongoose");

const businessHoursSchema = new mongoose.Schema({
  monday: String,
  tuesday: String,
  wednesday: String,
  thursday: String,
  friday: String,
  saturday: String,
  sunday: String,
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
});

const BusinessHours = mongoose.model("BusinessHours", businessHoursSchema);
module.exports = BusinessHours;
