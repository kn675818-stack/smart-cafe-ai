"use client";

import AdminStats from "../../components/AdminStats";
import BookingChart from "../../components/BookingChart";
import Navbar from "@/app/components/Navbar";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="p-10">
        <h1 className="text-5xl font-bold text-amber-400 mb-6">
          Admin Dashboard
        </h1>

        <AdminStats />
        <BookingChart />
      </div>
    </main>
  );
}