
const router = require("express").Router()
// const express = require("express");

const userController = require("../Controller/UserController")
router.post("/signup",userController.registerUser)
router.post("/login",userController.loginUser)

router.get("/:id",userController.getUserById)

module.exports = router
