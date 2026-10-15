import { trees as catalogTrees } from "../generated/i18n/ui/ethics.js";
import {
  ethicsCase,
  ethicsCases,
  ethicsConsentPaths,
  ethicsDataKinds,
  ethicsDisclosureRules,
  ethicsLocalized,
  ethicsMethods,
  ethicsOutcomeLabels,
  ethicsReviewers,
  ethicsRiskBands,
  ethicsStanceLabels,
  ethicsTargets,
} from "../data/ethics.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import {
  assessEthicsProtocol,
  ethicsDraft,
  ethicsDraftFromCase,
  ethicsProtocol,
  ethicsProtocolDescription,
  ethicsProtocols,
  ethicsReviewForProtocol,
  ethicsStats,
  prepareEthicsRevision,
  resetEthicsDraft,
  saveEthicsDraft,
  submitEthicsProtocol,
  withdrawEthicsProtocol,
} from "./ethics-model.js";
import { getLocale } from "./i18n.js";
import { printDocument } from "./print-document.js";
import { renderPreservingState } from "./render-state.js";
import { siteHref } from "./site-router.js";
import { showToast } from "./ui.js";

let root;
let view = "board";
let selectedCaseId = ethicsCases[0].id;
let selectedProtocolId = null;
let currentDraft = null;
let previewAssessment = null;
let saveTimer = 0;

const copy = catalogTrees["copy"];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const localized = (value, locale) => ethicsLocalized(value, locale);

function formatDate(value, locale) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function selected(value, expected) {
  return value === expected ? "selected" : "";
}

function checked(value) {
  return value ? "checked" : "";
}

function currentRoute() {
  try {
    return decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return window.location.hash.slice(1);
  }
}

function statusLabel(protocol, c) {
  if (protocol.status === "withdrawn") return c.withdrawn;
  if (protocol.status === "superseded") return c.superseded;
  return c.active;
}

function outcomeLabel(outcome, locale) {
  return localized(ethicsOutcomeLabels[outcome], locale);
}

function stanceLabel(stance, locale) {
  return localized(ethicsStanceLabels[stance], locale);
}

function modeNav(c) {
  return `
    <nav class="ethics-mode-nav" aria-label="${escapeHtml(c.eyebrow)}">
      <a href="#ethics-board" class="${view === "board" ? "is-active" : ""}"><span>01</span>${escapeHtml(c.pageBoard)}</a>
      <a href="#ethics-case-${escapeHtml(selectedCaseId)}" class="${view === "form" ? "is-active" : ""}"><span>02</span>${escapeHtml(c.pageForm)}</a>
      <a href="#ethics-records" class="${["records", "protocol"].includes(view) ? "is-active" : ""}"><span>03</span>${escapeHtml(c.pageRecords)}</a>
    </nav>`;
}

function pageHero(locale, c) {
  const stats = ethicsStats();
  return `
    <header class="ethics-hero">
      <div>
        <p>${escapeHtml(c.eyebrow)}</p>
        <h2>${escapeHtml(c.title)}</h2>
        <span>${escapeHtml(c.lead)}</span>
      </div>
      <aside aria-label="${escapeHtml(c.reviewers)}">
        <b>五</b>
        <p>${escapeHtml(c.reviewers)}</p>
        <dl>
          <div><dt>${ethicsCases.length}</dt><dd>${escapeHtml(c.board)}</dd></div>
          <div><dt>${stats.protocols}</dt><dd>${escapeHtml(c.records)}</dd></div>
        </dl>
      </aside>
    </header>
    ${modeNav(c)}`;
}

function reviewerSeats(locale, c) {
  return `
    <section class="ethics-reviewer-section" aria-labelledby="ethics-reviewers-title">
      <header>
        <p>FIVE SEATS / NO AVERAGE</p>
        <h3 id="ethics-reviewers-title">${escapeHtml(c.reviewers)}</h3>
        <span>${escapeHtml(c.reviewersLead)}</span>
      </header>
      <div class="ethics-reviewer-ribbon" data-preserve-scroll="ethics-reviewers">
        ${ethicsReviewers.map((reviewer, index) => `
          <article>
            <i>${escapeHtml(reviewer.glyph)}</i>
            <small>0${index + 1} / ${escapeHtml(localized(reviewer.seat, locale))}</small>
            <h4>${escapeHtml(localized(reviewer.name, locale))}</h4>
            <p>${escapeHtml(localized(reviewer.question, locale))}</p>
          </article>`).join("")}
      </div>
    </section>`;
}

