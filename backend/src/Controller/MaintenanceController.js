const Maintenance = require("../Model/MaintenanceModel");

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
        const bills = await Maintenance.find().populate('residentId', 'firstName lastName mobileNumber wing flatNumber profileid').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: bills.length, data: bills });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Get Maintenance Bills purely for one specific Resident profile ID
exports.getResidentBills = async (req, res) => {
    try {
        // req.params.residentId refers to the Resident Object ID
        const bills = await Maintenance.find({ residentId: req.params.residentId }).sort({ createdAt: -1 });
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
