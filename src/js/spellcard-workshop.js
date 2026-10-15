import { startSandbox } from "./spellcard-sandbox.js";
import { trees as catalogTrees } from "../generated/i18n/ui/spellcard-workshop.js";
import {
  spellCues,
  spellDefenceRounds,
  spellPattern,
  spellPatterns,
  spellReviewers,
  spellSounds,
  spellVenues,
} from "../data/spellcard-workshop.js";
import {
  assessSpellcard,
  clearSpellcardDraft,
  completeSpellcardDefence,
  defenceForDesign,
  reviseSpellcardDesign,
  saveSpellcardDesign,
  saveSpellcardDraft,
  spellConditions,
  spellRulings,
  spellcardDefence,
  spellcardDefencePanel,
  spellcardDefenceQuestions,
  spellcardDefences,
  spellcardDesign,
  spellcardDesigns,
  spellcardDraft,
  spellcardStats,
  workshopConditions,
} from "./spellcard-workshop-model.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { getLocale } from "./i18n.js";
import { bindImeSafeInput } from "./ime-input.js";
import { printDocument } from "./print-document.js";
import { renderPreservingState } from "./render-state.js";
import { siteHref } from "./site-router.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

const copy = catalogTrees["copy"];

let root;
let mode = "design";
let selectedDesignId = null;
let selectedDefenceId = null;
let currentDraft;
let draftTimer = 0;
let clockTimer = 0;
let teardownSandbox = null;
let message = "";

