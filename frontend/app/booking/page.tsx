"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    date: "",
    time: "",
    seats: "",
  });
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/booking",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert(
        `Booking Confirmed ✅\n\nName: ${formData.name}\nSeats: ${formData.seats}\nTime: ${formData.time}`
      );

      console.log(data);

      setFormData({
        name: "",
        mobile: "",
        email: "",
        date: "",
        time: "",
        seats: "",
      });
    } catch (error) {
      console.error(error);
      alert("Backend Connection Failed");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="py-16 flex justify-center">
        <div className="w-full max-w-2xl bg-zinc-900 p-8 rounded-2xl border border-zinc-700">

          <h1 className="text-5xl font-bold text-center text-amber-400 mb-8">
            Reserve Your Seat ☕
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-4 bg-zinc-800 rounded-lg border border-zinc-700"
            />

            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full p-4 bg-zinc-800 rounded-lg border border-zinc-700"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-4 bg-zinc-800 rounded-lg border border-zinc-700"
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-4 bg-zinc-800 rounded-lg border border-zinc-700"
            />

            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full p-4 bg-zinc-800 rounded-lg border border-zinc-700"
            >
              <option value="">
                Select Time Slot
              </option>

              <option value="10:00 AM">
                10:00 AM
              </option>

              <option value="12:00 PM">
                12:00 PM
              </option>

              <option value="02:00 PM">
                02:00 PM
              </option>

              <option value="04:00 PM">
                04:00 PM
              </option>

              <option value="06:00 PM">
                06:00 PM
              </option>

              <option value="08:00 PM">
                08:00 PM
              </option>
            </select>

            <input
              type="number"
              name="seats"
              placeholder="Number of Seats"
              value={formData.seats}
              onChange={handleChange}
              required
              min="1"
              max="20"
              className="w-full p-4 bg-zinc-800 rounded-lg border border-zinc-700"
            />

            <button
              type="submit"
              className="w-full bg-amber-400 text-black py-4 rounded-lg font-bold text-lg hover:bg-amber-300 transition"
            >
              Book Now
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}