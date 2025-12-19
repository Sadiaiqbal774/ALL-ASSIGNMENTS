const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "labfinal",
  resave: false,
  saveUninitialized: true
}));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/admin", require("./routes/adminOrderRoutes"));

app.listen(3000, () => console.log("Server running on 3000"));
