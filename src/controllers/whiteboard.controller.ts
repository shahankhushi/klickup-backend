import { Request, Response, NextFunction } from "express";
import { whiteboardService } from "../services/whiteboard.service";

export class WhiteboardController {
  async getWhiteboards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const whiteboards = await whiteboardService.getWhiteboards();
      res.status(200).json({
        success: true,
        count: whiteboards.length,
        data: whiteboards,
      });
    } catch (error) {
      next(error);
    }
  }

  async getWhiteboardById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const whiteboard = await whiteboardService.getWhiteboardById(String(req.params.id));
      res.status(200).json({
        success: true,
        data: whiteboard,
      });
    } catch (error) {
      next(error);
    }
  }

  async createWhiteboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const whiteboard = await whiteboardService.createWhiteboard(req.body);
      res.status(201).json({
        success: true,
        message: "Whiteboard created successfully",
        data: whiteboard,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateWhiteboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const whiteboard = await whiteboardService.updateWhiteboard(String(req.params.id), req.body);
      res.status(200).json({
        success: true,
        message: "Whiteboard updated successfully",
        data: whiteboard,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteWhiteboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await whiteboardService.deleteWhiteboard(String(req.params.id));
      res.status(200).json({
        success: true,
        message: "Whiteboard deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const whiteboardController = new WhiteboardController();
