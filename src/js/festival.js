import { text as catalogText, trees as catalogTrees } from "../generated/i18n/ui/festival.js";
import {
  festivalAidPlans,
  festivalFairyZones,
  festivalFoodCourts,
  festivalGatePlans,
  festivalIncident,
  festivalKind,
  festivalKinds,
  festivalLocalized,
  festivalMusicPlans,
  festivalPowerPlans,
  festivalPressPlans,
  festivalReviewDesks,
  festivalRoutes,
  festivalStages,
} from "../data/festival.js";
import { campusLunarPhase } from "../data/campus-time.js";
import { mapPlaces } from "../data/services.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import {
  activeFestivalOperation,
  assessFestivalPlan,
  closeFestivalOperation,
  festivalDraft,
  festivalOperation,
  festivalOperations,
  festivalOutcomeLabels,
  festivalPlan,
  festivalPlans,
  festivalRouteOverlay,
  festivalStanceLabels,
  festivalStats,
  resetFestivalDraft,
  respondFestivalIncident,
  saveFestivalDraft,
  startFestivalOperation,
  submitFestivalPlan,
} from "./festival-model.js";
import { getLocale } from "./i18n.js";
import { printDocument } from "./print-document.js";
import { renderPreservingState } from "./render-state.js";
import { siteHref } from "./site-router.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

let root;
let view = "desk";
let currentDraft = null;
let selectedPlanId = null;
let selectedOperationId = null;
let preview = null;
let saveTimer = 0;

const copy = catalogTrees["copy"];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function localized(value, locale) {
  return festivalLocalized(value, locale);
}

function formatDate(value, locale, withTime = true) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, withTime
    ? { dateStyle: "long", timeStyle: "short" }
    : { dateStyle: "long" }).format(date);
}

