import { Request, Response } from "express";
import responseHandler from "../utils/responseHandler";
import trailService from "../services/trail.service";

export const listAll = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const trailsResponse = await trailService.getAll();

  console.log(trailsResponse);
  throw new Error("🔥 Teste de erro no Railway!");

  responseHandler.success(res, "Trails retrieved successfully", trailsResponse);
};

export const fetchTrail = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const { trailSlug } = req.params;
  const userId = req.headers["x-user-id"] as string;

  const trailResponse = await trailService.getTrail(trailSlug, userId);

  responseHandler.success(res, "Trail retrieved successfully", trailResponse);
};

export const fetchTrailsProgressByUser = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const userId = req.headers["x-user-id"] as string;

  const trailResponse = await trailService.getTrailsProgressByUser(userId);

  responseHandler.success(
    res,
    "Completed trails retrieved successfully",
    trailResponse
  );
};
