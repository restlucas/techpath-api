"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mission_controller_1 = require("../controllers/mission.controller");
const missionRoutes = (0, express_1.Router)();
missionRoutes.get("/", mission_controller_1.listMissions);
exports.default = missionRoutes;
