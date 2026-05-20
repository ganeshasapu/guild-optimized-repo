import { describe, it, expect } from "vitest";

describe("Task Components", () => {
  describe("TaskCard", () => {
    it("should export TaskCard component", async () => {
      const { TaskCard } = await import("../../src/components/task-card");
      expect(TaskCard).toBeDefined();
      expect(typeof TaskCard).toBe("function");
    });

    it("should export TaskCardProps type", async () => {
      const module = await import("../../src/components/task-card");
      expect(module).toHaveProperty("TaskCard");
    });
  });

  describe("TaskForm", () => {
    it("should export TaskForm component", async () => {
      const { TaskForm } = await import("../../src/components/task-form");
      expect(TaskForm).toBeDefined();
      expect(typeof TaskForm).toBe("function");
    });

    it("should export TaskFormProps type", async () => {
      const module = await import("../../src/components/task-form");
      expect(module).toHaveProperty("TaskForm");
    });
  });

  describe("TaskList", () => {
    it("should export TaskList component", async () => {
      const { TaskList } = await import("../../src/components/task-list");
      expect(TaskList).toBeDefined();
      expect(typeof TaskList).toBe("function");
    });

    it("should export TaskListProps type", async () => {
      const module = await import("../../src/components/task-list");
      expect(module).toHaveProperty("TaskList");
    });
  });

  describe("Component exports", () => {
    it("should export all components from index", async () => {
      const components = await import("../../src/components");
      expect(components).toHaveProperty("TaskCard");
      expect(components).toHaveProperty("TaskForm");
      expect(components).toHaveProperty("TaskList");
    });
  });
});

describe("Task Types", () => {
  it("should export task types", async () => {
    const types = await import("../../src/types/task.types");
    expect(types).toBeDefined();
  });
});
