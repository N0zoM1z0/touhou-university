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

const l = (zhHant, ja, en) => ({ "zh-Hant": zhHant, ja, en });

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
    note: value.note && typeof value.note === "object" ? value.note : l("", "", ""),
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
  none: l("本次不使用能力", "今回は能力を使用しない", "No ability use"),
  declared: l("事前聲明用途與停止口令", "用途・停止号令を事前申告", "Purpose and stop command declared"),
  supervised: l("只在指導者在場時使用", "指導者同席時のみ使用", "Use only with supervisor present"),
  sealed: l("出發前封印；返校後共同解封", "出発前封印・帰校後共同解除", "Sealed before departure; jointly released after return"),
};

const emergencyLabels = {
  "return-bell": l("三聲返校鈴", "三音帰校鈴", "Three-tone return bell"),
  "buddy-rope": l("雙人回程繩", "二人帰還縄", "Buddy return rope"),
  "host-escort": l("場地主持陪同撤離", "現地主催者同行退出", "Host-escorted exit"),
  "clinic-route": l("永遠亭／校醫務室預先路線", "永遠亭・校医務室事前経路", "Pre-filed Eientei / infirmary route"),
};

export function assessFieldworkDraft(value, locale = "zh-Hant") {
  const draft = normalizeFieldworkDraft(value);
  const station = fieldworkStation(draft.stationId);
  const conditions = [];
  if (draft.equipment.length < 3) {
    conditions.push(fieldworkLocalized(l(
      `三件指定裝備只登記了 ${draft.equipment.length} 件；其餘由場地主持覆核。`,
      `指定装備三件中${draft.equipment.length}件のみ。残りは現地主催者が照合。`,
      `${draft.equipment.length} of three listed items selected; the host must verify the rest.`,
    ), locale));
  }
  if (["high", "variable"].includes(station.risk) && !["buddy-rope", "clinic-route"].includes(draft.emergencyPlan)) {
    conditions.push(fieldworkLocalized(l(
      "高／變動風險站須在出發桌另畫雙人或醫療退場線。",
      "高・変動リスク所は出発机で二人または医療退出線を追記。",
      "High/variable-risk stations require a buddy or medical exit line at dispatch.",
    ), locale));
  }
  if (draft.abilityPlan === "declared" && ["medicine", "underground"].some((id) => station.discipline.includes(id))) {
    conditions.push(fieldworkLocalized(l(
      "涉及臨床或精神資訊時，能力聲明仍需在現場逐次取得同意。",
      "臨床・精神情報では能力申告後も現場で逐次同意が必要。",
      "Clinical or mental-information work still needs encounter-by-encounter consent after declaration.",
    ), locale));
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
    ? l(
      `${fieldworkLocalized(station.supervisor)}：能分清看見的、聽來的與仍未解決的；准予蓋章。`,
      `${fieldworkLocalized(station.supervisor, "ja")}：見たこと、聞いたこと、未解決を区別できた。押印。`,
      `${fieldworkLocalized(station.supervisor, "en")}: Observation, report, and unresolved matters remain distinct. Seal granted.`,
    )
    : standing === "conditional"
      ? l(
        `${fieldworkLocalized(station.supervisor)}：護照可以蓋，附件不可丟；下次先把來源寫在結論前。`,
        `${fieldworkLocalized(station.supervisor, "ja")}：旅券へ押印可、附件は保持。次は結論より先に資料源を。`,
        `${fieldworkLocalized(station.supervisor, "en")}: Passport may be stamped; keep the annex. Next time, place sources before the conclusion.`,
      )
      : l(
        `${fieldworkLocalized(station.supervisor)}：准予返校，但爭議不准變成漂亮的成功故事；紅線隨章同行。`,
        `${fieldworkLocalized(station.supervisor, "ja")}：帰校可。ただし争議を美しい成功談にしない。赤糸は印と共に残す。`,
        `${fieldworkLocalized(station.supervisor, "en")}: Return certified, but the dispute must not become a tidy success story. Red thread travels with the seal.`,
      );
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
  l("朔月", "新月", "new moon"),
  l("眉月", "三日月", "waxing crescent"),
  l("上弦前", "上弦前", "pre-first-quarter"),
  l("盈凸月", "満ちる凸月", "waxing gibbous"),
  l("滿月", "満月", "full moon"),
  l("虧凸月", "欠ける凸月", "waning gibbous"),
  l("下弦後", "下弦後", "post-last-quarter"),
  l("殘月", "有明月", "waning crescent"),
];

const timeLabels = {
  morning: l("晨間值勤", "朝当番", "morning duty"),
  midday: l("日中值勤", "日中当番", "midday duty"),
  afternoon: l("午後值勤", "午後当番", "afternoon duty"),
  evening: l("暮色值勤", "夕刻当番", "evening duty"),
  night: l("夜間值勤", "夜間当番", "night duty"),
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
      notes.push(l("朔／滿月的第四路標不計入可靠路標。", "新月・満月の第四標識は信頼標識に数えない。", "At new/full moon, marker four does not count as reliable."));
    }
  }
  if (station.travel.terrain === "mountain") {
    if (modeId === "tengu") modifier -= 12;
    if (band === "night" && modeId === "broom") {
      modifier += 18;
      notes.push(l("夜間山區掃帚改走巡邏外緣。", "夜間山域の箒は巡回外縁へ迂回。", "Night brooms detour around the patrol edge."));
    }
  }
  if (station.travel.terrain === "afterlife" && modeId === "foot") {
    modifier += 24;
    notes.push(l("步行時間不含階梯對『向上』的不同意見。", "徒歩時間は階段の「上」への異議を含まない。", "Walking time excludes the stairs' disagreement over 'up'."));
  }
  if (station.travel.terrain === "underground" && modeId === "broom") {
    modifier += 16;
    notes.push(l("地下掃帚空路只在有空的地方算空路。", "地下箒空路は空間がある所だけ空路。", "Underground broom airway is airborne only where there is airspace."));
  }
  if (station.travel.terrain === "boundary" && modeId === "gap") {
    modifier -= 8;
    notes.push(l("境界通行很短；核對附件仍按普通時間。", "境界通行は短いが、附件照合は通常時間。", "Boundary passage is short; annex review uses ordinary time."));
  }
  if (modeId === "tengu") {
    notes.push(l("預計新聞早於抵達九分鐘。", "記事は到着九分前を予定。", "Expected publication is nine minutes before arrival."));
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
  return fieldworkLocalized(l(
    `田野護照正在 ${fieldworkLocalized(station.name)} 值勤；返校線保留至蓋章。`,
    `フィールド旅券は${fieldworkLocalized(station.name, "ja")}で当番中。帰校線は押印まで保持。`,
    `Fieldwork passport is on duty at ${fieldworkLocalized(station.name, "en")}; return line remains until stamping.`,
  ), locale);
}

