import {
  academicAssignments,
  academicExams,
  defenceRounds,
} from "../src/data/academic-work.js";
import { governanceProposals } from "../src/data/governance.js";
import {
  liveCampusSnapshot,
  liveDiningMenu,
  liveExamSchedule,
  liveRoomAvailability,
  liveTimetable,
  seededPostCreatedAt,
} from "../src/data/live-campus.js";
import { findCampusRoute } from "../src/data/routes.js";

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const locales = ["zh-Hant", "ja", "en"];

const sampleDates = Array.from({ length: 16 }, (_, index) => new Date(2026, 6, 20 + Math.floor(index / 4), (index % 4) * 6 + 1, 17));
const snapshots = sampleDates.map((date) => liveCampusSnapshot(date));
for (const [index, state] of snapshots.entries()) {
  const repeated = liveCampusSnapshot(new Date(sampleDates[index]));
  check(state.seed === repeated.seed && state.activeEvents.map((item) => item.id).join() === repeated.activeEvents.map((item) => item.id).join(), "Live campus snapshot is not deterministic for the same local time slot.");
  check(state.activeEvents.length === 2, "Each live-campus shift must carry two duty incidents.");
  check(state.activeEvents.every((event) => locales.every((locale) => event.title[locale] && event.body[locale] && event.rule[locale])), "A live-campus incident is missing localized operational copy.");
}
check(new Set(snapshots.map((state) => state.activeEvents.map((item) => item.id).sort().join("+"))).size >= 5, "Live-campus event rotation lacks meaningful variation.");

for (const locale of locales) {
  const menus = sampleDates.slice(0, 8).map((date) => liveDiningMenu(locale, date));
  const timetables = sampleDates.map((date) => liveTimetable(locale, date));
  check(menus.every((menu) => menu.length === 6 && menu.every((row) => row.length === 4)), `${locale}: dining rotation is malformed.`);
  check(timetables.every((table) => table.length === 6 && table.every((row) => row.length === 5)), `${locale}: timetable rotation is malformed.`);
  check(new Set(menus.map((menu) => menu.map((row) => row[0]).join("|"))).size >= 3, `${locale}: dining menus do not rotate.`);
  check(new Set(timetables.map((table) => table.map((row) => row[1]).join("|"))).size >= 3, `${locale}: timetables do not rotate.`);
  check(liveExamSchedule(locale, sampleDates[0]).every((row) => row.length === 4), `${locale}: live exam schedule is malformed.`);
}

const roomState = liveRoomAvailability(sampleDates[0]);
check(roomState.length >= 6 && roomState.some((room) => room.available) && roomState.every((room) => room.freeUntil && room.seats >= 4), "Live room finder does not yield usable rooms.");
const postTime = new Date(seededPostCreatedAt(4, 2, sampleDates[0]));
check(postTime < sampleDates[0] && sampleDates[0] - postTime < 86_400_000, "Seeded BBS post time is not a recent real timestamp.");

const openBroom = findCampusRoute("gate", "kappa", "broom");
const closedBroom = findCampusRoute("gate", "kappa", "broom", {
  closedModes: ["broom"],
  closedEdges: [],
  closedTransitNodes: [],
  modeDelay: {},
  edgeDelay: {},
});
check(openBroom?.edges.some((edge) => edge.kind === "broom"), "Open broom routing does not use the broom network.");
check(closedBroom?.edges.every((edge) => edge.kind === "walk"), "A closed broom network still appears in the route.");
const delayedWalk = findCampusRoute("gate", "boundary", "walk", {
  closedModes: [],
  closedEdges: [],
  closedTransitNodes: [],
  modeDelay: {},
  edgeDelay: { "boundary--gate": 9 },
});
check(delayedWalk && delayedWalk.minutes > 12, "A live edge delay does not affect route calculation.");

for (const proposal of governanceProposals) {
  check(proposal.choices.length === 3, `Governance proposal ${proposal.id} does not present three real choices.`);
  check(locales.every((locale) => proposal.title[locale] && proposal.summary[locale] && proposal.sponsor[locale] && proposal.reaction[locale]), `Governance proposal ${proposal.id} is missing localized copy.`);
  check(proposal.choices.every((choice) => locales.every((locale) => choice.label[locale] && choice.consequence[locale])), `Governance proposal ${proposal.id} has an untranslated consequence.`);
}

