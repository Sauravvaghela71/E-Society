const express = require("express");
const router = express.Router();

const {
  createSecurity,
  getSecurityGuards,
  getSecurityById,
  updateSecurity,
  deleteSecurity,
  searchSecurity
} = require("../Controller/SecurityController");


/* ---------------- CREATE SECURITY GUARD ---------------- */

router.post("/", createSecurity);


/* ---------------- GET ALL SECURITY GUARDS ---------------- */

router.get("/", getSecurityGuards);


/* ---------------- SEARCH SECURITY GUARD ---------------- */

router.get("/search", searchSecurity);


/* ---------------- GET SINGLE SECURITY GUARD ---------------- */

router.get("/:id", getSecurityById);


/* ---------------- UPDATE SECURITY GUARD ---------------- */

router.put("/:id", updateSecurity);


/* ---------------- DELETE SECURITY GUARD ---------------- */

router.delete("/:id", deleteSecurity);


module.exports = router;