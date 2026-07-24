import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const name = process.argv[2]?.trim().toLowerCase();

if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error("Usage: npm run new:section -- section-name");
  process.exit(1);
}

const sectionFile = path.join(root, "src", "sections", `${name}.html`);
const styleFile = path.join(root, "src", "styles", `${name}.css`);
const configFile = path.join(root, "site.config.mjs");
const templateFile = path.join(root, "src", "index.template.html");

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

await writeFile(sectionFile, sectionMarkup, { flag: "wx" });
await writeFile(styleFile, `.${name} {\n  /* Section styles */\n}\n`, { flag: "wx" });

let template = await readFile(templateFile, "utf8");
template = template.replace(
  "      <!-- @include sections/closing.html -->",
  `      <!-- @include sections/${name}.html -->\n      <!-- @include sections/closing.html -->`,
);
await writeFile(templateFile, template, "utf8");

let config = await readFile(configFile, "utf8");
config = config.replace('    "closing",', `    "${name}",\n    "closing",`);
config = config.replace('    "responsive-extras",', `    "${name}",\n    "responsive-extras",`);
await writeFile(configFile, config, "utf8");

console.log(`Created section, stylesheet, template include and config entries for "${name}".`);
console.log(`Run npm run build after editing src/sections/${name}.html.`);

// Force a syntax check of the edited configuration.
await import(`${pathToFileURL(configFile).href}?t=${Date.now()}`);
