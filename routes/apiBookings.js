const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// CREATE A BOOKING
router.post("/create", async (req, res) => {
    try {
        console.log("Incoming booking data:", req.body);

        const booking = new Booking(req.body);
        await booking.save();

        res.json({ success: true, booking });
    } catch (err) {
        console.error("Error creating booking:", err);
        res.status(500).json({ error: "Error creating booking" });
    }
});

// READ ALL BOOKINGS
router.get("/all", async (req, res) => {
    try {
        const list = await Booking.find().sort({ createdAt: -1 });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: "Error fetching bookings" });
    }
});

// UPDATE BOOKING
router.put("/update/:id", async (req, res) => {
    try {
        const updated = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Error updating booking" });
    }
});

// DELETE BOOKING
router.delete("/delete/:id", async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Error deleting booking" });
    }
});

module.exports = router;
