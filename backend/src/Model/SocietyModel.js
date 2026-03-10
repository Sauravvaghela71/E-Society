import mongoose from "mongoose";

const societySchema = new mongoose.Schema({

societyName:{type:String,required:true},

societyCode:{type:String,required:true,unique:true},

address:{type:String,required:true},

city:{type:String,required:true},

state:{type:String,required:true},

pincode:{type:String,required:true},

totalBlocks:{type:Number},

totalFloors:{type:Number},

totalFlats:{type:Number},

contactPerson:{type:String},

mobile:{type:String},

email:{type:String},

createdDate:{type:Date,default:Date.now},

status:{type:String,default:"Active"}

});

export default mongoose.model("Society",societySchema);