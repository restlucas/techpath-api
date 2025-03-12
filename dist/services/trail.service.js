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
const trailService = {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma_1.default.trail.findMany();
            return response;
        });
    },
    getTrail(trailSlug, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma_1.default.trail.findFirst({
                where: { slug: trailSlug },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    tags: true,
                    modules: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            topics: {
                                select: {
                                    id: true,
                                    slug: true,
                                    name: true,
                                    description: true,
                                    lessons: {
                                        select: {
                                            id: true,
                                            questions: {
                                                select: {
                                                    xp: true,
                                                },
                                            },
                                            usersProgress: {
                                                where: { userId, completed: true },
                                                select: { id: true },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            if (!response)
                return null;
            const modulesWithTopicsStats = yield Promise.all(response.modules.map((module) => __awaiter(this, void 0, void 0, function* () {
                const userModuleProgress = yield prisma_1.default.userModuleProgress.findFirst({
                    where: { userId, moduleId: module.id },
                    select: { unlocked: true },
                });
                const unlocked = (userModuleProgress === null || userModuleProgress === void 0 ? void 0 : userModuleProgress.unlocked) || false;
                const topicsWithStats = module.topics.map((topic) => {
                    const totalLessons = topic.lessons.length;
                    const totalXp = topic.lessons.reduce((lessonSum, lesson) => {
                        return (lessonSum +
                            lesson.questions.reduce((questionSum, question) => questionSum + question.xp, 0));
                    }, 0);
                    const totalLessonsCompleted = topic.lessons.filter((lesson) => lesson.usersProgress.length > 0).length;
                    return {
                        id: topic.id,
                        name: topic.name,
                        slug: topic.slug,
                        description: topic.description,
                        totalLessons,
                        totalLessonsCompleted,
                        totalXp,
                    };
                });
                return {
                    id: module.id,
                    name: module.name,
                    description: module.description,
                    unlocked,
                    topics: topicsWithStats,
                };
            })));
            return Object.assign(Object.assign({}, response), { modules: modulesWithTopicsStats });
        });
    },
    getTrailsProgressByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const trails = yield prisma_1.default.trail.findMany({
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    modules: {
                        select: { id: true },
                    },
                },
            });
            const moduleIds = trails.flatMap((trail) => trail.modules.map((module) => module.id));
            if (moduleIds.length === 0)
                return [];
            const userCompletedModules = yield prisma_1.default.userModuleProgress.findMany({
                where: {
                    userId,
                    moduleId: { in: moduleIds },
                    completed: true,
                },
                select: {
                    moduleId: true,
                },
            });
            const completedModuleIds = new Set(userCompletedModules.map((um) => um.moduleId));
            return trails.map(({ id, name, slug, modules }) => {
                const isCompleted = modules.every((module) => completedModuleIds.has(module.id));
                return { id, name, slug, completed: isCompleted };
            });
        });
    },
};
exports.default = trailService;
