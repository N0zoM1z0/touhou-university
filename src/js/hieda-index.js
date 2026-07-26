import {
  dossierMatchesEvent,
  dossiersForCharacter,
  dossiersForVersion,
  knowledgeCharacter,
  knowledgeCharacters,
  knowledgeDossier,
  knowledgeDossiers,
  knowledgeVersions,
  resolveKnowledgeRecord,
} from "../data/knowledge-graph.js";
import { campusEventLabel } from "../data/event-contracts.js";
import { campusLedger } from "./campus-ledger.js";
import { registerDeepLink } from "./deep-links.js";
import { getLocale } from "./i18n.js";
import { renderPreservingState } from "./render-state.js";
import { siteHref } from "./site-router.js";
import { showToast } from "./ui.js";

const root = document.querySelector("[data-hieda-index-app]");
const historyRecords = knowledgeVersions();

const copy = {
  "zh-Hant": {
    eyebrow: "HIEDA INDEX / 同一件事的五種記錄",
    title: "每件事，\n都至少發生五次。",
    lead: "一次在現場，一次在規章，一次在新聞，一次在學生嘴裡；最後一次，發生在阿求不肯擦掉的頁邊。",
    notice: "這不是替校園找出唯一真相的機器。它只把互相牴觸、互相引用、又互相假裝不認識的卷宗攤在同一張桌上。",
    events: "按事件看",
    characters: "按角色看",
    versions: "按版本／時間看",
    eventHint: "從一件麻煩追到七個辦公室",
    characterHint: "看同一個人如何在不同卷宗留下手印",
    versionHint: "沿 first-parent 校史翻查校園何時改變",
    dossiers: "交叉案卷",
    hands: "留下手印",
    versionsCount: "校史版本",
    records: "張關聯紙",
    indexSearch: "在本欄篩選",
    searchPlaceholder: "鐘、文、七十七號…",
    source: "翻回原卷",
    thread: "這條紅線怎麼接",
    contradiction: "阿求保留的矛盾",
    people: "本頁手印",
    versionSources: "這件事經過的校史版本",
    localTitle: "你在頁邊留下的記錄",
    localLead: "只讀取這台裝置的正式校園 ledger；不會上傳，也不會替你補寫沒做過的事。",
    localEmpty: "這一頁還沒有見過你的筆跡。去原卷借書、投票、結案、選課或完成答辯，它才會認出你。",
    localOpen: "前往 My TU 查看全部",
    subject: "記錄主體",
    caused: "直接前因",
    openDossier: "展開這件事",
    relatedDossiers: "本角色牽涉的案卷",
    versionDossiers: "這一版牽動的案卷",
    characterNote: "角色沒有被整理成一致立場；同一個名字可以同時是教師、證人、設備維護者與麻煩來源。",
    versionNote: "主分支提交是校史正本；功能主旨與校園後果可以相遇，但不准互相冒名。",
    gitSource: "查看 Git 正本",
    archiveSource: "打開校史頁",
    copied: "這一頁的紅線地址已抄好。",
    share: "抄下此頁門牌",
    noMatch: "這個詞沒有落在任何可見索引籤上。",
    allRecords: "全部關聯紙",
    direct: "直接相關",
  },
  ja: {
    eyebrow: "HIEDA INDEX / 同じ出来事の五つの記録",
    title: "出来事は、\n最低でも五回起こる。",
    lead: "現場で一度、規程で一度、新聞で一度、学生の口で一度。そして最後に、阿求が消さない欄外で起こる。",
    notice: "唯一の真実を選ぶ機械ではありません。矛盾し、引用し合い、互いを知らないふりをする記録を同じ机へ広げます。",
    events: "事案から読む",
    characters: "人物から読む",
    versions: "版／時間から読む",
    eventHint: "一つの厄介事を七つの窓口まで追う",
    characterHint: "同じ人物が別の記録へ残す手印を見る",
    versionHint: "first-parent 大学史で変化の時をたどる",
    dossiers: "交差案件",
    hands: "手印",
    versionsCount: "大学史版",
    records: "枚の関連紙",
    indexSearch: "この欄を絞り込む",
    searchPlaceholder: "鐘、文、七十七号…",
    source: "原簿へ戻る",
    thread: "この赤糸の結び方",
    contradiction: "阿求が残した矛盾",
    people: "この頁の手印",
    versionSources: "この出来事を通った大学史版",
    localTitle: "あなたが欄外へ残した記録",
    localLead: "この端末の正式キャンパス ledger だけを読みます。送信も、未実施の出来事の追記もしません。",
    localEmpty: "この頁はまだあなたの筆跡を知りません。原簿で借用、投票、終結、履修、答弁を行えば見分けます。",
    localOpen: "My TU ですべてを見る",
    subject: "記録主体",
    caused: "直接前因",
    openDossier: "この出来事を開く",
    relatedDossiers: "この人物が関わる案件",
    versionDossiers: "この版が動かした案件",
    characterNote: "人物を一貫した立場には整理しません。同じ名が教員、証人、保守担当、厄介事の原因を兼ねます。",
    versionNote: "主分岐 commit が大学史正本です。機能主旨と校内の結果は出会えても、互いを名乗れません。",
    gitSource: "Git 正本を見る",
    archiveSource: "大学史頁を開く",
    copied: "この頁の赤糸住所を写しました。",
    share: "この頁の住所を写す",
    noMatch: "この語は可視索引札に見つかりません。",
    allRecords: "全関連紙",
    direct: "直接関係",
  },
  en: {
    eyebrow: "HIEDA INDEX / FIVE RECORDS OF ONE THING",
    title: "Every event happens\nat least five times.",
    lead: "Once on site, once in rules, once in news, once in student talk—and once more in the margin Akyuu refuses to erase.",
    notice: "This machine does not choose one campus truth. It lays mutually contradictory, mutually citing, mutually evasive records on one desk.",
    events: "Read by event",
    characters: "Read by character",
    versions: "Read by version / time",
    eventHint: "Follow one nuisance through seven offices",
    characterHint: "See one person's fingerprints across different files",
    versionHint: "Trace change along the first-parent chronicle",
    dossiers: "cross-files",
    hands: "fingerprints",
    versionsCount: "chronicle versions",
    records: "linked leaves",
    indexSearch: "Filter this column",
    searchPlaceholder: "bell, Aya, object 77…",
    source: "Return to source",
    thread: "Why this red thread is here",
    contradiction: "Contradiction retained by Akyuu",
    people: "Fingerprints on this leaf",
    versionSources: "Chronicle versions this event passed through",
    localTitle: "Records you left in the margin",
    localLead: "Reads only the official campus ledger on this device. Nothing uploads, and nothing you did not do gets invented.",
    localEmpty: "This leaf does not know your handwriting yet. Borrow, vote, close a case, enrol, or defend work in a source file.",
    localOpen: "See the full record in My TU",
    subject: "Record subject",
    caused: "Direct cause",
    openDossier: "Open this event",
    relatedDossiers: "Files involving this character",
    versionDossiers: "Files moved by this version",
    characterNote: "Characters are not flattened into consistent positions. One name can be teacher, witness, maintainer, and cause of trouble.",
    versionNote: "The first-parent commit is the chronicle source. A feature subject and campus consequence may meet, but may not impersonate each other.",
    gitSource: "Open Git source",
    archiveSource: "Open chronicle leaf",
    copied: "This leaf's red-thread address is copied.",
    share: "Copy this leaf's address",
    noMatch: "That phrase is absent from every visible index slip.",
    allRecords: "All linked leaves",
    direct: "Directly involved",
  },
};

