const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema(

{
  /* ---------------- Personal Information ---------------- */

  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true
  },

  lastName: {
    type: String,
    trim: true
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },

  dateOfBirth: {
    type: Date
  },


  /* ---------------- Contact Information ---------------- */

  mobileNumber: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, "Enter valid 10 digit mobile number"]
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    sparse: true
  },


  /* ---------------- Flat Details ---------------- */

  wing: {
    type: String,
    required: true,
    trim: true
  },

  flatNumber: {
    type: String,
    required: true,
    trim: true
  },

  floorNumber: {
    type: Number
  },


  /* ---------------- Resident Details ---------------- */

  residentType: {
    type: String,
    enum: ["Owner", "Tenant", "Family"],
    required: true
  },

  moveInDate: {
    type: Date,
    default: Date.now
  },

  moveOutDate: {
    type: Date
  },


  /* ---------------- Identity Details ---------------- */

  idProofType: {
    type: String,
    enum: ["Aadhaar", "PAN", "Driving License", "Passport"]
  },

  idProofNumber: {
    type: String,
    trim: true
  },


  /* ---------------- Vehicle Details ---------------- */

  vehicleNumber: {
    type: String,
    uppercase: true,
    trim: true
  },


  /* ---------------- Emergency Contact ---------------- */

  emergencyContactName: {
    type: String,
    trim: true
  },

  emergencyContactNumber: {
    type: String,
    match: [/^[0-9]{10}$/, "Enter valid 10 digit mobile number"]
  },


  /* ---------------- Resident Status ---------------- */

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  }

},

{
  timestamps: true
}
);


/* Prevent duplicate resident in same flat */

residentSchema.index({ wing: 1, flatNumber: 1, mobileNumber: 1 });


module.exports = mongoose.model("Resident", residentSchema);