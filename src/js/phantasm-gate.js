import { text as catalogText, trees as catalogTrees } from "../generated/i18n/ui/phantasm-gate.js";
import {
  campusDayKey,
  campusLunarPhase,
  campusTimeSlot,
} from "../data/campus-time.js";

const LEDGER_KEY = "tu:campus:ledger";
const STATE_KEY = "tu:phantasm:state";
const BOUNDARY_KEY = "tu:phantasm:boundary";
const SESSION_KEY = "tu:phantasm:pass";
const PROJECT_KEY = "tu:academics:projects";
const DEFENCE_KEY = "tu:academics:defences";
const PASS_DURATION = 6 * 60 * 60 * 1_000;
const ATTEMPT_WINDOW = 12 * 60 * 60 * 1_000;

export const PHANTASM_ENTRANCES = ["footer", "mytu", "map", "search", "bbs"];

const seals = [
  ["coursework", "academic.assignment.graded"],
  ["governance", "governance.vote.cast"],
  ["incident", "incident.resolved"],
  ["housing", "housing.offer.declined"],
  ["course", "course.dropped"],
];

const entranceRiddles = catalogTrees["entranceRiddles"];

function storage(kind = "localStorage") {
  try {
    return window[kind];
  } catch {
    return null;
  }
}

function readJson(key, fallback, kind = "localStorage") {
  try {
    const value = JSON.parse(storage(kind)?.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value, kind = "localStorage") {
  try {
    storage(kind)?.setItem(key, JSON.stringify(value));
  } catch {
    // A private browser may refuse storage; the ordinary gate still works.
  }
}

function hashValue(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function validDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function moonProfile(phase) {
  if (phase === 0) return "new";
  if (phase === 4) return "full";
  return phase < 4 ? "waxing" : "waning";
}

function traceFor(source, schedule) {
  return hashValue(`${schedule.signature}:${source}:not-taken`).toString(36);
}

function openSlotsFor(seed, lunarPhase) {
  const slots = [seed % 8];
  slots.push((slots[0] + 3 + (lunarPhase % 3)) % 8);
  if (lunarPhase === 0 || lunarPhase === 4) {
    let third = (slots[0] + 6) % 8;
    if (slots.includes(third)) third = (slots[0] + 1) % 8;
    slots.push(third);
  }
  return [...new Set(slots)].sort((a, b) => a - b);
}

export function phantasmBoundarySchedule(value = new Date()) {
  const date = validDate(value);
  const dayKey = campusDayKey(date);
  const lunarPhase = campusLunarPhase(date);
  const slot = campusTimeSlot(date);
  const seed = hashValue(`${dayKey}:moon-${lunarPhase}:phantasm`);
  const stride = 1 + (lunarPhase % 3);
  const primaryIndex = (seed + slot * stride + lunarPhase) % PHANTASM_ENTRANCES.length;
  const activeEntrances = [PHANTASM_ENTRANCES[primaryIndex]];
  if (lunarPhase === 0 || lunarPhase === 4) {
    activeEntrances.push(PHANTASM_ENTRANCES[(primaryIndex + 2 + (date.getDate() % 2)) % PHANTASM_ENTRANCES.length]);
  }
  const openSlots = openSlotsFor(seed, lunarPhase);
  let slotsUntilOpen = 0;
  while (slotsUntilOpen < 8 && !openSlots.includes((slot + slotsUntilOpen) % 8)) slotsUntilOpen += 1;
  const minuteInSlot = (date.getHours() * 60 + date.getMinutes()) % 180;
  const minutesUntilOpen = slotsUntilOpen === 0 ? 0 : slotsUntilOpen * 180 - minuteInSlot;
  return {
    dayKey,
    lunarPhase,
    moonProfile: moonProfile(lunarPhase),
    slot,
    openSlots,
    activeEntrances,
    primaryEntrance: activeEntrances[0],
    windowOpen: openSlots.includes(slot),
    slotsUntilOpen,
    minutesUntilOpen,
    seed,
    signature: `${dayKey}:m${lunarPhase}:s${slot}`,
  };
}

function recentAttempts(date = new Date()) {
  const now = validDate(date).getTime();
  const record = readJson(BOUNDARY_KEY, {});
  return Array.isArray(record.attempts)
    ? record.attempts.filter((attempt) => {
      const at = new Date(attempt?.at).getTime();
      return PHANTASM_ENTRANCES.includes(attempt?.source)
        && Number.isFinite(at)
        && at <= now + 10 * 60_000
        && at >= now - ATTEMPT_WINDOW;
    }).slice(-16)
    : [];
}

function saveAttempts(attempts, detail = {}) {
  writeJson(BOUNDARY_KEY, {
    schema: 1,
    attempts: attempts.slice(-16),
    lastAttemptAt: attempts.at(-1)?.at || null,
    lastSource: attempts.at(-1)?.source || null,
    ...detail,
  });
  window.dispatchEvent(new CustomEvent("tu:phantasmboundarychange", { detail }));
}

export function phantasmGateProgress() {
  const events = readJson(LEDGER_KEY, []);
  const projects = readJson(PROJECT_KEY, []);
  const defences = readJson(DEFENCE_KEY, []);
  const status = seals.map(([id, type]) => ({
    id,
    met: events.some((event) => event?.type === type),
  }));
  status.push({
    id: "unused-route",
    met: projects.some((project) =>
      String(project?.unusedRoute || "").trim().length >= 18
      && defences.some((defence) => defence?.projectId === project.id)),
  });
  const count = status.filter((seal) => seal.met).length;
  return { count, total: status.length, eligible: count === status.length, seals: status };
}

export function phantasmGateState() {
  const value = readJson(STATE_KEY, {});
  return {
    unlockedAt: value?.unlockedAt || null,
    wakeCount: Math.max(0, Number(value?.wakeCount) || 0),
    residueIndex: Math.max(0, Number(value?.residueIndex) || 0) % 4,
    boundaryAttempts: recentAttempts(),
  };
}

export function phantasmSessionPass(value = new Date()) {
  const date = validDate(value);
  const pass = readJson(SESSION_KEY, null, "sessionStorage");
  const expiresAt = new Date(pass?.expiresAt).getTime();
  if (!pass || !Number.isFinite(expiresAt) || expiresAt <= date.getTime()) return null;
  return pass;
}

function grantSession(source, mode, schedule, date) {
  const pass = {
    schema: 1,
    source,
    mode,
    signature: schedule.signature,
    grantedAt: date.toISOString(),
    expiresAt: new Date(date.getTime() + PASS_DURATION).toISOString(),
  };
  writeJson(SESSION_KEY, pass, "sessionStorage");
  return pass;
}

export function clearPhantasmSession() {
  try {
    storage("sessionStorage")?.removeItem(SESSION_KEY);
  } catch {
    // Waking still changes the persistent residue even without session storage.
  }
}

export function phantasmEntranceHref(source = "footer", route = "phantasm-campus", value = new Date()) {
  const normalizedSource = PHANTASM_ENTRANCES.includes(source) ? source : "footer";
  const schedule = phantasmBoundarySchedule(value);
  const trace = traceFor(normalizedSource, schedule);
  return `phantasm.html?entrance=${encodeURIComponent(normalizedSource)}&trace=${trace}#${encodeURIComponent(route)}`;
}

export function phantasmEntranceClue(locale = "zh-Hant", source = "footer") {
  const normalizedSource = PHANTASM_ENTRANCES.includes(source) ? source : "footer";
  return entranceRiddles[locale]?.[normalizedSource] || entranceRiddles["zh-Hant"][normalizedSource];
}

export function phantasmBoundaryStatus({ source = "direct", trace = "", date = new Date() } = {}) {
  const now = validDate(date);
  const schedule = phantasmBoundarySchedule(now);
  const validSource = PHANTASM_ENTRANCES.includes(source);
  const traceValid = validSource && trace === traceFor(source, schedule);
  const session = phantasmSessionPass(now);
  const attempts = recentAttempts(now);
  const unlocked = Boolean(readJson(STATE_KEY, {})?.unlockedAt);
  const mercyThreshold = unlocked ? 2 : 3;
  const distinctSources = new Set(attempts.map((attempt) => attempt.source)).size;
  const mercyReady = distinctSources >= mercyThreshold || attempts.length >= mercyThreshold + 1;
  const resonant = schedule.windowOpen && validSource && schedule.activeEntrances.includes(source);
  const regular = resonant && traceValid;
  const frayed = mercyReady && traceValid;
  return {
    allowed: Boolean(session || regular || frayed),
    mode: session ? "session" : regular ? "scheduled" : frayed ? "frayed" : "closed",
    session,
    schedule,
    source,
    validSource,
    traceValid,
    resonant,
    attempts,
    distinctSources,
    mercyThreshold,
    mercyReady,
    attemptsUntilMercy: Math.max(0, mercyThreshold - distinctSources),
  };
}

export function attemptPhantasmBoundary({ source = "direct", trace = "", date = new Date() } = {}) {
  const now = validDate(date);
  let status = phantasmBoundaryStatus({ source, trace, date: now });
  if (status.allowed) {
    if (!status.session) {
      status = { ...status, session: grantSession(source, status.mode, status.schedule, now) };
      saveAttempts(status.attempts, { grantedAt: now.toISOString(), mode: status.mode, source });
    }
    return status;
  }
  if (!status.validSource || !status.traceValid) return status;
  const attempts = [...status.attempts, {
    at: now.toISOString(),
    source,
    signature: status.schedule.signature,
    reason: status.schedule.windowOpen ? "wrong-entrance" : "wrong-bell",
  }];
  saveAttempts(attempts, { deniedAt: now.toISOString(), source });
  status = phantasmBoundaryStatus({ source, trace, date: now });
  if (status.mercyReady) {
    const session = grantSession(source, "frayed", status.schedule, now);
    saveAttempts(status.attempts, { grantedAt: now.toISOString(), mode: "frayed", source });
    return { ...status, allowed: true, mode: "frayed", session };
  }
  return status;
}

export function phantasmGateHint(locale = "zh-Hant", source = "footer", value = new Date()) {
  const progress = phantasmGateProgress();
  const state = phantasmGateState();
  const schedule = phantasmBoundarySchedule(value);
  const normalizedSource = PHANTASM_ENTRANCES.includes(source) ? source : "footer";
  const boundary = phantasmBoundaryStatus({
    source: normalizedSource,
    trace: traceFor(normalizedSource, schedule),
    date: value,
  });
  const clue = phantasmEntranceClue(locale, schedule.primaryEntrance);
  const text = progress.count === 0
    ? catalogText("text")
    : progress.count < 3
      ? catalogText("text.2", { "zh-Hant": {value0: progress.count}, "ja": {value0: progress.count}, "en": {value0: progress.count} })
      : progress.count < progress.total
        ? catalogText("text.3", { "zh-Hant": {value0: progress.count}, "ja": {value0: progress.count}, "en": {value0: progress.count} })
        : boundary.resonant
          ? catalogText("text.4", { "zh-Hant": {value0: clue}, "ja": {value0: clue}, "en": {value0: clue} })
          : boundary.mercyReady
            ? catalogText("text.5")
            : catalogText("text.6", { "zh-Hant": {value0: clue}, "ja": {value0: clue}, "en": {value0: clue} });
  return {
    text: text[locale] || text["zh-Hant"],
    href: progress.eligible ? phantasmEntranceHref(normalizedSource, "phantasm-campus", value) : null,
    progress,
    unlocked: Boolean(state.unlockedAt),
    boundary,
    resonant: boundary.resonant,
  };
}

export const phantasmBoundaryStorageKeys = {
  boundary: BOUNDARY_KEY,
  session: SESSION_KEY,
};
