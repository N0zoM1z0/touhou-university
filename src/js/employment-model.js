import {
  employmentApplicationDecisions,
  employmentCountBases,
  employmentJob,
  employmentJobs,
  employmentLocalized,
  employmentObservationWindows,
  employmentOutcomeKinds,
} from "../data/employment.js";

const DRAFT_KEY = "tu:employment:draft";
const APPLICATIONS_KEY = "tu:employment:applications";
const ATTESTATIONS_KEY = "tu:employment:attestations";
const MAX_RECORDS = 60;

export const employmentStorageKeys = Object.freeze({
  draft: DRAFT_KEY,
  applications: APPLICATIONS_KEY,
  attestations: ATTESTATIONS_KEY,
});

const basisDeltas = Object.freeze({
  person: {},
  body: { wage: -4, household: -3, barter: -2, research: -1, afterlife: -12, incident: -1, multiple: -5, unobserved: 5 },
  soul: { wage: 1, household: 2, barter: 7, research: 3, afterlife: 14, incident: 2, multiple: 8, unobserved: 6 },
  name: { wage: 2, household: 1, barter: 3, research: 2, afterlife: 1, incident: 1, multiple: 7, unobserved: 1 },
  employer: { wage: 12, household: 8, barter: 10, research: 6, afterlife: 9, incident: 7, multiple: 20, unobserved: -3 },
});

const windowDeltas = Object.freeze({
  noon: { household: -4, afterlife: -3, unobserved: 7 },
  "full-moon": { wage: -2, household: 2, barter: 2, afterlife: 4, incident: 3, multiple: 1, unobserved: 5 },
  higan: { wage: -3, household: -2, afterlife: 15, multiple: 3, unobserved: -4 },
  "erased-wednesday": { wage: -5, research: -4, incident: 2, multiple: -2, unobserved: 16 },
  border: { wage: 2, barter: 5, research: 2, afterlife: 1, incident: 4, multiple: 8, unobserved: 7 },
});

