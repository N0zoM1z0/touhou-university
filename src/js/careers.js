import { text as catalogText, values as catalogValues, trees as catalogTrees } from "../generated/i18n/ui/careers.js";
import { schools } from "../data/schools.js";
import {
  alumniChapter,
  alumniChapters,
  alumniStories,
  careerDomainOptions,
  careerOpening,
  careerOpenings,
  careerScheduleOptions,
  careersLocalized,
  graduationTrack,
  graduationTracks,
} from "../data/careers.js";
import {
  activateAlumniProfile,
  alumniNightSnapshot,
  alumniProfile,
  careerDraft,
  careerMatches,
  careerPlan,
  careerPlans,
  graduationAudit,
  graduationAudits,
  graduationDegree,
  graduationDegrees,
  graduationEvidence,
  graduationSummary,
  issueGraduationDegree,
  offerAlumniMentorship,
  requestGraduationAudit,
  rsvpAlumniReunion,
  saveCareerDraft,
  sendCareerReferral,
  submitCareerPlan,
} from "./careers-model.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { registerDeepLink, navigateToDeepLink } from "./deep-links.js";
import { getLocale } from "./i18n.js";
import { bindImeSafeInput } from "./ime-input.js";
import { printDocument } from "./print-document.js";
import { renderPreservingState } from "./render-state.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

let root = null;
let view = "graduation";
let selectedAuditId = null;
let selectedDegreeId = null;
let selectedOpeningId = null;
let selectedPlanId = null;
let selectedChapterId = null;
let graduationSchoolId = "boundary";

const copy = catalogTrees["copy"];

const compensationLabels = {
  yen: catalogValues("compensationLabels.yen"),
  offerings: catalogValues("compensationLabels.offerings"),
  tea: catalogValues("compensationLabels.tea"),
  cucumber: catalogValues("compensationLabels.cucumber"),
  rice: catalogValues("compensationLabels.rice"),
  faith: catalogValues("compensationLabels.faith"),
  coal: catalogValues("compensationLabels.coal"),
  barter: catalogValues("compensationLabels.barter"),
};

const travelLabels = {
  foot: catalogValues("travelLabels.foot"),
  broom: catalogValues("travelLabels.broom"),
  tengu: catalogValues("travelLabels.tengu"),
  shuttle: catalogValues("travelLabels.shuttle"),
  ferry: catalogValues("travelLabels.ferry"),
};

const requirementLinks = {
  credits: "mytu.html#course-registration",
  methods: "mytu.html#academic-work",
  defence: "mytu.html#academic-defense",
  ethics: "ethics.html#ethics-board",
  fieldwork: "fieldwork.html#fieldwork-dispatch",
  library: "library.html#library-account",
  housing: "housing.html#housing-account",
  disputes: "incidents.html#incident-records",
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;",
  })[character]);
}

const t = (value, locale) => careersLocalized(value, locale);
const localeIndex = (locale) => locale === "ja" ? 1 : locale === "en" ? 2 : 0;
const formatDate = (value, locale) => new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(value));

function statusLabel(status, c) {
  return {
    clear: c.statusClear,
    conditional: c.statusConditional,
    contested: c.statusContested,
    missing: c.statusMissing,
  }[status];
}

function outcomeLabel(outcome, c) {
  return {
    ready: c.outcomeReady,
    conditional: c.outcomeConditional,
    contested: c.outcomeContested,
    "not-ready": c.outcomeNotReady,
  }[outcome];
}

function requirementTitle(id, c) {
  return c[`requirement${id[0].toUpperCase()}${id.slice(1)}`];
}

function requirementDetail(item, locale) {
  if (item.id === "credits") {
    return catalogText("requirementDetail", { [locale]: locale === "ja" ? {value0: item.current, value1: item.target, value2: item.recognizedCoreCodes.length, value3: item.requiredCoreCodes.length} : locale === "en" ? {value0: item.current, value1: item.target, value2: item.recognizedCoreCodes.length, value3: item.requiredCoreCodes.length} : {value0: item.current, value1: item.target, value2: item.recognizedCoreCodes.length, value3: item.requiredCoreCodes.length} })[locale];
  }
  if (item.id === "methods") return catalogText("requirementDetail.2", { [locale]: locale === "ja" ? {value0: item.assignments, value1: item.exams} : locale === "en" ? {value0: item.assignments, value1: item.exams} : {value0: item.assignments, value1: item.exams} })[locale];
  if (item.id === "defence") return `${String(item.outcome).toUpperCase()}${item.percent === null ? "" : ` · ${item.percent}%`}`;
  if (item.id === "ethics") return `${String(item.outcome).toUpperCase()} · ${item.activeProtocols}`;
  if (item.id === "fieldwork") return catalogText("requirementDetail.3", { [locale]: locale === "ja" ? {value0: item.distinctStations, value1: item.visits} : locale === "en" ? {value0: item.distinctStations, value1: item.visits} : {value0: item.distinctStations, value1: item.visits} })[locale];
  if (item.id === "library") return catalogText("requirementDetail.4", { [locale]: locale === "ja" ? {value0: item.activeLoans} : locale === "en" ? {value0: item.activeLoans} : {value0: item.activeLoans} })[locale];
  if (item.id === "housing") return catalogText("requirementDetail.5", { [locale]: locale === "ja" ? {value0: item.assignmentId ? 1 : 0, value1: item.roomChanges} : locale === "en" ? {value0: item.assignmentId ? 1 : 0, value1: item.roomChanges} : {value0: item.assignmentId ? 1 : 0, value1: item.roomChanges} })[locale];
  return catalogText("requirementDetail.6", { [locale]: locale === "ja" ? {value0: item.openClaims, value1: item.contestedIncidents, value2: item.chronologyReversed ? "あり" : "なし"} : locale === "en" ? {value0: item.openClaims, value1: item.contestedIncidents, value2: item.chronologyReversed ? "reversed" : "ordinary"} : {value0: item.openClaims, value1: item.contestedIncidents, value2: item.chronologyReversed ? "倒置" : "順行"} })[locale];
}

