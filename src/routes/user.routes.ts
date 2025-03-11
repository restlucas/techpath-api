import { Router } from "express";
import {
  followUser,
  getFollowUser,
  getUser,
  getUserProfile,
  unfollowUser,
} from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/", getUser);
userRoutes.get("/:username/profile", getUserProfile);
userRoutes.get("/:username/follow", getFollowUser);
userRoutes.post("/:userId/follow", followUser);
userRoutes.delete("/:userId/follow", unfollowUser);

export default userRoutes;
