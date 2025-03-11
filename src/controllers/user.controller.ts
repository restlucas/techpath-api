import { Request, Response } from "express";
import responseHandler from "../utils/responseHandler";
import userService from "../services/user.service";

export const getUser = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;

  const userResponse = await userService.getUserData(userId);

  responseHandler.success(
    res,
    "User profile retrieved successfully",
    userResponse
  );
};

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const { username } = req.params;

  const profileResponse = await userService.getByUsername(username as string);

  responseHandler.success(
    res,
    "User profile retrieved successfully",
    profileResponse
  );
};

export const getFollowUser = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const { username } = req.params;

  const followingResponse = await userService.getFollowing(username);

  responseHandler.success(
    res,
    "User following retrieved successfully",
    followingResponse
  );
};

export const followUser = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const { userId: userIdToFollow } = req.params;
  const userId = req.headers["x-user-id"] as string;

  const followResponse = await userService.addFollowUser(
    userIdToFollow,
    userId
  );

  responseHandler.success(
    res,
    "User profile retrieved successfully",
    followResponse
  );
};

export const unfollowUser = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const { userId: userIdToUnfollow } = req.params;
  const userId = req.headers["x-user-id"] as string;

  const followResponse = await userService.removeFollowUser(
    userIdToUnfollow,
    userId
  );

  responseHandler.success(
    res,
    "User profile retrieved successfully",
    followResponse
  );
};
