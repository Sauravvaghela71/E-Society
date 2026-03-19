const Visitor = require("../Model/VisitorModel");
const Resident = require("../Model/ResidentModel");
const mailSend = require("../Util/MailSend");

// 1. Check-In: Add a new visitor
exports.checkInVisitor = async (req, res) => {
    try {
        const payload = req.body;
        // If assigned to a resident, wait for their approval
        if (payload.visitingResident) {
            payload.status = 'Pending';
        }
        
        const visitor = new Visitor(payload);
        await visitor.save();

        if (req.body.visitingResident && req.body.visitorKey) {
            const resident = await Resident.findById(req.body.visitingResident);
            if (resident && resident.email) {
                const subject = "Visitor Entry Notification — Key Received";
                const htmlTemplate = `
                    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                        <h2 style="color: #2563eb;">A Visitor Has Arrived For You</h2>
                        <p><strong>Visitor Name:</strong> ${visitor.visitorName}</p>
                        <p><strong>Mobile:</strong> ${visitor.mobileNumber}</p>
                        <p><strong>Purpose:</strong> ${visitor.purpose}</p>
                        <br/>
                        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 10px; text-align: center;">
                            <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Visitor Entry Key</p>
                            <p style="margin: 10px 0 0; font-size: 32px; font-weight: bold; color: #1e3a8a; letter-spacing: 5px;">${visitor.visitorKey}</p>
                        <p style="margin-top: 20px; color: #4b5563;">Please share this code with the visitor or directly with the security guard to approve their entry.</p>
                        <br/>
                    </div>
                `;
                
                // Fire and forget email hook so API doesn't hang
                mailSend(resident.email, subject, htmlTemplate).catch(err => {
                    console.error("Failed to send email to resident:", err.message);
                });
            }
        }

        res.status(201).json({ success: true, data: visitor });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 1B. Accept Visitor Request (From Resident Email)
exports.acceptVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.findByIdAndUpdate(
            req.params.id,
            { status: 'inside' },
            { new: true }
        );
        if (!visitor) {
            return res.status(404).send("<h2>Visitor not found.</h2>");
        }
        res.status(200).send(`
            <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                <h1 style="color: #10b981;">Visitor Approved Successfully! ✅</h1>
                <p>The guard has been notified and the visitor is granted entry.</p>
                <p>You can safely close this page.</p>
            </div>
        `);
    } catch (error) {
        res.status(500).send("<h2>Error approving visitor.</h2>");
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

// 6. Get Visitors for a specific resident (userId)
exports.getResidentVisitors = async (req, res) => {
    try {
        const visitors = await Visitor.find({ visitingResident: req.params.residentId }).sort({ entryTime: -1 });
        res.status(200).json({ success: true, count: visitors.length, data: visitors });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};