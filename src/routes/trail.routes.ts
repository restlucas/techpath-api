import { Router } from "express";
import { listAll, fetchTrail } from "../controllers/trail.controller";

const trailRoutes = Router();

trailRoutes.get("/", listAll);
trailRoutes.get("/:trailSlug", fetchTrail);

export default trailRoutes;
