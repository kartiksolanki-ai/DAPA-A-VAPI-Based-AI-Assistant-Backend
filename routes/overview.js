import express from "express";

import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
} from "../controllers/overview.js";

const router = express.Router();

// Routes
router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.get("/geography", getGeography);

export default router;
