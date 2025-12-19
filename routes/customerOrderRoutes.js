const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Form show
router.get("/my-orders", (req, res) => {
  res.render("order/my-orders-form");
});

// Orders show
router.post("/my-orders", async (req, res) => {
  const { email } = req.body;

  const orders = await Order.find({ email });

  res.render("order/my-orders", { orders, email });
});

module.exports = router;
