"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderboard_controller_1 = require("../controllers/leaderboard.controller");
const leaderboardRoutes = (0, express_1.Router)();
leaderboardRoutes.get("/", leaderboard_controller_1.getLeaderboardRanking);
exports.default = leaderboardRoutes;
