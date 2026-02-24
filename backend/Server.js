const express = require("express")
const app = express()
app.get("/",(req,res)=>{
    res.send("server connected, hello")
})

app.listen(5100,()=>{
    console.log("server running.....");
    
})