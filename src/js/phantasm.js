import {
  phantasmCopy,
  phantasmCourses,
  phantasmExaminers,
  phantasmNodes,
} from "../data/phantasm.js";
import { registerDeepLink, navigateToDeepLink } from "./deep-links.js";
import { getLocale } from "./i18n.js";
import {
  availableDreamCourses,
  completeDreamDefence,
  dreamCounterfactuals,
  dreamRulingCopy,
  dreamTranscripts,
  enterPhantasm,
  phantasmHasReturnedBook,
  phantasmProgress,
  phantasmState,
  ringDreamBell,
  selectDreamNode,
  toggleDreamCourse,
  wakeFromPhantasm,
} from "./phantasm-model.js";
import { printDocument } from "./print-document.js";
import { showToast } from "./ui.js";

const root = document.querySelector("[data-phantasm-app]");
let selectedTranscriptId = null;
let composing = false;

function text(value, locale = getLocale()) {
  return value?.[locale] || value?.["zh-Hant"] || value?.en || "";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value, locale = getLocale()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale === "ja" ? "ja-JP" : "zh-TW", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function identity() {
  try {
    return JSON.parse(window.localStorage.getItem("tu:identity") || "null");
  } catch {
    return null;
  }
}

function lockedView(locale, c, progress) {
  const seals = progress.seals.map((seal, index) => `
    <article class="phantasm-seal ${seal.met ? "is-met" : ""}" style="--seal-index:${index}">
      <span aria-hidden="true">${seal.mark}</span>
      <div>
        <p>${escapeHtml(text(seal.copy.name, locale))}</p>
        <h2>${escapeHtml(text(seal.met ? seal.copy.found : seal.copy.missing, locale))}</h2>
        ${seal.timestamp ? `<time datetime="${escapeHtml(seal.timestamp)}">${formatDate(seal.timestamp, locale)}</time>` : "<i>···</i>"}
      </div>
    </article>`).join("");
  return `
    <div class="phantasm-gate">
      <div class="phantasm-gate-sky" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="container">
        <header class="phantasm-gate-copy">
          <p>${c.lockedEyebrow}</p>
          <h1 id="phantasm-title">${c.lockedTitle}</h1>
          <span>${c.lockedLead}</span>
          <div class="phantasm-gate-count">
            <strong>${progress.count}</strong><b>/ ${progress.total}</b><small>${c.lockedCount}</small>
          </div>
        </header>
        <div class="phantasm-seal-board">${seals}</div>
        <footer class="phantasm-gate-actions">
          <p>${c.lockedNote}</p>
          <div>
            <a class="button button-secondary" href="mytu.html#my-tu">${c.returnMytu}</a>
            <a class="button button-secondary" href="mytu.html#academic-work">${c.openOrdinary}</a>
          </div>
        </footer>
      </div>
    </div>`;
}

function shiftedNode(node, phase, rings) {
  const phaseIndex = ["before", "ninth", "after", "never"].indexOf(phase);
  const direction = (node.id.length + rings) % 2 ? 1 : -1;
  const dx = phaseIndex === 0 ? 0 : direction * (4 + phaseIndex * 2);
  const dy = phaseIndex === 3 ? direction * 10 : (phaseIndex - 1) * ((node.mark.charCodeAt(0) % 5) + 1);
  return {
    x: Math.max(8, Math.min(92, node.x + dx)),
    y: Math.max(10, Math.min(88, node.y + dy)),
  };
}

function mapView(locale, c, state) {
  const selected = phantasmNodes.find((node) => node.id === state.selectedNodeId) || phantasmNodes.find((node) => node.id === "ninth-bell");
  const nodes = phantasmNodes.map((node, index) => {
    const position = shiftedNode(node, state.bellPhase, state.bellRings);
    return `
      <button
        type="button"
        class="phantasm-map-node ${selected.id === node.id ? "is-active" : ""}"
        style="--node-x:${position.x}%;--node-y:${position.y}%;--node-index:${index}"
        data-phantasm-node="${node.id}"
        data-phantasm-route="phantasm-node-${node.id}"
        aria-label="${escapeHtml(text(node.title, locale))}"
      ><span>${node.mark}</span><b>${escapeHtml(text(node.title, locale))}</b></button>`;
  }).join("");
  return `
    <section class="phantasm-map-section" aria-labelledby="phantasm-map-title">
      <header class="phantasm-section-heading">
        <div><p>REVERSE CAMPUS / CREASE MAP</p><h2 id="phantasm-map-title">${c.mapTitle}</h2></div>
        <p>${c.mapLead}</p>
      </header>
      <div class="phantasm-map-layout">
        <div class="phantasm-map" data-bell-phase="${state.bellPhase}">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <path d="M18 25 C30 42 38 32 50 45 S69 22 72 20 M50 45 C40 56 30 64 25 70 M50 45 C62 54 72 59 82 63 M50 45 L49 84" />
            <path class="phantasm-map-echo" d="M16 28 C33 12 61 79 84 60 M24 73 C48 20 69 21 50 87" />
          </svg>
          <div class="phantasm-map-crease" aria-hidden="true"></div>
          ${nodes}
          <button class="phantasm-bell" type="button" data-phantasm-bell>
            <span aria-hidden="true">九</span><b>${c.ring}</b>
          </button>
        </div>
        <article class="phantasm-place-file" data-phantasm-route="phantasm-node-${selected.id}">
          <p>${c.selectedPlace}</p>
          <span aria-hidden="true">${selected.mark}</span>
          <h3>${escapeHtml(text(selected.title, locale))}</h3>
          <strong>${escapeHtml(text(selected.role, locale))}</strong>
          <div>${escapeHtml(text(selected.body, locale))}</div>
          <small>${c.dreamTime} · ${c.bellLabels[state.bellPhase]} · ${String(state.bellRings).padStart(2, "0")} / 09</small>
        </article>
      </div>
    </section>`;
}

function counterfactualView(locale, c, fragments) {
  const user = identity();
  const libraryBonus = fragments.find((item) => item.sealId === "book-returned");
  return `
    <section class="phantasm-counterfactuals" aria-labelledby="phantasm-transcript-title">
      <header class="phantasm-document-heading">
        <div>
          <p>${c.transcriptEyebrow}</p>
          <h2 id="phantasm-transcript-title">${c.transcriptTitle}</h2>
          <strong>${c.invalid}</strong>
        </div>
        <dl>
          <div><dt>${c.student}</dt><dd>${escapeHtml(user?.name || c.studentFallback)}</dd></div>
          <div><dt>NO.</dt><dd>${escapeHtml(user?.id || "TU-DREAM-000000")}</dd></div>
        </dl>
      </header>
      <div class="phantasm-counter-list">
        ${fragments.map((fragment) => `
          <article>
            <span aria-hidden="true">${fragment.mark}</span>
            <div>
              <p>${escapeHtml(fragment.title)}</p>
              <time datetime="${escapeHtml(fragment.sourceAt || "")}">${formatDate(fragment.sourceAt, locale)}</time>
            </div>
            <section><b>${c.ordinaryColumn}</b><p>${escapeHtml(fragment.ordinary)}</p></section>
            <section><b>${c.dreamColumn}</b><p>${escapeHtml(fragment.dream)}</p></section>
          </article>`).join("")}
      </div>
      ${libraryBonus ? "" : `<p class="phantasm-library-null">${c.noLibrary}</p>`}
      <footer><span>${c.officialWarning}</span><b>REVERSE COPY · ${String(fragments.length).padStart(2, "0")} FOLIOS</b></footer>
    </section>`;
}

function courseView(locale, c, state) {
  const courses = availableDreamCourses();
  return `
    <section class="phantasm-courses" aria-labelledby="phantasm-courses-title">
      <header class="phantasm-section-heading">
        <div><p>${c.coursesEyebrow}</p><h2 id="phantasm-courses-title">${c.coursesTitle}</h2></div>
        <p>${c.coursesLead}</p>
      </header>
      <div class="phantasm-registration-strip">
        <span>${state.enrolledCourseIds.length} / 3 ${c.selectedCount}</span>
        <i><b style="--selection:${state.enrolledCourseIds.length}"></b></i>
        <small>${c.scheduleValue}</small>
      </div>
      <div class="phantasm-course-grid">
        ${courses.map((course) => {
          const selected = state.enrolledCourseIds.includes(course.id);
          return `
            <article class="${selected ? "is-selected" : ""} ${course.available ? "" : "is-locked"}" data-phantasm-route="phantasm-course-${course.id}">
              <header><span>${course.mark}</span><div><p>${course.id}</p><h3>${escapeHtml(text(course.title, locale))}</h3></div></header>
              <dl>
                <div><dt>${c.teacher}</dt><dd>${escapeHtml(text(course.teacher, locale))}</dd></div>
                <div><dt>${c.credits}</dt><dd>${escapeHtml(text(course.credits, locale))}</dd></div>
                <div><dt>${c.room}</dt><dd>${escapeHtml(text(course.room, locale))}</dd></div>
                <div><dt>${c.schedule}</dt><dd>${c.scheduleValue}</dd></div>
              </dl>
              <section><b>${c.syllabus}</b><p>${escapeHtml(text(course.syllabus, locale))}</p></section>
              <section><b>${c.assessment}</b><p>${escapeHtml(text(course.assessment, locale))}</p></section>
              <footer>
                ${course.available
                  ? `<button type="button" data-phantasm-course="${course.id}">${selected ? c.drop : c.choose}</button>`
                  : `<span>${c.bonusLocked}</span>`}
                ${selected ? `<strong>${c.selected}</strong>` : ""}
              </footer>
            </article>`;
        }).join("")}
      </div>
    </section>`;
}

function transcriptCard(record, locale, c, fragments, { focused = false } = {}) {
  const examiner = phantasmExaminers.find((item) => item.id === record.examinerId) || phantasmExaminers[0];
  const fragment = fragments.find((item) => item.id === record.fragmentId);
  const courses = record.courseIds.map((id) => phantasmCourses.find((course) => course.id === id)).filter(Boolean);
  const ruling = dreamRulingCopy(record.rulingId, record.examinerId, locale);
  return `
    <article class="phantasm-final-transcript ${focused ? "is-focused" : ""}" data-dream-transcript="${record.id}" data-phantasm-route="phantasm-transcript-${record.id}">
      <header>
        <div><p>${c.transcriptEyebrow}</p><h3>${c.transcriptTitle}</h3><strong>${c.invalid}</strong></div>
        <span aria-hidden="true">夢</span>
      </header>
      <dl class="phantasm-transcript-meta">
        <div><dt>TRANSCRIPT NO.</dt><dd>${escapeHtml(record.id)}</dd></div>
        <div><dt>${c.student}</dt><dd>${escapeHtml(record.studentName || c.studentFallback)} · ${escapeHtml(record.studentId)}</dd></div>
        <div><dt>${c.issued}</dt><dd>${formatDate(record.completedAt, locale)}</dd></div>
        <div><dt>${c.dreamTime}</dt><dd>${c.bellLabels[record.bellPhase]}</dd></div>
      </dl>
      <section>
        <p>${c.coursesLabel}</p>
        <ol>${courses.map((course) => `<li><b>${course.id}</b><span>${escapeHtml(text(course.title, locale))}</span><small>${escapeHtml(text(course.credits, locale))}</small></li>`).join("")}</ol>
      </section>
      <section class="phantasm-defended-route">
        <p>${c.defended}</p>
        <h4>${escapeHtml(fragment?.title || record.fragmentTitle)}</h4>
        <blockquote>${escapeHtml(record.statement)}</blockquote>
      </section>
      <div class="phantasm-ruling-grid">
        <section><p>${c.ruling}</p><strong>${escapeHtml(text(examiner.name, locale))}</strong><span>${escapeHtml(ruling.ruling)}</span></section>
        <section><p>${c.conditions}</p><span>${escapeHtml(ruling.condition)}</span></section>
        <section><p>${c.dissent}</p><span>${escapeHtml(ruling.dissent)}</span></section>
      </div>
      <footer>
        <span>${c.residue} · ${c.residueLabels[record.residueIndex]}</span>
        <b>${c.officialWarning}</b>
        <div data-print-exclude>
          <button type="button" data-phantasm-print="${record.id}">${c.print}</button>
          <button type="button" data-phantasm-share="${record.id}">${c.share}</button>
        </div>
      </footer>
    </article>`;
}

function defenceView(locale, c, state, fragments) {
  const records = dreamTranscripts();
  const selectedRecord = records.find((record) => record.id === selectedTranscriptId) || records.at(-1);
  return `
    <section class="phantasm-defence" aria-labelledby="phantasm-defence-title">
      <header class="phantasm-section-heading">
        <div><p>${c.defenceEyebrow}</p><h2 id="phantasm-defence-title">${c.defenceTitle}</h2></div>
        <p>${c.defenceLead}</p>
      </header>
      <div class="phantasm-defence-layout">
        <form data-phantasm-defence-form>
          <label>${c.fragment}
            <select name="fragmentId" required>
              ${fragments.map((fragment) => `<option value="${fragment.id}">${fragment.mark} · ${escapeHtml(fragment.title)}</option>`).join("")}
            </select>
          </label>
          <label>${c.examiner}
            <select name="examinerId" required>
              ${phantasmExaminers.map((examiner) => `<option value="${examiner.id}">${escapeHtml(text(examiner.name, locale))} · ${escapeHtml(text(examiner.role, locale))}</option>`).join("")}
            </select>
          </label>
          <label>${c.statement}
            <textarea name="statement" rows="7" minlength="24" maxlength="1200" placeholder="${escapeHtml(c.statementPlaceholder)}" required></textarea>
          </label>
          <div class="phantasm-defence-desk">
            <span>${state.enrolledCourseIds.length} / 3</span>
            <button type="submit">${c.submitDefence}<b aria-hidden="true">↘</b></button>
          </div>
        </form>
        <aside>
          <span aria-hidden="true">審</span>
          <p>${text(phantasmExaminers[0].role, locale)}</p>
          <h3>${text(phantasmExaminers[0].name, locale)}</h3>
          <blockquote>${locale === "ja"
            ? "夢は採用しなかった案のゴミ箱ではない。捨てた理由まで食べられる形で持ってきて。"
            : locale === "en"
              ? "A dream is not a wastebasket for rejected options. Bring the reason you discarded it in a form I can eat."
              : "夢不是把沒採用方案丟進去的紙簍。連同你丟掉它的理由，一起整理成我吃得下的樣子。"}</blockquote>
          <small>DREAM EATER'S OFFICE · WINDOW 09</small>
        </aside>
      </div>
      <div class="phantasm-records">
        <header><p>TU-DREAM-TRANSCRIPT ARCHIVE</p><h3>${c.records}</h3><span>${records.length}</span></header>
        ${records.length
          ? records.slice().reverse().map((record) => transcriptCard(record, locale, c, fragments, { focused: record.id === selectedRecord?.id })).join("")
          : `<p class="phantasm-empty-record">${c.noRecords}</p>`}
      </div>
    </section>`;
}

function unlockedView(locale, c, state, fragments) {
  return `
    <div class="phantasm-campus" data-phantasm-phase="${state.bellPhase}">
      <header class="phantasm-hero">
        <div class="phantasm-orbit" aria-hidden="true"><i></i><i></i><i></i><b>夢</b></div>
        <div class="container">
          <p>${c.campusEyebrow}</p>
          <h1 id="phantasm-title">${c.campusTitle}</h1>
          <span>${c.campusLead}</span>
          <dl>
            <div><dt>${c.dreamTime}</dt><dd>${c.bellLabels[state.bellPhase]}</dd></div>
            <div><dt>VISIT</dt><dd>${String(state.visits).padStart(2, "0")}</dd></div>
            <div><dt>RINGS</dt><dd>${String(state.bellRings).padStart(2, "0")} / 09</dd></div>
          </dl>
        </div>
      </header>
      <div class="container phantasm-body">
        ${mapView(locale, c, state)}
        ${counterfactualView(locale, c, fragments)}
        ${courseView(locale, c, state)}
        ${defenceView(locale, c, state, fragments)}
        <section class="phantasm-wake">
          <div><p>EXIT / 未行校門</p><h2>${c.wake}</h2><span>${c.wakeNote}</span></div>
          <button type="button" data-phantasm-wake><span aria-hidden="true">未</span>${c.wake}</button>
        </section>
      </div>
    </div>`;
}

function render({ preserveScroll = false } = {}) {
  if (!root) return;
  const scrollY = preserveScroll ? window.scrollY : null;
  const locale = getLocale();
  const c = phantasmCopy[locale] || phantasmCopy["zh-Hant"];
  const progress = phantasmProgress();
  const state = phantasmState();
  const unlocked = Boolean(state.unlockedAt);
  const fragments = unlocked ? dreamCounterfactuals(locale) : [];
  root.innerHTML = unlocked
    ? unlockedView(locale, c, state, fragments)
    : lockedView(locale, c, progress);
  document.body.classList.toggle("phantasm-is-open", unlocked);
  if (scrollY !== null) window.requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "auto" }));
}

