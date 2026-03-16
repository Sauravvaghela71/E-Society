const mongoose = require('mongoose');


const visitorSchema = new mongoose.Schema({
    visitorName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    visitingResident: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Resident', 
        required: true 
    },
    blockWing: { type: String, required: true },
    flatNumber: { type: String, required: true },
    purpose: { type: String, required: true },
    entryTime: { type: Date, default: Date.now },
    exitTime: { type: Date },
    status: { type: String, enum: ['inside', 'Exited'], default: 'inside' }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);