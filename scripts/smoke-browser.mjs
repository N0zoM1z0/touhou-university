import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sitePort = 4187;
const debugPort = 9333;
const siteUrl = `http://127.0.0.1:${sitePort}/`;
const profile = await mkdtemp(path.join(os.tmpdir(), "tu-browser-"));
const chrome = [
  process.env.CHROME_BIN,
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean).find(existsSync);

if (!chrome) {
  console.error("Browser smoke test requires Google Chrome or Chromium.");
  process.exit(1);
}

const server = spawn("python3", ["-m", "http.server", String(sitePort), "--bind", "127.0.0.1"], {
  cwd: root,
  stdio: "ignore",
});
const browser = spawn(chrome, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--disable-extensions",
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profile}`,
  "--window-size=1440,1000",
  siteUrl,
], { stdio: "ignore" });

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function eventually(task, timeout = 10000) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeout) {
    try {
      const value = await task();
      if (value) return value;
    } catch (error) {
      lastError = error;
    }
    await delay(100);
  }
  throw lastError || new Error(`Timed out after ${timeout}ms`);
}

class Cdp {
  constructor(url) {
    this.sequence = 0;
    this.pending = new Map();
    this.listeners = new Map();
    this.socket = new WebSocket(url);
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      this.listeners.get(message.method)?.forEach((listener) => listener(message.params));
    });
  }

  call(method, params = {}) {
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) || [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }

  async evaluate(expression) {
    const response = await this.call("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (response.exceptionDetails) {
      throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
    }
    return response.result.value;
  }

  close() {
    this.socket.close();
  }
}

let cdp;
const failures = [];
const errors = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function navigate(pathname, selector = "body") {
  const expected = new URL(pathname, siteUrl);
  await cdp.call("Page.navigate", { url: expected.href });
  await eventually(() => cdp.evaluate(`document.readyState === "complete" && location.pathname === ${JSON.stringify(expected.pathname)} && Boolean(document.querySelector(${JSON.stringify(selector)}))`));
  await delay(120);
}

try {
  await eventually(async () => (await fetch(siteUrl)).ok);
  const target = await eventually(async () => {
    const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    return targets.find((item) => item.type === "page" && item.url.startsWith(siteUrl));
  });

  cdp = new Cdp(target.webSocketDebuggerUrl);
  await cdp.open();
  cdp.on("Runtime.exceptionThrown", ({ exceptionDetails }) => errors.push(exceptionDetails.exception?.description || exceptionDetails.text));
  cdp.on("Log.entryAdded", ({ entry }) => {
    if (entry.level === "error" && !entry.text.includes("favicon.ico")) errors.push(entry.text);
  });
  await Promise.all([cdp.call("Runtime.enable"), cdp.call("Log.enable"), cdp.call("Page.enable")]);
  await navigate("index.html", "body");
  await cdp.evaluate("localStorage.clear(); true");
  await navigate("index.html", "#services");

  const home = await cdp.evaluate(`({
    page: document.body.dataset.page,
    sections: [...document.querySelectorAll('main > section')].map((node) => node.id),
    serviceCount: document.querySelectorAll('#services .service-grid > *').length,
    navPages: [...new Set([...document.querySelectorAll('[data-header] a')].map((link) => link.getAttribute('href')?.split('#')[0]).filter(Boolean))].length,
    overflow: document.documentElement.scrollWidth > window.innerWidth
  })`);
  check(home.page === "home", "Home page id is incorrect.");
  check(home.sections.includes("services") && !home.sections.includes("research"), "Home page was not separated from deep content.");
  check(home.serviceCount >= 11, "Home campus services are incomplete.");
  check(home.navPages >= 7, "Global navigation does not expose the subpages.");
  check(!home.overflow, "Home page has desktop horizontal overflow.");

  const locale = await cdp.evaluate(`(() => {
    document.querySelector('[data-lang="en"]').click();
    return { lang: document.documentElement.lang, title: document.title, service: document.querySelector('#services-title')?.textContent.trim() };
  })()`);
  check(locale.lang === "en" && locale.title.includes("Touhou University"), "English locale did not apply to page chrome.");
  check(locale.service === "What do you need today?", "English home content did not translate.");

  const application = await cdp.evaluate(`(() => {
    document.querySelector('[data-lang="zh-Hant"]').click();
    document.querySelector('#services [data-service="application"]').click();
    const dialog = document.querySelector('[data-service-dialog]');
    const select = dialog.querySelector('[data-application-form] select[name="school"]');
    select.value = 'magic';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return { open: dialog.open, selected: select.value, form: Boolean(dialog.querySelector('[data-application-form]')) };
  })()`);
  check(application.open && application.selected === "magic" && application.form, "Application select closed or lost its value.");
  await cdp.evaluate("document.querySelector('[data-service-close]').click(); true");

  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-chronicle-open]'))"));
  const chronicleState = await cdp.evaluate(`(async () => {
    document.querySelector('[data-chronicle-open]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const dialog = document.querySelector('[data-chronicle-dialog]');
    const index = dialog.querySelector('.chronicle-index');
    dialog.scrollTop = 150;
    index.scrollTop = 310;
    const dialogBefore = dialog.scrollTop;
    const indexBefore = index.scrollTop;
    dialog.querySelector('[data-chronicle-record="three-language-gate"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return {
      active: dialog.querySelector('[data-chronicle-record="three-language-gate"]')?.classList.contains('active'),
      dialogBefore,
      dialogAfter: dialog.scrollTop,
      indexBefore,
      indexAfter: dialog.querySelector('.chronicle-index').scrollTop
    };
  })()`);
  check(chronicleState.active, "Chronicle selection did not update the active record.");
  check(Math.abs(chronicleState.dialogAfter - chronicleState.dialogBefore) <= 2, "Chronicle selection reset the dialog scroll position.");
  check(Math.abs(chronicleState.indexAfter - chronicleState.indexBefore) <= 2, "Chronicle selection reset the archive index scroll position.");

  await navigate("academics.html#academics", "#academics");
  const academics = await cdp.evaluate(`(() => {
    document.querySelector('[data-school="boundary"]').click();
    const dialog = document.querySelector('[data-school-dialog]');
    return {
      page: document.body.dataset.page,
      schools: document.querySelectorAll('[data-school]').length,
      faculty: document.querySelectorAll('[data-faculty]').length,
      open: dialog.open,
      courses: dialog.querySelectorAll('.school-curriculum tbody tr').length,
      activeNav: document.querySelector('[data-header] a[aria-current="page"]')?.getAttribute('href')
    };
  })()`);
  check(academics.page === "academics" && academics.schools === 7, "Academics page school catalogue is incomplete.");
  check(academics.faculty >= 8, "Academics page faculty roster is incomplete.");
  check(academics.open && academics.courses === 5, "School detail did not open its curriculum.");
  check(academics.activeNav?.startsWith("academics.html"), "Academics navigation state is missing.");

  await navigate("admissions.html#entrance-exam", "#entrance-exam");
  const admissions = await cdp.evaluate(`({
    page: document.body.dataset.page,
    banks: document.querySelectorAll('[data-exam-start]').length,
    unified: Boolean(document.querySelector('#gaokao')),
    overflow: document.documentElement.scrollWidth > window.innerWidth
  })`);
  check(admissions.page === "admissions" && admissions.banks === 4 && admissions.unified, "Admissions page examinations are incomplete.");
  check(!admissions.overflow, "Admissions page has desktop horizontal overflow.");

  await navigate("research.html#research-spellcard", "#research");
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-research-dialog]')?.open)"));
  const research = await cdp.evaluate(`({
    files: document.querySelectorAll('[data-research]').length,
    open: document.querySelector('[data-research-dialog]').open,
    title: document.querySelector('[data-research-title]').textContent.trim()
  })`);
  check(research.files === 5 && research.open && research.title.length > 10, "Research deep link did not open the requested file.");

  await navigate("campus.html#map", "#map");
  await eventually(() => cdp.evaluate("document.querySelectorAll('[name=\"route-mode\"]').length === 4"));
  const routes = await cdp.evaluate(`(() => {
    const form = document.querySelector('[data-route-form]');
    form.elements.from.value = 'gate';
    form.elements.to.value = 'kappa';
    const paths = {};
    for (const mode of ['walk', 'broom', 'tengu', 'rabbit']) {
      form.querySelector('[value="' + mode + '"]').checked = true;
      form.requestSubmit();
      paths[mode] = [...document.querySelectorAll('.route-itinerary strong')].map((node) => node.textContent.trim()).join('>');
    }
    return { modes: document.querySelectorAll('[name="route-mode"]').length, paths, bbs: Boolean(document.querySelector('#bbs')) };
  })()`);
  check(routes.modes === 4 && new Set(Object.values(routes.paths)).size === 4, "Campus transport modes do not produce distinct routes.");
  check(routes.bbs, "Campus page BBS is missing.");

  await cdp.evaluate(`(() => {
    localStorage.setItem('tu:identity', JSON.stringify({
      schema: 1, id: 'TU-S-TEST-OUTSIDE', name: '外界人類', kind: 'human', origin: 'outside',
      preferredSchool: 'boundary', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    }));
    localStorage.setItem('tu:courses:registration', JSON.stringify({ schema: 1, term: '2026-autumn', entries: [] }));
    localStorage.setItem('tu:courses:transcript', JSON.stringify([]));
    return true;
  })()`);
  await navigate("mytu.html#course-registration", "#my-tu");
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-course-filter-form]'))"));

  const eligibilityBefore = await cdp.evaluate(`(() => {
    const state = document.querySelector('[data-course-filter-form] select[name="state"]');
    state.value = 'eligible';
    state.dispatchEvent(new Event('change', { bubbles: true }));
    return [...document.querySelectorAll('[data-course-select]')].map((node) => node.dataset.courseSelect);
  })()`);
  check(eligibilityBefore.includes("FCP-104") && !eligibilityBefore.includes("FCP-160"), "Eligible-only filter ignored prerequisite state.");

  const courseLive = await cdp.evaluate(`(async () => {
    const state = document.querySelector('[data-course-filter-form] select[name="state"]');
    state.value = 'all';
    state.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const list = document.querySelector('.course-list');
    list.scrollTop = 420;
    document.querySelector('[data-course-select="FCP-104"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const beforeAddScroll = document.querySelector('.course-list').scrollTop;
    document.querySelector('[data-course-add="FCP-104"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const selectedAfterAdd = document.querySelector('.course-detail code')?.textContent.trim();
    const scrollAfterAdd = document.querySelector('.course-list').scrollTop;
    const form = document.querySelector('[data-course-filter-form]');
    form.elements.state.value = 'eligible';
    form.elements.state.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const eligible = [...document.querySelectorAll('[data-course-select]')].map((node) => node.dataset.courseSelect);
    const stored = JSON.parse(localStorage.getItem('tu:courses:registration')).entries;
    return { beforeAddScroll, scrollAfterAdd, selectedAfterAdd, eligible, stored };
  })()`);
  check(courseLive.stored.some((entry) => entry.courseCode === "FCP-104"), "Course registration was not saved.");
  check(courseLive.selectedAfterAdd === "FCP-104", "Course action jumped back to the first course.");
  check(courseLive.scrollAfterAdd >= Math.max(0, courseLive.beforeAddScroll - 2), "Course action lost the list scroll position.");
  check(courseLive.eligible.includes("FCP-160") && !courseLive.eligible.includes("FCP-104"), "Prerequisite-dependent eligible filter did not update live.");

  const overload = await cdp.evaluate(`(async () => {
    const entries = ['BIS-101','HRS-100','MTP-111','LML-102','TJM-105'].map((courseCode) => ({
      courseCode, status: 'enrolled', createdAt: new Date().toISOString()
    }));
    localStorage.setItem('tu:courses:registration', JSON.stringify({ schema: 1, term: '2026-autumn', entries }));
    location.reload();
    return true;
  })()`);
  check(overload, "Could not seed the soft-credit-limit test.");
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-course-filter-form]'))"));
  const overloadAllowed = await cdp.evaluate(`(async () => {
    document.querySelector('[data-course-select="FCP-104"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const action = document.querySelector('[data-course-add="FCP-104"]');
    const enabled = Boolean(action && !action.disabled);
    action?.click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const entries = JSON.parse(localStorage.getItem('tu:courses:registration')).entries;
    return { enabled, stored: entries.some((entry) => entry.courseCode === 'FCP-104'), copy: document.querySelector('.course-term-strip > p span')?.textContent || '' };
  })()`);
  check(overloadAllowed.enabled && overloadAllowed.stored, "The suggested credit load still blocks registration.");
  check(overloadAllowed.copy.includes("彈幕"), "Overload is not explained as a soft warning.");

  await navigate("library.html#library", "[data-library-app]");
  const libraryInitial = await cdp.evaluate(`({
    holdings: document.querySelectorAll('[data-library-select]').length,
    selected: document.querySelector('[data-library-record]')?.dataset.libraryRecord,
    state: document.querySelector('.library-state')?.textContent.trim(),
    overflow: document.documentElement.scrollWidth > window.innerWidth
  })`);
  check(libraryInitial.holdings === 19 && libraryInitial.selected === "seven-day-reverse", "Library catalogue did not render all holdings.");
  check(!libraryInitial.overflow, "Library page has desktop horizontal overflow.");

  const circulation = await cdp.evaluate(`(async () => {
    document.querySelector('[data-library-borrow="seven-day-reverse"]').click();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const first = JSON.parse(localStorage.getItem('tu:library:loans'))[0];
    const dueBefore = first.dueAt;
    document.querySelector('[data-library-renew="seven-day-reverse"]').click();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const dueAfter = JSON.parse(localStorage.getItem('tu:library:loans'))[0].dueAt;
    document.querySelector('[data-library-tab="account"]').click();
    const accountLoan = Boolean(document.querySelector('.library-account-grid [data-library-return="seven-day-reverse"]'));
    document.querySelector('[data-library-receipt]').click();
    const receiptOpen = document.querySelector('[data-library-receipt-dialog]').open;
    document.querySelector('[data-library-receipt-close]').click();
    document.querySelector('[data-library-return="seven-day-reverse"]').click();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const returned = JSON.parse(localStorage.getItem('tu:library:loans'))[0];
    return { dueBefore, dueAfter, accountLoan, receiptOpen, returned };
  })()`);
  check(circulation.dueAfter > circulation.dueBefore, "Library renewal did not extend the due date.");
  check(circulation.accountLoan && circulation.receiptOpen, "My Library or printable receipt did not render.");
  check(circulation.returned.status === "returned" && circulation.returned.returnedAt, "Library return did not preserve history.");

  const holdFlow = await cdp.evaluate(`(async () => {
    document.querySelector('[data-library-tab="catalogue"]').click();
    document.querySelector('[data-library-select="corrections-headlines"]').click();
    document.querySelector('[data-library-hold="corrections-headlines"]').click();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const placed = JSON.parse(localStorage.getItem('tu:library:holds'))[0];
    document.querySelector('[data-library-cancel-hold="corrections-headlines"]').click();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const cancelled = JSON.parse(localStorage.getItem('tu:library:holds'))[0];
    return { placed, cancelled, hash: location.hash };
  })()`);
  check(holdFlow.placed.holdingId === "corrections-headlines", "Library hold was not placed.");
  check(holdFlow.cancelled.status === "cancelled" && holdFlow.cancelled.cancelledAt, "Library hold cancellation was not retained.");
  check(holdFlow.hash === "#library-corrections-headlines", "Library holding selection did not produce a shareable deep link.");

  await navigate("library.html#library-flying-index", "[data-library-app]");
  const libraryDeepLink = await cdp.evaluate("document.querySelector('[data-library-record]')?.dataset.libraryRecord");
  check(libraryDeepLink === "flying-index", "Library holding deep link selected the wrong record.");
  const librarySearch = await cdp.evaluate(`(async () => {
    document.querySelector('[data-search-open]').click();
    const input = document.querySelector('[data-search-input]');
    input.value = 'Three Yesterdays';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-search-route="library-three-yesterdays"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return {
      selected: document.querySelector('[data-library-record]')?.dataset.libraryRecord,
      searchOpen: document.querySelector('[data-search-dialog]').open,
      hash: location.hash
    };
  })()`);
  check(librarySearch.selected === "three-yesterdays" && !librarySearch.searchOpen && librarySearch.hash === "#library-three-yesterdays", "Library search result did not open its same-page holding.");

  await navigate("mytu.html#my-tu", "#my-tu");
  const myTuLibrary = await cdp.evaluate(`({
    libraryLink: document.querySelector('.mytu-summary a[href^="library.html"]')?.textContent || '',
    libraryEvents: [...document.querySelectorAll('.mytu-ledger strong')].filter((node) => node.textContent.includes('館藏')).length
  })`);
  check(mytuLibraryLinkOkay(myTuLibrary.libraryLink), "My TU does not link to the library record.");
  check(myTuLibrary.libraryEvents >= 3, "Library actions are missing from the My TU campus ledger.");

  await cdp.call("Page.navigate", { url: `${siteUrl}index.html#research-spellcard` });
  await eventually(() => cdp.evaluate("location.pathname.endsWith('/research.html') && Boolean(document.querySelector('[data-research-dialog]')?.open)"));
  check(await cdp.evaluate("location.hash === '#research-spellcard'"), "Legacy one-page research deep link was not redirected.");

  for (const page of ["index.html", "academics.html", "admissions.html", "research.html", "campus.html", "mytu.html", "library.html"]) {
    const response = await fetch(new URL(page, siteUrl));
    check(response.ok && (await response.text()).includes(`data-page=`), `${page} was not built as a complete page.`);
  }

  await cdp.call("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  for (const page of ["index.html", "academics.html", "admissions.html", "research.html", "campus.html", "mytu.html", "library.html"]) {
    await navigate(page, "main");
    const mobile = await cdp.evaluate(`({
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      mainWidth: document.querySelector('main').getBoundingClientRect().width,
      viewport: window.innerWidth
    })`);
    check(!mobile.overflow && mobile.mainWidth <= mobile.viewport + 1, `${page} has narrow-mobile horizontal overflow.`);
  }
  const mobileMenu = await cdp.evaluate(`(() => {
    document.querySelector('[data-menu-toggle]').click();
    return {
      expanded: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded'),
      visible: !document.querySelector('[data-mobile-menu]').hidden,
      links: document.querySelectorAll('[data-mobile-menu] nav a').length
    };
  })()`);
  check(mobileMenu.expanded === "true" && mobileMenu.visible && mobileMenu.links === 9, "Mobile multipage navigation did not open completely.");

  if (errors.length) failures.push(`Browser console errors:\n${[...new Set(errors)].join("\n")}`);
  if (failures.length) {
    console.error(`Browser smoke test failed:\n- ${failures.join("\n- ")}`);
    process.exitCode = 1;
  } else {
    console.log("Browser smoke test passed: multipage routing, services, courses, library circulation, deep links, and responsive width.");
  }
} finally {
  cdp?.close();
  browser.kill("SIGTERM");
  server.kill("SIGTERM");
  await Promise.all([
    browser.exitCode === null ? new Promise((resolve) => browser.once("exit", resolve)) : Promise.resolve(),
    server.exitCode === null ? new Promise((resolve) => server.once("exit", resolve)) : Promise.resolve(),
  ]);
  await rm(profile, { recursive: true, force: true, maxRetries: 4, retryDelay: 80 });
}

function mytuLibraryLinkOkay(value) {
  return /借閱|預約|貸出|Loan|hold/i.test(value);
}
