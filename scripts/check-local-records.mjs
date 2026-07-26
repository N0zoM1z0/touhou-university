import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  localRecordGroups,
  localRecordKinds,
  localRecordRegistry,
  localRecordScopes,
} from "../src/data/local-records.js";
import { site } from "../site.config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const locales = ["zh-Hant", "ja", "en"];
const translated = (value) => locales.every((locale) => String(value?.[locale] || "").trim());
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const groupIds = new Set(localRecordGroups.map((group) => group.id));
const keys = new Set();
for (const group of localRecordGroups) {
  check(translated(group.title) && translated(group.note), `${group.id} is missing trilingual shelf copy.`);
}
for (const record of localRecordRegistry) {
  check(!keys.has(record.key), `${record.key} appears more than once in the record catalogue.`);
  keys.add(record.key);
  check(record.key.startsWith("tu:"), `${record.key} is outside the university storage namespace.`);
  check(groupIds.has(record.group), `${record.key} points to unknown shelf ${record.group}.`);
  check(translated(record.title), `${record.key} is missing a trilingual file title.`);
  check(["local", "session"].includes(record.storage), `${record.key} has unknown storage ${record.storage}.`);
  check(["json", "text"].includes(record.encoding), `${record.key} has unknown encoding ${record.encoding}.`);
  check(localRecordKinds[record.kind] && localRecordScopes[record.scope], `${record.key} has unknown kind or scope.`);
}

const jsDir = path.join(root, "src/js");
const jsFiles = (await readdir(jsDir)).filter((file) => file.endsWith(".js"));
const referencedKeys = new Set();
for (const file of jsFiles) {
  const source = await readFile(path.join(jsDir, file), "utf8");
  for (const match of source.matchAll(/["'](tu:[A-Za-z0-9:_-]+)["']/g)) {
    const key = match[1];
    if (!key.endsWith("change")) referencedKeys.add(key);
  }
}
for (const key of referencedKeys) {
  check(keys.has(key), `${key} is used by the site but absent from the records catalogue.`);
}

const sessionRecords = localRecordRegistry.filter((record) => record.storage === "session");
check(
  sessionRecords.length === 1
    && sessionRecords[0].key === "tu:phantasm:pass"
    && sessionRecords[0].portable === false,
  "The short-lived PHANTASM pass must remain the sole non-portable session record.",
);
check(
  site.pages.some((page) => page.id === "records"
    && page.output === "records.html"
    && page.sections.includes("local-records")
    && page.styles.includes("local-records")),
  "The on-device records cabinet is not registered as a focused subpage.",
);

if (failures.length) {
  console.error(`On-device records check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`On-device records valid: ${localRecordRegistry.length} catalogued keys across ${localRecordGroups.length - 1} known shelves, with future tu: keys discoverable at runtime.`);
