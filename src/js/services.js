import { trees as catalogTrees } from "../generated/i18n/ui/services.js";
import { mapPlaces } from "../data/services.js";
import {
  liveCampusSnapshot,
  liveDiningMenu,
  liveExamSchedule,
  liveFacilityBoard,
  liveRoomAvailability,
  liveTimetable,
} from "../data/live-campus.js";
import { schools as schoolCatalogues } from "../data/schools.js";
import { getLocale } from "./i18n.js";
import { showToast } from "./ui.js";
import { closeDeepLink, navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { recordCampusEvent } from "./campus-ledger.js";

const copy = catalogTrees["copy"];

function localized(value, locale) {
  return typeof value === "object" ? value[locale] : value;
}

function readStored(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function resolveSchoolId(value) {
  if (schoolCatalogues[value]) return value;
  const normalized = String(value || "").replace(/^School of /, "");
  return (
    Object.entries(schoolCatalogues).find(([, school]) =>
      Object.values(school.name).some((name) => name === value || name.replace(/^School of /, "") === normalized),
    )?.[0] || ""
  );
}

function schoolName(value, locale) {
  const id = resolveSchoolId(value);
  return schoolCatalogues[id]?.name[locale] || value || "—";
}

function reference(prefix) {
  const date = new Date();
  const stamp = `${date.getFullYear().toString().slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}`;
  return `TU-${prefix}-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function initServices() {
  const dialog = document.querySelector("[data-service-dialog]");
  const content = dialog?.querySelector("[data-service-content]");
  const serviceAnchor = document.querySelector("#services") ? "#services" : document.querySelector("#map") ? "#map" : "#main";
  let currentService = null;
  let currentApplicationSchool = null;
  let applicationView = "form";
  let visitView = "form";

  function setHeader(service) {
    const locale = getLocale();
    const [kicker, title, description] = copy[locale][service];
    dialog.querySelector("[data-service-kicker]").textContent = kicker;
    dialog.querySelector("[data-service-title]").textContent = title;
    dialog.querySelector("[data-service-description]").textContent = description;
  }

  function renderApplication() {
    applicationView = "form";
    const locale = getLocale();
    const c = copy[locale];
    const submissions = readStored("tu:application:submissions", []);
    const draft = readStored("tu:application:draft", null);
    const options = Object.entries(schoolCatalogues)
      .map(([id, school]) => `<option value="${id}">${school.name[locale]}</option>`)
      .join("");
    content.innerHTML = `
      <div class="application-local-bar">
        <div>
          <p>ON THIS DEVICE</p>
          <strong>${submissions.length} ${c.recordsUnit}${draft ? ` · ${c.draftPresent}` : ""}</strong>
        </div>
        <button type="button" data-application-records>
          ${c.myApplications} <span>${submissions.length}</span>
        </button>
      </div>
      ${
        currentApplicationSchool
          ? `<div class="application-school-context">
              <span aria-hidden="true">${schoolCatalogues[currentApplicationSchool]?.glyph || "願"}</span>
              <p><strong>${schoolCatalogues[currentApplicationSchool]?.name[locale] || ""}</strong>${c.selectedSchool}</p>
            </div>`
          : ""
      }
      <form class="campus-form application-form" data-application-form>
        <label>${c.name}<input name="name" maxlength="60" required autocomplete="name"></label>
        <label>${c.contact}<input name="contact" maxlength="90" required autocomplete="email"></label>
        <label>${c.origin}<input name="origin" maxlength="80" required></label>
        <label>${c.identity}<input name="identity" maxlength="60" required></label>
        <label class="form-span">${c.school}
          <select name="school" required><option value="">${c.selectSchool}</option>${options}</select>
        </label>
        <label class="form-span">${c.question}<textarea name="question" rows="4" maxlength="1000" required></textarea></label>
        <label class="form-span">${c.method}<textarea name="method" rows="3" maxlength="700" required></textarea></label>
        <label class="form-span">${c.needs}<textarea name="needs" rows="2" maxlength="500"></textarea></label>
        <label class="form-span form-consent"><input type="checkbox" name="consent" required><span>${c.consent}</span></label>
        <div class="form-actions form-span">
          <span>${c.formAutoSave}</span>
          <button class="button button-secondary" type="button" data-save-application>${c.save}</button>
          <button class="button button-primary" type="submit">${c.submit} <span>→</span></button>
        </div>
      </form>`;

    const form = content.querySelector("[data-application-form]");
    if (draft) {
      Object.entries(draft).forEach(([key, value]) => {
        const field = form.elements.namedItem(key);
        if (!field || typeof value !== "string") return;
        if (field.type === "checkbox") field.checked = value === "yes" || value === "on";
        else if (key === "school") field.value = resolveSchoolId(value);
        else field.value = value;
      });
    }
    if (currentApplicationSchool && schoolCatalogues[currentApplicationSchool]) {
      form.elements.school.value = currentApplicationSchool;
    }

    let autosaveTimer;
    const saveDraft = ({ notify = false } = {}) => {
      const values = Object.fromEntries(new FormData(form).entries());
      values.consent = form.elements.consent.checked ? "yes" : "";
      window.localStorage.setItem("tu:application:draft", JSON.stringify(values));
      if (notify) showToast(c.saved);
    };
    form.addEventListener("input", () => {
      window.clearTimeout(autosaveTimer);
      autosaveTimer = window.setTimeout(saveDraft, 220);
    });
    form.addEventListener("change", () => saveDraft());
    content.querySelector("[data-save-application]").addEventListener("click", () => {
      saveDraft({ notify: true });
    });
    content.querySelector("[data-application-records]").addEventListener("click", renderApplicationRecords);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        showToast(c.required);
        return;
      }
      window.clearTimeout(autosaveTimer);
      const id = reference("A");
      const record = { id, submittedAt: new Date().toISOString(), ...Object.fromEntries(new FormData(form).entries()) };
      const storedSubmissions = readStored("tu:application:submissions", []);
      storedSubmissions.push(record);
      window.localStorage.setItem("tu:application:submissions", JSON.stringify(storedSubmissions.slice(-30)));
      window.localStorage.removeItem("tu:application:draft");
      recordCampusEvent(
        "application.submitted",
        { applicationId: id, school: record.school },
        { id: `application.submitted:${id}`, timestamp: record.submittedAt },
      );
      content.innerHTML = `
        <div class="service-success">
          <span aria-hidden="true">✓</span>
          <p>ADMISSIONS 2026</p>
          <h3>${c.accepted}</h3>
          <strong>${id}</strong>
          <p>${c.acceptedBody}</p>
          <div class="service-success-actions">
            <button class="button button-secondary" type="button" data-application-records>${c.myApplications}</button>
            <button class="button button-primary" type="button" data-new-application>${c.newApplication}</button>
          </div>
        </div>`;
      content.querySelector("[data-new-application]").addEventListener("click", renderApplication);
      content.querySelector("[data-application-records]").addEventListener("click", renderApplicationRecords);
    });
  }

  function renderApplicationRecords() {
    applicationView = "records";
    const locale = getLocale();
    const c = copy[locale];
    const submissions = readStored("tu:application:submissions", []);
    const draft = readStored("tu:application:draft", null);
    const formatDate = (value) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "—";
      return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
    };
    content.innerHTML = `
      <section class="application-records">
        <header>
          <div>
            <p>ON THIS DEVICE / LOCAL RECORDS</p>
            <h3>${c.localRecords}</h3>
            <span>${c.localRecordsLead}</span>
          </div>
          <button class="button button-secondary" type="button" data-back-application>${c.backToForm}</button>
        </header>
        ${
          draft
            ? `<button class="application-draft-card" type="button" data-back-application>
                <span>✎</span>
                <div><small>AUTOSAVED DRAFT</small><strong>${c.draftPresent}</strong></div>
                <i aria-hidden="true">→</i>
              </button>`
            : ""
        }
        <div class="application-record-list">
          ${
            submissions.length
              ? submissions
                  .slice()
                  .reverse()
                  .map(
                    (record) => `
                      <article class="application-record-card" data-application-record="${escapeHtml(record.id)}">
                        <header>
                          <div><span>${c.submitted}</span><strong>${escapeHtml(record.id)}</strong></div>
                          <time datetime="${escapeHtml(record.submittedAt)}">${formatDate(record.submittedAt)}</time>
                        </header>
                        <dl>
                          <div><dt>${c.name}</dt><dd>${escapeHtml(record.name)}</dd></div>
                          <div><dt>${c.school}</dt><dd>${escapeHtml(schoolName(record.school, locale))}</dd></div>
                        </dl>
                        <details>
                          <summary>${c.applicationDetail}</summary>
                          <div class="application-record-detail">
                            <p><span>${c.question}</span>${escapeHtml(record.question)}</p>
                            <p><span>${c.method}</span>${escapeHtml(record.method)}</p>
                            ${record.needs ? `<p><span>${c.needs}</span>${escapeHtml(record.needs)}</p>` : ""}
                          </div>
                        </details>
                        <button type="button" class="application-record-delete" data-delete-application="${escapeHtml(record.id)}">
                          ${c.deleteRecord}
                        </button>
                      </article>`,
                  )
                  .join("")
              : `<p class="application-records-empty">${c.noApplications}</p>`
          }
        </div>
      </section>`;
    content.querySelectorAll("[data-back-application]").forEach((button) => {
      button.addEventListener("click", renderApplication);
    });
    content.querySelectorAll("[data-delete-application]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!window.confirm(c.deleteConfirm)) return;
        const next = readStored("tu:application:submissions", []).filter(
          (record) => record.id !== button.dataset.deleteApplication,
        );
        window.localStorage.setItem("tu:application:submissions", JSON.stringify(next));
        recordCampusEvent(
          "application.deleted",
          { applicationId: button.dataset.deleteApplication },
          { id: `application.deleted:${button.dataset.deleteApplication}:${Date.now()}` },
        );
        renderApplicationRecords();
        showToast(c.recordDeleted);
      });
    });
  }

  function renderAvailability() {
    const locale = getLocale();
    const c = copy[locale];
    const facilities = liveFacilityBoard(locale);
    const roomAvailability = liveRoomAvailability();
    const buildings = [...new Set(roomAvailability.map((room) => room.building))];
    content.innerHTML = `
      <section class="facility-live-board">
        <header><p>LIVE CAMPUS / ${facilities[0]?.snapshotKey || ""}</p><h3>${c.liveFacilities}</h3></header>
        <div>${facilities.map((facility) => `
          <article data-open="${facility.open}">
            <span>${facility.open ? c.openNow : c.closedNow}</span>
            <h4>${mapPlaces[facility.id].name[locale]}</h4>
            <dl>
              <div><dt>${c.hoursLabel}</dt><dd>${facility.hours}</dd></div>
              <div><dt>${c.seatsFree}</dt><dd>${facility.availableSeats} / ${facility.capacity}</dd></div>
            </dl>
            <p>${escapeHtml(facility.note)}</p>
          </article>`).join("")}</div>
      </section>
      <div class="room-controls">
        <label>${c.building}
          <select data-room-building>
            <option value="all">${c.allBuildings}</option>
            ${buildings.map((id) => `<option value="${id}">${mapPlaces[id].name[locale]}</option>`).join("")}
          </select>
        </label>
        <span><i></i>${c.availableNow}</span>
      </div>
      <div class="room-list" data-room-list></div>`;
    const list = content.querySelector("[data-room-list]");
    const select = content.querySelector("[data-room-building]");
    const renderRooms = () => {
      const selected = select.value;
      const rooms = roomAvailability
        .filter((room) => room.available && (selected === "all" || room.building === selected))
        .map(
          (room) => `
            <article class="room-card">
              <div><span>${mapPlaces[room.building].name[locale]}</span><strong>${room.code}</strong></div>
              <dl>
                <div><dt>${c.type}</dt><dd>${c[room.kind]}</dd></div>
                <div><dt>${c.seats}</dt><dd>${room.seats}</dd></div>
                <div><dt>${c.freeUntil}</dt><dd>${room.freeUntil}</dd></div>
              </dl>
            </article>`,
        )
        .join("");
      list.innerHTML = rooms || `<p class="room-list-empty">${c.noRooms}</p>`;
    };
    select.addEventListener("change", renderRooms);
    renderRooms();
  }

  function renderVisit() {
    visitView = "form";
    const locale = getLocale();
    const c = copy[locale];
    const nextLocalDay = new Date();
    nextLocalDay.setDate(nextLocalDay.getDate() + 1);
    const tomorrow = [
      nextLocalDay.getFullYear(),
      String(nextLocalDay.getMonth() + 1).padStart(2, "0"),
      String(nextLocalDay.getDate()).padStart(2, "0"),
    ].join("-");
    const visits = readStored("tu:visits", []);
    const draft = readStored("tu:visit:draft", null);
    content.innerHTML = `
      <div class="application-local-bar">
        <div>
          <p>ON THIS DEVICE</p>
          <strong>${visits.length} ${c.visitRecordsUnit}${draft ? ` · ${c.visitDraftPresent}` : ""}</strong>
        </div>
        <button type="button" data-visit-records>
          ${c.myVisits} <span>${visits.length}</span>
        </button>
      </div>
      <form class="campus-form" data-visit-form>
        <label>${c.visitor}<input name="name" maxlength="60" required autocomplete="name"></label>
        <label>${c.contact}<input name="contact" maxlength="90" required></label>
        <label>${c.party}<input name="party" type="number" min="1" max="12" value="1" required></label>
        <label>${c.date}<input name="date" type="date" min="${tomorrow}" required></label>
        <label class="form-span">${c.route}
          <select name="route" required>
            <option value="hakurei">${c.hakureiGate}</option>
            <option value="mountain">${c.mountainGate}</option>
            <option value="pier">${c.mistyPier}</option>
            <option value="sky">${c.skyBerth}</option>
          </select>
        </label>
        <label class="form-span">${c.visitNeeds}<textarea name="needs" rows="3" maxlength="500"></textarea></label>
        <div class="form-actions form-span">
          <span>${c.visitAutoSave}</span>
          <button class="button button-secondary" type="button" data-save-visit>${c.saveVisit}</button>
          <button class="button button-primary" type="submit">${c.reserve} <span>→</span></button>
        </div>
      </form>`;
    const form = content.querySelector("[data-visit-form]");
    if (draft) {
      Object.entries(draft).forEach(([key, value]) => {
        const field = form.elements.namedItem(key);
        if (field && typeof value === "string") field.value = value;
      });
    }
    let autosaveTimer;
    const saveVisitDraft = ({ notify = false } = {}) => {
      const values = Object.fromEntries(new FormData(form).entries());
      window.localStorage.setItem("tu:visit:draft", JSON.stringify(values));
      if (notify) showToast(c.visitSaved);
    };
    form.addEventListener("input", () => {
      window.clearTimeout(autosaveTimer);
      autosaveTimer = window.setTimeout(saveVisitDraft, 220);
    });
    form.addEventListener("change", () => saveVisitDraft());
    content.querySelector("[data-save-visit]").addEventListener("click", () => saveVisitDraft({ notify: true }));
    content.querySelector("[data-visit-records]").addEventListener("click", renderVisitRecords);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        showToast(c.required);
        return;
      }
      window.clearTimeout(autosaveTimer);
      const id = reference("V");
      const record = { id, submittedAt: new Date().toISOString(), ...Object.fromEntries(new FormData(form).entries()) };
      const storedVisits = readStored("tu:visits", []);
      storedVisits.push(record);
      window.localStorage.setItem("tu:visits", JSON.stringify(storedVisits.slice(-30)));
      window.localStorage.removeItem("tu:visit:draft");
      recordCampusEvent(
        "visit.reserved",
        { visitId: id, route: record.route, date: record.date },
        { id: `visit.reserved:${id}`, timestamp: record.submittedAt },
      );
      content.innerHTML = `
        <div class="service-success">
          <span aria-hidden="true">門</span>
          <p>VISITOR PASS</p>
          <h3>${c.reserved}</h3>
          <strong>${id}</strong>
          <p>${c.reservedBody}</p>
          <div class="service-success-actions">
            <button class="button button-secondary" type="button" data-visit-records>${c.myVisits}</button>
            <button class="button button-primary" type="button" data-new-visit>${c.newVisit}</button>
          </div>
        </div>`;
      content.querySelector("[data-visit-records]").addEventListener("click", renderVisitRecords);
      content.querySelector("[data-new-visit]").addEventListener("click", renderVisit);
    });
  }

  function renderVisitRecords() {
    visitView = "records";
    const locale = getLocale();
    const c = copy[locale];
    const visits = readStored("tu:visits", []);
    const draft = readStored("tu:visit:draft", null);
    const routeNames = {
      hakurei: c.hakureiGate,
      mountain: c.mountainGate,
      pier: c.mistyPier,
      sky: c.skyBerth,
    };
    const formatDate = (value, withTime = false) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "—";
      return new Intl.DateTimeFormat(locale, withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "long" }).format(date);
    };
    content.innerHTML = `
      <section class="application-records visit-records">
        <header>
          <div>
            <p>ON THIS DEVICE / VISITOR PASSES</p>
            <h3>${c.visitRecords}</h3>
            <span>${c.visitRecordsLead}</span>
          </div>
          <button class="button button-secondary" type="button" data-back-visit>${c.backToVisit}</button>
        </header>
        ${
          draft
            ? `<button class="application-draft-card" type="button" data-back-visit>
                <span>✎</span>
                <div><small>AUTOSAVED DRAFT</small><strong>${c.visitDraftPresent}</strong></div>
                <i aria-hidden="true">→</i>
              </button>`
            : ""
        }
        <div class="application-record-list">
          ${
            visits.length
              ? visits
                  .slice()
                  .reverse()
                  .map(
                    (record) => `
                      <article class="application-record-card" data-visit-record="${escapeHtml(record.id)}">
                        <header>
                          <div><span>${c.submitted}</span><strong>${escapeHtml(record.id)}</strong></div>
                          <time datetime="${escapeHtml(record.submittedAt)}">${formatDate(record.submittedAt, true)}</time>
                        </header>
                        <dl>
                          <div><dt>${c.visitor}</dt><dd>${escapeHtml(record.name)}</dd></div>
                          <div><dt>${c.date}</dt><dd>${formatDate(`${record.date}T12:00:00`)}</dd></div>
                          <div><dt>${c.party}</dt><dd>${escapeHtml(record.party)}</dd></div>
                          <div><dt>${c.route}</dt><dd>${escapeHtml(routeNames[record.route] || record.route || "—")}</dd></div>
                        </dl>
                        ${
                          record.needs
                            ? `<details>
                                <summary>${c.visitDetail}</summary>
                                <div class="application-record-detail"><p><span>${c.visitNeeds}</span>${escapeHtml(record.needs)}</p></div>
                              </details>`
                            : ""
                        }
                        <button type="button" class="application-record-delete" data-delete-visit="${escapeHtml(record.id)}">
                          ${c.deleteVisit}
                        </button>
                      </article>`,
                  )
                  .join("")
              : `<p class="application-records-empty">${c.noVisits}</p>`
          }
        </div>
      </section>`;
    content.querySelectorAll("[data-back-visit]").forEach((button) => {
      button.addEventListener("click", renderVisit);
    });
    content.querySelectorAll("[data-delete-visit]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!window.confirm(c.deleteVisitConfirm)) return;
        const next = readStored("tu:visits", []).filter((record) => record.id !== button.dataset.deleteVisit);
        window.localStorage.setItem("tu:visits", JSON.stringify(next));
        recordCampusEvent(
          "visit.deleted",
          { visitId: button.dataset.deleteVisit },
          { id: `visit.deleted:${button.dataset.deleteVisit}:${Date.now()}` },
        );
        renderVisitRecords();
        showToast(c.visitDeleted);
      });
    });
  }

  function renderTable(headers, rows) {
    return `
      <div class="table-scroll">
        <table class="campus-table">
          <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>`;
  }

  function renderDining() {
    const locale = getLocale();
    const c = copy[locale];
    const state = liveCampusSnapshot();
    content.innerHTML = `
      <p class="service-live-note"><i></i>${state.weather[locale]} · ${state.activeEvents.map((event) => event.rule[locale]).join(" · ")}</p>
      ${renderTable([c.menu, c.contents, c.price, c.note], liveDiningMenu(locale))}`;
  }

  function renderTimetable() {
    const locale = getLocale();
    const c = copy[locale];
    content.innerHTML = renderTable([c.time, c.course, c.room, c.instructor, c.change], liveTimetable(locale));
  }

  function renderExams() {
    const locale = getLocale();
    const c = copy[locale];
    content.innerHTML = renderTable([c.date, c.examination, c.venue, c.format], liveExamSchedule(locale));
  }

  const renderers = {
    application: renderApplication,
    availability: renderAvailability,
    visit: renderVisit,
    dining: renderDining,
    timetable: renderTimetable,
    exams: renderExams,
  };

  function openService(service, { applicationSchool = null } = {}) {
    if (!renderers[service] || !dialog) return;
    currentService = service;
    if (service === "application") {
      currentApplicationSchool = resolveSchoolId(applicationSchool);
      applicationView = "form";
    }
    if (service === "visit") visitView = "form";
    setHeader(service);
    renderers[service]();
    if (!dialog.open) dialog.showModal();
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-service]");
    if (!trigger) return;
    event.preventDefault();
    const prospectusDialog = document.querySelector("[data-prospectus-dialog]");
    if (prospectusDialog?.open) prospectusDialog.close();
    const schoolSuffix = trigger.dataset.applicationSchool ? `--${trigger.dataset.applicationSchool}` : "";
    navigateToDeepLink(`service-${trigger.dataset.service}${schoolSuffix}`);
  });
  registerDeepLink("service-", {
    anchor: serviceAnchor,
    dialog,
    open(value) {
      const [service, applicationSchool] = value.split("--");
      openService(service, { applicationSchool });
    },
    close() {
      if (dialog?.open) dialog.close();
    },
  });
  document.querySelector("[data-service-close]")?.addEventListener("click", () => {
    closeDeepLink("service-", serviceAnchor);
  });
  dialog?.addEventListener("close", () => closeDeepLink("service-", serviceAnchor));
  window.addEventListener("tu:languagechange", () => {
    if (!currentService) return;
    const openApplicationForm = content?.querySelector("[data-application-form]");
    if (openApplicationForm) {
      const values = Object.fromEntries(new FormData(openApplicationForm).entries());
      values.consent = openApplicationForm.elements.consent.checked ? "yes" : "";
      window.localStorage.setItem("tu:application:draft", JSON.stringify(values));
    }
    const openVisitForm = content?.querySelector("[data-visit-form]");
    if (openVisitForm) {
      window.localStorage.setItem(
        "tu:visit:draft",
        JSON.stringify(Object.fromEntries(new FormData(openVisitForm).entries())),
      );
    }
    setHeader(currentService);
    if (currentService === "application" && applicationView === "records") renderApplicationRecords();
    else if (currentService === "visit" && visitView === "records") renderVisitRecords();
    else renderers[currentService]();
  });
}
