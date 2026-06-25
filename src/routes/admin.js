  import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/role.js";
const supabase = require("../config/supabaseClient");

const router = express.Router();

// ADMIN DASHBOARD STATS
router.get(
"/stats",                                                                
authMiddleware,
requireRole("admin"),
async (req, res) => {
try {
const { data: users, error: usersError } =
await supabase.from("users").select("*");

  const { data: orders, error: ordersError } =
    await supabase.from("orders").select("*");

  const { data: products, error: productsError } =
    await supabase.from("products").select("*");

  if (usersError || ordersError || productsError) {
    return res.status(500).json({
      error: "Database error",
    });
  }

  const totalRevenue =
    orders?.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    ) || 0;

  const pendingOrders =
    orders?.filter(
      (order) => order.status === "pending"
    ).length || 0;

  const paidOrders =
    orders?.filter(
      (order) => order.status === "paid"
    ).length || 0;

  res.json({
    totalUsers: users?.length || 0,
    totalOrders: orders?.length || 0,
    totalProducts: products?.length || 0,
    totalRevenue,
    pendingOrders,
    paidOrders,
  });
} catch (error) {
  res.status(500).json({
    error: "Server error",
    details: error.message,
  });
}

}
);

export default router;