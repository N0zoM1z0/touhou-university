import {
  dossiersForCharacter,
  dossiersForVersion,
  knowledgeCharacters,
  knowledgeDossiers,
  knowledgeRecordKinds,
  knowledgeVersions,
  resolveKnowledgeRecord,
} from "../src/data/knowledge-graph.js";
import { campusEventContracts } from "../src/data/event-contracts.js";
import { campusDomain } from "../src/js/domain-registry.js";
import { pageForRoute } from "../src/js/site-router.js";
import { site } from "../site.config.mjs";

const locales = ["zh-Hant", "ja", "en"];
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const localized = (value, label) => {
  check(value && typeof value === "object", `${label}: missing locale object.`);
  locales.forEach((locale) => check(
    typeof value?.[locale] === "string" && value[locale].trim(),
    `${label}: missing ${locale}.`,
  ));
};

check(knowledgeDossiers.length >= 7, "The Hieda desk must open with at least seven cross-files.");
check(new Set(knowledgeDossiers.map((dossier) => dossier.id)).size === knowledgeDossiers.length, "Dossier ids are not unique.");
check(new Set(knowledgeCharacters.map((character) => character.id)).size === knowledgeCharacters.length, "Character ids are not unique.");
check(site.pages.some((page) => page.id === "hieda" && page.output === "hieda.html"), "Hieda page is missing from the site build.");
check(pageForRoute("hieda-event-late-bell-seven") === "hieda", "Hieda deep routes have no exact page owner.");
const searchManifest = campusDomain("hieda");
check(searchManifest, "Hieda is missing from the shared domain registry.");

const characterIds = new Set(knowledgeCharacters.map((character) => character.id));
const versionIds = new Set(knowledgeVersions().map((entry) => entry.id));
const pageIds = new Set(site.pages.map((page) => page.id));

Object.entries(knowledgeRecordKinds).forEach(([id, label]) => localized(label, `record kind ${id}`));
knowledgeCharacters.forEach((character) => {
  localized(character.name, `character ${character.id} name`);
  localized(character.role, `character ${character.id} role`);
  check(dossiersForCharacter(character.id).length > 0, `Character ${character.id} has no dossier and should not be a visible index slip.`);
});

knowledgeDossiers.forEach((dossier) => {
  localized(dossier.title, `dossier ${dossier.id} title`);
  localized(dossier.lead, `dossier ${dossier.id} lead`);
  localized(dossier.tension, `dossier ${dossier.id} tension`);
  check(dossier.records.length >= 5, `${dossier.id}: fewer than five records.`);
  check(new Set(dossier.records.map((record) => record.kind)).size >= 5, `${dossier.id}: “five records” collapse into fewer than five record forms.`);
  check(new Set(dossier.records.map((record) => record.id)).size === dossier.records.length, `${dossier.id}: record ids are not unique within the dossier.`);
  check(dossier.characters.length >= 3, `${dossier.id}: fewer than three character perspectives.`);
  dossier.characters.forEach((id) => check(characterIds.has(id), `${dossier.id}: unknown character ${id}.`));
  dossier.versions.forEach((id) => check(versionIds.has(id), `${dossier.id}: unknown or unindexed history version ${id}.`));
  check(dossier.versions.length >= 2, `${dossier.id}: fewer than two chronicle versions.`);
  check(dossier.eventQueries.length > 0, `${dossier.id}: no local-ledger projection.`);

  dossier.eventQueries.forEach((query, index) => {
    check(query.types.length > 0, `${dossier.id}: event query ${index} has no types.`);
    query.types.forEach((type) => check(campusEventContracts[type], `${dossier.id}: unknown campus event type ${type}.`));
    query.refs.forEach((reference) => check(/^[a-z][a-z0-9-]*:.+/.test(reference), `${dossier.id}: malformed event reference ${reference}.`));
  });

  dossier.records.forEach((record) => {
    check(knowledgeRecordKinds[record.kind], `${dossier.id}/${record.id}: unknown record kind ${record.kind}.`);
    localized(record.annotation, `${dossier.id}/${record.id} annotation`);
    record.characters.forEach((id) => {
      check(characterIds.has(id), `${dossier.id}/${record.id}: unknown character ${id}.`);
      check(dossier.characters.includes(id), `${dossier.id}/${record.id}: character ${id} is absent from its dossier index.`);
    });
    locales.forEach((locale) => {
      const resolved = resolveKnowledgeRecord(record, locale);
      check(resolved, `${dossier.id}/${record.id}: source ${record.source.type}:${record.source.id} does not resolve in ${locale}.`);
      if (!resolved) return;
      check(resolved.title && resolved.detail, `${dossier.id}/${record.id}: source lacks readable title/detail in ${locale}.`);
      check(pageIds.has(pageForRoute(resolved.route)), `${dossier.id}/${record.id}: route ${resolved.route} has no built page.`);
    });
  });
});

knowledgeVersions().forEach((entry) => {
  check(dossiersForVersion(entry.id).length > 0, `Version ${entry.id} is visible but has no dossier.`);
  localized(entry.title, `history ${entry.id} title`);
});

locales.forEach((locale) => {
  const entries = searchManifest?.search(locale) || [];
  const expected = knowledgeDossiers.length
    + knowledgeCharacters.filter((character) => dossiersForCharacter(character.id).length).length
    + knowledgeVersions().length;
  check(entries.length === expected, `Hieda global-search manifest is incomplete in ${locale}.`);
  entries.forEach((entry) => check(pageForRoute(entry.route) === "hieda", `Search route ${entry.route} escaped the Hieda page.`));
});

if (failures.length) {
  console.error(`Hieda knowledge-graph check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

const recordCount = knowledgeDossiers.reduce((sum, dossier) => sum + dossier.records.length, 0);
console.log(
  `Hieda index valid: ${knowledgeDossiers.length} dossiers, ${knowledgeCharacters.length} character slips, `
  + `${knowledgeVersions().length} chronicle versions, and ${recordCount} resolved source leaves.`,
);
