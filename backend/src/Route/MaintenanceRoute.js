const express = require("express");
const router = express.Router();
const maintenanceController = require("../Controller/MaintenanceController");

// App setting logic
router.get("/settings", maintenanceController.getSettings);
router.put("/settings", maintenanceController.updateSettings);

router.post("/", maintenanceController.createBill);           // Admin create bill
router.get("/", maintenanceController.getAllBills);           // Admin fetch all
router.get("/user/:residentId", maintenanceController.getResidentBills);  // User fetch specific history
router.put("/:id/pay", maintenanceController.payBillOnline);  // User executes online payment

module.exports = router;
