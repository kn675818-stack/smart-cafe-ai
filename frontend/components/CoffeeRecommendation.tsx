
"use client";

import { useState } from "react";

export default function CoffeeRecommendation() {
  const [query, setQuery] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [error, setError] = useState("");

  const getRecommendation = () => {
    const q = query.toLowerCase().trim();

    if (!q) {
      setRecommendation("");
      setError("Please enter your drink preference.");
      return;
    }

    setError("");

    const menu = {
      chocolate: ["Mocha", "Chocolate Frappe", "Oreo Shake"],
      oreo: ["Oreo Shake", "Chocolate Frappe", "Vanilla Shake"],
      vanilla: ["Vanilla Shake", "Latte", "Oreo Shake"],
      caramel: ["Latte", "Mocha", "Cold Coffee"],
      sweet: ["Vanilla Shake", "Chocolate Frappe", "Oreo Shake"],
      cold: ["Cold Coffee", "Chocolate Frappe", "Oreo Shake"],
      hot: ["Cappuccino", "Latte", "Mocha"],
      refreshing: ["Cold Coffee", "Mango Smoothie", "Oreo Shake"],
      fruity: ["Mango Smoothie", "Vanilla Shake", "Cold Coffee"],
      strong: ["Espresso", "Cappuccino", "Mocha"],
      coffee: ["Cappuccino", "Latte", "Mocha"],
    };

    const rules = [
      {
        key: "chocolate",
        pattern: /\b(chocolate|choco|cocoa|चॉकलेट|कोको)\b/,
      },
      {
        key: "oreo",
        pattern: /\boreo\b/,
      },
      {
        key: "vanilla",
        pattern: /\b(vanilla|वनीला)\b/,
      },
      {
        key: "caramel",
        pattern: /\bcaramel\b/,
      },
      {
        key: "fruity",
        pattern: /\b(fruity|fruit|mango|strawberry|आम|फल)\b/,
      },
      {
        key: "refreshing",
        pattern: /\b(refreshing|fresh|lemon|mojito|ताज़ा|ताजा)\b/,
      },
      {
        key: "strong",
        pattern: /\b(strong|espresso|bitter|caffeine)\b/,
      },
      {
        key: "hot",
        pattern: /\b(hot|warm|garam|गरम)\b/,
      },
      {
        key: "cold",
        pattern: /\b(cold|thanda|thandi|iced|chilled|ठंडा|ठंडी)\b/,
      },
      {
        key: "sweet",
        pattern: /\b(sweet|meetha|meethi|sugary|मीठा|मीठी)\b/,
      },
      {
        key: "coffee",
        pattern: /\b(coffee|latte|cappuccino|mocha|काफी|कॉफी)\b/,
      },
    ];

    const matchedKeys = rules
      .filter((rule) => rule.pattern.test(q))
      .map((rule) => rule.key);

    if (matchedKeys.length === 0) {
      setRecommendation(
        "Try chocolate, Oreo, vanilla, caramel, sweet, cold, hot, fruity, or strong coffee."
      );
      return;
    }

    // Specific flavour preferences take priority.
    const priority = [
      "chocolate",
      "oreo",
      "vanilla",
      "caramel",
      "fruity",
      "refreshing",
      "strong",
      "hot",
      "cold",
      "sweet",
      "coffee",
    ];

    const selectedKey = priority.find((key) =>
      matchedKeys.includes(key)
    );

    const results = menu[selectedKey as keyof typeof menu];

    setRecommendation(results.join(", "));
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
          if (e.key === "Enter") getRecommendation();
        }}
        placeholder="Try: chocolate drink, Oreo shake, cold coffee..."
        aria-label="Enter your drink preference"
        className="w-full max-w-4xl px-6 py-4 rounded-xl bg-black border border-zinc-700 text-white text-lg"
      />

      <button
        onClick={getRecommendation}
        className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 rounded-xl transition"
      >
        Recommend
      </button>

      {error && <p className="text-red-400">{error}</p>}

      {recommendation && (
        <div
          className="w-full max-w-4xl bg-black border border-amber-500 rounded-xl p-5 text-center"
          aria-live="polite"
        >
          <p className="text-xl text-amber-300">
            {recommendation}
          </p>
        </div>
      )}
    </div>
  );
}
