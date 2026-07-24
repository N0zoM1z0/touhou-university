import {
  gaokaoDifficulties,
  gaokaoMeta,
  gaokaoQuestionsFor,
  gaokaoSubjects,
  gaokaoTracks,
} from "../data/gaokao.js";
import { getLocale } from "./i18n.js";
import { showToast } from "./ui.js";
import { recordCampusEvent } from "./campus-ledger.js";

const header = document.querySelector("[data-gaokao-header]");
const app = document.querySelector("[data-gaokao-app]");
let state = null;
let resultState = null;
let selectedDifficulty = "normal";
let view = "lobby";
let timer;

const copy = {
  "zh-Hant": {
    eyebrow: "UNIFIED EXAMINATION / 幻想鄉統一學力試驗",
    title: "從 NORMAL 到 EXTRA：四份真的會改變題目的統一試卷。",
    lead: "文科與理科各有四個難度。共同科包含語文、結界算術與幻想鄉常識；高難度卷會把公告版本、月相、路網、觀測表與證詞一起交給你。",
    chooseDifficulty: "先選擇彈幕難度",
    choose: "選擇應試組別",
    chooseLead: "每組四科、滿分 150 分。紙本版不計時，可離線作答、列印或另存 PDF。",
    start: "開始線上模擬",
    resume: "繼續未完成試卷",
    discard: "放棄草稿",
    paper: "下載離線試卷",
    answers: "下載參考答案",
    format: "可列印 HTML · 下載後無需聯網",
    subjects: "應試科目",
    points: "分",
    questions: "題",
    duration: "考試時間",
    minutes: "分鐘",
    total: "滿分",
    candidate: "考生",
    deviceCandidate: "本機模擬考生",
    instructions: "考生須知",
    rules: ["本卷所有題目均為單選題；每題只有一個最合適答案。", "材料框屬於題目；可在右側答題卡跳題，答案會自動保存。", "除非題目另有說明，月相、時間、路線與版本均以材料框為準，不讀取校園地圖的即時狀態。", "時間到自動交卷；滿月、停電或教室位移不另行加時。"],
    answered: "已答",
    timeLeft: "剩餘時間",
    submit: "交卷並立即判分",
    submitConfirm: "仍有未作答題目，確定交卷嗎？",
    saved: "試卷進度已保存在這台裝置。",
    expired: "時間到，試卷已自動提交。",
    result: "統一試驗成績單",
    score: "總分",
    correct: "答對",
    review: "參考答案與逐題解析",
    yourAnswer: "你的答案",
    rightAnswer: "參考答案",
    unanswered: "未作答",
    back: "返回選卷",
    retake: "重新應試",
    excellent: "你把版本、月相與證詞的岔路都理清了。",
    pass: "整體合格；建議重看失分科目的材料鏈。",
    revise: "先沿解析回查每份材料，再決定是否相信昨日的空地。",
    localRecords: "我的統一試驗記錄",
    localLead: "完整答案、成績與解析入口只保存在這台裝置。",
    attempts: "次已交卷",
    noRecords: "這台裝置還沒有已完成的幻想鄉統一學力試驗。",
    viewRecord: "重開成績與解析",
    legacyRecord: "舊版只保存成績摘要",
    completed: "交卷時間",
    deleteRecord: "刪除本機記錄",
    deleteConfirm: "確定刪除這次統一試驗記錄？",
    recordDeleted: "已刪除本機統一試驗記錄。",
    archive: "本機答案庫",
    sourceFile: "題目材料 · 獨立條件",
  },
  ja: {
    eyebrow: "UNIFIED EXAMINATION / 幻想郷統一高等試験",
    title: "NORMALからEXTRAまで、問題そのものが変わる四つの統一試験。",
    lead: "文系・理系それぞれ四難度。語文、境界数学、幻想郷共通常識に加え、高難度では告知版、月相、経路網、観測表、対立証言を同時に扱います。",
    chooseDifficulty: "弾幕難度を選択",
    choose: "受験区分を選択",
    chooseLead: "各区分4科目・150点満点。紙版は時間制限なしで、オフライン受験・印刷・PDF保存に対応。",
    start: "オンライン模試を開始",
    resume: "未完了答案を続ける",
    discard: "下書きを破棄",
    paper: "オフライン試験紙",
    answers: "参考解答をダウンロード",
    format: "印刷対応HTML・ダウンロード後は通信不要",
    subjects: "受験科目",
    points: "点",
    questions: "問",
    duration: "試験時間",
    minutes: "分",
    total: "満点",
    candidate: "受験者",
    deviceCandidate: "端末内模擬受験者",
    instructions: "受験上の注意",
    rules: ["全問単一選択。最も適切な答えを一つ選ぶこと。", "資料枠も問題の一部。右の解答欄から移動でき、答案は自動保存される。", "別記がない限り、月相・時刻・経路・版は資料枠の条件に従い、学内地図の現在状態は参照しない。", "時間切れで自動提出。満月・停電・教室移動による延長なし。"],
    answered: "回答済",
    timeLeft: "残り時間",
    submit: "提出して採点",
    submitConfirm: "未回答があります。提出しますか。",
    saved: "答案をこの端末へ保存しました。",
    expired: "時間切れのため自動提出しました。",
    result: "統一試験成績表",
    score: "総得点",
    correct: "正解",
    review: "参考解答・問題解説",
    yourAnswer: "あなたの回答",
    rightAnswer: "参考解答",
    unanswered: "未回答",
    back: "試験選択へ",
    retake: "再受験",
    excellent: "版、月相、証言の分岐をすべて整理できています。",
    pass: "全体は合格。失点科目の資料連鎖を見直しましょう。",
    revise: "解説から各資料を遡り、昨日の空地を信じるか再考を。",
    localRecords: "自分の高等試験記録",
    localLead: "答案、成績、解説入口はこの端末だけに保存されます。",
    attempts: "件提出済み",
    noRecords: "この端末には完了した統一高等試験がありません。",
    viewRecord: "成績・解説を再表示",
    legacyRecord: "旧版では成績概要のみ保存",
    completed: "提出日時",
    deleteRecord: "端末記録を削除",
    deleteConfirm: "この受験記録を削除しますか。",
    recordDeleted: "端末の受験記録を削除しました。",
    archive: "端末内答案庫",
    sourceFile: "問題資料 · 独立条件",
  },
  en: {
    eyebrow: "UNIFIED EXAMINATION / GENSOKYO UNIFIED EXAM",
    title: "NORMAL to EXTRA: four unified papers whose questions truly change.",
    lead: "Humanities and sciences each run at four difficulties. Higher papers combine notices, versions, lunar phases, route graphs, observations, and conflicting testimony.",
    chooseDifficulty: "Choose a danmaku difficulty",
    choose: "Choose an examination track",
    chooseLead: "Four subjects, 150 marks. Printable papers are untimed and work offline or as saved PDFs.",
    start: "Start online simulation",
    resume: "Resume unfinished paper",
    discard: "Discard draft",
    paper: "Download offline paper",
    answers: "Download answer key",
    format: "Print-ready HTML · no connection required after download",
    subjects: "Exam subjects",
    points: "marks",
    questions: "questions",
    duration: "Duration",
    minutes: "minutes",
    total: "Maximum",
    candidate: "Candidate",
    deviceCandidate: "On-device simulation candidate",
    instructions: "Instructions to candidates",
    rules: ["Every item is single-choice. Select the one best answer.", "Source boxes are part of the item. Jump from the answer sheet; answers autosave.", "Unless an item says otherwise, its lunar phase, time, route, and version come only from its source box; the live campus-map state is not consulted.", "The paper submits at time. Full moons, outages, and relocated classrooms do not add time."],
    answered: "Answered",
    timeLeft: "Time left",
    submit: "Submit and score now",
    submitConfirm: "Some questions are unanswered. Submit anyway?",
    saved: "Paper progress saved on this device.",
    expired: "Time expired. The paper was submitted automatically.",
    result: "Unified Examination Result",
    score: "Total score",
    correct: "Correct",
    review: "Answer key and explanations",
    yourAnswer: "Your answer",
    rightAnswer: "Reference answer",
    unanswered: "Unanswered",
    back: "Back to paper selection",
    retake: "Retake paper",
    excellent: "You untangled the versions, lunar phases, and conflicting testimony.",
    pass: "A sound result. Revisit the source chains in weaker subjects.",
    revise: "Trace each source through the key before trusting Yesterday's Clearing.",
    localRecords: "My unified-exam records",
    localLead: "Full answers, scores, and review links stay on this device only.",
    attempts: "submitted",
    noRecords: "No completed Gensokyo unified exam is stored on this device.",
    viewRecord: "Reopen result and review",
    legacyRecord: "Older version saved only a score summary",
    completed: "Submitted",
    deleteRecord: "Delete local record",
    deleteConfirm: "Delete this examination record?",
    recordDeleted: "Local examination record deleted.",
    archive: "On-device answer archive",
    sourceFile: "Source dossier · independent conditions",
  },
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function difficultyFor(value) {
  return gaokaoDifficulties[value] ? value : "normal";
}

function questionsFor(trackId, difficultyId = selectedDifficulty) {
  return gaokaoQuestionsFor(trackId, difficultyFor(difficultyId));
}

function migrateLegacyDraft(draft) {
  if (draft.difficultyId) return draft;
  const migrated = { ...draft, difficultyId: "normal", schema: 2, answers: {} };
  const normalized = questionsFor(draft.trackId, "normal");
  Object.entries(draft.answers || {}).forEach(([questionId, selected]) => {
    const subject = Object.values(gaokaoSubjects).find((item) => item.questions.some((question) => question.id === questionId));
    const original = subject?.questions.find((question) => question.id === questionId);
    const current = normalized.find((question) => question.id === questionId);
    if (!original || !current || !Number.isInteger(selected)) return;
    const shift = (current.answer - original.answer + original.options.length) % original.options.length;
    migrated.answers[questionId] = (selected + shift) % original.options.length;
  });
  window.localStorage.setItem("tu:gaokao:draft", JSON.stringify(migrated));
  return migrated;
}

function readDraft() {
  try {
    const draft = JSON.parse(window.localStorage.getItem("tu:gaokao:draft") || "null");
    if (!draft || !gaokaoTracks[draft.trackId] || draft.submitted) return null;
    return migrateLegacyDraft(draft);
  } catch {
    return null;
  }
}

function saveDraft({ notify = false } = {}) {
  if (!state) return;
  window.localStorage.setItem("tu:gaokao:draft", JSON.stringify(state));
  if (notify) showToast(copy[getLocale()].saved);
}

function history() {
  try {
    const records = JSON.parse(window.localStorage.getItem("tu:gaokao:attempts") || "[]");
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

function writeHistory(records) {
  window.localStorage.setItem("tu:gaokao:attempts", JSON.stringify(records.slice(-40)));
}

function formatTime(seconds) {
  const safe = Math.max(0, seconds);
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

function formatDate(value, locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function downloads(trackId, difficultyId, locale) {
  const base = `downloads/gaokao/${gaokaoMeta.edition.toLowerCase()}-${locale}-${difficultyId}-${trackId}`;
  return { paper: `${base}-paper.html`, answers: `${base}-answers.html` };
}

function subjectQuestions(trackId, difficultyId, subjectId) {
  return questionsFor(trackId, difficultyId).filter((question) => question.subjectId === subjectId);
}

function renderHeader() {
  if (!header) return;
  const c = copy[getLocale()];
  header.innerHTML = `
    <div><p class="eyebrow"><span>EXAM+</span> ${c.eyebrow}</p><h2>${c.title}</h2></div>
    <p>${c.lead}</p>`;
}

function renderLobby() {
  if (!app) return;
  window.clearInterval(timer);
  state = null;
  resultState = null;
  view = "lobby";
  const locale = getLocale();
  const c = copy[locale];
  const draft = readDraft();
  if (draft && selectedDifficulty === "normal") selectedDifficulty = difficultyFor(draft.difficultyId);
  const difficulty = gaokaoDifficulties[selectedDifficulty];
  const records = history();
  app.innerHTML = `
    <header class="gaokao-lobby-head">
      <div><p>${c.chooseDifficulty}</p><h3>${c.chooseLead}</h3></div>
      <span>${gaokaoMeta.edition} · ${gaokaoMeta.year}</span>
    </header>
    <div class="gaokao-difficulty-grid" role="tablist" aria-label="${c.chooseDifficulty}">
      ${Object.entries(gaokaoDifficulties).map(([id, item]) => `
        <button class="${id === selectedDifficulty ? "active" : ""}" type="button" role="tab"
          aria-selected="${id === selectedDifficulty}" data-gaokao-difficulty="${id}">
          <span>${item.glyph}</span><strong>${item.label}</strong><small>${item.description[locale]}</small>
        </button>`).join("")}
    </div>
    <button class="gaokao-archive-bar" type="button" data-gaokao-records>
      <span>▤</span><p>${c.archive}<strong>${records.length} ${c.attempts}</strong></p><i>→</i>
    </button>
    ${draft ? `
      <div class="gaokao-draft">
        <div><span>✎</span><p>${gaokaoDifficulties[difficultyFor(draft.difficultyId)].label} · ${gaokaoTracks[draft.trackId].name[locale]}<strong>${Object.keys(draft.answers || {}).length} / ${questionsFor(draft.trackId, draft.difficultyId).length} ${c.answered}</strong></p></div>
        <div><button type="button" data-gaokao-discard>${c.discard}</button><button type="button" data-gaokao-resume>${c.resume} →</button></div>
      </div>` : ""}
    <div class="gaokao-track-grid">
      ${Object.entries(gaokaoTracks).map(([id, track]) => {
        const files = downloads(id, selectedDifficulty, locale);
        const questions = questionsFor(id, selectedDifficulty);
        return `
          <article class="gaokao-track" data-difficulty="${selectedDifficulty}">
            <div class="gaokao-track-mark"><span>${track.glyph}</span><small>${id === "humanities" ? "HUM" : "SCI"}</small></div>
            <p>${difficulty.label} · ${gaokaoMeta.edition}</p>
            <h3>${track.name[locale]}</h3>
            <div class="gaokao-subject-list">
              ${track.subjects.map((subjectId) => {
                const subject = gaokaoSubjects[subjectId];
                const marks = questions.filter((question) => question.subjectId === subjectId).reduce((sum, question) => sum + question.points, 0);
                return `<span><b>${subject.code}</b>${subject.name[locale]}<i>${marks} ${c.points}</i></span>`;
              }).join("")}
            </div>
            <dl>
              <div><dt>${c.duration}</dt><dd>${Math.round(difficulty.duration / 60)} ${c.minutes}</dd></div>
              <div><dt>${c.total}</dt><dd>${gaokaoMeta.total} ${c.points} · ${questions.length} ${c.questions}</dd></div>
            </dl>
            <button type="button" data-gaokao-start="${id}">${c.start} <span>→</span></button>
            <div class="gaokao-downloads">
              <a href="${files.paper}" download>${c.paper}</a>
              <a href="${files.answers}" download>${c.answers}</a>
              <small>${c.format}</small>
            </div>
          </article>`;
      }).join("")}
    </div>`;
  app.querySelectorAll("[data-gaokao-difficulty]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDifficulty = button.dataset.gaokaoDifficulty;
      renderLobby();
    });
  });
  app.querySelectorAll("[data-gaokao-start]").forEach((button) => {
    button.addEventListener("click", () => start(button.dataset.gaokaoStart, selectedDifficulty));
  });
  app.querySelector("[data-gaokao-records]")?.addEventListener("click", renderRecords);
  app.querySelector("[data-gaokao-resume]")?.addEventListener("click", () => resume(draft));
  app.querySelector("[data-gaokao-discard]")?.addEventListener("click", () => {
    window.localStorage.removeItem("tu:gaokao:draft");
    renderLobby();
  });
}

function subjectSections(locale) {
  const c = copy[locale];
  const track = gaokaoTracks[state.trackId];
  return track.subjects.map((subjectId, subjectIndex) => {
    const subject = gaokaoSubjects[subjectId];
    const questions = subjectQuestions(state.trackId, state.difficultyId, subjectId);
    const subjectMarks = questions.reduce((sum, question) => sum + question.points, 0);
    return `
      <section class="gaokao-subject" id="gaokao-subject-${subjectId}">
        <header><div><span>${String(subjectIndex + 1).padStart(2, "0")}</span><p>${subject.code}</p></div><h2>${subject.name[locale]}</h2><p>${subject.note[locale]}</p><strong>${subjectMarks} ${c.points}</strong></header>
        ${questions.map((question, index) => `
          <fieldset class="gaokao-question" id="gaokao-question-${question.id}">
            <legend><span>${index + 1}</span><b>${question.prompt[locale]}</b><small>${question.points} ${c.points}</small></legend>
            ${question.evidence ? `<div class="gaokao-evidence"><span>${c.sourceFile}</span><p>${escapeHtml(question.evidence[locale])}</p></div>` : ""}
            <div class="gaokao-option-list">
              ${question.options.map((option, optionIndex) => `
                <label class="${state.answers[question.id] === optionIndex ? "selected" : ""}">
                  <input type="radio" name="${question.id}" value="${optionIndex}" ${state.answers[question.id] === optionIndex ? "checked" : ""}>
                  <span>${String.fromCharCode(65 + optionIndex)}</span><b>${option[locale]}</b>
                </label>`).join("")}
            </div>
          </fieldset>`).join("")}
      </section>`;
  }).join("");
}

function renderRunner() {
  if (!app || !state) return;
  view = "runner";
  const locale = getLocale();
  const c = copy[locale];
  const track = gaokaoTracks[state.trackId];
  const difficulty = gaokaoDifficulties[state.difficultyId];
  const questions = questionsFor(state.trackId, state.difficultyId);
  const answered = Object.keys(state.answers).length;
  state.remaining = Math.max(0, Math.ceil((state.endsAt - Date.now()) / 1000));
  app.innerHTML = `
    <div class="gaokao-paper-shell">
      <article class="gaokao-paper">
        <header class="gaokao-cover">
          <p>${difficulty.label} · ${gaokaoMeta.edition} · ${gaokaoMeta.year}</p>
          <h2>${locale === "zh-Hant" ? "幻想鄉統一學力試驗" : locale === "ja" ? "幻想郷統一高等試験" : "Gensokyo Unified Examination"}</h2>
          <h3>${track.name[locale]} · ${gaokaoMeta.total} ${c.points}</h3>
          <dl><div><dt>${c.candidate}</dt><dd>${c.deviceCandidate}</dd></div><div><dt>${c.duration}</dt><dd>${Math.round(difficulty.duration / 60)} ${c.minutes}</dd></div></dl>
          <section><strong>${c.instructions}</strong><ol>${c.rules.map((rule) => `<li>${rule}</li>`).join("")}</ol></section>
        </header>
        ${subjectSections(locale)}
      </article>
      <aside class="gaokao-answer-sheet">
        <div class="gaokao-timer"><span>${difficulty.label} · ${c.timeLeft}</span><strong data-gaokao-timer>${formatTime(state.remaining)}</strong></div>
        <p>${c.answered} <strong data-gaokao-progress>${answered}</strong> / ${questions.length}</p>
        <div>${questions.map((question) => `<button class="${Number.isInteger(state.answers[question.id]) ? "answered" : ""}" type="button" data-gaokao-jump="${question.id}">${question.id}</button>`).join("")}</div>
        <button class="gaokao-submit" type="button" data-gaokao-submit>${c.submit}</button>
      </aside>
    </div>`;
  app.querySelectorAll('.gaokao-question input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      state.answers[radio.name] = Number(radio.value);
      saveDraft();
      const label = radio.closest("label");
      label.parentElement.querySelectorAll("label").forEach((item) => item.classList.toggle("selected", item === label));
      app.querySelector(`[data-gaokao-jump="${radio.name}"]`)?.classList.add("answered");
      app.querySelector("[data-gaokao-progress]").textContent = String(Object.keys(state.answers).length);
    });
  });
  app.querySelectorAll("[data-gaokao-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector(`#gaokao-question-${button.dataset.gaokaoJump}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
  app.querySelector("[data-gaokao-submit]").addEventListener("click", () => submit(false));
  app.scrollIntoView({ behavior: "smooth", block: "start" });
}

