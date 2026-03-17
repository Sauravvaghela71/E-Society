const express = require("express");
const router = express.Router();
const complainController = require("../Controller/ComplainController");

// Route for creating and getting all
router.route("/")
    .post(complainController.createComplain)
    .get(complainController.getAllComplains);

// Route for specific ID operations
router.route("/:id")
    .get(complainController.getComplainById)
    .put(complainController.updateComplain)
    .delete(complainController.deleteComplain);

module.exports = router;