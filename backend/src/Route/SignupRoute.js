
const router = require("express").Router()
const userController = require("../Controller/SignupController")
router.post("/signup",userController.registerUser)
router.post("/login",userController.loginUser)
module.exports = router
