"use server";

import type { ApiResponse } from "@guild-optimized/shared";
import type { Task } from "@guild-optimized/db";
import { createTask } from "../services/tasks-service";
import { createTaskSchema } from "../lib/schemas";

export async function createTaskAction(
  formData: FormData
): Promise<ApiResponse<Task>> {
  const raw = {
    title: formData.get("title"),
    description: formData.get("description") ?? undefined,
  };

  const parsed = createTaskSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Validation failed" };
  }

  try {
    const task = await createTask(parsed.data);
    return { success: true, data: task };
  } catch {
    return { success: false, error: "Failed to create task" };
  }
}
