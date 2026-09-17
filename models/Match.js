const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  homeScore: {
    type: Number,
    default: null,
  },
  awayScore: {
    type: Number,
    default: null,
  },
  matchday: {
    type: Number,
    default: 0,
  },
  played: {
    type: Boolean,
    default: false,
  },
  stage: {
    type: String,
    enum: [
      "LEAGUE",
      "PLAYOFF",
      "ROUND_OF_16",
      "QUARTER_FINAL",
      "SEMI_FINAL",
      "FINAL",
    ],
    default: "LEAGUE",
  },
  leg: {
    type: Number,
    default: 1,
  },
  penaltyHome: {
    type: Number,
    default: null,
  },
  penaltyAway: {
    type: Number,
    default: null,
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    default: null,
  },
});

module.exports = mongoose.model("Match", matchSchema);
