import { campusFeatures, clubs } from "../data/campus.js";
import { getLocale } from "./i18n.js";
import { closeInfoDialog, openInfoDialog } from "./info-dialog.js";

function triggerService(service) {
  closeInfoDialog();
  document.querySelector(`[data-service="${service}"]`)?.click();
}

function showFeature(id) {
  const feature = campusFeatures[id];
  if (!feature) return;
  const locale = getLocale();
  openInfoDialog({
    kicker: feature.kicker,
    title: feature.title[locale],
    summary: feature.summary[locale],
    meta: feature.details.map((value) => (typeof value === "object" ? value[locale] : value)),
    action: {
      label: feature.action[locale],
      handler: () => triggerService(feature.service),
    },
  });
}

function showClub(id) {
  const club = clubs[id];
  if (!club) return;
  const locale = getLocale();
  const copy = {
    "zh-Hant": ["研究／活動方向", "例會", "登錄社員", "本學期企劃", "到 BBS 找社員"],
    ja: ["研究・活動分野", "例会", "登録会員", "今学期の企画", "BBSで部員を探す"],
    en: ["Focus", "Meeting", "Members", "This term", "Find members on BBS"],
  }[locale];
  openInfoDialog({
    kicker: `CAMPUS CLUB · ${club.glyph}`,
    title: club.name[locale],
    summary: club.description[locale],
    meta: [copy[0], club.focus[locale], copy[1], club.meeting[locale], copy[2], club.members, copy[3], club.project[locale]],
    action: {
      label: copy[4],
      handler: () => {
        closeInfoDialog();
        document.querySelector("#bbs")?.scrollIntoView({ behavior: "smooth" });
        document.querySelector('[data-bbs-filter="club"]')?.click();
      },
    },
  });
}

export function initCampusInteractions() {
  document.querySelectorAll("[data-campus-feature]").forEach((card) => {
    card.addEventListener("click", () => showFeature(card.dataset.campusFeature));
  });
  document.querySelectorAll("[data-club]").forEach((button) => {
    button.addEventListener("click", () => showClub(button.dataset.club));
  });
}
