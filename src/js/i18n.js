import { text as catalogText } from "../generated/i18n/ui/i18n.js";
import { messages } from "../data/i18n.js";
import { renderKeyedCopy } from "./i18n-dom.js";
import { supportedLocales, defaultLocale, formatCatalogMessage } from "./locale-catalog.js";

const savedLocale = window.localStorage.getItem("tu:locale");
let locale = supportedLocales.includes(savedLocale) ? savedLocale : defaultLocale;
export function getLocale() {
  return locale;
}

export function t(key, variables = {}) {
  return formatCatalogMessage(messages[locale]?.[key] || messages[defaultLocale]?.[key] || key, variables);
}

export function applyI18n(root = document.body) {
  renderKeyedCopy(root, messages[locale]);
}

export function setLocale(nextLocale, { persist = true } = {}) {
  if (!supportedLocales.includes(nextLocale)) return;
  locale = nextLocale;
  document.documentElement.lang = locale;
  const pageTitleKey = document.body?.dataset.pageTitleKey || {
    academics: "pageAcademicsTitle",
    admissions: "pageAdmissionsTitle",
    research: "pageResearchTitle",
    campus: "pageCampusTitle",
    mytu: "pageMyTuTitle",
    library: "pageLibraryTitle",
    clinic: "pageClinicTitle",
    housing: "pageHousingTitle",
    incidents: "pageIncidentsTitle",
  }[document.body?.dataset.page];
  const university =
    catalogText("university")[locale];
  document.title = pageTitleKey && pageTitleKey !== "pageHomeTitle"
    ? `${messages[locale][pageTitleKey]}${locale === "en" ? " | " : "｜"}${university}`
    : catalogText("setLocale")[locale];
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
  if (persist) window.localStorage.setItem("tu:locale", locale);
  applyI18n(document.head);
  applyI18n();
  document.querySelectorAll("[data-lang]").forEach((button) => {
    const active = button.dataset.lang === locale;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  window.dispatchEvent(new CustomEvent("tu:languagechange", { detail: { locale } }));
}

export function initI18n() {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => setLocale(button.dataset.lang));
  });
  setLocale(locale, { persist: false });
}
