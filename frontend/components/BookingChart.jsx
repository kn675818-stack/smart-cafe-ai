"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BookingChart() {
  const [stats, setStats] = useState({
    bookedSeats: 0,
    availableSeats: 0,
  });

  useEffect(() => {
    fetch("https://smart-cafe-ai-1.onrender.com/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        console.log("Chart Data:", data);
        setStats(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const chartData = [
    {
      name: "Seats",
      Booked: Number(stats.bookedSeats),
      Available: Number(stats.availableSeats),
    },
  ];

  return (
    <div className="bg-zinc-900 p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-amber-400 mb-6">
        Booking Analytics
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />

            <Tooltip />

            <Bar
              dataKey="Booked"
              fill="#f59e0b"
            />

            <Bar
              dataKey="Available"
              fill="#22c55e"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}