import { trees as catalogTrees } from "../generated/i18n/ui/library.js";
import { libraryFacets, libraryHolding, libraryHoldings } from "../data/library.js";
import { liveFacilityStatus } from "../data/live-campus.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { getLocale } from "./i18n.js";
import { printDocument } from "./print-document.js";
import { bindImeSafeInput } from "./ime-input.js";
import { renderPreservingState } from "./render-state.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

const LOANS_KEY = "tu:library:loans";
const HOLDS_KEY = "tu:library:holds";
const IDENTITY_KEY = "tu:identity";
const REGISTRATION_KEY = "tu:courses:registration";
const TRANSCRIPT_KEY = "tu:courses:transcript";
const MAX_LOANS = 5;

const copy = catalogTrees["copy"];

let app;
let selectedId = libraryHoldings[0]?.id;
let tab = "catalogue";
let filters = { query: "", school: "", state: "", danger: "" };

function readJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function localeText(value, locale = getLocale()) {
  return value?.[locale] ?? value?.["zh-Hant"] ?? value ?? "";
}

function formatDate(value, locale = getLocale(), withTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, withTime
    ? { dateStyle: "medium", timeStyle: "short" }
    : { dateStyle: "medium" }).format(date);
}

function addDays(value, days) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function makeId(prefix, holdingId) {
  return `${prefix}-${holdingId}-${Date.now().toString(36).toUpperCase()}`;
}

function loans() {
  const records = readJson(LOANS_KEY, []);
  return Array.isArray(records) ? records : [];
}

function holds() {
  const records = readJson(HOLDS_KEY, []);
  return Array.isArray(records) ? records : [];
}

function activeLoan(holdingId) {
  return loans().find((record) => record.holdingId === holdingId && record.status === "active");
}

function activeHold(holdingId) {
  return holds().find((record) => record.holdingId === holdingId && record.status === "active");
}

function activeLoanCount() {
  return loans().filter((record) => record.status === "active").length;
}

function activeHoldCount() {
  return holds().filter((record) => record.status === "active").length;
}

function effectiveState(holding) {
  if (activeLoan(holding.id)) return "onLoan";
  return holding.state;
}

function completedCourses() {
  const transcript = readJson(TRANSCRIPT_KEY, []);
  if (Array.isArray(transcript)) {
    return new Set(transcript.map((entry) => entry.courseCode || entry.code).filter(Boolean));
  }
  return new Set((transcript?.entries || []).map((entry) => entry.courseCode || entry.code).filter(Boolean));
}

function currentCourses() {
  const registration = readJson(REGISTRATION_KEY, []);
  const entries = Array.isArray(registration) ? registration : registration?.entries || [];
  return new Set(entries.filter((entry) => entry.status === "enrolled").map((entry) => entry.courseCode).filter(Boolean));
}

function hasCourseAccess(holding) {
  if (!holding.accessCourses?.length) return true;
  const eligible = new Set([...completedCourses(), ...currentCourses()]);
  return holding.accessCourses.some((code) => eligible.has(code));
}

function canHold(holding) {
  return holding.circulation === "loan" && ["onLoan", "flight", "negotiating"].includes(effectiveState(holding));
}

function filterHoldings(locale) {
  const terms = filters.query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return libraryHoldings.filter((holding) => {
    const haystack = [
      holding.callNumber,
      ...Object.values(holding.title),
      ...Object.values(holding.author),
      ...Object.values(holding.subject),
      ...Object.values(holding.note),
    ].join(" ").toLocaleLowerCase();
    return (!terms.length || terms.every((term) => haystack.includes(term)))
      && (!filters.school || holding.school === filters.school)
      && (!filters.state || effectiveState(holding) === filters.state)
      && (!filters.danger || holding.danger === filters.danger);
  });
}

