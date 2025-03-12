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
exports.unfollowUser = exports.followUser = exports.getFollowUser = exports.getUserProfile = exports.getUser = void 0;
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const user_service_1 = __importDefault(require("../services/user.service"));
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["x-user-id"];
    const userResponse = yield user_service_1.default.getUserData(userId);
    responseHandler_1.default.success(res, "User profile retrieved successfully", userResponse);
});
exports.getUser = getUser;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const profileResponse = yield user_service_1.default.getByUsername(username);
    responseHandler_1.default.success(res, "User profile retrieved successfully", profileResponse);
});
exports.getUserProfile = getUserProfile;
const getFollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const followingResponse = yield user_service_1.default.getFollowing(username);
    responseHandler_1.default.success(res, "User following retrieved successfully", followingResponse);
});
exports.getFollowUser = getFollowUser;
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId: userIdToFollow } = req.params;
    const userId = req.headers["x-user-id"];
    const followResponse = yield user_service_1.default.addFollowUser(userIdToFollow, userId);
    responseHandler_1.default.success(res, "User profile retrieved successfully", followResponse);
});
exports.followUser = followUser;
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId: userIdToUnfollow } = req.params;
    const userId = req.headers["x-user-id"];
    const followResponse = yield user_service_1.default.removeFollowUser(userIdToUnfollow, userId);
    responseHandler_1.default.success(res, "User profile retrieved successfully", followResponse);
});
exports.unfollowUser = unfollowUser;
