import { test, expect } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";

const DOMAINS_DIR = path.resolve(__dirname, "../apps/web/app/(domains)");

function discoverRoutes(dir: string, prefix = ""): string[] {
  const routes: string[] = [];
  if (!fs.existsSync(dir)) return routes;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const hasPage = entries.some(
    (e) => e.isFile() && e.name.startsWith("page."),
  );

  if (hasPage) {
    routes.push(prefix || "/");
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("_")) continue;

    const segment = entry.name.startsWith("[") ? "__dynamic__" : entry.name;
    const childRoutes = discoverRoutes(
      path.join(dir, entry.name),
      `${prefix}/${segment}`,
    );
    routes.push(...childRoutes);
  }

  return routes;
}

const staticRoutes = discoverRoutes(DOMAINS_DIR).filter(
  (r) => !r.includes("__dynamic__"),
);

test("home page renders", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto("/");
  await expect(page.locator("body")).not.toBeEmpty();

  const bodyText = await page.locator("body").innerText();
  expect(bodyText.length).toBeGreaterThan(0);
  expect(errors).toHaveLength(0);
});

for (const route of staticRoutes) {
  test(`${route} — renders without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status()).toBeLessThan(500);

    await expect(page.locator("body")).not.toBeEmpty();

    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(0);
    expect(errors).toHaveLength(0);
  });
}
