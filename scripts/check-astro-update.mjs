import { readFileSync, writeFileSync } from "node:fs";

const MIN_RELEASE_AGE_DAYS = 7;
const MIN_AGE_MS = MIN_RELEASE_AGE_DAYS * 24 * 60 * 60 * 1000;
const REGISTRY = "https://registry.npmjs.org";

const isAstroFamily = (name) =>
  name === "astro" || name.startsWith("@astrojs/");

const cleanVersion = (range) => range.replace(/^[\s^~>=<]*/, "").trim();

const parseVersion = (version) =>
  version.split(".").map((part) => Number.parseInt(part, 10));

const compareVersions = (a, b) => {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
};

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
const names = Object.keys(deps).filter(isAstroFamily).sort();

const now = Date.now();
const updates = [];

for (const name of names) {
  const current = cleanVersion(deps[name]);
  try {
    const response = await fetch(`${REGISTRY}/${name}`);
    if (!response.ok) {
      console.error(`Skipping ${name}: registry returned ${response.status}`);
      continue;
    }
    const meta = await response.json();
    const times = meta.time ?? {};
    const aged = Object.keys(meta.versions ?? {})
      .map((version) => ({
        version,
        published: Date.parse(times[version] ?? ""),
      }))
      .filter(
        ({ version, published }) =>
          /^\d+\.\d+\.\d+$/.test(version) &&
          Number.isFinite(published) &&
          now - published >= MIN_AGE_MS,
      )
      .sort((a, b) => compareVersions(a.version, b.version));
    const latest = aged.at(-1);
    if (latest && compareVersions(latest.version, current) > 0) {
      // Reconstruct both fields from parsed numbers so no string from the
      // (untrusted) registry response is written to the file or issue verbatim.
      updates.push({
        name,
        current,
        available: parseVersion(latest.version).join("."),
        released: new Date(latest.published).toISOString().slice(0, 10),
      });
    }
  } catch (error) {
    console.error(`Skipping ${name}: ${error.message}`);
  }
}

if (updates.length === 0) {
  writeFileSync("astro-update-flag.txt", "false");
  console.log("No Astro-family updates past the release-age threshold.");
} else {
  const rows = updates
    .map(
      (update) =>
        `| \`${update.name}\` | ${update.current} | **${update.available}** | ${update.released} |`,
    )
    .join("\n");

  const body = `Astro-family updates are available and have aged past the ${MIN_RELEASE_AGE_DAYS}-day release-age policy. Upgrade with the Astro upgrade tool — it runs the required migrations — then open a PR that closes this issue.

\`\`\`sh
pnpm dlx @astrojs/upgrade
\`\`\`

| Package | Current | Available (≥ ${MIN_RELEASE_AGE_DAYS} days old) | Released |
| --- | --- | --- | --- |
${rows}

<sub>Opened automatically by \`.github/workflows/astro-update.yaml\`. Add \`Closes #<n>\` to the upgrade PR to auto-close this issue on merge.</sub>
`;

  writeFileSync("astro-update.md", body);
  writeFileSync("astro-update-flag.txt", "true");
  console.log(`Found ${updates.length} aged Astro-family update(s).`);
}
