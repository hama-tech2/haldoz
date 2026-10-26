import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { productionReleaseError } from "../src/lib/deployment.ts";
const git = args => spawnSync("git", args, { encoding: "utf8" });
const branch = process.env.WORKERS_CI_BRANCH ?? git(["branch","--show-current"]).stdout?.trim() ?? "";
const error = productionReleaseError(process.env, branch);
if (error) { console.error(error); process.exit(1); }
const status = git(["status","--porcelain"]);
if (status.status !== 0 || status.stdout.trim()) { console.error("Production deployment requires a clean, committed tree."); process.exit(1); }
if (!fs.existsSync("dist/server/wrangler.json")) { console.error("The tested Workers build is missing."); process.exit(1); }
const config = JSON.parse(fs.readFileSync("dist/server/wrangler.json","utf8"));
if (config.name !== "haldoz") { console.error("Unexpected Worker target; refusing deployment."); process.exit(1); }
const result = spawnSync(process.execPath, ["node_modules/wrangler/bin/wrangler.js","deploy","--config","dist/server/wrangler.json"], {stdio:"inherit"});
process.exitCode = result.status ?? 1;
