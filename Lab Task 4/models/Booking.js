const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    service: String,
    name: String,
    email: String,
    phone: String,
    address: String,
    addons: { type: Array, default: [] }, 
    date: String,
    time: String
  },
  {
    timestamps: true,
    strict: false  // <-- ADD THIS
  }
);

module.exports = mongoose.model("Booking", BookingSchema);
