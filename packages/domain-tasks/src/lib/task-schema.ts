import { z } from "zod";

export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  status: z.enum(TASK_STATUSES).default("todo"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const listTasksSchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
});

export type ListTasksInput = z.infer<typeof listTasksSchema>;
