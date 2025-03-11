"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lesson_controller_1 = require("../controllers/lesson.controller");
const lessonRoutes = (0, express_1.Router)();
lessonRoutes.get("/:topicSlug", lesson_controller_1.fetchLessonByTopic);
lessonRoutes.post("/:lessonId/results", lesson_controller_1.addLessonResults);
exports.default = lessonRoutes;
