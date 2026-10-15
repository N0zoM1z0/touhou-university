import { trees as catalogTrees } from "../generated/i18n/ui/housing.js";
import {
  housingFacets,
  housingRooms,
  residenceById,
  residences,
  roommateById,
} from "../data/housing.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { getLocale } from "./i18n.js";
import {
  acceptHousingOffer,
  activeHousingAssignment,
  cancelHousingRoomChange,
  clearHousingDraft,
  confirmHousingAgreement,
  declineHousingOffer,
  housingApplications,
  housingDraft,
  housingIdentity,
  housingRoomChanges,
  latestHousingApplication,
  roomForAssignment,
  saveHousingDraft,
  submitHousingApplication,
  submitHousingRoomChange,
} from "./housing-model.js";
import { renderPreservingState } from "./render-state.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

const copy = catalogTrees["copy"];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));
}

function formatDate(value, locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function optionMarkup(options, selected) {
  return Object.entries(options).map(([value, label]) =>
    `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`).join("");
}

function currentTab() {
  const hash = safeDecodeFragment();
  if (hash === "housing-application") return "application";
  if (hash === "housing-account") return "account";
  return "overview";
}

function selectedResidenceId() {
  const hash = safeDecodeFragment();
  const match = hash.match(/^housing-residence-(.+)$/);
  return residenceById(match?.[1])?.id || residences[0].id;
}

function setRoute(route) {
  const previous = window.location.href;
  const next = new URL(previous);
  next.hash = route;
  window.history.replaceState({ ...(window.history.state || {}), route }, "", next);
  window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL: previous, newURL: next.href }));
}

function hero(locale, c) {
  const lowest = Math.min(...housingRooms.map((room) => room.fee));
  const open = housingRooms.reduce((sum, room) => sum + room.openBeds, 0);
  return `
    <section class="housing-hero">
      <div class="housing-hero-art" aria-hidden="true">
        <span class="housing-moon"></span><i></i><i></i><i></i><i></i><i></i>
        <b>入<br>寮<br>案<br>内</b>
      </div>
      <div class="housing-hero-copy">
        <p>${c.eyebrow}</p><h2>${c.title}</h2><span>${c.lead}</span>
        <dl>
          <div><dt>${c.term}</dt><dd>09.06</dd></div>
          <div><dt>${c.residences}</dt><dd>${residences.length}</dd></div>
          <div><dt>${c.openBeds}</dt><dd>${open}</dd></div>
          <div><dt>${c.monthlyFrom}</dt><dd>¥${lowest.toLocaleString(locale)}</dd></div>
        </dl>
      </div>
    </section>`;
}

function tabs(active, c) {
  const records = housingApplications().length;
  const assignment = activeHousingAssignment();
  return `
    <nav class="housing-tabs" aria-label="${c.eyebrow}">
      ${["overview", "application", "account"].map((tab, index) => `
        <button type="button" data-housing-tab="${tab}" aria-selected="${active === tab}">
          <span>0${index + 1}</span>${c.tabs[index]}
          ${tab === "application" && records ? `<b>${records}</b>` : tab === "account" && assignment ? "<b>1</b>" : ""}
        </button>`).join("")}
    </nav>`;
}

function roomLine(room, locale, c) {
  return `<li><strong>${escapeHtml(room.id)} · ${housingFacets.roomTypes[room.type][locale]}</strong><span>${room.beds} ${c.beds} · ${room.openBeds} ${c.open} · ¥${room.fee.toLocaleString(locale)} ${c.month}</span></li>`;
}

