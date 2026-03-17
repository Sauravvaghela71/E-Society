const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Password encrypt karne ke liye

const securitySchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  mobile: { type: String, required: true, unique: true },
  altMobile: String,
  email: { type: String, unique: true },
  address: String,
  city: String,
  state: String,
  pincode: String,
  shift: String,
  joiningDate: { type: Date, default: Date.now },
  idType: String,
  idNumber: String,
  emergencyName: String,
  emergencyMobile: String,
  status: { type: String, default: "active" },

  // Password Field added
  password: { 
    type: String, 
    required: true,
    minlength: 6 
  }
});

// Password ko save karne se pehle hash (encrypt) karne ka function
securitySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Security", securitySchema);