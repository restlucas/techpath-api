import { Router } from "express";
import { signIn } from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/", signIn);

export default authRoutes;
