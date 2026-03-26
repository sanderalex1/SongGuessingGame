import * as authService from "../services/auth.js";
import type { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  return res
    .status(201)
    .json(await authService.createUser(username, email, password));
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.verifyUser(email, password);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(401).json({ error: (err as Error).message });
  }
};

export const createGuest = async (req: Request, res: Response) => {
  const { username } = req.body;

  return res.status(201).json(await authService.createGuest(username));
};
