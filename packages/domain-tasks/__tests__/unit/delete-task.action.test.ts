import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteTask } from "../../src/actions/delete-task";
import * as taskService from "../../src/services/task.service";

// Mock the service layer
vi.mock("../../src/services/task.service", () => ({
  deleteTask: vi.fn(),
}));

describe("deleteTask action", () => {
  const mockDeleteTask = vi.mocked(taskService.deleteTask);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when service deletes task", async () => {
    mockDeleteTask.mockResolvedValue(true);

    const result = await deleteTask("123e4567-e89b-12d3-a456-426614174000");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.deleted).toBe(true);
    }
    expect(mockDeleteTask).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174000"
    );
  });

  it("should return error when task ID is invalid (empty)", async () => {
    const result = await deleteTask("");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Invalid task ID");
    }
    expect(mockDeleteTask).not.toHaveBeenCalled();
  });

  it("should return error when task not found", async () => {
    mockDeleteTask.mockResolvedValue(false);

    const result = await deleteTask("123e4567-e89b-12d3-a456-426614174000");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Task not found");
    }
  });

  it("should return error when service throws error", async () => {
    mockDeleteTask.mockRejectedValue(new Error("Database error"));

    const result = await deleteTask("123e4567-e89b-12d3-a456-426614174000");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Failed to delete task");
      expect(result.error).toContain("Database error");
    }
  });

  it("should handle unknown errors gracefully", async () => {
    mockDeleteTask.mockRejectedValue("Unknown error");

    const result = await deleteTask("123e4567-e89b-12d3-a456-426614174000");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("An unexpected error occurred");
    }
  });
});
