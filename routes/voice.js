import express from "express";

import { getSales } from "../controllers/voice.js";

const router = express.Router();

// Routes
router.get("/sales", getSales);

export default router;
