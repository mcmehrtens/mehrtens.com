# [mehrtens.com](https://mehrtens.com)

A little space on the world wide web, for me, Matthew Mehrtens.

[![CI](https://github.com/mcmehrtens/mehrtens.com/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/mcmehrtens/mehrtens.com/actions/workflows/ci.yaml)
[![security.txt checks](https://github.com/mcmehrtens/mehrtens.com/actions/workflows/security-txt-expiry.yaml/badge.svg?branch=main)](https://github.com/mcmehrtens/mehrtens.com/actions/workflows/security-txt-expiry.yaml)
[![Lighthouse performance](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2Fmcmehrtens%2F820df8fd7ec1ecb0ffd03f0727ba9222%2Fraw%2Flighthouse-performance.json)](https://github.com/mcmehrtens/mehrtens.com/actions/workflows/lighthouse.yaml)
[![Lighthouse accessibility](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2Fmcmehrtens%2F820df8fd7ec1ecb0ffd03f0727ba9222%2Fraw%2Flighthouse-accessibility.json)](https://github.com/mcmehrtens/mehrtens.com/actions/workflows/lighthouse.yaml)
[![Lighthouse best practices](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2Fmcmehrtens%2F820df8fd7ec1ecb0ffd03f0727ba9222%2Fraw%2Flighthouse-best-practices.json)](https://github.com/mcmehrtens/mehrtens.com/actions/workflows/lighthouse.yaml)
[![Lighthouse SEO](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2Fmcmehrtens%2F820df8fd7ec1ecb0ffd03f0727ba9222%2Fraw%2Flighthouse-seo.json)](https://github.com/mcmehrtens/mehrtens.com/actions/workflows/lighthouse.yaml)

## About

This is my personal website that I use to introduce myself, showcase my
projects, and share any musings I think the world might find meaningful. I’ve
tried very hard to make the site fast, well-designed, and accessible.
Additionally, I’ve done everything I can to make this site as privacy-forward as
possible, which includes: no tracking, no analytics, no cookies, and no
advertisements.

All that said, I am _not_ an experienced web developer by any stretch of the
imagination. I expect there are many things I could make better about my
website. If you have ideas, reach out; I’d be happy to learn from more
experienced developers! If anything about the site is unpleasant, I’d like to
hear that feedback, too.

## Tech stack

- [mehrtens.com](https://mehrtens.com) is a static website, generated with
  [Astro](https://astro.build), a static site generator.
- I use [pnpm](https://pnpm.io) to manage my site’s dependencies.
- I try to use the latest long-term support (LTS) version of
  [Node](https://nodejs.org/en). You can find which version I’m currently pinned
  to in the [`.node-version`](.node-version) file.
- The site is deployed using
  [Cloudflare Workers](https://www.cloudflare.com/products/workers/) with assets
  hosted on [Cloudflare R2](https://www.cloudflare.com/products/r2/).
- I use a _wide_ variety of tools to help me keep the site functional and
  accessible (I’m also just a nerd for developer tooling), such as
  [ESLint](https://eslint.org) and [Prettier](https://prettier.io) (linting and
  formatting), [Playwright](https://playwright.dev) and
  [axe-core](https://github.com/dequelabs/axe-core) (automated accessibility
  testing), [GitHub Actions](https://docs.github.com/en/actions) (continuous
  integration and continuous deployment or CI/CD),
  [Renovate](https://docs.renovatebot.com/) (automated dependency updates), and
  many more.

## Getting started

If you want to spin up the site yourself, you’ll need
[Node](https://nodejs.org/en) (I keep the pinned version in
[`.node-version`](.node-version)) and [pnpm](https://pnpm.io/installation). Once
you have both, install the dependencies and start the dev server:

```sh
pnpm install
pnpm dev
```

That serves the site at <http://localhost:4321> and live-reloads as you edit. If
you’d rather see a production build, run `pnpm build` and then `pnpm preview`.

On a fresh clone, to run the automated accessibility checks that trigger before
pushing (see [`pre-push`](.husky/pre-push)), you’ll need to run this command to
install the browser engines:

```sh
pnpm exec playwright install chromium firefox webkit
```

You should only need to run this command once on a fresh clone.

## Scripts reference

These are the scripts I commonly use:

| Command               | What it does                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`            | Start the dev server with live reload                                                                            |
| `pnpm build`          | Build the production site into `dist/`                                                                           |
| `pnpm preview`        | Serve the production build locally                                                                               |
| `pnpm lint:fix`       | Fix what [ESLint](https://eslint.org) can and report the rest                                                    |
| `pnpm format`         | Format the whole project with [Prettier](https://prettier.io)                                                    |
| `pnpm verify`         | Lint, check formatting, type-check, and build                                                                    |
| `pnpm verify:site`    | Build and serve the site, then run the accessibility and link checks                                             |
| `pnpm check:security` | Verify the `security.txt` signature, sync, and expiry                                                            |
| `pnpm lighthouse`     | Run [Lighthouse](https://developer.chrome.com/docs/lighthouse/) across the mobile, desktop, and low-end profiles |

The full list lives in [`package.json`](package.json). The `verify`,
`verify:site`, and `check:security` gates are composites of finer-grained
scripts, and they’re the same ones my hooks and CI run.

## Quality gates and CI overview

I designed the repo automation around two principles. First, _local and CI
parity_: if a change would fail CI, it should fail locally first, so nothing
that would be rejected ever gets pushed. Second, _editor and CI parity_: the
diagnostics I see while editing should match the warnings and errors CI
enforces, so I can fix problems as soon as they’re introduced, rather than when
I go to commit or push.

<!-- prettier-ignore -->
> [!NOTE]
> Why run the same tests locally and remotely?
> [My background](https://mehrtens.com) is in aerospace engineering, where the
> [Swiss cheese model](https://en.wikipedia.org/wiki/Swiss_cheese_model) is
> standard operating procedure.

Those principles play out in layers. Locally,
[Husky](https://typicode.github.io/husky/) Git hooks run before code leaves my
machine:

- [`pre-commit`](.husky/pre-commit) runs
  [lint-staged](https://github.com/lint-staged/lint-staged) over staged files,
  and
- [`pre-push`](.husky/pre-push) runs the full `verify`, `verify:site`, and
  `check:security` gates (the same suite CI runs).

My editor diagnostics come from the same tools used in the Husky hooks: the
checked-in [`.zed/`](.zed/settings.json) configuration wires
[ESLint](https://eslint.org) and [Prettier](https://prettier.io) into
[Zed](https://zed.dev) as diagnostics and format-on-save, so if you edit in Zed
you’ll get the same experience I do without any extra configuration.

In CI ([GitHub Actions](https://docs.github.com/en/actions)), two kinds of
checks run:

- **Gating checks** that must pass before anything merges: linting, formatting,
  type-checking, and a build; accessibility
  ([axe-core](https://github.com/dequelabs/axe-core) across Chromium, Firefox,
  and WebKit) and internal-link integrity; and the `security.txt` signature,
  sync, and expiry check. These run on every push and pull request.
- **Non-gating reports** that inform but don’t block:
  [Lighthouse](https://developer.chrome.com/docs/lighthouse/) and an
  external-link sweep. These run on pull requests and pushes to `main`, plus a
  weekly schedule.

`main` is a protected branch. Every change must go through a pull request that
has to pass CI before it can be merged, and merging to `main` is what triggers a
deploy.

## Deployment

The site is deployed on
[Cloudflare Workers](https://www.cloudflare.com/products/workers/), with its
static assets served from
[Cloudflare R2](https://www.cloudflare.com/products/r2/). A merge to `main`
triggers a [GitHub Actions](https://docs.github.com/en/actions) workflow that
builds the site and deploys it with
[Wrangler](https://developers.cloudflare.com/workers/wrangler/), so `main`
always reflects what’s live. Every pull request also deploys to its own isolated
[preview URL](https://developers.cloudflare.com/workers/configuration/previews/)
so changes can be checked before they merge.
