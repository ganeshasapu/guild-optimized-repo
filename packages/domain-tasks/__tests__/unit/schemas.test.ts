import { describe, it, expect } from "vitest";
import { createTaskSchema, updateTaskSchema } from "../../src/lib/schemas";

describe("createTaskSchema", () => {
  it("accepts valid input with title only", () => {
    const result = createTaskSchema.safeParse({ title: "My task" });
    expect(result.success).toBe(true);
  });

  it("accepts valid input with title and description", () => {
    const result = createTaskSchema.safeParse({
      title: "My task",
      description: "Some details",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = createTaskSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing title", () => {
    const result = createTaskSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects title exceeding 255 chars", () => {
    const result = createTaskSchema.safeParse({ title: "a".repeat(256) });
    expect(result.success).toBe(false);
  });
});

describe("updateTaskSchema", () => {
  it("accepts empty object (all fields optional)", () => {
    const result = updateTaskSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts partial update", () => {
    const result = updateTaskSchema.safeParse({ completed: true });
    expect(result.success).toBe(true);
  });

  it("accepts full update", () => {
    const result = updateTaskSchema.safeParse({
      title: "Updated",
      description: "New desc",
      completed: false,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title string", () => {
    const result = updateTaskSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });
});
