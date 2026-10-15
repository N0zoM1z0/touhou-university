import { trees as catalogTrees } from "../generated/i18n/ui/appraisal.js";
import {
  appraisalAgencyLevels,
  appraisalDestinations,
  appraisalObject,
  appraisalObjects,
  appraisalReviewers,
} from "../data/appraisal.js";
import {
  appraisalDeskStatus,
  appraisalDraft,
  appraisalDrafts,
  appraisalRecord,
  appraisalRecords,
  assessAppraisal,
  clearAppraisalDraft,
  completeAppraisal,
  latestAppraisalFor,
  saveAppraisalDraft,
} from "./appraisal-model.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { getLocale } from "./i18n.js";
import { bindImeSafeInput } from "./ime-input.js";
import { renderPreservingState } from "./render-state.js";
import { siteHref } from "./site-router.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

const copy = catalogTrees["copy"];

let app;
let retentionDialog;
let retentionForm;
let selectedObjectId;
let selectedRecordId = null;
let mode = "desk";
let message = "";
let clockTimer;

function localized(value, locale = getLocale()) {
  return value?.[locale] || value?.["zh-Hant"] || "";
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[character]));
}

function formatDate(value, locale = getLocale(), withTime = true) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, withTime
    ? { dateStyle: "medium", timeStyle: "short" }
    : { dateStyle: "medium" }).format(date);
}

function verdictLabel(record, c) {
  if (record.disposition === "contested") return c.contested;
  return record.verdict === "supported" ? c.supported : record.verdict === "unsupported" ? c.unsupported : c.provisional;
}

function statusPanel(locale, c) {
  const status = appraisalDeskStatus(locale);
  return `
    <aside class="appraisal-live-board ${status.open ? "is-open" : "is-closed"}">
      <div>
        <span>${status.open ? c.open : c.closed}</span>
        <strong>${status.library?.hours || "—"}</strong>
        <small>${c.libraryHours} · ${status.library?.note || "—"}</small>
      </div>
      <div><span>${c.queue}</span><strong>${status.queue}</strong><small>${c.queueUnit}</small></div>
      <div><span>${c.weekly}</span><strong>${escapeHtml(localized(status.weeklyObject.name, locale))}</strong><small>${escapeHtml(status.weeklyObject.code)}</small></div>
      <p><b>${c.liveNotice}</b>${escapeHtml(status.notice)}</p>
    </aside>`;
}

function objectShelf(locale, c) {
  return `
    <section class="appraisal-object-shelf">
      <header>
        <div><p>INTAKE / SERIES O-77</p><h3>${c.selectObject}</h3></div>
        <span>${c.outsiderDesk}<small>${c.scrollObjects} →</small></span>
      </header>
      <div data-preserve-scroll="appraisal-objects">
        ${appraisalObjects.map((object) => {
          const active = object.id === selectedObjectId;
          const latest = latestAppraisalFor(object.id);
          return `
            <button type="button" data-appraisal-object="${object.id}" aria-pressed="${active}">
              <i aria-hidden="true">${object.glyph}</i>
              <span><small>${object.code}</small><strong>${escapeHtml(localized(object.name, locale))}</strong></span>
              <b>${latest ? latest.disposition === "contested" ? "?" : "✓" : "·"}</b>
            </button>`;
        }).join("")}
      </div>
    </section>`;
}

function evidenceCards(object, draft, locale, c) {
  return object.evidence.map((item, index) => {
    const active = draft.evidenceIds.includes(item.id);
    return `
      <button type="button" class="appraisal-evidence-card" data-appraisal-evidence="${item.id}" aria-pressed="${active}">
        <span>0${index + 1}</span>
        <div><strong>${escapeHtml(localized(item.label, locale))}</strong><p>${escapeHtml(localized(item.detail, locale))}</p></div>
        <b>${active ? c.reviewed : "+"}</b>
      </button>`;
  }).join("");
}

function hypothesisCards(object, draft, locale) {
  return object.hypotheses.map((item) => {
    const active = draft.hypothesisId === item.id;
    return `
      <button type="button" data-appraisal-hypothesis="${item.id}" aria-pressed="${active}">
        <strong>${escapeHtml(localized(item.title, locale))}</strong>
        <span>${escapeHtml(localized(item.claim, locale))}</span>
        <i aria-hidden="true">${active ? "●" : "○"}</i>
      </button>`;
  }).join("");
}

