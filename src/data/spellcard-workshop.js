import { text as catalogText } from "../generated/i18n/data/spellcard-workshop.js";

export const spellPatterns = [
  {
    id: "star-orbit",
    glyph: "星",
    kind: "orbit",
    name: catalogText("spellPatterns.star-orbit.name"),
    premise: catalogText("spellPatterns.star-orbit.premise"),
  },
  {
    id: "amulet-fan",
    glyph: "札",
    kind: "fan",
    name: catalogText("spellPatterns.amulet-fan.name"),
    premise: catalogText("spellPatterns.amulet-fan.premise"),
  },
  {
    id: "frozen-lattice",
    glyph: "凍",
    kind: "lattice",
    name: catalogText("spellPatterns.frozen-lattice.name"),
    premise: catalogText("spellPatterns.frozen-lattice.premise"),
  },
  {
    id: "wind-corridor",
    glyph: "風",
    kind: "wave",
    name: catalogText("spellPatterns.wind-corridor.name"),
    premise: catalogText("spellPatterns.wind-corridor.premise"),
  },
  {
    id: "boundary-fold",
    glyph: "境",
    kind: "fold",
    name: catalogText("spellPatterns.boundary-fold.name"),
    premise: catalogText("spellPatterns.boundary-fold.premise"),
  },
];

export const spellVenues = [
  {
    id: "hakurei-yard",
    name: catalogText("spellVenues.hakurei-yard.name"),
    note: catalogText("spellVenues.hakurei-yard.note"),
    modifiers: { corridor: 0, workload: 0, fatigue: 0, readability: 1 },
  },
  {
    id: "misty-lake-bank",
    name: catalogText("spellVenues.misty-lake-bank.name"),
    note: catalogText("spellVenues.misty-lake-bank.note"),
    modifiers: { corridor: -3, workload: 1, fatigue: 1, readability: -1 },
  },
  {
    id: "boundary-court",
    name: catalogText("spellVenues.boundary-court.name"),
    note: catalogText("spellVenues.boundary-court.note"),
    modifiers: { corridor: -1, workload: 1, fatigue: 0, readability: 0 },
  },
  {
    id: "bamboo-clearing",
    name: catalogText("spellVenues.bamboo-clearing.name"),
    note: catalogText("spellVenues.bamboo-clearing.note"),
    modifiers: { corridor: -2, workload: 0, fatigue: -1, readability: -1 },
  },
];

export const spellCues = [
  {
    id: "ring-preview",
    name: catalogText("spellCues.ring-preview.name"),
    note: catalogText("spellCues.ring-preview.note"),
    clarity: 3,
    flash: 0,
  },
  {
    id: "color-pulse",
    name: catalogText("spellCues.color-pulse.name"),
    note: catalogText("spellCues.color-pulse.note"),
    clarity: 2,
    flash: 2,
  },
  {
    id: "freeze-trace",
    name: catalogText("spellCues.freeze-trace.name"),
    note: catalogText("spellCues.freeze-trace.note"),
    clarity: 2,
    flash: 1,
  },
  {
    id: "declaration-only",
    name: catalogText("spellCues.declaration-only.name"),
    note: catalogText("spellCues.declaration-only.note"),
    clarity: 0,
    flash: 0,
  },
];

export const spellSounds = [
  {
    id: "quiet",
    name: catalogText("spellSounds.quiet.name"),
    note: catalogText("spellSounds.quiet.note"),
    pressure: 0,
  },
  {
    id: "wood-chime",
    name: catalogText("spellSounds.wood-chime.name"),
    note: catalogText("spellSounds.wood-chime.note"),
    pressure: 1,
  },
  {
    id: "temple-bell",
    name: catalogText("spellSounds.temple-bell.name"),
    note: catalogText("spellSounds.temple-bell.note"),
    pressure: 2,
  },
  {
    id: "kappa-metal",
    name: catalogText("spellSounds.kappa-metal.name"),
    note: catalogText("spellSounds.kappa-metal.note"),
    pressure: 4,
  },
];

