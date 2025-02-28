import { Request, Response } from "express";
import responseHandler from "../utils/responseHandler";
import authService from "../services/auth.service";

export const signIn = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const userResponse = await authService.signIn(req.body);

  responseHandler.created(res, "User created successfully", userResponse);
};
