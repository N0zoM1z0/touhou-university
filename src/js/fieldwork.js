import { values as catalogValues, trees as catalogTrees } from "../generated/i18n/ui/fieldwork.js";
import {
  fieldworkComplication,
  fieldworkDisciplines,
  fieldworkIncidentKinds,
  fieldworkLocalized,
  fieldworkRegions,
  fieldworkResearchChoices,
  fieldworkRiskLabels,
  fieldworkSourceKinds,
  fieldworkStation,
  fieldworkStations,
  fieldworkTravelModes,
} from "../data/fieldwork.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import {
  assessFieldworkDraft,
  checkInFieldwork,
  clearFieldworkDraft,
  completeFieldworkReturn,
  fieldworkDraft,
  fieldworkPassportSummary,
  fieldworkPlacement,
  fieldworkPlacements,
  fieldworkTravelEstimate,
  respondToFieldworkComplication,
  saveFieldworkDraft,
  submitFieldworkApplication,
} from "./fieldwork-model.js";
import { bindImeSafeInput } from "./ime-input.js";
import { getLocale } from "./i18n.js";
import { printDocument } from "./print-document.js";
import { renderPreservingState } from "./render-state.js";
import { siteHref } from "./site-router.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

let root;
let view = "stations";
let selectedStationId = "hakurei-shrine";
let selectedPlacementId = null;
let currentDraft = null;
let saveTimer = 0;
const filters = { query: "", region: "all", discipline: "all" };

const copy = catalogTrees["copy"];

const abilityOptions = {
  none: catalogValues("abilityOptions.none"),
  declared: catalogValues("abilityOptions.declared"),
  supervised: catalogValues("abilityOptions.supervised"),
  sealed: catalogValues("abilityOptions.sealed"),
};

const emergencyOptions = {
  "return-bell": catalogValues("emergencyOptions.return-bell"),
  "buddy-rope": catalogValues("emergencyOptions.buddy-rope"),
  "host-escort": catalogValues("emergencyOptions.host-escort"),
  "clinic-route": catalogValues("emergencyOptions.clinic-route"),
};

const statusKey = {
  approved: "statusApproved",
  conditional: "statusConditional",
  deployed: "statusDeployed",
  responded: "statusResponded",
  completed: "statusCompleted",
};

const standingKey = {
  clear: "clearStanding",
  conditional: "conditionalStanding",
  contested: "contestedStanding",
};

const reviewItemLabels = {
  observation: catalogValues("reviewItemLabels.observation"),
  provenance: catalogValues("reviewItemLabels.provenance"),
  "response-chain": catalogValues("reviewItemLabels.response-chain"),
  "research-consent": catalogValues("reviewItemLabels.research-consent"),
  "unresolved-dispute": catalogValues("reviewItemLabels.unresolved-dispute"),
  "reported-deviation": catalogValues("reviewItemLabels.reported-deviation"),
};

function reviewLabel(value, locale) {
  return t(reviewItemLabels[value] || [value, value, value], locale);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function t(value, locale) {
  return fieldworkLocalized(value, locale);
}

function optionList(values, selected, locale) {
  return Object.entries(values).map(([id, labels]) =>
    `<option value="${escapeHtml(id)}"${id === selected ? " selected" : ""}>${escapeHtml(labels[locale === "zh-Hant" ? 0 : locale === "ja" ? 1 : 2])}</option>`,
  ).join("");
}

function localizedOptions(values, selected, locale) {
  return Object.entries(values).map(([id, label]) =>
    `<option value="${escapeHtml(id)}"${id === selected ? " selected" : ""}>${escapeHtml(t(label, locale))}</option>`,
  ).join("");
}

function formatDate(value, locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: value?.includes?.("T") ? "short" : undefined }).format(date);
}

function filteredStations() {
  const locale = getLocale();
  const query = filters.query.trim().toLocaleLowerCase(locale);
  return fieldworkStations.filter((station) => {
    if (filters.region !== "all" && station.region !== filters.region) return false;
    if (filters.discipline !== "all" && !station.discipline.includes(filters.discipline)) return false;
    if (!query) return true;
    return [
      station.code,
      t(station.name, locale),
      t(station.supervisor, locale),
      t(station.placement, locale),
      t(station.host, locale),
    ].join(" ").toLocaleLowerCase(locale).includes(query);
  });
}

function hero(locale, c) {
  const passport = fieldworkPassportSummary();
  const placements = fieldworkPlacements();
  const active = placements.filter(({ status }) => ["deployed", "responded"].includes(status)).length;
  return `
    <header class="fieldwork-hero">
      <div class="fieldwork-hero-copy">
        <p>${escapeHtml(c.eyebrow)}</p>
        <h2>${escapeHtml(c.title)}</h2>
        <span>${escapeHtml(c.lead)}</span>
        <div class="fieldwork-hero-stats">
          <div><strong>24</strong><small>${escapeHtml(c.stations)}</small></div>
          <div><strong>${passport.totalVisits}</strong><small>${escapeHtml(c.stamps)}</small></div>
          <div><strong>${passport.hours}</strong><small>${escapeHtml(c.hours)}</small></div>
          <div><strong>${active}</strong><small>${escapeHtml(c.active)}</small></div>
        </div>
      </div>
      <div class="fieldwork-passport-cover" aria-hidden="true">
        <div><small>幻想鄉立東方大學</small><b>境 内<br>実 習</b><i>FIELDWORK<br>PASSPORT</i></div>
        <span>二十四<br>現場印</span>
        <em>東</em>
      </div>
    </header>`;
}

