import { Router } from "express";
import { createGuest, createUser, verifyUser } from "../controllers/auth.js";
const authRouter = Router();

authRouter.post("/auth/register", createUser);
authRouter.post("/auth/login", verifyUser);
authRouter.post("/auth/guest", createGuest);

export default authRouter;
