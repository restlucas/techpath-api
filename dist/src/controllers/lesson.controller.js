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
exports.addLessonResults = exports.fetchLessonByTopic = void 0;
const responseHandler_1 = __importDefault(require("../utils/responseHandler"));
const lesson_service_1 = __importDefault(require("../services/lesson.service"));
const fetchLessonByTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { topicSlug } = req.params;
    const userId = req.headers["x-user-id"];
    const lessonResponse = yield lesson_service_1.default.getLesson(topicSlug, userId);
    responseHandler_1.default.success(res, "Lesson retrieved successfully", lessonResponse);
});
exports.fetchLessonByTopic = fetchLessonByTopic;
const addLessonResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lessonId } = req.params;
    const { totalXpEarned, completed, userId } = req.body;
    const userProgress = yield lesson_service_1.default.addResult({
        lessonId,
        userId,
        completed,
        totalXpEarned,
    });
    responseHandler_1.default.success(res, "Lesson retrieved successfully", userProgress);
});
exports.addLessonResults = addLessonResults;
