"use client";

import { useEffect, useState } from "react";

export default function AdminStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("https://smart-cafe-ai-1.onrender.com/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.log(err));
  }, []);

  if (!stats) return <p>Loading Stats...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-zinc-900 p-4 rounded">
        <h3>Total Bookings</h3>
        <p className="text-3xl text-amber-400">{stats.totalBookings}</p>
      </div>

      <div className="bg-zinc-900 p-4 rounded">
        <h3>Booked Seats</h3>
        <p className="text-3xl text-amber-400">{stats.bookedSeats}</p>
      </div>

      <div className="bg-zinc-900 p-4 rounded">
        <h3>Available Seats</h3>
        <p className="text-3xl text-amber-400">{stats.availableSeats}</p>
      </div>

      <div className="bg-zinc-900 p-4 rounded">
        <h3>Revenue</h3>
        <p className="text-3xl text-amber-400">₹{stats.revenue}</p>
      </div>
    </div>
  );
}