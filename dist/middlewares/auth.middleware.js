import { ApiError } from "../errors/api-error.js";
import { verifyToken } from "../helpers/jwt.js";
import { UserModel } from "../models/user.model.js";
export const authenticate = async (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        next(new ApiError(401, "Authorization header missing or malformed"));
        return;
    }
    const token = header.slice("Bearer ".length).trim();
    try {
        const payload = verifyToken(token);
        const user = await UserModel.findById(payload.sub);
        if (!user) {
            next(new ApiError(401, "User not found"));
            return;
        }
        const authenticatedUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
        req.user = authenticatedUser;
        next();
    }
    catch (error) {
        next(new ApiError(401, "Invalid or expired token", error instanceof Error ? error.message : undefined));
    }
};
//# sourceMappingURL=auth.middleware.js.map