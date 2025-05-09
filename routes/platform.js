import express from "express";

import { getAdmins, getUserPerformance } from "../controllers/platform.js";

const router = express.Router();

// Routes
router.get("/admins", getAdmins);
router.get("/performance/:id", getUserPerformance);

export default router;