function buttonFor(holding, locale, c) {
  const identity = readJson(IDENTITY_KEY, null);
  const loan = activeLoan(holding.id);
  const hold = activeHold(holding.id);
  if (loan) {
    const blocked = loan.renewals >= holding.renewalLimit || holds().some((record) => record.holdingId === holding.id && record.status === "active");
    const reason = loan.renewals >= holding.renewalLimit ? c.renewalLimit : c.renewalBlocked;
    return `
      <div class="library-detail-actions">
        <button class="button button-secondary" type="button" data-library-renew="${holding.id}" ${blocked ? `disabled title="${escapeHtml(reason)}"` : ""}>${c.renew} · ${formatDate(loan.dueAt, locale)}</button>
        <button class="button button-primary" type="button" data-library-return="${holding.id}">${c.return} <span aria-hidden="true">↩</span></button>
      </div>`;
  }
  if (hold) {
    return `
      <div class="library-detail-actions">
        <span class="library-queue-ticket">${c.holdPosition}</span>
        <button class="button button-secondary" type="button" data-library-cancel-hold="${holding.id}">${c.cancelHold}</button>
      </div>`;
  }
  if (!identity) {
    return `
      <div class="library-gate">
        <p>${c.identityNeeded}</p>
        <a class="button button-primary" href="mytu.html#my-tu">${c.createIdentity} <span aria-hidden="true">→</span></a>
      </div>`;
  }
  if (!hasCourseAccess(holding)) {
    return `<button class="button button-secondary library-wide-action" type="button" disabled title="${escapeHtml(c.courseNeeded)}">${c.courseNeeded}</button>`;
  }
  if (effectiveState(holding) === "available" && holding.circulation === "loan") {
    const blocked = activeLoanCount() >= MAX_LOANS;
    return `<button class="button button-primary library-wide-action" type="button" data-library-borrow="${holding.id}" ${blocked ? `disabled title="${escapeHtml(c.maxLoans)}"` : ""}>${c.borrow} <span aria-hidden="true">→</span></button>`;
  }
  if (canHold(holding)) {
    return `<button class="button button-primary library-wide-action" type="button" data-library-hold="${holding.id}">${c.placeHold} <span aria-hidden="true">＋</span></button>`;
  }
  return `<button class="button button-secondary library-wide-action" type="button" disabled>${holding.circulation === "reference" ? c.reference : c.unavailable}</button>`;
}

function detailRecord(holding, locale, c) {
  const state = effectiveState(holding);
  const stateLabel = localeText(libraryFacets.states[state], locale);
  const courseGate = holding.accessCourses?.length
    ? `<aside class="library-course-gate ${hasCourseAccess(holding) ? "is-open" : ""}">
        <div aria-hidden="true">${hasCourseAccess(holding) ? "✓" : "封"}</div>
        <p><strong>${c.courseGate} · ${hasCourseAccess(holding) ? c.eligible : c.ineligible}</strong><span>${c.courseGateBody} ${holding.accessCourses.join(" / ")}</span></p>
      </aside>`
    : "";
  return `
    <article class="library-record" id="library-${holding.id}" data-library-record="${holding.id}">
      <header>
        <p>${c.details} / ${escapeHtml(holding.callNumber)}</p>
        <span class="library-state" data-state="${state}">${escapeHtml(stateLabel)}</span>
        <h2>${escapeHtml(localeText(holding.title, locale))}</h2>
        <strong>${escapeHtml(localeText(holding.author, locale))}</strong>
      </header>
      <blockquote>${escapeHtml(localeText(holding.note, locale))}</blockquote>
      <dl>
        <div><dt>${c.callNumber}</dt><dd><code>${escapeHtml(holding.callNumber)}</code></dd></div>
        <div><dt>${c.subject}</dt><dd>${escapeHtml(localeText(holding.subject, locale))}</dd></div>
        <div><dt>${c.edition}</dt><dd>${escapeHtml(localeText(holding.edition, locale))}</dd></div>
        <div><dt>${c.origin}</dt><dd>${escapeHtml(localeText(holding.origin, locale))}</dd></div>
        <div><dt>${c.location}</dt><dd>${escapeHtml(localeText(holding.location, locale))}</dd></div>
        <div><dt>${c.disposition}</dt><dd>${escapeHtml(localeText(libraryFacets.wills[holding.will], locale))}</dd></div>
        <div><dt>${c.danger}</dt><dd>${escapeHtml(localeText(libraryFacets.dangers[holding.danger], locale))}</dd></div>
        <div><dt>${c.terms}</dt><dd>${holding.circulation === "loan" ? `${holding.loanDays} ${c.days} · ${holding.renewalLimit} ${c.renewals}` : c.reference}</dd></div>
      </dl>
      ${courseGate}
      ${state === "moon" ? `<p class="library-lunar-note">☾ ${c.lunarNotice}</p>` : ""}
      ${buttonFor(holding, locale, c)}
    </article>`;
}

