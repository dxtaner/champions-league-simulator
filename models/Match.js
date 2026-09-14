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
    required: true,
  },

  played: {
    type: Boolean,
    default: false,
  },

  stage: {
    type: String,
    default: "LEAGUE",
  },
});

module.exports = mongoose.model("Match", matchSchema);
