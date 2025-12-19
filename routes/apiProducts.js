const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");

/* =========================
   CREATE PRODUCT
========================= */
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Create failed" });
  }
});

/* =========================
   READ ALL (ADMIN)
========================= */
router.get("/all", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

/* =========================
   UPDATE PRODUCT
========================= */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
});

/* =========================
   DELETE PRODUCT ✅ FIXED
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Delete failed" });
  }
});

/* =========================
   GET SINGLE PRODUCT
========================= */
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

module.exports = router;
