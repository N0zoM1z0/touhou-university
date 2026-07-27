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
  ["朔月", "新月", "New moon"],
  ["眉月", "三日月", "Waxing crescent"],
  ["上弦前", "上弦前", "Pre-first-quarter"],
  ["盈凸月", "満ちる凸月", "Waxing gibbous"],
  ["滿月", "満月", "Full moon"],
  ["虧凸月", "欠ける凸月", "Waning gibbous"],
  ["下弦後", "下弦後", "Post-last-quarter"],
  ["殘月", "有明月", "Waning crescent"],
];

const copy = {
  "zh-Hant": {
    eyebrow: "GENSOKYO ACADEMIC CALENDAR / 四季 × 月相 × 異變",
    title: "學期有開始日期；春天、滿月與異變保留不照表抵達的權利。",
    lead: "這份學年曆不是靜態海報。季節、月相與日期會改變課程、館舍、交通、食堂與校醫負載；夾入曆葉只會保存提醒，不會把世界釘住。",
    today: "今日曆面",
    currentSeason: "當值季節",
    currentMoon: "月相",
    active: "正在改動校園",
    noActive: "本校鐘沒有追加異變；季節仍按上列，慢慢添麻煩。",
    year: "年曆",
    agenda: "我的曆葉",
    print: "列印學年曆",
    download: "下載 iCalendar",
    all: "全年",
    open: "展開曆葉",
    window: "時令窗口",
    premise: "這段時間會發生什麼",
    impacts: "校園投影",
    course: "課程",
    transport: "交通",
    library: "圖書館",
    medicine: "校醫",
    save: "夾入紅書籤",
    remove: "取下紅書籤",
    saved: "曆葉已保存，鴉天狗通知中心也會看到。",
    removed: "紅書籤已取下；季節仍照常發生。",
    noAgenda: "尚未保存曆葉。先展開一件事件，把紅書籤夾進去。",
    back: "回到全年曆",
    copied: "網址已複製。",
    share: "複製這張曆葉網址",
    activeNow: "此刻生效",
    annualRule: "依日期每年重現",
    lunarRule: "依月相與校鐘重現",
    yearLabel: "幻想鄉學年",
  },
  ja: {
    eyebrow: "GENSOKYO ACADEMIC CALENDAR / 四季 × 月相 × 異変",
    title: "学期には開始日がある。春・満月・異変には時間表どおり来ない権利がある。",
    lead: "この学年暦は静止したポスターではありません。季節・月相・日付が授業、施設、交通、食堂、校医負荷を変更し、栞は通知を保存しても世界を固定しません。",
    today: "本日の暦面",
    currentSeason: "当番季節",
    currentMoon: "月相",
    active: "現在キャンパスを変更中",
    noActive: "この校鐘には追加異変なし。季節は上記どおり、ゆっくり面倒を増やしています。",
    year: "年暦",
    agenda: "自分の暦葉",
    print: "学年暦を印刷",
    download: "iCalendar を保存",
    all: "通年",
    open: "暦葉を開く",
    window: "時季窓",
    premise: "この期間に起こること",
    impacts: "キャンパス投影",
    course: "授業",
    transport: "交通",
    library: "図書館",
    medicine: "校医",
    save: "赤い栞を挟む",
    remove: "赤い栞を外す",
    saved: "暦葉を保存。鴉天狗通知センターにも現れます。",
    removed: "栞を外しました。季節はそのまま起こります。",
    noAgenda: "保存済み暦葉はありません。事件を開いて赤い栞を挟んでください。",
    back: "年暦へ戻る",
    copied: "URL をコピーしました。",
    share: "暦葉 URL をコピー",
    activeNow: "現在有効",
    annualRule: "日付により毎年再現",
    lunarRule: "月相・校鐘により再現",
    yearLabel: "幻想郷学年",
  },
  en: {
    eyebrow: "GENSOKYO ACADEMIC CALENDAR / SEASONS × MOON × INCIDENTS",
    title: "Terms have start dates; spring, full moons, and incidents retain the right to arrive off schedule.",
    lead: "This calendar is not a static poster. Season, moon, and date alter classes, facilities, transport, dining, and clinic load. Saving a leaf stores a reminder; it does not pin the world down.",
    today: "Today's calendar face",
    currentSeason: "Duty season",
    currentMoon: "Moon",
    active: "Changing campus now",
    noActive: "No added incident this bell; the season above is still adding trouble at its own pace.",
    year: "Year calendar",
    agenda: "My calendar leaves",
    print: "Print academic calendar",
    download: "Download iCalendar",
    all: "All year",
    open: "Open calendar leaf",
    window: "Seasonal window",
    premise: "What happens",
    impacts: "Campus projections",
    course: "Courses",
    transport: "Transport",
    library: "Library",
    medicine: "Clinic",
    save: "Add red bookmark",
    remove: "Remove red bookmark",
    saved: "Calendar leaf saved; Tengu Post can now see it too.",
    removed: "Red bookmark removed; the season will still happen.",
    noAgenda: "No saved leaves. Open an event and insert the red bookmark.",
    back: "Back to year calendar",
    copied: "URL copied.",
    share: "Copy this calendar-leaf URL",
    activeNow: "Active now",
    annualRule: "Recurs annually by date",
    lunarRule: "Recurs by moon and campus bell",
    yearLabel: "Gensokyo Academic Year",
  },
};

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
