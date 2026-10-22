"use client";

import { useState } from "react";
import { API_URL } from "../lib/api";

export default function CoffeeRecommendation() {
  const [query, setQuery] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getRecommendation = async () => {
    const mood = query.trim();

    if (!mood) {
      setRecommendation("");
      setError("Please enter your drink preference.");
      return;
    }

    setError("");
    setRecommendation("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL.replace(/\/$/, "")}/api/recommendation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mood }),
        }
      );

      const data = await response.json();

      // Invalid/non-menu input:
      // Keep the UI completely blank.
      if (!response.ok || !data.success) {
        setRecommendation("");
        setError("");
        return;
      }

      if (!data.recommendation) {
        setRecommendation("");
        setError("");
        return;
      }

      setRecommendation(data.recommendation);
      setError("");
    } catch (err) {
      console.error("Recommendation error:", err);

      setRecommendation("");
      setError("");
    } finally {
      setLoading(false);
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
        onKeyDown={(e) => {
          if (e.key === "Enter" && !loading) {
            getRecommendation();
          }
        }}
        placeholder="Try: chocolate drink, cold coffee, or something sweet..."
        aria-label="Enter your drink preference"
        disabled={loading}
        className="w-full max-w-4xl px-6 py-4 rounded-xl bg-black border border-zinc-700 text-white text-lg disabled:opacity-60"
      />

      <button
        onClick={getRecommendation}
        disabled={loading}
        className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold px-8 py-3 rounded-xl transition"
      >
        {loading ? "Finding Your Drink..." : "Recommend"}
      </button>

      {error && (
        <p className="text-red-400 text-center" role="alert">
          {error}
        </p>
      )}

      {recommendation && (
        <div
          className="w-full max-w-4xl bg-black border border-amber-500 rounded-xl p-5 text-center"
          aria-live="polite"
        >
          <h3 className="text-lg font-semibold text-amber-400 mb-3">
            Recommended For You
          </h3>

          <p className="text-xl text-amber-300">
            {recommendation}
          </p>
        </div>
      )}
    </div>
  );
}