import * as authService from "../services/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const result = await authService.createUser(username, email, password);
  return res.status(201).json(result);
});

export const verifyUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.verifyUser(email, password);
  return res.status(200).json(result);
});

export const createGuest = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const result = await authService.createGuest(username);
  return res.status(201).json(result);
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
  }
  const result = authService.refreshAccessToken(refreshToken);
  return res.status(200).json(result);
});
