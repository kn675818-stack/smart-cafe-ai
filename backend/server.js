const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

console.log("MONGO_URI =", process.env.MONGO_URI);
console.log("GROQ =", process.env.GROQ_API_KEY);

const connectDB = require("./config/db");

const Booking = require("./models/Booking");
const Order = require("./models/Order");
const Contact = require("./models/Contact");

const express = require("express");
const cors = require("cors");

const app = express();

const recommendationRoutes = require("./routes/recommendation");
const adminRoutes = require("./routes/admin");
const bookingRoutes = require("./routes/bookingRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/recommendation", recommendationRoutes);
app.use("/admin", adminRoutes);

app.use(bookingRoutes);
app.use(orderRoutes);
app.use("/contacts", contactRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("SmartCafe Backend Running 🚀");
});

// Available Seats
app.get("/available-seats", async (req, res) => {
  try {
    const bookings = await Booking.find();

    const bookedSeats = bookings.reduce(
      (total, booking) => total + Number(booking.seats),
      0
    );

    const totalSeats = 50;
    const availableSeats = totalSeats - bookedSeats;

    res.json({
      totalSeats,
      bookedSeats,
      availableSeats,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Admin Stats
app.get("/admin/stats", async (req, res) => {
  try {
    const bookings = await Booking.find();

    const totalBookings = bookings.length;

    const bookedSeats = bookings.reduce(
      (total, booking) => total + Number(booking.seats),
      0
    );

    const totalSeats = 50;
    const availableSeats = totalSeats - bookedSeats;

    const revenue = bookedSeats * 100;

    res.json({
      totalBookings,
      bookedSeats,
      availableSeats,
      revenue,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Save Contact Message
app.post("/contact", async (req, res) => {
  try {
    const contact = new Contact(req.body);

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Message Saved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get All Contact Messages
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.json(contacts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete Contact
app.delete("/contact/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Contact Deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// AI Occupancy Prediction
app.get("/prediction", async (req, res) => {
  try {
    const bookings = await Booking.find();

    const bookedSeats = bookings.reduce(
      (total, booking) => total + Number(booking.seats),
      0
    );

    const expectedSeats = Math.min(bookedSeats + 5, 50);

    const occupancy = Math.round((expectedSeats / 50) * 100);

    res.json({
      expectedSeats,
      occupancy,
      confidence: 90,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});