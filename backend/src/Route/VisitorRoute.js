const express = require("express");
const router = express.Router();
const visitorController = require("../Controller/VisitorController");

// Basic CRUD
router.route("/")
    .post(visitorController.checkInVisitor)
    .get(visitorController.getAllVisitors);

// Checkout specific visitor
router.put("/checkout/:id", visitorController.checkOutVisitor);

// General update and delete
router.route("/:id")
    .put(visitorController.updateVisitorDetails)
    .delete(visitorController.deleteVisitorLog);

module.exports = router;