const express = require("express");

const {
  createSecurity,
  getSecurity
} = require("../Controller/SecurityController");

const router = express.Router();

router.post("/add-security", createSecurity);

router.get("/get-security", getSecurity);

module.exports = router;