const answerFor = (question) => {
  if (question.type === "choice") return question.answer;
  if (question.type === "number") return String(question.answer.value);
  const keywords = question.answer.keywordGroups.map((group) => group[0]).join(" ");
  return `${keywords} ${"記錄".repeat(Math.max(12, question.answer.minLength))}`;
};

for (const assessment of [...academicAssignments, ...academicExams]) {
  check(assessment.questions.length >= 3, `Academic assessment ${assessment.id} is too shallow.`);
  check(locales.every((locale) => assessment.title[locale]), `Academic assessment ${assessment.id} has no localized title.`);
  for (const question of assessment.questions) {
    check(Number.isFinite(question.points) && question.points > 0, `${assessment.id}/${question.id} has invalid points.`);
    check(locales.every((locale) => question.prompt[locale] && question.explanation[locale]), `${assessment.id}/${question.id} lacks localized prompt or scoring explanation.`);
    if (question.type === "choice") {
      check(question.options.some((option) => option.id === question.answer), `${assessment.id}/${question.id} answer is not an option.`);
      check(question.options.every((option) => locales.every((locale) => option.label[locale])), `${assessment.id}/${question.id} has an untranslated option.`);
    }
  }
}
check(defenceRounds.length === 3 && defenceRounds.every((round) => Object.values(round.scores).some((score) => score === 20)), "Defence committee does not contain three substantive scored rounds.");

class MemoryStorage {
  #records = new Map();
  getItem(key) { return this.#records.has(key) ? this.#records.get(key) : null; }
  setItem(key, value) { this.#records.set(key, String(value)); }
  removeItem(key) { this.#records.delete(key); }
  clear() { this.#records.clear(); }
}

const eventTarget = new EventTarget();
globalThis.window = eventTarget;
window.localStorage = new MemoryStorage();
window.dispatchEvent = eventTarget.dispatchEvent.bind(eventTarget);
globalThis.CustomEvent ??= class CustomEvent extends Event {
  constructor(type, options = {}) {
    super(type);
    this.detail = options.detail;
  }
};

const academic = await import("../src/js/academic-model.js");
const firstAssignment = academicAssignments[0];
const assignmentAnswers = Object.fromEntries(firstAssignment.questions.map((question) => [question.id, answerFor(question)]));
academic.saveAssignmentDraft(firstAssignment.id, { memo: "中文輸入草稿會留下" });
const submission = academic.submitAssignment(firstAssignment.id, assignmentAnswers);
check(submission.record?.percent === 100 && academic.academicSubmissions().length === 1, "Academic assignment model does not grade and retain a correct attempt.");

const exam = academicExams[0];
academic.startAcademicExam(exam.id);
academic.saveAcademicExamAnswers(Object.fromEntries(exam.questions.map((question) => [question.id, answerFor(question)])));
const examAttempt = academic.finishAcademicExam();
check(examAttempt.record?.percent === 100 && !academic.currentExamSession(), "Timed exam model does not finish, grade, and close its session.");

const project = academic.submitAcademicProject({
  type: "spellcard",
  title: "月相與退路窗口",
  abstract: "比較八個月相格下的宣言、預兆與退路窗口，保存每次成功與失敗的版本差異，並把未能重現的輪次一併列入公開回條。",
  claim: "指定月相與場地存在可重現的最低退路寬度。",
  method: "保存彈幕版本、材料批次、場地、月相與停止原因，依固定程序重複三輪。",
  stopRule: "出現傷害、失控或不可逆偏移時立即停止。",
});
const defence = academic.completeAcademicDefence(project.record?.id, { claim: "scope", method: "record", stop: "precommit" });
const gradebook = academic.academicGradebook();
check(project.record?.type === "spellcard" && defence.record?.outcome === "passed" && defence.record.percent === 100, "Spell-card defence model does not issue the expected ruling.");
check(gradebook.average === 100 && gradebook.graded.length === 3, "Academic gradebook does not combine assignment, exam, and defence results.");

if (failures.length) {
  console.error(`Live campus / academic model check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Live campus and academics valid: ${snapshots.length} shifts, ${governanceProposals.length} proposals, `
  + `${academicAssignments.length} assignments, ${academicExams.length} timed exam, and ${defenceRounds.length} defence rounds.`,
);
