import { campusHistory, campusHistoryCategories } from "../data/campus-history.js";
import { closeDeepLink, navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { getLocale } from "./i18n.js";
import { renderPreservingState } from "./render-state.js";

const dialog = document.querySelector("[data-chronicle-dialog]");
const app = dialog?.querySelector("[data-chronicle-app]");
let selectedId = campusHistory.at(-1)?.id || "";
let activeCategory = "all";

const copy = {
  "zh-Hant": {
    kicker: "HIEDA ARCHIVES / LIVING CHRONICLE",
    title: "幻想鄉校史",
    lead: "每一筆主分支修訂都留下兩份記錄：版本庫保存實際改了什麼，校史簿保存這件事如何改變校園，以及誰當場表示反對。",
    entries: "頁校史",
    all: "全部",
    latest: "最新收錄",
    volume: "館藏編號",
    recorded: "入藏日期",
    source: "版本底本",
    sourceLead: "此條校史對應的真實 Git 主分支修訂。版本主旨不改寫；校史敘事、補記與抗議另行並存。",
    marginalia: "頁邊補記",
    main: "MAIN / 最新主分支",
    openSource: "查看真實版本",
    previous: "前一頁",
    next: "後一頁",
    openRecord: "開啟校史",
  },
  ja: {
    kicker: "HIEDA ARCHIVES / LIVING CHRONICLE",
    title: "幻想郷大学史",
    lead: "主分岐の各改訂には二つの記録が残る。版管理庫は実際の変更を、大学史簿はキャンパスへの影響とその場で異議を唱えた者を保存する。",
    entries: "頁",
    all: "すべて",
    latest: "最新収録",
    volume: "収蔵番号",
    recorded: "収蔵日",
    source: "版底本",
    sourceLead: "この大学史に対応する実際の Git 主分岐改訂。版主題は改変せず、大学史叙述・追記・抗議を別に併存させる。",
    marginalia: "欄外追記",
    main: "MAIN / 最新主分岐",
    openSource: "実際の版を見る",
    previous: "前頁",
    next: "次頁",
    openRecord: "大学史を開く",
  },
  en: {
    kicker: "HIEDA ARCHIVES / LIVING CHRONICLE",
    title: "Gensokyo University Chronicle",
    lead: "Every main-branch revision leaves two records: the repository preserves what changed; the chronicle preserves what it did to campus and who objected at the time.",
    entries: "records",
    all: "All",
    latest: "Latest record",
    volume: "Archive reference",
    recorded: "Accession date",
    source: "Version source",
    sourceLead: "The real Git main-branch revision underlying this record. Its subject remains unchanged while the campus account, additions, and objections coexist beside it.",
    marginalia: "Marginal note",
    main: "MAIN / latest revision",
    openSource: "View real revision",
    previous: "Previous",
    next: "Next",
    openRecord: "Open chronicle",
  },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function categoryName(id, locale) {
  return campusHistoryCategories[id]?.[locale] || id;
}

function formatDate(value, locale) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

function sourceUrl(entry) {
  return entry.commit
    ? `https://github.com/N0zoM1z0/touhou-university/commit/${entry.commit}`
    : "https://github.com/N0zoM1z0/touhou-university/commits/main";
}

function filteredEntries() {
  if (activeCategory === "all") return campusHistory;
  return campusHistory.filter((entry) => entry.category === activeCategory);
}

function renderPreview() {
  const locale = getLocale();
  const latest = campusHistory.at(-1);
  document.querySelector("[data-chronicle-count]")?.replaceChildren(
    document.createTextNode(String(campusHistory.length).padStart(3, "0")),
  );
  document.querySelector("[data-chronicle-latest]")?.replaceChildren(
    document.createTextNode(latest?.title[locale] || "—"),
  );
  document.querySelector("[data-chronicle-era]")?.replaceChildren(
    document.createTextNode(latest?.era[locale] || "—"),
  );
}

function renderRecord(entry, locale, c, visible) {
  const sourceLabel = entry.commit ? entry.commit.slice(0, 8) : c.main;
  const currentIndex = campusHistory.findIndex((item) => item.id === entry.id);
  const previous = campusHistory[currentIndex - 1];
  const next = campusHistory[currentIndex + 1];
  return `
    <article class="chronicle-record">
      <header>
        <div class="chronicle-record-seal" aria-hidden="true"><span>史</span><small>${escapeHtml(entry.archiveId)}</small></div>
        <div>
          <p>${escapeHtml(categoryName(entry.category, locale))} · ${escapeHtml(entry.era[locale])}</p>
          <h3>${escapeHtml(entry.title[locale])}</h3>
        </div>
      </header>
      <dl class="chronicle-record-meta">
        <div><dt>${c.volume}</dt><dd>${escapeHtml(entry.archiveId)}</dd></div>
        <div><dt>${c.recorded}</dt><dd>${escapeHtml(formatDate(entry.recordedAt, locale))}</dd></div>
      </dl>
      <p class="chronicle-record-body">${escapeHtml(entry.summary[locale])}</p>
      <blockquote>
        <span>${c.marginalia}</span>
        <p>${escapeHtml(entry.marginalia[locale])}</p>
      </blockquote>
      <details class="chronicle-source">
        <summary>${c.source}<span>${escapeHtml(sourceLabel)}</span></summary>
        <p>${c.sourceLead}</p>
        <code>${escapeHtml(entry.commitSubject)}</code>
        <a href="${sourceUrl(entry)}" target="_blank" rel="noreferrer">${c.openSource} <span aria-hidden="true">↗</span></a>
      </details>
      <nav class="chronicle-record-nav" aria-label="${c.title}">
        ${previous ? `<button type="button" data-chronicle-record="${escapeHtml(previous.id)}"><span>←</span>${c.previous}<small>${escapeHtml(previous.archiveId)}</small></button>` : "<span></span>"}
        <b>${String(currentIndex + 1).padStart(2, "0")} / ${String(campusHistory.length).padStart(2, "0")}</b>
        ${next ? `<button type="button" data-chronicle-record="${escapeHtml(next.id)}">${c.next}<span>→</span><small>${escapeHtml(next.archiveId)}</small></button>` : "<span></span>"}
      </nav>
      <p class="chronicle-visible-count">${visible.length} ${c.entries}</p>
    </article>`;
}

function bindDialogActions() {
  app?.querySelectorAll("[data-chronicle-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.chronicleFilter;
      const visible = filteredEntries();
      if (!visible.some((entry) => entry.id === selectedId)) selectedId = visible.at(-1)?.id || selectedId;
      render();
    });
  });
  app?.querySelectorAll("[data-chronicle-record]").forEach((button) => {
    button.addEventListener("click", () => navigateToDeepLink(`chronicle-${button.dataset.chronicleRecord}`));
  });
}

