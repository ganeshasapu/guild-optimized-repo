import { describe, it, expect, vi, beforeEach } from "vitest";

import type { TaskServiceDeps } from "../../src/services/task.service";
import { listTasks, createTask } from "../../src/services/task.service";
import { FIXTURE_TASKS } from "../fixtures/tasks";

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

function makeListDb(): TaskServiceDeps {
  const orderBy = vi.fn().mockResolvedValue(FIXTURE_TASKS);
  const from = vi.fn().mockReturnValue({ orderBy });
  const select = vi.fn().mockReturnValue({ from });
  return { db: { select } as unknown as TaskServiceDeps["db"] };
}

function makeEmptyListDb(): TaskServiceDeps {
  const orderBy = vi.fn().mockResolvedValue([]);
  const from = vi.fn().mockReturnValue({ orderBy });
  const select = vi.fn().mockReturnValue({ from });
  return { db: { select } as unknown as TaskServiceDeps["db"] };
}

function makeCreateDb(
  returnValue: (typeof FIXTURE_TASKS)[number],
): { deps: TaskServiceDeps; mocks: { insert: ReturnType<typeof vi.fn>; values: ReturnType<typeof vi.fn> } } {
  const returning = vi.fn().mockResolvedValue([returnValue]);
  const values = vi.fn().mockReturnValue({ returning });
  const insert = vi.fn().mockReturnValue({ values });
  return {
    deps: { db: { insert } as unknown as TaskServiceDeps["db"] },
    mocks: { insert, values },
  };
}

function makeEmptyCreateDb(): TaskServiceDeps {
  const returning = vi.fn().mockResolvedValue([]);
  const values = vi.fn().mockReturnValue({ returning });
  const insert = vi.fn().mockReturnValue({ values });
  return { db: { insert } as unknown as TaskServiceDeps["db"] };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("listTasks", () => {
  it("returns all tasks from the database", async () => {
    const deps = makeListDb();
    const result = await listTasks(deps);
    expect(result).toEqual(FIXTURE_TASKS);
  });

  it("returns an empty array when there are no tasks", async () => {
    const deps = makeEmptyListDb();
    const result = await listTasks(deps);
    expect(result).toEqual([]);
  });
});

describe("createTask", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inserts a task and returns the created record", async () => {
    const newTask = FIXTURE_TASKS[0]!;
    const { deps, mocks } = makeCreateDb(newTask);

    const result = await createTask({ title: newTask.title }, deps);

    expect(mocks.insert).toHaveBeenCalledOnce();
    expect(mocks.values).toHaveBeenCalledWith({ title: newTask.title });
    expect(result).toEqual(newTask);
  });

  it("throws when the database returns no record", async () => {
    const deps = makeEmptyCreateDb();
    await expect(
      createTask({ title: "Ghost task" }, deps),
    ).rejects.toThrow("Failed to create task");
  });

  it("uses default status 'todo' when status is omitted", async () => {
    const newTask = FIXTURE_TASKS[0]!;
    const { deps, mocks } = makeCreateDb(newTask);

    await createTask({ title: "New task" }, deps);

    expect(mocks.values).toHaveBeenCalledWith({ title: "New task" });
  });
});
