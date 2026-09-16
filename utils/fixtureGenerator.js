exports.generateSwissLeagueFixture = (teams) => {
  const fixtures = [];
  const matchdayCount = 8;
  const numTeams = teams.length;

  if (numTeams < 2) return [];

  for (let matchday = 1; matchday <= matchdayCount; matchday++) {
    const shuffled = [...teams].sort(() => 0.5 - Math.random());

    for (let i = 0; i < shuffled.length; i += 2) {
      if (i + 1 < shuffled.length) {
        fixtures.push({
          homeTeam: shuffled[i]._id,
          awayTeam: shuffled[i + 1]._id,
          matchday: matchday,
          stage: "LEAGUE",
          played: false,
        });
      }
    }
  }

  return fixtures;
};
