const express = require("express");
const router = express.Router();
const facilityController = require("../controllers/facilityController");

// Basic CRUD routes
router.route("/")
    .post(facilityController.createFacility)
    .get(facilityController.getAllFacilities);

router.route("/:id")
    .get(facilityController.getFacilityById)
    .put(facilityController.updateFacility)
    .delete(facilityController.deleteFacility);

module.exports = router;