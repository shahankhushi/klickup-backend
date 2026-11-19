import { prisma } from "../config/prisma";

export interface CreateWhiteboardInput {
  id?: string;
  name: string;
  description?: string;
  data?: string;
  projectId?: string;
  spaceId?: string;
}

export interface UpdateWhiteboardInput {
  name?: string;
  description?: string;
  data?: string;
  projectId?: string;
  spaceId?: string;
}

export class WhiteboardService {
  async getWhiteboards() {
    return prisma.whiteboard.findMany({
      orderBy: { updatedAt: "desc" },
    });
  }

  async getWhiteboardById(id: string) {
    const whiteboard = await prisma.whiteboard.findUnique({
      where: { id },
    });

    if (!whiteboard) {
      const error = new Error(`Whiteboard with id '${id}' not found`);
      (error as unknown as { statusCode: number }).statusCode = 404;
      throw error;
    }

    return whiteboard;
  }

  async createWhiteboard(input: CreateWhiteboardInput) {
    return prisma.whiteboard.create({
      data: {
        ...(input.id ? { id: input.id } : {}),
        name: input.name,
        description: input.description,
        data: input.data || "[]",
        projectId: input.projectId,
        spaceId: input.spaceId,
      },
    });
  }

  async updateWhiteboard(id: string, input: UpdateWhiteboardInput) {
    return prisma.whiteboard.upsert({
      where: { id },
      update: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.data !== undefined ? { data: input.data } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.projectId !== undefined ? { projectId: input.projectId } : {}),
        ...(input.spaceId !== undefined ? { spaceId: input.spaceId } : {}),
      },
      create: {
        id,
        name: input.name || "Untitled Whiteboard",
        data: input.data || "[]",
        description: input.description,
        projectId: input.projectId,
        spaceId: input.spaceId,
      },
    });
  }

  async deleteWhiteboard(id: string) {
    await this.getWhiteboardById(id);
    return prisma.whiteboard.delete({
      where: { id },
    });
  }
}

export const whiteboardService = new WhiteboardService();
