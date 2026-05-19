import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Task } from "@guild-optimized/db";

// Mock the db module
vi.mock("@guild-optimized/db", () => {
  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  return {
    getDb: () => mockDb,
    tasks: { id: "id", title: "title", description: "description", completed: "completed", createdAt: "createdAt", updatedAt: "updatedAt" },
  };
});

import { getDb } from "@guild-optimized/db";

const mockTask: Task = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Test task",
  description: "A test task",
  completed: false,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

describe("tasks-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllTasks returns array of tasks", async () => {
    const db = getDb() as ReturnType<typeof getDb>;
    const mockChain = { from: vi.fn().mockReturnThis(), orderBy: vi.fn().mockResolvedValue([mockTask]) };
    vi.mocked(db.select).mockReturnValue(mockChain as never);

    const { getAllTasks } = await import("../../src/services/tasks-service");
    const result = await getAllTasks();

    expect(result).toEqual([mockTask]);
    expect(db.select).toHaveBeenCalledOnce();
  });

  it("getTaskById returns task when found", async () => {
    const db = getDb() as ReturnType<typeof getDb>;
    const mockChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([mockTask]),
    };
    vi.mocked(db.select).mockReturnValue(mockChain as never);

    const { getTaskById } = await import("../../src/services/tasks-service");
    const result = await getTaskById(mockTask.id);

    expect(result).toEqual(mockTask);
  });

  it("getTaskById returns null when not found", async () => {
    const db = getDb() as ReturnType<typeof getDb>;
    const mockChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    };
    vi.mocked(db.select).mockReturnValue(mockChain as never);

    const { getTaskById } = await import("../../src/services/tasks-service");
    const result = await getTaskById("nonexistent-id");

    expect(result).toBeNull();
  });

  it("createTask inserts and returns new task", async () => {
    const db = getDb() as ReturnType<typeof getDb>;
    const mockChain = {
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([mockTask]),
    };
    vi.mocked(db.insert).mockReturnValue(mockChain as never);

    const { createTask } = await import("../../src/services/tasks-service");
    const result = await createTask({ title: "Test task", description: "A test task" });

    expect(result).toEqual(mockTask);
  });

  it("updateTask returns updated task", async () => {
    const updated = { ...mockTask, title: "Updated", updatedAt: new Date() };
    const db = getDb() as ReturnType<typeof getDb>;
    const mockChain = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([updated]),
    };
    vi.mocked(db.update).mockReturnValue(mockChain as never);

    const { updateTask } = await import("../../src/services/tasks-service");
    const result = await updateTask(mockTask.id, { title: "Updated" });

    expect(result?.title).toBe("Updated");
  });

  it("updateTask returns null when not found", async () => {
    const db = getDb() as ReturnType<typeof getDb>;
    const mockChain = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([]),
    };
    vi.mocked(db.update).mockReturnValue(mockChain as never);

    const { updateTask } = await import("../../src/services/tasks-service");
    const result = await updateTask("nonexistent", { title: "X" });

    expect(result).toBeNull();
  });

  it("deleteTask returns true when deleted", async () => {
    const db = getDb() as ReturnType<typeof getDb>;
    const mockChain = {
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([mockTask]),
    };
    vi.mocked(db.delete).mockReturnValue(mockChain as never);

    const { deleteTask } = await import("../../src/services/tasks-service");
    const result = await deleteTask(mockTask.id);

    expect(result).toBe(true);
  });

  it("deleteTask returns false when not found", async () => {
    const db = getDb() as ReturnType<typeof getDb>;
    const mockChain = {
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([]),
    };
    vi.mocked(db.delete).mockReturnValue(mockChain as never);

    const { deleteTask } = await import("../../src/services/tasks-service");
    const result = await deleteTask("nonexistent");

    expect(result).toBe(false);
  });
});
