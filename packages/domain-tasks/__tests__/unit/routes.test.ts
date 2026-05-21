import { describe, it, expect } from "vitest";

describe("Task Routes", () => {
  describe("TasksPage", () => {
    it("should export TasksPage component", async () => {
      const { TasksPage } = await import("../../src/routes");
      expect(TasksPage).toBeDefined();
      expect(typeof TasksPage).toBe("function");
    });

    it("should export default from page.tsx", async () => {
      const module = await import("../../src/routes/page");
      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe("function");
    });
  });

  describe("TaskDetailPage", () => {
    it("should export TaskDetailPage component", async () => {
      const { TaskDetailPage } = await import("../../src/routes");
      expect(TaskDetailPage).toBeDefined();
      expect(typeof TaskDetailPage).toBe("function");
    });

    it("should export default from [id]/page.tsx", async () => {
      const module = await import("../../src/routes/[id]/page");
      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe("function");
    });
  });

  describe("Route exports", () => {
    it("should export TasksPage and TaskDetailPage from routes index", async () => {
      const routes = await import("../../src/routes");
      expect(routes).toHaveProperty("TasksPage");
      expect(routes).toHaveProperty("TaskDetailPage");
    });
  });
});