function hero(locale, c) {
  const summary = graduationSummary();
  return `
    <header class="careers-hero" id="graduation-careers-top">
      <div>
        <p>${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
      </div>
      <dl>
        <div><dt>${c.audits}</dt><dd>${summary.audits}</dd></div>
        <div><dt>${c.degrees}</dt><dd>${summary.degrees}</dd></div>
        <div><dt>${c.referrals}</dt><dd>${summary.referrals}</dd></div>
        <div><dt>${c.alumniStatus}</dt><dd>${summary.alumni ? c.active : c.sealed}</dd></div>
      </dl>
    </header>
    <nav class="careers-tabs" aria-label="${escapeHtml(c.title)}">
      <button type="button" class="${["graduation", "audit", "degree"].includes(view) ? "active" : ""}" data-careers-view="graduation"><span>卒</span>${c.graduation}</button>
      <button type="button" class="${["career", "opening", "plan"].includes(view) ? "active" : ""}" data-careers-view="career"><span>路</span>${c.careers}</button>
      <button type="button" class="${["alumni", "chapter"].includes(view) ? "active" : ""}" data-careers-view="alumni"><span>夜</span>${c.alumni}</button>
    </nav>`;
}

function schoolOptions(locale, selected) {
  return Object.entries(schools).map(([id, school]) =>
    `<option value="${id}" ${selected === id ? "selected" : ""}>${school.code} · ${escapeHtml(school.name[locale])}</option>`).join("");
}

function coreCheckboxes(locale, schoolId) {
  return schools[schoolId].courses.map(([code, title]) => `
    <label><input type="checkbox" name="archivedCoreCodes" value="${code}"><span><b>${code}</b>${escapeHtml(title[locale])}</span></label>`).join("");
}

function graduationForm(locale, c) {
  const evidence = graduationEvidence({ schoolId: graduationSchoolId });
  const identity = (() => {
    try { return JSON.parse(localStorage.getItem("tu:identity") || "null"); } catch { return null; }
  })();
  if (!identity?.id) {
    return `<aside class="careers-identity"><p>${c.identityNeeded}</p><a href="mytu.html#my-tu">${c.openMyTu}<b>→</b></a></aside>`;
  }
  return `
    <form class="graduation-form" data-graduation-form>
      <div class="graduation-form-grid">
        <label><span>${c.school}</span><select name="schoolId" data-graduation-school>${schoolOptions(locale, graduationSchoolId)}</select></label>
        <label><span>${c.track}</span><select name="trackId">${graduationTracks.map((entry) => `<option value="${entry.id}">${entry.glyph} · ${escapeHtml(t(entry.title, locale))}</option>`).join("")}</select></label>
        <label><span>${c.enrolmentYear}</span><input type="number" name="enrolmentYear" value="142" min="1" max="9999"></label>
        <label><span>${c.graduationYear}</span><input type="number" name="graduationYear" value="146" min="1" max="9999"></label>
        <label><span>${c.priorCredits}</span><input type="number" name="priorCredits" value="0" min="0" max="${evidence.requiredCredits}"><small>${c.priorCreditsHelp}</small></label>
      </div>
      <fieldset class="graduation-cores"><legend>${c.archiveCores}</legend>${coreCheckboxes(locale, graduationSchoolId)}</fieldset>
      <label class="full"><span>${c.provenance}</span><textarea name="provenance" rows="3" placeholder="${escapeHtml(c.provenancePlaceholder)}"></textarea></label>
      <div class="graduation-annexes">
        <label><span>${c.libraryDispute}</span><textarea name="libraryDisputeNote" rows="3"></textarea></label>
        <label><span>${c.checkout}</span><textarea name="checkoutPlan" rows="3"></textarea></label>
        <label><span>${c.dispute}</span><textarea name="unresolvedNote" rows="3"></textarea></label>
        <label><span>${c.unresolved}</span><textarea name="unresolvedQuestion" rows="3" required></textarea></label>
      </div>
      <label class="graduation-accept"><input type="checkbox" name="acceptsAttachments"><span>${c.attachments}</span></label>
      <button class="careers-primary" type="submit">${c.submitAudit}<b>→</b></button>
    </form>`;
}

