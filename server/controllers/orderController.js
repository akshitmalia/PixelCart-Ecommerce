import Order from "../models/Order.js";
import Razorpay from "razorpay";

// CREATE RAZORPAY ORDER
async function createOrder(req, res) {
  try {
    const { items, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in cart" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: totalPrice * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const order = await Order.create({
      user: req.user._id,
      items,
      totalPrice,
      razorpayOrderId: razorpayOrder.id,
    });

    res.status(201).json({
      message: "Order created",
      order,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// VERIFY PAYMENT
async function verifyPayment(req, res) {
  try {
    const { razorpayOrderId, razorpayPaymentId } = req.body;

    const order = await Order.findOne({ razorpayOrderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "paid";
    order.razorpayPaymentId = razorpayPaymentId;
    order.status = "confirmed";
    await order.save();

    res.status(200).json({ message: "Payment verified successfully", order });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// GET USER ORDERS
async function getUserOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name images price");

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// GET ALL ORDERS - admin only
async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("items.product", "name price");

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export { createOrder, verifyPayment, getUserOrders, getAllOrders };