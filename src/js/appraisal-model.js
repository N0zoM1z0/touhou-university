import { text as catalogText } from "../generated/i18n/ui/appraisal-model.js";
import {
  appraisalAgencyLevels,
  appraisalDestinations,
  appraisalObject,
  appraisalObjects,
  appraisalReviewers,
} from "../data/appraisal.js";
import { liveCampusSnapshot, liveFacilityStatus } from "../data/live-campus.js";

const DRAFT_KEY = "tu:appraisal:drafts";
const RECORD_KEY = "tu:appraisal:records";
const MAX_RECORDS = 60;

function readJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function unique(values, allowed) {
  const valid = new Set(allowed);
  return [...new Set(Array.isArray(values) ? values.filter((value) => valid.has(value)) : [])];
}

function text(value, maximum = 800) {
  return String(value || "").trim().slice(0, maximum);
}

function dateValue(value, fallback = new Date().toISOString()) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function makeId(objectId, now = new Date()) {
  const stamp = now.toISOString().replace(/\D/g, "").slice(2, 17);
  return `APP-${stamp}-${objectId.slice(0, 4).toUpperCase()}`;
}

function emitChange(detail) {
  window.dispatchEvent(new CustomEvent("tu:appraisalchange", { detail }));
}

function normalizeDraft(objectId, value = {}) {
  const object = appraisalObject(objectId);
  if (!object) return null;
  const evidenceIds = object.evidence.map((item) => item.id);
  const hypothesisIds = object.hypotheses.map((item) => item.id);
  const testIds = object.tests.map((item) => item.id);
  const useIds = object.uses.map((item) => item.id);
  const destinationIds = Object.keys(appraisalDestinations);
  const agencyIds = Object.keys(appraisalAgencyLevels);
  return {
    schema: 2,
    objectId,
    evidenceIds: unique(value.evidenceIds, evidenceIds),
    hypothesisId: hypothesisIds.includes(value.hypothesisId) ? value.hypothesisId : "",
    testIds: unique(value.testIds, testIds).slice(0, 3),
    useId: useIds.includes(value.useId) ? value.useId : "",
    destinationId: destinationIds.includes(value.destinationId) ? value.destinationId : "",
    agencyId: agencyIds.includes(value.agencyId) ? value.agencyId : "watch",
    fieldNote: text(value.fieldNote),
    updatedAt: dateValue(value.updatedAt),
  };
}

export function appraisalDrafts() {
  const stored = readJson(DRAFT_KEY, {});
  return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
}

export function appraisalDraft(objectId) {
  return normalizeDraft(objectId, appraisalDrafts()[objectId] || {});
}

