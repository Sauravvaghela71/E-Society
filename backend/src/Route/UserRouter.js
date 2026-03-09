const express = require("express");
const router = express.Router();

const userController = require("../Controller/UserController");

router.post("/create", userController.createUser);
router.get("/users", userController.getUsers);
router.delete("/delete/:id",userController.deleteUser)
module.exports = router;