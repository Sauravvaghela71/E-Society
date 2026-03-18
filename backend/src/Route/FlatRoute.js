const express = require("express");
const router = express.Router();
const flatController = require("../Controller/FlatController");

// Mount flat controllers
router.get("/seed", flatController.seedMockFlats); // GET /api/flats/seed creates mock flats
router.get("/", flatController.getAllFlats);       // GET /api/flats fetches all flats
router.put("/:id", flatController.updateFlatStatus); // PUT /api/flats/123... updates status

module.exports = router;
