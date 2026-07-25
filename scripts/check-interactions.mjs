import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "../site.config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sectionDirectory = path.join(root, "src", "sections");
const sectionFiles = (await readdir(sectionDirectory)).filter((file) => file.endsWith(".html"));
const sectionSources = await Promise.all(sectionFiles.map(async (file) => ({
  file,
  source: await readFile(path.join(sectionDirectory, file), "utf8"),
})));
const failures = [];

const buttonPattern = /<button\b([^>]*)>/gi;
for (const { file, source } of sectionSources) {
  for (const match of source.matchAll(buttonPattern)) {
    const attributes = match[1];
    if (!/\btype\s*=\s*["'](?:button|submit)["']/i.test(attributes)) {
      failures.push(`${file}: button has no explicit button/submit type: ${match[0].slice(0, 120)}`);
    }
  }
}

const builtPages = site.pages.map((page) => page.output);
for (const file of builtPages) {
  const source = await readFile(path.join(root, file), "utf8");
  if (/<a\b[^>]*href\s*=\s*["'](?:|#)["']/i.test(source)) {
    failures.push(`${file}: empty placeholder link remains in a built page.`);
  }
  if (source.includes("data-service=") && !source.includes("data-service-dialog")) {
    failures.push(`${file}: service controls were built without the shared service dialog.`);
  }
}

if (failures.length) {
  console.error(`Interaction contract check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Interaction shell valid: ${sectionFiles.length} sections and ${builtPages.length} built pages. `
  + "Behaviour remains the browser smoke test's job.",
);
