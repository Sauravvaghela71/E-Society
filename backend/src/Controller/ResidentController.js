const Resident = require("../Model/ResidentModel");
const bcrypt = require("bcrypt");
const uploadToCloudinary = require("../Util/CloudinaryUtil")
const mailSend = require("../Util/MailSend");
const User = require('../Model/UserModel')
/* ---------------- CREATE RESIDENT (With Hashing & Email) ---------------- */

exports.createResident = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // 1. Validation: Check if image was uploaded
    // This prevents the "Cannot read properties of undefined (reading 'path')" 500 error
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an ID proof photo" });
    }

    // 2. Security: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Image Upload: Send to Cloudinary
    // Assuming uploadToCloudinary is your helper function
    const cloudinaryResponse = await uploadToCloudinary(req.file.path);

    // 4. Create Resident Record
    // We create the instance first to generate the _id
    const resident = new Resident({
      ...req.body,
      password: hashedPassword,
      idProofImagePath: cloudinaryResponse.secure_url
    });

    // 5. Create User Record (Auth Table)
    // Linked via profileid and the 'role' field (refPath)
    const user = new User({
      Name: `${firstName} ${lastName || ""}`.trim(), 
      email: email,
      password: hashedPassword,
      role: "resident", // This matches your refPath logic
      profileid: resident._id, 
      status: "active"
    });

    // 6. Save Both Documents
    // Using Promise.all so both must succeed together
    await Promise.all([user.save(), resident.save()]);

    // 7. Communication: Send Welcome Email
    // We send the plain 'password' so the user knows what they chose
    try {
      await mailSend(
        email,
        "Welcome to Society Management",
        `Hello ${firstName}, your account has been created successfully. 
         Email: ${email}
         Password: ${password}`
      );
    } catch (mailError) {
      console.error("Email failed, but user was created:", mailError);
    }

    // 8. Success Response
    res.status(201).json({
      message: "Resident and Auth account created successfully",
      data: resident
    });

  } catch (error) {
    console.error("Internal Server Error:", error);

    // Handle Duplicate Email Error (MongoDB Code 11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: "This email is already registered." });
    }

    res.status(500).json({ message: "Internal Server Error: " + error.message });
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