let mode = "event";
let selectedId = knowledgeDossiers[0]?.id || "";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]);
}

function localized(value, locale) {
  return value?.[locale] || value?.["zh-Hant"] || value || "";
}

function parseRoute(route) {
  if (route === "hieda-index") return { mode: "event", id: knowledgeDossiers[0]?.id };
  const match = route.match(/^hieda-(event|character|version)-(.+)$/);
  if (!match) return null;
  const [, nextMode, id] = match;
  const exists = nextMode === "event"
    ? Boolean(knowledgeDossier(id))
    : nextMode === "character"
      ? Boolean(knowledgeCharacter(id))
      : historyRecords.some((entry) => entry.id === id);
  return exists ? { mode: nextMode, id } : null;
}

function routeFor(nextMode, id) {
  return `hieda-${nextMode}-${id}`;
}

function navigateHieda(route) {
  if (decodeURIComponent(window.location.hash.slice(1)) === route) return;
  const url = new URL(window.location.href);
  url.hash = route;
  window.history.pushState({ ...(window.history.state || {}), tuHiedaRoute: route }, "", url);
  applyRoute(route);
}

function selectedDossiers() {
  if (mode === "event") return [knowledgeDossier(selectedId)].filter(Boolean);
  if (mode === "character") return dossiersForCharacter(selectedId);
  return dossiersForVersion(selectedId);
}

