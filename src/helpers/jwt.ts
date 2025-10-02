import jwt from "jsonwebtoken";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import type { UserRole } from "../models/user.model.js";

export interface TokenPayload extends JwtPayload {
  sub: string;
  role: UserRole;
}

const { sign, verify } = jwt;

const DEFAULT_EXPIRATION: SignOptions["expiresIn"] = "4h";

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET env var is not defined");
  }

  return secret;
};

export const generateToken = (
  payload: Pick<TokenPayload, "sub" | "role">,
  expiresIn: SignOptions["expiresIn"] = DEFAULT_EXPIRATION,
): string => {
  const secret = getSecret();
  const options: SignOptions = {};

  if (typeof expiresIn !== "undefined") {
    options.expiresIn = expiresIn;
  }

  return sign(payload, secret, options);
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = getSecret();
  const decoded = verify(token, secret);

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  return decoded as TokenPayload;
};
