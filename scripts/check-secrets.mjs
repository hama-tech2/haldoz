import fs from "node:fs";
import { spawnSync } from "node:child_process";
const run = args => {
  const result = spawnSync("git", args, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  if (result.status !== 0) throw new Error("Git inspection failed");
  return result.stdout;
};
const names = new Set(run(["ls-files", "--cached", "--others", "--exclude-standard", "-z"]).split("\0").filter(Boolean));
const patterns = [/GOCSPX-[A-Za-z0-9_-]{16,}/, /sb_(?:secret|publishable)_[A-Za-z0-9_-]{16,}/, /(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}/, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, /postgres(?:ql)?:\/\/[^\s:@]+:[^\s@]+@/i];
const issues = [];
function inspect(name, content, source) {
  if (content.includes("\0")) return;
  if (patterns.some(p => p.test(content))) issues.push(name + ": possible credential in " + source + " (value hidden)");
}
for (const name of names) {
  if (name !== ".env.example" && /^(?:\.env(?:\.|$)|\.local\/)|\.(?:pem|key|p12|pfx|keystore|jks)$/i.test(name)) issues.push(name + ": private artifact must not be tracked");
  if (fs.existsSync(name) && fs.statSync(name).isFile()) inspect(name, fs.readFileSync(name, "utf8"), "working file");
}
for (const record of run(["ls-files", "--stage", "-z"]).split("\0").filter(Boolean)) {
  const match = record.match(/^\d+ ([a-f0-9]+) (\d)\t([\s\S]+)$/);
  if (!match || match[2] !== "0") throw new Error("Unresolved index; scan failed closed");
  inspect(match[3], run(["cat-file", "blob", match[1]]), "staged file");
}
if (issues.length) { console.error(issues.join("\n")); process.exitCode = 1; }
else console.log("Basic working/index credential scan passed; not a comprehensive secret detector.");
