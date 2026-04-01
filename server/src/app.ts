import "dotenv/config";
import express from "express";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import { userCheck } from "./middleware/authGuard.js";
import authRouter from "./routes/auth.js";
import roomRouter from "./routes/room.js";
import { asyncHandler } from "./middleware/asyncHandler.js";
import { AppError } from "./middleware/AppError.js";
import songRouter from "./routes/song.js";
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/v1/", authRouter);
app.use("/api/v1/", roomRouter);
app.use("/api/v1/", songRouter);

app.get("/api/v1/protected", userCheck, (req: Request, res: Response) => {
  res.json({ message: "You are authenticated!", userId: req.userId });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.log(err);
  return res.status(500).json({ error: "Internal server error!" });
});

export default app;
