import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import trailRoutes from "./trail.routes";
import { authMiddleware } from "../middlewares/auth.middleware";
import lessonRoutes from "./lesson.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/trail", authMiddleware, trailRoutes);
router.use("/lesson", lessonRoutes);

export default router;