function catalogueView(locale, c) {
  const matches = filterHoldings(locale);
  if (!matches.some((holding) => holding.id === selectedId)) selectedId = matches[0]?.id || null;
  const selected = libraryHolding(selectedId);
  return `
    <form class="library-filters" data-library-filters>
      <label class="library-search"><span aria-hidden="true">⌕</span><input type="search" name="query" value="${escapeHtml(filters.query)}" placeholder="${escapeHtml(c.search)}" data-preserve-focus="library-query"></label>
      <label><span class="visually-hidden">${c.allSchools}</span><select name="school" data-preserve-focus="library-school">
        <option value="">${c.allSchools}</option>
        ${Object.entries(libraryFacets.schools).map(([id, label]) => `<option value="${id}" ${filters.school === id ? "selected" : ""}>${escapeHtml(localeText(label, locale))}</option>`).join("")}
      </select></label>
      <label><span class="visually-hidden">${c.allStates}</span><select name="state" data-preserve-focus="library-state">
        <option value="">${c.allStates}</option>
        ${Object.entries(libraryFacets.states).map(([id, label]) => `<option value="${id}" ${filters.state === id ? "selected" : ""}>${escapeHtml(localeText(label, locale))}</option>`).join("")}
      </select></label>
      <label><span class="visually-hidden">${c.allDangers}</span><select name="danger" data-preserve-focus="library-danger">
        <option value="">${c.allDangers}</option>
        ${Object.entries(libraryFacets.dangers).map(([id, label]) => `<option value="${id}" ${filters.danger === id ? "selected" : ""}>${escapeHtml(localeText(label, locale))}</option>`).join("")}
      </select></label>
    </form>
    <div class="library-result-line"><strong>${matches.length} ${c.result}</strong><button type="button" data-library-reset>${c.reset}</button></div>
    <div class="library-catalogue-layout">
      <div class="library-list" role="list" data-preserve-scroll="library-list">
        ${matches.length ? matches.map((holding) => {
          const state = effectiveState(holding);
          return `
            <button class="${holding.id === selectedId ? "is-active" : ""}" type="button" role="listitem" data-library-select="${holding.id}">
              <span class="library-call">${escapeHtml(holding.callNumber)}</span>
              <strong>${escapeHtml(localeText(holding.title, locale))}</strong>
              <small>${escapeHtml(localeText(holding.author, locale))}</small>
              <i data-state="${state}">${escapeHtml(localeText(libraryFacets.states[state], locale))}</i>
              <b aria-hidden="true">→</b>
            </button>`;
        }).join("") : `<p class="library-empty">${c.noResults}</p>`}
      </div>
      <div class="library-detail">${selected && matches.length ? detailRecord(selected, locale, c) : ""}</div>
    </div>`;
}

function loanCard(record, locale, c) {
  const holding = libraryHolding(record.holdingId);
  if (!holding) return "";
  const overdue = record.status === "active" && new Date(record.dueAt) < new Date();
  return `
    <article class="library-loan-card ${overdue ? "is-overdue" : ""}">
      <div>
        <code>${escapeHtml(holding.callNumber)}</code>
        <h4>${escapeHtml(localeText(holding.title, locale))}</h4>
        <p>${c.borrowedOn} ${formatDate(record.borrowedAt, locale)} · <strong>${overdue ? c.overdue : c.due} ${formatDate(record.dueAt, locale)}</strong></p>
      </div>
      ${record.status === "active" ? `
        <div>
          <button type="button" data-library-renew="${holding.id}" ${record.renewals >= holding.renewalLimit ? "disabled" : ""}>${c.renew} ${record.renewals}/${holding.renewalLimit}</button>
          <button type="button" data-library-return="${holding.id}">${c.return}</button>
        </div>` : `<span>${c.returnedStatus} · ${formatDate(record.returnedAt, locale)}</span>`}
    </article>`;
}

function holdCard(record, locale, c) {
  const holding = libraryHolding(record.holdingId);
  if (!holding) return "";
  return `
    <article class="library-loan-card library-hold-card">
      <div>
        <code>${escapeHtml(holding.callNumber)}</code>
        <h4>${escapeHtml(localeText(holding.title, locale))}</h4>
        <p>${c.holdPlaced} ${formatDate(record.placedAt, locale)} · ${record.status === "active" ? c.holdPosition : c.cancelledStatus}</p>
      </div>
      ${record.status === "active" ? `<button type="button" data-library-cancel-hold="${holding.id}">${c.cancelHold}</button>` : `<span>${c.cancelledStatus} · ${formatDate(record.cancelledAt, locale)}</span>`}
    </article>`;
}