function auditCards(locale, c) {
  const audits = graduationAudits().slice().reverse();
  return `
    <section class="careers-records" id="graduation-records">
      <header><p>LOCAL GRADUATION FILES</p><h3>${c.recentAudits}</h3></header>
      ${audits.length ? audits.map((audit) => `
        <button type="button" data-graduation-audit="${audit.id}">
          <span>${schools[audit.schoolId].glyph}</span>
          <div><p>${formatDate(audit.requestedAt, locale)} · ${graduationTrack(audit.input.trackId).glyph}</p><h4>${escapeHtml(schools[audit.schoolId].degree[locale])}</h4><small>${outcomeLabel(audit.outcome, c)} · ${audit.earnedCredits}/${audit.requiredCredits}</small></div>
          <b>↗</b>
        </button>`).join("") : `<p class="careers-empty">${c.noAudits}</p>`}
    </section>`;
}

function graduationView(locale, c) {
  return `
    <section class="careers-heading" id="graduation-audit">
      <div><p>EIGHT DESKS / NO PROXY SIGNATURES</p><h3>${c.auditTitle}</h3><span>${c.auditLead}</span></div>
      <div class="graduation-stamp">卒<small>${graduationEvidence({ schoolId: graduationSchoolId }).requiredCredits}</small></div>
    </section>
    ${graduationForm(locale, c)}
    ${auditCards(locale, c)}`;
}

function requirementRows(audit, locale, c) {
  return audit.requirements.map((item, index) => `
    <article class="graduation-requirement status-${item.status}">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div><p>${statusLabel(item.status, c)}</p><h4>${requirementTitle(item.id, c)}</h4><small>${escapeHtml(requirementDetail(item, locale))}</small></div>
      <a href="${requirementLinks[item.id]}">${c.repair} ↗</a>
    </article>`).join("");
}

function auditView(locale, c) {
  const audit = graduationAudit(selectedAuditId);
  if (!audit) return graduationView(locale, c);
  const canIssue = audit.canIssue && !audit.degreeId;
  return `
    <button type="button" class="careers-back" data-careers-view="graduation">← ${c.back}</button>
    <article class="graduation-document" id="graduation-audit-${audit.id}">
      <header>
        <span>${schools[audit.schoolId].glyph}</span>
        <div><p>${audit.id} · ${formatDate(audit.requestedAt, locale)}</p><h3>${escapeHtml(schools[audit.schoolId].degree[locale])}</h3><small>${escapeHtml(t(graduationTrack(audit.input.trackId).title, locale))}</small></div>
        <b class="outcome-${audit.outcome}">${outcomeLabel(audit.outcome, c)}</b>
      </header>
      <div class="graduation-requirements">${requirementRows(audit, locale, c)}</div>
      <blockquote><small>${c.unresolvedQuestion}</small>${escapeHtml(audit.input.unresolvedQuestion)}</blockquote>
      ${audit.dream.count ? `<aside><b>${c.reverseSide}</b><span>${c.reverseTrace} ${audit.dream.reverseCredits > 0 ? "+" : ""}${audit.dream.reverseCredits}</span></aside>` : ""}
      <footer data-print-exclude>
        <button type="button" data-print-audit>${c.printAudit}</button>
        ${audit.degreeId ? `<button type="button" data-graduation-degree="${audit.degreeId}">${c.printDegree} ↗</button>` : ""}
      </footer>
    </article>
    ${canIssue ? `
      <form class="degree-issue" data-degree-issue="${audit.id}">
        <label><input type="checkbox" name="acceptsConditions"><span>${c.acceptDegree}</span></label>
        <button class="careers-primary" type="submit">${c.issueDegree}<b>印</b></button>
      </form>` : ""}`;
}

function degreeView(locale, c) {
  const degree = graduationDegree(selectedDegreeId);
  if (!degree) return graduationView(locale, c);
  return `
    <button type="button" class="careers-back" data-careers-view="graduation">← ${c.back}</button>
    <article class="degree-document" id="graduation-degree-${degree.id}">
      <div class="degree-seal"><span>${schools[degree.schoolId].glyph}</span><small>TOUHOU UNIVERSITY</small></div>
      <p>${c.degreeNo} · ${escapeHtml(degree.degreeNumber)}</p>
      <h3>${c.degreeTitle}</h3>
      <strong>${escapeHtml(degree.studentName || degree.studentId)}</strong>
      <span>${escapeHtml(schools[degree.schoolId].degree[locale])}</span>
      <dl>
        <div><dt>${c.standing}</dt><dd>${statusLabel(degree.standing === "clear" ? "clear" : degree.standing, c)}</dd></div>
        <div><dt>${c.issuedAt}</dt><dd>${formatDate(degree.issuedAt, locale)}</dd></div>
      </dl>
      <blockquote><small>${c.unresolvedQuestion}</small>${escapeHtml(degree.unresolvedQuestion)}</blockquote>
      ${degree.dream.count ? `<aside><b>${c.reverseSide}</b><span>${c.reverseTrace} ${degree.dream.reverseCredits > 0 ? "+" : ""}${degree.dream.reverseCredits}</span></aside>` : ""}
      <footer data-print-exclude><button type="button" data-print-degree>${c.printDegree}</button><button type="button" data-careers-view="alumni">${c.activateAlumni} →</button></footer>
    </article>`;
}

