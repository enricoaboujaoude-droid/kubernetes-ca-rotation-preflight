#!/usr/bin/env node
import fs from "node:fs"; import {analyze} from "./core.mjs";
const p=process.argv[2]; if(!p){console.error("usage: k8s-ca-rotation-preflight contract.json");process.exit(2)}
try{const out=analyze(JSON.parse(fs.readFileSync(p,"utf8")));console.log(JSON.stringify(out,null,2));process.exitCode=out.status==="PASS"?0:1}catch(e){console.error(String(e.message||e));process.exitCode=2}