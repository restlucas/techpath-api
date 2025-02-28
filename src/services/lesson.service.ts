import { Prisma, Question } from "@prisma/client";
import prisma from "../lib/prisma";

type CompletedLessonData = {
  lessonId: string;
  userId: string;
  completed: boolean;
  totalXpEarned: number;
};

const lessonService = {
  async getLesson(topicSlug: string, userId: string) {
    const trail = await prisma.topic.findFirst({
      where: { slug: topicSlug },
      select: {
        module: {
          select: {
            trail: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });

    const trailSlug = trail?.module.trail.slug;

    const lesson = await prisma.lesson.findFirst({
      where: {
        topic: {
          slug: topicSlug,
        },
        OR: [
          {
            usersProgress: {
              none: {
                userId,
              },
            },
          },
          {
            usersProgress: {
              some: {
                userId,
                completed: false,
              },
            },
          },
        ],
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (lesson) {
      lesson.questions = lesson.questions
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
    }

    return { ...lesson, trailSlug };
  },
  async addResult({
    lessonId,
    userId,
    completed,
    totalXpEarned,
  }: CompletedLessonData) {
    // Get user total xp
    const userInfo = (await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        totalXp: true,
        streak: true,
        lastActivity: true,
      },
    })) as { totalXp: number; streak: number; lastActivity: Date | null };

    // Get user last activity and calculate streak
    const now = new Date();
    const lastActivity = userInfo.lastActivity;
    const isSameDay =
      lastActivity &&
      now.getFullYear() === lastActivity.getFullYear() &&
      now.getMonth() === lastActivity.getMonth() &&
      now.getDate() === lastActivity.getDate();
    const newStreak = isSameDay ? userInfo.streak : userInfo.streak + 1;

    // Update user xp, streak and last activity
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        totalXp: userInfo.totalXp + totalXpEarned,
        streak: newStreak,
        lastActivity: now,
      },
    });

    const userLessonProgress = await prisma.userLessonProgress.create({
      data: {
        lessonId,
        userId,
        completed,
      },
    });

    return userLessonProgress;
  },
};

export default lessonService;
