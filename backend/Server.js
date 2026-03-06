const express = require("express")
const app = express()
const cors = require("cors")
const Database = require("./Database/DB")
const bodyParser = require("body-parser")

Database()

// Middlewares
app.use(cors())
app.use(bodyParser.json())

// Routes
const users = require("./src/Route/ResidentUserRoute")
app.use(users)

// GET API
app.get("/employee", (req, res) => {
    res.json([
        { id: 1001, name: "saurav" },
        { id: 1002, name: "rohit" },
        { id: 1003, name: "rahul" }
    ])
})

// POST API
app.post("/flat", (req, res) => {
    console.log(req.body)

    res.json({
        message: "successfully insert",
        data: req.body
    })
})

const PORT = 5100

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
})