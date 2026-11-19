import { prisma } from "../config/prisma";
import { CreateProjectInput, UpdateProjectInput } from "../types";

export class ProjectService {
  async getProjects(spaceId?: string) {
    return prisma.project.findMany({
      where: spaceId ? { spaceId } : undefined,
      include: {
        space: true,
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async getProjectById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        space: true,
        tasks: {
          include: {
            assignee: true,
            checklist: true,
          },
        },
      },
    });

    if (!project) {
      const error = new Error(`Project with id '${id}' not found`);
      (error as unknown as { statusCode: number }).statusCode = 404;
      throw error;
    }

    return project;
  }

  async createProject(data: CreateProjectInput) {
    return prisma.project.create({
      data,
      include: {
        space: true,
      },
    });
  }

  async updateProject(id: string, data: UpdateProjectInput) {
    await this.getProjectById(id);
    return prisma.project.update({
      where: { id },
      data,
      include: {
        space: true,
      },
    });
  }

  async deleteProject(id: string) {
    await this.getProjectById(id);
    return prisma.project.delete({
      where: { id },
    });
  }
}

export const projectService = new ProjectService();
