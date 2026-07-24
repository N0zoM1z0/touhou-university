import { gaokaoMeta, gaokaoSubjects, gaokaoTracks } from "../data/gaokao.js";
import { getLocale } from "./i18n.js";
import { showToast } from "./ui.js";

const header = document.querySelector("[data-gaokao-header]");
const app = document.querySelector("[data-gaokao-app]");
let state = null;
let resultState = null;
let timer;

const copy = {
  "zh-Hant": {
    eyebrow: "UNIFIED EXAMINATION / 幻想鄉高考",
    title: "一套真的可以寫完、交卷與判分的統一試卷。",
    lead: "2026 甲卷分文科與理科。共同科包含語文、結界算術與幻想鄉常識；線上模擬限時九十分鐘，答案只保存在這台裝置。",
    choose: "選擇應試組別",
    chooseLead: "每組四科、滿分 150 分。紙本版不計時，適合離線作答或列印。",
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
    rules: ["本卷所有題目均為單選題；每題只有一個最合適答案。", "可在右側答題卡跳題；作答會自動保存於本機。", "時間到將自動交卷；滿月、停電或教室位移不另行加時。"],
    answered: "已答",
    timeLeft: "剩餘時間",
    submit: "交卷並立即判分",
    submitConfirm: "仍有未作答題目，確定交卷嗎？",
    saved: "試卷進度已保存。",
    expired: "時間到，試卷已自動提交。",
    result: "統一試驗成績單",
    score: "總分",
    correct: "答對",
    review: "參考答案與逐題解析",
    yourAnswer: "你的答案",
    rightAnswer: "參考答案",
    unanswered: "未作答",
    back: "返回組別選擇",
    retake: "重新應試",
    excellent: "判讀、計算與常識都很穩。閱卷室沒有抓到你跟第四盞燈走。",
    pass: "整體合格；建議重看失分科目的解析。",
    revise: "基礎仍有岔路。先讀答案，再決定是否相信昨日的空地。",
  },
  ja: {
    eyebrow: "UNIFIED EXAMINATION / 幻想郷統一高等試験",
    title: "最後まで解き、提出し、採点できる統一試験。",
    lead: "2026甲問題は文系・理系。共通科目は語文、境界数学、幻想郷共通常識。オンライン模試は90分、答案はこの端末だけに保存されます。",
    choose: "受験区分を選択",
    chooseLead: "各区分4科目・150点満点。紙版は時間制限なしで、オフライン受験・印刷に対応。",
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
    rules: ["全問単一選択。最も適切な答えを一つ選ぶこと。", "右の解答欄から移動可能。回答は端末へ自動保存。", "時間切れで自動提出。満月・停電・教室移動による延長なし。"],
    answered: "回答済",
    timeLeft: "残り時間",
    submit: "提出して採点",
    submitConfirm: "未回答があります。提出しますか。",
    saved: "答案を保存しました。",
    expired: "時間切れのため自動提出しました。",
    result: "統一試験成績表",
    score: "総得点",
    correct: "正解",
    review: "参考解答・問題解説",
    yourAnswer: "あなたの回答",
    rightAnswer: "参考解答",
    unanswered: "未回答",
    back: "区分選択へ",
    retake: "再受験",
    excellent: "読解・計算・常識は安定。第四の灯について行った形跡もありません。",
    pass: "全体は合格。失点科目の解説を見直しましょう。",
    revise: "基礎にまだ分岐あり。解答を読み、昨日の空地を信じるか再考を。",
  },
  en: {
    eyebrow: "UNIFIED EXAMINATION / GENSOKYO UNIFIED EXAM",
    title: "A unified paper you can actually finish, submit, and score.",
    lead: "The 2026 Paper A has humanities and sciences tracks. Both include Language, Boundary Mathematics, and Shared Gensokyo Knowledge. The online simulation lasts 90 minutes and stays on this device.",
    choose: "Choose an examination track",
    chooseLead: "Four subjects, 150 marks. Printable papers are untimed and work fully offline.",
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
    rules: ["Every item is single-choice. Select the one best answer.", "Use the answer sheet to jump between items; work is autosaved on this device.", "The paper submits at time. Full moons, outages, and relocated classrooms do not add time."],
    answered: "Answered",
    timeLeft: "Time left",
    submit: "Submit and score now",
    submitConfirm: "Some questions are unanswered. Submit anyway?",
    saved: "Paper progress saved.",
    expired: "Time expired. The paper was submitted automatically.",
    result: "Unified Examination Result",
    score: "Total score",
    correct: "Correct",
    review: "Answer key and explanations",
    yourAnswer: "Your answer",
    rightAnswer: "Reference answer",
    unanswered: "Unanswered",
    back: "Back to track selection",
    retake: "Retake paper",
    excellent: "Reading, calculation, and judgment are steady. No evidence you followed the fourth lantern.",
    pass: "A sound overall result. Review the explanations in weaker subjects.",
    revise: "The foundations still fork. Read the key before trusting Yesterday's Clearing.",
  },
};

