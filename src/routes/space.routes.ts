import { Router } from "express";
import { spaceController } from "../controllers/space.controller";
import { validate } from "../middlewares/validate";
import { createSpaceSchema } from "../types";

const router = Router();

router.get("/", (req, res, next) => spaceController.getSpaces(req, res, next));
router.get("/:id", (req, res, next) => spaceController.getSpaceById(req, res, next));
router.post("/", validate(createSpaceSchema), (req, res, next) => spaceController.createSpace(req, res, next));

export const spaceRoutes = router;
