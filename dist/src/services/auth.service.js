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
const createUserMissions_1 = require("../utils/createUserMissions");
const authService = {
    signIn(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, image, username, provider, providerAccountId } = data;
            let user = yield prisma_1.default.user.findUnique({
                where: {
                    email,
                },
            });
            if (!user) {
                user = yield prisma_1.default.user.create({
                    data: {
                        name,
                        email,
                        image,
                        username,
                    },
                });
                const trails = yield prisma_1.default.trail.findMany();
                for (const index in trails) {
                    const firstModule = yield prisma_1.default.module.findFirst({
                        where: {
                            trailId: trails[index].id,
                        },
                        select: {
                            id: true,
                        },
                    });
                    if (firstModule) {
                        yield prisma_1.default.userModuleProgress.create({
                            data: {
                                userId: user.id,
                                unlocked: true,
                                moduleId: firstModule.id,
                            },
                        });
                    }
                }
                yield (0, createUserMissions_1.createUserMissions)(user.id);
            }
            const followingIds = yield prisma_1.default.userFollowing.findMany({
                where: {
                    followerId: user.id,
                },
                select: {
                    followedId: true,
                },
            });
            yield prisma_1.default.account.upsert({
                where: { providerAccountId },
                update: {},
                create: {
                    userId: user.id,
                    provider,
                    providerAccountId,
                },
            });
            return {
                user: Object.assign(Object.assign({}, user), { following: [...followingIds.map((following) => following.followedId)] }),
            };
        });
    },
};
exports.default = authService;