function myLibraryView(locale, c) {
  const loanRecords = loans();
  const holdRecords = holds();
  const activeLoans = loanRecords.filter((record) => record.status === "active");
  const activeHolds = holdRecords.filter((record) => record.status === "active");
  const history = [
    ...loanRecords.filter((record) => record.status !== "active").map((record) => ({ ...record, kind: "loan", date: record.returnedAt })),
    ...holdRecords.filter((record) => record.status !== "active").map((record) => ({ ...record, kind: "hold", date: record.cancelledAt })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
  const identity = readJson(IDENTITY_KEY, null);
  if (!identity) {
    return `<div class="library-account-gate"><span aria-hidden="true">借</span><h3>${c.identityNeeded}</h3><a class="button button-primary" href="mytu.html#my-tu">${c.createIdentity} <span aria-hidden="true">→</span></a></div>`;
  }
  return `
    <div class="library-account-heading">
      <div><p>${c.libraryCard}</p><h3>${escapeHtml(identity.name)}</h3><code>${escapeHtml(identity.id)}</code></div>
      <button class="button button-secondary" type="button" data-library-receipt>${c.printReceipt} <span aria-hidden="true">↗</span></button>
    </div>
    <div class="library-account-grid">
      <section><header><span>LOANS</span><h3>${c.activeLoans}</h3><b>${activeLoans.length}/${MAX_LOANS}</b></header>${activeLoans.length ? activeLoans.map((record) => loanCard(record, locale, c)).join("") : `<p class="library-empty">${c.noLoans}</p>`}</section>
      <section><header><span>HOLDS</span><h3>${c.activeHolds}</h3><b>${activeHolds.length}</b></header>${activeHolds.length ? activeHolds.map((record) => holdCard(record, locale, c)).join("") : `<p class="library-empty">${c.noHolds}</p>`}</section>
    </div>
    <section class="library-history">
      <header><span>HISTORY</span><h3>${c.history}</h3></header>
      ${history.length ? history.map((record) => record.kind === "loan" ? loanCard(record, locale, c) : holdCard(record, locale, c)).join("") : `<p class="library-empty">${c.noHistory}</p>`}
    </section>`;
}

function renderContent() {
  if (!app) return;
  const locale = getLocale();
  const c = copy[locale];
  const available = libraryHoldings.filter((holding) => effectiveState(holding) === "available").length;
  const strange = libraryHoldings.length - available;
  const active = activeLoanCount() + activeHoldCount();
  const facility = liveFacilityStatus("library", locale);
  app.innerHTML = `
    <header class="library-hero">
      <div class="library-hero-image"><img src="assets/images/library.webp" srcset="assets/images/library-mobile.webp 640w, assets/images/library.webp 1280w" sizes="(max-width: 700px) 100vw, 48vw" width="1280" height="853" alt="" loading="eager"><span>${facility.open ? c.open : c.closed}<strong>${facility.hours} · ${facility.availableSeats} ${c.seatsFree}</strong></span></div>
      <div class="library-hero-copy">
        <p>${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
        <dl>
          <div><dt>${c.holdings}</dt><dd>${libraryHoldings.length}</dd></div>
          <div><dt>${c.available}</dt><dd>${available}</dd></div>
          <div><dt>${c.strange}</dt><dd>${strange}</dd></div>
        </dl>
      </div>
    </header>
    <nav class="library-tabs" aria-label="${escapeHtml(c.desk)}">
      <button type="button" data-library-tab="catalogue" aria-selected="${tab === "catalogue"}"><span>目</span>${c.catalogue}</button>
      <button type="button" data-library-tab="account" aria-selected="${tab === "account"}"><span>借</span>${c.myLibrary}<b>${active} ${c.activeBadge}</b></button>
    </nav>
    <div class="library-view">${tab === "catalogue" ? catalogueView(locale, c) : myLibraryView(locale, c)}</div>`;
  bind();
}

function render() {
  if (!app) return;
  renderPreservingState(app, renderContent, { preserveWindow: true });
}

function selectHolding(id) {
  if (!libraryHolding(id)) return;
  selectedId = id;
  const nextUrl = `${window.location.pathname}${window.location.search}#library-${id}`;
  window.history.replaceState({ route: `library-${id}` }, "", nextUrl);
  render();
  app.querySelector(".library-record")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function borrow(holdingId) {
  const locale = getLocale();
  const c = copy[locale];
  const holding = libraryHolding(holdingId);
  if (!holding || activeLoan(holdingId)) return showToast(c.alreadyLoaned);
  if (!readJson(IDENTITY_KEY, null)) return showToast(c.identityNeeded);
  if (!hasCourseAccess(holding)) return showToast(c.courseNeeded);
  if (activeLoanCount() >= MAX_LOANS) return showToast(c.maxLoans);
  if (effectiveState(holding) !== "available" || holding.circulation !== "loan") return;
  const borrowedAt = new Date().toISOString();
  const record = {
    schema: 1,
    id: makeId("TU-L", holdingId),
    holdingId,
    status: "active",
    borrowedAt,
    dueAt: addDays(borrowedAt, holding.loanDays),
    renewals: 0,
    returnedAt: null,
  };
  writeJson(LOANS_KEY, [...loans(), record]);
  recordCampusEvent("book.borrowed", { loanId: record.id, holdingId, callNumber: holding.callNumber, dueAt: record.dueAt }, { id: `book.borrowed:${record.id}`, timestamp: borrowedAt });
  showToast(c.borrowed);
  render();
}

function placeHold(holdingId) {
  const c = copy[getLocale()];
  const holding = libraryHolding(holdingId);
  if (!holding || activeHold(holdingId)) return showToast(c.alreadyHeld);
  if (!readJson(IDENTITY_KEY, null)) return showToast(c.identityNeeded);
  if (!hasCourseAccess(holding)) return showToast(c.courseNeeded);
  if (!canHold(holding)) return;
  const placedAt = new Date().toISOString();
  const record = { schema: 1, id: makeId("TU-H", holdingId), holdingId, status: "active", placedAt, position: 1, cancelledAt: null };
  writeJson(HOLDS_KEY, [...holds(), record]);
  recordCampusEvent("book.held", { holdId: record.id, holdingId, callNumber: holding.callNumber, position: 1 }, { id: `book.held:${record.id}`, timestamp: placedAt });
  showToast(c.held);
  render();
}

function renew(holdingId) {
  const c = copy[getLocale()];
  const holding = libraryHolding(holdingId);
  const records = loans();
  const index = records.findIndex((record) => record.holdingId === holdingId && record.status === "active");
  if (!holding || index < 0) return;
  if (records[index].renewals >= holding.renewalLimit) return showToast(c.renewalLimit);
  if (holds().some((record) => record.holdingId === holdingId && record.status === "active")) return showToast(c.renewalBlocked);
  const renewedAt = new Date().toISOString();
  records[index] = {
    ...records[index],
    dueAt: addDays(records[index].dueAt, holding.loanDays),
    renewals: records[index].renewals + 1,
    renewedAt,
  };
  writeJson(LOANS_KEY, records);
  recordCampusEvent("book.renewed", { loanId: records[index].id, holdingId, dueAt: records[index].dueAt, renewals: records[index].renewals }, { id: `book.renewed:${records[index].id}:${records[index].renewals}`, timestamp: renewedAt });
  showToast(c.renewed);
  render();
}

function returnLoan(holdingId) {
  const c = copy[getLocale()];
  const records = loans();
  const index = records.findIndex((record) => record.holdingId === holdingId && record.status === "active");
  if (index < 0) return;
  const returnedAt = new Date().toISOString();
  records[index] = { ...records[index], status: "returned", returnedAt };
  writeJson(LOANS_KEY, records);
  recordCampusEvent("book.returned", { loanId: records[index].id, holdingId }, { id: `book.returned:${records[index].id}`, timestamp: returnedAt });
  showToast(c.returned);
  render();
}

function cancelHold(holdingId) {
  const c = copy[getLocale()];
  const records = holds();
  const index = records.findIndex((record) => record.holdingId === holdingId && record.status === "active");
  if (index < 0) return;
  const cancelledAt = new Date().toISOString();
  records[index] = { ...records[index], status: "cancelled", cancelledAt };
  writeJson(HOLDS_KEY, records);
  recordCampusEvent("book.hold.cancelled", { holdId: records[index].id, holdingId }, { id: `book.hold.cancelled:${records[index].id}`, timestamp: cancelledAt });
  showToast(c.holdCancelled);
  render();
}

function renderReceipt() {
  const dialog = document.querySelector("[data-library-receipt-dialog]");
  const body = dialog?.querySelector("[data-library-receipt-body]");
  const identity = readJson(IDENTITY_KEY, null);
  if (!dialog || !body || !identity) return;
  const locale = getLocale();
  const c = copy[locale];
  const active = loans().filter((record) => record.status === "active");
  body.innerHTML = `
    <header><div class="library-receipt-seal" aria-hidden="true">書</div><div><p>MISTY LAKE LIBRARY</p><h2>${c.receiptTitle}</h2><span>${c.receiptSubtitle}</span></div></header>
    <dl><div><dt>${c.borrower}</dt><dd>${escapeHtml(identity.name)}</dd></div><div><dt>${c.libraryCard}</dt><dd><code>${escapeHtml(identity.id)}</code></dd></div><div><dt>${c.issued}</dt><dd>${formatDate(new Date().toISOString(), locale, true)}</dd></div></dl>
    <table><thead><tr><th>${c.callNumber}</th><th>${c.catalogue}</th><th>${c.due}</th></tr></thead><tbody>
      ${active.length ? active.map((record) => {
        const holding = libraryHolding(record.holdingId);
        return `<tr><td><code>${escapeHtml(holding?.callNumber || record.holdingId)}</code></td><td>${escapeHtml(localeText(holding?.title, locale))}</td><td>${formatDate(record.dueAt, locale)}</td></tr>`;
      }).join("") : `<tr><td colspan="3">${c.noLoans}</td></tr>`}
    </tbody></table>
    <p>${c.receiptNote}</p>`;
  dialog.querySelectorAll("[data-library-receipt-close]").forEach((button) => {
    if (!button.classList.contains("dialog-close")) button.textContent = c.closeReceipt;
    button.setAttribute("aria-label", c.closeReceipt);
  });
  const print = dialog.querySelector("[data-library-receipt-print]");
  if (print) print.firstChild.textContent = `${c.print} `;
  dialog.showModal();
}

function bind() {
  app.querySelectorAll("[data-library-tab]").forEach((button) => button.addEventListener("click", () => {
    tab = button.dataset.libraryTab;
    render();
  }));
  const filterForm = app.querySelector("[data-library-filters]");
  const updateFilters = () => {
    const form = filterForm;
    if (!form) return;
    filters = {
      query: form.elements.query.value,
      school: form.elements.school.value,
      state: form.elements.state.value,
      danger: form.elements.danger.value,
    };
    render();
  };
  bindImeSafeInput(filterForm?.elements.query, updateFilters);
  filterForm?.addEventListener("change", (event) => {
    if (event.target.matches("select")) updateFilters();
  });
  app.querySelector("[data-library-reset]")?.addEventListener("click", () => {
    filters = { query: "", school: "", state: "", danger: "" };
    render();
  });
  app.querySelectorAll("[data-library-select]").forEach((button) => button.addEventListener("click", () => selectHolding(button.dataset.librarySelect)));
  app.querySelectorAll("[data-library-borrow]").forEach((button) => button.addEventListener("click", () => borrow(button.dataset.libraryBorrow)));
  app.querySelectorAll("[data-library-hold]").forEach((button) => button.addEventListener("click", () => placeHold(button.dataset.libraryHold)));
  app.querySelectorAll("[data-library-renew]").forEach((button) => button.addEventListener("click", () => renew(button.dataset.libraryRenew)));
  app.querySelectorAll("[data-library-return]").forEach((button) => button.addEventListener("click", () => returnLoan(button.dataset.libraryReturn)));
  app.querySelectorAll("[data-library-cancel-hold]").forEach((button) => button.addEventListener("click", () => cancelHold(button.dataset.libraryCancelHold)));
  app.querySelector("[data-library-receipt]")?.addEventListener("click", renderReceipt);
}

function initialHoldingFromHash() {
  const match = safeDecodeFragment().match(/^library-(.+)$/);
  if (match && libraryHolding(match[1])) selectedId = match[1];
}

export function initLibrary() {
  app = document.querySelector("[data-library-app]");
  if (!app) return;
  initialHoldingFromHash();
  render();
  window.addEventListener("tu:languagechange", render);
  window.addEventListener("storage", (event) => {
    if ([LOANS_KEY, HOLDS_KEY, IDENTITY_KEY, REGISTRATION_KEY, TRANSCRIPT_KEY].includes(event.key)) render();
  });
  window.addEventListener("hashchange", () => {
    const before = selectedId;
    initialHoldingFromHash();
    if (before !== selectedId) render();
  });
  document.querySelectorAll("[data-library-receipt-close]").forEach((button) => button.addEventListener("click", () => document.querySelector("[data-library-receipt-dialog]")?.close()));
  document.querySelector("[data-library-receipt-print]")?.addEventListener("click", () => {
    const dialog = document.querySelector("[data-library-receipt-dialog]");
    printDocument(dialog?.querySelector("[data-library-receipt-body]"), {
      title: dialog?.querySelector("h1, h2")?.textContent || document.title,
    });
  });
}
