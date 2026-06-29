#!/bin/sh
# security.txt validation. Checks: (1) valid PGP signature, (2) signed body in
# sync with the source, (3) Expires not past / within RENEW_WITHIN_DAYS. Uses
# only the public key committed to the repo.

signed="public/.well-known/security.txt"
src="security/security.txt"
pubkey="public/.well-known/pgp-key.txt"
renew_within="${RENEW_WITHIN_DAYS:-30}"

if ! command -v gpg >/dev/null 2>&1; then
    echo "warning: gpg not found; skipping security.txt checks" >&2
    exit 0
fi

for f in "$signed" "$src" "$pubkey"; do
    if [ ! -f "$f" ]; then
        echo "error: missing $f" >&2
        exit 1
    fi
done

# Hermetic keyring: import the repo's public key
GNUPGHOME=$(mktemp -d) || exit 1
export GNUPGHOME
trap 'rm -rf "$GNUPGHOME"' EXIT
gpg --quiet --no-autostart --import "$pubkey" 2>/dev/null

if ! gpg --quiet --no-autostart --verify "$signed" 2>/dev/null; then
    echo "error: $signed has a missing or invalid PGP signature - run 'pnpm sign:security'" >&2
    exit 1
fi

body=$(gpg --quiet --no-autostart --decrypt "$signed" 2>/dev/null)
if [ "$body" != "$(cat "$src")" ]; then
    echo "error: $signed is out of sync with $src - re-run 'pnpm sign:security'" >&2
    exit 1
fi

expires=$(printf '%s\n' "$body" | sed -n 's/^[Ee]xpires:[[:space:]]*//p' | head -1)
if [ -z "$expires" ]; then
    echo "error: no Expires field in $signed" >&2
    exit 1
fi

# GNU date (Linux/CI) first, then BSD date (macOS) as a fallback.
exp_epoch=$(date -u -d "$expires" +%s 2>/dev/null) ||
    exp_epoch=$(date -u -j -f "%Y-%m-%dT%H:%M:%S" "${expires%%.*}" +%s 2>/dev/null)
if [ -z "$exp_epoch" ]; then
    echo "error: could not parse Expires '$expires'" >&2
    exit 1
fi

days_left=$(((exp_epoch - $(date -u +%s)) / 86400))
if [ "$days_left" -lt 0 ]; then
    echo "error: security.txt expired $((-days_left)) day(s) ago - renew Expires and re-sign" >&2
    exit 1
fi
if [ "$days_left" -lt "$renew_within" ]; then
    echo "error: security.txt expires in $days_left day(s) (< $renew_within) - renew Expires and re-sign" >&2
    exit 1
fi

echo "security.txt OK: valid signature, in sync with source, expires in $days_left day(s)"
