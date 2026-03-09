const express = require("express")
const app = express()
const cors = require("cors")
const Database = require("./Database/DB")

const bodyParser = require("body-parser")
// const Signup = require('./src/Model/Signup');
const user = require('./src/Route/UserRouter')

Database()

// Middlewares
app.use(cors())
app.use(bodyParser.json())

// Routes
// const users = require("./src/Route/ResidentUserRoute")
// app.use(users)




// GET API
// app.get("/login", (req, res) => {
//    res.send("loginapi")
// })
app.use("/api",user);
// POST API
// app.post("/register",async(req, res) => {
//     console.log(req.body)

//      const user = new User({
//             name: req.body.name,
//             email: req.body.email,
//             password: req.body.password
//         })
//      const result = await user.save()

//     res.json({
//         message: "successfully insert",
//         data: req.body
//     })
// })



const PORT = 5100

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
})