const Otp = require("../Model/OtpModel");
const mailSend = require("../Util/MailSend");

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to DB (overwrite if already exists for this email)
    await Otp.deleteMany({ email });
    const otpDoc = new Otp({ email, otp });
    await otpDoc.save();
    
    // Send Email
    const subject = "Your OTP Verification Code";
    const message = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #1e3a8a;">OTP Verification</h2>
          <p>Hello,</p>
          <p>Your OTP for verification is:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; color: #1e3a8a;">
            ${otp}
          </div>
          <p style="color: #dc2626; font-size: 14px;"><strong>Note:</strong> This OTP is valid for <strong>1 minute and 30 seconds</strong> only.</p>
          <p>If you did not request this OTP, please ignore this email.</p>
          <p>Best Regards,<br/>Society Administration</p>
      </div>
    `;
    await mailSend(email, subject, message);
    
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    
    // OTP verified, we can now delete it to prevent reuse
    await Otp.deleteOne({ _id: otpRecord._id });
    
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};

module.exports = { sendOtp, verifyOtp };
