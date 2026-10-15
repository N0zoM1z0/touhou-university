import { text as catalogText } from "../generated/i18n/ui/festival-model.js";
import {
  festivalAidPlan,
  festivalFairyZone,
  festivalFoodCourt,
  festivalGatePlan,
  festivalIncident,
  festivalIncidentPool,
  festivalKind,
  festivalKinds,
  festivalLocalized,
  festivalMusicPlan,
  festivalPower,
  festivalPressPlan,
  festivalReviewDesks,
  festivalRoute,
  festivalStage,
} from "../data/festival.js";
import { campusLunarPhase } from "../data/campus-time.js";
import { liveCampusSnapshot } from "../data/live-campus.js";

const DRAFT_KEY = "tu:festival:draft";
const PLAN_KEY = "tu:festival:plans";
const OPERATION_KEY = "tu:festival:operations";
const MAX_RECORDS = 40;
const l = (zhHant, ja, en) => ({ "zh-Hant": zhHant, ja, en });

const outcomeLabels = Object.freeze({
  cleared: catalogText("outcomeLabels.0.cleared"),
  conditional: catalogText("outcomeLabels.0.conditional"),
  contested: catalogText("outcomeLabels.0.contested"),
  revision: catalogText("outcomeLabels.0.revision"),
  live: catalogText("outcomeLabels.0.live"),
  closed: catalogText("outcomeLabels.0.closed"),
});

const stanceLabels = Object.freeze({
  clear: catalogText("stanceLabels.0.clear"),
  condition: catalogText("stanceLabels.0.condition"),
  contest: catalogText("stanceLabels.0.contest"),
  revise: catalogText("stanceLabels.0.revise"),
});

