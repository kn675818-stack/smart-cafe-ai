"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AvailableSeats() {
  const [seats, setSeats] = useState<number | null>(null);

  useEffect(() => {
  console.log("Fetching seats...");

  fetch(`${API_URL}/available-seats`)
    .then(async (res) => {
      console.log("Status:", res.status);
      const data = await res.json();
      console.log("Response:", data);
      setSeats(data.availableSeats);
    })
    .catch((err) => {
      console.error("FETCH ERROR:", err);
    });
}, []);

  return (
    <div>
      <h2>Available Seats</h2>
      <p>{seats === null ? "Loading..." : seats}</p>
    </div>
  );
}