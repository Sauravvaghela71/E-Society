const Maintenance = require("../Model/MaintenanceModel");
const MaintenanceSetting = require("../Model/MaintenanceSettingModel");
const Resident = require("../Model/ResidentModel");

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

// 4. Pay Bill Action (User Side)
exports.payBillOnline = async (req, res) => {
    try {
        const { paymentMethod } = req.body; // should be 'Online' usually
        
        const bill = await Maintenance.findByIdAndUpdate(req.params.id, {
            status: "Paid",
            paymentMethod: paymentMethod || "Online",
            paidAt: new Date()
        }, { new: true });
        
        if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });
        res.status(200).json({ success: true, message: "Payment Successful!", data: bill });
        
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
