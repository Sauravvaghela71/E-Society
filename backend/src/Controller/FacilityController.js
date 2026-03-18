const Facility = require("../Model/FacilityModel");
const Booking = require("../Model/BookingModel");

// ---------------- FACILITY CRUD ----------------

exports.createFacility = async (req, res) => {
    try {
        const facility = new Facility(req.body);
        await facility.save();
        res.status(201).json({ success: true, data: facility });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllFacilities = async (req, res) => {
    try {
        const facilities = await Facility.find();
        res.status(200).json({ success: true, count: facilities.length, data: facilities });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateFacility = async (req, res) => {
    try {
        const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!facility) return res.status(404).json({ message: "Facility not found" });
        res.status(200).json({ success: true, data: facility });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteFacility = async (req, res) => {
    try {
        const facility = await Facility.findByIdAndDelete(req.params.id);
        if (!facility) return res.status(404).json({ message: "Facility not found" });
        res.status(200).json({ success: true, message: "Facility deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ---------------- BOOKINGS ----------------

exports.bookFacility = async (req, res) => {
    try {
        const { facilityId, bookingDate, timeSlot, amountPaid, residentId } = req.body;
        
        // Ensure no double booking for the exact date and timeslot
        const existingBooking = await Booking.findOne({
            facility: facilityId,
            bookingDate: new Date(bookingDate),
            timeSlot
        });

        if (existingBooking) {
            return res.status(400).json({ success: false, message: "This slot is already booked!" });
        }

        const newBooking = new Booking({
            resident: residentId,
            facility: facilityId,
            bookingDate: new Date(bookingDate),
            timeSlot,
            amountPaid,
            status: 'Pending', // Force pending until admin approves
            paymentStatus: amountPaid > 0 ? "Completed" : "Pending"
        });

        await newBooking.save();
        res.status(201).json({ success: true, data: newBooking });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "This slot is already booked!" });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get booked slots for a specific date and facility
exports.getBookedSlots = async (req, res) => {
    try {
        const { facilityId, date } = req.query;
        if (!facilityId || !date) {
            return res.status(400).json({ success: false, message: "facilityId and date are required" });
        }

        // We find all bookings for this exact date String (ignoring time by matching start of day to end of day)
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0,0,0,0);
        
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23,59,59,999);

        const bookings = await Booking.find({
            facility: facilityId,
            bookingDate: { $gte: startOfDay, $lte: endOfDay },
            status: "Confirmed"
        }).select("timeSlot");

        const bookedSlots = bookings.map(b => b.timeSlot);
        res.status(200).json({ success: true, data: bookedSlots });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get all bookings (For Admin)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('resident', 'Name email mobileNumber blockWing flatNumber')
            .populate('facility', 'name location openingTime closingTime')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: "Cancelled" }, { new: true });
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        res.status(200).json({ success: true, message: "Booking cancelled successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update booking status (For Admin to Approve/Reject)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};