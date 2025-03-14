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
exports.getLeaderboardRanking = void 0;
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const leaderboard_service_1 = __importDefault(require("../services/leaderboard.service"));
const getLeaderboardRanking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const leaderboardResponse = yield leaderboard_service_1.default.getLeaderboard();
    responseHandler_1.default.success(res, "Leaderboard retrieved successfully", leaderboardResponse);
});
exports.getLeaderboardRanking = getLeaderboardRanking;
