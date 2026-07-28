import { schools } from "../data/schools.js";
import { courseByCode } from "../data/courses.js";
import {
  alumniChapter,
  alumniChapters,
  alumniStories,
  careerOpening,
  careerOpenings,
  careersLocalized,
  graduationTrack,
} from "../data/careers.js";
import { campusDayKey, campusLunarPhase, campusTimeBand } from "../data/campus-time.js";
import {
  academicDefences,
  academicExamAttempts,
  academicGradebook,
  academicSubmissions,
} from "./academic-model.js";
import { ethicsProtocols } from "./ethics-model.js";
import { fieldworkPassportSummary } from "./fieldwork-model.js";
import { housingAssignments } from "./housing-model.js";
import { incidentResolutions } from "./incident-model.js";
import { propertyClaims } from "./property-model.js";

const AUDITS_KEY = "tu:graduation:audits";
const DEGREES_KEY = "tu:graduation:degrees";
const CAREER_DRAFT_KEY = "tu:careers:draft";
const CAREER_PLANS_KEY = "tu:careers:plans";
const ALUMNI_PROFILE_KEY = "tu:alumni:profile";
const MAX_RECORDS = 40;

const l = (zhHant, ja, en) => ({ "zh-Hant": zhHant, ja, en });

export const careersStorageKeys = Object.freeze({
  audits: AUDITS_KEY,
  degrees: DEGREES_KEY,
  draft: CAREER_DRAFT_KEY,
  plans: CAREER_PLANS_KEY,
  alumni: ALUMNI_PROFILE_KEY,
});

