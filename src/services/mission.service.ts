import prisma from "../lib/prisma";

const missionService = {
  async getMissionsByUser(userId: string) {
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    const lastMonday = new Date(now);
    lastMonday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    lastMonday.setHours(0, 0, 0, 0);

    const nextMonday = new Date(lastMonday);
    nextMonday.setDate(lastMonday.getDate() + 7);
    nextMonday.setHours(23, 59, 59, 999);

    const missions = await prisma.userMission.findMany({
      where: {
        userId,
        OR: [
          {
            mission: {
              frequency: "DAILY",
            },
            createdAt: {
              gte: startOfToday,
              lte: endOfToday,
            },
          },
          {
            mission: {
              frequency: "WEEKLY",
            },
            createdAt: {
              gte: lastMonday,
              lte: nextMonday,
            },
          },
        ],
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
