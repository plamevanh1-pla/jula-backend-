import axios from "axios";
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
try {
const { origin, destination } = req.body;

const key = process.env.GOOGLE_MAPS_API_KEY;

const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${key}`;

const response = await axios.get(url);

res.json(response.data);

} catch (e) {
res.status(500).json({ error: e.message });
}
});

export default router;