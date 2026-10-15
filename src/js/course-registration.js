import { trees as catalogTrees } from "../generated/i18n/ui/course-registration.js";
import {
  courseByCode,
  courseCatalogue,
  courseDays,
  coursePeriods,
  courseTerm,
} from "../data/courses.js";
import { schools } from "../data/schools.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { getLocale } from "./i18n.js";
import { printDocument } from "./print-document.js";
import { bindImeSafeInput, isImeComposing } from "./ime-input.js";
import { mutateAndRenderPreservingState, renderPreservingState } from "./render-state.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

const REGISTRATION_KEY = "tu:courses:registration";
const TRANSCRIPT_KEY = "tu:courses:transcript";
const IDENTITY_KEY = "tu:identity";

const copy = catalogTrees["copy"];

let activeTab = "catalogue";
let activeCourse = "BIS-101";
let filterQuery = "";
let filterSchool = "all";
let filterState = "all";
let positionedRoute = "";

function readJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function registration() {
  const raw = readJson(REGISTRATION_KEY, null);
  if (Array.isArray(raw)) return { schema: 1, term: courseTerm.id, entries: raw };
  if (!raw || !Array.isArray(raw.entries)) return { schema: 1, term: courseTerm.id, entries: [] };
  return { schema: 1, term: raw.term || courseTerm.id, entries: raw.entries.filter((entry) => courseByCode(entry.courseCode)) };
}

function transcript() {
  const raw = readJson(TRANSCRIPT_KEY, []);
  return Array.isArray(raw) ? raw.filter((entry) => courseByCode(entry.courseCode)) : [];
}

function saveRegistration(value) {
  value.updatedAt = new Date().toISOString();
  window.localStorage.setItem(REGISTRATION_KEY, JSON.stringify(value));
}

function formatDate(value, locale, withTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "long" }).format(date);
}

function meeting(course, locale) {
  const [start, end] = coursePeriods[course.period];
  return `${courseDays[course.day][locale]} · ${start}–${end} · ${course.room}`;
}

function currentEntry(code, records = registration()) {
  return records.entries.find((entry) => entry.courseCode === code);
}

function completedCodes() {
  return new Set(transcript().filter((entry) => entry.status !== "failed" && entry.grade !== "F").map((entry) => entry.courseCode));
}

function prerequisiteCodes(records = registration()) {
  return new Set([
    ...completedCodes(),
    ...records.entries.filter((entry) => entry.status === "enrolled").map((entry) => entry.courseCode),
  ]);
}

function selectedCredits(records = registration()) {
  return records.entries
    .filter((entry) => entry.status === "enrolled")
    .reduce((sum, entry) => sum + (courseByCode(entry.courseCode)?.credits || 0), 0);
}

function conflictsFor(course, records = registration()) {
  return records.entries
    .filter((entry) => entry.status === "enrolled" && entry.courseCode !== course.code)
    .map((entry) => courseByCode(entry.courseCode))
    .filter((other) =>
      (course.day === other.day && course.period === other.period) ||
      course.conflictsWith?.includes(other.code) ||
      other.conflictsWith?.includes(course.code),
    );
}

function eligibility(course, records = registration()) {
  const eligiblePrerequisites = prerequisiteCodes(records);
  const missing = course.prerequisites.filter((code) => !eligiblePrerequisites.has(code));
  const conflicts = conflictsFor(course, records);
  const overLimit = selectedCredits(records) + course.credits > courseTerm.creditLimit;
  return { missing, conflicts, overLimit };
}

function canRegister(course, records = registration()) {
  if (currentEntry(course.code, records)) return false;
  const result = eligibility(course, records);
  if (result.missing.length || result.conflicts.length) return false;
  return openSeats(course, records) > 0 || !course.noWaitlist;
}

function openSeats(course, records = registration()) {
  const local = currentEntry(course.code, records)?.status === "enrolled" ? 1 : 0;
  return Math.max(0, course.capacity - course.occupied - local);
}