function start(trackId, difficultyId) {
  const now = Date.now();
  const normalizedDifficulty = difficultyFor(difficultyId);
  const duration = gaokaoDifficulties[normalizedDifficulty].duration;
  selectedDifficulty = normalizedDifficulty;
  state = {
    schema: 2,
    trackId,
    difficultyId: normalizedDifficulty,
    answers: {},
    startedAt: new Date(now).toISOString(),
    endsAt: now + duration * 1000,
    remaining: duration,
  };
  saveDraft();
  renderRunner();
  startTimer();
}

function resume(draft) {
  if (!draft) return;
  selectedDifficulty = difficultyFor(draft.difficultyId);
  state = { ...draft, difficultyId: selectedDifficulty, answers: draft.answers || {} };
  const duration = gaokaoDifficulties[selectedDifficulty].duration;
  if (!state.endsAt || state.endsAt < Date.now()) {
    state.endsAt = Date.now() + Math.max(60, state.remaining || duration) * 1000;
  }
  renderRunner();
  startTimer();
}

function startTimer() {
  window.clearInterval(timer);
  timer = window.setInterval(() => {
    if (!state) return;
    state.remaining = Math.max(0, Math.ceil((state.endsAt - Date.now()) / 1000));
    const display = app?.querySelector("[data-gaokao-timer]");
    if (display) display.textContent = formatTime(state.remaining);
    if (state.remaining % 15 === 0) saveDraft();
    if (state.remaining === 0) submit(true);
  }, 500);
}

