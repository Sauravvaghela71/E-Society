const Facility = require("../models/Facility");

// 1. Add a new Facility
exports.createFacility = async (req, res) => {
    try {
        const facility = new Facility(req.body);
        await facility.save();
        res.status(201).json({ success: true, data: facility });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 2. Get all Facilities (can filter by status)
exports.getAllFacilities = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        
        const facilities = await Facility.find(filter);
        res.status(200).json({ success: true, count: facilities.length, data: facilities });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Get a single Facility by ID
exports.getFacilityById = async (req, res) => {
    try {
        const facility = await Facility.findById(req.params.id);
        if (!facility) return res.status(404).json({ message: "Facility not found" });
        res.status(200).json({ success: true, data: facility });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Update Facility Details
exports.updateFacility = async (req, res) => {
    try {
        const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!facility) return res.status(404).json({ message: "Facility not found" });
        res.status(200).json({ success: true, data: facility });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 5. Remove a Facility
exports.deleteFacility = async (req, res) => {
    try {
        const facility = await Facility.findByIdAndDelete(req.params.id);
        if (!facility) return res.status(404).json({ message: "Facility not found" });
        res.status(200).json({ success: true, message: "Facility removed from system" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};