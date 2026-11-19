import { Request, Response, NextFunction } from "express";
import { taskService } from "../services/task.service";

export class TaskController {
  async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, assigneeId, projectId, priority, search } = req.query;
      const tasks = await taskService.getTasks({
        status: status as string,
        assigneeId: assigneeId as string,
        projectId: projectId as string,
        priority: priority as string,
        search: search as string,
      });

      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await taskService.getTaskById(String(req.params.id));
      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await taskService.createTask(req.body);
      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await taskService.updateTask(String(req.params.id), req.body);
      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await taskService.deleteTask(String(req.params.id));
      res.status(200).json({
        success: true,
        message: "Task deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async addChecklistItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await taskService.addChecklistItem(String(req.params.id), req.body.title);
      res.status(201).json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateChecklistItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await taskService.updateChecklistItem(
        String(req.params.id),
        String(req.params.itemId),
        req.body
      );
      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteChecklistItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await taskService.deleteChecklistItem(String(req.params.id), String(req.params.itemId));
      res.status(200).json({
        success: true,
        message: "Checklist item deleted",
      });
    } catch (error) {
      next(error);
    }
  }

  async addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const comment = await taskService.addComment(String(req.params.id), req.body.authorId, req.body.text);
      res.status(201).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const taskController = new TaskController();
