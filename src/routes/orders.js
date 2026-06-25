  import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders
} from "../controllers/orderController.js";

import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// 🔒 CLIENT ORDERS
router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getUserOrders);

// 👑 ADMIN / SELLER
router.get("/all", authMiddleware, getAllOrders);

export default router;