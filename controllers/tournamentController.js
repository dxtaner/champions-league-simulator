const Team = require("../models/Team");
const Match = require("../models/Match");
const Tournament = require("../models/Tournament");
const { generateSwissLeagueFixture } = require("../utils/fixtureGenerator");
const { simulateMatch } = require("../utils/matchSimulator");

exports.getHome = (req, res) => {
  res.render("index");
};

exports.getLeagueTable = async (req, res) => {
  try {
    const teams = await Team.find().sort({
      points: -1,
      goalsFor: -1,
      wins: -1,
    });
    res.render("league", { teams });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.startNewSeason = async (req, res) => {
  try {
    await Match.deleteMany({});
    await Tournament.deleteMany({});

    await Team.updateMany(
      {},
      {
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
      },
    );

    const teams = await Team.find();
    const fixtures = generateSwissLeagueFixture(teams);
    await Match.insertMany(fixtures);

    await Tournament.create({ currentMatchday: 1, stage: "LEAGUE" });

    res.redirect("/league");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.simulateAllMatches = async (req, res) => {
  try {
    const unplayedMatches = await Match.find({ played: false });

    for (const match of unplayedMatches) {
      await simulateMatch(match._id);
    }

    res.redirect("/league");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getKnockoutPage = async (req, res) => {
  try {
    res.render("knockout");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getLeagueTable = async (req, res) => {
  try {
    const teams = await Team.find();
    teams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.goalsFor - a.goalsAgainst;
      const diffB = b.goalsFor - b.goalsAgainst;
      if (diffB !== diffA) return diffB - diffA;
      return b.goalsFor - a.goalsFor;
    });
    res.render("league", { teams });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getKnockoutPage = async (req, res) => {
  try {
    const teams = await Team.find();
    teams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.goalsFor - a.goalsAgainst;
      const diffB = b.goalsFor - b.goalsAgainst;
      if (diffB !== diffA) return diffB - diffA;
      return b.goalsFor - a.goalsFor;
    });

    const playedMatchesCount = await Match.countDocuments({ played: true });
    const isSeasonStarted = playedMatchesCount > 0;

    const directQualified = teams.slice(0, 8);

    const playoffTeams = teams.slice(8, 24);
    const playoffMatchups = [];

    for (let i = 0; i < playoffTeams.length / 2; i++) {
      playoffMatchups.push({
        homeTeam: playoffTeams[i],
        awayTeam: playoffTeams[playoffTeams.length - 1 - i],
      });
    }

    const eliminatedTeams = teams.slice(24);

    res.render("knockout", {
      isSeasonStarted,
      directQualified,
      playoffMatchups,
      eliminatedTeams,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
