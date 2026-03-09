const Resident = require("../Model/ResidentModel");

/* ---------------- CREATE RESIDENT ---------------- */

exports.createResident = async (req, res) => {
  try {

    const resident = new Resident(req.body);

    await resident.save();

    res.status(201).json({
      success: true,
      message: "Resident created successfully",
      data: resident
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Resident already exists with this email or flat"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ---------------- GET ALL RESIDENTS ---------------- */


exports.getResidents = async (req, res) => {
  try {

    const residents = await Resident.find();

    res.json(residents);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


/* ---------------- GET SINGLE RESIDENT ---------------- */

exports.getResidentById = async (req, res) => {
  try {

    const resident = await Resident.findById(req.params.id);

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found"
      });
    }

    res.status(200).json({
      success: true,
      data: resident
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ---------------- UPDATE RESIDENT ---------------- */

exports.updateResident = async (req, res) => {
  try {

    const resident = await Resident.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Resident updated successfully",
      data: resident
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ---------------- DELETE RESIDENT ---------------- */

exports.deleteResident = async (req, res) => {
  try {

    const resident = await Resident.findByIdAndDelete(req.params.id);

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Resident deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ---------------- SEARCH RESIDENT ---------------- */

exports.searchResidents = async (req, res) => {
  try {

    const keyword = req.query.keyword || "";

    const residents = await Resident.find({
      $or: [
        { firstName: { $regex: keyword, $options: "i" } },
        { lastName: { $regex: keyword, $options: "i" } },
        { mobileNumber: { $regex: keyword, $options: "i" } },
        { flatNumber: { $regex: keyword, $options: "i" } }
      ]
    });

    res.status(200).json({
      success: true,
      count: residents.length,
      data: residents
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};