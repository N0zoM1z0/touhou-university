import { readdir, readFile, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parsePo, serializePo, mergeCatalog, placeholders } from "./po.mjs";
import { referenceUpdater } from "./references.mjs";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const locales = ["zh-Hant", "ja", "en"];
export const outputRoot = "src/generated/i18n";
const relativePath = (from, to) => path.relative(from, to).split(path.sep).join("/");

export async function filesBelow(directory, extension = ".po") {
  const result = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) result.push(...await filesBelow(file, extension));
    else if (item.name.endsWith(extension)) result.push(file);
  }
  return result.sort();
}

export function activeEntries(entries, filename, language) {
  const header = entries.find((entry) => entry.msgid === "" && !entry.msgctxt);
  if (!header?.msgstr.includes(`Language: ${language}\n`)) throw new Error(`${filename}: wrong or missing Language header`);
  if (entries.some((entry) => !entry.obsolete && entry.msgid && !entry.msgctxt)) throw new Error(`${filename}: message is missing its stable msgctxt`);
  const active = new Map();
  for (const entry of entries.filter((entry) => !entry.obsolete && entry.msgctxt)) {
    if (active.has(entry.msgctxt)) throw new Error(`${filename}:${entry.line}: duplicate context ${entry.msgctxt}`);
    if (!/^(text:|tree:)/.test(entry.msgctxt)) throw new Error(`${filename}:${entry.line}: unknown context family`);
    if (!entry.msgid.trim() || !entry.msgstr.trim()) throw new Error(`${filename}:${entry.line}: empty source or translation (${entry.msgctxt})`);
    if (entry.flags.includes("fuzzy")) throw new Error(`${filename}:${entry.line}: pending fuzzy translation (${entry.msgctxt})`);
    if (language === "en" && entry.msgid !== entry.msgstr) throw new Error(`${filename}:${entry.line}: English source changed; run npm run i18n:sync`);
    active.set(entry.msgctxt, entry);
  }
  return active;
}

export async function loadCatalogs() {
  const sourceRoot = path.join(root, "locales/en");
  const sourceFiles = await filesBelow(sourceRoot);
  if (!sourceFiles.length) throw new Error("No English source catalogs found");
  const sourceScopes = sourceFiles.map((file) => relativePath(sourceRoot, file));
  for (const locale of locales) {
    const directory = path.join(root, "locales", locale);
    const actual = (await filesBelow(directory)).map((file) => relativePath(directory, file));
    if (JSON.stringify(actual) !== JSON.stringify(sourceScopes)) throw new Error(`${locale}: catalog paths differ from en; run npm run i18n:sync`);
  }
  const catalogs = [];
  for (const relative of sourceScopes) {
    const scope = relative.slice(0, -3);
    const languages = {};
    for (const locale of locales) {
      const filename = `locales/${locale}/${relative}`;
      languages[locale] = activeEntries(parsePo(await readFile(path.join(root, filename), "utf8"), filename), filename, locale);
    }
    const source = languages.en;
    const entries = [];
    for (const [context, entry] of source) {
      const values = {};
      for (const locale of locales) {
        const translated = languages[locale].get(context);
        if (!translated || translated.msgid !== entry.msgid) throw new Error(`${scope}: ${locale} source drift at ${context}; run npm run i18n:sync`);
        if (JSON.stringify(placeholders(translated.msgstr)) !== JSON.stringify(placeholders(entry.msgid))) throw new Error(`${scope}: ${locale} placeholders differ at ${context}`);
        values[locale] = translated.msgstr;
      }
      entries.push({ context, values });
    }
    for (const locale of locales) if (languages[locale].size !== source.size) throw new Error(`${scope}: ${locale} has extra active entries`);
    if (/^(data|ui)\//.test(scope)) {
      const owner = `src/${scope.startsWith("ui/") ? "js" : "data"}/${scope.split("/").slice(1).join("/")}.js`;
      const code = await readFile(path.join(root, owner), "utf8");
      for (const match of code.matchAll(/catalog(?:Text|Values)\("([^"]+)"/g)) {
        if (!source.has(`text:${match[1]}`)) throw new Error(`${owner}: unknown PO message ${match[1]}`);
      }
      for (const match of code.matchAll(/catalogTrees\["([^"]+)"\]/g)) {
        if (![...source.keys()].some((key) => key.startsWith(`tree:${match[1]}#`))) throw new Error(`${owner}: unknown PO tree ${match[1]}`);
      }
    }
    catalogs.push({ scope, entries });
  }
  return catalogs;
}

function assignPath(target, pointer, value) {
  const parts = pointer.split("/").slice(1).map((part) => part.replaceAll("~1", "/").replaceAll("~0", "~"));
  let current = target;
  for (const [index, part] of parts.entries()) {
    if (["__proto__", "constructor", "prototype"].includes(part)) throw new Error(`Unsafe catalog path: ${pointer}`);
    if (index === parts.length - 1) current[part] = value;
    else current = current[part] ??= /^\d+$/.test(parts[index + 1]) ? [] : {};
  }
}

