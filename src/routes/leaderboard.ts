import { Router } from "express";
import { getLeaderboardRanking } from "../controllers/leaderboard.controller";

const leaderboardRoutes = Router();

leaderboardRoutes.get("/", getLeaderboardRanking);

export default leaderboardRoutes;
