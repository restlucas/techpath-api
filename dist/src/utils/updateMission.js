"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMissionsProgress = updateMissionsProgress;
const prisma_1 = __importDefault(require("../lib/prisma"));
function updateMissionsProgress(userId, lessonId, totalXpEarned) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🔄 Atualizando progresso das missões...");
        const userMissions = yield prisma_1.default.userMission.findMany({
            where: { userId, completed: false },
            include: { mission: true },
        });
        let totalXpGained = 0;
        for (const userMission of userMissions) {
            const mission = userMission.mission;
            const missionXp = mission.rewardXp;
            let newProgress = userMission.progress;
            let isCompleted = false;
            switch (mission.goalType) {
                case "PERFECT_SCORE_LESSONS":
                    // Consultar as questões da lição e somar o expReward de todas elas
                    const questions = yield prisma_1.default.question.findMany({
                        where: { lessonId },
                    });
                    const totalLessonXp = questions.reduce((sum, question) => sum + question.xp, 0);
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
                yield prisma_1.default.userMission.update({
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
            yield prisma_1.default.user.update({
                where: { id: userId },
                data: {
                    totalXp: { increment: totalXpGained },
                },
            });
            console.log(`🎉 Usuário ganhou ${totalXpGained} XP!`);
        }
        return totalXpGained;
    });
}
