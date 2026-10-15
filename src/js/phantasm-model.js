import { text as catalogText } from "../generated/i18n/ui/phantasm-model.js";
import { academicAssignments } from "../data/academic-work.js";
import { courseByCode } from "../data/courses.js";
import { governanceProposal } from "../data/governance.js";
import { housingRoom, residenceById, roommateById } from "../data/housing.js";
import { incidentById } from "../data/incidents.js";
import { libraryHolding } from "../data/library.js";
import {
  phantasmCourses,
  phantasmExaminers,
  phantasmSealCopy,
  phantasmSealOrder,
} from "../data/phantasm.js";
import { campusLedger, syncCampusLedger } from "./campus-ledger.js";
import {
  attemptPhantasmBoundary,
  clearPhantasmSession,
  phantasmBoundaryStorageKeys,
} from "./phantasm-gate.js";

const STATE_KEY = "tu:phantasm:state";
const TRANSCRIPT_KEY = "tu:phantasm:transcripts";
const MAX_TRANSCRIPTS = 24;
const BELL_PHASES = ["before", "ninth", "after", "never"];

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

function safeText(value, maximum = 1_200) {
  return String(value || "").trim().slice(0, maximum);
}

function dateValue(value, fallback = new Date().toISOString()) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
}

function hashValue(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function newest(records, getDate = (record) => record?.timestamp) {
  return [...records].sort((a, b) => new Date(getDate(b) || 0) - new Date(getDate(a) || 0))[0] || null;
}

function localize(value, locale) {
  return value?.[locale] || value?.["zh-Hant"] || value?.en || "";
}

function normalizedState(value = {}) {
  const enrolledCourseIds = Array.isArray(value.enrolledCourseIds)
    ? [...new Set(value.enrolledCourseIds.filter((id) => phantasmCourses.some((course) => course.id === id)))].slice(0, 3)
    : [];
  return {
    schema: 1,
    unlockedAt: value.unlockedAt ? dateValue(value.unlockedAt) : null,
    firstEnteredAt: value.firstEnteredAt ? dateValue(value.firstEnteredAt) : null,
    lastVisitedAt: value.lastVisitedAt ? dateValue(value.lastVisitedAt) : null,
    visits: Math.max(0, Number(value.visits) || 0),
    bellPhase: BELL_PHASES.includes(value.bellPhase) ? value.bellPhase : "before",
    bellRings: Math.max(0, Number(value.bellRings) || 0),
    enrolledCourseIds,
    selectedNodeId: safeText(value.selectedNodeId, 80) || "ninth-bell",
    wakeCount: Math.max(0, Number(value.wakeCount) || 0),
    residueIndex: Math.max(0, Number(value.residueIndex) || 0) % 4,
    sealSnapshot: Array.isArray(value.sealSnapshot) ? value.sealSnapshot.slice(0, phantasmSealOrder.length) : [],
  };
}

export function phantasmState() {
  return normalizedState(readJson(STATE_KEY, {}));
}

function saveState(state, change = "state") {
  const normalized = normalizedState(state);
  writeJson(STATE_KEY, normalized);
  window.dispatchEvent(new CustomEvent("tu:phantasmchange", { detail: { type: change, state: normalized } }));
  return normalized;
}

function officialEvents() {
  syncCampusLedger();
  return campusLedger();
}

function eventSeal(events, id, types) {
  const event = newest(events.filter((record) => types.includes(record.type)));
  const copy = phantasmSealCopy[id];
  return {
    id,
    mark: copy.mark,
    copy,
    met: Boolean(event),
    timestamp: event?.timestamp || null,
    event,
  };
}

function unusedRouteSeal(events) {
  const projects = readJson("tu:academics:projects", []);
  const defences = readJson("tu:academics:defences", []);
  const candidates = projects
    .filter((project) => safeText(project.unusedRoute).length >= 18)
    .map((project) => ({
      project,
      defence: defences.find((record) => record.projectId === project.id),
    }))
    .filter((item) => item.defence);
  const found = newest(candidates, (item) => item.defence.completedAt);
  const ledgerEvent = found
    ? newest(events.filter((event) => event.type === "academic.defence.completed" && event.payload?.projectId === found.project.id))
    : null;
  return {
    id: "unused-route",
    mark: phantasmSealCopy["unused-route"].mark,
    copy: phantasmSealCopy["unused-route"],
    met: Boolean(found),
    timestamp: found?.defence?.completedAt || ledgerEvent?.timestamp || null,
    event: ledgerEvent,
    project: found?.project || null,
    defence: found?.defence || null,
  };
}

export function phantasmProgress() {
  const events = officialEvents();
  const seals = [
    eventSeal(events, "coursework", ["academic.assignment.graded"]),
    eventSeal(events, "governance", ["governance.vote.cast"]),
    eventSeal(events, "incident", ["incident.resolved"]),
    eventSeal(events, "housing", ["housing.offer.declined"]),
    eventSeal(events, "course", ["course.dropped"]),
    unusedRouteSeal(events),
  ];
  const count = seals.filter((seal) => seal.met).length;
  return {
    count,
    total: seals.length,
    eligible: count === seals.length,
    seals,
  };
}

export function phantasmHasReturnedBook() {
  return officialEvents().some((event) => event.type === "book.returned");
}

export function enterPhantasm({ source = "direct", trace = "", date = new Date() } = {}) {
  const progress = phantasmProgress();
  const current = phantasmState();
  if (!progress.eligible) return { error: "boundary-closed", progress };
  const boundary = attemptPhantasmBoundary({ source, trace, date });
  if (!boundary.allowed) return { error: "boundary-shifted", progress, boundary };
  const now = boundary.session?.grantedAt || new Date().toISOString();
  const firstEntry = !current.unlockedAt;
  const state = saveState({
    ...current,
    unlockedAt: current.unlockedAt || now,
    firstEnteredAt: current.firstEnteredAt || now,
    lastVisitedAt: now,
    visits: current.visits + 1,
    sealSnapshot: progress.seals.map((seal) => ({
      id: seal.id,
      timestamp: seal.timestamp,
      eventId: seal.event?.id || null,
    })),
  }, firstEntry ? "unlocked" : "visited");
  return { state, progress, boundary, firstEntry };
}

export function phantasmIsUnlocked() {
  return Boolean(phantasmState().unlockedAt);
}

function assignmentFragment(seal, locale) {
  const submissions = readJson("tu:academics:submissions", []);
  const eventId = seal.event?.payload?.submissionId;
  const record = submissions.find((item) => item.id === eventId) || newest(submissions, (item) => item.submittedAt);
  const assignment = academicAssignments.find((item) => item.id === (record?.assignmentId || seal.event?.payload?.assignmentId));
  const title = assignment ? localize(assignment.title, locale) : (record?.courseCode || "COURSEWORK");
  const percent = Number(record?.percent ?? seal.event?.payload?.percent);
  return {
    id: "counter-coursework",
    sealId: "coursework",
    mark: "答",
    title,
    sourceAt: record?.submittedAt || seal.timestamp,
    ordinary: catalogText("assignmentFragment.ordinary", { [locale]: locale === "ja" ? {value0: Number.isFinite(percent) ? `${percent}%` : "採点済み"} : locale === "en" ? {value0: Number.isFinite(percent) ? `graded at ${percent}%` : "graded"} : {value0: Number.isFinite(percent) ? ` ${percent}%` : "已判分"} })[locale],
    dream: catalogText("assignmentFragment.dream")[locale],
  };
}

function governanceFragment(seal, locale) {
  const proposal = governanceProposal(seal.event?.payload?.proposalId);
  const selected = proposal?.choices.find((choice) => choice.id === seal.event?.payload?.choiceId);
  const alternative = proposal?.choices.find((choice) => choice.id !== selected?.id);
  return {
    id: "counter-governance",
    sealId: "governance",
    mark: "票",
    title: proposal ? localize(proposal.title, locale) : "SHADOW SENATE",
    sourceAt: seal.timestamp,
    ordinary: selected
      ? `${catalogText("governanceFragment.ordinary")[locale]}：${localize(selected.label, locale)}`
      : localize(phantasmSealCopy.governance.found, locale),
    dream: alternative
      ? `${catalogText("governanceFragment.dream")[locale]}：${localize(alternative.label, locale)} — ${localize(alternative.consequence, locale)}`
      : localize(phantasmSealCopy.governance.found, locale),
  };
}

function incidentFragment(seal, locale) {
  const incident = incidentById(seal.event?.payload?.caseId);
  const resolutions = readJson("tu:incidents:resolutions", []);
  const resolution = resolutions.find((item) =>
    item.id === seal.event?.payload?.resolutionId || item.caseId === seal.event?.payload?.caseId);
  const selectedId = resolution?.hypothesisId || seal.event?.payload?.hypothesisId;
  const selected = incident?.hypotheses.find((item) => item.id === selectedId);
  const rejected = incident?.hypotheses.find((item) => item.id !== selectedId);
  return {
    id: "counter-incident",
    sealId: "incident",
    mark: "異",
    title: incident ? `${incident.code} · ${localize(incident.title, locale)}` : "INCIDENT REVERSE",
    sourceAt: seal.timestamp,
    ordinary: selected
      ? `${catalogText("incidentFragment.ordinary")[locale]}：${localize(selected.title, locale)}`
      : localize(phantasmSealCopy.incident.found, locale),
    dream: rejected
      ? `${catalogText("incidentFragment.dream")[locale]}：${localize(rejected.title, locale)} — ${localize(rejected.rationale, locale)}`
      : localize(phantasmSealCopy.incident.found, locale),
  };
}

function housingFragment(seal, locale) {
  const applications = readJson("tu:housing:applications", []);
  const application = applications.find((item) => item.id === seal.event?.payload?.applicationId);
  const offer = application?.offers?.find((item) => item.id === seal.event?.payload?.offerId);
  const room = housingRoom(offer?.roomId);
  const residence = residenceById(offer?.residenceId || room?.residence);
  const roommate = roommateById(offer?.roommateId || room?.roommate);
  const roomLabel = [residence && localize(residence.name, locale), room?.id].filter(Boolean).join(" · ");
  return {
    id: "counter-housing",
    sealId: "housing",
    mark: "室",
    title: roomLabel || (catalogText("housingFragment.title")[locale]),
    sourceAt: application?.updatedAt || seal.timestamp,
    ordinary: `${catalogText("housingFragment.ordinary")[locale]}${offer?.score ? ` · ${offer.score}%` : ""}`,
    dream: roommate
      ? `${localize(roommate.name, locale)}${catalogText("housingFragment.dream")[locale]}`
      : localize(phantasmSealCopy.housing.found, locale),
  };
}

function courseFragment(seal, locale) {
  const course = courseByCode(seal.event?.payload?.courseCode);
  return {
    id: "counter-course",
    sealId: "course",
    mark: "退",
    title: course
      ? `${course.code} · ${localize(course.title, locale)}`
      : (seal.event?.payload?.courseCode || "DROPPED COURSE"),
    sourceAt: seal.timestamp,
    ordinary: catalogText("courseFragment.ordinary")[locale],
    dream: catalogText("courseFragment.dream")[locale],
  };
}

function unusedRouteFragment(seal, locale) {
  const project = seal.project;
  return {
    id: "counter-unused-route",
    sealId: "unused-route",
    mark: "未",
    title: project?.title || (catalogText("unusedRouteFragment.title")[locale]),
    sourceAt: seal.defence?.completedAt || seal.timestamp,
    ordinary: project?.unusedRoute || localize(phantasmSealCopy["unused-route"].found, locale),
    dream: catalogText("unusedRouteFragment.dream")[locale],
  };
}

function libraryFragment(locale) {
  const returned = newest(
    readJson("tu:library:loans", []).filter((loan) => loan.status === "returned"),
    (loan) => loan.returnedAt,
  );
  if (!returned) return null;
  const holding = libraryHolding(returned.holdingId);
  return {
    id: "counter-library",
    sealId: "book-returned",
    mark: "否",
    title: holding ? `${holding.callNumber} · ${localize(holding.title, locale)}` : returned.holdingId,
    sourceAt: returned.returnedAt,
    ordinary: catalogText("libraryFragment.ordinary")[locale],
    dream: catalogText("libraryFragment.dream")[locale],
  };
}

export function dreamCounterfactuals(locale = "zh-Hant") {
  const progress = phantasmProgress();
  const sealMap = Object.fromEntries(progress.seals.map((seal) => [seal.id, seal]));
  if (!progress.eligible && !phantasmState().unlockedAt) return [];
  const fragments = [
    assignmentFragment(sealMap.coursework, locale),
    governanceFragment(sealMap.governance, locale),
    incidentFragment(sealMap.incident, locale),
    housingFragment(sealMap.housing, locale),
    courseFragment(sealMap.course, locale),
    unusedRouteFragment(sealMap["unused-route"], locale),
    libraryFragment(locale),
  ];
  return fragments.filter(Boolean);
}

export function availableDreamCourses() {
  const progress = phantasmProgress();
  const seals = new Set(progress.seals.filter((seal) => seal.met).map((seal) => seal.id));
  if (phantasmHasReturnedBook()) seals.add("book-returned");
  return phantasmCourses.map((course) => ({
    ...course,
    available: course.requires ? seals.has(course.requires) : seals.has(course.bonus),
  }));
}

export function toggleDreamCourse(courseId) {
  if (!phantasmIsUnlocked()) return { error: "boundary-closed" };
  const course = availableDreamCourses().find((item) => item.id === courseId);
  if (!course?.available) return { error: "course-unavailable" };
  const state = phantasmState();
  const selected = new Set(state.enrolledCourseIds);
  if (selected.has(courseId)) selected.delete(courseId);
  else if (selected.size >= 3) return { error: "course-limit", state };
  else selected.add(courseId);
  return { state: saveState({ ...state, enrolledCourseIds: [...selected] }, "registration") };
}

export function selectDreamNode(nodeId) {
  const state = phantasmState();
  return saveState({ ...state, selectedNodeId: safeText(nodeId, 80) }, "map");
}

export function ringDreamBell() {
  const state = phantasmState();
  const position = BELL_PHASES.indexOf(state.bellPhase);
  return saveState({
    ...state,
    bellPhase: BELL_PHASES[(position + 1) % BELL_PHASES.length],
    bellRings: state.bellRings + 1,
  }, "bell");
}

export function dreamTranscripts() {
  const records = readJson(TRANSCRIPT_KEY, []);
  return Array.isArray(records)
    ? records
      .filter((record) => record?.id && Array.isArray(record.courseIds))
      .map((record) => ({
        schema: 1,
        id: safeText(record.id, 100),
        studentId: safeText(record.studentId, 100) || "dream-auditor",
        studentName: safeText(record.studentName, 120),
        courseIds: [...new Set(record.courseIds.filter((id) => phantasmCourses.some((course) => course.id === id)))].slice(0, 3),
        fragmentId: safeText(record.fragmentId, 100),
        fragmentTitle: safeText(record.fragmentTitle, 240),
        examinerId: phantasmExaminers.some((item) => item.id === record.examinerId) ? record.examinerId : "doremy",
        statement: safeText(record.statement),
        rulingId: ["retain", "conditional", "wake"].includes(record.rulingId) ? record.rulingId : "conditional",
        completedAt: dateValue(record.completedAt),
        bellPhase: BELL_PHASES.includes(record.bellPhase) ? record.bellPhase : "ninth",
        residueIndex: Math.max(0, Number(record.residueIndex) || 0) % 4,
      }))
    : [];
}

function rulingFor(examinerId, fragmentId, statement) {
  const score = hashValue(`${examinerId}:${fragmentId}:${statement}`) % 3;
  return ["retain", "conditional", "wake"][score];
}

export function dreamRulingCopy(rulingId, examinerId, locale = "zh-Hant") {
  const examiner = phantasmExaminers.find((item) => item.id === examinerId) || phantasmExaminers[0];
  const name = localize(examiner.name, locale);
  const copy = {
    retain: {
      ruling: catalogText("copy.retain.ruling", { "zh-Hant": {value0: name}, "ja": {value0: name}, "en": {value0: name} }),
      condition: catalogText("copy.retain.condition"),
      dissent: catalogText("copy.retain.dissent"),
    },
    conditional: {
      ruling: catalogText("copy.conditional.ruling", { "zh-Hant": {value0: name}, "ja": {value0: name}, "en": {value0: name} }),
      condition: catalogText("copy.conditional.condition"),
      dissent: catalogText("copy.conditional.dissent"),
    },
    wake: {
      ruling: catalogText("copy.wake.ruling", { "zh-Hant": {value0: name}, "ja": {value0: name}, "en": {value0: name} }),
      condition: catalogText("copy.wake.condition"),
      dissent: catalogText("copy.wake.dissent"),
    },
  };
  const selected = copy[rulingId] || copy.conditional;
  return {
    ruling: selected.ruling[locale] || selected.ruling["zh-Hant"],
    condition: selected.condition[locale] || selected.condition["zh-Hant"],
    dissent: selected.dissent[locale] || selected.dissent["zh-Hant"],
  };
}

export function completeDreamDefence({ fragmentId, examinerId, statement } = {}) {
  if (!phantasmIsUnlocked()) return { error: "boundary-closed" };
  const state = phantasmState();
  if (state.enrolledCourseIds.length !== 3) return { error: "courses" };
  const normalizedStatement = safeText(statement);
  if (normalizedStatement.length < 24) return { error: "statement" };
  const locale = document.documentElement.lang || "zh-Hant";
  const fragment = dreamCounterfactuals(locale).find((item) => item.id === fragmentId);
  const examiner = phantasmExaminers.find((item) => item.id === examinerId);
  if (!fragment || !examiner) return { error: "selection" };
  const completedAt = new Date().toISOString();
  const identity = readJson("tu:identity", {});
  const id = `TU-DREAM-${hashValue(`${fragment.id}:${examiner.id}:${completedAt}`).toString(36).toUpperCase().padStart(7, "0").slice(-7)}`;
  const record = {
    schema: 1,
    id,
    studentId: safeText(identity.id, 100) || "dream-auditor",
    studentName: safeText(identity.name, 120),
    courseIds: [...state.enrolledCourseIds],
    fragmentId: fragment.id,
    fragmentTitle: fragment.title,
    examinerId: examiner.id,
    statement: normalizedStatement,
    rulingId: rulingFor(examiner.id, fragment.id, normalizedStatement),
    completedAt,
    bellPhase: state.bellPhase,
    residueIndex: state.residueIndex,
  };
  const records = dreamTranscripts();
  records.push(record);
  writeJson(TRANSCRIPT_KEY, records.slice(-MAX_TRANSCRIPTS));
  window.dispatchEvent(new CustomEvent("tu:phantasmchange", { detail: { type: "defence", record } }));
  return { record };
}

export function wakeFromPhantasm() {
  clearPhantasmSession();
  const state = phantasmState();
  return saveState({
    ...state,
    wakeCount: state.wakeCount + 1,
    residueIndex: (state.residueIndex + 1 + (state.bellRings % 3)) % 4,
  }, "wake");
}

export function phantasmCommunityPosts(locale = "zh-Hant") {
  const progress = phantasmProgress();
  const state = phantasmState();
  const transcripts = dreamTranscripts();
  const createdAt = state.lastVisitedAt || progress.seals.findLast((seal) => seal.met)?.timestamp || new Date(Date.now() - 7_200_000).toISOString();
  const posts = [{
    id: "phantasm-ninth-period-rumour",
    generated: true,
    phantasm: true,
    category: "course",
    author: catalogText("posts.phantasm-ninth-period-rumour.author")[locale],
    title: catalogText("posts.phantasm-ninth-period-rumour.title")[locale],
    body: progress.count < 3
      ? (catalogText("posts.phantasm-ninth-period-rumour.body")[locale])
      : (catalogText("posts.phantasm-ninth-period-rumour.body.2", { [locale]: locale === "ja" ? {value0: progress.count} : locale === "en" ? {value0: progress.count} : {value0: progress.count} })[locale]),
    replies: 9 + progress.count,
    createdAt,
    phantasmRoute: progress.eligible ? "phantasm-campus" : null,
  }];
  const extraAttempts = readJson("tu:gaokao:attempts", []).filter((attempt) => attempt?.difficultyId === "extra" && attempt?.completedAt);
  posts.push({
    id: "phantasm-exam-reverse-paper-rumour",
    generated: true,
    phantasm: true,
    category: "course",
    author: catalogText("phantasmCommunityPosts.0.author")[locale],
    title: catalogText("phantasmCommunityPosts.0.title")[locale],
    body: extraAttempts.length
      ? (catalogText("phantasmCommunityPosts.0.body")[locale])
      : (catalogText("phantasmCommunityPosts.0.body.2")[locale]),
    replies: 12 + extraAttempts.length,
    createdAt,
    phantasmRoute: progress.eligible ? "phantasm-exam" : null,
  });
  if (transcripts.length) {
    const latest = transcripts.at(-1);
    posts.unshift({
      id: `phantasm-transcript-${latest.id}`,
      generated: true,
      phantasm: true,
      category: "notice",
      author: catalogText("phantasmCommunityPosts.0.author.2")[locale],
      title: catalogText("phantasmCommunityPosts.0.title.2")[locale],
      body: catalogText("phantasmCommunityPosts.0.body.3", { [locale]: locale === "ja" ? {value0: latest.id} : locale === "en" ? {value0: latest.id} : {value0: latest.id} })[locale],
      replies: 19,
      createdAt: latest.completedAt,
      phantasmRoute: `phantasm-transcript-${latest.id}`,
    });
  }
  return posts;
}

export const phantasmStorageKeys = {
  state: STATE_KEY,
  transcripts: TRANSCRIPT_KEY,
  ...phantasmBoundaryStorageKeys,
};
