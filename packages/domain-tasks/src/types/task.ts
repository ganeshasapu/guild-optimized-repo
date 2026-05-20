import type { Task as DbTask, InsertTask as DbInsertTask } from "@guild-optimized/db";

export type Task = DbTask;
export type InsertTask = DbInsertTask;

export type CreateTaskInput = {
  title: string;
  description?: string;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
};

export type UpdateTaskInput = {
  title?: string;
  description?: string;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
};
