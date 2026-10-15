import { trees as catalogTrees } from "../generated/i18n/ui/employment.js";
import {
  employmentApplicationDecisions,
  employmentCategoryOptions,
  employmentCountBases,
  employmentJob,
  employmentJobs,
  employmentLocalized,
  employmentObservationWindows,
  employmentOutcomeKinds,
  employmentPayKinds,
  employmentPosterImages,
  employmentScheduleOptions,
} from "../data/employment.js";
import {
  attestEmploymentOutcome,
  employmentApplication,
  employmentApplications,
  employmentAttestations,
  employmentDraft,
  employmentOutcomeSnapshot,
  employmentSummary,
  respondEmploymentApplication,
  saveEmploymentDraft,
  submitEmploymentApplication,
} from "./employment-model.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { getLocale } from "./i18n.js";
import { printDocument } from "./print-document.js";
import { showToast } from "./ui.js";

let root = null;
let selectedJobId = null;
let selectedApplicationId = null;
let categoryFilter = "all";
let scheduleFilter = "all";
let riskFilter = 5;
let basisId = "person";
let observationId = "noon";

const copy = catalogTrees["copy"];

const scheduleLabels = Object.fromEntries(employmentScheduleOptions);

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[character]);
}

const t = (value, locale) => employmentLocalized(value, locale);
const formatDate = (value, locale) => new Intl.DateTimeFormat(
  locale === "zh-Hant" ? "zh-TW" : locale,
  { dateStyle: "medium", timeStyle: "short" },
).format(new Date(value));

function optionMarkup(options, selected, locale) {
  return options.map(([value, label]) => `
    <option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(t(label, locale))}</option>
  `).join("");
}

function hero(locale, c) {
  const summary = employmentSummary();
  return `
    <header class="employment-hero">
      <div>
        <p>${c.eyebrow}</p>
        <h2 id="employment-title">${c.title}</h2>
        <span>${c.lead}</span>
      </div>
      <dl>
        <div><dt>${c.jobs}</dt><dd>${employmentJobs.length}</dd></div>
        <div><dt>${c.applications}</dt><dd>${summary.applications}</dd></div>
        <div><dt>${c.attestations}</dt><dd>${summary.attestations}</dd></div>
      </dl>
    </header>
    <nav class="employment-jump-nav" aria-label="${c.eyebrow}">
      <a href="#employment-outcomes"><span>01</span>${c.outcomesNav}</a>
      <a href="#employment-job-board"><span>02</span>${c.marketNav}</a>
      <a href="#employment-records"><span>03</span>${c.recordsNav}</a>
    </nav>
  `;
}

function outcomePanel(locale, c) {
  const snapshot = employmentOutcomeSnapshot(basisId, observationId);
  const maximum = Math.max(...snapshot.counts.map(({ count }) => count));
  const attestations = employmentAttestations();
  return `
    <section class="employment-census" id="employment-outcomes" aria-labelledby="employment-outcomes-title">
      <header class="employment-heading">
        <p>${c.censusEyebrow}</p>
        <h3 id="employment-outcomes-title">${c.censusTitle}</h3>
        <span>${c.censusLead}</span>
      </header>
      <div class="employment-census-controls">
        <label>${c.basis}
          <select data-employment-basis>
            ${employmentCountBases.map((entry) => `
              <option value="${entry.id}" ${entry.id === snapshot.basis.id ? "selected" : ""}>${entry.glyph} · ${escapeHtml(t(entry.title, locale))}</option>
            `).join("")}
          </select>
        </label>
        <label>${c.observation}
          <select data-employment-observation>
            ${employmentObservationWindows.map((entry) => `
              <option value="${entry.id}" ${entry.id === snapshot.observation.id ? "selected" : ""}>${escapeHtml(t(entry.title, locale))}</option>
            `).join("")}
          </select>
        </label>
      </div>
      <div class="employment-denominator">
        <div><span>${c.denominator}</span><strong>${snapshot.denominator}</strong></div>
        <div><span>${c.statements}</span><strong>${snapshot.statements}</strong></div>
        <div><span>${c.overlap}</span><strong>+${snapshot.overlap}</strong></div>
        <p><b>${c.notRate}</b> · ${escapeHtml(t(snapshot.basis.note, locale))} ${escapeHtml(t(snapshot.observation.note, locale))}</p>
      </div>
      <div class="employment-outcome-list">
        ${snapshot.counts.map((outcome) => `
          <article class="employment-outcome-card">
            <div class="employment-outcome-mark">${outcome.glyph}</div>
            <div>
              <header><h4>${escapeHtml(t(outcome.title, locale))}</h4><strong>${outcome.count}</strong></header>
              <div class="employment-outcome-bar" aria-hidden="true"><span style="width:${Math.max(5, outcome.count / maximum * 100)}%"></span></div>
              <p>${escapeHtml(t(outcome.note, locale))}${outcome.local ? ` · ${c.localAdded} +${outcome.local}` : ""}</p>
            </div>
          </article>
        `).join("")}
      </div>
      <aside class="employment-attestation">
        <div>
          <span>${c.denominatorNote} / LOCAL ECHO</span>
          <h4>${c.attestTitle}</h4>
          <p>${c.attestLead}</p>
          ${attestations.length ? `<small>${c.localAdded}：${attestations.length}</small>` : ""}
        </div>
        <form data-employment-attest>
          <label>${c.name}<input name="displayName" autocomplete="name" required></label>
          <label>${c.outcome}
            <select name="outcomeId">
              ${employmentOutcomeKinds.map((entry) => `<option value="${entry.id}">${entry.glyph} · ${escapeHtml(t(entry.title, locale))}</option>`).join("")}
            </select>
          </label>
          <label class="employment-checkbox"><input type="checkbox" name="simultaneous"> <span>${c.simultaneous}</span></label>
          <label>${c.note}<textarea name="note" rows="3" required></textarea></label>
          <button class="button button-primary" type="submit">${c.attestSubmit}</button>
        </form>
      </aside>
    </section>
  `;
}

