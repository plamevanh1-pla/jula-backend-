   import supabase from "../config/supabaseClient.js";
import {
  comparePassword, generateAccessToken,
  generateRefreshToken
} from "../services/authService.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const valid = await comparePassword(password, user.password);

  if (!valid) {
    return res.status(401).json({ error: "Wrong password" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
};