function tabs(c) {
  return `
    <nav class="fieldwork-tabs" aria-label="${escapeHtml(c.passportTitle)}">
      <button type="button" data-fieldwork-view="stations"${view === "stations" || view === "station" ? " class=\"active\"" : ""}>${escapeHtml(c.stationsTab)}</button>
      <button type="button" data-fieldwork-view="dispatch"${view === "dispatch" ? " class=\"active\"" : ""}>${escapeHtml(c.dispatchTab)}</button>
      <button type="button" data-fieldwork-view="passport"${view === "passport" ? " class=\"active\"" : ""}>${escapeHtml(c.passportTab)}</button>
      <button type="button" data-fieldwork-view="records"${view === "records" || view === "placement" ? " class=\"active\"" : ""}>${escapeHtml(c.recordsTab)}</button>
    </nav>`;
}

function filtersView(locale, c) {
  return `
    <div class="fieldwork-filters">
      <label><span>${escapeHtml(c.search)}</span><input type="search" value="${escapeHtml(filters.query)}" placeholder="${escapeHtml(c.search)}" data-fieldwork-query data-preserve-focus="fieldwork-query"></label>
      <label><span>${escapeHtml(c.allRegions)}</span><select data-fieldwork-region>
        <option value="all">${escapeHtml(c.allRegions)}</option>
        ${Object.entries(fieldworkRegions).map(([id, label]) => `<option value="${id}"${filters.region === id ? " selected" : ""}>${escapeHtml(t(label, locale))}</option>`).join("")}
      </select></label>
      <label><span>${escapeHtml(c.allDisciplines)}</span><select data-fieldwork-discipline>
        <option value="all">${escapeHtml(c.allDisciplines)}</option>
        ${Object.entries(fieldworkDisciplines).map(([id, label]) => `<option value="${id}"${filters.discipline === id ? " selected" : ""}>${escapeHtml(t(label, locale))}</option>`).join("")}
      </select></label>
    </div>`;
}

function mapView(locale, c) {
  const visible = new Set(filteredStations().map(({ id }) => id));
  return `
    <section class="fieldwork-map-panel">
      <header><p>DOMESTIC PLACEMENT NETWORK / 24</p><h3>${escapeHtml(c.routeDesk)}</h3><span>${escapeHtml(c.mapHint)}</span></header>
      <div class="fieldwork-map" data-preserve-scroll="fieldwork-map">
        <span class="fieldwork-map-line line-a"></span><span class="fieldwork-map-line line-b"></span><span class="fieldwork-map-line line-c"></span>
        ${fieldworkStations.map((station) => `
          <button
            type="button"
            class="fieldwork-map-node${station.id === selectedStationId ? " selected" : ""}${visible.has(station.id) ? "" : " filtered"}"
            style="--x:${station.x}%;--y:${station.y}%"
            data-fieldwork-station="${escapeHtml(station.id)}"
            aria-label="${escapeHtml(t(station.name, locale))}"
            title="${escapeHtml(`${station.code} · ${t(station.name, locale)}`)}"
          ><b>${escapeHtml(station.glyph)}</b><small>${escapeHtml(station.code.replace("FW-", ""))}</small></button>`).join("")}
        <div class="fieldwork-map-key">${Object.entries(fieldworkRegions).map(([id, label]) => `<span data-region="${id}">${escapeHtml(t(label, locale))}</span>`).join("")}</div>
      </div>
    </section>`;
}

function stationCard(station, locale, c) {
  return `
    <article class="fieldwork-station-card" data-region="${escapeHtml(station.region)}">
      <header><span>${escapeHtml(station.glyph)}</span><div><small>${escapeHtml(station.code)} · ${escapeHtml(t(fieldworkRegions[station.region], locale))}</small><h4>${escapeHtml(t(station.name, locale))}</h4></div></header>
      <p>${escapeHtml(t(station.placement, locale))}</p>
      <dl>
        <div><dt>${escapeHtml(c.supervisor)}</dt><dd>${escapeHtml(t(station.supervisor, locale))}</dd></div>
        <div><dt>${escapeHtml(c.shift)}</dt><dd>${escapeHtml(t(station.shift, locale))}</dd></div>
      </dl>
      <footer>
        <span>${station.hours}h · ${station.credits} cr</span>
        <button type="button" data-fieldwork-station="${escapeHtml(station.id)}">${escapeHtml(c.show)} ↗</button>
      </footer>
    </article>`;
}

function stationsView(locale, c) {
  const stations = filteredStations();
  return `
    <section class="fieldwork-stations-view" id="fieldwork-stations">
      ${filtersView(locale, c)}
      ${mapView(locale, c)}
      <div class="fieldwork-station-grid" data-preserve-scroll="fieldwork-stations">
        ${stations.map((station) => stationCard(station, locale, c)).join("")}
      </div>
    </section>`;
}

function routeDesk(station, locale, c, modeId = currentDraft?.travelMode || "foot") {
  const estimate = fieldworkTravelEstimate(station.id, modeId);
  return `
    <aside class="fieldwork-route-slip">
      <header><span>路</span><div><small>${escapeHtml(c.routeDesk)}</small><strong>${escapeHtml(t(fieldworkTravelModes[modeId].name, locale))}</strong></div></header>
      <div><b>${estimate.minutes}</b><span>${escapeHtml(c.min)}</span></div>
      <dl>
        <div><dt>${escapeHtml(c.moon)}</dt><dd>${escapeHtml(t(estimate.lunar, locale))}</dd></div>
        <div><dt>${escapeHtml(c.duty)}</dt><dd>${escapeHtml(t(estimate.duty, locale))}</dd></div>
      </dl>
      <p>${escapeHtml(t(fieldworkTravelModes[modeId].note, locale))}</p>
      ${estimate.notes.map((note) => `<small>${escapeHtml(t(note, locale))}</small>`).join("")}
    </aside>`;
}

