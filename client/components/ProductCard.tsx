import Link from "next/link";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product._id}`}>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 hover:shadow-xl hover:shadow-black/20 transition cursor-pointer group">

        <div className="bg-gray-800 h-52 flex items-center justify-center overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <span className="text-5xl">
              {product.category === "mobile" ? "📱" : "💻"}
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.brand}</p>
          <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{product.name}</h3>

          {product.ratings.count > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-xs text-gray-500">
                {product.ratings.average} ({product.ratings.count})
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <p className="text-blue-400 font-bold">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              product.stock > 0
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}