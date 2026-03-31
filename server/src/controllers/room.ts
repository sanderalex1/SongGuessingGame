import type { Request, Response } from "express";
import * as roomManager from "../socket/roomManager.js";

export const createRoom = (req: Request, res: Response) => {
  const { username } = req.body;
  const id = req.userId;
  if (id) {
    const result = roomManager.createRoom(id, username);
    return res.status(201).json(result);
  }
};
export const allRooms = (req: Request, res: Response) => {
  const result = roomManager.getAllRooms();
  return res.status(200).json(result);
};
export const roomByCode = (req: Request, res: Response) => {
  const code = req.params.code as string;
  const result = roomManager.getRoom(code);
  return res.status(200).json(result);
};