function overviewView(locale, c) {
  const selected = selectedResidenceId();
  const residence = residenceById(selected);
  const rooms = housingRooms.filter((room) => room.residence === selected);
  return `
    <header class="housing-view-heading"><div><p>RESIDENCE FILES</p><h3>${c.overview}</h3></div><span>${c.overviewLead}</span></header>
    <div class="housing-overview">
      <div class="residence-list" data-preserve-scroll="residence-list">
        ${residences.map((item) => {
          const hallRooms = housingRooms.filter((room) => room.residence === item.id);
          return `<button type="button" data-residence-select="${item.id}" aria-pressed="${item.id === selected}">
            <i>${item.mark}</i><span><strong>${item.name[locale]}</strong><small>${item.area[locale]}</small></span>
            <b>${hallRooms.reduce((sum, room) => sum + room.openBeds, 0)} ${c.open}</b>
          </button>`;
        }).join("")}
      </div>
      <article class="residence-file" data-residence-file="${residence.id}">
        <header><span>${residence.mark}</span><div><p>${c.details} · ${residence.id.toUpperCase()}</p><h3>${residence.name[locale]}</h3><small>${residence.area[locale]}</small></div></header>
        <p class="residence-description">${residence.description[locale]}</p>
        <dl class="residence-facts">
          <div><dt>${c.distance}</dt><dd>${residence.distance[locale]}</dd></div>
          <div><dt>${c.warden}</dt><dd>${residence.warden[locale]}</dd></div>
        </dl>
        <div class="residence-room-features">
          <section><h4>${c.roomTypes}</h4><ul>${rooms.map((room) => roomLine(room, locale, c)).join("")}</ul></section>
          <section><h4>${c.features}</h4><ul class="housing-feature-list">${residence.features.map((id) => `<li>${housingFacets.features[id][locale]}</li>`).join("")}</ul></section>
        </div>
        <aside><span>${c.notice}</span><p>「${residence.notice[locale]}」</p></aside>
        <button class="button button-primary" type="button" data-housing-apply-residence="${residence.id}">${c.applyHere} <span aria-hidden="true">→</span></button>
      </article>
    </div>`;
}

function selectField(name, label, options, value) {
  return `<label><span>${label}</span><select name="${name}">${optionMarkup(options, value)}</select></label>`;
}

function defaultPreferences() {
  const draft = housingDraft()?.preferences;
  return draft || {
    firstResidence: residences[0].id, secondResidence: residences[1].id, roomType: "any", budget: "19000",
    sleep: "early", noise: "quiet", cleanliness: "neat", cooking: "shared", moon: "ordinary",
    water: "dry", flight: "ground", wall: "solid", familiar: "none", danmaku: "outdoors", note: "",
  };
}

function applicationForm(locale, c, firstChoice = null) {
  const identity = housingIdentity();
  const p = defaultPreferences();
  if (firstChoice) p.firstResidence = firstChoice;
  if (!identity) return `
    <section class="housing-empty housing-identity-needed">
      <span aria-hidden="true">學</span><div><h3>${c.applicationTitle}</h3><p>${c.identityNeeded}</p></div>
      <a class="button button-primary" href="mytu.html#my-tu">${c.createIdentity} <span aria-hidden="true">→</span></a>
    </section>`;
  const residenceOptions = Object.fromEntries(residences.map((residence) => [residence.id, residence.name[locale]]));
  const roomOptions = { any: c.anyRoom, ...Object.fromEntries(Object.entries(housingFacets.roomTypes).map(([id, label]) => [id, label[locale]])) };
  const budgets = { 15000: "¥15,000", 18000: "¥18,000", 21000: "¥21,000", 25000: "¥25,000" };
  return `
    <header class="housing-view-heading"><div><p>HOUSING NEEDS FORM</p><h3>${c.applicationTitle}</h3></div><span>${c.applicationLead}</span></header>
    <form class="housing-form" data-housing-form>
      <div class="housing-form-stamp"><span>${c.applicant}</span><strong>${escapeHtml(identity.name || identity.id)}</strong><code>${escapeHtml(identity.id)}</code></div>
      <fieldset><legend>01 / ${c.applicationTitle}</legend>
        <div class="housing-form-grid">
          ${selectField("firstResidence", c.firstResidence, residenceOptions, p.firstResidence)}
          ${selectField("secondResidence", c.secondResidence, residenceOptions, p.secondResidence)}
          ${selectField("roomType", c.roomType, roomOptions, p.roomType)}
          ${selectField("budget", c.budget, budgets, String(p.budget))}
        </div>
      </fieldset>
      <fieldset><legend>02 / ${c.habits}</legend>
        <div class="housing-form-grid housing-needs-grid">
          ${["sleep", "noise", "cleanliness", "cooking", "moon", "water", "flight", "wall", "familiar", "danmaku"].map((field) =>
            selectField(field, c[field], c.options[field], p[field])).join("")}
        </div>
      </fieldset>
      <label class="housing-note"><span>${c.note}</span><textarea name="note" rows="4" maxlength="700" placeholder="${c.notePlaceholder}">${escapeHtml(p.note)}</textarea></label>
      <footer><span>${c.draft}</span><button class="button button-secondary" type="button" data-housing-clear>${c.clear}</button><button class="button button-primary" type="submit">${c.submit} <span aria-hidden="true">→</span></button></footer>
    </form>`;
}

