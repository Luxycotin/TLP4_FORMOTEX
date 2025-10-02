import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import type { MongoServerError } from "mongodb";
import { ApiError } from "../errors/api-error.js";

const formatMongoError = (error: MongoServerError): { message: string; field?: string | undefined } => {
  if (error.code === 11000 && error.keyValue) {
    const [entryKey, entryValue] = Object.entries(error.keyValue)[0] ?? [];

    return {
      message: entryKey
        ? `${entryKey} '${String(entryValue)}' already exists`
        : "Duplicate key error",
      field: entryKey,
    };
  }

  return { message: error.message };
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal server error";
  let details: unknown;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  } else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(error.errors).map((err) => err.message);
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${error.path}: ${error.value}`;
  } else if (typeof error === "object" && error !== null && "code" in error) {
    const mongoError = error as MongoServerError;

    if (mongoError.code === 11000) {
      statusCode = 409;
      const formatted = formatMongoError(mongoError);
      message = formatted.message;
      details = formatted.field ? { field: formatted.field } : undefined;
    }
  } else if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name: string }).name === "JsonWebTokenError"
  ) {
    statusCode = 401;
    message = "Invalid or expired token";
  } else if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name: string }).name === "TokenExpiredError"
  ) {
    statusCode = 401;
    message = "Invalid or expired token";
  } else if (error instanceof Error) {
    message = error.message;
  }

  const responseBody: Record<string, unknown> = {
    message,
  };

  if (details) {
    responseBody.details = details;
  }

  if (process.env.NODE_ENV !== "production" && error instanceof Error) {
    responseBody.stack = error.stack;
  }

  res.status(statusCode).json(responseBody);
};
