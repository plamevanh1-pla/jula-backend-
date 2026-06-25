 import express from "express";
import { createPayment } from "../controllers/paymentController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Paiement sécurisé avec utilisateur connecté
router.post("/create", authMiddleware, createPayment);

// Route de test/mock paiement
router.post("/", async (req, res) => {
try {
const { amount, order_id } = req.body;

if (!amount || !order_id) {
  return res.status(400).json({
    error: "Missing data",
  });
}

res.json({
  success: true,
  message: "Payment initiated",
  order_id,
  amount,
});

} catch (e) {
res.status(500).json({
error: e.message,
});
}
});

export default router;