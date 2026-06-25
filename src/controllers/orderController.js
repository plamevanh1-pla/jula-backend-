 import supabase from "../config/supabaseClient.js";

// ➕ CREATE ORDER (CLIENT)
export const createOrder = async (req, res) => {
const userId = req.user.id;
const { items, total } = req.body;

const { data, error } = await supabase
.from("orders")
.insert([
{
user_id: userId,
items,
total,
status: "pending",
},
])
.select()
.single();

if (error) {
return res.status(400).json({ error: error.message });
}

res.json(data);
};

// 📦 GET USER ORDERS (CLIENT)
export const getUserOrders = async (req, res) => {
const userId = req.user.id;

const { data } = await supabase
.from("orders")
.select("*")
.eq("user_id", userId);

res.json(data);
};

// 👑 ADMIN / SELLER VIEW ALL
export const getAllOrders = async (req, res) => {
const { data } = await supabase
.from("orders")
.select("*")
.order("created_at", { ascending: false });

res.json(data);
};