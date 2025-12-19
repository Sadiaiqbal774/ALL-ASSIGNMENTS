const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Admin - View all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render("admin/orders", { orders });
  } catch (err) {
    res.send("Error loading orders");
  }
});

// Update order status (Placed → Processing → Delivered)
router.post("/orders/:id/status", async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order.status === "Placed") order.status = "Processing";
  else if (order.status === "Processing") order.status = "Delivered";

  await order.save();
  res.redirect("/admin/orders");
});

module.exports = router;
