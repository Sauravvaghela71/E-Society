const express = require("express")
const app = express()
// app.get("/",(req,res)=>{
//     res.send("server connected, hello")
// })

const users = require("./src/Route/ResidentUserRoute")
app.use(users)

const PORT = 5100
app.listen(PORT,()=>{

    console.log(`server running on ${PORT}`);
    
})