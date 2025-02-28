import { Request, Response } from "express";
import responseHandler from "../utils/responseHandler";
import lessonService from "../services/lesson.service";

export const fetchLessonByTopic = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const { topicSlug } = req.params;
  const userId = req.headers["x-user-id"] as string;

  const lessonResponse = await lessonService.getLesson(topicSlug, userId);

  responseHandler.success(res, "Lesson retrieved successfully", lessonResponse);
};

export const addLessonResults = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const { lessonId } = req.params;
  const { totalXpEarned, completed, userId } = req.body;

  const userProgress = await lessonService.addResult({
    lessonId,
    userId,
    completed,
    totalXpEarned,
  });

  responseHandler.success(res, "Lesson retrieved successfully", userProgress);
};
