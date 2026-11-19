import { prisma } from "../config/prisma";
import { CreateTaskInput, UpdateTaskInput } from "../types";

export interface TaskFilter {
  status?: string;
  assigneeId?: string;
  projectId?: string;
  priority?: string;
  search?: string;
}

export class TaskService {
  async getTasks(filter?: TaskFilter) {
    const where: Record<string, unknown> = {};

    if (filter?.status && filter.status !== "all") {
      where.status = filter.status;
    }
    if (filter?.assigneeId && filter.assigneeId !== "all") {
      where.assigneeId = filter.assigneeId;
    }
    if (filter?.projectId && filter.projectId !== "all") {
      where.projectId = filter.projectId;
    }
    if (filter?.priority && filter.priority !== "all") {
      where.priority = filter.priority;
    }
    if (filter?.search) {
      where.title = {
        contains: filter.search,
      };
    }

    return prisma.task.findMany({
      where,
      include: {
        assignee: true,
        project: {
          include: {
            space: true,
          },
        },
        checklist: {
          orderBy: { order: "asc" },
        },
        comments: {
          include: { author: true },
          orderBy: { createdAt: "desc" },
        },
        activities: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: [{ dueDate: "asc" }, { order: "asc" }],
    });
  }

  async getTaskById(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
        project: {
          include: {
            space: true,
          },
        },
        checklist: {
          orderBy: { order: "asc" },
        },
        comments: {
          include: { author: true },
          orderBy: { createdAt: "desc" },
        },
        activities: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!task) {
      const error = new Error(`Task with id '${id}' not found`);
      (error as unknown as { statusCode: number }).statusCode = 404;
      throw error;
    }

    return task;
  }

  async createTask(data: CreateTaskInput) {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status ?? "todo",
        priority: data.priority ?? "normal",
        dueDate: data.dueDate,
        assigneeId: data.assigneeId,
        projectId: data.projectId,
        activities: {
          create: {
            action: "created",
            description: `Task "${data.title}" was created`,
          },
        },
      },
      include: {
        assignee: true,
        project: true,
        checklist: true,
        comments: true,
        activities: true,
      },
    });

    return task;
  }

  async updateTask(id: string, data: UpdateTaskInput) {
    // Check if task exists
    const existing = await this.getTaskById(id);

    // Track status change for activity log
    const activityLogs = [];
    if (data.status && data.status !== existing.status) {
      activityLogs.push({
        action: "status_changed",
        description: `Status changed from ${existing.status} to ${data.status}`,
      });
    }
    if (data.priority && data.priority !== existing.priority) {
      activityLogs.push({
        action: "priority_changed",
        description: `Priority changed from ${existing.priority} to ${data.priority}`,
      });
    }

    return prisma.task.update({
      where: { id },
      data: {
        ...data,
        activities: activityLogs.length > 0 ? { create: activityLogs } : undefined,
      },
      include: {
        assignee: true,
        project: true,
        checklist: true,
        comments: true,
        activities: true,
      },
    });
  }

  async deleteTask(id: string) {
    await this.getTaskById(id);
    return prisma.task.delete({
      where: { id },
    });
  }

  async addChecklistItem(taskId: string, title: string) {
    await this.getTaskById(taskId);
    return prisma.checklistItem.create({
      data: {
        taskId,
        title,
      },
    });
  }

  async updateChecklistItem(taskId: string, itemId: string, data: { title?: string; completed?: boolean }) {
    await this.getTaskById(taskId);
    return prisma.checklistItem.update({
      where: { id: itemId },
      data,
    });
  }

  async deleteChecklistItem(taskId: string, itemId: string) {
    await this.getTaskById(taskId);
    return prisma.checklistItem.delete({
      where: { id: itemId },
    });
  }

  async addComment(taskId: string, authorId: string, text: string) {
    await this.getTaskById(taskId);
    return prisma.comment.create({
      data: {
        taskId,
        authorId,
        text,
      },
      include: {
        author: true,
      },
    });
  }
}

export const taskService = new TaskService();