function datetimeLocal(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function phaseName(phase, locale) {
  const names = catalogTrees["names"];
  return names[locale]?.[phase] || names["zh-Hant"][phase] || "—";
}

function optionList(records, selected, locale) {
  return records.map((entry) => `
    <option value="${escapeHtml(entry.id)}" ${entry.id === selected ? "selected" : ""}>
      ${escapeHtml(localized(entry.name, locale))}
    </option>`).join("");
}

function draftFromForm(form) {
  const data = new FormData(form);
  const parsedStart = new Date(data.get("startsAt"));
  return {
    ...currentDraft,
    kindId: data.get("kindId"),
    title: data.get("title"),
    startsAt: Number.isNaN(parsedStart.getTime()) ? currentDraft.startsAt : parsedStart.toISOString(),
    routeId: data.get("routeId"),
    stageId: data.get("stageId"),
    altitude: data.get("altitude"),
    density: data.get("density"),
    cueSeconds: data.get("cueSeconds"),
    visitorCapacity: data.get("visitorCapacity"),
    powerId: data.get("powerId"),
    foodCourtId: data.get("foodCourtId"),
    fairyZoneId: data.get("fairyZoneId"),
    aidPlanId: data.get("aidPlanId"),
    gatePlanId: data.get("gatePlanId"),
    pressPlanId: data.get("pressPlanId"),
    musicPlanId: data.get("musicPlanId"),
    rainPlan: data.has("rainPlan"),
    debrisCrew: data.has("debrisCrew"),
    independentCounter: data.has("independentCounter"),
    stopRule: data.get("stopRule"),
    rainRule: data.get("rainRule"),
    accessibilityNote: data.get("accessibilityNote"),
    organiserNote: data.get("organiserNote"),
  };
}

function hero(locale, c) {
  const stats = festivalStats();
  return `
    <header class="festival-hero">
      <div>
        <p>${escapeHtml(c.eyebrow)}</p>
        <h2>${escapeHtml(c.title)}</h2>
        <span>${escapeHtml(c.lead)}</span>
      </div>
      <figure>
        <picture>
          <source media="(max-width: 700px)" srcset="assets/images/night-festival-mobile.webp">
          <img src="assets/images/night-festival.webp" alt="${escapeHtml(catalogText("hero.0")[locale])}">
        </picture>
        <figcaption><b>${stats.plans}</b> ${escapeHtml(c.plans)} · <b>${stats.live}</b> ${escapeHtml(c.live)} · <b>${stats.closed}</b> ${escapeHtml(c.closed)}</figcaption>
      </figure>
    </header>
    <nav class="festival-mode-nav" aria-label="${escapeHtml(c.eyebrow)}">
      <a href="#festival-operations" ${view === "desk" ? 'aria-current="page"' : ""}><span>01</span>${escapeHtml(c.deskTab)}</a>
      <a href="#festival-records" ${view === "records" ? 'aria-current="page"' : ""}><span>02</span>${escapeHtml(c.recordsTab)}</a>
      ${activeFestivalOperation() ? `<a href="#festival-operation-${escapeHtml(activeFestivalOperation().id)}" ${view === "operation" ? 'aria-current="page"' : ""}><span>03</span>${escapeHtml(c.liveTab)}</a>` : ""}
    </nav>`;
}

function formField(name, label, value, rows = 3) {
  return `
    <label class="festival-field festival-field-wide">
      <span>${escapeHtml(label)}</span>
      <textarea name="${escapeHtml(name)}" rows="${rows}" data-preserve-focus="festival-${escapeHtml(name)}">${escapeHtml(value)}</textarea>
    </label>`;
}

function metricsPanel(assessment, locale, c) {
  const m = assessment.metrics;
  const items = [
    [c.attendance, `${m.expectedAttendance} ${c.people}`, "人"],
    [c.powerLoad, `${m.powerLoad}/${m.powerCapacity}+${m.backupCapacity}`, "電"],
    [c.clinic, `${m.clinicArrivals}/${m.aidCapacity} ${c.people}`, "診"],
    [c.routeDelay, `${m.routeDelay} ${c.minutes}`, "路"],
    [c.volunteers, `${m.volunteers} ${c.people}`, "班"],
    [c.recovery, String(m.lanternRecovery), "燈"],
  ];
  return `
    <section class="festival-metrics">
      <header>
        <div><p>OPERATIONAL PROJECTION</p><h3>${escapeHtml(c.metrics)}</h3></div>
        <strong data-outcome="${escapeHtml(assessment.outcome)}">${escapeHtml(localized(festivalOutcomeLabels[assessment.outcome], locale))}</strong>
      </header>
      <div>${items.map(([label, value, glyph]) => `
        <article><i>${glyph}</i><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></article>`).join("")}</div>
    </section>`;
}

function reviewPanel(assessment, locale, c, formal = false) {
  return `
    <section class="festival-reviews ${formal ? "is-formal" : ""}">
      <header>
        <div><p>${formal ? "SIX DESKS / FILED" : "SIX DESKS / PRE-REVIEW"}</p><h3>${escapeHtml(c.desks)}</h3></div>
        <span>${escapeHtml(c.desksLead)}</span>
      </header>
      <div class="festival-review-grid">
        ${assessment.opinions.map((opinion, index) => {
          const desk = festivalReviewDesks.find(({ id }) => id === opinion.deskId);
          return `
            <article data-stance="${escapeHtml(opinion.stance)}">
              <header><i>${escapeHtml(desk.glyph)}</i><div><small>0${index + 1} · ${escapeHtml(localized(desk.question, locale))}</small><h4>${escapeHtml(localized(desk.name, locale))}</h4></div><b>${escapeHtml(localized(festivalStanceLabels[opinion.stance], locale))}</b></header>
              <p>${escapeHtml(localized(opinion.finding, locale))}</p>
              <section><strong>${escapeHtml(c.conditions)}</strong>${opinion.conditions.length
                ? `<ul>${opinion.conditions.map((condition) => `<li>${escapeHtml(localized(condition, locale))}</li>`).join("")}</ul>`
                : `<span>${escapeHtml(c.noConditions)}</span>`}</section>
            </article>`;
        }).join("")}
      </div>
    </section>`;
}

function programmePanel(programme, locale, c) {
  return `
    <section class="festival-programme">
      <header><p>PROGRAMME / BELL ORDER</p><h3>${escapeHtml(c.programme)}</h3></header>
      <ol>${programme.map((item, index) => `
        <li><time datetime="${escapeHtml(item.at)}">${new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(item.at))}</time><span>0${index + 1}</span><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.place)}</small></div></li>`).join("")}</ol>
    </section>`;
}

function mapPanel(draft, locale, c, { live = false } = {}) {
  const route = festivalRoutes.find(({ id }) => id === draft.routeId) || festivalRoutes[0];
  const active = new Set(route.path);
  const positions = {
    gate: [11, 72], library: [25, 37], boundary: [49, 57], history: [52, 22],
    magic: [72, 43], kappa: [88, 18], clinic: [86, 76],
  };
  return `
    <section class="festival-map-panel">
      <header><div><p>FESTIVAL ROUTE / ${live ? "LIVE" : "PROPOSED"}</p><h3>${escapeHtml(c.operationsMap)}</h3></div><span>${escapeHtml(localized(route.detail, locale))}</span></header>
      <div class="festival-map">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d="${route.path.map((id, index) => `${index ? "L" : "M"} ${positions[id][0]} ${positions[id][1]}`).join(" ")}"></path>
        </svg>
        ${Object.entries(positions).map(([id, [x, y]]) => `
          <a href="${siteHref("map")}" class="${active.has(id) ? "is-route" : ""}" style="--x:${x}%;--y:${y}%">
            <span>${escapeHtml(mapPlaces[id]?.index || "—")}</span><strong>${escapeHtml(localized(mapPlaces[id]?.name, locale) || id)}</strong>
          </a>`).join("")}
      </div>
    </section>`;
}

