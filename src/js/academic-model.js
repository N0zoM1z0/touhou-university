import {
  academicAssignments,
  academicExams,
  academicGradeBands,
  defenceRounds,
} from "../data/academic-work.js";

const DRAFT_KEY = "tu:academics:drafts";
const SUBMISSION_KEY = "tu:academics:submissions";
const EXAM_SESSION_KEY = "tu:academics:exam-session";
const EXAM_ATTEMPT_KEY = "tu:academics:exam-attempts";
const PROJECT_KEY = "tu:academics:projects";
const DEFENCE_KEY = "tu:academics:defences";
const MAX_RECORDS = 80;

function readJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function hashValue(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function emit(type, detail = {}) {
  window.dispatchEvent(new CustomEvent("tu:academicchange", { detail: { type, ...detail } }));
}

function normalizeAnswers(value = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([id, answer]) => typeof id === "string" && ["string", "number"].includes(typeof answer))
      .map(([id, answer]) => [id, String(answer).slice(0, 2_000)]),
  );
}

export function academicDrafts() {
  const drafts = readJson(DRAFT_KEY, {});
  return drafts && typeof drafts === "object" && !Array.isArray(drafts) ? drafts : {};
}

export function assignmentDraft(assignmentId) {
  return normalizeAnswers(academicDrafts()[assignmentId]?.answers);
}

export function saveAssignmentDraft(assignmentId, answers) {
  if (!academicAssignments.some((item) => item.id === assignmentId)) return null;
  const drafts = academicDrafts();
  const record = {
    schema: 1,
    assignmentId,
    answers: normalizeAnswers(answers),
    updatedAt: new Date().toISOString(),
  };
  drafts[assignmentId] = record;
  writeJson(DRAFT_KEY, drafts);
  emit("assignment-draft", { assignmentId });
  return record;
}

export function academicSubmissions() {
  const records = readJson(SUBMISSION_KEY, []);
  return Array.isArray(records)
    ? records.filter((record) => academicAssignments.some((item) => item.id === record?.assignmentId))
    : [];
}

function scoreQuestion(item, answer) {
  const value = String(answer ?? "").trim();
  let correct = false;
  if (item.type === "choice") correct = value === item.answer;
  if (item.type === "number") {
    const number = Number(value.replaceAll(",", "").replaceAll("，", ""));
    correct = Number.isFinite(number) && Math.abs(number - item.answer.value) <= item.answer.tolerance;
  }
  if (item.type === "text") {
    const normalized = value.toLocaleLowerCase();
    correct =
      value.length >= item.answer.minLength
      && item.answer.keywordGroups.every((group) => group.some((keyword) => normalized.includes(keyword.toLocaleLowerCase())));
  }
  return { questionId: item.id, answer: value, correct, earned: correct ? item.points : 0, possible: item.points };
}

function gradeQuestions(questions, answers) {
  const results = questions.map((item) => scoreQuestion(item, answers[item.id]));
  const earned = results.reduce((sum, item) => sum + item.earned, 0);
  const possible = results.reduce((sum, item) => sum + item.possible, 0);
  return { results, earned, possible, percent: possible ? Math.round((earned / possible) * 100) : 0 };
}

export function latestAssignmentSubmission(assignmentId) {
  return academicSubmissions().findLast((record) => record.assignmentId === assignmentId) || null;
}

export function submitAssignment(assignmentId, answers) {
  const assignment = academicAssignments.find((item) => item.id === assignmentId);
  if (!assignment) return { error: "missing-assignment" };
  const normalized = normalizeAnswers(answers);
  if (assignment.questions.some((item) => !String(normalized[item.id] || "").trim())) return { error: "incomplete" };
  const grading = gradeQuestions(assignment.questions, normalized);
  const submittedAt = new Date().toISOString();
  const record = {
    schema: 1,
    id: `TU-AS-${hashValue(`${assignmentId}:${submittedAt}`).toString(36).toUpperCase()}`,
    assignmentId,
    courseCode: assignment.courseCode,
    answers: normalized,
    ...grading,
    submittedAt,
    status: "graded",
  };
  const records = academicSubmissions();
  records.push(record);
  writeJson(SUBMISSION_KEY, records.slice(-MAX_RECORDS));
  const drafts = academicDrafts();
  delete drafts[assignmentId];
  writeJson(DRAFT_KEY, drafts);
  emit("assignment-submitted", { assignmentId, id: record.id });
  return { record };
}

