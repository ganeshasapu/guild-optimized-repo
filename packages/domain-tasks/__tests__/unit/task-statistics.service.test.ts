import { describe, it, expect, vi, beforeEach } from "vitest";
import { sql } from "drizzle-orm";

import { getTaskStatistics } from "../../src/services/task.service";

// Mock the database module
vi.mock("@guild-optimized/db", () => ({
  getDb: vi.fn(),
  tasks: {
    status: "status",
  },
}));

describe("getTaskStatistics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return statistics with all statuses", async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockFrom = vi.fn().mockReturnThis();
    const mockGroupBy = vi.fn().mockResolvedValue([
      { status: "todo", count: 3 },
      { status: "in_progress", count: 2 },
      { status: "done", count: 5 },
    ]);

    const { getDb } = await import("@guild-optimized/db");
    vi.mocked(getDb).mockReturnValue({
      select: mockSelect,
      from: mockFrom,
      groupBy: mockGroupBy,
    } as never);

    const stats = await getTaskStatistics();

    expect(stats).toEqual({
      todo: 3,
      inProgress: 2,
      done: 5,
      total: 10,
    });
  });

  it("should return zero counts when no tasks exist", async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockFrom = vi.fn().mockReturnThis();
    const mockGroupBy = vi.fn().mockResolvedValue([]);

    const { getDb } = await import("@guild-optimized/db");
    vi.mocked(getDb).mockReturnValue({
      select: mockSelect,
      from: mockFrom,
      groupBy: mockGroupBy,
    } as never);

    const stats = await getTaskStatistics();

    expect(stats).toEqual({
      todo: 0,
      inProgress: 0,
      done: 0,
      total: 0,
    });
  });

  it("should handle missing statuses", async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockFrom = vi.fn().mockReturnThis();
    const mockGroupBy = vi.fn().mockResolvedValue([
      { status: "todo", count: 5 },
      // missing in_progress
      { status: "done", count: 3 },
    ]);

    const { getDb } = await import("@guild-optimized/db");
    vi.mocked(getDb).mockReturnValue({
      select: mockSelect,
      from: mockFrom,
      groupBy: mockGroupBy,
    } as never);

    const stats = await getTaskStatistics();

    expect(stats).toEqual({
      todo: 5,
      inProgress: 0,
      done: 3,
      total: 8,
    });
  });

  it("should accept custom database URL", async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockFrom = vi.fn().mockReturnThis();
    const mockGroupBy = vi.fn().mockResolvedValue([]);

    const { getDb } = await import("@guild-optimized/db");
    vi.mocked(getDb).mockReturnValue({
      select: mockSelect,
      from: mockFrom,
      groupBy: mockGroupBy,
    } as never);

    await getTaskStatistics("custom-db-url");

    expect(getDb).toHaveBeenCalledWith("custom-db-url");
  });
});
