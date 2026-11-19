import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "in_review", "done"]).default("todo"),
  priority: z.enum(["urgent", "high", "normal", "low"]).default("normal"),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional().nullable(),
  projectId: z.string().min(1, "Project ID is required"),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(["todo", "in_progress", "in_review", "done"]).optional(),
  priority: z.enum(["urgent", "high", "normal", "low"]).optional(),
  dueDate: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  projectId: z.string().optional(),
  order: z.number().int().optional(),
});

export const createChecklistItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const updateChecklistItemSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
});

export const createCommentSchema = z.object({
  authorId: z.string().min(1, "Author ID is required"),
  text: z.string().min(1, "Comment text is required"),
});

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  color: z.string().default("#f59e0b"),
  spaceId: z.string().min(1, "Space ID is required"),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  color: z.string().optional(),
  spaceId: z.string().optional(),
});

export const createSpaceSchema = z.object({
  name: z.string().min(1, "Space name is required"),
  description: z.string().optional(),
  color: z.string().default("#6d28d9"),
  icon: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
