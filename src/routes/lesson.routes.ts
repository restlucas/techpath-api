import { Router } from "express";
import {
  addLessonResults,
  fetchLessonByTopic,
} from "../controllers/lesson.controller";

const lessonRoutes = Router();

lessonRoutes.get("/:topicSlug", fetchLessonByTopic);
lessonRoutes.post("/:lessonId/results", addLessonResults);

export default lessonRoutes;
