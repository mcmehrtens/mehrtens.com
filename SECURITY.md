# Security Policy

Security is one of my highest priorities for this project. This document
explains how to report a vulnerability and how the project is maintained to
reduce risk.

## Reporting a Vulnerability

Please report security issues privately. Do **not** open a public issue for
anything security-sensitive.

- **GitHub (preferred):**
  [Private vulnerability reporting](https://github.com/mcmehrtens/mehrtens.com/security/advisories/new)
  is enabled on this repository.
- **Email:** security@mehrtens.com

You may optionally encrypt your report with my PGP key—fingerprint
`A7AB 023C 328D 3C18 1F7B 7926 F69D A256 6D80 4943`—published at
<https://mehrtens.com/.well-known/pgp-key.txt> and discoverable via WKD with
`gpg --locate-keys security@mehrtens.com`.

When reporting, please include:

- A description of the issue and its impact.
- Steps to reproduce, with a proof of concept if available.
- The affected URL, page, or dependency.

You can expect an acknowledgement within **7 days**. I will keep you informed as
the report is triaged and resolved, and will credit you on request once a fix
has shipped.

## Verifying my key and this file

`security.txt` is clearsigned with the PGP key above. To confirm both the key
and the file are authentic and unmodified:

```sh
gpg --locate-keys security@mehrtens.com
curl -s https://mehrtens.com/.well-known/security.txt | gpg --verify
```

A `Good signature` from the fingerprint above confirms this file is mine.

## Scope

**In scope**

- The live site at <https://mehrtens.com>.
- The source code in this repository.

**Out of scope**

- The hosting, DNS, and CDN platform (Cloudflare); report those issues to the
  provider.
- Third-party dependencies with no demonstrated impact on this site; report
  those to the dependency's own maintainers.
- Findings that require physical access, social engineering, or a compromised
  end-user device.
- Volumetric denial-of-service and raw scanner output without a demonstrated,
  exploitable impact.

## Safe Harbor

I will not pursue or support legal action against anyone who, in good faith,
discovers and reports a vulnerability in accordance with this policy, provided
you avoid privacy violations, data destruction, and service degradation, and
give me a reasonable opportunity to resolve the issue before any public
disclosure.

## Coordinated Disclosure

Please allow a reasonable period to investigate and ship a fix before disclosing
publicly. As a static, continuously deployed site, fixes typically roll out
quickly.

## Supported Versions

This is a continuously deployed site. Only the currently deployed version is
supported; there are no maintained release branches.

## Security Practices

These measures keep the site and its supply chain healthy:

- **Minimal, audited dependencies.** The dependency surface is kept small and
  reviewed before adoption.
- **Cooldown before adoption.** Dependency updates are held for a minimum
  cooldown (currently 7 days) before they become eligible to merge, reducing
  exposure to compromised or yanked releases.
- **Transitive CVE remediation.** Known-vulnerable transitive dependencies are
  force-resolved to patched versions via pnpm `overrides`, even before the
  direct dependency adopts the fix upstream.
- **Automated updates.** Dependabot proposes grouped npm and GitHub Actions
  updates on a weekly schedule.
- **Pinned CI.** GitHub Actions are pinned to full commit SHAs.
- **Enforced quality gate.** Every change must pass linting, formatting,
  type-checking, and a successful build in CI before it can be deployed.
- **security.txt.** Machine-readable contact and policy metadata is published
  per [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116) at
  <https://mehrtens.com/.well-known/security.txt>.

This policy will continue to evolve as the site matures.
