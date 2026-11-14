import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getMyGroup, saveMyGroup } from "../controllers/groupController.js";

const router = express.Router();

router.get("/", protect, getMyGroup);
router.put("/", protect, saveMyGroup);

export default router;
