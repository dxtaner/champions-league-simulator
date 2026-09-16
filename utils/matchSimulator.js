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

exports.simulateMatch = async (matchId) => {
  const match = await Match.findById(matchId);
  if (!match || match.played) return;

  const homeTeam = await Team.findById(match.homeTeam);
  const awayTeam = await Team.findById(match.awayTeam);

  const homePower = homeTeam.rating + 5;
  const awayPower = awayTeam.rating;

  const homeExpectedGoals = Math.max(0.5, (homePower / awayPower) * 1.3);
  const awayExpectedGoals = Math.max(0.3, (awayPower / homePower) * 1.0);

  const homeScore = generateGoals(homeExpectedGoals);
  const awayScore = generateGoals(awayExpectedGoals);

  match.homeScore = homeScore;
  match.awayScore = awayScore;
  match.played = true;
  await match.save();

  homeTeam.played += 1;
  awayTeam.played += 1;
  homeTeam.goalsFor += homeScore;
  homeTeam.goalsAgainst += awayScore;
  awayTeam.goalsFor += awayScore;
  awayTeam.goalsAgainst += homeScore;

  if (homeScore > awayScore) {
    homeTeam.wins += 1;
    homeTeam.points += 3;
    awayTeam.losses += 1;
  } else if (homeScore < awayScore) {
    awayTeam.wins += 1;
    awayTeam.points += 3;
    homeTeam.losses += 1;
  } else {
    homeTeam.draws += 1;
    awayTeam.draws += 1;
    homeTeam.points += 1;
    awayTeam.points += 1;
  }

  await homeTeam.save();
  await awayTeam.save();
};
