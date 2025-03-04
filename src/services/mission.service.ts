import prisma from "../lib/prisma";

const missionService = {
  async getMissionsByUser(userId: string) {
    const missions = await prisma.userMission.findMany({
      where: {
        userId,
      },
      select: {
        completed: true,
        progress: true,
        mission: {
          select: {
            id: true,
            title: true,
            description: true,
            goalType: true,
            goalValue: true,
            rewardXp: true,
            frequency: true,
          },
        },
      },
    });

    return missions;
  },
};

export default missionService;
