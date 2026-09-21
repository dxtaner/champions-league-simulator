const Match = require("../models/Match");
const Team = require("../models/Team");

const generateGoals = (lambda) => {
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
};

const simulatePenalties = () => {
  let homePen = 0;
  let awayPen = 0;

  for (let i = 0; i < 5; i++) {
    if (Math.random() > 0.25) homePen++;
    if (Math.random() > 0.25) awayPen++;
  }

  while (homePen === awayPen) {
    if (Math.random() > 0.3) homePen++;
    if (Math.random() > 0.3) awayPen++;
  }

  return { homePen, awayPen };
};

exports.simulateKnockoutMatch = async (matchId) => {
  const match = await Match.findById(matchId);
  if (!match || match.played) return;

  const homeTeam = await Team.findById(match.homeTeam);
  const awayTeam = await Team.findById(match.awayTeam);

  const homePower = homeTeam.rating + 4; // Ev sahibi avantajı
  const awayPower = awayTeam.rating;

  let homeScore = generateGoals(Math.max(0.4, (homePower / awayPower) * 1.2));
  let awayScore = generateGoals(Math.max(0.3, (awayPower / homePower) * 1.0));

  if (match.stage === "FINAL") {
    if (homeScore === awayScore) {
      if (Math.random() > 0.5) homeScore += 1;
      if (Math.random() > 0.5) awayScore += 1;

      if (homeScore === awayScore) {
        const { homePen, awayPen } = simulatePenalties();
        match.penaltyHome = homePen;
        match.penaltyAway = awayPen;
        match.winner = homePen > awayPen ? homeTeam._id : awayTeam._id;
      }
    }

    if (!match.winner) {
      match.winner = homeScore > awayScore ? homeTeam._id : awayTeam._id;
    }
  } else if (match.leg === 2) {
    const firstLeg = await Match.findOne({
      stage: match.stage,
      leg: 1,
      $or: [
        { homeTeam: match.homeTeam, awayTeam: match.awayTeam },
        { homeTeam: match.awayTeam, awayTeam: match.homeTeam },
      ],
    });

    if (firstLeg) {
      let currentHomeLeg1Goals = 0;
      let currentAwayLeg1Goals = 0;

      if (firstLeg.homeTeam.toString() === match.homeTeam.toString()) {
        currentHomeLeg1Goals = firstLeg.homeScore;
        currentAwayLeg1Goals = firstLeg.awayScore;
      } else {
        currentHomeLeg1Goals = firstLeg.awayScore;
        currentAwayLeg1Goals = firstLeg.homeScore;
      }

      let aggHome = homeScore + currentHomeLeg1Goals;
      let aggAway = awayScore + currentAwayLeg1Goals;

      if (aggHome === aggAway) {
        if (Math.random() > 0.5) homeScore += 1;
        if (Math.random() > 0.5) awayScore += 1;

        aggHome = homeScore + currentHomeLeg1Goals;
        aggAway = awayScore + currentAwayLeg1Goals;

        if (aggHome === aggAway) {
          const { homePen, awayPen } = simulatePenalties();
          match.penaltyHome = homePen;
          match.penaltyAway = awayPen;
          match.winner = homePen > awayPen ? homeTeam._id : awayTeam._id;
        }
      }

      if (!match.winner) {
        match.winner = aggHome > aggAway ? homeTeam._id : awayTeam._id;
      }

      firstLeg.winner = match.winner;
      await firstLeg.save();
    }
  }

  match.homeScore = homeScore;
  match.awayScore = awayScore;
  match.played = true;

  await match.save();
};
