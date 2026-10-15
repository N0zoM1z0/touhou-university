import { featureModules } from "./feature-registry.js";
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
    ...featureModules.map(([selector, modulePath, exportName]) => initialize(selector, modulePath, exportName)),
    document.querySelector("main [data-service]") ? ensureServices() : Promise.resolve(),
  ]);

  initDeepLinks();
  document.documentElement.dataset.tuReady = "true";
  window.dispatchEvent(new CustomEvent("tu:ready"));

  if (window.location.hash.startsWith("#service-")) ensureServices();
  if (window.location.hash === "#search") ensureSearch();
}
