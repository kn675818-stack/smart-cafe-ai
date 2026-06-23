"use client";

import { useState } from "react";

export default function CoffeeRecommendation() {
  const [query, setQuery] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const getRecommendation = () => {
    const q = query.toLowerCase();

    if (q.includes("sweet") || q.includes("meetha")) {
      setRecommendation(
        "Oreo Shake, Belgian Chocolate Frappe, Mango Smoothie"
      );
    } else if (q.includes("cold") || q.includes("thanda")) {
      setRecommendation(
        "Cold Coffee, Blue Lagoon, Virgin Mojito"
      );
    } else {
      setRecommendation(
        "Cappuccino, Latte, Espresso"
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-4xl font-bold text-amber-400">
        AI Drink Recommendation
      </h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="I want something sweet and cold..."
        className="w-full max-w-4xl px-6 py-4 rounded-xl bg-black border border-zinc-700 text-white text-lg"
      />

      <button
        onClick={getRecommendation}
        className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 rounded-xl transition"
      >
        Recommend
      </button>

      {recommendation && (
        <div className="w-full max-w-4xl bg-black border border-amber-500 rounded-xl p-5 text-center">
          <p className="text-xl text-amber-300">
            {recommendation}
          </p>
        </div>
      )}
    </div>
  );
}