import express from "express";
import {
    createProduct,
    deleteProduct,
    getSellerProducts,
    updateProduct,
} from "../controllers/sellerController.js";

import { authMiddleware } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";

const router = express.Router();

// 🔐 SELLER ONLY
router.use(authMiddleware);
router.use(requireRole("seller"));

// ➕ CREATE
router.post("/products", createProduct);

// 📦 READ
router.get("/products", getSellerProducts);

// ✏️ UPDATE
router.put("/products/:id", updateProduct);

// ❌ DELETE
router.delete("/products/:id", deleteProduct);

export default router;