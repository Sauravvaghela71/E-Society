const express = require('express');
const router = express.Router();
const facilityController = require('../Controller/FacilityController');

// Basic CRUD for Facilities
router.get('/', facilityController.getAllFacilities);
router.post('/', facilityController.createFacility);
router.put('/:id', facilityController.updateFacility);
router.delete('/:id', facilityController.deleteFacility);

// Bookings
router.post('/book', facilityController.bookFacility);
router.get('/booked-slots', facilityController.getBookedSlots);
router.get('/bookings', facilityController.getAllBookings);
router.put('/bookings/:id/status', facilityController.updateBookingStatus); // Admin approve/reject
router.put('/bookings/:id/cancel', facilityController.cancelBooking);

module.exports = router;