const express = require("express");
const router = express.Router();
const tournamentController = require("../controllers/tournamentController");

router.get("/", tournamentController.getHome);
router.get("/league", tournamentController.getLeagueTable);
router.get("/knockout", tournamentController.getKnockoutPage);
router.post("/start-season", tournamentController.startNewSeason);
router.post("/simulate-all", tournamentController.simulateAllMatches);

module.exports = router;
