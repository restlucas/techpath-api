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
exports.resetDailyMissions = resetDailyMissions;
exports.resetWeeklyMissions = resetWeeklyMissions;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = __importDefault(require("../lib/prisma"));
function resetDailyMissions() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("⏳ Resetando missões diárias...");
        // Exclui missões diárias não concluídas
        yield prisma_1.default.userMission.deleteMany({
            where: {
                mission: { frequency: "DAILY" },
                completed: false,
            },
        });
        const users = yield prisma_1.default.user.findMany();
        const dailyMissions = yield prisma_1.default.mission.findMany({
            where: { frequency: "DAILY" },
        });
        if (users.length === 0 || dailyMissions.length === 0) {
            console.log("⚠️ Nenhum usuário ou missão diária encontrada.");
            return;
        }
        const tasks = users.flatMap((user) => dailyMissions.map((mission) => prisma_1.default.userMission.create({
            data: {
                userId: user.id,
                missionId: mission.id,
                progress: 0,
                completed: false,
            },
        })));
        yield Promise.all(tasks);
        console.log("✅ Missões diárias redefinidas com sucesso!");
    });
}
function resetWeeklyMissions() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("⏳ Resetando missões semanais...");
        // Exclui missões semanais não concluídas
        yield prisma_1.default.userMission.deleteMany({
            where: {
                mission: { frequency: "WEEKLY" },
                completed: false,
            },
        });
        const users = yield prisma_1.default.user.findMany();
        const weeklyMissions = yield prisma_1.default.mission.findMany({
            where: { frequency: "WEEKLY" },
        });
        if (users.length === 0 || weeklyMissions.length === 0) {
            console.log("⚠️ Nenhum usuário ou missão semanal encontrada.");
            return;
        }
        const tasks = users.flatMap((user) => weeklyMissions.map((mission) => prisma_1.default.userMission.create({
            data: {
                userId: user.id,
                missionId: mission.id,
                progress: 0,
                completed: false,
            },
        })));
        yield Promise.all(tasks);
        console.log("✅ Missões semanais redefinidas com sucesso!");
    });
}
// Agendar a execução do cron job
// ⏰ Reset diário às 00:00 (meia-noite)
node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    yield resetDailyMissions();
}));
// ⏰ Reset semanal toda segunda-feira às 00:00
node_cron_1.default.schedule("0 0 * * 1", () => __awaiter(void 0, void 0, void 0, function* () {
    yield resetWeeklyMissions();
}));
