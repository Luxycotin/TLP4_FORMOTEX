import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import equipmentRoutes from "./equipment.routes.js";
const router = Router();
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/equipment", equipmentRoutes);
export default router;
//# sourceMappingURL=index.js.map