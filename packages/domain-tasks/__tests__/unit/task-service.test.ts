import { describe, it, expect, vi, beforeEach } from "vitest";

import { listTasks, createTask } from "../../src/services/task-service";
import type { Task } from "../../src/types/index";

// ---------------------------------------------------------------------------
// Mock @guild-optimized/db
// ---------------------------------------------------------------------------

const mockReturning = vi.fn();
const mockInsert = vi.fn(() => ({
  values: vi.fn(() => ({
    returning: mockReturning,
  })),
}));

const mockWhere = vi.fn();
const mockSelect = vi.fn(() => ({
  from: vi.fn(() => ({
    where: mockWhere,
  })),
}));

const mockDb = {
  select: mockSelect,
  insert: mockInsert,
};

vi.mock("@guild-optimized/db", () => ({
  getDb: vi.fn(() => mockDb),
  tasks: { id: "id", title: "title", status: "status", createdAt: "createdAt", updatedAt: "updatedAt" },
}));

// ---------------------------------------------------------------------------

const mockTask: Task = {
  id: "task_123",
  title: "Test Task",
  status: "todo",
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
};

describe("listTasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all tasks when no filter is provided", async () => {
    const fromMock = vi.fn().mockResolvedValue([mockTask]);
    mockSelect.mockReturnValue({ from: fromMock });

    const result = await listTasks();

    expect(mockSelect).toHaveBeenCalledOnce();
    expect(result).toEqual([mockTask]);
  });

  it("filters tasks by status when status is provided", async () => {
    const whereMock = vi.fn().mockResolvedValue([mockTask]);
    const fromMock = vi.fn().mockReturnValue({ where: whereMock });
    mockSelect.mockReturnValue({ from: fromMock });

    const result = await listTasks({ status: "todo" });

    expect(whereMock).toHaveBeenCalledOnce();
    expect(result).toEqual([mockTask]);
  });

  it("returns an empty array when no tasks exist", async () => {
    const fromMock = vi.fn().mockResolvedValue([]);
    mockSelect.mockReturnValue({ from: fromMock });

    const result = await listTasks();

    expect(result).toEqual([]);
  });
});

describe("createTask", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a task with the provided title and default status", async () => {
    mockReturning.mockResolvedValue([mockTask]);
    const valuesMock = vi.fn().mockReturnValue({ returning: mockReturning });
    mockInsert.mockReturnValue({ values: valuesMock });

    const result = await createTask({ title: "Test Task", status: "todo" });

    expect(mockInsert).toHaveBeenCalledOnce();
    expect(valuesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Test Task",
        status: "todo",
      }),
    );
    expect(result).toEqual(mockTask);
  });

  it("creates a task with a custom status", async () => {
    const inProgressTask: Task = { ...mockTask, status: "in_progress" };
    mockReturning.mockResolvedValue([inProgressTask]);
    const valuesMock = vi.fn().mockReturnValue({ returning: mockReturning });
    mockInsert.mockReturnValue({ values: valuesMock });

    const result = await createTask({
      title: "In Progress Task",
      status: "in_progress",
    });

    expect(valuesMock).toHaveBeenCalledWith(
      expect.objectContaining({ status: "in_progress" }),
    );
    expect(result).toEqual(inProgressTask);
  });

  it("throws an error when the insert returns no rows", async () => {
    mockReturning.mockResolvedValue([]);
    const valuesMock = vi.fn().mockReturnValue({ returning: mockReturning });
    mockInsert.mockReturnValue({ values: valuesMock });

    await expect(
      createTask({ title: "Ghost Task", status: "todo" }),
    ).rejects.toThrow("Failed to create task");
  });

  it("generates a unique id for each task", async () => {
    const firstTask = { ...mockTask, id: "task_a" };
    const secondTask = { ...mockTask, id: "task_b" };

    mockReturning
      .mockResolvedValueOnce([firstTask])
      .mockResolvedValueOnce([secondTask]);

    const valuesMock = vi.fn().mockReturnValue({ returning: mockReturning });
    mockInsert.mockReturnValue({ values: valuesMock });

    const first = await createTask({ title: "First", status: "todo" });
    const second = await createTask({ title: "Second", status: "todo" });

    expect(first.id).not.toBe(second.id);
  });
});
