import { prisma } from "../config/prisma";

export class UserService {
  async getUsers() {
    return prisma.user.findMany({
      include: {
        _count: {
          select: { assignedTasks: true },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        assignedTasks: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!user) {
      const error = new Error(`User with id '${id}' not found`);
      (error as unknown as { statusCode: number }).statusCode = 404;
      throw error;
    }

    return user;
  }
}

export const userService = new UserService();
