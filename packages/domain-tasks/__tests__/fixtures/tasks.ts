import type { Task } from "@guild-optimized/db";

export const FIXTURE_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Write documentation",
    status: "todo",
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  },
  {
    id: "task-2",
    title: "Fix bug in auth flow",
    status: "in_progress",
    createdAt: new Date("2026-01-02T00:00:00Z"),
    updatedAt: new Date("2026-01-02T00:00:00Z"),
  },
  {
    id: "task-3",
    title: "Deploy to production",
    status: "done",
    createdAt: new Date("2026-01-03T00:00:00Z"),
    updatedAt: new Date("2026-01-03T00:00:00Z"),
  },
];