function reasonList(codes, source) {
  return codes.length ? `<ul>${codes.map((code) => `<li>${source[code] || code}</li>`).join("")}</ul>` : "—";
}

function offerCard(application, offer, locale, c, index) {
  const room = housingRooms.find((record) => record.id === offer.roomId);
  const residence = residenceById(offer.residenceId);
  const roommate = roommateById(offer.roommateId);
  const declined = application.declinedOfferIds?.includes(offer.id);
  const accepted = application.acceptedOfferId === offer.id;
  return `
    <article class="housing-offer ${declined ? "is-declined" : ""}" data-housing-offer="${offer.id}">
      <header><span>0${index + 1}</span><div><p>${residence.name[locale]}</p><h4>${room.id} · ${housingFacets.roomTypes[room.type][locale]}</h4></div><b>${offer.score}<small>% ${c.score}</small></b></header>
      <div class="housing-offer-person">
        <i>${roommate?.seal || "一"}</i><div><span>${c.matchedWith}</span><strong>${roommate ? roommate.name[locale] : c.noRoommate}</strong><small>${roommate ? `${roommate.kind[locale]} · ${roommate.school[locale]}` : residence.area[locale]}</small></div>
      </div>
      ${roommate ? `<p>${roommate.bio[locale]}</p>` : ""}
      <dl><div><dt>${c.fit}</dt><dd>${reasonList(offer.positive, c.reasons)}</dd></div><div><dt>${c.friction}</dt><dd>${reasonList(offer.friction, c.frictions)}</dd></div></dl>
      <footer><span>¥${offer.fee.toLocaleString(locale)} ${c.month}</span>
        ${declined ? `<b>${c.declined}</b>` : application.status === "assigned" ? `<b>${accepted ? c.accepted : c.allocationClosed}</b>` : `<button class="button button-secondary" type="button" data-housing-decline="${offer.id}" data-application-id="${application.id}">${c.decline}</button><button class="button button-primary" type="button" data-housing-accept="${offer.id}" data-application-id="${application.id}">${c.accept}</button>`}
      </footer>
    </article>`;
}

