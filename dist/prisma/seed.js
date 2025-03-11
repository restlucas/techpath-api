"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const weekDate_1 = require("../src/utils/weekDate");
const prisma = new client_1.PrismaClient();
function createTrails() {
    return __awaiter(this, void 0, void 0, function* () {
        const trailsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "trails.json"), "utf-8"));
        for (const trailData of trailsData) {
            const trail = yield prisma.trail.create({
                data: {
                    name: trailData.name,
                    slug: trailData.slug,
                    description: trailData.description,
                    tags: trailData.tags,
                    modules: {
                        create: trailData.modules.map((moduleData) => ({
                            name: moduleData.name,
                            description: moduleData.description,
                            topics: {
                                create: moduleData.topics.map((topicData) => ({
                                    name: topicData.name,
                                    slug: topicData.slug,
                                    description: topicData.description,
                                    lessons: {
                                        create: topicData.lessons.map((lessonData) => ({
                                            name: lessonData.name,
                                            questions: {
                                                create: lessonData.questions.map((questionData) => {
                                                    var _a;
                                                    return ({
                                                        text: questionData.text,
                                                        type: client_1.QuestionType[questionData.type],
                                                        xp: 50,
                                                        correctAnswer: (_a = questionData.correctAnswer) !== null && _a !== void 0 ? _a : null,
                                                        answers: {
                                                            create: questionData.answers.map((answerData) => {
                                                                var _a, _b, _c;
                                                                return ({
                                                                    text: (_a = answerData.text) !== null && _a !== void 0 ? _a : null,
                                                                    order: (_b = answerData.order) !== null && _b !== void 0 ? _b : null,
                                                                    pairId: (_c = answerData.pairId) !== null && _c !== void 0 ? _c : null,
                                                                });
                                                            }),
                                                        },
                                                    });
                                                }),
                                            },
                                        })),
                                    },
                                })),
                            },
                        })),
                    },
                },
            });
            console.log(`Trilha "${trail.name}" criada com sucesso!`);
        }
    });
}
function createMissions() {
    return __awaiter(this, void 0, void 0, function* () {
        const missionsData = [
            {
                title: "Sabe-Tudo",
                description: "Complete uma lição sem errar nenhuma questão.",
                goalType: "PERFECT_SCORE_LESSONS",
                goalValue: 1,
                frequency: "DAILY",
                rewardXp: 100,
            },
            {
                title: "A todo vapor",
                description: "Complete 3 lições",
                goalType: "COMPLETE_LESSONS",
                goalValue: 3,
                frequency: "DAILY",
                rewardXp: 150,
            },
            {
                title: "Mantenha uma sequência de 5 dias",
                description: "Estude pelo menos uma lição por 5 dias consecutivos.",
                goalType: "WEEKLY_STREAK",
                goalValue: 5,
                rewardXp: 200,
                frequency: "WEEKLY",
            },
        ];
        for (const missionData of missionsData) {
            yield prisma.mission.create({
                data: {
                    title: missionData.title,
                    description: missionData.description,
                    goalType: missionData.goalType,
                    goalValue: missionData.goalValue,
                    rewardXp: missionData.rewardXp,
                    frequency: missionData.frequency,
                },
            });
        }
    });
}
function createUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i < 5; i++) {
            const randomXp = Math.floor(Math.random() * (2000 / 10 + 1)) * 10;
            const randomStreak = Math.floor(Math.random() * 50);
            yield prisma.user.create({
                data: {
                    name: faker_1.faker.person.fullName(),
                    username: faker_1.faker.internet.username(),
                    email: faker_1.faker.internet.email(),
                    image: faker_1.faker.image.avatar(),
                    totalXp: randomXp,
                    streak: randomStreak,
                },
            });
        }
        const users = yield prisma.user.findMany();
        const weekStart = (0, weekDate_1.startOfWeek)(new Date());
        // Create fake leaderboard
        for (const user of users) {
            yield prisma.leaderboard.create({
                data: {
                    userId: user.id,
                    xpEarned: user.totalXp,
                    weekStart: weekStart,
                },
            });
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield createTrails();
        yield createMissions();
        yield createUsers();
    });
}
main()
    .catch((e) => {
    console.error(e);
    throw e;
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
