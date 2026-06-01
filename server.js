 import app from "./src/app.js";

// =====================================
// 🚀 PORT CONFIG
// =====================================
const PORT = process.env.PORT || 5000;

// =====================================
// 🚀 START SERVER
// =====================================
app.listen(PORT, () => {
  console.log("🚀 Server running on port:", PORT);
  console.log("📦 Environment:", process.env.NODE_ENV || "development");
});

// =====================================
// 💥 GLOBAL ERROR HANDLING
// =====================================
process.on("uncaughtException", (err) => {
  console.log("❌ Uncaught Error:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.log("❌ Promise Error:", err);
});