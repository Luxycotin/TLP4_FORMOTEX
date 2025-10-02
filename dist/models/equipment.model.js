import { Schema, model } from "mongoose";
export const EQUIPMENT_TYPES = [
    "desktop",
    "laptop",
    "printer",
    "peripheral",
    "network",
    "other",
];
export const EQUIPMENT_STATUSES = [
    "available",
    "assigned",
    "maintenance",
    "retired",
];
const equipmentSchema = new Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
equipmentSchema.index({ serialNumber: 1 }, { unique: true });
equipmentSchema.index({ owner: 1 });
export const EquipmentModel = model("Equipment", equipmentSchema);
//# sourceMappingURL=equipment.model.js.map