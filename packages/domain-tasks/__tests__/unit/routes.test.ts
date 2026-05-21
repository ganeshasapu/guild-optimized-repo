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

  describe("Route exports", () => {
    it("should export TasksPage from routes index", async () => {
      const routes = await import("../../src/routes");
      expect(routes).toHaveProperty("TasksPage");
    });
  });
});