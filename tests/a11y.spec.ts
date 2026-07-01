import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const sitemap = readFileSync(
  fileURLToPath(new URL("../dist/sitemap-0.xml", import.meta.url)),
  "utf8",
);
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname,
);

for (const route of routes) {
  test(`a11y: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "load" });
    const { violations } = await new AxeBuilder({ page })
      .withTags([
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "wcag22aa",
        "best-practice",
      ])
      // TODO(target-size): re-enable once I add CSS
      .disableRules(["target-size"])
      .analyze();
    expect(violations).toEqual([]);
  });
}
