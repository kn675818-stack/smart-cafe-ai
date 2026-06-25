require("dotenv").config();

console.log("GROQ =", process.env.GROQ_API_KEY);
console.log("MONGO =", process.env.MONGO_URI);

const mongoose = require("mongoose");
const Booking = require("./models/Booking");
const Order = require("./models/Order");
const Contact = require("./models/Contact");
const express = require("express");
const cors = require("cors");

const app = express();   // ✅

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
const recommendationRoutes = require("./routes/recommendation");
const adminRoutes = require("./routes/admin");
app.use("/api/recommendation", recommendationRoutes);
app.use("/admin", adminRoutes);

// Home Route
app.get("/", (req, res) => {
res.send("SmartCafe Backend Running 🚀");
});

// Create Booking
app.post("/booking", async (req, res) => {
  try {
    console.log("Received Booking:", req.body);

   const {
  name,
  mobile,
  email,
  date,
  time,
  seats,
} = req.body;

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

    res.json({
      success: true,
      booking: savedBooking,
    });
  } catch (error) {
    console.log("BOOKING ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// Get All Bookings
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
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
// Delete Booking
app.delete("/booking/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Booking Deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Create Order
app.post("/order", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.status(201).json({
      success: true,
      message: "Order Saved",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get All Orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
console.log("MONGO_URI =", process.env.MONGO_URI);

// Delete Order
app.delete("/order/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Order Deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log("MongoDB Error:", err));

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
app.listen(5000, () => {
console.log("Server running on port 5000");
});