function jobCard(entry, locale, c) {
  const image = employmentPosterImages[entry.poster];
  return `
    <article class="employment-job-card ${image ? "has-poster" : "classified"}" id="employment-job-card-${entry.id}">
      ${image ? `
        <img src="${image}" alt="${escapeHtml(`${t(entry.employer, locale)} — ${c.posterAlt}`)}" width="760" height="1188" loading="lazy" decoding="async">
      ` : `<div class="employment-classified-glyph" aria-hidden="true">${entry.glyph}</div>`}
      <div class="employment-job-copy">
        <span>${entry.code}</span>
        <p>${escapeHtml(t(entry.employer, locale))}</p>
        <h4>${escapeHtml(t(entry.title, locale))}</h4>
        <small>${escapeHtml(t(entry.summary, locale))}</small>
        <dl>
          <div><dt>${c.pay}</dt><dd>${escapeHtml(t(employmentPayKinds[entry.payKind], locale))}</dd></div>
          <div><dt>${c.danger}</dt><dd>${"●".repeat(entry.risk)}${"○".repeat(5 - entry.risk)}</dd></div>
        </dl>
        <a href="#employment-job-${entry.id}" data-employment-job="${entry.id}">${c.open}<span aria-hidden="true">↗</span></a>
      </div>
    </article>
  `;
}