function stationView(locale, c) {
  const station = fieldworkStation(selectedStationId) || fieldworkStations[0];
  return `
    <article class="fieldwork-station-file" id="fieldwork-station-${escapeHtml(station.id)}">
      <header class="fieldwork-file-heading">
        <div><p>${escapeHtml(station.code)} · ${escapeHtml(t(fieldworkRegions[station.region], locale))}</p><h3>${escapeHtml(t(station.name, locale))}</h3><span>${escapeHtml(t(station.host, locale))}</span></div>
        <b>${escapeHtml(station.glyph)}</b>
      </header>
      <div class="fieldwork-file-lead">
        <p>${escapeHtml(t(station.premise, locale))}</p>
        <span>${station.hours} ${escapeHtml(c.hours)} · ${station.credits} ${escapeHtml(c.credits)}</span>
      </div>
      <div class="fieldwork-file-grid">
        <section>
          <h4>${escapeHtml(c.supervisor)}</h4>
          <strong>${escapeHtml(t(station.supervisor, locale))}</strong>
          <p>${escapeHtml(t(station.companion, locale))}</p>
        </section>
        <section>
          <h4>${escapeHtml(c.access)}</h4>
          <p>${escapeHtml(t(station.access, locale))}</p>
        </section>
        <section>
          <h4>${escapeHtml(c.risk)}</h4>
          <strong>${escapeHtml(t(fieldworkRiskLabels[station.risk], locale))}</strong>
          <p>${escapeHtml(t(station.shift, locale))}</p>
        </section>
        <section>
          <h4>${escapeHtml(c.ethics)}</h4>
          <p>${escapeHtml(t(station.ethics, locale))}</p>
        </section>
      </div>
      <div class="fieldwork-file-lists">
        <section><h4>${escapeHtml(c.equipment)}</h4><ol>${station.equipment.map((item) => `<li>${escapeHtml(t(item, locale))}</li>`).join("")}</ol></section>
        <section><h4>${escapeHtml(c.tasks)}</h4><ol>${station.tasks.map((item) => `<li>${escapeHtml(t(item, locale))}</li>`).join("")}</ol></section>
      </div>
      <blockquote><small>${escapeHtml(c.wrinkle)}</small><p>${escapeHtml(t(station.wrinkle, locale))}</p></blockquote>
      <div class="fieldwork-route-chooser">
        <label><span>${escapeHtml(c.travel)}</span><select data-fieldwork-route-mode>
          ${localizedOptions(Object.fromEntries(Object.entries(fieldworkTravelModes).map(([id, mode]) => [id, mode.name])), currentDraft?.travelMode || "foot", locale)}
        </select></label>
        ${routeDesk(station, locale, c)}
      </div>
      <footer class="fieldwork-file-actions">
        <button type="button" class="paper-button" data-fieldwork-view="stations">← ${escapeHtml(c.backStations)}</button>
        <button type="button" class="primary-button" data-fieldwork-apply="${escapeHtml(station.id)}">${escapeHtml(c.apply)} →</button>
      </footer>
    </article>`;
}

function draftFromForm(form) {
  const data = new FormData(form);
  return {
    stationId: data.get("stationId"),
    fieldName: data.get("fieldName"),
    purpose: data.get("purpose"),
    departureDate: data.get("departureDate"),
    travelMode: data.get("travelMode"),
    abilityPlan: data.get("abilityPlan"),
    emergencyPlan: data.get("emergencyPlan"),
    equipment: data.getAll("equipment"),
    ethicsAcknowledged: data.has("ethicsAcknowledged"),
  };
}

