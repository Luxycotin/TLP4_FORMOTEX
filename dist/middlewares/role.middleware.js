import { ApiError } from "../errors/api-error.js";
export const authorize = (...roles) => {
    const uniqueRoles = Array.from(new Set(roles));
    return (req, _res, next) => {
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
//# sourceMappingURL=role.middleware.js.map