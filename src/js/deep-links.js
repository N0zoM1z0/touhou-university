import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

const registrations = [];
let applyingRoute = false;
let initialized = false;
let restoreFrame = 0;
let positionToken = 0;
let skipHashPositionRoute = null;

const shareCopy = {
  "zh-Hant": ["複製此頁連結", "連結已複製，可以直接分享這一頁。"],
  ja: ["このページのリンクをコピー", "このページへのリンクをコピーしました。"],
  en: ["Copy link to this page", "Link copied. This view can now be shared directly."],
};

function locale() {
  return document.documentElement.lang || "zh-Hant";
}

function routeFromLocation() {
  return safeDecodeFragment();
}

function registrationFor(route) {
  return registrations.find(({ prefix }) => route.startsWith(prefix));
}

function targetForRoute(route, registration = registrationFor(route)) {
  const anchor = registration?.anchor;
  if (typeof anchor === "function") return anchor(route);
  if (typeof anchor === "string") return document.querySelector(anchor);
  return registration ? null : document.getElementById(route);
}

function revealTarget(target) {
  target?.classList.add("is-visible");
  target?.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

function cancelRoutePositioning() {
  positionToken += 1;
}

function anchorOffset(target) {
  const margin = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop);
  if (Number.isFinite(margin) && margin > 0) return margin;
  const header = document.querySelector("[data-header]");
  return header?.classList.contains("is-fixed") ? header.getBoundingClientRect().height + 16 : 0;
}

function alignRouteTarget(target, route, behavior = "auto") {
  if (!target?.isConnected || routeFromLocation() !== route) return;
  revealTarget(target);
  const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - anchorOffset(target));
  if (Math.abs(window.scrollY - top) < 2) return;
  if (behavior === "smooth") {
    window.scrollTo({ top, left: 0, behavior: "smooth" });
    return;
  }
  // `behavior: auto` still inherits `html { scroll-behavior: smooth }`.
  // Corrections must be instantaneous or each pass starts another animation
  // that can be overtaken by the next lazy-layout shift.
  const previous = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo({ top, left: 0 });
  document.documentElement.style.scrollBehavior = previous;
}

function stabilizeRoutePosition(route, registration, behavior = "auto") {
  if (!targetForRoute(route, registration)) return;
  const token = ++positionToken;
  const align = (nextBehavior = "auto") => {
    if (token !== positionToken) return;
    // Inline deep-link views often replace their own markup while opening or
    // translating. Resolve the target again on every bounded alignment pass
    // instead of holding a detached element from the first render.
    const target = targetForRoute(route, registration);
    if (!target) return;
    alignRouteTarget(target, route, nextBehavior);
  };

  align(behavior);
  // Direct links can gain several thousand pixels above the target while
  // lazy sections, fonts and images settle. Re-align in bounded passes so the
  // URL keeps pointing at the intended content rather than a former offset.
  [120, 360, 720, 1200, 1900].forEach((delay) => {
    window.setTimeout(() => align("auto"), delay);
  });
  document.fonts?.ready.then(() => align("auto"));
  if (document.readyState !== "complete") {
    window.addEventListener("load", () => align("auto"), { once: true });
  }
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

function applyCurrentRoute({ position = true, behavior = "auto" } = {}) {
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
  if (!position) return;
  const initiatedDeepLink =
    window.history.state?.tuDeepLink === true &&
    window.history.state?.route === route;
  if (active?.position === "always" || !initiatedDeepLink) {
    stabilizeRoutePosition(route, active, behavior);
  }
}

export function registerDeepLink(prefix, handlers) {
  registrations.push({ prefix, ...handlers });
  if (initialized && routeFromLocation().startsWith(prefix)) {
    queueMicrotask(() => applyCurrentRoute());
  }
}

export function navigateToDeepLink(route, { replace = false } = {}) {
  cancelRoutePositioning();
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
  applyCurrentRoute({ behavior: "smooth" });
}

export function closeDeepLink(prefix, fallbackHash = "#top") {
  const route = routeFromLocation();
  if (!route.startsWith(prefix)) return;
  if (window.history.state?.tuDeepLink && window.history.state?.tuOrigin && window.history.length > 1) {
    cancelRoutePositioning();
    window.history.back();
    return;
  }
  window.history.replaceState({ tuRoute: fallbackHash.slice(1) }, "", fallbackHash);
  applyCurrentRoute({ behavior: "smooth" });
}

export function initDeepLinks() {
  if (initialized) return;
  initialized = true;
  window.addEventListener("popstate", (event) => {
    const route = routeFromLocation();
    const restoringPosition = Number.isFinite(event.state?.tuScrollY);
    skipHashPositionRoute = restoringPosition ? route : null;
    cancelRoutePositioning();
    applyCurrentRoute({ position: !restoringPosition });
    if (restoringPosition && !registrationFor(route)) restorePosition(event.state);
  });
  window.addEventListener("hashchange", () => {
    const route = routeFromLocation();
    const position = skipHashPositionRoute !== route;
    skipHashPositionRoute = null;
    applyCurrentRoute({ position, behavior: "smooth" });
  });
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const route = safeDecodeFragment(link.getAttribute("href").slice(1));
    const registration = registrationFor(route);
    const target = targetForRoute(route, registration);
    if (!registration && !target) return;
    event.preventDefault();
    if (registration) {
      navigateToDeepLink(route);
    } else if (routeFromLocation() === route) {
      stabilizeRoutePosition(route, null, "smooth");
    } else {
      window.location.hash = route;
    }
  });
  ["wheel", "touchstart", "pointerdown"].forEach((type) => {
    window.addEventListener(type, cancelRoutePositioning, { passive: true });
  });
  window.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
      cancelRoutePositioning();
    }
  });
  window.addEventListener("tu:languagechange", updateShareButtons);
  applyCurrentRoute();
}