function testCards(object, draft, locale, c) {
  return object.tests.map((item, index) => {
    const active = draft.testIds.includes(item.id);
    return `
      <article class="appraisal-test-card ${active ? "is-run" : ""}">
        <button type="button" data-appraisal-test="${item.id}" aria-pressed="${active}">
          <span>T-${index + 1}</span><strong>${escapeHtml(localized(item.title, locale))}</strong><i aria-hidden="true">${active ? "−" : "+"}</i>
        </button>
        <div>
          <p><b>${c.method}</b>${escapeHtml(localized(item.method, locale))}</p>
          ${active ? `<p class="appraisal-test-result"><b>${c.observation}</b>${escapeHtml(localized(item.result, locale))}</p>` : ""}
        </div>
      </article>`;
  }).join("");
}

function useOptions(object, draft, locale, c) {
  return `
    <label>${c.currentUse}
      <select name="useId" data-appraisal-field="useId" data-preserve-focus="appraisal-use">
        <option value="">${c.chooseUse}</option>
        ${object.uses.map((item) => `<option value="${item.id}" ${draft.useId === item.id ? "selected" : ""}>${escapeHtml(localized(item.title, locale))}</option>`).join("")}
      </select>
    </label>
    ${draft.useId ? `<p class="appraisal-use-note">${escapeHtml(localized(object.uses.find((item) => item.id === draft.useId)?.note, locale))}</p>` : ""}`;
}

function destinationCards(draft, locale) {
  return Object.entries(appraisalDestinations).map(([id, destination]) => {
    const active = draft.destinationId === id;
    return `
      <button type="button" data-appraisal-destination="${id}" aria-pressed="${active}">
        <i aria-hidden="true">${destination.glyph}</i>
        <span><strong>${escapeHtml(localized(destination.name, locale))}</strong><small>${escapeHtml(localized(destination.note, locale))}</small></span>
      </button>`;
  }).join("");
}

function recordView(record, locale, c, { embedded = false } = {}) {
  if (!record) return "";
  const object = appraisalObject(record.objectId);
  const hypothesis = object?.hypotheses.find((item) => item.id === record.hypothesisId);
  const useChoice = object?.uses.find((item) => item.id === record.useId);
  const destination = appraisalDestinations[record.destinationId];
  const agency = appraisalAgencyLevels[record.agencyId];
  const reviewer = appraisalReviewers[record.reviewerId];
  return `
    <article class="appraisal-record ${record.disposition === "contested" ? "is-contested" : ""}${embedded ? " is-embedded" : ""}" id="appraisal-record-${escapeHtml(record.id)}">
      <header>
        <div><p>${escapeHtml(object?.code || record.objectId)} · ${escapeHtml(record.id)}</p><h3>${escapeHtml(localized(object?.name, locale))}</h3></div>
        <span data-verdict="${record.disposition === "contested" ? "contested" : record.verdict}">${verdictLabel(record, c)}</span>
      </header>
      ${record.disposition === "contested" ? `<div class="appraisal-contested-warning"><strong>${c.unsupported}</strong><p>${c.retentionWarning}</p></div>` : ""}
      <div class="appraisal-record-score"><span>${c.score}</span><strong>${record.score}</strong><small>/ 100</small></div>
      <dl class="appraisal-record-findings">
        <div><dt>${c.proposed}</dt><dd>${escapeHtml(localized(hypothesis?.title, locale))}</dd></div>
        <div><dt>${c.identified}</dt><dd>${escapeHtml(localized(object?.truth.intended, locale))}</dd></div>
        <div><dt>${c.operation}</dt><dd>${escapeHtml(localized(object?.truth.operation, locale))}</dd></div>
        <div class="warning"><dt>${c.caution}</dt><dd>${escapeHtml(localized(object?.truth.caution, locale))}</dd></div>
        <div><dt>${c.nextUse}</dt><dd>${escapeHtml(localized(useChoice?.title, locale))}</dd></div>
        <div><dt>${c.assigned}</dt><dd>${escapeHtml(localized(destination?.name, locale))}</dd></div>
        <div><dt>${c.agencyResult}</dt><dd>${escapeHtml(localized(agency, locale))}</dd></div>
        <div><dt>${c.evidence} / ${c.tests}</dt><dd>${record.evidenceIds.length}/${object?.evidence.length || 0} · ${record.testIds.length}/${object?.tests.length || 0}</dd></div>
      </dl>
      ${record.fieldNote ? `<blockquote class="appraisal-field-note">${escapeHtml(record.fieldNote)}</blockquote>` : ""}
      ${record.correctionOf ? `<p class="appraisal-correction">${c.correction} · <code>${escapeHtml(record.correctionOf)}</code></p>` : ""}
      ${reviewer ? `<div class="appraisal-retention-meta"><span>${c.retainedBy}</span><strong>${escapeHtml(localized(reviewer.name, locale))}</strong><span>${c.retentionReason}</span><p>${escapeHtml(record.retentionReason)}</p></div>` : ""}
      <section class="appraisal-panel-notes">
        <h4>${c.panel}</h4>
        <div>${Object.entries(appraisalReviewers).map(([id, member]) => `
          <article>
            <header><i aria-hidden="true">${id === "rinnosuke" ? "香" : id === "ran" ? "藍" : id === "nitori" ? "河" : "傘"}</i><div><strong>${escapeHtml(localized(member.name, locale))}</strong><span>${escapeHtml(localized(member.role, locale))}</span></div></header>
            <p>「${escapeHtml(localized(object?.panel[id], locale))}」</p>
          </article>`).join("")}</div>
      </section>
      <footer>
        <time datetime="${escapeHtml(record.createdAt)}">${c.date} · ${formatDate(record.createdAt, locale)}</time>
        <div>
          <button class="button button-secondary" type="button" data-appraisal-share="${escapeHtml(record.id)}">${c.share}</button>
          <a class="button button-secondary" href="${siteHref(`bbs-appraisal-${record.id}`)}">${c.openBbs}</a>
          <button class="button button-primary" type="button" data-appraisal-restart="${escapeHtml(record.objectId)}">${c.startAnother}</button>
        </div>
      </footer>
    </article>`;
}

