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
      router.push("/dashboard");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={login}
        className="bg-zinc-900 p-8 rounded-lg w-96"
      >
       <h1 className="text-3xl font-bold mb-6 text-center text-amber-400">
  TEST LOGIN PAGE
</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-zinc-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-zinc-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-amber-500 text-black font-semibold p-3 rounded"
        >
          Login
        </button>
      </form>
    </main>
  );
}