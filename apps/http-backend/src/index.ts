import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./router/auth.route";
import roomRoutes from "./router/room.router";
import uploadRoutes from "./router/upload.router";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use(express.json());

app.use("/api/v1/", authRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/upload",uploadRoutes);

// const PORT = process.env.PORT || 9000;

app.listen(3001, () => {
  console.log(` Server running at PORT 3001`);
});