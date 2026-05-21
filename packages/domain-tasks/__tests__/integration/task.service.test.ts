import { describe, it, expect, afterAll } from "vitest";
import { eq } from "drizzle-orm";

import { getDb, tasks } from "@guild-optimized/db";

import {
  createTask,
  getTaskById,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../../src/services/task.service";

const shouldSkip = !process.env.DATABASE_URL;

describe.skipIf(shouldSkip)("task.service integration", () => {
  const testDbUrl = process.env.DATABASE_URL;
  const createdTaskIds: string[] = [];

  afterAll(async () => {
    // Clean up all created tasks
    if (testDbUrl && createdTaskIds.length > 0) {
      const db = getDb(testDbUrl);
      for (const id of createdTaskIds) {
        await db.delete(tasks).where(eq(tasks.id, id));
      }
    }
  });

  describe("createTask", () => {
    it("should create a task with required fields", async () => {
      const input = { title: "Integration Test Task" };
      const task = await createTask(input, testDbUrl);

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.title).toBe("Integration Test Task");
      expect(task.status).toBe("todo");
      expect(task.priority).toBe("medium");
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);

      createdTaskIds.push(task.id);
    });

    it("should create a task with all fields", async () => {
      const input = {
        title: "Complete Task",
        description: "This is a test task",
        status: "in_progress" as const,
        priority: "high" as const,
      };
      const task = await createTask(input, testDbUrl);

      expect(task.title).toBe("Complete Task");
      expect(task.description).toBe("This is a test task");
      expect(task.status).toBe("in_progress");
      expect(task.priority).toBe("high");

      createdTaskIds.push(task.id);
    });
  });

  describe("getTaskById", () => {
    it("should retrieve a task by id", async () => {
      const created = await createTask(
        { title: "Task to Retrieve" },
        testDbUrl
      );
      createdTaskIds.push(created.id);

      const retrieved = await getTaskById(created.id, testDbUrl);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.title).toBe("Task to Retrieve");
    });

    it("should return null for non-existent task", async () => {
      const task = await getTaskById(
        "00000000-0000-0000-0000-000000000000",
        testDbUrl
      );

      expect(task).toBeNull();
    });
  });

  describe("getAllTasks", () => {
    it("should retrieve all tasks", async () => {
      const task1 = await createTask({ title: "Task 1" }, testDbUrl);
      const task2 = await createTask({ title: "Task 2" }, testDbUrl);
      createdTaskIds.push(task1.id, task2.id);

      const allTasks = await getAllTasks(testDbUrl);

      expect(allTasks).toBeDefined();
      expect(Array.isArray(allTasks)).toBe(true);
      expect(allTasks.length).toBeGreaterThanOrEqual(2);

      const titles = allTasks.map((t) => t.title);
      expect(titles).toContain("Task 1");
      expect(titles).toContain("Task 2");
    });
  });

  describe("updateTask", () => {
    it("should update a task", async () => {
      const created = await createTask({ title: "Original Title" }, testDbUrl);
      createdTaskIds.push(created.id);

      const updated = await updateTask(
        created.id,
        {
          title: "Updated Title",
          description: "New description",
          status: "done",
          priority: "low",
        },
        testDbUrl
      );

      expect(updated).toBeDefined();
      expect(updated?.title).toBe("Updated Title");
      expect(updated?.description).toBe("New description");
      expect(updated?.status).toBe("done");
      expect(updated?.priority).toBe("low");
      expect(updated?.updatedAt.getTime()).toBeGreaterThan(
        created.updatedAt.getTime()
      );
    });

    it("should update partial fields", async () => {
      const created = await createTask(
        {
          title: "Original",
          description: "Original desc",
          status: "todo",
          priority: "medium",
        },
        testDbUrl
      );
      createdTaskIds.push(created.id);

      const updated = await updateTask(
        created.id,
        { status: "in_progress" },
        testDbUrl
      );

      expect(updated?.title).toBe("Original");
      expect(updated?.description).toBe("Original desc");
      expect(updated?.status).toBe("in_progress");
      expect(updated?.priority).toBe("medium");
    });

    it("should return null for non-existent task", async () => {
      const updated = await updateTask(
        "00000000-0000-0000-0000-000000000000",
        { title: "Updated" },
        testDbUrl
      );

      expect(updated).toBeNull();
    });
  });

  describe("deleteTask", () => {
    it("should delete a task", async () => {
      const created = await createTask({ title: "Task to Delete" }, testDbUrl);

      const deleted = await deleteTask(created.id, testDbUrl);
      expect(deleted).toBe(true);

      const retrieved = await getTaskById(created.id, testDbUrl);
      expect(retrieved).toBeNull();
    });

    it("should return false for non-existent task", async () => {
      const deleted = await deleteTask(
        "00000000-0000-0000-0000-000000000000",
        testDbUrl
      );

      expect(deleted).toBe(false);
    });
  });
});
