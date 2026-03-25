const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema({
    wing:            { type: String, required: true },
    flatNumber:      { type: String, required: true },
    floor:           { type: Number, required: true },
    status:          { type: String, enum: ["Vacant", "Occupied", "Maintenance"], default: "Vacant" },
    residentId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', default: null },

    // ── New Flat Detail Fields ──────────────────────────────────────────────────
    bhkType:         { type: String,  enum: ["1 BHK","2 BHK","3 BHK","4 BHK","5 BHK"], default: null },
    rent:            { type: Number,  default: null },      // Monthly rent in ₹
    yearBuilt:       { type: Number,  default: null },      // e.g. 2015 → age = current year - yearBuilt
    maintenanceCost: { type: Number,  default: null },      // Monthly maintenance in ₹
    tax:             { type: Number,  default: null },      // Annual property tax in ₹
    propertyValue:   { type: Number,  default: null },      // Flat market value in ₹
    area:            { type: String,  default: null },      // e.g. "1200 Sq.Ft"

}, { timestamps: true });

// Prevent duplicate flats in the same wing
flatSchema.index({ wing: 1, flatNumber: 1 }, { unique: true });

module.exports = mongoose.model("Flat", flatSchema);
