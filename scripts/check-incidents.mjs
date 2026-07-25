import {
  evidenceKinds,
  incidentCases,
  incidentSeverity,
} from "../src/data/incidents.js";

const locales = ["zh-Hant", "ja", "en"];
const errors = [];
const ids = new Set();
const codes = new Set();
const effectKeys = new Set(["confound", "drift", "missing", "version"]);

function translated(value, path) {
  for (const locale of locales) {
    if (!value?.[locale]?.trim()) errors.push(`${path}.${locale} is empty`);
  }
}

if (incidentCases.length < 5) errors.push(`expected at least 5 incident cases, found ${incidentCases.length}`);

for (const incident of incidentCases) {
  if (!incident.id || ids.has(incident.id)) errors.push(`duplicate or missing case id: ${incident.id}`);
  if (!incident.code || codes.has(incident.code)) errors.push(`duplicate or missing case code: ${incident.code}`);
  ids.add(incident.id);
  codes.add(incident.code);
  if (!incidentSeverity[incident.severity]) errors.push(`${incident.id} has unknown severity ${incident.severity}`);
  for (const field of ["location", "title", "lede", "dispatch", "affected", "signal", "unit"]) {
    translated(incident[field], `${incident.id}.${field}`);
  }
  if (incident.hypotheses.length !== 3) errors.push(`${incident.id} must have 3 hypotheses`);
  if (incident.evidence.length !== 4) errors.push(`${incident.id} must have 4 evidence items`);
  if (incident.testimony.length !== 3) errors.push(`${incident.id} must have 3 testimonies`);
  if (incident.actions.length !== 4) errors.push(`${incident.id} must have 4 reversible actions`);
  if (incident.reactions.length !== 3) errors.push(`${incident.id} must have 3 BBS reactions`);
  if (!incident.hypotheses.some((item) => item.id === incident.truthHypothesis)) {
    errors.push(`${incident.id} truthHypothesis is not in its hypotheses`);
  }
  for (const [field, values] of [
    ["hypotheses", incident.hypotheses],
    ["evidence", incident.evidence],
    ["testimony", incident.testimony],
    ["actions", incident.actions],
  ]) {
    const itemIds = new Set();
    for (const item of values) {
      if (!item.id || itemIds.has(item.id)) errors.push(`${incident.id}.${field} has duplicate or missing id ${item.id}`);
      itemIds.add(item.id);
    }
  }
  incident.hypotheses.forEach((item) => {
    translated(item.title, `${incident.id}.hypotheses.${item.id}.title`);
    translated(item.rationale, `${incident.id}.hypotheses.${item.id}.rationale`);
  });
  incident.evidence.forEach((item) => {
    if (!evidenceKinds[item.kind]) errors.push(`${incident.id}.${item.id} has unknown evidence kind ${item.kind}`);
    if (!Number.isInteger(item.reliability) || item.reliability < 1 || item.reliability > 100) {
      errors.push(`${incident.id}.${item.id} has invalid reliability`);
    }
    for (const field of ["title", "body", "source"]) translated(item[field], `${incident.id}.evidence.${item.id}.${field}`);
  });
  incident.testimony.forEach((item) => {
    for (const field of ["speaker", "role", "statement", "tension"]) translated(item[field], `${incident.id}.testimony.${item.id}.${field}`);
  });
  incident.actions.forEach((item) => {
    if (!item.reversible) errors.push(`${incident.id}.${item.id} must be reversible`);
    for (const key of Object.keys(item.effects || {})) {
      if (!effectKeys.has(key)) errors.push(`${incident.id}.${item.id} has unknown effect ${key}`);
    }
    for (const field of ["title", "body", "caution"]) translated(item[field], `${incident.id}.actions.${item.id}.${field}`);
  });
  incident.reactions.forEach((reaction, index) => {
    if (!["course", "club", "market", "notice"].includes(reaction.category)) {
      errors.push(`${incident.id}.reactions.${index} has unknown BBS category`);
    }
    for (const field of ["author", "title", "body"]) translated(reaction[field], `${incident.id}.reactions.${index}.${field}`);
  });
  for (const field of ["baseline", "confound", "drift", "missing", "version"]) {
    if (!Number.isInteger(incident.simulation[field]) || incident.simulation[field] < 0) {
      errors.push(`${incident.id}.simulation.${field} is invalid`);
    }
  }
}

for (const [id, label] of Object.entries(incidentSeverity)) translated(label, `incidentSeverity.${id}`);
for (const [id, label] of Object.entries(evidenceKinds)) translated(label, `evidenceKinds.${id}`);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Incident data valid: ${incidentCases.length} cases, ${incidentCases.length * 4} evidence items, ${incidentCases.length * 3} linked BBS reactions.`);
