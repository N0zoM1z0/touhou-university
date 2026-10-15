import { outputRoot } from "./build/paths.mjs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "../site.config.mjs";
import {
  canonicalText,
  messageRecords,
  messages,
} from "../src/data/i18n.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const base = messages["zh-Hant"];
const baseKeys = Object.keys(base);
let failed = false;

const recordKeys = messageRecords.map(([key]) => key);
const duplicateKeys = [...new Set(recordKeys.filter((key, index) => recordKeys.indexOf(key) !== index))];
if (duplicateKeys.length) {
  console.error(`Duplicate message keys: ${duplicateKeys.join(", ")}`);
  failed = true;
}

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
  const empty = baseKeys.filter((key) => typeof dictionary[key] !== "string" || !dictionary[key].trim());
  if (empty.length) {
    console.error(`${locale}: empty ${empty.join(", ")}`);
    failed = true;
  }
}

const sectionDirectory = path.join(root, "src", "sections");
const sectionFiles = (await readdir(sectionDirectory)).filter((file) => file.endsWith(".html"));
const sourceFiles = [
  ...sectionFiles.map((file) => path.join(sectionDirectory, file)),
  path.join(root, "src", "templates", "page.html"),
];
const sourceDocuments = await Promise.all(sourceFiles.map(async (file) => ({
  file,
  source: await readFile(file, "utf8"),
})));
const sectionSource = sourceDocuments.map(({ source }) => source).join("\n");
const explicitKeyPattern = /\bdata-i18n(?:-(?:aria-label|placeholder|alt|title))?="([^"]+)"/g;
const explicitKeys = [
  ...new Set(sourceDocuments.flatMap(({ source }) =>
    [...source.matchAll(explicitKeyPattern), ...source.matchAll(/<!--\s*i18n:([\w.-]+)\s*-->/g)].map((match) => match[1]),
  )),
];
const unknownExplicitKeys = explicitKeys.filter((key) => !(key in base));
if (unknownExplicitKeys.length) {
  console.error(`Unknown explicit i18n keys: ${unknownExplicitKeys.join(", ")}`);
  failed = true;
}

for (const page of site.pages) {
  if (page.id === "home") continue;
  if (!page.titleKey || !(page.titleKey in base)) {
    console.error(`${page.id}: missing or unknown titleKey`);
    failed = true;
  }
}

for (const key of baseKeys) {
  const tokens = (value) => [...String(value).matchAll(/\{([a-zA-Z0-9_]+)\}/g)]
    .map((match) => match[1])
    .sort()
    .join(",");
  const expected = tokens(base[key]);
  for (const locale of site.locales.slice(1)) {
    if (tokens(messages[locale][key]) !== expected) {
      console.error(`${key}: interpolation variables differ in ${locale}`);
      failed = true;
    }
  }
}

const legacySectionSource = sectionSource.replace(/<!--\s*i18n:[\w.-]+\s*-->[^<]*/g, "").replace(
  /<([a-z][\w-]*)\b[^>]*\bdata-i18n="[^"]+"[^>]*>[\s\S]*?<\/\1>/gi,
  "",
);
const staticChinese = [
  ...new Set(
    [...legacySectionSource.matchAll(/>([^<>]+)</g)]
      .map((match) => canonicalText(match[1]))
      .filter((value) => /\p{Script=Han}/u.test(value)),
  ),
];
if (staticChinese.length) {
  console.error(`Unkeyed static copy (use data-i18n or an i18n text marker):\n- ${staticChinese.join("\n- ")}`);
  failed = true;
}

const keyedDefaults = sourceDocuments.flatMap(({ file, source }) =>
  [...source.matchAll(/<([a-z][\w-]*)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((match) => ({ file, key: match[2], source: match[3], value: canonicalText(match[3]) })),
);
for (const { file, key, source, value } of keyedDefaults) {
  if (/<[a-z][^>]*>/i.test(source)) {
    console.error(`${path.relative(root, file)}: data-i18n="${key}" must wrap text only; key a child span instead`);
    failed = true;
    continue;
  }
}

// Readable source fallbacks may lag behind an editorial PO change. Issued
// defaults must always be compiled from the current Traditional Chinese PO.
const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
for (const page of site.pages) {
  const html = await readFile(path.join(outputRoot, page.output), "utf8");
  for (const match of html.matchAll(/<([a-z][\w-]*)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>([^<]*)<\/\1>/gi)) {
    const [, , key, fallback] = match;
    if (!(key in base) || canonicalText(fallback) !== canonicalText(escapeHtml(base[key]))) {
      console.error(`${page.output}: generated default for ${key} differs from its PO catalog; run npm run build`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log(
  `i18n complete: ${baseKeys.length} keys across ${site.locales.length} locales; `
  + `${explicitKeys.length} explicit markup keys; no source-text lookup required.`,
);
