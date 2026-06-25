"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(
        "https://smart-cafe-ai-1.onrender.com/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      
      console.log("Status:", res.status);

      const data = await res.json();

      console.log("Response:", data)

      if (data.success) {
        localStorage.setItem(
          "token",
          data.token
        );

        router.push("/admin");
      } else {
      
        alert("Invalid Credentials");
      }
    } catch (error) {
     console.error("LOGIN ERROR:", error);
      alert("Server Error");
    }
  };

  return (
    <main className="min-h-screen bg-black flex justify-center items-center">
      <div className="bg-zinc-900 p-8 rounded-xl w-96">
        <h1 className="text-3xl font-bold text-amber-400 mb-6">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded mb-4 text-black"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded mb-4 text-black"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-amber-500 py-3 rounded font-bold"
        >
          Login
        </button>
      </div>
    </main>
  );
}