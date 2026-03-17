const Complain = require("../Model/ComplainModel"); 

// 1. Create a new Complaint
exports.createComplain = async (req, res) => {
    try {
        const newComplain = new Complain(req.body);
        const savedComplain = await newComplain.save();
        res.status(201).json(savedComplain);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2. Get all Complaints (with Resident details)
exports.getAllComplains = async (req, res) => {
    try {
        const complains = await Complain.find().populate("residentId", "name email"); 
        res.status(200).json(complains);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get a single Complaint by ID
exports.getComplainById = async (req, res) => {
    try {
        const complain = await Complain.findById(req.params.id);
        if (!complain) return res.status(404).json({ message: "Complaint not found" });
        res.status(200).json(complain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Update Complaint (Status, Priority, etc.)
exports.updateComplain = async (req, res) => {
    try {
        // If status is being updated to 'Resolved', set resolveAt date automatically
        if (req.body.status === "Resolved") {
            req.body.resolveAt = Date.now();
        }

        const updatedComplain = await Complain.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json(updatedComplain);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 5. Delete a Complaint
exports.deleteComplain = async (req, res) => {
    try {
        await Complain.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Complaint deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};