function openingCard(opening, locale, c, match = null) {
  const band = match?.band || "conversation";
  return `
    <article class="career-opening-card" id="career-opening-${opening.id}">
      <header><span>${opening.glyph}</span><div><p>${opening.code} · ${escapeHtml(t(opening.region, locale))}</p><h4>${escapeHtml(t(opening.title, locale))}</h4></div>${match ? `<b class="match-${band}">${{ recommended: c.recommendation, promising: c.promising, conversation: c.conversation, incident: c.incident }[band]}</b>` : ""}</header>
      <p>${escapeHtml(t(opening.premise, locale))}</p>
      <dl><div><dt>${c.host}</dt><dd>${escapeHtml(t(opening.host, locale))}</dd></div><div><dt>${c.compensationLabel}</dt><dd>${compensationLabels[opening.compensation][localeIndex(locale)]}</dd></div></dl>
      <button type="button" data-career-opening="${opening.id}">${c.openFile}<b>↗</b></button>
    </article>`;
}

function careerForm(locale, c) {
  const draft = careerDraft();
  return `
    <form class="career-form" data-career-form>
      <label><span>${c.school}</span><select name="schoolId">${schoolOptions(locale, draft.schoolId)}</select></label>
      <fieldset><legend>${c.domains}</legend>${careerDomainOptions.map(([id, title]) => `<label><input type="checkbox" name="domainIds" value="${id}" ${draft.domainIds.includes(id) ? "checked" : ""}><span>${escapeHtml(t(title, locale))}</span></label>`).join("")}</fieldset>
      <div class="career-form-grid">
        <label><span>${c.schedule}</span><select name="scheduleId">${careerScheduleOptions.map(([id, title]) => `<option value="${id}" ${draft.scheduleId === id ? "selected" : ""}>${escapeHtml(t(title, locale))}</option>`).join("")}</select></label>
        <label><span>${c.compensation}</span><select name="compensationId">${Object.entries(compensationLabels).map(([id, labels]) => `<option value="${id}" ${draft.compensationId === id ? "selected" : ""}>${labels[localeIndex(locale)]}</option>`).join("")}</select></label>
        <label><span>${c.travel}</span><select name="travelId">${Object.entries(travelLabels).map(([id, labels]) => `<option value="${id}" ${draft.travelId === id ? "selected" : ""}>${labels[localeIndex(locale)]}</option>`).join("")}</select></label>
        <label><span>${c.chaos}</span><input type="range" name="chaosTolerance" min="1" max="4" value="${draft.chaosTolerance}"><output>${draft.chaosTolerance}/4</output></label>
      </div>
      <label class="full"><span>${c.refusal}</span><textarea name="refusal" rows="3" data-preserve-focus="career-refusal">${escapeHtml(draft.refusal)}</textarea></label>
      <label class="full"><span>${c.careerQuestion}</span><textarea name="question" rows="3" data-preserve-focus="career-question">${escapeHtml(draft.question)}</textarea></label>
      <button class="careers-primary" type="submit">${c.submitPlan}<b>→</b></button>
    </form>`;
}

function careersView(locale, c) {
  const matches = careerMatches(careerDraft(), locale);
  return `
    <section class="careers-heading career-heading" id="career-office">
      <div><p>CAREERS OFFICE / EXPLAINED FRICTION</p><h3>${c.careersTitle}</h3><span>${c.careersLead}</span></div>
      <div class="graduation-stamp">路<small>12</small></div>
    </section>
    ${careerForm(locale, c)}
    <section class="career-openings">
      <header><p>TWELVE DESTINATIONS</p><h3>${c.browseOpenings}</h3></header>
      <div>${careerOpenings.map((opening) => openingCard(opening, locale, c, matches.find(({ openingId }) => openingId === opening.id))).join("")}</div>
    </section>`;
}

function openingView(locale, c) {
  const opening = careerOpening(selectedOpeningId);
  if (!opening) return careersView(locale, c);
  return `
    <button type="button" class="careers-back" data-careers-view="career">← ${c.back}</button>
    <article class="career-opening-file" id="career-opening-${opening.id}">
      <header><span>${opening.glyph}</span><div><p>${opening.code} · ${escapeHtml(t(opening.institution, locale))}</p><h3>${escapeHtml(t(opening.title, locale))}</h3><small>${c.host} · ${escapeHtml(t(opening.host, locale))}</small></div></header>
      <blockquote>${escapeHtml(t(opening.premise, locale))}</blockquote>
      <dl><div><dt>${c.scheduleLabel}</dt><dd>${escapeHtml(t(careerScheduleOptions.find(([id]) => id === opening.schedule)[1], locale))}</dd></div><div><dt>${c.compensationLabel}</dt><dd>${compensationLabels[opening.compensation][localeIndex(locale)]}</dd></div><div><dt>${c.travel}</dt><dd>${travelLabels[opening.travel][localeIndex(locale)]}</dd></div></dl>
      <section><p>${c.duties}</p><ol>${opening.duties.map((entry) => `<li>${escapeHtml(t(entry, locale))}</li>`).join("")}</ol></section>
      <section class="career-friction"><p>${c.friction}</p><strong>${escapeHtml(t(opening.friction, locale))}</strong></section>
      <section><p>${c.boundary}</p><blockquote>${escapeHtml(t(opening.boundary, locale))}</blockquote></section>
      <section><p>${c.interview}</p><strong>${escapeHtml(t(opening.interview, locale))}</strong></section>
      <footer><button type="button" data-careers-view="career">${c.back}</button></footer>
    </article>`;
}

