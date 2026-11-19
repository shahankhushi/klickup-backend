import { Request, Response, NextFunction } from "express";
import { spaceService } from "../services/space.service";

export class SpaceController {
  async getSpaces(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const spaces = await spaceService.getSpaces();
      res.status(200).json({
        success: true,
        count: spaces.length,
        data: spaces,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSpaceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const space = await spaceService.getSpaceById(String(req.params.id));
      res.status(200).json({
        success: true,
        data: space,
      });
    } catch (error) {
      next(error);
    }
  }

  async createSpace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const space = await spaceService.createSpace(req.body);
      res.status(201).json({
        success: true,
        message: "Space created successfully",
        data: space,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const spaceController = new SpaceController();