function deskView(locale, c) {
  currentDraft ||= festivalDraft();
  preview ||= assessFestivalPlan(currentDraft, locale);
  const d = currentDraft;
  const kind = festivalKind(d.kindId);
  return `
    <section class="festival-desk" id="festival-desk">
      <aside class="festival-dossier">
        <header><span>${escapeHtml(kind.code)}</span><b>${escapeHtml(kind.glyph)}</b></header>
        <p>${escapeHtml(c.chooseKind)}</p>
        <h3>${escapeHtml(localized(kind.name, locale))}</h3>
        <strong>${escapeHtml(localized(kind.short, locale))}</strong>
        <blockquote>${escapeHtml(localized(kind.premise, locale))}</blockquote>
        <dl>
          <div><dt>${escapeHtml(c.phase)}</dt><dd>${escapeHtml(phaseName(campusLunarPhase(new Date(d.startsAt)), locale))}</dd></div>
          <div><dt>${escapeHtml(c.liveCampus)}</dt><dd>${escapeHtml(formatDate(d.startsAt, locale))}</dd></div>
        </dl>
      </aside>
      <form class="festival-form" data-festival-form>
        <header><p>OPERATIONS DRAFT / ${escapeHtml(kind.code)}</p><h3>${escapeHtml(c.deskTab)}</h3></header>
        <div class="festival-form-grid">
          <label class="festival-field"><span>${escapeHtml(c.chooseKind)}</span><select name="kindId">${optionList(festivalKinds, d.kindId, locale)}</select></label>
          <label class="festival-field"><span>${escapeHtml(c.startsAt)}</span><input name="startsAt" type="datetime-local" value="${escapeHtml(datetimeLocal(d.startsAt))}" required></label>
          <label class="festival-field festival-field-wide"><span>${escapeHtml(c.eventTitle)}</span><input name="title" value="${escapeHtml(d.title)}" maxlength="140" data-preserve-focus="festival-title"></label>
          <label class="festival-field"><span>${escapeHtml(c.route)}</span><select name="routeId">${optionList(festivalRoutes, d.routeId, locale)}</select></label>
          <label class="festival-field"><span>${escapeHtml(c.stage)}</span><select name="stageId">${optionList(festivalStages, d.stageId, locale)}</select></label>
          <label class="festival-field"><span>${escapeHtml(c.altitude)}</span><select name="altitude">
            <option value="20" ${d.altitude === 20 ? "selected" : ""}>20m · LOW</option>
            <option value="45" ${d.altitude === 45 ? "selected" : ""}>45m · STANDARD</option>
            <option value="80" ${d.altitude === 80 ? "selected" : ""}>80m · HIGH</option>
          </select></label>
          <label class="festival-field"><span>${escapeHtml(c.density)}</span><input type="range" name="density" min="1" max="5" value="${d.density}"><output>${d.density}/5</output></label>
          <label class="festival-field"><span>${escapeHtml(c.cue)}</span><input type="number" name="cueSeconds" min="0" max="6" step="0.1" value="${d.cueSeconds}"></label>
          <label class="festival-field"><span>${escapeHtml(c.capacity)}</span><input type="number" name="visitorCapacity" min="120" max="1200" step="20" value="${d.visitorCapacity}"></label>
          <label class="festival-field"><span>${escapeHtml(c.power)}</span><select name="powerId">${optionList(festivalPowerPlans, d.powerId, locale)}</select></label>
          <label class="festival-field"><span>${escapeHtml(c.food)}</span><select name="foodCourtId">${optionList(festivalFoodCourts, d.foodCourtId, locale)}</select></label>
          <label class="festival-field"><span>${escapeHtml(c.fairies)}</span><select name="fairyZoneId">${optionList(festivalFairyZones, d.fairyZoneId, locale)}</select></label>
          <label class="festival-field"><span>${escapeHtml(c.aid)}</span><select name="aidPlanId">${optionList(festivalAidPlans, d.aidPlanId, locale)}</select></label>
          <label class="festival-field"><span>${escapeHtml(c.gate)}</span><select name="gatePlanId">${optionList(festivalGatePlans, d.gatePlanId, locale)}</select></label>
          <label class="festival-field"><span>${escapeHtml(c.press)}</span><select name="pressPlanId">${optionList(festivalPressPlans, d.pressPlanId, locale)}</select></label>
          <label class="festival-field"><span>${escapeHtml(c.music)}</span><select name="musicPlanId">${optionList(festivalMusicPlans, d.musicPlanId, locale)}</select></label>
        </div>
        <fieldset class="festival-protections"><legend>${escapeHtml(c.protections)}</legend>
          <label><input type="checkbox" name="rainPlan" ${d.rainPlan ? "checked" : ""}><span>${escapeHtml(c.rainPlan)}</span></label>
          <label><input type="checkbox" name="debrisCrew" ${d.debrisCrew ? "checked" : ""}><span>${escapeHtml(c.debrisCrew)}</span></label>
          <label><input type="checkbox" name="independentCounter" ${d.independentCounter ? "checked" : ""}><span>${escapeHtml(c.independentCounter)}</span></label>
        </fieldset>
        <div class="festival-form-grid">
          ${formField("stopRule", c.stopRule, d.stopRule)}
          ${formField("rainRule", c.rainRule, d.rainRule)}
          ${formField("accessibilityNote", c.accessibility, d.accessibilityNote)}
          ${formField("organiserNote", c.note, d.organiserNote)}
        </div>
        <footer>
          <button type="button" class="button" data-festival-reset>${escapeHtml(c.reset)}</button>
          <button type="button" class="button" data-festival-save>${escapeHtml(c.save)}</button>
          <button type="button" class="button" data-festival-preview>${escapeHtml(c.preview)}</button>
          <button type="submit" class="button button-primary">${escapeHtml(c.submit)} <span aria-hidden="true">→</span></button>
        </footer>
      </form>
    </section>
    ${metricsPanel(preview, locale, c)}
    <div class="festival-projection-grid">
      ${programmePanel(preview.programme, locale, c)}
      ${mapPanel(d, locale, c)}
    </div>
    ${reviewPanel(preview, locale, c)}`;
}