function statusText(entry, c) {
  if (!entry) return "";
  if (entry.status === "waitlisted") return `${c.onWaitlist} · ${c.waitlistPosition} ${entry.position || 1}`;
  return c.selected;
}

function actionFor(course, locale, c, records) {
  const identity = readJson(IDENTITY_KEY, null);
  const entry = currentEntry(course.code, records);
  if (entry?.status === "enrolled") return `<button class="course-action danger" type="button" data-course-drop="${course.code}">${c.drop}</button>`;
  if (entry?.status === "waitlisted") return `<button class="course-action danger" type="button" data-course-drop="${course.code}">${c.cancelWaitlist}</button>`;
  if (!identity) return `<a class="course-action" href="mytu.html#my-tu">${c.createIdentity}</a>`;
  const result = eligibility(course, records);
  const disabledReason = result.missing.length
    ? `${c.missingPrerequisite}: ${result.missing.join(", ")}`
    : result.conflicts.length
      ? `${c.conflict}: ${result.conflicts.map((item) => item.code).join(", ")}`
      : "";
  if (disabledReason) return `<button class="course-action" type="button" disabled title="${escapeHtml(disabledReason)}">${escapeHtml(disabledReason)}</button>`;
  const seats = openSeats(course, records);
  if (!seats && course.noWaitlist) return `<button class="course-action" type="button" disabled>${c.noWaitlist}</button>`;
  return `<button class="course-action" type="button" data-course-add="${course.code}">${seats ? c.add : c.joinWaitlist}</button>`;
}

function renderCourseDetail(course, locale, c, records) {
  const entry = currentEntry(course.code, records);
  const result = eligibility(course, records);
  const seats = openSeats(course, records);
  return `
    <aside class="course-detail" style="--school-accent:${schools[course.schoolId].accent}">
      <header>
        <p>${escapeHtml(course.school[locale])}</p>
        <code>${course.code}</code>
        <h3>${escapeHtml(course.title[locale])}</h3>
        ${entry ? `<span class="course-status" data-status="${entry.status}">${statusText(entry, c)}</span>` : ""}
      </header>
      <dl>
        <div><dt>${c.instructor}</dt><dd>${escapeHtml(course.instructor[locale])}</dd></div>
        <div><dt>${c.meeting}</dt><dd>${escapeHtml(meeting(course, locale))}</dd></div>
        <div><dt>${c.creditsLabel}</dt><dd>${course.credits}</dd></div>
        <div><dt>${c.seats}</dt><dd>${seats ? `${seats} ${c.seatsOpen}` : c.full} · ${course.occupied}/${course.capacity}</dd></div>
        <div><dt>${c.prerequisite}</dt><dd>${course.prerequisites.length ? course.prerequisites.join(", ") : c.noPrerequisite}</dd></div>
      </dl>
      <blockquote>${escapeHtml(course.note[locale])}</blockquote>
      ${course.boundaryAdjacent ? `<p class="course-boundary-note">※ ${c.boundaryWarning}</p>` : ""}
      ${result.missing.length && !entry ? `<p class="course-blocker">${c.missingPrerequisite}: <strong>${result.missing.join(", ")}</strong></p>` : ""}
      ${result.conflicts.length && !entry ? `<p class="course-blocker">${c.conflict}: <strong>${result.conflicts.map((item) => item.code).join(", ")}</strong></p>` : ""}
      ${result.overLimit && !entry ? `<p class="course-overload-note">※ ${c.overloadWarning}</p>` : ""}
      ${actionFor(course, locale, c, records)}
    </aside>`;
}

