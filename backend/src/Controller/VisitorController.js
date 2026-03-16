const Visitor = require("../models/Visitor");

// 1. Check-In: Add a new visitor
exports.checkInVisitor = async (req, res) => {
    try {
        const visitor = new Visitor(req.body);
        await visitor.save();
        res.status(201).json({ success: true, data: visitor });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 2. Check-Out: Mark visitor as 'Exited' and set exitTime
exports.checkOutVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.findByIdAndUpdate(
            req.params.id,
            { 
                status: 'Exited', 
                exitTime: Date.now() 
            },
            { new: true }
        );
        
        if (!visitor) return res.status(404).json({ message: "Visitor log not found" });
        res.status(200).json({ success: true, data: visitor });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 3. Get all Visitors (with optional status filter)
exports.getAllVisitors = async (req, res) => {
    try {
        const { status } = req.query; // 'inside' or 'Exited'
        const filter = status ? { status } : {};
        
        const visitors = await Visitor.find(filter)
            .populate("visitingResident", "name email unitNumber") // Fetch resident info
            .sort({ entryTime: -1 });

        res.status(200).json({ success: true, count: visitors.length, data: visitors });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Update Visitor details (e.g., fixing a typo in name/number)
exports.updateVisitorDetails = async (req, res) => {
    try {
        const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!visitor) return res.status(404).json({ message: "Visitor not found" });
        res.status(200).json({ success: true, data: visitor });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 5. Delete a log entry
exports.deleteVisitorLog = async (req, res) => {
    try {
        await Visitor.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Visitor log removed" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};