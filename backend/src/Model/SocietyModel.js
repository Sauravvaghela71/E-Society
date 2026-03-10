const mongoose = require("mongoose");

const societySchema = new mongoose.Schema({

  societyName:{
    type:String,
    required:true
  },

  address:{
    type:String,
    required:true
  },

  city:{
    type:String,
    required:true
  },

  state:{
    type:String,
    required:true
  },

  pincode:{
    type:String,
    required:true
  },

  totalBlocks:{
    type:Number,
    required:true
  },

  totalFlats:{
    type:Number,
    required:true
  },

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports = mongoose.model("Society", societySchema);