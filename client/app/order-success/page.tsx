"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#030712" }}>
      <Navbar />
      <div className="text-center py-24 px-4">
        <div className="text-7xl mb-6">PixelCart</div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
          Thank you for your purchase. Your order has been confirmed and
          is being processed.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push("/orders")}
            className="text-gray-300 px-6 py-3 rounded-xl text-sm font-semibold border border-gray-700 hover:border-gray-500 transition"
            style={{ backgroundColor: "#111827" }}
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
}