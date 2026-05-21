import { z } from "zod";

export const taskStatusSchema = z.enum(["todo", "in_progress", "done"]);
export const taskPrioritySchema = z.enum(["low", "medium", "high"]);

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(500, "Title must be less than 500 characters"),
  description: z.string().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(500, "Title must be less than 500 characters").optional(),
  description: z.string().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
