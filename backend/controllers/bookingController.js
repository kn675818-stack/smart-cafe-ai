const Booking = require("../models/Booking");

// Create Booking
const createBooking = async (req, res) => {
  try {
    console.log("Received Booking:", req.body);

    const { name, mobile, email, date, time, seats } = req.body;

    const booking = new Booking({
      name,
      mobile,
      email,
      date,
      time,
      seats,
    });

    const savedBooking = await booking.save();

    console.log("Saved Booking:", savedBooking);

    res.status(201).json({
      success: true,
      booking: savedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get All Bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete Booking
const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Booking Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  deleteBooking,
};