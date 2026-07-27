const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBookings,
  deleteBooking,
} = require("../controllers/bookingController");

// Create Booking
router.post("/booking", createBooking);

// Get All Bookings
router.get("/bookings", getBookings);

// Delete Booking
router.delete("/booking/:id", deleteBooking);

module.exports = router;