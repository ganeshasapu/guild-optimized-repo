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

  describe("TaskListClient", () => {
    it("should export TaskListClient component", async () => {
      const { TaskListClient } = await import("../../src/components/task-list-client");
      expect(TaskListClient).toBeDefined();
      expect(typeof TaskListClient).toBe("function");
    });

    it("should export TaskListClientProps type", async () => {
      const module = await import("../../src/components/task-list-client");
      expect(module).toHaveProperty("TaskListClient");
    });
  });

  describe("CreateTaskDialog", () => {
    it("should export CreateTaskDialog component", async () => {
      const { CreateTaskDialog } = await import("../../src/components/create-task-dialog");
      expect(CreateTaskDialog).toBeDefined();
      expect(typeof CreateTaskDialog).toBe("function");
    });

    it("should export CreateTaskDialogProps type", async () => {
      const module = await import("../../src/components/create-task-dialog");
      expect(module).toHaveProperty("CreateTaskDialog");
    });
  });

  describe("EditTaskDialog", () => {
    it("should export EditTaskDialog component", async () => {
      const { EditTaskDialog } = await import("../../src/components/edit-task-dialog");
      expect(EditTaskDialog).toBeDefined();
      expect(typeof EditTaskDialog).toBe("function");
    });

    it("should export EditTaskDialogProps type", async () => {
      const module = await import("../../src/components/edit-task-dialog");
      expect(module).toHaveProperty("EditTaskDialog");
    });
  });

  describe("DeleteTaskDialog", () => {
    it("should export DeleteTaskDialog component", async () => {
      const { DeleteTaskDialog } = await import("../../src/components/delete-task-dialog");
      expect(DeleteTaskDialog).toBeDefined();
      expect(typeof DeleteTaskDialog).toBe("function");
    });

    it("should export DeleteTaskDialogProps type", async () => {
      const module = await import("../../src/components/delete-task-dialog");
      expect(module).toHaveProperty("DeleteTaskDialog");
    });
  });

  describe("Component exports", () => {
    it("should export all components from index", async () => {
      const components = await import("../../src/components");
      expect(components).toHaveProperty("TaskCard");
      expect(components).toHaveProperty("TaskForm");
      expect(components).toHaveProperty("TaskList");
      expect(components).toHaveProperty("TaskListClient");
      expect(components).toHaveProperty("CreateTaskDialog");
      expect(components).toHaveProperty("EditTaskDialog");
      expect(components).toHaveProperty("DeleteTaskDialog");
    });
  });
});

describe("Task Types", () => {
  it("should export task types", async () => {
    const types = await import("../../src/types/task.types");
    expect(types).toBeDefined();
  });
});
