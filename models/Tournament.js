const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "UEFA Champions League",
  },
  currentMatchday: {
    type: Number,
    default: 1,
  },
  stage: {
    type: String,
    enum: ["LEAGUE", "KNOCKOUT", "COMPLETED"],
    default: "LEAGUE",
  },
  isFinished: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Tournament", tournamentSchema);
