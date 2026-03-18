const mongoose = require("mongoose");

const complainSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        name: {
            type: String,
            required: true,     
        },
        mobile: {
            type: String,
        },
        wing: {
            type: String,
        },
        flat: {
            type: String,
        },
        description: {
            type: String,
            required: true  
        },
        category: { 
            type: String,
            required: true
        },
        location: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Resolved", "Closed"],
            default: "Pending"
        },
        priority: {
            type: String,
            default: "Medium"
        },
        resolveAt:{
            type: Date  
        },
        adminResponse: {
            type: String,
            default: ""
        },
        respondedAt: {
            type: Date
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Complain",complainSchema)