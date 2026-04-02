const Maintenance        = require("../Model/MaintenanceModel");
const MaintenanceSetting = require("../Model/MaintenanceSettingModel");
const Resident           = require("../Model/ResidentModel");
const mailSend           = require("../Util/MailSend");

/* ═══════════════════════════════════════════════════════════════════
   EMAIL TEMPLATE HELPERS
═══════════════════════════════════════════════════════════════════ */

/** Branded wrapper so all emails look consistent */
const wrap = (body) => `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:620px;margin:auto;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:28px 32px;">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">🏢 E-Society</h1>
    <p style="margin:6px 0 0;color:#c4b5fd;font-size:13px;">Society Management System</p>
  </div>
  <div style="padding:28px 32px;background:#fff;">
    ${body}
  </div>
  <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #f3f4f6;text-align:center;">
    <p style="margin:0;font-size:11px;color:#9ca3af;">This is an automated notification from E-Society. Please do not reply.</p>
  </div>
</div>`;

/** Table row helper */
const row = (label, value) => `
<tr>
  <td style="padding:10px 14px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:700;color:#374151;width:40%;">${label}</td>
  <td style="padding:10px 14px;border:1px solid #e5e7eb;color:#111827;">${value}</td>
</tr>`;

/** New-bill email HTML */
const newBillHtml = (resident, bill, dueDate) => wrap(`
  <h2 style="margin:0 0 6px;font-size:20px;color:#1e1b4b;">New Maintenance Bill Generated</h2>
  <p style="margin:0 0 20px;color:#6b7280;font-size:14px;">Your monthly maintenance bill has been raised for ${bill.billName}.</p>

  <p style="margin:0 0 8px;font-size:14px;color:#374151;">Dear <strong>${resident.firstName} ${resident.lastName || ""}</strong>,</p>
  <p style="margin:0 0 20px;font-size:14px;color:#4b5563;">
    Your maintenance bill for <strong>${bill.billName}</strong> has been generated. Please pay before the due date to avoid penalties.
  </p>

  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
    ${row("Wing / Flat",  `Wing ${resident.wing} – Flat ${resident.flatNumber}`)}
    ${row("Bill Name",    bill.billName)}
    ${row("Bill Type",    bill.billType)}
    ${row("Amount Due",   `<strong style="font-size:18px;color:#4f46e5;">₹${bill.amount.toLocaleString()}</strong>`)}
    ${row("Due Date",     `<span style="color:${new Date(dueDate) < new Date() ? '#dc2626' : '#d97706'};font-weight:700;">${new Date(dueDate).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</span>`)}
    ${row("Details",      bill.details || "—")}
  </table>

  <div style="background:#ede9fe;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
    <p style="margin:0;font-size:13px;color:#5b21b6;font-weight:700;">💡 How to pay</p>
    <p style="margin:6px 0 0;font-size:13px;color:#6d28d9;">Log in to E-Society → Maintenance Bills → Pay Online (UPI / Card / Razorpay)</p>
  </div>

  <p style="margin:0;font-size:13px;color:#6b7280;">Thank you for being a valued resident!</p>
`);

/** Overdue-reminder email HTML */
const overdueBillHtml = (resident, bill) => {
    const overdueDays = Math.floor((Date.now() - new Date(bill.dueDate)) / 86_400_000);
    return wrap(`
  <h2 style="margin:0 0 6px;font-size:20px;color:#991b1b;">⚠️ Overdue Maintenance Reminder</h2>
  <p style="margin:0 0 20px;color:#6b7280;font-size:14px;">Your maintenance payment is past the due date.</p>

  <p style="margin:0 0 8px;font-size:14px;color:#374151;">Dear <strong>${resident.firstName} ${resident.lastName || ""}</strong>,</p>
  <p style="margin:0 0 20px;font-size:14px;color:#4b5563;">
    This is a friendly reminder that your maintenance bill for <strong>${bill.billName}</strong> is now 
    <strong style="color:#dc2626;">${overdueDays} day${overdueDays !== 1 ? "s" : ""} overdue</strong>. 
    Please clear the dues at the earliest to avoid late penalties.
  </p>

  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
    ${row("Wing / Flat",  `Wing ${resident.wing} – Flat ${resident.flatNumber}`)}
    ${row("Bill Name",    bill.billName)}
    ${row("Amount Due",   `<strong style="font-size:18px;color:#dc2626;">₹${bill.amount.toLocaleString()}</strong>`)}
    ${row("Original Due", `<span style="color:#dc2626;font-weight:700;">${new Date(bill.dueDate).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</span>`)}
    ${row("Days Overdue", `<span style="color:#dc2626;font-weight:900;">${overdueDays} days</span>`)}
  </table>

  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
    <p style="margin:0;font-size:13px;color:#b91c1c;font-weight:700;">⚡ Action Required</p>
    <p style="margin:6px 0 0;font-size:13px;color:#dc2626;">Log in to E-Society immediately and complete your payment to avoid additional late fees.</p>
  </div>

  <p style="margin:0;font-size:13px;color:#6b7280;">If you have already paid, please ignore this reminder.</p>
`);
};

/* ═══════════════════════════════════════════════════════════════════
   FIRE-AND-FORGET EMAIL HELPER  (never crashes the main flow)
═══════════════════════════════════════════════════════════════════ */
const sendEmail = (to, subject, html) => {
    if (!to) return;
    mailSend(to, subject, html).catch(err =>
        console.error(`[MailSend] Failed → ${to} | ${subject} | ${err.message}`)
    );
};

/* ═══════════════════════════════════════════════════════════════════
   AUTO-GENERATE MONTHLY BILLS  (with new-bill email)
═══════════════════════════════════════════════════════════════════ */
const autoGenerateMonthlyBillsIfNeeded = async () => {
    try {
        const today = new Date();
        if (today.getDate() < 19) return;   // only on or after 19th

        let setting = await MaintenanceSetting.findOne();
        if (!setting) {
            setting = new MaintenanceSetting({ maintenanceAmount: 2000, penaltyAmount: 500 });
            await setting.save();
        }

        const residents = await Resident.find({ status: "Active" });
        if (!residents.length) return;

        const currentMonthName = today.toLocaleString("default", { month: "long" });
        const billName         = `${currentMonthName} Monthly Maintenance`;
        const dueDate          = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

        // Bills already raised this month
        const existingBills    = await Maintenance.find({ billType: "Regular Maintenance", billName });
        const billedIds        = new Set(existingBills.map(b => b.residentId.toString()));

        // Build new bill documents
        const newBillDocs = [];
        for (const resident of residents) {
            if (!billedIds.has(resident._id.toString())) {
                newBillDocs.push({
                    residentId : resident._id,
                    billName,
                    billType   : "Regular Maintenance",
                    amount     : setting.maintenanceAmount,
                    dueDate,
                    status     : "Pending",
                    details    : `Water: ₹${Math.round(setting.maintenanceAmount * 0.3)}, Parking: ₹${Math.round(setting.maintenanceAmount * 0.2)}, Maintenance: ₹${Math.round(setting.maintenanceAmount * 0.5)}`,
                });
            }
        }

        if (newBillDocs.length === 0) return;

        // Insert and immediately send notification emails
        const inserted = await Maintenance.insertMany(newBillDocs);

        // Build a quick lookup map: residentId → resident record
        const residentMap = new Map(residents.map(r => [r._id.toString(), r]));

        const emailNow = new Date();
        for (const bill of inserted) {
            const resident = residentMap.get(bill.residentId.toString());
            if (resident?.email) {
                sendEmail(
                    resident.email,
                    `New Maintenance Bill: ${billName} – ₹${setting.maintenanceAmount.toLocaleString()}`,
                    newBillHtml(resident, bill, dueDate)
                );
                // Mark email as sent (fire-and-forget, best-effort)
                Maintenance.findByIdAndUpdate(bill._id, { billEmailSentAt: emailNow }).catch(() => {});
            }
        }

        console.log(`[AutoBill] Generated ${inserted.length} bills for ${billName} and queued notification emails.`);
    } catch (err) {
        console.error("[AutoBill] Error:", err);
    }
};

/* ═══════════════════════════════════════════════════════════════════
   OVERDUE BILL CHECK  (sends reminder email once per bill)
═══════════════════════════════════════════════════════════════════ */
const checkOverdueBillsAndNotify = async () => {
    try {
        const now = new Date();

        // Find all Pending bills where dueDate has passed AND overdue email not yet sent
        const overdueBills = await Maintenance
            .find({
                status          : "Pending",
                dueDate         : { $lt: now },
                overdueEmailSentAt: null,   // haven't sent reminder yet
            })
            .populate("residentId", "firstName lastName email wing flatNumber");

        if (!overdueBills.length) return;

        console.log(`[Overdue] Found ${overdueBills.length} overdue bill(s) — sending reminders…`);

        for (const bill of overdueBills) {
            const resident = bill.residentId;
            if (resident?.email) {
                sendEmail(
                    resident.email,
                    `⚠️ Overdue Maintenance Reminder – ${bill.billName} (₹${bill.amount.toLocaleString()})`,
                    overdueBillHtml(resident, bill)
                );
            }
            // Mark so we don't re-send tomorrow
            await Maintenance.findByIdAndUpdate(bill._id, { overdueEmailSentAt: now });
        }

        console.log(`[Overdue] Processed ${overdueBills.length} overdue reminder(s).`);
    } catch (err) {
        console.error("[Overdue] Error:", err);
    }
};

/* ═══════════════════════════════════════════════════════════════════
   EXPORTS
═══════════════════════════════════════════════════════════════════ */

// Export the overdue check so Server.js can schedule it via cron
exports.checkOverdueBillsAndNotify = checkOverdueBillsAndNotify;

// 0. Settings
exports.getSettings = async (req, res) => {
    try {
        let setting = await MaintenanceSetting.findOne();
        if (!setting) {
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
        if (!setting) setting = new MaintenanceSetting(req.body);
        else {
            setting.maintenanceAmount = req.body.maintenanceAmount;
            setting.penaltyAmount     = req.body.penaltyAmount;
        }
        await setting.save();
        res.status(200).json({ success: true, data: setting });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};

// 1. Admin: Create a bill manually
exports.createBill = async (req, res) => {
    try {
        const bill = new Maintenance(req.body);
        await bill.save();

        // Send new-bill email to the resident
        const populated = await Maintenance.findById(bill._id)
            .populate("residentId", "firstName lastName email wing flatNumber");
        const resident = populated?.residentId;
        if (resident?.email) {
            sendEmail(
                resident.email,
                `New Maintenance Bill: ${bill.billName} – ₹${bill.amount.toLocaleString()}`,
                newBillHtml(resident, bill, bill.dueDate)
            );
            Maintenance.findByIdAndUpdate(bill._id, { billEmailSentAt: new Date() }).catch(() => {});
        }

        res.status(201).json({ success: true, data: bill });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 2. Admin: Get all bills
exports.getAllBills = async (req, res) => {
    try {
        await autoGenerateMonthlyBillsIfNeeded();
        await checkOverdueBillsAndNotify();       // also check for overdue on every admin view
        const bills = await Maintenance.find()
            .populate("residentId", "firstName lastName mobileNumber wing flatNumber profileid")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: bills.length, data: bills });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Resident: Get bills for a specific resident
exports.getResidentBills = async (req, res) => {
    try {
        await autoGenerateMonthlyBillsIfNeeded();
        await checkOverdueBillsAndNotify();       // also trigger on resident view
        const bills = await Maintenance.find({ residentId: req.params.residentId })
            .populate("residentId", "firstName lastName mobileNumber wing flatNumber profileid")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: bills });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Resident/Admin: Mark a bill as paid (offline / card / UPI)
exports.payBillOnline = async (req, res) => {
    try {
        const { paymentMethod } = req.body;

        const bill = await Maintenance.findByIdAndUpdate(
            req.params.id,
            { status: "Paid", paymentMethod: paymentMethod || "Online", paidAt: new Date() },
            { new: true }
        ).populate("residentId", "firstName lastName email wing flatNumber");

        if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });

        // Payment receipt email
        if (bill.residentId?.email) {
            const htmlMessage = wrap(`
  <h2 style="margin:0 0 6px;font-size:20px;color:#065f46;">✅ Payment Received</h2>
  <p style="margin:0 0 20px;color:#6b7280;font-size:14px;">Your maintenance payment has been successfully recorded.</p>

  <p style="margin:0 0 8px;font-size:14px;color:#374151;">Dear <strong>${bill.residentId.firstName} ${bill.residentId.lastName || ""}</strong>,</p>
  <p style="margin:0 0 20px;font-size:14px;color:#4b5563;">
    Your maintenance bill has been successfully paid. Here are your payment details:
  </p>

  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
    ${row("Wing / Flat",     `Wing ${bill.residentId.wing} – Flat ${bill.residentId.flatNumber}`)}
    ${row("Bill Name",       bill.billName)}
    ${row("Amount Paid",     `<strong style="font-size:18px;color:#059669;">₹${bill.amount.toLocaleString()}</strong>`)}
    ${row("Payment Method",  bill.paymentMethod)}
    ${row("Date Paid",       new Date(bill.paidAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}))}
  </table>

  <p style="margin:0;font-size:13px;color:#6b7280;">You can download your invoice from E-Society → Maintenance Bills. Thank you!</p>
`);
            sendEmail(bill.residentId.email, "Maintenance Payment Receipt", htmlMessage);
        }

        res.status(200).json({ success: true, message: "Payment Successful!", data: bill });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