function matchingView(application, locale, c) {
  const records = housingApplications();
  const available = application.offers.filter((offer) => !application.declinedOfferIds?.includes(offer.id));
  return `
    <header class="housing-view-heading"><div><p>${c.applicationRef} · ${escapeHtml(application.id)}</p><h3>${c.matchingTitle}</h3></div><span>${c.matchingLead}</span></header>
    <div class="housing-application-meta"><span>${formatDate(application.submittedAt, locale)}</span><code>${escapeHtml(application.id)}</code>
      ${records.length > 1 ? `<label>${c.chooseApplication}<select data-housing-application-select>${records.slice().reverse().map((record) => `<option value="${escapeHtml(record.id)}" ${record.id === application.id ? "selected" : ""}>${escapeHtml(record.id)} · ${formatDate(record.submittedAt, locale)}</option>`).join("")}</select></label>` : ""}
    </div>
    <div class="housing-offers">${application.offers.map((offer, index) => offerCard(application, offer, locale, c, index)).join("")}</div>
    ${available.length ? "" : `<section class="housing-empty"><span>再</span><div><h3>${c.allDeclined}</h3></div><button class="button button-primary" type="button" data-housing-new>${c.newApplication}</button></section>`}
    ${available.length ? `<button class="housing-new-link" type="button" data-housing-new>${c.newApplication}</button>` : ""}`;
}

function applicationView(locale, c, forceForm, firstChoice, selectedApplicationId) {
  const records = housingApplications();
  const selected = records.find((record) => record.id === selectedApplicationId) || latestHousingApplication();
  if (forceForm || !selected) return applicationForm(locale, c, firstChoice);
  return matchingView(selected, locale, c);
}

function accountView(locale, c) {
  const assignment = activeHousingAssignment();
  if (!assignment) return `
    <header class="housing-view-heading"><div><p>MY HOUSING</p><h3>${c.accountTitle}</h3></div><span>${c.accountLead}</span></header>
    <section class="housing-empty"><span aria-hidden="true">寮</span><div><p>${c.noAssignment}</p></div><button class="button button-primary" type="button" data-housing-tab="application">${c.goApplication} <span aria-hidden="true">→</span></button></section>`;
  const room = roomForAssignment(assignment);
  const residence = residenceById(assignment.residenceId);
  const roommate = roommateById(assignment.roommateId);
  const requests = housingRoomChanges().filter((record) => record.assignmentId === assignment.id).reverse();
  return `
    <header class="housing-view-heading"><div><p>MY HOUSING · ${escapeHtml(assignment.id)}</p><h3>${c.accountTitle}</h3></div><span>${c.accountLead}</span></header>
    <div class="housing-account">
      <section class="housing-room-card">
        <header><span>${residence.mark}</span><div><p>${c.activeRoom}</p><h3>${room.id}</h3><strong>${residence.name[locale]} · ${housingFacets.roomTypes[room.type][locale]}</strong></div></header>
        <dl>
          <div><dt>${c.fee}</dt><dd>¥${assignment.fee.toLocaleString(locale)}</dd></div>
          <div><dt>${c.acceptedOn}</dt><dd>${formatDate(assignment.acceptedAt, locale)}</dd></div>
          <div><dt>${c.moveIn}</dt><dd>${c.moveInDate}</dd></div>
        </dl>
        <ul class="housing-feature-list">${room.features.map((id) => `<li>${housingFacets.features[id][locale]}</li>`).join("")}</ul>
      </section>
      <section class="housing-roommate-card">
        <p>${c.roommateFile}</p>
        <div><i>${roommate?.seal || "一"}</i><h3>${roommate ? roommate.name[locale] : c.noRoommate}</h3></div>
        <span>${roommate ? `${roommate.kind[locale]} · ${roommate.school[locale]}` : residence.area[locale]}</span>
        <p>${roommate ? roommate.bio[locale] : residence.notice[locale]}</p>
      </section>
    </div>
    <section class="housing-agreement">
      <header><div><p>ROOMMATE MEMORANDUM</p><h3>${c.agreement}</h3></div><span>${c.agreementLead}</span></header>
      <ol>${assignment.incidentCodes.map((code) => `<li><span>${String(assignment.incidentCodes.indexOf(code) + 1).padStart(2, "0")}</span><p>${c.incidents[code]}</p></li>`).join("")}</ol>
      <label><input type="checkbox" data-housing-agreement="${assignment.id}" ${assignment.agreementChecked ? "checked" : ""}><span>${c.agreementCheck}</span></label>
    </section>
    <section class="housing-change">
      <header><div><p>ROOM TRANSFER DESK</p><h3>${c.roomChange}</h3></div><span>${c.roomChangeLead}</span></header>
      <form data-housing-change-form>
        ${selectField("reason", c.reason, c.options.reasons, "schedule")}
        ${selectField("urgency", c.urgency, c.options.urgency, "ordinary")}
        <label><span>${c.changeNote}</span><textarea name="note" rows="3" maxlength="600" required></textarea></label>
        <button class="button button-primary" type="submit">${c.sendChange} <span aria-hidden="true">→</span></button>
      </form>
      ${requests.length ? `<div class="housing-change-history"><h4>${c.changeHistory}</h4>${requests.map((request) => {
        const suggestedRoom = request.suggestion ? housingRooms.find((record) => record.id === request.suggestion.roomId) : null;
        const suggestedResidence = request.suggestion ? residenceById(request.suggestion.residenceId) : null;
        return `<article><header><code>${escapeHtml(request.id)}</code><b>${c.status[request.status] || request.status}</b></header><p>${c.options.reasons[request.reason]} · ${c.options.urgency[request.urgency]}</p><span>${escapeHtml(request.note)}</span>
          ${suggestedRoom ? `<small>${c.suggestion}: ${suggestedResidence.name[locale]} · ${suggestedRoom.id} · ${request.suggestion.score}%</small>` : ""}
          ${request.status === "under-review" ? `<button type="button" data-housing-cancel-change="${request.id}">${c.cancelChange}</button>` : ""}</article>`;
      }).join("")}</div>` : ""}
    </section>`;
}

