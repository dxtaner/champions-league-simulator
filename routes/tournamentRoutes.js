const express = require("express");
const router = express.Router();
const tournamentController = require("../controllers/tournamentController");

router.get("/", tournamentController.getHome);
router.get("/league", tournamentController.getLeagueTable);
router.get("/knockout", tournamentController.getKnockoutPage);
router.post("/start-season", tournamentController.startNewSeason);
router.post("/simulate-all", tournamentController.simulateAllMatches);
router.post(
  "/knockout/generate-playoffs",
  tournamentController.generatePlayoffs,
);
router.post(
  "/knockout/generate-round-of-16",
  tournamentController.generateRoundOf16,
);
router.post(
  "/knockout/generate-quarter",
  tournamentController.generateQuarterFinals,
);
router.post("/knockout/generate-semi", tournamentController.generateSemiFinals);
router.post("/knockout/generate-final", tournamentController.generateFinal);
router.post(
  "/knockout/simulate-stage",
  tournamentController.simulateKnockoutStage,
);

module.exports = router;
