import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ["mobile", "laptop"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
  specs: {
    ram: String,
    storage: String,
    processor: String,
    display: String,
    battery: String,
    os: String,
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
},
{
  timestamps: true,
});

const Product = mongoose.model("Product", productSchema);
export default Product;