function planView(locale, c) {
  const plan = careerPlan(selectedPlanId);
  if (!plan) return careersView(locale, c);
  const localizedMatches = new Map(
    careerMatches(plan.profile, locale).map((match) => [match.openingId, match]),
  );
  return `
    <button type="button" class="careers-back" data-careers-view="career">← ${c.back}</button>
    <article class="career-plan-document" id="career-plan-${plan.id}">
      <header><p>${plan.id} · ${formatDate(plan.createdAt, locale)}</p><h3>${c.submitPlan}</h3><span>${schools[plan.profile.schoolId].name[locale]}</span></header>
      <div>${plan.matches.map((match, index) => {
        const opening = careerOpening(match.openingId);
        const localizedMatch = localizedMatches.get(match.openingId) || match;
        const referral = plan.referrals.find((entry) => entry.openingId === opening.id);
        return `<section class="career-match">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div><p>${{ recommended: c.recommendation, promising: c.promising, conversation: c.conversation, incident: c.incident }[match.band]}</p><h4>${escapeHtml(t(opening.title, locale))}</h4>
            <dl><div><dt>${c.reasons}</dt><dd>${localizedMatch.reasons.map(escapeHtml).join(" · ") || "—"}</dd></div><div><dt>${c.cautions}</dt><dd>${localizedMatch.cautions.map(escapeHtml).join(" · ") || "—"}</dd></div></dl>
            ${referral ? `<strong class="referral-sent">${c.referralSent} · ${formatDate(referral.sentAt, locale)}</strong>` : `<form data-career-referral="${opening.id}"><textarea name="note" rows="2" placeholder="${escapeHtml(c.referralNote)}"></textarea><button type="submit">${c.sendReferral}</button></form>`}
          </div>
          <button type="button" data-career-opening="${opening.id}">↗</button>
        </section>`;
      }).join("")}</div>
      <footer data-print-exclude><button type="button" data-print-plan>${c.printPlan}</button></footer>
    </article>`;
}

function chapterCard(chapter, locale, c) {
  return `
    <article class="alumni-chapter-card" id="alumni-chapter-${chapter.id}">
      <span>${chapter.glyph}</span><div><p>${escapeHtml(t(chapter.meeting, locale))}</p><h4>${escapeHtml(t(chapter.title, locale))}</h4><small>${escapeHtml(t(chapter.unresolved, locale))}</small></div>
      <button type="button" data-alumni-chapter="${chapter.id}">${c.openChapter} ↗</button>
    </article>`;
}

function alumniProfilePanel(locale, c) {
  const profile = alumniProfile();
  const degrees = graduationDegrees();
  if (!profile && !degrees.length) return `<aside class="alumni-locked"><span>封</span><p>${c.noDegree}</p><button type="button" data-careers-view="graduation">${c.graduation} →</button></aside>`;
  if (!profile) {
    const degree = degrees.at(-1);
    return `
      <form class="alumni-activate" data-alumni-activate>
        <p>ALUMNI FILE / ${degree.degreeNumber}</p><h3>${c.activateAlumni}</h3>
        <input type="hidden" name="degreeId" value="${degree.id}">
        <label><span>${c.displayName}</span><input name="displayName" value="${escapeHtml(degree.studentName)}" required></label>
        <label><span>${c.chooseChapter}</span><select name="chapterId">${alumniChapters.map((entry) => `<option value="${entry.id}">${entry.glyph} · ${escapeHtml(t(entry.title, locale))}</option>`).join("")}</select></label>
        <label><span>${c.unresolved}</span><textarea name="unresolvedQuestion" rows="3">${escapeHtml(degree.unresolvedQuestion)}</textarea></label>
        <button class="careers-primary" type="submit">${c.activate}<b>夜</b></button>
      </form>`;
  }
  const chapter = alumniChapter(profile.chapterId);
  return `
    <section class="alumni-profile" id="alumni-profile">
      <header><span>${chapter.glyph}</span><div><p>${profile.id}</p><h3>${escapeHtml(profile.displayName)}</h3><small>${escapeHtml(t(chapter.title, locale))}</small></div></header>
      <blockquote>${escapeHtml(profile.unresolvedQuestion)}</blockquote>
      <div class="alumni-actions">
        <form data-alumni-rsvp>
          <h4>${c.tonight}</h4>
          <label><input type="radio" name="attending" value="yes" ${profile.reunion?.attending ? "checked" : ""}>${c.attending}</label>
          <label><input type="radio" name="attending" value="no" ${profile.reunion && !profile.reunion.attending ? "checked" : ""}>${c.notAttending}</label>
          <textarea name="note" rows="2" placeholder="${escapeHtml(c.reunionNote)}">${escapeHtml(profile.reunion?.note || "")}</textarea>
          <button type="submit">${c.saveRsvp}</button>
        </form>
        <form data-alumni-mentor>
          <h4>${c.mentor}</h4>
          <fieldset><legend>${c.mentorTopics}</legend>${careerDomainOptions.map(([id, title]) => `<label><input type="checkbox" name="topicIds" value="${id}" ${profile.mentorship?.topicIds.includes(id) ? "checked" : ""}>${escapeHtml(t(title, locale))}</label>`).join("")}</fieldset>
          <textarea name="note" rows="2" placeholder="${escapeHtml(c.mentorNote)}">${escapeHtml(profile.mentorship?.note || "")}</textarea>
          <button type="submit">${c.offerMentor}</button>
        </form>
      </div>
    </section>`;
}

