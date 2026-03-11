const express = require("express")
const router = express.Router();

const {
  createResident,
  getResidents,
  getResidentById,
  updateResident,
  deleteResident,
  searchResidents
} = require("../Controller/ResidentController");


/* ---------------- CREATE RESIDENT ---------------- */
router.post("/", createResident);


/* ---------------- GET ALL RESIDENTS ---------------- */
router.get("/", getResidents);


/* ---------------- SEARCH RESIDENT ---------------- */

router.get("/search", searchResidents);


/* ---------------- GET SINGLE RESIDENT ---------------- */
router.get("/:id", getResidentById);


/* ---------------- UPDATE RESIDENT ---------------- */
router.put("/:id", updateResident);


/* ---------------- DELETE RESIDENT ---------------- */
router.delete("/:id", deleteResident);


module.exports = router;