function relatedLinks(caseFile, locale, c) {
  return `
    <div class="ethics-related">
      <strong>${escapeHtml(c.related)}</strong>
      ${caseFile.relatedRoutes.map((route, index) => `
        <a href="${escapeHtml(siteHref(route))}">
          ${escapeHtml(index === 0 ? caseFile.code : `${caseFile.code} / ${String(index + 1).padStart(2, "0")}`)}
          <span aria-hidden="true">↗</span>
        </a>`).join("")}
    </div>`;
}

function caseCard(caseFile, locale, c) {
  return `
    <article class="ethics-case-card" id="ethics-case-card-${escapeHtml(caseFile.id)}">
      <header>
        <span>${escapeHtml(caseFile.code)}</span>
        <b>${escapeHtml(caseFile.mark)}</b>
      </header>
      <h4>${escapeHtml(localized(caseFile.title, locale))}</h4>
      <p>${escapeHtml(localized(caseFile.lede, locale))}</p>
      <blockquote>${escapeHtml(localized(caseFile.conflict, locale))}</blockquote>
      <footer>
        <small>${escapeHtml(c.expected)} · <strong data-outcome="${escapeHtml(caseFile.expectedOutcome)}">${escapeHtml(outcomeLabel(caseFile.expectedOutcome, locale))}</strong></small>
        <button type="button" data-ethics-case="${escapeHtml(caseFile.id)}">${escapeHtml(c.openCase)} <span aria-hidden="true">→</span></button>
      </footer>
    </article>`;
}

function boardView(locale, c) {
  return `
    <section class="ethics-case-shelf" aria-labelledby="ethics-cases-title">
      <header>
        <div><p>SPECIMEN FILES / 01—05</p><h3 id="ethics-cases-title">${escapeHtml(c.board)}</h3></div>
        <span>${escapeHtml(c.boardLead)}</span>
      </header>
      <div class="ethics-case-grid">${ethicsCases.map((caseFile) => caseCard(caseFile, locale, c)).join("")}</div>
    </section>
    ${reviewerSeats(locale, c)}
    <aside class="ethics-local-note">
      <span aria-hidden="true">端</span>
      <p>${escapeHtml(c.localOnly)}</p>
      <div><a href="records.html#data-cabinet">${escapeHtml(c.browseCabinet)} ↗</a><a href="mytu.html#my-tu">${escapeHtml(c.browseMyTu)} ↗</a></div>
    </aside>`;
}

function voices(caseFile, locale, c) {
  return `
    <div class="ethics-voices">
      <strong>${escapeHtml(c.voices)}</strong>
      ${caseFile.voices.map((voice) => `
        <blockquote>
          <p>${escapeHtml(localized(voice.statement, locale))}</p>
          <cite>— ${escapeHtml(localized(voice.speaker, locale))}</cite>
        </blockquote>`).join("")}
    </div>`;
}

function selectOptions(records, value, locale) {
  return records.map((record) => `
    <option value="${escapeHtml(record.id)}" ${selected(value, record.id)}>${escapeHtml(localized(record.label, locale))}</option>`).join("");
}

function draftFromForm(form) {
  const data = new FormData(form);
  return {
    ...currentDraft,
    caseId: selectedCaseId,
    title: data.get("title"),
    researcher: data.get("researcher"),
    targetId: data.get("targetId"),
    methodId: data.get("methodId"),
    disclosureId: data.get("disclosureId"),
    consentId: data.get("consentId"),
    riskId: data.get("riskId"),
    maxExposure: data.get("maxExposure"),
    dataIds: data.getAll("dataIds"),
    subjectCanStop: data.has("subjectCanStop"),
    independentMonitor: data.has("independentMonitor"),
    auditStub: data.has("auditStub"),
    objectAssent: data.has("objectAssent"),
    stopRule: data.get("stopRule"),
    controlPlan: data.get("controlPlan"),
    withdrawalPlan: data.get("withdrawalPlan"),
    deletionPlan: data.get("deletionPlan"),
    appealPlan: data.get("appealPlan"),
    rationale: data.get("rationale"),
  };
}

