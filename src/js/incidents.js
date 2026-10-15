import { trees as catalogTrees } from "../generated/i18n/ui/incidents.js";
import {
  evidenceKinds,
  incidentById,
  incidentCases,
  incidentRetentionReasons,
  incidentRetentionReviewers,
  incidentSeverity,
} from "../data/incidents.js";
import { ethicsCasesForIncident, ethicsLocalized } from "../data/ethics.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { getLocale } from "./i18n.js";
import {
  incidentCaseState,
  incidentCommunityPosts,
  incidentExperiments,
  incidentResolutions,
  resolutionForCase,
  resolveIncident,
  runIncidentExperiment,
  selectIncidentHypothesis,
  toggleIncidentAction,
  toggleIncidentEvidence,
  toggleIncidentTestimony,
} from "./incident-model.js";
import { renderPreservingState } from "./render-state.js";
import { siteHref } from "./site-router.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

const LAST_CASE_KEY = "tu:incidents:last-case";

const copy = catalogTrees["copy"];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function localized(value, locale) {
  return value?.[locale] ?? value?.["zh-Hant"] ?? value ?? "";
}

function formatDate(value, locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function currentRoute() {
  return safeDecodeFragment();
}

function viewForRoute(route) {
  if (route === "incident-simulator") return "simulator";
  if (route === "incident-records" || route.startsWith("incident-experiment-")) return "records";
  return "cases";
}

function caseFromRoute(route) {
  if (!route.startsWith("incident-case-")) return null;
  const id = route.slice("incident-case-".length);
  return incidentById(id) ? id : null;
}

function severityLabel(incident, locale) {
  return localized(incidentSeverity[incident.severity], locale);
}

function pageHero(locale, c, activeView) {
  const resolutions = incidentResolutions();
  const resolvedIds = new Set(resolutions.map((record) => record.caseId));
  const active = incidentCases.length - resolvedIds.size;
  return `
    <div class="incident-hero">
      <div class="incident-hero-mark" aria-hidden="true">
        <span>異</span><i></i><i></i><i></i><i></i>
        <b>CASE<br>DESK</b>
      </div>
      <div class="incident-hero-copy">
        <p>${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
        <dl>
          <div><dt>${c.live}</dt><dd>${active}</dd></div>
          <div><dt>${c.resolved}</dt><dd>${resolvedIds.size}</dd></div>
          <div><dt>${c.experiments}</dt><dd>${incidentExperiments().length}</dd></div>
        </dl>
      </div>
    </div>
    <nav class="incident-tabs" aria-label="${escapeHtml(c.eyebrow)}">
      <a href="#incident-center" ${activeView === "cases" ? 'aria-current="page"' : ""}><span>01</span>${c.cases}</a>
      <a href="#incident-simulator" ${activeView === "simulator" ? 'aria-current="page"' : ""}><span>02</span>${c.simulator}</a>
      <a href="#incident-records" ${activeView === "records" ? 'aria-current="page"' : ""}><span>03</span>${c.records}</a>
    </nav>`;
}

function caseList(locale, c, selectedId) {
  return `
    <aside class="incident-case-list" data-preserve-scroll="incident-cases">
      <header><span>OPEN CASE INDEX</span><b>${String(incidentCases.length).padStart(2, "0")}</b></header>
      ${incidentCases.map((incident) => {
        const state = incidentCaseState(incident.id);
        const resolved = resolutionForCase(incident.id);
        const reviewed = state.reviewedEvidence.length + state.reviewedTestimony.length;
        return `
          <button type="button" data-incident-case="${incident.id}" class="${incident.id === selectedId ? "active" : ""}" aria-pressed="${incident.id === selectedId}">
            <i data-severity="${incident.severity}">${escapeHtml(incident.mark)}</i>
            <span><small>${escapeHtml(incident.code)} · ${resolved ? c.resolved : severityLabel(incident, locale)}</small><strong>${escapeHtml(localized(incident.title, locale))}</strong><em>${reviewed}/7 ${c.reviewed}</em></span>
            <b aria-hidden="true">→</b>
          </button>`;
      }).join("")}
    </aside>`;
}

function evidenceCards(incident, state, locale, c) {
  return incident.evidence.map((item) => {
    const reviewed = state.reviewedEvidence.includes(item.id);
    return `
      <article class="incident-evidence-card ${reviewed ? "reviewed" : ""}">
        <header>
          <span>${escapeHtml(localized(evidenceKinds[item.kind], locale))}</span>
          <b>${item.reliability}%</b>
        </header>
        <h5>${escapeHtml(localized(item.title, locale))}</h5>
        <p>${escapeHtml(localized(item.body, locale))}</p>
        <footer>
          <small>${c.source} · ${escapeHtml(localized(item.source, locale))}</small>
          <button type="button" data-incident-evidence="${item.id}" aria-pressed="${reviewed}">
            ${reviewed ? `✓ ${c.reviewed}` : c.markReviewed}
          </button>
        </footer>
      </article>`;
  }).join("");
}

function testimonyCards(incident, state, locale, c) {
  return incident.testimony.map((item) => {
    const reviewed = state.reviewedTestimony.includes(item.id);
    return `
      <article class="incident-testimony-card ${reviewed ? "reviewed" : ""}">
        <header><div><strong>${escapeHtml(localized(item.speaker, locale))}</strong><span>${escapeHtml(localized(item.role, locale))}</span></div><button type="button" data-incident-testimony="${item.id}" aria-pressed="${reviewed}">${reviewed ? "✓" : "+"}</button></header>
        <blockquote>「${escapeHtml(localized(item.statement, locale))}」</blockquote>
        <p><b>${c.tension}</b>${escapeHtml(localized(item.tension, locale))}</p>
      </article>`;
  }).join("");
}

function hypothesisCards(incident, state, locale, c) {
  return incident.hypotheses.map((item, index) => {
    const selected = state.selectedHypothesis === item.id;
    return `
      <button type="button" class="${selected ? "selected" : ""}" data-incident-hypothesis="${item.id}" aria-pressed="${selected}">
        <span>H${index + 1}</span>
        <div><strong>${escapeHtml(localized(item.title, locale))}</strong><p>${escapeHtml(localized(item.rationale, locale))}</p></div>
        <i>${selected ? "●" : "○"}</i>
      </button>`;
  }).join("");
}

function actionCards(incident, state, locale, c) {
  return incident.actions.map((item, index) => {
    const selected = state.selectedActions.includes(item.id);
    return `
      <button type="button" class="${selected ? "selected" : ""}" data-incident-action="${item.id}" aria-pressed="${selected}">
        <span>A${index + 1}</span>
        <div>
          <header><strong>${escapeHtml(localized(item.title, locale))}</strong><em>${c.reversible}</em></header>
          <p>${escapeHtml(localized(item.body, locale))}</p>
          <small><b>${c.caution}</b>${escapeHtml(localized(item.caution, locale))}</small>
        </div>
        <i>${selected ? "✓" : "+"}</i>
      </button>`;
  }).join("");
}

function ethicsReferences(incident, locale, c) {
  const cases = ethicsCasesForIncident(incident.id);
  if (!cases.length) return "";
  return `
    <aside class="incident-ethics-reference">
      <div>
        <strong>${escapeHtml(c.ethicsReference)}</strong>
        <p>${escapeHtml(c.ethicsReferenceLead)}</p>
      </div>
      <ul>
        ${cases.map((caseFile) => `
          <li>
            <a href="${escapeHtml(siteHref(`ethics-case-${caseFile.id}`))}">
              <span>${escapeHtml(caseFile.code)}</span>
              <b>${escapeHtml(ethicsLocalized(caseFile.shortTitle, locale))}</b>
              <i>${escapeHtml(c.openEthics)} ↗</i>
            </a>
          </li>`).join("")}
      </ul>
    </aside>`;
}

function renderCases(locale, c, selectedId) {
  const incident = incidentById(selectedId) || incidentCases[0];
  const state = incidentCaseState(incident.id);
  const resolved = resolutionForCase(incident.id);
  return `
    <div class="incident-workspace" id="incident-case-${incident.id}">
      ${caseList(locale, c, incident.id)}
      <article class="incident-case-file">
        <header class="incident-file-heading">
          <div>
            <p><span data-severity="${incident.severity}"></span>${escapeHtml(incident.code)} · ${escapeHtml(severityLabel(incident, locale))}</p>
            <h3>${escapeHtml(localized(incident.title, locale))}</h3>
            <span>${escapeHtml(localized(incident.lede, locale))}</span>
          </div>
          <b>${escapeHtml(incident.mark)}</b>
        </header>
        <div class="incident-dispatch">
          <strong>${c.dispatch}</strong>
          <p>${escapeHtml(localized(incident.dispatch, locale))}</p>
          <dl>
            <div><dt>${c.affected}</dt><dd>${escapeHtml(localized(incident.affected, locale))}</dd></div>
            <div><dt>${c.measure}</dt><dd>${escapeHtml(localized(incident.signal, locale))} · ${escapeHtml(localized(incident.unit, locale))}</dd></div>
          </dl>
        </div>
        ${ethicsReferences(incident, locale, c)}
        <section class="incident-dossier">
          <header><div><p>01 / MATERIALS</p><h4>${c.evidence}</h4></div><span>${c.evidenceLead}</span></header>
          <div class="incident-evidence-grid">${evidenceCards(incident, state, locale, c)}</div>
        </section>
        <section class="incident-dossier">
          <header><div><p>02 / TESTIMONY</p><h4>${c.testimony}</h4></div><span>${c.testimonyLead}</span></header>
          <div class="incident-testimony-grid">${testimonyCards(incident, state, locale, c)}</div>
        </section>
        <section class="incident-decision">
          <header><div><p>03 / FALSIFIABLE CLAIM</p><h4>${c.hypothesis}</h4></div><span>${c.hypothesisLead}</span></header>
          <div class="incident-hypotheses">${hypothesisCards(incident, state, locale, c)}</div>
        </section>
        <section class="incident-decision">
          <header><div><p>04 / FIRST RESPONSE</p><h4>${c.response}</h4></div><span>${c.responseLead}</span></header>
          <div class="incident-actions">${actionCards(incident, state, locale, c)}</div>
        </section>
        <footer class="incident-case-footer">
          <div>
            <span>${c.readiness}</span>
            <strong>${state.reviewedEvidence.length}/4 ${c.reviewedEvidence} · ${state.reviewedTestimony.length}/3 ${c.reviewedWitnesses}</strong>
          </div>
          ${resolved
            ? `<a class="button button-primary" href="#incident-records">${c.resolvedAlready} <span aria-hidden="true">→</span></a>`
            : `<button class="button button-primary" type="button" data-incident-open-lab ${state.selectedHypothesis ? "" : "disabled"}>${state.selectedHypothesis ? c.openLab : c.chooseHypothesis} <span aria-hidden="true">→</span></button>`}
        </footer>
      </article>
    </div>`;
}

function designCheckbox(name, label, checked = false) {
  return `<label><input type="checkbox" name="${name}" ${checked ? "checked" : ""}><span><i aria-hidden="true">✓</i>${label}</span></label>`;
}

function retentionReviewerId(verdict) {
  return {
    rejects: "marisa",
    inconclusive: "yukari",
    "false-confidence": "aya",
  }[verdict] || "keine";
}

function retentionDialog(experiment, incident, locale, c) {
  if (!experiment || (experiment.quality >= 60 && experiment.verdict === "supports")) return "";
  const reviewerId = retentionReviewerId(experiment.verdict);
  const reviewer = incidentRetentionReviewers[reviewerId];
  const hypothesis = incident.hypotheses.find((item) => item.id === experiment.hypothesisId);
  return `
    <dialog class="incident-retention-dialog" data-incident-retention-dialog>
      <form data-incident-retention-form>
        <input type="hidden" name="experimentId" value="${escapeHtml(experiment.id)}">
        <input type="hidden" name="reviewerId" value="${escapeHtml(reviewerId)}">
        <header>
          <div><span>RED-THREAD REVIEW / 異説保存</span><h3>${c.retentionTitle}</h3></div>
          <button type="button" data-retention-cancel aria-label="${escapeHtml(c.cancelRetention)}">×</button>
        </header>
        <p class="incident-retention-lead">${c.retentionLead}</p>
        <div class="incident-retention-result">
          <span>${c.originalResult}</span>
          <strong>${escapeHtml(c.verdicts[experiment.verdict])}</strong>
          <p>${c.unsupportedFinding} · ${escapeHtml(localized(hypothesis?.title, locale))}</p>
          <b>${experiment.quality}<small>/100</small></b>
        </div>
        <aside>${c.retentionWarning}</aside>
        <section class="incident-retention-reviewer">
          <span>${c.reviewer}</span>
          <div>
            <b>${escapeHtml(localized(reviewer.name, locale))}</b>
            <small>${escapeHtml(localized(reviewer.role, locale))}</small>
          </div>
          <p>「${escapeHtml(localized(reviewer.note, locale))}」</p>
        </section>
        <label class="incident-retention-reason">${c.retentionReason}
          <select name="retentionReason" required>
            <option value="">—</option>
            ${Object.entries(incidentRetentionReasons).map(([id, label]) => `<option value="${escapeHtml(id)}">${escapeHtml(localized(label, locale))}</option>`).join("")}
          </select>
        </label>
        <label class="incident-retention-confirm">
          <input type="checkbox" name="confirmation" required>
          <span><i aria-hidden="true">✓</i>${c.retentionConfirm}</span>
        </label>
        <footer>
          <button class="button" type="button" data-retention-cancel>${c.cancelRetention}</button>
          <button class="button button-primary" type="submit">${c.publishContested} <span aria-hidden="true">→</span></button>
        </footer>
      </form>
    </dialog>`;
}

function resultCard(experiment, incident, locale, c) {
  if (!experiment) return `<section class="incident-empty-result"><span>∅</span><p>${c.noResult}</p></section>`;
  const hypothesis = incident.hypotheses.find((item) => item.id === experiment.hypothesisId);
  const lower = Math.round((experiment.observed - experiment.interval) * 10) / 10;
  const upper = Math.round((experiment.observed + experiment.interval) * 10) / 10;
  const hazardNames = experiment.hazards.map((id) => c[id]);
  return `
    <section class="incident-result" data-verdict="${experiment.verdict}">
      <header><div><p>${experiment.id}</p><h4>${c.verdicts[experiment.verdict]}</h4></div><b>${experiment.quality}<small>/100</small></b></header>
      <p>${escapeHtml(localized(hypothesis.title, locale))}</p>
      <div class="incident-quality-track"><i style="width:${experiment.quality}%"></i><span style="left:${experiment.quality}%"></span></div>
      <dl>
        <div><dt>${c.observed}</dt><dd>${experiment.observed > 0 ? "+" : ""}${experiment.observed} ${escapeHtml(localized(incident.unit, locale))}</dd></div>
        <div><dt>${c.interval}</dt><dd>${lower}—${upper}</dd></div>
        <div><dt>${c.identifiability}</dt><dd>${experiment.quality}/100</dd></div>
      </dl>
      <div class="incident-residuals">
        <h5>${c.residuals}</h5>
        ${Object.entries(experiment.residuals).map(([id, value]) => `<div><span>${c[id]}</span><i><b style="width:${Math.min(100, value * 4)}%"></b></i><strong>${value}</strong></div>`).join("")}
      </div>
      <aside><b>${c.hazards}</b><p>${hazardNames.length ? hazardNames.join(" · ") : c.noHazards}</p></aside>
    </section>`;
}

function renderSimulator(locale, c, selectedId) {
  const incident = incidentById(selectedId) || incidentCases[0];
  const state = incidentCaseState(incident.id);
  const selectedHypothesis = incident.hypotheses.find((item) => item.id === state.selectedHypothesis);
  const experiments = incidentExperiments().filter((record) => record.caseId === incident.id);
  const latest = experiments.at(-1) || null;
  const resolved = resolutionForCase(incident.id);
  const established = latest?.quality >= 60 && latest?.verdict === "supports";
  const hasResponse = state.selectedActions.length > 0;
  return `
    <div class="incident-lab" id="incident-simulator">
      <header class="incident-lab-heading"><div><p>${c.labEyebrow}</p><h3>${c.labTitle}</h3></div><span>${c.labLead}</span></header>
      <div class="incident-lab-layout">
        <form class="incident-design" data-incident-design>
          <label class="incident-design-case">${c.activeCase}
            <select name="caseId">
              ${incidentCases.map((item) => `<option value="${item.id}" ${item.id === incident.id ? "selected" : ""}>${escapeHtml(item.code)} · ${escapeHtml(localized(item.title, locale))}</option>`).join("")}
            </select>
          </label>
          <fieldset>
            <legend>${c.testedHypothesis}</legend>
            ${incident.hypotheses.map((item) => `<label class="incident-hypothesis-radio"><input type="radio" name="hypothesisId" value="${item.id}" ${item.id === (selectedHypothesis?.id || incident.hypotheses[0].id) ? "checked" : ""}><span><b>${escapeHtml(localized(item.title, locale))}</b><small>${escapeHtml(localized(item.rationale, locale))}</small></span></label>`).join("")}
          </fieldset>
          <div class="incident-design-numbers">
            <label>${c.sample}
              <select name="sampleSize"><option value="12">12</option><option value="24" selected>24</option><option value="48">48</option><option value="96">96</option></select>
              <small>${c.sampleHelp}</small>
            </label>
            <label>${c.repeats}
              <select name="repeats"><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
            </label>
          </div>
          <div class="incident-controls">
            ${designCheckbox("control", c.control)}
            ${designCheckbox("randomize", c.randomize)}
            ${designCheckbox("calibration", c.calibration)}
            ${designCheckbox("versionLock", c.versionLock)}
          </div>
          <button class="button button-primary" type="submit">${c.run} <span aria-hidden="true">↗</span></button>
          <small>${c.localOnly} · ${experiments.length} ${c.experiments}</small>
        </form>
        <div class="incident-result-column">
          <header><span>${c.result}</span><b>${latest ? formatDate(latest.createdAt, locale) : "—"}</b></header>
          ${resultCard(latest, incident, locale, c)}
          ${latest && !resolved
            ? established
              ? `<button class="button button-primary incident-resolve" type="button" data-incident-resolve="${latest.id}" ${hasResponse ? "" : "disabled"}>${c.resolve} <span aria-hidden="true">→</span></button><p class="incident-resolve-note">${c.notReady}</p>`
              : `<button class="button incident-retain" type="button" data-incident-retain="${latest.id}" ${hasResponse ? "" : "disabled"}>${c.retainContested} <span aria-hidden="true">↝</span></button><p class="incident-resolve-note">${c.notReady}</p>`
            : resolved
              ? `<a class="button button-primary incident-resolve" href="#incident-records">${c.resolvedAlready} <span aria-hidden="true">→</span></a>`
              : ""}
        </div>
      </div>
    </div>
    ${retentionDialog(latest, incident, locale, c)}`;
}

function renderRecords(locale, c) {
  const resolutions = incidentResolutions().slice().reverse();
  const experiments = incidentExperiments().slice().reverse();
  return `
    <div class="incident-archive" id="incident-records">
      <header class="incident-archive-heading"><div><p>${c.archiveEyebrow}</p><h3>${c.archiveTitle}</h3></div><span>${c.archiveLead}</span></header>
      <section class="incident-resolution-section">
        <header><h4>${c.resolutionsTitle}</h4><b>${String(resolutions.length).padStart(2, "0")}</b></header>
        <div class="incident-resolution-grid">
          ${resolutions.length ? resolutions.map((record) => {
            const incident = incidentById(record.caseId);
            const hypothesis = incident.hypotheses.find((item) => item.id === record.hypothesisId);
            const actions = record.actionIds.map((id) => incident.actions.find((item) => item.id === id)).filter(Boolean);
            const firstPost = incidentCommunityPosts(locale).find((post) => post.resolutionId === record.id);
            const contested = record.disposition === "contested";
            const reviewer = incidentRetentionReviewers[record.reviewerId];
            const reason = incidentRetentionReasons[record.retentionReason];
            return `
              <article data-disposition="${contested ? "contested" : "established"}">
                <header><div><span>${escapeHtml(incident.code)}</span><strong>${escapeHtml(record.id)}</strong></div><i>${contested ? c.contested : c.published}</i></header>
                <h5>${escapeHtml(localized(incident.title, locale))}</h5>
                <dl>
                  <div><dt>${c.disposition}</dt><dd>${contested ? c.contested : c.established}</dd></div>
                  <div><dt>${contested ? c.unsupportedFinding : c.finding}</dt><dd>${escapeHtml(localized(hypothesis.title, locale))}</dd></div>
                  ${contested ? `
                    <div><dt>${c.originalResult}</dt><dd>${escapeHtml(c.verdicts[record.verdict])}</dd></div>
                    <div><dt>${c.signedBy}</dt><dd>${escapeHtml(localized(reviewer?.name, locale))} · ${escapeHtml(localized(reviewer?.role, locale))}</dd></div>
                    <div><dt>${c.retainedBecause}</dt><dd>${escapeHtml(localized(reason, locale))}</dd></div>` : ""}
                  <div><dt>${c.responseUsed}</dt><dd>${actions.map((item) => escapeHtml(localized(item.title, locale))).join(" · ")}</dd></div>
                  <div><dt>${c.quality}</dt><dd>${record.quality}/100</dd></div>
                  <div><dt>${c.resolvedOn}</dt><dd>${formatDate(record.resolvedAt, locale)}</dd></div>
                </dl>
                <footer>
                  <a href="#incident-case-${incident.id}">${c.reopenCase}</a>
                  ${firstPost ? `<a href="${siteHref(`bbs-${firstPost.id}`)}">${c.openBbs} · 3 ${c.bbsThreads} <span aria-hidden="true">↗</span></a>` : ""}
                </footer>
              </article>`;
          }).join("") : `<p class="incident-archive-empty">${c.noResolutions}</p>`}
        </div>
      </section>
      <section class="incident-experiment-log">
        <header><h4>${c.experimentHistory}</h4><b>${String(experiments.length).padStart(2, "0")}</b></header>
        ${experiments.length ? `
          <div class="incident-log-table" data-preserve-scroll="incident-experiments">
            <table>
              <thead><tr><th>ID</th><th>${c.activeCase}</th><th>${c.design}</th><th>${c.quality}</th><th>${c.result}</th><th>${c.localOnly}</th></tr></thead>
              <tbody>${experiments.map((record) => {
                const incident = incidentById(record.caseId);
                return `<tr><td><code>${escapeHtml(record.id)}</code></td><td><a href="#incident-case-${record.caseId}">${escapeHtml(incident.code)}</a></td><td>${record.design.sampleSize} ${c.samplesShort} · ${record.design.repeats} ${c.roundsShort}</td><td><b>${record.quality}/100</b></td><td>${c.verdicts[record.verdict]}</td><td>${formatDate(record.createdAt, locale)}</td></tr>`;
              }).join("")}</tbody>
            </table>
          </div>` : `<p class="incident-archive-empty">${c.noExperiments}</p>`}
      </section>
    </div>`;
}

export function initIncidents() {
  const root = document.querySelector("[data-incident-app]");
  if (!root) return;
  const routeCase = caseFromRoute(currentRoute());
  let selectedCaseId = routeCase
    || (incidentById(window.localStorage.getItem(LAST_CASE_KEY)) ? window.localStorage.getItem(LAST_CASE_KEY) : incidentCases[0].id);

  function render({ preserveWindow = true } = {}) {
    const locale = getLocale();
    const c = copy[locale];
    const route = currentRoute();
    const routeSelected = caseFromRoute(route);
    if (routeSelected) selectedCaseId = routeSelected;
    const view = viewForRoute(route);
    renderPreservingState(root, () => {
      root.innerHTML = `
        ${pageHero(locale, c, view)}
        ${view === "simulator"
          ? renderSimulator(locale, c, selectedCaseId)
          : view === "records"
            ? renderRecords(locale, c)
            : renderCases(locale, c, selectedCaseId)}`;
    }, { preserveWindow });
  }

  root.addEventListener("click", (event) => {
    if (event.target.matches?.("[data-incident-retention-dialog]")) {
      event.target.close();
      return;
    }
    const caseButton = event.target.closest("[data-incident-case]");
    if (caseButton) {
      selectedCaseId = caseButton.dataset.incidentCase;
      window.localStorage.setItem(LAST_CASE_KEY, selectedCaseId);
      window.location.hash = `incident-case-${selectedCaseId}`;
      return;
    }
    const evidenceButton = event.target.closest("[data-incident-evidence]");
    if (evidenceButton) {
      toggleIncidentEvidence(selectedCaseId, evidenceButton.dataset.incidentEvidence);
      render();
      return;
    }
    const testimonyButton = event.target.closest("[data-incident-testimony]");
    if (testimonyButton) {
      toggleIncidentTestimony(selectedCaseId, testimonyButton.dataset.incidentTestimony);
      render();
      return;
    }
    const hypothesisButton = event.target.closest("[data-incident-hypothesis]");
    if (hypothesisButton) {
      selectIncidentHypothesis(selectedCaseId, hypothesisButton.dataset.incidentHypothesis);
      render();
      return;
    }
    const actionButton = event.target.closest("[data-incident-action]");
    if (actionButton) {
      const state = toggleIncidentAction(selectedCaseId, actionButton.dataset.incidentAction);
      if (state?.limitReached) showToast(copy[getLocale()].actionLimit);
      else render();
      return;
    }
    if (event.target.closest("[data-incident-open-lab]")) {
      window.location.hash = "incident-simulator";
      return;
    }
    const retainButton = event.target.closest("[data-incident-retain]");
    if (retainButton && !retainButton.disabled) {
      const dialog = root.querySelector("[data-incident-retention-dialog]");
      if (dialog && !dialog.open) dialog.showModal();
      return;
    }
    const retentionCancel = event.target.closest("[data-retention-cancel]");
    if (retentionCancel) {
      root.querySelector("[data-incident-retention-dialog]")?.close();
      return;
    }
    const resolveButton = event.target.closest("[data-incident-resolve]");
    if (resolveButton) {
      const outcome = resolveIncident(selectedCaseId, resolveButton.dataset.incidentResolve);
      if (outcome.error) {
        showToast(copy[getLocale()].notReady);
        return;
      }
      if (!outcome.alreadyResolved) {
        recordCampusEvent(
          "incident.resolved",
          {
            caseId: selectedCaseId,
            resolutionId: outcome.record.id,
            quality: outcome.record.quality,
            disposition: outcome.record.disposition,
          },
          { id: `incident.resolved:${outcome.record.id}`, timestamp: outcome.record.resolvedAt },
        );
      }
      showToast(copy[getLocale()].resolutionSaved);
      window.location.hash = "incident-records";
    }
  });

  root.addEventListener("change", (event) => {
    const caseSelect = event.target.closest('[data-incident-design] select[name="caseId"]');
    if (!caseSelect) return;
    selectedCaseId = caseSelect.value;
    window.localStorage.setItem(LAST_CASE_KEY, selectedCaseId);
    render();
  });

  root.addEventListener("submit", (event) => {
    const retentionForm = event.target.closest("[data-incident-retention-form]");
    if (retentionForm) {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(retentionForm).entries());
      const outcome = resolveIncident(selectedCaseId, values.experimentId, {
        retainContested: true,
        confirmed: values.confirmation === "on",
        reviewerId: values.reviewerId,
        retentionReason: values.retentionReason,
      });
      if (outcome.error) {
        showToast(copy[getLocale()].retentionWarning);
        return;
      }
      if (!outcome.alreadyResolved) {
        recordCampusEvent(
          "incident.resolved",
          {
            caseId: selectedCaseId,
            resolutionId: outcome.record.id,
            quality: outcome.record.quality,
            disposition: outcome.record.disposition,
            reviewerId: outcome.record.reviewerId,
            retentionReason: outcome.record.retentionReason,
          },
          { id: `incident.resolved:${outcome.record.id}`, timestamp: outcome.record.resolvedAt },
        );
      }
      root.querySelector("[data-incident-retention-dialog]")?.close();
      showToast(copy[getLocale()].contestedSaved);
      window.location.hash = "incident-records";
      return;
    }
    const form = event.target.closest("[data-incident-design]");
    if (!form) return;
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    const design = {
      sampleSize: Number(values.sampleSize),
      repeats: Number(values.repeats),
      control: values.control === "on",
      randomize: values.randomize === "on",
      calibration: values.calibration === "on",
      versionLock: values.versionLock === "on",
    };
    selectIncidentHypothesis(selectedCaseId, values.hypothesisId);
    const experiment = runIncidentExperiment(selectedCaseId, values.hypothesisId, design);
    if (!experiment) return;
    recordCampusEvent(
      "incident.experiment.completed",
      {
        experimentId: experiment.id,
        caseId: selectedCaseId,
        hypothesisId: experiment.hypothesisId,
        quality: experiment.quality,
        verdict: experiment.verdict,
      },
      { id: `incident.experiment.completed:${experiment.id}`, timestamp: experiment.createdAt },
    );
    showToast(copy[getLocale()].experimentSaved);
    render();
  });

  window.addEventListener("hashchange", () => render({ preserveWindow: false }));
  window.addEventListener("tu:languagechange", () => render());
  render({ preserveWindow: false });
}
