const Security = require("../Model/SecurityModel");
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

    // Check if mobile already exists
    const existingGuard = await Security.findOne({ mobile });
    if (existingGuard) {
      return res.status(400).json({ message: "Security guard with this mobile number already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new guard
    const security = new Security({
      mobile,
      password: hashedPassword,
      ...rest
    });

    const savedSecurity = await security.save();
    res.status(201).json(savedSecurity);
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