const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    location: { type: String,
         required: true },
    openingTime: { type: String, required: true }, // e.g., "09:00 AM"
    closingTime: { type: String, required: true }, // e.g., "09:00 PM"
    price: { type: Number, required: true, default: 0 },
    status: { 
        type: String, 
        enum: ['Available', 'Maintenance', 'closed'], 
        default: 'Available' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Facility', facilitySchema);