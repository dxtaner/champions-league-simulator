const Team = require("../models/Team");
const Match = require("../models/Match");
const Tournament = require("../models/Tournament");
const { generateSwissLeagueFixture } = require("../utils/fixtureGenerator");
const { simulateMatch } = require("../utils/matchSimulator");
const { simulateKnockoutMatch } = require("../utils/knockoutSimulator");

const sortTeams = (teams) => {
  return teams.sort(
    (a, b) =>
      b.points - a.points ||
      b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst) ||
      b.goalsFor - a.goalsFor,
  );
};

exports.getHome = (req, res) => {
  res.render("index");
};

exports.getLeagueTable = async (req, res) => {
  try {
    const teams = await Team.find();
    const sortedTeams = sortTeams(teams);
    res.render("league", { teams: sortedTeams });
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
    const teams = await Team.find();
    const sortedTeams = sortTeams(teams);

    const playedMatchesCount = await Match.countDocuments({ played: true });
    const isSeasonStarted = playedMatchesCount > 0;

    const directQualified = sortedTeams.slice(0, 8);
    const playoffTeams = sortedTeams.slice(8, 24);
    const eliminatedTeams = sortedTeams.slice(24);

    const playoffMatches = await Match.find({ stage: "PLAYOFF" })
      .populate("homeTeam")
      .populate("awayTeam")
      .populate("winner");

    const roundOf16Matches = await Match.find({ stage: "ROUND_OF_16" })
      .populate("homeTeam")
      .populate("awayTeam")
      .populate("winner");

    const quarterMatches = await Match.find({ stage: "QUARTER_FINAL" })
      .populate("homeTeam")
      .populate("awayTeam")
      .populate("winner");

    const semiMatches = await Match.find({ stage: "SEMI_FINAL" })
      .populate("homeTeam")
      .populate("awayTeam")
      .populate("winner");

    const finalMatch = await Match.findOne({ stage: "FINAL" })
      .populate("homeTeam")
      .populate("awayTeam")
      .populate("winner");

    res.render("knockout", {
      isSeasonStarted,
      directQualified,
      playoffTeams,
      eliminatedTeams,
      playoffMatches: playoffMatches || [],
      roundOf16Matches: roundOf16Matches || [],
      quarterMatches: quarterMatches || [],
      semiMatches: semiMatches || [],
      finalMatch: finalMatch || null,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.generatePlayoffs = async (req, res) => {
  try {
    const teams = await Team.find();
    const sortedTeams = sortTeams(teams);
    const playoffTeams = sortedTeams.slice(8, 24);
    const matches = [];

    for (let i = 0; i < playoffTeams.length / 2; i++) {
      const teamA = playoffTeams[i];
      const teamB = playoffTeams[playoffTeams.length - 1 - i];

      matches.push({
        homeTeam: teamB._id,
        awayTeam: teamA._id,
        stage: "PLAYOFF",
        leg: 1,
      });
      matches.push({
        homeTeam: teamA._id,
        awayTeam: teamB._id,
        stage: "PLAYOFF",
        leg: 2,
      });
    }

    await Match.deleteMany({ stage: "PLAYOFF" });
    await Match.insertMany(matches);

    res.redirect("/knockout");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.generateRoundOf16 = async (req, res) => {
  try {
    const teams = await Team.find();
    const sortedTeams = sortTeams(teams);
    const top8Teams = sortedTeams.slice(0, 8);

    const playoffMatchesLeg2 = await Match.find({
      stage: "PLAYOFF",
      leg: 2,
      played: true,
    });

    const playoffWinners = playoffMatchesLeg2
      .map((m) => m.winner)
      .filter((w) => w !== null);

    if (playoffWinners.length < 8) {
      return res
        .status(400)
        .send("Please simulate all Play-off matches first.");
    }

    const matches = [];
    const shuffledPlayoffWinners = [...playoffWinners].sort(
      () => 0.5 - Math.random(),
    );

    for (let i = 0; i < 8; i++) {
      const topTeam = top8Teams[i]._id;
      const playoffWinner = shuffledPlayoffWinners[i];

      matches.push({
        homeTeam: playoffWinner,
        awayTeam: topTeam,
        stage: "ROUND_OF_16",
        leg: 1,
      });
      matches.push({
        homeTeam: topTeam,
        awayTeam: playoffWinner,
        stage: "ROUND_OF_16",
        leg: 2,
      });
    }

    await Match.deleteMany({ stage: "ROUND_OF_16" });
    await Match.insertMany(matches);

    res.redirect("/knockout");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.generateQuarterFinals = async (req, res) => {
  try {
    const r16Leg2Matches = await Match.find({
      stage: "ROUND_OF_16",
      leg: 2,
      played: true,
    });
    const winners = r16Leg2Matches.map((m) => m.winner).filter(Boolean);

    if (winners.length < 8) {
      return res
        .status(400)
        .send("Please simulate all Round of 16 matches first.");
    }

    const shuffled = [...winners].sort(() => 0.5 - Math.random());
    const matches = [];

    for (let i = 0; i < 4; i++) {
      const teamA = shuffled[i];
      const teamB = shuffled[7 - i];

      matches.push({
        homeTeam: teamA,
        awayTeam: teamB,
        stage: "QUARTER_FINAL",
        leg: 1,
      });
      matches.push({
        homeTeam: teamB,
        awayTeam: teamA,
        stage: "QUARTER_FINAL",
        leg: 2,
      });
    }

    await Match.deleteMany({ stage: "QUARTER_FINAL" });
    await Match.insertMany(matches);
    res.redirect("/knockout");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.generateSemiFinals = async (req, res) => {
  try {
    const qfLeg2Matches = await Match.find({
      stage: "QUARTER_FINAL",
      leg: 2,
      played: true,
    });
    const winners = qfLeg2Matches.map((m) => m.winner).filter(Boolean);

    if (winners.length < 4) {
      return res
        .status(400)
        .send("Please simulate all Quarter-Final matches first.");
    }

    const shuffled = [...winners].sort(() => 0.5 - Math.random());
    const matches = [];

    for (let i = 0; i < 2; i++) {
      const teamA = shuffled[i];
      const teamB = shuffled[3 - i];

      matches.push({
        homeTeam: teamA,
        awayTeam: teamB,
        stage: "SEMI_FINAL",
        leg: 1,
      });
      matches.push({
        homeTeam: teamB,
        awayTeam: teamA,
        stage: "SEMI_FINAL",
        leg: 2,
      });
    }

    await Match.deleteMany({ stage: "SEMI_FINAL" });
    await Match.insertMany(matches);
    res.redirect("/knockout");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.generateFinal = async (req, res) => {
  try {
    const sfLeg2Matches = await Match.find({
      stage: "SEMI_FINAL",
      leg: 2,
      played: true,
    });
    const winners = sfLeg2Matches.map((m) => m.winner).filter(Boolean);

    if (winners.length < 2) {
      return res
        .status(400)
        .send("Please simulate all Semi-Final matches first.");
    }

    await Match.deleteMany({ stage: "FINAL" });
    await Match.create({
      homeTeam: winners[0],
      awayTeam: winners[1],
      stage: "FINAL",
      leg: 1,
    });

    res.redirect("/knockout");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.simulateKnockoutStage = async (req, res) => {
  try {
    const { stage } = req.body;
    const unplayedMatches = await Match.find({ stage, played: false });

    for (const match of unplayedMatches) {
      await simulateKnockoutMatch(match._id);
    }

    res.redirect("/knockout");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
