import fs from "node:fs";
import { spawn, spawnSync } from "node:child_process";
const env={...process.env,NEXT_TELEMETRY_DISABLED:"1",WRANGLER_SEND_METRICS:"false"};
function run(args,extra={}) {
 const result=spawnSync(process.execPath,args,{stdio:"inherit",env:{...env,...extra}});
 if(result.status!==0)throw new Error("Check failed: "+args[0]);
}
run(["scripts/check.mjs"]);
run(["scripts/tool.mjs","npm","run","build:vinext"]);
const origin="http://127.0.0.1:3102";
let logs="";
const worker=spawn(process.execPath,["node_modules/wrangler/bin/wrangler.js","dev","--config","dist/server/wrangler.json","--ip","127.0.0.1","--port","3102","--local","--log-level","error","--var","HALDOZ_SITE_URL:"+origin,"--var","HALDOZ_AUTH_READY:false","--var","HALDOZ_PAGES_READY:false"],{stdio:["ignore","pipe","pipe"],env,windowsHide:true});
for(const stream of [worker.stdout,worker.stderr])stream.on("data",chunk=>{logs=(logs+chunk.toString()).slice(-4000);});
let workerError;
worker.on("error",error=>{workerError=error;});
try{
 let ready=false;
 for(let attempt=0;attempt<60;attempt++){
  if(workerError||worker.exitCode!==null)throw new Error("Local Worker exited before readiness.");
  try{const response=await fetch(origin,{signal:AbortSignal.timeout(1000)});if(response.ok){ready=true;break;}}catch{}
  await new Promise(resolve=>setTimeout(resolve,500));
 }
 if(!ready)throw new Error("Local Worker did not become ready.");
 const testEnv={HALDOZ_TEST_ORIGIN:origin,HALDOZ_TEST_RUNTIME:"workers"};
 for(const script of ["verify-http","verify-owner-routes","verify-account-workflow","verify-draft-routes"])run(["scripts/"+script+".mjs"],testEnv);
 fs.mkdirSync(".local/qa",{recursive:true});
 fs.writeFileSync(".local/qa/cloudflare-check.json",JSON.stringify({nextBuild:true,workersBuild:true,workersHttp:true,unauthenticatedActionDenial:true,hostedWrites:false,cloudDeployment:false},null,2));
 console.log("Next.js + local Workers checks passed; no cloud deployment or hosted write performed.");
}catch(error){
 console.error(logs.replace(/sb_(?:publishable|secret)_[A-Za-z0-9_-]+/g,"[redacted]"));
 throw error;
}finally{
 worker.kill("SIGTERM");
 await Promise.race([new Promise(resolve=>worker.once("exit",resolve)),new Promise(resolve=>setTimeout(resolve,3000))]);
}
