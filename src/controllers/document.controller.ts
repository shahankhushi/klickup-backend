import { NextFunction, Request, Response } from "express";
import { documentService } from "../services/document.service";

export class DocumentController {
  async list(req: Request, res: Response, next: NextFunction) { try { res.json({ success: true, data: await documentService.list(req.query as Record<string, string>) }); } catch (error) { next(error); } }
  async get(req: Request, res: Response, next: NextFunction) { try { res.json({ success: true, data: await documentService.get(String(req.params.id)) }); } catch (error) { next(error); } }
  async create(req: Request, res: Response, next: NextFunction) { try { res.status(201).json({ success: true, data: await documentService.create(req.body) }); } catch (error) { next(error); } }
  async update(req: Request, res: Response, next: NextFunction) { try { res.json({ success: true, data: await documentService.update(String(req.params.id), req.body) }); } catch (error) { next(error); } }
  async duplicate(req: Request, res: Response, next: NextFunction) { try { res.status(201).json({ success: true, data: await documentService.duplicate(String(req.params.id)) }); } catch (error) { next(error); } }
  async archive(req: Request, res: Response, next: NextFunction) { try { res.json({ success: true, data: await documentService.archive(String(req.params.id), Boolean(req.body.archived)) }); } catch (error) { next(error); } }
  async remove(req: Request, res: Response, next: NextFunction) { try { await documentService.remove(String(req.params.id)); res.status(204).end(); } catch (error) { next(error); } }
  async versions(req: Request, res: Response, next: NextFunction) { try { res.json({ success: true, data: await documentService.versions(String(req.params.id)) }); } catch (error) { next(error); } }
  async restoreVersion(req: Request, res: Response, next: NextFunction) { try { res.json({ success: true, data: await documentService.restoreVersion(String(req.params.id), String(req.params.versionId)) }); } catch (error) { next(error); } }
}
export const documentController = new DocumentController();
