const Team = require("../models/Team");

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({ rating: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
