const Security = require("../Model/SecurityModel");

const createSecurity = async (req, res) => {
  try {
    const guard = new Security(req.body);
    const savedGuard = await guard.save();
    res.status(201).json(savedGuard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSecurity = async (req, res) => {
  try {
    const guards = await Security.find();
    res.json(guards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSecurity,
  getSecurity
};  