function characterPill(id, locale, direct = false) {
  const character = knowledgeCharacter(id);
  if (!character) return "";
  return `
    <a class="hieda-person ${direct ? "is-direct" : ""}" href="#${routeFor("character", id)}">
      <i aria-hidden="true">${escapeHtml(character.glyph)}</i>
      <span>${escapeHtml(localized(character.name, locale))}</span>
    </a>`;
}

function sourceHref(route) {
  return siteHref(route);
}

function recordCard(record, dossier, locale, c, highlightedCharacter = "") {
  const resolved = resolveKnowledgeRecord(record, locale);
  if (!resolved) return "";
  const direct = highlightedCharacter && record.characters.includes(highlightedCharacter);
  return `
    <article class="hieda-record ${direct ? "is-direct" : ""}" data-kind="${escapeHtml(record.kind)}">
      <div class="hieda-record-spine" aria-hidden="true"><i></i><span>${escapeHtml(resolved.kindLabel)}</span></div>
      <div class="hieda-record-body">
        <header>
          <div><small>${escapeHtml(dossier.code)} / ${escapeHtml(record.id.toUpperCase())}</small><h3>${escapeHtml(resolved.title)}</h3></div>
          <b>${escapeHtml(resolved.kindLabel)}</b>
        </header>
        <p class="hieda-record-detail">${escapeHtml(resolved.detail)}</p>
        <div class="hieda-thread-note"><span>${escapeHtml(c.thread)}</span><p>${escapeHtml(resolved.annotation)}</p></div>
        <footer>
          <div>${record.characters.map((id) => characterPill(id, locale, id === highlightedCharacter)).join("")}</div>
          <a href="${escapeHtml(sourceHref(resolved.route))}">${escapeHtml(c.source)} <span aria-hidden="true">↗</span></a>
        </footer>
      </div>
    </article>`;
}

function localLedger(dossiers, locale, c) {
  const events = campusLedger()
    .filter((event) => dossiers.some((dossier) => dossierMatchesEvent(dossier, event)))
    .slice()
    .reverse()
    .slice(0, 10);
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });

  return `
    <section class="hieda-local-ledger" aria-labelledby="hieda-local-title">
      <header>
        <div><p>LOCAL MARGINALIA</p><h2 id="hieda-local-title">${escapeHtml(c.localTitle)}</h2></div>
        <span>${events.length}</span>
      </header>
      <p>${escapeHtml(c.localLead)}</p>
      ${events.length ? `
        <ol>
          ${events.map((event) => {
            const subject = event.subject ? `${event.subject.kind}:${event.subject.id}` : "—";
            return `
              <li>
                <i aria-hidden="true"></i>
                <div>
                  <small>${escapeHtml(date.format(new Date(event.timestamp)))}</small>
                  <strong>${escapeHtml(campusEventLabel(event.type, locale))}</strong>
                  <dl>
                    <div><dt>${escapeHtml(c.subject)}</dt><dd>${escapeHtml(subject)}</dd></div>
                    ${event.causationId ? `<div><dt>${escapeHtml(c.caused)}</dt><dd>${escapeHtml(event.causationId)}</dd></div>` : ""}
                  </dl>
                </div>
              </li>`;
          }).join("")}
        </ol>` : `<div class="hieda-local-empty"><span aria-hidden="true">未</span><p>${escapeHtml(c.localEmpty)}</p></div>`}
      <a class="hieda-ledger-link" href="mytu.html#my-tu">${escapeHtml(c.localOpen)} <span aria-hidden="true">↗</span></a>
    </section>`;
}

