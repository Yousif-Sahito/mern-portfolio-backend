import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp(io) {
  const app = express();

  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    })
  );

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Static uploads
  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

  // Health
  app.get("/health", (req, res) => res.json({ ok: true }));

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes(io)); // ✅ pass io here
  app.use("/api/messages", messageRoutes);

  // Error handler
  app.use(errorHandler);

  app.use("/api/messages", messageRoutes);


  return app;
}