function formField(name, label, value, rows = 3) {
  return `
    <label class="ethics-field ethics-field-wide">
      <span>${escapeHtml(label)}</span>
      <textarea name="${escapeHtml(name)}" rows="${rows}" data-preserve-focus="ethics-${escapeHtml(name)}">${escapeHtml(value)}</textarea>
    </label>`;
}

function assessmentPanel(assessment, locale, c, { formal = false } = {}) {
  return `
    <section class="ethics-assessment ${formal ? "is-formal" : ""}" data-ethics-assessment>
      <header>
        <div><p>${formal ? "FORMAL RULING" : "PRE-REVIEW"}</p><h3>${escapeHtml(formal ? c.decision : c.previewTitle)}</h3></div>
        <strong data-outcome="${escapeHtml(assessment.outcome)}">${escapeHtml(outcomeLabel(assessment.outcome, locale))}</strong>
        <span>${escapeHtml(formal ? c.decisionNote : c.previewLead)}</span>
      </header>
      <div class="ethics-opinions">
        ${assessment.opinions.map((entry, index) => {
          const reviewer = ethicsReviewers.find(({ id }) => id === entry.reviewerId);
          return `
            <article data-stance="${escapeHtml(entry.stance)}">
              <header>
                <i>${escapeHtml(reviewer.glyph)}</i>
                <div><small>0${index + 1} · ${escapeHtml(localized(reviewer.seat, locale))}</small><h4>${escapeHtml(localized(reviewer.name, locale))}</h4></div>
                <b>${escapeHtml(stanceLabel(entry.stance, locale))}</b>
              </header>
              <p>${escapeHtml(localized(entry.statement, locale))}</p>
              <div>
                <strong>${escapeHtml(c.conditions)}</strong>
                ${entry.conditions.length
                  ? `<ul>${entry.conditions.map((condition) => `<li>${escapeHtml(localized(condition, locale))}</li>`).join("")}</ul>`
                  : `<span>${escapeHtml(c.noConditions)}</span>`}
              </div>
            </article>`;
        }).join("")}
      </div>
    </section>`;
}

