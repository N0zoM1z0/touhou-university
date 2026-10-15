import { values as catalogValues, trees as catalogTrees } from "../generated/i18n/ui/academic-calendar.js";
import {
  academicCalendarEvent,
  academicCalendarEvents,
  academicCalendarLocalized,
  academicCalendarSnapshot,
  academicSeasons,
} from "../data/academic-calendar.js";
import { campusLunarPhase } from "../data/campus-time.js";
import {
  academicCalendarBookmarks,
  academicCalendarIcs,
  isAcademicCalendarBookmarked,
  toggleAcademicCalendarBookmark,
} from "./academic-calendar-model.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { getLocale } from "./i18n.js";
import { printDocument } from "./print-document.js";
import { renderPreservingState } from "./render-state.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

let root;
let view = "year";
let selectedEventId = null;
let selectedSeason = "all";

const moonLabels = [
  catalogValues("moonLabels.-"),
  catalogValues("moonLabels.-.2"),
  catalogValues("moonLabels.-.3"),
  catalogValues("moonLabels.-.4"),
  catalogValues("moonLabels.-.5"),
  catalogValues("moonLabels.-.6"),
  catalogValues("moonLabels.-.7"),
  catalogValues("moonLabels.-.8"),
];

const copy = catalogTrees["copy"];

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  })[character]);
}

const t = (value, locale) => academicCalendarLocalized(value, locale);

function monthName(month, locale) {
  return new Intl.DateTimeFormat(locale === "zh-Hant" ? "zh-TW" : locale, { month: "long" })
    .format(new Date(2026, month, 1));
}

function hero(locale, c) {
  const now = new Date();
  const snapshot = academicCalendarSnapshot(now);
  return `
    <header class="calendar-hero" id="academic-calendar-top">
      <div>
        <p>${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
      </div>
      <aside>
        <p>${c.today} · ${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}</p>
        <div><span>${snapshot.season.glyph}</span><strong>${t(snapshot.season.name, locale)}</strong><small>${t(snapshot.season.note, locale)}</small></div>
        <dl><div><dt>${c.currentMoon}</dt><dd>${moonLabels[campusLunarPhase(now)][locale === "ja" ? 1 : locale === "en" ? 2 : 0]}</dd></div><div><dt>${c.active}</dt><dd>${snapshot.activeEvents.length}</dd></div></dl>
      </aside>
    </header>`;
}

function tabs(c) {
  return `
    <nav class="calendar-tabs">
      <button type="button" class="${view === "year" || view === "event" ? "active" : ""}" data-calendar-view="year"><span>曆</span>${c.year}</button>
      <button type="button" class="${view === "agenda" ? "active" : ""}" data-calendar-view="agenda"><span>栞</span>${c.agenda}<b>${academicCalendarBookmarks().length}</b></button>
      <button type="button" data-calendar-print><span>紙</span>${c.print}</button>
      <button type="button" data-calendar-download><span>外</span>${c.download}</button>
    </nav>`;
}

function eventCard(entry, locale, c, activeIds = new Set()) {
  const saved = isAcademicCalendarBookmarked(entry.id);
  return `
    <article class="calendar-event-card ${activeIds.has(entry.id) ? "active-now" : ""}" id="calendar-event-${entry.id}">
      <header><span>${entry.glyph}</span><div><p>${entry.code} · ${t(entry.window, locale)}</p><h4>${t(entry.title, locale)}</h4></div>${saved ? "<b>栞</b>" : ""}</header>
      <p>${t(entry.premise, locale)}</p>
      <footer>
        <div>${entry.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        <button type="button" data-calendar-event="${entry.id}">${c.open}<b>↗</b></button>
      </footer>
    </article>`;
}

function seasonFilters(locale, c) {
  return `
    <div class="calendar-season-filter">
      <button type="button" class="${selectedSeason === "all" ? "active" : ""}" data-calendar-season="all">${c.all}</button>
      ${Object.entries(academicSeasons).map(([id, season]) => `<button type="button" class="${selectedSeason === id ? "active" : ""}" data-calendar-season="${id}"><span>${season.glyph}</span>${t(season.name, locale)}</button>`).join("")}
    </div>`;
}

