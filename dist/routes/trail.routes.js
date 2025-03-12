"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trail_controller_1 = require("../controllers/trail.controller");
const trailRoutes = (0, express_1.Router)();
trailRoutes.get("/", trail_controller_1.listAll);
trailRoutes.get("/:trailSlug", trail_controller_1.fetchTrail);
trailRoutes.get("/progress/user", trail_controller_1.fetchTrailsProgressByUser);
exports.default = trailRoutes;