function formView(locale, c) {
  const caseFile = ethicsCase(selectedCaseId) || ethicsCases[0];
  currentDraft ||= ethicsDraft(caseFile.id, locale);
  const draft = currentDraft;
  const assessment = previewAssessment || assessEthicsProtocol(draft, locale);
  return `
    <section class="ethics-submission" id="ethics-case-${escapeHtml(caseFile.id)}">
      <aside class="ethics-case-brief">
        <header><span>${escapeHtml(caseFile.code)}</span><b>${escapeHtml(caseFile.mark)}</b></header>
        <p>${escapeHtml(c.sourceCase)}</p>
        <h3>${escapeHtml(localized(caseFile.title, locale))}</h3>
        <blockquote>${escapeHtml(localized(caseFile.conflict, locale))}</blockquote>
        ${voices(caseFile, locale, c)}
        ${relatedLinks(caseFile, locale, c)}
      </aside>
      <form class="ethics-form" data-ethics-form>
        <header>
          <p>PROTOCOL / ${escapeHtml(caseFile.code)}</p>
          <h3>${escapeHtml(c.form)}</h3>
          ${draft.revisionOf ? `<span>${escapeHtml(c.revision)} · ${escapeHtml(draft.revisionOf)}</span>` : ""}
        </header>
        <div class="ethics-form-grid">
          <label class="ethics-field ethics-field-wide">
            <span>${escapeHtml(c.protocolTitle)}</span>
            <input name="title" value="${escapeHtml(draft.title)}" maxlength="140" required data-preserve-focus="ethics-title">
          </label>
          <label class="ethics-field ethics-field-wide">
            <span>${escapeHtml(c.researcher)}</span>
            <input name="researcher" value="${escapeHtml(draft.researcher)}" maxlength="80" data-preserve-focus="ethics-researcher">
          </label>
          <label class="ethics-field"><span>${escapeHtml(c.target)}</span><select name="targetId">${selectOptions(ethicsTargets, draft.targetId, locale)}</select></label>
          <label class="ethics-field"><span>${escapeHtml(c.method)}</span><select name="methodId">${selectOptions(ethicsMethods, draft.methodId, locale)}</select></label>
          <label class="ethics-field"><span>${escapeHtml(c.disclosure)}</span><select name="disclosureId">${selectOptions(ethicsDisclosureRules, draft.disclosureId, locale)}</select></label>
          <label class="ethics-field"><span>${escapeHtml(c.consent)}</span><select name="consentId">${selectOptions(ethicsConsentPaths, draft.consentId, locale)}</select></label>
          <label class="ethics-field"><span>${escapeHtml(c.risk)}</span><select name="riskId">${selectOptions(ethicsRiskBands, draft.riskId, locale)}</select></label>
          <label class="ethics-field"><span>${escapeHtml(c.exposure)}</span><input type="number" name="maxExposure" value="${escapeHtml(draft.maxExposure)}" min="0" max="720"></label>
        </div>
        <fieldset class="ethics-check-grid">
          <legend>${escapeHtml(c.data)}</legend>
          ${ethicsDataKinds.map((kind) => `
            <label><input type="checkbox" name="dataIds" value="${escapeHtml(kind.id)}" ${checked(draft.dataIds.includes(kind.id))}><span>${escapeHtml(localized(kind.label, locale))}</span></label>`).join("")}
        </fieldset>
        <fieldset class="ethics-safeguards">
          <legend>${escapeHtml(c.safeguards)}</legend>
          <label><input type="checkbox" name="subjectCanStop" ${checked(draft.subjectCanStop)}><span>${escapeHtml(c.subjectStop)}</span></label>
          <label><input type="checkbox" name="independentMonitor" ${checked(draft.independentMonitor)}><span>${escapeHtml(c.independent)}</span></label>
          <label><input type="checkbox" name="auditStub" ${checked(draft.auditStub)}><span>${escapeHtml(c.audit)}</span></label>
          <label><input type="checkbox" name="objectAssent" ${checked(draft.objectAssent)}><span>${escapeHtml(c.assent)}</span></label>
        </fieldset>
        <div class="ethics-form-grid">
          ${formField("stopRule", c.stopRule, draft.stopRule)}
          ${formField("controlPlan", c.controlPlan, draft.controlPlan)}
          ${formField("withdrawalPlan", c.withdrawalPlan, draft.withdrawalPlan)}
          ${formField("deletionPlan", c.deletionPlan, draft.deletionPlan)}
          ${formField("appealPlan", c.appealPlan, draft.appealPlan)}
          ${formField("rationale", c.rationale, draft.rationale, 4)}
        </div>
        <footer class="ethics-form-actions">
          <button type="button" class="button" data-ethics-reset>${escapeHtml(c.reset)}</button>
          <button type="button" class="button" data-ethics-save>${escapeHtml(c.save)}</button>
          <button type="button" class="button" data-ethics-preview>${escapeHtml(c.preview)}</button>
          <button type="submit" class="button button-primary">${escapeHtml(c.submit)} <span aria-hidden="true">→</span></button>
        </footer>
      </form>
    </section>
    ${assessmentPanel(assessment, locale, c)}`;
}

function protocolSummary(protocol, locale, c) {
  const description = ethicsProtocolDescription(protocol, locale);
  const draft = protocol.draft;
  const dataLabels = draft.dataIds.map((id) => ethicsDataKinds.find((entry) => entry.id === id))
    .filter(Boolean)
    .map((entry) => localized(entry.label, locale));
  return `
    <section class="ethics-protocol-summary">
      <header><p>${escapeHtml(c.plan)}</p><h3>${escapeHtml(draft.title)}</h3>${draft.researcher ? `<span>${escapeHtml(draft.researcher)}</span>` : ""}</header>
      <dl>
        <div><dt>${escapeHtml(c.target)}</dt><dd>${escapeHtml(localized(description.target?.label, locale))}</dd></div>
        <div><dt>${escapeHtml(c.method)}</dt><dd>${escapeHtml(localized(description.method?.label, locale))}</dd></div>
        <div><dt>${escapeHtml(c.disclosure)}</dt><dd>${escapeHtml(localized(description.disclosure?.label, locale))}</dd></div>
        <div><dt>${escapeHtml(c.consent)}</dt><dd>${escapeHtml(localized(description.consent?.label, locale))}</dd></div>
        <div><dt>${escapeHtml(c.risk)}</dt><dd>${escapeHtml(localized(description.risk?.label, locale))}</dd></div>
        <div><dt>${escapeHtml(c.exposure)}</dt><dd>${escapeHtml(draft.maxExposure)}</dd></div>
        <div class="is-wide"><dt>${escapeHtml(c.data)}</dt><dd>${escapeHtml(dataLabels.join(" · ") || "—")}</dd></div>
      </dl>
      <div class="ethics-plan-pages">
        <article><strong>${escapeHtml(c.stopRule)}</strong><p>${escapeHtml(draft.stopRule)}</p></article>
        <article><strong>${escapeHtml(c.controlPlan)}</strong><p>${escapeHtml(draft.controlPlan)}</p></article>
        <article><strong>${escapeHtml(c.withdrawalPlan)}</strong><p>${escapeHtml(draft.withdrawalPlan)}</p></article>
        <article><strong>${escapeHtml(c.deletionPlan)}</strong><p>${escapeHtml(draft.deletionPlan)}</p></article>
        <article><strong>${escapeHtml(c.appealPlan)}</strong><p>${escapeHtml(draft.appealPlan)}</p></article>
        <article><strong>${escapeHtml(c.rationale)}</strong><p>${escapeHtml(draft.rationale)}</p></article>
      </div>
    </section>`;
}