function renderContent() {
  if (!app) return;
  const locale = getLocale();
  const c = copy[locale];
  const visible = filteredEntries();
  const entry =
    campusHistory.find((item) => item.id === selectedId) ||
    visible.at(-1) ||
    campusHistory.at(-1);
  selectedId = entry.id;
  const categories = ["all", ...new Set(campusHistory.map((item) => item.category))];
  app.innerHTML = `
    <header class="chronicle-head">
      <div>
        <p>${c.kicker}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
      </div>
      <strong>${String(campusHistory.length).padStart(3, "0")}<small>${c.entries}</small></strong>
    </header>
    <div class="chronicle-filters" role="group" aria-label="${c.title}" data-preserve-scroll="chronicle-filters">
      ${categories.map((id) => `
        <button class="${id === activeCategory ? "active" : ""}" type="button" data-chronicle-filter="${id}">
          ${id === "all" ? c.all : categoryName(id, locale)}
          <span>${id === "all" ? campusHistory.length : campusHistory.filter((entry) => entry.category === id).length}</span>
        </button>`).join("")}
    </div>
    <div class="chronicle-layout">
      <aside class="chronicle-index" data-preserve-scroll="chronicle-index">
        <p>${c.latest} / ${visible.length} ${c.entries}</p>
        <ol>
          ${visible.slice().reverse().map((item) => `
            <li>
              <button class="${item.id === selectedId ? "active" : ""}" type="button" data-chronicle-record="${escapeHtml(item.id)}" data-preserve-focus="chronicle-${escapeHtml(item.id)}" aria-label="${c.openRecord}: ${escapeHtml(item.title[locale])}">
                <span>${escapeHtml(item.archiveId)}</span>
                <strong>${escapeHtml(item.title[locale])}</strong>
                <small>${escapeHtml(item.era[locale])}</small>
              </button>
            </li>`).join("")}
        </ol>
      </aside>
      ${renderRecord(entry, locale, c, visible)}
    </div>`;
  bindDialogActions();
}

function render() {
  if (!dialog) return;
  renderPreservingState(dialog, renderContent);
}

function open(value) {
  const requested = value.replace(/^-/, "");
  if (requested && campusHistory.some((entry) => entry.id === requested)) {
    selectedId = requested;
    if (activeCategory !== "all" && !filteredEntries().some((entry) => entry.id === requested)) {
      activeCategory = "all";
    }
  }
  render();
  if (dialog && !dialog.open) dialog.showModal();
}

function close() {
  if (dialog?.open) dialog.close();
}

export function initCampusChronicle() {
  if (!dialog || !app) return;
  renderPreview();
  document.querySelectorAll("[data-chronicle-open]").forEach((button) => {
    button.addEventListener("click", () => navigateToDeepLink("chronicle"));
  });
  dialog.querySelector("[data-chronicle-close]")?.addEventListener("click", () => {
    closeDeepLink("chronicle", "#traditions");
  });
  dialog.addEventListener("close", () => closeDeepLink("chronicle", "#traditions"));
  registerDeepLink("chronicle", {
    anchor: "#traditions",
    dialog,
    open,
    close,
  });
  window.addEventListener("tu:languagechange", () => {
    renderPreview();
    if (dialog.open) render();
  });
}
