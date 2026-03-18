const mongoose = require("mongoose");

const maintenanceSettingSchema = new mongoose.Schema({
    maintenanceAmount: {
        type: Number,
        required: true,
        default: 0
    },
    penaltyAmount: {
        type: Number,
        required: true,
        default: 0
    },
    dueDateDays: {
        type: Number,
        default: 15
    }
}, { timestamps: true });

module.exports = mongoose.model("MaintenanceSetting", maintenanceSettingSchema);
