const User = require("../Model/UserModel");

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      message: "User Created",
      data: user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};