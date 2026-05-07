import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { saveNote, getNotesByLeadId } from "../controllers/note.controller.js";

const router = Router();

router.post("/save", authenticate, requireRole(["USER"]), saveNote);
router.get("/getNotes/:leadId", authenticate, requireRole(["USER"]), getNotesByLeadId);

export default router;