function protocolAssessment(protocol) {
  const review = ethicsReviewForProtocol(protocol.id);
  return {
    draft: protocol.draft,
    outcome: protocol.status === "withdrawn" ? "withdrawn" : protocol.outcome,
    opinions: review?.opinions || [],
  };
}

function versionChain(protocol, locale, c) {
  const versions = ethicsProtocols()
    .filter(({ rootProtocolId }) => rootProtocolId === protocol.rootProtocolId)
    .sort((a, b) => a.revision - b.revision);
  return `
    <section class="ethics-version-chain">
      <h3>${escapeHtml(c.versionChain)}</h3>
      <ol>
        ${versions.map((version) => `
          <li class="${version.id === protocol.id ? "is-current" : ""}">
            <a href="#ethics-protocol-${escapeHtml(version.id)}">
              <span>v${escapeHtml(version.revision)}</span>
              <strong>${escapeHtml(version.draft.title)}</strong>
              <small>${escapeHtml(statusLabel(version, c))} · ${escapeHtml(outcomeLabel(version.status === "withdrawn" ? "withdrawn" : version.outcome, locale))}</small>
            </a>
          </li>`).join("")}
      </ol>
    </section>`;
}

function protocolView(locale, c) {
  const protocol = ethicsProtocol(selectedProtocolId);
  if (!protocol) {
    view = "records";
    return recordsView(locale, c);
  }
  const caseFile = ethicsCase(protocol.draft.caseId);
  const assessment = protocolAssessment(protocol);
  return `
    <article class="ethics-protocol-file" id="ethics-protocol-${escapeHtml(protocol.id)}" data-ethics-protocol-file>
      <header class="ethics-protocol-heading">
        <div>
          <p>${escapeHtml(c.protocol)} · ${escapeHtml(caseFile?.code || "")}</p>
          <h3>${escapeHtml(protocol.id)}</h3>
          <span>${escapeHtml(c.submittedAt)} · ${escapeHtml(formatDate(protocol.createdAt, locale))}</span>
        </div>
        <div class="ethics-file-stamps">
          <b data-outcome="${escapeHtml(protocol.status === "withdrawn" ? "withdrawn" : protocol.outcome)}">${escapeHtml(outcomeLabel(protocol.status === "withdrawn" ? "withdrawn" : protocol.outcome, locale))}</b>
          <i>v${escapeHtml(protocol.revision)}</i>
        </div>
      </header>
      <div class="ethics-file-meta">
        <span>${escapeHtml(c.status)} · <strong>${escapeHtml(statusLabel(protocol, c))}</strong></span>
        <span>${escapeHtml(c.originalCase)} · <a href="#ethics-case-${escapeHtml(caseFile?.id || selectedCaseId)}">${escapeHtml(localized(caseFile?.shortTitle, locale))}</a></span>
      </div>
      ${protocolSummary(protocol, locale, c)}
      ${assessmentPanel(assessment, locale, c, { formal: true })}
      ${protocol.withdrawalReason ? `<blockquote class="ethics-withdrawal-note"><strong>${escapeHtml(c.withdrawReason)}</strong><p>${escapeHtml(protocol.withdrawalReason)}</p></blockquote>` : ""}
      <footer class="ethics-protocol-actions" data-print-exclude>
        <button type="button" class="button" data-ethics-share>${escapeHtml(c.share)}</button>
        <button type="button" class="button" data-ethics-print="${escapeHtml(protocol.id)}">${escapeHtml(c.print)}</button>
        ${protocol.status === "active" ? `<button type="button" class="button button-primary" data-ethics-revise="${escapeHtml(protocol.id)}">${escapeHtml(c.revise)} <span aria-hidden="true">→</span></button>` : ""}
      </footer>
      ${protocol.status === "active" ? `
        <details class="ethics-withdraw-panel" data-print-exclude>
          <summary>${escapeHtml(c.withdraw)}</summary>
          <form data-ethics-withdraw-form="${escapeHtml(protocol.id)}">
            <label><span>${escapeHtml(c.withdrawReason)}</span><textarea name="reason" rows="3" required></textarea></label>
            <label><input type="checkbox" name="confirm" required><span>${escapeHtml(c.confirmWithdraw)}</span></label>
            <button class="button" type="submit">${escapeHtml(c.withdrawAction)}</button>
          </form>
        </details>` : ""}
    </article>
    ${versionChain(protocol, locale, c)}`;
}