function workbench(locale, c) {
  const object = appraisalObject(selectedObjectId) || appraisalObjects[0];
  const draft = appraisalDraft(object.id);
  const latest = latestAppraisalFor(object.id);
  const assessment = assessAppraisal(object.id, draft);
  return `
    <section class="appraisal-workbench" id="appraisal-object-${object.id}" data-appraisal-workbench>
      <header class="appraisal-case-heading">
        <div class="appraisal-object-seal" aria-hidden="true">${object.glyph}</div>
        <div><p>${object.code} · ${c.selected}</p><h3>${escapeHtml(localized(object.name, locale))}</h3><span>${escapeHtml(localized(object.workingTitle, locale))}</span></div>
        <dl>
          <div><dt>${c.arrival}</dt><dd>${escapeHtml(localized(object.arrival, locale))}</dd></div>
          <div><dt>${c.condition}</dt><dd>${escapeHtml(localized(object.condition, locale))}</dd></div>
          <div><dt>${c.lastRecord}</dt><dd>${latest ? `${verdictLabel(latest, c)} · ${formatDate(latest.createdAt, locale, false)}` : c.noRecord}</dd></div>
        </dl>
      </header>
      ${message ? `<p class="appraisal-message" role="status">${escapeHtml(message)}</p>` : ""}
      <form data-appraisal-form>
        <fieldset class="appraisal-stage">
          <legend><span>01</span><strong>${c.stepEvidence}</strong><small>${c.evidenceLead}</small></legend>
          <div class="appraisal-evidence-grid">${evidenceCards(object, draft, locale, c)}</div>
        </fieldset>
        <fieldset class="appraisal-stage">
          <legend><span>02</span><strong>${c.stepHypothesis}</strong><small>${c.hypothesisLead}</small></legend>
          <div class="appraisal-hypotheses">${hypothesisCards(object, draft, locale)}</div>
        </fieldset>
        <fieldset class="appraisal-stage">
          <legend><span>03</span><strong>${c.stepTests}</strong><small>${c.testsLead}</small></legend>
          <div class="appraisal-tests">${testCards(object, draft, locale, c)}</div>
        </fieldset>
        <fieldset class="appraisal-stage appraisal-disposition">
          <legend><span>04</span><strong>${c.stepUse}</strong><small>${escapeHtml(localized(object.truth.caution, locale))}</small></legend>
          <div class="appraisal-use-fields">
            <div>${useOptions(object, draft, locale, c)}</div>
            <label>${c.agency}
              <select name="agencyId" data-appraisal-field="agencyId" data-preserve-focus="appraisal-agency">
                ${Object.entries(appraisalAgencyLevels).map(([id, label]) => `<option value="${id}" ${draft.agencyId === id ? "selected" : ""}>${escapeHtml(localized(label, locale))}</option>`).join("")}
              </select>
            </label>
          </div>
          <h4>${c.destination}</h4>
          <div class="appraisal-destinations">${destinationCards(draft, locale)}</div>
          <label class="appraisal-note">${c.fieldNote}
            <textarea name="fieldNote" rows="4" maxlength="800" data-appraisal-note data-preserve-focus="appraisal-note" placeholder="${escapeHtml(c.fieldPlaceholder)}">${escapeHtml(draft.fieldNote)}</textarea>
          </label>
        </fieldset>
        <footer class="appraisal-submit">
          <span><i aria-hidden="true">✓</i>${c.autosaved}<b>${assessment?.score || 0}/100</b></span>
          <button class="button button-secondary" type="button" data-appraisal-clear>${c.clear}</button>
          <button class="button button-primary" type="submit">${c.submit} <span aria-hidden="true">→</span></button>
        </footer>
      </form>
      ${latest ? recordView(latest, locale, c, { embedded: true }) : ""}
    </section>`;
}

