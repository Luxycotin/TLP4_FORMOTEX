import { ApiError } from "../errors/api-error.js";
import { hashPassword } from "../helpers/password.js";
import { UserModel, type UserDocument, type UserRole } from "../models/user.model.js";

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

const toUserResponse = (user: UserDocument): UserResponse => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const createUser = async (input: CreateUserInput): Promise<UserResponse> => {
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

export const listUsers = async (): Promise<UserResponse[]> => {
  const users = await UserModel.find().sort({ createdAt: -1 });

  return users.map(toUserResponse);
};

export const getUserById = async (id: string): Promise<UserResponse> => {
  const user = await UserModel.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return toUserResponse(user);
};

export const updateUser = async (
  id: string,
  input: UpdateUserInput,
): Promise<UserResponse> => {
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

export const deleteUser = async (id: string): Promise<void> => {
  const deleted = await UserModel.findByIdAndDelete(id);

  if (!deleted) {
    throw new ApiError(404, "User not found");
  }
};
