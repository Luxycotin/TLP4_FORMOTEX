import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-error.js";
import type { UserRole } from "../models/user.model.js";

export const authorize = (...roles: UserRole[]) => {
  const uniqueRoles = Array.from(new Set(roles));

  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, "Authentication required"));
      return;
    }

    if (!uniqueRoles.includes(req.user.role)) {
      next(new ApiError(403, "Insufficient permissions"));
      return;
    }

    next();
  };
};
