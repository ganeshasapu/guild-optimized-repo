import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateTask } from "../../src/actions/update-task";
import type { Task } from "@guild-optimized/db";
import * as taskService from "../../src/services/task.service";

// Mock the service layer
vi.mock("../../src/services/task.service", () => ({
  updateTask: vi.fn(),
}));

describe("updateTask action", () => {
  const mockUpdateTask = vi.mocked(taskService.updateTask);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success with updated task data when service succeeds", async () => {
    const mockTask: Task = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Updated Task",
      description: "Updated Description",
      status: "done",
      priority: "high",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUpdateTask.mockResolvedValue(mockTask);

    const result = await updateTask("123e4567-e89b-12d3-a456-426614174000", {
      title: "Updated Task",
      status: "done",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(mockTask);
    }
    expect(mockUpdateTask).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174000",
      {
        title: "Updated Task",
        status: "done",
      }
    );
  });

  it("should return error when task ID is invalid", async () => {
    const result = await updateTask("", {
      title: "Updated Task",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Invalid task ID");
    }
    expect(mockUpdateTask).not.toHaveBeenCalled();
  });

  it("should return error when task not found", async () => {
    mockUpdateTask.mockResolvedValue(null);

    const result = await updateTask("123e4567-e89b-12d3-a456-426614174000", {
      title: "Updated Task",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Task not found");
    }
  });

  it("should return error when title is empty", async () => {
    const result = await updateTask("123e4567-e89b-12d3-a456-426614174000", {
      title: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Invalid input");
    }
    expect(mockUpdateTask).not.toHaveBeenCalled();
  });

  it("should return error when title exceeds 500 characters", async () => {
    const longTitle = "a".repeat(501);
    const result = await updateTask("123e4567-e89b-12d3-a456-426614174000", {
      title: longTitle,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Invalid input");
    }
    expect(mockUpdateTask).not.toHaveBeenCalled();
  });

  it("should accept partial updates with only status", async () => {
    const mockTask: Task = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Original Task",
      description: null,
      status: "in_progress",
      priority: "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUpdateTask.mockResolvedValue(mockTask);

    const result = await updateTask("123e4567-e89b-12d3-a456-426614174000", {
      status: "in_progress",
    });

    expect(result.success).toBe(true);
    expect(mockUpdateTask).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174000",
      {
        status: "in_progress",
      }
    );
  });

  it("should accept partial updates with only priority", async () => {
    const mockTask: Task = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Original Task",
      description: null,
      status: "todo",
      priority: "low",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUpdateTask.mockResolvedValue(mockTask);

    const result = await updateTask("123e4567-e89b-12d3-a456-426614174000", {
      priority: "low",
    });

    expect(result.success).toBe(true);
    expect(mockUpdateTask).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174000",
      {
        priority: "low",
      }
    );
  });

  it("should accept partial updates with description", async () => {
    const mockTask: Task = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Original Task",
      description: "New description",
      status: "todo",
      priority: "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUpdateTask.mockResolvedValue(mockTask);

    const result = await updateTask("123e4567-e89b-12d3-a456-426614174000", {
      description: "New description",
    });

    expect(result.success).toBe(true);
    expect(mockUpdateTask).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174000",
      {
        description: "New description",
      }
    );
  });

  it("should return error when service throws error", async () => {
    mockUpdateTask.mockRejectedValue(new Error("Database error"));

    const result = await updateTask("123e4567-e89b-12d3-a456-426614174000", {
      title: "Updated Task",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Failed to update task");
      expect(result.error).toContain("Database error");
    }
  });

  it("should handle unknown errors gracefully", async () => {
    mockUpdateTask.mockRejectedValue("Unknown error");

    const result = await updateTask("123e4567-e89b-12d3-a456-426614174000", {
      title: "Updated Task",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("An unexpected error occurred");
    }
  });
});
