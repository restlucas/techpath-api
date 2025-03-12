import { Request, Response } from "express";
import responseHandler from "../utils/responseHandler";
import leaderboardService from "../services/leaderboard.service";

export const getLeaderboardRanking = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const leaderboardResponse = await leaderboardService.getLeaderboard();

  console.log(leaderboardResponse);

  responseHandler.success(
    res,
    "Leaderboard retrieved successfully",
    leaderboardResponse
  );
};