export function currentExamSession() {
  const session = readJson(EXAM_SESSION_KEY, null);
  if (!academicExams.some((item) => item.id === session?.examId) || session?.status !== "active") return null;
  return {
    ...session,
    answers: normalizeAnswers(session.answers),
  };
}

export function startAcademicExam(examId) {
  const exam = academicExams.find((item) => item.id === examId);
  if (!exam) return null;
  const active = currentExamSession();
  if (active?.examId === examId) return active;
  const startedAt = new Date().toISOString();
  const record = {
    schema: 1,
    id: `TU-EXAM-${hashValue(`${examId}:${startedAt}`).toString(36).toUpperCase()}`,
    examId,
    answers: {},
    startedAt,
    endsAt: new Date(new Date(startedAt).getTime() + exam.durationMinutes * 60_000).toISOString(),
    status: "active",
  };
  writeJson(EXAM_SESSION_KEY, record);
  emit("exam-started", { examId, id: record.id });
  return record;
}

export function saveAcademicExamAnswers(answers) {
  const session = currentExamSession();
  if (!session) return null;
  const next = { ...session, answers: normalizeAnswers(answers), updatedAt: new Date().toISOString() };
  writeJson(EXAM_SESSION_KEY, next);
  emit("exam-draft", { examId: session.examId });
  return next;
}

export function academicExamAttempts() {
  const records = readJson(EXAM_ATTEMPT_KEY, []);
  return Array.isArray(records)
    ? records.filter((record) => academicExams.some((item) => item.id === record?.examId))
    : [];
}

export function finishAcademicExam({ force = false } = {}) {
  const session = currentExamSession();
  const exam = academicExams.find((item) => item.id === session?.examId);
  if (!session || !exam) return { error: "no-session" };
  const timedOut = Date.now() >= new Date(session.endsAt).getTime();
  if (!force && !timedOut && exam.questions.some((item) => !String(session.answers[item.id] || "").trim())) {
    return { error: "incomplete" };
  }
  const grading = gradeQuestions(exam.questions, session.answers);
  const completedAt = new Date().toISOString();
  const record = {
    ...session,
    ...grading,
    completedAt,
    timedOut,
    status: "graded",
  };
  const records = academicExamAttempts();
  records.push(record);
  writeJson(EXAM_ATTEMPT_KEY, records.slice(-MAX_RECORDS));
  window.localStorage.removeItem(EXAM_SESSION_KEY);
  emit("exam-completed", { examId: exam.id, id: record.id });
  return { record };
}

export function academicProjects() {
  const records = readJson(PROJECT_KEY, []);
  return Array.isArray(records) ? records.filter((record) => ["thesis", "spellcard"].includes(record?.type)) : [];
}

export function submitAcademicProject(values = {}) {
  const title = String(values.title || "").trim();
  const abstract = String(values.abstract || "").trim();
  const claim = String(values.claim || "").trim();
  const method = String(values.method || "").trim();
  const stopRule = String(values.stopRule || "").trim();
  const unusedRoute = String(values.unusedRoute || "").trim();
  const type = values.type === "spellcard" ? "spellcard" : "thesis";
  if (!title || abstract.length < 40 || claim.length < 18 || method.length < 24 || stopRule.length < 12) {
    return { error: "incomplete" };
  }
  const submittedAt = new Date().toISOString();
  const record = {
    schema: 1,
    id: `TU-${type === "spellcard" ? "SC" : "TH"}-${hashValue(`${title}:${submittedAt}`).toString(36).toUpperCase()}`,
    type,
    title: title.slice(0, 120),
    abstract: abstract.slice(0, 1_500),
    claim: claim.slice(0, 700),
    method: method.slice(0, 1_000),
    stopRule: stopRule.slice(0, 700),
    unusedRoute: unusedRoute.length >= 18 ? unusedRoute.slice(0, 700) : "",
    submittedAt,
    status: "defence-ready",
    committee: type === "spellcard" ? ["reimu", "marisa", "yukari"] : ["keine", "yukari", "marisa"],
  };
  const records = academicProjects();
  records.push(record);
  writeJson(PROJECT_KEY, records.slice(-30));
  emit("project-submitted", { projectId: record.id });
  return { record };
}

