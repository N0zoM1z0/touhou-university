import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requestedSet = process.argv[2]?.trim();

if (!requestedSet || !/^[a-z0-9-]+$/.test(requestedSet)) {
  console.error("Usage: npm run portraits -- set-a");
  process.exit(1);
}

const assetDirectory = path.join(root, "assets", "images", "faculty", requestedSet);
try {
  await access(assetDirectory);
} catch {
  console.error(`Portrait set does not exist: assets/images/faculty/${requestedSet}`);
  process.exit(1);
}

const configFile = path.join(root, "site.config.mjs");
const config = await readFile(configFile, "utf8");
const updated = config.replace(/portraitSet:\s*"[^"]+"/, `portraitSet: "${requestedSet}"`);

if (updated === config) {
  console.error("Could not locate portraitSet in site.config.mjs");
  process.exit(1);
}

await writeFile(configFile, updated, "utf8");
console.log(`Active faculty portraits: ${requestedSet}`);
console.log("Run npm run build to refresh index.html.");
