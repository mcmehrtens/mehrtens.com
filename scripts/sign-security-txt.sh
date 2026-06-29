#!/bin/sh
# Clearsign security.txt with the signing subkey.
fpr="A7AB023C328D3C181F7B7926F69DA2566D804943"
src="security/security.txt"
out="public/.well-known/security.txt"

if ! command -v gpg >/dev/null 2>&1; then
    echo "error: gpg is not installed - cannot sign $src" >&2
    exit 1
fi
if ! gpg --list-secret-keys "$fpr" >/dev/null 2>&1; then
    echo "error: signing key $fpr is not in your keyring - cannot sign $src" >&2
    exit 1
fi

gpg -u "$fpr" --clearsign --yes --output "$out" "$src"