function readJson(key, fallback) {
  try {
    return JSON.parse(globalThis.localStorage?.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  globalThis.localStorage?.setItem(key, JSON.stringify(value));
}

function emit(reason, detail = {}) {
  globalThis.window?.dispatchEvent(new CustomEvent("tu:careerschange", {
    detail: { reason, ...detail },
  }));
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
  return `${prefix}-${now.getFullYear()}-${String(sequence).padStart(3, "0")}-${hashValue(`${prefix}:${now.toISOString()}:${sequence}`).toString(36).toUpperCase()}`;
}

function text(value, maximum = 1_600) {
  return String(value || "").trim().slice(0, maximum);
}

function values(value) {
  return [...new Set((Array.isArray(value) ? value : []).map((entry) => text(entry, 100)).filter(Boolean))];
}

function validDate(value, fallback = new Date().toISOString()) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function schoolEntry(id) {
  return Object.hasOwn(schools, id) ? schools[id] : schools.boundary;
}

function transcriptEntries() {
  const raw = readJson("tu:courses:transcript", []);
  const entries = Array.isArray(raw) ? raw : raw?.entries;
  return (Array.isArray(entries) ? entries : [])
    .filter((entry) => courseByCode(entry?.courseCode))
    .map((entry) => ({
      courseCode: entry.courseCode,
      grade: text(entry.grade, 8) || "P",
      status: text(entry.status, 30) || "completed",
      completedAt: entry.completedAt ? validDate(entry.completedAt) : null,
    }));
}

function passingTranscript() {
  return transcriptEntries().filter((entry) => entry.status !== "failed" && entry.grade !== "F");
}

function activeLibraryLoans() {
  const records = readJson("tu:library:loans", []);
  return (Array.isArray(records) ? records : []).filter((entry) => entry?.status === "active");
}

function activeRoomChanges() {
  const records = readJson("tu:housing:room-changes", []);
  return (Array.isArray(records) ? records : []).filter((entry) => ["under-review", "pending"].includes(entry?.status));
}

function unresolvedIncidentCount() {
  return incidentResolutions().filter((entry) => entry.disposition === "contested").length;
}

function dreamTrace() {
  const records = readJson("tu:phantasm:transcripts", []);
  const count = Array.isArray(records) ? records.length : 0;
  return {
    count,
    reverseCredits: count ? (count % 2 === 0 ? 3 : -3) : 0,
  };
}

function requirement(id, status, evidence = {}) {
  return { id, status, ...evidence };
}

function normalizeAuditInput(value = {}) {
  const schoolId = Object.hasOwn(schools, value.schoolId) ? value.schoolId : "boundary";
  const school = schoolEntry(schoolId);
  const schoolCodes = school.courses.map(([code]) => code);
  const priorCredits = Math.max(0, Math.min(Number(school.credits), Number(value.priorCredits) || 0));
  return {
    schoolId,
    trackId: graduationTrack(value.trackId).id,
    enrolmentYear: Math.max(1, Math.min(9999, Number(value.enrolmentYear) || 142)),
    graduationYear: Math.max(1, Math.min(9999, Number(value.graduationYear) || 146)),
    priorCredits,
    archivedCoreCodes: values(value.archivedCoreCodes).filter((code) => schoolCodes.includes(code)),
    provenance: text(value.provenance),
    libraryDisputeNote: text(value.libraryDisputeNote),
    checkoutPlan: text(value.checkoutPlan),
    unresolvedNote: text(value.unresolvedNote),
    acceptsAttachments: Boolean(value.acceptsAttachments),
    unresolvedQuestion: text(value.unresolvedQuestion),
  };
}

export function graduationEvidence(value = {}) {
  const input = normalizeAuditInput(value);
  const school = schoolEntry(input.schoolId);
  const requiredCredits = Number(school.credits);
  const transcript = passingTranscript();
  const completedCodes = new Set(transcript.map((entry) => entry.courseCode));
  const transcriptCredits = transcript.reduce((sum, entry) => sum + (courseByCode(entry.courseCode)?.credits || 0), 0);
  const earnedCredits = Math.min(requiredCredits, transcriptCredits + input.priorCredits);
  const requiredCoreCodes = school.courses.map(([code]) => code);
  const recognizedCoreCodes = [...new Set([
    ...requiredCoreCodes.filter((code) => completedCodes.has(code)),
    ...input.archivedCoreCodes,
  ])];
  const assignments = academicSubmissions();
  const exams = academicExamAttempts();
  const passingAssignments = assignments.filter((entry) => Number(entry.percent) >= 60);
  const passingExams = exams.filter((entry) => Number(entry.percent) >= 60);
  const defences = academicDefences();
  const latestDefence = defences.at(-1) || null;
  const protocols = ethicsProtocols().filter((entry) => entry.status !== "withdrawn");
  const latestProtocol = protocols.at(-1) || null;
  const passport = fieldworkPassportSummary();
  const loans = activeLibraryLoans();
  const assignment = housingAssignments().findLast((entry) => entry.status === "active") || null;
  const roomChanges = activeRoomChanges();
  const openClaims = propertyClaims().filter((entry) => entry.status !== "resolved");
  const contestedIncidents = unresolvedIncidentCount();
  const chronologyReversed = input.graduationYear < input.enrolmentYear;
  const hasPriorEvidence = input.priorCredits === 0 && !input.archivedCoreCodes.length
    ? true
    : input.provenance.length >= 18;
  const requirements = [
    requirement(
      "credits",
      earnedCredits >= requiredCredits && recognizedCoreCodes.length === requiredCoreCodes.length && hasPriorEvidence ? "clear" : "missing",
      {
        current: earnedCredits,
        target: requiredCredits,
        transcriptCredits,
        priorCredits: input.priorCredits,
        requiredCoreCodes,
        recognizedCoreCodes,
        provenanceAttached: hasPriorEvidence,
      },
    ),
    requirement(
      "methods",
      passingAssignments.length && passingExams.length ? "clear" : "missing",
      {
        assignments: passingAssignments.length,
        exams: passingExams.length,
        average: academicGradebook().average,
      },
    ),
    requirement(
      "defence",
      latestDefence?.outcome === "passed" ? "clear"
        : latestDefence?.outcome === "conditional" ? "conditional"
          : "missing",
      {
        defenceId: latestDefence?.id || null,
        outcome: latestDefence?.outcome || "none",
        percent: latestDefence?.percent ?? null,
      },
    ),
    requirement(
      "ethics",
      latestProtocol?.outcome === "approved" ? "clear"
        : ["conditional", "contested"].includes(latestProtocol?.outcome) ? "conditional"
          : "missing",
      {
        protocolId: latestProtocol?.id || null,
        outcome: latestProtocol?.outcome || "none",
        activeProtocols: protocols.length,
      },
    ),
    requirement(
      "fieldwork",
      passport.distinctStations > 0
        ? passport.contested > 0 ? "conditional" : "clear"
        : "missing",
      {
        distinctStations: passport.distinctStations,
        visits: passport.totalVisits,
        credits: passport.credits,
        contested: passport.contested,
      },
    ),
    requirement(
      "library",
      loans.length === 0 ? "clear"
        : input.acceptsAttachments && input.libraryDisputeNote.length >= 18 ? "contested"
          : "missing",
      {
        activeLoans: loans.length,
        loanIds: loans.map((entry) => entry.id),
        disputeAttached: input.libraryDisputeNote.length >= 18,
      },
    ),
    requirement(
      "housing",
      !assignment && !roomChanges.length ? "clear"
        : input.acceptsAttachments && input.checkoutPlan.length >= 18 ? "conditional"
          : "missing",
      {
        assignmentId: assignment?.id || null,
        roomChanges: roomChanges.length,
        checkoutAttached: input.checkoutPlan.length >= 18,
      },
    ),
    requirement(
      "disputes",
      openClaims.length === 0 && contestedIncidents === 0 && !chronologyReversed ? "clear"
        : input.acceptsAttachments && input.unresolvedNote.length >= 18 ? "contested"
          : (chronologyReversed && input.trackId === "chronology-dispute" ? "contested" : "missing"),
      {
        openClaims: openClaims.length,
        contestedIncidents,
        chronologyReversed,
        chronologyTrack: input.trackId === "chronology-dispute",
        attachment: input.unresolvedNote.length >= 18,
      },
    ),
  ];
  const missing = requirements.filter(({ status }) => status === "missing").length;
  const conditional = requirements.filter(({ status }) => status === "conditional").length;
  const contested = requirements.filter(({ status }) => status === "contested").length;
  return {
    input,
    schoolId: input.schoolId,
    requiredCredits,
    earnedCredits,
    requirements,
    missing,
    conditional,
    contested,
    outcome: missing ? "not-ready" : contested ? "contested" : conditional ? "conditional" : "ready",
    canIssue: missing === 0,
    dream: dreamTrace(),
  };
}

function normalizeAudit(value = {}) {
  if (!value?.id || !value?.input || !Array.isArray(value.requirements)) return null;
  return {
    schema: 1,
    id: text(value.id, 120),
    studentId: text(value.studentId, 120) || "student-local",
    studentName: text(value.studentName, 160),
    requestedAt: validDate(value.requestedAt),
    schoolId: Object.hasOwn(schools, value.schoolId) ? value.schoolId : "boundary",
    input: normalizeAuditInput(value.input),
    requiredCredits: Math.max(0, Number(value.requiredCredits) || 0),
    earnedCredits: Math.max(0, Number(value.earnedCredits) || 0),
    requirements: value.requirements.map((entry) => ({ ...entry })),
    missing: Math.max(0, Number(value.missing) || 0),
    conditional: Math.max(0, Number(value.conditional) || 0),
    contested: Math.max(0, Number(value.contested) || 0),
    outcome: ["not-ready", "conditional", "contested", "ready"].includes(value.outcome) ? value.outcome : "not-ready",
    canIssue: Boolean(value.canIssue),
    dream: {
      count: Math.max(0, Number(value.dream?.count) || 0),
      reverseCredits: Number(value.dream?.reverseCredits) || 0,
    },
    degreeId: text(value.degreeId, 120) || null,
  };
}

export function graduationAudits() {
  const records = readJson(AUDITS_KEY, []);
  return (Array.isArray(records) ? records : []).map(normalizeAudit).filter(Boolean);
}

export function graduationAudit(id) {
  return graduationAudits().find((entry) => entry.id === id) || null;
}

export function requestGraduationAudit(value = {}, now = new Date()) {
  const identity = readJson("tu:identity", null);
  if (!identity?.id) return { error: "identity" };
  const evidence = graduationEvidence(value);
  if ((evidence.input.priorCredits > 0 || evidence.input.archivedCoreCodes.length) && evidence.input.provenance.length < 18) {
    return { error: "provenance", evidence };
  }
  if (evidence.input.unresolvedQuestion.length < 12) return { error: "question", evidence };
  const records = graduationAudits();
  const record = normalizeAudit({
    schema: 1,
    id: makeId("TU-GR-A", now, records.length + 1),
    studentId: identity.id,
    studentName: identity.name || identity.displayName || "",
    requestedAt: now.toISOString(),
    ...evidence,
  });
  writeJson(AUDITS_KEY, [...records, record].slice(-MAX_RECORDS));
  emit("audit-requested", { auditId: record.id, outcome: record.outcome });
  return { record };
}

function normalizeDegree(value = {}) {
  if (!value?.id || !value?.auditId) return null;
  return {
    schema: 1,
    id: text(value.id, 120),
    auditId: text(value.auditId, 120),
    studentId: text(value.studentId, 120),
    studentName: text(value.studentName, 160),
    schoolId: Object.hasOwn(schools, value.schoolId) ? value.schoolId : "boundary",
    trackId: graduationTrack(value.trackId).id,
    standing: ["clear", "conditional", "contested"].includes(value.standing) ? value.standing : "conditional",
    issuedAt: validDate(value.issuedAt),
    degreeNumber: text(value.degreeNumber, 120),
    unresolvedQuestion: text(value.unresolvedQuestion),
    attachments: values(value.attachments),
    dream: {
      count: Math.max(0, Number(value.dream?.count) || 0),
      reverseCredits: Number(value.dream?.reverseCredits) || 0,
    },
  };
}

export function graduationDegrees() {
  const records = readJson(DEGREES_KEY, []);
  return (Array.isArray(records) ? records : []).map(normalizeDegree).filter(Boolean);
}

export function graduationDegree(id) {
  return graduationDegrees().find((entry) => entry.id === id) || null;
}

export function issueGraduationDegree(auditId, acceptsConditions = false, now = new Date()) {
  const audits = graduationAudits();
  const auditIndex = audits.findIndex((entry) => entry.id === auditId);
  const audit = audits[auditIndex];
  if (!audit) return { error: "audit" };
  if (!audit.canIssue) return { error: "not-ready", audit };
  if ((audit.conditional || audit.contested) && !acceptsConditions) return { error: "conditions", audit };
  const degrees = graduationDegrees();
  if (audit.degreeId || degrees.some((entry) => entry.auditId === audit.id)) return { error: "already-issued", audit };
  const standing = audit.contested ? "contested" : audit.conditional ? "conditional" : "clear";
  const record = normalizeDegree({
    schema: 1,
    id: makeId("TU-GR-D", now, degrees.length + 1),
    auditId: audit.id,
    studentId: audit.studentId,
    studentName: audit.studentName,
    schoolId: audit.schoolId,
    trackId: audit.input.trackId,
    standing,
    issuedAt: now.toISOString(),
    degreeNumber: `TU-${schoolEntry(audit.schoolId).code}-卒-${now.getFullYear()}-${String(degrees.length + 1).padStart(3, "0")}`,
    unresolvedQuestion: audit.input.unresolvedQuestion,
    attachments: audit.requirements.filter(({ status }) => ["conditional", "contested"].includes(status)).map(({ id }) => id),
    dream: audit.dream,
  });
  audits[auditIndex] = { ...audit, degreeId: record.id };
  writeJson(AUDITS_KEY, audits);
  writeJson(DEGREES_KEY, [...degrees, record].slice(-MAX_RECORDS));
  emit("degree-issued", { degreeId: record.id, auditId: audit.id, standing });
  return { record, audit: audits[auditIndex] };
}

export function defaultCareerDraft() {
  const degree = graduationDegrees().at(-1);
  return {
    schoolId: degree?.schoolId || readJson("tu:identity", null)?.preferredSchool || "boundary",
    domainIds: ["field", "archive"],
    scheduleId: "day",
    compensationId: "yen",
    travelId: "foot",
    chaosTolerance: 2,
    refusal: "",
    question: "",
  };
}

function normalizeCareerDraft(value = {}) {
  const source = { ...defaultCareerDraft(), ...value };
  const domainIds = values(source.domainIds).filter((id) =>
    careerOpenings.some((opening) => opening.domains.includes(id)));
  return {
    schoolId: Object.hasOwn(schools, source.schoolId) ? source.schoolId : "boundary",
    domainIds: domainIds.length ? domainIds.slice(0, 4) : ["field"],
    scheduleId: ["day", "dawn", "dusk", "night", "lunar", "nonlinear"].includes(source.scheduleId) ? source.scheduleId : "day",
    compensationId: ["yen", "offerings", "tea", "cucumber", "rice", "faith", "coal", "barter"].includes(source.compensationId)
      ? source.compensationId : "yen",
    travelId: ["foot", "broom", "tengu", "shuttle", "ferry"].includes(source.travelId) ? source.travelId : "foot",
    chaosTolerance: Math.max(1, Math.min(4, Number(source.chaosTolerance) || 2)),
    refusal: text(source.refusal),
    question: text(source.question),
  };
}

export function careerDraft() {
  return normalizeCareerDraft(readJson(CAREER_DRAFT_KEY, null) || defaultCareerDraft());
}

export function saveCareerDraft(value = {}) {
  const record = normalizeCareerDraft(value);
  writeJson(CAREER_DRAFT_KEY, record);
  emit("career-draft", {});
  return record;
}

function evidenceSignals() {
  const book = academicGradebook();
  const passport = fieldworkPassportSummary();
  const protocols = ethicsProtocols().filter((entry) => entry.status !== "withdrawn");
  const degrees = graduationDegrees();
  return {
    academic: book.graded.length,
    fieldwork: passport.distinctStations,
    ethics: protocols.length,
    degree: degrees.length,
  };
}

export function careerMatches(value = {}, locale = "zh-Hant") {
  const profile = normalizeCareerDraft(value);
  const evidence = evidenceSignals();
  return careerOpenings.map((opening) => {
    const reasons = [];
    const cautions = [];
    let affinity = 0;
    if (opening.schoolIds.includes(profile.schoolId)) {
      affinity += 3;
      reasons.push(l("學院方法直接相合", "学部方法が直接一致", "School methods align directly"));
    }
    const domainMatches = opening.domains.filter((id) => profile.domainIds.includes(id));
    affinity += domainMatches.length * 2;
    if (domainMatches.length) reasons.push(l("偏好工作領域重疊", "希望領域が重複", "Preferred domains overlap"));
    if (opening.schedule === profile.scheduleId || profile.scheduleId === "nonlinear") {
      affinity += 1;
      reasons.push(l("能接受此出勤校鐘", "勤務校鐘に対応", "Duty bell is acceptable"));
    } else {
      cautions.push(l("出勤校鐘需要另談", "勤務校鐘は要相談", "Duty bell needs negotiation"));
    }
    if (opening.travel === profile.travelId) {
      affinity += 1;
      reasons.push(l("熟悉主要通勤方式", "主通勤手段に慣れている", "Primary commute is familiar"));
    }
    if (opening.compensation === profile.compensationId) {
      affinity += 1;
      reasons.push(l("報酬形式與偏好一致", "報酬形式が希望と一致", "Compensation form aligns"));
    } else if (opening.compensation !== "yen") {
      cautions.push(l("報酬不一定以日圓出現", "報酬は円とは限らない", "Compensation may not appear as yen"));
    }
    if (opening.chaos > profile.chaosTolerance) {
      cautions.push(l("現場麻煩高於自報承受度", "現場混乱が自己申告許容度超過", "Trouble exceeds stated tolerance"));
    } else {
      affinity += 1;
    }
    if (evidence.fieldwork && opening.domains.includes("field")) reasons.push(l("田野護照可作證", "フィールド旅券が証拠", "Field passport supplies evidence"));
    if (evidence.ethics && opening.domains.includes("research")) reasons.push(l("倫理卷宗可作證", "倫理記録が証拠", "Ethics file supplies evidence"));
    if (evidence.academic && ["archive", "research", "teaching"].some((id) => opening.domains.includes(id))) {
      reasons.push(l("方法作業與考試可作證", "方法課題・試験が証拠", "Methods work and exams supply evidence"));
    }
    if (!evidence.degree) cautions.push(l("可先諮詢；正式校友推薦須待學位開封", "相談可、校友推薦は学位開封後", "Consultation is open; alumni referral waits for a degree"));
    const band = opening.chaos > profile.chaosTolerance + 1
      ? "incident"
      : affinity >= 7 ? "recommended" : affinity >= 4 ? "promising" : "conversation";
    return {
      openingId: opening.id,
      affinity,
      band,
      reasons: reasons.map((entry) => careersLocalized(entry, locale)),
      cautions: cautions.map((entry) => careersLocalized(entry, locale)),
    };
  }).sort((a, b) => b.affinity - a.affinity || a.openingId.localeCompare(b.openingId));
}

function normalizeCareerPlan(value = {}) {
  if (!value?.id || !value?.profile) return null;
  return {
    schema: 1,
    id: text(value.id, 120),
    studentId: text(value.studentId, 120) || "student-local",
    createdAt: validDate(value.createdAt),
    profile: normalizeCareerDraft(value.profile),
    matches: (Array.isArray(value.matches) ? value.matches : []).filter((entry) => careerOpening(entry?.openingId)).map((entry) => ({
      openingId: entry.openingId,
      affinity: Number(entry.affinity) || 0,
      band: ["recommended", "promising", "conversation", "incident"].includes(entry.band) ? entry.band : "conversation",
      reasons: values(entry.reasons),
      cautions: values(entry.cautions),
    })),
    referrals: (Array.isArray(value.referrals) ? value.referrals : []).filter((entry) => careerOpening(entry?.openingId)).map((entry) => ({
      id: text(entry.id, 120),
      openingId: entry.openingId,
      note: text(entry.note),
      sentAt: validDate(entry.sentAt),
      status: "sent",
    })),
  };
}

export function careerPlans() {
  const records = readJson(CAREER_PLANS_KEY, []);
  return (Array.isArray(records) ? records : []).map(normalizeCareerPlan).filter(Boolean);
}

export function careerPlan(id) {
  return careerPlans().find((entry) => entry.id === id) || null;
}

export function submitCareerPlan(value = {}, locale = "zh-Hant", now = new Date()) {
  const profile = normalizeCareerDraft(value);
  if (profile.refusal.length < 8) return { error: "refusal", profile };
  if (profile.question.length < 8) return { error: "question", profile };
  const identity = readJson("tu:identity", null);
  const records = careerPlans();
  const record = normalizeCareerPlan({
    schema: 1,
    id: makeId("TU-CR-P", now, records.length + 1),
    studentId: identity?.id || "student-local",
    createdAt: now.toISOString(),
    profile,
    matches: careerMatches(profile, locale).slice(0, 5),
    referrals: [],
  });
  writeJson(CAREER_PLANS_KEY, [...records, record].slice(-MAX_RECORDS));
  writeJson(CAREER_DRAFT_KEY, profile);
  emit("career-plan", { planId: record.id });
  return { record };
}

export function sendCareerReferral(planId, openingId, note, now = new Date()) {
  const opening = careerOpening(openingId);
  const plans = careerPlans();
  const index = plans.findIndex((entry) => entry.id === planId);
  if (!opening || index < 0) return { error: "missing" };
  const message = text(note);
  if (message.length < 12) return { error: "note" };
  const existing = plans[index].referrals.find((entry) => entry.openingId === openingId);
  if (existing) return { error: "already-sent", referral: existing };
  const referral = {
    id: makeId("TU-CR-R", now, plans[index].referrals.length + 1),
    openingId,
    note: message,
    sentAt: now.toISOString(),
    status: "sent",
  };
  plans[index] = { ...plans[index], referrals: [...plans[index].referrals, referral] };
  writeJson(CAREER_PLANS_KEY, plans);
  emit("career-referral", { planId, openingId, referralId: referral.id });
  return { plan: plans[index], referral };
}

function normalizeAlumniProfile(value = {}) {
  if (!value?.id || !value?.degreeId || !alumniChapter(value.chapterId)) return null;
  return {
    schema: 1,
    id: text(value.id, 120),
    degreeId: text(value.degreeId, 120),
    studentId: text(value.studentId, 120),
    displayName: text(value.displayName, 160),
    chapterId: value.chapterId,
    unresolvedQuestion: text(value.unresolvedQuestion),
    activatedAt: validDate(value.activatedAt),
    reunion: value.reunion ? {
      attending: Boolean(value.reunion.attending),
      note: text(value.reunion.note),
      updatedAt: validDate(value.reunion.updatedAt),
    } : null,
    mentorship: value.mentorship ? {
      topicIds: values(value.mentorship.topicIds).slice(0, 4),
      note: text(value.mentorship.note),
      offeredAt: validDate(value.mentorship.offeredAt),
    } : null,
  };
}

export function alumniProfile() {
  return normalizeAlumniProfile(readJson(ALUMNI_PROFILE_KEY, null));
}

export function activateAlumniProfile(value = {}, now = new Date()) {
  const degree = graduationDegrees().find((entry) => entry.id === value.degreeId) || graduationDegrees().at(-1);
  if (!degree) return { error: "degree" };
  const chapter = alumniChapter(value.chapterId);
  if (!chapter) return { error: "chapter" };
  const displayName = text(value.displayName, 160) || degree.studentName;
  const unresolvedQuestion = text(value.unresolvedQuestion) || degree.unresolvedQuestion;
  if (displayName.length < 2) return { error: "name" };
  if (unresolvedQuestion.length < 12) return { error: "question" };
  const existing = alumniProfile();
  const record = normalizeAlumniProfile({
    schema: 1,
    id: existing?.id || makeId("TU-AL", now, 1),
    degreeId: degree.id,
    studentId: degree.studentId,
    displayName,
    chapterId: chapter.id,
    unresolvedQuestion,
    activatedAt: existing?.activatedAt || now.toISOString(),
    reunion: existing?.reunion || null,
    mentorship: existing?.mentorship || null,
  });
  writeJson(ALUMNI_PROFILE_KEY, record);
  emit("alumni-activated", { alumniId: record.id, degreeId: degree.id });
  return { record, created: !existing };
}

export function rsvpAlumniReunion(attending, note = "", now = new Date()) {
  const profile = alumniProfile();
  if (!profile) return { error: "profile" };
  const record = {
    ...profile,
    reunion: {
      attending: Boolean(attending),
      note: text(note),
      updatedAt: now.toISOString(),
    },
  };
  writeJson(ALUMNI_PROFILE_KEY, record);
  emit("alumni-rsvp", { alumniId: record.id, attending: record.reunion.attending });
  return { record };
}

export function offerAlumniMentorship(topicIds, note, now = new Date()) {
  const profile = alumniProfile();
  if (!profile) return { error: "profile" };
  const topics = values(topicIds).slice(0, 4);
  const message = text(note);
  if (!topics.length || message.length < 12) return { error: "incomplete" };
  const record = {
    ...profile,
    mentorship: {
      topicIds: topics,
      note: message,
      offeredAt: now.toISOString(),
    },
  };
  writeJson(ALUMNI_PROFILE_KEY, record);
  emit("alumni-mentorship", { alumniId: record.id, topicIds: topics });
  return { record };
}

export function alumniNightSnapshot(date = new Date()) {
  const dayKey = campusDayKey(date);
  const phase = campusLunarPhase(date);
  const band = campusTimeBand(date);
  const seed = hashValue(`${dayKey}:${phase}`);
  const ordered = [...alumniChapters]
    .map((_, index) => alumniChapters[(index + seed) % alumniChapters.length]);
  const stopCount = [0, 4].includes(phase) ? 5 : 4;
  return {
    dayKey,
    phase,
    band,
    route: ordered.slice(0, stopCount),
    assembly: ordered[0],
    closing: ordered[stopCount - 1],
    invitationVersion: (seed % 6) + 1,
  };
}

export function careersCommunityPosts(locale = "zh-Hant") {
  const degrees = graduationDegrees();
  const plans = careerPlans();
  const profile = alumniProfile();
  const night = alumniNightSnapshot();
  const posts = [];
  const latestDegree = degrees.at(-1);
  if (latestDegree) {
    posts.push({
      id: `graduation-degree-${latestDegree.id}`,
      generated: true,
      category: "notice",
      author: locale === "ja" ? "卒業判定会議・議事係" : locale === "en" ? "Graduation Board Minutes Desk" : "畢業判定會議・議事席",
      title: locale === "ja"
        ? `卒業証書 ${latestDegree.degreeNumber} は未解決の問いを添付`
        : locale === "en"
          ? `Degree ${latestDegree.degreeNumber} retains an unresolved question`
          : `學位 ${latestDegree.degreeNumber} 附上一件仍未解決的問題`,
      body: latestDegree.unresolvedQuestion,
      replies: 12 + latestDegree.attachments.length * 3,
      createdAt: latestDegree.issuedAt,
      route: `graduation-degree-${latestDegree.id}`,
    });
  }
  const latestReferral = plans.flatMap((plan) => plan.referrals.map((entry) => ({ ...entry, planId: plan.id }))).at(-1);
  if (latestReferral) {
    const opening = careerOpening(latestReferral.openingId);
    posts.push({
      id: `career-referral-${latestReferral.id}`,
      generated: true,
      category: "notice",
      author: locale === "ja" ? "進路室・鴉天狗便控" : locale === "en" ? "Careers Office · Tengu Dispatch" : "進路室・鴉天狗寄發臺",
      title: careersLocalized(opening.title, locale),
      body: `${latestReferral.note} · ${careersLocalized(opening.friction, locale)}`,
      replies: 7 + (hashValue(latestReferral.id) % 13),
      createdAt: latestReferral.sentAt,
      route: `career-plan-${latestReferral.planId}`,
    });
  }
  if (profile) {
    const chapter = alumniChapter(profile.chapterId);
    posts.push({
      id: `alumni-profile-${profile.id}`,
      generated: true,
      category: "club",
      author: locale === "ja" ? "百鬼夜行同窓会・提灯係" : locale === "en" ? "Hyakki Yagyo Alumni Lantern Desk" : "百鬼夜行校友會・提燈席",
      title: careersLocalized(chapter.title, locale),
      body: `${profile.displayName}：${profile.unresolvedQuestion}`,
      replies: 18 + night.route.length,
      createdAt: profile.reunion?.updatedAt || profile.activatedAt,
      route: "alumni-profile",
    });
  } else {
    const story = alumniStories[hashValue(night.dayKey) % alumniStories.length];
    posts.push({
      id: `alumni-night-${night.dayKey}`,
      generated: true,
      category: "club",
      author: locale === "ja" ? "百鬼夜行同窓会・仮名簿" : locale === "en" ? "Hyakki Yagyo Alumni Provisional Roll" : "百鬼夜行校友會・暫定名冊",
      title: careersLocalized(story.name, locale),
      body: careersLocalized(story.line, locale),
      replies: 9 + night.invitationVersion,
      createdAt: new Date(Date.now() - 5_400_000).toISOString(),
      route: "alumni-association",
    });
  }
  return posts;
}

export function graduationSummary() {
  const audits = graduationAudits();
  const degrees = graduationDegrees();
  const plans = careerPlans();
  const profile = alumniProfile();
  return {
    audits: audits.length,
    readyAudits: audits.filter(({ canIssue }) => canIssue).length,
    degrees: degrees.length,
    plans: plans.length,
    referrals: plans.reduce((sum, entry) => sum + entry.referrals.length, 0),
    alumni: Boolean(profile),
  };
}
