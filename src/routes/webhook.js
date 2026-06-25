 import express from "express";
const supabase = require("../config/supabaseClient");

const router = express.Router();

// 🔥 PAYDUNYA WEBHOOK
router.post("/paydunya", async (req, res) => {
try {
const payload = req.body;

console.log("PAYDUNYA WEBHOOK:", payload);

const orderId = payload?.invoice?.custom_data?.order_id;
const status = payload?.status;

// 💳 si paiement réussi
if (status === "completed" || status === "success") {
  await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("id", orderId);
}

return res.status(200).json({ received: true });

} catch (error) {
console.error(error);
return res.status(500).json({ error: "Webhook error" });
}
});

export default router;