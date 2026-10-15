import { trees as catalogTrees } from "../generated/i18n/ui/campus.js";
import { campusFeatures, clubs } from "../data/campus.js";
import { getLocale } from "./i18n.js";
import { closeInfoDialog, openInfoDialog } from "./info-dialog.js";
import { closeDeepLink, navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { navigateToSiteRoute } from "./site-router.js";

function triggerService(service) {
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
      handler: () => {
        closeInfoDialog();
        if (feature.route) navigateToSiteRoute(feature.route);
        else triggerService(feature.service);
      },
    },
  });
}

function showClub(id) {
  const club = clubs[id];
  if (!club) return;
  const locale = getLocale();
  const copy = catalogTrees["copy"][locale];
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
  const dialog = document.querySelector("[data-info-dialog]");
  document.querySelectorAll("[data-campus-feature]").forEach((card) => {
    card.addEventListener("click", () => navigateToDeepLink(`campus-${card.dataset.campusFeature}`));
  });
  document.querySelectorAll("[data-club]").forEach((button) => {
    button.addEventListener("click", () => navigateToDeepLink(`club-${button.dataset.club}`));
  });
  registerDeepLink("campus-", {
    anchor: "#campus",
    dialog,
    open(id) {
      if (campusFeatures[id]) showFeature(id);
    },
    close() {
      closeInfoDialog();
    },
  });
  registerDeepLink("club-", {
    anchor: "#campus",
    dialog,
    open(id) {
      if (clubs[id]) showClub(id);
    },
    close() {
      closeInfoDialog();
    },
  });
  dialog?.addEventListener("close", () => {
    closeDeepLink("campus-", "#campus");
    closeDeepLink("club-", "#campus");
  });
}
