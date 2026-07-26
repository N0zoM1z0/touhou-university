import {
  ethicsCase,
  ethicsCases,
  ethicsConsentPaths,
  ethicsDataKinds,
  ethicsDisclosureRules,
  ethicsMethods,
  ethicsOutcomeLabels,
  ethicsReviewers,
  ethicsRiskBands,
  ethicsStanceLabels,
  ethicsTargets,
} from "../src/data/ethics.js";
import {
  assessEthicsProtocol,
  ethicsDraftFromCase,
  ethicsStorageKeys,
} from "../src/js/ethics-model.js";
import { campusEventContracts } from "../src/data/event-contracts.js";
import { localRecordRegistry } from "../src/data/local-records.js";
import { campusDomain } from "../src/js/domain-registry.js";
import { pageForRoute } from "../src/js/site-router.js";
import { site } from "../site.config.mjs";

const locales = ["zh-Hant", "ja", "en"];
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const translated = (value, label) => {
  locales.forEach((locale) => check(
    typeof value?.[locale] === "string" && value[locale].trim(),
    `${label}: missing ${locale}.`,
  ));
};

check(ethicsCases.length === 5, "The opening ethics board must retain exactly five specimen cases.");
check(ethicsReviewers.length === 5, "The ethics board must retain five independent review seats.");
check(new Set(ethicsCases.map(({ id }) => id)).size === ethicsCases.length, "Ethics case ids are not unique.");
check(new Set(ethicsReviewers.map(({ id }) => id)).size === ethicsReviewers.length, "Ethics reviewer ids are not unique.");
check(site.pages.some(({ id, output }) => id === "ethics" && output === "ethics.html"), "Ethics page is missing from the generated site.");
check(pageForRoute("ethics-case-reisen-undisclosed-wave") === "ethics", "Ethics case routes have no exact page owner.");
check(pageForRoute("ethics-protocol-TU-ERB-P-1") === "ethics", "Ethics protocol routes have no exact page owner.");

[
  ...Object.entries(ethicsOutcomeLabels),
  ...Object.entries(ethicsStanceLabels),
].forEach(([id, label]) => translated(label, `label ${id}`));
[
  ...ethicsTargets,
  ...ethicsMethods,
  ...ethicsDisclosureRules,
  ...ethicsConsentPaths,
  ...ethicsRiskBands,
  ...ethicsDataKinds,
].forEach((record) => translated(record.label, `choice ${record.id}`));

ethicsReviewers.forEach((reviewer) => {
  translated(reviewer.name, `reviewer ${reviewer.id} name`);
  translated(reviewer.seat, `reviewer ${reviewer.id} seat`);
  translated(reviewer.question, `reviewer ${reviewer.id} question`);
});

const ids = {
  targets: new Set(ethicsTargets.map(({ id }) => id)),
  methods: new Set(ethicsMethods.map(({ id }) => id)),
  disclosure: new Set(ethicsDisclosureRules.map(({ id }) => id)),
  consent: new Set(ethicsConsentPaths.map(({ id }) => id)),
  risk: new Set(ethicsRiskBands.map(({ id }) => id)),
  data: new Set(ethicsDataKinds.map(({ id }) => id)),
};

ethicsCases.forEach((caseFile) => {
  translated(caseFile.title, `${caseFile.id} title`);
  translated(caseFile.shortTitle, `${caseFile.id} short title`);
  translated(caseFile.lede, `${caseFile.id} lede`);
  translated(caseFile.conflict, `${caseFile.id} conflict`);
  check(caseFile.voices.length >= 2, `${caseFile.id}: fewer than two conflicting voices.`);
  caseFile.voices.forEach((voice, index) => {
    translated(voice.speaker, `${caseFile.id} voice ${index} speaker`);
    translated(voice.statement, `${caseFile.id} voice ${index} statement`);
  });
  check(ids.targets.has(caseFile.prefill.targetId), `${caseFile.id}: unknown target.`);
  check(ids.methods.has(caseFile.prefill.methodId), `${caseFile.id}: unknown method.`);
  check(ids.disclosure.has(caseFile.prefill.disclosureId), `${caseFile.id}: unknown disclosure rule.`);
  check(ids.consent.has(caseFile.prefill.consentId), `${caseFile.id}: unknown consent path.`);
  check(ids.risk.has(caseFile.prefill.riskId), `${caseFile.id}: unknown risk band.`);
  caseFile.prefill.dataIds.forEach((id) => check(ids.data.has(id), `${caseFile.id}: unknown data kind ${id}.`));
  ["stopRule", "controlPlan", "withdrawalPlan", "deletionPlan", "appealPlan", "rationale"]
    .forEach((key) => translated(caseFile.prefill[key], `${caseFile.id} ${key}`));
  const assessment = assessEthicsProtocol(ethicsDraftFromCase(caseFile.id));
  check(assessment.outcome === caseFile.expectedOutcome, `${caseFile.id}: expected ${caseFile.expectedOutcome}, got ${assessment.outcome}.`);
  check(assessment.opinions.length === ethicsReviewers.length, `${caseFile.id}: not every reviewer returned an independent opinion.`);
  check(new Set(assessment.opinions.map(({ reviewerId }) => reviewerId)).size === ethicsReviewers.length, `${caseFile.id}: a reviewer was averaged or duplicated.`);
  check(!("score" in assessment) && !("average" in assessment), `${caseFile.id}: ethics assessment must not expose a total score or average.`);
  assessment.opinions.forEach((opinion) => {
    check(ethicsStanceLabels[opinion.stance], `${caseFile.id}: unknown stance ${opinion.stance}.`);
    translated(opinion.statement, `${caseFile.id}/${opinion.reviewerId} statement`);
    opinion.conditions.forEach((condition, index) => translated(condition, `${caseFile.id}/${opinion.reviewerId} condition ${index}`));
  });
});

const repairedObject = {
  ...ethicsDraftFromCase("drift-object-refusal"),
  consentId: "both",
  objectAssent: true,
  subjectCanStop: true,
  independentMonitor: true,
  auditStub: true,
  riskId: "moderate",
  appealPlan: "An independent advocate at the Hieda desk receives every appeal.",
};
check(
  assessEthicsProtocol(repairedObject, "en").outcome === "approved",
  "A contested drift-object protocol cannot become approvable after both parties assent and safeguards are repaired.",
);

const eventTypes = [
  "ethics.protocol.submitted",
  "ethics.review.completed",
  "ethics.protocol.amended",
  "ethics.protocol.withdrawn",
];
eventTypes.forEach((type) => check(campusEventContracts[type], `Missing campus event contract ${type}.`));

const registeredKeys = new Set(localRecordRegistry.map(({ key }) => key));
Object.values(ethicsStorageKeys).forEach((key) => check(registeredKeys.has(key), `Local records cabinet is missing ${key}.`));

const domain = campusDomain("ethics");
check(domain, "Ethics is missing from the shared domain registry.");
locales.forEach((locale) => {
  const entries = domain?.search(locale) || [];
  check(entries.length >= ethicsCases.length, `Ethics search manifest is incomplete in ${locale}.`);
  ethicsCases.forEach((caseFile) => check(
    entries.some(({ route }) => route === `ethics-case-${caseFile.id}`),
    `${caseFile.id}: missing from ${locale} global search.`,
  ));
});

if (failures.length) {
  console.error(`Research ethics check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Research ethics ready: ${ethicsCases.length} specimen cases, ${ethicsReviewers.length} independent seats, `
  + `${eventTypes.length} causal event types, and no averaged ruling.`,
);
