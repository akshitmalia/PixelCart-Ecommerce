"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import api from "@/lib/axios";

declare global {
  interface Window { Razorpay: any; }
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalPrice } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !paid) router.push("/");
  }, [items, paid]);

  async function handlePayment() {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/orders", { items, totalPrice });
      const { razorpayOrderId, amount, currency } = res.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount, currency,
        name: "PixelCart",
        description: "Premium Electronics",
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            await api.post("/orders/verify-payment", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            });
            setPaid(true);
            dispatch(clearCart());
            router.push("/order-success");
          } catch {
            setError("Payment verification failed.");
          }
        },
        prefill: { name: user?.username || "", email: user?.email || "" },
        theme: { color: "#3B82F6" },
        modal: { ondismiss: () => setLoading(false) },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#030712" }}>
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Checkout</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
          <h2 className="text-sm font-bold text-white mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.product} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">📱</div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-white whitespace-nowrap">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-4 flex justify-between">
            <span className="font-bold text-white">Total</span>
            <span className="font-bold text-blue-400 text-xl">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
          <p className="text-sm text-yellow-400 font-semibold mb-1">Test Mode</p>
          <p className="text-xs text-yellow-500/80">
            Use UPI ID <strong>success@razorpay</strong> or Netbanking → select any bank → click Success.
          </p>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-900 disabled:text-blue-600 text-white font-bold py-4 rounded-xl text-base transition"
        >
          {loading ? "Processing..." : `Pay ₹${totalPrice.toLocaleString("en-IN")}`}
        </button>

        <button
          onClick={() => router.push("/cart")}
          className="w-full text-gray-500 hover:text-gray-300 text-sm mt-3 py-2 transition"
        >
          ← Back to Cart
        </button>
      </div>
    </div>
  );
}