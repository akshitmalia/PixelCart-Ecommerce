"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAppSelector } from "@/store/hooks";
import api from "@/lib/axios";
import { Product } from "@/types";

interface Order {
  _id: string;
  user: { username: string; email: string };
  items: any[];
  totalPrice: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

const emptyForm = {
  name: "",
  brand: "",
  category: "mobile",
  price: "",
  stock: "",
  description: "",
  images: "",
  specs: {
    ram: "",
    storage: "",
    processor: "",
    display: "",
    battery: "",
    os: "",
  },
};

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/");
      return;
    }
    fetchProducts();
    fetchOrders();
  }, [isAuthenticated]);

  async function fetchProducts() {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrders() {
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  function handleEdit(product: Product) {
    setEditId(product._id);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || "",
      images: product.images?.[0] || "",
      specs: {
        ram: product.specs?.ram || "",
        storage: product.specs?.storage || "",
        processor: product.specs?.processor || "",
        display: product.specs?.display || "",
        battery: product.specs?.battery || "",
        os: product.specs?.os || "",
      },
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit() {
    if (!form.name || !form.brand || !form.price) {
      setFormError("Name, brand and price are required");
      return;
    }
    try {
      setFormLoading(true);
      setFormError("");
      const payload = {
        name: form.name,
        brand: form.brand,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        description: form.description,
        images: form.images ? [form.images] : [],
        specs: form.specs,
      };
      if (editId) {
        await api.patch(`/products/${editId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#030712" }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your products and orders</p>
          </div>
          {tab === "products" && (
            <button
              onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
              className="bg-blue-500 hover:bg-blue-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2"
            >
              + Add Product
            </button>
          )}
        </div>

        {/* stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Products", value: products.length },
            { label: "Total Orders", value: orders.length },
            { label: "Paid Orders", value: orders.filter(o => o.paymentStatus === "paid").length },
            { label: "Revenue", value: `₹${orders.filter(o => o.paymentStatus === "paid").reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString("en-IN")}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <p className="text-gray-400 text-xs mb-1">{label}</p>
              <p className="text-white text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* tabs */}
        <div className="flex gap-2 mb-6">
          {["products", "orders"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as "products" | "orders")}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition capitalize ${
                tab === t
                  ? "bg-blue-500 text-white"
                  : "bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* form */}
        {showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <h2 className="text-base font-bold text-white mb-5">
              {editId ? "Edit Product" : "➕ Add New Product"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Product Name", key: "name", placeholder: "iPhone 15 Pro" },
                { label: "Brand", key: "brand", placeholder: "Apple" },
                { label: "Price (₹)", key: "price", placeholder: "129999" },
                { label: "Stock", key: "stock", placeholder: "10" },
                { label: "Image URL", key: "images", placeholder: "Enter the image url" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition"
                  />
                </div>
              ))}

              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition"
                >
                  <option value="mobile">Mobile</option>
                  <option value="laptop">Laptop</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Description</label>
              <textarea
                placeholder="Product description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition resize-none"
              />
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-gray-400 mb-3">Specifications</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["ram", "storage", "processor", "display", "battery", "os"].map((spec) => (
                  <div key={spec}>
                    <label className="text-xs text-gray-500 block mb-1 capitalize">{spec}</label>
                    <input
                      type="text"
                      value={(form.specs as any)[spec]}
                      onChange={(e) => setForm({ ...form, specs: { ...form.specs, [spec]: e.target.value } })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition"
                    />
                  </div>
                ))}
              </div>
            </div>

            {formError && <p className="text-red-400 text-sm mt-3">{formError}</p>}

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSubmit}
                disabled={formLoading}
                className="bg-blue-500 hover:bg-blue-400 disabled:bg-blue-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                {formLoading ? "Saving..." : editId ? "Update Product" : "Add Product"}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* products table */}
        {tab === "products" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-sm">No products yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 w-64">Product</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-4">Category</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-4">Price</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-4">Stock</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-4">Rating</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-xl"
                                />
                              ) : (
                                <span className="text-xl">
                                  {product.category === "mobile" ? "📱" : "💻"}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate max-w-36">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full capitalize">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-white whitespace-nowrap">
                          ₹{product.price.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            product.stock > 0
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>
                            {product.stock > 0 ? product.stock : "Out"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-yellow-400">
                          {product.ratings.count > 0
                            ? `★ ${product.ratings.average}`
                            : <span className="text-gray-600">—</span>}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 rounded-lg font-medium transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg font-medium transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* orders table */}
        {tab === "orders" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-sm">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4">Order ID</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-4">User</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-4">Items</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-4">Total</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-4">Payment</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                        <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-white font-medium">{order.user?.username}</p>
                          <p className="text-xs text-gray-500">{order.user?.email}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-400">
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </td>
                        <td className="px-4 py-4 text-sm font-bold text-white whitespace-nowrap">
                          ₹{order.totalPrice.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            order.paymentStatus === "paid"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          }`}>
                            {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}