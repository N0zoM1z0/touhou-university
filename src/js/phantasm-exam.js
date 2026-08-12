import {
  phantasmExamCopy,
  phantasmExamMeta,
  phantasmExamQuestions,
  phantasmExamSections,
} from "../data/phantasm-exam.js";
import { getLocale } from "./i18n.js";
import {
  phantasmExamAttempts,
  phantasmExamDraft,
  phantasmExamEligibility,
  savePhantasmExamAnswer,
  startPhantasmExam,
  submitPhantasmExam,
} from "./phantasm-exam-model.js";
import { printDocument } from "./print-document.js";
import { showToast } from "./ui.js";

let root = null;
let view = "desk";
let resultId = null;
let languageBound = false;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value, locale) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function sectionQuestions(sectionId) {
  return phantasmExamQuestions.filter((question) => question.sectionId === sectionId);
}

function paperMarkup(locale, c, answers = {}, { interactive = false } = {}) {
  return `
    <article class="phantasm-exam-paper" data-phantasm-exam-paper>
      <header>
        <p>${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <div><strong>${phantasmExamMeta.total} ${c.points}</strong><span>${c.invalid}</span></div>
        <section><b>${c.instructions}</b><ol>${c.rules.map((rule) => `<li>${rule}</li>`).join("")}</ol></section>
      </header>
      ${phantasmExamSections.map((section) => `
        <section class="phantasm-exam-part">
          <header><div><span>${section.code}</span><h3>${section.title[locale]}</h3></div><p>${section.note[locale]}</p></header>
          ${sectionQuestions(section.id).map((question) => `
            <fieldset class="phantasm-exam-question" id="phantasm-exam-${question.id}">
              <legend><span>${question.id}</span><b>${phantasmExamQuestions.indexOf(question) + 1}. ${question.prompt[locale]}</b><small>${question.points} ${c.points}</small></legend>
              <pre>${escapeHtml(question.evidence[locale])}</pre>
              <div>
                ${question.options.map((option, optionIndex) => `
                  <label class="${answers[question.id] === optionIndex ? "is-selected" : ""}">
                    <input type="radio" name="${question.id}" value="${optionIndex}" ${answers[question.id] === optionIndex ? "checked" : ""} ${interactive ? "" : "disabled"}>
                    <span>${String.fromCharCode(65 + optionIndex)}</span><b>${option[locale]}</b>
                  </label>`).join("")}
              </div>
            </fieldset>`).join("")}
        </section>`).join("")}
    </article>`;
}

function renderDesk(locale, c) {
  const eligibility = phantasmExamEligibility();
  const draft = phantasmExamDraft();
  const attempts = phantasmExamAttempts().slice().reverse();
  root.innerHTML = `
    <section class="phantasm-exam-desk" id="phantasm-exam" data-phantasm-route="phantasm-exam">
      <header class="phantasm-section-heading">
        <div><p>${c.eyebrow}</p><h2>${c.title}</h2></div>
        <p>${c.lead}</p>
      </header>
      <div class="phantasm-exam-seal ${eligibility.extraCompleted ? "is-visible" : ""}">
        <span aria-hidden="true">${eligibility.extraCompleted ? "EX" : "未"}</span>
        <div><b>${c.prerequisite}</b><p>${eligibility.extraCompleted ? c.extraFound : c.extraMissing}</p>
          ${eligibility.proof ? `<small>EXTRA · ${escapeHtml(eligibility.proof.trackId.toUpperCase())} · ${formatDate(eligibility.proof.completedAt, locale)}</small>` : ""}
        </div>
      </div>
      <div class="phantasm-exam-actions">
        <button type="button" data-phantasm-exam-start ${eligibility.eligible ? "" : "disabled"}>${draft ? c.resume : c.start} →</button>
        <button type="button" data-phantasm-exam-print-blank ${eligibility.eligible ? "" : "disabled"}>${c.printPaper}</button>
      </div>
      <section class="phantasm-exam-records">
        <h3>${c.records}</h3>
        ${attempts.length ? attempts.map((record) => `
          <button type="button" data-phantasm-exam-result="${escapeHtml(record.id)}">
            <span>${formatDate(record.completedAt, locale)}</span><strong>${record.score} / ${phantasmExamMeta.total}</strong><small>${record.correct} / ${phantasmExamQuestions.length}</small>
          </button>`).join("") : `<p>${c.noRecords}</p>`}
      </section>
    </section>`;
}

function renderRunner(locale, c) {
  const draft = phantasmExamDraft();
  if (!draft) {
    view = "desk";
    renderDesk(locale, c);
    return;
  }
  const answered = Object.keys(draft.answers).length;
  root.innerHTML = `
    <section class="phantasm-exam-runner" data-phantasm-route="phantasm-exam-paper">
      ${paperMarkup(locale, c, draft.answers, { interactive: true })}
      <aside class="phantasm-exam-sheet">
        <p>${c.answered} <strong>${answered}</strong> / ${phantasmExamQuestions.length}</p>
        <div>${phantasmExamQuestions.map((question) => `<a class="${Number.isInteger(draft.answers[question.id]) ? "is-answered" : ""}" href="#phantasm-exam-${question.id}">${question.id}</a>`).join("")}</div>
        <button type="button" data-phantasm-exam-submit>${c.submit}</button>
        <button type="button" data-phantasm-exam-back>${c.back}</button>
      </aside>
    </section>`;
}

