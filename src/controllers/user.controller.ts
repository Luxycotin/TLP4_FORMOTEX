import type { Request, Response } from "express";
import { asyncHandler } from "../helpers/async-handler.js";
import { ApiError } from "../errors/api-error.js";
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
} from "../services/user.service.js";
import { USER_ROLES } from "../models/user.model.js";

const isValidRole = (role: unknown): role is (typeof USER_ROLES)[number] =>
  typeof role === "string" && USER_ROLES.includes(role as (typeof USER_ROLES)[number]);

export const listUsersController = asyncHandler(async (_req: Request, res: Response) => {
  const users = await listUsers();

  res.json(users);
});

export const getUserController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "User id is required");
  }

  const user = await getUserById(id);

  res.json(user);
});

export const createUserController = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body ?? {};

  if (typeof name !== "string" || name.trim().length < 2) {
    throw new ApiError(400, "Name must be at least 2 characters long");
  }

  if (typeof email !== "string") {
    throw new ApiError(400, "Email is required");
  }

  if (typeof password !== "string" || password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  if (!isValidRole(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const user = await createUser({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role,
  });

  res.status(201).json(user);
});

export const updateUserController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body ?? {};

  if (!id) {
    throw new ApiError(400, "User id is required");
  }

  const payload: Record<string, unknown> = {};

  if (typeof name === "string") {
    payload.name = name.trim();
  }

  if (typeof email === "string") {
    payload.email = email.trim().toLowerCase();
  }

  if (typeof password === "string") {
    if (password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters long");
    }

    payload.password = password;
  }

  if (typeof role !== "undefined") {
    if (!isValidRole(role)) {
      throw new ApiError(400, "Invalid role");
    }

    payload.role = role;
  }

  if (Object.keys(payload).length === 0) {
    throw new ApiError(400, "No fields provided for update");
  }

  const user = await updateUser(id, payload);

  res.json(user);
});

export const deleteUserController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "User id is required");
  }

  await deleteUser(id);

  res.status(204).send();
});
