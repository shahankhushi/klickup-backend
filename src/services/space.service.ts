import { prisma } from "../config/prisma";
import { CreateSpaceInput } from "../types";

export class SpaceService {
  async getSpaces() {
    return prisma.space.findMany({
      include: {
        projects: {
          include: {
            _count: {
              select: { tasks: true },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async getSpaceById(id: string) {
    const space = await prisma.space.findUnique({
      where: { id },
      include: {
        projects: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!space) {
      const error = new Error(`Space with id '${id}' not found`);
      (error as unknown as { statusCode: number }).statusCode = 404;
      throw error;
    }

    return space;
  }

  async createSpace(data: CreateSpaceInput) {
    return prisma.space.create({
      data,
      include: {
        projects: true,
      },
    });
  }
}

export const spaceService = new SpaceService();
