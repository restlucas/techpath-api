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
const leaderboardService = {
    getLeaderboard() {
        return __awaiter(this, void 0, void 0, function* () {
            const weekStart = (0, weekDate_1.startOfWeek)(new Date());
            const leaderboard = yield prisma_1.default.leaderboard.findMany({
                where: { weekStart },
                orderBy: { xpEarned: "desc" },
                take: 10,
                include: {
                    user: { select: { name: true, image: true, username: true } },
                },
            });
            return leaderboard;
        });
    },
};
exports.default = leaderboardService;
