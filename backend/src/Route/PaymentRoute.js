const express    = require("express");
const router     = express.Router();
const payment    = require("../Controller/PaymentController");

router.post("/create-order", payment.createOrder);   // Step 1: create Razorpay order
router.post("/verify",       payment.verifyPayment); // Step 2: verify after checkout

module.exports = router;
