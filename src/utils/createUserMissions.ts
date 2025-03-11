import prisma from "../lib/prisma";

export async function createUserMissions(userId: string) {
  const missions = await prisma.mission.findMany();

  if (missions.length === 0) {
    console.log("⚠️ Nenhuma missão encontrada.");
    return;
  }

  const tasks = missions.map((mission) =>
    prisma.userMission.create({
      data: {
        userId: userId,
        missionId: mission.id,
        progress: 0,
        completed: false,
      },
    })
  );

  await Promise.all(tasks);
  console.log("✅ Missões criadas com sucesso!");
}
