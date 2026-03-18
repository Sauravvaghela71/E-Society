// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   flat: { type: String, required: true },
//   memberSince: { type: String, default: "January 2024" },
//   role: { type: String, default: "Resident" },
//   avatar: { type: String, default: "https://api.dicebear.com/7.x/avataaars/svg?seed=Default" }
// }, { timestamps: true }); 

// module.exports = mongoose.model('User', userSchema);


const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    Name: { type: String, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        default: "user",
        enum: ["resident", "admin", "security"]
    },
   
    // profileModel: {
    //     type: String,
    //     required: true,
    //     enum: ['categories', 'resident', 'security'] 
    // },
   
    profileid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'role' 
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive", "deleted", "blocked"]
    },
    profilePic: {
        type: String,
        default: ""
    }
}, { timestamps: true })

module.exports = mongoose.model("users", userSchema)