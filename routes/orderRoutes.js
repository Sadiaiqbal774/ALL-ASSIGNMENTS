const express = require("express");
const router = express.Router();
const applyDiscount = require("../middleware/applyDiscount");

// Dummy cart (abhi testing ke liye)
router.get("/preview", (req, res) => {

  const cart = [
    { name: "Item A", price: 100, qty: 2 },
    { name: "Item B", price: 50, qty: 1 }
  ];

  let total = 0;
  cart.forEach(i => total += i.price * i.qty);

  req.total = total;

  // Manually call middleware
  applyDiscount(req, res, () => {
    res.render("order/preview", {
      cart,
      total,
      discountedTotal: req.discountedTotal,
      discount: req.discount
    });
  });
});

router.post("/confirm", (req, res) => {
  res.send("Order Placed Successfully");
});

module.exports = router;
