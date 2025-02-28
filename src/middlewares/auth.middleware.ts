import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["api_key"];

  if (!apiKey) {
    res.status(401).json({ message: "API Key não fornecida" });
    return;
  }

  const expectedApiKey = process.env.TECHPATH_API_KEY;
  if (apiKey !== expectedApiKey) {
    res.status(403).json({ message: "API Key inválida" });
    return;
  }

  next();
};
