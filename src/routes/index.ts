import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import trailRoutes from "./trail.routes";
import { authMiddleware } from "../middlewares/auth.middleware";
import lessonRoutes from "./lesson.routes";
import leaderboardRoutes from "./leaderboard";
import missionRoutes from "./mission.routes";
import { updateMissionsProgress } from "../utils/updateMission";

const router = Router();

router.use("/auth", authRoutes);
router.use("/trail", authMiddleware, trailRoutes);
router.use("/user", authMiddleware, userRoutes);
router.use("/lesson", authMiddleware, lessonRoutes);
router.use("/leaderboard", authMiddleware, leaderboardRoutes);
router.use("/mission", authMiddleware, missionRoutes);

export default router;
