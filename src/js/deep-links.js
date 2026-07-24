import { showToast } from "./ui.js";

const registrations = [];
let applyingRoute = false;
let initialized = false;
let restoreFrame = 0;

const shareCopy = {
  "zh-Hant": ["複製此頁連結", "連結已複製，可以直接分享這一頁。"],
  ja: ["このページのリンクをコピー", "このページへのリンクをコピーしました。"],
  en: ["Copy link to this page", "Link copied. This view can now be shared directly."],
};

function locale() {
  return document.documentElement.lang || "zh-Hant";
}

function routeFromLocation() {
  return decodeURIComponent(window.location.hash.slice(1));
}

function registrationFor(route) {
  return registrations.find(({ prefix }) => route.startsWith(prefix));
}

function cleanState(state = {}) {
  const next = { ...state };
  delete next.tuDeepLink;
  delete next.tuOrigin;
  delete next.route;
  return next;
}

function rememberCurrentPosition() {
  const state = {
    ...cleanState(window.history.state || {}),
    tuRoute: routeFromLocation(),
    tuScrollX: window.scrollX,
    tuScrollY: window.scrollY,
  };
  window.history.replaceState(state, "", window.location.href);
  return {
    route: state.tuRoute,
    scrollX: state.tuScrollX,
    scrollY: state.tuScrollY,
  };
}

function restorePosition(state) {
  if (!Number.isFinite(state?.tuScrollY)) return;
  window.cancelAnimationFrame(restoreFrame);
  restoreFrame = window.requestAnimationFrame(() => {
    restoreFrame = window.requestAnimationFrame(() => {
      const previous = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(Number(state.tuScrollX) || 0, state.tuScrollY);
      document.documentElement.style.scrollBehavior = previous;
    });
  });
}

function updateShareButtons() {
  document.querySelectorAll("[data-deep-link-share]").forEach((button) => {
    button.textContent = shareCopy[locale()]?.[0] || shareCopy["zh-Hant"][0];
  });
}

async function copyCurrentUrl() {
  const value = window.location.href;
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
  showToast(shareCopy[locale()]?.[1] || shareCopy["zh-Hant"][1]);
}

function attachShareButton(dialog) {
  if (!dialog || dialog.querySelector("[data-deep-link-share]")) return;
  const button = document.createElement("button");
  button.className = "dialog-share-link";
  button.type = "button";
  button.dataset.deepLinkShare = "";
  button.addEventListener("click", copyCurrentUrl);
  dialog.append(button);
  updateShareButtons();
}

function applyCurrentRoute() {
  if (!initialized || applyingRoute) return;
  applyingRoute = true;
  const route = routeFromLocation();
  const active = registrationFor(route);
  registrations.forEach((registration) => {
    if (registration === active) {
      registration.open(route.slice(registration.prefix.length), route);
      attachShareButton(registration.dialog);
    } else if (active?.dialog && registration.dialog === active.dialog) {
      // Several route families reuse the same information dialog. A sibling
      // family must not close the dialog that the active handler just opened.
      return;
    } else {
      registration.close?.({ route });
    }
  });
  applyingRoute = false;
}

export function registerDeepLink(prefix, handlers) {
  registrations.push({ prefix, ...handlers });
}

export function navigateToDeepLink(route, { replace = false } = {}) {
  const url = new URL(window.location.href);
  url.hash = route;
  const currentRoute = routeFromLocation();
  const currentIsDeepLink = Boolean(registrationFor(currentRoute));
  const currentState = window.history.state || {};

  // A dialog opened from another dialog is one visual layer, not a fresh
  // return point. Replacing that route prevents Close from resurfacing an old
  // search/card deep link instead of the page where the first card was opened.
  if (currentIsDeepLink || replace) {
    window.history.replaceState(
      { ...currentState, tuDeepLink: true, route, tuOrigin: currentState.tuOrigin },
      "",
      url,
    );
  } else {
    const origin = rememberCurrentPosition();
    window.history.pushState({ tuDeepLink: true, route, tuOrigin: origin }, "", url);
  }
  applyCurrentRoute();
}

export function closeDeepLink(prefix, fallbackHash = "#top") {
  const route = routeFromLocation();
  if (!route.startsWith(prefix)) return;
  if (window.history.state?.tuDeepLink && window.history.state?.tuOrigin && window.history.length > 1) {
    window.history.back();
    return;
  }
  window.history.replaceState({ tuRoute: fallbackHash.slice(1) }, "", fallbackHash);
  applyCurrentRoute();
  const target = document.querySelector(fallbackHash);
  if (target) {
    window.requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
  }
}

export function initDeepLinks() {
  if (initialized) return;
  initialized = true;
  window.addEventListener("popstate", (event) => {
    applyCurrentRoute();
    if (!registrationFor(routeFromLocation())) restorePosition(event.state);
  });
  window.addEventListener("hashchange", applyCurrentRoute);
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const route = decodeURIComponent(link.getAttribute("href").slice(1));
    if (!registrationFor(route)) return;
    event.preventDefault();
    navigateToDeepLink(route);
  });
  window.addEventListener("tu:languagechange", updateShareButtons);
  applyCurrentRoute();
}
