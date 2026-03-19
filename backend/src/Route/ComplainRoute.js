const express = require("express");
const router = express.Router();
const complainController = require("../Controller/ComplainController");
const upload = require("../Middleware/uploadMiddleware");

// Route for creating and getting all
router.route("/")
    .post(upload.single("photo"), complainController.createComplain)
    .get(complainController.getAllComplains);

// Route for complaints by a specific userId
router.get("/user/:userId", complainController.getComplainsByUser);

// Route for specific ID operations
router.route("/:id")
    .get(complainController.getComplainById)
    .put(complainController.updateComplain)
    .delete(complainController.deleteComplain);

module.exports = router;