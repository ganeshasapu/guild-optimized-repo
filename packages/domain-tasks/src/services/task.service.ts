import { getDb, tasks } from "@guild-optimized/db";

import type { CreateTaskInput } from "../lib/task.schema";

export type TaskServiceDeps = {
  db?: ReturnType<typeof getDb>;
};

/**
 * List all tasks ordered by creation date descending.
 */
export async function listTasks(deps: TaskServiceDeps = {}) {
  const db = deps.db ?? getDb();
  return db.select().from(tasks).orderBy(tasks.createdAt);
}

/**
 * Create a new task.
 */
export async function createTask(
  input: CreateTaskInput,
  deps: TaskServiceDeps = {},
) {
  const db = deps.db ?? getDb();
  const result = await db.insert(tasks).values(input).returning();
  const task = result[0];
  if (!task) {
    throw new Error("Failed to create task");
  }
  return task;
}
