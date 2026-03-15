const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    Name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        default: "user",
        enum: ["resident", "admin", "security"]
    },
   
    profileModel: {
        type: String,
        required: true,
        enum: ['categories', 'resident', 'security'] 
    },
   
    profileid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'profileModel' 
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive", "deleted", "blocked"]
    }
})

module.exports = mongoose.model("User", userSchema)