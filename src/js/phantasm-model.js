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
    ordinary: locale === "ja"
      ? `提出済み答案は ${Number.isFinite(percent) ? `${percent}%` : "採点済み"} として保存された。`
      : locale === "en"
        ? `The submitted answer remains ${Number.isFinite(percent) ? `graded at ${percent}%` : "graded"} in the ordinary record.`
        : `提交答案以${Number.isFinite(percent) ? ` ${percent}%` : "已判分"}留在正式回條。`,
    dream: locale === "ja"
      ? "書かなかった選択肢が満点答案として再提出され、元の答案へ出典を要求している。"
      : locale === "en"
        ? "An option you did not write has resubmitted itself for full marks and asks the ordinary answer for a citation."
        : "沒有寫下的選項以滿分答案重新提交，並要求正式答案標註引用。",
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
      ? `${locale === "ja" ? "投票" : locale === "en" ? "Ballot" : "正式投票"}：${localize(selected.label, locale)}`
      : localize(phantasmSealCopy.governance.found, locale),
    dream: alternative
      ? `${locale === "ja" ? "影の可決" : locale === "en" ? "Passed in shadow" : "影子議場通過"}：${localize(alternative.label, locale)} — ${localize(alternative.consequence, locale)}`
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
      ? `${locale === "ja" ? "終結仮説" : locale === "en" ? "Closure hypothesis" : "結案假說"}：${localize(selected.title, locale)}`
      : localize(phantasmSealCopy.incident.found, locale),
    dream: rejected
      ? `${locale === "ja" ? "夢の正式結論" : locale === "en" ? "Official dream conclusion" : "夢境正式結論"}：${localize(rejected.title, locale)} — ${localize(rejected.rationale, locale)}`
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
    title: roomLabel || (locale === "ja" ? "断った部屋" : locale === "en" ? "Declined room" : "拒絕過的房間"),
    sourceAt: application?.updatedAt || seal.timestamp,
    ordinary: `${locale === "ja" ? "辞退済み" : locale === "en" ? "Offer declined" : "已拒絕分房"}${offer?.score ? ` · ${offer.score}%` : ""}`,
    dream: roommate
      ? `${localize(roommate.name, locale)}${locale === "ja" ? "は昨夜あなたが帰らなかったと言う。" : locale === "en" ? " says you failed to come home last night." : "表示你昨夜沒有回來，要求補簽寢室點名。"}`
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
    ordinary: locale === "ja" ? "通常時間割から履修取消。" : locale === "en" ? "Dropped from the ordinary timetable." : "已從普通課表退選。",
    dream: locale === "ja"
      ? "第九時限へ自動登録。教室は「元の場所の裏」、担当は出席簿だけが知っている。"
      : locale === "en"
        ? "Automatically enrolled in ninth period. The room is “behind the original room”; only the roll knows the instructor."
        : "自動編入第九節；教室為「原教室背面」，授課教師只有點名簿知道。",
  };
}

