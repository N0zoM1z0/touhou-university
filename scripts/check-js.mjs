import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectories = [path.join(root, "src"), path.join(root, "scripts")];
const files = [];

async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(file);
    if (entry.isFile() && /\.(?:js|mjs)$/.test(entry.name)) files.push(file);
  }
}

await Promise.all(sourceDirectories.map(collect));

for (const file of files.sort()) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exit(result.status || 1);
  }
}

console.log(`JavaScript syntax valid: ${files.length} files.`);