function versionLinks(dossier, locale, c) {
  return `
    <div class="hieda-version-links">
      <span>${escapeHtml(c.versionSources)}</span>
      <div>
        ${dossier.versions.map((id) => {
          const entry = historyRecords.find((item) => item.id === id);
          if (!entry) return "";
          return `<a href="#${routeFor("version", id)}"><small>${escapeHtml(entry.archiveId)}</small>${escapeHtml(localized(entry.title, locale))}</a>`;
        }).join("")}
      </div>
    </div>`;
}

function dossierView(dossier, locale, c, highlightedCharacter = "") {
  const records = dossier.records
    .slice()
    .sort((left, right) => (
      Number(right.characters.includes(highlightedCharacter)) - Number(left.characters.includes(highlightedCharacter))
    ));
  const kinds = new Set(records.map((record) => record.kind));
  return `
    <section class="hieda-dossier" id="hieda-dossier-${escapeHtml(dossier.id)}">
      <header class="hieda-dossier-head">
        <div class="hieda-dossier-glyph" aria-hidden="true">${escapeHtml(dossier.glyph)}</div>
        <div>
          <p>${escapeHtml(dossier.code)} · ${kinds.size} RECORD HANDS / ${records.length} LEAVES</p>
          <h2>${escapeHtml(localized(dossier.title, locale))}</h2>
          <p>${escapeHtml(localized(dossier.lead, locale))}</p>
        </div>
        ${mode === "event" ? "" : `<a href="#${routeFor("event", dossier.id)}">${escapeHtml(c.openDossier)} <span aria-hidden="true">↗</span></a>`}
      </header>
      <aside class="hieda-contradiction">
        <span>${escapeHtml(c.contradiction)}</span>
        <p>${escapeHtml(localized(dossier.tension, locale))}</p>
      </aside>
      <div class="hieda-dossier-people">
        <span>${escapeHtml(c.people)}</span>
        <div>${dossier.characters.map((id) => characterPill(id, locale, id === highlightedCharacter)).join("")}</div>
      </div>
      <div class="hieda-record-stack">
        ${records.map((record) => recordCard(record, dossier, locale, c, highlightedCharacter)).join("")}
      </div>
      ${versionLinks(dossier, locale, c)}
    </section>`;
}

function modeHeader(locale, c) {
  if (mode === "character") {
    const character = knowledgeCharacter(selectedId);
    const count = dossiersForCharacter(selectedId).length;
    return `
      <section class="hieda-context hieda-character-context">
        <i aria-hidden="true">${escapeHtml(character.glyph)}</i>
        <div>
          <p>${escapeHtml(c.relatedDossiers)} · ${count}</p>
          <h2>${escapeHtml(localized(character.name, locale))}</h2>
          <strong>${escapeHtml(localized(character.role, locale))}</strong>
          <span>${escapeHtml(c.characterNote)}</span>
        </div>
        ${character.facultyId ? `<a href="${escapeHtml(sourceHref(`faculty-${character.facultyId}`))}">${escapeHtml(c.source)} <span aria-hidden="true">↗</span></a>` : ""}
      </section>`;
  }
  if (mode === "version") {
    const entry = historyRecords.find((item) => item.id === selectedId);
    const count = dossiersForVersion(selectedId).length;
    const commit = entry.commit || "";
    return `
      <section class="hieda-context hieda-version-context">
        <div class="hieda-version-stamp"><small>${escapeHtml(entry.archiveId)}</small><b>${escapeHtml(entry.recordedAt)}</b></div>
        <div>
          <p>${escapeHtml(c.versionDossiers)} · ${count}</p>
          <h2>${escapeHtml(localized(entry.title, locale))}</h2>
          <strong>${escapeHtml(entry.commitSubject)}</strong>
          <span>${escapeHtml(c.versionNote)}</span>
        </div>
        <div class="hieda-version-actions">
          ${commit ? `<a href="https://github.com/N0zoM1z0/touhou-university/commit/${escapeHtml(commit)}">${escapeHtml(c.gitSource)} <span aria-hidden="true">↗</span></a>` : ""}
          <a href="${escapeHtml(sourceHref(`chronicle-${entry.id}`))}">${escapeHtml(c.archiveSource)} <span aria-hidden="true">↗</span></a>
        </div>
      </section>`;
  }
  return "";
}

