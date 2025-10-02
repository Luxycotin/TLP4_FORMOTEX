import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../models/user.model.js";
export declare const authorize: (...roles: UserRole[]) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=role.middleware.d.ts.map