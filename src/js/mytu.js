import { text as catalogText, trees as catalogTrees } from "../generated/i18n/ui/mytu.js";
import { identityKinds, originKinds, committeeBySchool, reviewerCommentary, reviewers } from "../data/mytu.js";
import { schools } from "../data/schools.js";
import { campusEventLabel } from "../data/event-contracts.js";
import { campusLedger, recordCampusEvent, syncCampusLedger } from "./campus-ledger.js";
import {
  courseRegistrationSummary,
  initCourseDocumentDialog,
  renderCourseRegistration,
} from "./course-registration.js";
import { academicGradebook } from "./academic-model.js";
import { initAcademicDocumentDialog, renderAcademicWorkbench } from "./academic-work.js";
import { getLocale } from "./i18n.js";
import { phantasmGateHint, phantasmGateProgress, phantasmGateState } from "./phantasm-gate.js";
import { printDocument } from "./print-document.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

const IDENTITY_KEY = "tu:identity";
const REVIEW_KEY = "tu:application:reviews";
const SELECTED_APPLICATION_KEY = "tu:mytu:selected-application";

const copy = catalogTrees["copy"];

const app = document.querySelector("[data-mytu-app]");
const documentDialog = document.querySelector("[data-mytu-document-dialog]");
const documentBody = documentDialog?.querySelector("[data-mytu-document]");
let editingIdentity = false;
let openDocumentApplicationId = null;
let academicWorkbenchCleanup = null;

function readJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value ?? fallback;
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

