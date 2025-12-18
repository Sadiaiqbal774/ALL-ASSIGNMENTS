// routes/apiProducts.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");

/* =========================
   FRONTEND: LIST PRODUCTS
   GET /api/products/list
========================= */
router.get("/list", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products
    });
  } catch (err) {
    console.error("LIST error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   ADMIN: READ ALL PRODUCTS
   GET /api/products/all
========================= */
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to load products" });
  }
});

/* =========================
   ADMIN: CREATE PRODUCT
   POST /api/products
========================= */
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    console.error("CREATE error:", err);
    res.status(400).json({ error: "Create failed" });
  }
});

/* =========================
   ADMIN: UPDATE PRODUCT
   PUT /api/products/:id
========================= */
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("UPDATE error:", err);
    res.status(400).json({ error: "Update failed" });
  }
});

/* =========================
   ADMIN: DELETE PRODUCT
   DELETE /api/products/:id
========================= */
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(400).json({ error: "Delete failed" });
  }
});

/* =========================
   READ SINGLE PRODUCT
   GET /api/products/:id
========================= */
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
