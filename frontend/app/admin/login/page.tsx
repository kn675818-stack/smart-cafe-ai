"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      email === "admin@smartcafe.com" &&
      password === "123456"
    ) {
      localStorage.setItem("admin", "true");
      router.push("/admin");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={login}
        className="bg-zinc-900 p-8 rounded w-[400px]"
      >
        <h1 className="text-4xl text-amber-400 mb-6">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 bg-zinc-800 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 bg-zinc-800 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-amber-500 text-black p-3 rounded font-bold"
        >
          Login
        </button>
      </form>
    </main>
  );
}