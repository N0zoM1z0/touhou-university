import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import packageJson from "../package.json" with { type: "json" };
import { site } from "../site.config.mjs";
import { courseCatalogue } from "../src/data/courses.js";
import { campusEventContracts } from "../src/data/event-contracts.js";
import { employmentJobs, employmentPosterImages } from "../src/data/employment.js";
import { fieldworkStations } from "../src/data/fieldwork.js";
import { knowledgeCharacters, knowledgeDossiers, knowledgeVersions } from "../src/data/knowledge-graph.js";
import { localRecordGroups, localRecordRegistry } from "../src/data/local-records.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function countFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  let count = 0;
  for (const entry of entries) {
    if (entry.isDirectory()) count += await countFiles(path.join(directory, entry.name));
    else if (entry.isFile()) count += 1;
  }
  return count;
}

export async function projectStatus() {
  return Object.freeze({
    version: packageJson.version,
    pages: site.pages.length,
    ordinaryPages: site.pages.filter((page) => !page.hidden).length,
    hiddenPages: site.pages.filter((page) => page.hidden).length,
    sections: new Set(site.pages.flatMap((page) => page.sections)).size,
    cssBundles: site.pages.length + 1,
    locales: site.locales.length,
    localRecordKeys: localRecordRegistry.length,
    localRecordShelves: localRecordGroups.length - 1,
    eventContracts: Object.keys(campusEventContracts).length,
    knowledgeDossiers: knowledgeDossiers.length,
    knowledgeCharacters: knowledgeCharacters.length,
    knowledgeVersions: knowledgeVersions().length,
    knowledgeLeaves: knowledgeDossiers.reduce((sum, dossier) => sum + dossier.records.length, 0),
    employmentJobs: employmentJobs.length,
    employmentPosters: Object.keys(employmentPosterImages).length,
    courses: courseCatalogue.length,
    fieldworkStations: fieldworkStations.length,
    offlineExamFiles: await countFiles(path.join(root, "downloads", "gaokao")),
  });
}

export function formatProjectStatus(status) {
  return [
    `Touhou University ${status.version}`,
    `${status.pages} generated pages (${status.ordinaryPages} ordinary + ${status.hiddenPages} hidden), ${status.sections} sections, ${status.cssBundles} CSS bundles`,
    `${status.locales} locales, ${status.localRecordKeys} on-device keys across ${status.localRecordShelves} known shelves, ${status.eventContracts} official event contracts`,
    `Hieda: ${status.knowledgeDossiers} dossiers, ${status.knowledgeCharacters} characters, ${status.knowledgeVersions} versions, ${status.knowledgeLeaves} source leaves`,
    `Employment: ${status.employmentJobs} vacancies / ${status.employmentPosters} posters; catalogue: ${status.courses} courses; fieldwork: ${status.fieldworkStations} stations`,
    `${status.offlineExamFiles} generated offline unified-exam files`,
  ].join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(formatProjectStatus(await projectStatus()));
}
