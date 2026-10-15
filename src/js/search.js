import { values as catalogValues, trees as catalogTrees } from "../generated/i18n/ui/search.js";
import { getLocale } from "./i18n.js";
import { closeDeepLink, navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { currentPage, pageForRoute, siteHref } from "./site-router.js";
import { domainSearchEntries } from "./domain-registry.js";
import { phantasmEntranceHref } from "./phantasm-gate.js";

const dialog = document.querySelector("[data-search-dialog]");
const input = dialog?.querySelector("[data-search-input]");
const results = dialog?.querySelector("[data-search-results]");
const count = dialog?.querySelector("[data-search-count]");

const copy = catalogTrees["copy"];

const sectionEntries = [
  ["about", "section", catalogValues("sectionEntries.about.-"), catalogValues("sectionEntries.about.-.2")],
  ["chronicle", "section", catalogValues("sectionEntries.chronicle.-"), catalogValues("sectionEntries.chronicle.-.2")],
  ["academics", "section", catalogValues("sectionEntries.academics.-"), catalogValues("sectionEntries.academics.-.2")],
  ["admissions", "section", catalogValues("sectionEntries.admissions.-"), catalogValues("sectionEntries.admissions.-.2")],
  ["welcome", "orientation", catalogValues("sectionEntries.welcome.-"), catalogValues("sectionEntries.welcome.-.2")],
  ["my-tu", "section", catalogValues("sectionEntries.my-tu.My-TU-"), catalogValues("sectionEntries.my-tu.-")],
  ["data-cabinet", "section", catalogValues("sectionEntries.data-cabinet.-"), catalogValues("sectionEntries.data-cabinet.-.2")],
  ["festival-operations", "festival", catalogValues("sectionEntries.festival-operations.-"), catalogValues("sectionEntries.festival-operations.-.2")],
  ["fieldwork-stations", "fieldwork", catalogValues("sectionEntries.fieldwork-stations.-"), catalogValues("sectionEntries.fieldwork-stations.-.2")],
  ["course-registration", "course", catalogValues("sectionEntries.course-registration.-"), catalogValues("sectionEntries.course-registration.35-")],
  ["academic-work", "course", catalogValues("sectionEntries.academic-work.-"), catalogValues("sectionEntries.academic-work.-.2")],
  ["academic-exam", "course", catalogValues("sectionEntries.academic-exam.-"), catalogValues("sectionEntries.academic-exam.-.2")],
  ["academic-grades", "course", catalogValues("sectionEntries.academic-grades.-"), catalogValues("sectionEntries.academic-grades.-.2")],
  ["academic-defense", "course", catalogValues("sectionEntries.academic-defense.-"), catalogValues("sectionEntries.academic-defense.-.2")],
  ["library", "section", catalogValues("sectionEntries.library.-"), catalogValues("sectionEntries.library.-.2")],
  ["library-appraisal", "appraisal", catalogValues("sectionEntries.library-appraisal.-"), catalogValues("sectionEntries.library-appraisal.-.2")],
  ["spellcard-workshop", "workshop", catalogValues("sectionEntries.spellcard-workshop.-"), catalogValues("sectionEntries.spellcard-workshop.-.2")],
  ["spellcard-records", "workshop", catalogValues("sectionEntries.spellcard-records.-"), catalogValues("sectionEntries.spellcard-records.-.2")],
  ["clinic", "clinic", catalogValues("sectionEntries.clinic.-"), catalogValues("sectionEntries.clinic.-.2")],
  ["clinic-pharmacy", "clinic", catalogValues("sectionEntries.clinic-pharmacy.-"), catalogValues("sectionEntries.clinic-pharmacy.-.2")],
  ["clinic-recovery", "clinic", catalogValues("sectionEntries.clinic-recovery.-"), catalogValues("sectionEntries.clinic-recovery.-.2")],
  ["clinic-account", "clinic", catalogValues("sectionEntries.clinic-account.-"), catalogValues("sectionEntries.clinic-account.-.2")],
  ["housing", "housing", catalogValues("sectionEntries.housing.-"), catalogValues("sectionEntries.housing.-.2")],
  ["housing-application", "housing", catalogValues("sectionEntries.housing-application.-"), catalogValues("sectionEntries.housing-application.-.2")],
  ["housing-account", "housing", catalogValues("sectionEntries.housing-account.-"), catalogValues("sectionEntries.housing-account.-.2")],
  ["incident-center", "incident", catalogValues("sectionEntries.incident-center.-"), catalogValues("sectionEntries.incident-center.-.2")],
  ["incident-simulator", "incident", catalogValues("sectionEntries.incident-simulator.-"), catalogValues("sectionEntries.incident-simulator.-.2")],
  ["incident-records", "incident", catalogValues("sectionEntries.incident-records.-"), catalogValues("sectionEntries.incident-records.-BBS")],
  ["live-campus", "section", catalogValues("sectionEntries.live-campus.-"), catalogValues("sectionEntries.live-campus.-.2")],
  ["governance", "section", catalogValues("sectionEntries.governance.-"), catalogValues("sectionEntries.governance.-.2")],
  ["gaokao", "section", catalogValues("sectionEntries.gaokao.-"), catalogValues("sectionEntries.gaokao.-.2")],
  ["map", "map", catalogValues("sectionEntries.map.-"), catalogValues("sectionEntries.map.-.2")],
  ["map-eientei", "map", catalogValues("sectionEntries.map-eientei.-"), catalogValues("sectionEntries.map-eientei.-.2")],
  ["bbs", "section", catalogValues("sectionEntries.bbs.-BBS"), catalogValues("sectionEntries.bbs.-")],
];

const serviceEntries = [
  ["application", catalogValues("serviceEntries.application.-"), catalogValues("serviceEntries.application.-.2")],
  ["availability", catalogValues("serviceEntries.availability.-"), catalogValues("serviceEntries.availability.-.2")],
  ["visit", catalogValues("serviceEntries.visit.-"), catalogValues("serviceEntries.visit.-.2")],
  ["dining", catalogValues("serviceEntries.dining.-"), catalogValues("serviceEntries.dining.-.2")],
  ["timetable", catalogValues("serviceEntries.timetable.-"), catalogValues("serviceEntries.timetable.-.2")],
  ["exams", catalogValues("serviceEntries.exams.-"), catalogValues("serviceEntries.exams.-.2")],
];

function localeValue(values, locale) {
  return values[locale === "zh-Hant" ? 0 : locale === "ja" ? 1 : 2];
}

function flattenStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(flattenStrings);
  return [];
}

