"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
require("./jobs/mission.cron");
dotenv_1.default.config();
const PORT = Number(process.env.PORT) || 3300;
const HOST = "localhost";
const startServer = () => {
    try {
        app_1.default.listen(PORT, HOST, () => {
            console.log(`🚀 Server is running at http://${HOST}:${PORT}/v1/api`);
        });
    }
    catch (error) {
        console.error("❌ Error starting server:", error);
        process.exit(1);
    }
};
startServer();
