import { Router } from "express";
import { createGuest, createUser, verifyUser } from "../controllers/auth.js";
const router = Router();

router.post("/auth/register", createUser);
router.post("/auth/login", verifyUser);
router.post("/auth/guest", createGuest);

export default router;