function renderCatalogue(locale, c, records) {
  const query = filterQuery.toLocaleLowerCase();
  const courses = courseCatalogue.filter((course) => {
    if (filterSchool !== "all" && course.schoolId !== filterSchool) return false;
    const seats = openSeats(course, records);
    if (filterState === "eligible" && !canRegister(course, records)) return false;
    if (filterState === "open" && !seats) return false;
    if (filterState === "waitlist" && seats) return false;
    if (!query) return true;
    const haystack = [course.code, ...Object.values(course.title), ...Object.values(course.instructor), ...Object.values(course.note)].join(" ").toLocaleLowerCase();
    return haystack.includes(query);
  });
  const selected = courses.find((course) => course.code === activeCourse) || courses[0] || courseCatalogue[0];
  return `
    <section class="course-catalogue">
      <form class="course-filters" data-course-filter-form>
        <label><span>${c.search}</span><input type="search" name="query" value="${escapeHtml(filterQuery)}" placeholder="${c.search}" data-preserve-focus="course-query"></label>
        <label><span class="visually-hidden">${c.allSchools}</span><select name="school" data-preserve-focus="course-school">
          <option value="all">${c.allSchools}</option>
          ${Object.entries(schools).map(([id, school]) => `<option value="${id}" ${filterSchool === id ? "selected" : ""}>${escapeHtml(school.name[locale])}</option>`).join("")}
        </select></label>
        <label><span class="visually-hidden">${c.allStates}</span><select name="state" data-preserve-focus="course-state">
          <option value="all">${c.allStates}</option>
          <option value="eligible" ${filterState === "eligible" ? "selected" : ""}>${c.eligibleOnly}</option>
          <option value="open" ${filterState === "open" ? "selected" : ""}>${c.openOnly}</option>
          <option value="waitlist" ${filterState === "waitlist" ? "selected" : ""}>${c.waitlistOnly}</option>
        </select></label>
        <button type="submit">${c.applyFilters}</button>
      </form>
      <p class="course-result-count"><strong>${courses.length}</strong> ${c.resultCount}</p>
      <div class="course-catalogue-layout">
        <div class="course-list" role="list" data-preserve-scroll="course-list">
          ${courses.length ? courses.map((course) => {
            const entry = currentEntry(course.code, records);
            const seats = openSeats(course, records);
            return `
              <button type="button" role="listitem" class="${course.code === selected.code ? "is-active" : ""}" data-course-select="${course.code}" style="--school-accent:${schools[course.schoolId].accent}">
                <span><code>${course.code}</code><small>${course.credits} ${c.creditsLabel}</small></span>
                <strong>${escapeHtml(course.title[locale])}</strong>
                <p>${escapeHtml(course.instructor[locale])} · ${escapeHtml(courseDays[course.day][locale])} ${coursePeriods[course.period][0]}</p>
                <i data-seat-state="${seats ? "open" : "full"}">${entry ? statusText(entry, c) : seats ? `${seats} ${c.seatsOpen}` : c.full}</i>
              </button>`;
          }).join("") : `<p class="course-empty">${c.emptyCatalogue}</p>`}
        </div>
        ${courses.length ? renderCourseDetail(selected, locale, c, records) : ""}
      </div>
    </section>`;
}

function renderSchedule(locale, c, records) {
  const enrolled = records.entries.map((entry) => ({ entry, course: courseByCode(entry.courseCode) })).filter(({ entry }) => entry.status === "enrolled");
  const waitlisted = records.entries.map((entry) => ({ entry, course: courseByCode(entry.courseCode) })).filter(({ entry }) => entry.status === "waitlisted");
  return `
    <section class="course-schedule">
      <header><p>${c.weeklyGrid}</p><h3>${c.enrolledCourses}</h3></header>
      ${enrolled.length ? `<div class="course-week-grid">${enrolled
        .sort((a, b) => Object.keys(courseDays).indexOf(a.course.day) - Object.keys(courseDays).indexOf(b.course.day) || a.course.period.localeCompare(b.course.period))
        .map(({ course }) => `
          <article data-day="${course.day}" style="--school-accent:${schools[course.schoolId].accent}">
            <time>${escapeHtml(courseDays[course.day][locale])}<strong>${coursePeriods[course.period][0]}</strong></time>
            <div><code>${course.code}</code><h4>${escapeHtml(course.title[locale])}</h4><p>${escapeHtml(course.room)} · ${escapeHtml(course.instructor[locale])}</p></div>
            <button type="button" data-course-drop="${course.code}" aria-label="${c.drop} ${course.code}">×</button>
          </article>`).join("")}</div>` : `<p class="course-empty">${c.emptySchedule}</p>`}
      <p class="course-schedule-note">※ ${c.lunarFootnote}</p>
      <div class="course-waitlist">
        <h3>${c.waitlistCourses}</h3>
        ${waitlisted.length ? waitlisted.map(({ entry, course }) => `
          <article><div><code>${course.code}</code><strong>${escapeHtml(course.title[locale])}</strong><span>${c.waitlistPosition} ${entry.position || 1}</span></div><button type="button" data-course-drop="${course.code}">${c.cancelWaitlist}</button></article>`).join("") : `<p>—</p>`}
      </div>
    </section>`;
}

