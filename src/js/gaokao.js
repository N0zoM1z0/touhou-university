import { text as catalogText, trees as catalogTrees } from "../generated/i18n/ui/gaokao.js";
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

const copy = catalogTrees["copy"];

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
  const migrated = {
    ...draft,
    difficultyId: "normal",
    schema: 3,
    revision: gaokaoMeta.revision,
    legacyRevision: draft.revision || 0,
    legacyAnswers: { ...(draft.answers || {}) },
    answers: {},
  };
  window.localStorage.setItem("tu:gaokao:draft", JSON.stringify(migrated));
  return migrated;
}

function migrateDraftRevision(draft) {
  if (!draft.difficultyId) return migrateLegacyDraft(draft);
  if (draft.revision === gaokaoMeta.revision) return draft;
  const migrated = {
    ...draft,
    schema: 3,
    revision: gaokaoMeta.revision,
    legacyRevision: draft.revision || 1,
    legacyAnswers: { ...(draft.answers || {}) },
    answers: {},
  };
  window.localStorage.setItem("tu:gaokao:draft", JSON.stringify(migrated));
  return migrated;
}

function readDraft() {
  try {
    const draft = JSON.parse(window.localStorage.getItem("tu:gaokao:draft") || "null");
    if (!draft || !gaokaoTracks[draft.trackId] || draft.submitted) return null;
    return migrateDraftRevision(draft);
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
          <h2>${catalogText("renderRunner")[locale]}</h2>
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
    schema: 3,
    revision: gaokaoMeta.revision,
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
  const c = copy[getLocale()];
  selectedDifficulty = difficultyFor(draft.difficultyId);
  state = { ...draft, difficultyId: selectedDifficulty, answers: draft.answers || {} };
  const duration = gaokaoDifficulties[selectedDifficulty].duration;
  if (!state.endsAt || state.endsAt < Date.now()) {
    state.endsAt = Date.now() + Math.max(60, state.remaining || duration) * 1000;
  }
  renderRunner();
  startTimer();
  if (draft.legacyRevision !== undefined) showToast(c.draftRevised);
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
  const revision = attempt.revision || 1;
  let score = 0;
  let correct = 0;
  const bySubject = {};
  questions.forEach((question, index) => {
    const answer = revision === gaokaoMeta.revision ? question.answer : index % question.options.length;
    if (!bySubject[question.subjectId]) bySubject[question.subjectId] = { score: 0, total: 0 };
    bySubject[question.subjectId].total += question.points;
    if (attempt.answers?.[question.id] === answer) {
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
    schema: 3,
    revision: gaokaoMeta.revision,
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

function resultReview(questions, attempt, locale, c) {
  const revision = attempt.revision || 1;
  const legacy = revision !== gaokaoMeta.revision;
  return questions.map((question, index) => {
    const selected = attempt.answers?.[question.id];
    const answer = legacy ? index % question.options.length : question.answer;
    const correct = selected === answer;
    return `
      <details class="${correct ? "correct" : "incorrect"}">
        <summary><span>${question.id}</span><b>${question.prompt[locale]}</b><i>${correct ? `+${question.points}` : "0"}</i></summary>
        <div>
          ${question.evidence ? `<pre>${escapeHtml(question.evidence[locale])}</pre>` : ""}
          <p><span>${c.yourAnswer}</span>${Number.isInteger(selected) ? (legacy ? `${c.legacyChoice}: ${String.fromCharCode(65 + selected)}` : question.options[selected][locale]) : c.unanswered}</p>
          <p><span>${c.rightAnswer}</span>${legacy ? "" : `${String.fromCharCode(65 + question.answer)}. `}${question.options[question.answer][locale]}</p>
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
  const legacy = (resultState.revision || 1) !== gaokaoMeta.revision;
  app.innerHTML = `
    <section class="gaokao-result">
      <header>
        <div><p>${c.result} · ${difficulty.label} · ${gaokaoMeta.edition}</p><h2>${track.name[locale]}</h2><span>${message}</span></div>
        <div><span>${c.score}</span><strong>${score}</strong><small>/ ${gaokaoMeta.total}</small><p>${correct} / ${questions.length} ${c.correct}</p></div>
      </header>
      ${resultState.autoSubmitted ? `<p class="gaokao-expired">${c.expired}</p>` : ""}
      ${legacy ? `<p class="gaokao-expired">${c.legacyReview}</p>` : ""}
      <div class="gaokao-breakdown">
        ${track.subjects.map((subjectId) => {
          const subject = gaokaoSubjects[subjectId];
          const values = bySubject[subjectId] || { score: 0, total: subjectQuestions(resultState.trackId, difficultyId, subjectId).reduce((sum, question) => sum + question.points, 0) };
          return `<div><span>${subject.code}</span><strong>${subject.name[locale]}</strong><i><b style="width:${values.total ? (values.score / values.total) * 100 : 0}%"></b></i><em>${values.score} / ${values.total}</em></div>`;
        }).join("")}
      </div>
      <section class="gaokao-review">
        <h3>${c.review}</h3>
        ${resultReview(questions, resultState, locale, c)}
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
