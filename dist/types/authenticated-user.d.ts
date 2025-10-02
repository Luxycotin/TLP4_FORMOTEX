import type { UserRole } from "../models/user.model.js";
export interface AuthenticatedUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}
//# sourceMappingURL=authenticated-user.d.ts.map