function assessmentForPlan(plan) {
  return {
    draft: plan.draft,
    metrics: plan.metrics,
    opinions: plan.opinions,
    outcome: plan.outcome,
    programme: plan.programme,
  };
}

function startPanel(plan, locale, c) {
  const operation = festivalOperations().find((entry) => entry.planId === plan.id);
  if (operation) {
    return `<a class="button button-primary festival-open-operation" href="#festival-operation-${escapeHtml(operation.id)}">${escapeHtml(operation.status === "closed" ? c.report : c.fieldBoard)} <span aria-hidden="true">→</span></a>`;
  }
  if (plan.outcome === "revision") {
    return `<aside class="festival-start-blocked"><strong>${escapeHtml(c.blocked)}</strong><button class="button" type="button" data-festival-revise="${escapeHtml(plan.id)}">${escapeHtml(c.revise)}</button></aside>`;
  }
  return `
    <form class="festival-start-panel" data-festival-start="${escapeHtml(plan.id)}">
      <div><p>OPENING BELL</p><h3>${escapeHtml(c.startFestival)}</h3></div>
      <label><span>${escapeHtml(c.role)}</span><select name="role">
        <option value="organiser">${escapeHtml(c.organiser)}</option>
        <option value="volunteer">${escapeHtml(c.volunteer)}</option>
        <option value="observer">${escapeHtml(c.observer)}</option>
      </select></label>
      ${["conditional", "contested"].includes(plan.outcome) ? `<label class="festival-acknowledge"><input type="checkbox" name="acknowledged"><span>${escapeHtml(c.acknowledge)}</span></label>` : ""}
      <button type="submit" class="button button-primary">${escapeHtml(c.start)} <span aria-hidden="true">↗</span></button>
    </form>`;
}

function planView(plan, locale, c) {
  const assessment = assessmentForPlan(plan);
  const kind = festivalKind(plan.draft.kindId);
  return `
    <article class="festival-permit-file" id="festival-plan-${escapeHtml(plan.id)}" data-festival-plan-file>
      <header>
        <div><p>${escapeHtml(c.permit)} · ${escapeHtml(kind.code)}</p><h3>${escapeHtml(plan.draft.title || localized(kind.name, locale))}</h3><span>${escapeHtml(plan.id)} · ${escapeHtml(formatDate(plan.createdAt, locale))}</span></div>
        <b data-outcome="${escapeHtml(plan.outcome)}">${escapeHtml(localized(festivalOutcomeLabels[plan.outcome], locale))}</b>
      </header>
      <blockquote>${escapeHtml(c.permitNotice)}</blockquote>
      ${metricsPanel(assessment, locale, c)}
      <div class="festival-projection-grid">
        ${programmePanel(plan.programme, locale, c)}
        ${mapPanel(plan.draft, locale, c)}
      </div>
      ${reviewPanel(assessment, locale, c, true)}
      <footer data-print-exclude>
        <button type="button" class="button" data-festival-share>${escapeHtml(c.share)}</button>
        <button type="button" class="button" data-festival-print-plan="${escapeHtml(plan.id)}">${escapeHtml(c.printPermit)}</button>
        <a class="button" href="${siteHref("map")}">${escapeHtml(c.openMap)} ↗</a>
        <button type="button" class="button" data-festival-revise="${escapeHtml(plan.id)}">${escapeHtml(c.revise)}</button>
      </footer>
      ${startPanel(plan, locale, c)}
    </article>`;
}

