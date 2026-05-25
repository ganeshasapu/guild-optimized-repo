import { test } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";

const SCREENSHOTS_DIR = path.resolve(__dirname, "screenshots");

const routes = (process.env.SCREENSHOT_ROUTES ?? "/")
  .split(",")
  .map((r) => r.trim())
  .filter(Boolean);

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
});

for (const route of routes) {
  test(`screenshot ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const filename = route === "/" ? "home" : route.replace(/\//g, "-").replace(/^-/, "");
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `${filename}.png`),
      fullPage: true,
      scale: "device",
    });
  });
}
