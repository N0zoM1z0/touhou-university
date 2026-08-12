import {
  phantasmExamMeta,
  phantasmExamQuestions,
} from "../data/phantasm-exam.js";
import { phantasmIsUnlocked } from "./phantasm-model.js";

const DRAFT_KEY = "tu:phantasm:exam:draft";
const ATTEMPTS_KEY = "tu:phantasm:exam:attempts";
const ORDINARY_ATTEMPTS_KEY = "tu:gaokao:attempts";
const MAX_ATTEMPTS = 24;

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

function dateValue(value, fallback = new Date().toISOString()) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
}

function normalizedAnswers(value = {}) {
  const questionIds = new Set(phantasmExamQuestions.map((question) => question.id));
  return Object.fromEntries(Object.entries(value).filter(([questionId, answer]) =>
    questionIds.has(questionId) && Number.isInteger(answer) && answer >= 0 && answer < 4));
}

function extraAttempts() {
  const records = readJson(ORDINARY_ATTEMPTS_KEY, []);
  return Array.isArray(records)
    ? records.filter((record) => record?.difficultyId === phantasmExamMeta.requiredDifficulty && record?.completedAt)
    : [];
}

export function phantasmExamEligibility() {
  const attempts = extraAttempts().sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  const proof = attempts[0] || null;
  return {
    eligible: Boolean(phantasmIsUnlocked() && proof),
    dreamUnlocked: phantasmIsUnlocked(),
    extraCompleted: Boolean(proof),
    proof: proof ? {
      id: String(proof.id || "EXTRA"),
      trackId: proof.trackId === "science" ? "science" : "humanities",
      score: Number.isFinite(proof.score) ? proof.score : null,
      completedAt: dateValue(proof.completedAt),
    } : null,
  };
}

function normalizedDraft(value = {}) {
  if (!value || value.revision !== phantasmExamMeta.revision) return null;
  return {
    schema: 1,
    revision: phantasmExamMeta.revision,
    paperId: phantasmExamMeta.id,
    answers: normalizedAnswers(value.answers),
    startedAt: dateValue(value.startedAt),
    updatedAt: dateValue(value.updatedAt),
    sourceAttemptId: String(value.sourceAttemptId || ""),
  };
}

export function phantasmExamDraft() {
  return normalizedDraft(readJson(DRAFT_KEY, null));
}

export function startPhantasmExam() {
  const eligibility = phantasmExamEligibility();
  if (!eligibility.eligible) return { error: eligibility.extraCompleted ? "boundary-closed" : "extra-required", eligibility };
  const now = new Date().toISOString();
  const draft = {
    schema: 1,
    revision: phantasmExamMeta.revision,
    paperId: phantasmExamMeta.id,
    answers: {},
    startedAt: now,
    updatedAt: now,
    sourceAttemptId: eligibility.proof.id,
  };
  writeJson(DRAFT_KEY, draft);
  window.dispatchEvent(new CustomEvent("tu:phantasmchange", { detail: { type: "exam-started" } }));
  return { draft };
}

export function savePhantasmExamAnswer(questionId, answer) {
  const draft = phantasmExamDraft();
  if (!draft || !phantasmExamQuestions.some((question) => question.id === questionId)) return { error: "draft" };
  if (!Number.isInteger(answer) || answer < 0 || answer > 3) return { error: "answer" };
  const updated = {
    ...draft,
    answers: { ...draft.answers, [questionId]: answer },
    updatedAt: new Date().toISOString(),
  };
  writeJson(DRAFT_KEY, updated);
  return { draft: updated };
}

export function phantasmExamAttempts() {
  const records = readJson(ATTEMPTS_KEY, []);
  if (!Array.isArray(records)) return [];
  return records.map((record) => ({
    schema: 1,
    revision: Number(record.revision) || 1,
    id: String(record.id || "TU-DREAM-GKE-LEGACY"),
    paperId: String(record.paperId || phantasmExamMeta.id),
    answers: normalizedAnswers(record.answers),
    score: Math.max(0, Number(record.score) || 0),
    correct: Math.max(0, Number(record.correct) || 0),
    startedAt: dateValue(record.startedAt),
    completedAt: dateValue(record.completedAt),
    sourceAttemptId: String(record.sourceAttemptId || ""),
  })).slice(-MAX_ATTEMPTS);
}

export function scorePhantasmExam(answers = {}) {
  const normalized = normalizedAnswers(answers);
  return phantasmExamQuestions.reduce((result, question) => {
    if (normalized[question.id] === question.answer) {
      result.score += question.points;
      result.correct += 1;
    }
    return result;
  }, { score: 0, correct: 0 });
}

export function submitPhantasmExam() {
  const draft = phantasmExamDraft();
  const eligibility = phantasmExamEligibility();
  if (!draft) return { error: "draft" };
  if (!eligibility.eligible) return { error: eligibility.extraCompleted ? "boundary-closed" : "extra-required" };
  const completedAt = new Date().toISOString();
  const scored = scorePhantasmExam(draft.answers);
  const record = {
    ...draft,
    ...scored,
    id: `TU-DREAM-GKE-${Date.now().toString(36).toUpperCase()}`,
    completedAt,
  };
  const records = phantasmExamAttempts();
  records.push(record);
  writeJson(ATTEMPTS_KEY, records.slice(-MAX_ATTEMPTS));
  window.localStorage.removeItem(DRAFT_KEY);
  window.dispatchEvent(new CustomEvent("tu:phantasmchange", { detail: { type: "exam-completed", record } }));
  return { record };
}

export const phantasmExamStorageKeys = {
  draft: DRAFT_KEY,
  attempts: ATTEMPTS_KEY,
};
