"use server";

import type { Task } from "@guild-optimized/db";
import { createTaskSchema } from "../lib/validation";
import { createTask as createTaskService } from "../services/task.service";

type CreateTaskResult =
  | { success: true; data: Task }
  | { success: false; error: string };

/**
 * Server action to create a new task
 * Validates input and calls the task service
 */
export async function createTask(
  input: unknown
): Promise<CreateTaskResult> {
  try {
    // Validate input using Zod schema
    const validatedData = createTaskSchema.parse(input);

    // Call service layer
    const task = await createTaskService(validatedData);

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
        error: "Failed to create task: " + error.message,
      };
    }

    // Fallback error message
    return {
      success: false,
      error: "An unexpected error occurred while creating the task",
    };
  }
}
