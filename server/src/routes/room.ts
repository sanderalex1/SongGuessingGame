import { Router } from "express";
import { allRooms, createRoom, roomByCode } from "../controllers/room.js";
import { userCheck } from "../middleware/authGuard.js";
const roomRouter = Router();

roomRouter.post("/rooms", userCheck, createRoom);
roomRouter.get("/rooms", allRooms);
roomRouter.get("/rooms/:code", roomByCode);

export default roomRouter;
