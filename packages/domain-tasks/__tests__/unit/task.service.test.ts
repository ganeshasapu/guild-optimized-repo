import { describe, it, expect, vi, beforeEach } from "vitest";

import type { Task } from "../../src/types/task";

// Define the mock DB type
type MockDb = {
  insert: ReturnType<typeof vi.fn>;
  select: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  from: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  values: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  returning: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
};

// Mock the @guild-optimized/db module
vi.mock("@guild-optimized/db", () => {
  const mockDb: MockDb = {
    insert: vi.fn(() => mockDb),
    select: vi.fn(() => mockDb),
    update: vi.fn(() => mockDb),
    delete: vi.fn(() => mockDb),
    from: vi.fn(() => mockDb),
    where: vi.fn(() => mockDb),
    values: vi.fn(() => mockDb),
    set: vi.fn(() => mockDb),
    returning: vi.fn(),
    limit: vi.fn(() => mockDb),
  };

  return {
    getDb: vi.fn(() => mockDb),
    tasks: { id: "id" },
  };
});

import { getDb } from "@guild-optimized/db";
import {
  createTask,
  getTaskById,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../../src/services/task.service";

describe("task.service", () => {
  let mockDb: MockDb;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDb = getDb() as unknown as MockDb;
  });

  describe("createTask", () => {
    it("should create a task with required fields", async () => {
      const mockTask: Task = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Test Task",
        description: null,
        status: "todo",
        priority: "medium",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.returning.mockResolvedValue([mockTask]);

      const input = { title: "Test Task" };
      const result = await createTask(input);

      expect(result).toEqual(mockTask);
      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith({
        title: "Test Task",
        description: undefined,
        status: "todo",
        priority: "medium",
      });
    });

    it("should create a task with all optional fields", async () => {
      const mockTask: Task = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Test Task",
        description: "Test Description",
        status: "in_progress",
        priority: "high",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.returning.mockResolvedValue([mockTask]);

      const input = {
        title: "Test Task",
        description: "Test Description",
        status: "in_progress" as const,
        priority: "high" as const,
      };
      const result = await createTask(input);

      expect(result).toEqual(mockTask);
      expect(mockDb.values).toHaveBeenCalledWith({
        title: "Test Task",
        description: "Test Description",
        status: "in_progress",
        priority: "high",
      });
    });

    it("should throw error if task creation fails", async () => {
      mockDb.returning.mockResolvedValue([]);

      await expect(createTask({ title: "Test" })).rejects.toThrow(
        "Failed to create task"
      );
    });
  });

  describe("getTaskById", () => {
    it("should return a task when found", async () => {
      const mockTask: Task = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Test Task",
        description: null,
        status: "todo",
        priority: "medium",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.limit.mockResolvedValue([mockTask]);

      const result = await getTaskById("123e4567-e89b-12d3-a456-426614174000");

      expect(result).toEqual(mockTask);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
    });

    it("should return null when task not found", async () => {
      mockDb.limit.mockResolvedValue([]);

      const result = await getTaskById("nonexistent-id");

      expect(result).toBeNull();
    });
  });

  describe("getAllTasks", () => {
    it("should return all tasks", async () => {
      const mockTasks: Task[] = [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          title: "Task 1",
          description: null,
          status: "todo",
          priority: "medium",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "223e4567-e89b-12d3-a456-426614174000",
          title: "Task 2",
          description: "Description 2",
          status: "done",
          priority: "high",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockDb.from.mockResolvedValue(mockTasks);

      const result = await getAllTasks();

      expect(result).toEqual(mockTasks);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalled();
    });

    it("should return empty array when no tasks exist", async () => {
      mockDb.from.mockResolvedValue([]);

      const result = await getAllTasks();

      expect(result).toEqual([]);
    });
  });

  describe("updateTask", () => {
    it("should update a task", async () => {
      const mockTask: Task = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Updated Task",
        description: "Updated Description",
        status: "in_progress",
        priority: "high",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.returning.mockResolvedValue([mockTask]);

      const result = await updateTask("123e4567-e89b-12d3-a456-426614174000", {
        title: "Updated Task",
        description: "Updated Description",
        status: "in_progress",
        priority: "high",
      });

      expect(result).toEqual(mockTask);
      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.set).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
    });

    it("should return null when task not found", async () => {
      mockDb.returning.mockResolvedValue([]);

      const result = await updateTask("nonexistent-id", { title: "Updated" });

      expect(result).toBeNull();
    });
  });

  describe("deleteTask", () => {
    it("should delete a task and return true", async () => {
      const mockTask: Task = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Task to Delete",
        description: null,
        status: "todo",
        priority: "medium",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.returning.mockResolvedValue([mockTask]);

      const result = await deleteTask("123e4567-e89b-12d3-a456-426614174000");

      expect(result).toBe(true);
      expect(mockDb.delete).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
    });

    it("should return false when task not found", async () => {
      mockDb.returning.mockResolvedValue([]);

      const result = await deleteTask("nonexistent-id");

      expect(result).toBe(false);
    });
  });
});
