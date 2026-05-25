import { eq, sql } from "drizzle-orm";

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

/**
 * Get task statistics grouped by status
 */
export async function getTaskStatistics(databaseUrl?: string): Promise<{
  todo: number;
  inProgress: number;
  done: number;
  total: number;
}> {
  const db = getDb(databaseUrl);
  
  const result = await db
    .select({
      status: tasks.status,
      count: sql<number>`cast(count(*) as integer)`,
    })
    .from(tasks)
    .groupBy(tasks.status);

  const stats = {
    todo: 0,
    inProgress: 0,
    done: 0,
    total: 0,
  };

  for (const row of result) {
    const count = Number(row.count);
    stats.total += count;
    
    if (row.status === "todo") {
      stats.todo = count;
    } else if (row.status === "in_progress") {
      stats.inProgress = count;
    } else if (row.status === "done") {
      stats.done = count;
    }
  }

  return stats;
}
