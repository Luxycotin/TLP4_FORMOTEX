import { Router } from "express";
import {
  createEquipmentController,
  deleteEquipmentController,
  getEquipmentController,
  listEquipmentController,
  updateEquipmentController,
} from "../controllers/equipment.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", listEquipmentController);
router.post("/", createEquipmentController);
router.get("/:id", getEquipmentController);
router.patch("/:id", updateEquipmentController);
router.delete("/:id", deleteEquipmentController);

export default router;