function archiveView(locale, c) {
  const records = appraisalRecords().slice().reverse();
  const drafts = Object.values(appraisalDrafts()).filter((draft) => draft?.objectId);
  const selected = selectedRecordId ? appraisalRecord(selectedRecordId) : null;
  return `
    <section class="appraisal-archive">
      <header><div><p>LOCAL APPRAISAL REGISTER</p><h3>${c.archiveTitle}</h3></div><span>${c.archiveLead}</span></header>
      ${selected ? recordView(selected, locale, c) : ""}
      ${drafts.length ? `
        <section class="appraisal-draft-register">
          <h4>${c.drafts} · ${drafts.length}</h4>
          <div>${drafts.map((draft) => {
            const object = appraisalObject(draft.objectId);
            return `<button type="button" data-appraisal-continue="${draft.objectId}"><i aria-hidden="true">${object?.glyph || "物"}</i><span><strong>${escapeHtml(localized(object?.name, locale))}</strong><small>${formatDate(draft.updatedAt, locale)}</small></span><b>${c.continueDraft} →</b></button>`;
          }).join("")}</div>
        </section>` : ""}
      <div class="appraisal-register">
        ${records.length ? records.map((record) => {
          const object = appraisalObject(record.objectId);
          return `
            <article class="${record.disposition === "contested" ? "is-contested" : ""}">
              <i aria-hidden="true">${object?.glyph || "物"}</i>
              <div><p>${escapeHtml(record.id)} · ${escapeHtml(object?.code || "")}</p><h4>${escapeHtml(localized(object?.name, locale))}</h4><span>${c.status} · ${verdictLabel(record, c)}</span></div>
              <time datetime="${escapeHtml(record.createdAt)}">${formatDate(record.createdAt, locale)}</time>
              <button type="button" data-appraisal-record="${escapeHtml(record.id)}">${c.openRecord}</button>
            </article>`;
        }).join("") : `<p class="appraisal-empty">${c.noArchive}</p>`}
      </div>
    </section>`;
}

function renderContent() {
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  const stats = {
    drafts: Object.keys(appraisalDrafts()).length,
    records: appraisalRecords().length,
  };
  app.innerHTML = `
    <header class="appraisal-hero">
      <div>
        <p>${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
      </div>
      <blockquote>${c.outsiderDesk}</blockquote>
    </header>
    ${statusPanel(locale, c)}
    <nav class="appraisal-tabs" aria-label="${escapeHtml(c.title)}">
      <button type="button" data-appraisal-mode="desk" aria-selected="${mode === "desk"}"><span>01</span><strong>${c.desk}</strong><b>${stats.drafts} ${c.draftCount}</b></button>
      <button type="button" data-appraisal-mode="archive" aria-selected="${mode === "archive"}"><span>02</span><strong>${c.archive}</strong><b>${stats.records} ${c.recordCount}</b></button>
    </nav>
    ${mode === "desk" ? `${objectShelf(locale, c)}${workbench(locale, c)}` : archiveView(locale, c)}`;
}

function render({ preserveWindow = true } = {}) {
  if (!app) return;
  renderPreservingState(app, renderContent, { preserveWindow });
  bindControls();
}

function saveToggle(field, value) {
  const draft = appraisalDraft(selectedObjectId);
  const values = new Set(draft[field] || []);
  if (values.has(value)) values.delete(value);
  else values.add(value);
  saveAppraisalDraft(selectedObjectId, { [field]: [...values] });
  message = "";
  render();
}

function completeOrdinary() {
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  const result = completeAppraisal(selectedObjectId, appraisalDraft(selectedObjectId));
  if (result.error === "incomplete") {
    message = c.incomplete;
    render();
    return;
  }
  if (result.requiresContested) {
    openRetentionDialog();
    return;
  }
  finishRecord(result.record, c);
}