function scoreAttempt(attempt) {
  const questions = questionsFor(attempt.trackId, attempt.difficultyId);
  let score = 0;
  let correct = 0;
  const bySubject = {};
  questions.forEach((question) => {
    if (!bySubject[question.subjectId]) bySubject[question.subjectId] = { score: 0, total: 0 };
    bySubject[question.subjectId].total += question.points;
    if (attempt.answers?.[question.id] === question.answer) {
      score += question.points;
      correct += 1;
      bySubject[question.subjectId].score += question.points;
    }
  });
  return { questions, score, correct, bySubject };
}

function submit(autoSubmitted) {
  if (!state) return;
  const c = copy[getLocale()];
  const questions = questionsFor(state.trackId, state.difficultyId);
  if (!autoSubmitted && Object.keys(state.answers).length < questions.length && !window.confirm(c.submitConfirm)) return;
  window.clearInterval(timer);
  const scored = scoreAttempt(state);
  const completedAt = new Date().toISOString();
  resultState = {
    ...state,
    ...scored,
    id: `TU-G-${Date.now().toString(36).toUpperCase()}`,
    completedAt,
    autoSubmitted,
  };
  const attempts = history();
  attempts.push({
    schema: 2,
    id: resultState.id,
    trackId: state.trackId,
    difficultyId: state.difficultyId,
    score: scored.score,
    total: gaokaoMeta.total,
    correct: scored.correct,
    bySubject: scored.bySubject,
    answers: { ...state.answers },
    questionIds: questions.map((question) => question.id),
    startedAt: state.startedAt,
    completedAt,
    autoSubmitted,
  });
  writeHistory(attempts);
  recordCampusEvent(
    "gaokao.completed",
    {
      examId: resultState.id,
      difficultyId: state.difficultyId,
      trackId: state.trackId,
      score: scored.score,
      total: gaokaoMeta.total,
    },
    { id: `gaokao.completed:${resultState.id}`, timestamp: completedAt },
  );
  window.localStorage.removeItem("tu:gaokao:draft");
  renderResult();
}

