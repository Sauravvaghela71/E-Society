const Flat = require("../Model/FlatModel");

exports.getAllFlats = async (req, res) => {
    try {
        const flats = await Flat.find().populate('residentId', 'firstName lastName mobileNumber');
        res.status(200).json({ success: true, count: flats.length, data: flats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateFlatStatus = async (req, res) => {
    try {
        const { status, residentId } = req.body;
        const flat = await Flat.findByIdAndUpdate(req.params.id, { status, residentId }, { new: true });
        if (!flat) return res.status(404).json({ success: false, message: "Flat not found" });
        res.status(200).json({ success: true, data: flat });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.seedMockFlats = async (req, res) => {
    try {
        const wings = ["A", "B", "C", "D", "E", "F"];
        const floors = 5;
        const flatsPerFloor = 4;
        const flatsToCreate = [];

        for (const wing of wings) {
            for (let floor = 1; floor <= floors; floor++) {
                for (let unit = 1; unit <= flatsPerFloor; unit++) {
                    flatsToCreate.push({
                        wing,
                        floor,
                        flatNumber: `${floor}0${unit}`,
                        status: "Vacant"
                    });
                }
            }
        }
        
        await Flat.insertMany(flatsToCreate, { ordered: false }).catch(e => {
            // ordered: false ignores duplicates
        });
        
        res.status(201).json({ success: true, message: "Mock flats seeded!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
