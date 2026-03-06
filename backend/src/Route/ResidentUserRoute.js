const Router = require("express").Router()

const user = require("../Controller/ResidentUser")

Router.get("/user",user.Resident)

module.exports = Router