function resultReview(questions, answers, locale, c) {
  return questions.map((question) => {
    const selected = answers?.[question.id];
    const correct = selected === question.answer;
    return `
      <details class="${correct ? "correct" : "incorrect"}">
        <summary><span>${question.id}</span><b>${question.prompt[locale]}</b><i>${correct ? `+${question.points}` : "0"}</i></summary>
        <div>
          ${question.evidence ? `<pre>${escapeHtml(question.evidence[locale])}</pre>` : ""}
          <p><span>${c.yourAnswer}</span>${Number.isInteger(selected) ? question.options[selected][locale] : c.unanswered}</p>
          <p><span>${c.rightAnswer}</span>${String.fromCharCode(65 + question.answer)}. ${question.options[question.answer][locale]}</p>
          <blockquote>${question.explanation[locale]}</blockquote>
        </div>
      </details>`;
  }).join("");
}

function renderResult() {
  if (!app || !resultState) return;
  view = "result";
  const locale = getLocale();
  const c = copy[locale];
  const difficultyId = difficultyFor(resultState.difficultyId);
  const difficulty = gaokaoDifficulties[difficultyId];
  const track = gaokaoTracks[resultState.trackId];
  const scored = scoreAttempt({ ...resultState, difficultyId });
  const questions = scored.questions;
  const score = Number.isFinite(resultState.score) ? resultState.score : scored.score;
  const correct = Number.isFinite(resultState.correct) ? resultState.correct : scored.correct;
  const bySubject = resultState.bySubject || scored.bySubject;
  const percent = Math.round((score / gaokaoMeta.total) * 100);
  const message = percent >= 85 ? c.excellent : percent >= 60 ? c.pass : c.revise;
  app.innerHTML = `
    <section class="gaokao-result">
      <header>
        <div><p>${c.result} · ${difficulty.label} · ${gaokaoMeta.edition}</p><h2>${track.name[locale]}</h2><span>${message}</span></div>
        <div><span>${c.score}</span><strong>${score}</strong><small>/ ${gaokaoMeta.total}</small><p>${correct} / ${questions.length} ${c.correct}</p></div>
      </header>
      ${resultState.autoSubmitted ? `<p class="gaokao-expired">${c.expired}</p>` : ""}
      <div class="gaokao-breakdown">
        ${track.subjects.map((subjectId) => {
          const subject = gaokaoSubjects[subjectId];
          const values = bySubject[subjectId] || { score: 0, total: subjectQuestions(resultState.trackId, difficultyId, subjectId).reduce((sum, question) => sum + question.points, 0) };
          return `<div><span>${subject.code}</span><strong>${subject.name[locale]}</strong><i><b style="width:${values.total ? (values.score / values.total) * 100 : 0}%"></b></i><em>${values.score} / ${values.total}</em></div>`;
        }).join("")}
      </div>
      <section class="gaokao-review">
        <h3>${c.review}</h3>
        ${resultReview(questions, resultState.answers, locale, c)}
      </section>
      <footer>
        <button type="button" data-gaokao-back>← ${c.back}</button>
        <button type="button" data-gaokao-records>${c.localRecords}</button>
        <button type="button" data-gaokao-retake>${c.retake} ↻</button>
      </footer>
    </section>`;
  app.querySelector("[data-gaokao-back]").addEventListener("click", renderLobby);
  app.querySelector("[data-gaokao-records]").addEventListener("click", renderRecords);
  app.querySelector("[data-gaokao-retake]").addEventListener("click", () => start(resultState.trackId, difficultyId));
  app.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderRecords() {
  if (!app) return;
  window.clearInterval(timer);
  state = null;
  resultState = null;
  view = "records";
  const locale = getLocale();
  const c = copy[locale];
  const records = history().slice().reverse();
  app.innerHTML = `
    <section class="gaokao-records">
      <header>
        <div><p>ON THIS DEVICE / ANSWER ARCHIVE</p><h3>${c.localRecords}</h3><span>${c.localLead}</span></div>
        <button type="button" data-gaokao-back>← ${c.back}</button>
      </header>
      <div>
        ${records.length ? records.map((record) => {
          const track = gaokaoTracks[record.trackId];
          const difficultyId = difficultyFor(record.difficultyId);
          const hasAnswers = record.answers && typeof record.answers === "object" && track;
          return `
            <article class="gaokao-record-card">
              <header><span>${gaokaoDifficulties[difficultyId].label}</span><strong>${track?.name[locale] || record.trackId || "—"}</strong><time>${formatDate(record.completedAt, locale)}</time></header>
              <div><strong>${record.score ?? "—"}<small>/ ${record.total || gaokaoMeta.total}</small></strong><p>${c.completed}<span>${escapeHtml(record.id || "LEGACY")}</span></p></div>
              ${hasAnswers
                ? `<button type="button" data-open-gaokao-record="${escapeHtml(record.id)}">${c.viewRecord} →</button>`
                : `<p class="gaokao-record-legacy">${c.legacyRecord}</p>`}
              <button type="button" class="gaokao-record-delete" data-delete-gaokao-record="${escapeHtml(record.id || record.completedAt)}">${c.deleteRecord}</button>
            </article>`;
        }).join("") : `<p class="gaokao-records-empty">${c.noRecords}</p>`}
      </div>
    </section>`;
  app.querySelector("[data-gaokao-back]")?.addEventListener("click", renderLobby);
  app.querySelectorAll("[data-open-gaokao-record]").forEach((button) => {
    button.addEventListener("click", () => {
      const record = history().find((item) => item.id === button.dataset.openGaokaoRecord);
      if (!record) return;
      selectedDifficulty = difficultyFor(record.difficultyId);
      resultState = { ...record, difficultyId: selectedDifficulty };
      renderResult();
    });
  });
  app.querySelectorAll("[data-delete-gaokao-record]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!window.confirm(c.deleteConfirm)) return;
      const key = button.dataset.deleteGaokaoRecord;
      writeHistory(history().filter((record) => (record.id || record.completedAt) !== key));
      recordCampusEvent(
        "gaokao.deleted",
        { examId: key },
        { id: `gaokao.deleted:${key}:${Date.now()}` },
      );
      renderRecords();
      showToast(c.recordDeleted);
    });
  });
  app.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function initGaokao() {
  if (!app || !header) return;
  renderHeader();
  renderLobby();
  window.addEventListener("tu:languagechange", () => {
    renderHeader();
    if (view === "records") renderRecords();
    else if (resultState) renderResult();
    else if (state) renderRunner();
    else renderLobby();
  });
  window.addEventListener("pagehide", () => window.clearInterval(timer), { once: true });
}
