import cron from "node-cron";
import prisma from "../lib/prisma";

export async function resetDailyMissions() {
  console.log("⏳ Resetando missões diárias...");

  // Exclui missões diárias não concluídas
  await prisma.userMission.deleteMany({
    where: {
      mission: { frequency: "DAILY" },
      completed: false,
    },
  });

  const users = await prisma.user.findMany();
  const dailyMissions = await prisma.mission.findMany({
    where: { frequency: "DAILY" },
  });

  if (users.length === 0 || dailyMissions.length === 0) {
    console.log("⚠️ Nenhum usuário ou missão diária encontrada.");
    return;
  }

  const tasks = users.flatMap((user) =>
    dailyMissions.map((mission) =>
      prisma.userMission.create({
        data: {
          userId: user.id,
          missionId: mission.id,
          progress: 0,
          completed: false,
        },
      })
    )
  );

  await Promise.all(tasks);
  console.log("✅ Missões diárias redefinidas com sucesso!");
}

export async function resetWeeklyMissions() {
  console.log("⏳ Resetando missões semanais...");

  // Exclui missões semanais não concluídas
  await prisma.userMission.deleteMany({
    where: {
      mission: { frequency: "WEEKLY" },
      completed: false,
    },
  });

  const users = await prisma.user.findMany();
  const weeklyMissions = await prisma.mission.findMany({
    where: { frequency: "WEEKLY" },
  });

  if (users.length === 0 || weeklyMissions.length === 0) {
    console.log("⚠️ Nenhum usuário ou missão semanal encontrada.");
    return;
  }

  const tasks = users.flatMap((user) =>
    weeklyMissions.map((mission) =>
      prisma.userMission.create({
        data: {
          userId: user.id,
          missionId: mission.id,
          progress: 0,
          completed: false,
        },
      })
    )
  );

  await Promise.all(tasks);
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
