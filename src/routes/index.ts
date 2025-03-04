import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import trailRoutes from "./trail.routes";
import { authMiddleware } from "../middlewares/auth.middleware";
import lessonRoutes from "./lesson.routes";
import leaderboardRoutes from "./leaderboard";
import missionRoutes from "./mission.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/trail", trailRoutes);
router.use("/lesson", authMiddleware, lessonRoutes);
router.use("/leaderboard", authMiddleware, leaderboardRoutes);
router.use("/mission", authMiddleware, missionRoutes);

export default router;
