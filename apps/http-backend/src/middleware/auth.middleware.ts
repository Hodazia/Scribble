import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";

interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
}

export function protectedRoute(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as unknown as {
      id: string;
      email: string;
      name: string;
    };

    console.log("decoded is ", decoded);
    req.user = { id: decoded.id, email: decoded.email, name: decoded.name };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}