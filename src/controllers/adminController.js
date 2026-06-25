 import supabase from "../config/supabaseClient.js";

// 📊 GLOBAL STATS
export const getStats = async (req, res) => {
try {
const { data: users, error: usersError } = await supabase
.from("users")
.select("*");

const { data: orders, error: ordersError } = await supabase
  .from("orders")
  .select("*");

if (usersError) throw usersError;
if (ordersError) throw ordersError;

const totalRevenue =
  orders?.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  ) || 0;

const stats = {
  totalUsers: users?.length || 0,
  totalOrders: orders?.length || 0,
  totalRevenue,
  pendingOrders:
    orders?.filter(
      (order) => order.status === "pending"
    ).length || 0,
  paidOrders:
    orders?.filter(
      (order) => order.status === "paid"
    ).length || 0,
};

return res.status(200).json(stats);

} catch (error) {
console.error("Stats Error:", error);

return res.status(500).json({
  success: false,
  message: "Failed to load statistics",
  error: error.message,
});

}
};