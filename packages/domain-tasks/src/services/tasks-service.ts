import { getDb } from "@guild-optimized/db";
import { tasks } from "@guild-optimized/db";
import { eq } from "drizzle-orm";
import type { Task, NewTask } from "@guild-optimized/db";

export async function getAllTasks(): Promise<Task[]> {
  const db = getDb();
  return db.select().from(tasks).orderBy(tasks.createdAt);
}

export async function getTaskById(id: string): Promise<Task | null> {
  const db = getDb();
  const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
  return result[0] ?? null;
}

export async function createTask(data: Pick<NewTask, "title" | "description">): Promise<Task> {
  const db = getDb();
  const result = await db.insert(tasks).values(data).returning();
  const task = result[0];
  if (!task) throw new Error("Failed to create task");
  return task;
}

export async function updateTask(
  id: string,
  data: Partial<Pick<NewTask, "title" | "description" | "completed">>
): Promise<Task | null> {
  const db = getDb();
  const result = await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tasks.id, id))
    .returning();
  return result[0] ?? null;
}

export async function deleteTask(id: string): Promise<boolean> {
  const db = getDb();
  const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();
  return result.length > 0;
}
