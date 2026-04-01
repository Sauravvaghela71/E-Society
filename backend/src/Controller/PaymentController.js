const Razorpay    = require("razorpay");
const crypto      = require("crypto");
const Maintenance = require("../Model/MaintenanceModel");
const mailSend    = require("../Util/MailSend");

const razorpay = new Razorpay({
    key_id    : process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
// Body: { billId, amount }  (amount in INR — we convert to paise)
exports.createOrder = async (req, res) => {
    try {
        const { billId, amount } = req.body;

        if (!billId || !amount) {
            return res.status(400).json({ success: false, message: "billId and amount are required." });
        }

        const bill = await Maintenance.findById(billId);
        if (!bill) return res.status(404).json({ success: false, message: "Bill not found." });
        if (bill.status === "Paid") return res.status(400).json({ success: false, message: "Bill is already paid." });

        const options = {
            amount  : Math.round(amount * 100), // paise
            currency: "INR",
            receipt : `receipt_${billId}`,
            notes   : { billId },
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Razorpay createOrder error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/payment/verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, billId, paymentMethod }
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            billId,
            paymentMethod,
        } = req.body;

        // Verify HMAC-SHA256 signature
        const body      = razorpay_order_id + "|" + razorpay_payment_id;
        const expected  = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expected !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed: invalid signature." });
        }

        // Mark bill as paid
        const bill = await Maintenance.findByIdAndUpdate(
            billId,
            {
                status       : "Paid",
                paymentMethod: paymentMethod || "Razorpay",
                paidAt       : new Date(),
                razorpayOrderId  : razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
            },
            { new: true }
        ).populate("residentId", "firstName lastName email wing flatNumber");

        if (!bill) return res.status(404).json({ success: false, message: "Bill not found." });

        // Send receipt email
        if (bill.residentId && bill.residentId.email) {
            const htmlMessage = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #4CAF50; text-align: center;">Maintenance Payment Receipt</h2>
                    <p>Dear <strong>${bill.residentId.firstName} ${bill.residentId.lastName}</strong>,</p>
                    <p>Your maintenance bill has been successfully paid via Razorpay. Below are the details:</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr><td style="padding:10px;border:1px solid #ddd;"><strong>Wing/Flat</strong></td>
                            <td style="padding:10px;border:1px solid #ddd;">Wing ${bill.residentId.wing} - ${bill.residentId.flatNumber}</td></tr>
                        <tr><td style="padding:10px;border:1px solid #ddd;"><strong>Bill Name</strong></td>
                            <td style="padding:10px;border:1px solid #ddd;">${bill.billName}</td></tr>
                        <tr><td style="padding:10px;border:1px solid #ddd;"><strong>Amount Paid</strong></td>
                            <td style="padding:10px;border:1px solid #ddd;">₹${bill.amount}</td></tr>
                        <tr><td style="padding:10px;border:1px solid #ddd;"><strong>Payment ID</strong></td>
                            <td style="padding:10px;border:1px solid #ddd;">${razorpay_payment_id}</td></tr>
                        <tr><td style="padding:10px;border:1px solid #ddd;"><strong>Date Paid</strong></td>
                            <td style="padding:10px;border:1px solid #ddd;">${new Date(bill.paidAt).toLocaleDateString()}</td></tr>
                    </table>
                    <p style="margin-top: 20px;">Thank you!</p>
                </div>
            `;
            try {
                await mailSend(bill.residentId.email, "Maintenance Payment Receipt", htmlMessage);
            } catch (mailErr) {
                console.error("Error sending receipt email:", mailErr);
            }
        }

        res.status(200).json({ success: true, message: "Payment verified successfully!", data: bill });
    } catch (error) {
        console.error("Razorpay verifyPayment error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
