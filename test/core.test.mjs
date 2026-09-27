import test from "node:test";import assert from "node:assert/strict";import {certs,analyze} from "../core.mjs";
test("rejects private keys",()=>assert.throws(()=>certs("-----BEGIN PRIVATE KEY-----\nx\n-----END PRIVATE KEY-----"),/PRIVATE_KEY_REJECTED/));
test("requires complete contract",()=>assert.throws(()=>analyze({}),/MISSING_OLDCHAIN/));
