import { X509Certificate } from "node:crypto";

const PRIVATE_KEY=/-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/;
export function certs(pem){if(PRIVATE_KEY.test(pem)) throw new Error("PRIVATE_KEY_REJECTED"); return [...pem.matchAll(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g)].map(m=>new X509Certificate(m[0]));}
function validNow(c,now){return now>=Date.parse(c.validFrom)&&now<=Date.parse(c.validTo);}
function trusts(chainPem,bundlePem,now=Date.now()){
 const chain=certs(chainPem), roots=certs(bundlePem); if(!chain.length||!roots.length)return {ok:false,reason:"MISSING_CERTIFICATE"};
 if(chain.some(c=>!validNow(c,now)))return {ok:false,reason:"CERTIFICATE_TIME_INVALID"};
 let cur=chain[0], path=[cur.subject];
 for(let depth=0;depth<chain.length+roots.length+1;depth++){
   const root=roots.find(r=>cur.issuer===r.subject&&cur.verify(r.publicKey));
   if(root)return {ok:true,reason:"TRUSTED",path:[...path,root.subject]};
   const issuer=chain.slice(1).find(r=>cur.issuer===r.subject&&cur.verify(r.publicKey));
   if(!issuer)return {ok:false,reason:"ISSUER_NOT_TRUSTED",path};
   cur=issuer; path.push(cur.subject);
 }
 return {ok:false,reason:"PATH_LOOP",path};
}
export function analyze(x){
 for(const k of ["oldChain","newChain","currentBundle","transitionBundle","finalBundle"])if(typeof x[k]!=="string")throw new Error("MISSING_"+k.toUpperCase());
 const matrix={old:{current:trusts(x.oldChain,x.currentBundle),transition:trusts(x.oldChain,x.transitionBundle),final:trusts(x.oldChain,x.finalBundle)},new:{current:trusts(x.newChain,x.currentBundle),transition:trusts(x.newChain,x.transitionBundle),final:trusts(x.newChain,x.finalBundle)}};
 const req=[["old","current","CONTRACT_CURRENT_REJECTS_OLD"],["old","transition","CONTRACT_TRANSITION_REJECTS_OLD"],["new","transition","CONTRACT_TRANSITION_REJECTS_NEW"],["new","final","CONTRACT_FINAL_REJECTS_NEW"]];
 const findings=req.filter(([a,b])=>!matrix[a][b].ok).map(([a,b,id])=>({id,severity:"BLOCK",reason:matrix[a][b].reason}));
 if(matrix.old.final.ok)findings.push({id:"STALE_OLD_TRUST_IN_FINAL",severity:"REVIEW",reason:"Final bundle still trusts old chain"});
 return {schema:"k8s-ca-rotation-preflight/v1",status:findings.some(f=>f.severity==="BLOCK")?"BLOCK":"PASS",matrix,findings};
}