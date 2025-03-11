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
const missionService = {
    getMissionsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            const lastMonday = new Date(now);
            lastMonday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
            lastMonday.setHours(0, 0, 0, 0);
            const nextMonday = new Date(lastMonday);
            nextMonday.setDate(lastMonday.getDate() + 7);
            nextMonday.setHours(23, 59, 59, 999);
            const missions = yield prisma_1.default.userMission.findMany({
                where: {
                    userId,
                    OR: [
                        {
                            mission: {
                                frequency: "DAILY",
                            },
                            createdAt: {
                                gte: startOfToday,
                                lte: endOfToday,
                            },
                        },
                        {
                            mission: {
                                frequency: "WEEKLY",
                            },
                            createdAt: {
                                gte: lastMonday,
                                lte: nextMonday,
                            },
                        },
                    ],
                },
                select: {
                    completed: true,
                    progress: true,
                    mission: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            goalType: true,
                            goalValue: true,
                            rewardXp: true,
                            frequency: true,
                        },
                    },
                },
            });
            return missions;
        });
    },
};
exports.default = missionService;
