import fs from "node:fs/promises";
import path from "node:path";

const summaryPath = path.resolve("output/playwright/coverage-summary.json");

try {
  const raw = await fs.readFile(summaryPath, "utf8");
  const summary = JSON.parse(raw);
  const line = `${summary.file}: ${summary.coveragePercent}% (threshold ${summary.threshold}%)`;
  console.log(line);

  if (summary.coveragePercent < summary.threshold) {
    process.exitCode = 1;
  }
} catch (err) {
  console.error("Coverage summary not found. Run e2e tests first.");
  console.error(err.message);
  process.exit(1);
}
