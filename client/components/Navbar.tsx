"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/slices/authSlice";
import { clearCart } from "@/store/slices/cartSlice";
import api from "@/lib/axios";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
      dispatch(clearUser());
      dispatch(clearCart());
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <nav
      style={{ backgroundColor: "#030712" }}
      className="border-b border-gray-800 sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* logo */}
        <Link href="/" className="text-xl font-bold text-white flex-shrink-0">
          Pixel<span className="text-blue-400">Cart</span>
        </Link>

        {/* nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white transition">
            Home
          </Link>
          <Link href="/?category=mobile" className="text-gray-400 hover:text-white transition">
            Mobiles
          </Link>
          <Link href="/?category=laptop" className="text-gray-400 hover:text-white transition">
            Laptops
          </Link>
        </div>

        {/* right side */}
        <div className="flex items-center gap-2">

          {!mounted ? (
            <>
              <Link
                href="/cart"
                className="relative flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition px-3 py-2 rounded-xl hover:bg-gray-800"
              >
                🛒
                <span className="hidden md:inline">Cart</span>
              </Link>
              <Link
                href="/login"
                className="text-sm bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-400 transition font-semibold"
              >
                Login
              </Link>
            </>
          ) : isAuthenticated ? (
            <>
              {/* hi username */}
              <span className="text-sm text-gray-400 hidden md:inline px-2">
                Hi, {user?.username}
              </span>

              {/* admin button */}
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-sm bg-blue-500 hover:bg-blue-400 text-white px-3 py-1.5 rounded-xl font-semibold transition"
                >
                  Admin
                </Link>
              )}

              {/* orders */}
              <Link
                href="/orders"
                className="text-sm text-gray-400 hover:text-white transition px-2 py-1.5 rounded-lg hover:bg-gray-800"
              >
                Orders
              </Link>

              {/* cart */}
              <Link
                href="/cart"
                className="relative flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition px-3 py-2 rounded-xl hover:bg-gray-800"
              >
                🛒
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {items.length}
                  </span>
                )}
                <span className="hidden md:inline">Cart</span>
              </Link>

              {/* logout */}
              <button
                onClick={handleLogout}
                className="text-sm text-white font-semibold px-3 py-1.5 rounded-xl transition"
                style={{ backgroundColor: "#ef4444" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#dc2626")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#ef4444")}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* cart for non logged in */}
              <Link
                href="/cart"
                className="relative flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition px-3 py-2 rounded-xl hover:bg-gray-800"
              >
                🛒
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {items.length}
                  </span>
                )}
                <span className="hidden md:inline">Cart</span>
              </Link>

              {/* login */}
              <Link
                href="/login"
                className="text-sm bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-400 transition font-semibold"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}