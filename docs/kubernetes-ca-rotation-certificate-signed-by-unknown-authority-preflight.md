# Kubernetes CA rotation certificate signed by unknown authority preflight

If a workload reports **certificate signed by unknown authority** during a CA rotation, test the rotation contract before changing the cluster.

Provide the old workload chain, new workload chain, current trust bundle, dual-trust transition bundle, and final trust bundle. Run:

```bash
npx kubernetes-ca-rotation-preflight contract.json
```

A safe transition requires old→current, old→transition, new→transition, and new→final to validate. A BLOCK finding identifies the failed contract edge. `STALE_OLD_TRUST_IN_FINAL` is REVIEW-only.

The tool is offline and rejects private-key PEM blocks. Do not paste private keys into the contract.
