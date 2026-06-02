import Product from "../models/Product.js";

async function getAllProducts(req, res) {
  try {
    const { category, brand, sort } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    let products = await Product.find(filter);

    if (sort === "price-low") {
      products = products.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      products = products.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      products = products.sort((a, b) => b.ratings.average - a.ratings.average);
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getSingleProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function createProduct(req, res) {
  try {
    const { name, brand, category, price, stock, description, images, specs } = req.body;

    if (!name || !brand || !category || !price) {
      return res.status(400).json({ message: "Name, brand, category and price are required" });
    }

    const product = await Product.create({
      name,
      brand,
      category,
      price,
      stock,
      description,
      images,
      specs,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export { getAllProducts, getSingleProduct, createProduct, updateProduct, deleteProduct };