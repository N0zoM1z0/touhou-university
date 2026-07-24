import { examBanks } from "../data/exam.js";
import { getLocale } from "./i18n.js";
import { showToast } from "./ui.js";
import { recordCampusEvent } from "./campus-ledger.js";

const copy = {
  "zh-Hant": {
    choose: "選擇試卷",
    chooseLead: "四套題庫各自計時；每次開考都會重新排列題目。",
    questions: "題",
    minutes: "分鐘",
    best: "個人最佳",
    attempts: "作答次數",
    noAttempt: "尚未應試",
    start: "開始考試",
    answered: "已作答",
    timeLeft: "剩餘時間",
    prev: "上一題",
    next: "下一題",
    submit: "交卷判分",
    unanswered: "未作答",
    result: "成績單",
    correct: "答對",
    score: "得分",
    newBest: "新的個人最佳成績",
    category: "分項",
    review: "逐題解析",
    yourAnswer: "你的答案",
    correctAnswer: "正確答案",
    retake: "重考本卷",
    back: "選擇其他試卷",
    expired: "時間到，試卷已自動提交。",
    excellent: "判斷穩健，可以放心踏進校門。",
    pass: "基礎合格；幾個觀念值得再看一次解析。",
    revise: "建議先讀完解析，再重新挑戰這份試卷。",
    history: "本機紀錄",
    myRecords: "我的入學試驗記錄",
    recordLead: "完整答案與逐題解析只保存在這台裝置。",
    noRecords: "這台裝置還沒有已完成的入學試驗。",
    viewRecord: "重開成績與解析",
    legacyRecord: "舊版只保存成績摘要",
    deleteRecord: "刪除本機記錄",
    deleteConfirm: "確定刪除這次入學試驗記錄？",
    recordDeleted: "已刪除本機入學試驗記錄。",
    completed: "交卷時間",
  },
  ja: {
    choose: "試験を選ぶ",
    chooseLead: "四つの問題集は個別に計時され、開始ごとに問題順が変わります。",
    questions: "問",
    minutes: "分",
    best: "自己最高",
    attempts: "受験回数",
    noAttempt: "未受験",
    start: "試験開始",
    answered: "回答済み",
    timeLeft: "残り時間",
    prev: "前の問題",
    next: "次の問題",
    submit: "提出・採点",
    unanswered: "未回答",
    result: "成績表",
    correct: "正解",
    score: "得点",
    newBest: "自己最高得点を更新",
    category: "分野別",
    review: "問題解説",
    yourAnswer: "あなたの回答",
    correctAnswer: "正解",
    retake: "この試験を再受験",
    back: "別の試験を選ぶ",
    expired: "時間切れのため自動提出しました。",
    excellent: "判断は安定しています。安心して校門をくぐれます。",
    pass: "基礎は合格。いくつかの解説を読み直しましょう。",
    revise: "解説を読んでから、もう一度挑戦することを勧めます。",
    history: "端末内記録",
    myRecords: "自分の入学試験記録",
    recordLead: "答案と問題解説はこの端末だけに保存されます。",
    noRecords: "この端末には完了した入学試験がありません。",
    viewRecord: "成績・解説を再表示",
    legacyRecord: "旧版では成績概要のみ保存",
    deleteRecord: "端末記録を削除",
    deleteConfirm: "この受験記録を削除しますか。",
    recordDeleted: "端末の受験記録を削除しました。",
    completed: "提出日時",
  },
  en: {
    choose: "Choose a paper",
    chooseLead: "Each of four banks is timed separately; question order changes every attempt.",
    questions: "questions",
    minutes: "minutes",
    best: "Personal best",
    attempts: "Attempts",
    noAttempt: "Not attempted",
    start: "Start exam",
    answered: "Answered",
    timeLeft: "Time left",
    prev: "Previous",
    next: "Next",
    submit: "Submit & score",
    unanswered: "Unanswered",
    result: "Result sheet",
    correct: "Correct",
    score: "Score",
    newBest: "New personal best",
    category: "By category",
    review: "Answer review",
    yourAnswer: "Your answer",
    correctAnswer: "Correct answer",
    retake: "Retake this paper",
    back: "Choose another paper",
    expired: "Time expired. The paper was submitted automatically.",
    excellent: "Sound judgment—you can cross the campus gate with confidence.",
    pass: "The foundation is sound; review a few explanations.",
    revise: "Read the explanations, then give this paper another attempt.",
    history: "On-device record",
    myRecords: "My entrance-exam records",
    recordLead: "Full answers and item reviews stay on this device only.",
    noRecords: "No completed entrance exam is stored on this device.",
    viewRecord: "Reopen result and review",
    legacyRecord: "Older version saved only a score summary",
    deleteRecord: "Delete local record",
    deleteConfirm: "Delete this entrance-exam record?",
    recordDeleted: "Local entrance-exam record deleted.",
    completed: "Submitted",
  },
};

