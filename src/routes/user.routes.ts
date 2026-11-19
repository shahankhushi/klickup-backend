import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

router.get("/", (req, res, next) => userController.getUsers(req, res, next));
router.get("/:id", (req, res, next) => userController.getUserById(req, res, next));

export const userRoutes = router;
