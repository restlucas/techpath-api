import dotenv from "dotenv";
import app from "./app";
import "./jobs/mission.cron";

dotenv.config();

const PORT = Number(process.env.PORT) || 3300;
const HOST = "localhost";

const startServer = () => {
  try {
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server is running at http://${HOST}:${PORT}/v1/api`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();
