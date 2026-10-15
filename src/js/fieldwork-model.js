import { text as catalogText } from "../generated/i18n/ui/fieldwork-model.js";
import { campusDayKey, campusLunarPhase, campusTimeBand } from "../data/campus-time.js";
import {
  fieldworkComplication,
  fieldworkIncidentKinds,
  fieldworkLocalized,
  fieldworkResearchChoices,
  fieldworkRiskLabels,
  fieldworkSourceKinds,
  fieldworkStation,
  fieldworkStations,
  fieldworkTravelModes,
} from "../data/fieldwork.js";

const DRAFT_KEY = "tu:fieldwork:draft";
const PLACEMENT_KEY = "tu:fieldwork:placements";
const PASSPORT_KEY = "tu:fieldwork:passport";
const MAX_PLACEMENTS = 80;


export const fieldworkStorageKeys = Object.freeze({
  draft: DRAFT_KEY,
  placements: PLACEMENT_KEY,
  passport: PASSPORT_KEY,
});

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function emit(reason, detail = {}) {
  window.dispatchEvent(new CustomEvent("tu:fieldworkchange", {
    detail: { reason, ...detail },
  }));
}

function futureDate(days = 7) {
  const value = new Date();
  value.setDate(value.getDate() + days);
  value.setHours(9, 0, 0, 0);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

function makeId(prefix, now = new Date(), sequence = 1) {
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");
  return `${prefix}-${stamp}-${String(sequence).padStart(2, "0")}`;
}

function validDate(value, fallback = new Date().toISOString()) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function string(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function stringArray(value) {
  return Array.isArray(value) ? value.filter((entry) => typeof entry === "string") : [];
}

export function defaultFieldworkDraft(stationId = "hakurei-shrine") {
  return {
    version: 1,
    stationId: fieldworkStation(stationId)?.id || fieldworkStations[0].id,
    purpose: "",
    departureDate: futureDate(7),
    travelMode: "foot",
    abilityPlan: "none",
    emergencyPlan: "return-bell",
    equipment: [],
    ethicsAcknowledged: false,
    fieldName: "",
  };
}

export function normalizeFieldworkDraft(value, stationId = null) {
  const base = defaultFieldworkDraft(stationId || value?.stationId);
  const station = fieldworkStation(value?.stationId || stationId) || fieldworkStation(base.stationId);
  const equipment = (Array.isArray(value?.equipment) ? value.equipment : [])
    .map((entry) => Number(entry))
    .filter((entry) => Number.isInteger(entry) && entry >= 0 && entry < station.equipment.length);
  return {
    ...base,
    ...(value && typeof value === "object" ? value : {}),
    version: 1,
    stationId: station.id,
    purpose: string(value?.purpose).slice(0, 800),
    departureDate: /^\d{4}-\d{2}-\d{2}$/.test(value?.departureDate || "") ? value.departureDate : base.departureDate,
    travelMode: fieldworkTravelModes[value?.travelMode] ? value.travelMode : base.travelMode,
    abilityPlan: ["none", "declared", "supervised", "sealed"].includes(value?.abilityPlan) ? value.abilityPlan : base.abilityPlan,
    emergencyPlan: ["return-bell", "buddy-rope", "host-escort", "clinic-route"].includes(value?.emergencyPlan)
      ? value.emergencyPlan
      : base.emergencyPlan,
    equipment: [...new Set(equipment)],
    ethicsAcknowledged: Boolean(value?.ethicsAcknowledged),
    fieldName: string(value?.fieldName).slice(0, 100),
  };
}

export function fieldworkDraft(stationId = null) {
  const stored = readJson(DRAFT_KEY, null);
  if (!stored) return defaultFieldworkDraft(stationId || undefined);
  if (stationId && stored.stationId !== stationId) {
    return normalizeFieldworkDraft({
      ...stored,
      stationId,
      equipment: [],
    }, stationId);
  }
  return normalizeFieldworkDraft(stored);
}

export function saveFieldworkDraft(value) {
  const draft = normalizeFieldworkDraft(value);
  writeJson(DRAFT_KEY, draft);
  emit("draft-saved", { stationId: draft.stationId });
  return draft;
}

export function clearFieldworkDraft(stationId = "hakurei-shrine") {
  const draft = defaultFieldworkDraft(stationId);
  writeJson(DRAFT_KEY, draft);
  emit("draft-cleared", { stationId: draft.stationId });
  return draft;
}

function normalizeReview(value) {
  if (!value || typeof value !== "object") return null;
  return {
    standing: ["clear", "conditional", "contested"].includes(value.standing) ? value.standing : "conditional",
    strengths: stringArray(value.strengths),
    cautions: stringArray(value.cautions),
    note: value.note && typeof value.note === "object" ? value.note : { "zh-Hant": "", ja: "", en: "" },
    research: ["teaching", "pending", "allowed", "refused"].includes(value.research) ? value.research : "teaching",
  };
}

function normalizeLog(value) {
  if (!value || typeof value !== "object") return null;
  return {
    observation: string(value.observation).slice(0, 2400),
    sourceKind: fieldworkSourceKinds[value.sourceKind] ? value.sourceKind : "observation",
    sourceNote: string(value.sourceNote).slice(0, 1200),
    evidenceCode: string(value.evidenceCode).slice(0, 120),
    incidentKind: fieldworkIncidentKinds[value.incidentKind] ? value.incidentKind : "none",
    incidentNote: string(value.incidentNote).slice(0, 1200),
    researchChoice: fieldworkResearchChoices[value.researchChoice] ? value.researchChoice : "teaching",
    submittedAt: validDate(value.submittedAt),
  };
}

function normalizePlacement(value) {
  if (!value || typeof value !== "object" || !value.id || !fieldworkStation(value.stationId)) return null;
  const status = ["approved", "conditional", "deployed", "responded", "completed"].includes(value.status)
    ? value.status
    : "conditional";
  return {
    version: 1,
    id: string(value.id),
    stationId: value.stationId,
    draft: normalizeFieldworkDraft(value.draft, value.stationId),
    status,
    permit: value.permit && typeof value.permit === "object" ? {
      outcome: ["approved", "conditional"].includes(value.permit.outcome) ? value.permit.outcome : "conditional",
      conditions: stringArray(value.permit.conditions),
      issuedAt: validDate(value.permit.issuedAt || value.createdAt),
    } : { outcome: "conditional", conditions: [], issuedAt: validDate(value.createdAt) },
    createdAt: validDate(value.createdAt),
    startedAt: value.startedAt ? validDate(value.startedAt) : null,
    complicationId: fieldworkComplication(value.complicationId).id,
    responseId: string(value.responseId) || null,
    responseOutcome: ["careful", "traceable", "contested"].includes(value.responseOutcome) ? value.responseOutcome : null,
    respondedAt: value.respondedAt ? validDate(value.respondedAt) : null,
    log: normalizeLog(value.log),
    review: normalizeReview(value.review),
    completedAt: value.completedAt ? validDate(value.completedAt) : null,
    stampId: string(value.stampId) || null,
  };
}

export function fieldworkPlacements() {
  const value = readJson(PLACEMENT_KEY, []);
  return (Array.isArray(value) ? value : []).map(normalizePlacement).filter(Boolean);
}

export function fieldworkPlacement(id) {
  return fieldworkPlacements().find((entry) => entry.id === id) || null;
}

function normalizePassport(value) {
  const stamps = (Array.isArray(value?.stamps) ? value.stamps : [])
    .filter((entry) => entry?.id && entry?.stationId && fieldworkStation(entry.stationId))
    .map((entry) => ({
      id: string(entry.id),
      stationId: entry.stationId,
      placementId: string(entry.placementId),
      issuedAt: validDate(entry.issuedAt),
      hours: Math.max(0, Number(entry.hours) || 0),
      credits: Math.max(0, Number(entry.credits) || 0),
      repeated: Boolean(entry.repeated),
      standing: ["clear", "conditional", "contested"].includes(entry.standing) ? entry.standing : "conditional",
      research: ["teaching", "pending", "allowed", "refused"].includes(entry.research) ? entry.research : "teaching",
    }));
  return {
    version: 1,
    number: string(value?.number),
    issuedAt: value?.issuedAt ? validDate(value.issuedAt) : null,
    stamps,
  };
}

export function fieldworkPassport() {
  return normalizePassport(readJson(PASSPORT_KEY, null));
}

export function fieldworkPassportSummary() {
  const passport = fieldworkPassport();
  const distinct = [...new Set(passport.stamps.map(({ stationId }) => stationId))];
  const disciplines = new Set(
    distinct.flatMap((stationId) => fieldworkStation(stationId)?.discipline || []),
  );
  return {
    ...passport,
    distinctStations: distinct.length,
    totalVisits: passport.stamps.length,
    hours: passport.stamps.reduce((sum, stamp) => sum + stamp.hours, 0),
    credits: passport.stamps.reduce((sum, stamp) => sum + stamp.credits, 0),
    disciplines: disciplines.size,
    researchReady: passport.stamps.filter(({ research }) => research === "allowed").length,
    contested: passport.stamps.filter(({ standing }) => standing === "contested").length,
  };
}

const abilityLabels = {
  none: catalogText("abilityLabels.none"),
  declared: catalogText("abilityLabels.declared"),
  supervised: catalogText("abilityLabels.supervised"),
  sealed: catalogText("abilityLabels.sealed"),
};

const emergencyLabels = {
  "return-bell": catalogText("emergencyLabels.return-bell"),
  "buddy-rope": catalogText("emergencyLabels.buddy-rope"),
  "host-escort": catalogText("emergencyLabels.host-escort"),
  "clinic-route": catalogText("emergencyLabels.clinic-route"),
};

export function assessFieldworkDraft(value, locale = "zh-Hant") {
  const draft = normalizeFieldworkDraft(value);
  const station = fieldworkStation(draft.stationId);
  const conditions = [];
  if (draft.equipment.length < 3) {
    conditions.push(fieldworkLocalized(catalogText("assessFieldworkDraft.0.0", { "zh-Hant": {value0: draft.equipment.length}, "ja": {value0: draft.equipment.length}, "en": {value0: draft.equipment.length} }), locale));
  }
  if (["high", "variable"].includes(station.risk) && !["buddy-rope", "clinic-route"].includes(draft.emergencyPlan)) {
    conditions.push(fieldworkLocalized(catalogText("assessFieldworkDraft.0.0.2"), locale));
  }
  if (draft.abilityPlan === "declared" && ["medicine", "underground"].some((id) => station.discipline.includes(id))) {
    conditions.push(fieldworkLocalized(catalogText("assessFieldworkDraft.0.0.3"), locale));
  }
  const errors = [];
  if (draft.purpose.trim().length < 12) errors.push("purpose");
  if (!draft.ethicsAcknowledged) errors.push("ethics");
  if (!draft.departureDate) errors.push("date");
  return {
    draft,
    station,
    errors,
    outcome: conditions.length ? "conditional" : "approved",
    conditions,
    ability: fieldworkLocalized(abilityLabels[draft.abilityPlan], locale),
    emergency: fieldworkLocalized(emergencyLabels[draft.emergencyPlan], locale),
  };
}

export function submitFieldworkApplication(value, now = new Date(), locale = "zh-Hant") {
  const assessment = assessFieldworkDraft(value, locale);
  if (assessment.errors.length) return { error: assessment.errors[0], assessment };
  const placements = fieldworkPlacements();
  const active = placements.find(({ status }) => ["deployed", "responded"].includes(status));
  if (active) return { error: "active-placement", active, assessment };
  const id = makeId("TU-FW", now, placements.length + 1);
  const placement = normalizePlacement({
    id,
    stationId: assessment.station.id,
    draft: assessment.draft,
    status: assessment.outcome,
    permit: {
      outcome: assessment.outcome,
      conditions: assessment.conditions,
      issuedAt: now.toISOString(),
    },
    createdAt: now.toISOString(),
    complicationId: assessment.station.complicationId,
  });
  placements.push(placement);
  writeJson(PLACEMENT_KEY, placements.slice(-MAX_PLACEMENTS));
  writeJson(DRAFT_KEY, defaultFieldworkDraft(assessment.station.id));
  emit("application-submitted", { placementId: placement.id, stationId: placement.stationId });
  return { placement, assessment };
}

export function checkInFieldwork(placementId, now = new Date()) {
  const placements = fieldworkPlacements();
  const index = placements.findIndex(({ id }) => id === placementId);
  if (index < 0) return { error: "missing-placement" };
  if (!["approved", "conditional"].includes(placements[index].status)) {
    return { error: "wrong-status", placement: placements[index] };
  }
  const another = placements.find(({ id, status }) => id !== placementId && ["deployed", "responded"].includes(status));
  if (another) return { error: "active-placement", active: another };
  placements[index] = normalizePlacement({
    ...placements[index],
    status: "deployed",
    startedAt: now.toISOString(),
  });
  writeJson(PLACEMENT_KEY, placements);
  emit("departure-checked", { placementId, stationId: placements[index].stationId });
  return { placement: placements[index] };
}

export function respondToFieldworkComplication(placementId, responseId, now = new Date()) {
  const placements = fieldworkPlacements();
  const index = placements.findIndex(({ id }) => id === placementId);
  if (index < 0) return { error: "missing-placement" };
  const placement = placements[index];
  if (placement.status !== "deployed") return { error: "wrong-status", placement };
  const complication = fieldworkComplication(placement.complicationId);
  const response = complication.responses.find(([id]) => id === responseId);
  if (!response) return { error: "missing-response", placement };
  placements[index] = normalizePlacement({
    ...placement,
    status: "responded",
    responseId,
    responseOutcome: response[2],
    respondedAt: now.toISOString(),
  });
  writeJson(PLACEMENT_KEY, placements);
  emit("complication-handled", {
    placementId,
    stationId: placement.stationId,
    complicationId: complication.id,
    responseId,
  });
  return { placement: placements[index], complication, response };
}

function supervisorReview(placement, log) {
  const station = fieldworkStation(placement.stationId);
  const strengths = [];
  const cautions = [];
  if (log.observation.trim().length >= 80) strengths.push("observation");
  else cautions.push("observation");
  if (log.sourceNote.trim().length >= 35 && log.evidenceCode.trim().length >= 3) strengths.push("provenance");
  else cautions.push("provenance");
  if (placement.responseOutcome === "traceable") strengths.push("response-chain");
  if (placement.responseOutcome === "contested") cautions.push("unresolved-dispute");
  if (log.incidentKind !== "none") strengths.push("reported-deviation");
  if (log.researchChoice === "allowed" && (log.sourceNote.trim().length < 50 || placement.responseOutcome === "contested")) {
    cautions.push("research-consent");
  }
  const standing = cautions.includes("research-consent") || placement.responseOutcome === "contested"
    ? "contested"
    : cautions.length
      ? "conditional"
      : "clear";
  const research = log.researchChoice === "allowed" && cautions.includes("research-consent")
    ? "pending"
    : log.researchChoice;
  const note = standing === "clear"
    ? catalogText("note", { "zh-Hant": {value0: fieldworkLocalized(station.supervisor)}, "ja": {value0: fieldworkLocalized(station.supervisor, "ja")}, "en": {value0: fieldworkLocalized(station.supervisor, "en")} })
    : standing === "conditional"
      ? catalogText("note.2", { "zh-Hant": {value0: fieldworkLocalized(station.supervisor)}, "ja": {value0: fieldworkLocalized(station.supervisor, "ja")}, "en": {value0: fieldworkLocalized(station.supervisor, "en")} })
      : catalogText("note.3", { "zh-Hant": {value0: fieldworkLocalized(station.supervisor)}, "ja": {value0: fieldworkLocalized(station.supervisor, "ja")}, "en": {value0: fieldworkLocalized(station.supervisor, "en")} });
  return { standing, strengths, cautions, note, research };
}

export function completeFieldworkReturn(placementId, value, now = new Date()) {
  const placements = fieldworkPlacements();
  const index = placements.findIndex(({ id }) => id === placementId);
  if (index < 0) return { error: "missing-placement" };
  const placement = placements[index];
  if (placement.status !== "responded") return { error: "wrong-status", placement };
  const log = normalizeLog({ ...value, submittedAt: now.toISOString() });
  if (log.observation.trim().length < 20) return { error: "observation", placement };
  if (log.sourceNote.trim().length < 8) return { error: "source", placement };
  const review = supervisorReview(placement, log);
  const passport = fieldworkPassport();
  const repeated = passport.stamps.some(({ stationId }) => stationId === placement.stationId);
  if (!passport.number) {
    passport.number = makeId("TU-PASSPORT", now, 1);
    passport.issuedAt = now.toISOString();
  }
  const station = fieldworkStation(placement.stationId);
  const stamp = {
    id: makeId("TU-FW-STAMP", now, passport.stamps.length + 1),
    stationId: placement.stationId,
    placementId,
    issuedAt: now.toISOString(),
    hours: station.hours,
    credits: repeated ? 0.25 : station.credits,
    repeated,
    standing: review.standing,
    research: review.research,
  };
  passport.stamps.push(stamp);
  placements[index] = normalizePlacement({
    ...placement,
    status: "completed",
    log,
    review,
    completedAt: now.toISOString(),
    stampId: stamp.id,
  });
  writeJson(PLACEMENT_KEY, placements);
  writeJson(PASSPORT_KEY, passport);
  emit("return-certified", { placementId, stationId: placement.stationId, stampId: stamp.id });
  return { placement: placements[index], passport: normalizePassport(passport), stamp };
}

const lunarLabels = [
  catalogText("lunarLabels.0"),
  catalogText("lunarLabels.1"),
  catalogText("lunarLabels.2"),
  catalogText("lunarLabels.3"),
  catalogText("lunarLabels.4"),
  catalogText("lunarLabels.5"),
  catalogText("lunarLabels.6"),
  catalogText("lunarLabels.7"),
];

const timeLabels = {
  morning: catalogText("timeLabels.morning"),
  midday: catalogText("timeLabels.midday"),
  afternoon: catalogText("timeLabels.afternoon"),
  evening: catalogText("timeLabels.evening"),
  night: catalogText("timeLabels.night"),
};

export function fieldworkTravelEstimate(stationId, modeId = "foot", date = new Date()) {
  const station = fieldworkStation(stationId);
  const mode = fieldworkTravelModes[modeId] || fieldworkTravelModes.foot;
  if (!station) return null;
  const phase = campusLunarPhase(date);
  const band = campusTimeBand(date);
  let modifier = 0;
  const notes = [];
  if (station.travel.terrain === "bamboo") {
    if (modeId === "rabbit") modifier -= 14;
    else if ([0, 4].includes(phase)) {
      modifier += 21;
      notes.push(catalogText("fieldworkTravelEstimate.0"));
    }
  }
  if (station.travel.terrain === "mountain") {
    if (modeId === "tengu") modifier -= 12;
    if (band === "night" && modeId === "broom") {
      modifier += 18;
      notes.push(catalogText("fieldworkTravelEstimate.0.2"));
    }
  }
  if (station.travel.terrain === "afterlife" && modeId === "foot") {
    modifier += 24;
    notes.push(catalogText("fieldworkTravelEstimate.0.3"));
  }
  if (station.travel.terrain === "underground" && modeId === "broom") {
    modifier += 16;
    notes.push(catalogText("fieldworkTravelEstimate.0.4"));
  }
  if (station.travel.terrain === "boundary" && modeId === "gap") {
    modifier -= 8;
    notes.push(catalogText("fieldworkTravelEstimate.0.5"));
  }
  if (modeId === "tengu") {
    notes.push(catalogText("fieldworkTravelEstimate.0.6"));
  }
  const minutes = Math.max(7, Math.round(station.travel.base * mode.factor + modifier));
  return {
    stationId,
    modeId,
    minutes,
    phase,
    band,
    dayKey: campusDayKey(date),
    lunar: lunarLabels[phase],
    duty: timeLabels[band],
    notes,
  };
}

export function activeFieldworkPlacement() {
  return fieldworkPlacements().slice().reverse().find(({ status }) => ["deployed", "responded"].includes(status)) || null;
}

export function fieldworkMapNotice(locale = "zh-Hant") {
  const active = activeFieldworkPlacement();
  if (!active) return null;
  const station = fieldworkStation(active.stationId);
  return fieldworkLocalized(catalogText("fieldworkMapNotice.0", { "zh-Hant": {value0: fieldworkLocalized(station.name)}, "ja": {value0: fieldworkLocalized(station.name, "ja")}, "en": {value0: fieldworkLocalized(station.name, "en")} }), locale);
}

export function fieldworkCommunityPosts(locale = "zh-Hant") {
  const placements = fieldworkPlacements().slice(-8).reverse();
  return placements.flatMap((placement) => {
    const station = fieldworkStation(placement.stationId);
    const route = `fieldwork-placement-${placement.id}`;
    const base = [{
      id: `fieldwork-dispatch-${placement.id}`,
      category: "course",
      author: catalogText("base.0.author")[locale],
      title: catalogText("base.0.title", { [locale]: locale === "ja" ? {value0: station.code, value1: fieldworkLocalized(station.name, locale)} : locale === "en" ? {value0: station.code, value1: fieldworkLocalized(station.name, locale)} : {value0: station.code, value1: fieldworkLocalized(station.name, locale)} })[locale],
      body: placement.status === "completed"
        ? fieldworkLocalized(catalogText("base.0.body.0", { "zh-Hant": {value0: fieldworkLocalized(placement.review.note)}, "ja": {value0: fieldworkLocalized(placement.review.note, "ja")}, "en": {value0: fieldworkLocalized(placement.review.note, "en")} }), locale)
        : fieldworkLocalized(catalogText("base.0.body.0.2", { "zh-Hant": {value0: placement.permit.conditions.length}, "ja": {value0: placement.permit.conditions.length}, "en": {value0: placement.permit.conditions.length} }), locale),
      replies: placement.status === "completed" ? 4 : 1,
      generated: true,
      fieldwork: true,
      fieldworkRoute: route,
      createdAt: placement.completedAt || placement.createdAt,
    }];
    if (placement.status === "completed" && placement.log?.incidentKind !== "none") {
      base.push({
        id: `fieldwork-return-${placement.id}`,
        category: "notice",
        author: fieldworkLocalized(station.supervisor, locale),
        title: fieldworkLocalized(catalogText("fieldworkCommunityPosts.0.0.title.0", { "zh-Hant": {value0: station.code}, "ja": {value0: station.code}, "en": {value0: station.code} }), locale),
        body: `${fieldworkLocalized(fieldworkIncidentKinds[placement.log.incidentKind], locale)} · ${placement.log.incidentNote || fieldworkLocalized(station.wrinkle, locale)}`,
        replies: placement.review?.standing === "contested" ? 9 : 3,
        generated: true,
        fieldwork: true,
        fieldworkRoute: route,
        createdAt: placement.completedAt,
      });
    }
    return base;
  });
}