function openRoute(suffix) {
  if (!phantasmState().unlockedAt) {
    render();
    return;
  }
  if (suffix.startsWith("node-")) {
    selectDreamNode(suffix.slice(5));
    render({ preserveScroll: true });
  } else if (suffix.startsWith("transcript-")) {
    selectedTranscriptId = suffix.slice(11);
    render({ preserveScroll: true });
  } else {
    render({ preserveScroll: true });
  }
}

async function shareTranscript(id, c) {
  const route = `phantasm-transcript-${id}`;
  navigateToDeepLink(route);
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast(c.share);
  } catch {
    window.location.hash = route;
  }
}

function bind() {
  root.addEventListener("compositionstart", () => {
    composing = true;
  });
  root.addEventListener("compositionend", () => {
    composing = false;
  });
  root.addEventListener("click", (event) => {
    const node = event.target.closest("[data-phantasm-node]");
    if (node) {
      navigateToDeepLink(`phantasm-node-${node.dataset.phantasmNode}`);
      return;
    }
    const bell = event.target.closest("[data-phantasm-bell]");
    if (bell) {
      ringDreamBell();
      render({ preserveScroll: true });
      return;
    }
    const course = event.target.closest("[data-phantasm-course]");
    if (course) {
      const outcome = toggleDreamCourse(course.dataset.phantasmCourse);
      const c = phantasmCopy[getLocale()] || phantasmCopy["zh-Hant"];
      if (outcome.error === "course-limit") showToast(c.needCourses);
      render({ preserveScroll: true });
      return;
    }
    const print = event.target.closest("[data-phantasm-print]");
    if (print) {
      const documentRoot = root.querySelector(`[data-dream-transcript="${CSS.escape(print.dataset.phantasmPrint)}"]`);
      printDocument(documentRoot, { title: `TU-DREAM-TRANSCRIPT-${print.dataset.phantasmPrint}` });
      return;
    }
    const share = event.target.closest("[data-phantasm-share]");
    if (share) {
      shareTranscript(share.dataset.phantasmShare, phantasmCopy[getLocale()] || phantasmCopy["zh-Hant"]);
      return;
    }
    const wake = event.target.closest("[data-phantasm-wake]");
    if (wake) {
      wakeFromPhantasm();
      window.location.assign("mytu.html#my-tu");
    }
  });
  root.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-phantasm-defence-form]");
    if (!form || composing) return;
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    const c = phantasmCopy[getLocale()] || phantasmCopy["zh-Hant"];
    const outcome = completeDreamDefence(values);
    if (outcome.error === "courses") {
      showToast(c.needCourses);
      return;
    }
    if (outcome.error === "statement") {
      showToast(c.needStatement);
      return;
    }
    if (!outcome.record) return;
    selectedTranscriptId = outcome.record.id;
    showToast(c.completed);
    navigateToDeepLink(`phantasm-transcript-${outcome.record.id}`, { replace: true });
    render({ preserveScroll: true });
  });
}

export function initPhantasm() {
  if (!root) return;
  const entrance = enterPhantasm();
  render();
  bind();
  registerDeepLink("phantasm-", {
    anchor: (route) => root.querySelector(`[data-phantasm-route="${CSS.escape(route)}"]`) || root,
    open: openRoute,
    close() {},
    position: "always",
  });
  window.addEventListener("tu:languagechange", () => render({ preserveScroll: true }));
  window.addEventListener("storage", (event) => {
    if (event.key?.startsWith("tu:")) render({ preserveScroll: true });
  });
  if (entrance.firstEntry) {
    window.requestAnimationFrame(() => root.classList.add("phantasm-first-entry"));
  }
}