function gradePoint(grade) {
  return { "A+": 4.3, A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2, D: 1, F: 0 }[grade];
}

function recordMetrics(records) {
  const completed = transcript();
  const graded = completed.filter((entry) => Number.isFinite(gradePoint(entry.grade)));
  const earned = completed.filter((entry) => entry.grade !== "F").reduce((sum, entry) => sum + (courseByCode(entry.courseCode)?.credits || 0), 0);
  const points = graded.reduce((sum, entry) => sum + gradePoint(entry.grade) * (courseByCode(entry.courseCode)?.credits || 0), 0);
  const credits = graded.reduce((sum, entry) => sum + (courseByCode(entry.courseCode)?.credits || 0), 0);
  return { completed, earned, gpa: credits ? (points / credits).toFixed(2) : "—", current: records.entries.filter((entry) => entry.status === "enrolled") };
}

function assessmentRows(locale) {
  const entrance = readJson("tu:exam:history", []).map((entry) => ({
    id: entry.id || "ENTRANCE",
    result: `${Number(entry.percent) || 0}%`,
    date: entry.completedAt,
  }));
  const unified = readJson("tu:gaokao:attempts", []).map((entry) => ({
    id: `${String(entry.difficultyId || "normal").toUpperCase()} · ${String(entry.trackId || "")}`,
    result: `${Number(entry.score) || 0}/${Number(entry.total) || 150}`,
    date: entry.completedAt,
  }));
  return [...entrance, ...unified].slice(-6).reverse().map((entry) => `<li><strong>${escapeHtml(entry.id)}</strong><span>${escapeHtml(entry.result)} · ${formatDate(entry.date, locale)}</span></li>`).join("");
}

function renderAcademicRecord(locale, c, records) {
  const metrics = recordMetrics(records);
  return `
    <section class="course-record">
      <div class="course-record-summary">
        <article><span>${c.standing}</span><strong>${c.firstRegistration}</strong></article>
        <article><span>${c.earnedCredits}</span><strong>${metrics.earned}</strong></article>
        <article><span>${c.gpa}</span><strong>${metrics.gpa}</strong></article>
        <article><span>${c.inProgress}</span><strong>${metrics.current.length}</strong></article>
      </div>
      <div class="course-record-columns">
        <section>
          <header><p>ACADEMIC COURSEWORK</p><h3>${c.completed}</h3></header>
          ${metrics.completed.length ? `<table><thead><tr><th>${c.codeCourse}</th><th>${c.creditsLabel}</th><th>${c.grade}</th></tr></thead><tbody>${metrics.completed.map((entry) => {
            const course = courseByCode(entry.courseCode);
            return `<tr><td><code>${course.code}</code> ${escapeHtml(course.title[locale])}</td><td>${course.credits}</td><td>${escapeHtml(entry.grade || "P")}</td></tr>`;
          }).join("")}</tbody></table>` : `<p class="course-empty">${c.noCompleted}</p>`}
        </section>
        <section>
          <header><p>NON-CREDIT DOSSIER</p><h3>${c.assessments}</h3></header>
          <ul class="course-assessments">${assessmentRows(locale) || `<li>${c.noAssessments}</li>`}</ul>
        </section>
      </div>
      <footer>
        <button class="button button-secondary" type="button" data-course-document="confirmation">${c.openConfirmation}</button>
        <button class="button button-primary" type="button" data-course-document="transcript">${c.openTranscript} <span aria-hidden="true">↗</span></button>
      </footer>
    </section>`;
}

