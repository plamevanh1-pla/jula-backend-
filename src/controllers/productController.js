 import supabase from "../config/supabaseClient.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
const {
name,
description,
price,
image,
category,
} = req.body;

const { data, error } = await supabase
.from("products")
.insert([
{
name,
description,
price,
image,
category,
seller_id: req.user.id,
},
])
.select();

if (error) {
return res.status(400).json(error);
}

res.status(201).json(data);
};

// GET PRODUCT BY ID
export const getProductById = async (req, res) => {
const { id } = req.params;

const { data, error } = await supabase
.from("products")
.select("*")
.eq("id", id)
.single();

if (error) {
return res.status(404).json(error);
}

res.json(data);
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
const { data, error } = await supabase
.from("products")
.select("*");

if (error) {
return res.status(400).json(error);
}

res.json(data);
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
const { id } = req.params;

const { data, error } = await supabase
.from("products")
.update(req.body)
.eq("id", id)
.eq("seller_id", req.user.id)
.select();

if (error) {
return res.status(400).json(error);
}

res.json(data);
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
const { id } = req.params;

const { error } = await supabase
.from("products")
.delete()
.eq("id", id)
.eq("seller_id", req.user.id);

if (error) {
return res.status(400).json(error);
}

res.json({
success: true,
message: "Product deleted",
});
};