function todayStrip(locale, c) {
  const snapshot = academicCalendarSnapshot();
  return `
    <section class="calendar-today" id="calendar-today">
      <div class="commons-section-title"><p>LIVE CALENDAR PROJECTION</p><h3>${c.active}</h3><span>${t(snapshot.season.note, locale)}</span></div>
      <div>${snapshot.activeEvents.length ? snapshot.activeEvents.map((entry) => eventCard(entry, locale, c, new Set(snapshot.activeEvents.map((item) => item.id)))).join("") : `<p>${c.noActive}</p>`}</div>
    </section>`;
}

function yearView(locale, c) {
  const seasonMonths = selectedSeason === "all" ? null : academicSeasons[selectedSeason].months;
  const activeIds = new Set(academicCalendarSnapshot().activeEvents.map((entry) => entry.id));
  const months = Array.from({ length: 12 }, (_, month) => month)
    .filter((month) => !seasonMonths || seasonMonths.includes(month))
    .map((month) => {
      const entries = academicCalendarEvents.filter((entry) => {
        if (entry.month === undefined) return false;
        return (Array.isArray(entry.month) ? entry.month : [entry.month]).includes(month);
      });
      return `
        <section class="calendar-month">
          <header><span>${String(month + 1).padStart(2, "0")}</span><div><p>${c.yearLabel}</p><h3>${monthName(month, locale)}</h3></div></header>
          <div>${entries.map((entry) => eventCard(entry, locale, c, activeIds)).join("")}</div>
        </section>`;
    }).join("");
  const lunar = selectedSeason === "all" ? `
    <section class="calendar-month lunar">
      <header><span>☾</span><div><p>LUNAR RECURRENCE</p><h3>${c.lunarRule}</h3></div></header>
      <div>${academicCalendarEvents.filter((entry) => entry.month === undefined).map((entry) => eventCard(entry, locale, c, activeIds)).join("")}</div>
    </section>` : "";
  return `${todayStrip(locale, c)}${seasonFilters(locale, c)}<div class="calendar-year" data-calendar-print-document>${months}${lunar}</div>`;
}

function impactRow(label, value, locale) {
  return `<div><dt>${label}</dt><dd>${t(value, locale)}</dd></div>`;
}

function eventView(locale, c) {
  const entry = academicCalendarEvent(selectedEventId);
  if (!entry) return yearView(locale, c);
  const saved = isAcademicCalendarBookmarked(entry.id);
  const active = academicCalendarSnapshot().activeEvents.some((item) => item.id === entry.id);
  return `
    <button class="calendar-back" type="button" data-calendar-view="year">← ${c.back}</button>
    <article class="calendar-leaf ${active ? "active-now" : ""}" id="calendar-event-${entry.id}">
      <header>
        <span>${entry.glyph}</span>
        <div><p>${entry.code} · ${entry.annual ? c.annualRule : c.lunarRule}</p><h3>${t(entry.title, locale)}</h3><em>${t(entry.window, locale)}</em></div>
        ${active ? `<b>${c.activeNow}</b>` : ""}
      </header>
      <section><p>${c.premise}</p><blockquote>${t(entry.premise, locale)}</blockquote><span>${t(entry.details, locale)}</span></section>
      <section class="calendar-impacts"><p>${c.impacts}</p><dl>
        ${impactRow(c.course, entry.impacts.course, locale)}
        ${impactRow(c.transport, entry.impacts.transport, locale)}
        ${impactRow(c.library, entry.impacts.library, locale)}
        ${impactRow(c.medicine, entry.impacts.medicine, locale)}
      </dl></section>
      <footer>
        <button class="calendar-primary" type="button" data-calendar-bookmark="${entry.id}">${saved ? c.remove : c.save}<span>${saved ? "×" : "栞"}</span></button>
        <button type="button" data-copy-url>${c.share}</button>
      </footer>
    </article>`;
}