function hashValue(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function localStudentId(name, createdAt) {
  const date = new Date(createdAt);
  const stamp = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}`;
  return `TU-S-${stamp}-${hashValue(`${name}:${createdAt}`).toString(36).slice(0, 5).toUpperCase().padEnd(5, "0")}`;
}

function formatDate(value, locale, withTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "long" }).format(date);
}

function allRecords() {
  const applications = readJson("tu:application:submissions", []);
  const reviews = readJson(REVIEW_KEY, []);
  const orientationDossiers = readJson("tu:orientation:dossiers", []);
  const visits = readJson("tu:visits", []);
  const entranceExams = readJson("tu:exam:history", []);
  const unifiedExams = readJson("tu:gaokao:attempts", []);
  const posts = readJson("tu:bbs:posts", []);
  const libraryLoans = readJson("tu:library:loans", []);
  const libraryHolds = readJson("tu:library:holds", []);
  const housingApplications = readJson("tu:housing:applications", []);
  const housingAssignments = readJson("tu:housing:assignments", []);
  const housingChanges = readJson("tu:housing:room-changes", []);
  const incidentExperiments = readJson("tu:incidents:experiments", []);
  const incidentResolutions = readJson("tu:incidents:resolutions", []);
  const academicSubmissions = readJson("tu:academics:submissions", []);
  const academicExamAttempts = readJson("tu:academics:exam-attempts", []);
  const academicDefences = readJson("tu:academics:defences", []);
  const clinicVisits = readJson("tu:clinic:visits", []);
  const clinicPrescriptions = readJson("tu:clinic:prescriptions", []);
  const clinicPlans = readJson("tu:clinic:care-plans", []);
  const appraisalRecords = readJson("tu:appraisal:records", []);
  const appraisalDrafts = readJson("tu:appraisal:drafts", {});
  const spellcardDesigns = readJson("tu:spellcards:designs", []);
  const spellcardDefences = readJson("tu:spellcards:defences", []);
  const ethicsDrafts = readJson("tu:ethics:drafts", null);
  const ethicsProtocols = readJson("tu:ethics:protocols", []);
  const ethicsReviews = readJson("tu:ethics:reviews", []);
  const festivalPlans = readJson("tu:festival:plans", []);
  const festivalOperations = readJson("tu:festival:operations", []);
  const fieldworkPlacements = readJson("tu:fieldwork:placements", []);
  const fieldworkPassport = readJson("tu:fieldwork:passport", null);
  const propertyClaims = readJson("tu:property:claims", []);
  const postDispatches = readJson("tu:post:dispatches", []);
  const calendarBookmarks = readJson("tu:calendar:bookmarks", []);
  const graduationAudits = readJson("tu:graduation:audits", []);
  const graduationDegrees = readJson("tu:graduation:degrees", []);
  const careerPlans = readJson("tu:careers:plans", []);
  const employmentApplications = readJson("tu:employment:applications", []);
  const employmentAttestations = readJson("tu:employment:attestations", []);
  const alumniProfile = readJson("tu:alumni:profile", null);
  const examCount = entranceExams.length + unifiedExams.length;
  const drafts = Number(Boolean(readJson("tu:application:draft", null))) +
    Number(Boolean(readJson("tu:visit:draft", null))) +
    Number(Boolean(readJson("tu:gaokao:draft", null)));
  const housingDraft = Number(Boolean(readJson("tu:housing:draft", null)));
  const clinicDraft = Number(Boolean(readJson("tu:clinic:triage-draft", null)));
  const spellcardDraft = Number(Boolean(readJson("tu:spellcards:draft", null)));
  const ethicsDraftCount = Object.keys(
    ethicsDrafts?.byCase && typeof ethicsDrafts.byCase === "object" ? ethicsDrafts.byCase : {},
  ).length;
  const localFiles = [window.localStorage, window.sessionStorage].reduce((total, storage) => {
    let count = 0;
    for (let index = 0; index < storage.length; index += 1) {
      if (storage.key(index)?.startsWith("tu:")) count += 1;
    }
    return total + count;
  }, 0);
  const courseSummary = courseRegistrationSummary();
  const academicBook = academicGradebook();
  const activeLibrary = (Array.isArray(libraryLoans) ? libraryLoans : []).filter((record) => record.status === "active").length
    + (Array.isArray(libraryHolds) ? libraryHolds : []).filter((record) => record.status === "active").length;
  const activeHousing = (Array.isArray(housingAssignments) ? housingAssignments : []).filter((record) => record.status === "active").length
    + (Array.isArray(housingChanges) ? housingChanges : []).filter((record) => record.status === "under-review").length;
  return {
    applications,
    reviews,
    orientationRecords: Array.isArray(orientationDossiers) ? orientationDossiers.length : 0,
    visits,
    entranceExams,
    unifiedExams,
    posts,
    examCount,
    drafts: drafts + housingDraft + clinicDraft + spellcardDraft + ethicsDraftCount
      + Number(Boolean(readJson("tu:festival:draft", null)))
      + Number(Boolean(readJson("tu:fieldwork:draft", null)))
      + Number(Boolean(readJson("tu:employment:draft", null)))
      + Object.keys(appraisalDrafts && typeof appraisalDrafts === "object" && !Array.isArray(appraisalDrafts) ? appraisalDrafts : {}).length,
    courseSummary,
    activeLibrary,
    housingApplications,
    activeHousing,
    incidentRecords: (Array.isArray(incidentExperiments) ? incidentExperiments : []).length
      + (Array.isArray(incidentResolutions) ? incidentResolutions : []).length,
    academicRecords: (Array.isArray(academicSubmissions) ? academicSubmissions : []).length
      + (Array.isArray(academicExamAttempts) ? academicExamAttempts : []).length
      + (Array.isArray(academicDefences) ? academicDefences : []).length,
    academicAverage: academicBook.average,
    activeClinic: (Array.isArray(clinicVisits) ? clinicVisits : []).filter((record) => record.status === "waiting").length
      + (Array.isArray(clinicPrescriptions) ? clinicPrescriptions : []).filter((record) => ["issued", "dispensed"].includes(record.status)).length
      + (Array.isArray(clinicPlans) ? clinicPlans : []).filter((record) => record.status === "active").length,
    appraisalRecords: Array.isArray(appraisalRecords) ? appraisalRecords.length : 0,
    spellcardRecords: (Array.isArray(spellcardDesigns) ? spellcardDesigns.length : 0)
      + (Array.isArray(spellcardDefences) ? spellcardDefences.length : 0),
    ethicsRecords: (Array.isArray(ethicsProtocols) ? ethicsProtocols.length : 0)
      + (Array.isArray(ethicsReviews) ? ethicsReviews.length : 0),
    festivalRecords: (Array.isArray(festivalPlans) ? festivalPlans.length : 0)
      + (Array.isArray(festivalOperations) ? festivalOperations.length : 0),
    fieldworkRecords: (Array.isArray(fieldworkPlacements) ? fieldworkPlacements.length : 0)
      + (Array.isArray(fieldworkPassport?.stamps) ? fieldworkPassport.stamps.length : 0),
    commonsRecords: (Array.isArray(propertyClaims) ? propertyClaims.length : 0)
      + (Array.isArray(postDispatches) ? postDispatches.length : 0),
    calendarRecords: Array.isArray(calendarBookmarks) ? calendarBookmarks.length : 0,
    careerRecords: (Array.isArray(graduationAudits) ? graduationAudits.length : 0)
      + (Array.isArray(graduationDegrees) ? graduationDegrees.length : 0)
      + (Array.isArray(careerPlans) ? careerPlans.length : 0)
      + (Array.isArray(employmentApplications) ? employmentApplications.length : 0)
      + (Array.isArray(employmentAttestations) ? employmentAttestations.length : 0)
      + Number(Boolean(alumniProfile)),
    localFiles,
  };
}

function bestExam(records, locale, c) {
  const entrance = records.entranceExams
    .filter((record) => Number.isFinite(record.percent))
    .sort((a, b) => b.percent - a.percent)[0];
  const unified = records.unifiedExams
    .filter((record) => Number.isFinite(record.score))
    .sort((a, b) => b.score - a.score)[0];
  const evidence = [];
  if (entrance) evidence.push(`${entrance.percent}%`);
  if (unified) evidence.push(`${String(unified.difficultyId || "normal").toUpperCase()} ${unified.score}/${unified.total || 150}`);
  return evidence.length ? evidence.join(" · ") : c.noExam;
}

function dossierScore(application, records) {
  const entranceBest = Math.max(0, ...records.entranceExams.map((record) => Number(record.percent) || 0));
  const unifiedBest = Math.max(
    0,
    ...records.unifiedExams.map((record) => ((Number(record.score) || 0) / (Number(record.total) || 150)) * 100),
  );
  const question = Math.min(12, String(application.question || "").trim().length / 8);
  const method = Math.min(12, String(application.method || "").trim().length / 8);
  const evidence = Math.max(entranceBest, unifiedBest) * 0.2;
  const needs = String(application.needs || "").trim() ? 3 : 0;
  return Math.min(100, Math.round(52 + question + method + evidence + needs));
}

function applicationReviewRemarks(application, committee) {
  const lenses = ["question", "method", "needs"];
  return committee.map((memberId, index) => {
    const lens = lenses[index % lenses.length];
    const source = String(application[lens] || "").trim();
    return {
      memberId,
      lens,
      excerpt: source.slice(0, 220),
      commentary: reviewerCommentary[memberId]?.[lens] || reviewers[memberId]?.note,
    };
  });
}

function outcomeFor(score) {
  if (score >= 84) return "admitted";
  if (score >= 65) return "conditional";
  if (score >= 53) return "supplement";
  return "interview";
}

function reviewFor(applicationId, records) {
  return records.reviews.find((review) => review.applicationId === applicationId);
}

function stageFor(identity, records) {
  if (!identity) return "profile";
  const latestApplication = records.applications.at(-1);
  if (!latestApplication) return "profile";
  return reviewFor(latestApplication.id, records)?.outcome || "applicant";
}

function schoolName(id, locale) {
  return schools[id]?.name?.[locale] || id || "—";
}

function identityForm(identity, records, locale, c) {
  const source = identity || records.applications.at(-1) || {};
  const preferredSchool = identity?.preferredSchool || source.school || "boundary";
  const name = identity?.name || source.name || "";
  return `
    <header class="mytu-heading">
      <div><p>${c.eyebrow}</p><h2>${identity ? c.edit : c.createTitle}</h2></div>
      <p>${identity ? c.privacy : c.createLead}</p>
    </header>
    <div class="mytu-onboarding">
      <aside>
        <span aria-hidden="true">學</span>
        <p>${c.found}</p>
        <strong>${records.applications.length + records.examCount + records.visits.length + records.posts.length}</strong>
        <dl>
          <div><dt>${c.applications}</dt><dd>${records.applications.length}</dd></div>
          <div><dt>${c.exams}</dt><dd>${records.examCount}</dd></div>
          <div><dt>${c.visits}</dt><dd>${records.visits.length}</dd></div>
          <div><dt>${c.posts}</dt><dd>${records.posts.length}</dd></div>
        </dl>
      </aside>
      <form class="mytu-profile-form" data-mytu-profile-form>
        <label>${c.name}<input name="name" maxlength="60" required value="${escapeHtml(name)}"></label>
        <label>${c.kind}<select name="kind">${Object.entries(identityKinds).map(([id, label]) => `<option value="${id}" ${id === (identity?.kind || "human") ? "selected" : ""}>${label[locale]}</option>`).join("")}</select></label>
        <label>${c.origin}<select name="origin">${Object.entries(originKinds).map(([id, label]) => `<option value="${id}" ${id === (identity?.origin || "gensokyo") ? "selected" : ""}>${label[locale]}</option>`).join("")}</select></label>
        <label>${c.school}<select name="preferredSchool">${Object.entries(schools).map(([id, school]) => `<option value="${id}" ${id === preferredSchool ? "selected" : ""}>${school.name[locale]}</option>`).join("")}</select></label>
        <label class="mytu-check"><input type="checkbox" name="lunar" ${identity?.lunar ? "checked" : ""}><span>${c.lunar}</span></label>
        <label class="mytu-wide">${c.housing}<textarea name="housing" rows="3" maxlength="500" placeholder="${c.housingPlaceholder}">${escapeHtml(identity?.housing || source.needs || "")}</textarea></label>
        <footer>
          <span>${c.privacy}</span>
          ${identity ? `<button class="button button-secondary" type="button" data-mytu-cancel>${c.cancel}</button>` : ""}
          <button class="button button-primary" type="submit">${identity ? c.save : c.create} <span aria-hidden="true">→</span></button>
        </footer>
      </form>
    </div>`;
}

function renderReview(application, review, records, locale, c) {
  if (!application) {
    return `
      <section class="mytu-review mytu-review-empty">
        <div><p>ADMISSIONS COUNCIL</p><h3>${c.applicationReview}</h3><span>${c.noApplication}</span></div>
        <a class="button button-primary" href="index.html#service-application">${c.openApplication} <span aria-hidden="true">→</span></a>
      </section>`;
  }
  const examEvidence = bestExam(records, locale, c);
  if (!review) {
    return `
      <section class="mytu-review">
        <header>
          <div><p>ADMISSIONS COUNCIL / UNREAD DOSSIER</p><h3>${c.applicationReview}</h3><span>${c.reviewLead}</span></div>
          <b>${escapeHtml(application.id)}</b>
        </header>
        <div class="mytu-review-source">
          <div><span>${c.preferredSchool}</span><strong>${escapeHtml(schoolName(application.school, locale))}</strong></div>
          <div><span>${c.examEvidence}</span><strong>${escapeHtml(examEvidence)}</strong></div>
        </div>
        <button class="button button-primary" type="button" data-mytu-review="${escapeHtml(application.id)}">${c.runReview} <span aria-hidden="true">→</span></button>
      </section>`;
  }
  return `
    <section class="mytu-review has-decision">
      <header>
        <div><p>ADMISSIONS COUNCIL / ${escapeHtml(review.id)}</p><h3>${c.applicationReview}</h3><span>${c.reviewLead}</span></div>
        <b>${c.reviewed}</b>
      </header>
      <div class="mytu-decision">
        <span>${c.dossierScore} · ${review.score}/100</span>
        <h4>${c.outcome[review.outcome]}</h4>
        <p>${c.outcomeBody[review.outcome]}</p>
      </div>
      <div class="mytu-reviewers">
        ${review.committee.map((memberId, index) => {
          const member = reviewers[memberId];
          const stance = member.stance === "approve" ? c.stanceApprove : member.stance === "condition" ? c.stanceCondition : c.stanceRevise;
          const remark = review.remarks?.[index] || applicationReviewRemarks(application, review.committee)[index];
          const lensLabel = remark.lens === "question" ? c.reviewQuestion : remark.lens === "method" ? c.reviewMethod : c.reviewNeeds;
          const excerpt = remark.excerpt || c.noDeclaredNeeds;
          const commentary = remark.commentary?.[locale] || member.note[locale];
          return `
            <article>
              <header><div><strong>${member.name[locale]}</strong><span>${member.role[locale]}</span></div><i data-stance="${member.stance}">${stance}</i></header>
              <blockquote><small>${lensLabel}</small><q>${escapeHtml(excerpt)}</q></blockquote>
              <p>「${escapeHtml(commentary)}」</p>
            </article>`;
        }).join("")}
      </div>
      <footer>
        <span>${c.examEvidence}: <strong>${escapeHtml(review.examEvidence || examEvidence)}</strong></span>
        <button class="button button-primary" type="button" data-mytu-document-open="${escapeHtml(application.id)}">${c.printDecision} <span aria-hidden="true">↗</span></button>
      </footer>
    </section>`;
}

function eventLabel(event, locale, c) {
  const base = campusEventLabel(event.type, locale);
  const payload = event.payload || {};
  if (event.type === "application.submitted" || event.type === "application.reviewed") {
    return `${base} · ${payload.applicationId || ""}`;
  }
  if (event.type === "exam.completed") return `${base} · ${Number(payload.percent) || 0}%`;
  if (event.type === "gaokao.completed") {
    return `${base} · ${String(payload.difficultyId || "normal").toUpperCase()} ${Number(payload.score) || 0}/${Number(payload.total) || 150}`;
  }
  if (event.type === "visit.reserved") return `${base} · ${payload.date || ""}`;
  if (event.type === "bbs.posted") return `${base} · ${payload.title || ""}`;
  if (event.type.startsWith("course.")) return `${base} · ${payload.courseCode || ""}`;
  if (event.type.startsWith("book.")) return `${base} · ${payload.callNumber || payload.holdingId || ""}`;
  if (event.type.startsWith("housing.")) return `${base} · ${payload.roomId || payload.applicationId || payload.requestId || ""}`;
  if (event.type.startsWith("incident.")) {
    const disposition = payload.disposition === "contested" ? ` · ${c.contestedClosure}` : "";
    return `${base} · ${payload.caseId || ""}${payload.quality ? ` · ${payload.quality}/100` : ""}${disposition}`;
  }
  if (event.type === "governance.vote.cast") return `${base} · ${payload.proposalId || ""}`;
  if (event.type === "academic.assignment.graded") {
    return `${base} · ${payload.courseCode || payload.assignmentId || ""} · ${Number(payload.percent) || 0}%`;
  }
  if (event.type === "academic.exam.started") return `${base} · ${payload.examId || ""}`;
  if (event.type === "academic.exam.completed") return `${base} · ${Number(payload.percent) || 0}%`;
  if (event.type === "academic.project.submitted") return `${base} · ${payload.projectId || ""}`;
  if (event.type === "academic.defence.completed") {
    return `${base} · ${payload.projectId || ""} · ${Number(payload.percent) || 0}%`;
  }
  if (event.type.startsWith("clinic.")) {
    return `${base} · ${payload.visitId || payload.prescriptionId || payload.planId || ""}`;
  }
  if (event.type.startsWith("appraisal.")) {
    const disposition = payload.disposition === "contested" ? ` · ${c.contestedClosure}` : "";
    return `${base} · ${payload.objectId || payload.appraisalId || ""}${disposition}`;
  }
  if (event.type.startsWith("spellcard.")) {
    return `${base} · ${payload.spellName || payload.designId || payload.defenceId || ""}`;
  }
  if (event.type.startsWith("ethics.")) {
    return `${base} · ${payload.protocolId || payload.reviewId || payload.caseId || ""}`;
  }
  if (event.type.startsWith("festival.")) {
    return `${base} · ${payload.operationId || payload.planId || payload.incidentId || ""}`;
  }
  if (event.type.startsWith("fieldwork.")) {
    return `${base} · ${payload.stationId || payload.placementId || payload.stampId || ""}`;
  }
  return base;
}

function renderTimeline(locale, c) {
  const events = campusLedger().slice().reverse().slice(0, 10);
  return `
    <section class="mytu-ledger">
      <header><div><p>LOCAL EVENT STREAM</p><h3>${c.timeline}</h3></div><span>${c.timelineLead}</span></header>
      <ol>
        ${events.length ? events.map((event) => `
          <li>
            <span aria-hidden="true"></span>
            <div><strong>${escapeHtml(eventLabel(event, locale, c))}</strong><time datetime="${escapeHtml(event.timestamp)}">${formatDate(event.timestamp, locale, true)}</time></div>
            <code>${escapeHtml(event.id)}</code>
          </li>`).join("") : `<li class="empty">${c.noEvents}</li>`}
      </ol>
    </section>`;
}

function renderPhantasmTrace(locale) {
  const progress = phantasmGateProgress();
  if (progress.count < 2) return "";
  const state = phantasmGateState();
  const hint = phantasmGateHint(locale, "mytu");
  const words = { "zh-Hant": { eyebrow: catalogText("words.eyebrow")["zh-Hant"], title: (progress.eligible ? catalogText("words.title.yes")["zh-Hant"] : catalogText("words.title.no")["zh-Hant"]), body: (progress.eligible ? catalogText("words.body.yes")["zh-Hant"] : catalogText("words.body.no", {value0: progress.count})["zh-Hant"]), action: (state.unlockedAt ? catalogText("words.action.yes")["zh-Hant"] : catalogText("words.action.no")["zh-Hant"]), seek: catalogText("words.seek")["zh-Hant"], closed: catalogText("words.closed")["zh-Hant"] }, "ja": { eyebrow: catalogText("words.eyebrow")["ja"], title: (progress.eligible ? catalogText("words.title.yes")["ja"] : catalogText("words.title.no")["ja"]), body: (progress.eligible ? catalogText("words.body.yes")["ja"] : catalogText("words.body.no", {value0: progress.count})["ja"]), action: (state.unlockedAt ? catalogText("words.action.yes")["ja"] : catalogText("words.action.no")["ja"]), seek: catalogText("words.seek")["ja"], closed: catalogText("words.closed")["ja"] }, "en": { eyebrow: catalogText("words.eyebrow")["en"], title: (progress.eligible ? catalogText("words.title.yes")["en"] : catalogText("words.title.no")["en"]), body: (progress.eligible ? catalogText("words.body.yes")["en"] : catalogText("words.body.no", {value0: progress.count})["en"]), action: (state.unlockedAt ? catalogText("words.action.yes")["en"] : catalogText("words.action.no")["en"]), seek: catalogText("words.seek")["en"], closed: catalogText("words.closed")["en"] } };
  const w = words[locale] || words["zh-Hant"];
  return `
    <aside class="mytu-phantasm-trace ${progress.eligible ? "is-ready" : ""} ${hint.resonant ? "is-resonant" : ""}">
      <span aria-hidden="true">九</span>
      <div><p>${w.eyebrow}</p><h3>${w.title}</h3><small>${progress.eligible ? escapeHtml(hint.text) : w.body}</small></div>
      ${progress.eligible
        ? `<a href="${hint.href}">${hint.resonant ? w.action : w.seek}<b aria-hidden="true">↘</b></a>`
        : `<i>${w.closed}</i>`}
    </aside>`;
}

function renderDashboard(identity, records, locale, c) {
  const selectedStored = window.localStorage.getItem(SELECTED_APPLICATION_KEY);
  const selectedApplication = records.applications.find((record) => record.id === selectedStored) || records.applications.at(-1);
  const review = selectedApplication ? reviewFor(selectedApplication.id, records) : null;
  const stage = stageFor(identity, records);
  return `
    <header class="mytu-heading">
      <div><p>${c.eyebrow}</p><h2>${c.title}</h2></div>
      <p>${c.lead}</p>
    </header>
    <nav class="mytu-mode-nav" aria-label="My TU">
      <a href="mytu.html#my-tu" aria-current="page">${c.recordsMode}</a>
      <a href="mytu.html#course-registration">${c.courseMode}<span>${records.courseSummary.enrolled + records.courseSummary.waitlisted}</span></a>
      <a href="mytu.html#academic-work">${c.academicMode}<span>${records.academicRecords}</span></a>
      <a href="records.html#data-cabinet">${c.cabinetMode}<span>${records.localFiles}</span></a>
    </nav>
    <div class="mytu-dashboard">
      <section class="mytu-id-card">
        <div class="mytu-id-crest" aria-hidden="true"><span>東</span></div>
        <div class="mytu-id-copy">
          <p>${c.localId}</p>
          <h3>${escapeHtml(identity.name)}</h3>
          <code>${escapeHtml(identity.id)}</code>
          <dl>
            <div><dt>${c.stage}</dt><dd>${c.stages[stage]}</dd></div>
            <div><dt>${c.kind}</dt><dd>${identityKinds[identity.kind]?.[locale] || identity.kind}</dd></div>
            <div><dt>${c.origin}</dt><dd>${originKinds[identity.origin]?.[locale] || identity.origin}</dd></div>
            <div><dt>${c.preferredSchool}</dt><dd>${escapeHtml(schoolName(identity.preferredSchool, locale))}</dd></div>
          </dl>
        </div>
        <button type="button" data-mytu-edit>${c.edit}</button>
      </section>
      <section class="mytu-summary">
        <header><p>ON THIS DEVICE</p><h3>${c.recordSummary}</h3></header>
        <div>
          <a href="index.html#service-application"><span>${c.applications}</span><strong>${records.applications.length}</strong></a>
          <a href="welcome.html#welcome"><span>${c.arrivals}</span><strong>${records.orientationRecords}</strong></a>
          <a href="admissions.html#entrance-exam"><span>${c.exams}</span><strong>${records.examCount}</strong></a>
          <a href="index.html#service-visit"><span>${c.visits}</span><strong>${records.visits.length}</strong></a>
          <a href="campus.html#bbs"><span>${c.posts}</span><strong>${records.posts.length}</strong></a>
          <a href="mytu.html#course-registration"><span>${c.courses}</span><strong>${records.courseSummary.enrolled}</strong></a>
          <a href="library.html#library"><span>${c.library}</span><strong>${records.activeLibrary}</strong></a>
          <a href="housing.html#housing-account"><span>${c.residential}</span><strong>${records.activeHousing}</strong></a>
          <a href="incidents.html#incident-records"><span>${c.incidents}</span><strong>${records.incidentRecords}</strong></a>
          <a href="mytu.html#academic-grades"><span>${c.academicRecords}</span><strong>${records.academicAverage ?? "—"}</strong></a>
          <a href="clinic.html#clinic-account"><span>${c.medical}</span><strong>${records.activeClinic}</strong></a>
          <a href="library.html#appraisal-records"><span>${c.appraisals}</span><strong>${records.appraisalRecords}</strong></a>
          <a href="research.html#spellcard-records"><span>${c.spellcards}</span><strong>${records.spellcardRecords}</strong></a>
          <a href="ethics.html#ethics-records"><span>${c.ethics}</span><strong>${records.ethicsRecords}</strong></a>
          <a href="festival.html#festival-records"><span>${c.festivals}</span><strong>${records.festivalRecords}</strong></a>
          <a href="fieldwork.html#fieldwork-passport"><span>${c.fieldwork}</span><strong>${records.fieldworkRecords}</strong></a>
          <a href="commons.html#property-records"><span>${c.commons}</span><strong>${records.commonsRecords}</strong></a>
          <a href="calendar.html#calendar-agenda"><span>${c.calendar}</span><strong>${records.calendarRecords}</strong></a>
          <a href="careers.html#graduation-records"><span>${c.careers}</span><strong>${records.careerRecords}</strong></a>
          <a href="records.html#data-cabinet"><span>${c.cabinetSummary}</span><strong>${records.localFiles}</strong></a>
          <span><small>${c.drafts}</small><b>${records.drafts}</b></span>
        </div>
      </section>
    </div>
    ${renderPhantasmTrace(locale)}
    ${
      records.applications.length > 1
        ? `<label class="mytu-application-select">${c.chooseApplication}
            <select data-mytu-application-select>${records.applications.slice().reverse().map((record) => `<option value="${escapeHtml(record.id)}" ${record.id === selectedApplication?.id ? "selected" : ""}>${escapeHtml(record.id)} · ${escapeHtml(schoolName(record.school, locale))} · ${formatDate(record.submittedAt, locale)}</option>`).join("")}</select>
          </label>`
        : ""
    }
    ${renderReview(selectedApplication, review, records, locale, c)}
    <div class="mytu-lower">
      ${renderTimeline(locale, c)}
      <aside class="mytu-next">
        <p>NEXT ACTION</p>
        <h3>${c.next}</h3>
        <span>${stage === "profile" ? c.nextApplication : stage === "applicant" ? c.nextReview : stage === "admitted" ? c.nextOrientation : c.nextExam}</span>
        ${stage === "admitted"
          ? `<a class="button button-primary" href="welcome.html#welcome">${c.goOrientation} <span aria-hidden="true">→</span></a>`
          : `<a class="button button-secondary" href="admissions.html#entrance-exam">${c.goExam}</a>
             <a class="button button-primary" href="admissions.html#gaokao">${c.goGaokao} <span aria-hidden="true">→</span></a>`}
      </aside>
    </div>`;
}

function createReview(application, records) {
  const score = dossierScore(application, records);
  const outcome = outcomeFor(score);
  const committee = committeeBySchool[application.school] || committeeBySchool.boundary;
  const reviewedAt = new Date().toISOString();
  const id = `TU-R-${hashValue(`${application.id}:${application.school}`).toString(36).slice(0, 6).toUpperCase().padEnd(6, "0")}`;
  const review = {
    schema: 1,
    id,
    applicationId: application.id,
    school: application.school,
    score,
    outcome,
    committee,
    remarks: applicationReviewRemarks(application, committee),
    examEvidence: bestExam(records, getLocale(), copy[getLocale()]),
    reviewedAt,
  };
  const reviews = readJson(REVIEW_KEY, []);
  reviews.push(review);
  window.localStorage.setItem(REVIEW_KEY, JSON.stringify(reviews.slice(-40)));
  recordCampusEvent(
    "application.reviewed",
    { applicationId: application.id, reviewId: id, school: application.school, outcome },
    { id: `application.reviewed:${application.id}`, timestamp: reviewedAt },
  );
  return review;
}

function verificationMosaic(value) {
  const seed = hashValue(value);
  return Array.from({ length: 121 }, (_, index) => {
    const x = index % 11;
    const y = Math.floor(index / 11);
    const corner = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
    const bit = corner ? x % 2 === 0 || y % 2 === 0 : ((seed >>> (index % 29)) ^ (index * 17)) & 1;
    return `<i class="${bit ? "on" : ""}"></i>`;
  }).join("");
}

function renderDocument(applicationId) {
  if (!documentBody) return;
  const locale = getLocale();
  const c = copy[locale];
  const records = allRecords();
  const application = records.applications.find((record) => record.id === applicationId);
  const review = reviewFor(applicationId, records);
  const identity = readJson(IDENTITY_KEY, null);
  if (!application || !review) return;
  const d = c.document;
  const admitted = ["admitted", "conditional"].includes(review.outcome);
  documentBody.innerHTML = `
    <header>
      <div class="mytu-document-crest" aria-hidden="true"><span>東</span></div>
      <div><p>${d.university}</p><span>${d.office}</span></div>
      <code>${escapeHtml(review.id)}</code>
    </header>
    <section class="mytu-document-title">
      <p>ADMISSIONS · AUTUMN 2026</p>
      <h2>${admitted ? d.admission : d.decision}</h2>
      <span>${d.certifies}</span>
      <strong>${escapeHtml(application.name || identity?.name || "—")}</strong>
    </section>
    <dl class="mytu-document-facts">
      <div><dt>${d.applicant}</dt><dd>${escapeHtml(application.name || identity?.name || "—")}</dd></div>
      <div><dt>${d.application}</dt><dd>${escapeHtml(application.id)}</dd></div>
      <div><dt>${d.review}</dt><dd>${escapeHtml(review.id)}</dd></div>
      <div><dt>${d.school}</dt><dd>${escapeHtml(schoolName(application.school, locale))}</dd></div>
      <div><dt>${d.result}</dt><dd>${c.outcome[review.outcome]}</dd></div>
      <div><dt>${d.issued}</dt><dd>${formatDate(review.reviewedAt, locale)}</dd></div>
    </dl>
    <section class="mytu-document-condition">
      <p>${d.conditions}</p>
      <h3>${c.outcomeBody[review.outcome]}</h3>
    </section>
    <footer>
      <div>
        <p>${d.signatures}</p>
        <ul>${review.committee.map((id) => `<li><strong>${reviewers[id].name[locale]}</strong><span>${reviewers[id].role[locale]}</span></li>`).join("")}</ul>
      </div>
      <div class="mytu-verification"><span>${d.verification}</span><div>${verificationMosaic(`${application.id}:${review.id}`)}</div><code>${escapeHtml(identity?.id || "STUDENT-LOCAL")}</code></div>
    </footer>
    <p class="mytu-document-note">${d.footer}</p>`;
  documentDialog.querySelectorAll("[data-mytu-document-close]").forEach((button) => {
    button.setAttribute("aria-label", d.close);
    if (!button.classList.contains("dialog-close")) button.textContent = d.close;
  });
  const print = documentDialog.querySelector("[data-mytu-print]");
  print.firstChild.textContent = `${d.print} `;
}

function bind() {
  if (!app) return;
  const identity = readJson(IDENTITY_KEY, null);
  app.querySelector("[data-mytu-profile-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const now = new Date().toISOString();
    const next = {
      schema: 1,
      id: identity?.id || localStudentId(values.name, now),
      createdAt: identity?.createdAt || now,
      updatedAt: now,
      name: values.name,
      kind: values.kind,
      origin: values.origin,
      preferredSchool: values.preferredSchool,
      lunar: event.currentTarget.elements.lunar.checked,
      housing: values.housing || "",
    };
    window.localStorage.setItem(IDENTITY_KEY, JSON.stringify(next));
    recordCampusEvent(
      identity ? "identity.updated" : "identity.created",
      { identityId: next.id, preferredSchool: next.preferredSchool },
      { id: `${identity ? "identity.updated" : "identity.created"}:${next.id}:${identity ? now : "initial"}`, timestamp: now },
    );
    editingIdentity = false;
    showToast(copy[getLocale()].identitySaved);
    render();
  });
  app.querySelector("[data-mytu-edit]")?.addEventListener("click", () => {
    editingIdentity = true;
    render();
  });
  app.querySelector("[data-mytu-cancel]")?.addEventListener("click", () => {
    editingIdentity = false;
    render();
  });
  app.querySelector("[data-mytu-review]")?.addEventListener("click", (event) => {
    const records = allRecords();
    const application = records.applications.find((record) => record.id === event.currentTarget.dataset.mytuReview);
    if (!application || reviewFor(application.id, records)) return;
    createReview(application, records);
    render();
  });
  app.querySelector("[data-mytu-application-select]")?.addEventListener("change", (event) => {
    window.localStorage.setItem(SELECTED_APPLICATION_KEY, event.currentTarget.value);
    render();
  });
  app.querySelector("[data-mytu-document-open]")?.addEventListener("click", (event) => {
    openDocumentApplicationId = event.currentTarget.dataset.mytuDocumentOpen;
    renderDocument(openDocumentApplicationId);
    if (!documentDialog.open) documentDialog.showModal();
  });
}

function render() {
  if (!app) return;
  syncCampusLedger();
  const locale = getLocale();
  const c = copy[locale];
  const identity = readJson(IDENTITY_KEY, null);
  const records = allRecords();
  const route = safeDecodeFragment();
  if (route.startsWith("academic-")) {
    editingIdentity = false;
    academicWorkbenchCleanup?.();
    academicWorkbenchCleanup = renderAcademicWorkbench(app);
    return;
  }
  academicWorkbenchCleanup?.();
  academicWorkbenchCleanup = null;
  if (route === "course-registration" || route.startsWith("course-")) {
    editingIdentity = false;
    renderCourseRegistration(app, render);
    return;
  }
  app.innerHTML = editingIdentity || !identity
    ? identityForm(identity, records, locale, c)
    : renderDashboard(identity, records, locale, c);
  bind();
  if (documentDialog?.open && openDocumentApplicationId) renderDocument(openDocumentApplicationId);
}

export function initMyTu() {
  if (!app) return;
  syncCampusLedger();
  initCourseDocumentDialog();
  initAcademicDocumentDialog();
  documentDialog?.querySelectorAll("[data-mytu-document-close]").forEach((button) => {
    button.addEventListener("click", () => documentDialog.close());
  });
  documentDialog?.querySelector("[data-mytu-print]")?.addEventListener("click", () => {
    printDocument(documentBody, { title: documentBody?.querySelector("h1, h2")?.textContent || document.title });
  });
  window.addEventListener("tu:ledgerchange", render);
  window.addEventListener("tu:languagechange", render);
  window.addEventListener("hashchange", () => {
    if (
      window.location.hash === "#my-tu"
      || window.location.hash === "#course-registration"
      || window.location.hash.startsWith("#course-")
      || window.location.hash.startsWith("#academic-")
    ) render();
  });
  render();
}
