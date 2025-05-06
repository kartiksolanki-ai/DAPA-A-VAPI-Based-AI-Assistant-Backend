import express from "express";

import { getUser, getDashboardStats } from "../controllers/logs.js";

const router = express.Router();

// Routes
router.get("/user/:id", getUser);
router.get("/dashboard", getDashboardStats);

export default router;
