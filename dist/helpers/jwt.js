import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
const DEFAULT_EXPIRATION = "4h";
const getSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET env var is not defined");
    }
    return secret;
};
export const generateToken = (payload, expiresIn = DEFAULT_EXPIRATION) => {
    const secret = getSecret();
    const options = {};
    if (typeof expiresIn !== "undefined") {
        options.expiresIn = expiresIn;
    }
    return sign(payload, secret, options);
};
export const verifyToken = (token) => {
    const secret = getSecret();
    const decoded = verify(token, secret);
    if (typeof decoded === "string") {
        throw new Error("Invalid token payload");
    }
    return decoded;
};
//# sourceMappingURL=jwt.js.map