const app = document.querySelector("[data-exam-app]");
const lobby = document.querySelector("[data-exam-lobby]");
const runner = document.querySelector("[data-exam-runner]");
const result = document.querySelector("[data-exam-result]");
let state = null;
let lastResult = null;
let timer = null;
let currentPanel = "lobby";

function shuffled(values) {
  const copyValues = values.slice();
  for (let index = copyValues.length - 1; index > 0; index -= 1) {
    const target = crypto.getRandomValues(new Uint32Array(1))[0] % (index + 1);
    [copyValues[index], copyValues[target]] = [copyValues[target], copyValues[index]];
  }
  return copyValues;
}

function history() {
  try {
    const records = JSON.parse(window.localStorage.getItem("tu:exam:history") || "[]");
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

function writeHistory(records) {
  window.localStorage.setItem("tu:exam:history", JSON.stringify(records.slice(-40)));
}

function bankQuestions(bank) {
  return bank.questions.map((question, index) => ({ ...question, id: `${bank.id}-${index + 1}` }));
}

function formatDate(value, locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function formatTime(seconds) {
  const safe = Math.max(0, seconds);
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

function bankHistory(bankId) {
  return history().filter((attempt) => attempt.bankId === bankId);
}

function showPanel(name) {
  currentPanel = name;
  lobby.hidden = name !== "lobby";
  runner.hidden = name !== "runner";
  result.hidden = name !== "result";
}

function renderLobby() {
  if (!lobby) return;
  window.clearInterval(timer);
  state = null;
  lastResult = null;
  const locale = getLocale();
  const c = copy[locale];
  lobby.innerHTML = `
    <div class="exam-lobby-head">
      <div>
        <p>${c.choose}</p>
        <h3>${c.chooseLead}</h3>
      </div>
      <span>${c.history}</span>
    </div>
    <button class="exam-records-bar" type="button" data-exam-records>
      <span>▤</span><p>${c.myRecords}<strong>${history().length} ${c.attempts}</strong></p><i>→</i>
    </button>
    <div class="exam-bank-grid">
      ${examBanks
        .map((bank) => {
          const attempts = bankHistory(bank.id);
          const best = attempts.length ? Math.max(...attempts.map((attempt) => attempt.percent)) : null;
          return `
            <article class="exam-bank">
              <div class="exam-bank-mark"><span>${bank.glyph}</span><small>${bank.code}</small></div>
              <p>${bank.questions.length} ${c.questions} · ${Math.round(bank.duration / 60)} ${c.minutes}</p>
              <h3>${bank.title[locale]}</h3>
              <p>${bank.subtitle[locale]}</p>
              <dl>
                <div><dt>${c.best}</dt><dd>${best === null ? c.noAttempt : `${best}%`}</dd></div>
                <div><dt>${c.attempts}</dt><dd>${attempts.length}</dd></div>
              </dl>
              <button type="button" data-exam-start="${bank.id}">
                ${c.start}<span aria-hidden="true">→</span>
              </button>
            </article>`;
        })
        .join("")}
    </div>`;
  lobby.querySelectorAll("[data-exam-start]").forEach((button) => {
    button.addEventListener("click", () => startExam(button.dataset.examStart));
  });
  lobby.querySelector("[data-exam-records]")?.addEventListener("click", renderRecords);
  showPanel("lobby");
}

function updateTimer() {
  if (!state) return;
  state.remaining = Math.max(0, Math.ceil((state.endsAt - Date.now()) / 1000));
  const timerValue = runner?.querySelector("[data-exam-timer]");
  if (timerValue) timerValue.textContent = formatTime(state.remaining);
  runner?.classList.toggle("is-urgent", state.remaining <= 60);
  if (state.remaining === 0) submitExam(true);
}

function renderRunner() {
  if (!state || !runner) return;
  const locale = getLocale();
  const c = copy[locale];
  const bank = examBanks.find((item) => item.id === state.bankId);
  const question = state.questions[state.current];
  const selected = state.answers[state.current];
  const answeredCount = state.answers.filter((answer) => Number.isInteger(answer)).length;
  runner.innerHTML = `
    <header class="exam-runner-head">
      <div>
        <p>${bank.code} · ${bank.title[locale]}</p>
        <strong>${String(state.current + 1).padStart(2, "0")} / ${String(state.questions.length).padStart(2, "0")}</strong>
      </div>
      <div class="exam-timer">
        <span>${c.timeLeft}</span>
        <strong data-exam-timer>${formatTime(state.remaining)}</strong>
      </div>
    </header>
    <div class="exam-progress" aria-hidden="true"><i style="width:${((state.current + 1) / state.questions.length) * 100}%"></i></div>
    <div class="exam-question">
      <div class="exam-question-meta">
        <span>${question.category[locale]}</span>
        <span>${c.answered} ${answeredCount}/${state.questions.length}</span>
      </div>
      <h3>${question.prompt[locale]}</h3>
      <div class="exam-options" role="radiogroup" aria-label="${question.prompt[locale]}">
        ${question.options
          .map(
            (answer, index) => `
              <button class="${selected === index ? "selected" : ""}" type="button" role="radio"
                aria-checked="${selected === index}" data-exam-answer="${index}">
                <span>${String.fromCharCode(65 + index)}</span><b>${answer[locale]}</b>
              </button>`,
          )
          .join("")}
      </div>
    </div>
    <footer class="exam-controls">
      <button type="button" data-exam-prev ${state.current === 0 ? "disabled" : ""}>← ${c.prev}</button>
      <div class="exam-question-dots" aria-label="${c.answered}">
        ${state.questions
          .map(
            (_, index) => `<button class="${index === state.current ? "current" : ""} ${Number.isInteger(state.answers[index]) ? "answered" : ""}"
              type="button" data-exam-jump="${index}" aria-label="${index + 1}">${index + 1}</button>`,
          )
          .join("")}
      </div>
      ${
        state.current === state.questions.length - 1
          ? `<button class="exam-submit" type="button" data-exam-submit>${c.submit} →</button>`
          : `<button type="button" data-exam-next>${c.next} →</button>`
      }
    </footer>`;
  runner.querySelectorAll("[data-exam-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      state.answers[state.current] = Number(button.dataset.examAnswer);
      renderRunner();
    });
  });
  runner.querySelector("[data-exam-prev]")?.addEventListener("click", () => {
    state.current -= 1;
    renderRunner();
  });
  runner.querySelector("[data-exam-next]")?.addEventListener("click", () => {
    state.current += 1;
    renderRunner();
  });
  runner.querySelector("[data-exam-submit]")?.addEventListener("click", () => submitExam(false));
  runner.querySelectorAll("[data-exam-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      state.current = Number(button.dataset.examJump);
      renderRunner();
    });
  });
  showPanel("runner");
}