function localized(value, locale = getLocale()) {
  return value?.[locale] ?? value?.["zh-Hant"] ?? value ?? "";
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
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function selectOptions(records, selected, locale) {
  return records.map((record) => (
    `<option value="${record.id}" ${record.id === selected ? "selected" : ""}>${escapeHtml(localized(record.name, locale))}</option>`
  )).join("");
}

function rangeField(name, label, value, minimum, maximum, step = 1) {
  return `
    <label class="spell-range">
      <span>${label}<output data-spell-output="${name}">${value}</output></span>
      <input type="range" name="${name}" min="${minimum}" max="${maximum}" step="${step}" value="${value}">
    </label>`;
}

function metricPanel(assessment, c) {
  const m = assessment.metrics;
  return `
    <div class="spell-metric-grid" data-spell-metrics>
      <article><span>${c.corridorMetric}</span><strong>${m.effectiveCorridor}%</strong></article>
      <article><span>${c.projectileMetric}</span><strong>${m.projectileBudget}<small>${c.units}</small></strong></article>
      <article><span>${c.workloadMetric}</span><strong>${m.workload}</strong></article>
      <article><span>${c.readabilityMetric}</span><strong>${m.readability}</strong></article>
      <article><span>${c.expressionMetric}</span><strong>${m.expression}</strong></article>
      <article><span>${c.reproducibilityMetric}</span><strong>${m.reproducibility}</strong></article>
      <article><span>${c.fatigueMetric}</span><strong>${m.fatigue}</strong></article>
    </div>`;
}

function reviewerPanel(assessment, locale, c) {
  return `
    <div class="spell-review-grid" data-spell-reviews>
      ${assessment.reviews.map((review, index) => {
        const reviewer = spellReviewers[review.reviewerId];
        return `
          <article class="spell-review spell-review-${review.stance} spell-review-${index + 1}">
            <header><i aria-hidden="true">${reviewer.glyph}</i><div><strong>${escapeHtml(localized(reviewer.name, locale))}</strong><span>${escapeHtml(localized(reviewer.role, locale))}</span></div><b>${c[review.stance]}</b></header>
            <p>${escapeHtml(localized(reviewer.responses[review.stance], locale))}</p>
          </article>`;
      }).join("")}
    </div>`;
}

function liveStrip(locale, c) {
  const status = workshopConditions(locale);
  const moon = ["●", "◔", "◑", "◕", "○", "◕", "◑", "◔"][status.phase] || "◌";
  return `
    <aside class="spell-live-strip" data-spell-live>
      <span>${c.notice}</span><strong>${moon} ${escapeHtml(status.dayKey)} · ${escapeHtml(status.shift)}</strong>
      <p>${escapeHtml(status.notice)}</p>
    </aside>`;
}

function shell(content, locale, c) {
  const stats = spellcardStats();
  return `
    <header class="spell-workshop-hero">
      <div>
        <p>${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
      </div>
      <blockquote><b>SC / RULE 07</b>${c.noSingleScore}</blockquote>
    </header>
    ${liveStrip(locale, c)}
    <nav class="spell-workshop-tabs" aria-label="${escapeHtml(c.title)}">
      <button type="button" data-spell-tab="design" aria-pressed="${mode === "design"}"><span>01</span><strong>${c.designTab}</strong></button>
      <button type="button" data-spell-tab="archive" aria-pressed="${mode === "archive" || mode === "defence"}"><span>02</span><strong>${c.archiveTab}</strong><b>${stats.designs} / ${stats.defences} ${c.archiveCounts}</b></button>
    </nav>
    <span class="section-route-anchor" id="spellcard-records" aria-hidden="true"></span>
    <div class="spell-workshop-view" data-spell-view>${content}</div>`;
}

function designView(locale, c) {
  currentDraft = currentDraft || spellcardDraft();
  const assessment = assessSpellcard(currentDraft);
  return `
    <article class="spell-design-bench" data-spell-design-bench>
      <section class="spell-sandbox-panel">
        <header><div><p>SANDBOX / MAX 72 SHOTS</p><h3>${c.sandbox}</h3></div><span>${c.sandboxLead}</span></header>
        <div class="spell-sandbox-stage">
          <canvas data-spell-canvas tabindex="0" aria-label="${escapeHtml(c.sandboxLead)}"></canvas>
          <div class="spell-sandbox-status">
            <span data-spell-flight-state>${c.declaration}</span>
            <b>${c.collisions} <i data-spell-hits>0</i></b>
            <b>${c.grazes} <i data-spell-grazes>0</i></b>
          </div>
          <div class="spell-sandbox-actions">
            <button type="button" data-spell-reset-flight>${c.resetFlight}</button>
            <button type="button" data-spell-pause>${c.pause}</button>
          </div>
        </div>
        ${metricPanel(assessment, c)}
      </section>
      <form class="spell-design-form" data-spell-design-form>
        <header><p>DESIGN REGISTER / AUTOSAVE</p><h3>${escapeHtml(localized(assessment.pattern.name, locale))}</h3><span data-spell-pattern-note>${escapeHtml(localized(assessment.pattern.premise, locale))}</span></header>
        ${message ? `<p class="spell-message" role="status">${escapeHtml(message)}</p>` : ""}
        <label class="spell-name-field">${c.name}
          <input type="text" name="spellName" maxlength="80" value="${escapeHtml(currentDraft.spellName)}" placeholder="${escapeHtml(c.namePlaceholder)}" data-preserve-focus="spell-name">
        </label>
        <div class="spell-select-grid">
          <label>${c.pattern}<select name="patternId">${selectOptions(spellPatterns, currentDraft.patternId, locale)}</select></label>
          <label>${c.venue}<select name="venueId">${selectOptions(spellVenues, currentDraft.venueId, locale)}</select></label>
          <label>${c.cue}<select name="cueId">${selectOptions(spellCues, currentDraft.cueId, locale)}</select></label>
          <label>${c.sound}<select name="soundId">${selectOptions(spellSounds, currentDraft.soundId, locale)}</select></label>
        </div>
        <div class="spell-context-notes">
          <p data-spell-venue-note>${escapeHtml(localized(assessment.venue.note, locale))}</p>
          <p data-spell-cue-note>${escapeHtml(localized(assessment.cue.note, locale))}</p>
          <p data-spell-sound-note>${escapeHtml(localized(assessment.sound.note, locale))}</p>
        </div>
        <div class="spell-range-grid">
          ${rangeField("speed", c.speed, currentDraft.speed, 1, 5)}
          ${rangeField("density", c.density, currentDraft.density, 1, 5)}
          ${rangeField("symmetry", c.symmetry, currentDraft.symmetry, 0, 4)}
          ${rangeField("randomness", c.randomness, currentDraft.randomness, 0, 4)}
          ${rangeField("declarationDelay", c.declarationDelay, currentDraft.declarationDelay, 0.4, 3, 0.1)}
          ${rangeField("corridorWidth", c.corridorWidth, currentDraft.corridorWidth, 12, 56)}
          ${rangeField("changeFrequency", c.changeFrequency, currentDraft.changeFrequency, 1, 5)}
          ${rangeField("duration", c.duration, currentDraft.duration, 15, 90)}
          ${rangeField("flashLevel", c.flashLevel, currentDraft.flashLevel, 0, 3)}
        </div>
        <div class="spell-check-grid">
          <label><input type="checkbox" name="seedLock" ${currentDraft.seedLock ? "checked" : ""}><span>${c.seedLock}</span></label>
          <label><input type="checkbox" name="stopSignal" ${currentDraft.stopSignal ? "checked" : ""}><span>${c.stopSignal}</span></label>
          <label><input type="checkbox" name="audienceBriefing" ${currentDraft.audienceBriefing ? "checked" : ""}><span>${c.audienceBriefing}</span></label>
          <label><input type="checkbox" name="liveConditions" ${currentDraft.liveConditions ? "checked" : ""}><span>${c.liveConditions}</span></label>
        </div>
        <label class="spell-note-field">${c.fieldNote}
          <textarea name="fieldNote" rows="4" maxlength="800" placeholder="${escapeHtml(c.fieldPlaceholder)}" data-preserve-focus="spell-note">${escapeHtml(currentDraft.fieldNote)}</textarea>
        </label>
        <footer>
          <span><i aria-hidden="true">✓</i>${c.autosaved}</span>
          <button type="button" class="button button-secondary" data-spell-clear>${c.clear}</button>
          <button type="submit" class="button button-primary">${c.save} <span aria-hidden="true">→</span></button>
        </footer>
      </form>
      <section class="spell-review-board">
        <header><div><p>CONFLICTING REVIEW / 6 DESKS</p><h3>${c.reviews}</h3></div><span>${c.noSingleScore}</span></header>
        ${reviewerPanel(assessment, locale, c)}
      </section>
    </article>`;
}

function designSummary(design, locale, c, { compact = false } = {}) {
  const defence = defenceForDesign(design.id);
  return `
    <article class="spell-design-file${compact ? " is-compact" : ""}" ${compact ? "" : `id="spellcard-design-${design.id}"`} data-spell-design-file="${design.id}">
      <header>
        <div><p>${design.id}</p><h3>${escapeHtml(design.draft.spellName)}</h3><span>${escapeHtml(localized(spellPatterns.find((item) => item.id === design.draft.patternId)?.name, locale))}</span></div>
        <b>${defence ? `${c.defended} · ${escapeHtml(localized(spellRulings[defence.ruling], locale))}` : c.noDefence}</b>
      </header>
      ${compact ? "" : `
        <dl class="spell-file-meta">
          <div><dt>${c.created}</dt><dd>${formatDate(design.createdAt, locale)}</dd></div>
          <div><dt>${c.version}</dt><dd>${design.revisionOf || c.firstVersion}</dd></div>
          <div><dt>${c.conditionsAtSave}</dt><dd>${escapeHtml(design.live?.dayKey || "—")} · ${escapeHtml(localized(spellVenues.find((item) => item.id === design.draft.venueId)?.name, locale))}</dd></div>
        </dl>
        ${metricPanel({ metrics: design.metrics }, c)}
        <section class="spell-file-reviews"><h4>${c.reviews}</h4>${reviewerPanel({ reviews: design.reviews }, locale, c)}</section>
        <blockquote>${escapeHtml(design.draft.fieldNote || localized(spellPatterns.find((item) => item.id === design.draft.patternId)?.premise, locale))}</blockquote>
        <footer data-print-exclude>
          <button type="button" class="button button-secondary" data-spell-revise="${design.id}">${c.revise}</button>
          <button type="button" class="button button-primary" data-spell-defend="${defence?.id || design.id}">${defence ? c.defended : c.defend} <span aria-hidden="true">→</span></button>
          <button type="button" class="spell-paper-button" data-spell-print="${design.id}">${c.print}</button>
        </footer>`}
    </article>`;
}

function archiveView(locale, c) {
  const designs = spellcardDesigns().slice().reverse();
  const selected = selectedDesignId ? spellcardDesign(selectedDesignId) : designs[0];
  return `
    <section class="spell-archive">
      <header><div><p>LOCAL VERSION SHELF</p><h3>${c.allDesigns}</h3></div><span>${designs.length} ${c.archiveCounts}</span></header>
      ${designs.length ? `
        <div class="spell-version-shelf" data-preserve-scroll="spell-version-shelf">
          ${designs.map((design) => `<button type="button" data-spell-open-design="${design.id}" aria-pressed="${selected?.id === design.id}"><span>${design.id}</span><strong>${escapeHtml(design.draft.spellName)}</strong><small>${formatDate(design.createdAt, locale)}</small></button>`).join("")}
        </div>
        ${selected ? designSummary(selected, locale, c) : ""}`
        : `<p class="spell-empty">${c.noDesigns}</p>`}
    </section>`;
}

function panelHeader(panel, locale, c) {
  return `
    <div class="spell-defence-panel">
      ${panel.map((id, index) => {
        const reviewer = spellReviewers[id];
        return `<article><i>${reviewer.glyph}</i><span>0${index + 1}</span><strong>${escapeHtml(localized(reviewer.name, locale))}</strong><small>${escapeHtml(localized(reviewer.role, locale))}</small></article>`;
      }).join("")}
    </div>
    <p class="spell-defence-lead">${c.defenceLead}</p>`;
}

function defenceQuestion(round, key, locale, c, selected = "") {
  return `
    <fieldset class="spell-defence-round">
      <legend><span>${escapeHtml(localized(round.role, locale))}</span><strong>${escapeHtml(localized(round.prompt, locale))}</strong></legend>
      <div>
        ${round.choices.map((choice) => `
          <label>
            <input type="radio" name="${key}" value="${choice.id}" ${choice.id === selected ? "checked" : ""}>
            <span><strong>${escapeHtml(localized(choice.label, locale))}</strong><small>${escapeHtml(localized(choice.note, locale))}</small></span>
          </label>`).join("")}
      </div>
    </fieldset>`;
}

function defenceResult(record, design, locale, c) {
  const rounds = spellcardDefenceQuestions(design);
  const panel = record.panel;
  const answerKeys = ["rule", "reproducibility", "external"];
  const dissent = record.dissentReviewerId ? spellReviewers[record.dissentReviewerId] : null;
  return `
    <article class="spell-defence-record" id="spellcard-defence-${record.id}" data-spell-defence-record="${record.id}">
      <header>
        <div><p>${c.documentTitle} · ${record.id}</p><h3>${escapeHtml(design.draft.spellName)}</h3><span>${formatDate(record.createdAt, locale)}</span></div>
        <b class="spell-ruling spell-ruling-${record.ruling}">${escapeHtml(localized(spellRulings[record.ruling], locale))}</b>
      </header>
      ${panelHeader(panel, locale, c)}
      <section class="spell-vote-record">
        <h4>${c.majority}</h4>
        ${record.votes.map((item) => {
          const reviewer = spellReviewers[item.reviewerId];
          const label = item.vote === "approve" ? c.voteApprove : item.vote === "conditional" ? c.voteConditional : c.voteReject;
          return `<p><strong>${escapeHtml(localized(reviewer.name, locale))}</strong><span>${label}</span></p>`;
        }).join("")}
      </section>
      <section class="spell-answer-record">
        ${rounds.map((round, index) => {
          const answer = round.choices.find((choice) => choice.id === record.answers[answerKeys[index]]);
          return `<article><span>0${index + 1} · ${c.selectedAnswer}</span><strong>${escapeHtml(localized(answer?.label, locale))}</strong><p>${escapeHtml(localized(answer?.note, locale))}</p></article>`;
        }).join("")}
      </section>
      <section class="spell-condition-record">
        <h4>${c.conditions}</h4>
        <ol>${record.conditionIds.map((id) => `<li>${escapeHtml(localized(spellConditions[id], locale))}</li>`).join("") || `<li>${escapeHtml(localized(spellConditions.version, locale))}</li>`}</ol>
      </section>
      <blockquote class="spell-dissent">
        <span>${c.minority}</span>
        <strong>${dissent ? escapeHtml(localized(dissent.name, locale)) : escapeHtml(localized(spellReviewers.fairies.name, locale))}</strong>
        <p>${dissent
          ? escapeHtml(localized(dissent.responses[design.reviews.find((item) => item.reviewerId === record.dissentReviewerId)?.stance || "caution"], locale))
          : escapeHtml(localized(spellReviewers.fairies.responses.caution, locale))}</p>
      </blockquote>
      <p class="spell-document-note">${c.documentNote}</p>
      <footer data-print-exclude>
        <button type="button" class="button button-secondary" data-spell-open-design="${design.id}">${c.designFile}</button>
        <button type="button" class="button button-primary" data-spell-print="${design.id}" data-spell-print-defence="${record.id}">${c.print}</button>
        <a class="spell-paper-button" href="${siteHref("bbs")}">${c.openBbs}</a>
      </footer>
    </article>`;
}

function defenceView(locale, c) {
  const completed = selectedDefenceId ? spellcardDefence(selectedDefenceId) : null;
  const design = spellcardDesign(completed?.designId || selectedDesignId);
  if (!design) return `<p class="spell-empty">${c.noDesigns}</p>`;
  if (completed) return defenceResult(completed, design, locale, c);
  const existing = defenceForDesign(design.id);
  if (existing) {
    selectedDefenceId = existing.id;
    return defenceResult(existing, design, locale, c);
  }
  const panel = spellcardDefencePanel(design);
  const rounds = spellcardDefenceQuestions(design);
  return `
    <article class="spell-defence-dais" id="spellcard-defence-${design.id}">
      <header><div><p>PUBLIC VIVA / THREE SEATS</p><h3>${c.publicDefence}</h3></div><strong>${escapeHtml(design.draft.spellName)}</strong></header>
      ${panelHeader(panel, locale, c)}
      ${message ? `<p class="spell-message" role="status">${escapeHtml(message)}</p>` : ""}
      <form data-spell-defence-form="${design.id}">
        ${defenceQuestion(rounds[0], "rule", locale, c)}
        ${defenceQuestion(rounds[1], "reproducibility", locale, c)}
        ${defenceQuestion(rounds[2], "external", locale, c)}
        <footer><span>${c.answerAll}</span><button type="submit" class="button button-primary">${c.submitDefence} <span aria-hidden="true">→</span></button></footer>
      </form>
    </article>`;
}

function render({ preserveWindow = true } = {}) {
  if (!root) return;
  teardownSandbox?.();
  teardownSandbox = null;
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  const content = mode === "design" ? designView(locale, c) : mode === "defence" ? defenceView(locale, c) : archiveView(locale, c);
  renderPreservingState(root, () => {
    root.innerHTML = shell(content, locale, c);
  }, { preserveWindow });
  bindControls();
  if (mode === "design") {
    const canvas = root.querySelector("[data-spell-canvas]");
    if (canvas) teardownSandbox = startSandbox(root, canvas, () => assessSpellcard(currentDraft), c);
  }
}

function formDraft(form) {
  const data = new FormData(form);
  return {
    ...currentDraft,
    spellName: data.get("spellName"),
    patternId: data.get("patternId"),
    venueId: data.get("venueId"),
    cueId: data.get("cueId"),
    soundId: data.get("soundId"),
    speed: data.get("speed"),
    density: data.get("density"),
    symmetry: data.get("symmetry"),
    randomness: data.get("randomness"),
    declarationDelay: data.get("declarationDelay"),
    corridorWidth: data.get("corridorWidth"),
    changeFrequency: data.get("changeFrequency"),
    duration: data.get("duration"),
    flashLevel: data.get("flashLevel"),
    seedLock: data.has("seedLock"),
    stopSignal: data.has("stopSignal"),
    audienceBriefing: data.has("audienceBriefing"),
    liveConditions: data.has("liveConditions"),
    fieldNote: data.get("fieldNote"),
  };
}

function scheduleDraftSave() {
  window.clearTimeout(draftTimer);
  draftTimer = window.setTimeout(() => {
    currentDraft = saveSpellcardDraft(currentDraft);
  }, 180);
}

function updateWorkbench(form) {
  currentDraft = formDraft(form);
  scheduleDraftSave();
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  const assessment = assessSpellcard(currentDraft);
  const metric = root.querySelector("[data-spell-metrics]");
  const reviews = root.querySelector("[data-spell-reviews]");
  if (metric) metric.outerHTML = metricPanel(assessment, c);
  if (reviews) reviews.outerHTML = reviewerPanel(assessment, locale, c);
  const notes = {
    "[data-spell-pattern-note]": localized(assessment.pattern.premise, locale),
    "[data-spell-venue-note]": localized(assessment.venue.note, locale),
    "[data-spell-cue-note]": localized(assessment.cue.note, locale),
    "[data-spell-sound-note]": localized(assessment.sound.note, locale),
  };
  Object.entries(notes).forEach(([selector, value]) => {
    const target = root.querySelector(selector);
    if (target) target.textContent = value;
  });
  form.querySelectorAll("[data-spell-output]").forEach((output) => {
    output.textContent = form.elements[output.dataset.spellOutput]?.value || "";
  });
}

function setStaticMode(nextMode, hash) {
  mode = nextMode;
  selectedDesignId = null;
  selectedDefenceId = null;
  message = "";
  render({ preserveWindow: false });
  navigateToDeepLink(hash);
}

function finishDesign(record, c) {
  recordCampusEvent(
    "spellcard.design.saved",
    {
      designId: record.id,
      spellName: record.draft.spellName,
      patternId: record.draft.patternId,
      revisionOf: record.revisionOf,
    },
    { id: `spellcard.design.saved:${record.id}`, timestamp: record.createdAt },
  );
  selectedDesignId = record.id;
  mode = "archive";
  message = "";
  navigateToDeepLink(`spellcard-design-${record.id}`);
  showToast(c.saved);
}

function finishDefence(record, design, c) {
  recordCampusEvent(
    "spellcard.defence.completed",
    {
      defenceId: record.id,
      designId: design.id,
      spellName: design.draft.spellName,
      ruling: record.ruling,
      dissentReviewerId: record.dissentReviewerId,
    },
    { id: `spellcard.defence.completed:${record.id}`, timestamp: record.createdAt },
  );
  selectedDesignId = design.id;
  selectedDefenceId = record.id;
  mode = "defence";
  message = "";
  navigateToDeepLink(`spellcard-defence-${record.id}`);
  showToast(c.defenceSaved);
}

function printableFile(designId, defenceId, locale, c) {
  const design = spellcardDesign(designId);
  if (!design) return null;
  const wrapper = document.createElement("article");
  wrapper.className = "spell-print-document";
  wrapper.innerHTML = `
    <header><p>TOUHOU UNIVERSITY · SC-ETHICS</p><h1>${escapeHtml(c.documentTitle)}</h1><strong>${escapeHtml(design.draft.spellName)}</strong></header>
    ${designSummary(design, locale, c)}
    ${defenceId && spellcardDefence(defenceId) ? defenceResult(spellcardDefence(defenceId), design, locale, c) : `<p>${c.noDefence}</p>`}
    <footer><p>${c.documentNote}</p><span>${formatDate(new Date().toISOString(), locale)}</span></footer>`;
  return wrapper;
}

function bindDesignForm(c) {
  const form = root.querySelector("[data-spell-design-form]");
  if (!form) return;
  const name = form.elements.spellName;
  const note = form.elements.fieldNote;
  bindImeSafeInput(name, () => updateWorkbench(form));
  bindImeSafeInput(note, () => updateWorkbench(form));
  form.querySelectorAll("select, input[type='range'], input[type='checkbox']").forEach((control) => {
    control.addEventListener("input", () => updateWorkbench(form));
    control.addEventListener("change", () => updateWorkbench(form));
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    window.clearTimeout(draftTimer);
    currentDraft = saveSpellcardDraft(formDraft(form));
    const result = saveSpellcardDesign(currentDraft);
    if (result.error === "name") {
      message = c.nameRequired;
      name.focus();
      return;
    }
    finishDesign(result.record, c);
  });
  root.querySelector("[data-spell-clear]")?.addEventListener("click", () => {
    currentDraft = clearSpellcardDraft();
    message = "";
    render();
  });
}

function bindControls() {
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  root.querySelector('[data-spell-tab="design"]')?.addEventListener("click", () => {
    currentDraft = spellcardDraft();
    setStaticMode("design", "spellcard-workshop");
  });
  root.querySelector('[data-spell-tab="archive"]')?.addEventListener("click", () => setStaticMode("archive", "spellcard-records"));
  bindDesignForm(c);
  root.querySelectorAll("[data-spell-open-design]").forEach((button) => {
    button.addEventListener("click", () => navigateToDeepLink(`spellcard-design-${button.dataset.spellOpenDesign}`));
  });
  root.querySelectorAll("[data-spell-revise]").forEach((button) => {
    button.addEventListener("click", () => {
      currentDraft = reviseSpellcardDesign(button.dataset.spellRevise);
      setStaticMode("design", "spellcard-workshop");
    });
  });
  root.querySelectorAll("[data-spell-defend]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.spellDefend;
      const completed = spellcardDefence(id);
      navigateToDeepLink(`spellcard-defence-${completed ? completed.id : id}`);
    });
  });
  root.querySelector("[data-spell-defence-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const result = completeSpellcardDefence(form.dataset.spellDefenceForm, {
      rule: data.get("rule"),
      reproducibility: data.get("reproducibility"),
      external: data.get("external"),
    });
    if (result.error) {
      message = c.answerAll;
      render();
      return;
    }
    finishDefence(result.record, result.design, c);
  });
  root.querySelectorAll("[data-spell-print]").forEach((button) => {
    button.addEventListener("click", () => {
      const file = printableFile(button.dataset.spellPrint, button.dataset.spellPrintDefence, locale, c);
      if (file) printDocument(file, { title: `${c.documentTitle} · ${spellcardDesign(button.dataset.spellPrint)?.draft.spellName}` });
    });
  });
}


