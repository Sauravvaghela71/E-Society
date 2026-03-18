
const router = require("express").Router()
const userController = require("../Controller/UserController")
const upload = require("../Middleware/uploadMiddleware")

router.post("/signup", userController.registerUser)
router.post("/login", userController.loginUser)
router.get("/:id", userController.getUserById)

// Profile picture upload route
router.post("/:id/upload-photo", upload.single("profilePic"), userController.uploadProfilePic)

module.exports = router
