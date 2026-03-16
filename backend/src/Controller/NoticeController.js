const Notice = require("../models/Notice");

// 1. Create a new Notice
exports.createNotice = async (req, res) => {
    try {
        const notice = new Notice(req.body);
        await notice.save();
        res.status(201).json({ success: true, data: notice });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 2. Get all Notices (Can filter by status or priority)
exports.getAllNotices = async (req, res) => {
    try {
        const { status, priority } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (priority) query.priority = priority;

        // Sorting by newest first
        const notices = await Notice.find(query).sort({ noticeDate: -1 });
        res.status(200).json({ success: true, count: notices.length, data: notices });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Get a single Notice by ID
exports.getNoticeById = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) return res.status(404).json({ message: "Notice not found" });
        res.status(200).json({ success: true, data: notice });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Update a Notice
exports.updateNotice = async (req, res) => {
    try {
        const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!notice) return res.status(404).json({ message: "Notice not found" });
        res.status(200).json({ success: true, data: notice });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 5. Delete a Notice
exports.deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findByIdAndDelete(req.params.id);
        if (!notice) return res.status(404).json({ message: "Notice not found" });
        res.status(200).json({ success: true, message: "Notice deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};