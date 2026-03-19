const Complain = require("../Model/ComplainModel"); 
const uploadToCloudinary = require("../Util/CloudinaryUtil");

// 1. Create a new Complaint
exports.createComplain = async (req, res) => {
    try {
        let complainData = { ...req.body };
        
        if (req.file) {
            const uploadRes = await uploadToCloudinary(req.file.path);
            if (uploadRes && uploadRes.secure_url) {
                complainData.photo = uploadRes.secure_url;
            }
        }
        
        const newComplain = new Complain(complainData);
        const savedComplain = await newComplain.save();
        res.status(201).json(savedComplain);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2. Get all Complaints (with User details) - Admin View
exports.getAllComplains = async (req, res) => {
    try {
        const complains = await Complain.find().sort({ createdAt: -1 }).populate("userId", "name email"); 
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

// 4. Get complaints by userId - User Dashboard View
exports.getComplainsByUser = async (req, res) => {
    try {
        const complains = await Complain.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(complains);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Update Complaint + Admin Response
exports.updateComplain = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Auto timestamp: resolved
        if (updateData.status === "Resolved" || updateData.status === "Closed") {
            updateData.resolveAt = Date.now();
        }

        // Auto timestamp: admin responded
        if (updateData.adminResponse) {
            updateData.respondedAt = Date.now();
        }

        const updatedComplain = await Complain.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        res.status(200).json(updatedComplain);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 6. Delete a Complaint
exports.deleteComplain = async (req, res) => {
    try {
        await Complain.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Complaint deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};