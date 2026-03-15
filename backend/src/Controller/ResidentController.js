const Resident = require("../Model/ResidentModel");
const bcrypt = require("bcrypt");
const mailSend = require("../Util/MailSend");

/* ---------------- CREATE RESIDENT (With Hashing & Email) ---------------- */
exports.createResident = async (req, res) => {
  try {
    const { email, password, firstName } = req.body;

    // 1. Password hashing (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Save resident with hashed password
    const resident = new Resident({
      ...req.body,
      password: hashedPassword
    });

    await resident.save();

    // 3. Send Welcome Email
    mailSend(
      email,
      "Welcome to Society Management",
      `Hello ${firstName}, your account has been created successfully. You can now login with your email: ${email} and password: ${password}`
    );

    res.status(201).json({
      message: "Resident created successfully",
      data: resident
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Resident already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- UPDATE RESIDENT (With Password Support) ---------------- */
exports.updateResident = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // Agar update request mein naya password aa raha hai, toh use hash karein
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const resident = await Resident.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }

    res.status(200).json({
      message: "Resident updated successfully",
      data: resident
    });
  } catch (error) {
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

/* ---------------- GET SINGLE RESIDENT ---------------- */
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