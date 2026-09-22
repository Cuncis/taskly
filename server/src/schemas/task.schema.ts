import { z } from "zod";

export const statusSchema = z.enum(["todo", "in_progress", "done"]);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().max(1000).optional(),
  status: statusSchema.default("todo"),
});

export const updateTaskSchema = createTaskSchema.partial(); // only allowed fields = "fillable"

export const listQuerySchema = z.object({
  status: statusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;