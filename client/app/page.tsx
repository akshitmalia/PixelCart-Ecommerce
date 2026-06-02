"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(categoryParam);
  const [sort, setSort] = useState("");

  useEffect(() => {
    setCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    fetchProducts();
  }, [category, sort]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const params: any = {};
      if (category) params.category = category;
      if (sort) params.sort = sort;
      const res = await api.get("/products", { params });
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#030712" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* hero */}
<div className="rounded-2xl p-8 mb-8 relative overflow-hidden"
  style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)" }}>
  <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">
    New arrivals
  </p>
  <h1 className="text-3xl font-bold text-white mb-2">
    Premium Mobiles & Laptops
  </h1>
  <p className="text-blue-100 text-sm">
    Apple, Samsung, OnePlus and more — all in one place
  </p>
</div>

        {/* filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-2">
            {["", "mobile", "laptop"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  category === cat
                    ? "bg-blue-500 text-white"
                    : "bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-white"
                }`}
              >
                {cat === "" ? "All" : cat === "mobile" ? "Mobiles" : "Laptops"}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="ml-auto text-sm border border-gray-800 rounded-xl px-3 py-2 outline-none bg-gray-900 text-gray-400 focus:border-gray-600"
          >
            <option value="">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl h-72 animate-pulse border border-gray-800" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}