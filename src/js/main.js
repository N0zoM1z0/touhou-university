import { initDeepLinks } from "./deep-links.js";
import { initI18n } from "./i18n.js";
import { redirectMisplacedRoute } from "./site-router.js";
import { initUI } from "./ui.js";

const redirected = redirectMisplacedRoute();

if (!redirected) {
  initUI();
  initI18n();

  const initialize = async (selector, modulePath, exportName) => {
    if (!document.querySelector(selector)) return;
    const module = await import(modulePath);
    module[exportName]?.();
  };

  let servicesPromise;
  let servicesReady = false;
  const ensureServices = () => {
    servicesPromise ??= import("./services.js").then((module) => {
      module.initServices();
      servicesReady = true;
    });
    return servicesPromise;
  };

  let searchPromise;
  let searchReady = false;
  const ensureSearch = () => {
    searchPromise ??= import("./search.js").then((module) => {
      module.initSearch();
      searchReady = true;
    });
    return searchPromise;
  };

  // Install the loading guards before the heavier page modules settle. The
  // controls are already visible at this point, so their first click must not
  // disappear merely because a map, archive, or clinic module is still moving.
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-service]");
    if (!trigger || servicesReady) return;
    event.preventDefault();
    ensureServices().then(() => trigger.click());
  }, true);
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-search-open]");
    if (!trigger || searchReady) return;
    event.preventDefault();
    ensureSearch().then(() => trigger.click());
  }, true);
  document.addEventListener("pointerover", (event) => {
    if (event.target.closest("[data-service]")) ensureServices();
    if (event.target.closest("[data-search-open]")) ensureSearch();
  }, { passive: true, capture: true });
  document.addEventListener("focusin", (event) => {
    if (event.target.closest("[data-service]")) ensureServices();
    if (event.target.closest("[data-search-open]")) ensureSearch();
  });
  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
    if ((event.key === "/" && !typing) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")) {
      if (searchReady) return;
      event.preventDefault();
      ensureSearch().then(() => document.querySelector("[data-search-open]")?.click());
    }
  });

  await Promise.all([
    initialize("[data-info-dialog]", "./info-dialog.js", "initInfoDialog"),
    initialize("[data-school]", "./schools.js", "initSchools"),
    initialize("[data-faculty]", "./faculty.js", "initFaculty"),
    initialize("[data-friction]", "./friction.js", "initFacultyFriction"),
    initialize("#map", "./map.js", "initCampusMap"),
    initialize("[data-live-campus-app]", "./live-campus.js", "initLiveCampus"),
    initialize("[data-research]", "./research.js", "initResearch"),
    initialize("[data-spellcard-workshop]", "./spellcard-workshop.js", "initSpellcardWorkshop"),
    initialize("[data-ethics-app]", "./ethics.js", "initEthics"),
    initialize("[data-festival-app]", "./festival.js", "initFestival"),
    initialize("[data-fieldwork-app]", "./fieldwork.js", "initFieldwork"),
    initialize("[data-commons-app]", "./commons.js", "initCommons"),
    initialize("[data-academic-calendar-app]", "./academic-calendar.js", "initAcademicCalendar"),
    initialize("[data-careers-app]", "./careers.js", "initCareers"),
    initialize("#bbs", "./bbs.js", "initBbs"),
    initialize("[data-campus-feature]", "./campus.js", "initCampusInteractions"),
    initialize("[data-news-track]", "./news.js", "initNews"),
    initialize("[data-phantasm-whisper]", "./phantasm-hints.js", "initPhantasmHints"),
    initialize("[data-phantasm-app]", "./phantasm.js", "initPhantasm"),
    initialize("#entrance-exam", "./exam.js", "initExam"),
    initialize("[data-audience-app]", "./audiences.js", "initAudiencePaths"),
    initialize("[data-eientei-focus]", "./eientei-map.js", "initEienteiMap"),
    initialize("[data-chronicle-open]", "./chronicle.js", "initCampusChronicle"),
    initialize("[data-library-app]", "./library.js", "initLibrary"),
    initialize("[data-appraisal-app]", "./appraisal.js", "initAppraisal"),
    initialize("[data-clinic-app]", "./clinic.js", "initClinic"),
    initialize("[data-housing-app]", "./housing.js", "initHousing"),
    initialize("[data-incident-app]", "./incidents.js", "initIncidents"),
    initialize("[data-local-records-app]", "./local-records.js", "initLocalRecords"),
    initialize("[data-hieda-index-app]", "./hieda-index.js", "initHiedaIndex"),
    initialize("#my-tu", "./mytu.js", "initMyTu"),
    initialize("#gaokao", "./gaokao.js", "initGaokao"),
    document.querySelector("main [data-service]") ? ensureServices() : Promise.resolve(),
  ]);

  initDeepLinks();

  if (window.location.hash.startsWith("#service-")) ensureServices();
  if (window.location.hash === "#search") ensureSearch();
}
