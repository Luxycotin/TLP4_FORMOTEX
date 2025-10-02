import { type Document, type Types } from "mongoose";
export declare const EQUIPMENT_TYPES: readonly ["desktop", "laptop", "printer", "peripheral", "network", "other"];
export declare const EQUIPMENT_STATUSES: readonly ["available", "assigned", "maintenance", "retired"];
export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];
export type EquipmentStatus = (typeof EQUIPMENT_STATUSES)[number];
export interface EquipmentDocument extends Document {
    name: string;
    serialNumber: string;
    type: EquipmentType;
    status: EquipmentStatus;
    owner?: Types.ObjectId | null | undefined;
    description?: string | undefined;
    createdAt: Date;
    updatedAt: Date;
}
export declare const EquipmentModel: import("mongoose").Model<EquipmentDocument, {}, {}, {}, Document<unknown, {}, EquipmentDocument, {}, {}> & EquipmentDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=equipment.model.d.ts.map