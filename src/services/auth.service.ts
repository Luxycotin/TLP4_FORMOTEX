import { ApiError } from "../errors/api-error.js";
import { comparePassword } from "../helpers/password.js";
import { generateToken } from "../helpers/jwt.js";
import { UserModel, type UserRole } from "../models/user.model.js";
import type { AuthenticatedUser } from "../types/authenticated-user.js";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthenticatedUser;
}

const toAuthenticatedUser = (user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}): AuthenticatedUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const login = async ({ email, password }: LoginInput): Promise<LoginResponse> => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await UserModel.findOne({ email: normalizedEmail }).select("+password");

  if (!user || !user.password) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken({ sub: user.id, role: user.role });

  return {
    token,
    user: toAuthenticatedUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }),
  };
};
