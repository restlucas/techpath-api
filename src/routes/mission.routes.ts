import { Router } from "express";
import { listMissions } from "../controllers/mission.controller";

const missionRoutes = Router();

missionRoutes.get("/", listMissions);

export default missionRoutes;
