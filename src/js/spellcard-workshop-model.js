import { text as catalogText, trees as catalogTrees } from "../generated/i18n/ui/spellcard-workshop-model.js";
import {
  spellCue,
  spellCues,
  spellDefenceRounds,
  spellPattern,
  spellPatterns,
  spellReviewers,
  spellSound,
  spellSounds,
  spellVenue,
  spellVenues,
} from "../data/spellcard-workshop.js";
import { liveCampusSnapshot } from "../data/live-campus.js";

const DRAFT_KEY = "tu:spellcards:draft";
const DESIGN_KEY = "tu:spellcards:designs";
const DEFENCE_KEY = "tu:spellcards:defences";
const MAX_RECORDS = 60;


export const spellRulings = {
  "public-demo": catalogText("spellRulings.public-demo"),
  conditional: catalogText("spellRulings.conditional"),
  "research-only": catalogText("spellRulings.research-only"),
  revise: catalogText("spellRulings.revise"),
};

export const spellConditions = {
  corridor: catalogText("spellConditions.corridor"),
  version: catalogText("spellConditions.version"),
  audience: catalogText("spellConditions.audience"),
  performance: catalogText("spellConditions.performance"),
  care: catalogText("spellConditions.care"),
  simulation: catalogText("spellConditions.simulation"),
  sharedSpace: catalogText("spellConditions.sharedSpace"),
};

function readJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function text(value, maximum = 800) {
  return String(value || "").trim().slice(0, maximum);
}

