const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
    residentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resident",
        required: true
    },
    billName: {
        type: String,
        required: true
    },
    billType: {
        type: String,
        enum: ["Regular Maintenance", "Penalty", "Event", "Other"],
        default: "Regular Maintenance"
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending"
    },
    paymentMethod: {
        type: String,
        enum: ["Online", "Cash", "Cheque", null],
        default: null
    },
    paidAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model("Maintenance", maintenanceSchema);