function operationSummary(operation, plan, locale, c) {
  const overlay = festivalRouteOverlay();
  const resolved = operation.responses.length;
  return `
    <header class="festival-field-heading">
      <div><p>${escapeHtml(c.fieldBoard)} · ${escapeHtml(operation.id)}</p><h3>${escapeHtml(plan.draft.title || localized(festivalKind(plan.draft.kindId).name, locale))}</h3><span>${escapeHtml(formatDate(operation.openedAt, locale))} · ${escapeHtml(operation.role)}</span></div>
      <b data-status="${escapeHtml(operation.status)}">${escapeHtml(localized(festivalOutcomeLabels[operation.status], locale))}</b>
    </header>
    ${operation.status === "live" ? `<aside class="festival-live-impact"><i>現</i><div><strong>${escapeHtml(c.activeNow)}</strong><p>${escapeHtml(c.activeNote)}</p></div><span>${resolved}/${operation.scenarioIds.length}</span></aside>` : ""}
    <section class="festival-live-links">
      <a href="${siteHref("map")}">${escapeHtml(c.openMap)} <span>${overlay.closedEdges?.length || 0}</span></a>
      <a href="clinic.html#clinic">${escapeHtml(c.openClinic)} <span>${plan.metrics.clinicArrivals}</span></a>
    </section>`;
}

function incidentsPanel(operation, locale, c) {
  return `
    <section class="festival-incidents">
      <header><div><p>FIELD CASES / ${operation.responses.length}—${operation.scenarioIds.length}</p><h3>${escapeHtml(c.fieldCases)}</h3></div><span>${escapeHtml(c.fieldLead)}</span></header>
      <div>${operation.scenarioIds.map((incidentId, index) => {
        const incident = festivalIncident(incidentId);
        const resolved = operation.responses.find((entry) => entry.incidentId === incidentId);
        return `
          <article class="${resolved ? "is-resolved" : ""}" id="festival-incident-${escapeHtml(incident.id)}">
            <header><i>${escapeHtml(incident.glyph)}</i><div><small>CASE 0${index + 1}</small><h4>${escapeHtml(localized(incident.title, locale))}</h4></div>${resolved ? `<b>${escapeHtml(c.resolved)}</b>` : ""}</header>
            <p>${escapeHtml(localized(incident.body, locale))}</p>
            <div class="festival-response-list">
              ${incident.responses.map((response) => `
                <button type="button" data-festival-response="${escapeHtml(response.id)}" data-incident-id="${escapeHtml(incident.id)}" ${resolved || operation.status === "closed" ? "disabled" : ""} class="${resolved?.responseId === response.id ? "is-selected" : ""}">
                  <span>${escapeHtml(localized(response.label, locale))}</span><b aria-hidden="true">→</b>
                </button>`).join("")}
            </div>
          </article>`;
      }).join("")}</div>
    </section>`;
}

function reportPanel(operation, plan, locale, c) {
  const r = operation.report;
  if (!r) return "";
  return `
    <section class="festival-report">
      <header><div><p>${escapeHtml(c.report)} · ${escapeHtml(operation.id)}</p><h3>${escapeHtml(c.headline)}</h3></div><b>閉</b></header>
      <blockquote>${escapeHtml(localized(r.headline, locale))}</blockquote>
      <dl>
        <div><dt>${escapeHtml(c.reportAttendance)}</dt><dd>${r.attendance} ${escapeHtml(c.people)}</dd></div>
        <div><dt>${escapeHtml(c.reportClinic)}</dt><dd>${r.clinicArrivals} ${escapeHtml(c.people)}</dd></div>
        <div><dt>${escapeHtml(c.reportDelay)}</dt><dd>${r.delay} ${escapeHtml(c.minutes)}</dd></div>
        <div><dt>${escapeHtml(c.reportPower)}</dt><dd>${r.powerPeak}</dd></div>
        <div><dt>${escapeHtml(c.reportDisputes)}</dt><dd>${r.disputes}</dd></div>
      </dl>
      <p>${escapeHtml(c.reportNotice)}</p>
      <button type="button" class="button" data-print-exclude data-festival-print-report="${escapeHtml(operation.id)}">${escapeHtml(c.printReport)}</button>
    </section>`;
}

