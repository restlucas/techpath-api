import { Request, Response } from "express";
import responseHandler from "../utils/responseHandler";
import missionService from "../services/mission.service";

export const listMissions = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const userId = req.headers["-x-user-id"] as string;
  const missionResponse = await missionService.getMissionsByUser(userId);

  responseHandler.success(
    res,
    "Missions retrieved successfully",
    missionResponse
  );
};
