import cron from "node-cron";
import prisma from "../lib/prisma";

async function resetDailyMissions() {
  console.log("⏳ Resetando missões diárias...");

  const users = await prisma.user.findMany();
  const dailyMissions = await prisma.mission.findMany({
    where: { frequency: "DAILY" },
  });

  for (const user of users) {
    for (const mission of dailyMissions) {
      await prisma.userMission.create({
        data: {
          userId: user.id,
          missionId: mission.id,
          progress: 0,
          completed: false,
        },
      });
    }
  }

  console.log("✅ Missões diárias redefinidas com sucesso!");
}

async function resetWeeklyMissions() {
  console.log("⏳ Resetando missões semanais...");

  const users = await prisma.user.findMany();
  const weeklyMissions = await prisma.mission.findMany({
    where: { frequency: "WEEKLY" },
  });

  for (const user of users) {
    for (const mission of weeklyMissions) {
      await prisma.userMission.create({
        data: {
          userId: user.id,
          missionId: mission.id,
          progress: 0,
          completed: false,
        },
      });
    }
  }

  console.log("✅ Missões semanais redefinidas com sucesso!");
}

// Agendar a execução do cron job
// ⏰ Reset diário às 00:00 (meia-noite)
cron.schedule("0 0 * * *", async () => {
  await resetDailyMissions();
});

// ⏰ Reset semanal toda segunda-feira às 00:00
cron.schedule("0 0 * * 1", async () => {
  await resetWeeklyMissions();
});
