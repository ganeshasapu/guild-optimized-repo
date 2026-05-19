"use server";

import type { ApiResponse } from "@guild-optimized/shared";
import { deleteTask } from "../services/tasks-service";

export async function deleteTaskAction(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    const deleted = await deleteTask(id);
    if (!deleted) return { success: false, error: "Task not found" };
    return { success: true, data: { deleted: true } };
  } catch {
    return { success: false, error: "Failed to delete task" };
  }
}
