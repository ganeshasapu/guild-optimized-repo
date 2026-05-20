"use server";

import { deleteTask as deleteTaskService } from "../services/task.service";

type DeleteTaskResult =
  | { success: true; data: { deleted: boolean } }
  | { success: false; error: string };

/**
 * Server action to delete a task
 * Calls the task service to remove the task from the database
 */
export async function deleteTask(id: string): Promise<DeleteTaskResult> {
  try {
    // Validate ID
    if (!id || typeof id !== "string") {
      return {
        success: false,
        error: "Invalid task ID",
      };
    }

    // Call service layer
    const deleted = await deleteTaskService(id);

    if (!deleted) {
      return {
        success: false,
        error: "Task not found",
      };
    }

    return { success: true, data: { deleted: true } };
  } catch (error) {
    // Handle database/service errors
    if (error instanceof Error) {
      return {
        success: false,
        error: "Failed to delete task: " + error.message,
      };
    }

    // Fallback error message
    return {
      success: false,
      error: "An unexpected error occurred while deleting the task",
    };
  }
}