function questionsFor(trackId) {
  return gaokaoTracks[trackId].subjects.flatMap((subjectId) =>
    gaokaoSubjects[subjectId].questions.map((question) => ({ ...question, subjectId })),
  );
}

function readDraft() {
  try {
    const draft = JSON.parse(window.localStorage.getItem("tu:gaokao:draft") || "null");
    if (!draft || !gaokaoTracks[draft.trackId] || draft.submitted) return null;
    return draft;
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
    return JSON.parse(window.localStorage.getItem("tu:gaokao:attempts") || "[]");
  } catch {
    return [];
  }
}

function formatTime(seconds) {
  const safe = Math.max(0, seconds);
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

function downloads(trackId, locale) {
  const base = `downloads/gaokao/${gaokaoMeta.edition.toLowerCase()}-${locale}-${trackId}`;
  return { paper: `${base}-paper.html`, answers: `${base}-answers.html` };
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
  const locale = getLocale();
  const c = copy[locale];
  const draft = readDraft();
  app.innerHTML = `
    <header class="gaokao-lobby-head">
      <div><p>${c.choose}</p><h3>${c.chooseLead}</h3></div>
      <span>${gaokaoMeta.edition} · ${gaokaoMeta.year}</span>
    </header>
    ${draft ? `
      <div class="gaokao-draft">
        <div><span>✎</span><p>${gaokaoTracks[draft.trackId].name[locale]}<strong>${Object.keys(draft.answers || {}).length} / ${questionsFor(draft.trackId).length} ${c.answered}</strong></p></div>
        <div><button type="button" data-gaokao-discard>${c.discard}</button><button type="button" data-gaokao-resume>${c.resume} →</button></div>
      </div>` : ""}
    <div class="gaokao-track-grid">
      ${Object.entries(gaokaoTracks).map(([id, track]) => {
        const files = downloads(id, locale);
        return `
          <article class="gaokao-track">
            <div class="gaokao-track-mark"><span>${track.glyph}</span><small>${id === "humanities" ? "HUM" : "SCI"}</small></div>
            <p>${gaokaoMeta.edition}</p>
            <h3>${track.name[locale]}</h3>
            <div class="gaokao-subject-list">
              ${track.subjects.map((subjectId) => {
                const subject = gaokaoSubjects[subjectId];
                const marks = subject.questions.reduce((sum, question) => sum + question.points, 0);
                return `<span><b>${subject.code}</b>${subject.name[locale]}<i>${marks} ${c.points}</i></span>`;
              }).join("")}
            </div>
            <dl>
              <div><dt>${c.duration}</dt><dd>${Math.round(gaokaoMeta.duration / 60)} ${c.minutes}</dd></div>
              <div><dt>${c.total}</dt><dd>${gaokaoMeta.total} ${c.points}</dd></div>
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
  app.querySelectorAll("[data-gaokao-start]").forEach((button) => {
    button.addEventListener("click", () => start(button.dataset.gaokaoStart));
  });
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
    const subjectMarks = subject.questions.reduce((sum, question) => sum + question.points, 0);
    return `
      <section class="gaokao-subject" id="gaokao-subject-${subjectId}">
        <header><div><span>${String(subjectIndex + 1).padStart(2, "0")}</span><p>${subject.code}</p></div><h2>${subject.name[locale]}</h2><p>${subject.note[locale]}</p><strong>${subjectMarks} ${c.points}</strong></header>
        ${subject.questions.map((question, index) => `
          <fieldset class="gaokao-question" id="gaokao-question-${question.id}">
            <legend><span>${index + 1}</span><b>${question.prompt[locale]}</b><small>${question.points} ${c.points}</small></legend>
            <div>
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
  const locale = getLocale();
  const c = copy[locale];
  const track = gaokaoTracks[state.trackId];
  const questions = questionsFor(state.trackId);
  const answered = Object.keys(state.answers).length;
  state.remaining = Math.max(0, Math.ceil((state.endsAt - Date.now()) / 1000));
  app.innerHTML = `
    <div class="gaokao-paper-shell">
      <article class="gaokao-paper">
        <header class="gaokao-cover">
          <p>${gaokaoMeta.edition} · ${gaokaoMeta.year}</p>
          <h2>${locale === "zh-Hant" ? "幻想鄉統一高等學力試驗" : locale === "ja" ? "幻想郷統一高等学力試験" : "Gensokyo Unified Higher Examination"}</h2>
          <h3>${track.name[locale]} · ${gaokaoMeta.total} ${c.points}</h3>
          <dl><div><dt>${c.candidate}</dt><dd>${c.deviceCandidate}</dd></div><div><dt>${c.duration}</dt><dd>${Math.round(gaokaoMeta.duration / 60)} ${c.minutes}</dd></div></dl>
          <section><strong>${c.instructions}</strong><ol>${c.rules.map((rule) => `<li>${rule}</li>`).join("")}</ol></section>
        </header>
        ${subjectSections(locale)}
      </article>
      <aside class="gaokao-answer-sheet">
        <div class="gaokao-timer"><span>${c.timeLeft}</span><strong data-gaokao-timer>${formatTime(state.remaining)}</strong></div>
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

function start(trackId) {
  const now = Date.now();
  state = {
    trackId,
    answers: {},
    startedAt: new Date(now).toISOString(),
    endsAt: now + gaokaoMeta.duration * 1000,
    remaining: gaokaoMeta.duration,
  };
  saveDraft();
  renderRunner();
  startTimer();
}

function resume(draft) {
  if (!draft) return;
  state = { ...draft, answers: draft.answers || {} };
  if (!state.endsAt || state.endsAt < Date.now()) {
    state.endsAt = Date.now() + Math.max(60, state.remaining || gaokaoMeta.duration) * 1000;
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

function submit(autoSubmitted) {
  if (!state) return;
  const locale = getLocale();
  const c = copy[locale];
  const questions = questionsFor(state.trackId);
  if (!autoSubmitted && Object.keys(state.answers).length < questions.length && !window.confirm(c.submitConfirm)) return;
  window.clearInterval(timer);
  let score = 0;
  let correct = 0;
  const bySubject = {};
  questions.forEach((question) => {
    if (!bySubject[question.subjectId]) bySubject[question.subjectId] = { score: 0, total: 0 };
    bySubject[question.subjectId].total += question.points;
    if (state.answers[question.id] === question.answer) {
      score += question.points;
      correct += 1;
      bySubject[question.subjectId].score += question.points;
    }
  });
  resultState = { ...state, score, correct, bySubject, autoSubmitted };
  const attempts = history();
  attempts.push({
    trackId: state.trackId,
    score,
    total: gaokaoMeta.total,
    completedAt: new Date().toISOString(),
  });
  window.localStorage.setItem("tu:gaokao:attempts", JSON.stringify(attempts.slice(-20)));
  window.localStorage.removeItem("tu:gaokao:draft");
  renderResult();
}

function renderResult() {
  if (!app || !resultState) return;
  const locale = getLocale();
  const c = copy[locale];
  const track = gaokaoTracks[resultState.trackId];
  const questions = questionsFor(resultState.trackId);
  const percent = Math.round((resultState.score / gaokaoMeta.total) * 100);
  const message = percent >= 85 ? c.excellent : percent >= 60 ? c.pass : c.revise;
  app.innerHTML = `
    <section class="gaokao-result">
      <header>
        <div><p>${c.result} · ${gaokaoMeta.edition}</p><h2>${track.name[locale]}</h2><span>${message}</span></div>
        <div><span>${c.score}</span><strong>${resultState.score}</strong><small>/ ${gaokaoMeta.total}</small><p>${resultState.correct} / ${questions.length} ${c.correct}</p></div>
      </header>
      ${resultState.autoSubmitted ? `<p class="gaokao-expired">${c.expired}</p>` : ""}
      <div class="gaokao-breakdown">
        ${track.subjects.map((subjectId) => {
          const subject = gaokaoSubjects[subjectId];
          const values = resultState.bySubject[subjectId];
          return `<div><span>${subject.code}</span><strong>${subject.name[locale]}</strong><i><b style="width:${(values.score / values.total) * 100}%"></b></i><em>${values.score} / ${values.total}</em></div>`;
        }).join("")}
      </div>
      <section class="gaokao-review">
        <h3>${c.review}</h3>
        ${questions.map((question, index) => {
          const selected = resultState.answers[question.id];
          const correct = selected === question.answer;
          return `
            <details class="${correct ? "correct" : "incorrect"}">
              <summary><span>${question.id}</span><b>${question.prompt[locale]}</b><i>${correct ? `+${question.points}` : "0"}</i></summary>
              <div>
                <p><span>${c.yourAnswer}</span>${Number.isInteger(selected) ? question.options[selected][locale] : c.unanswered}</p>
                <p><span>${c.rightAnswer}</span>${String.fromCharCode(65 + question.answer)}. ${question.options[question.answer][locale]}</p>
                <blockquote>${question.explanation[locale]}</blockquote>
              </div>
            </details>`;
        }).join("")}
      </section>
      <footer><button type="button" data-gaokao-back>← ${c.back}</button><button type="button" data-gaokao-retake>${c.retake} ↻</button></footer>
    </section>`;
  app.querySelector("[data-gaokao-back]").addEventListener("click", renderLobby);
  app.querySelector("[data-gaokao-retake]").addEventListener("click", () => start(resultState.trackId));
  app.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function initGaokao() {
  if (!app || !header) return;
  renderHeader();
  renderLobby();
  window.addEventListener("tu:languagechange", () => {
    renderHeader();
    if (resultState) renderResult();
    else if (state) renderRunner();
    else renderLobby();
  });
}

