import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long").optional(),
  description: z.string().max(1000, "Description too long").optional(),
  completed: z.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
