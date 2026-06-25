"use client";

import { useState } from "react";

export default function CoffeeRecommendation() {
  const [mood, setMood] = useState("");
  const [coffee, setCoffee] = useState("");

  const getRecommendation = async () => {
    const res = await fetch(
      "https://probable-couscous-6vj759wjwqc44rw-5000.app.github.dev/api/recommendation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood }),
      }
    );

    const data = await res.json();
    setCoffee(data.recommendation);
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-amber-400 mb-4">
        AI Coffee Recommendation ☕
      </h2>

      <select
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="bg-white text-black p-2 rounded border"
        
        >  
      
        <option value="">Select Mood</option>
        <option value="Happy">Happy</option>
        <option value="Stressed">Stressed</option>
        <option value="Tired">Tired</option>
        <option value="Studying">Studying</option>
        <option value="Working">Working</option>
        <option value="Relaxing">Relaxing</option>
      </select>

      <button
        onClick={getRecommendation}
        className="ml-3 bg-amber-500 px-4 py-2 rounded"
      >
        Recommend
      </button>

      {coffee && (
        <p className="mt-4 text-lg">
          Recommended Coffee: {coffee}
        </p>
      )}
    </div>
  );
}