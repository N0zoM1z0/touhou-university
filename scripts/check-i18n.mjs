import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "../site.config.mjs";
import { canonicalText, messages, textTranslations } from "../src/data/i18n.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const base = messages["zh-Hant"];
const baseKeys = Object.keys(base);
let failed = false;

for (const locale of site.locales) {
  const dictionary = messages[locale];
  if (!dictionary) {
    console.error(`Missing locale: ${locale}`);
    failed = true;
    continue;
  }

  const missing = baseKeys.filter((key) => !(key in dictionary));
  const extra = Object.keys(dictionary).filter((key) => !(key in base));
  if (missing.length) {
    console.error(`${locale}: missing ${missing.join(", ")}`);
    failed = true;
  }
  if (extra.length) {
    console.error(`${locale}: extra ${extra.join(", ")}`);
    failed = true;
  }
}

const sectionDirectory = path.join(root, "src", "sections");
const sectionFiles = (await readdir(sectionDirectory)).filter((file) => file.endsWith(".html"));
const sectionSource = (
  await Promise.all(sectionFiles.map((file) => readFile(path.join(sectionDirectory, file), "utf8")))
).join("\n");
const staticChinese = [
  ...new Set(
    [...sectionSource.matchAll(/>([^<>]+)</g)]
      .map((match) => canonicalText(match[1]))
      .filter((value) => /\p{Script=Han}/u.test(value)),
  ),
];
const untranslatedStatic = staticChinese.filter((value) => !(value in textTranslations.en));
if (untranslatedStatic.length) {
  console.error(`Static copy missing translations:\n- ${untranslatedStatic.join("\n- ")}`);
  failed = true;
}

if (failed) process.exit(1);
console.log(
  `i18n complete: ${baseKeys.length} keys across ${site.locales.length} locales; ${staticChinese.length} static strings covered.`,
);
