import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const coverageDir = path.resolve(__dirname, "../output/playwright");

function calculateCoverage(entry, sourceLength) {
  const covered = new Uint8Array(sourceLength);

  for (const fn of entry.functions) {
    for (const range of fn.ranges) {
      if (range.count <= 0) continue;
      const start = Math.max(0, Math.min(range.startOffset, sourceLength));
      const end = Math.max(start, Math.min(range.endOffset, sourceLength));
      for (let i = start; i < end; i += 1) {
        covered[i] = 1;
      }
    }
  }

  const coveredCount = covered.reduce((sum, cur) => sum + cur, 0);
  return (coveredCount / Math.max(sourceLength, 1)) * 100;
}

test("core browsing flow renders and supports filtering", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Design your Lighthouse workflow");
  await expect(page.getByRole("region", { name: "Skill Library" })).toBeVisible();

  const search = page.getByRole("searchbox", { name: "Search skills" });
  await search.fill("nextjs");
  await expect(page.getByRole("button", { name: "lighthouse-nextjs" })).toBeVisible();

  await page.getByRole("button", { name: "lighthouse-nextjs" }).click();
  await expect(page.locator("#selected-skill")).toContainText("lighthouse-nextjs");
  await expect(page.locator("#skill-content")).toContainText("next/image");

  await search.fill("no-such-stack");
  await expect(page.locator("#status")).toContainText("No matching skills");

  await search.fill("");
  await expect(page.getByRole("button", { name: "lighthouse-core" })).toBeVisible();
});

test("download action emits markdown file", async ({ page }) => {
  await page.goto("/");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download .md" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/^lighthouse-.*\.md$/);
});

test("copy action + interaction flow reaches >=85% JS coverage for app.js", async ({ context, page, baseURL }) => {
  if (baseURL) {
    await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseURL });
  }

  await page.coverage.startJSCoverage({ resetOnNavigation: false });

  await page.goto("/");
  await page.getByRole("button", { name: "lighthouse-react-vite" }).click();
  await expect(page.locator("#skill-content")).toContainText("React + Vite");
  await page.getByRole("searchbox", { name: "Search skills" }).fill("wordpress");
  await page.getByRole("button", { name: "lighthouse-wordpress" }).click();
  await expect(page.locator("#skill-content")).toContainText("WordPress");
  await page.getByRole("searchbox", { name: "Search skills" }).fill("");

  await page.getByRole("button", { name: "Copy" }).click();
  await expect(page.locator("#status")).toContainText(/Copied|Clipboard write failed/);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download .md" }).click();
  await downloadPromise;

  const entries = await page.coverage.stopJSCoverage();
  const appEntry = entries.find((entry) => entry.url.endsWith("/app.js"));

  expect(appEntry, "app.js coverage entry should exist").toBeTruthy();

  const sourceResponse = await page.request.get("/app.js");
  const sourceText = await sourceResponse.text();
  const percent = calculateCoverage(appEntry, sourceText.length);

  await fs.mkdir(coverageDir, { recursive: true });
  await fs.writeFile(
    path.join(coverageDir, "coverage-summary.json"),
    JSON.stringify(
      {
        file: "website/app.js",
        threshold: 85,
        coveragePercent: Number(percent.toFixed(2))
      },
      null,
      2
    ) + "\n",
    "utf8"
  );

  expect(percent).toBeGreaterThanOrEqual(85);
});