export function academicDefences() {
  const records = readJson(DEFENCE_KEY, []);
  return Array.isArray(records)
    ? records.filter((record) => academicProjects().some((project) => project.id === record?.projectId))
    : [];
}

export function defenceForProject(projectId) {
  return academicDefences().findLast((record) => record.projectId === projectId) || null;
}

export function completeAcademicDefence(projectId, answers = {}) {
  const project = academicProjects().find((item) => item.id === projectId);
  if (!project || defenceForProject(projectId)) return { error: project ? "already-completed" : "missing-project" };
  if (defenceRounds.some((round) => !round.choices.some((choice) => choice.id === answers[round.id]))) {
    return { error: "incomplete" };
  }
  const results = defenceRounds.map((round) => ({
    roundId: round.id,
    answer: answers[round.id],
    earned: round.scores[answers[round.id]] || 0,
    possible: 20,
  }));
  const earned = results.reduce((sum, item) => sum + item.earned, 0);
  const possible = results.reduce((sum, item) => sum + item.possible, 0);
  const percent = Math.round((earned / possible) * 100);
  const outcome = percent >= 80 ? "passed" : percent >= 60 ? "conditional" : "revise";
  const completedAt = new Date().toISOString();
  const record = {
    schema: 1,
    id: `TU-DEF-${hashValue(`${projectId}:${completedAt}`).toString(36).toUpperCase()}`,
    projectId,
    projectType: project.type,
    answers: normalizeAnswers(answers),
    results,
    earned,
    possible,
    percent,
    outcome,
    completedAt,
  };
  const records = academicDefences();
  records.push(record);
  writeJson(DEFENCE_KEY, records.slice(-30));
  const projects = academicProjects().map((item) => item.id === projectId ? { ...item, status: outcome, defendedAt: completedAt } : item);
  writeJson(PROJECT_KEY, projects);
  emit("defence-completed", { projectId, id: record.id });
  return { record };
}

export function gradeBand(percent) {
  return academicGradeBands.find((band) => percent >= band.min) || academicGradeBands.at(-1);
}

export function academicGradebook() {
  const assignmentEntries = academicAssignments.map((assignment) => {
    const attempts = academicSubmissions().filter((record) => record.assignmentId === assignment.id);
    const best = attempts.slice().sort((a, b) => b.percent - a.percent)[0] || null;
    return {
      id: assignment.id,
      kind: "assignment",
      courseCode: assignment.courseCode,
      title: assignment.title,
      percent: best?.percent ?? null,
      recordId: best?.id || null,
      attempts: attempts.length,
    };
  });
  const examEntries = academicExams.map((exam) => {
    const attempts = academicExamAttempts().filter((record) => record.examId === exam.id);
    const best = attempts.slice().sort((a, b) => b.percent - a.percent)[0] || null;
    return {
      id: exam.id,
      kind: "exam",
      courseCode: exam.code,
      title: exam.title,
      percent: best?.percent ?? null,
      recordId: best?.id || null,
      attempts: attempts.length,
    };
  });
  const defenceEntries = academicDefences().map((record) => {
    const project = academicProjects().find((item) => item.id === record.projectId);
    return {
      id: record.projectId,
      kind: "defence",
      courseCode: project?.type === "spellcard" ? "DEF-SC" : "DEF-TH",
      title: {
        "zh-Hant": project?.title || "—",
        ja: project?.title || "—",
        en: project?.title || "—",
      },
      percent: record.percent,
      recordId: record.id,
      attempts: 1,
      outcome: record.outcome,
    };
  });
  const entries = [...assignmentEntries, ...examEntries, ...defenceEntries];
  const graded = entries.filter((entry) => Number.isFinite(entry.percent));
  const average = graded.length
    ? Math.round(graded.reduce((sum, entry) => sum + entry.percent, 0) / graded.length)
    : null;
  return { entries, graded, average, band: Number.isFinite(average) ? gradeBand(average) : null };
}