export function fieldworkCommunityPosts(locale = "zh-Hant") {
  const placements = fieldworkPlacements().slice(-8).reverse();
  return placements.flatMap((placement) => {
    const station = fieldworkStation(placement.stationId);
    const route = `fieldwork-placement-${placement.id}`;
    const base = [{
      id: `fieldwork-dispatch-${placement.id}`,
      category: "course",
      author: locale === "ja" ? "境内実習派遣机" : locale === "en" ? "Domestic Placement Dispatch Desk" : "境內實習派遣桌",
      title: locale === "ja"
        ? `${station.code}・${fieldworkLocalized(station.name, locale)}派遣票`
        : locale === "en"
          ? `${station.code} · ${fieldworkLocalized(station.name, locale)} dispatch`
          : `${station.code}・${fieldworkLocalized(station.name, locale)}派遣票`,
      body: placement.status === "completed"
        ? fieldworkLocalized(l(
          `已返校蓋章；${fieldworkLocalized(placement.review.note)}。`,
          `帰校押印済み。${fieldworkLocalized(placement.review.note, "ja")}。`,
          `Return stamped. ${fieldworkLocalized(placement.review.note, "en")}`,
        ), locale)
        : fieldworkLocalized(l(
          `派遣令已存檔；條件 ${placement.permit.conditions.length} 項。出發前請確認場地今天仍在同一側。`,
          `派遣令保存済み。条件${placement.permit.conditions.length}件。出発前に現地が今日も同じ側か確認。`,
          `Dispatch filed with ${placement.permit.conditions.length} condition(s). Before leaving, verify the site is still on the same side today.`,
        ), locale),
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
        title: fieldworkLocalized(l(
          `${station.code} 回報附件沒有被漂亮地刪掉`,
          `${station.code} 帰還附件はきれいに削除されなかった`,
          `${station.code} return annex was not tidily deleted`,
        ), locale),
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
