import { readFileSync, writeFileSync, existsSync } from "node:fs";

const THRESHOLD = 90;
const PROFILES = ["mobile", "desktop", "low-end"];
const CATEGORIES = [
  { key: "performance", short: "Perf", label: "performance" },
  { key: "accessibility", short: "A11y", label: "accessibility" },
  { key: "best-practices", short: "Best practices", label: "best practices" },
  { key: "seo", short: "SEO", label: "SEO" },
];

const pct = (score) => Math.round(score * 100);
const icon = (value) => (value >= 90 ? "🟢" : value >= 50 ? "🟠" : "🔴");
const colorOf = (value) =>
  value >= 90 ? "brightgreen" : value >= 50 ? "orange" : "red";
const pathOf = (url) => new URL(url).pathname;

const categoryMin = {};
let hasData = false;
let hasRegression = false;
const sections = [];

for (const profile of PROFILES) {
  const file = `lighthouse-reports/${profile}/manifest.json`;
  if (!existsSync(file)) continue;
  hasData = true;

  const rows = JSON.parse(readFileSync(file, "utf8"))
    .filter((entry) => entry.isRepresentativeRun)
    .sort((a, b) => pathOf(a.url).localeCompare(pathOf(b.url)))
    .map((entry) => {
      const cells = CATEGORIES.map((category) => {
        const value = pct(entry.summary[category.key]);
        categoryMin[category.key] = Math.min(
          categoryMin[category.key] ?? value,
          value,
        );
        if (value < THRESHOLD) hasRegression = true;
        return `${icon(value)} ${value}`;
      });
      return `| \`${pathOf(entry.url)}\` | ${cells.join(" | ")} |`;
    });

  const header = CATEGORIES.map((category) => category.short).join(" | ");
  const divider = CATEGORIES.map(() => "---").join(" | ");
  sections.push(
    `### ${profile}\n\n| Page | ${header} |\n| --- | ${divider} |\n${rows.join("\n")}`,
  );
}

const markdown = hasData
  ? [
      "## Lighthouse",
      "",
      `Representative (median) run per page. Passing threshold: ${THRESHOLD}.`,
      "",
      sections.join("\n\n"),
    ].join("\n")
  : "## Lighthouse\n\nNo Lighthouse reports were found for this run.";

// One shields.io endpoint file per category, keyed by its gist filename.
const badges = Object.fromEntries(
  CATEGORIES.map((category) => {
    const value = categoryMin[category.key];
    return [
      `lighthouse-${category.key}.json`,
      {
        schemaVersion: 1,
        label: category.label,
        message: hasData ? String(value) : "no data",
        color: hasData ? colorOf(value) : "lightgrey",
      },
    ];
  }),
);

// Write only constant-named artifacts; the workflow wires these into
// $GITHUB_STEP_SUMMARY and $GITHUB_OUTPUT via shell redirection.
writeFileSync("lighthouse-summary.md", `${markdown}\n`);
writeFileSync("lighthouse-badges.json", `${JSON.stringify(badges, null, 2)}\n`);
writeFileSync("lighthouse-regression.txt", String(hasData && hasRegression));
console.log(markdown);