function formPreferences(form) {
  return Object.fromEntries(new FormData(form).entries());
}

export function initHousing() {
  const root = document.querySelector("[data-housing-app]");
  if (!root) return;
  let forceForm = false;
  let firstChoice = null;
  let selectedApplicationId = latestHousingApplication()?.id || null;

  function render({ preserveWindow = false } = {}) {
    const locale = getLocale();
    const c = copy[locale];
    const active = currentTab();
    renderPreservingState(root, () => {
      const routeId = active === "overview" ? `housing-residence-${selectedResidenceId()}` : `housing-${active}`;
      root.innerHTML = `${hero(locale, c)}${tabs(active, c)}<div class="housing-view" id="${routeId}">${
        active === "overview" ? overviewView(locale, c)
          : active === "application" ? applicationView(locale, c, forceForm, firstChoice, selectedApplicationId)
            : accountView(locale, c)
      }</div>`;
    }, { preserveWindow });
  }

  root.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-housing-tab]");
    if (tab) {
      const route = tab.dataset.housingTab === "application" ? "housing-application" : tab.dataset.housingTab === "account" ? "housing-account" : "housing";
      forceForm = false;
      firstChoice = null;
      setRoute(route);
      return;
    }
    const residence = event.target.closest("[data-residence-select]");
    if (residence) {
      setRoute(`housing-residence-${residence.dataset.residenceSelect}`);
      return;
    }
    const apply = event.target.closest("[data-housing-apply-residence]");
    if (apply) {
      firstChoice = apply.dataset.housingApplyResidence;
      forceForm = true;
      setRoute("housing-application");
      return;
    }
    if (event.target.closest("[data-housing-new]")) {
      forceForm = true;
      firstChoice = null;
      render({ preserveWindow: true });
      return;
    }
    if (event.target.closest("[data-housing-clear]")) {
      clearHousingDraft();
      forceForm = true;
      firstChoice = null;
      render({ preserveWindow: true });
      return;
    }
    const accept = event.target.closest("[data-housing-accept]");
    if (accept) {
      const assignment = acceptHousingOffer(accept.dataset.applicationId, accept.dataset.housingAccept);
      if (!assignment) return;
      recordCampusEvent("housing.assignment.accepted", {
        assignmentId: assignment.id,
        applicationId: assignment.applicationId,
        offerId: assignment.offerId,
        roomId: assignment.roomId,
        residenceId: assignment.residenceId,
      }, { id: `housing.assignment.accepted:${assignment.id}`, timestamp: assignment.acceptedAt });
      showToast(copy[getLocale()].accepted);
      setRoute("housing-account");
      return;
    }
    const decline = event.target.closest("[data-housing-decline]");
    if (decline) {
      const application = declineHousingOffer(decline.dataset.applicationId, decline.dataset.housingDecline);
      if (!application) return;
      recordCampusEvent("housing.offer.declined", {
        applicationId: application.id, offerId: decline.dataset.housingDecline,
      }, { id: `housing.offer.declined:${application.id}:${decline.dataset.housingDecline}` });
      showToast(copy[getLocale()].declined);
      render({ preserveWindow: true });
      return;
    }
    const cancel = event.target.closest("[data-housing-cancel-change]");
    if (cancel) {
      const request = cancelHousingRoomChange(cancel.dataset.housingCancelChange);
      if (!request) return;
      recordCampusEvent("housing.change.cancelled", {
        requestId: request.id, assignmentId: request.assignmentId,
      }, { id: `housing.change.cancelled:${request.id}`, timestamp: request.cancelledAt });
      showToast(copy[getLocale()].changeCancelled);
      render({ preserveWindow: true });
    }
  });

  root.addEventListener("input", (event) => {
    const form = event.target.closest("[data-housing-form]");
    if (!form) return;
    saveHousingDraft(formPreferences(form));
  });
  root.addEventListener("change", (event) => {
    const applicationSelect = event.target.closest("[data-housing-application-select]");
    if (applicationSelect) {
      selectedApplicationId = applicationSelect.value;
      render({ preserveWindow: true });
      return;
    }
    const form = event.target.closest("[data-housing-form]");
    if (form) {
      saveHousingDraft(formPreferences(form));
      showToast(copy[getLocale()].draftSaved);
      return;
    }
    const agreement = event.target.closest("[data-housing-agreement]");
    if (agreement) {
      confirmHousingAgreement(agreement.dataset.housingAgreement, agreement.checked);
      showToast(copy[getLocale()].agreementSaved);
    }
  });
  root.addEventListener("submit", (event) => {
    const applicationFormElement = event.target.closest("[data-housing-form]");
    if (applicationFormElement) {
      event.preventDefault();
      const preferences = formPreferences(applicationFormElement);
      if (preferences.firstResidence === preferences.secondResidence) {
        const alternative = residences.find((residence) => residence.id !== preferences.firstResidence);
        preferences.secondResidence = alternative.id;
      }
      const application = submitHousingApplication(preferences);
      selectedApplicationId = application.id;
      recordCampusEvent("housing.application.submitted", {
        applicationId: application.id, firstResidence: preferences.firstResidence, term: application.term,
      }, { id: `housing.application.submitted:${application.id}`, timestamp: application.submittedAt });
      forceForm = false;
      firstChoice = null;
      showToast(copy[getLocale()].submitted);
      render({ preserveWindow: true });
      return;
    }
    const changeForm = event.target.closest("[data-housing-change-form]");
    if (changeForm) {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(changeForm).entries());
      const request = submitHousingRoomChange(payload);
      if (!request) return;
      recordCampusEvent("housing.change.requested", {
        requestId: request.id, assignmentId: request.assignmentId, reason: request.reason,
      }, { id: `housing.change.requested:${request.id}`, timestamp: request.submittedAt });
      showToast(copy[getLocale()].changeSent);
      render({ preserveWindow: true });
    }
  });

  window.addEventListener("hashchange", () => render());
  window.addEventListener("tu:languagechange", () => render({ preserveWindow: true }));
  render();
}