const denominatorDeltas = Object.freeze({
  noon: -4,
  "full-moon": 7,
  higan: 18,
  "erased-wednesday": -9,
  border: 11,
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

function text(value, maximum = 1_600) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function validDate(value, fallback = new Date().toISOString()) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function makeId(prefix, now, sequence = 0) {
  return `${prefix}-${now.getTime().toString(36).toUpperCase()}-${String(sequence + 1).padStart(2, "0")}`;
}

function hashValue(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function emit(reason, detail = {}) {
  const payload = { reason, ...detail };
  globalThis.window?.dispatchEvent(new CustomEvent("tu:employmentchange", { detail: payload }));
  globalThis.window?.dispatchEvent(new CustomEvent("tu:postchange", {
    detail: { reason: `employment-${reason}`, ...detail },
  }));
}

function identityName() {
  const identity = readJson("tu:identity", null);
  return text(identity?.displayName || identity?.name, 80);
}

function latestDegreeNumber() {
  const degrees = readJson("tu:graduation:degrees", []);
  return text((Array.isArray(degrees) ? degrees.at(-1) : null)?.degreeNumber, 100);
}

export function defaultEmploymentDraft(jobId = employmentJobs[0].id) {
  return {
    schema: 1,
    jobId: employmentJob(jobId)?.id || employmentJobs[0].id,
    displayName: identityName(),
    degreeNumber: latestDegreeNumber(),
    strength: "",
    boundary: "",
    desiredPay: "",
    availability: "ordinary",
    nonlinearReady: false,
    clauseAccepted: false,
    updatedAt: null,
  };
}

function normalizeDraft(value = {}) {
  const source = { ...defaultEmploymentDraft(value.jobId), ...value };
  return {
    schema: 1,
    jobId: employmentJob(source.jobId)?.id || employmentJobs[0].id,
    displayName: text(source.displayName, 80),
    degreeNumber: text(source.degreeNumber, 100),
    strength: text(source.strength, 800),
    boundary: text(source.boundary, 800),
    desiredPay: text(source.desiredPay, 500),
    availability: ["ordinary", "night", "lunar", "nonlinear", "afterlife"].includes(source.availability)
      ? source.availability
      : "ordinary",
    nonlinearReady: Boolean(source.nonlinearReady),
    clauseAccepted: Boolean(source.clauseAccepted),
    updatedAt: source.updatedAt ? validDate(source.updatedAt) : null,
  };
}

export function employmentDraft(jobId = null) {
  const draft = normalizeDraft(readJson(DRAFT_KEY, null) || defaultEmploymentDraft(jobId || undefined));
  if (jobId && employmentJob(jobId)) draft.jobId = jobId;
  return draft;
}

export function saveEmploymentDraft(value = {}, now = new Date()) {
  const record = normalizeDraft({ ...value, updatedAt: now.toISOString() });
  writeJson(DRAFT_KEY, record);
  emit("draft-saved", { jobId: record.jobId });
  return record;
}

function normalizeApplication(value) {
  if (!value || typeof value !== "object" || !value.id || !employmentJob(value.jobId)) return null;
  const decision = employmentApplicationDecisions.find(({ id }) => id === value.decisionId)
    || employmentApplicationDecisions[0];
  const allowedResponses = ["trial", "correction", "decline", "adjacent", "hold"];
  return {
    schema: 1,
    id: text(value.id, 120),
    jobId: value.jobId,
    profile: normalizeDraft({ ...value.profile, jobId: value.jobId }),
    decisionId: decision.id,
    status: allowedResponses.includes(value.response?.kind) ? "responded" : "reviewed",
    submittedAt: validDate(value.submittedAt),
    response: allowedResponses.includes(value.response?.kind)
      ? {
          kind: value.response.kind,
          note: text(value.response.note, 800),
          respondedAt: validDate(value.response.respondedAt),
        }
      : null,
  };
}

export function employmentApplications() {
  const values = readJson(APPLICATIONS_KEY, []);
  return (Array.isArray(values) ? values : []).map(normalizeApplication).filter(Boolean);
}

export function employmentApplication(id) {
  return employmentApplications().find((entry) => entry.id === id) || null;
}

export function submitEmploymentApplication(value = {}, now = new Date()) {
  const profile = normalizeDraft(value);
  if (profile.displayName.length < 2) return { error: "name" };
  if (profile.strength.length < 8) return { error: "strength" };
  if (profile.boundary.length < 8) return { error: "boundary" };
  if (!profile.clauseAccepted) return { error: "clause" };
  const records = employmentApplications();
  const decision = employmentApplicationDecisions[
    hashValue(`${profile.jobId}|${profile.displayName}|${profile.boundary}|${profile.availability}`)
      % employmentApplicationDecisions.length
  ];
  const record = normalizeApplication({
    schema: 1,
    id: makeId("TU-JOB", now, records.length),
    jobId: profile.jobId,
    profile,
    decisionId: decision.id,
    submittedAt: now.toISOString(),
    response: null,
  });
  writeJson(APPLICATIONS_KEY, [...records, record].slice(-MAX_RECORDS));
  writeJson(DRAFT_KEY, normalizeDraft({ ...defaultEmploymentDraft(profile.jobId), displayName: profile.displayName, degreeNumber: profile.degreeNumber }));
  emit("application-submitted", { applicationId: record.id, jobId: record.jobId });
  return { record };
}

export function respondEmploymentApplication(id, kind, note = "", now = new Date()) {
  if (!["trial", "correction", "decline", "adjacent", "hold"].includes(kind)) return { error: "response" };
  const records = employmentApplications();
  const index = records.findIndex((entry) => entry.id === id);
  if (index < 0) return { error: "missing" };
  const record = normalizeApplication({
    ...records[index],
    response: {
      kind,
      note,
      respondedAt: now.toISOString(),
    },
  });
  records[index] = record;
  writeJson(APPLICATIONS_KEY, records.slice(-MAX_RECORDS));
  emit("application-responded", { applicationId: record.id, jobId: record.jobId, response: kind });
  return { record };
}

function normalizeAttestation(value) {
  if (!value || typeof value !== "object" || !value.id) return null;
  const outcome = employmentOutcomeKinds.find(({ id }) => id === value.outcomeId);
  if (!outcome) return null;
  return {
    schema: 1,
    id: text(value.id, 120),
    displayName: text(value.displayName, 80),
    outcomeId: outcome.id,
    simultaneous: Boolean(value.simultaneous),
    note: text(value.note, 1_000),
    attestedAt: validDate(value.attestedAt),
  };
}

export function employmentAttestations() {
  const values = readJson(ATTESTATIONS_KEY, []);
  return (Array.isArray(values) ? values : []).map(normalizeAttestation).filter(Boolean);
}

export function attestEmploymentOutcome(value = {}, now = new Date()) {
  const displayName = text(value.displayName || identityName(), 80);
  const outcome = employmentOutcomeKinds.find(({ id }) => id === value.outcomeId);
  const note = text(value.note, 1_000);
  if (displayName.length < 2) return { error: "name" };
  if (!outcome) return { error: "outcome" };
  if (note.length < 8) return { error: "note" };
  const records = employmentAttestations();
  const record = normalizeAttestation({
    schema: 1,
    id: makeId("TU-WHERE", now, records.length),
    displayName,
    outcomeId: outcome.id,
    simultaneous: Boolean(value.simultaneous),
    note,
    attestedAt: now.toISOString(),
  });
  writeJson(ATTESTATIONS_KEY, [...records, record].slice(-MAX_RECORDS));
  emit("outcome-attested", { attestationId: record.id, outcomeId: record.outcomeId });
  return { record };
}

export function employmentOutcomeSnapshot(basisId = "person", windowId = "noon") {
  const basis = employmentCountBases.find(({ id }) => id === basisId) || employmentCountBases[0];
  const observation = employmentObservationWindows.find(({ id }) => id === windowId)
    || employmentObservationWindows[0];
  const attestations = employmentAttestations();
  const counts = employmentOutcomeKinds.map((outcome) => {
    const local = attestations.filter(({ outcomeId }) => outcomeId === outcome.id).length;
    return {
      ...outcome,
      count: Math.max(
        0,
        outcome.base
          + (basisDeltas[basis.id]?.[outcome.id] || 0)
          + (windowDeltas[observation.id]?.[outcome.id] || 0)
          + local,
      ),
      local,
    };
  });
  const denominator = Math.max(1, basis.denominator + (denominatorDeltas[observation.id] || 0));
  const statements = counts.reduce((sum, outcome) => sum + outcome.count, 0);
  return {
    basis,
    observation,
    denominator,
    statements,
    overlap: statements - denominator,
    counts,
    attestations: attestations.length,
  };
}

export function employmentCommunityPosts(locale = "zh-Hant") {
  const applications = employmentApplications();
  const attestations = employmentAttestations();
  const latest = applications.at(-1);
  const posts = [];
  if (latest) {
    const job = employmentJob(latest.jobId);
    const decision = employmentApplicationDecisions.find(({ id }) => id === latest.decisionId);
    posts.push({
      id: `employment-application-${latest.id}`,
      category: "market",
      author: locale === "ja" ? "進路室・怪歴書発送台" : locale === "en" ? "Careers Office · Odd Résumé Dispatch" : "進路室・怪歷書寄發臺",
      title: `${employmentLocalized(job.title, locale)} · ${employmentLocalized(decision.title, locale)}`,
      body: `${employmentLocalized(job.reply, locale)} ${latest.response?.note || ""}`.trim(),
      createdAt: latest.response?.respondedAt || latest.submittedAt,
      route: `employment-application-${latest.id}`,
      seedOrder: 0,
    });
  }
  const attestation = attestations.at(-1);
  if (attestation) {
    const outcome = employmentOutcomeKinds.find(({ id }) => id === attestation.outcomeId);
    posts.push({
      id: `employment-attestation-${attestation.id}`,
      category: "market",
      author: locale === "ja" ? "離校先反響簿" : locale === "en" ? "Graduate Whereabouts Echo Roll" : "離校去向回聲簿",
      title: employmentLocalized(outcome.title, locale),
      body: `${attestation.displayName}：${attestation.note}`,
      createdAt: attestation.attestedAt,
      route: "employment-outcomes",
      seedOrder: 1,
    });
  }
  return posts;
}

export function employmentPostMessages(locale = "zh-Hant") {
  return employmentApplications().slice(-6).map((application) => {
    const job = employmentJob(application.jobId);
    const decision = employmentApplicationDecisions.find(({ id }) => id === application.decisionId);
    return {
      id: `employment-${application.id}`,
      glyph: application.response ? "回" : decision.glyph,
      source: employmentLocalized(job.employer, locale),
      sourceKind: "tengu",
      trust: application.response ? "witnessed" : "contested",
      version: application.response ? 2 : 1,
      subject: `${employmentLocalized(job.title, locale)} · ${employmentLocalized(decision.title, locale)}`,
      body: application.response?.note
        || `${employmentLocalized(job.reply, locale)} ${employmentLocalized(decision.note, locale)}`,
      ordering: decision.id === "adjacent-offer" ? "early" : "normal",
      correction: decision.id === "adjacent-offer"
        ? (
          locale === "ja"
            ? "この頁の採用効力はまだ未着。隣接版の勤務表だけ先着しています。"
            : locale === "en"
              ? "Hire has not reached this page; only the adjacent edition's rota arrived early."
              : "錄用效力尚未抵達本頁；只有相鄰版本的排班表先到了。"
        )
        : null,
      route: `employment-application-${application.id}`,
      createdAt: application.response?.respondedAt || application.submittedAt,
    };
  });
}

export function employmentSummary() {
  const applications = employmentApplications();
  const attestations = employmentAttestations();
  return {
    applications: applications.length,
    responded: applications.filter(({ response }) => response).length,
    attestations: attestations.length,
  };
}