export const spellReviewers = {
  reimu: {
    glyph: "規",
    name: catalogText("spellReviewers.reimu.name"),
    role: catalogText("spellReviewers.reimu.role"),
    responses: {
      approve: catalogText("spellReviewers.reimu.responses.approve"),
      caution: catalogText("spellReviewers.reimu.responses.caution"),
      object: catalogText("spellReviewers.reimu.responses.object"),
    },
  },
  marisa: {
    glyph: "華",
    name: catalogText("spellReviewers.marisa.name"),
    role: catalogText("spellReviewers.marisa.role"),
    responses: {
      approve: catalogText("spellReviewers.marisa.responses.approve"),
      caution: catalogText("spellReviewers.marisa.responses.caution"),
      object: catalogText("spellReviewers.marisa.responses.object"),
    },
  },
  aya: {
    glyph: "聞",
    name: catalogText("spellReviewers.aya.name"),
    role: catalogText("spellReviewers.aya.role"),
    responses: {
      approve: catalogText("spellReviewers.aya.responses.approve"),
      caution: catalogText("spellReviewers.aya.responses.caution"),
      object: catalogText("spellReviewers.aya.responses.object"),
    },
  },
  nitori: {
    glyph: "機",
    name: catalogText("spellReviewers.nitori.name"),
    role: catalogText("spellReviewers.nitori.role"),
    responses: {
      approve: catalogText("spellReviewers.nitori.responses.approve"),
      caution: catalogText("spellReviewers.nitori.responses.caution"),
      object: catalogText("spellReviewers.nitori.responses.object"),
    },
  },
  eirin: {
    glyph: "診",
    name: catalogText("spellReviewers.eirin.name"),
    role: catalogText("spellReviewers.eirin.role"),
    responses: {
      approve: catalogText("spellReviewers.eirin.responses.approve"),
      caution: catalogText("spellReviewers.eirin.responses.caution"),
      object: catalogText("spellReviewers.eirin.responses.object"),
    },
  },
  fairies: {
    glyph: "唱",
    name: catalogText("spellReviewers.fairies.name"),
    role: catalogText("spellReviewers.fairies.role"),
    responses: {
      approve: catalogText("spellReviewers.fairies.responses.approve"),
      caution: catalogText("spellReviewers.fairies.responses.caution"),
      object: catalogText("spellReviewers.fairies.responses.object"),
    },
  },
};

const option = (id, label, note, effects = {}) => ({ id, label, note, effects });

