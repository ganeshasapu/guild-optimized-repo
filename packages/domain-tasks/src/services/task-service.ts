import { eq } from "drizzle-orm";

import { getDb, tasks } from "@guild-optimized/db";

import type { CreateTaskInput, ListTasksInput } from "../lib/task-schema";
import type { Task } from "../types/index";

function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * List all tasks, optionally filtered by status.
 */
export async function listTasks(
  input: ListTasksInput = {},
  databaseUrl?: string,
): Promise<Task[]> {
  const db = getDb(databaseUrl);

  if (input.status) {
    return db.select().from(tasks).where(eq(tasks.status, input.status));
  }

  return db.select().from(tasks);
}

/**
 * Create a new task.
 */
export async function createTask(
  input: CreateTaskInput,
  databaseUrl?: string,
): Promise<Task> {
  const db = getDb(databaseUrl);

  const now = new Date();
  const id = generateId();

  const [task] = await db
    .insert(tasks)
    .values({
      id,
      title: input.title,
      status: input.status ?? "todo",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!task) {
    throw new Error("Failed to create task");
  }

  return task;
}