function operationView(operation, locale, c) {
  const plan = festivalPlan(operation.planId);
  if (!plan) return recordsView(locale, c);
  return `
    <article class="festival-operation-file" id="festival-operation-${escapeHtml(operation.id)}" data-festival-operation-file>
      ${operationSummary(operation, plan, locale, c)}
      <div class="festival-projection-grid">
        ${programmePanel(plan.programme, locale, c)}
        ${mapPanel(plan.draft, locale, c, { live: operation.status === "live" })}
      </div>
      ${incidentsPanel(operation, locale, c)}
      ${operation.status === "live" ? `
        <footer class="festival-close-bar">
          <span>${operation.responses.length}/${operation.scenarioIds.length}</span>
          <button type="button" class="button button-primary" data-festival-close="${escapeHtml(operation.id)}" ${operation.responses.length < operation.scenarioIds.length ? "disabled" : ""}>${escapeHtml(c.closeFestival)} <span aria-hidden="true">→</span></button>
        </footer>` : reportPanel(operation, plan, locale, c)}
    </article>`;
}

function recordsView(locale, c) {
  const plans = festivalPlans().slice().reverse();
  const operations = festivalOperations();
  return `
    <section class="festival-records" id="festival-records">
      <header><div><p>ON-DEVICE FESTIVAL FILES</p><h3>${escapeHtml(c.records)}</h3></div><span>${escapeHtml(c.localOnly)}</span></header>
      ${plans.length ? `<div class="festival-record-list">${plans.map((plan) => {
        const operation = operations.find((entry) => entry.planId === plan.id);
        return `
          <article>
            <span>${escapeHtml(festivalKind(plan.draft.kindId).glyph)}</span>
            <div><small>${escapeHtml(c.planRecord)} · ${escapeHtml(plan.id)}</small><h4>${escapeHtml(plan.draft.title || localized(festivalKind(plan.draft.kindId).name, locale))}</h4><p>${escapeHtml(formatDate(plan.createdAt, locale))}</p></div>
            <strong data-outcome="${escapeHtml(plan.outcome)}">${escapeHtml(localized(festivalOutcomeLabels[plan.outcome], locale))}</strong>
            ${operation ? `<b data-status="${escapeHtml(operation.status)}">${escapeHtml(c.operationRecord)} · ${escapeHtml(localized(festivalOutcomeLabels[operation.status], locale))}</b>` : ""}
            <a href="#${operation ? `festival-operation-${escapeHtml(operation.id)}` : `festival-plan-${escapeHtml(plan.id)}`}">${escapeHtml(c.openFile)} →</a>
          </article>`;
      }).join("")}</div>` : `<div class="festival-empty"><span>門</span><p>${escapeHtml(c.noRecords)}</p></div>`}
      <footer><a href="records.html#data-cabinet">${escapeHtml(c.cabinet)} ↗</a><a href="mytu.html#my-tu">${escapeHtml(c.mytu)} ↗</a></footer>
    </section>`;
}

function printablePermit(plan, locale, c) {
  const wrapper = document.createElement("article");
  wrapper.className = "festival-print-document";
  wrapper.innerHTML = `
    <header><p>TOUHOU UNIVERSITY · JOINT FESTIVAL OPERATIONS</p><h1>${escapeHtml(c.documentTitle)}</h1><strong>${escapeHtml(plan.id)}</strong></header>
    <dl><div><dt>${escapeHtml(c.status)}</dt><dd>${escapeHtml(localized(festivalOutcomeLabels[plan.outcome], locale))}</dd></div><div><dt>${escapeHtml(c.filed)}</dt><dd>${escapeHtml(formatDate(plan.createdAt, locale))}</dd></div></dl>
    ${metricsPanel(assessmentForPlan(plan), locale, c)}
    ${programmePanel(plan.programme, locale, c)}
    ${reviewPanel(assessmentForPlan(plan), locale, c, true)}
    <footer><p>${escapeHtml(c.permitNotice)}</p></footer>`;
  return wrapper;
}

function printableReport(operation, plan, locale, c) {
  const wrapper = document.createElement("article");
  wrapper.className = "festival-print-document";
  wrapper.innerHTML = `
    <header><p>TOUHOU UNIVERSITY · FESTIVAL CLOSING FILE</p><h1>${escapeHtml(c.reportTitle)}</h1><strong>${escapeHtml(operation.id)}</strong></header>
    ${reportPanel(operation, plan, locale, c)}
    ${incidentsPanel(operation, locale, c)}
    <footer><p>${escapeHtml(c.reportNotice)}</p></footer>`;
  return wrapper;
}

