import { Schema, model, type Document, type Types } from "mongoose";

export const EQUIPMENT_TYPES = [
  "desktop",
  "laptop",
  "printer",
  "peripheral",
  "network",
  "other",
] as const;

export const EQUIPMENT_STATUSES = [
  "available",
  "assigned",
  "maintenance",
  "retired",
] as const;

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

const equipmentSchema = new Schema<EquipmentDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: EQUIPMENT_TYPES,
    },
    status: {
      type: String,
      required: true,
      enum: EQUIPMENT_STATUSES,
      default: "available",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: undefined,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: undefined,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

equipmentSchema.index({ serialNumber: 1 }, { unique: true });
equipmentSchema.index({ owner: 1 });

export const EquipmentModel = model<EquipmentDocument>("Equipment", equipmentSchema);