function finishRecord(record, c) {
  recordCampusEvent(
    "appraisal.completed",
    {
      appraisalId: record.id,
      objectId: record.objectId,
      verdict: record.verdict,
      disposition: record.disposition,
      destinationId: record.destinationId,
    },
    { id: `appraisal.completed:${record.id}`, timestamp: record.createdAt },
  );
  if (record.destinationId === "library") {
    recordCampusEvent(
      "appraisal.catalogued",
      { appraisalId: record.id, objectId: record.objectId, destinationId: record.destinationId },
      { id: `appraisal.catalogued:${record.id}`, timestamp: record.createdAt },
    );
  }
  selectedRecordId = record.id;
  mode = "archive";
  message = "";
  navigateToDeepLink(`appraisal-record-${record.id}`);
  render({ preserveWindow: false });
  showToast(c.saved);
}

function openRetentionDialog() {
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  const assessment = assessAppraisal(selectedObjectId, appraisalDraft(selectedObjectId));
  const content = retentionDialog?.querySelector("[data-appraisal-retention-content]");
  if (!assessment || !content) return;
  content.innerHTML = `
    <p class="appraisal-retention-kicker">RED-PENCIL DESK · ${escapeHtml(assessment.object.code)}</p>
    <h2>${c.retentionTitle}</h2>
    <p>${c.retentionLead}</p>
    <div class="appraisal-retention-warning"><strong>${c.unsupported}</strong><span>${c.retentionWarning}</span></div>
    <label>${c.reviewer}
      <select name="reviewerId" required>
        <option value="">—</option>
        ${Object.entries(appraisalReviewers).map(([id, reviewer]) => `<option value="${id}">${escapeHtml(localized(reviewer.name, locale))} · ${escapeHtml(localized(reviewer.role, locale))}</option>`).join("")}
      </select>
    </label>
    <label>${c.reason}
      <textarea name="retentionReason" rows="4" maxlength="600" required placeholder="${escapeHtml(c.reasonPlaceholder)}"></textarea>
    </label>
    <label class="appraisal-retention-check"><input type="checkbox" name="confirmed" required><span>${c.confirm}</span></label>
    <p class="appraisal-retention-error" data-appraisal-retention-error role="alert"></p>
    <footer>
      <button class="button button-secondary" type="button" data-appraisal-retention-cancel>${c.cancel}</button>
      <button class="button button-primary" type="submit">${c.bind}</button>
    </footer>`;
  retentionDialog.showModal();
}

async function copyRecordLink(recordId) {
  const c = copy[getLocale()] || copy["zh-Hant"];
  const url = new URL(window.location.href);
  url.hash = `appraisal-record-${recordId}`;
  try {
    await navigator.clipboard.writeText(url.href);
  } catch {
    const field = document.createElement("textarea");
    field.value = url.href;
    document.body.append(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
  showToast(c.shared);
}

function bindControls() {
  app.querySelectorAll("[data-appraisal-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      mode = button.dataset.appraisalMode;
      selectedRecordId = null;
      message = "";
      render();
    });
  });
  app.querySelectorAll("[data-appraisal-object]").forEach((button) => {
    button.addEventListener("click", () => navigateToDeepLink(`appraisal-object-${button.dataset.appraisalObject}`));
  });
  app.querySelectorAll("[data-appraisal-evidence]").forEach((button) => {
    button.addEventListener("click", () => saveToggle("evidenceIds", button.dataset.appraisalEvidence));
  });
  app.querySelectorAll("[data-appraisal-hypothesis]").forEach((button) => {
    button.addEventListener("click", () => {
      saveAppraisalDraft(selectedObjectId, { hypothesisId: button.dataset.appraisalHypothesis });
      message = "";
      render();
    });
  });
  app.querySelectorAll("[data-appraisal-test]").forEach((button) => {
    button.addEventListener("click", () => {
      const draft = appraisalDraft(selectedObjectId);
      if (!draft.testIds.includes(button.dataset.appraisalTest) && draft.testIds.length >= 3) return;
      saveToggle("testIds", button.dataset.appraisalTest);
    });
  });
  app.querySelectorAll("[data-appraisal-destination]").forEach((button) => {
    button.addEventListener("click", () => {
      saveAppraisalDraft(selectedObjectId, { destinationId: button.dataset.appraisalDestination });
      message = "";
      render();
    });
  });
  app.querySelectorAll("[data-appraisal-field]").forEach((field) => {
    field.addEventListener("change", () => {
      saveAppraisalDraft(selectedObjectId, { [field.dataset.appraisalField]: field.value });
      message = "";
      render();
    });
  });
  const note = app.querySelector("[data-appraisal-note]");
  bindImeSafeInput(note, () => saveAppraisalDraft(selectedObjectId, { fieldNote: note.value }), { debounce: 180 });
  app.querySelector("[data-appraisal-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (note) saveAppraisalDraft(selectedObjectId, { fieldNote: note.value });
    completeOrdinary();
  });
  app.querySelector("[data-appraisal-clear]")?.addEventListener("click", () => {
    const c = copy[getLocale()] || copy["zh-Hant"];
    clearAppraisalDraft(selectedObjectId);
    message = c.cleared;
    render();
  });
  app.querySelectorAll("[data-appraisal-record]").forEach((button) => {
    button.addEventListener("click", () => navigateToDeepLink(`appraisal-record-${button.dataset.appraisalRecord}`));
  });
  app.querySelectorAll("[data-appraisal-continue], [data-appraisal-restart]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.appraisalContinue || button.dataset.appraisalRestart;
      navigateToDeepLink(`appraisal-object-${id}`);
    });
  });
  app.querySelectorAll("[data-appraisal-share]").forEach((button) => {
    button.addEventListener("click", () => copyRecordLink(button.dataset.appraisalShare));
  });
}

