module.exports = function applyDiscount(req, res, next) {

  let couponCode = null;

  // Coupon GET se aya ho
  if (req.query && req.query.coupon) {
    couponCode = req.query.coupon;
  }

  // Coupon POST form se aya ho
  if (req.body && req.body.coupon) {
    couponCode = req.body.coupon;
  }

  // Default values
  req.discount = 0;
  req.discountedTotal = req.total;

  // Apply discount
  if (couponCode === "SAVE10") {
    req.discount = req.total * 0.10;
    req.discountedTotal = req.total - req.discount;
  }

  next();
};
