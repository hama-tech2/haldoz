import fs from "node:fs";
import { spawnSync } from "node:child_process";
const result=spawnSync("git",["ls-files","--cached","--others","--exclude-standard","-z"],{encoding:"utf8"});
if(result.status!==0)throw new Error("Cannot inspect public source candidates.");
const names=[...new Set(result.stdout.split("\0").filter(Boolean))];
const rootFiles=new Set([".env.example",".gitattributes",".gitignore","AGENTS.md","README.md","design.md","eslint.config.mjs","next.config.ts","package.json","package-lock.json","tsconfig.json","vite.config.ts","wrangler.jsonc"]);
const problems=[];
for(const name of names){
 const allowed=rootFiles.has(name)||/^(src|public|scripts|tests|docs|supabase)\//.test(name)||name===".github/workflows/ci.yml";
 if(!allowed||/(^|\/)(node_modules|\.next|\.local|\.temp|\.wrangler|dist|bazaro|discount|kurdish-jobs|TomatoRun)(\/|$)/i.test(name)||/\.(zip|7z|rar|pem|key|p12|pfx|keystore|jks|log)$/i.test(name))problems.push(name);
 if(name!==".env.example"&&/(^|\/)\.env($|\.)|(^|\/)\.dev\.vars($|\.)/.test(name))problems.push(name);
}
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
if(pkg.name!=="haldoz")problems.push("package.json: wrong project");
for(const group of [pkg.dependencies,pkg.devDependencies])for(const [name,version]of Object.entries(group??{}))if(!/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(version))problems.push("package.json: dependency must be exact-pinned: "+name);
if(problems.length){console.error("Public checkpoint rejected:\n"+[...new Set(problems)].join("\n"));process.exitCode=1;}
else console.log("Public source allowlist passed: "+names.length+" Haldoz candidate files; private/generated/unrelated paths excluded.");
