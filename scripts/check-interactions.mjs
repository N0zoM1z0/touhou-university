import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "../site.config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sectionDirectory = path.join(root, "src", "sections");
const jsDirectory = path.join(root, "src", "js");
const sectionFiles = (await readdir(sectionDirectory)).filter((file) => file.endsWith(".html"));
const jsFiles = (await readdir(jsDirectory)).filter((file) => file.endsWith(".js"));
const sectionSources = await Promise.all(sectionFiles.map(async (file) => ({
  file,
  source: await readFile(path.join(sectionDirectory, file), "utf8"),
})));
const jsSources = await Promise.all(jsFiles.map((file) => readFile(path.join(jsDirectory, file), "utf8")));
const allJs = jsSources.join("\n");
const mainSource = await readFile(path.join(jsDirectory, "main.js"), "utf8");
const failures = [];

const buttonPattern = /<button\b([^>]*)>/gi;
for (const { file, source } of sectionSources) {
  for (const match of source.matchAll(buttonPattern)) {
    const attributes = match[1];
    if (!/\btype\s*=\s*["'](?:button|submit)["']/i.test(attributes)) {
      failures.push(`${file}: button has no explicit button/submit type: ${match[0].slice(0, 120)}`);
    }
    if (/\btype\s*=\s*["']button["']/i.test(attributes)) {
      const dataAttributes = [...attributes.matchAll(/\b(data-[a-z0-9-]+)(?:\s*=|\s|$)/gi)].map((item) => item[1]);
      if (!dataAttributes.length) {
        failures.push(`${file}: non-submit button has no declarative action attribute: ${match[0].slice(0, 120)}`);
      }
      const handled = dataAttributes.some((attribute) => {
        const datasetName = attribute
          .slice(5)
          .replace(/-([a-z])/g, (_, character) => character.toUpperCase());
        return allJs.includes(`[${attribute}]`)
          || allJs.includes(attribute)
          || allJs.includes(`dataset.${datasetName}`)
          || allJs.includes(`dataset["${datasetName}"]`);
      });
      if (!handled) {
        failures.push(`${file}: no JavaScript handler reference found for ${dataAttributes.join(", ")}`);
      }
    }
  }
}

const conditionalFamilies = [
  ["data-school", 'await initialize("[data-school]"'],
  ["data-faculty", 'await initialize("[data-faculty]"'],
  ["data-service", 'await initialize("[data-service]"'],
  ["data-research", 'await initialize("[data-research]"'],
  ["data-map-place", 'await initialize("#map"'],
  ["data-campus-feature", 'await initialize("[data-campus-feature]"'],
  ["data-club", 'await initialize("[data-campus-feature]"'],
  ["data-bbs-filter", 'await initialize("#bbs"'],
  ["data-chronicle-open", 'await initialize("[data-chronicle-open]"'],
];

for (const [attribute, initializer] of conditionalFamilies) {
  const appears = sectionSources.some(({ source }) => source.includes(attribute));
  if (appears && !mainSource.includes(initializer)) {
    failures.push(`main.js: ${attribute} controls are present, but the matching initializer is missing (${initializer}).`);
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

const staticServiceIds = new Set(
  sectionSources.flatMap(({ source }) =>
    [...source.matchAll(/\bdata-service\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]),
  ),
);
for (const id of staticServiceIds) {
  if (!new RegExp(`\\b${id}\\s*:\\s*render[A-Z]`).test(allJs)) {
    failures.push(`services.js: static service "${id}" has no renderer.`);
  }
}

if (failures.length) {
  console.error(`Interaction contract check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Interaction contracts valid: ${sectionFiles.length} sections, ${builtPages.length} pages, `
  + `${staticServiceIds.size} service actions, and ${conditionalFamilies.length} conditional action families.`,
);
