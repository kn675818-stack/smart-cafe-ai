"use client";

import { useEffect, useState } from "react";

export default function AvailableSeats() {
  const [seats, setSeats] = useState(null);

  useEffect(() => {
    fetch("https://probable-couscous-6vj759wjwqc44rw-5000.app.github.dev/available-seats")
      .then((res) => res.json())
      .then((data) => setSeats(data.availableSeats))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="mt-8 bg-zinc-900 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-amber-400 mb-2">
        Available Seats
      </h2>

      <p className="text-4xl font-bold">
        {seats !== null ? seats : "..."}
      </p>
    </div>
  );
}