function bindRetentionDialog() {
  retentionDialog?.querySelector("[data-appraisal-retention-close]")?.addEventListener("click", () => retentionDialog.close());
  retentionDialog?.addEventListener("click", (event) => {
    if (event.target === retentionDialog) retentionDialog.close();
  });
  retentionForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const c = copy[getLocale()] || copy["zh-Hant"];
    const values = Object.fromEntries(new FormData(retentionForm).entries());
    const result = completeAppraisal(selectedObjectId, appraisalDraft(selectedObjectId), {
      disposition: "contested",
      reviewerId: values.reviewerId,
      retentionReason: values.retentionReason,
      confirmed: values.confirmed === "on",
    });
    if (!result.record) {
      const error = retentionForm.querySelector("[data-appraisal-retention-error]");
      if (error) error.textContent = c.retentionIncomplete;
      return;
    }
    retentionDialog.close();
    finishRecord(result.record, c);
  });
  retentionDialog?.addEventListener("click", (event) => {
    if (event.target.closest("[data-appraisal-retention-cancel]")) retentionDialog.close();
  });
}

function initialState() {
  const route = safeDecodeFragment();
  const recordId = route.startsWith("appraisal-record-") ? route.slice("appraisal-record-".length) : "";
  const objectId = route.startsWith("appraisal-object-") ? route.slice("appraisal-object-".length) : "";
  const desk = appraisalDeskStatus(getLocale());
  if (recordId && appraisalRecord(recordId)) {
    selectedRecordId = recordId;
    selectedObjectId = appraisalRecord(recordId).objectId;
    mode = "archive";
    return;
  }
  selectedObjectId = appraisalObject(objectId)?.id || desk.weeklyObject.id;
  mode = route === "appraisal-records" ? "archive" : "desk";
}

export function initAppraisal() {
  app = document.querySelector("[data-appraisal-app]");
  retentionDialog = document.querySelector("[data-appraisal-retention-dialog]");
  retentionForm = document.querySelector("[data-appraisal-retention-form]");
  if (!app) return;
  initialState();
  render({ preserveWindow: false });
  bindRetentionDialog();
  registerDeepLink("appraisal-object-", {
    anchor: (route) => document.getElementById(route) || app,
    position: "always",
    open(id) {
      const object = appraisalObject(id);
      if (!object) return;
      selectedObjectId = object.id;
      selectedRecordId = null;
      mode = "desk";
      message = "";
      render();
    },
    close() {},
  });
  registerDeepLink("appraisal-record-", {
    anchor: (route) => document.getElementById(route) || app,
    position: "always",
    open(id) {
      const record = appraisalRecord(id);
      if (!record) return;
      selectedRecordId = record.id;
      selectedObjectId = record.objectId;
      mode = "archive";
      message = "";
      render();
    },
    close() {},
  });
  window.addEventListener("tu:languagechange", () => render());
  clockTimer = window.setInterval(() => render(), 60_000);
  window.addEventListener("pagehide", () => window.clearInterval(clockTimer), { once: true });
}
