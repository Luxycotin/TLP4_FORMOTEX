import { type EquipmentStatus, type EquipmentType } from "../models/equipment.model.js";
import type { UserDocument } from "../models/user.model.js";
import type { AuthenticatedUser } from "../types/authenticated-user.js";
export interface EquipmentResponse {
    id: string;
    name: string;
    serialNumber: string;
    type: EquipmentType;
    status: EquipmentStatus;
    description?: string | undefined;
    owner?: {
        id: string;
        name: string;
        email: string;
        role: UserDocument["role"];
    } | undefined;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateEquipmentInput {
    name: string;
    serialNumber: string;
    type: EquipmentType;
    status?: EquipmentStatus | undefined;
    description?: string | undefined;
    ownerId?: string | undefined;
}
export interface UpdateEquipmentInput {
    name?: string | undefined;
    serialNumber?: string | undefined;
    type?: EquipmentType | undefined;
    status?: EquipmentStatus | undefined;
    description?: string | null | undefined;
    ownerId?: string | null | undefined;
}
export declare const listEquipment: (actor: AuthenticatedUser) => Promise<EquipmentResponse[]>;
export declare const getEquipmentById: (actor: AuthenticatedUser, id: string) => Promise<EquipmentResponse>;
export declare const createEquipment: (actor: AuthenticatedUser, input: CreateEquipmentInput) => Promise<EquipmentResponse>;
export declare const updateEquipment: (actor: AuthenticatedUser, id: string, input: UpdateEquipmentInput) => Promise<EquipmentResponse>;
export declare const deleteEquipment: (actor: AuthenticatedUser, id: string) => Promise<void>;
//# sourceMappingURL=equipment.service.d.ts.map