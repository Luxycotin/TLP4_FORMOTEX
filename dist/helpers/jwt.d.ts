import type { JwtPayload, SignOptions } from "jsonwebtoken";
import type { UserRole } from "../models/user.model.js";
export interface TokenPayload extends JwtPayload {
    sub: string;
    role: UserRole;
}
export declare const generateToken: (payload: Pick<TokenPayload, "sub" | "role">, expiresIn?: SignOptions["expiresIn"]) => string;
export declare const verifyToken: (token: string) => TokenPayload;
//# sourceMappingURL=jwt.d.ts.map