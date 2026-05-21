import { eq } from "drizzle-orm";

import { getDb, tasks } from "@guild-optimized/db";

import type { CreateTaskInput, Task, UpdateTaskInput } from "../types/task";

/**
 * Create a new task
 */
export async function createTask(
  input: CreateTaskInput,
  databaseUrl?: string
): Promise<Task> {
  const db = getDb(databaseUrl);
  const [task] = await db
    .insert(tasks)
    .values({
      title: input.title,
      description: input.description,
      status: input.status ?? "todo",
      priority: input.priority ?? "medium",
    })
    .returning();

  if (!task) {
    throw new Error("Failed to create task");
  }

  return task;
}

/**
 * Get a task by ID
 */
export async function getTaskById(
  id: string,
  databaseUrl?: string
): Promise<Task | null> {
  const db = getDb(databaseUrl);
  const [task] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);

  return task ?? null;
}

/**
 * Get all tasks
 */
export async function getAllTasks(databaseUrl?: string): Promise<Task[]> {
  const db = getDb(databaseUrl);
  return db.select().from(tasks);
}

/**
 * Update a task by ID
 */
export async function updateTask(
  id: string,
  input: UpdateTaskInput,
  databaseUrl?: string
): Promise<Task | null> {
  const db = getDb(databaseUrl);
  const [task] = await db
    .update(tasks)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, id))
    .returning();

  return task ?? null;
}

/**
 * Delete a task by ID
 */
export async function deleteTask(
  id: string,
  databaseUrl?: string
): Promise<boolean> {
  const db = getDb(databaseUrl);
  const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();

  return result.length > 0;
}
