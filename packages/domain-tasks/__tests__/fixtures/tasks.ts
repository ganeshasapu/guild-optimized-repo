import type { Task } from "../../src/types/task.types";

export const mockTasks: Task[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "Complete project documentation",
    description: "Write comprehensive documentation for the new feature",
    status: "todo",
    priority: "high",
    createdAt: new Date("2026-05-20T10:00:00Z"),
    updatedAt: new Date("2026-05-20T10:00:00Z"),
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "Review pull requests",
    description: "Review and merge pending pull requests",
    status: "in_progress",
    priority: "medium",
    createdAt: new Date("2026-05-19T15:30:00Z"),
    updatedAt: new Date("2026-05-20T09:00:00Z"),
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "Fix bug in authentication",
    description: null,
    status: "done",
    priority: "high",
    createdAt: new Date("2026-05-18T08:00:00Z"),
    updatedAt: new Date("2026-05-19T16:45:00Z"),
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    title: "Update dependencies",
    description: "Update all project dependencies to latest versions",
    status: "todo",
    priority: "low",
    createdAt: new Date("2026-05-17T12:00:00Z"),
    updatedAt: new Date("2026-05-17T12:00:00Z"),
  },
];

export const createMockTask = (overrides?: Partial<Task>): Task => ({
  id: "00000000-0000-0000-0000-000000000000",
  title: "Mock Task",
  description: "This is a mock task for testing",
  status: "todo",
  priority: "medium",
  createdAt: new Date("2026-05-20T00:00:00Z"),
  updatedAt: new Date("2026-05-20T00:00:00Z"),
  ...overrides,
});
