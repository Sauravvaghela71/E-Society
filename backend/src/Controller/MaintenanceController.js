const Maintenance = require("../Model/MaintenanceModel");
const MaintenanceSetting = require("../Model/MaintenanceSettingModel");
const Resident = require("../Model/ResidentModel");
const mailSend = require("../Util/MailSend");

// Helper: Auto-generate current month's regular maintenance bill on or after 19th
const autoGenerateMonthlyBillsIfNeeded = async () => {
    try {
        const today = new Date();
        if (today.getDate() < 19) return; // Only generate on or after 19th

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

        // Find active residents
        const residents = await Resident.find({ status: "Active" });
        if (!residents.length) return;

        let setting = await MaintenanceSetting.findOne();
        if (!setting) {
            setting = new MaintenanceSetting({ maintenanceAmount: 2000, penaltyAmount: 500 });
            await setting.save();
        }

        const currentMonthName = today.toLocaleString('default', { month: 'long' });
        const billName = `${currentMonthName} Monthly Maintenance`;

        // Check who already has this month's bill
        const existingBills = await Maintenance.find({
            billType: "Regular Maintenance",
            billName: billName
        });

        const billedResidentIds = new Set(existingBills.map(b => b.residentId.toString()));

        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

        const newBills = [];
        for (const resident of residents) {
            if (!billedResidentIds.has(resident._id.toString())) {
                newBills.push({
                    residentId: resident._id,
                    billName: billName,
                    billType: "Regular Maintenance",
                    amount: setting.maintenanceAmount,
                    dueDate: nextMonth,
                    status: "Pending",
                    details: `Water: ₹${Math.round(setting.maintenanceAmount * 0.3)}, Parking: ₹${Math.round(setting.maintenanceAmount * 0.2)}, Maintenance: ₹${Math.round(setting.maintenanceAmount * 0.5)}`
                });
            }
        }

        if (newBills.length > 0) {
            await Maintenance.insertMany(newBills);
        }
    } catch (err) {
        console.error("Auto-generation error:", err);
    }
};

// 0. Settings Handlers
exports.getSettings = async (req, res) => {
    try {
        let setting = await MaintenanceSetting.findOne();
        if(!setting) {
            setting = new MaintenanceSetting({ maintenanceAmount: 2000, penaltyAmount: 500 });
            await setting.save();
        }
        res.status(200).json({ success: true, data: setting });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        let setting = await MaintenanceSetting.findOne();
        if(!setting) setting = new MaintenanceSetting(req.body);
        else {
            setting.maintenanceAmount = req.body.maintenanceAmount;
            setting.penaltyAmount = req.body.penaltyAmount;
        }
        await setting.save();
        res.status(200).json({ success: true, data: setting });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};

// 1. Create a Maintenance Bill (Admin)
exports.createBill = async (req, res) => {
    try {
        const bill = new Maintenance(req.body);
        await bill.save();
        res.status(201).json({ success: true, data: bill });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 2. Get All Maintenance Bills (Admin view)
exports.getAllBills = async (req, res) => {
    try {
        await autoGenerateMonthlyBillsIfNeeded();
        const bills = await Maintenance.find().populate('residentId', 'firstName lastName mobileNumber wing flatNumber profileid').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: bills.length, data: bills });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Get Maintenance Bills purely for one specific Resident profile ID
exports.getResidentBills = async (req, res) => {
    try {
        await autoGenerateMonthlyBillsIfNeeded();
        // req.params.residentId refers to the Resident Object ID
        const bills = await Maintenance.find({ residentId: req.params.residentId }).populate('residentId', 'firstName lastName mobileNumber wing flatNumber profileid').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: bills });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Pay Bill Action (User Side / Offline Admin)
exports.payBillOnline = async (req, res) => {
    try {
        const { paymentMethod } = req.body; 
        
        const bill = await Maintenance.findByIdAndUpdate(req.params.id, {
            status: "Paid",
            paymentMethod: paymentMethod || "Online",
            paidAt: new Date()
        }, { new: true }).populate("residentId", "firstName lastName email wing flatNumber");
        
        if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });

        // Send Email
        if (bill.residentId && bill.residentId.email) {
            const htmlMessage = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #4CAF50; text-align: center;">Maintenance Payment Receipt</h2>
                    <p>Dear <strong>${bill.residentId.firstName} ${bill.residentId.lastName}</strong>,</p>
                    <p>Your maintenance bill has been successfully paid. Below are the details:</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Wing/Flat</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">Wing ${bill.residentId.wing} - ${bill.residentId.flatNumber}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Bill Name</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${bill.billName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Amount Paid</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">₹${bill.amount}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Payment Method</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${bill.paymentMethod}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Date Paid</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${new Date(bill.paidAt).toLocaleDateString()}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;">You can save or print this email as your official invoice.</p>
                    <p>Thank you!</p>
                </div>
            `;
            try {
                await mailSend(bill.residentId.email, "Maintenance Payment Receipt", htmlMessage);
            } catch (mailErr) {
                console.error("Error sending maintenance email", mailErr);
            }
        }

        res.status(200).json({ success: true, message: "Payment Successful!", data: bill });
        
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
