import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const root = fileURLToPath(new URL("../", import.meta.url));
const local = path.join(root, ".local");
fs.mkdirSync(path.join(local, "tmp"), { recursive: true });
const [tool, ...args] = process.argv.slice(2);
const env = { ...process.env, NEXT_TELEMETRY_DISABLED: "1", npm_config_cache: path.join(local, "npm-cache"), TEMP: path.join(local, "tmp"), TMP: path.join(local, "tmp") };
let entry;
if (tool === "npm") {
  entry = [process.env.npm_execpath, path.join(path.dirname(process.execPath), "node_modules/npm/bin/npm-cli.js"), path.resolve(root, "../npm/bin/npm-cli.js")].find(p => p && fs.existsSync(p));
} else if (tool === "next") {
  entry = path.join(root, "node_modules/next/dist/bin/next");
}
if (!entry || !fs.existsSync(entry)) {
  console.error("Tool unavailable. Use an existing Node.js installation with npm; do not install globally without approval.");
  process.exit(1);
}
const result = spawnSync(process.execPath, [entry, ...args], { cwd: root, env, stdio: "inherit" });
if (result.error) console.error(result.error.message);
process.exitCode = result.status ?? 1;
