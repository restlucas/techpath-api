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
exports.fetchTrailsProgressByUser = exports.fetchTrail = exports.listAll = void 0;
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const trail_service_1 = __importDefault(require("../services/trail.service"));
const listAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const trailsResponse = yield trail_service_1.default.getAll();
    responseHandler_1.default.success(res, "Trails retrieved successfully", trailsResponse);
});
exports.listAll = listAll;
const fetchTrail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trailSlug } = req.params;
    const userId = req.headers["x-user-id"];
    const trailResponse = yield trail_service_1.default.getTrail(trailSlug, userId);
    responseHandler_1.default.success(res, "Trail retrieved successfully", trailResponse);
});
exports.fetchTrail = fetchTrail;
const fetchTrailsProgressByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["x-user-id"];
    const trailResponse = yield trail_service_1.default.getTrailsProgressByUser(userId);
    responseHandler_1.default.success(res, "Completed trails retrieved successfully", trailResponse);
});
exports.fetchTrailsProgressByUser = fetchTrailsProgressByUser;
