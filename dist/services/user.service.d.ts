import { type UserRole } from "../models/user.model.js";
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
export declare const createUser: (input: CreateUserInput) => Promise<UserResponse>;
export declare const listUsers: () => Promise<UserResponse[]>;
export declare const getUserById: (id: string) => Promise<UserResponse>;
export declare const updateUser: (id: string, input: UpdateUserInput) => Promise<UserResponse>;
export declare const deleteUser: (id: string) => Promise<void>;
//# sourceMappingURL=user.service.d.ts.map