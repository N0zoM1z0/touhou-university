const pageFiles = {
  home: "index.html",
  academics: "academics.html",
  admissions: "admissions.html",
  research: "research.html",
  campus: "campus.html",
  mytu: "mytu.html",
  library: "library.html",
};

export function currentPage() {
  return document.body?.dataset.page || "home";
}

export function pageForRoute(route = "") {
  if (/^(?:academics|faculty(?:-|$)|school-)/.test(route)) return "academics";
  if (/^(?:admissions|entrance-exam|gaokao)$/.test(route)) return "admissions";
  if (/^research(?:-|$)/.test(route)) return "research";
  if (/^(?:map(?:-|$)|campus(?:-|$)|bbs(?:-|$)|club-)/.test(route)) return "campus";
  if (/^(?:my-tu|course-registration|course-)/.test(route)) return "mytu";
  if (/^library(?:-|$)/.test(route)) return "library";
  return "home";
}

export function siteHref(route = "top") {
  const page = pageForRoute(route);
  return `${pageFiles[page]}#${encodeURIComponent(route)}`;
}

export function navigateToSiteRoute(route, { replace = false } = {}) {
  const targetPage = pageForRoute(route);
  if (targetPage === currentPage()) {
    window.location.hash = route;
    return false;
  }
  const target = siteHref(route);
  if (replace) window.location.replace(target);
  else window.location.assign(target);
  return true;
}

export function redirectMisplacedRoute() {
  const route = decodeURIComponent(window.location.hash.slice(1));
  if (!route) return false;
  const targetPage = pageForRoute(route);
  if (targetPage === currentPage()) return false;
  window.location.replace(siteHref(route));
  return true;
}