function indexEntries(locale) {
  const selectedFirst = (entries) => entries
    .slice()
    .sort((left, right) => Number(right.id === selectedId) - Number(left.id === selectedId));
  if (mode === "event") {
    return selectedFirst(knowledgeDossiers.map((dossier) => ({
      id: dossier.id,
      route: routeFor("event", dossier.id),
      mark: dossier.glyph,
      kicker: `${dossier.code} · ${dossier.records.length}`,
      title: localized(dossier.title, locale),
    })));
  }
  if (mode === "character") {
    return selectedFirst(knowledgeCharacters
      .map((character) => ({
        id: character.id,
        route: routeFor("character", character.id),
        mark: character.glyph,
        kicker: `${dossiersForCharacter(character.id).length} DOSSIERS`,
        title: localized(character.name, locale),
      }))
      .filter((entry) => dossiersForCharacter(entry.id).length));
  }
  return selectedFirst(historyRecords
    .slice()
    .reverse()
    .map((entry) => ({
      id: entry.id,
      route: routeFor("version", entry.id),
      mark: entry.archiveId.replace("TU-H-", ""),
      kicker: `${entry.recordedAt} · ${dossiersForVersion(entry.id).length}`,
      title: localized(entry.title, locale),
    })));
}

function indexRail(locale, c) {
  const labels = { event: c.events, character: c.characters, version: c.versions };
  return `
    <aside class="hieda-index-rail">
      <label>
        <span>${escapeHtml(c.indexSearch)}</span>
        <input type="search" data-hieda-filter placeholder="${escapeHtml(c.searchPlaceholder)}" autocomplete="off">
      </label>
      <nav aria-label="${escapeHtml(labels[mode])}" data-hieda-index-list>
        ${indexEntries(locale).map((entry) => `
          <a href="#${escapeHtml(entry.route)}" class="${entry.id === selectedId ? "active" : ""}" data-hieda-index-entry>
            <i aria-hidden="true">${escapeHtml(entry.mark)}</i>
            <span><small>${escapeHtml(entry.kicker)}</small><strong>${escapeHtml(entry.title)}</strong></span>
            <b aria-hidden="true">↗</b>
          </a>`).join("")}
      </nav>
      <p class="hieda-filter-empty" data-hieda-filter-empty hidden>${escapeHtml(c.noMatch)}</p>
    </aside>`;
}

