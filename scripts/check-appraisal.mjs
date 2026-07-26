import {
  appraisalAgencyLevels,
  appraisalDestinations,
  appraisalObjects,
  appraisalReviewers,
} from "../src/data/appraisal.js";

const locales = ["zh-Hant", "ja", "en"];
const failures = [];

function requireLocalized(value, path) {
  for (const locale of locales) {
    if (typeof value?.[locale] !== "string" || !value[locale].trim()) {
      failures.push(`${path}.${locale} is missing`);
    }
  }
}

function unique(values, label) {
  if (new Set(values).size !== values.length) failures.push(`${label} contains duplicates`);
}

unique(appraisalObjects.map((object) => object.id), "object ids");
unique(appraisalObjects.map((object) => object.code), "object codes");

for (const [id, destination] of Object.entries(appraisalDestinations)) {
  requireLocalized(destination.name, `destination.${id}.name`);
  requireLocalized(destination.note, `destination.${id}.note`);
}
for (const [id, label] of Object.entries(appraisalAgencyLevels)) requireLocalized(label, `agency.${id}`);
for (const [id, reviewer] of Object.entries(appraisalReviewers)) {
  requireLocalized(reviewer.name, `reviewer.${id}.name`);
  requireLocalized(reviewer.role, `reviewer.${id}.role`);
}

for (const object of appraisalObjects) {
  const path = `object.${object.id}`;
  requireLocalized(object.name, `${path}.name`);
  requireLocalized(object.workingTitle, `${path}.workingTitle`);
  requireLocalized(object.arrival, `${path}.arrival`);
  requireLocalized(object.condition, `${path}.condition`);
  if (object.evidence.length !== 3) failures.push(`${path} must contain exactly 3 evidence records`);
  if (object.hypotheses.length !== 3) failures.push(`${path} must contain exactly 3 hypotheses`);
  if (object.tests.length !== 3) failures.push(`${path} must contain exactly 3 non-invasive tests`);
  if (object.uses.length !== 3) failures.push(`${path} must contain exactly 3 proposed uses`);
  unique(object.evidence.map((item) => item.id), `${path} evidence ids`);
  unique(object.hypotheses.map((item) => item.id), `${path} hypothesis ids`);
  unique(object.tests.map((item) => item.id), `${path} test ids`);
  unique(object.uses.map((item) => item.id), `${path} use ids`);
  const intended = object.hypotheses.filter((item) => item.isIntended);
  if (intended.length !== 1) failures.push(`${path} must have exactly one intended-use hypothesis`);
  const hypothesisIds = new Set(object.hypotheses.map((item) => item.id));
  for (const [index, item] of object.evidence.entries()) {
    requireLocalized(item.label, `${path}.evidence.${index}.label`);
    requireLocalized(item.detail, `${path}.evidence.${index}.detail`);
  }
  for (const [index, item] of object.hypotheses.entries()) {
    requireLocalized(item.title, `${path}.hypotheses.${index}.title`);
    requireLocalized(item.claim, `${path}.hypotheses.${index}.claim`);
  }
  for (const [index, item] of object.tests.entries()) {
    requireLocalized(item.title, `${path}.tests.${index}.title`);
    requireLocalized(item.method, `${path}.tests.${index}.method`);
    requireLocalized(item.result, `${path}.tests.${index}.result`);
    if (!item.supports.length) failures.push(`${path}.tests.${index} supports no hypothesis`);
    for (const id of item.supports) {
      if (!hypothesisIds.has(id)) failures.push(`${path}.tests.${index} references unknown hypothesis ${id}`);
    }
  }
  if (intended[0] && object.tests.filter((item) => item.supports.includes(intended[0].id)).length < 2) {
    failures.push(`${path} intended use needs support from at least two tests`);
  }
  for (const [index, item] of object.uses.entries()) {
    requireLocalized(item.title, `${path}.uses.${index}.title`);
    requireLocalized(item.note, `${path}.uses.${index}.note`);
  }
  requireLocalized(object.truth.intended, `${path}.truth.intended`);
  requireLocalized(object.truth.operation, `${path}.truth.operation`);
  requireLocalized(object.truth.caution, `${path}.truth.caution`);
  for (const reviewerId of Object.keys(appraisalReviewers)) {
    requireLocalized(object.panel[reviewerId], `${path}.panel.${reviewerId}`);
  }
}

if (failures.length) {
  console.error(`Drift-object appraisal data invalid:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Drift-object appraisal valid: ${appraisalObjects.length} objects, `
    + `${appraisalObjects.length * 3} evidence records, ${appraisalObjects.length * 3} hypotheses, `
    + `${appraisalObjects.length * 3} non-invasive tests, and 4 disagreeing reviewers.`,
);
