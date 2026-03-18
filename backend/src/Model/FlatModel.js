const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema({
    wing: { type: String, required: true },
    flatNumber: { type: String, required: true },
    floor: { type: Number, required: true },
    status: { type: String, enum: ["Vacant", "Occupied", "Maintenance"], default: "Vacant" },
    residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', default: null }
}, { timestamps: true });

// Prevent duplicate flats in the same wing
flatSchema.index({ wing: 1, flatNumber: 1 }, { unique: true });

module.exports = mongoose.model("Flat", flatSchema);