function recordsView(locale, c) {
  const protocols = ethicsProtocols().slice().reverse();
  return `
    <section class="ethics-records" id="ethics-records">
      <header>
        <div><p>ON-DEVICE ETHICS FILES</p><h3>${escapeHtml(c.records)}</h3></div>
        <span>${escapeHtml(c.localOnly)}</span>
      </header>
      ${protocols.length ? `
        <div class="ethics-record-list">
          ${protocols.map((protocol) => `
            <article data-status="${escapeHtml(protocol.status)}">
              <div>
                <small>${escapeHtml(protocol.id)} · v${escapeHtml(protocol.revision)}</small>
                <h4>${escapeHtml(protocol.draft.title)}</h4>
                <p>${escapeHtml(formatDate(protocol.createdAt, locale))} · ${escapeHtml(statusLabel(protocol, c))}</p>
              </div>
              <strong data-outcome="${escapeHtml(protocol.status === "withdrawn" ? "withdrawn" : protocol.outcome)}">${escapeHtml(outcomeLabel(protocol.status === "withdrawn" ? "withdrawn" : protocol.outcome, locale))}</strong>
              <a href="#ethics-protocol-${escapeHtml(protocol.id)}">${escapeHtml(c.openProtocol)} <span aria-hidden="true">→</span></a>
            </article>`).join("")}
        </div>` : `<div class="ethics-empty"><span aria-hidden="true">白</span><p>${escapeHtml(c.noRecords)}</p></div>`}
      <footer><a href="records.html#data-cabinet">${escapeHtml(c.browseCabinet)} ↗</a><a href="mytu.html#my-tu">${escapeHtml(c.browseMyTu)} ↗</a></footer>
    </section>`;
}

function printableProtocol(protocol, locale, c) {
  const wrapper = document.createElement("article");
  wrapper.className = "ethics-print-document";
  const caseFile = ethicsCase(protocol.draft.caseId);
  wrapper.innerHTML = `
    <header>
      <p>TOUHOU UNIVERSITY · GENSOKYO RESEARCH ETHICS REVIEW BOARD</p>
      <h1>${escapeHtml(c.documentTitle)}</h1>
      <strong>${escapeHtml(protocol.id)} · v${escapeHtml(protocol.revision)}</strong>
    </header>
    <section>
      <dl>
        <div><dt>${escapeHtml(c.originalCase)}</dt><dd>${escapeHtml(localized(caseFile?.title, locale))}</dd></div>
        <div><dt>${escapeHtml(c.submittedAt)}</dt><dd>${escapeHtml(formatDate(protocol.createdAt, locale))}</dd></div>
        <div><dt>${escapeHtml(c.status)}</dt><dd>${escapeHtml(statusLabel(protocol, c))}</dd></div>
        <div><dt>${escapeHtml(c.decision)}</dt><dd>${escapeHtml(outcomeLabel(protocol.status === "withdrawn" ? "withdrawn" : protocol.outcome, locale))}</dd></div>
      </dl>
    </section>
    ${protocolSummary(protocol, locale, c)}
    ${assessmentPanel(protocolAssessment(protocol), locale, c, { formal: true })}
    ${protocol.withdrawalReason ? `<blockquote><strong>${escapeHtml(c.withdrawReason)}</strong><p>${escapeHtml(protocol.withdrawalReason)}</p></blockquote>` : ""}
    <footer><p>${escapeHtml(c.documentNotice)}</p><span>${escapeHtml(protocol.reviewId)}</span></footer>`;
  return wrapper;
}