function storage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function readJson(key, fallback) {
  try {
    const value = JSON.parse(storage()?.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  storage()?.setItem(key, JSON.stringify(value));
}

function emit(action, detail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("tu:festivalchange", { detail: { action, ...detail } }));
}

function text(value, maximum = 1200) {
  return String(value ?? "").trim().slice(0, maximum);
}

function dateValue(value, fallback = new Date().toISOString()) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function known(value, records, fallback) {
  return records.some(({ id }) => id === value) ? value : fallback;
}

function hashValue(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeId(prefix, now, sequence) {
  return `${prefix}-${now.getTime().toString(36).toUpperCase()}-${String(sequence).padStart(2, "0")}`;
}

function firstAprilFullMoon(now = new Date()) {
  const year = now.getMonth() > 3 ? now.getFullYear() + 1 : now.getFullYear();
  for (let day = 1; day <= 30; day += 1) {
    const candidate = new Date(year, 3, day, 18, 0, 0, 0);
    if (campusLunarPhase(candidate) === 4) return candidate;
  }
  return new Date(year, 3, 8, 18, 0, 0, 0);
}

export function defaultFestivalDraft(now = new Date()) {
  return {
    schema: 1,
    kindId: "spring-lantern",
    title: "",
    startsAt: firstAprilFullMoon(now).toISOString(),
    routeId: "three-faith-loop",
    stageId: "lake-bank",
    altitude: 45,
    density: 3,
    cueSeconds: 2.2,
    visitorCapacity: 480,
    powerId: "mixed-grid",
    foodCourtId: "village-court",
    fairyZoneId: "lake-lawn",
    aidPlanId: "dual-station",
    gatePlanId: "rotating",
    pressPlanId: "aya-live",
    musicPlanId: "prismriver-evening",
    rainPlan: true,
    debrisCrew: true,
    independentCounter: true,
    stopRule: "三次木鐘、紅白燈同亮，所有符卡立即停止，最近的值班者先開退路再問理由。",
    rainRule: "雨線越過朱繩或能見度低於兩座燈籠時，熄滅低空光路並轉入屋簷節目。",
    accessibilityNote: "地面保留無閃光路線；大型翼展由山側分流，精神感知者可領取低刺激節目表。",
    organiserNote: "",
    updatedAt: now.toISOString(),
  };
}

export function normalizeFestivalDraft(value = {}, now = new Date()) {
  const fallback = defaultFestivalDraft(now);
  return {
    schema: 1,
    kindId: known(value.kindId, festivalKinds, fallback.kindId),
    title: text(value.title, 140),
    startsAt: dateValue(value.startsAt, fallback.startsAt),
    routeId: festivalRoute(value.routeId).id,
    stageId: festivalStage(value.stageId).id,
    altitude: [20, 45, 80].includes(Number(value.altitude)) ? Number(value.altitude) : fallback.altitude,
    density: Math.max(1, Math.min(5, Number(value.density) || fallback.density)),
    cueSeconds: Math.max(0, Math.min(6, Number(value.cueSeconds) || 0)),
    visitorCapacity: Math.max(120, Math.min(1200, Number(value.visitorCapacity) || fallback.visitorCapacity)),
    powerId: festivalPower(value.powerId).id,
    foodCourtId: festivalFoodCourt(value.foodCourtId).id,
    fairyZoneId: festivalFairyZone(value.fairyZoneId).id,
    aidPlanId: festivalAidPlan(value.aidPlanId).id,
    gatePlanId: festivalGatePlan(value.gatePlanId).id,
    pressPlanId: festivalPressPlan(value.pressPlanId).id,
    musicPlanId: festivalMusicPlan(value.musicPlanId).id,
    rainPlan: Boolean(value.rainPlan),
    debrisCrew: Boolean(value.debrisCrew),
    independentCounter: Boolean(value.independentCounter),
    stopRule: text(value.stopRule || fallback.stopRule),
    rainRule: text(value.rainRule || fallback.rainRule),
    accessibilityNote: text(value.accessibilityNote || fallback.accessibilityNote),
    organiserNote: text(value.organiserNote),
    updatedAt: dateValue(value.updatedAt, now.toISOString()),
  };
}

export function festivalDraft() {
  return normalizeFestivalDraft(readJson(DRAFT_KEY, defaultFestivalDraft()));
}

export function saveFestivalDraft(value, now = new Date()) {
  const draft = normalizeFestivalDraft({ ...value, updatedAt: now.toISOString() }, now);
  writeJson(DRAFT_KEY, draft);
  emit("draft-saved");
  return draft;
}

export function resetFestivalDraft(now = new Date()) {
  const draft = defaultFestivalDraft(now);
  writeJson(DRAFT_KEY, draft);
  emit("draft-reset");
  return draft;
}

function deskFinding(deskId, stance, finding, conditions = []) {
  return { deskId, stance, finding, conditions };
}

function operationalMetrics(draft) {
  const startsAt = new Date(draft.startsAt);
  const route = festivalRoute(draft.routeId);
  const stage = festivalStage(draft.stageId);
  const power = festivalPower(draft.powerId);
  const food = festivalFoodCourt(draft.foodCourtId);
  const fairies = festivalFairyZone(draft.fairyZoneId);
  const aid = festivalAidPlan(draft.aidPlanId);
  const gate = festivalGatePlan(draft.gatePlanId);
  const press = festivalPressPlan(draft.pressPlanId);
  const music = festivalMusicPlan(draft.musicPlanId);
  const live = liveCampusSnapshot(startsAt);
  const phase = campusLunarPhase(startsAt);
  const hardCapacity = Math.min(route.capacity, stage.capacity, food.capacity);
  const expectedAttendance = Math.max(
    80,
    Math.min(
      draft.visitorCapacity,
      hardCapacity,
      Math.round(draft.visitorCapacity * (0.68 + press.reach * 0.05)),
    ),
  );
  const powerLoad = Math.round(
    stage.power
      + draft.density * 9
      + draft.visitorCapacity / 34
      + fairies.drift * 3
      + music.noise * 4
      + (draft.altitude === 80 ? 8 : 0),
  );
  const clinicArrivals = Math.max(
    1,
    Math.ceil(
      expectedAttendance / 120
      + draft.density * 1.5
      + ([3, 4, 5].includes(phase) ? 5 : 0)
      + music.noise
      + fairies.drift
      + stage.clinic
      - aid.capacity / 8,
    ),
  );
  const routeDelay = route.delay
    + gate.dispute * 2
    + live.activeEvents.reduce((total, event) => total + (event.severity === "high" ? 3 : 1), 0);
  return {
    startsAt: startsAt.toISOString(),
    phase,
    live,
    expectedAttendance,
    hardCapacity,
    powerLoad,
    powerCapacity: power.capacity,
    backupCapacity: power.backup,
    clinicArrivals,
    aidCapacity: aid.capacity,
    routeDelay,
    volunteers: Math.ceil(expectedAttendance / 48) + draft.density * 2 + fairies.drift,
    lanternRecovery: draft.density * 24 + fairies.drift * 7,
    endAt: new Date(startsAt.getTime() + music.endOffset * 60_000).toISOString(),
  };
}

function reimuReview(draft, metrics) {
  if (draft.cueSeconds < 1.2 || (draft.altitude === 20 && draft.density >= 4)) {
    return deskFinding(
      "reimu",
      "revise",
      catalogText("reimuReview.reimu.2"),
      [catalogText("reimuReview.reimu.3.0")],
    );
  }
  if (draft.visitorCapacity > metrics.hardCapacity) {
    return deskFinding(
      "reimu",
      draft.visitorCapacity > metrics.hardCapacity * 1.18 ? "revise" : "condition",
      catalogText("reimuReview.reimu.2.2"),
      [catalogText("reimuReview.reimu.3.0.2", { "zh-Hant": {value0: metrics.hardCapacity}, "ja": {value0: metrics.hardCapacity}, "en": {value0: metrics.hardCapacity} })],
    );
  }
  if (draft.stopRule.length < 20) {
    return deskFinding(
      "reimu",
      "condition",
      catalogText("reimuReview.reimu.2.3"),
      [catalogText("reimuReview.reimu.3.0.3")],
    );
  }
  return deskFinding("reimu", "clear", catalogText("reimuReview.reimu.2.4"));
}

function nitoriReview(draft, metrics) {
  if (metrics.powerLoad > metrics.powerCapacity + metrics.backupCapacity) {
    return deskFinding(
      "nitori",
      "revise",
      catalogText("nitoriReview.nitori.2"),
      [catalogText("nitoriReview.nitori.3.0")],
    );
  }
  if (draft.powerId === "mini-reactors") {
    return deskFinding(
      "nitori",
      "contest",
      catalogText("nitoriReview.nitori.2.2"),
      [catalogText("nitoriReview.nitori.3.0.2")],
    );
  }
  if (metrics.powerLoad > metrics.powerCapacity || draft.powerId === "moriya-grid") {
    return deskFinding(
      "nitori",
      "condition",
      catalogText("nitoriReview.nitori.2.3"),
      [catalogText("nitoriReview.nitori.3.0.3")],
    );
  }
  return deskFinding("nitori", "clear", catalogText("nitoriReview.nitori.2.4"));
}

function eirinReview(draft, metrics) {
  if (metrics.clinicArrivals > metrics.aidCapacity || (draft.density === 5 && draft.cueSeconds < 2)) {
    return deskFinding(
      "eirin",
      "revise",
      catalogText("eirinReview.eirin.2"),
      [catalogText("eirinReview.eirin.3.0")],
    );
  }
  if ([3, 4, 5].includes(metrics.phase) && draft.aidPlanId !== "dual-station" && draft.visitorCapacity >= 500) {
    return deskFinding(
      "eirin",
      "condition",
      catalogText("eirinReview.eirin.2.2"),
      [catalogText("eirinReview.eirin.3.0.2")],
    );
  }
  return deskFinding("eirin", "clear", catalogText("eirinReview.eirin.2.3"));
}

function ayaReview(draft) {
  if (draft.pressPlanId === "aya-live") {
    return deskFinding(
      "aya",
      "condition",
      catalogText("ayaReview.aya.2"),
      [catalogText("ayaReview.aya.3.0")],
    );
  }
  if (draft.pressPlanId === "notice-only") {
    return deskFinding(
      "aya",
      "contest",
      catalogText("ayaReview.aya.2.2"),
      [catalogText("ayaReview.aya.3.0.2")],
    );
  }
  return deskFinding("aya", "clear", catalogText("ayaReview.aya.2.3"));
}

function faithReview(draft) {
  const gate = festivalGatePlan(draft.gatePlanId);
  if (gate.dispute > 0) {
    return deskFinding(
      "faith",
      "contest",
      catalogText("faithReview.faith.2", { "zh-Hant": {value0: festivalLocalized(gate.claimant)}, "ja": {value0: festivalLocalized(gate.claimant, "ja")}, "en": {value0: festivalLocalized(gate.claimant, "en")} }),
      [catalogText("faithReview.faith.3.0")],
    );
  }
  return deskFinding("faith", "clear", catalogText("faithReview.faith.2.2"));
}

function residenceReview(draft) {
  const music = festivalMusicPlan(draft.musicPlanId);
  const fairies = festivalFairyZone(draft.fairyZoneId);
  if (draft.musicPlanId === "ghost-afterhours") {
    return deskFinding(
      "residence",
      "contest",
      catalogText("residenceReview.residence.2"),
      [catalogText("residenceReview.residence.3.0")],
    );
  }
  if (fairies.drift >= 4 || music.noise >= 2) {
    return deskFinding(
      "residence",
      "condition",
      catalogText("residenceReview.residence.2.2"),
      [catalogText("residenceReview.residence.3.0.2")],
    );
  }
  return deskFinding("residence", "clear", catalogText("residenceReview.residence.2.3"));
}

export function assessFestivalPlan(value = {}, locale = "zh-Hant") {
  const draft = normalizeFestivalDraft(value);
  const metrics = operationalMetrics(draft);
  const opinions = [
    reimuReview(draft, metrics),
    nitoriReview(draft, metrics),
    eirinReview(draft, metrics),
    ayaReview(draft),
    faithReview(draft),
    residenceReview(draft),
  ];
  let outcome = "cleared";
  if (opinions.some(({ stance }) => stance === "revise")) outcome = "revision";
  else if (opinions.some(({ stance }) => stance === "contest")) outcome = "contested";
  else if (opinions.some(({ stance }) => stance === "condition")) outcome = "conditional";
  return {
    draft,
    metrics,
    opinions,
    outcome,
    programme: buildFestivalProgramme(draft, locale),
  };
}

function normalizeOpinion(value = {}) {
  const deskId = festivalReviewDesks.some(({ id }) => id === value.deskId) ? value.deskId : festivalReviewDesks[0].id;
  const stance = stanceLabels[value.stance] ? value.stance : "revise";
  return {
    deskId,
    stance,
    finding: value.finding && typeof value.finding === "object" ? value.finding : l(text(value.finding), text(value.finding), text(value.finding)),
    conditions: Array.isArray(value.conditions) ? value.conditions.slice(0, 5) : [],
  };
}

function normalizePlan(value = {}) {
  if (!value?.id) return null;
  const assessment = assessFestivalPlan(value.draft || value);
  return {
    schema: 1,
    id: text(value.id, 120),
    createdAt: dateValue(value.createdAt),
    status: ["issued", "superseded"].includes(value.status) ? value.status : "issued",
    outcome: outcomeLabels[value.outcome] ? value.outcome : assessment.outcome,
    draft: assessment.draft,
    metrics: value.metrics && typeof value.metrics === "object" ? { ...assessment.metrics, ...value.metrics } : assessment.metrics,
    opinions: (Array.isArray(value.opinions) ? value.opinions : assessment.opinions).map(normalizeOpinion),
    programme: Array.isArray(value.programme) ? value.programme : assessment.programme,
  };
}

function normalizeResponse(value = {}) {
  const incident = festivalIncident(value.incidentId);
  const response = incident?.responses.find(({ id }) => id === value.responseId);
  if (!incident || !response) return null;
  return {
    incidentId: incident.id,
    responseId: response.id,
    resolvedAt: dateValue(value.resolvedAt),
    effects: response.effects,
  };
}

function normalizeOperation(value = {}) {
  if (!value?.id || !value?.planId) return null;
  return {
    schema: 1,
    id: text(value.id, 120),
    planId: text(value.planId, 120),
    status: ["live", "closed"].includes(value.status) ? value.status : "live",
    role: ["organiser", "volunteer", "observer"].includes(value.role) ? value.role : "volunteer",
    openedAt: dateValue(value.openedAt),
    closedAt: value.closedAt ? dateValue(value.closedAt) : null,
    scenarioIds: (Array.isArray(value.scenarioIds) ? value.scenarioIds : []).filter((id) => festivalIncident(id)).slice(0, 4),
    responses: (Array.isArray(value.responses) ? value.responses : []).map(normalizeResponse).filter(Boolean),
    report: value.report && typeof value.report === "object" ? value.report : null,
  };
}

export function festivalPlans() {
  const values = readJson(PLAN_KEY, []);
  return (Array.isArray(values) ? values : []).map(normalizePlan).filter(Boolean);
}

export function festivalPlan(id) {
  return festivalPlans().find((entry) => entry.id === id) || null;
}

export function festivalOperations() {
  const values = readJson(OPERATION_KEY, []);
  return (Array.isArray(values) ? values : []).map(normalizeOperation).filter(Boolean);
}

export function festivalOperation(id) {
  return festivalOperations().find((entry) => entry.id === id) || null;
}

export function submitFestivalPlan(value, now = new Date(), locale = "zh-Hant") {
  const assessment = assessFestivalPlan(value, locale);
  const plans = festivalPlans();
  const plan = normalizePlan({
    id: makeId("TU-FEST-P", now, plans.length + 1),
    createdAt: now.toISOString(),
    status: "issued",
    outcome: assessment.outcome,
    draft: assessment.draft,
    metrics: assessment.metrics,
    opinions: assessment.opinions,
    programme: assessment.programme,
  });
  plans.push(plan);
  writeJson(PLAN_KEY, plans.slice(-MAX_RECORDS));
  saveFestivalDraft(plan.draft, now);
  emit("plan-issued", { planId: plan.id, outcome: plan.outcome });
  return plan;
}

function scenarioIdsForPlan(plan) {
  const ids = [];
  const add = (id) => {
    if (festivalIncident(id) && !ids.includes(id)) ids.push(id);
  };
  if (plan.draft.pressPlanId === "aya-live") add("aya-early-opening");
  if (["moriya-grid", "mixed-grid", "mini-reactors"].includes(plan.draft.powerId)) add("power-votive-plaques");
  add("fairy-lantern-drift");
  if (plan.draft.musicPlanId !== "sunset-only") add("prismriver-airless-noise");
  if (plan.metrics.phase === 4) add("full-moon-book-flock");
  if (plan.metrics.live.seed % 4 === 3 || plan.draft.rainPlan) add("rain-border-pocket");
  if (plan.draft.gatePlanId !== "rotating") add("gate-claimants");
  const remaining = festivalIncidentPool
    .map(({ id }) => id)
    .filter((id) => !ids.includes(id))
    .sort((a, b) => hashValue(`${plan.id}:${a}`) - hashValue(`${plan.id}:${b}`));
  remaining.forEach(add);
  return ids.slice(0, 4);
}

export function startFestivalOperation(planId, { role = "volunteer", acknowledged = false } = {}, now = new Date()) {
  const plan = festivalPlan(planId);
  if (!plan) return { error: "missing-plan" };
  if (plan.outcome === "revision") return { error: "revision-blocked", plan };
  if (["conditional", "contested"].includes(plan.outcome) && !acknowledged) {
    return { error: "conditions-not-acknowledged", plan };
  }
  const operations = festivalOperations();
  const existing = operations.find((entry) => entry.planId === planId && entry.status === "live");
  if (existing) return { operation: existing, plan };
  const operation = normalizeOperation({
    id: makeId("TU-FEST-LIVE", now, operations.length + 1),
    planId,
    status: "live",
    role,
    openedAt: now.toISOString(),
    scenarioIds: scenarioIdsForPlan(plan),
    responses: [],
  });
  operations.push(operation);
  writeJson(OPERATION_KEY, operations.slice(-MAX_RECORDS));
  emit("festival-opened", { planId, operationId: operation.id });
  return { operation, plan };
}

export function respondFestivalIncident(operationId, incidentId, responseId, now = new Date()) {
  const operations = festivalOperations();
  const index = operations.findIndex(({ id }) => id === operationId);
  if (index < 0 || operations[index].status !== "live") return null;
  const incident = festivalIncident(incidentId);
  const response = incident?.responses.find(({ id }) => id === responseId);
  if (!incident || !response || !operations[index].scenarioIds.includes(incident.id)) return null;
  const responseRecord = normalizeResponse({
    incidentId,
    responseId,
    resolvedAt: now.toISOString(),
  });
  operations[index] = normalizeOperation({
    ...operations[index],
    responses: [...operations[index].responses.filter((entry) => entry.incidentId !== incidentId), responseRecord],
  });
  writeJson(OPERATION_KEY, operations);
  emit("incident-resolved", { operationId, incidentId, responseId });
  return operations[index];
}

function sumEffects(operation) {
  return operation.responses.reduce((total, entry) => {
    Object.entries(entry.effects || {}).forEach(([key, value]) => {
      if (typeof value === "number") total[key] = (total[key] || 0) + value;
    });
    return total;
  }, { delay: 0, attendance: 0, clinic: 0, power: 0, dispute: 0 });
}

function reportFor(operation, plan, now = new Date()) {
  const effects = sumEffects(operation);
  const unresolved = operation.scenarioIds.filter((id) => !operation.responses.some((entry) => entry.incidentId === id));
  const attendance = Math.max(0, plan.metrics.expectedAttendance + effects.attendance);
  const clinicArrivals = Math.max(0, plan.metrics.clinicArrivals + effects.clinic);
  const delay = Math.max(0, plan.metrics.routeDelay + effects.delay);
  const powerPeak = Math.max(0, plan.metrics.powerLoad + effects.power);
  const headline = effects.dispute >= 4
    ? catalogText("headline")
    : clinicArrivals > plan.metrics.aidCapacity
      ? catalogText("headline.2")
      : catalogText("headline.3");
  return {
    createdAt: now.toISOString(),
    resolved: operation.responses.length,
    unresolved,
    attendance,
    clinicArrivals,
    delay,
    powerPeak,
    disputes: effects.dispute,
    headline,
    routeReleased: true,
  };
}

export function closeFestivalOperation(operationId, now = new Date()) {
  const operations = festivalOperations();
  const index = operations.findIndex(({ id }) => id === operationId);
  if (index < 0 || operations[index].status !== "live") return { error: "missing-operation" };
  const operation = operations[index];
  if (operation.responses.length < operation.scenarioIds.length) {
    return { error: "unresolved-incidents", operation };
  }
  const plan = festivalPlan(operation.planId);
  if (!plan) return { error: "missing-plan" };
  const report = reportFor(operation, plan, now);
  operations[index] = normalizeOperation({
    ...operation,
    status: "closed",
    closedAt: now.toISOString(),
    report,
  });
  writeJson(OPERATION_KEY, operations);
  emit("festival-closed", { operationId, planId: plan.id });
  return { operation: operations[index], plan };
}

export function activeFestivalOperation() {
  return festivalOperations().slice().reverse().find(({ status }) => status === "live") || null;
}

export function festivalRouteOverlay() {
  const operation = activeFestivalOperation();
  if (!operation) {
    return {
      active: false,
      closedModes: [],
      closedEdges: [],
      closedTransitNodes: [],
      modeDelay: {},
      edgeDelay: {},
      notices: [],
    };
  }
  const plan = festivalPlan(operation.planId);
  if (!plan) return { active: false, closedModes: [], closedEdges: [], closedTransitNodes: [], modeDelay: {}, edgeDelay: {}, notices: [] };
  const route = festivalRoute(plan.draft.routeId);
  const closedEdges = [...route.closedEdges];
  operation.responses.forEach((entry) => {
    const response = festivalIncident(entry.incidentId)?.responses.find(({ id }) => id === entry.responseId);
    if (response?.effects?.closeExtraEdge) closedEdges.push(response.effects.closeExtraEdge);
  });
  const lowAir = plan.draft.altitude === 20 && plan.draft.density >= 4;
  return {
    active: true,
    operationId: operation.id,
    planId: plan.id,
    closedModes: lowAir ? ["broom"] : [],
    closedEdges: [...new Set(closedEdges)],
    closedTransitNodes: plan.draft.density === 5 ? [festivalFoodCourt(plan.draft.foodCourtId).routeNode] : [],
    modeDelay: { tengu: 2, rabbit: plan.metrics.phase === 4 ? 3 : 0 },
    edgeDelay: Object.fromEntries(route.path.slice(0, -1).map((node, index) => [
      [node, route.path[index + 1]].sort().join("--"),
      2,
    ])),
    notices: [
      catalogText("festivalRouteOverlay.notices.0"),
      catalogText("festivalRouteOverlay.notices.1", { "zh-Hant": {value0: festivalLocalized(festivalKind(plan.draft.kindId).name)}, "ja": {value0: festivalLocalized(festivalKind(plan.draft.kindId).name, "ja")}, "en": {value0: festivalLocalized(festivalKind(plan.draft.kindId).name, "en")} }),
    ],
  };
}

export function festivalClinicPressure() {
  const operation = activeFestivalOperation();
  if (!operation) return { active: false, points: 0, expected: 0 };
  const plan = festivalPlan(operation.planId);
  if (!plan) return { active: false, points: 0, expected: 0 };
  const effects = sumEffects(operation);
  const expected = Math.max(0, plan.metrics.clinicArrivals + effects.clinic);
  return {
    active: true,
    operationId: operation.id,
    points: Math.ceil(expected / 2),
    expected,
  };
}

export function buildFestivalProgramme(value, locale = "zh-Hant") {
  const draft = normalizeFestivalDraft(value);
  const start = new Date(draft.startsAt);
  const item = (offset, title, place) => ({
    at: new Date(start.getTime() + offset * 60_000).toISOString(),
    title,
    place,
  });
  const kind = festivalKind(draft.kindId);
  const stage = festivalStage(draft.stageId);
  const food = festivalFoodCourt(draft.foodCourtId);
  const fairies = festivalFairyZone(draft.fairyZoneId);
  return [
    item(-35, catalogText("buildFestivalProgramme.0.1"), festivalRoute(draft.routeId).name),
    item(0, catalogText("buildFestivalProgramme.1.1", { "zh-Hant": {value0: festivalLocalized(kind.name)}, "ja": {value0: festivalLocalized(kind.name, "ja")}, "en": {value0: festivalLocalized(kind.name, "en")} }), festivalGatePlan(draft.gatePlanId).name),
    item(35, catalogText("buildFestivalProgramme.2.1"), fairies.name),
    item(80, catalogText("buildFestivalProgramme.3.1"), food.name),
    item(130, catalogText("buildFestivalProgramme.4.1"), stage.name),
    item(190, catalogText("buildFestivalProgramme.5.1"), festivalMusicPlan(draft.musicPlanId).name),
  ].map((entry) => ({
    ...entry,
    title: festivalLocalized(entry.title, locale),
    place: festivalLocalized(entry.place, locale),
  }));
}

export function festivalCommunityPosts(locale = "zh-Hant") {
  const plans = festivalPlans();
  const operations = festivalOperations();
  return plans.slice(-6).reverse().flatMap((plan, index) => {
    const operation = operations.find((entry) => entry.planId === plan.id);
    const kindName = festivalLocalized(festivalKind(plan.draft.kindId).name, locale);
    const outcome = festivalLocalized(outcomeLabels[plan.outcome], locale);
    const route = operation ? `festival-operation-${operation.id}` : `festival-plan-${plan.id}`;
    const base = [{
      id: `festival-permit-${plan.id}`,
      category: "notice",
      author: catalogText("base.0.author")[locale],
      title: locale === "ja"
        ? `${kindName}：${outcome}`
        : locale === "en"
          ? `${kindName}: ${outcome}`
          : `${kindName}：${outcome}`,
      body: catalogText("base.0.body")[locale],
      replies: 11 + index,
      createdAt: plan.createdAt,
      generated: true,
      festival: true,
      festivalRoute: route,
    }];
    if (!operation) return base;
    if (operation.status === "closed" && operation.report) {
      base.unshift({
        id: `festival-report-${operation.id}`,
        category: "club",
        author: catalogText("festivalCommunityPosts.0.0.author")[locale],
        title: festivalLocalized(operation.report.headline, locale),
        body: catalogText("festivalCommunityPosts.0.0.body", { [locale]: locale === "ja" ? {value0: operation.report.attendance, value1: operation.report.clinicArrivals, value2: operation.report.delay} : locale === "en" ? {value0: operation.report.attendance, value1: operation.report.clinicArrivals, value2: operation.report.delay} : {value0: operation.report.attendance, value1: operation.report.clinicArrivals, value2: operation.report.delay} })[locale],
        replies: 24 + operation.report.disputes,
        createdAt: operation.closedAt,
        generated: true,
        festival: true,
        festivalRoute: route,
      });
    } else {
      base.unshift({
        id: `festival-live-${operation.id}`,
        category: "notice",
        author: catalogText("festivalCommunityPosts.0.0.author.2")[locale],
        title: catalogText("festivalCommunityPosts.0.0.title", { [locale]: locale === "ja" ? {value0: kindName} : locale === "en" ? {value0: kindName} : {value0: kindName} })[locale],
        body: catalogText("festivalCommunityPosts.0.0.body.2", { [locale]: locale === "ja" ? {value0: operation.responses.length, value1: operation.scenarioIds.length} : locale === "en" ? {value0: operation.responses.length, value1: operation.scenarioIds.length} : {value0: operation.responses.length, value1: operation.scenarioIds.length} })[locale],
        replies: 17 + operation.responses.length,
        createdAt: operation.openedAt,
        generated: true,
        festival: true,
        festivalRoute: route,
      });
    }
    return base;
  });
}

export function festivalStats() {
  const plans = festivalPlans();
  const operations = festivalOperations();
  return {
    plans: plans.length,
    live: operations.filter(({ status }) => status === "live").length,
    closed: operations.filter(({ status }) => status === "closed").length,
    responses: operations.reduce((sum, operation) => sum + operation.responses.length, 0),
  };
}

export const festivalStorageKeys = Object.freeze({
  draft: DRAFT_KEY,
  plans: PLAN_KEY,
  operations: OPERATION_KEY,
});

export { outcomeLabels as festivalOutcomeLabels, stanceLabels as festivalStanceLabels };
