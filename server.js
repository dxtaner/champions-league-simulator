const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/league", (req, res) => {
  res.render("league");
});

app.get("/matches", (req, res) => {
  res.render("matches");
});

app.get("/knockout", (req, res) => {
  res.render("knockout");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
