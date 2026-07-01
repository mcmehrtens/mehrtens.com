const { readFileSync } = require("node:fs");

const sitemap = readFileSync(`${__dirname}/dist/sitemap-0.xml`, "utf8");
const url = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => `http://127.0.0.1:4321${new URL(m[1]).pathname}`,
);

const profile = process.env.LH_PROFILE ?? "mobile";
const profiles = {
  mobile: {},
  desktop: { preset: "desktop" },
  "low-end": {
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 823,
      deviceScaleFactor: 1.75,
      disabled: false,
    },
    throttling: { rttMs: 400, throughputKbps: 400, cpuSlowdownMultiplier: 6 },
  },
};
const settings = profiles[profile] ?? {};

module.exports = {
  ci: {
    collect: { numberOfRuns: 3, url, settings },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.9 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: `./lighthouse-reports/${profile}`,
    },
  },
};
