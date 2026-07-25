import {
  academicAssignments,
  academicExams,
  defenceRounds,
} from "../data/academic-work.js";
import {
  academicDrafts,
  academicExamAttempts,
  academicGradebook,
  academicProjects,
  academicSubmissions,
  currentExamSession,
  defenceForProject,
  finishAcademicExam,
  gradeBand,
  latestAssignmentSubmission,
  saveAcademicExamAnswers,
  saveAssignmentDraft,
  startAcademicExam,
  submitAcademicProject,
  submitAssignment,
  completeAcademicDefence,
} from "./academic-model.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { getLocale } from "./i18n.js";
import { printDocument } from "./print-document.js";
import { renderPreservingState } from "./render-state.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

const SELECTED_ASSIGNMENT_KEY = "tu:academics:selected-assignment";
const SELECTED_PROJECT_KEY = "tu:academics:selected-project";
let activeWorkbenchTeardown = null;

const copy = {
  "zh-Hant": {
    eyebrow: "ACADEMIC WORKBENCH / 課業與答辯",
    title: "答案不只消失在提交鍵後面。",
    lead: "作業草稿、考試答案、逐題判分、解析、成績單與論文／符卡答辯都保存在這台裝置。重考與重交不會抹掉較早的回條。",
    mytu: "返回學籍首頁",
    assignments: "課程作業",
    exam: "課程考試",
    grades: "成績單",
    defence: "論文／符卡答辯",
    due: "截止",
    teacher: "授課教師",
    points: "分",
    attempts: "次提交",
    draftSaved: "作業草稿已保存在這台裝置。",
    saveDraft: "保存草稿",
    submit: "提交並立即判分",
    incomplete: "請完成所有題目；空白不能靠想像自動得分。",
    submitted: "作業已判分並寫入成績單。",
    latest: "最新判分回條",
    correct: "得分",
    wrong: "未得分",
    yourAnswer: "你的答案",
    explanation: "判分說明",
    noSubmission: "尚未提交；草稿會留下。",
    examEyebrow: "TIMED COURSE EXAM / 計時課程試驗",
    startExam: "開始 18 分鐘考試",
    resumeExam: "繼續未完成考試",
    examLead: "開始後由本機時鐘計時；離開頁面不會讓時間停下來，答案則會自動保存。",
    remaining: "剩餘時間",
    finishExam: "交卷並判分",
    examSaved: "考試答案已自動保存。",
    examFinished: "考試已交卷；答案與解析已進入本機成績單。",
    timedOut: "時間到，系統已按目前答案交卷。",
    retake: "再考一份；保留前次成績",
    score: "成績",
    grade: "等第",
    status: "狀態",
    notGraded: "尚未評分",
    gradeLead: "作業、課程試驗與答辯各以百分制列出；總評取每一項最佳成績的平均，不會刪除較低嘗試。",
    overall: "目前總評",
    print: "列印／另存成績單",
    kind: "類別",
    item: "評量項目",
    record: "回條",
    assignment: "作業",
    courseExam: "考試",
    defenceKind: "答辯",
    proposalEyebrow: "PROJECT DOSSIER / 研究計畫",
    proposalTitle: "先把主張寫成會失敗的樣子。",
    proposalLead: "提交後可立即進入模擬答辯；委員會會追問範圍、重現與停止條件。",
    projectType: "答辯類型",
    thesis: "論文答辯",
    spellcard: "符卡答辯",
    projectTitle: "題目",
    abstract: "摘要（至少 40 字元）",
    claim: "可被推翻的核心主張",
    method: "方法、版本與材料來源",
    stopRule: "停止／撤回條件",
    submitProject: "提交計畫並組成委員會",
    projectSaved: "研究計畫已存檔；委員會開始彼此打斷。",
    committee: "答辯委員會",
    beginDefence: "公開答辯三問",
    answerAll: "每一位委員都要得到一個答案。",
    completeDefence: "提交答辯並裁定",
    defenceSaved: "答辯裁定已進入成績單。",
    outcomes: { passed: "通過", conditional: "有條件通過", revise: "退回補正" },
    outcomeBodies: {
      passed: "主張範圍、重現記錄與停止條件均可公開；委員仍保留在 BBS 抱怨的權利。",
      conditional: "可保留題目，但須補一份方法或停止條件附件後再歸檔。",
      revise: "計畫不作廢；請依逐問回條修改，再申請下一次答辯。",
    },
    noProject: "尚無研究計畫。",
    identityNeeded: "建立 My TU 身分後才能正式提交作業、考試與答辯；瀏覽題目不受限制。",
    createIdentity: "建立 My TU 身分",
  },
  ja: {
    eyebrow: "ACADEMIC WORKBENCH / 課業・答弁",
    title: "答案は提出ボタンの後ろへ消えない。",
    lead: "課題下書き、試験答案、設問別採点、解説、成績表、論文／スペルカード答弁を端末内保存。再受験・再提出も以前の票を消しません。",
    mytu: "学籍ホームへ",
    assignments: "授業課題",
    exam: "授業試験",
    grades: "成績表",
    defence: "論文／スペルカード答弁",
    due: "締切",
    teacher: "担当",
    points: "点",
    attempts: "回提出",
    draftSaved: "課題下書きをこの端末へ保存しました。",
    saveDraft: "下書き保存",
    submit: "提出して即時採点",
    incomplete: "全設問へ回答してください。空欄は想像で得点しません。",
    submitted: "採点完了。成績表へ記録しました。",
    latest: "最新採点票",
    correct: "得点",
    wrong: "無得点",
    yourAnswer: "あなたの答案",
    explanation: "採点説明",
    noSubmission: "未提出。下書きは残ります。",
    examEyebrow: "TIMED COURSE EXAM / 計時授業試験",
    startExam: "18分試験を開始",
    resumeExam: "未完試験を続ける",
    examLead: "開始後は端末時計で計時。頁を離れても停止せず、答案は自動保存。",
    remaining: "残り時間",
    finishExam: "提出・採点",
    examSaved: "試験答案を自動保存しました。",
    examFinished: "提出完了。答案と解説を端末内成績表へ保存。",
    timedOut: "時間終了。現在の答案で提出しました。",
    retake: "再受験（前回成績を保持）",
    score: "成績",
    grade: "評語",
    status: "状態",
    notGraded: "未採点",
    gradeLead: "課題・授業試験・答弁を百分率表示。総合は各項目の最高点平均で、低い試行も削除しません。",
    overall: "現在総合",
    print: "成績表を印刷／PDF保存",
    kind: "区分",
    item: "評価項目",
    record: "票",
    assignment: "課題",
    courseExam: "試験",
    defenceKind: "答弁",
    proposalEyebrow: "PROJECT DOSSIER / 研究計画",
    proposalTitle: "まず、失敗できる主張へ。",
    proposalLead: "提出後すぐ模擬答弁へ。委員会は範囲、再現、停止条件を追及します。",
    projectType: "答弁区分",
    thesis: "論文答弁",
    spellcard: "スペルカード答弁",
    projectTitle: "題目",
    abstract: "要旨（40字以上）",
    claim: "反証可能な中心主張",
    method: "方法・版・材料出所",
    stopRule: "停止／撤回条件",
    submitProject: "計画提出・委員会編成",
    projectSaved: "研究計画を保存。委員会は互いに遮り始めました。",
    committee: "答弁委員会",
    beginDefence: "公開答弁三問",
    answerAll: "全委員へ一つずつ回答してください。",
    completeDefence: "答弁提出・裁定",
    defenceSaved: "答弁裁定を成績表へ記録しました。",
    outcomes: { passed: "合格", conditional: "条件付合格", revise: "補正再提出" },
    outcomeBodies: {
      passed: "主張範囲、再現記録、停止条件を公開可。委員は BBS で不満を言う権利を保持。",
      conditional: "題目は保持。方法または停止条件の添付を補ってから収蔵。",
      revise: "計画は失効しない。問答票に沿って修正し、次回答弁を申請。",
    },
    noProject: "研究計画はまだありません。",
    identityNeeded: "My TU 身分作成後に正式提出できます。設問閲覧は可能です。",
    createIdentity: "My TU 身分を作成",
  },
  en: {
    eyebrow: "ACADEMIC WORKBENCH / WORK & DEFENCE",
    title: "Answers do not disappear behind Submit.",
    lead: "Assignment drafts, exam answers, per-question scoring, explanations, transcripts, and thesis/spell-card defences stay on this device. Retakes never erase earlier slips.",
    mytu: "Back to student record",
    assignments: "Course assignments",
    exam: "Course exam",
    grades: "Transcript",
    defence: "Thesis / spell-card defence",
    due: "Due",
    teacher: "Teacher",
    points: "points",
    attempts: "submissions",
    draftSaved: "Assignment draft saved on this device.",
    saveDraft: "Save draft",
    submit: "Submit and grade now",
    incomplete: "Answer every question. Blank space cannot gain marks by imagination.",
    submitted: "Assignment graded and added to the transcript.",
    latest: "Latest grading slip",
    correct: "Earned",
    wrong: "No mark",
    yourAnswer: "Your answer",
    explanation: "Scoring explanation",
    noSubmission: "Not submitted. The draft remains.",
    examEyebrow: "TIMED COURSE EXAM",
    startExam: "Start 18-minute exam",
    resumeExam: "Resume unfinished exam",
    examLead: "Device time runs after starting; leaving does not pause it. Answers autosave.",
    remaining: "Time remaining",
    finishExam: "Submit and grade",
    examSaved: "Exam answers autosaved.",
    examFinished: "Exam submitted; answers and explanations entered the on-device transcript.",
    timedOut: "Time expired. Current answers were submitted.",
    retake: "Retake; keep prior result",
    score: "Score",
    grade: "Grade",
    status: "Status",
    notGraded: "Not graded",
    gradeLead: "Assignments, course exams, and defences use percentages. The overall mark averages each item’s best result without deleting lower attempts.",
    overall: "Current overall",
    print: "Print / Save transcript",
    kind: "Kind",
    item: "Assessment",
    record: "Slip",
    assignment: "Assignment",
    courseExam: "Exam",
    defenceKind: "Defence",
    proposalEyebrow: "PROJECT DOSSIER",
    proposalTitle: "First, make the claim capable of failing.",
    proposalLead: "A simulation defence opens after submission. The committee asks about scope, reproduction, and stopping.",
    projectType: "Defence type",
    thesis: "Thesis defence",
    spellcard: "Spell-card defence",
    projectTitle: "Title",
    abstract: "Abstract (at least 40 characters)",
    claim: "Falsifiable central claim",
    method: "Method, versions, and material provenance",
    stopRule: "Stop / withdrawal rule",
    submitProject: "Submit project and form committee",
    projectSaved: "Project saved. The committee has begun interrupting itself.",
    committee: "Defence committee",
    beginDefence: "Three-question public defence",
    answerAll: "Every examiner needs one answer.",
    completeDefence: "Submit defence for ruling",
    defenceSaved: "Defence ruling entered the transcript.",
    outcomes: { passed: "Passed", conditional: "Conditional pass", revise: "Revise and return" },
    outcomeBodies: {
      passed: "Scope, reproduction record, and stop condition may be published. Examiners retain the right to complain on BBS.",
      conditional: "Keep the topic, but attach one method or stop-rule correction before archiving.",
      revise: "The project remains. Revise from the question slips and apply for another defence.",
    },
    noProject: "No project exists yet.",
    identityNeeded: "Create a My TU identity before formally submitting work, exams, or a defence. Browsing remains open.",
    createIdentity: "Create My TU identity",
  },
};

