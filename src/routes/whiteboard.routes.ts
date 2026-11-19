import { Router } from "express";
import { whiteboardController } from "../controllers/whiteboard.controller";

const router = Router();

router.get("/", (req, res, next) => whiteboardController.getWhiteboards(req, res, next));
router.get("/:id", (req, res, next) => whiteboardController.getWhiteboardById(req, res, next));
router.post("/", (req, res, next) => whiteboardController.createWhiteboard(req, res, next));
router.patch("/:id", (req, res, next) => whiteboardController.updateWhiteboard(req, res, next));
router.delete("/:id", (req, res, next) => whiteboardController.deleteWhiteboard(req, res, next));

export const whiteboardRoutes = router;
