const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    resident: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    facility: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Facility', 
        required: true 
    },
    bookingDate: { 
        type: Date, 
        required: true 
    },
    timeSlot: { 
        type: String, // e.g., "10:00 AM - 12:00 PM"
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Cancelled'], 
        default: 'Confirmed' 
    },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Completed', 'Failed'], 
        default: 'Completed' // auto-completed for now
    },
    adminResponse: {
        type: String,
        default: ''
    },
    amountPaid: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Prevent double booking on same date and same timeslot for the exact facility
bookingSchema.index({ facility: 1, bookingDate: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
