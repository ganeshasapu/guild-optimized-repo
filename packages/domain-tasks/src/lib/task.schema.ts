import { z } from "zod";

export const TaskStatusSchema = z.enum(["todo", "in_progress", "done"]);

export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  status: TaskStatusSchema.default("todo"),
});

// Use z.input to capture the "before defaults are applied" shape
export type CreateTaskInput = z.input<typeof CreateTaskSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: TaskStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TaskDto = z.infer<typeof TaskSchema>;
