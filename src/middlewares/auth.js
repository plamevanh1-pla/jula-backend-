    import { verifyAccessToken } from "../services/authService.js";

export const authMiddleware = (req, res, next) => {
try {
const authHeader = req.headers.authorization;

if (!authHeader) {
  return res.status(401).json({
    success: false,
    message: "No token provided",
  });
}

if (!authHeader.startsWith("Bearer ")) {
  return res.status(401).json({
    success: false,
    message: "Invalid authorization format",
  });
}

const token = authHeader.split(" ")[1];

const decoded = verifyAccessToken(token);

req.user = decoded;

next();

} catch (error) {
return res.status(401).json({
success: false,
message: "Invalid or expired token",
});
}
};