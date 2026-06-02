"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
import api from "@/lib/axios";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "login";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleVerify() {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/verify-otp", { email, otp });
      dispatch(setUser(res.data.user));
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      setError("");
      if (type === "register") {
        await api.post("/auth/register", { email });
      } else {
        await api.post("/auth/send-otp", { email });
      }
      setError("New OTP sent to your email");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
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
          <p className="text-gray-400 text-sm mt-2">
            Enter the OTP sent to
          </p>
          <p className="text-blue-400 text-sm font-semibold mt-1">{email}</p>
        </div>

        {/* form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400 block mb-1.5">
              OTP Code
            </label>
            <input
              type="text"
              placeholder="Enter 6 digit OTP"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-blue-500 transition text-center tracking-widest text-lg"
              style={{ backgroundColor: "#1f2937" }}
            />
          </div>

          {error && (
            <p className={`text-sm ${
              error.includes("sent") ? "text-green-400" : "text-red-400"
            }`}>
              {error}
            </p>
          )}

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-900 disabled:text-blue-600 text-white font-semibold py-3 rounded-xl text-sm transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>

        {/* resend */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Did not receive OTP?{" "}
          <button
            onClick={handleResend}
            className="text-blue-400 hover:underline font-medium"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}