
const router = require("express").Router()
const userController = require("../Controller/LoginController")
router.post("/signup",userController.registerUser)
router.post("/login",userController.loginUser)
module.exports = router