function unusedRouteFragment(seal, locale) {
  const project = seal.project;
  return {
    id: "counter-unused-route",
    sealId: "unused-route",
    mark: "未",
    title: project?.title || (locale === "ja" ? "採用しなかった経路" : locale === "en" ? "Route deliberately not taken" : "刻意沒有採用的路線"),
    sourceAt: seal.defence?.completedAt || seal.timestamp,
    ordinary: project?.unusedRoute || localize(phantasmSealCopy["unused-route"].found, locale),
    dream: locale === "ja"
      ? "未踏経路はBND-∞の主教材として採用され、正式研究へ「自分を採用しなかった理由」の引用を要求した。"
      : locale === "en"
        ? "The unused route becomes the primary text for BND-∞ and asks the official project to cite why it was not adopted."
        : "未行路線成為 BND-∞ 主教材，並要求正式研究引用「為何沒有採用自己」。",
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
    ordinary: locale === "ja" ? "通常図書館の記録では返却済み。" : locale === "en" ? "Returned in the ordinary library record." : "普通圖書館記錄：已歸還。",
    dream: locale === "ja"
      ? "本は貸出自体を否認し、あなたを返却した側だと主張している。"
      : locale === "en"
        ? "The book denies the loan and says it was the party that returned you."
        : "館藏否認曾被借出，並表示其實是它把你歸還了。",
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
      ruling: {
        "zh-Hant": `${name} 裁定：未行路線准予在夢境校區保留，不得冒充正式結論。`,
        ja: `${name}裁定：未踏経路は夢境キャンパスで保存可。正式結論を名乗ってはならない。`,
        en: `${name} rules that the untaken route may remain in Dream Campus but may not impersonate an official conclusion.`,
      },
      condition: {
        "zh-Hant": "每次引用時，必須同頁附上醒著時真正採用的路線。",
        ja: "引用時は、覚醒時に実際採用した経路を同じ頁へ添付すること。",
        en: "Every citation must show the route actually adopted while awake on the same page.",
      },
      dissent: {
        "zh-Hant": "靈夢少數意見：既然沒有走，路費不應報銷。",
        ja: "霊夢少数意見：通っていないなら旅費精算不可。",
        en: "Reimu dissents: a route not taken cannot claim travel expenses.",
      },
    },
    conditional: {
      ruling: {
        "zh-Hant": `${name} 裁定：附帶夢界條件通過；可教學，不可倒灌正式學籍。`,
        ja: `${name}裁定：夢境条件付き可。教材利用可、正式学籍への逆流不可。`,
        en: `${name} grants dream-boundary conditional approval: teachable here, never backfilled into official records.`,
      },
      condition: {
        "zh-Hant": "鐘響後須重新說明一次為何沒有採用；理由若完全相同，視為仍在做夢。",
        ja: "鐘の後に不採用理由を再説明。同文なら覚醒していないものとする。",
        en: "After the bell, explain again why it was not adopted. An identical answer proves you are still dreaming.",
      },
      dissent: {
        "zh-Hant": "文少數意見：『附帶條件』四字可在號外第二版再補。",
        ja: "文少数意見：「条件付き」は号外第二版で追記可能。",
        en: "Aya dissents that “conditional” may be added in the extra edition's second printing.",
      },
    },
    wake: {
      ruling: {
        "zh-Hant": `${name} 裁定：論證成立得過於整齊，先醒一次再決定是否保留。`,
        ja: `${name}裁定：論証が整いすぎている。一度覚醒してから保存を再判断。`,
        en: `${name} finds the argument suspiciously tidy and orders one waking before retention is reconsidered.`,
      },
      condition: {
        "zh-Hant": "醒來後若仍記得同一條路，可在夢學籍續頁補一個不一致的細節。",
        ja: "覚醒後も同じ道を覚えていれば、夢学籍の続紙へ矛盾を一つ追記できる。",
        en: "If the route survives waking, add one inconsistent detail on the dream transcript continuation sheet.",
      },
      dissent: {
        "zh-Hant": "多蕾米少數意見：太整齊的夢通常只是校務表格，不必浪費食慾。",
        ja: "ドレミー少数意見：整いすぎた夢は学務様式にすぎず、食欲を使うほどではない。",
        en: "Doremy dissents that a dream this tidy is probably an administrative form and not worth an appetite.",
      },
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
    author: locale === "ja" ? "北階段の点呼係（未登録）" : locale === "en" ? "North Stair Roll Keeper (unregistered)" : "北樓梯點名員（未登錄）",
    title: locale === "ja" ? "第九時限の教室を知っている人？" : locale === "en" ? "Does anyone know the ninth-period room?" : "有人知道第九節教室在哪裡嗎？",
    body: progress.count < 3
      ? (locale === "ja"
        ? "時間割にはないのに、北階段を下ると四階の出席簿だけ増える。誤植なら、なぜ毎週違う名前が欠席なのか。"
        : locale === "en"
          ? "It is not on the timetable, but descending the north stair adds a fourth-floor roll. If it is a typo, why is a different name absent each week?"
          : "課表沒有，可是北樓梯往下走會多出四樓點名簿。若是錯字，為何每週缺席的是不同名字？")
      : (locale === "ja"
        ? `点呼簿の裏から印が${progress.count}個透けた。学務へ持参したら、表だけ返された。`
        : locale === "en"
          ? `${progress.count} seals showed through the roll. Academic Affairs returned only its front side.`
          : `點名簿背面透出 ${progress.count} 枚印章；拿去教務處後，只還回了正面。`),
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
    author: locale === "ja" ? "試験机の裏面係（表には不在）" : locale === "en" ? "Reverse-Side Exams Clerk (absent from front)" : "試務桌反面職員（正面查無此人）",
    title: locale === "ja" ? "EXTRAの裏にPHANTASM問題があるって本当？" : locale === "en" ? "Is there really a PHANTASM paper behind EXTRA?" : "EXTRA 背面真的有 PHANTASM 試卷嗎？",
    body: extraAttempts.length
      ? (locale === "ja"
        ? "EXTRA提出印を灯りへ透かすと、九問・百五十点と読める。試験係はインク染みだと言うが、染みが『正式成績へ転記不可』と三言語で注意している。"
        : locale === "en"
          ? "Hold an EXTRA submission seal to the light and it reads nine questions, 150 marks. Exams calls it an ink stain, although the stain warns in three languages not to enter the score officially."
          : "把 EXTRA 交卷章對著光，背面會讀出九題、一百五十分。試務處說那只是墨漬，但墨漬用三種語言警告不得登錄正式成績。")
      : (locale === "ja"
        ? "最初に尋ねた受験者は「まずEXTRAを終えよ」という無署名紙片を受け取った。二度目に尋ねると、紙片は自分が最初の返答ではないと主張した。"
        : locale === "en"
          ? "The first candidate to ask received an unsigned slip: 'Finish EXTRA first.' Asked again, the slip denied being the first answer."
          : "第一位去問的考生收到無署名紙條：『先把 EXTRA 寫完。』再問一次，紙條否認自己是第一份回答。"),
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
      author: locale === "ja" ? "文々。第九版（初版なし）" : locale === "en" ? "Bunbunmaru Ninth Edition (no first edition)" : "文文。第九版（沒有第一版）",
      title: locale === "ja" ? "訂正：夢学籍は存在しないが、印刷は可能" : locale === "en" ? "Correction: dream transcripts do not exist, but can be printed" : "訂正：夢學籍不存在，但可以列印",
      body: locale === "ja"
        ? `${latest.id}は正式学籍へ入っていない。にもかかわらず紙面を一頁使ったため、大学は「存在しない」とだけ回答した。`
        : locale === "en"
          ? `${latest.id} is absent from the official registry yet used one full sheet of paper. The university answered only that it “does not exist.”`
          : `${latest.id} 不在正式學籍，卻用掉了一整張紙；校方僅回覆「不存在」。`,
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
