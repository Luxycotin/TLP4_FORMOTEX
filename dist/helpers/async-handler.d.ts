import type { NextFunction, Request, Response } from "express";
export type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
export declare const asyncHandler: (handler: AsyncRouteHandler) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=async-handler.d.ts.map