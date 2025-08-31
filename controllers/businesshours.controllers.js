const BusinessHours = require("../models/Businesshours");

async function addtime(req, res) {
  try {
    const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
      req.body;

    const newTime = new BusinessHours({
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      adminId: req.admin._id,
    });

    await newTime.save();

    return res
      .status(201)
      .json({ message: "Time added successfully", data: newTime });
  } catch (error) {
    console.error("Error in addtime:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updatetime(req, res) {
  try {
    const { id } = req.params;
    const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
      req.body;

    const businessHours = await BusinessHours.findById(id);

    if (!businessHours) {
      return res.status(404).json({ message: "Business hours not found" });
    }

    if (monday) businessHours.monday = monday;
    if (tuesday) businessHours.tuesday = tuesday;
    if (wednesday) businessHours.wednesday = wednesday;
    if (thursday) businessHours.thursday = thursday;
    if (friday) businessHours.friday = friday;
    if (saturday) businessHours.saturday = saturday;
    if (sunday) businessHours.sunday = sunday;

    await businessHours.save();

    return res.status(200).json({
      message: "Time updated successfully",
      data: businessHours,
    });
  } catch (error) {
    console.error("Error in updatetime:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function gettime(req, res) {
  try {
    const { adminId } = req.query;

    let times;
    if (adminId) {
      times = await BusinessHours.find({ adminId });
    } else {
      times = await BusinessHours.find();
    }

    return res
      .status(200)
      .json({ message: "Fetched successfully", data: times });
  } catch (error) {
    console.error("Error in gettime:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deletetime(req, res) {
  try {
    const { id } = req.params;
    const deleted = await BusinessHours.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Business hours not found" });
    }

    return res.status(200).json({ message: "Time deleted successfully" });
  } catch (error) {
    console.error("Error in deletetime:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { addtime, deletetime, gettime, updatetime };
