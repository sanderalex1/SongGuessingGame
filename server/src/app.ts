import "dotenv/config";
import express from "express";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import { userCheck } from "./middleware/authGuard.js";
import authRouter from "./routes/auth.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

app.use("/api/v1/", authRouter);

app.get("/api/v1/protected", userCheck, (req: Request, res: Response) => {
  res.json({ message: "You are authenticated!", userId: req.userId });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    switch (err) {
      //   case "ECONNREFUSED":
      //     console.log(err);
      //     return res.status(500).json({ error: "DB error!" });
      default:
        console.log(err);
        return res.status(500).json({ error: "Internal server error!" });
    }
  }
});

export default app;