function agendaView(locale, c) {
  const records = academicCalendarBookmarks();
  const entries = records.map((record) => ({ record, entry: academicCalendarEvent(record.eventId) })).filter(({ entry }) => entry);
  return `
    <section class="calendar-agenda" id="calendar-agenda" data-calendar-print-document>
      <div class="commons-section-title"><p>RED BOOKMARK LEDGER</p><h3>${c.agenda}</h3><span>${c.lead}</span></div>
      ${entries.length ? entries.map(({ record, entry }) => `
        <article>
          <span>${entry.glyph}</span><div><p>${entry.code} · ${t(entry.window, locale)}</p><h4>${t(entry.title, locale)}</h4><small>${new Intl.DateTimeFormat(locale === "zh-Hant" ? "zh-TW" : locale, { dateStyle: "medium" }).format(new Date(record.savedAt))}</small></div>
          <button type="button" data-calendar-event="${entry.id}">${c.open} ↗</button>
        </article>`).join("") : `<p class="calendar-empty">${c.noAgenda}</p>`}
    </section>`;
}

function render(options = {}) {
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  renderPreservingState(root, () => {
    let body = yearView(locale, c);
    if (view === "event") body = eventView(locale, c);
    if (view === "agenda") body = agendaView(locale, c);
    root.innerHTML = `${hero(locale, c)}${tabs(c)}<div class="calendar-workspace">${body}</div>`;
  }, { preserveWindow: options.preserveWindow ?? true });
}

function showEvent(id, navigate = true) {
  if (!academicCalendarEvent(id)) return;
  selectedEventId = id;
  view = "event";
  if (navigate) return navigateToDeepLink(`calendar-event-${id}`);
  render({ preserveWindow: false });
}

function downloadCalendar(locale) {
  const blob = new Blob([academicCalendarIcs(locale)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `touhou-university-calendar-${new Date().getFullYear()}.ics`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function bindEvents() {
  root.addEventListener("click", async (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    const viewButton = event.target.closest("[data-calendar-view]");
    if (viewButton) {
      view = viewButton.dataset.calendarView;
      navigateToDeepLink(view === "agenda" ? "calendar-agenda" : "academic-calendar");
      return;
    }
    const season = event.target.closest("[data-calendar-season]");
    if (season) {
      selectedSeason = season.dataset.calendarSeason;
      render();
      return;
    }
    const open = event.target.closest("[data-calendar-event]");
    if (open) {
      showEvent(open.dataset.calendarEvent);
      return;
    }
    const bookmark = event.target.closest("[data-calendar-bookmark]");
    if (bookmark) {
      const result = toggleAcademicCalendarBookmark(bookmark.dataset.calendarBookmark);
      recordCampusEvent(
        result.bookmarked ? "calendar.event.saved" : "calendar.event.removed",
        { eventId: bookmark.dataset.calendarBookmark },
        {
          id: `calendar.event.${result.bookmarked ? "saved" : "removed"}:${bookmark.dataset.calendarBookmark}:${Date.now()}`,
        },
      );
      showToast(result.bookmarked ? c.saved : c.removed);
      render();
      return;
    }
    if (event.target.closest("[data-calendar-print]")) {
      const documentElement = root.querySelector("[data-calendar-print-document]");
      if (documentElement) printDocument(documentElement, { title: `${c.yearLabel} · Touhou University` });
      return;
    }
    if (event.target.closest("[data-calendar-download]")) {
      downloadCalendar(locale);
      return;
    }
    if (event.target.closest("[data-copy-url]")) {
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
}

function initialView() {
  const route = safeDecodeFragment();
  if (route === "calendar-agenda") view = "agenda";
  if (route.startsWith("calendar-event-")) {
    selectedEventId = route.slice("calendar-event-".length);
    if (academicCalendarEvent(selectedEventId)) view = "event";
  }
}

export function initAcademicCalendar() {
  root = document.querySelector("[data-academic-calendar-app]");
  if (!root) return;
  initialView();
  render({ preserveWindow: false });
  bindEvents();

  registerDeepLink("academic-calendar", {
    anchor: "#academic-calendar",
    position: "always",
    open() {
      view = "year";
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("calendar-today", {
    anchor: "#calendar-today",
    position: "always",
    open() {
      view = "year";
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("calendar-agenda", {
    anchor: "#calendar-agenda",
    position: "always",
    open() {
      view = "agenda";
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("calendar-event-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "calendar-focus",
    position: "always",
    open(id) {
      showEvent(id, false);
    },
  });

  window.addEventListener("tu:languagechange", () => render({ preserveWindow: false }));
  window.addEventListener("tu:recordschange", () => render());
}
