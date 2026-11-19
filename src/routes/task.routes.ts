import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { validate } from "../middlewares/validate";
import {
  createTaskSchema,
  updateTaskSchema,
  createChecklistItemSchema,
  updateChecklistItemSchema,
  createCommentSchema,
} from "../types";

const router = Router();

// Tasks CRUD
router.get("/", (req, res, next) => taskController.getTasks(req, res, next));
router.get("/:id", (req, res, next) => taskController.getTaskById(req, res, next));
router.post("/", validate(createTaskSchema), (req, res, next) => taskController.createTask(req, res, next));
router.patch("/:id", validate(updateTaskSchema), (req, res, next) => taskController.updateTask(req, res, next));
router.delete("/:id", (req, res, next) => taskController.deleteTask(req, res, next));

// Checklist Subtasks
router.post("/:id/checklist", validate(createChecklistItemSchema), (req, res, next) =>
  taskController.addChecklistItem(req, res, next)
);
router.patch("/:id/checklist/:itemId", validate(updateChecklistItemSchema), (req, res, next) =>
  taskController.updateChecklistItem(req, res, next)
);
router.delete("/:id/checklist/:itemId", (req, res, next) =>
  taskController.deleteChecklistItem(req, res, next)
);

// Comments
router.post("/:id/comments", validate(createCommentSchema), (req, res, next) =>
  taskController.addComment(req, res, next)
);

export const taskRoutes = router;
