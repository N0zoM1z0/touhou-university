import { trees as catalogTrees } from "../generated/i18n/ui/orientation.js";
import {
  orientationFirstStops,
  orientationLocalized,
  orientationNoticePlan,
  orientationNoticePlans,
  orientationSeason,
  orientationStopSignal,
  orientationStopSignals,
} from "../data/orientation.js";
import { transportModes } from "../data/routes.js";
import { mapPlaces } from "../data/services.js";
import { schools } from "../data/schools.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { getLocale } from "./i18n.js";
import {
  activeOrientationDossier,
  completeOrientation,
  confirmOrientationArrival,
  confirmOrientationBoundary,
  orientationDossier,
  orientationEligibility,
  orientationStats,
  startOrientationDossier,
} from "./orientation-model.js";
import { printDocument } from "./print-document.js";
import { renderPreservingState } from "./render-state.js";
import { siteHref } from "./site-router.js";
import { showToast } from "./ui.js";

let root;
let selectedDossierId = null;

const copy = catalogTrees["copy"];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

function formatDate(value, locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "zh-Hant" ? "zh-TW" : locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function outcomeLabel(outcome, c) {
  return outcome === "admitted" ? c.admittedLabel : outcome || "—";
}

function contextAction(context, c) {
  if (context.status === "identity-missing") return [c.goMyTu, "my-tu"];
  if (context.status === "application-missing") return [c.goApplication, "service-application"];
  if (["review-missing", "conditional"].includes(context.status)) return [c.goMyTu, "my-tu"];
  return [c.goAdmissions, "admissions"];
}

function preview(context, locale, c) {
  const [action, route] = contextAction(context, c);
  const statusText = c[context.status.replace(/-([a-z])/g, (_, character) => character.toUpperCase())] || c.notAdmitted;
  return `
    <section class="orientation-public-file" aria-labelledby="orientation-public-title">
      <div class="orientation-public-status">
        <p>${c.publicFile}</p>
        <h3 id="orientation-public-title">${c.status}</h3>
        <strong>${statusText}</strong>
        ${context.eligible ? "" : `<a class="button button-primary" href="${siteHref(route)}">${action}<span aria-hidden="true">→</span></a>`}
        <small>${c.privacy}</small>
      </div>
      <div class="orientation-rules">
        <header><p>THREE REQUIRED FIELDS</p><h3>${c.threeThings}</h3><span>${c.threeLead}</span></header>
        <ol>
          <li><b>01</b><div><h4>${c.ruleOne}</h4><p>${c.ruleOneBody}</p></div></li>
          <li><b>02</b><div><h4>${c.ruleTwo}</h4><p>${c.ruleTwoBody}</p></div></li>
          <li><b>03</b><div><h4>${c.ruleThree}</h4><p>${c.ruleThreeBody}</p></div></li>
        </ol>
      </div>
    </section>
    ${context.eligible ? `<button class="orientation-open-file" type="button" data-orientation-open><span>開</span><strong>${c.openDossier}</strong><small>${escapeHtml(context.application.id)} · ${escapeHtml(schools[context.review.school]?.name?.[locale] || schools[context.application.school]?.name?.[locale] || "")}</small></button>` : ""}
  `;
}

function routeReceipt(dossier, locale, c) {
  if (!dossier.arrival) return "";
  const arrival = dossier.arrival;
  const path = arrival.path.map((id) => mapPlaces[id]?.name?.[locale] || id).join(" → ");
  return `
    <article class="orientation-route-receipt">
      <header><span>${transportModes[arrival.modeId].icon}</span><div><p>${c.routeFiled}</p><h4>${escapeHtml(transportModes[arrival.modeId].name[locale])}</h4></div></header>
      <strong>${escapeHtml(path)}</strong>
      <dl>
        <div><dt>${c.minutes}</dt><dd>${arrival.minutes}</dd></div>
        <div><dt>${c.walking}</dt><dd>${arrival.walkingMinutes}</dd></div>
        <div><dt>${c.distance}</dt><dd>${Math.round(arrival.distance / 10) * 10} m</dd></div>
      </dl>
    </article>`;
}

function radioCards(name, entries, selected, locale) {
  return entries.map((entry) => `
    <label class="orientation-choice ${selected === entry.id ? "selected" : ""}">
      <input type="radio" name="${name}" value="${entry.id}" ${selected === entry.id ? "checked" : ""} required>
      <span aria-hidden="true">${entry.glyph}</span>
      <strong>${escapeHtml(orientationLocalized(entry.name, locale))}</strong>
      <small>${escapeHtml(orientationLocalized(entry.detail, locale))}</small>
    </label>`).join("");
}

function arrivalStep(dossier, locale, c) {
  const selected = dossier.arrival?.modeId || "walk";
  return `
    <section class="orientation-step ${dossier.arrival ? "complete" : ""}" id="orientation-arrival">
      <header><p>${c.stepTwo}</p><div><h3>${c.stepTwoTitle}</h3><span>${c.stepTwoBody}</span></div>${dossier.arrival ? `<b>${c.routeFiled}</b>` : ""}</header>
      <form data-orientation-arrival-form>
        <fieldset><legend>${c.chooseMode}</legend><div class="orientation-mode-grid">
          ${Object.entries(transportModes).map(([id, mode]) => `
            <label class="orientation-mode ${selected === id ? "selected" : ""}">
              <input type="radio" name="modeId" value="${id}" ${selected === id ? "checked" : ""} required>
              <span>${mode.icon}</span><strong>${escapeHtml(mode.name[locale])}</strong><small>${escapeHtml(mode.notice[locale])}</small>
            </label>`).join("")}
        </div></fieldset>
        <button class="button button-primary" type="submit">${c.confirmArrival}<span aria-hidden="true">→</span></button>
        <a href="${siteHref("map")}">${c.openMap}</a>
      </form>
      ${routeReceipt(dossier, locale, c)}
    </section>`;
}

function boundaryStep(dossier, locale, c) {
  if (!dossier.arrival) return "";
  return `
    <section class="orientation-step ${dossier.boundary ? "complete" : ""}" id="orientation-boundary">
      <header><p>${c.stepThree}</p><div><h3>${c.stepThreeTitle}</h3><span>${c.stepThreeBody}</span></div>${dossier.boundary ? `<b>${c.boundaryFiled}</b>` : ""}</header>
      <form data-orientation-boundary-form>
        <fieldset><legend>${c.signal}</legend><div class="orientation-choice-grid">
          ${radioCards("signalId", orientationStopSignals, dossier.boundary?.signalId, locale)}
        </div></fieldset>
        <fieldset><legend>${c.notice}</legend><div class="orientation-choice-grid">
          ${radioCards("noticeId", orientationNoticePlans, dossier.boundary?.noticeId, locale)}
        </div></fieldset>
        <button class="button button-primary" type="submit">${c.confirmBoundary}<span aria-hidden="true">→</span></button>
      </form>
    </section>`;
}

function firstStopStep(dossier, locale, c) {
  if (!dossier.boundary) return "";
  return `
    <section class="orientation-step orientation-first-stop" id="orientation-first-bell">
      <header><p>${c.stepFour}</p><div><h3>${c.stepFourTitle}</h3><span>${c.stepFourBody}</span></div></header>
      <form data-orientation-complete-form>
        <fieldset><legend>${c.firstStop}</legend><div class="orientation-first-grid">
          ${radioCards("firstStopId", orientationFirstStops, dossier.firstStopId, locale)}
        </div></fieldset>
        <button class="orientation-bell" type="submit"><span aria-hidden="true">鐘</span><strong>${c.ringBell}</strong><i aria-hidden="true"></i></button>
      </form>
    </section>`;
}

function completedFile(dossier, context, locale, c) {
  const firstStop = orientationFirstStops.find(({ id }) => id === dossier.firstStopId);
  const signal = orientationStopSignal(dossier.boundary.signalId);
  const notice = orientationNoticePlan(dossier.boundary.noticeId);
  const destination = mapPlaces[dossier.arrival.destinationId];
  return `
    <section class="orientation-complete" id="orientation-dossier-${dossier.id}">
      <div class="orientation-complete-copy">
        <p>${c.completeEyebrow}</p><h3>${c.completeTitle}</h3><span>${c.completeLead}</span>
        <div class="orientation-complete-actions">
          <a class="button button-primary" href="${siteHref(firstStop.route)}">${c.depart}<span aria-hidden="true">→</span></a>
          <button class="button button-secondary" type="button" data-orientation-print>${c.print}</button>
          <a href="${siteHref("bbs")}">${c.openBbs}</a>
        </div>
      </div>
      <article class="orientation-arrival-document" data-orientation-document>
        <header><div><small>幻想鄉立東方大學</small><strong>TOUHOU UNIVERSITY</strong></div><span>東</span></header>
        <p>FIRST BELL 2026 / NEW STUDENT ARRIVAL</p>
        <h4>${escapeHtml(orientationLocalized(orientationSeason.title, locale))}</h4>
        <dl>
          <div><dt>${c.student}</dt><dd>${escapeHtml(context.identity?.name || dossier.identityId)}</dd></div>
          <div><dt>${c.school}</dt><dd>${escapeHtml(schools[dossier.schoolId]?.name?.[locale] || dossier.schoolId)}</dd></div>
          <div><dt>${c.firstDestination}</dt><dd>${escapeHtml(orientationLocalized(firstStop.name, locale))}</dd></div>
          <div><dt>${c.routeFiled}</dt><dd>${escapeHtml(destination?.name?.[locale] || dossier.arrival.destinationId)} · ${dossier.arrival.minutes} min</dd></div>
          <div><dt>${c.stopSignal}</dt><dd>${escapeHtml(orientationLocalized(signal.name, locale))}</dd></div>
          <div><dt>${c.noticePlan}</dt><dd>${escapeHtml(orientationLocalized(notice.name, locale))}</dd></div>
          <div><dt>${c.filedAt}</dt><dd>${escapeHtml(formatDate(dossier.completedAt, locale))}</dd></div>
        </dl>
        <footer><code>${escapeHtml(dossier.id)}</code><b>到</b></footer>
      </article>
    </section>`;
}

function dossierView(dossier, context, locale, c) {
  if (dossier.status === "matriculated") return completedFile(dossier, context, locale, c);
  const school = schools[dossier.schoolId];
  return `
    <section class="orientation-dossier" id="orientation-dossier-${dossier.id}">
      <header><div><p>${c.dossier}</p><h3>${c.dossierTitle}</h3></div><span><small>${c.status}</small><b>${c.issued}</b><code>${escapeHtml(dossier.id)}</code></span></header>
      <section class="orientation-admission-edition">
        <div><p>${c.stepOne}</p><h3>${c.stepOneTitle}</h3><span>${c.stepOneBody}</span></div>
        <article>
          <dl>
            <div><dt>${c.student}</dt><dd>${escapeHtml(context.identity?.name || dossier.identityId)}</dd></div>
            <div><dt>${c.school}</dt><dd>${escapeHtml(school?.name?.[locale] || dossier.schoolId)}</dd></div>
            <div><dt>${c.application}</dt><dd><code>${escapeHtml(dossier.applicationId)}</code></dd></div>
            <div><dt>${c.review}</dt><dd><code>${escapeHtml(dossier.reviewId)}</code></dd></div>
            <div><dt>${c.decision}</dt><dd><strong>${escapeHtml(outcomeLabel(dossier.admissionOutcome, c))}</strong></dd></div>
          </dl>
          <blockquote><small>${c.question}</small>${escapeHtml(context.application?.question || c.noQuestion)}</blockquote>
        </article>
      </section>
      ${arrivalStep(dossier, locale, c)}
      ${boundaryStep(dossier, locale, c)}
      ${firstStopStep(dossier, locale, c)}
    </section>`;
}

function render() {
  if (!root) return;
  const locale = getLocale();
  const c = copy[locale];
  const context = orientationEligibility();
  const active = selectedDossierId ? orientationDossier(selectedDossierId) : activeOrientationDossier();
  const dossier = active && context.identity?.id === active.identityId ? active : null;
  const stats = orientationStats();
  renderPreservingState(root, () => {
    root.innerHTML = `
      <div class="orientation-body">
        <header class="orientation-hero">
          <div><p>${c.eyebrow}</p><h2>${c.title}</h2><span>${c.lead}</span></div>
          <aside><p>${c.office}</p><strong>${c.officeTitle}</strong><dl><div><dt>${c.window}</dt><dd>${escapeHtml(orientationLocalized(orientationSeason.window, locale))}</dd></div><div><dt>${c.records}</dt><dd>${stats.total}</dd></div><div><dt>${c.openFiles}</dt><dd>${stats.open}</dd></div></dl><i>一</i></aside>
        </header>
        ${dossier ? dossierView(dossier, context, locale, c) : preview(context, locale, c)}
        <p class="orientation-privacy">${c.privacy}</p>
      </div>`;
  }, { preserveWindow: true });
}

function recordOpened(dossier) {
  recordCampusEvent("orientation.dossier.opened", {
    dossierId: dossier.id,
    identityId: dossier.identityId,
    applicationId: dossier.applicationId,
    schoolId: dossier.schoolId,
  }, { id: `orientation.dossier.opened:${dossier.id}`, timestamp: dossier.createdAt });
}

function bind() {
  root.addEventListener("change", (event) => {
    const card = event.target.closest(".orientation-choice, .orientation-mode");
    if (!card) return;
    const group = card.parentElement;
    group?.querySelectorAll(".selected").forEach((entry) => entry.classList.remove("selected"));
    card.classList.add("selected");
  });
  root.addEventListener("click", (event) => {
    if (event.target.closest("[data-orientation-open]")) {
      const result = startOrientationDossier();
      if (!result.dossier) return;
      selectedDossierId = result.dossier.id;
      recordOpened(result.dossier);
      render();
      navigateToDeepLink(`orientation-dossier-${result.dossier.id}`);
      return;
    }
    if (event.target.closest("[data-orientation-print]")) {
      const documentElement = root.querySelector("[data-orientation-document]");
      if (documentElement) printDocument(documentElement, { title: `${selectedDossierId || activeOrientationDossier()?.id} · First Bell` });
    }
  });
  root.addEventListener("submit", (event) => {
    const dossier = selectedDossierId ? orientationDossier(selectedDossierId) : activeOrientationDossier();
    if (!dossier) return;
    const locale = getLocale();
    const c = copy[locale];
    if (event.target.matches("[data-orientation-arrival-form]")) {
      event.preventDefault();
      const modeId = new FormData(event.target).get("modeId");
      const result = confirmOrientationArrival(dossier.id, modeId);
      if (!result.dossier) {
        showToast(c.routeClosed);
        return;
      }
      recordCampusEvent("orientation.arrival.confirmed", {
        dossierId: dossier.id,
        modeId: result.dossier.arrival.modeId,
        destinationId: result.dossier.arrival.destinationId,
      }, {
        id: `orientation.arrival.confirmed:${dossier.id}`,
        timestamp: result.dossier.arrival.confirmedAt,
        causationId: `orientation.dossier.opened:${dossier.id}`,
      });
      showToast(c.arrivalSaved);
      render();
      navigateToDeepLink("orientation-boundary");
      return;
    }
    if (event.target.matches("[data-orientation-boundary-form]")) {
      event.preventDefault();
      const form = new FormData(event.target);
      const result = confirmOrientationBoundary(dossier.id, { signalId: form.get("signalId"), noticeId: form.get("noticeId") });
      if (!result.dossier) {
        showToast(c.required);
        return;
      }
      recordCampusEvent("orientation.boundary.confirmed", {
        dossierId: dossier.id,
        signalId: result.dossier.boundary.signalId,
        noticeId: result.dossier.boundary.noticeId,
      }, {
        id: `orientation.boundary.confirmed:${dossier.id}`,
        timestamp: result.dossier.boundary.confirmedAt,
        causationId: `orientation.arrival.confirmed:${dossier.id}`,
      });
      showToast(c.boundarySaved);
      render();
      navigateToDeepLink("orientation-first-bell");
      return;
    }
    if (event.target.matches("[data-orientation-complete-form]")) {
      event.preventDefault();
      const firstStopId = new FormData(event.target).get("firstStopId");
      const result = completeOrientation(dossier.id, firstStopId);
      if (!result.dossier || result.error) {
        showToast(c.required);
        return;
      }
      recordCampusEvent("orientation.matriculated", {
        dossierId: dossier.id,
        schoolId: result.dossier.schoolId,
        firstStopId: result.dossier.firstStopId,
      }, {
        id: `orientation.matriculated:${dossier.id}`,
        timestamp: result.dossier.completedAt,
        causationId: `orientation.boundary.confirmed:${dossier.id}`,
      });
      showToast(c.completedToast);
      render();
      navigateToDeepLink(`orientation-dossier-${dossier.id}`);
    }
  });
}

export function initOrientation() {
  root = document.querySelector("[data-orientation-app]");
  if (!root) return;
  selectedDossierId = activeOrientationDossier()?.id || null;
  bind();
  registerDeepLink("orientation-dossier-", {
    anchor: () => root,
    open(id) {
      if (!orientationDossier(id)) return;
      selectedDossierId = id;
      render();
    },
  });
  window.addEventListener("tu:languagechange", render);
  render();
}
