import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import astro from "eslint-plugin-astro";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "playwright-report/**",
      "test-results/**",
      ".lighthouseci/**",
      "lighthouse-reports/**",
      "lychee/**",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs["jsx-a11y-recommended"],
  {
    // eslint-plugin-astro fails to auto-resolve @typescript-eslint/parser under pnpm, leaving
    // parserOptions.parser undefined, so TypeScript in .astro frontmatter won't parse in editors
    // (the ESLint Node API path that language servers use). Pin it so the editor matches the CLI.
    files: ["**/*.astro"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    // Strict JSON, but exclude files that legally allow comments (handled below).
    files: ["**/*.json", "**/.prettierrc"],
    ignores: ["**/tsconfig*.json", ".zed/**", ".vscode/**"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    // JSONC: .jsonc plus comment-friendly configs (tsconfig, editor settings).
    files: [
      "**/*.jsonc",
      "**/tsconfig*.json",
      ".zed/**/*.json",
      ".vscode/**/*.json",
    ],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
  {
    files: ["playwright.config.ts", "tests/**/*.ts", "lighthouserc.cjs"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["lighthouserc.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  eslintConfigPrettier,
]);