function render({ preserveWindow = true } = {}) {
  if (!root) return;
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  renderPreservingState(root, () => {
    const content = view === "form"
      ? formView(locale, c)
      : view === "records"
        ? recordsView(locale, c)
        : view === "protocol"
          ? protocolView(locale, c)
          : boardView(locale, c);
    root.innerHTML = `${pageHero(locale, c)}<div class="ethics-body">${content}</div>`;
  }, { preserveWindow });
}

function showCase(caseId, { navigate = true } = {}) {
  const caseFile = ethicsCase(caseId);
  if (!caseFile) return;
  selectedCaseId = caseFile.id;
  selectedProtocolId = null;
  currentDraft = ethicsDraft(caseFile.id, getLocale());
  previewAssessment = null;
  view = "form";
  render({ preserveWindow: false });
  if (navigate) navigateToDeepLink(`ethics-case-${caseFile.id}`);
}

function showProtocol(protocolId, { navigate = true } = {}) {
  const protocol = ethicsProtocol(protocolId);
  if (!protocol) return;
  selectedProtocolId = protocol.id;
  selectedCaseId = protocol.draft.caseId;
  view = "protocol";
  render({ preserveWindow: false });
  if (navigate) navigateToDeepLink(`ethics-protocol-${protocol.id}`);
}

function recordProtocolEvents(protocol, review) {
  const payload = {
    protocolId: protocol.id,
    rootProtocolId: protocol.rootProtocolId,
    caseId: protocol.draft.caseId,
    revisionOf: protocol.revisionOf,
    outcome: protocol.outcome,
  };
  if (protocol.revisionOf) {
    recordCampusEvent("ethics.protocol.amended", payload, {
      id: `ethics.protocol.amended:${protocol.id}`,
      timestamp: protocol.createdAt,
    });
  } else {
    recordCampusEvent("ethics.protocol.submitted", payload, {
      id: `ethics.protocol.submitted:${protocol.id}`,
      timestamp: protocol.createdAt,
    });
  }
  recordCampusEvent("ethics.review.completed", {
    protocolId: protocol.id,
    rootProtocolId: protocol.rootProtocolId,
    reviewId: review.id,
    caseId: protocol.draft.caseId,
    outcome: review.outcome,
    reviewerIds: review.opinions.map(({ reviewerId }) => reviewerId),
  }, {
    id: `ethics.review.completed:${review.id}`,
    timestamp: review.createdAt,
  });
}