function documentRows(mode, locale, c, records) {
  const metrics = recordMetrics(records);
  if (mode === "confirmation") {
    const entries = records.entries.map((entry) => ({ entry, course: courseByCode(entry.courseCode) }));
    return entries.length ? entries.map(({ entry, course }) => `<tr><td><code>${course.code}</code> ${escapeHtml(course.title[locale])}</td><td>${course.credits}</td><td>${entry.status === "enrolled" ? c.selected : `${c.onWaitlist} #${entry.position || 1}`}</td></tr>`).join("") : `<tr><td colspan="3">—</td></tr>`;
  }
  const completed = metrics.completed.map((entry) => {
    const course = courseByCode(entry.courseCode);
    return `<tr><td><code>${course.code}</code> ${escapeHtml(course.title[locale])}</td><td>${course.credits}</td><td>${escapeHtml(entry.grade || "P")}</td></tr>`;
  });
  const current = metrics.current.map((entry) => {
    const course = courseByCode(entry.courseCode);
    return `<tr><td><code>${course.code}</code> ${escapeHtml(course.title[locale])}</td><td>${course.credits}</td><td>IP</td></tr>`;
  });
  return [...completed, ...current].join("") || `<tr><td colspan="3">—</td></tr>`;
}

function openDocument(mode, locale, c, records) {
  const dialog = document.querySelector("[data-course-document-dialog]");
  const body = dialog?.querySelector("[data-course-document-body]");
  const identity = readJson(IDENTITY_KEY, null);
  if (!dialog || !body || !identity) {
    showToast(c.identityToast);
    return;
  }
  const metrics = recordMetrics(records);
  body.innerHTML = `
    <header><div class="course-document-crest">東</div><div><p>${c.documentUniversity}</p><span>${c.registrar}</span></div><code>${identity.id}</code></header>
    <section class="course-document-title"><p>${courseTerm.label[locale]}</p><h2>${mode === "confirmation" ? c.confirmation : c.transcript}</h2></section>
    <dl><div><dt>${c.student}</dt><dd>${escapeHtml(identity.name)}</dd></div><div><dt>${c.studentId}</dt><dd>${escapeHtml(identity.id)}</dd></div><div><dt>${c.issued}</dt><dd>${formatDate(new Date().toISOString(), locale)}</dd></div><div><dt>${c.status}</dt><dd>${mode === "confirmation" ? `${selectedCredits(records)}/${courseTerm.creditLimit} ${c.creditsLabel}` : `${c.gpa} ${metrics.gpa}`}</dd></div></dl>
    <table><thead><tr><th>${c.codeCourse}</th><th>${c.creditsLabel}</th><th>${mode === "confirmation" ? c.status : c.grade}</th></tr></thead><tbody>${documentRows(mode, locale, c, records)}</tbody></table>
    <p class="course-document-note">${c.documentNote}</p>`;
  dialog.querySelectorAll("[data-course-document-close]").forEach((button) => {
    button.setAttribute("aria-label", c.documentBack);
    if (!button.classList.contains("dialog-close")) button.textContent = c.documentBack;
  });
  const print = dialog.querySelector("[data-course-document-print]");
  if (print) print.firstChild.textContent = `${c.print} `;
  if (!dialog.open) dialog.showModal();
}

function addCourse(code, locale, c) {
  const identity = readJson(IDENTITY_KEY, null);
  if (!identity) {
    showToast(c.identityToast);
    window.location.hash = "my-tu";
    return false;
  }
  const course = courseByCode(code);
  const records = registration();
  if (!course || currentEntry(code, records)) return false;
  const result = eligibility(course, records);
  if (result.missing.length) {
    showToast(`${c.missingPrerequisite}: ${result.missing.join(", ")}`);
    return false;
  }
  if (result.conflicts.length) {
    showToast(`${c.conflict}: ${result.conflicts.map((item) => item.code).join(", ")}`);
    return false;
  }
  const now = new Date().toISOString();
  const seats = openSeats(course, records);
  if (!seats && course.noWaitlist) {
    showToast(c.unavailableToast);
    return false;
  }
  const status = seats ? "enrolled" : "waitlisted";
  const entry = { courseCode: code, status, createdAt: now };
  if (status === "waitlisted") entry.position = Math.max(1, course.occupied - course.capacity + 1);
  records.entries.push(entry);
  saveRegistration(records);
  recordCampusEvent(
    status === "enrolled" ? "course.enrolled" : "course.waitlisted",
    { courseCode: code, term: courseTerm.id, credits: course.credits, position: entry.position },
    { id: `course.${status}:${courseTerm.id}:${code}`, timestamp: now },
  );
  showToast(status === "enrolled"
    ? selectedCredits(records) > courseTerm.creditLimit ? c.overloadToast : c.registeredToast
    : c.waitlistedToast);
  return true;
}

function dropCourse(code, c) {
  const records = registration();
  const entry = currentEntry(code, records);
  if (!entry) return false;
  const now = new Date().toISOString();
  records.entries = records.entries.filter((item) => item.courseCode !== code);
  saveRegistration(records);
  recordCampusEvent(
    entry.status === "enrolled" ? "course.dropped" : "course.waitlist.cancelled",
    { courseCode: code, term: courseTerm.id },
    { id: `course.${entry.status === "enrolled" ? "dropped" : "waitlist.cancelled"}:${courseTerm.id}:${code}:${now}`, timestamp: now },
  );
  showToast(entry.status === "enrolled" ? c.droppedToast : c.cancelledToast);
  return true;
}

function bind(app, rerender) {
  const locale = getLocale();
  const c = copy[locale];
  const rerenderCurrent = () => renderPreservingState(app, rerender, { preserveWindow: true });
  const rerenderInPlace = (courseCode, action) => {
    if (courseCode) activeCourse = courseCode;
    mutateAndRenderPreservingState(app, action, rerender, { preserveWindow: true });
  };
  app.querySelectorAll("[data-course-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      activeTab = button.dataset.courseTab;
      rerenderCurrent();
    });
  });
  const filterForm = app.querySelector("[data-course-filter-form]");
  const queryInput = filterForm?.elements.query;
  const updateFilterValues = () => {
    if (!filterForm) return;
    filterQuery = String(filterForm.elements.query.value || "").trim();
    filterSchool = filterForm.elements.school.value || "all";
    filterState = filterForm.elements.state.value || "all";
  };
  bindImeSafeInput(queryInput, () => {
    updateFilterValues();
    rerenderCurrent();
  });
  filterForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isImeComposing(queryInput)) return;
    updateFilterValues();
    rerenderCurrent();
  });
  filterForm?.addEventListener("change", (event) => {
    if (!event.target.matches("select")) return;
    updateFilterValues();
    rerenderCurrent();
  });
  app.querySelectorAll("[data-course-select]").forEach((button) => {
    button.addEventListener("click", () => {
      rerenderInPlace(button.dataset.courseSelect);
    });
  });
  app.querySelectorAll("[data-course-add]").forEach((button) => {
    button.addEventListener("click", () => rerenderInPlace(button.dataset.courseAdd, () => addCourse(button.dataset.courseAdd, locale, c)));
  });
  app.querySelectorAll("[data-course-drop]").forEach((button) => {
    button.addEventListener("click", () => rerenderInPlace(button.dataset.courseDrop, () => dropCourse(button.dataset.courseDrop, c)));
  });
  app.querySelectorAll("[data-course-document]").forEach((button) => {
    button.addEventListener("click", () => openDocument(button.dataset.courseDocument, locale, c, registration()));
  });
}

