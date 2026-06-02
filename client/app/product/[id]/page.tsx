"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Product } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import api from "@/lib/axios";

interface Review {
  _id: string;
  user: { username: string };
  stars: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.items);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  async function fetchProduct() {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.log("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchReviews() {
    try {
      const res = await api.get(`/products/${id}/reviews`);
      setReviews(res.data);
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }
  }

  function handleAddToCart() {
    if (!product) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || "",
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  async function handleReviewSubmit() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (stars === 0) {
      setReviewError("Please select a star rating");
      return;
    }
    try {
      setReviewLoading(true);
      setReviewError("");
      await api.post(`/products/${id}/reviews`, { stars, comment });
      setStars(0);
      setComment("");
      fetchReviews();
      fetchProduct();
    } catch (err: any) {
      setReviewError(err.response?.data?.message || "Something went wrong");
    } finally {
      setReviewLoading(false);
    }
  }

  const isInCart = cartItems.some((item) => item.product === product?._id);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#030712" }}>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="rounded-2xl h-96 animate-pulse border border-gray-800"
            style={{ backgroundColor: "#111827" }} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#030712" }}>
        <Navbar />
        <div className="text-center py-20">
          <p className="text-gray-400">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#030712" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* back button */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-blue-400 mb-6 flex items-center gap-1 transition"
        >
          ← Back
        </button>

        {/* product section */}
        <div
          className="rounded-2xl p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-8 border border-gray-800"
          style={{ backgroundColor: "#111827" }}
        >
          {/* image */}
          <div
            className="rounded-xl h-72 flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: "#1f2937" }}
          >
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-contain p-6"
              />
            ) : (
              <span className="text-8xl">
                {product.category === "mobile" ? "📱" : "💻"}
              </span>
            )}
          </div>

          {/* info */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {product.brand}
            </p>
            <h1 className="text-2xl font-bold text-white mb-2">
              {product.name}
            </h1>

            {/* rating */}
            {product.ratings.count > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= Math.round(product.ratings.average)
                          ? "text-yellow-400"
                          : "text-gray-700"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  {product.ratings.average} ({product.ratings.count} reviews)
                </span>
              </div>
            )}

            <p className="text-3xl font-bold text-blue-400 mb-3">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <span className={`text-xs px-3 py-1 rounded-full inline-block mb-4 font-medium ${
              product.stock > 0
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
            </span>

            {product.description && (
              <p className="text-sm text-gray-400 mb-4">{product.description}</p>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isInCart}
              className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-gray-800 disabled:text-gray-600 text-white font-semibold py-3 rounded-xl transition"
            >
              {isInCart ? "Added to Cart" : added ? "Added!" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* specs */}
        {product.specs && Object.values(product.specs).some(Boolean) && (
          <div
            className="rounded-2xl p-6 mb-6 border border-gray-800"
            style={{ backgroundColor: "#111827" }}
          >
            <h2 className="text-lg font-bold text-white mb-4">
              Specifications
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(product.specs).map(([key, value]) =>
                value ? (
                  <div
                    key={key}
                    className="rounded-xl p-3"
                    style={{ backgroundColor: "#1f2937" }}
                  >
                    <p className="text-xs text-gray-500 capitalize mb-1">{key}</p>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* reviews */}
        <div
          className="rounded-2xl p-6 border border-gray-800"
          style={{ backgroundColor: "#111827" }}
        >
          <h2 className="text-lg font-bold text-white mb-6">
            Reviews {reviews.length > 0 && `(${reviews.length})`}
          </h2>

          {/* write review */}
          <div
            className="rounded-xl p-4 mb-6 border border-gray-800"
            style={{ backgroundColor: "#1f2937" }}
          >
            <p className="text-sm font-semibold text-gray-300 mb-3">
              Write a review
            </p>

            {/* star selector */}
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setStars(star)}
                  className={`text-2xl transition ${
                    star <= stars ? "text-yellow-400" : "text-gray-700"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              placeholder="Share your experience (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 resize-none mb-3 border border-gray-700"
              style={{ backgroundColor: "#111827" }}
            />

            {reviewError && (
              <p className="text-red-400 text-sm mb-3">{reviewError}</p>
            )}

            <button
              onClick={handleReviewSubmit}
              disabled={reviewLoading}
              className="bg-blue-500 hover:bg-blue-400 disabled:bg-blue-900 text-white text-sm font-semibold px-6 py-2 rounded-xl transition"
            >
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </button>
          </div>

          {/* reviews list */}
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-gray-800 pb-4 last:border-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-white">
                      {review.user.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${
                          star <= review.stars
                            ? "text-yellow-400"
                            : "text-gray-700"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-400">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}