function number(value, minimum, maximum, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

function dateValue(value, fallback = new Date().toISOString()) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function makeId(prefix, now = new Date()) {
  const stamp = now.toISOString().replace(/\D/g, "").slice(2, 17);
  return `${prefix}-${stamp}`;
}

function emit(type, detail = {}) {
  window.dispatchEvent(new CustomEvent("tu:spellcardchange", { detail: { type, ...detail } }));
}

function knownId(value, records, fallback) {
  return records.some((record) => record.id === value) ? value : fallback;
}

export function defaultSpellcardDraft() {
  return {
    schema: 1,
    spellName: "",
    patternId: "star-orbit",
    venueId: "hakurei-yard",
    cueId: "ring-preview",
    soundId: "wood-chime",
    speed: 3,
    density: 3,
    symmetry: 3,
    randomness: 1,
    declarationDelay: 1.2,
    corridorWidth: 32,
    changeFrequency: 2,
    duration: 42,
    flashLevel: 1,
    seedLock: true,
    stopSignal: true,
    audienceBriefing: false,
    liveConditions: true,
    fieldNote: "",
    revisionOf: null,
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeSpellcardDraft(value = {}) {
  const fallback = defaultSpellcardDraft();
  return {
    schema: 1,
    spellName: text(value.spellName, 80),
    patternId: knownId(value.patternId, spellPatterns, fallback.patternId),
    venueId: knownId(value.venueId, spellVenues, fallback.venueId),
    cueId: knownId(value.cueId, spellCues, fallback.cueId),
    soundId: knownId(value.soundId, spellSounds, fallback.soundId),
    speed: number(value.speed, 1, 5, fallback.speed),
    density: number(value.density, 1, 5, fallback.density),
    symmetry: number(value.symmetry, 0, 4, fallback.symmetry),
    randomness: number(value.randomness, 0, 4, fallback.randomness),
    declarationDelay: number(value.declarationDelay, 0.4, 3, fallback.declarationDelay),
    corridorWidth: number(value.corridorWidth, 12, 56, fallback.corridorWidth),
    changeFrequency: number(value.changeFrequency, 1, 5, fallback.changeFrequency),
    duration: number(value.duration, 15, 90, fallback.duration),
    flashLevel: number(value.flashLevel, 0, 3, fallback.flashLevel),
    seedLock: value.seedLock !== false,
    stopSignal: value.stopSignal !== false,
    audienceBriefing: Boolean(value.audienceBriefing),
    liveConditions: value.liveConditions !== false,
    fieldNote: text(value.fieldNote, 800),
    revisionOf: text(value.revisionOf, 100) || null,
    updatedAt: dateValue(value.updatedAt),
  };
}

export function spellcardDraft() {
  return normalizeSpellcardDraft(readJson(DRAFT_KEY, {}));
}

export function saveSpellcardDraft(patch = {}) {
  const next = normalizeSpellcardDraft({
    ...spellcardDraft(),
    ...patch,
    updatedAt: new Date().toISOString(),
  });
  writeJson(DRAFT_KEY, next);
  emit("draft", { patternId: next.patternId });
  return next;
}

export function clearSpellcardDraft() {
  const next = defaultSpellcardDraft();
  writeJson(DRAFT_KEY, next);
  emit("draft-cleared");
  return next;
}

export function workshopConditions(locale = "zh-Hant", now = new Date()) {
  const state = liveCampusSnapshot(now);
  const ids = new Set(state.activeEvents.map((event) => event.id));
  let modifier = { corridor: 0, workload: 0, fatigue: 0, readability: 0 };
  let notice = catalogText("notice");
  if (state.phase === 4) {
    modifier = { corridor: -2, workload: 0, fatigue: 2, readability: -1 };
    notice = catalogText("workshopConditions");
  }
  if (ids.has("kappaTape")) {
    modifier = { corridor: -1, workload: -1, fatigue: 0, readability: 0 };
    notice = catalogText("workshopConditions.2");
  } else if (ids.has("bambooMist")) {
    modifier = { corridor: -3, workload: 1, fatigue: 1, readability: -2 };
    notice = catalogText("workshopConditions.3");
  } else if (ids.has("bookFlock")) {
    modifier = { corridor: -1, workload: 2, fatigue: 0, readability: -1 };
    notice = catalogText("workshopConditions.4");
  }
  return {
    dayKey: state.dayKey,
    phase: state.phase,
    shift: state.band,
    modifier,
    notice: notice[locale] || notice["zh-Hant"],
  };
}

function review(id, stance, severity) {
  return { reviewerId: id, stance, severity };
}

export function assessSpellcard(value = {}, now = new Date()) {
  const draft = normalizeSpellcardDraft(value);
  const pattern = spellPattern(draft.patternId);
  const venue = spellVenue(draft.venueId);
  const cue = spellCue(draft.cueId);
  const sound = spellSound(draft.soundId);
  const live = workshopConditions("zh-Hant", now);
  const liveModifier = draft.liveConditions ? live.modifier : { corridor: 0, workload: 0, fatigue: 0, readability: 0 };
  const effectiveCorridor = Math.max(4, Math.round(
    draft.corridorWidth
      + venue.modifiers.corridor
      + liveModifier.corridor
      - draft.randomness * 1.4
      - Math.max(0, draft.changeFrequency - 2) * 1.1,
  ));
  const projectileBudget = Math.min(72, Math.round(
    8 + draft.density * 9 + draft.changeFrequency * 3 + draft.randomness * 2,
  ));
  const workload = Math.round(
    projectileBudget * (0.55 + draft.speed * 0.09)
      + venue.modifiers.workload * 4
      + liveModifier.workload * 4
      + (draft.seedLock ? -4 : 5),
  );
  const readability = Math.round(
    draft.declarationDelay * 2
      + cue.clarity * 2
      + draft.symmetry
      + venue.modifiers.readability
      + liveModifier.readability
      + Number(draft.audienceBriefing) * 2
      - draft.randomness * 1.6
      - draft.changeFrequency * 0.8,
  );
  const expression = Math.round(
    draft.speed
      + draft.density
      + draft.changeFrequency
      + draft.randomness * 0.7
      + (pattern.kind === "fold" ? 2 : 0),
  );
  const reproducibility = Math.round(
    draft.symmetry
      + Number(draft.seedLock) * 5
      + Math.max(0, 3 - draft.randomness)
      - Math.max(0, draft.changeFrequency - 3),
  );
  const fatigue = Math.round(
    draft.duration / 9
      + draft.density
      + draft.flashLevel * 2
      + cue.flash
      + sound.pressure
      + venue.modifiers.fatigue
      + liveModifier.fatigue
      - Number(draft.stopSignal) * 2,
  );
  const reviews = [
    effectiveCorridor < 17 || draft.declarationDelay < 0.7 || !draft.stopSignal
      ? review("reimu", "object", 3)
      : effectiveCorridor < 27 || draft.declarationDelay < 1
        ? review("reimu", "caution", 2)
        : review("reimu", "approve", 0),
    expression < 8
      ? review("marisa", "object", 3)
      : reproducibility < 7
        ? review("marisa", "caution", 2)
        : review("marisa", "approve", 0),
    readability < 3
      ? review("aya", "object", 3)
      : readability < 8
        ? review("aya", "caution", 2)
        : review("aya", "approve", 0),
    workload > 68 || projectileBudget >= 70
      ? review("nitori", "object", 3)
      : workload > 54 || projectileBudget >= 60
        ? review("nitori", "caution", 2)
        : review("nitori", "approve", 0),
    fatigue > 18 || draft.flashLevel + cue.flash >= 5 || !draft.stopSignal
      ? review("eirin", "object", 4)
      : fatigue > 13 || draft.duration > 65
        ? review("eirin", "caution", 2)
        : review("eirin", "approve", 0),
    sound.pressure >= 4 || sound.pressure + draft.changeFrequency >= 8
      ? review("fairies", "object", 3)
      : sound.pressure >= 2 || draft.duration > 60
        ? review("fairies", "caution", 2)
        : review("fairies", "approve", 0),
  ];
  return {
    draft,
    pattern,
    venue,
    cue,
    sound,
    live,
    metrics: {
      effectiveCorridor,
      projectileBudget,
      workload,
      readability,
      expression,
      reproducibility,
      fatigue,
    },
    reviews,
  };
}

function normalizeReview(value = {}) {
  return Object.hasOwn(spellReviewers, value.reviewerId) && ["approve", "caution", "object"].includes(value.stance)
    ? { reviewerId: value.reviewerId, stance: value.stance, severity: number(value.severity, 0, 5, 0) }
    : null;
}

function normalizeDesign(value = {}) {
  if (!value.id) return null;
  const draft = normalizeSpellcardDraft(value.draft || value);
  return {
    schema: Number(value.schema) || 1,
    id: text(value.id, 100),
    createdAt: dateValue(value.createdAt),
    revisionOf: text(value.revisionOf || draft.revisionOf, 100) || null,
    draft,
    metrics: value.metrics && typeof value.metrics === "object"
      ? Object.fromEntries(Object.entries(value.metrics).map(([key, item]) => [key, Number(item) || 0]))
      : assessSpellcard(draft).metrics,
    reviews: (Array.isArray(value.reviews) ? value.reviews : assessSpellcard(draft).reviews).map(normalizeReview).filter(Boolean),
    live: value.live && typeof value.live === "object" ? value.live : null,
  };
}

export function spellcardDesigns() {
  const records = readJson(DESIGN_KEY, []);
  return (Array.isArray(records) ? records : []).map(normalizeDesign).filter(Boolean);
}

export function spellcardDesign(id) {
  return spellcardDesigns().find((record) => record.id === id) || null;
}

export function saveSpellcardDesign(value = spellcardDraft(), now = new Date()) {
  const assessment = assessSpellcard(value, now);
  if (assessment.draft.spellName.length < 2) return { error: "name", assessment };
  const record = normalizeDesign({
    schema: 1,
    id: makeId("SC-D", now),
    createdAt: now.toISOString(),
    revisionOf: assessment.draft.revisionOf,
    draft: assessment.draft,
    metrics: assessment.metrics,
    reviews: assessment.reviews,
    live: {
      dayKey: assessment.live.dayKey,
      phase: assessment.live.phase,
      modifier: assessment.draft.liveConditions ? assessment.live.modifier : null,
    },
  });
  const records = spellcardDesigns();
  records.push(record);
  writeJson(DESIGN_KEY, records.slice(-MAX_RECORDS));
  writeJson(DRAFT_KEY, normalizeSpellcardDraft({ ...record.draft, revisionOf: record.id }));
  emit("design-saved", { designId: record.id });
  return { record, assessment };
}

export function reviseSpellcardDesign(id) {
  const design = spellcardDesign(id);
  if (!design) return null;
  const draft = normalizeSpellcardDraft({ ...design.draft, revisionOf: design.id, updatedAt: new Date().toISOString() });
  writeJson(DRAFT_KEY, draft);
  emit("design-revised", { designId: id });
  return draft;
}

function externalReviewer(design) {
  return design.reviews
    .filter((item) => !["reimu", "marisa"].includes(item.reviewerId))
    .sort((left, right) => right.severity - left.severity
      || ["eirin", "nitori", "aya", "fairies"].indexOf(left.reviewerId)
        - ["eirin", "nitori", "aya", "fairies"].indexOf(right.reviewerId))[0]?.reviewerId || "aya";
}

export function spellcardDefencePanel(design) {
  if (!design) return [];
  return ["reimu", "marisa", externalReviewer(design)];
}

export function spellcardDefenceQuestions(design) {
  const panel = spellcardDefencePanel(design);
  return [
    spellDefenceRounds.rule,
    spellDefenceRounds.reproducibility,
    spellDefenceRounds[panel[2]],
  ];
}

function optionFor(round, answerId) {
  return round.choices.find((choice) => choice.id === answerId);
}

function normalizeDefence(value = {}) {
  if (!value.id || !value.designId || !spellcardDesign(value.designId)) return null;
  const panel = Array.isArray(value.panel) && value.panel.every((id) => spellReviewers[id])
    ? value.panel.slice(0, 3)
    : spellcardDefencePanel(spellcardDesign(value.designId));
  return {
    schema: Number(value.schema) || 1,
    id: text(value.id, 100),
    designId: text(value.designId, 100),
    createdAt: dateValue(value.createdAt),
    panel,
    answers: value.answers && typeof value.answers === "object" ? value.answers : {},
    votes: Array.isArray(value.votes) ? value.votes.slice(0, 3) : [],
    ruling: Object.hasOwn(spellRulings, value.ruling) ? value.ruling : "revise",
    conditionIds: [...new Set(Array.isArray(value.conditionIds)
      ? value.conditionIds.filter((id) => Object.hasOwn(spellConditions, id))
      : [])],
    dissentReviewerId: spellReviewers[value.dissentReviewerId] ? value.dissentReviewerId : null,
  };
}

export function spellcardDefences() {
  const records = readJson(DEFENCE_KEY, []);
  return (Array.isArray(records) ? records : []).map(normalizeDefence).filter(Boolean);
}

export function spellcardDefence(id) {
  return spellcardDefences().find((record) => record.id === id) || null;
}

export function defenceForDesign(designId) {
  return spellcardDefences().filter((record) => record.designId === designId).at(-1) || null;
}

function vote(examinerId, answerId) {
  if (examinerId === "reimu") {
    if (["reserve", "adaptive"].includes(answerId)) return "approve";
    if (answerId === "advanced-only") return "conditional";
    return "reject";
  }
  if (examinerId === "marisa") {
    if (answerId === "publish-seed") return "approve";
    if (answerId === "publish-rig") return "conditional";
    return "reject";
  }
  const good = {
    aya: ["audience-map", "blind-coders"],
    nitori: ["cap-budget", "lower-effects"],
    eirin: ["closed-simulation", "short-session"],
    fairies: ["shared-count", "wood-cue"],
  };
  return good[examinerId]?.includes(answerId) ? "approve" : "reject";
}

function conditionsFor(design, panel, answers) {
  const result = new Set();
  const byReviewer = Object.fromEntries(design.reviews.map((item) => [item.reviewerId, item]));
  if (byReviewer.reimu?.stance !== "approve" || answers.rule !== "reserve") result.add("corridor");
  if (byReviewer.marisa?.stance !== "approve" || answers.reproducibility !== "publish-seed") result.add("version");
  if (byReviewer.aya?.stance !== "approve") result.add("audience");
  if (byReviewer.nitori?.stance !== "approve") result.add("performance");
  if (byReviewer.eirin?.stance !== "approve") result.add("care");
  if (byReviewer.fairies?.stance !== "approve") result.add("sharedSpace");
  if (panel[2] === "eirin" && answers.external === "closed-simulation") result.add("simulation");
  return [...result];
}

export function completeSpellcardDefence(designId, answers = {}, now = new Date()) {
  const design = spellcardDesign(designId);
  if (!design) return { error: "design" };
  const panel = spellcardDefencePanel(design);
  const rounds = spellcardDefenceQuestions(design);
  const normalizedAnswers = {
    rule: text(answers.rule, 80),
    reproducibility: text(answers.reproducibility, 80),
    external: text(answers.external, 80),
  };
  if (
    !optionFor(rounds[0], normalizedAnswers.rule)
    || !optionFor(rounds[1], normalizedAnswers.reproducibility)
    || !optionFor(rounds[2], normalizedAnswers.external)
  ) return { error: "incomplete", design, rounds };
  const votes = [
    { reviewerId: panel[0], vote: vote(panel[0], normalizedAnswers.rule) },
    { reviewerId: panel[1], vote: vote(panel[1], normalizedAnswers.reproducibility) },
    { reviewerId: panel[2], vote: vote(panel[2], normalizedAnswers.external) },
  ];
  const voteValue = { approve: 2, conditional: 1, reject: 0 };
  const total = votes.reduce((sum, item) => sum + voteValue[item.vote], 0);
  const medicalClosed = panel[2] === "eirin" && normalizedAnswers.external === "closed-simulation";
  const medicalIgnored = panel[2] === "eirin"
    && design.reviews.find((item) => item.reviewerId === "eirin")?.stance === "object"
    && normalizedAnswers.external === "stronger-warning";
  const ruling = medicalClosed || medicalIgnored
    ? "research-only"
    : total >= 6
      ? "public-demo"
      : total >= 3
        ? "conditional"
        : "revise";
  const dissent = votes.find((item) => (
    ruling === "public-demo" ? item.vote !== "approve"
      : ruling === "revise" ? item.vote === "approve"
        : item.vote === "reject"
  ))?.reviewerId || null;
  const record = normalizeDefence({
    schema: 1,
    id: makeId("SC-VIVA", now),
    designId,
    createdAt: now.toISOString(),
    panel,
    answers: normalizedAnswers,
    votes,
    ruling,
    conditionIds: conditionsFor(design, panel, normalizedAnswers),
    dissentReviewerId: dissent,
  });
  const records = spellcardDefences();
  records.push(record);
  writeJson(DEFENCE_KEY, records.slice(-MAX_RECORDS));
  emit("defence-completed", { designId, defenceId: record.id, ruling });
  return { record, design, rounds };
}

const communityCopy = catalogTrees["communityCopy"];

export function spellcardCommunityPosts(locale = "zh-Hant") {
  const c = communityCopy[locale] || communityCopy["zh-Hant"];
  return spellcardDefences().slice(-6).reverse().flatMap((record, index) => {
    const design = spellcardDesign(record.designId);
    const name = design?.draft.spellName || record.designId;
    const ruling = spellRulings[record.ruling]?.[locale] || spellRulings[record.ruling]?.["zh-Hant"];
    const route = `spellcard-defence-${record.id}`;
    return [
      {
        id: `spellcard-aya-${record.id}`,
        category: "notice",
        author: c.aya,
        title: `${c.headline}：${name}`,
        body: `${ruling}${locale === "en" ? "." : "。"}${record.ruling === "public-demo" ? "" : c.correction}`,
        replies: 12 + index,
        createdAt: record.createdAt,
        generated: true,
        spellcard: true,
        spellcardRoute: route,
      },
      {
        id: `spellcard-panel-${record.id}`,
        category: "course",
        author: c.panel,
        title: `${ruling} · ${name}`,
        body: c.panelBody,
        replies: 7 + record.conditionIds.length,
        createdAt: record.createdAt,
        generated: true,
        spellcard: true,
        spellcardRoute: route,
      },
      {
        id: `spellcard-chorus-${record.id}`,
        category: "club",
        author: c.chorus,
        title: name,
        body: c.chorusBody,
        replies: 9 + index,
        createdAt: record.createdAt,
        generated: true,
        spellcard: true,
        spellcardRoute: route,
      },
    ];
  });
}

export function spellcardStats() {
  return {
    designs: spellcardDesigns().length,
    defences: spellcardDefences().length,
    activeDraft: Boolean(spellcardDraft().spellName || readJson(DRAFT_KEY, null)),
  };
}

export const spellcardStorageKeys = {
  draft: DRAFT_KEY,
  designs: DESIGN_KEY,
  defences: DEFENCE_KEY,
};
