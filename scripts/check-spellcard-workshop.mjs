import {
  spellCues,
  spellDefenceRounds,
  spellPatterns,
  spellReviewers,
  spellSounds,
  spellVenues,
} from "../src/data/spellcard-workshop.js";

const locales = ["zh-Hant", "ja", "en"];
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function localized(value, label) {
  check(value && typeof value === "object", `${label} is not a localized record.`);
  locales.forEach((locale) => {
    check(typeof value?.[locale] === "string" && value[locale].trim(), `${label} is missing ${locale}.`);
  });
}

function uniqueIds(records, label) {
  const ids = records.map((record) => record?.id);
  check(ids.every(Boolean), `${label} contains a record without an id.`);
  check(new Set(ids).size === ids.length, `${label} contains duplicate ids.`);
}

check(spellPatterns.length >= 5, "The design bench needs at least five pattern skeletons.");
check(spellVenues.length >= 4, "The design bench needs at least four test venues.");
check(spellCues.length >= 4, "The design bench needs at least four visual cues.");
check(spellSounds.length >= 4, "The design bench needs at least four sound cues.");

for (const [label, records] of [
  ["patterns", spellPatterns],
  ["venues", spellVenues],
  ["visual cues", spellCues],
  ["sound cues", spellSounds],
]) {
  uniqueIds(records, label);
  records.forEach((record) => {
    localized(record.name, `${label}.${record.id}.name`);
    localized(record.premise || record.note, `${label}.${record.id}.description`);
  });
}

const reviewerIds = Object.keys(spellReviewers);
check(reviewerIds.length === 6, "The workshop must preserve six independent reviewers.");
for (const [id, reviewer] of Object.entries(spellReviewers)) {
  localized(reviewer.name, `reviewers.${id}.name`);
  localized(reviewer.role, `reviewers.${id}.role`);
  for (const stance of ["approve", "caution", "object"]) {
    localized(reviewer.responses?.[stance], `reviewers.${id}.responses.${stance}`);
  }
}

const requiredRounds = ["rule", "reproducibility", "aya", "nitori", "eirin", "fairies"];
requiredRounds.forEach((id) => check(spellDefenceRounds[id], `Missing public-defence round: ${id}.`));
for (const [id, round] of Object.entries(spellDefenceRounds)) {
  check(reviewerIds.includes(round.examinerId), `${id} names an unknown examiner.`);
  localized(round.role, `defence.${id}.role`);
  localized(round.prompt, `defence.${id}.prompt`);
  check(Array.isArray(round.choices) && round.choices.length >= 3, `${id} needs at least three real choices.`);
  uniqueIds(round.choices || [], `defence.${id}.choices`);
  for (const choice of round.choices || []) {
    localized(choice.label, `defence.${id}.${choice.id}.label`);
    localized(choice.note, `defence.${id}.${choice.id}.note`);
  }
}

if (failures.length) {
  console.error(`Spell-card workshop check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Spell-card workshop ready: ${spellPatterns.length} patterns, ${reviewerIds.length} non-averaged reviewers, and ${Object.keys(spellDefenceRounds).length} defence rounds.`,
);
