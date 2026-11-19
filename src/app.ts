import express from "express";
import cors from "cors";
import { config } from "./config/env";
import { apiRoutes } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import path from "path";

export const app = express();

// Middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Request logging in development
if (config.nodeEnv === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
  });
}

// API Routes
app.use("/api", apiRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    name: "KlickUp Backend API",
    version: "1.0.0",
    docs: "/api/health",
    endpoints: {
      tasks: "/api/tasks",
      projects: "/api/projects",
      spaces: "/api/spaces",
      users: "/api/users",
    },
  });
});

// Central Error Handler
app.use(errorHandler);