function startExam(bankId) {
  const bank = examBanks.find((item) => item.id === bankId);
  if (!bank) return;
  window.clearInterval(timer);
  state = {
    bankId,
    questions: shuffled(bankQuestions(bank)),
    answers: Array(bank.questions.length).fill(null),
    current: 0,
    remaining: bank.duration,
    endsAt: Date.now() + bank.duration * 1000,
  };
  lastResult = null;
  renderRunner();
  timer = window.setInterval(updateTimer, 500);
  app?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function calculateResult(autoSubmitted) {
  const bank = examBanks.find((item) => item.id === state.bankId);
  const correct = state.questions.reduce(
    (total, question, index) => total + (state.answers[index] === question.answer ? 1 : 0),
    0,
  );
  const percent = Math.round((correct / state.questions.length) * 100);
  const previousBest = Math.max(-1, ...bankHistory(bank.id).map((attempt) => attempt.percent));
  return {
    bank,
    questions: state.questions,
    answers: state.answers.slice(),
    correct,
    percent,
    autoSubmitted,
    newBest: percent > previousBest,
    completedAt: new Date().toISOString(),
  };
}

function saveResult(examResult) {
  const attempts = history();
  const record = {
    schema: 2,
    id: `TU-E-${Date.now().toString(36).toUpperCase()}`,
    bankId: examResult.bank.id,
    percent: examResult.percent,
    correct: examResult.correct,
    total: examResult.questions.length,
    questionIds: examResult.questions.map((question) => question.id),
    answers: examResult.answers.slice(),
    autoSubmitted: examResult.autoSubmitted,
    completedAt: examResult.completedAt,
  };
  attempts.push(record);
  writeHistory(attempts);
  recordCampusEvent(
    "exam.completed",
    { examId: record.id, bankId: record.bankId, percent: record.percent },
    { id: `exam.completed:${record.id}`, timestamp: record.completedAt },
  );
  examResult.recordId = record.id;
}

function gradeMessage(percent, locale) {
  const c = copy[locale];
  return percent >= 88 ? c.excellent : percent >= 63 ? c.pass : c.revise;
}

function renderResult() {
  if (!lastResult || !result) return;
  const locale = getLocale();
  const c = copy[locale];
  const { bank, questions, answers, correct, percent } = lastResult;
  const categories = new Map();
  questions.forEach((question, index) => {
    const key = question.category[locale];
    const current = categories.get(key) || [0, 0];
    current[1] += 1;
    if (answers[index] === question.answer) current[0] += 1;
    categories.set(key, current);
  });
  result.innerHTML = `
    <header class="exam-result-head">
      <div>
        <p>${c.result} · ${bank.code}</p>
        <h3>${bank.title[locale]}</h3>
        <span>${gradeMessage(percent, locale)}</span>
      </div>
      <div class="exam-score">
        <strong>${percent}</strong><span>/ 100</span>
        <small>${correct} / ${questions.length} ${c.correct}</small>
      </div>
    </header>
    ${lastResult.autoSubmitted ? `<p class="exam-expired">${c.expired}</p>` : ""}
    ${lastResult.newBest ? `<p class="exam-best">✦ ${c.newBest}</p>` : ""}
    <section class="exam-breakdown">
      <p>${c.category}</p>
      <div>
        ${[...categories]
          .map(
            ([name, values]) => `
              <span><b>${name}</b><i><em style="width:${(values[0] / values[1]) * 100}%"></em></i><strong>${values[0]}/${values[1]}</strong></span>`,
          )
          .join("")}
      </div>
    </section>
    <section class="exam-review">
      <p>${c.review}</p>
      ${questions
        .map((question, index) => {
          const selected = answers[index];
          const isCorrect = selected === question.answer;
          return `
            <details class="${isCorrect ? "correct" : "incorrect"}">
              <summary>
                <span>${String(index + 1).padStart(2, "0")}</span>
                <b>${question.prompt[locale]}</b>
                <i>${isCorrect ? "✓" : "×"}</i>
              </summary>
              <div>
                <p><span>${c.yourAnswer}</span>${Number.isInteger(selected) ? question.options[selected][locale] : c.unanswered}</p>
                <p><span>${c.correctAnswer}</span>${question.options[question.answer][locale]}</p>
                <blockquote>${question.explanation[locale]}</blockquote>
              </div>
            </details>`;
        })
        .join("")}
    </section>
    <footer class="exam-result-actions">
      <button type="button" data-exam-back>← ${c.back}</button>
      <button type="button" data-exam-records>${c.myRecords}</button>
      <button class="exam-submit" type="button" data-exam-retake>${c.retake} ↻</button>
    </footer>`;
  result.querySelector("[data-exam-back]")?.addEventListener("click", renderLobby);
  result.querySelector("[data-exam-records]")?.addEventListener("click", renderRecords);
  result.querySelector("[data-exam-retake]")?.addEventListener("click", () => startExam(bank.id));
  showPanel("result");
}

function renderRecords() {
  if (!result) return;
  window.clearInterval(timer);
  state = null;
  lastResult = null;
  const locale = getLocale();
  const c = copy[locale];
  const records = history().slice().reverse();
  result.innerHTML = `
    <section class="exam-records">
      <header>
        <div><p>ON THIS DEVICE / ANSWER ARCHIVE</p><h3>${c.myRecords}</h3><span>${c.recordLead}</span></div>
        <button type="button" data-exam-back>← ${c.back}</button>
      </header>
      <div class="exam-record-list">
        ${records.length ? records.map((record) => {
          const bank = examBanks.find((item) => item.id === record.bankId);
          const hasAnswers = Array.isArray(record.answers) && Array.isArray(record.questionIds) && bank;
          return `
            <article class="exam-record-card">
              <header><span>${bank?.code || "LEGACY"}</span><strong>${bank?.title[locale] || record.bankId || "—"}</strong><time>${formatDate(record.completedAt, locale)}</time></header>
              <div><strong>${record.percent ?? "—"}<small>/ 100</small></strong><p>${record.correct ?? "—"} / ${record.total ?? "—"} ${c.correct}<span>${record.id || c.completed}</span></p></div>
              ${hasAnswers
                ? `<button type="button" data-open-exam-record="${record.id}">${c.viewRecord} →</button>`
                : `<p class="exam-record-legacy">${c.legacyRecord}</p>`}
              <button type="button" class="exam-record-delete" data-delete-exam-record="${record.id || record.completedAt}">${c.deleteRecord}</button>
            </article>`;
        }).join("") : `<p class="exam-records-empty">${c.noRecords}</p>`}
      </div>
    </section>`;
  result.querySelector("[data-exam-back]")?.addEventListener("click", renderLobby);
  result.querySelectorAll("[data-open-exam-record]").forEach((button) => {
    button.addEventListener("click", () => {
      const record = history().find((item) => item.id === button.dataset.openExamRecord);
      const bank = examBanks.find((item) => item.id === record?.bankId);
      if (!record || !bank) return;
      const indexed = new Map(bankQuestions(bank).map((question) => [question.id, question]));
      const questions = record.questionIds.map((id) => indexed.get(id)).filter(Boolean);
      if (questions.length !== record.answers.length) return;
      lastResult = {
        bank,
        questions,
        answers: record.answers.slice(),
        correct: record.correct,
        percent: record.percent,
        autoSubmitted: record.autoSubmitted,
        newBest: false,
        completedAt: record.completedAt,
        recordId: record.id,
      };
      renderResult();
    });
  });
  result.querySelectorAll("[data-delete-exam-record]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!window.confirm(c.deleteConfirm)) return;
      const key = button.dataset.deleteExamRecord;
      writeHistory(history().filter((record) => (record.id || record.completedAt) !== key));
      recordCampusEvent(
        "exam.deleted",
        { examId: key },
        { id: `exam.deleted:${key}:${Date.now()}` },
      );
      renderRecords();
      showToast(c.recordDeleted);
    });
  });
  showPanel("result");
}

function submitExam(autoSubmitted) {
  if (!state || lastResult) return;
  window.clearInterval(timer);
  lastResult = calculateResult(autoSubmitted);
  saveResult(lastResult);
  renderResult();
  app?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function initExam() {
  renderLobby();
  window.addEventListener("tu:languagechange", () => {
    if (currentPanel === "result" && !lastResult) renderRecords();
    else if (lastResult) renderResult();
    else if (state) renderRunner();
    else renderLobby();
  });
  window.addEventListener("pagehide", () => window.clearInterval(timer), { once: true });
}
