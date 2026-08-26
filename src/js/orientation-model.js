import {
  orientationFirstStop,
  orientationNoticePlan,
  orientationSchoolDestinations,
  orientationStopSignal,
} from "../data/orientation.js";
import { findCampusRoute, transportModes } from "../data/routes.js";
import { schools } from "../data/schools.js";
import { campusRoutingState } from "./campus-routing.js";

const DOSSIER_KEY = "tu:orientation:dossiers";
const IDENTITY_KEY = "tu:identity";
const APPLICATION_KEY = "tu:application:submissions";
const REVIEW_KEY = "tu:application:reviews";
const MAX_DOSSIERS = 20;

function storage() {
  return globalThis.window?.localStorage ?? globalThis.localStorage;
}

function readJson(key, fallback) {
  try {
    return JSON.parse(storage()?.getItem(key) ?? "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  storage()?.setItem(key, JSON.stringify(value));
}

function emit(reason, detail = {}) {
  globalThis.window?.dispatchEvent?.(new CustomEvent("tu:orientationchange", {
    detail: { reason, ...detail },
  }));
}

function validDate(value, fallback = null) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function makeId(now, sequence) {
  const stamp = now.toISOString().replace(/\D/g, "").slice(0, 14);
  return `TU-FIRST-${stamp}-${String(sequence).padStart(2, "0")}`;
}

function normalizeRoute(value = null) {
  if (!value || !transportModes[value.modeId] || typeof value.destinationId !== "string") return null;
  const path = Array.isArray(value.path) ? value.path.filter((entry) => typeof entry === "string") : [];
  return {
    modeId: value.modeId,
    destinationId: value.destinationId,
    path,
    minutes: Number.isFinite(Number(value.minutes)) ? Math.max(0, Number(value.minutes)) : 0,
    walkingMinutes: Number.isFinite(Number(value.walkingMinutes)) ? Math.max(0, Number(value.walkingMinutes)) : 0,
    distance: Number.isFinite(Number(value.distance)) ? Math.max(0, Number(value.distance)) : 0,
    confirmedAt: validDate(value.confirmedAt),
  };
}

function normalizeBoundary(value = null) {
  if (!value || !orientationStopSignal(value.signalId) || !orientationNoticePlan(value.noticeId)) return null;
  return {
    signalId: value.signalId,
    noticeId: value.noticeId,
    confirmedAt: validDate(value.confirmedAt),
  };
}

function normalizeDossier(value = {}) {
  const firstStopId = orientationFirstStop(value.firstStopId)?.id || null;
  const completedAt = validDate(value.completedAt);
  return {
    schema: 1,
    id: typeof value.id === "string" ? value.id : "",
    identityId: typeof value.identityId === "string" ? value.identityId : "",
    applicationId: typeof value.applicationId === "string" ? value.applicationId : "",
    reviewId: typeof value.reviewId === "string" ? value.reviewId : "",
    schoolId: schools[value.schoolId] ? value.schoolId : "boundary",
    status: completedAt && firstStopId ? "matriculated" : "open",
    admissionOutcome: value.admissionOutcome === "admitted" ? "admitted" : "conditional",
    arrival: normalizeRoute(value.arrival),
    boundary: normalizeBoundary(value.boundary),
    firstStopId,
    createdAt: validDate(value.createdAt, new Date(0).toISOString()),
    updatedAt: validDate(value.updatedAt, value.createdAt || new Date(0).toISOString()),
    completedAt,
  };
}

export function orientationEligibility() {
  const identity = readJson(IDENTITY_KEY, null);
  const applications = readJson(APPLICATION_KEY, []);
  const reviews = readJson(REVIEW_KEY, []);
  const application = (Array.isArray(applications) ? applications : []).at(-1) || null;
  const review = application
    ? (Array.isArray(reviews) ? reviews : []).filter((entry) => entry?.applicationId === application.id).at(-1) || null
    : null;
  const outcome = review?.outcome || null;
  let status = "identity-missing";
  if (identity && !application) status = "application-missing";
  else if (identity && application && !review) status = "review-missing";
  else if (identity && application && outcome === "conditional") status = "conditional";
  else if (identity && application && outcome === "admitted") status = "admitted";
  else if (identity && application && review) status = "not-admitted";
  return {
    identity,
    application,
    review,
    outcome,
    status,
    eligible: status === "admitted",
  };
}

export function orientationDossiers() {
  const records = readJson(DOSSIER_KEY, []);
  return (Array.isArray(records) ? records : [])
    .map(normalizeDossier)
    .filter((record) => record.id && record.identityId && record.applicationId)
    .slice(-MAX_DOSSIERS);
}

export function orientationDossier(id) {
  return orientationDossiers().find((record) => record.id === id) || null;
}

export function activeOrientationDossier() {
  const context = orientationEligibility();
  if (!context.identity || !context.application) return null;
  return orientationDossiers()
    .filter((record) => record.identityId === context.identity.id && record.applicationId === context.application.id)
    .at(-1) || null;
}

export function startOrientationDossier(now = new Date()) {
  const context = orientationEligibility();
  if (!context.eligible) return { error: context.status, context };
  const existing = activeOrientationDossier();
  if (existing) return { dossier: existing, context };
  const records = orientationDossiers();
  const dossier = normalizeDossier({
    id: makeId(now, records.length + 1),
    identityId: context.identity.id,
    applicationId: context.application.id,
    reviewId: context.review.id,
    schoolId: context.review.school || context.application.school || context.identity.preferredSchool,
    admissionOutcome: context.review.outcome,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  });
  records.push(dossier);
  writeJson(DOSSIER_KEY, records.slice(-MAX_DOSSIERS));
  emit("dossier-opened", { dossierId: dossier.id });
  return { dossier, context };
}

function updateDossier(id, updater) {
  const records = orientationDossiers();
  const index = records.findIndex((record) => record.id === id);
  if (index < 0) return null;
  records[index] = normalizeDossier(updater(records[index]));
  writeJson(DOSSIER_KEY, records);
  return records[index];
}

export function confirmOrientationArrival(id, modeId, now = new Date()) {
  const dossier = orientationDossier(id);
  if (!dossier) return { error: "missing-dossier" };
  if (dossier.status === "matriculated") return { error: "already-complete", dossier };
  if (!transportModes[modeId]) return { error: "unknown-mode", dossier };
  const destinationId = orientationSchoolDestinations[dossier.schoolId] || "boundary";
  const state = campusRoutingState(now);
  const route = findCampusRoute("gate", destinationId, modeId, state.routeRules);
  if (!route) return { error: "route-closed", dossier, state };
  const updated = updateDossier(id, (record) => ({
    ...record,
    arrival: {
      modeId,
      destinationId,
      path: route.path,
      minutes: route.minutes,
      walkingMinutes: route.walkingMinutes,
      distance: route.distance,
      confirmedAt: now.toISOString(),
    },
    updatedAt: now.toISOString(),
  }));
  emit("arrival-confirmed", { dossierId: id, modeId, destinationId });
  return { dossier: updated, state };
}

export function confirmOrientationBoundary(id, { signalId, noticeId }, now = new Date()) {
  const dossier = orientationDossier(id);
  if (!dossier) return { error: "missing-dossier" };
  if (dossier.status === "matriculated") return { error: "already-complete", dossier };
  if (!dossier.arrival) return { error: "arrival-required", dossier };
  if (!orientationStopSignal(signalId) || !orientationNoticePlan(noticeId)) {
    return { error: "unknown-boundary", dossier };
  }
  const updated = updateDossier(id, (record) => ({
    ...record,
    boundary: { signalId, noticeId, confirmedAt: now.toISOString() },
    updatedAt: now.toISOString(),
  }));
  emit("boundary-confirmed", { dossierId: id, signalId, noticeId });
  return { dossier: updated };
}

export function completeOrientation(id, firstStopId, now = new Date()) {
  const dossier = orientationDossier(id);
  if (!dossier) return { error: "missing-dossier" };
  if (dossier.status === "matriculated") return { dossier };
  if (!dossier.arrival || !dossier.boundary) return { error: "steps-required", dossier };
  if (!orientationFirstStop(firstStopId)) return { error: "first-stop-required", dossier };
  const updated = updateDossier(id, (record) => ({
    ...record,
    firstStopId,
    status: "matriculated",
    completedAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }));
  emit("first-bell-rung", { dossierId: id, firstStopId });
  return { dossier: updated };
}

export function orientationCommunityPosts(locale = "zh-Hant") {
  const copies = {
    "zh-Hant": {
      office: "新生到着室",
      opened: "新生報到卷已開封；博麗門仍不承認「已寄出」等於「已到達」",
      openedBody: "報到卷會另外核對入門路線、本人能辨認的停止信號與第一站；姓名不進入公開看板。",
      complete: "第一鐘新增一份到着記錄；阿求拒絕公開新生通稱",
      completeBody: "路線與退路已分欄封存。文文。新聞取得總數，沒有取得本機學籍內容。",
    },
    ja: {
      office: "新入生到着室",
      opened: "新入生手続票を開封。博麗門は「発送済み」を「到着済み」と認めず",
      openedBody: "入門経路、本人が識別できる停止合図、最初の行先を別々に確認します。氏名は公開掲示へ出ません。",
      complete: "第一鐘に新たな到着記録。阿求は新入生の通称公開を拒否",
      completeBody: "経路と退路は別欄で保存。文々。新聞が得るのは総数だけで、端末内学籍は渡しません。",
    },
    en: {
      office: "New Student Arrival Office",
      opened: "A new arrival file opens; Hakurei Gate still rejects ‘sent’ as proof of ‘arrived’",
      openedBody: "The file separately checks the entry route, a stop signal the student can recognise, and the first destination. Names do not enter the public board.",
      complete: "First Bell gains one arrival record; Akyuu refuses to publish the newcomer’s name",
      completeBody: "Route and way back remain separate fields. Bunbunmaru receives a count, not the on-device student record.",
    },
  };
  const labels = copies[locale] || copies["zh-Hant"];
  return orientationDossiers().slice(-5).reverse().map((dossier, index) => ({
    id: `orientation-${dossier.status}-${dossier.id}`,
    category: "notice",
    author: labels.office,
    title: dossier.status === "matriculated" ? labels.complete : labels.opened,
    body: dossier.status === "matriculated" ? labels.completeBody : labels.openedBody,
    replies: 5 + index + (dossier.status === "matriculated" ? 7 : 0),
    createdAt: dossier.completedAt || dossier.createdAt,
    generated: true,
    orientation: true,
    orientationRoute: `orientation-dossier-${dossier.id}`,
  }));
}

export function orientationStats() {
  const records = orientationDossiers();
  return {
    total: records.length,
    open: records.filter(({ status }) => status === "open").length,
    matriculated: records.filter(({ status }) => status === "matriculated").length,
  };
}

export const orientationStorageKeys = Object.freeze({ dossiers: DOSSIER_KEY });
