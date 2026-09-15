const Match = require("../models/Match");
const { simulateMatch } = require("../utils/matchSimulator");

exports.getMatchesByMatchday = async (req, res) => {
  try {
    const matchday = req.params.matchday || 1;
    const matches = await Match.find({ matchday }).populate(
      "homeTeam awayTeam",
    );

    res.render("matches", { matches, currentMatchday: Number(matchday) });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.simulateMatchday = async (req, res) => {
  try {
    const { matchday } = req.params;
    const matches = await Match.find({ matchday, played: false });

    for (const match of matches) {
      await simulateMatch(match._id);
    }

    res.redirect(`/matches/${matchday}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
