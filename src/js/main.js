import { initDeepLinks } from "./deep-links.js";
import { initI18n } from "./i18n.js";
import { initSearch } from "./search.js";
import { redirectMisplacedRoute } from "./site-router.js";
import { initUI } from "./ui.js";

const redirected = redirectMisplacedRoute();

if (!redirected) {
  initUI();

  const initialize = async (selector, modulePath, exportName) => {
    if (!document.querySelector(selector)) return;
    const module = await import(modulePath);
    module[exportName]?.();
  };

  await initialize("[data-info-dialog]", "./info-dialog.js", "initInfoDialog");
  await initialize("[data-school]", "./schools.js", "initSchools");
  await initialize("[data-faculty]", "./faculty.js", "initFaculty");
  await initialize("[data-friction]", "./friction.js", "initFacultyFriction");
  await initialize("[data-service]", "./services.js", "initServices");
  await initialize("#map", "./map.js", "initCampusMap");
  await initialize("[data-live-campus-app]", "./live-campus.js", "initLiveCampus");
  await initialize("[data-research]", "./research.js", "initResearch");
  await initialize("#bbs", "./bbs.js", "initBbs");
  await initialize("[data-campus-feature]", "./campus.js", "initCampusInteractions");
  await initialize("[data-news-track]", "./news.js", "initNews");
  await initialize("#entrance-exam", "./exam.js", "initExam");
  await initialize("[data-audience-app]", "./audiences.js", "initAudiencePaths");
  await initialize("[data-eientei-focus]", "./eientei-map.js", "initEienteiMap");
  await initialize("[data-chronicle-open]", "./chronicle.js", "initCampusChronicle");
  await initialize("[data-library-app]", "./library.js", "initLibrary");
  await initialize("[data-housing-app]", "./housing.js", "initHousing");
  await initialize("[data-incident-app]", "./incidents.js", "initIncidents");

  if (document.querySelector("#my-tu")) {
    const { initMyTu } = await import("./mytu.js");
    initMyTu();
  }
  if (document.querySelector("#gaokao")) {
    const { initGaokao } = await import("./gaokao.js");
    initGaokao();
  }

  initSearch();
  initI18n();
  initDeepLinks();
}
