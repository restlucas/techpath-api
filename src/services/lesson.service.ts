import { Prisma, Question } from "@prisma/client";
import prisma from "../lib/prisma";
import { startOfWeek } from "../utils/weekDate";
import { updateMissionsProgress } from "../utils/updateMission";
import { adjustNowDate } from "../utils/adjustNowDate";

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

    return { ...lesson, trailSlug };
  },

  async addResult({
    lessonId,
    userId,
    completed,
    totalXpEarned,
  }: CompletedLessonData) {
    const now = adjustNowDate();
    const weekStart = startOfWeek(now);

    // 🔹 Obter informações do usuário (XP, streak e última atividade)
    const userInfo = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { totalXp: true, streak: true, lastActivity: true },
    });

    // 🔹 Calcular streak (apenas se o usuário jogou no dia anterior)
    const lastActivity = userInfo.lastActivity;
    const yesterday = adjustNowDate();
    yesterday.setDate(yesterday.getDate() - 1);

    const isYesterday =
      lastActivity &&
      yesterday.getFullYear() === lastActivity.getFullYear() &&
      yesterday.getMonth() === lastActivity.getMonth() &&
      yesterday.getDate() === lastActivity.getDate();

    const newStreak = isYesterday ? userInfo.streak + 1 : 1;

    // 🔹 Atualizar XP, streak e última atividade
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalXp: userInfo.totalXp + totalXpEarned,
        streak: newStreak,
        lastActivity: now,
      },
    });

    // 🔹 Salvar progresso da lição
    const userLessonProgress = await prisma.userLessonProgress.create({
      data: {
        lessonId,
        userId,
        completed,
      },
    });

    // 🔹 Buscar módulo da lição
    const lesson = await prisma.lesson.findUniqueOrThrow({
      where: { id: lessonId },
      select: { topic: { select: { moduleId: true } } },
    });

    const moduleId = lesson.topic.moduleId;

    const totalLessons = await prisma.lesson.count({
      where: {
        topic: {
          moduleId: moduleId,
        },
      },
    });

    const completedLessons = await prisma.userLessonProgress.count({
      where: {
        userId: userId,
        lesson: {
          topic: {
            moduleId: moduleId,
          },
        },
        completed: true,
      },
    });

    // 🔹 Se todas as lições do módulo foram completadas, marcar o módulo como completo
    if (completedLessons === totalLessons) {
      await prisma.userModuleProgress.upsert({
        where: { userId_moduleId: { userId, moduleId } },
        update: { completed: true },
        create: { userId, moduleId, completed: true },
      });

      // 🔹 Desbloquear o próximo módulo (melhorado para pegar o próximo na ordem correta)
      const nextModule = await prisma.module.findFirst({
        where: {
          trail: {
            modules: {
              some: { id: moduleId },
            },
          },
        },
        orderBy: { id: "asc" },
        cursor: { id: moduleId },
        skip: 1,
      });

      if (nextModule) {
        await prisma.userModuleProgress.upsert({
          where: { userId_moduleId: { userId, moduleId: nextModule.id } },
          update: { unlocked: true },
          create: { userId, moduleId: nextModule.id, unlocked: true },
        });
      }
    }

    const totalXpGainedByMissions = await updateMissionsProgress(
      userId,
      lessonId,
      totalXpEarned
    );

    const totalXpGained = totalXpEarned + totalXpGainedByMissions;

    await prisma.leaderboard.upsert({
      where: { userId_weekStart: { userId, weekStart } },
      update: { xpEarned: { increment: totalXpGained } },
      create: { userId, weekStart, xpEarned: totalXpGained },
    });

    return userLessonProgress;
  },
};

export default lessonService;
