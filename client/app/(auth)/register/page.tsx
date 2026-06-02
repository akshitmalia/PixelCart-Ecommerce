"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    if (!username || !email) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await api.post("/auth/register", { username, email });
      router.push(`/verify-otp?email=${email}&type=register`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#030712" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 border border-gray-800"
        style={{ backgroundColor: "#111827" }}
      >
        {/* logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">
            pixel<span className="text-blue-400">Cart</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">Create your account</p>
        </div>

        {/* form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400 block mb-1.5">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition"
              style={{ backgroundColor: "#1f2937" }}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400 block mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition"
              style={{ backgroundColor: "#1f2937" }}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-900 disabled:text-blue-600 text-white font-semibold py-3 rounded-xl text-sm transition"
          >
            {loading ? "Sending OTP..." : "Continue"}
          </button>
        </div>

        {/* login link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}