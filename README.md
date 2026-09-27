# Kubernetes CA Rotation Preflight

[![CI](https://github.com/enricoaboujaoude-droid/kubernetes-ca-rotation-preflight/actions/workflows/test.yml/badge.svg)](https://github.com/enricoaboujaoude-droid/kubernetes-ca-rotation-preflight/actions/workflows/test.yml)
[![Release](https://img.shields.io/github/v/release/enricoaboujaoude-droid/kubernetes-ca-rotation-preflight)](https://github.com/enricoaboujaoude-droid/kubernetes-ca-rotation-preflight/releases/latest)
[![Release downloads](https://img.shields.io/github/downloads/enricoaboujaoude-droid/kubernetes-ca-rotation-preflight/total)](https://github.com/enricoaboujaoude-droid/kubernetes-ca-rotation-preflight/releases)

Deterministic, offline evidence for **Kubernetes / service-mesh CA rotation**. It checks the required rotation contract before rollout: the current bundle must trust the old chain; the transition bundle must trust both old and new chains; the final bundle must trust the new chain.

No cluster credentials, uploads, backend, database, private keys, or paid service.

## Canonical use

```yaml
- uses: enricoaboujaoude-droid/kubernetes-ca-rotation-preflight@v0.1.0
  with:
    contract: contract.json
```

The JSON contract contains `oldChain`, `newChain`, `currentBundle`, `transitionBundle`, and `finalBundle` as PEM strings. Private-key blocks are rejected.

Output is canonical JSON with a 2×3 compatibility matrix and stable findings. Exit 0 = PASS; exit 1 = BLOCK.

## Download the CLI

The [v0.1.0 Release](https://github.com/enricoaboujaoude-droid/kubernetes-ca-rotation-preflight/releases/tag/v0.1.0) contains:

- `kubernetes-ca-rotation-preflight-0.1.0.tgz` — npm-compatible CLI package.
- `kubernetes-ca-rotation-preflight-v0.1.0.zip` — complete source archive.
- `SHA256SUMS` — integrity checksums for both artifacts.

After downloading the TGZ:

```bash
npx ./kubernetes-ca-rotation-preflight-0.1.0.tgz contract.json
```

Public npm registry publication is intentionally not claimed until authenticated publication is available.

## Exact-query troubleshooting

See [Kubernetes CA rotation certificate signed by unknown authority preflight](docs/kubernetes-ca-rotation-certificate-signed-by-unknown-authority-preflight.md).

## Success event

A non-owner repository runs the Action against a real trust rotation and produces an evidence report. Owned fixtures, tests, repository views, and release-page visits do not count as usage.

## Hosting

Static/browser-local + zero-dependency Node CLI/Action. Cost: $0.

MIT licensed.
