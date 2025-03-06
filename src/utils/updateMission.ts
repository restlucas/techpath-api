import prisma from "../lib/prisma";

export async function updateMissionsProgress(
  userId: string,
  lessonId: string,
  totalXpEarned: number
): Promise<number> {
  console.log("🔄 Atualizando progresso das missões...");
  console.log("userId: ", userId);
  console.log("lessonId: ", lessonId);
  console.log("totalXpEarned: ", totalXpEarned);

  const userMissions = await prisma.userMission.findMany({
    where: { userId, completed: false },
    include: { mission: true },
  });

  let totalXpGained = 0;

  for (const userMission of userMissions) {
    const mission = userMission.mission;
    const missionXp = mission.rewardXp;
    let newProgress = userMission.progress;
    let isCompleted = false;

    console.log("missionXp: ", missionXp);

    switch (mission.goalType) {
      case "PERFECT_SCORE_LESSONS":
        // Consultar as questões da lição e somar o expReward de todas elas
        const questions = await prisma.question.findMany({
          where: { lessonId },
        });

        const totalLessonXp = questions.reduce(
          (sum, question) => sum + question.xp,
          0
        );

        // Verificar se o totalXpEarned é igual ao total XP das questões da lição
        if (totalXpEarned === totalLessonXp) {
          newProgress = 1; // A missão é concluída
          isCompleted = true;
        }
        break;

      default:
        newProgress += 1; // Incrementa a quantidade de lições completadas
        isCompleted = newProgress >= mission.goalValue;
        break;
    }

    if (newProgress !== userMission.progress) {
      await prisma.userMission.update({
        where: { id: userMission.id },
        data: {
          progress: newProgress,
          completed: isCompleted,
        },
      });

      if (isCompleted) {
        totalXpGained += mission.rewardXp;
      }
    }
  }

  if (totalXpGained > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalXp: { increment: totalXpGained },
      },
    });

    console.log(`🎉 Usuário ganhou ${totalXpGained} XP!`);
  }

  console.log(totalXpGained);
  return totalXpGained;
}
