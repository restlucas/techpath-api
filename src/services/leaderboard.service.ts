import prisma from "../lib/prisma";
import { startOfWeek } from "../utils/weekDate";

const leaderboardService = {
  async getLeaderboard() {
    const weekStart = startOfWeek(new Date());

    const leaderboard = await prisma.leaderboard.findMany({
      where: { weekStart },
      orderBy: { xpEarned: "desc" },
      take: 10,
      include: {
        user: { select: { name: true, image: true, username: true } },
      },
    });

    return leaderboard;
  },
};

export default leaderboardService;