export function compileCatalog({ scope, entries }) {
  const records = {};
  const trees = {};
  for (const { context, values } of entries) {
    if (context.startsWith("text:")) records[context.slice(5)] = values;
    else {
      const match = /^tree:([^#]+)#(\/.*)$/.exec(context);
      if (!match) throw new Error(`${scope}: invalid tree context ${context}`);
      const [, name, pointer] = match;
      trees[name] ??= Object.fromEntries(locales.map((locale) => [locale, /^\/\d+(\/|$)/.test(pointer) ? [] : {}]));
      for (const locale of locales) assignPath(trees[name][locale], pointer, values[locale]);
    }
  }
  const helper = path.posix.relative(path.posix.dirname(`${outputRoot}/${scope}.js`), "src/js/locale-catalog.js");
  const banner = "// Generated from locales/*.po. Run npm run i18n:build; do not edit.\n";
  return banner + `import { bindCatalog, catalogLocales } from ${JSON.stringify(helper.startsWith(".") ? helper : `./${helper}`)};\n`
    + `export const text = bindCatalog(${JSON.stringify(records, null, 2)}, ${JSON.stringify(scope)});\n`
    + `export const values = (key) => { const record = text(key); return catalogLocales.map((locale) => record[locale]); };\n`
    + `export const trees = ${JSON.stringify(trees, null, 2)};\n`;
}

export async function buildCatalogs({ check = false } = {}) {
  const catalogs = await loadCatalogs();
  const outputs = new Map(catalogs.filter(({ scope }) => !scope.startsWith("shell/")).map((catalog) => [`${outputRoot}/${catalog.scope}.js`, compileCatalog(catalog)]));
  const shellEntries = catalogs.filter(({ scope }) => scope.startsWith("shell/")).flatMap(({ entries }) => entries);
  const shellKeys = shellEntries.map(({ context }) => context);
  if (new Set(shellKeys).size !== shellKeys.length) throw new Error("Duplicate shell message key across catalogs");
  const rows = shellEntries.map(({ context, values }) => [context.slice(5), ...locales.map((locale) => values[locale])]);
  outputs.set(`${outputRoot}/shell.js`, "// Generated from locales/*/shell/*.po; do not edit.\nexport const messageRecords = " + JSON.stringify(rows, null, 2) + ";\n");
  for (const [file, contents] of outputs) {
    const absolute = path.join(root, file);
    if (check) {
      let current;
      try { current = await readFile(absolute, "utf8"); } catch { /* Report below. */ }
      if (current !== contents) throw new Error(`${file}: generated catalog is stale; run npm run i18n:build`);
    } else {
      await mkdir(path.dirname(absolute), { recursive: true });
      let current;
      try { current = await readFile(absolute, "utf8"); } catch { /* First build. */ }
      if (current !== contents) await writeFile(absolute, contents);
    }
  }
  for (const file of await filesBelow(path.join(root, outputRoot), ".js")) {
    const relative = relativePath(root, file);
    if (outputs.has(relative)) continue;
    if (check) throw new Error(`${relative}: orphaned generated catalog`);
    await rm(file);
  }
  return { catalogs: catalogs.length, messages: catalogs.reduce((sum, catalog) => sum + catalog.entries.length, 0), modules: outputs.size };
}

export async function syncCatalogs() {
  const sourceRoot = path.join(root, "locales/en");
  const updateReference = referenceUpdater(root);
  const writeChanged = async (file, contents) => {
    let previous;
    try { previous = await readFile(file, "utf8"); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
    if (previous !== contents) await writeFile(file, contents);
  };
  for (const sourceFile of await filesBelow(sourceRoot)) {
    const relative = relativePath(sourceRoot, sourceFile);
    const entries = parsePo(await readFile(sourceFile, "utf8"), sourceFile);
    // English is the source edition; editors change msgstr in every language.
    // A changed English sentence invalidates the other editions on sync.
    for (const entry of entries.filter((entry) => entry.msgctxt && !entry.obsolete)) {
      entry.msgid = entry.msgstr;
      await updateReference(relative.slice(0, -3), entry);
    }
    await writeChanged(sourceFile, serializePo(entries, "en"));
    const template = path.join(root, "locales/templates", relative.replace(/\.po$/, ".pot"));
    await mkdir(path.dirname(template), { recursive: true });
    await writeChanged(template, serializePo(entries.filter((entry) => !entry.obsolete), "", true));
    for (const locale of locales.filter((language) => language !== "en")) {
      const file = path.join(root, "locales", locale, relative);
      let old = [];
      try { old = parsePo(await readFile(file, "utf8"), file); }
      catch (error) { if (error.code !== "ENOENT") throw error; }
      await mkdir(path.dirname(file), { recursive: true });
      await writeChanged(file, serializePo(mergeCatalog(entries, old), locale));
    }
  }
}
