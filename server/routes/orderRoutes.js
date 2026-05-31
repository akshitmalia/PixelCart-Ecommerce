import express from "express";
import {
  createOrder,
  verifyPayment,
  getUserOrders,
  getAllOrders,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);
router.get("/my-orders", protect, getUserOrders);
router.get("/all", protect, adminOnly, getAllOrders);

export default router;