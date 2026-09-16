const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const tournamentRoutes = require("./routes/tournamentRoutes");
const matchRoutes = require("./routes/matchRoutes");
const teamRoutes = require("./routes/teamRoutes");

dotenv.config();

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", tournamentRoutes);
app.use("/matches", matchRoutes);
app.use("/teams", teamRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
