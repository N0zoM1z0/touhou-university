import { buildCatalogs, loadCatalogs, syncCatalogs } from "./i18n/catalogs.mjs";

const command = process.argv[2] || "status";
try {
  if (command === "sync") {
    await syncCatalogs();
    console.log("PO catalogs merged; changed sources require review before building.");
  } else if (command === "build" || command === "check") {
    const result = await buildCatalogs({ check: command === "check" });
    console.log(`Translations ${command === "check" ? "valid" : "built"}: ${result.messages} messages, ${result.catalogs} catalogs, ${result.modules} modules, 3 locales.`);
  } else if (command === "status") {
    const catalogs = await loadCatalogs();
    for (const { scope, entries } of catalogs) console.log(`${scope.padEnd(34)} ${String(entries.length).padStart(4)} messages × 3 locales`);
    console.log(`${catalogs.reduce((sum, item) => sum + item.entries.length, 0)} messages in ${catalogs.length} catalogs.`);
  } else throw new Error("Usage: node scripts/i18n.mjs build|check|status|sync");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