function dispatchView(locale, c) {
  const draft = currentDraft || fieldworkDraft(selectedStationId);
  const station = fieldworkStation(draft.stationId);
  const assessment = assessFieldworkDraft(draft, locale);
  return `
    <section class="fieldwork-dispatch-view" id="fieldwork-dispatch">
      <header><p>FORM TU-FW / 24-STATION EDITION</p><h3>${escapeHtml(c.dispatchTitle)}</h3><span>${escapeHtml(c.saveHint)}</span></header>
      <form data-fieldwork-form>
        <div class="fieldwork-form-grid">
          <label class="wide"><span>${escapeHtml(c.station)}</span><select name="stationId">
            ${fieldworkStations.map((entry) => `<option value="${escapeHtml(entry.id)}"${entry.id === station.id ? " selected" : ""}>${escapeHtml(`${entry.code} · ${t(entry.name, locale)}`)}</option>`).join("")}
          </select></label>
          <label><span>${escapeHtml(c.fieldName)}</span><input name="fieldName" value="${escapeHtml(draft.fieldName)}" maxlength="100"></label>
          <label><span>${escapeHtml(c.departure)}</span><input type="date" name="departureDate" value="${escapeHtml(draft.departureDate)}"></label>
          <label class="wide"><span>${escapeHtml(c.purpose)}</span><textarea name="purpose" rows="4" maxlength="800" placeholder="${escapeHtml(c.purposePlaceholder)}">${escapeHtml(draft.purpose)}</textarea></label>
          <label><span>${escapeHtml(c.travel)}</span><select name="travelMode">${localizedOptions(Object.fromEntries(Object.entries(fieldworkTravelModes).map(([id, mode]) => [id, mode.name])), draft.travelMode, locale)}</select></label>
          <label><span>${escapeHtml(c.ability)}</span><select name="abilityPlan">${optionList(abilityOptions, draft.abilityPlan, locale)}</select></label>
          <label class="wide"><span>${escapeHtml(c.emergency)}</span><select name="emergencyPlan">${optionList(emergencyOptions, draft.emergencyPlan, locale)}</select></label>
        </div>
        <fieldset class="fieldwork-gear">
          <legend>${escapeHtml(c.chooseGear)}</legend>
          ${station.equipment.map((item, index) => `<label><input type="checkbox" name="equipment" value="${index}"${draft.equipment.includes(index) ? " checked" : ""}><span><b>0${index + 1}</b>${escapeHtml(t(item, locale))}</span></label>`).join("")}
        </fieldset>
        <label class="fieldwork-ack"><input type="checkbox" name="ethicsAcknowledged"${draft.ethicsAcknowledged ? " checked" : ""}><span>${escapeHtml(c.acknowledge)}</span></label>
        <div class="fieldwork-preview">
          ${routeDesk(station, locale, c, draft.travelMode)}
          <article data-outcome="${assessment.outcome}">
            <small>${escapeHtml(c.permit)}</small>
            <strong>${escapeHtml(assessment.outcome === "approved" ? c.approved : c.conditional)}</strong>
            <p>${escapeHtml(t(station.ethics, locale))}</p>
            ${assessment.conditions.length ? `<ul>${assessment.conditions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
          </article>
        </div>
        <div class="fieldwork-form-actions">
          <button type="button" class="paper-button" data-fieldwork-clear>${escapeHtml(c.clear)}</button>
          <button type="submit" class="primary-button">${escapeHtml(c.submit)} →</button>
        </div>
      </form>
    </section>`;
}

function printableElement(selector) {
  return root.querySelector(selector);
}

function permitView(placement, station, locale, c) {
  const estimate = fieldworkTravelEstimate(station.id, placement.draft.travelMode, new Date(`${placement.draft.departureDate}T09:00:00`));
  return `
    <article class="fieldwork-official-file fieldwork-permit" data-fieldwork-document id="fieldwork-placement-${escapeHtml(placement.id)}">
      <header><div><small>TOUHOU UNIVERSITY · DOMESTIC PLACEMENT</small><h3>${escapeHtml(c.permit)}</h3><p>${escapeHtml(c.permitLead)}</p></div><b data-status="${escapeHtml(placement.status)}">${escapeHtml(c[statusKey[placement.status]])}</b></header>
      <div class="fieldwork-file-number"><span>${escapeHtml(placement.id)}</span><time>${escapeHtml(formatDate(placement.createdAt, locale))}</time></div>
      <section class="fieldwork-permit-station">
        <i>${escapeHtml(station.glyph)}</i>
        <div><small>${escapeHtml(station.code)}</small><h4>${escapeHtml(t(station.name, locale))}</h4><p>${escapeHtml(t(station.placement, locale))}</p></div>
      </section>
      <dl class="fieldwork-permit-grid">
        <div><dt>${escapeHtml(c.supervisor)}</dt><dd>${escapeHtml(t(station.supervisor, locale))}</dd></div>
        <div><dt>${escapeHtml(c.departure)}</dt><dd>${escapeHtml(placement.draft.departureDate)}</dd></div>
        <div><dt>${escapeHtml(c.travel)}</dt><dd>${escapeHtml(t(fieldworkTravelModes[placement.draft.travelMode].name, locale))} · ${estimate.minutes} ${escapeHtml(c.min)}</dd></div>
        <div><dt>${escapeHtml(c.risk)}</dt><dd>${escapeHtml(t(fieldworkRiskLabels[station.risk], locale))}</dd></div>
        <div class="wide"><dt>${escapeHtml(c.purpose)}</dt><dd>${escapeHtml(placement.draft.purpose)}</dd></div>
      </dl>
      ${placement.permit.conditions.length ? `<section class="fieldwork-permit-conditions"><h4>${escapeHtml(c.conditions)}</h4><ol>${placement.permit.conditions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol></section>` : ""}
      <footer>
        <div><span>${escapeHtml(t(station.seal, locale))}</span><b>${escapeHtml(station.glyph)}</b></div>
        <p>${escapeHtml(t(station.ethics, locale))}</p>
      </footer>
      <div class="fieldwork-document-actions" data-print-exclude>
        <button type="button" class="paper-button" data-fieldwork-print>${escapeHtml(c.printPermit)}</button>
        <button type="button" class="paper-button" data-fieldwork-share>${escapeHtml(c.shared)}</button>
        <button type="button" class="primary-button" data-fieldwork-checkin="${escapeHtml(placement.id)}">${escapeHtml(c.checkin)} →</button>
      </div>
      <small class="fieldwork-action-note" data-print-exclude>${escapeHtml(c.checkinNote)}</small>
    </article>`;
}

function complicationView(placement, station, locale, c) {
  const complication = fieldworkComplication(placement.complicationId);
  return `
    <article class="fieldwork-live-file" id="fieldwork-placement-${escapeHtml(placement.id)}">
      <header><div><small>${escapeHtml(placement.id)} · ${escapeHtml(station.code)}</small><h3>${escapeHtml(t(station.name, locale))}</h3><p>${escapeHtml(c.fieldCase)}</p></div><b>現</b></header>
      <section class="fieldwork-live-case">
        <small>${escapeHtml(c.fieldCase)} · ${escapeHtml(complication.id)}</small>
        <h4>${escapeHtml(t(complication.title, locale))}</h4>
        <p>${escapeHtml(t(complication.detail, locale))}</p>
      </section>
      <p class="fieldwork-choice-lead">${escapeHtml(c.chooseResponse)}</p>
      <div class="fieldwork-response-grid">
        ${complication.responses.map(([id, label, outcome], index) => `
          <button type="button" data-fieldwork-response="${escapeHtml(id)}" data-placement="${escapeHtml(placement.id)}">
            <b>0${index + 1}</b><span>${escapeHtml(t(label, locale))}</span><small>${escapeHtml(c[standingKey[outcome === "careful" ? "conditional" : outcome === "traceable" ? "clear" : "contested"]])}</small>
          </button>`).join("")}
      </div>
      <footer><a href="${siteHref("map")}">${escapeHtml(c.openMap)} ↗</a><span>${escapeHtml(t(station.wrinkle, locale))}</span></footer>
    </article>`;
}

function returnForm(placement, station, locale, c) {
  const complication = fieldworkComplication(placement.complicationId);
  const response = complication.responses.find(([id]) => id === placement.responseId);
  return `
    <section class="fieldwork-return-form" id="fieldwork-placement-${escapeHtml(placement.id)}">
      <header><div><small>${escapeHtml(c.responded)} · ${escapeHtml(placement.id)}</small><h3>${escapeHtml(c.returnLog)}</h3></div><span>${escapeHtml(t(response?.[1], locale))}</span></header>
      <form data-fieldwork-return="${escapeHtml(placement.id)}">
        <label><span>${escapeHtml(c.observation)}</span><textarea name="observation" rows="5" maxlength="2400" placeholder="${escapeHtml(c.observationPlaceholder)}"></textarea></label>
        <div class="fieldwork-return-grid">
          <label><span>${escapeHtml(c.sourceKind)}</span><select name="sourceKind">${localizedOptions(fieldworkSourceKinds, "observation", locale)}</select></label>
          <label><span>${escapeHtml(c.evidenceCode)}</span><input name="evidenceCode" maxlength="120" placeholder="${escapeHtml(station.code)}-OBS-01"></label>
          <label class="wide"><span>${escapeHtml(c.sourceNote)}</span><textarea name="sourceNote" rows="3" maxlength="1200" placeholder="${escapeHtml(c.sourcePlaceholder)}"></textarea></label>
          <label><span>${escapeHtml(c.incident)}</span><select name="incidentKind">${localizedOptions(fieldworkIncidentKinds, "none", locale)}</select></label>
          <label><span>${escapeHtml(c.research)}</span><select name="researchChoice">${localizedOptions(fieldworkResearchChoices, "teaching", locale)}</select></label>
          <label class="wide"><span>${escapeHtml(c.incidentNote)}</span><textarea name="incidentNote" rows="3" maxlength="1200" placeholder="${escapeHtml(c.incidentPlaceholder)}"></textarea></label>
        </div>
        <button type="submit" class="primary-button">${escapeHtml(c.complete)} →</button>
      </form>
    </section>`;
}

function completedView(placement, station, locale, c) {
  const stamp = fieldworkPassportSummary().stamps.find(({ id }) => id === placement.stampId);
  return `
    <article class="fieldwork-official-file fieldwork-report" data-fieldwork-document id="fieldwork-placement-${escapeHtml(placement.id)}">
      <header><div><small>RETURN CERTIFICATION · ${escapeHtml(station.code)}</small><h3>${escapeHtml(c.report)}</h3><p>${escapeHtml(t(station.name, locale))}</p></div><b data-standing="${escapeHtml(placement.review.standing)}">${escapeHtml(c[standingKey[placement.review.standing]])}</b></header>
      <div class="fieldwork-file-number"><span>${escapeHtml(placement.id)}</span><time>${escapeHtml(formatDate(placement.completedAt, locale))}</time></div>
      <blockquote>${escapeHtml(t(placement.review.note, locale))}</blockquote>
      <section class="fieldwork-return-observation">
        <small>${escapeHtml(c.observation)}</small><p>${escapeHtml(placement.log.observation)}</p>
      </section>
      <dl class="fieldwork-report-grid">
        <div><dt>${escapeHtml(c.sourceKind)}</dt><dd>${escapeHtml(t(fieldworkSourceKinds[placement.log.sourceKind], locale))}</dd></div>
        <div><dt>${escapeHtml(c.evidenceCode)}</dt><dd>${escapeHtml(placement.log.evidenceCode || "—")}</dd></div>
        <div class="wide"><dt>${escapeHtml(c.sourceNote)}</dt><dd>${escapeHtml(placement.log.sourceNote)}</dd></div>
        <div><dt>${escapeHtml(c.incident)}</dt><dd>${escapeHtml(t(fieldworkIncidentKinds[placement.log.incidentKind], locale))}</dd></div>
        <div><dt>${escapeHtml(c.researchDisposition)}</dt><dd>${escapeHtml(t(fieldworkResearchChoices[placement.review.research], locale))}</dd></div>
      </dl>
      <div class="fieldwork-review-columns">
        <section><h4>${escapeHtml(c.strengths)}</h4><ul>${placement.review.strengths.length ? placement.review.strengths.map((item) => `<li>${escapeHtml(reviewLabel(item, locale))}</li>`).join("") : "<li>—</li>"}</ul></section>
        <section><h4>${escapeHtml(c.cautions)}</h4><ul>${placement.review.cautions.length ? placement.review.cautions.map((item) => `<li>${escapeHtml(reviewLabel(item, locale))}</li>`).join("") : "<li>—</li>"}</ul></section>
      </div>
      <footer class="fieldwork-stamp-issued">
        <div><small>${escapeHtml(stamp?.repeated ? c.repeated : c.first)}</small><strong>${escapeHtml(t(station.seal, locale))}</strong><span>${stamp?.credits ?? station.credits} cr · ${station.hours} h</span></div>
        <b>${escapeHtml(station.glyph)}</b>
      </footer>
      <div class="fieldwork-document-actions" data-print-exclude>
        <button type="button" class="paper-button" data-fieldwork-print>${escapeHtml(c.printReport)}</button>
        <button type="button" class="paper-button" data-fieldwork-share>${escapeHtml(c.shared)}</button>
        <a class="paper-button" href="campus.html#bbs">${escapeHtml(c.openBbs)} ↗</a>
      </div>
    </article>`;
}

function placementView(locale, c) {
  const placement = fieldworkPlacement(selectedPlacementId);
  if (!placement) {
    view = "records";
    return recordsView(locale, c);
  }
  const station = fieldworkStation(placement.stationId);
  if (["approved", "conditional"].includes(placement.status)) return permitView(placement, station, locale, c);
  if (placement.status === "deployed") return complicationView(placement, station, locale, c);
  if (placement.status === "responded") return returnForm(placement, station, locale, c);
  return completedView(placement, station, locale, c);
}

function passportView(locale, c) {
  const passport = fieldworkPassportSummary();
  return `
    <article class="fieldwork-passport-book" id="fieldwork-passport-book" data-fieldwork-document>
      <header>
        <div><p>TOUHOU UNIVERSITY · FIELDWORK PASSPORT</p><h3>${escapeHtml(c.passportTitle)}</h3><span>${escapeHtml(c.passportLead)}</span></div>
        <b>旅</b>
      </header>
      <div class="fieldwork-passport-meta">
        <span>${escapeHtml(passport.number || "TU-PASSPORT / NOT YET ISSUED")}</span>
        <dl>
          <div><dt>${passport.distinctStations}</dt><dd>${escapeHtml(c.distinct)}</dd></div>
          <div><dt>${passport.hours}</dt><dd>${escapeHtml(c.hours)}</dd></div>
          <div><dt>${passport.credits}</dt><dd>${escapeHtml(c.credits)}</dd></div>
          <div><dt>${passport.disciplines}</dt><dd>${escapeHtml(c.disciplines)}</dd></div>
          <div><dt>${passport.researchReady}</dt><dd>${escapeHtml(c.researchReady)}</dd></div>
          <div><dt>${passport.contested}</dt><dd>${escapeHtml(c.contestedCount)}</dd></div>
        </dl>
      </div>
      ${passport.stamps.length ? `<div class="fieldwork-stamp-grid">${passport.stamps.slice().reverse().map((stamp) => {
        const station = fieldworkStation(stamp.stationId);
        return `<button type="button" data-fieldwork-placement-open="${escapeHtml(stamp.placementId)}" data-standing="${escapeHtml(stamp.standing)}">
          <i>${escapeHtml(station.glyph)}</i>
          <small>${escapeHtml(station.code)} · ${escapeHtml(formatDate(stamp.issuedAt, locale))}</small>
          <strong>${escapeHtml(t(station.seal, locale))}</strong>
          <span>${stamp.credits} cr · ${stamp.hours}h · ${escapeHtml(stamp.repeated ? c.repeated : c.first)}</span>
        </button>`;
      }).join("")}</div>` : `<p class="fieldwork-empty">${escapeHtml(c.noStamps)}</p>`}
      <footer data-print-exclude><button type="button" class="paper-button" data-fieldwork-print>${escapeHtml(c.printPassport)}</button></footer>
    </article>`;
}

function recordsView(locale, c) {
  const placements = fieldworkPlacements().slice().reverse();
  return `
    <section class="fieldwork-records" id="fieldwork-records">
      <header><div><p>ON-DEVICE FIELD FILES</p><h3>${escapeHtml(c.recordsTitle)}</h3></div><span>${placements.length}</span></header>
      ${placements.length ? `<div class="fieldwork-record-list">${placements.map((placement) => {
        const station = fieldworkStation(placement.stationId);
        return `<article>
          <i>${escapeHtml(station.glyph)}</i>
          <div><small>${escapeHtml(placement.id)} · ${escapeHtml(formatDate(placement.createdAt, locale))}</small><h4>${escapeHtml(t(station.name, locale))}</h4><p>${escapeHtml(placement.draft.purpose)}</p></div>
          <b data-status="${escapeHtml(placement.status)}">${escapeHtml(c[statusKey[placement.status]])}</b>
          <button type="button" data-fieldwork-placement-open="${escapeHtml(placement.id)}">${escapeHtml(c.openRecord)} →</button>
        </article>`;
      }).join("")}</div>` : `<p class="fieldwork-empty">${escapeHtml(c.noRecords)}</p>`}
    </section>`;
}

function render(options = {}) {
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  renderPreservingState(root, () => {
    let body = stationsView(locale, c);
    if (view === "station") body = stationView(locale, c);
    if (view === "dispatch") body = dispatchView(locale, c);
    if (view === "passport") body = passportView(locale, c);
    if (view === "records") body = recordsView(locale, c);
    if (view === "placement") body = placementView(locale, c);
    root.innerHTML = `${hero(locale, c)}${tabs(c)}<div class="fieldwork-workspace">${body}</div>`;
  }, { preserveWindow: options.preserveWindow ?? true });
  bindFilterControls();
}

function showStation(id, navigate = true) {
  const station = fieldworkStation(id);
  if (!station) return;
  selectedStationId = station.id;
  currentDraft = fieldworkDraft(station.id);
  view = "station";
  if (navigate) {
    navigateToDeepLink(`fieldwork-station-${station.id}`);
    return;
  }
  render({ preserveWindow: false });
}

function showPlacement(id, navigate = true) {
  const placement = fieldworkPlacement(id);
  if (!placement) return;
  selectedPlacementId = placement.id;
  selectedStationId = placement.stationId;
  view = "placement";
  if (navigate) {
    navigateToDeepLink(`fieldwork-placement-${placement.id}`);
    return;
  }
  render({ preserveWindow: false });
}

function bindFilterControls() {
  const query = root.querySelector("[data-fieldwork-query]");
  if (query) {
    bindImeSafeInput(query, (event) => {
      filters.query = event.currentTarget.value;
      render();
    });
  }
}

function scheduleDraftSave(form) {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    currentDraft = saveFieldworkDraft(draftFromForm(form));
  }, 180);
}

function recordApplication(placement) {
  recordCampusEvent("fieldwork.application.submitted", {
    placementId: placement.id,
    stationId: placement.stationId,
    outcome: placement.permit.outcome,
    departureDate: placement.draft.departureDate,
  }, {
    id: `fieldwork.application.submitted:${placement.id}`,
    timestamp: placement.createdAt,
  });
}

function recordDeparture(placement) {
  recordCampusEvent("fieldwork.departure.checked", {
    placementId: placement.id,
    stationId: placement.stationId,
    travelMode: placement.draft.travelMode,
  }, {
    id: `fieldwork.departure.checked:${placement.id}`,
    timestamp: placement.startedAt,
  });
}

function recordResponse(placement) {
  recordCampusEvent("fieldwork.complication.handled", {
    placementId: placement.id,
    stationId: placement.stationId,
    complicationId: placement.complicationId,
    responseId: placement.responseId,
    standing: placement.responseOutcome,
  }, {
    id: `fieldwork.complication.handled:${placement.id}`,
    timestamp: placement.respondedAt,
  });
}

function recordReturn(placement) {
  recordCampusEvent("fieldwork.observation.logged", {
    placementId: placement.id,
    stationId: placement.stationId,
    sourceKind: placement.log.sourceKind,
    incidentKind: placement.log.incidentKind,
    researchChoice: placement.log.researchChoice,
  }, {
    id: `fieldwork.observation.logged:${placement.id}`,
    timestamp: placement.log.submittedAt,
  });
  recordCampusEvent("fieldwork.return.certified", {
    placementId: placement.id,
    stationId: placement.stationId,
    stampId: placement.stampId,
    standing: placement.review.standing,
    credits: fieldworkPassportSummary().stamps.find(({ id }) => id === placement.stampId)?.credits || 0,
  }, {
    id: `fieldwork.return.certified:${placement.id}`,
    timestamp: new Date(new Date(placement.completedAt).getTime() + 1).toISOString(),
  });
}

function bindEvents() {
  root.addEventListener("input", (event) => {
    const form = event.target.closest("[data-fieldwork-form]");
    if (form && !event.isComposing) scheduleDraftSave(form);
  });
  root.addEventListener("change", (event) => {
    if (event.target.matches("[data-fieldwork-region]")) {
      filters.region = event.target.value;
      render();
      return;
    }
    if (event.target.matches("[data-fieldwork-discipline]")) {
      filters.discipline = event.target.value;
      render();
      return;
    }
    if (event.target.matches("[data-fieldwork-route-mode]")) {
      currentDraft = saveFieldworkDraft({ ...(currentDraft || fieldworkDraft(selectedStationId)), travelMode: event.target.value });
      render();
      return;
    }
    const form = event.target.closest("[data-fieldwork-form]");
    if (!form) return;
    const next = draftFromForm(form);
    if (next.stationId !== currentDraft?.stationId) next.equipment = [];
    currentDraft = saveFieldworkDraft(next);
    selectedStationId = currentDraft.stationId;
    render();
  });
  root.addEventListener("click", async (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    const viewButton = event.target.closest("[data-fieldwork-view]");
    if (viewButton) {
      const next = viewButton.dataset.fieldworkView;
      view = next;
      selectedPlacementId = null;
      if (next === "stations") navigateToDeepLink("fieldwork-stations");
      if (next === "dispatch") navigateToDeepLink("fieldwork-dispatch");
      if (next === "passport") navigateToDeepLink("fieldwork-passport");
      if (next === "records") navigateToDeepLink("fieldwork-records");
      return;
    }
    const stationButton = event.target.closest("[data-fieldwork-station]");
    if (stationButton) {
      showStation(stationButton.dataset.fieldworkStation);
      return;
    }
    const apply = event.target.closest("[data-fieldwork-apply]");
    if (apply) {
      selectedStationId = apply.dataset.fieldworkApply;
      currentDraft = fieldworkDraft(selectedStationId);
      view = "dispatch";
      navigateToDeepLink("fieldwork-dispatch");
      return;
    }
    const clear = event.target.closest("[data-fieldwork-clear]");
    if (clear) {
      currentDraft = clearFieldworkDraft(selectedStationId);
      render();
      return;
    }
    const openPlacement = event.target.closest("[data-fieldwork-placement-open]");
    if (openPlacement) {
      showPlacement(openPlacement.dataset.fieldworkPlacementOpen);
      return;
    }
    const checkin = event.target.closest("[data-fieldwork-checkin]");
    if (checkin) {
      const result = checkInFieldwork(checkin.dataset.fieldworkCheckin);
      if (result.error) {
        showToast(result.error === "active-placement" ? c.activeError : c.noRecords);
        return;
      }
      recordDeparture(result.placement);
      showToast(c.departed);
      showPlacement(result.placement.id);
      return;
    }
    const response = event.target.closest("[data-fieldwork-response]");
    if (response) {
      const result = respondToFieldworkComplication(response.dataset.placement, response.dataset.fieldworkResponse);
      if (result.error) return;
      recordResponse(result.placement);
      showToast(c.handled);
      showPlacement(result.placement.id);
      return;
    }
    if (event.target.closest("[data-fieldwork-print]")) {
      const documentElement = printableElement("[data-fieldwork-document]");
      if (documentElement) printDocument(documentElement, { title: `${c.passportTitle} · Touhou University` });
      return;
    }
    if (event.target.closest("[data-fieldwork-share]")) {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch {
        const input = document.createElement("input");
        input.value = window.location.href;
        document.body.append(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      showToast(c.copied);
    }
  });
  root.addEventListener("submit", (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    const form = event.target.closest("[data-fieldwork-form]");
    if (form) {
      event.preventDefault();
      window.clearTimeout(saveTimer);
      currentDraft = saveFieldworkDraft(draftFromForm(form));
      const result = submitFieldworkApplication(currentDraft, new Date(), locale);
      if (result.error) {
        const message = result.error === "purpose"
          ? c.purposeError
          : result.error === "ethics"
            ? c.ethicsError
            : result.error === "active-placement"
              ? c.activeError
              : c.noRecords;
        showToast(message);
        return;
      }
      recordApplication(result.placement);
      showToast(c.issued);
      showPlacement(result.placement.id);
      return;
    }
    const returnForm = event.target.closest("[data-fieldwork-return]");
    if (returnForm) {
      event.preventDefault();
      const data = new FormData(returnForm);
      const result = completeFieldworkReturn(returnForm.dataset.fieldworkReturn, {
        observation: data.get("observation"),
        sourceKind: data.get("sourceKind"),
        sourceNote: data.get("sourceNote"),
        evidenceCode: data.get("evidenceCode"),
        incidentKind: data.get("incidentKind"),
        incidentNote: data.get("incidentNote"),
        researchChoice: data.get("researchChoice"),
      });
      if (result.error) {
        showToast(result.error === "observation" ? c.observationError : c.sourceError);
        return;
      }
      recordReturn(result.placement);
      showToast(c.completedToast);
      showPlacement(result.placement.id);
    }
  });
}

function initialView() {
  const route = safeDecodeFragment();
  if (route === "fieldwork-passport") {
    view = "passport";
    return;
  }
  if (route === "fieldwork-dispatch") {
    view = "dispatch";
    return;
  }
  if (route === "fieldwork-records") {
    view = "records";
    return;
  }
  if (route.startsWith("fieldwork-station-")) {
    const station = fieldworkStation(route.slice("fieldwork-station-".length));
    if (station) {
      selectedStationId = station.id;
      view = "station";
    }
    return;
  }
  if (route.startsWith("fieldwork-placement-")) {
    const placement = fieldworkPlacement(route.slice("fieldwork-placement-".length));
    if (placement) {
      selectedPlacementId = placement.id;
      selectedStationId = placement.stationId;
      view = "placement";
    }
  }
}

export function initFieldwork() {
  root = document.querySelector("[data-fieldwork-app]");
  if (!root) return;
  initialView();
  currentDraft = fieldworkDraft(selectedStationId);
  render({ preserveWindow: false });
  bindEvents();

  registerDeepLink("fieldwork-stations", {
    anchor: "#fieldwork-stations",
    position: "always",
    open() {
      view = "stations";
      selectedPlacementId = null;
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("fieldwork-passport", {
    anchor: () => document.getElementById("fieldwork-passport-book") || root,
    position: "always",
    open() {
      view = "passport";
      selectedPlacementId = null;
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("fieldwork-dispatch", {
    anchor: "#fieldwork-dispatch",
    position: "always",
    open() {
      view = "dispatch";
      currentDraft = fieldworkDraft(selectedStationId);
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("fieldwork-records", {
    anchor: "#fieldwork-records",
    position: "always",
    open() {
      view = "records";
      selectedPlacementId = null;
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("fieldwork-station-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "fieldwork-focus",
    position: "always",
    open(id) {
      showStation(id, false);
    },
  });
  registerDeepLink("fieldwork-placement-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "fieldwork-focus",
    position: "always",
    open(id) {
      showPlacement(id, false);
    },
  });

  window.addEventListener("tu:languagechange", () => render({ preserveWindow: false }));
  window.addEventListener("tu:recordschange", () => render());
}
