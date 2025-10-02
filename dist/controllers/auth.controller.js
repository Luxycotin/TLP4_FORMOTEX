import { asyncHandler } from "../helpers/async-handler.js";
import { ApiError } from "../errors/api-error.js";
import { login } from "../services/auth.service.js";
export const loginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body ?? {};
    if (typeof email !== "string" || typeof password !== "string") {
        throw new ApiError(400, "Email and password are required");
    }
    const result = await login({ email, password });
    res.json(result);
});
//# sourceMappingURL=auth.controller.js.map