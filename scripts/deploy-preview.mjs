import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {previewReleaseError,previewTarget} from "../src/lib/deployment.ts";

// No hosted action unless explicitly enabled after owner approval. Dry-run never uploads.
const dryRun=process.argv.includes("--dry-run");
if(process.argv.slice(2).some(arg=>arg!=="--dry-run"))throw Error("Unknown preview option.");
try{process.loadEnvFile(".env.local");}catch{}
const env={...process.env,CLOUDFLARE_ACCOUNT_ID:previewTarget.account,HALDOZ_SITE_URL:previewTarget.origin,HALDOZ_AUTH_READY:"true",HALDOZ_PAGES_READY:"true",HALDOZ_JOBS_READY:"false",HALDOZ_HOSTED_PREVIEW:"true",NEXT_TELEMETRY_DISABLED:"1",WRANGLER_SEND_METRICS:"false"};
const git=args=>spawnSync("git",args,{encoding:"utf8",env});
const branch=git(["branch","--show-current"]);
const error=previewReleaseError(env,branch.stdout?.trim()??"",dryRun);
if(branch.status!==0 || error)throw Error(error??"Cannot verify Git branch.");
const status=git(["status","--porcelain"]);
if(status.status!==0 || (!dryRun && status.stdout.trim()))throw Error("Live preview requires a clean committed tree.");
if(!dryRun){
  const identity=spawnSync(process.execPath,["node_modules/wrangler/bin/wrangler.js","whoami"],{encoding:"utf8",env});
  if(identity.status!==0 || !identity.stdout?.includes(previewTarget.account))throw Error("Wrangler must be privately signed in to the approved Cloudflare account first.");
  // These include both builds and local Worker authorization checks; never apply SQL.
  const checked=spawnSync(process.execPath,["scripts/check-cloudflare.mjs"],{stdio:"inherit",env:{...env,HALDOZ_HOSTED_PREVIEW:"false"}});
  if(checked.status!==0)throw Error("Preview checks failed; nothing uploaded.");
}
const built=spawnSync(process.execPath,["scripts/tool.mjs","npm","run","build:vinext"],{stdio:"ignore",env});
if(built.status!==0)throw Error("Preview build failed; nothing uploaded.");
const generated=JSON.parse(fs.readFileSync("dist/server/wrangler.json","utf8"));
if(generated.name!=="haldoz" || generated.main!=="index.js" || generated.assets?.binding!=="ASSETS" || path.resolve("dist/server",generated.assets.directory)!==path.resolve("dist/client"))throw Error("Unexpected full-stack build; refusing upload.");
if(!fs.existsSync("dist/server/index.js") || !fs.existsSync("dist/client/_next"))throw Error("Application server/assets missing.");
// Allowlist the deployment config: never inherit routes, paid bindings or migrations.
const config={name:previewTarget.name,account_id:previewTarget.account,main:generated.main,compatibility_date:generated.compatibility_date,compatibility_flags:generated.compatibility_flags,rules:generated.rules,no_bundle:generated.no_bundle,assets:generated.assets,observability:generated.observability,upload_source_maps:false,workers_dev:true,preview_urls:false,vars:Object.fromEntries(["NEXT_PUBLIC_SUPABASE_URL","NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY","HALDOZ_SITE_URL","HALDOZ_AUTH_READY","HALDOZ_PAGES_READY","HALDOZ_JOBS_READY","HALDOZ_HOSTED_PREVIEW"].map(key=>[key,env[key]]))};
const configPath="dist/server/wrangler.preview.json";
fs.writeFileSync(configPath,JSON.stringify(config,null,2));
fs.mkdirSync(".local/qa",{recursive:true});
const args=["node_modules/wrangler/bin/wrangler.js","deploy","--config",configPath];
if(dryRun)args.push("--dry-run","--outdir",".local/preview-package");
// Wrangler prints binding values. Keep its complete output private and print a redacted summary.
const deployed=spawnSync(process.execPath,args,{encoding:"utf8",env,maxBuffer:20*1024*1024});
fs.writeFileSync(".local/qa/preview-deployment-private.log",(deployed.stdout??"")+(deployed.stderr??""));
if(deployed.status!==0)throw Error("Preview packaging/deployment failed; inspect the ignored private log with credential redaction.");
const commit=git(["rev-parse","HEAD"]).stdout.trim();
fs.writeFileSync(".local/qa/preview-deployment.json",JSON.stringify({dryRun,uploaded:!dryRun,commit,branch:previewTarget.branch,target:previewTarget.origin,account:previewTarget.account,fixtureRoutesHidden:true,publishingEnabled:false},null,2));
console.log(dryRun?"Preview full-stack package verified locally. Nothing uploaded.":"Preview uploaded; live route/OAuth acceptance checks are still required.");
console.log(previewTarget.origin);
