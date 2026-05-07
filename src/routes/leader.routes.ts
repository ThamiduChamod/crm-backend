import Router from "express";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { saveLeader, getAll } from "../controllers/leader.controller.js";

const router = Router();
// router.post("/save", saveLeader);
router.post("/save", authenticate, requireRole(["USER"]), saveLeader);
router.get("/all", authenticate, requireRole(["USER"]), getAll);
// router.get("/details/:id", authenticate, requireRole(["USER"]), getLeaderDetails);
// router.put("/update/:id", authenticate, requireRole(["USER"]), updateLeader);
// router.delete("/delete/:id", authenticate, requireRole(["USER"]), deleteLeader);


export default router;