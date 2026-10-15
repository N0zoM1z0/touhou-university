import { trees as catalogTrees } from "../generated/i18n/ui/live-campus.js";
import { governanceProposals } from "../data/governance.js";
import { liveCampusSnapshot } from "../data/live-campus.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { castGovernanceVote, governanceTally } from "./governance-model.js";
import { getLocale } from "./i18n.js";
import { renderPreservingState } from "./render-state.js";
import { showToast } from "./ui.js";

const SELECTED_KEY = "tu:governance:selected";

const copy = catalogTrees["copy"];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function phaseName(phase, locale) {
  return catalogTrees["phaseName"][locale][phase];
}

export function initLiveCampus() {
  const root = document.querySelector("[data-live-campus-app]");
  if (!root) return;
  let selectedId = governanceProposals.some((item) => item.id === window.localStorage.getItem(SELECTED_KEY))
    ? window.localStorage.getItem(SELECTED_KEY)
    : governanceProposals[0].id;
  let clockTimer;

  function render() {
    const locale = getLocale();
    const c = copy[locale];
    const state = liveCampusSnapshot();
    const selected = governanceProposals.find((item) => item.id === selectedId) || governanceProposals[0];
    const tally = governanceTally(selected.id);
    const selectedChoice = selected.choices.find((choice) => choice.id === tally.local?.choiceId);
    const time = new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "short" }).format(new Date());
    renderPreservingState(root, () => {
      root.innerHTML = `
        <header class="live-campus-heading">
          <div><p>${c.eyebrow}</p><h2>${c.title}</h2></div>
          <p>${c.lead}</p>
        </header>
        <div class="live-campus-board">
          <section class="live-campus-clock">
            <span>${c.deviceTime}</span>
            <strong>${escapeHtml(time)}</strong>
            <dl>
              <div><dt>${c.academicDay}</dt><dd>DAY ${state.academicDay + 1}</dd></div>
              <div><dt>${c.phase}</dt><dd>${phaseName(state.phase, locale)}</dd></div>
              <div><dt>${c.weather}</dt><dd>${state.weather[locale]}</dd></div>
            </dl>
            <small>${c.updated}</small>
          </section>
          <section class="live-campus-notices">
            <header><span>${c.notices}</span><b>${String(state.activeEvents.length).padStart(2, "0")}</b></header>
            ${state.activeEvents.map((event) => `
              <article data-severity="${event.severity}">
                <i>${event.glyph}</i>
                <div><h3>${event.title[locale]}</h3><p>${event.body[locale]}</p><small>${c.rules} · ${event.rule[locale]}</small></div>
              </article>`).join("")}
          </section>
          <nav class="live-campus-services" aria-label="${c.services}">
            <span>${c.services}</span>
            <button type="button" data-service="dining">${c.dining}<b>↗</b></button>
            <button type="button" data-service="timetable">${c.timetable}<b>↗</b></button>
            <button type="button" data-service="availability">${c.rooms}<b>↗</b></button>
            <a href="clinic.html#clinic">${c.clinic}<b>↗</b></a>
            <a href="#map">${c.map}<b>↓</b></a>
          </nav>
        </div>
        <section class="governance-board">
          <header>
            <div><p>${c.senate}</p><h2>${c.governanceTitle}</h2></div>
            <span>${c.governanceLead}</span>
          </header>
          <div class="governance-layout">
            <nav data-preserve-scroll="governance-index" aria-label="${c.senate}">
              ${governanceProposals.map((proposal) => {
                const summary = governanceTally(proposal.id);
                return `
                  <button type="button" data-governance-select="${proposal.id}" class="${proposal.id === selected.id ? "active" : ""}">
                    <i>${proposal.glyph}</i><span><small>${proposal.code}</small><strong>${proposal.title[locale]}</strong></span><b>${summary.total}</b>
                  </button>`;
              }).join("")}
            </nav>
            <article class="governance-file">
              <header><div><p>${selected.code}</p><h3>${selected.title[locale]}</h3></div><i>${selected.glyph}</i></header>
              <p>${selected.summary[locale]}</p>
              <dl>
                <div><dt>${c.sponsor}</dt><dd>${selected.sponsor[locale]}</dd></div>
                <div><dt>${c.total}</dt><dd>${tally.total} ${c.votes}</dd></div>
                <div><dt>${c.leading}</dt><dd>${tally.leader.label[locale]}</dd></div>
                <div><dt>${c.yourVote}</dt><dd>${selectedChoice?.label[locale] || "—"}</dd></div>
              </dl>
              <div class="governance-choices">
                ${selected.choices.map((choice) => {
                  const percent = Math.round((tally.counts[choice.id] / tally.total) * 100);
                  const voted = tally.local?.choiceId === choice.id;
                  return `
                    <button type="button" data-governance-vote="${choice.id}" class="${voted ? "voted" : ""}">
                      <span><strong>${choice.label[locale]}</strong><small><b>${c.consequence}</b>${choice.consequence[locale]}</small></span>
                      <i><em style="width:${percent}%"></em></i>
                      <b>${tally.counts[choice.id]}<small>${percent}%</small></b>
                      <u>${voted ? "✓" : c.vote}</u>
                    </button>`;
                }).join("")}
              </div>
            </article>
          </div>
        </section>`;
    });
  }

  root.addEventListener("click", (event) => {
    const select = event.target.closest("[data-governance-select]");
    if (select) {
      navigateToDeepLink(`governance-${select.dataset.governanceSelect}`);
      return;
    }
    const vote = event.target.closest("[data-governance-vote]");
    if (!vote) return;
    const record = castGovernanceVote(selectedId, vote.dataset.governanceVote);
    if (!record) return;
    recordCampusEvent(
      "governance.vote.cast",
      { proposalId: record.proposalId, choiceId: record.choiceId, voteId: record.id },
      { id: `governance.vote.cast:${record.proposalId}`, timestamp: record.castAt },
    );
    showToast(copy[getLocale()].voted);
    render();
  });

  window.addEventListener("tu:languagechange", render);
  clockTimer = window.setInterval(render, 60_000);
  window.addEventListener("pagehide", () => window.clearInterval(clockTimer), { once: true });
  registerDeepLink("governance-", {
    open(value) {
      if (!governanceProposals.some((proposal) => proposal.id === value)) return;
      selectedId = value;
      window.localStorage.setItem(SELECTED_KEY, selectedId);
      render();
    },
    anchor: () => root.querySelector(".governance-board") || document.querySelector("#governance"),
    position: "always",
  });
  render();
}
