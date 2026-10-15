import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "../site.config.mjs";
import { projectRoot, outputRoot } from "./build/paths.mjs";
import { stylesheetReferences } from "./build/styles.mjs";

const failures = [];
async function required(file, owner) {
  try { await access(file); }
  catch { failures.push(`${owner}: missing ${path.relative(outputRoot, file)}`); }
}
async function localReference(reference, owner) {
  if (!reference || /^(?:#|[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) return;
  const pathname = reference.replaceAll("&amp;", "&").split(/[?#]/, 1)[0];
  if (!pathname) return;
  const file = path.resolve(path.dirname(owner), decodeURIComponent(pathname));
  if (path.relative(outputRoot, file).startsWith("..")) failures.push(`${owner}: reference escapes publication: ${reference}`);
  else await required(file, path.relative(outputRoot, owner));
}

for (const file of await readdir(projectRoot)) {
  if (file.endsWith(".html")) failures.push(`Generated page leaked into repository root: ${file}`);
}
for (const privateDirectory of ["locales", "scripts", "docs", "src/sections", "src/styles", "src/templates"]) {
  try { await access(path.join(outputRoot, privateDirectory)); failures.push(`Authoring directory leaked into dist/: ${privateDirectory}`); }
  catch { /* Correctly excluded. */ }
}
await required(path.join(outputRoot, ".nojekyll"), "publication");
await required(path.join(outputRoot, "assets/crest.svg"), "publication");

for (const page of site.pages) {
  const file = path.join(outputRoot, page.output);
  await required(file, page.id);
  const html = await readFile(file, "utf8");
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) await localReference(match[1], file);
  for (const match of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const candidate of match[1].split(",")) await localReference(candidate.trim().split(/\s+/)[0], file);
  }
}

async function checkModules(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) await checkModules(file);
    else if (item.name.endsWith(".js")) {
      const source = await readFile(file, "utf8");
      for (const match of source.matchAll(/\bfrom\s*["'](\.[^"']+)["']|\bimport\(\s*["'](\.[^"']+)["']/g)) await localReference(match[1] || match[2], file);
    }
  }
}
await checkModules(path.join(outputRoot, "src"));
for (const name of await readdir(path.join(outputRoot, "assets/css"))) {
  const file = path.join(outputRoot, "assets/css", name);
  const css = await readFile(file, "utf8");
  for (const reference of stylesheetReferences(css)) await localReference(reference, file);
}

if (failures.length) {
  console.error(`Publication invalid:\n- ${failures.join("\n- ")}`);
  process.exitCode = 1;
} else console.log(`Publication valid: ${site.pages.length} unchanged page URLs, local assets/modules, authoring sources excluded.`);
