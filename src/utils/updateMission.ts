import prisma from "../lib/prisma";

export async function updateMissionsProgress(userId: string) {
  console.log("🔄 Atualizando progresso das missões...");

  const userMissions = await prisma.userMission.findMany({
    where: { userId, completed: false },
    include: { mission: true },
  });

  for (const userMission of userMissions) {
    const mission = userMission.mission;

    let newProgress = userMission.progress + 1;
    let isCompleted = newProgress >= mission.goalValue;

    await prisma.userMission.update({
      where: { id: userMission.id },
      data: {
        progress: newProgress,
        completed: isCompleted,
      },
    });

    if (isCompleted) {
      console.log(`🏆 Missão concluída: ${mission.title}`);
    }
  }
}
