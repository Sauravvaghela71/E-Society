const Security = require("../Model/SecurityModel");
const User = require("../Model/UserModel");
const bcrypt = require("bcryptjs");

/* ---------------- LOGIN SECURITY (NEW) ---------------- */
exports.loginSecurity = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // 1. Check mobile exists
    const guard = await Security.findOne({ mobile });
    if (!guard) {
      return res.status(404).json({ message: "Security guard not found" });
    }

    // 2. Compare Password
    const isMatch = await bcrypt.compare(password, guard.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials (Wrong Password)" });
    }

   
    const { password: _, ...guardData } = guard._doc;
    res.status(200).json({ message: "Login successful", guard: guardData });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- CREATE SECURITY ---------------- */
exports.createSecurity = async (req, res) => {
  try {
    const { mobile, password, ...rest } = req.body;

    // Check if email is provided (needed for login)
    if (!rest.email) {
      return res.status(400).json({ message: "Email is required to create a login account for the guard." });
    }

    // Check if mobile already exists in Security
    const existingGuard = await Security.findOne({ mobile });
    if (existingGuard) {
      return res.status(400).json({ message: "Security guard with this mobile number already exists" });
    }

    // Check if email already exists in User Account
    const existingUser = await User.findOne({ email: rest.email });
    if (existingUser) {
      return res.status(400).json({ message: "This email is already in use by another account." });
    }

    // Create new guard (password hashed by pre-save hook)
    const security = new Security({
      mobile,
      password,
      ...rest
    });

    // Hash password for User Table
    const hashedUserPassword = await bcrypt.hash(password, 10);

    // Create User account to allow login
    const user = new User({
      Name: `${rest.firstName || ''} ${rest.lastName || ''}`.trim(),
      email: rest.email,
      password: hashedUserPassword,
      role: "guard",
      profileid: security._id,
      status: "active"
    });

    // Save both simultaneously
    await Promise.all([security.save(), user.save()]);

    res.status(201).json(security);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET ALL SECURITY ---------------- */
exports.getSecurityGuards = async (req, res) => {
  try {
    const guards = await Security.find().select("-password"); //password hide
    res.json(guards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET SINGLE SECURITY ---------------- */
exports.getSecurityById = async (req, res) => {
  try {
    const guard = await Security.findById(req.params.id).select("-password");
    res.json(guard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- UPDATE SECURITY ---------------- */
exports.updateSecurity = async (req, res) => {
  try {
    const updates = req.body;

    //password update
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const guard = await Security.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select("-password");

    res.json(guard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- DELETE SECURITY ---------------- */
exports.deleteSecurity = async (req, res) => {
  try {
    await Security.findByIdAndDelete(req.params.id);
    res.json({ message: "Security Guard Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- SEARCH SECURITY ---------------- */
exports.searchSecurity = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const guards = await Security.find({
      $or: [
        { firstName: { $regex: keyword, $options: "i" } },
        { lastName: { $regex: keyword, $options: "i" } },
        { mobile: { $regex: keyword, $options: "i" } }
      ]
    }).select("-password");

    res.json(guards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};