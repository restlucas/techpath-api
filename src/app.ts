import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://techpath-two.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "api-key", "x-user-id"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/v1/api", router);

export default app;
