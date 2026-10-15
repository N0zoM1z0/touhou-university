import { buildCatalogs } from "./i18n/catalogs.mjs";

// A fresh clone can report source counts before a publication build exists.
await buildCatalogs();
const { projectStatus, formatProjectStatus } = await import("./project-status.mjs");
console.log(formatProjectStatus(await projectStatus()));
