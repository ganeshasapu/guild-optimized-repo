import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTask } from "../../src/actions/create-task";
import type { Task } from "@guild-optimized/db";
import * as taskService from "../../src/services/task.service";

// Mock the service layer
vi.mock("../../src/services/task.service", () => ({
  createTask: vi.fn(),
}));

describe("createTask action", () => {
  const mockCreateTask = vi.mocked(taskService.createTask);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success with task data when service succeeds", async () => {
    const mockTask: Task = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Test Task",
      description: "Test Description",
      status: "todo",
      priority: "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockCreateTask.mockResolvedValue(mockTask);

    const result = await createTask({
      title: "Test Task",
      description: "Test Description",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(mockTask);
    }
    expect(mockCreateTask).toHaveBeenCalledWith({
      title: "Test Task",
      description: "Test Description",
    });
  });

  it("should return error when title is missing", async () => {
    const result = await createTask({
      description: "Test Description",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Invalid input");
    }
    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it("should return error when title is empty", async () => {
    const result = await createTask({
      title: "",
      description: "Test Description",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Invalid input");
    }
    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it("should return error when title exceeds 500 characters", async () => {
    const longTitle = "a".repeat(501);
    const result = await createTask({
      title: longTitle,
      description: "Test Description",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Invalid input");
    }
    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it("should accept valid status values", async () => {
    const mockTask: Task = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Test Task",
      description: null,
      status: "in_progress",
      priority: "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockCreateTask.mockResolvedValue(mockTask);

    const result = await createTask({
      title: "Test Task",
      status: "in_progress",
    });

    expect(result.success).toBe(true);
    expect(mockCreateTask).toHaveBeenCalledWith({
      title: "Test Task",
      status: "in_progress",
    });
  });

  it("should accept valid priority values", async () => {
    const mockTask: Task = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Test Task",
      description: null,
      status: "todo",
      priority: "high",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockCreateTask.mockResolvedValue(mockTask);

    const result = await createTask({
      title: "Test Task",
      priority: "high",
    });

    expect(result.success).toBe(true);
    expect(mockCreateTask).toHaveBeenCalledWith({
      title: "Test Task",
      priority: "high",
    });
  });

  it("should return error when service throws error", async () => {
    mockCreateTask.mockRejectedValue(new Error("Database error"));

    const result = await createTask({
      title: "Test Task",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Failed to create task");
      expect(result.error).toContain("Database error");
    }
  });

  it("should handle unknown errors gracefully", async () => {
    mockCreateTask.mockRejectedValue("Unknown error");

    const result = await createTask({
      title: "Test Task",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("An unexpected error occurred");
    }
  });
});
