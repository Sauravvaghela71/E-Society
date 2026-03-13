const mongoose = require("mongoose");

const complainSchema = new mongoose.Schema(
    {
        residentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resident",
            required: true
        },
        complainantName: {
            type: String,
            required: true,     
        },
        description: {
            type: String,
            required: true  
        },
        category: { 
            type: String,
            enum: ["Maintenance", "Security", "Noise", "Other"],
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Resolved"],
            default: "Pending"
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },
        resolveAt:{
            type: Date  
        }
    }
)

module.exports = mongoose.model("Complain",complainSchema)