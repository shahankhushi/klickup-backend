import { Router } from "express";
import { projectController } from "../controllers/project.controller";
import { validate } from "../middlewares/validate";
import { createProjectSchema, updateProjectSchema } from "../types";

const router = Router();

router.get("/", (req, res, next) => projectController.getProjects(req, res, next));
router.get("/:id", (req, res, next) => projectController.getProjectById(req, res, next));
router.post("/", validate(createProjectSchema), (req, res, next) => projectController.createProject(req, res, next));
router.patch("/:id", validate(updateProjectSchema), (req, res, next) =>
  projectController.updateProject(req, res, next)
);
router.delete("/:id", (req, res, next) => projectController.deleteProject(req, res, next));

export const projectRoutes = router;
