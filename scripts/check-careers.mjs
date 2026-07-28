const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

class MemoryStorage {
  #values = new Map();
  get length() { return this.#values.size; }
  key(index) { return [...this.#values.keys()][index] ?? null; }
  getItem(key) { return this.#values.has(key) ? this.#values.get(key) : null; }
  setItem(key, value) { this.#values.set(key, String(value)); }
  removeItem(key) { this.#values.delete(key); }
  clear() { this.#values.clear(); }
}

globalThis.localStorage = new MemoryStorage();
globalThis.window = {
  localStorage: globalThis.localStorage,
  sessionStorage: new MemoryStorage(),
  dispatchEvent() {},
};
globalThis.CustomEvent = class {
  constructor(type, options = {}) { this.type = type; this.detail = options.detail; }
};

const { schools } = await import("../src/data/schools.js");
const { academicAssignments, academicExams } = await import("../src/data/academic-work.js");
const { alumniChapters, careerOpenings, graduationTracks } = await import("../src/data/careers.js");
const {
  activateAlumniProfile,
  careersStorageKeys,
  careerMatches,
  graduationEvidence,
  issueGraduationDegree,
  offerAlumniMentorship,
  requestGraduationAudit,
  rsvpAlumniReunion,
  sendCareerReferral,
  submitCareerPlan,
} = await import("../src/js/careers-model.js");
const { campusEventContracts } = await import("../src/data/event-contracts.js");
const { localRecordRegistry } = await import("../src/data/local-records.js");
const { pageForRoute } = await import("../src/js/site-router.js");

check(careerOpenings.length === 12, "Careers must publish exactly twelve substantial destination files.");
check(alumniChapters.length === 8, "Hyakki Yagyo Alumni must open with eight problem-based chapters.");
check(graduationTracks.length === 4, "Graduation must preserve ordinary, long-lived, fairy-repeat, and chronology-dispute tracks.");
check(new Set(careerOpenings.map(({ id }) => id)).size === 12, "Career destination ids are not unique.");

localStorage.setItem("tu:identity", JSON.stringify({
  id: "TU-S-CHECK",
  name: "外界測試生",
  preferredSchool: "boundary",
}));
localStorage.setItem("tu:courses:transcript", JSON.stringify(
  schools.boundary.courses.map(([courseCode]) => ({ courseCode, grade: "A", status: "completed" })),
));
localStorage.setItem("tu:academics:submissions", JSON.stringify([
  { id: "AS-CHECK", assignmentId: academicAssignments[0].id, percent: 100 },
]));
localStorage.setItem("tu:academics:exam-attempts", JSON.stringify([
  { id: "EX-CHECK", examId: academicExams[0].id, percent: 100 },
]));
localStorage.setItem("tu:academics:projects", JSON.stringify([
  { id: "PR-CHECK", type: "thesis", status: "passed" },
]));
localStorage.setItem("tu:academics:defences", JSON.stringify([
  { id: "DEF-CHECK", projectId: "PR-CHECK", outcome: "passed", percent: 94 },
]));
localStorage.setItem("tu:ethics:protocols", JSON.stringify([
  { id: "ERB-CHECK", outcome: "approved", status: "active", draft: {}, createdAt: "2026-07-28T00:00:00Z" },
]));
localStorage.setItem("tu:fieldwork:passport", JSON.stringify({
  number: "FW-CHECK",
  stamps: [{
    id: "STAMP-CHECK",
    stationId: "hakurei-shrine",
    placementId: "PLACE-CHECK",
    issuedAt: "2026-07-28T00:00:00Z",
    hours: 8,
    credits: 2,
    standing: "clear",
    research: "allowed",
  }],
}));
localStorage.setItem("tu:phantasm:transcripts", JSON.stringify([{ id: "DREAM-CHECK" }]));

const input = {
  schoolId: "boundary",
  trackId: "ordinary",
  enrolmentYear: 142,
  graduationYear: 146,
  priorCredits: schools.boundary.credits,
  archivedCoreCodes: schools.boundary.courses.map(([code]) => code),
  provenance: "稗田館第七櫃幻想曆一四二年至一四六年完整成績拓印",
  acceptsAttachments: true,
  unresolvedQuestion: "畢業以後，結界內外究竟由誰替沉默的一方留下異議？",
};
const evidence = graduationEvidence(input);
check(evidence.requirements.length === 8, "Graduation audit must keep eight independently visible desks.");
check(evidence.canIssue, `Fully evidenced audit should be issuable; missing ${evidence.missing}.`);
check(evidence.earnedCredits === Number(schools.boundary.credits), "Prior credits must be capped at the degree requirement.");
check(evidence.dream.reverseCredits === -3, "One PHANTASM trace should show -3 on the reverse without changing official credits.");

const auditResult = requestGraduationAudit(input, new Date("2026-07-28T01:00:00Z"));
check(auditResult.record?.canIssue, "A complete graduation audit was not persisted as issuable.");
const degreeResult = issueGraduationDegree(auditResult.record?.id, true, new Date("2026-07-28T01:09:00Z"));
check(degreeResult.record?.degreeNumber.includes("卒"), "Degree unsealing did not create a degree number.");
check(degreeResult.record?.dream.reverseCredits === -3, "Degree lost its separate reverse-side PHANTASM trace.");

const profile = {
  schoolId: "history",
  domainIds: ["archive", "teaching", "field"],
  scheduleId: "day",
  compensationId: "yen",
  travelId: "foot",
  chaosTolerance: 3,
  refusal: "拒絕把異本刪成只剩最方便的一份",
  question: "若星期三被刪掉，薪資應由哪一版校曆支付？",
};
const matches = careerMatches(profile, "zh-Hant");
check(matches.length === 12 && matches[0].reasons.length, "Career matching must explain and rank all twelve destinations.");
const planResult = submitCareerPlan(profile, "zh-Hant", new Date("2026-07-28T02:00:00Z"));
const referralResult = sendCareerReferral(
  planResult.record?.id,
  planResult.record?.matches[0]?.openingId,
  "請連同未採用版本與拒絕事項一併交給現場主持",
  new Date("2026-07-28T02:09:00Z"),
);
check(referralResult.referral?.status === "sent", "Career referral was not persisted.");

const alumniResult = activateAlumniProfile({
  degreeId: degreeResult.record?.id,
  displayName: "外界測試生・第二版",
  chapterId: "higan-late-arrivals",
  unresolvedQuestion: input.unresolvedQuestion,
}, new Date("2026-07-28T00:51:00Z"));
check(alumniResult.record?.activatedAt < degreeResult.record?.issuedAt, "The test must preserve an alumni invitation predating graduation.");
check(rsvpAlumniReunion(true, "帶一盞晚到九分鐘的燈").record?.reunion?.attending, "Alumni RSVP did not persist.");
check(offerAlumniMentorship(["archive"], "只協助保存異本，不替學生選擇唯一真相").record?.mentorship, "Alumni mentorship did not persist.");

const registeredKeys = new Set(localRecordRegistry.map(({ key }) => key));
Object.values(careersStorageKeys).forEach((key) => check(registeredKeys.has(key), `Missing local-record registry entry ${key}.`));
[
  "graduation.audit.requested",
  "graduation.degree.issued",
  "career.plan.submitted",
  "career.referral.sent",
  "alumni.profile.activated",
  "alumni.reunion.rsvp",
  "alumni.mentorship.offered",
].forEach((type) => check(campusEventContracts[type], `Missing campus event contract ${type}.`));
["graduation-audit", "career-office", "career-opening-terakoya-missing-year", "alumni-chapter-higan-late-arrivals"]
  .forEach((route) => check(pageForRoute(route) === "careers", `Route ${route} does not resolve to careers.html.`));

if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Graduation, careers, and alumni valid: 8 audit desks, 12 destinations, 8 alumni chapters, 5 local files, and 7 causal event contracts.");