function render({ preserveWindow = true } = {}) {
  if (!root) return;
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  renderPreservingState(root, () => {
    let body;
    if (view === "records") body = recordsView(locale, c);
    else if (view === "plan") {
      const plan = festivalPlan(selectedPlanId);
      body = plan ? planView(plan, locale, c) : recordsView(locale, c);
    } else if (view === "operation") {
      const operation = festivalOperation(selectedOperationId);
      body = operation ? operationView(operation, locale, c) : recordsView(locale, c);
    }
    else body = deskView(locale, c);
    root.innerHTML = `${hero(locale, c)}<div class="festival-body">${body}</div>`;
  }, { preserveWindow });
}

function showPlan(id, navigate = true) {
  const plan = festivalPlan(id);
  if (!plan) return;
  selectedPlanId = plan.id;
  selectedOperationId = null;
  view = "plan";
  render({ preserveWindow: false });
  if (navigate) navigateToDeepLink(`festival-plan-${plan.id}`);
}

function showOperation(id, navigate = true) {
  const operation = festivalOperation(id);
  if (!operation) return;
  selectedOperationId = operation.id;
  selectedPlanId = operation.planId;
  view = "operation";
  render({ preserveWindow: false });
  if (navigate) navigateToDeepLink(`festival-operation-${operation.id}`);
}

function recordPlanEvents(plan) {
  const payload = {
    planId: plan.id,
    kindId: plan.draft.kindId,
    outcome: plan.outcome,
    startsAt: plan.draft.startsAt,
  };
  recordCampusEvent("festival.plan.submitted", payload, {
    id: `festival.plan.submitted:${plan.id}`,
    timestamp: plan.createdAt,
  });
  recordCampusEvent("festival.permit.issued", {
    ...payload,
    deskIds: plan.opinions.map(({ deskId }) => deskId),
  }, {
    id: `festival.permit.issued:${plan.id}`,
    timestamp: new Date(new Date(plan.createdAt).getTime() + 1).toISOString(),
  });
}

