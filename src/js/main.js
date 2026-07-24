import { initI18n } from "./i18n.js";
import { initUI } from "./ui.js";
import { initFaculty } from "./faculty.js";
import { initServices } from "./services.js";
import { initCampusMap } from "./map.js";
import { initResearch } from "./research.js";
import { initBbs } from "./bbs.js";
import { initInfoDialog } from "./info-dialog.js";
import { initCampusInteractions } from "./campus.js";
import { initNews } from "./news.js";
import { initExam } from "./exam.js";
import { initSchools } from "./schools.js";
import { initFacultyFriction } from "./friction.js";
import { initDeepLinks } from "./deep-links.js";
import { initSearch } from "./search.js";
import { initAudiencePaths } from "./audiences.js";
import { initEienteiMap } from "./eientei-map.js";
import { initCampusChronicle } from "./chronicle.js";

initInfoDialog();
initUI();
initSchools();
initFaculty();
initFacultyFriction();
initServices();
initCampusMap();
initResearch();
initBbs();
initCampusInteractions();
initNews();
initExam();
initSearch();
initAudiencePaths();
initEienteiMap();
initCampusChronicle();
initI18n();
initDeepLinks();

const myTuSection = document.querySelector("#my-tu");
let myTuLoaded = false;
const loadMyTu = async () => {
  if (myTuLoaded) return;
  myTuLoaded = true;
  const { initMyTu } = await import("./mytu.js");
  initMyTu();
};
if (window.location.hash === "#my-tu" || window.location.hash === "#course-registration" || window.location.hash.startsWith("#course-")) loadMyTu();
window.addEventListener("hashchange", () => {
  if (window.location.hash === "#my-tu" || window.location.hash === "#course-registration" || window.location.hash.startsWith("#course-")) loadMyTu();
});
if (myTuSection && "IntersectionObserver" in window) {
  const myTuObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      loadMyTu();
    },
    { rootMargin: "900px 0px" },
  );
  myTuObserver.observe(myTuSection);
} else {
  loadMyTu();
}

const gaokaoSection = document.querySelector("#gaokao");
let gaokaoLoaded = false;
const loadGaokao = async () => {
  if (gaokaoLoaded) return;
  gaokaoLoaded = true;
  const { initGaokao } = await import("./gaokao.js");
  initGaokao();
};
if (window.location.hash === "#gaokao") loadGaokao();
if (gaokaoSection && "IntersectionObserver" in window) {
  const gaokaoObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      loadGaokao();
    },
    { rootMargin: "900px 0px" },
  );
  gaokaoObserver.observe(gaokaoSection);
} else {
  loadGaokao();
}
