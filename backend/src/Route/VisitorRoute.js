const express = require("express");
const router = express.Router();
const visitorController = require("../Controller/VisitorController");

// Basic CRUD
router.route("/")
    .post(visitorController.checkInVisitor)
    .get(visitorController.getAllVisitors);

// Checkout specific visitor
router.put("/checkout/:id", visitorController.checkOutVisitor);

// Get visitors array for a specific resident
router.get("/resident/:residentId", visitorController.getResidentVisitors);

// Accept specific visitor via email link
router.get("/accept/:id", visitorController.acceptVisitor);

// General update and delete
router.route("/:id")
    .put(visitorController.updateVisitorDetails)
    .delete(visitorController.deleteVisitorLog);

module.exports = router;