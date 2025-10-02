import { Types, type HydratedDocument } from "mongoose";
import { ApiError } from "../errors/api-error.js";
import {
  EquipmentModel,
  type EquipmentDocument,
  type EquipmentStatus,
  type EquipmentType,
} from "../models/equipment.model.js";
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

type PopulatedEquipment = HydratedDocument<EquipmentDocument> & {
  owner?: UserDocument | null;
};

const toEquipmentResponse = (equipment: PopulatedEquipment): EquipmentResponse => ({
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

const ensureSerialIsAvailable = async (serialNumber: string, excludeId?: string): Promise<void> => {
  const query: Record<string, unknown> = { serialNumber };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const exists = await EquipmentModel.exists(query);

  if (exists) {
    throw new ApiError(409, "Serial number already registered");
  }
};

const ownerIdFromValue = (
  owner: UserDocument | Types.ObjectId | undefined | null,
): string | undefined => {
  if (!owner) {
    return undefined;
  }

  if (owner instanceof Types.ObjectId) {
    return owner.toString();
  }

  return owner.id;
};

const assertOwnership = (
  actor: AuthenticatedUser,
  owner: UserDocument | Types.ObjectId | undefined | null,
): void => {
  if (actor.role === "admin") {
    return;
  }

  const ownerId = ownerIdFromValue(owner);

  if (!ownerId || ownerId !== actor.id) {
    throw new ApiError(403, "You can only manage your own equipment");
  }
};

const populateOwner = async (
  equipment: HydratedDocument<EquipmentDocument>,
): Promise<PopulatedEquipment> =>
  equipment.populate<{ owner: UserDocument | null }>({
    path: "owner",
    select: "name email role",
  }) as Promise<PopulatedEquipment>;

export const listEquipment = async (
  actor: AuthenticatedUser,
): Promise<EquipmentResponse[]> => {
  const filter = actor.role === "admin" ? {} : { owner: actor.id };

  const equipment = await EquipmentModel.find(filter)
    .sort({ createdAt: -1 })
    .populate<{ owner: UserDocument | null }>({ path: "owner", select: "name email role" })
    .exec();

  return equipment.map((item) => toEquipmentResponse(item as PopulatedEquipment));
};

export const getEquipmentById = async (
  actor: AuthenticatedUser,
  id: string,
): Promise<EquipmentResponse> => {
  const equipment = await EquipmentModel.findById(id)
    .populate<{ owner: UserDocument | null }>({ path: "owner", select: "name email role" })
    .exec();

  if (!equipment) {
    throw new ApiError(404, "Equipment not found");
  }

  assertOwnership(actor, equipment.owner);

  return toEquipmentResponse(equipment as PopulatedEquipment);
};

export const createEquipment = async (
  actor: AuthenticatedUser,
  input: CreateEquipmentInput,
): Promise<EquipmentResponse> => {
  await ensureSerialIsAvailable(input.serialNumber);

  const ownerId = actor.role === "admin" ? input.ownerId ?? actor.id : actor.id;
  const payload: Record<string, unknown> = {
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

export const updateEquipment = async (
  actor: AuthenticatedUser,
  id: string,
  input: UpdateEquipmentInput,
): Promise<EquipmentResponse> => {
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
    } else if (typeof input.ownerId === "string") {
      equipment.set("owner", input.ownerId);
    }
  }

  await equipment.save();
  const populated = await populateOwner(equipment);

  return toEquipmentResponse(populated);
};

export const deleteEquipment = async (
  actor: AuthenticatedUser,
  id: string,
): Promise<void> => {
  const equipment = await EquipmentModel.findById(id);

  if (!equipment) {
    throw new ApiError(404, "Equipment not found");
  }

  assertOwnership(actor, equipment.owner);

  await equipment.deleteOne();
};
