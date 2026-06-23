"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Message Sent Successfully ✅");

        setForm({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send message");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-center text-amber-400 mb-6">
          Contact Us
        </h1>

        <p className="text-center text-zinc-400 mb-10">
          Have questions or feedback? Send us a message.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full p-4 rounded-lg bg-zinc-900 border border-zinc-700"
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="w-full p-4 rounded-lg bg-zinc-900 border border-zinc-700"
            required
          />

          <textarea
            rows={5}
            placeholder="Your Message"
            value={form.message}
            onChange={(e) =>
              setForm({
                ...form,
                message: e.target.value,
              })
            }
            className="w-full p-4 rounded-lg bg-zinc-900 border border-zinc-700"
            required
          />

          <button
            type="submit"
            className="w-full bg-amber-400 text-black py-3 rounded-lg font-bold hover:bg-amber-300 transition"
          >
            Send Message
          </button>
        </form>

        <div className="text-center mt-10 text-zinc-400">
          <p>Email: smartcafe@gmail.com</p>
          <p>Phone: +91 9876543210</p>
        </div>
      </section>
    </main>
  );
}