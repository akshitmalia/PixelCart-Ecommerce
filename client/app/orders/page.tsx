"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/axios";

interface Order {
  _id: string;
  items: any[];
  totalPrice: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await api.get("/orders/my-orders");
      setOrders(res.data);
    } catch (error) {
      console.log("Error fetching orders:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#030712" }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl h-24 animate-pulse border border-gray-800"
                style={{ backgroundColor: "#111827" }}
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-400 mb-4">No orders yet</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl p-6 border border-gray-800"
                style={{ backgroundColor: "#111827" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-mono">
                      Order ID: #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      order.paymentStatus === "paid"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}>
                      {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      order.status === "confirmed"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                    }`}>
                      {order.status === "confirmed" ? "Confirmed" : "Processing"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-gray-300 font-medium">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-800 pt-3 flex justify-between">
                  <span className="text-sm font-bold text-white">Total</span>
                  <span className="text-sm font-bold text-blue-400">
                    ₹{order.totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}