const examinerNames = {
  reimu: { "zh-Hant": "博麗靈夢", ja: "博麗霊夢", en: "Reimu Hakurei" },
  marisa: { "zh-Hant": "霧雨魔理沙", ja: "霧雨魔理沙", en: "Marisa Kirisame" },
  yukari: { "zh-Hant": "八雲紫", ja: "八雲紫", en: "Yukari Yakumo" },
  keine: { "zh-Hant": "上白澤慧音", ja: "上白沢慧音", en: "Keine Kamishirasawa" },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function routeView() {
  const route = safeDecodeFragment();
  if (route === "academic-exam") return "exam";
  if (route === "academic-grades") return "grades";
  if (route === "academic-defense") return "defence";
  return "assignments";
}

function formatDate(value, locale, withTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(date);
}

function dueDate(offset, locale) {
  return formatDate(new Date(Date.now() + offset * 86_400_000), locale);
}

function commonNav(c, view) {
  return `
    <header class="academic-heading">
      <div><p>${c.eyebrow}</p><h2>${c.title}</h2></div><p>${c.lead}</p>
    </header>
    <nav class="academic-tabs">
      <a href="#my-tu">← ${c.mytu}</a>
      <a href="#academic-work" ${view === "assignments" ? 'aria-current="page"' : ""}>${c.assignments}</a>
      <a href="#academic-exam" ${view === "exam" ? 'aria-current="page"' : ""}>${c.exam}</a>
      <a href="#academic-grades" ${view === "grades" ? 'aria-current="page"' : ""}>${c.grades}</a>
      <a href="#academic-defense" ${view === "defence" ? 'aria-current="page"' : ""}>${c.defence}</a>
    </nav>`;
}

function questionField(item, answers, locale) {
  const value = answers[item.id] || "";
  if (item.type === "choice") {
    return `
      <fieldset data-academic-question="${item.id}">
        <legend>${escapeHtml(item.prompt[locale])}<b>${item.points}</b></legend>
        ${item.options.map((option) => `
          <label><input type="radio" name="${item.id}" value="${option.id}" ${value === option.id ? "checked" : ""}><span>${escapeHtml(option.label[locale])}</span></label>`).join("")}
      </fieldset>`;
  }
  if (item.type === "number") {
    return `<label class="academic-written-question" data-academic-question="${item.id}"><span>${escapeHtml(item.prompt[locale])}<b>${item.points}</b></span><input type="number" step="any" name="${item.id}" value="${escapeHtml(value)}"></label>`;
  }
  return `<label class="academic-written-question" data-academic-question="${item.id}"><span>${escapeHtml(item.prompt[locale])}<b>${item.points}</b></span><textarea name="${item.id}" rows="3">${escapeHtml(value)}</textarea></label>`;
}

function answerLabel(item, answer, locale) {
  if (item.type === "choice") return item.options.find((option) => option.id === answer)?.label[locale] || answer || "—";
  return answer || "—";
}

function gradingSlip(record, questions, locale, c) {
  if (!record) return `<aside class="academic-no-result">${c.noSubmission}</aside>`;
  const band = gradeBand(record.percent);
  return `
    <section class="academic-grading-slip">
      <header><div><p>${c.latest} · ${escapeHtml(record.id)}</p><h3>${record.percent}/100 · ${band.id}</h3><span>${band.label[locale]}</span></div><b>${record.earned}<small>/${record.possible}</small></b></header>
      <ol>
        ${record.results.map((result, index) => {
          const item = questions.find((question) => question.id === result.questionId);
          return `
            <li data-correct="${result.correct}">
              <i>${result.correct ? "✓" : "×"}</i>
              <div><strong>${index + 1}. ${escapeHtml(item.prompt[locale])}</strong><p><b>${c.yourAnswer}</b>${escapeHtml(answerLabel(item, result.answer, locale))}</p><small><b>${c.explanation}</b>${escapeHtml(item.explanation[locale])}</small></div>
              <em>${result.earned}/${result.possible}</em>
            </li>`;
        }).join("")}
      </ol>
    </section>`;
}

function renderAssignments(locale, c, identity) {
  const selectedStored = window.localStorage.getItem(SELECTED_ASSIGNMENT_KEY);
  const assignment = academicAssignments.find((item) => item.id === selectedStored) || academicAssignments[0];
  const draft = academicDrafts()[assignment.id]?.answers || {};
  const latest = latestAssignmentSubmission(assignment.id);
  return `
    ${!identity ? `<aside class="academic-identity-gate"><p>${c.identityNeeded}</p><a class="button button-primary" href="#my-tu">${c.createIdentity}</a></aside>` : ""}
    <div class="academic-assignment-layout" id="academic-work">
      <aside class="academic-assignment-index" data-preserve-scroll="academic-assignments">
        <header><span>${c.assignments}</span><b>${academicAssignments.length}</b></header>
        ${academicAssignments.map((item) => {
          const result = latestAssignmentSubmission(item.id);
          return `
            <button type="button" data-assignment-select="${item.id}" class="${item.id === assignment.id ? "active" : ""}">
              <span><small>${item.courseCode}</small><strong>${item.title[locale]}</strong><em>${c.due} ${dueDate(item.dueOffset, locale)}</em></span>
              <b>${result ? `${result.percent}%` : "—"}</b>
            </button>`;
        }).join("")}
      </aside>
      <article class="academic-assignment-file">
        <header><div><p>${assignment.courseCode} · ${c.due} ${dueDate(assignment.dueOffset, locale)}</p><h3>${assignment.title[locale]}</h3><span>${assignment.brief[locale]}</span></div><dl><div><dt>${c.teacher}</dt><dd>${assignment.teacher[locale]}</dd></div><div><dt>${c.attempts}</dt><dd>${academicSubmissionsFor(assignment.id)} ${c.attempts}</dd></div></dl></header>
        <form data-assignment-form="${assignment.id}">
          ${assignment.questions.map((item) => questionField(item, draft, locale)).join("")}
          <footer><button class="button button-secondary" type="button" data-assignment-save ${identity ? "" : "disabled"}>${c.saveDraft}</button><button class="button button-primary" type="submit" ${identity ? "" : "disabled"}>${c.submit} <span>→</span></button></footer>
        </form>
        ${gradingSlip(latest, assignment.questions, locale, c)}
      </article>
    </div>`;
}

function academicSubmissionsFor(assignmentId) {
  return academicSubmissions().filter((item) => item.assignmentId === assignmentId).length;
}

function examForm(exam, session, locale, c) {
  return `
    <form class="academic-exam-paper" data-academic-exam-form>
      <header><div><p>${exam.code}</p><h3>${exam.title[locale]}</h3><span>${exam.lead[locale]}</span></div><div class="academic-timer"><span>${c.remaining}</span><strong data-academic-timer>--:--</strong><small>${formatDate(session.endsAt, locale, true)}</small></div></header>
      <input type="hidden" name="examId" value="${exam.id}">
      ${exam.questions.map((item) => questionField(item, session.answers, locale)).join("")}
      <footer><span>${c.examSaved}</span><button class="button button-primary" type="submit">${c.finishExam} <span>→</span></button></footer>
    </form>`;
}

function renderExam(locale, c, identity) {
  const exam = academicExams[0];
  const session = currentExamSession();
  const attempts = academicExamAttempts().filter((item) => item.examId === exam.id);
  const latest = attempts.at(-1);
  return `
    ${!identity ? `<aside class="academic-identity-gate"><p>${c.identityNeeded}</p><a class="button button-primary" href="#my-tu">${c.createIdentity}</a></aside>` : ""}
    <section class="academic-exam-shell" id="academic-exam">
      <header><div><p>${c.examEyebrow}</p><h3>${exam.title[locale]}</h3></div><span>${c.examLead}</span></header>
      ${session
        ? examForm(exam, session, locale, c)
        : `<div class="academic-exam-start"><span aria-hidden="true">試</span><p>${exam.lead[locale]}</p><dl><div><dt>${c.remaining}</dt><dd>${exam.durationMinutes}:00</dd></div><div><dt>${c.attempts}</dt><dd>${attempts.length}</dd></div></dl><button class="button button-primary" type="button" data-academic-exam-start ${identity ? "" : "disabled"}>${c.startExam} <span>→</span></button></div>`}
      ${latest ? `${gradingSlip(latest, exam.questions, locale, c)}${!session ? `<button class="button button-secondary academic-retake" type="button" data-academic-exam-start ${identity ? "" : "disabled"}>${c.retake}</button>` : ""}` : ""}
    </section>`;
}

function renderGrades(locale, c) {
  const book = academicGradebook();
  return `
    <section class="academic-gradebook" id="academic-grades">
      <header>
        <div><p>ACADEMIC RECORD / ON THIS DEVICE</p><h3>${c.grades}</h3><span>${c.gradeLead}</span></div>
        <div class="academic-overall"><span>${c.overall}</span><strong>${book.average ?? "—"}<small>${book.average === null ? "" : "/100"}</small></strong><b>${book.band ? `${book.band.id} · ${book.band.label[locale]}` : c.notGraded}</b></div>
      </header>
      <div class="academic-grade-table">
        <table>
          <thead><tr><th>${c.kind}</th><th>${c.item}</th><th>${c.attempts}</th><th>${c.score}</th><th>${c.grade}</th><th>${c.record}</th></tr></thead>
          <tbody>
            ${book.entries.map((entry) => {
              const band = Number.isFinite(entry.percent) ? gradeBand(entry.percent) : null;
              return `<tr><td>${entry.kind === "assignment" ? c.assignment : entry.kind === "exam" ? c.courseExam : c.defenceKind}</td><td><code>${entry.courseCode}</code><strong>${entry.title[locale]}</strong></td><td>${entry.attempts}</td><td>${entry.percent ?? "—"}${Number.isFinite(entry.percent) ? "%" : ""}</td><td>${band?.id || "—"}</td><td><code>${entry.recordId || "—"}</code></td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
      <button class="button button-primary" type="button" data-academic-print>${c.print} <span aria-hidden="true">↗</span></button>
    </section>`;
}

function proposalForm(c) {
  return `
    <form class="academic-project-form" data-academic-project-form>
      <header><p>${c.proposalEyebrow}</p><h3>${c.proposalTitle}</h3><span>${c.proposalLead}</span></header>
      <div>
        <label>${c.projectType}<select name="type"><option value="thesis">${c.thesis}</option><option value="spellcard">${c.spellcard}</option></select></label>
        <label>${c.projectTitle}<input name="title" maxlength="120" required></label>
        <label class="span">${c.abstract}<textarea name="abstract" rows="4" minlength="40" maxlength="1500" required></textarea></label>
        <label class="span">${c.claim}<textarea name="claim" rows="3" minlength="18" maxlength="700" required></textarea></label>
        <label class="span">${c.method}<textarea name="method" rows="4" minlength="24" maxlength="1000" required></textarea></label>
        <label class="span">${c.stopRule}<textarea name="stopRule" rows="3" minlength="12" maxlength="700" required></textarea></label>
      </div>
      <button class="button button-primary" type="submit">${c.submitProject} <span>→</span></button>
    </form>`;
}

function defencePanel(project, record, locale, c) {
  if (record) {
    return `
      <section class="academic-defence-result" data-outcome="${record.outcome}">
        <header><div><p>${record.id}</p><h3>${c.outcomes[record.outcome]}</h3><span>${c.outcomeBodies[record.outcome]}</span></div><strong>${record.percent}<small>/100</small></strong></header>
        <ol>${record.results.map((result) => {
          const round = defenceRounds.find((item) => item.id === result.roundId);
          const selected = round.choices.find((choice) => choice.id === result.answer);
          return `<li><i>${result.earned}/${result.possible}</i><div><strong>${round.examiner[locale]} · ${round.role[locale]}</strong><p>${round.prompt[locale]}</p><span>${selected.label[locale]}</span></div></li>`;
        }).join("")}</ol>
      </section>`;
  }
  return `
    <form class="academic-defence-form" data-academic-defence-form="${project.id}">
      <header><p>${c.beginDefence}</p><h3>${escapeHtml(project.title)}</h3><span>${c.committee} · ${project.committee.map((id) => examinerNames[id]?.[locale] || id).join(" · ")}</span></header>
      ${defenceRounds.map((round, index) => `
        <fieldset>
          <legend><i>Q${index + 1}</i><span><small>${round.examiner[locale]} · ${round.role[locale]}</small><strong>${round.prompt[locale]}</strong></span></legend>
          ${round.choices.map((option) => `<label><input type="radio" name="${round.id}" value="${option.id}"><span>${option.label[locale]}</span></label>`).join("")}
        </fieldset>`).join("")}
      <button class="button button-primary" type="submit">${c.completeDefence} <span>→</span></button>
    </form>`;
}

function renderDefence(locale, c, identity, creatingProject = false) {
  const projects = academicProjects();
  const selectedStored = window.localStorage.getItem(SELECTED_PROJECT_KEY);
  const selected = creatingProject ? null : projects.find((item) => item.id === selectedStored) || projects.at(-1);
  return `
    ${!identity ? `<aside class="academic-identity-gate"><p>${c.identityNeeded}</p><a class="button button-primary" href="#my-tu">${c.createIdentity}</a></aside>` : ""}
    <div class="academic-defence-layout" id="academic-defense">
      <aside class="academic-project-list">
        <header><span>${c.defence}</span><b>${projects.length}</b></header>
        ${projects.map((project) => {
          const record = defenceForProject(project.id);
          return `<button type="button" data-project-select="${project.id}" class="${selected?.id === project.id ? "active" : ""}><i>${project.type === "spellcard" ? "符" : "論"}</i><span><small>${project.id}</small><strong>${escapeHtml(project.title)}</strong><em>${record ? c.outcomes[record.outcome] : c.beginDefence}</em></span></button>`;
        }).join("")}
        ${projects.length ? `<button type="button" data-project-new>＋ ${c.submitProject}</button>` : ""}
      </aside>
      <article class="academic-defence-workspace">
        ${selected ? defencePanel(selected, defenceForProject(selected.id), locale, c) : proposalForm(c)}
      </article>
    </div>`;
}

function academicDocument(locale, c) {
  const book = academicGradebook();
  const identity = JSON.parse(window.localStorage.getItem("tu:identity") || "null");
  return `
    <header><div class="academic-document-seal">東</div><div><p>TOUHOU UNIVERSITY OF GENSOKYO</p><h2>${c.grades}</h2><span>${escapeHtml(identity?.name || "STUDENT-LOCAL")} · ${escapeHtml(identity?.id || "—")}</span></div><code>${new Date().toISOString().slice(0, 10)}</code></header>
    <table><thead><tr><th>${c.kind}</th><th>${c.item}</th><th>${c.score}</th><th>${c.grade}</th><th>${c.record}</th></tr></thead><tbody>
      ${book.entries.map((entry) => `<tr><td>${entry.kind}</td><td>${entry.courseCode} · ${entry.title[locale]}</td><td>${entry.percent ?? "—"}</td><td>${Number.isFinite(entry.percent) ? gradeBand(entry.percent).id : "—"}</td><td>${entry.recordId || "—"}</td></tr>`).join("")}
    </tbody></table>
    <footer><strong>${c.overall}: ${book.average ?? "—"}/100 ${book.band?.id || ""}</strong><p>${c.gradeLead}</p></footer>`;
}

export function renderAcademicWorkbench(app) {
  activeWorkbenchTeardown?.();
  let autosaveTimer;
  let examTimer;
  let creatingProject = false;

  function render({ preserveWindow = true } = {}) {
    window.clearTimeout(autosaveTimer);
    window.clearInterval(examTimer);
    const locale = getLocale();
    const c = copy[locale];
    const identity = JSON.parse(window.localStorage.getItem("tu:identity") || "null");
    const view = routeView();
    renderPreservingState(app, () => {
      app.innerHTML = `
        ${commonNav(c, view)}
        ${view === "assignments"
          ? renderAssignments(locale, c, identity)
          : view === "exam"
            ? renderExam(locale, c, identity)
            : view === "grades"
              ? renderGrades(locale, c)
              : renderDefence(locale, c, identity, creatingProject)}`;
    }, { preserveWindow });
    bind(locale, c, identity);
    if (view === "exam" && currentExamSession()) startTimer(locale, c);
  }

  function formAnswers(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function saveCurrentAssignment(form, c, notify = false) {
    saveAssignmentDraft(form.dataset.assignmentForm, formAnswers(form));
    if (notify) showToast(c.draftSaved);
  }

  function startTimer(locale, c) {
    const tick = () => {
      const session = currentExamSession();
      const target = app.querySelector("[data-academic-timer]");
      if (!session || !target) return;
      const seconds = Math.max(0, Math.ceil((new Date(session.endsAt).getTime() - Date.now()) / 1_000));
      target.textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
      target.closest(".academic-timer")?.classList.toggle("urgent", seconds <= 120);
      if (seconds > 0) return;
      window.clearInterval(examTimer);
      const outcome = finishAcademicExam({ force: true });
      if (outcome.record) {
        recordCampusEvent(
          "academic.exam.completed",
          { examId: outcome.record.examId, attemptId: outcome.record.id, percent: outcome.record.percent, timedOut: true },
          { id: `academic.exam.completed:${outcome.record.id}`, timestamp: outcome.record.completedAt },
        );
        showToast(c.timedOut);
        render();
      }
    };
    tick();
    examTimer = window.setInterval(tick, 1_000);
  }

  function bind(locale, c, identity) {
    app.querySelectorAll("[data-assignment-select]").forEach((button) => button.addEventListener("click", () => {
      window.localStorage.setItem(SELECTED_ASSIGNMENT_KEY, button.dataset.assignmentSelect);
      render();
    }));
    const assignmentForm = app.querySelector("[data-assignment-form]");
    assignmentForm?.addEventListener("input", () => {
      window.clearTimeout(autosaveTimer);
      autosaveTimer = window.setTimeout(() => saveCurrentAssignment(assignmentForm, c), 260);
    });
    assignmentForm?.addEventListener("change", () => saveCurrentAssignment(assignmentForm, c));
    app.querySelector("[data-assignment-save]")?.addEventListener("click", () => saveCurrentAssignment(assignmentForm, c, true));
    assignmentForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!identity) return;
      const outcome = submitAssignment(assignmentForm.dataset.assignmentForm, formAnswers(assignmentForm));
      if (outcome.error) {
        showToast(c.incomplete);
        return;
      }
      recordCampusEvent(
        "academic.assignment.graded",
        { assignmentId: outcome.record.assignmentId, submissionId: outcome.record.id, courseCode: outcome.record.courseCode, percent: outcome.record.percent },
        { id: `academic.assignment.graded:${outcome.record.id}`, timestamp: outcome.record.submittedAt },
      );
      showToast(c.submitted);
      render();
    });
    app.querySelectorAll("[data-academic-exam-start]").forEach((button) => button.addEventListener("click", () => {
      if (!identity) return;
      const session = startAcademicExam(academicExams[0].id);
      recordCampusEvent(
        "academic.exam.started",
        { examId: session.examId, attemptId: session.id },
        { id: `academic.exam.started:${session.id}`, timestamp: session.startedAt },
      );
      render();
    }));
    const examFormElement = app.querySelector("[data-academic-exam-form]");
    examFormElement?.addEventListener("input", () => {
      window.clearTimeout(autosaveTimer);
      autosaveTimer = window.setTimeout(() => saveAcademicExamAnswers(formAnswers(examFormElement)), 220);
    });
    examFormElement?.addEventListener("change", () => saveAcademicExamAnswers(formAnswers(examFormElement)));
    examFormElement?.addEventListener("submit", (event) => {
      event.preventDefault();
      saveAcademicExamAnswers(formAnswers(examFormElement));
      const outcome = finishAcademicExam();
      if (outcome.error) {
        showToast(c.incomplete);
        return;
      }
      recordCampusEvent(
        "academic.exam.completed",
        { examId: outcome.record.examId, attemptId: outcome.record.id, percent: outcome.record.percent, timedOut: outcome.record.timedOut },
        { id: `academic.exam.completed:${outcome.record.id}`, timestamp: outcome.record.completedAt },
      );
      showToast(c.examFinished);
      render();
    });
    app.querySelector("[data-academic-project-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!identity || !event.currentTarget.reportValidity()) {
        showToast(c.incomplete);
        return;
      }
      const outcome = submitAcademicProject(Object.fromEntries(new FormData(event.currentTarget).entries()));
      if (outcome.error) {
        showToast(c.incomplete);
        return;
      }
      window.localStorage.setItem(SELECTED_PROJECT_KEY, outcome.record.id);
      creatingProject = false;
      recordCampusEvent(
        "academic.project.submitted",
        { projectId: outcome.record.id, projectType: outcome.record.type },
        { id: `academic.project.submitted:${outcome.record.id}`, timestamp: outcome.record.submittedAt },
      );
      showToast(c.projectSaved);
      render();
    });
    app.querySelectorAll("[data-project-select]").forEach((button) => button.addEventListener("click", () => {
      window.localStorage.setItem(SELECTED_PROJECT_KEY, button.dataset.projectSelect);
      creatingProject = false;
      render();
    }));
    app.querySelector("[data-project-new]")?.addEventListener("click", () => {
      window.localStorage.removeItem(SELECTED_PROJECT_KEY);
      creatingProject = true;
      render();
    });
    app.querySelector("[data-academic-defence-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const outcome = completeAcademicDefence(event.currentTarget.dataset.academicDefenceForm, formAnswers(event.currentTarget));
      if (outcome.error) {
        showToast(c.answerAll);
        return;
      }
      recordCampusEvent(
        "academic.defence.completed",
        { projectId: outcome.record.projectId, defenceId: outcome.record.id, outcome: outcome.record.outcome, percent: outcome.record.percent },
        { id: `academic.defence.completed:${outcome.record.id}`, timestamp: outcome.record.completedAt },
      );
      showToast(c.defenceSaved);
      render();
    });
    app.querySelector("[data-academic-print]")?.addEventListener("click", () => {
      const dialog = document.querySelector("[data-academic-document-dialog]");
      const body = dialog?.querySelector("[data-academic-document-body]");
      if (!dialog || !body) return;
      body.innerHTML = academicDocument(locale, c);
      if (!dialog.open) dialog.showModal();
    });
  }

  render({ preserveWindow: false });
  activeWorkbenchTeardown = () => {
    window.clearTimeout(autosaveTimer);
    window.clearInterval(examTimer);
    activeWorkbenchTeardown = null;
  };
  return activeWorkbenchTeardown;
}

export function initAcademicDocumentDialog() {
  const dialog = document.querySelector("[data-academic-document-dialog]");
  dialog?.querySelectorAll("[data-academic-document-close]").forEach((button) => button.addEventListener("click", () => dialog.close()));
  dialog?.querySelector("[data-academic-document-print]")?.addEventListener("click", () => {
    printDocument(dialog.querySelector("[data-academic-document-body]"), {
      title: dialog.querySelector("h1, h2")?.textContent || document.title,
    });
  });
}
