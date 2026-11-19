import { Router } from "express";
import { z } from "zod";
import { documentController } from "../controllers/document.controller";
import { validate } from "../middlewares/validate";
import multer from "multer";
import fs from "fs";
import path from "path";

const body = z.object({
  title: z.string().max(240).optional(), description: z.string().max(4000).nullable().optional(), icon: z.string().max(16).optional(),
  coverImage: z.string().url().nullable().optional(), ownerId: z.string().nullable().optional(), workspaceId: z.string().nullable().optional(),
  departmentId: z.string().nullable().optional(), projectId: z.string().nullable().optional(), folderId: z.string().nullable().optional(),
  visibility: z.enum(["private", "workspace", "department", "project"]).optional(), category: z.string().max(100).nullable().optional(), tags: z.array(z.string().max(60)).max(20).optional(),
  content: z.unknown().optional(), isPinned: z.boolean().optional(), isFavorite: z.boolean().optional(), archivedAt: z.string().nullable().optional(), deletedAt: z.string().nullable().optional(), editorId: z.string().nullable().optional(),
}).strict();
const router = Router();
const uploadDirectory = path.join(process.cwd(), "uploads", "documents");
fs.mkdirSync(uploadDirectory, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_req, file, callback) => callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => callback(null, ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype)),
});
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) { res.status(400).json({ success: false, message: "A JPG, PNG, WebP, or GIF image is required." }); return; }
  res.status(201).json({ success: true, data: { url: `/uploads/documents/${req.file.filename}`, alt: path.parse(req.file.originalname).name } });
});
router.get("/", (req, res, next) => documentController.list(req, res, next));
router.post("/", validate(body), (req, res, next) => documentController.create(req, res, next));
router.get("/:id", (req, res, next) => documentController.get(req, res, next));
router.patch("/:id", validate(body), (req, res, next) => documentController.update(req, res, next));
router.post("/:id/duplicate", (req, res, next) => documentController.duplicate(req, res, next));
router.post("/:id/archive", (req, res, next) => documentController.archive(req, res, next));
router.get("/:id/versions", (req, res, next) => documentController.versions(req, res, next));
router.post("/:id/versions/:versionId/restore", (req, res, next) => documentController.restoreVersion(req, res, next));
router.delete("/:id", (req, res, next) => documentController.remove(req, res, next));
export const documentRoutes = router;
