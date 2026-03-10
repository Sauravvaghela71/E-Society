// import mongoose from "mongoose";
const mongoose = require("mongoose");
const securitySchema = new mongoose.Schema({

  firstName: String,
  lastName: String,

  mobile: String,
  altMobile: String,
  email: String,

  address: String,
  city: String,
  state: String,
  pincode: String,

  guardId: String,
  shift: String,
  joiningDate: Date,

  idType: String,
  idNumber: String,

  emergencyName: String,
  emergencyMobile: String,

  status: String

});

module.exports = mongoose.model("Security", securitySchema);