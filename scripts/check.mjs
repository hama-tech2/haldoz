import { spawnSync } from "node:child_process";
for (const script of ["test", "check:secrets", "check:public-source", "lint", "typecheck", "build"]) {
  console.log("\nChecking: " + script);
  const result = spawnSync(process.execPath, ["scripts/tool.mjs", "npm", "run", script], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
