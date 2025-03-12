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
exports.createUserMissions = createUserMissions;
const prisma_1 = __importDefault(require("../lib/prisma"));
function createUserMissions(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const missions = yield prisma_1.default.mission.findMany();
        if (missions.length === 0) {
            console.log("⚠️ Nenhuma missão encontrada.");
            return;
        }
        const tasks = missions.map((mission) => prisma_1.default.userMission.create({
            data: {
                userId: userId,
                missionId: mission.id,
                progress: 0,
                completed: false,
            },
        }));
        yield Promise.all(tasks);
        console.log("✅ Missões criadas com sucesso!");
    });
}