function makeEntry({ route, category, title, description, source, priority = 0 }) {
  return {
    route,
    category,
    title,
    description,
    priority,
    haystack: flattenStrings(source || [title, description]).join(" ").toLocaleLowerCase(),
  };
}

function buildIndex() {
  const locale = getLocale();
  const index = sectionEntries.map(([route, category, title, description], position) =>
    makeEntry({
      route,
      category,
      title: localeValue(title, locale),
      description: localeValue(description, locale),
      source: [title, description],
      priority: 100 - position,
    }),
  );
  serviceEntries.forEach(([id, title, description]) => {
    index.push(makeEntry({
      route: `service-${id}`,
      category: "service",
      title: localeValue(title, locale),
      description: localeValue(description, locale),
      source: [title, description],
      priority: 65,
    }));
  });
  domainSearchEntries(locale).forEach((record) => index.push(makeEntry(record)));
  return index;
}

function openResult(route) {
  if (route.startsWith("phantasm-")) {
    window.location.assign(phantasmEntranceHref("search", route));
    return;
  }
  if (pageForRoute(route) !== currentPage()) {
    window.location.assign(siteHref(route));
    return;
  }
  if (/^(?:school|faculty|research|club|bbs|campus|service)-|^map-eientei$|^chronicle(?:-|$)/.test(route)) {
    navigateToDeepLink(route);
  } else {
    const previousUrl = window.location.href;
    const nextUrl = new URL(previousUrl);
    nextUrl.hash = route;
    window.history.replaceState({ ...(window.history.state || {}), route }, "", nextUrl);
    if (dialog?.open) dialog.close();
    window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL: previousUrl, newURL: nextUrl.href }));
  }
}

function renderResults() {
  if (!results || !count || !input) return;
  const locale = getLocale();
  const c = copy[locale];
  const terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const matches = buildIndex()
    .filter((entry) => terms.every((term) => entry.haystack.includes(term)))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, terms.length ? 28 : 9);
  count.textContent = terms.length ? `${matches.length} ${c.results}` : c.popular;
  if (!matches.length) {
    results.innerHTML = `<p class="search-empty">${c.empty}</p>`;
    return;
  }
  results.innerHTML = matches
    .map(
      (entry) => `
        <a href="${entry.route.startsWith("phantasm-") ? phantasmEntranceHref("search", entry.route) : siteHref(entry.route)}" data-search-route="${entry.route}">
          <span>${c.categories[entry.category]}</span>
          <strong>${entry.title}</strong>
          <p>${entry.description}</p>
          <i aria-hidden="true">→</i>
        </a>`,
    )
    .join("");
  results.querySelectorAll("[data-search-route]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openResult(link.dataset.searchRoute);
    });
  });
}

function localize() {
  if (!dialog || !input) return;
  const c = copy[getLocale()];
  dialog.querySelector("[data-search-kicker]").textContent = c.kicker;
  dialog.querySelector("[data-search-title]").textContent = c.title;
  dialog.querySelector("[data-search-hint]").textContent = c.hint;
  input.placeholder = c.placeholder;
  input.setAttribute("aria-label", c.label);
  renderResults();
}

export function initSearch() {
  if (!dialog || !input) return;
  document.querySelectorAll("[data-search-open]").forEach((button) => {
    button.addEventListener("click", () => navigateToDeepLink("search"));
  });
  dialog.querySelector("[data-search-close]")?.addEventListener("click", () => {
    closeDeepLink("search", "#top");
  });
  dialog.addEventListener("close", () => closeDeepLink("search", "#top"));
  input.addEventListener("input", renderResults);
  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
    if ((event.key === "/" && !isTyping) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")) {
      event.preventDefault();
      navigateToDeepLink("search");
    }
  });
  registerDeepLink("search", {
    anchor: "#top",
    dialog,
    open() {
      localize();
      if (!dialog.open) dialog.showModal();
      window.setTimeout(() => input.focus(), 40);
    },
    close() {
      if (dialog.open) dialog.close();
    },
  });
  window.addEventListener("tu:languagechange", localize);
  localize();
}
