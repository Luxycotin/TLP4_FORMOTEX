import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getUserController,
  listUsersController,
  updateUserController,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/", listUsersController);
router.post("/", createUserController);
router.get("/:id", getUserController);
router.patch("/:id", updateUserController);
router.delete("/:id", deleteUserController);

export default router;
