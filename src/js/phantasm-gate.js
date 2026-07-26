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

const entranceRiddles = {
  "zh-Hant": {
    footer: "落款之後、權利聲明以前",
    mytu: "正式學籍不肯承認的第九行",
    map: "今日木板被雨泡開的折痕",
    search: "查無結果之後仍留著的下一筆",
    bbs: "沒有作者、卻有人回覆的帖子",
  },
  ja: {
    footer: "署名の後、権利表示の前",
    mytu: "正式学籍が認めない第九行",
    map: "本日の木板を雨が開いた折り目",
    search: "該当なしの後にも残る次の一件",
    bbs: "投稿者なし、返信ありのスレッド",
  },
  en: {
    footer: "after the signature and before the rights notice",
    mytu: "the ninth row the official record refuses",
    map: "the rain-opened crease in today's wooden map notice",
    search: "the next result left after no results",
    bbs: "a thread with replies but no author",
  },
};

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
    ? {
      "zh-Hant": "鐘樓維修單：第一至第八格已核對；第九格不必填。",
      ja: "鐘楼修繕票：第一〜第八欄確認済み。第九欄は記入不要。",
      en: "Bell-tower repair slip: boxes one through eight verified; box nine need not be completed.",
    }
    : progress.count < 3
      ? {
        "zh-Hant": `課表背面有 ${progress.count} 枚印章透了過來；教務處說紙太薄。`,
        ja: `時間割の裏から印が${progress.count}個透けている。学務は紙が薄いだけだと言う。`,
        en: `${progress.count} seals show through the back of the timetable; Academic Affairs blames thin paper.`,
      }
      : progress.count < progress.total
        ? {
          "zh-Hant": `點名簿多了第九行，又被劃掉；目前有 ${progress.count} 個筆跡不肯消失。`,
          ja: `点呼簿に九行目が増え、また消された。現在${progress.count}筆跡が消去を拒む。`,
          en: `A ninth roll-call row appeared and was crossed out; ${progress.count} marks currently refuse erasure.`,
        }
        : boundary.resonant
          ? {
            "zh-Hant": `這一頁的紙背在本值鐘有溫度；月影從${clue}往下漏。`,
            ja: `この頁の裏は今の当番鐘だけ温かい。月影が${clue}から下へ漏れている。`,
            en: `The reverse of this page is warm for the present duty bell; moonlight leaks down from ${clue}.`,
          }
          : boundary.mercyReady
            ? {
              "zh-Hant": "幾扇錯門已把紙磨薄；下一筆新墨可能直接穿過反面。",
              ja: "いくつもの誤扉が紙を薄くした。次の新しい筆跡は裏まで抜けるかもしれない。",
              en: "Several wrong doors have worn the paper thin; the next fresh mark may pass through its reverse.",
            }
            : {
              "zh-Hant": `六印齊了，但本值鐘的入口不在此頁。月相把它註在：${clue}。`,
              ja: `六印は揃ったが、今の当番鐘の入口はこの頁ではない。月相の注記：${clue}。`,
              en: `All six seals are present, but this duty bell opens elsewhere. The lunar note points to ${clue}.`,
            };
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
