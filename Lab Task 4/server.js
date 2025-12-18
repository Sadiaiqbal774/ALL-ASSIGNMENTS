const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Public folder
app.use(express.static(__dirname + "/public"));

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB Error:", err));

// API Routes
app.use("/api/bookings", require("./routes/apiBookings"));
app.use("/api/products", require("./routes/apiProducts"));

// Pages
app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));
app.get("/checkout", (req, res) => res.sendFile(__dirname + "/public/checkout.html"));
app.get("/crud", (req, res) => res.sendFile(__dirname + "/public/crud.html"));
app.get("/success", (req, res) => res.sendFile(__dirname + "/public/success.html"));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
