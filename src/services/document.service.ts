import { prisma } from "../config/prisma";

export interface DocumentInput {
  title?: string;
  description?: string | null;
  icon?: string;
  coverImage?: string | null;
  ownerId?: string | null;
  workspaceId?: string | null;
  departmentId?: string | null;
  projectId?: string | null;
  folderId?: string | null;
  visibility?: "private" | "workspace" | "department" | "project";
  category?: string | null;
  tags?: string[];
  content?: unknown;
  isPinned?: boolean;
  isFavorite?: boolean;
  archivedAt?: string | null;
  deletedAt?: string | null;
  editorId?: string | null;
}

const blankContent = { type: "doc", content: [{ type: "paragraph" }] };

function serializeContent(content: unknown) {
  return JSON.stringify(content ?? blankContent);
}

function patch(input: DocumentInput) {
  return {
    ...(input.title !== undefined ? { title: input.title.trim() || "Untitled document" } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.icon !== undefined ? { icon: input.icon } : {}),
    ...(input.coverImage !== undefined ? { coverImage: input.coverImage } : {}),
    ...(input.ownerId !== undefined ? { ownerId: input.ownerId } : {}),
    ...(input.workspaceId !== undefined ? { workspaceId: input.workspaceId } : {}),
    ...(input.departmentId !== undefined ? { departmentId: input.departmentId } : {}),
    ...(input.projectId !== undefined ? { projectId: input.projectId } : {}),
    ...(input.folderId !== undefined ? { folderId: input.folderId } : {}),
    ...(input.visibility !== undefined ? { visibility: input.visibility } : {}),
    ...(input.category !== undefined ? { category: input.category } : {}),
    ...(input.tags !== undefined ? { tags: JSON.stringify(input.tags) } : {}),
    ...(input.content !== undefined ? { content: serializeContent(input.content) } : {}),
    ...(input.isPinned !== undefined ? { isPinned: input.isPinned } : {}),
    ...(input.isFavorite !== undefined ? { isFavorite: input.isFavorite } : {}),
    ...(input.archivedAt !== undefined ? { archivedAt: input.archivedAt ? new Date(input.archivedAt) : null } : {}),
    ...(input.deletedAt !== undefined ? { deletedAt: input.deletedAt ? new Date(input.deletedAt) : null } : {}),
  };
}

export class DocumentService {
  async list(query: { archived?: string; search?: string; projectId?: string }) {
    const where = {
      deletedAt: null,
      ...(query.archived === "true" ? { archivedAt: { not: null } } : { archivedAt: null }),
      ...(query.projectId ? { projectId: query.projectId } : {}),
      ...(query.search ? { title: { contains: query.search } } : {}),
    };
    return prisma.document.findMany({ where, orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }] });
  }

  async get(id: string) {
    const document = await prisma.document.findFirst({ where: { id, deletedAt: null } });
    if (!document) {
      const error = new Error(`Document with id '${id}' not found`);
      (error as Error & { statusCode?: number }).statusCode = 404;
      throw error;
    }
    return document;
  }

  async create(input: DocumentInput) {
    return prisma.document.create({
      data: {
        title: input.title?.trim() || "Untitled document",
        icon: input.icon || "📄",
        content: serializeContent(input.content),
        description: input.description,
        ownerId: input.ownerId,
        workspaceId: input.workspaceId,
        departmentId: input.departmentId,
        projectId: input.projectId,
        folderId: input.folderId,
        visibility: input.visibility || "workspace",
        category: input.category,
        tags: JSON.stringify(input.tags || []),
      },
    });
  }

  async update(id: string, input: DocumentInput) {
    const current = await this.get(id);
    const data = patch(input);
    const shouldSnapshot = input.content !== undefined && current.content !== serializeContent(input.content);
    return prisma.$transaction(async (tx) => {
      if (shouldSnapshot) {
        const latest = await tx.documentVersion.findFirst({ where: { documentId: id }, orderBy: { createdAt: "desc" } });
        if (!latest || latest.createdAt.getTime() < Date.now() - 3 * 60 * 1000) {
          await tx.documentVersion.create({
            data: { documentId: id, title: current.title, content: current.content, editorId: input.editorId },
          });
        }
      }
      return tx.document.update({ where: { id }, data });
    });
  }

  async duplicate(id: string) {
    const original = await this.get(id);
    return prisma.document.create({
      data: {
        title: `${original.title} (copy)`, icon: original.icon, description: original.description,
        content: original.content, contentVersion: original.contentVersion, ownerId: original.ownerId,
        workspaceId: original.workspaceId, departmentId: original.departmentId, projectId: original.projectId,
        folderId: original.folderId, visibility: original.visibility, category: original.category, tags: original.tags,
      },
    });
  }

  async archive(id: string, archived: boolean) {
    await this.get(id);
    return prisma.document.update({ where: { id }, data: { archivedAt: archived ? new Date() : null } });
  }

  async remove(id: string) {
    await this.get(id);
    return prisma.document.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async versions(id: string) {
    await this.get(id);
    return prisma.documentVersion.findMany({ where: { documentId: id }, orderBy: { createdAt: "desc" }, take: 30 });
  }

  async restoreVersion(id: string, versionId: string) {
    await this.get(id);
    const version = await prisma.documentVersion.findFirst({ where: { id: versionId, documentId: id } });
    if (!version) {
      const error = new Error("Version not found");
      (error as Error & { statusCode?: number }).statusCode = 404;
      throw error;
    }
    return prisma.document.update({ where: { id }, data: { title: version.title, content: version.content } });
  }
}

export const documentService = new DocumentService();
