import { test } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";

const SCREENSHOTS_DIR = path.resolve(__dirname, "screenshots");

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
});

test("filter bar - All selected", async ({ page }) => {
  await page.goto("/tasks", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, "filter-all.png"),
  });
});

test("filter bar - Todo selected", async ({ page }) => {
  await page.goto("/tasks", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Todo" }).click();
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, "filter-todo.png"),
  });
});

test("filter bar - In Progress selected", async ({ page }) => {
  await page.goto("/tasks", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "In Progress" }).click();
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, "filter-in-progress.png"),
  });
});

test("filter bar - Done selected", async ({ page }) => {
  await page.goto("/tasks", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Done" }).click();
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, "filter-done.png"),
  });
});
