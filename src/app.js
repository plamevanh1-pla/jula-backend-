import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

// =====================================
// 🚀 INIT APP
// =====================================
const app = express();

// =====================================
// 🔐 MIDDLEWARE
// =====================================
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// =====================================
// 🟢 TEST ROUTE
// =====================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Jula Backend V2 Running",
    status: "OK",
    time: new Date().toISOString(),
  });
});

// =====================================
// ❌ 404 HANDLER
// =====================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;