function initialState() {
  const route = safeDecodeFragment();
  if (route.startsWith("spellcard-design-")) {
    const id = route.slice("spellcard-design-".length);
    if (spellcardDesign(id)) {
      mode = "archive";
      selectedDesignId = id;
      return;
    }
  }
  if (route.startsWith("spellcard-defence-")) {
    const id = route.slice("spellcard-defence-".length);
    const defence = spellcardDefence(id);
    const design = defence ? spellcardDesign(defence.designId) : spellcardDesign(id);
    if (design) {
      mode = "defence";
      selectedDesignId = design.id;
      selectedDefenceId = defence?.id || null;
      return;
    }
  }
  mode = route === "spellcard-records" ? "archive" : "design";
}

function leaveFocusedSpellcardRoute({ route = "" } = {}) {
  if (/^spellcard-(?:pattern|design|defence)-/.test(route)) return;
  const nextMode = route === "spellcard-records" ? "archive" : "design";
  if (mode === nextMode && !selectedDesignId && !selectedDefenceId) return;
  mode = nextMode;
  selectedDesignId = null;
  selectedDefenceId = null;
  message = "";
  currentDraft = spellcardDraft();
  render({ preserveWindow: false });
}

export function initSpellcardWorkshop() {
  root = document.querySelector("[data-spellcard-workshop]");
  if (!root) return;
  currentDraft = spellcardDraft();
  initialState();
  render({ preserveWindow: false });
  registerDeepLink("spellcard-pattern-", {
    anchor: root,
    historyGroup: "spellcard-workshop-focus",
    position: "always",
    open(id) {
      if (!spellPattern(id)) return;
      mode = "design";
      selectedDesignId = null;
      selectedDefenceId = null;
      currentDraft = { ...currentDraft, patternId: id };
      render({ preserveWindow: false });
    },
    close: leaveFocusedSpellcardRoute,
  });
  registerDeepLink("spellcard-design-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "spellcard-workshop-focus",
    position: "always",
    open(id) {
      if (!spellcardDesign(id)) return;
      mode = "archive";
      selectedDesignId = id;
      selectedDefenceId = null;
      render({ preserveWindow: false });
    },
    close: leaveFocusedSpellcardRoute,
  });
  registerDeepLink("spellcard-defence-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "spellcard-workshop-focus",
    position: "always",
    open(id) {
      const defence = spellcardDefence(id);
      const design = defence ? spellcardDesign(defence.designId) : spellcardDesign(id);
      if (!design) return;
      mode = "defence";
      selectedDesignId = design.id;
      selectedDefenceId = defence?.id || null;
      render({ preserveWindow: false });
    },
    close: leaveFocusedSpellcardRoute,
  });
  window.addEventListener("tu:languagechange", () => render());
  clockTimer = window.setInterval(() => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    const next = document.createElement("div");
    next.innerHTML = liveStrip(locale, c);
    root.querySelector("[data-spell-live]")?.replaceWith(next.firstElementChild);
  }, 60_000);
  window.addEventListener("pagehide", () => {
    window.clearInterval(clockTimer);
    window.clearTimeout(draftTimer);
    teardownSandbox?.();
  }, { once: true });
}
