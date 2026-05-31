import Review from "../models/review.js";
import Product from "../models/product.js";

// CREATing REVIEW - logged in users only
async function createReview(req, res) {
  try {
    const { stars, comment } = req.body;
    const productId = req.params.id;

    if (!stars) {
      return res.status(400).json({ message: "Stars rating is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      stars,
      comment,
    });

    // update product average rating
    const allReviews = await Review.find({ product: productId });
    const average = allReviews.reduce((acc, r) => acc + r.stars, 0) / allReviews.length;

    product.ratings.average = Math.round(average * 10) / 10;
    product.ratings.count = allReviews.length;
    await product.save();

    res.status(201).json({ message: "Review added successfully", review });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}


////////----------------------------------------------------------------------------------------////////



// GET ALL REVIEWS FOR A PRODUCT - public
async function getProductReviews(req, res) {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate("user", "username");

    res.status(200).json(reviews);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export { createReview, getProductReviews };