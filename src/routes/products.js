 import express from "express";

import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
} from "../controllers/productController.js";

import { authMiddleware } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";

const router = express.Router();

// PUBLIC PRODUCTS
router.get("/", getProducts);

// SINGLE PRODUCT
router.get("/:id", getProductById);

// CREATE PRODUCT
router.post(
"/",
authMiddleware,
requireRole("seller"),
createProduct
);

// UPDATE PRODUCT
router.put(
"/:id",
authMiddleware,
requireRole("seller"),
updateProduct
);

// DELETE PRODUCT
router.delete(
"/:id",
authMiddleware,
requireRole("seller"),
deleteProduct
);

export default router;