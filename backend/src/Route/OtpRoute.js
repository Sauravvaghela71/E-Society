const router = require("express").Router();
const otpController = require("../Controller/OtpController");

router.post("/send-otp", otpController.sendOtp);
router.post("/verify-otp", otpController.verifyOtp);

module.exports = router;
