import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { getActivities } from "../controllers/activity.controller.js";

const router = Router();

router.get("/get", authenticate, requireRole(["USER"]), getActivities);


export default router;