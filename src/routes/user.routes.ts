import { Router } from "express";
import {
  followUser,
  getFollowUser,
  getUserProfile,
  unfollowUser,
} from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/:username/profile", getUserProfile);
userRoutes.get("/:username/follow", getFollowUser);
userRoutes.post("/:userId/follow", followUser);
userRoutes.delete("/:userId/follow", unfollowUser);

export default userRoutes;