function alumniView(locale, c) {
  const night = alumniNightSnapshot();
  return `
    <section class="careers-heading alumni-heading" id="alumni-association">
      <div><p>HYAKKI YAGYO ALUMNI / QUESTIONS OUTLIVE DEGREES</p><h3>${c.alumniTitle}</h3><span>${c.alumniLead}</span></div>
      <div class="graduation-stamp">夜<small>v${night.invitationVersion}</small></div>
    </section>
    <section class="alumni-night">
      <header><p>${c.tonight} · ${night.dayKey}</p><h3>${escapeHtml(t(night.assembly.title, locale))} → ${escapeHtml(t(night.closing.title, locale))}</h3><span>${c.invitation} ${night.invitationVersion}</span></header>
      <ol>${night.route.map((chapter, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><b>${chapter.glyph}</b><strong>${escapeHtml(t(chapter.title, locale))}</strong></li>`).join("")}</ol>
    </section>
    ${alumniProfilePanel(locale, c)}
    <section class="alumni-chapters"><header><p>CHAPTER ROLLS</p><h3>${c.chapters}</h3></header><div>${alumniChapters.map((chapter) => chapterCard(chapter, locale, c)).join("")}</div></section>
    <section class="alumni-stories"><header><p>ROLL MARGINS</p><h3>${c.stories}</h3></header><div>${alumniStories.map((story) => `<article><span>${story.glyph}</span><h4>${escapeHtml(t(story.name, locale))}</h4><p>${escapeHtml(t(story.line, locale))}</p></article>`).join("")}</div></section>`;
}

function chapterView(locale, c) {
  const chapter = alumniChapter(selectedChapterId);
  if (!chapter) return alumniView(locale, c);
  return `
    <button type="button" class="careers-back" data-careers-view="alumni">← ${c.back}</button>
    <article class="alumni-chapter-file" id="alumni-chapter-${chapter.id}">
      <header><span>${chapter.glyph}</span><div><p>HYAKKI YAGYO CHAPTER</p><h3>${escapeHtml(t(chapter.title, locale))}</h3></div></header>
      <dl><div><dt>${c.meeting}</dt><dd>${escapeHtml(t(chapter.meeting, locale))}</dd></div><div><dt>${c.steward}</dt><dd>${escapeHtml(t(chapter.steward, locale))}</dd></div></dl>
      <section><p>${c.unresolvedMatter}</p><blockquote>${escapeHtml(t(chapter.unresolved, locale))}</blockquote></section>
      <footer><button type="button" data-careers-view="alumni">${c.back}</button></footer>
    </article>`;
}

function content(locale, c) {
  if (view === "audit") return auditView(locale, c);
  if (view === "degree") return degreeView(locale, c);
  if (view === "career") return careersView(locale, c);
  if (view === "opening") return openingView(locale, c);
  if (view === "plan") return planView(locale, c);
  if (view === "alumni") return alumniView(locale, c);
  if (view === "chapter") return chapterView(locale, c);
  return graduationView(locale, c);
}

function render({ preserveWindow = true } = {}) {
  if (!root) return;
  const locale = getLocale();
  const c = copy[locale];
  renderPreservingState(root, () => {
    root.innerHTML = `${hero(locale, c)}<div class="careers-workspace">${content(locale, c)}</div>`;
  }, { preserveWindow });
}

function formValues(form) {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

function graduationInput(form) {
  const data = new FormData(form);
  return {
    schoolId: data.get("schoolId"),
    trackId: data.get("trackId"),
    enrolmentYear: data.get("enrolmentYear"),
    graduationYear: data.get("graduationYear"),
    priorCredits: data.get("priorCredits"),
    archivedCoreCodes: data.getAll("archivedCoreCodes"),
    provenance: data.get("provenance"),
    libraryDisputeNote: data.get("libraryDisputeNote"),
    checkoutPlan: data.get("checkoutPlan"),
    unresolvedNote: data.get("unresolvedNote"),
    unresolvedQuestion: data.get("unresolvedQuestion"),
    acceptsAttachments: data.has("acceptsAttachments"),
  };
}

function careerInput(form) {
  const data = new FormData(form);
  return {
    schoolId: data.get("schoolId"),
    domainIds: data.getAll("domainIds"),
    scheduleId: data.get("scheduleId"),
    compensationId: data.get("compensationId"),
    travelId: data.get("travelId"),
    chaosTolerance: data.get("chaosTolerance"),
    refusal: data.get("refusal"),
    question: data.get("question"),
  };
}

function showView(next, route = next) {
  view = next;
  render({ preserveWindow: false });
  navigateToDeepLink(route);
}

function bind() {
  root.addEventListener("click", (event) => {
    const viewButton = event.target.closest("[data-careers-view]");
    if (viewButton) {
      const next = viewButton.dataset.careersView;
      showView(next, next === "career" ? "career-office" : next === "alumni" ? "alumni-association" : "graduation-audit");
      return;
    }
    const audit = event.target.closest("[data-graduation-audit]");
    if (audit) {
      selectedAuditId = audit.dataset.graduationAudit;
      view = "audit";
      render({ preserveWindow: false });
      navigateToDeepLink(`graduation-audit-${selectedAuditId}`);
      return;
    }
    const degree = event.target.closest("[data-graduation-degree]");
    if (degree) {
      selectedDegreeId = degree.dataset.graduationDegree;
      view = "degree";
      render({ preserveWindow: false });
      navigateToDeepLink(`graduation-degree-${selectedDegreeId}`);
      return;
    }
    const opening = event.target.closest("[data-career-opening]");
    if (opening) {
      selectedOpeningId = opening.dataset.careerOpening;
      view = "opening";
      render({ preserveWindow: false });
      navigateToDeepLink(`career-opening-${selectedOpeningId}`);
      return;
    }
    const chapter = event.target.closest("[data-alumni-chapter]");
    if (chapter) {
      selectedChapterId = chapter.dataset.alumniChapter;
      view = "chapter";
      render({ preserveWindow: false });
      navigateToDeepLink(`alumni-chapter-${selectedChapterId}`);
      return;
    }
    if (event.target.closest("[data-print-audit]")) printDocument(".graduation-document", { title: `${copy[getLocale()].auditTitle} · Touhou University` });
    if (event.target.closest("[data-print-degree]")) printDocument(".degree-document", { title: `${copy[getLocale()].degreeTitle} · Touhou University` });
    if (event.target.closest("[data-print-plan]")) printDocument(".career-plan-document", { title: `${copy[getLocale()].careersTitle} · Touhou University` });
  });

  root.addEventListener("change", (event) => {
    if (event.target.matches("[data-graduation-school]")) {
      graduationSchoolId = event.target.value;
      const form = event.target.closest("[data-graduation-form]");
      const cores = form?.querySelector(".graduation-cores");
      if (cores) cores.innerHTML = `<legend>${copy[getLocale()].archiveCores}</legend>${coreCheckboxes(getLocale(), graduationSchoolId)}`;
      const priorCredits = form?.elements.namedItem("priorCredits");
      if (priorCredits) priorCredits.max = graduationEvidence({ schoolId: graduationSchoolId }).requiredCredits;
      return;
    }
    const form = event.target.closest("[data-career-form]");
    if (form) {
      saveCareerDraft(careerInput(form));
      if (event.target.type === "range") {
        event.target.nextElementSibling.textContent = `${event.target.value}/4`;
      }
    }
  });

  root.addEventListener("input", (event) => {
    const form = event.target.closest("[data-career-form]");
    if (form && !event.isComposing) saveCareerDraft(careerInput(form));
  });

  root.addEventListener("submit", (event) => {
    event.preventDefault();
    const locale = getLocale();
    const c = copy[locale];
    if (event.target.matches("[data-graduation-form]")) {
      const result = requestGraduationAudit(graduationInput(event.target));
      if (result.error) {
        showToast({ identity: c.errorIdentity, provenance: c.errorProvenance, question: c.errorQuestion }[result.error] || c.outcomeNotReady);
        return;
      }
      const campusEvent = recordCampusEvent("graduation.audit.requested", {
        auditId: result.record.id,
        schoolId: result.record.schoolId,
        outcome: result.record.outcome,
      }, { id: `graduation.audit.requested:${result.record.id}`, timestamp: result.record.requestedAt });
      selectedAuditId = result.record.id;
      view = "audit";
      showToast(c.auditSaved);
      render({ preserveWindow: false });
      navigateToDeepLink(`graduation-audit-${result.record.id}`);
      return;
    }
    if (event.target.matches("[data-degree-issue]")) {
      const auditId = event.target.dataset.degreeIssue;
      const result = issueGraduationDegree(auditId, new FormData(event.target).has("acceptsConditions"));
      if (result.error) {
        showToast(result.error === "conditions" ? c.errorConditions : c.outcomeNotReady);
        return;
      }
      recordCampusEvent("graduation.degree.issued", {
        degreeId: result.record.id,
        auditId,
        schoolId: result.record.schoolId,
        standing: result.record.standing,
      }, {
        id: `graduation.degree.issued:${result.record.id}`,
        timestamp: result.record.issuedAt,
        causationId: `graduation.audit.requested:${auditId}`,
      });
      selectedDegreeId = result.record.id;
      view = "degree";
      showToast(c.issued);
      render({ preserveWindow: false });
      navigateToDeepLink(`graduation-degree-${result.record.id}`);
      return;
    }
    if (event.target.matches("[data-career-form]")) {
      const result = submitCareerPlan(careerInput(event.target), locale);
      if (result.error) return showToast(c.planError);
      recordCampusEvent("career.plan.submitted", {
        planId: result.record.id,
        schoolId: result.record.profile.schoolId,
        openingIds: result.record.matches.map(({ openingId }) => openingId),
      }, { id: `career.plan.submitted:${result.record.id}`, timestamp: result.record.createdAt });
      selectedPlanId = result.record.id;
      view = "plan";
      showToast(c.planSaved);
      render({ preserveWindow: false });
      navigateToDeepLink(`career-plan-${result.record.id}`);
      return;
    }
    if (event.target.matches("[data-career-referral]")) {
      const openingId = event.target.dataset.careerReferral;
      const result = sendCareerReferral(selectedPlanId, openingId, new FormData(event.target).get("note"));
      if (result.error) return showToast(c.referralError);
      recordCampusEvent("career.referral.sent", {
        referralId: result.referral.id,
        planId: result.plan.id,
        openingId,
      }, {
        id: `career.referral.sent:${result.referral.id}`,
        timestamp: result.referral.sentAt,
        causationId: `career.plan.submitted:${result.plan.id}`,
      });
      showToast(c.referralSent);
      render();
      return;
    }
    if (event.target.matches("[data-alumni-activate]")) {
      const result = activateAlumniProfile(formValues(event.target));
      if (result.error) return showToast(c.noDegree);
      if (result.created) {
        recordCampusEvent("alumni.profile.activated", {
          alumniId: result.record.id,
          degreeId: result.record.degreeId,
          chapterId: result.record.chapterId,
        }, {
          id: `alumni.profile.activated:${result.record.id}`,
          timestamp: result.record.activatedAt,
          causationId: `graduation.degree.issued:${result.record.degreeId}`,
        });
      }
      showToast(c.activated);
      render();
      return;
    }
    if (event.target.matches("[data-alumni-rsvp]")) {
      const data = new FormData(event.target);
      const result = rsvpAlumniReunion(data.get("attending") === "yes", data.get("note"));
      if (result.error) return;
      recordCampusEvent("alumni.reunion.rsvp", {
        alumniId: result.record.id,
        attending: result.record.reunion.attending,
        chapterId: result.record.chapterId,
      }, {
        id: `alumni.reunion.rsvp:${result.record.id}:${result.record.reunion.updatedAt}`,
        timestamp: result.record.reunion.updatedAt,
        causationId: `alumni.profile.activated:${result.record.id}`,
      });
      showToast(c.rsvpSaved);
      render();
      return;
    }
    if (event.target.matches("[data-alumni-mentor]")) {
      const data = new FormData(event.target);
      const result = offerAlumniMentorship(data.getAll("topicIds"), data.get("note"));
      if (result.error) return showToast(c.mentorError);
      recordCampusEvent("alumni.mentorship.offered", {
        alumniId: result.record.id,
        topicIds: result.record.mentorship.topicIds,
        chapterId: result.record.chapterId,
      }, {
        id: `alumni.mentorship.offered:${result.record.id}:${result.record.mentorship.offeredAt}`,
        timestamp: result.record.mentorship.offeredAt,
        causationId: `alumni.profile.activated:${result.record.id}`,
      });
      showToast(c.mentorSaved);
      render();
    }
  });
}

function initialView() {
  const route = safeDecodeFragment();
  if (route === "career-office") view = "career";
  if (route === "alumni-association" || route === "alumni-profile") view = "alumni";
  if (route.startsWith("graduation-audit-")) {
    selectedAuditId = route.slice("graduation-audit-".length);
    view = "audit";
  }
  if (route.startsWith("graduation-degree-")) {
    selectedDegreeId = route.slice("graduation-degree-".length);
    view = "degree";
  }
  if (route.startsWith("career-opening-")) {
    selectedOpeningId = route.slice("career-opening-".length);
    view = "opening";
  }
  if (route.startsWith("career-plan-")) {
    selectedPlanId = route.slice("career-plan-".length);
    view = "plan";
  }
  if (route.startsWith("alumni-chapter-")) {
    selectedChapterId = route.slice("alumni-chapter-".length);
    view = "chapter";
  }
}

export function initCareers() {
  root = document.querySelector("[data-careers-app]");
  if (!root) return;
  const identity = (() => {
    try { return JSON.parse(localStorage.getItem("tu:identity") || "null"); } catch { return null; }
  })();
  graduationSchoolId = Object.hasOwn(schools, identity?.preferredSchool) ? identity.preferredSchool : "boundary";
  initialView();
  render({ preserveWindow: false });
  bind();
  root.querySelectorAll("textarea").forEach((field, index) => {
    if (!field.dataset.preserveFocus) field.dataset.preserveFocus = `careers-text-${index}`;
    bindImeSafeInput(field, () => {});
  });
  [
    ["graduation-audit-", "audit", (id) => { selectedAuditId = id; }],
    ["graduation-degree-", "degree", (id) => { selectedDegreeId = id; }],
    ["career-opening-", "opening", (id) => { selectedOpeningId = id; }],
    ["career-plan-", "plan", (id) => { selectedPlanId = id; }],
    ["alumni-chapter-", "chapter", (id) => { selectedChapterId = id; }],
  ].forEach(([prefix, next, select]) => registerDeepLink(prefix, {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: ({
      audit: "graduation-focus",
      degree: "graduation-focus",
      opening: "career-focus",
      plan: "career-focus",
      chapter: "alumni-focus",
    })[next],
    position: "always",
    open(id) {
      select(id);
      view = next;
      render({ preserveWindow: false });
    },
  }));
  [
    ["graduation-audit", "graduation"],
    ["graduation-records", "graduation"],
    ["career-office", "career"],
    ["alumni-association", "alumni"],
    ["alumni-profile", "alumni"],
  ].forEach(([route, next]) => registerDeepLink(route, {
    anchor: () => document.getElementById(route) || root,
    position: "always",
    open() {
      view = next;
      render({ preserveWindow: false });
    },
  }));
  window.addEventListener("tu:languagechange", () => render({ preserveWindow: false }));
  window.addEventListener("tu:recordschange", () => render());
}
