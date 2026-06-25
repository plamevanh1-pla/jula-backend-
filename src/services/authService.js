 import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.JWT_SECRET; const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const generateAccessToken = (user) => { return jwt.sign( { id: user.id, email: user.email, role: user.role, }, ACCESS_SECRET, { expiresIn: "15m", } ); };
export const generateRefreshToken = (user) => { return jwt.sign( { id: user.id, }, REFRESH_SECRET, { expiresIn: "7d", } ); };
export const verifyAccessToken = (token) => { return jwt.verify(token, ACCESS_SECRET); };
export const verifyRefreshToken = (token) => { return jwt.verify(token, REFRESH_SECRET); };