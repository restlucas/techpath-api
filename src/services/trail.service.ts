import prisma from "../lib/prisma";

const trailService = {
  async getAll() {
    const response = await prisma.trail.findMany();
    return response;
  },

  async getTrail(trailSlug: string, userId: string) {
    const response = await prisma.trail.findFirst({
      where: { slug: trailSlug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        tags: true,
        modules: {
          select: {
            id: true,
            name: true,
            description: true,
            topics: {
              select: {
                id: true,
                slug: true,
                name: true,
                description: true,
                lessons: {
                  select: {
                    id: true,
                    questions: {
                      select: {
                        xp: true,
                      },
                    },
                    usersProgress: {
                      where: { userId, completed: true },
                      select: { id: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!response) return null;

    const modulesWithTopicsStats = await Promise.all(
      response.modules.map(async (module) => {
        const userModuleProgress = await prisma.userModuleProgress.findFirst({
          where: { userId, moduleId: module.id },
          select: { unlocked: true },
        });

        const unlocked = userModuleProgress?.unlocked || false;

        const topicsWithStats = module.topics.map((topic) => {
          const totalLessons = topic.lessons.length;
          const totalXp = topic.lessons.reduce((lessonSum, lesson) => {
            return (
              lessonSum +
              lesson.questions.reduce(
                (questionSum, question) => questionSum + question.xp,
                0
              )
            );
          }, 0);

          const totalLessonsCompleted = topic.lessons.filter(
            (lesson) => lesson.usersProgress.length > 0
          ).length;

          return {
            id: topic.id,
            name: topic.name,
            slug: topic.slug,
            description: topic.description,
            totalLessons,
            totalLessonsCompleted,
            totalXp,
          };
        });

        return {
          id: module.id,
          name: module.name,
          description: module.description,
          unlocked,
          topics: topicsWithStats,
        };
      })
    );

    return { ...response, modules: modulesWithTopicsStats };
  },

  async getTrailsProgressByUser(userId: string) {
    const trails = await prisma.trail.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        modules: {
          select: { id: true },
        },
      },
    });

    const moduleIds = trails.flatMap((trail) =>
      trail.modules.map((module) => module.id)
    );

    if (moduleIds.length === 0) return [];

    const userCompletedModules = await prisma.userModuleProgress.findMany({
      where: {
        userId,
        moduleId: { in: moduleIds },
        completed: true,
      },
      select: {
        moduleId: true,
      },
    });

    const completedModuleIds = new Set(
      userCompletedModules.map((um) => um.moduleId)
    );

    return trails.map(({ id, name, slug, modules }) => {
      const isCompleted = modules.every((module) =>
        completedModuleIds.has(module.id)
      );
      return { id, name, slug, completed: isCompleted };
    });
  },
};

export default trailService;
