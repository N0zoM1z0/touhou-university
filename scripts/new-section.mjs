import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const name = process.argv[2]?.trim().toLowerCase();
const pageId = process.argv[3]?.trim().toLowerCase() || "home";

if (!name || !/^[a-z][a-z0-9-]*$/.test(name) || !/^[a-z][a-z0-9-]*$/.test(pageId)) {
  console.error("Usage: npm run new:section -- section-name [page-id]");
  process.exit(1);
}

const sectionFile = path.join(root, "src", "sections", `${name}.html`);
const styleFile = path.join(root, "src", "styles", `${name}.css`);
const configFile = path.join(root, "site.config.mjs");
const { site } = await import(pathToFileURL(configFile).href);
const targetPage = site.pages.find((page) => page.id === pageId);

if (!targetPage) {
  const knownPageIds = site.pages.map((page) => page.id).join(", ");
  console.error(`Unknown page id "${pageId}". Choose one of: ${knownPageIds}`);
  process.exit(1);
}
if (targetPage.sections.includes(name) || site.styles.includes(name)) {
  console.error(`Section/style "${name}" is already registered.`);
  process.exit(1);
}

const sectionMarkup = `<section class="section ${name}" id="${name}">
  <div class="container">
    <header class="section-header reveal">
      <div>
        <p class="eyebrow">${name.toUpperCase()}</p>
        <h2>${name}</h2>
      </div>
    </header>
  </div>
</section>
`;

function registerOnPage(source, field, value, beforeValue) {
  const pageMarker = `      id: "${pageId}",`;
  const pageStart = source.indexOf(pageMarker);
  const pageEnd = source.indexOf("\n    },", pageStart);
  if (pageStart < 0 || pageEnd < 0) throw new Error(`Could not locate page config for ${pageId}.`);

  const block = source.slice(pageStart, pageEnd);
  const pattern = new RegExp(`${field}: \\[([^\\]]*)\\]`);
  const match = block.match(pattern);
  if (!match) throw new Error(`Could not locate ${pageId}.${field}.`);

  const items = [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]);
  const before = beforeValue ? items.indexOf(beforeValue) : -1;
  items.splice(before >= 0 ? before : items.length, 0, value);
  const replacement = `${field}: [${items.map((item) => JSON.stringify(item)).join(", ")}]`;
  const nextBlock = block.replace(pattern, replacement);
  return source.slice(0, pageStart) + nextBlock + source.slice(pageEnd);
}

function registerGlobalStyle(source, value) {
  const registryStart = source.indexOf("\n  styles: [\n");
  const registryEnd = source.indexOf("\n  ],\n  locales:", registryStart);
  if (registryStart < 0 || registryEnd < 0) throw new Error("Could not locate the global style registry.");

  const block = source.slice(registryStart, registryEnd);
  const readability = '    "readability",';
  const addition = `    ${JSON.stringify(value)},\n`;
  const nextBlock = block.includes(readability)
    ? block.replace(readability, addition + readability)
    : block + `\n${addition.trimEnd()}`;
  return source.slice(0, registryStart) + nextBlock + source.slice(registryEnd);
}

let config = await readFile(configFile, "utf8");
config = registerOnPage(config, "sections", name, pageId === "home" ? "closing" : null);
config = registerOnPage(config, "styles", name, "readability");
config = registerGlobalStyle(config, name);

await writeFile(sectionFile, sectionMarkup, { flag: "wx" });
await writeFile(styleFile, `.${name} {\n  /* Section styles */\n}\n`, { flag: "wx" });
await writeFile(configFile, config, "utf8");

console.log(`Created section, stylesheet, and ${pageId} page registrations for "${name}".`);
console.log(`Run npm run build after editing src/sections/${name}.html.`);

// Force a syntax check of the edited configuration.
await import(`${pathToFileURL(configFile).href}?t=${Date.now()}`);
