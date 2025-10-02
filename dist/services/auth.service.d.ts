import type { AuthenticatedUser } from "../types/authenticated-user.js";
export interface LoginInput {
    email: string;
    password: string;
}
export interface LoginResponse {
    token: string;
    user: AuthenticatedUser;
}
export declare const login: ({ email, password }: LoginInput) => Promise<LoginResponse>;
//# sourceMappingURL=auth.service.d.ts.map