function render() {
  if (!root) return;
  const locale = getLocale();
  const c = copy[locale];
  const dossiers = selectedDossiers();
  const highlightedCharacter = mode === "character" ? selectedId : "";
  const uniqueKinds = new Set(knowledgeDossiers.flatMap((dossier) => dossier.records.map((record) => record.kind)));

  renderPreservingState(root, () => {
    root.innerHTML = `
      <div class="hieda-hero">
        <div class="hieda-hero-copy">
          <p>${escapeHtml(c.eyebrow)}</p>
          <h1>${escapeHtml(c.title)}</h1>
          <strong>${escapeHtml(c.lead)}</strong>
        </div>
        <aside><i aria-hidden="true">求</i><p>${escapeHtml(c.notice)}</p></aside>
        <dl>
          <div><dt>${escapeHtml(c.dossiers)}</dt><dd>${knowledgeDossiers.length}</dd></div>
          <div><dt>${escapeHtml(c.hands)}</dt><dd>${knowledgeCharacters.length}</dd></div>
          <div><dt>${escapeHtml(c.versionsCount)}</dt><dd>${historyRecords.length}</dd></div>
          <div><dt>${escapeHtml(c.records)}</dt><dd>${knowledgeDossiers.reduce((sum, dossier) => sum + dossier.records.length, 0)}</dd></div>
        </dl>
      </div>
      <nav class="hieda-mode-switch" aria-label="${escapeHtml(c.eyebrow)}">
        <a href="#${routeFor("event", mode === "event" ? selectedId : knowledgeDossiers[0].id)}" class="${mode === "event" ? "active" : ""}">
          <i>一</i><span><strong>${escapeHtml(c.events)}</strong><small>${escapeHtml(c.eventHint)}</small></span>
        </a>
        <a href="#${routeFor("character", mode === "character" ? selectedId : knowledgeCharacters[0].id)}" class="${mode === "character" ? "active" : ""}">
          <i>人</i><span><strong>${escapeHtml(c.characters)}</strong><small>${escapeHtml(c.characterHint)}</small></span>
        </a>
        <a href="#${routeFor("version", mode === "version" ? selectedId : historyRecords.at(-1).id)}" class="${mode === "version" ? "active" : ""}">
          <i>版</i><span><strong>${escapeHtml(c.versions)}</strong><small>${escapeHtml(c.versionHint)}</small></span>
        </a>
        <button type="button" data-hieda-share><span>${escapeHtml(c.share)}</span><b aria-hidden="true">⌘</b></button>
      </nav>
      <div class="hieda-worktable">
        ${indexRail(locale, c)}
        <div class="hieda-reading-pane">
          ${modeHeader(locale, c)}
          <div class="hieda-reading-summary">
            <span>${escapeHtml(mode === "event" ? c.allRecords : c.direct)}</span>
            <b>${dossiers.length}</b>
            <small>${uniqueKinds.size} RECORD FORMS IN THE CABINET</small>
          </div>
          ${dossiers.map((dossier) => dossierView(dossier, locale, c, highlightedCharacter)).join("")}
          ${localLedger(dossiers, locale, c)}
        </div>
      </div>`;
  });
}

function applyRoute(route) {
  const parsed = parseRoute(route);
  if (!parsed) return;
  mode = parsed.mode;
  selectedId = parsed.id;
  render();
}

function filterIndex(value) {
  const query = value.trim().toLocaleLowerCase(getLocale());
  const entries = [...root.querySelectorAll("[data-hieda-index-entry]")];
  let visible = 0;
  entries.forEach((entry) => {
    const match = !query || entry.textContent.toLocaleLowerCase(getLocale()).includes(query);
    entry.hidden = !match;
    if (match) visible += 1;
  });
  const empty = root.querySelector("[data-hieda-filter-empty]");
  if (empty) empty.hidden = visible > 0;
}

export function initHiedaIndex() {
  if (!root) return;
  const initial = parseRoute(decodeURIComponent(window.location.hash.slice(1))) || {
    mode: "event",
    id: knowledgeDossiers[0].id,
  };
  mode = initial.mode;
  selectedId = initial.id;

  registerDeepLink("hieda-", {
    open: (_value, route) => applyRoute(route),
    anchor: (route) => (
      route === "hieda-index"
        ? document.querySelector("#hieda-index")
        : window.matchMedia("(max-width: 760px)").matches
          ? root.querySelector(".hieda-mode-switch") || root
          : root.querySelector(".hieda-worktable") || root
    ),
    position: "always",
  });

  root.addEventListener("input", (event) => {
    if (event.target.matches("[data-hieda-filter]")) filterIndex(event.target.value);
  });
  root.addEventListener("click", async (event) => {
    const share = event.target.closest("[data-hieda-share]");
    if (share) {
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
      showToast(copy[getLocale()].copied);
      return;
    }
    const internal = event.target.closest('a[href^="#hieda-"]');
    if (!internal) return;
    event.preventDefault();
    navigateHieda(decodeURIComponent(internal.hash.slice(1)));
  });

  window.addEventListener("tu:languagechange", render);
  window.addEventListener("tu:ledgerchange", render);
  window.addEventListener("storage", (event) => {
    if (event.key === "tu:campus:ledger") render();
  });
  render();
}
