import express from "express";
import { createReview, getProductReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", getProductReviews);
router.post("/", protect, createReview);

export default router;