function bindEvents() {
  root.addEventListener("input", (event) => {
    const form = event.target.closest("[data-festival-form]");
    if (!form) return;
    if (event.target.name === "density") event.target.nextElementSibling.textContent = `${event.target.value}/5`;
    window.clearTimeout(saveTimer);
    currentDraft = draftFromForm(form);
    saveTimer = window.setTimeout(() => saveFestivalDraft(currentDraft), 320);
  });

  root.addEventListener("change", (event) => {
    const form = event.target.closest("[data-festival-form]");
    if (!form) return;
    window.clearTimeout(saveTimer);
    currentDraft = saveFestivalDraft(draftFromForm(form));
    preview = assessFestivalPlan(currentDraft, getLocale());
    render();
  });

  root.addEventListener("click", async (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    if (event.target.closest("[data-festival-save]")) {
      const form = root.querySelector("[data-festival-form]");
      if (!form) return;
      currentDraft = saveFestivalDraft(draftFromForm(form));
      showToast(c.saved);
      return;
    }
    if (event.target.closest("[data-festival-reset]")) {
      currentDraft = resetFestivalDraft(undefined, getLocale());
      preview = assessFestivalPlan(currentDraft, locale);
      render();
      return;
    }
    if (event.target.closest("[data-festival-preview]")) {
      const form = root.querySelector("[data-festival-form]");
      if (!form) return;
      currentDraft = saveFestivalDraft(draftFromForm(form));
      preview = assessFestivalPlan(currentDraft, locale);
      render();
      root.querySelector(".festival-metrics")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const revise = event.target.closest("[data-festival-revise]");
    if (revise) {
      const plan = festivalPlan(revise.dataset.festivalRevise);
      if (!plan) return;
      currentDraft = saveFestivalDraft(plan.draft);
      preview = assessFestivalPlan(currentDraft, locale);
      view = "desk";
      navigateToDeepLink("festival-operations");
      return;
    }
    const response = event.target.closest("[data-festival-response]");
    if (response && selectedOperationId) {
      const operation = respondFestivalIncident(selectedOperationId, response.dataset.incidentId, response.dataset.festivalResponse);
      if (!operation) return;
      recordCampusEvent("festival.incident.resolved", {
        operationId: operation.id,
        planId: operation.planId,
        incidentId: response.dataset.incidentId,
        responseId: response.dataset.festivalResponse,
      }, {
        id: `festival.incident.resolved:${operation.id}:${response.dataset.incidentId}`,
      });
      render();
      return;
    }
    const close = event.target.closest("[data-festival-close]");
    if (close) {
      const result = closeFestivalOperation(close.dataset.festivalClose);
      if (result.error) {
        showToast(c.unresolved);
        return;
      }
      recordCampusEvent("festival.report.closed", {
        operationId: result.operation.id,
        planId: result.plan.id,
        attendance: result.operation.report.attendance,
        clinicArrivals: result.operation.report.clinicArrivals,
        disposition: result.operation.report.disputes ? "contested" : "closed",
      }, {
        id: `festival.report.closed:${result.operation.id}`,
        timestamp: result.operation.closedAt,
      });
      showToast(c.closedToast);
      render();
      return;
    }
    const printPlan = event.target.closest("[data-festival-print-plan]");
    if (printPlan) {
      const plan = festivalPlan(printPlan.dataset.festivalPrintPlan);
      if (plan) printDocument(printablePermit(plan, locale, c), { title: `${plan.id} · ${c.documentTitle}` });
      return;
    }
    const printReport = event.target.closest("[data-festival-print-report]");
    if (printReport) {
      const operation = festivalOperation(printReport.dataset.festivalPrintReport);
      const plan = operation ? festivalPlan(operation.planId) : null;
      if (operation && plan) printDocument(printableReport(operation, plan, locale, c), { title: `${operation.id} · ${c.reportTitle}` });
      return;
    }
    if (event.target.closest("[data-festival-share]")) {
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
      showToast(c.copied);
    }
  });

  root.addEventListener("submit", (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    const planForm = event.target.closest("[data-festival-form]");
    if (planForm) {
      event.preventDefault();
      window.clearTimeout(saveTimer);
      currentDraft = saveFestivalDraft(draftFromForm(planForm));
      const plan = submitFestivalPlan(currentDraft, new Date(), locale);
      recordPlanEvents(plan);
      selectedPlanId = plan.id;
      view = "plan";
      preview = null;
      navigateToDeepLink(`festival-plan-${plan.id}`);
      showToast(c.issued);
      return;
    }
    const startForm = event.target.closest("[data-festival-start]");
    if (startForm) {
      event.preventDefault();
      const data = new FormData(startForm);
      const result = startFestivalOperation(startForm.dataset.festivalStart, {
        role: data.get("role"),
        acknowledged: data.has("acknowledged"),
      });
      if (result.error) {
        showToast(result.error === "revision-blocked" ? c.blocked : c.acknowledgementNeeded);
        return;
      }
      recordCampusEvent("festival.shift.started", {
        operationId: result.operation.id,
        planId: result.plan.id,
        role: result.operation.role,
        routeId: result.plan.draft.routeId,
      }, {
        id: `festival.shift.started:${result.operation.id}`,
        timestamp: result.operation.openedAt,
      });
      showOperation(result.operation.id);
    }
  });
}

function initialView() {
  const route = safeDecodeFragment();
  if (route === "festival-records") {
    view = "records";
    return;
  }
  if (route.startsWith("festival-plan-")) {
    const plan = festivalPlan(route.slice("festival-plan-".length));
    if (plan) {
      selectedPlanId = plan.id;
      view = "plan";
    }
    return;
  }
  if (route.startsWith("festival-operation-")) {
    const operation = festivalOperation(route.slice("festival-operation-".length));
    if (operation) {
      selectedOperationId = operation.id;
      selectedPlanId = operation.planId;
      view = "operation";
    }
  }
}

export function initFestival() {
  root = document.querySelector("[data-festival-app]");
  if (!root) return;
  currentDraft = festivalDraft(getLocale());
  initialView();
  render({ preserveWindow: false });
  bindEvents();

  registerDeepLink("festival-operations", {
    anchor: "#festival-operations",
    position: "always",
    open() {
      view = "desk";
      selectedPlanId = null;
      selectedOperationId = null;
      currentDraft = festivalDraft(getLocale());
      preview = assessFestivalPlan(currentDraft, getLocale());
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("festival-records", {
    anchor: () => document.getElementById("festival-records") || root,
    position: "always",
    open() {
      view = "records";
      selectedPlanId = null;
      selectedOperationId = null;
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("festival-plan-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "festival-operations-focus",
    position: "always",
    open(id) {
      showPlan(id, false);
    },
  });
  registerDeepLink("festival-operation-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "festival-operations-focus",
    position: "always",
    open(id) {
      showOperation(id, false);
    },
  });
  window.addEventListener("tu:languagechange", () => {
    if (view === "desk") preview = assessFestivalPlan(currentDraft, getLocale());
    render();
  });
}
