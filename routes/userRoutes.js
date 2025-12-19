const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Booking schema
const bookingSchema = new mongoose.Schema({
    service: String,
    name: String,
    email: String,
    phone: String,
    address: String,
    date: String,
    time: String
});

const Booking = mongoose.model("Booking", bookingSchema);

// CREATE booking
router.post("/create", async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        const saved = await newBooking.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error saving booking" });
    }
});

// READ all bookings
router.get("/all", async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ _id: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching bookings" });
    }
});

// UPDATE booking
router.put("/update/:id", async (req, res) => {
    try {
        const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating booking" });
    }
});

// DELETE booking
router.delete("/delete/:id", async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: "Booking deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting booking" });
    }
});

module.exports = router;
