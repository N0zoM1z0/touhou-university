import { governanceProposals } from "../data/governance.js";
import { liveCampusSnapshot } from "../data/live-campus.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { castGovernanceVote, governanceTally } from "./governance-model.js";
import { getLocale } from "./i18n.js";
import { renderPreservingState } from "./render-state.js";
import { showToast } from "./ui.js";

const SELECTED_KEY = "tu:governance:selected";

const copy = {
  "zh-Hant": {
    eyebrow: "LIVE CAMPUS / 校務運行盤",
    title: "今天的校園，不沿用昨天的假設。",
    lead: "時間、月相與當值事件共同改動菜單、課表、空房、飛行限制與路線。狀態每三小時換班；投票則只保存在這台裝置，並進入 My TU 事件帳本。",
    deviceTime: "本機時間",
    academicDay: "輪值教學日",
    phase: "月相格",
    weather: "現場氣象",
    notices: "當值通報",
    rules: "已生效限制",
    services: "查閱此刻服務",
    dining: "今日食堂",
    timetable: "今日排課",
    rooms: "空閒館舍",
    map: "帶限制規劃路線",
    clinic: "校醫院候診",
    senate: "CAMPUS SENATE / 議事鐘",
    governanceTitle: "規章在執行，角色仍然可以不服。",
    governanceLead: "每天的底票由各學院、館舍、社團與會飛的利益關係人構成。你可在這台裝置投一票或改票；票數不會假裝全校突然達成共識。",
    sponsor: "提案席",
    total: "公開計數",
    votes: "票",
    leading: "目前領先",
    yourVote: "你的本機票",
    vote: "投這一案",
    voted: "已投；BBS 已經有人斷章取義。",
    consequence: "若通過",
    updated: "本盤每分鐘更新；規則於三小時鐘點換班。",
  },
  ja: {
    eyebrow: "LIVE CAMPUS / 学務運行盤",
    title: "今日のキャンパスは、昨日の仮定を引き継がない。",
    lead: "時刻・月相・当番事案が献立、時間割、空室、飛行規制、経路を共同変更。状態は三時間交代、投票はこの端末だけに保存され My TU 台帳へ入ります。",
    deviceTime: "端末時刻",
    academicDay: "輪番授業日",
    phase: "月相区分",
    weather: "現場気象",
    notices: "当番通報",
    rules: "発効中の規制",
    services: "現在のサービス",
    dining: "本日の食堂",
    timetable: "本日の時間割",
    rooms: "空室検索",
    map: "規制込み経路",
    clinic: "校医院待合",
    senate: "CAMPUS SENATE / 議事鐘",
    governanceTitle: "規則は動く。登場人物はまだ不服を言える。",
    governanceLead: "底票は学部、施設、団体、飛行する利害関係者から構成。この端末で一票を投じ、変更できます。票数は全学合意を装いません。",
    sponsor: "提案席",
    total: "公開集計",
    votes: "票",
    leading: "現在首位",
    yourVote: "端末内の票",
    vote: "この案へ投票",
    voted: "投票済み。BBS はすでに文脈を省略しました。",
    consequence: "可決時",
    updated: "毎分更新。規制は三時間鐘で交代します。",
  },
  en: {
    eyebrow: "LIVE CAMPUS / OPERATIONS BOARD",
    title: "Today’s campus does not inherit yesterday’s assumptions.",
    lead: "Time, moon phase, and duty incidents jointly change menus, classes, free rooms, flight restrictions, and routes. Conditions rotate every three hours; votes stay on this device and enter the My TU ledger.",
    deviceTime: "Device time",
    academicDay: "Rotating teaching day",
    phase: "Lunar segment",
    weather: "Field weather",
    notices: "Duty notices",
    rules: "Rules in force",
    services: "Services right now",
    dining: "Today’s dining",
    timetable: "Today’s classes",
    rooms: "Find a free room",
    map: "Route with restrictions",
    clinic: "Hospital queue",
    senate: "CAMPUS SENATE / GOVERNANCE BELL",
    governanceTitle: "Rules can operate while characters still object.",
    governanceLead: "Baseline votes come from schools, facilities, clubs, and airborne stakeholders. Cast or change one on this device; the count does not pretend the campus suddenly agrees.",
    sponsor: "Sponsor",
    total: "Public count",
    votes: "votes",
    leading: "Currently leading",
    yourVote: "Your on-device vote",
    vote: "Vote for this",
    voted: "Vote recorded. The BBS has already removed context.",
    consequence: "If adopted",
    updated: "Updates every minute; restrictions rotate on the three-hour bell.",
  },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function phaseName(phase, locale) {
  return {
    "zh-Hant": ["朔月", "眉月", "上弦", "盈凸", "滿月", "虧凸", "下弦", "殘月"],
    ja: ["新月", "三日月", "上弦", "十三夜", "満月", "寝待月", "下弦", "有明月"],
    en: ["New", "Waxing crescent", "First quarter", "Waxing gibbous", "Full", "Waning gibbous", "Last quarter", "Waning crescent"],
  }[locale][phase];
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