export const spellDefenceRounds = {
  rule: {
    examinerId: "reimu",
    role: catalogText("spellDefenceRounds.rule.role"),
    prompt: catalogText("spellDefenceRounds.rule.prompt"),
    choices: [
      option("reserve", catalogText("spellDefenceRounds.rule.choices.0.reserve.1"), catalogText("spellDefenceRounds.rule.choices.0.reserve.2"), { rule: 3, care: 2, spectacle: -1 }),
      option("adaptive", catalogText("spellDefenceRounds.rule.choices.1.adaptive.1"), catalogText("spellDefenceRounds.rule.choices.1.adaptive.2"), { rule: 2, care: 1, spectacle: 1, method: 1 }),
      option("advanced-only", catalogText("spellDefenceRounds.rule.choices.2.advanced-only.1"), catalogText("spellDefenceRounds.rule.choices.2.advanced-only.2"), { rule: 1, care: 1, scope: 2 }),
      option("resolve-later", catalogText("spellDefenceRounds.rule.choices.3.resolve-later.1"), catalogText("spellDefenceRounds.rule.choices.3.resolve-later.2"), { spectacle: 2, rule: -4, care: -3 }),
    ],
  },
  reproducibility: {
    examinerId: "marisa",
    role: catalogText("spellDefenceRounds.reproducibility.role"),
    prompt: catalogText("spellDefenceRounds.reproducibility.prompt"),
    choices: [
      option("publish-seed", catalogText("spellDefenceRounds.reproducibility.choices.0.publish-seed.1"), catalogText("spellDefenceRounds.reproducibility.choices.0.publish-seed.2"), { method: 3, repro: 4, spectacle: 0 }),
      option("publish-rig", catalogText("spellDefenceRounds.reproducibility.choices.1.publish-rig.1"), catalogText("spellDefenceRounds.reproducibility.choices.1.publish-rig.2"), { method: 2, repro: 1, spectacle: 1 }),
      option("best-video", catalogText("spellDefenceRounds.reproducibility.choices.2.best-video.1"), catalogText("spellDefenceRounds.reproducibility.choices.2.best-video.2"), { spectacle: 3, repro: -3, method: -2 }),
      option("trade-secret", catalogText("spellDefenceRounds.reproducibility.choices.3.trade-secret.1"), catalogText("spellDefenceRounds.reproducibility.choices.3.trade-secret.2"), { scope: 1, repro: -4, method: -2 }),
    ],
  },
  aya: {
    examinerId: "aya",
    role: catalogText("spellDefenceRounds.aya.role"),
    prompt: catalogText("spellDefenceRounds.aya.prompt"),
    choices: [
      option("audience-map", catalogText("spellDefenceRounds.aya.choices.0.audience-map.1"), catalogText("spellDefenceRounds.aya.choices.0.audience-map.2"), { readability: 3, method: 2 }),
      option("blind-coders", catalogText("spellDefenceRounds.aya.choices.1.blind-coders.1"), catalogText("spellDefenceRounds.aya.choices.1.blind-coders.2"), { readability: 2, method: 4 }),
      option("better-headline", catalogText("spellDefenceRounds.aya.choices.2.better-headline.1"), catalogText("spellDefenceRounds.aya.choices.2.better-headline.2"), { spectacle: 2, readability: -2 }),
    ],
  },
  nitori: {
    examinerId: "nitori",
    role: catalogText("spellDefenceRounds.nitori.role"),
    prompt: catalogText("spellDefenceRounds.nitori.prompt"),
    choices: [
      option("cap-budget", catalogText("spellDefenceRounds.nitori.choices.0.cap-budget.1"), catalogText("spellDefenceRounds.nitori.choices.0.cap-budget.2"), { care: 2, method: 3, stability: 4, spectacle: -1 }),
      option("lower-effects", catalogText("spellDefenceRounds.nitori.choices.1.lower-effects.1"), catalogText("spellDefenceRounds.nitori.choices.1.lower-effects.2"), { care: 2, stability: 3, readability: 1 }),
      option("more-tape", catalogText("spellDefenceRounds.nitori.choices.2.more-tape.1"), catalogText("spellDefenceRounds.nitori.choices.2.more-tape.2"), { stability: -3, care: -2, spectacle: 1 }),
    ],
  },
  eirin: {
    examinerId: "eirin",
    role: catalogText("spellDefenceRounds.eirin.role"),
    prompt: catalogText("spellDefenceRounds.eirin.prompt"),
    choices: [
      option("closed-simulation", catalogText("spellDefenceRounds.eirin.choices.0.closed-simulation.1"), catalogText("spellDefenceRounds.eirin.choices.0.closed-simulation.2"), { care: 5, method: 2, scope: 2 }),
      option("short-session", catalogText("spellDefenceRounds.eirin.choices.1.short-session.1"), catalogText("spellDefenceRounds.eirin.choices.1.short-session.2"), { care: 4, method: 3, spectacle: -1 }),
      option("stronger-warning", catalogText("spellDefenceRounds.eirin.choices.2.stronger-warning.1"), catalogText("spellDefenceRounds.eirin.choices.2.stronger-warning.2"), { care: -4, spectacle: 1 }),
    ],
  },
  fairies: {
    examinerId: "fairies",
    role: catalogText("spellDefenceRounds.fairies.role"),
    prompt: catalogText("spellDefenceRounds.fairies.prompt"),
    choices: [
      option("shared-count", catalogText("spellDefenceRounds.fairies.choices.0.shared-count.1"), catalogText("spellDefenceRounds.fairies.choices.0.shared-count.2"), { care: 3, method: 2, play: 2 }),
      option("wood-cue", catalogText("spellDefenceRounds.fairies.choices.1.wood-cue.1"), catalogText("spellDefenceRounds.fairies.choices.1.wood-cue.2"), { care: 2, play: 4, reproducibility: 1 }),
      option("sing-louder", catalogText("spellDefenceRounds.fairies.choices.2.sing-louder.1"), catalogText("spellDefenceRounds.fairies.choices.2.sing-louder.2"), { care: -3, spectacle: 2 }),
    ],
  },
};

export function spellPattern(id) {
  return spellPatterns.find((item) => item.id === id);
}

export function spellVenue(id) {
  return spellVenues.find((item) => item.id === id);
}

export function spellCue(id) {
  return spellCues.find((item) => item.id === id);
}

export function spellSound(id) {
  return spellSounds.find((item) => item.id === id);
}
