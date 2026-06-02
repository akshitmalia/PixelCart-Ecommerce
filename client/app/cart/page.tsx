"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeFromCart, updateQuantity, clearCart } from "@/store/slices/cartSlice";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalPrice } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#030712" }}>
        <Navbar />
        <div className="text-center py-24">
          <p className="text-6xl mb-4">🛒</p>
          <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-xl text-sm font-semibold transition"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#030712" }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">
          Your Cart
          <span className="text-gray-500 font-normal text-base ml-2">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.product}
                className="border border-gray-800 rounded-2xl p-4 flex gap-4"
                style={{ backgroundColor: "#111827" }}
              >
                {/* image */}
                <div
                  className="rounded-xl w-20 h-20 flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ backgroundColor: "#1f2937" }}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">📱</span>
                  )}
                </div>

                {/* details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white mb-1 truncate">
                    {item.name}
                  </p>
                  <p className="text-blue-400 font-bold text-sm mb-2">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>

                  {/* quantity controls */}
                  <div className="flex items-center gap-1 rounded-xl p-1 w-fit mb-3"
                    style={{ backgroundColor: "#1f2937" }}>
                    <button
                      onClick={() => {
                        if (item.quantity === 1) {
                          dispatch(removeFromCart(item.product));
                        } else {
                          dispatch(updateQuantity({
                            productId: item.product,
                            quantity: item.quantity - 1,
                          }));
                        }
                      }}
                      className="w-7 h-7 rounded-lg text-white transition flex items-center justify-center font-bold text-sm hover:bg-gray-600"
                      style={{ backgroundColor: "#374151" }}
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold text-white w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(updateQuantity({
                          productId: item.product,
                          quantity: item.quantity + 1,
                        }))
                      }
                      className="w-7 h-7 rounded-lg text-white transition flex items-center justify-center font-bold text-sm hover:bg-gray-600"
                      style={{ backgroundColor: "#374151" }}
                    >
                      +
                    </button>
                  </div>

                  {/* remove button — red, below quantity */}
                  <button
                    onClick={() => dispatch(removeFromCart(item.product))}
                    className="text-xs text-white font-semibold px-3 py-1.5 rounded-lg transition"
                    style={{ backgroundColor: "#0049B7" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#24A0ED")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#0049B7")}
                  >
                    Remove
                  </button>
                </div>

                {/* item total */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-white">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}

            {/* clear cart button */}
            <button
              onClick={() => dispatch(clearCart())}
              className="flex items-center gap-2 text-sm text-white font-semibold px-5 py-2.5 rounded-xl transition mt-2 border border-red-500/30"
              style={{ backgroundColor: "#7f1d1d" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#991b1b")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#7f1d1d")}
            >
              Clear Cart
            </button>
          </div>

          {/* order summary */}
          <div className="lg:col-span-1">
            <div
              className="border border-gray-800 rounded-2xl p-6 sticky top-20"
              style={{ backgroundColor: "#111827" }}
            >
              <h2 className="text-base font-bold text-white mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.product} className="flex justify-between text-sm">
                    <span className="text-gray-400 line-clamp-1 flex-1">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gray-300 ml-2 font-medium">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-bold text-white">Total</span>
                  <span className="font-bold text-blue-400 text-lg">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) { router.push("/login"); return; }
                  router.push("/checkout");
                }}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-3.5 rounded-xl text-sm transition"
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}