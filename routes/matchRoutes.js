const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");

router.get("/", matchController.getMatchesByMatchday);
router.get("/:matchday", matchController.getMatchesByMatchday);
router.post("/simulate/:matchday", matchController.simulateMatchday);

module.exports = router;
