import "dotenv/config";
import express from "express";
import cors from "cors";
// import router from "./routes/auth.js";
import type { Request, Response, NextFunction } from "express";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

// app.use("/api/v1/", router);

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