export function academicCommunityPosts(locale) {
  const outcomes = {
    passed: {
      "zh-Hant": "通過",
      ja: "合格",
      en: "passed",
    },
    conditional: {
      "zh-Hant": "有條件通過",
      ja: "条件付合格",
      en: "conditionally passed",
    },
    revise: {
      "zh-Hant": "退回補正",
      ja: "補正再提出",
      en: "returned for revision",
    },
  };
  return academicDefences()
    .slice()
    .reverse()
    .flatMap((record) => {
      const project = academicProjects().find((item) => item.id === record.projectId);
      if (!project) return [];
      const outcome = outcomes[record.outcome]?.[locale] || record.outcome;
      const isSpellcard = project.type === "spellcard";
      const type = {
        "zh-Hant": isSpellcard ? "符卡" : "論文",
        ja: isSpellcard ? "スペルカード" : "論文",
        en: isSpellcard ? "spell-card" : "thesis",
      }[locale];
      const committee = {
        "zh-Hant": {
          author: "公開答辯速記席",
          title: `${type}答辯裁定：${project.title}`,
          body: `委員會以 ${record.percent}/100 裁定「${outcome}」。逐問回條仍保留；魔理沙要求把材料來源附在慶祝酒之前。`,
        },
        ja: {
          author: "公開答弁速記席",
          title: `${type}答弁裁定：${project.title}`,
          body: `委員会は ${record.percent}/100 で「${outcome}」と裁定。問答票は保持され、魔理沙は祝杯より先に材料出所を添付せよと要求。`,
        },
        en: {
          author: "Public Defence Shorthand Desk",
          title: `${type} defence ruling: ${project.title}`,
          body: `The committee ruled “${outcome}” at ${record.percent}/100. Question slips remain; Marisa wants material provenance attached before the celebratory drink.`,
        },
      }[locale];
      const corridor = {
        "zh-Hant": {
          author: "答辯會場門外的匿名旁聽生",
          title: `問：通過後，主張會不會自己變大？`,
          body: `剛才的題目只在申報場地、月相與版本內通過。八雲紫離場時把「內」字帶走了，委員會正在要求歸還。`,
        },
        ja: {
          author: "答弁会場外の匿名聴講生",
          title: "質問：合格後、主張は勝手に拡大するのか",
          body: "題目は申告した場所・月相・版の範囲でのみ合格。八雲紫が退室時に「範囲内」の内を持ち去り、委員会が返却を要求中。",
        },
        en: {
          author: "Anonymous Listener Outside the Defence Room",
          title: "Question: does a claim grow after it passes?",
          body: "The project passed only within its declared place, moon phase, and version. Yukari left with the word “within”; the committee is requesting its return.",
        },
      }[locale];
      return [committee, corridor].map((copy, index) => ({
        id: `academic-${record.id.toLowerCase()}-${index + 1}`,
        academicRoute: "academic-defense",
        category: index ? "course" : "notice",
        ...copy,
        replies: 7 + (hashValue(`${record.id}:${index}`) % 38),
        createdAt: new Date(new Date(record.completedAt).getTime() + index * 1_000).toISOString(),
        generated: true,
        academic: true,
      }));
    });
}

export const academicStorageKeys = {
  drafts: DRAFT_KEY,
  submissions: SUBMISSION_KEY,
  examSession: EXAM_SESSION_KEY,
  examAttempts: EXAM_ATTEMPT_KEY,
  projects: PROJECT_KEY,
  defences: DEFENCE_KEY,
};
