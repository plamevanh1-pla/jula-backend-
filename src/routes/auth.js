      const express = require("express");
const {
generateAccessToken,
verifyRefreshToken,
} = require("../services/authService");

const router = express.Router();

router.post("/refresh", async (req, res) => {
try {
const { refreshToken } = req.body;

if (!refreshToken) {
  return res.status(401).json({
    success: false,
    message: "Refresh token missing",
  });
}

const decoded = verifyRefreshToken(refreshToken);

const accessToken = generateAccessToken({
  id: decoded.id,
  email: decoded.email,
  role: decoded.role,
});

return res.status(200).json({
  success: true,
  accessToken,
});

} catch (error) {
console.error("Refresh token error:", error.message);

return res.status(403).json({
  success: false,
  message: "Invalid or expired refresh token",
});

}
});

module.exports = router;