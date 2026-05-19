"use server";

import type { ApiResponse } from "@guild-optimized/shared";
import type { Task } from "@guild-optimized/db";
import { updateTask } from "../services/tasks-service";
import { updateTaskSchema } from "../lib/schemas";

export async function updateTaskAction(
  id: string,
  data: unknown
): Promise<ApiResponse<Task>> {
  const parsed = updateTaskSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Validation failed" };
  }

  try {
    const task = await updateTask(id, parsed.data);
    if (!task) return { success: false, error: "Task not found" };
    return { success: true, data: task };
  } catch {
    return { success: false, error: "Failed to update task" };
  }
}
