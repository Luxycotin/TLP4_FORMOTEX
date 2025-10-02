import { Types } from "mongoose";
import { ApiError } from "../errors/api-error.js";
import { EquipmentModel, } from "../models/equipment.model.js";
const toEquipmentResponse = (equipment) => ({
    id: equipment.id,
    name: equipment.name,
    serialNumber: equipment.serialNumber,
    type: equipment.type,
    status: equipment.status,
    description: equipment.description ?? undefined,
    owner: equipment.owner
        ? {
            id: equipment.owner.id,
            name: equipment.owner.name,
            email: equipment.owner.email,
            role: equipment.owner.role,
        }
        : undefined,
    createdAt: equipment.createdAt,
    updatedAt: equipment.updatedAt,
});
const ensureSerialIsAvailable = async (serialNumber, excludeId) => {
    const query = { serialNumber };
    if (excludeId) {
        query._id = { $ne: excludeId };
    }
    const exists = await EquipmentModel.exists(query);
    if (exists) {
        throw new ApiError(409, "Serial number already registered");
    }
};
const ownerIdFromValue = (owner) => {
    if (!owner) {
        return undefined;
    }
    if (owner instanceof Types.ObjectId) {
        return owner.toString();
    }
    return owner.id;
};
const assertOwnership = (actor, owner) => {
    if (actor.role === "admin") {
        return;
    }
    const ownerId = ownerIdFromValue(owner);
    if (!ownerId || ownerId !== actor.id) {
        throw new ApiError(403, "You can only manage your own equipment");
    }
};
const populateOwner = async (equipment) => equipment.populate({
    path: "owner",
    select: "name email role",
});
export const listEquipment = async (actor) => {
    const filter = actor.role === "admin" ? {} : { owner: actor.id };
    const equipment = await EquipmentModel.find(filter)
        .sort({ createdAt: -1 })
        .populate({ path: "owner", select: "name email role" })
        .exec();
    return equipment.map((item) => toEquipmentResponse(item));
};
export const getEquipmentById = async (actor, id) => {
    const equipment = await EquipmentModel.findById(id)
        .populate({ path: "owner", select: "name email role" })
        .exec();
    if (!equipment) {
        throw new ApiError(404, "Equipment not found");
    }
    assertOwnership(actor, equipment.owner);
    return toEquipmentResponse(equipment);
};
export const createEquipment = async (actor, input) => {
    await ensureSerialIsAvailable(input.serialNumber);
    const ownerId = actor.role === "admin" ? input.ownerId ?? actor.id : actor.id;
    const payload = {
        name: input.name,
        serialNumber: input.serialNumber,
        type: input.type,
        status: input.status ?? "available",
        description: input.description,
    };
    if (ownerId) {
        payload.owner = ownerId;
    }
    const equipment = await EquipmentModel.create(payload);
    const populated = await populateOwner(equipment);
    return toEquipmentResponse(populated);
};
export const updateEquipment = async (actor, id, input) => {
    const equipment = await EquipmentModel.findById(id);
    if (!equipment) {
        throw new ApiError(404, "Equipment not found");
    }
    assertOwnership(actor, equipment.owner);
    if (input.serialNumber && input.serialNumber !== equipment.serialNumber) {
        await ensureSerialIsAvailable(input.serialNumber, id);
        equipment.serialNumber = input.serialNumber;
    }
    if (input.name) {
        equipment.name = input.name;
    }
    if (input.type) {
        equipment.type = input.type;
    }
    if (input.status) {
        equipment.status = input.status;
    }
    if (typeof input.description !== "undefined") {
        equipment.description = input.description ?? undefined;
    }
    if (actor.role === "admin") {
        if (input.ownerId === null) {
            equipment.set("owner", undefined);
        }
        else if (typeof input.ownerId === "string") {
            equipment.set("owner", input.ownerId);
        }
    }
    await equipment.save();
    const populated = await populateOwner(equipment);
    return toEquipmentResponse(populated);
};
export const deleteEquipment = async (actor, id) => {
    const equipment = await EquipmentModel.findById(id);
    if (!equipment) {
        throw new ApiError(404, "Equipment not found");
    }
    assertOwnership(actor, equipment.owner);
    await equipment.deleteOne();
};
//# sourceMappingURL=equipment.service.js.map