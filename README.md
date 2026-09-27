# Kubernetes CA Rotation Preflight

Deterministic, offline evidence for **Kubernetes / service-mesh CA rotation**. It checks the required rotation contract before rollout: the current bundle must trust the old chain; the transition bundle must trust both old and new chains; the final bundle must trust the new chain.

No cluster credentials, uploads, backend, database, private keys, or paid service.

## Canonical use

```bash
npx kubernetes-ca-rotation-preflight contract.json
```

GitHub Action:

```yaml
- uses: enricoaboujaoude-droid/kubernetes-ca-rotation-preflight@v0.1.0
  with:
    contract: contract.json
```

The JSON contract contains `oldChain`, `newChain`, `currentBundle`, `transitionBundle`, and `finalBundle` as PEM strings. Private-key blocks are rejected.

Output is canonical JSON with a 2×3 compatibility matrix and stable findings. Exit 0 = PASS; exit 1 = BLOCK.

## Exact-query troubleshooting

See [Kubernetes CA rotation certificate signed by unknown authority preflight](docs/kubernetes-ca-rotation-certificate-signed-by-unknown-authority-preflight.md).

## Success event

A non-owner repository runs the Action against a real trust rotation and produces an evidence report. Owned fixtures/tests do not count.

## Hosting

Static/browser-local + zero-dependency Node CLI/Action. Cost: $0.

MIT licensed.
