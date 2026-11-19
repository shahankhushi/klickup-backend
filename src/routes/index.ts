import { Router } from "express";
import { taskRoutes } from "./task.routes";
import { projectRoutes } from "./project.routes";
import { spaceRoutes } from "./space.routes";
import { userRoutes } from "./user.routes";
import { whiteboardRoutes } from "./whiteboard.routes";
import { workspaceRoutes } from "./workspace.routes";
import { documentRoutes } from "./document.routes";

const router = Router();

router.use("/tasks", taskRoutes);
router.use("/projects", projectRoutes);
router.use("/spaces", spaceRoutes);
router.use("/users", userRoutes);
router.use("/whiteboards", whiteboardRoutes);
router.use("/workspace", workspaceRoutes);
router.use("/documents", documentRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "klickup-api",
  });
});

export const apiRoutes = router;
