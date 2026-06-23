import Navbar from "./components/Navbar";
import CoffeeRecommendation from "../components/CoffeeRecommendation";
import AvailableSeats from "../components/AvailableSeats";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="flex flex-col items-center text-center px-6 pt-32 pb-20">


        {/* Hero Section */}
       <h1 className="text-4xl md:text-6xl font-bold text-amber-400">
         Welcome to SmartCafe AI ☕
       </h1>

        <p className="text-zinc-400 text-xl max-w-4xl leading-relaxed mb-10">
          Discover delicious coffee, reserve your favorite seat,
          get AI-powered drink recommendations, and enjoy a smarter
          café experience.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link href="/menu">
            <button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-10 py-4 rounded-xl transition">
              Explore Menu
            </button>
          </Link>

          <Link href="/booking">
            <button className="border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black px-10 py-4 rounded-xl transition">
              Book a Seat
            </button>
          </Link>
        </div>

        {/* AI Recommendation */}
        <div className="w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-3xl p-10 shadow-lg">
          <CoffeeRecommendation />
        </div>

        {/* Available Seats */}
        <div className="mt-16">
          <AvailableSeats />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6 text-center text-zinc-500">
        © 2026 SmartCafe AI • Powered by AI
      </footer>
    </main>
  );
}