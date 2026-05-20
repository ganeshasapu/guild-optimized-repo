"use server";

import type { Task } from "@guild-optimized/db";
import { updateTaskSchema } from "../lib/validation";
import { updateTask as updateTaskService } from "../services/task.service";

type UpdateTaskResult =
  | { success: true; data: Task }
  | { success: false; error: string };

/**
 * Server action to update an existing task
 * Validates input and calls the task service
 */
export async function updateTask(
  id: string,
  input: unknown
): Promise<UpdateTaskResult> {
  try {
    // Validate ID
    if (!id || typeof id !== "string") {
      return {
        success: false,
        error: "Invalid task ID",
      };
    }

    // Validate input using Zod schema
    const validatedData = updateTaskSchema.parse(input);

    // Call service layer
    const task = await updateTaskService(id, validatedData);

    if (!task) {
      return {
        success: false,
        error: "Task not found",
      };
    }

    return { success: true, data: task };
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Invalid input: " + error.message,
      };
    }

    // Handle database/service errors
    if (error instanceof Error) {
      return {
        success: false,
        error: "Failed to update task: " + error.message,
      };
    }

    // Fallback error message
    return {
      success: false,
      error: "An unexpected error occurred while updating the task",
    };
  }
}
