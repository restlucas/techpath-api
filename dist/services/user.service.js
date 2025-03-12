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
const userService = {
    getUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findFirst({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    username: true,
                    image: true,
                    totalXp: true,
                    streak: true,
                    createdAt: true,
                },
            });
            const followingIds = yield prisma_1.default.userFollowing.findMany({
                where: {
                    followerId: userId,
                },
                select: {
                    followedId: true,
                },
            });
            return Object.assign(Object.assign({}, user), { following: [...followingIds.map((following) => following.followedId)] });
        });
    },
    getByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findFirst({
                where: {
                    username,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    username: true,
                    image: true,
                    streak: true,
                    totalXp: true,
                    createdAt: true,
                },
            });
            if (!user)
                return null;
            const trails = yield prisma_1.default.trail.findMany({
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    modules: { select: { id: true } },
                },
            });
            const moduleIds = trails.flatMap((trail) => trail.modules.map((module) => module.id));
            if (moduleIds.length === 0)
                return Object.assign(Object.assign({}, user), { trails: [] });
            const userCompletedModules = yield prisma_1.default.userModuleProgress.findMany({
                where: {
                    userId: user.id,
                    moduleId: { in: moduleIds },
                    completed: true,
                },
                select: { moduleId: true },
            });
            const completedModuleIds = new Set(userCompletedModules.map((um) => um.moduleId));
            const trailsWithProgress = trails.map(({ id, name, slug, modules }) => {
                const isCompleted = modules.every((module) => completedModuleIds.has(module.id));
                return { id, name, slug, completed: isCompleted };
            });
            return Object.assign(Object.assign({}, user), { trails: trailsWithProgress });
        });
    },
    getFollowing(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma_1.default.user.findMany({
                where: {
                    username: username,
                },
                select: {
                    _count: {
                        select: {
                            followers: true,
                            following: true,
                        },
                    },
                },
            });
            return response;
        });
    },
    addFollowUser(userIdToFollow, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma_1.default.userFollowing.create({
                data: {
                    followedId: userIdToFollow,
                    followerId: userId,
                },
            });
            return response;
        });
    },
    removeFollowUser(userIdToUnfollow, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma_1.default.userFollowing.delete({
                where: {
                    followerId_followedId: {
                        followedId: userIdToUnfollow,
                        followerId: userId,
                    },
                },
            });
            return response;
        });
    },
};
exports.default = userService;
