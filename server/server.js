import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import DB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import { notFound, errorHandler } from "./middleware/authMiddleware.js";

dotenv.config();

DB();

const app=express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

const PORT=process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.json({"message":"API running fine"});
});

app.use("/api/auth", authRoutes); //contains all the 4-5 endpoints with http://localhost:5000/api/auth/register and /signout etc.
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products/:id/reviews", reviewRoutes);


app.use(notFound);
app.use(errorHandler);


app.listen(PORT,()=>{
    console.log(`Server is Running on Port: ${PORT} so is Akshit !!!`);
});