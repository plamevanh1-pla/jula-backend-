  import supabase from "../config/supabaseClient.js";
import { createPaydunyaPayment } from "../services/paydunyaService.js";

export const createPayment = async (req, res) => {
try {
const userId = req.user?.id;
const { orderId } = req.body;

if (!userId) {
  return res.status(401).json({
    success: false,
    error: "Unauthorized",
  });
}

if (!orderId) {
  return res.status(400).json({
    success: false,
    error: "Order ID is required",
  });
}

const { data: order, error } = await supabase
  .from("orders")
  .select("*")
  .eq("id", orderId)
  .single();

if (error || !order) {
  return res.status(404).json({
    success: false,
    error: "Order not found",
  });
}

if (order.user_id !== userId) {
  return res.status(403).json({
    success: false,
    error: "Access denied",
  });
}

const payment = await createPaydunyaPayment(order);

if (!payment) {
  return res.status(500).json({
    success: false,
    error: "Payment creation failed",
  });
}

return res.status(200).json({
  success: true,
  orderId: order.id,
  token: payment.token,
  paymentUrl: payment.response_url,
});

} catch (error) {
console.error("Payment Error:", error);

return res.status(500).json({
  success: false,
  error: error.message,
});

}
};