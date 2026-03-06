const mongoose = require("mongoose")

const Database = async ()=>{
    try{
      const db =  await mongoose.connect("mongodb://localhost:27017/")
      .then(()=>{
        console.log("connection succesfully");
       })
    
    }catch(err){
        console.log("connection failed",err);
        
    }
}
module.exports = Database

