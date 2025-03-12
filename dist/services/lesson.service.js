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
const prisma_1 = __importDefault(require("../lib/prisma"));
const weekDate_1 = require("../utils/weekDate");
const updateMission_1 = require("../utils/updateMission");
const adjustNowDate_1 = require("../utils/adjustNowDate");
const lessonService = {
    getLesson(topicSlug, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const trail = yield prisma_1.default.topic.findFirst({
                where: { slug: topicSlug },
                select: {
                    module: {
                        select: {
                            trail: {
                                select: {
                                    slug: true,
                                },
                            },
                        },
                    },
                },
            });
            const trailSlug = trail === null || trail === void 0 ? void 0 : trail.module.trail.slug;
            const lesson = yield prisma_1.default.lesson.findFirst({
                where: {
                    topic: {
                        slug: topicSlug,
                    },
                    OR: [
                        {
                            usersProgress: {
                                none: {
                                    userId,
                                },
                            },
                        },
                        {
                            usersProgress: {
                                some: {
                                    userId,
                                    completed: false,
                                },
                            },
                        },
                    ],
                },
                include: {
                    questions: {
                        include: {
                            answers: true,
                        },
                    },
                },
            });
            return Object.assign(Object.assign({}, lesson), { trailSlug });
        });
    },
    addResult(_a) {
        return __awaiter(this, arguments, void 0, function* ({ lessonId, userId, completed, totalXpEarned, }) {
            const now = (0, adjustNowDate_1.adjustNowDate)();
            const weekStart = (0, weekDate_1.startOfWeek)(now);
            // 🔹 Obter informações do usuário (XP, streak e última atividade)
            const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
                where: { id: userId },
                select: { totalXp: true, streak: true, lastActivity: true },
            });
            // 🔹 Calcular streak (apenas se o usuário jogou no dia anterior)
            const lastActivity = userInfo.lastActivity;
            const yesterday = (0, adjustNowDate_1.adjustNowDate)();
            yesterday.setDate(yesterday.getDate() - 1);
            const isYesterday = lastActivity &&
                yesterday.getFullYear() === lastActivity.getFullYear() &&
                yesterday.getMonth() === lastActivity.getMonth() &&
                yesterday.getDate() === lastActivity.getDate();
            const newStreak = isYesterday ? userInfo.streak + 1 : 1;
            // 🔹 Atualizar XP, streak e última atividade
            yield prisma_1.default.user.update({
                where: { id: userId },
                data: {
                    totalXp: userInfo.totalXp + totalXpEarned,
                    streak: newStreak,
                    lastActivity: now,
                },
            });
            // 🔹 Salvar progresso da lição
            const userLessonProgress = yield prisma_1.default.userLessonProgress.create({
                data: {
                    lessonId,
                    userId,
                    completed,
                },
            });
            // 🔹 Buscar módulo da lição
            const lesson = yield prisma_1.default.lesson.findUniqueOrThrow({
                where: { id: lessonId },
                select: { topic: { select: { moduleId: true } } },
            });
            const moduleId = lesson.topic.moduleId;
            // 🔹 Contar todas as lições do módulo e as concluídas pelo usuário
            const result = yield prisma_1.default.$queryRaw `
  SELECT
    (SELECT COUNT(*) FROM \`Lesson\` l WHERE l.\`topicId\` IN 
      (SELECT id FROM \`Topic\` WHERE \`moduleId\` = ${moduleId})) AS \`totalLessons\`,
    (SELECT COUNT(*) FROM \`UserLessonProgress\` ulp 
     WHERE ulp.\`userId\` = ${userId} 
     AND ulp.\`lessonId\` IN (SELECT id FROM \`Lesson\` WHERE \`topicId\` IN 
       (SELECT id FROM \`Topic\` WHERE \`moduleId\` = ${moduleId})) 
     AND ulp.\`completed\` = TRUE) AS \`completedLessons\`
`;
            console.log(result[0]);
            const { totalLessons, completedLessons } = result[0];
            // 🔹 Se todas as lições do módulo foram completadas, marcar o módulo como completo
            if (completedLessons === totalLessons) {
                yield prisma_1.default.userModuleProgress.upsert({
                    where: { userId_moduleId: { userId, moduleId } },
                    update: { completed: true },
                    create: { userId, moduleId, completed: true },
                });
                // 🔹 Desbloquear o próximo módulo (melhorado para pegar o próximo na ordem correta)
                const nextModule = yield prisma_1.default.module.findFirst({
                    where: {
                        trail: {
                            modules: {
                                some: { id: moduleId },
                            },
                        },
                    },
                    orderBy: { id: "asc" },
                    cursor: { id: moduleId },
                    skip: 1,
                });
                if (nextModule) {
                    yield prisma_1.default.userModuleProgress.upsert({
                        where: { userId_moduleId: { userId, moduleId: nextModule.id } },
                        update: { unlocked: true },
                        create: { userId, moduleId: nextModule.id, unlocked: true },
                    });
                }
            }
            const totalXpGainedByMissions = yield (0, updateMission_1.updateMissionsProgress)(userId, lessonId, totalXpEarned);
            const totalXpGained = totalXpEarned + totalXpGainedByMissions;
            yield prisma_1.default.leaderboard.upsert({
                where: { userId_weekStart: { userId, weekStart } },
                update: { xpEarned: { increment: totalXpGained } },
                create: { userId, weekStart, xpEarned: totalXpGained },
            });
            return userLessonProgress;
        });
    },
};
exports.default = lessonService;
