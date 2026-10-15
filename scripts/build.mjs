import { buildCatalogs } from "./i18n/catalogs.mjs";
import { preparePublication, copyRuntime } from "./build/publication.mjs";

// Compile text before importing modules that resolve domain records.
const translations = await buildCatalogs();
console.log(`Compiled ${translations.messages} messages in ${translations.catalogs} translation catalogs.`);
await preparePublication();
await import("./build/pages.mjs");
await import("./build-gaokao-downloads.mjs");
await copyRuntime();
console.log("Publication ready in dist/.");
