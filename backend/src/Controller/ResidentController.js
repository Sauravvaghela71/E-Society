const Resident = require("../Model/ResidentModel");

/* ---------------- CREATE RESIDENT ---------------- */
exports.createResident = async (req, res) => {
  try {
    const resident = new Resident(req.body);
    await resident.save();
    res.status(201).json(resident);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Resident already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET ALL RESIDENTS ---------------- */
exports.getResidents = async (req, res) => {
  try {
    const residents = await Resident.find();
    res.status(200).json(residents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET SINGLE RESIDENT (આ ફંક્શન ખૂટતું હતું) ---------------- */
exports.getResidentById = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id);
    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }
    res.status(200).json(resident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- UPDATE RESIDENT ---------------- */

exports.updateResident = async (req, res) => {
  try {
    const resident = await Resident.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } 
    );

    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }

    
    res.status(200).json(resident); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- DELETE RESIDENT ---------------- */
exports.deleteResident = async (req, res) => {
  try {
    const resident = await Resident.findByIdAndDelete(req.params.id);
    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }
    res.status(200).json({ message: "Resident deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(200).json(residents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};