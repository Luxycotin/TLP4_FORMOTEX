import { asyncHandler } from "../helpers/async-handler.js";
import { ApiError } from "../errors/api-error.js";
import { createEquipment, deleteEquipment, getEquipmentById, listEquipment, updateEquipment, } from "../services/equipment.service.js";
import { EQUIPMENT_STATUSES, EQUIPMENT_TYPES } from "../models/equipment.model.js";
const getActor = (req) => {
    if (!req.user) {
        throw new ApiError(401, "Authentication required");
    }
    return req.user;
};
const isValidType = (value) => typeof value === "string" && EQUIPMENT_TYPES.includes(value);
const isValidStatus = (value) => typeof value === "string" && EQUIPMENT_STATUSES.includes(value);
export const listEquipmentController = asyncHandler(async (req, res) => {
    const actor = getActor(req);
    const equipment = await listEquipment(actor);
    res.json(equipment);
});
export const getEquipmentController = asyncHandler(async (req, res) => {
    const actor = getActor(req);
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "Equipment id is required");
    }
    const equipment = await getEquipmentById(actor, id);
    res.json(equipment);
});
export const createEquipmentController = asyncHandler(async (req, res) => {
    const actor = getActor(req);
    const { name, serialNumber, type, status, description, ownerId } = req.body ?? {};
    if (typeof name !== "string" || name.trim().length < 2) {
        throw new ApiError(400, "Name must be at least 2 characters long");
    }
    if (typeof serialNumber !== "string" || serialNumber.trim().length === 0) {
        throw new ApiError(400, "Serial number is required");
    }
    if (!isValidType(type)) {
        throw new ApiError(400, "Invalid equipment type");
    }
    if (typeof status !== "undefined" && !isValidStatus(status)) {
        throw new ApiError(400, "Invalid equipment status");
    }
    if (actor.role !== "admin" && ownerId && ownerId !== actor.id) {
        throw new ApiError(403, "Users can only assign equipment to themselves");
    }
    const payload = {
        name: name.trim(),
        serialNumber: serialNumber.trim().toUpperCase(),
        type,
    };
    if (typeof status === "string") {
        payload.status = status;
    }
    if (typeof description === "string") {
        payload.description = description.trim();
    }
    if (typeof ownerId === "string") {
        payload.ownerId = ownerId;
    }
    const equipment = await createEquipment(actor, payload);
    res.status(201).json(equipment);
});
export const updateEquipmentController = asyncHandler(async (req, res) => {
    const actor = getActor(req);
    const { id } = req.params;
    const { name, serialNumber, type, status, description, ownerId } = req.body ?? {};
    if (!id) {
        throw new ApiError(400, "Equipment id is required");
    }
    const payload = {};
    if (typeof name === "string") {
        payload.name = name.trim();
    }
    if (typeof serialNumber === "string") {
        payload.serialNumber = serialNumber.trim().toUpperCase();
    }
    if (typeof type !== "undefined") {
        if (!isValidType(type)) {
            throw new ApiError(400, "Invalid equipment type");
        }
        payload.type = type;
    }
    if (typeof status !== "undefined") {
        if (!isValidStatus(status)) {
            throw new ApiError(400, "Invalid equipment status");
        }
        payload.status = status;
    }
    if (typeof description !== "undefined") {
        payload.description = typeof description === "string" ? description.trim() : null;
    }
    if (typeof ownerId !== "undefined") {
        if (actor.role !== "admin") {
            throw new ApiError(403, "Only admins can reassign equipment");
        }
        payload.ownerId = ownerId;
    }
    if (Object.keys(payload).length === 0) {
        throw new ApiError(400, "No fields provided for update");
    }
    const equipment = await updateEquipment(actor, id, payload);
    res.json(equipment);
});
export const deleteEquipmentController = asyncHandler(async (req, res) => {
    const actor = getActor(req);
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "Equipment id is required");
    }
    await deleteEquipment(actor, id);
    res.status(204).send();
});
//# sourceMappingURL=equipment.controller.js.map