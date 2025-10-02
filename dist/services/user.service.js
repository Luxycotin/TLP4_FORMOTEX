import { ApiError } from "../errors/api-error.js";
import { hashPassword } from "../helpers/password.js";
import { UserModel } from "../models/user.model.js";
const toUserResponse = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});
export const createUser = async (input) => {
    const existing = await UserModel.exists({ email: input.email });
    if (existing) {
        throw new ApiError(409, "Email already registered");
    }
    const hashedPassword = await hashPassword(input.password);
    const user = await UserModel.create({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: input.role,
    });
    return toUserResponse(user);
};
export const listUsers = async () => {
    const users = await UserModel.find().sort({ createdAt: -1 });
    return users.map(toUserResponse);
};
export const getUserById = async (id) => {
    const user = await UserModel.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return toUserResponse(user);
};
export const updateUser = async (id, input) => {
    const user = await UserModel.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (input.email && input.email !== user.email) {
        const emailTaken = await UserModel.exists({ email: input.email, _id: { $ne: id } });
        if (emailTaken) {
            throw new ApiError(409, "Email already registered");
        }
        user.email = input.email;
    }
    if (input.name) {
        user.name = input.name;
    }
    if (input.role) {
        user.role = input.role;
    }
    if (input.password) {
        user.password = await hashPassword(input.password);
    }
    await user.save();
    return toUserResponse(user);
};
export const deleteUser = async (id) => {
    const deleted = await UserModel.findByIdAndDelete(id);
    if (!deleted) {
        throw new ApiError(404, "User not found");
    }
};
//# sourceMappingURL=user.service.js.map