export function saveAppraisalDraft(objectId, patch = {}) {
  const previous = appraisalDraft(objectId);
  if (!previous) return null;
  const next = normalizeDraft(objectId, {
    ...previous,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
  const drafts = appraisalDrafts();
  drafts[objectId] = next;
  writeJson(DRAFT_KEY, drafts);
  emitChange({ type: "draft", objectId });
  return next;
}

export function clearAppraisalDraft(objectId) {
  const drafts = appraisalDrafts();
  if (!drafts[objectId]) return false;
  delete drafts[objectId];
  writeJson(DRAFT_KEY, drafts);
  emitChange({ type: "draft-cleared", objectId });
  return true;
}

function normalizeRecord(record = {}) {
  const object = appraisalObject(record.objectId);
  if (!object || !record.id) return null;
  const draft = normalizeDraft(object.id, record);
  return {
    ...draft,
    schema: Number(record.schema) || 1,
    id: text(record.id, 100),
    createdAt: dateValue(record.createdAt),
    score: Math.max(0, Math.min(100, Number(record.score) || 0)),
    verdict: ["supported", "provisional", "unsupported"].includes(record.verdict) ? record.verdict : "provisional",
    disposition: record.disposition === "contested" ? "contested" : "ordinary",
    reviewerId: appraisalReviewers[record.reviewerId] ? record.reviewerId : null,
    retentionReason: text(record.retentionReason, 600) || null,
    correctionOf: text(record.correctionOf, 100) || null,
    agencyScore: Math.max(0, Math.min(4, Number(record.agencyScore) || 0)),
  };
}

export function appraisalRecords() {
  const records = readJson(RECORD_KEY, []);
  return (Array.isArray(records) ? records : []).map(normalizeRecord).filter(Boolean);
}

export function appraisalRecord(id) {
  return appraisalRecords().find((record) => record.id === id) || null;
}

export function latestAppraisalFor(objectId) {
  return appraisalRecords().filter((record) => record.objectId === objectId).at(-1) || null;
}

export function assessAppraisal(objectId, input = {}) {
  const object = appraisalObject(objectId);
  const draft = normalizeDraft(objectId, input);
  if (!object || !draft) return null;
  const selectedHypothesis = object.hypotheses.find((item) => item.id === draft.hypothesisId);
  const selectedUse = object.uses.find((item) => item.id === draft.useId);
  const evidenceCoverage = draft.evidenceIds.length / object.evidence.length;
  const usefulTests = object.tests
    .filter((item) => draft.testIds.includes(item.id))
    .filter((item) => item.supports.includes(draft.hypothesisId)).length;
  const complete = draft.evidenceIds.length >= 2
    && draft.testIds.length >= 1
    && Boolean(selectedHypothesis && selectedUse && draft.destinationId && draft.agencyId);
  const correct = Boolean(selectedHypothesis?.isIntended);
  const score = Math.min(100, Math.round(
    evidenceCoverage * 35
      + (draft.testIds.length / object.tests.length) * 20
      + Math.min(2, usefulTests) * 7
      + (correct ? 21 : 0)
      + (draft.fieldNote.length >= 24 ? 5 : 0)
      + (draft.destinationId ? 3 : 0)
      + (draft.useId ? 2 : 0),
  ));
  const verdict = !complete
    ? "provisional"
    : correct && draft.evidenceIds.length === object.evidence.length && usefulTests >= 2
      ? "supported"
      : correct
        ? "provisional"
        : "unsupported";
  const agencyScore = Math.max(0, Math.min(4,
    object.agencyBase
      + Number(draft.agencyId === "stirring")
      + Number(draft.agencyId === "objected") * 2
      + Number(draft.destinationId === "kappa" && object.agencyBase >= 2),
  ));
  return {
    object,
    draft,
    selectedHypothesis,
    selectedUse,
    evidenceCoverage,
    usefulTests,
    complete,
    correct,
    score,
    verdict,
    agencyScore,
  };
}

export function completeAppraisal(objectId, input = {}, options = {}, now = new Date()) {
  const assessment = assessAppraisal(objectId, input);
  if (!assessment?.complete) return { error: "incomplete", assessment };
  if (assessment.verdict === "unsupported" && options.disposition !== "contested") {
    return { requiresContested: true, assessment };
  }
  if (options.disposition === "contested") {
    if (!appraisalReviewers[options.reviewerId] || !text(options.retentionReason, 600) || !options.confirmed) {
      return { error: "contested-incomplete", assessment };
    }
  }

  const previous = latestAppraisalFor(objectId);
  const record = normalizeRecord({
    ...assessment.draft,
    schema: 2,
    id: makeId(objectId, now),
    createdAt: now.toISOString(),
    score: assessment.score,
    verdict: assessment.verdict,
    agencyScore: assessment.agencyScore,
    disposition: options.disposition === "contested" ? "contested" : "ordinary",
    reviewerId: options.disposition === "contested" ? options.reviewerId : null,
    retentionReason: options.disposition === "contested" ? options.retentionReason : null,
    correctionOf: previous?.disposition === "contested" && assessment.verdict !== "unsupported" ? previous.id : null,
  });
  const records = appraisalRecords();
  records.push(record);
  writeJson(RECORD_KEY, records.slice(-MAX_RECORDS));
  clearAppraisalDraft(objectId);
  emitChange({ type: "completed", objectId, id: record.id, disposition: record.disposition });
  return { record, assessment };
}

export function appraisalDeskStatus(locale = "zh-Hant", now = new Date()) {
  const state = liveCampusSnapshot(now);
  const library = liveFacilityStatus("library", locale, now);
  const ids = new Set(state.activeEvents.map((event) => event.id));
  const hour = now.getHours();
  const open = Boolean(library?.open && hour >= 9 && hour < 18);
  const weeklyObject = appraisalObjects[(state.day + 77) % appraisalObjects.length];
  let queue = 1 + ((state.seed >>> 4) % 6);
  let notice = catalogText("notice");
  if (ids.has("bookFlock")) {
    queue += 3;
    notice = catalogText("appraisalDeskStatus");
  } else if (ids.has("kappaTape")) {
    queue = Math.max(0, queue - 1);
    notice = catalogText("appraisalDeskStatus.2");
  } else if (ids.has("bambooMist")) {
    notice = catalogText("appraisalDeskStatus.3");
  }
  return {
    open,
    queue,
    weeklyObject,
    notice: notice[locale] || notice["zh-Hant"],
    library,
    dayKey: state.dayKey,
    phase: state.phase,
  };
}

const communityCopy = { "zh-Hant": { author: catalogText("communityCopy.author")["zh-Hant"], contestedAuthor: catalogText("communityCopy.contestedAuthor")["zh-Hant"], supported: catalogText("communityCopy.supported")["zh-Hant"], provisional: catalogText("communityCopy.provisional")["zh-Hant"], contested: catalogText("communityCopy.contested")["zh-Hant"], warning: catalogText("communityCopy.warning")["zh-Hant"], replies: 7 }, "ja": { author: catalogText("communityCopy.author")["ja"], contestedAuthor: catalogText("communityCopy.contestedAuthor")["ja"], supported: catalogText("communityCopy.supported")["ja"], provisional: catalogText("communityCopy.provisional")["ja"], contested: catalogText("communityCopy.contested")["ja"], warning: catalogText("communityCopy.warning")["ja"], replies: 7 }, "en": { author: catalogText("communityCopy.author")["en"], contestedAuthor: catalogText("communityCopy.contestedAuthor")["en"], supported: catalogText("communityCopy.supported")["en"], provisional: catalogText("communityCopy.provisional")["en"], contested: catalogText("communityCopy.contested")["en"], warning: catalogText("communityCopy.warning")["en"], replies: 7 } };

export function appraisalCommunityPosts(locale = "zh-Hant") {
  const c = communityCopy[locale] || communityCopy["zh-Hant"];
  return appraisalRecords().slice(-8).reverse().map((record, index) => {
    const object = appraisalObject(record.objectId);
    const hypothesis = object?.hypotheses.find((item) => item.id === record.hypothesisId);
    const useChoice = object?.uses.find((item) => item.id === record.useId);
    const destination = appraisalDestinations[record.destinationId];
    const contested = record.disposition === "contested";
    const status = contested ? c.contested : record.verdict === "supported" ? c.supported : c.provisional;
    return {
      id: `appraisal-${record.id}`,
      category: contested ? "notice" : record.destinationId === "kourindou" ? "market" : "course",
      author: contested ? c.contestedAuthor : c.author,
      title: `${status}：${object?.name?.[locale] || record.objectId}`,
      body: `${hypothesis?.claim?.[locale] || ""} ${useChoice?.note?.[locale] || ""} ${destination?.note?.[locale] || ""}${contested ? ` ${c.warning}` : ""}`.trim(),
      replies: c.replies + index + record.agencyScore,
      createdAt: record.createdAt,
      generated: true,
      appraisal: true,
      contested,
      appraisalRoute: `appraisal-record-${record.id}`,
    };
  });
}

export function appraisalStats() {
  const records = appraisalRecords();
  return {
    records: records.length,
    contested: records.filter((record) => record.disposition === "contested").length,
    supported: records.filter((record) => record.verdict === "supported").length,
    drafts: Object.keys(appraisalDrafts()).length,
  };
}

export const appraisalStorageKeys = {
  drafts: DRAFT_KEY,
  records: RECORD_KEY,
};
