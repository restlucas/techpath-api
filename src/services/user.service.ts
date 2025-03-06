import prisma from "../lib/prisma";

const userService = {
  async getByUsername(username: string) {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        streak: true,
        totalXp: true,
        createdAt: true,
      },
    });

    if (!user) return null;

    const trails = await prisma.trail.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        modules: { select: { id: true } },
      },
    });

    const moduleIds = trails.flatMap((trail) =>
      trail.modules.map((module) => module.id)
    );

    if (moduleIds.length === 0) return { ...user, trails: [] };

    const userCompletedModules = await prisma.userModuleProgress.findMany({
      where: {
        userId: user.id,
        moduleId: { in: moduleIds },
        completed: true,
      },
      select: { moduleId: true },
    });

    const completedModuleIds = new Set(
      userCompletedModules.map((um) => um.moduleId)
    );

    const trailsWithProgress = trails.map(({ id, name, slug, modules }) => {
      const isCompleted = modules.every((module) =>
        completedModuleIds.has(module.id)
      );
      return { id, name, slug, completed: isCompleted };
    });

    return { ...user, trails: trailsWithProgress };
  },

  async getFollowing(username: string) {
    const response = await prisma.user.findMany({
      where: {
        username: username,
      },
      select: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    return response;
  },

  async addFollowUser(userIdToFollow: string, userId: string) {
    const response = await prisma.userFollowing.create({
      data: {
        followedId: userIdToFollow,
        followerId: userId,
      },
    });

    return response;
  },

  async removeFollowUser(userIdToUnfollow: string, userId: string) {
    const response = await prisma.userFollowing.delete({
      where: {
        followerId_followedId: {
          followedId: userIdToUnfollow,
          followerId: userId,
        },
      },
    });

    return response;
  },
};

export default userService;
