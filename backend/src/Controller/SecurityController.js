const Security = require("../Model/SecurityModel");


/* ---------------- CREATE SECURITY ---------------- */

exports.createSecurity = async (req, res) => {

  try {

    const security = new Security(req.body);

    const savedSecurity = await security.save();

    res.status(201).json(savedSecurity);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* ---------------- GET ALL SECURITY ---------------- */

exports.getSecurityGuards = async (req, res) => {

  try {

    const guards = await Security.find();

    res.json(guards);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* ---------------- GET SINGLE SECURITY ---------------- */

exports.getSecurityById = async (req, res) => {

  try {

    const guard = await Security.findById(req.params.id);

    res.json(guard);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* ---------------- UPDATE SECURITY ---------------- */

exports.updateSecurity = async (req, res) => {

  try {

    const guard = await Security.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

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
        { guardId: { $regex: keyword, $options: "i" } },
        { mobile: { $regex: keyword, $options: "i" } }
      ]
    });

    res.json(guards);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};