function renderResult(locale, c) {
  const record = phantasmExamAttempts().find((attempt) => attempt.id === resultId) || phantasmExamAttempts().at(-1);
  if (!record) {
    view = "desk";
    renderDesk(locale, c);
    return;
  }
  resultId = record.id;
  const percent = Math.round((record.score / phantasmExamMeta.total) * 100);
  const message = percent >= 85 ? c.excellent : percent >= 60 ? c.pass : c.revise;
  root.innerHTML = `
    <section class="phantasm-exam-result" data-phantasm-route="phantasm-exam-result" data-phantasm-exam-result-paper>
      <header><div><p>${c.result}</p><h2>${record.score}<small>/ ${phantasmExamMeta.total}</small></h2><span>${message}</span></div><strong>${c.invalid}</strong></header>
      <section><h3>${c.review}</h3>
        ${phantasmExamQuestions.map((question) => {
          const selected = record.answers[question.id];
          const correct = selected === question.answer;
          return `<details class="${correct ? "is-correct" : "is-wrong"}">
            <summary><span>${question.id}</span><b>${question.prompt[locale]}</b><i>${correct ? `+${question.points}` : "0"}</i></summary>
            <div><pre>${escapeHtml(question.evidence[locale])}</pre>
              <p><span>${c.yourAnswer}</span>${Number.isInteger(selected) ? `${String.fromCharCode(65 + selected)}. ${question.options[selected][locale]}` : c.unanswered}</p>
              <p><span>${c.rightAnswer}</span>${String.fromCharCode(65 + question.answer)}. ${question.options[question.answer][locale]}</p>
              <blockquote>${question.explanation[locale]}</blockquote></div>
          </details>`;
        }).join("")}
      </section>
      <footer><button type="button" data-phantasm-exam-back>${c.back}</button><button type="button" data-phantasm-exam-restart>${c.restart}</button><button type="button" data-phantasm-exam-print-result>${c.printResult}</button></footer>
    </section>`;
}

function render({ preserveScroll = false } = {}) {
  if (!root) return;
  const scrollY = preserveScroll ? window.scrollY : null;
  const locale = getLocale();
  const c = phantasmExamCopy[locale] || phantasmExamCopy["zh-Hant"];
  if (view === "runner") renderRunner(locale, c);
  else if (view === "result") renderResult(locale, c);
  else renderDesk(locale, c);
  if (scrollY !== null) window.requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "auto" }));
}

function begin({ fresh = false } = {}) {
  if (fresh || !phantasmExamDraft()) {
    const outcome = startPhantasmExam();
    if (!outcome.draft) return;
  }
  view = "runner";
  render();
  root.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bind() {
  root.addEventListener("change", (event) => {
    const radio = event.target.closest('.phantasm-exam-question input[type="radio"]');
    if (!radio) return;
    savePhantasmExamAnswer(radio.name, Number(radio.value));
    showToast((phantasmExamCopy[getLocale()] || phantasmExamCopy["zh-Hant"]).saved);
    render({ preserveScroll: true });
  });
  root.addEventListener("click", (event) => {
    const c = phantasmExamCopy[getLocale()] || phantasmExamCopy["zh-Hant"];
    if (event.target.closest("[data-phantasm-exam-start]")) begin();
    if (event.target.closest("[data-phantasm-exam-restart]")) begin({ fresh: true });
    if (event.target.closest("[data-phantasm-exam-back]")) {
      view = "desk";
      render();
    }
    if (event.target.closest("[data-phantasm-exam-submit]")) {
      const draft = phantasmExamDraft();
      if (Object.keys(draft?.answers || {}).length < phantasmExamQuestions.length && !window.confirm(c.submitConfirm)) return;
      const outcome = submitPhantasmExam();
      if (!outcome.record) return;
      resultId = outcome.record.id;
      view = "result";
      render();
    }
    const resultButton = event.target.closest("[data-phantasm-exam-result]");
    if (resultButton) {
      resultId = resultButton.dataset.phantasmExamResult;
      view = "result";
      render();
    }
    if (event.target.closest("[data-phantasm-exam-print-blank]")) {
      const locale = getLocale();
      const shell = document.createElement("section");
      shell.innerHTML = paperMarkup(locale, c);
      printDocument(shell.firstElementChild, { title: phantasmExamMeta.id });
    }
    if (event.target.closest("[data-phantasm-exam-print-result]")) {
      printDocument(root.querySelector("[data-phantasm-exam-result-paper]"), { title: `${phantasmExamMeta.id}-${resultId}` });
    }
  });
}

export function initPhantasmExam() {
  root = document.querySelector("[data-phantasm-exam]");
  if (!root) return;
  if (root.dataset.phantasmExamInitialized === "true") return;
  root.dataset.phantasmExamInitialized = "true";
  render();
  bind();
  if (!languageBound) {
    window.addEventListener("tu:languagechange", () => render({ preserveScroll: true }));
    languageBound = true;
  }
}
