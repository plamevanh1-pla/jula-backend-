 import supabase from "../config/supabaseClient.js";

// ➕ CREATE PRODUCT
export const createProduct = async (req, res) => {
const sellerId = req.user.id;
const { name, price, description } = req.body;

const { data, error } = await supabase
.from("products")
.insert([
{
name,
price,
description,
seller_id: sellerId,
},
])
.select();

if (error) return res.status(400).json({ error });

res.json(data[0]);
};

// 📦 GET SELLER PRODUCTS
export const getSellerProducts = async (req, res) => {
const sellerId = req.user.id;

const { data, error } = await supabase
.from("products")
.select("*")
.eq("seller_id", sellerId);

if (error) return res.status(400).json({ error });

res.json(data);
};

// ✏️ UPDATE PRODUCT
export const updateProduct = async (req, res) => {
const sellerId = req.user.id;
const { id } = req.params;

const { data, error } = await supabase
.from("products")
.update(req.body)
.eq("id", id)
.eq("seller_id", sellerId);

if (error) return res.status(400).json({ error });

res.json(data);
};

// ❌ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
const sellerId = req.user.id;
const { id } = req.params;

const { error } = await supabase
.from("products")
.delete()
.eq("id", id)
.eq("seller_id", sellerId);

if (error) return res.status(400).json({ error });

res.json({ message: "Product deleted" });
};