function applicationForm(entry, locale, c) {
  const draft = employmentDraft(entry.id);
  return `
    <form class="employment-application-form" data-employment-apply="${entry.id}">
      <header>
        <span>ODD RÉSUMÉ / 怪歷書</span>
        <h4>${c.applyTitle}</h4>
        <p>${c.applyLead}</p>
      </header>
      <div class="employment-form-grid">
        <label>${c.name}<input name="displayName" value="${escapeHtml(draft.displayName)}" autocomplete="name" required></label>
        <label>${c.degree}<input name="degreeNumber" value="${escapeHtml(draft.degreeNumber)}"></label>
      </div>
      <label>${c.strength}<textarea name="strength" rows="3" required>${escapeHtml(draft.strength)}</textarea></label>
      <label>${c.boundary}<textarea name="boundary" rows="3" required>${escapeHtml(draft.boundary)}</textarea></label>
      <div class="employment-form-grid">
        <label>${c.desiredPay}<input name="desiredPay" value="${escapeHtml(draft.desiredPay)}"></label>
        <label>${c.availability}
          <select name="availability">
            ${Object.entries(c.availabilityOptions).map(([value, label]) => `<option value="${value}" ${value === draft.availability ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </label>
      </div>
      <label class="employment-checkbox"><input type="checkbox" name="nonlinearReady" ${draft.nonlinearReady ? "checked" : ""}> <span>${c.nonlinearReady}</span></label>
      <label class="employment-checkbox employment-clause-check"><input type="checkbox" name="clauseAccepted" ${draft.clauseAccepted ? "checked" : ""} required> <span>${c.clauseAccepted}</span></label>
      <footer>
        <small>${c.draftSaved}</small>
        <button class="button button-primary" type="submit">${c.submit}</button>
      </footer>
    </form>
  `;
}

function jobFile(entry, locale, c) {
  if (!entry) return "";
  const image = employmentPosterImages[entry.poster];
  return `
    <article class="employment-job-file" id="employment-job-${entry.id}">
      <header class="employment-file-heading">
        <div>
          <p>${c.fileEyebrow}</p>
          <span>${entry.code}</span>
          <h3>${escapeHtml(t(entry.title, locale))}</h3>
          <b>${escapeHtml(t(entry.employer, locale))}</b>
        </div>
        <div class="employment-file-actions" data-print-exclude>
          <button type="button" class="button button-secondary" data-employment-print>${c.print}</button>
          <button type="button" class="button button-secondary" data-employment-share>${c.share}</button>
        </div>
      </header>
      <div class="employment-file-layout">
        ${image ? `
          <figure class="employment-poster-sheet">
            <img src="${image}" alt="${escapeHtml(`${t(entry.employer, locale)} — ${c.posterAlt}`)}" width="760" height="1188" decoding="async">
            <figcaption><span>${entry.code}</span><strong>${escapeHtml(t(entry.title, locale))}</strong></figcaption>
          </figure>
        ` : `
          <div class="employment-poster-sheet text-poster">
            <span>${entry.glyph}</span><strong>${escapeHtml(t(entry.title, locale))}</strong><small>${escapeHtml(t(entry.employer, locale))}</small>
          </div>
        `}
        <div class="employment-job-terms">
          <p class="employment-file-lede">${escapeHtml(t(entry.summary, locale))}</p>
          <dl>
            <div><dt>${c.work}</dt><dd>${escapeHtml(t(entry.duty, locale))}</dd></div>
            <div><dt>${c.compensation}</dt><dd>${escapeHtml(t(entry.pay, locale))}</dd></div>
            <div class="danger"><dt>${c.impossibleClause}</dt><dd>${escapeHtml(t(entry.clause, locale))}</dd></div>
            <div><dt>${c.trial}</dt><dd>${escapeHtml(t(entry.trial, locale))}</dd></div>
            <div><dt>${c.employerReply}</dt><dd>${escapeHtml(t(entry.reply, locale))}</dd></div>
          </dl>
          <div class="employment-job-meta">
            <span>${c.scheduleLabel} · ${escapeHtml(t(scheduleLabels[entry.schedule], locale))}</span>
            <span>${c.pay} · ${escapeHtml(t(employmentPayKinds[entry.payKind], locale))}</span>
            <span>${c.danger} · ${entry.risk} ${c.dangerUnit}</span>
          </div>
        </div>
      </div>
      ${applicationForm(entry, locale, c)}
    </article>
  `;
}

function marketPanel(locale, c) {
  const matches = employmentJobs.filter((entry) => (
    (categoryFilter === "all" || entry.category === categoryFilter)
    && (scheduleFilter === "all" || entry.schedule === scheduleFilter)
    && entry.risk <= riskFilter
  ));
  const selected = employmentJob(selectedJobId);
  return `
    <section class="employment-market" id="employment-job-board" aria-labelledby="employment-market-title">
      <header class="employment-heading">
        <p>${c.marketEyebrow}</p>
        <h3 id="employment-market-title">${c.marketTitle}</h3>
        <span>${c.marketLead}</span>
      </header>
      <div class="employment-filters">
        <label>${c.category}<select data-employment-category>${optionMarkup(employmentCategoryOptions, categoryFilter, locale)}</select></label>
        <label>${c.schedule}<select data-employment-schedule>${optionMarkup(employmentScheduleOptions, scheduleFilter, locale)}</select></label>
        <label>${c.risk}<input type="range" min="1" max="5" value="${riskFilter}" data-employment-risk><output>${riskFilter} / 5</output></label>
        <strong>${matches.length} ${c.found}</strong>
      </div>
      ${matches.length ? `<div class="employment-job-grid">${matches.map((entry) => jobCard(entry, locale, c)).join("")}</div>` : `<p class="employment-empty">${c.noResults}</p>`}
      ${jobFile(selected, locale, c)}
    </section>
  `;
}

function responseForm(application, c) {
  if (application.response) {
    return `
      <div class="employment-response-saved">
        <span>${c.responseSaved}</span>
        <strong>${c.responses[application.response.kind]}</strong>
        <p>${escapeHtml(application.response.note || "—")}</p>
      </div>
    `;
  }
  return `
    <form class="employment-response-form" data-employment-response="${application.id}">
      <header><h4>${c.responseTitle}</h4><p>${c.responseLead}</p></header>
      <div class="employment-response-actions">
        ${Object.entries(c.responses).map(([value, label]) => `
          <label><input type="radio" name="kind" value="${value}" ${value === "trial" ? "checked" : ""}><span>${label}</span></label>
        `).join("")}
      </div>
      <label>${c.responseNote}<textarea name="note" rows="3"></textarea></label>
      <button class="button button-primary" type="submit">${c.responseTitle}</button>
    </form>
  `;
}

function applicationFile(application, locale, c) {
  if (!application) return "";
  const entry = employmentJob(application.jobId);
  const decision = employmentApplicationDecisions.find(({ id }) => id === application.decisionId);
  return `
    <article class="employment-application-file" id="employment-application-${application.id}">
      <header>
        <div><span>${application.id}</span><h4>${escapeHtml(t(entry.title, locale))}</h4><p>${escapeHtml(t(entry.employer, locale))}</p></div>
        <strong>${decision.glyph} · ${escapeHtml(t(decision.title, locale))}</strong>
      </header>
      <div class="employment-application-verdict">
        <p>${escapeHtml(t(decision.note, locale))}</p>
        <blockquote>${escapeHtml(t(entry.reply, locale))}</blockquote>
      </div>
      <dl>
        <div><dt>${c.name}</dt><dd>${escapeHtml(application.profile.displayName)}</dd></div>
        <div><dt>${c.strength}</dt><dd>${escapeHtml(application.profile.strength)}</dd></div>
        <div><dt>${c.boundary}</dt><dd>${escapeHtml(application.profile.boundary)}</dd></div>
        <div><dt>${c.submittedAt}</dt><dd>${formatDate(application.submittedAt, locale)}</dd></div>
      </dl>
      ${responseForm(application, c)}
    </article>
  `;
}

function recordsPanel(locale, c) {
  const applications = employmentApplications().slice().reverse();
  const selected = employmentApplication(selectedApplicationId);
  return `
    <section class="employment-records" id="employment-records" aria-labelledby="employment-records-title">
      <header class="employment-heading">
        <p>${c.recordsEyebrow}</p>
        <h3 id="employment-records-title">${c.recordsTitle}</h3>
        <span>${c.recordsLead}</span>
      </header>
      ${applications.length ? `
        <div class="employment-record-list">
          ${applications.map((application) => {
            const entry = employmentJob(application.jobId);
            const decision = employmentApplicationDecisions.find(({ id }) => id === application.decisionId);
            return `
              <a href="#employment-application-${application.id}" data-employment-record="${application.id}">
                <span>${decision.glyph}</span>
                <div><strong>${escapeHtml(t(entry.title, locale))}</strong><small>${application.id} · ${formatDate(application.submittedAt, locale)}</small></div>
                <b>${application.response ? c.responseSaved : c.reviewed} ↗</b>
              </a>
            `;
          }).join("")}
        </div>
      ` : `<p class="employment-empty">${c.noRecords}</p>`}
      ${applicationFile(selected, locale, c)}
    </section>
  `;
}

function render({ preserveWindow = true } = {}) {
  if (!root) return;
  const position = preserveWindow ? window.scrollY : null;
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  root.innerHTML = `<div class="employment-workspace">${hero(locale, c)}${outcomePanel(locale, c)}${marketPanel(locale, c)}${recordsPanel(locale, c)}</div>`;
  if (position !== null) requestAnimationFrame(() => window.scrollTo({ top: position, behavior: "instant" }));
}

function applicationInput(form) {
  const data = new FormData(form);
  return {
    jobId: form.dataset.employmentApply,
    displayName: data.get("displayName"),
    degreeNumber: data.get("degreeNumber"),
    strength: data.get("strength"),
    boundary: data.get("boundary"),
    desiredPay: data.get("desiredPay"),
    availability: data.get("availability"),
    nonlinearReady: data.has("nonlinearReady"),
    clauseAccepted: data.has("clauseAccepted"),
  };
}

function bind() {
  root.addEventListener("change", (event) => {
    if (event.target.matches("[data-employment-basis]")) {
      basisId = event.target.value;
      render();
    }
    if (event.target.matches("[data-employment-observation]")) {
      observationId = event.target.value;
      render();
    }
    if (event.target.matches("[data-employment-category]")) {
      categoryFilter = event.target.value;
      render();
    }
    if (event.target.matches("[data-employment-schedule]")) {
      scheduleFilter = event.target.value;
      render();
    }
  });
  root.addEventListener("input", (event) => {
    if (event.target.matches("[data-employment-risk]")) {
      riskFilter = Number(event.target.value);
      event.target.nextElementSibling.textContent = `${riskFilter} / 5`;
      const position = window.scrollY;
      render();
      requestAnimationFrame(() => window.scrollTo({ top: position, behavior: "instant" }));
      return;
    }
    const form = event.target.closest("[data-employment-apply]");
    if (form) saveEmploymentDraft(applicationInput(form));
  });
  root.addEventListener("submit", (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    if (event.target.matches("[data-employment-apply]")) {
      event.preventDefault();
      const result = submitEmploymentApplication(applicationInput(event.target));
      if (result.error) return showToast(c.formError);
      recordCampusEvent("employment.application.submitted", {
        applicationId: result.record.id,
        jobId: result.record.jobId,
        decisionId: result.record.decisionId,
      }, {
        id: `employment.application.submitted:${result.record.id}`,
        timestamp: result.record.submittedAt,
      });
      selectedApplicationId = result.record.id;
      showToast(c.submitted);
      render({ preserveWindow: false });
      navigateToDeepLink(`employment-application-${result.record.id}`);
      return;
    }
    if (event.target.matches("[data-employment-response]")) {
      event.preventDefault();
      const data = new FormData(event.target);
      const result = respondEmploymentApplication(event.target.dataset.employmentResponse, data.get("kind"), data.get("note"));
      if (result.error) return;
      recordCampusEvent("employment.application.responded", {
        applicationId: result.record.id,
        jobId: result.record.jobId,
        response: result.record.response.kind,
      }, {
        id: `employment.application.responded:${result.record.id}:${result.record.response.respondedAt}`,
        timestamp: result.record.response.respondedAt,
        causationId: `employment.application.submitted:${result.record.id}`,
      });
      showToast(c.responded);
      render();
      return;
    }
    if (event.target.matches("[data-employment-attest]")) {
      event.preventDefault();
      const data = new FormData(event.target);
      const result = attestEmploymentOutcome({
        displayName: data.get("displayName"),
        outcomeId: data.get("outcomeId"),
        simultaneous: data.has("simultaneous"),
        note: data.get("note"),
      });
      if (result.error) return showToast(c.attestationError);
      recordCampusEvent("employment.outcome.attested", {
        attestationId: result.record.id,
        outcomeId: result.record.outcomeId,
        simultaneous: result.record.simultaneous,
      }, {
        id: `employment.outcome.attested:${result.record.id}`,
        timestamp: result.record.attestedAt,
      });
      showToast(c.attested);
      render();
    }
  });
  root.addEventListener("click", async (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    if (event.target.closest("[data-employment-print]")) {
      printDocument(root.querySelector(".employment-job-file"), {
        title: root.querySelector(".employment-job-file h3")?.textContent || document.title,
      });
      return;
    }
    if (event.target.closest("[data-employment-share]")) {
      await navigator.clipboard?.writeText(window.location.href);
      showToast(c.shareCopied);
    }
  });
}

function initialState() {
  let route = "";
  try { route = decodeURIComponent(location.hash.slice(1)); } catch { route = location.hash.slice(1); }
  if (route.startsWith("employment-job-")) selectedJobId = route.slice("employment-job-".length);
  if (route.startsWith("employment-application-")) selectedApplicationId = route.slice("employment-application-".length);
}

export function initEmployment() {
  root = document.querySelector("[data-employment-app]");
  if (!root) return;
  initialState();
  render({ preserveWindow: false });
  bind();
  registerDeepLink("employment-application-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "employment-application",
    position: "always",
    open(id) {
      selectedApplicationId = id;
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("employment-job-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "employment-job",
    position: "always",
    open(id) {
      selectedJobId = id;
      render({ preserveWindow: false });
    },
  });
  ["employment-market", "employment-job-board", "employment-outcomes", "employment-records"].forEach((route) => {
    registerDeepLink(route, {
      anchor: () => document.getElementById(route) || root,
      position: "always",
      open() {
        render({ preserveWindow: false });
      },
    });
  });
  window.addEventListener("tu:languagechange", () => render({ preserveWindow: false }));
  window.addEventListener("tu:recordschange", () => render());
}
