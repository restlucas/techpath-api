import { Router } from "express";
import {
  listAll,
  fetchTrail,
  fetchTrailsProgressByUser,
} from "../controllers/trail.controller";

const trailRoutes = Router();

trailRoutes.get("/", listAll);
trailRoutes.get("/:trailSlug", fetchTrail);
trailRoutes.get("/progress/user", fetchTrailsProgressByUser);

export default trailRoutes;
