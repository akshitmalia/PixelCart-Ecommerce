export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

export interface Product {
  _id: string;
  name: string;
  brand: string;
  category: "mobile" | "laptop";
  price: number;
  stock: number;
  description: string;
  images: string[];
  specs: {
    ram?: string;
    storage?: string;
    processor?: string;
    display?: string;
    battery?: string;
    os?: string;
  };
  ratings: {
    average: number;
    count: number;
  };
}

export interface CartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  items: CartItem[];
  totalPrice: number;
  paymentStatus: "pending" | "paid";
  status: "processing" | "confirmed";
  createdAt: string;
}