async function copyLink(c) {
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch {
    const field = document.createElement("input");
    field.value = window.location.href;
    document.body.append(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
  showToast(c.shared);
}

function bindEvents() {
  root.addEventListener("input", (event) => {
    const form = event.target.closest("[data-ethics-form]");
    if (!form) return;
    window.clearTimeout(saveTimer);
    currentDraft = draftFromForm(form);
    previewAssessment = null;
    saveTimer = window.setTimeout(() => {
      currentDraft = saveEthicsDraft(currentDraft, getLocale());
    }, 320);
  });

  root.addEventListener("click", async (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    const caseButton = event.target.closest("[data-ethics-case]");
    if (caseButton) {
      showCase(caseButton.dataset.ethicsCase);
      return;
    }
    if (event.target.closest("[data-ethics-save]")) {
      const form = root.querySelector("[data-ethics-form]");
      if (!form) return;
      currentDraft = saveEthicsDraft(draftFromForm(form), locale);
      showToast(c.saved);
      return;
    }
    if (event.target.closest("[data-ethics-reset]")) {
      currentDraft = resetEthicsDraft(selectedCaseId, locale);
      previewAssessment = assessEthicsProtocol(currentDraft, locale);
      render();
      return;
    }
    if (event.target.closest("[data-ethics-preview]")) {
      const form = root.querySelector("[data-ethics-form]");
      if (!form) return;
      currentDraft = saveEthicsDraft(draftFromForm(form), locale);
      previewAssessment = assessEthicsProtocol(currentDraft, locale);
      render();
      root.querySelector("[data-ethics-assessment]")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const revise = event.target.closest("[data-ethics-revise]");
    if (revise) {
      const draft = prepareEthicsRevision(revise.dataset.ethicsRevise, locale);
      if (!draft) return;
      currentDraft = draft;
      previewAssessment = assessEthicsProtocol(draft, locale);
      selectedCaseId = draft.caseId;
      view = "form";
      navigateToDeepLink(`ethics-case-${draft.caseId}`);
      return;
    }
    const print = event.target.closest("[data-ethics-print]");
    if (print) {
      const protocol = ethicsProtocol(print.dataset.ethicsPrint);
      const documentBody = protocol ? printableProtocol(protocol, locale, c) : null;
      if (documentBody) printDocument(documentBody, { title: `${protocol.id} · ${c.documentTitle}` });
      return;
    }
    if (event.target.closest("[data-ethics-share]")) await copyLink(c);
  });

  root.addEventListener("submit", (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    const protocolForm = event.target.closest("[data-ethics-form]");
    if (protocolForm) {
      event.preventDefault();
      window.clearTimeout(saveTimer);
      currentDraft = saveEthicsDraft(draftFromForm(protocolForm), locale);
      const result = submitEthicsProtocol(currentDraft, new Date(), locale);
      if (result.error) {
        showToast(c.required);
        protocolForm.elements.title?.focus();
        return;
      }
      recordProtocolEvents(result.protocol, result.review);
      selectedProtocolId = result.protocol.id;
      selectedCaseId = result.protocol.draft.caseId;
      view = "protocol";
      previewAssessment = null;
      navigateToDeepLink(`ethics-protocol-${result.protocol.id}`);
      showToast(result.protocol.revisionOf ? c.amended : c.committeeFiled);
      return;
    }
    const withdrawForm = event.target.closest("[data-ethics-withdraw-form]");
    if (withdrawForm) {
      event.preventDefault();
      if (!withdrawForm.reportValidity()) return;
      const protocol = withdrawEthicsProtocol(
        withdrawForm.dataset.ethicsWithdrawForm,
        new FormData(withdrawForm).get("reason"),
        new Date(),
      );
      if (!protocol) return;
      recordCampusEvent("ethics.protocol.withdrawn", {
        protocolId: protocol.id,
        rootProtocolId: protocol.rootProtocolId,
        caseId: protocol.draft.caseId,
        reason: protocol.withdrawalReason,
      }, {
        id: `ethics.protocol.withdrawn:${protocol.id}`,
        timestamp: protocol.withdrawnAt,
      });
      render();
      showToast(c.withdrawnToast);
    }
  });
}

function initialView() {
  const route = currentRoute();
  if (route.startsWith("ethics-case-")) {
    const caseId = route.slice("ethics-case-".length);
    if (ethicsCase(caseId)) {
      selectedCaseId = caseId;
      currentDraft = ethicsDraft(caseId, getLocale());
      view = "form";
      return;
    }
  }
  if (route.startsWith("ethics-protocol-")) {
    const protocol = ethicsProtocol(route.slice("ethics-protocol-".length));
    if (protocol) {
      selectedProtocolId = protocol.id;
      selectedCaseId = protocol.draft.caseId;
      view = "protocol";
      return;
    }
  }
  if (route === "ethics-records") view = "records";
}

export function initEthics() {
  root = document.querySelector("[data-ethics-app]");
  if (!root) return;
  initialView();
  render({ preserveWindow: false });
  bindEvents();

  registerDeepLink("ethics-board", {
    anchor: "#ethics-board",
    position: "always",
    open() {
      view = "board";
      selectedProtocolId = null;
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("ethics-records", {
    anchor: () => document.getElementById("ethics-records") || root,
    position: "always",
    open() {
      view = "records";
      selectedProtocolId = null;
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("ethics-case-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "ethics-review-focus",
    position: "always",
    open(id) {
      if (!ethicsCase(id)) return;
      selectedCaseId = id;
      selectedProtocolId = null;
      currentDraft = ethicsDraft(id, getLocale());
      previewAssessment = null;
      view = "form";
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("ethics-protocol-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "ethics-review-focus",
    position: "always",
    open(id) {
      const protocol = ethicsProtocol(id);
      if (!protocol) return;
      selectedProtocolId = protocol.id;
      selectedCaseId = protocol.draft.caseId;
      view = "protocol";
      render({ preserveWindow: false });
    },
  });
  window.addEventListener("tu:languagechange", () => {
    if (view === "form" && currentDraft) currentDraft = saveEthicsDraft(currentDraft, getLocale());
    render();
  });
}
