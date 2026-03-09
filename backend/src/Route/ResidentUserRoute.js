const Router = require("express").Router()

const user = require("../Controller/ResidentController")

Router.get("/user",user.Resident)

module.exports = Router
