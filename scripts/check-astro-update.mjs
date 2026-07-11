import { readFileSync, writeFileSync } from "node:fs";

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
    const latest = meta["dist-tags"]?.latest;
    if (!latest || !/^\d+\.\d+\.\d+$/.test(latest)) continue;
    if (compareVersions(latest, current) <= 0) continue;

    const published = Date.parse(meta.time?.[latest] ?? "");
    // Reconstruct both fields from parsed values so no string from the
    // (untrusted) registry response is written to the file or issue verbatim.
    updates.push({
      name,
      current,
      available: parseVersion(latest).join("."),
      released: Number.isFinite(published)
        ? new Date(published).toISOString().slice(0, 10)
        : "unknown",
    });
  } catch (error) {
    console.error(`Skipping ${name}: ${error.message}`);
  }
}

if (updates.length === 0) {
  writeFileSync("astro-update-flag.txt", "false");
  console.log("No Astro-family updates available.");
} else {
  const rows = updates
    .map(
      (u) =>
        `| \`${u.name}\` | ${u.current} | **${u.available}** | ${u.released} |`,
    )
    .join("\n");

  const body = `Astro-family updates are available. Upgrade the whole Astro toolchain in one step, then open a PR that closes this issue.

\`\`\`sh
pnpm dlx @astrojs/upgrade
\`\`\`

| Package | Current | Latest | Released |
| --- | --- | --- | --- |
${rows}

Opened automatically by \`.github/workflows/astro-update.yaml\`. Add \`Closes #<n>\` to the upgrade PR to auto-close this issue on merge.</sub>
`;

  writeFileSync("astro-update.md", body);
  writeFileSync("astro-update-flag.txt", "true");
  console.log(`Found ${updates.length} Astro-family update(s).`);
}