export function courseRegistrationSummary() {
  const records = registration();
  return {
    enrolled: records.entries.filter((entry) => entry.status === "enrolled").length,
    waitlisted: records.entries.filter((entry) => entry.status === "waitlisted").length,
    credits: selectedCredits(records),
  };
}

export function renderCourseRegistration(app, rerender) {
  const locale = getLocale();
  const c = copy[locale];
  const records = registration();
  const summary = courseRegistrationSummary();
  const identity = readJson(IDENTITY_KEY, null);
  const routeCode = safeDecodeFragment().match(/^course-(.+)$/)?.[1];
  if (routeCode && courseByCode(routeCode) && positionedRoute !== routeCode) {
    activeCourse = routeCode;
    activeTab = "catalogue";
  }
  if (!routeCode) positionedRoute = "";
  app.innerHTML = `
    <header class="course-heading">
      <div><p>${c.eyebrow}</p><h2>${c.title}</h2></div>
      <p>${c.lead}</p>
    </header>
    <nav class="mytu-mode-nav" aria-label="My TU">
      <a href="mytu.html#my-tu">${c.records}</a>
      <a href="mytu.html#course-registration" aria-current="page">${c.registration}</a>
      <a href="mytu.html#academic-work">${c.workbench}</a>
    </nav>
    <div class="course-term-strip">
      <div><span>${c.term}</span><strong>${courseTerm.label[locale]}</strong><small>${courseTerm.addDeadline[locale]} · ${courseTerm.dropDeadline[locale]}</small></div>
      <dl>
        <div><dt>${c.credits}</dt><dd>${summary.credits}<small> / ${courseTerm.creditLimit}*</small></dd></div>
        <div><dt>${c.enrolled}</dt><dd>${summary.enrolled}</dd></div>
        <div><dt>${c.waitlisted}</dt><dd>${summary.waitlisted}</dd></div>
      </dl>
      <p><strong>${c.local}</strong><span>${summary.credits > courseTerm.creditLimit ? c.overloadWarning : c.privacy}</span></p>
    </div>
    ${!identity ? `<aside class="course-identity-notice"><p>${c.missingIdentity}</p><a class="button button-primary" href="mytu.html#my-tu">${c.createIdentity} <span aria-hidden="true">→</span></a></aside>` : ""}
    <div class="course-tabs" role="tablist">
      <button type="button" role="tab" aria-selected="${activeTab === "catalogue"}" data-course-tab="catalogue">${c.catalogue}<span>35</span></button>
      <button type="button" role="tab" aria-selected="${activeTab === "schedule"}" data-course-tab="schedule">${c.schedule}<span>${summary.enrolled}</span></button>
      <button type="button" role="tab" aria-selected="${activeTab === "record"}" data-course-tab="record">${c.academicRecord}<span>${transcript().length}</span></button>
    </div>
    <div class="course-panel" role="tabpanel">
      ${activeTab === "catalogue" ? renderCatalogue(locale, c, records) : activeTab === "schedule" ? renderSchedule(locale, c, records) : renderAcademicRecord(locale, c, records)}
    </div>`;
  bind(app, rerender);
  if (routeCode && positionedRoute !== routeCode) {
    positionedRoute = routeCode;
    window.requestAnimationFrame(() => document.querySelector("#my-tu")?.scrollIntoView({ block: "start" }));
  }
}

export function initCourseDocumentDialog() {
  const dialog = document.querySelector("[data-course-document-dialog]");
  if (!dialog || dialog.dataset.bound === "true") return;
  dialog.dataset.bound = "true";
  dialog.querySelectorAll("[data-course-document-close]").forEach((button) => button.addEventListener("click", () => dialog.close()));
  dialog.querySelector("[data-course-document-print]")?.addEventListener("click", () => {
    printDocument(dialog.querySelector("[data-course-document-body]"), {
      title: dialog.querySelector("h1, h2")?.textContent || document.title,
    });
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
