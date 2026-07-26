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
  check(home.serviceCount >= 12, "Home campus services are incomplete.");
  check(home.navPages >= 8, "Global navigation does not expose the subpages.");
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
    dialog.querySelector('[data-chronicle-record="seven-doors-and-misty-desk"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const sourceEntries = [...dialog.querySelectorAll('.chronicle-source-entry')];
    return {
      active: dialog.querySelector('[data-chronicle-record="seven-doors-and-misty-desk"]')?.classList.contains('active'),
      dialogBefore,
      dialogAfter: dialog.scrollTop,
      indexBefore,
      indexAfter: dialog.querySelector('.chronicle-index').scrollTop,
      sourceCount: sourceEntries.length,
      sourceText: sourceEntries.map((entry) => entry.textContent),
      sourceHrefs: sourceEntries.map((entry) => entry.querySelector('a')?.href || '')
    };
  })()`);
  check(chronicleState.active, "Chronicle selection did not update the active record.");
  check(Math.abs(chronicleState.dialogAfter - chronicleState.dialogBefore) <= 2, "Chronicle selection reset the dialog scroll position.");
  check(Math.abs(chronicleState.indexAfter - chronicleState.indexBefore) <= 2, "Chronicle selection reset the archive index scroll position.");
  check(
    chronicleState.sourceCount === 2
      && chronicleState.sourceText[0].includes("Merge pull request #13")
      && chronicleState.sourceText[1].includes("Split campus into pages")
      && chronicleState.sourceHrefs[0].includes("3af2a5c")
      && chronicleState.sourceHrefs[1].includes("3a5dea1"),
    "Chronicle did not distinguish the main merge commit from its functional head commit.",
  );

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
  const admissionsApplication = await cdp.evaluate(`(async () => {
    document.querySelector('[data-prospectus]').click();
    const guide = document.querySelector('[data-prospectus-dialog]');
    const guideOpen = guide.open;
    guide.querySelector('[data-service="application"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const service = document.querySelector('[data-service-dialog]');
    const form = service.querySelector('[data-application-form]');
    form.elements.name.value = '外界人類測試生';
    form.elements.contact.value = 'outside@example.test';
    form.elements.origin.value = '新加坡外界觀測點';
    form.elements.identity.value = '人類';
    form.elements.school.value = 'magic';
    form.elements.question.value = '昨天的版本為什麼比今天多一頁？';
    form.elements.method.value = '比對時間、版次與被雨淋皺的校報。';
    form.elements.needs.value = '不會飛，請保留步行路線。';
    form.elements.name.dispatchEvent(new InputEvent('input', { bubbles: true, data: '生', inputType: 'insertText' }));
    await new Promise((resolve) => setTimeout(resolve, 300));
    const draft = JSON.parse(localStorage.getItem('tu:application:draft'));
    service.querySelector('[data-service-close]').click();
    await new Promise((resolve) => setTimeout(resolve, 120));
    document.querySelector('#admissions [data-service="application"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const reopened = document.querySelector('[data-application-form]');
    const result = {
      guideOpen,
      guideClosed: !guide.open,
      serviceOpen: service.open,
      draft,
      restoredName: reopened.elements.name.value,
      restoredSchool: reopened.elements.school.value,
      hash: location.hash
    };
    service.querySelector('[data-service-close]').click();
    return result;
  })()`);
  check(
    admissionsApplication.guideOpen
      && admissionsApplication.guideClosed
      && admissionsApplication.serviceOpen
      && admissionsApplication.draft.name === "外界人類測試生"
      && admissionsApplication.restoredName === "外界人類測試生"
      && admissionsApplication.restoredSchool === "magic"
      && admissionsApplication.hash === "#service-application",
    "Admissions guide/direct application buttons did not open a persistent Chinese-capable form.",
  );

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
  const nearbyFacilities = await cdp.evaluate(`(async () => {
    document.querySelector('#map [data-service="availability"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const dialog = document.querySelector('[data-service-dialog]');
    const opened = {
      open: dialog.open,
      rooms: dialog.querySelectorAll('.room-card').length,
      hash: location.hash
    };
    dialog.querySelector('[data-service-close]').click();
    await new Promise((resolve) => setTimeout(resolve, 120));
    return { ...opened, closed: !dialog.open, returnHash: location.hash };
  })()`);
  check(
    nearbyFacilities.open
      && nearbyFacilities.rooms > 0
      && nearbyFacilities.hash === "#service-availability"
      && nearbyFacilities.closed
      && nearbyFacilities.returnHash === "#map",
    "Map nearby-facility action did not open, render, or return to the map.",
  );
  const routes = await cdp.evaluate(`(() => {
    const form = document.querySelector('[data-route-form]');
    form.elements.from.value = 'gate';
    form.elements.to.value = 'kappa';
    const paths = {};
    const segmentKinds = {};
    const closed = [];
    for (const mode of ['walk', 'broom', 'tengu', 'rabbit']) {
      const input = form.querySelector('[value="' + mode + '"]');
      if (input.disabled) {
        closed.push(mode);
        continue;
      }
      form.elements.from.value = mode === 'rabbit' ? 'boundary' : 'gate';
      form.elements.to.value = mode === 'rabbit' ? 'clinic' : 'kappa';
      input.checked = true;
      form.requestSubmit();
      paths[mode] = [...document.querySelectorAll('.route-itinerary strong')].map((node) => node.textContent.trim()).join('>');
      segmentKinds[mode] = [...document.querySelectorAll('.route-segment-badge[data-route-kind]')].map((node) => node.dataset.routeKind);
    }
    return {
      modes: document.querySelectorAll('[name="route-mode"]').length,
      paths,
      segmentKinds,
      closed,
      live: document.querySelector('[data-route-live]')?.textContent.trim(),
      bbs: Boolean(document.querySelector('#bbs'))
    };
  })()`);
  const activeNonWalkModes = Object.keys(routes.paths).filter((mode) => mode !== "walk");
  check(
    routes.modes === 4
      && routes.live.length > 10
      && activeNonWalkModes.every((mode) => routes.segmentKinds[mode]?.includes(mode))
      && routes.paths.walk !== routes.paths.broom
      && routes.paths.walk !== routes.paths.tengu,
    `Active campus transport modes do not produce their own live-rule-aware routes: ${JSON.stringify(routes)}`,
  );
  check(routes.bbs, "Campus page BBS is missing.");
  const campusActions = await cdp.evaluate(`(async () => {
    document.querySelector('[data-campus-feature="library"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const info = document.querySelector('[data-info-dialog]');
    const featureOpened = info.open && !info.querySelector('[data-info-action]').hidden;
    info.querySelector('[data-info-action]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const service = document.querySelector('[data-service-dialog]');
    const featureContinued = service.open && service.querySelectorAll('.room-card').length > 0;
    service.querySelector('[data-service-close]').click();
    await new Promise((resolve) => setTimeout(resolve, 120));

    document.querySelector('[data-club="grimoire"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const clubOpened = info.open && info.querySelector('[data-info-title]').textContent.includes('魔導書');
    info.querySelector('[data-info-action]').click();
    await new Promise((resolve) => setTimeout(resolve, 120));
    const clubContinued = document.querySelector('[data-bbs-filter="club"]').classList.contains('active');

    document.querySelector('[data-governance-select]').click();
    const vote = document.querySelector('[data-governance-vote]');
    vote.click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const storedVotes = JSON.parse(localStorage.getItem('tu:governance:votes') || '[]');
    const governancePost = Boolean(document.querySelector('.governance-post'));

    document.querySelector('.live-campus-services [data-service="dining"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const liveDining = service.open && service.querySelectorAll('.campus-table tbody tr').length === 6;
    service.querySelector('[data-service-close]').click();
    return { featureOpened, featureContinued, clubOpened, clubContinued, votes: storedVotes.length, governancePost, liveDining };
  })()`);
  check(
    campusActions.featureOpened
      && campusActions.featureContinued
      && campusActions.clubOpened
      && campusActions.clubContinued
      && campusActions.votes === 1
      && campusActions.governancePost
      && campusActions.liveDining,
    "Campus cards, Continue actions, clubs, governance, or live service buttons contain an inactive action.",
  );

  await cdp.evaluate(`(() => {
    localStorage.setItem('tu:identity', JSON.stringify({
      schema: 1, id: 'TU-S-TEST-OUTSIDE', name: '外界人類', kind: 'human', origin: 'outside',
      preferredSchool: 'boundary', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    }));
    localStorage.setItem('tu:courses:registration', JSON.stringify({ schema: 1, term: '2026-autumn', entries: [] }));
    localStorage.setItem('tu:courses:transcript', JSON.stringify([]));
    localStorage.setItem('tu:application:submissions', JSON.stringify([{
      id: 'TU-A-GENERAL-01',
      submittedAt: new Date().toISOString(),
      name: '外界人類',
      school: 'magic',
      question: '昨天多出的一頁，究竟是時間倒流還是校報編輯忘了翻面？',
      method: '封存三批校報、逐頁比對墨跡與版次，並請兩位不知道假說的讀者獨立排序。',
      needs: '不會飛；需要步行可達的觀察席與一盞不會自行更換日期的燈。'
    }]));
    return true;
  })()`);
  await navigate("mytu.html#my-tu", "[data-mytu-app]");
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-mytu-review]'))"));
  const facultyReview = await cdp.evaluate(`(async () => {
    document.querySelector('[data-mytu-review]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const excerpts = [...document.querySelectorAll('.mytu-reviewers blockquote q')].map((node) => node.textContent.trim());
    const commentary = [...document.querySelectorAll('.mytu-reviewers article > p')].map((node) => node.textContent.trim());
    document.querySelector('[data-mytu-document-open]').click();
    window.__tuPrintCount = 0;
    window.print = () => { window.__tuPrintCount += 1; };
    document.querySelector('[data-mytu-print]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const printRoot = document.querySelector('[data-tu-print-root]');
    const result = {
      excerpts,
      commentary,
      remarks: JSON.parse(localStorage.getItem('tu:application:reviews'))[0].remarks,
      printCount: window.__tuPrintCount,
      printText: printRoot?.textContent.trim().length || 0
    };
    window.dispatchEvent(new Event('afterprint'));
    document.querySelector('[data-mytu-document-close]').click();
    return result;
  })()`);
  check(
    facultyReview.excerpts.length === 3
      && new Set(facultyReview.excerpts).size === 3
      && new Set(facultyReview.commentary).size === 3
      && facultyReview.remarks.length === 3,
    "Joint faculty review did not read the application's distinct question, method, and field needs.",
  );
  check(facultyReview.printCount === 1 && facultyReview.printText > 180, "My TU decision did not render into the shared print document.");
  await navigate("mytu.html#course-registration", "#my-tu");
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-course-filter-form]'))"));

  const courseIme = await cdp.evaluate(`(async () => {
    const input = document.querySelector('[data-course-filter-form] input[name="query"]');
    input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, data: '' }));
    input.value = '信仰';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '信仰', inputType: 'insertCompositionText', isComposing: true }));
    const during = {
      value: document.querySelector('[data-course-filter-form] input[name="query"]').value,
      count: document.querySelectorAll('[data-course-select]').length
    };
    input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '信仰' }));
    await new Promise((resolve) => setTimeout(resolve, 180));
    return {
      during,
      value: document.querySelector('[data-course-filter-form] input[name="query"]').value,
      count: document.querySelectorAll('[data-course-select]').length
    };
  })()`);
  check(courseIme.during.value === "信仰" && courseIme.during.count === 35, "Course search rerendered during Chinese IME composition.");
  check(courseIme.value === "信仰" && courseIme.count > 0 && courseIme.count < 35, "Course search did not apply committed Chinese IME text.");
  await cdp.evaluate(`(() => {
    const input = document.querySelector('[data-course-filter-form] input[name="query"]');
    input.value = '';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '', inputType: 'deleteContentBackward' }));
    return true;
  })()`);
  await eventually(() => cdp.evaluate("document.querySelectorAll('[data-course-select]').length === 35"));

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
  const coursePrint = await cdp.evaluate(`(async () => {
    document.querySelector('[data-course-tab="record"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    document.querySelector('[data-course-document="transcript"]').click();
    window.__tuPrintCount = 0;
    window.print = () => { window.__tuPrintCount += 1; };
    document.querySelector('[data-course-document-print]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const result = {
      printCount: window.__tuPrintCount,
      printText: document.querySelector('[data-tu-print-root]')?.textContent.trim().length || 0
    };
    window.dispatchEvent(new Event('afterprint'));
    document.querySelector('[data-course-document-close]').click();
    return result;
  })()`);
  check(coursePrint.printCount === 1 && coursePrint.printText > 180, "Course record did not render into the shared print document.");

  await navigate("mytu.html#academic-work", "[data-mytu-app]");
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-assignment-form]'))"));
  const academicAssignment = await cdp.evaluate(`(async () => {
    const form = document.querySelector('[data-assignment-form="his-yesterday-editions"]');
    form.querySelector('[name="sequence"][value="sequence"]').checked = true;
    form.querySelector('[name="citation"][value="provenance"]').checked = true;
    form.elements.memo.value = '目前只確認版本時間順序，因果關係仍待更多來源核對。';
    form.elements.memo.dispatchEvent(new InputEvent('input', { bubbles: true, data: '。', inputType: 'insertText' }));
    await new Promise((resolve) => setTimeout(resolve, 320));
    const draftBefore = JSON.parse(localStorage.getItem('tu:academics:drafts'));
    form.requestSubmit();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const submissions = JSON.parse(localStorage.getItem('tu:academics:submissions'));
    return {
      draftBefore,
      submissions,
      score: document.querySelector('.academic-grading-slip h3')?.textContent.trim(),
      results: document.querySelectorAll('.academic-grading-slip li').length,
      hash: location.hash
    };
  })()`);
  check(academicAssignment.draftBefore["his-yesterday-editions"], "Course assignment answers did not autosave.");
  check(
    academicAssignment.submissions.at(-1).percent === 100
      && academicAssignment.score.includes("100/100")
      && academicAssignment.results === 3
      && academicAssignment.hash === "#academic-work",
    "Course assignment did not preserve answers, grade immediately, and show per-question feedback.",
  );

  await cdp.evaluate("location.hash = 'academic-exam'; true");
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-academic-exam-start]'))"));
  const academicExam = await cdp.evaluate(`(async () => {
    document.querySelector('[data-academic-exam-start]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const form = document.querySelector('[data-academic-exam-form]');
    const answers = { m1: 'chance', m2: 'network', m3: '72', m4: 'contested', m5: 'positions', m6: 'nice' };
    for (const [name, value] of Object.entries(answers)) {
      const field = form.querySelector('[name="' + name + '"][value="' + value + '"]') || form.elements[name];
      if (field.type === 'radio') field.checked = true;
      else field.value = value;
    }
    form.elements.m3.dispatchEvent(new InputEvent('input', { bubbles: true, data: '72', inputType: 'insertText' }));
    await new Promise((resolve) => setTimeout(resolve, 260));
    const active = JSON.parse(localStorage.getItem('tu:academics:exam-session'));
    form.requestSubmit();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const attempts = JSON.parse(localStorage.getItem('tu:academics:exam-attempts'));
    return {
      active,
      attempt: attempts.at(-1),
      timerGone: !document.querySelector('[data-academic-timer]'),
      slip: document.querySelector('.academic-grading-slip h3')?.textContent.trim()
    };
  })()`);
  check(academicExam.active.answers.m3 === "72", "Timed course exam answers did not autosave.");
  check(
    academicExam.attempt.percent === 100 && academicExam.timerGone && academicExam.slip.includes("100/100"),
    "Timed course exam did not grade or retain its answer slip.",
  );

  await cdp.evaluate("location.hash = 'academic-defense'; true");
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-academic-project-form]'))"));
  const academicDefence = await cdp.evaluate(`(async () => {
    const project = document.querySelector('[data-academic-project-form]');
    project.elements.type.value = 'spellcard';
    project.elements.title.value = '月相改變時的低密度符卡退路窗口';
    project.elements.abstract.value = '本計畫比較八個月相格下，宣言長度、預兆時間與退路寬度如何共同改變新生完成符卡的比例。';
    project.elements.claim.value = '退路窗口在指定月相與場地範圍內存在可重現的最低寬度。';
    project.elements.method.value = '保存彈幕版本、月相、場地、參與者批次與每次停止原因，並以固定程序重複三輪。';
    project.elements.stopRule.value = '出現預先定義的受傷、失控或不可逆結界偏移時立即停止。';
    project.requestSubmit();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const form = document.querySelector('[data-academic-defence-form]');
    form.querySelector('[name="claim"][value="scope"]').checked = true;
    form.querySelector('[name="method"][value="record"]').checked = true;
    form.querySelector('[name="stop"][value="precommit"]').checked = true;
    form.requestSubmit();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const projects = JSON.parse(localStorage.getItem('tu:academics:projects'));
    const defences = JSON.parse(localStorage.getItem('tu:academics:defences'));
    return {
      project: projects.at(-1),
      defence: defences.at(-1),
      result: document.querySelector('.academic-defence-result h3')?.textContent.trim()
    };
  })()`);
  check(
    academicDefence.project.type === "spellcard"
      && academicDefence.defence.percent === 100
      && academicDefence.defence.outcome === "passed"
      && academicDefence.result === "通過",
    "Spell-card project and three-question defence did not persist a ruling.",
  );

  await cdp.evaluate("location.hash = 'academic-grades'; true");
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-academic-print]'))"));
  const academicTranscript = await cdp.evaluate(`(async () => {
    const rows = document.querySelectorAll('.academic-grade-table tbody tr').length;
    const graded = [...document.querySelectorAll('.academic-grade-table tbody tr')].filter((row) => /100%/.test(row.textContent)).length;
    document.querySelector('[data-academic-print]').click();
    const dialog = document.querySelector('[data-academic-document-dialog]');
    window.__tuPrintCount = 0;
    window.print = () => { window.__tuPrintCount += 1; };
    dialog.querySelector('[data-academic-document-print]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const printRoot = document.querySelector('[data-tu-print-root]');
    const result = {
      rows,
      graded,
      average: document.querySelector('.academic-overall strong')?.textContent.trim(),
      dialogOpen: dialog.open,
      documentRows: dialog.querySelectorAll('tbody tr').length,
      printCount: window.__tuPrintCount,
      printText: printRoot?.textContent.trim().length || 0
    };
    window.dispatchEvent(new Event('afterprint'));
    dialog.querySelector('[data-academic-document-close]').click();
    return result;
  })()`);
  check(
    academicTranscript.rows === 6
      && academicTranscript.graded === 3
      && academicTranscript.average.includes("100")
      && academicTranscript.dialogOpen
      && academicTranscript.documentRows === 6
      && academicTranscript.printCount === 1
      && academicTranscript.printText > 180,
    "Academic transcript did not combine assignments, exam, defence, and printable records.",
  );
  await navigate("campus.html#bbs", "#bbs");
  const academicBbs = await cdp.evaluate(`(async () => {
    const posts = document.querySelectorAll('.academic-post');
    posts[0]?.querySelector('.bbs-row-trigger').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const info = document.querySelector('[data-info-dialog]');
    return {
      posts: posts.length,
      dialogOpen: info.open,
      action: info.querySelector('[data-info-action-label]')?.textContent.trim()
    };
  })()`);
  check(
    academicBbs.posts === 2 && academicBbs.dialogOpen && academicBbs.action.includes("答辯"),
    "Academic defence did not generate two linked, reopenable BBS reactions.",
  );

  await navigate("library.html#library", "[data-library-app]");
  const libraryInitial = await cdp.evaluate(`({
    holdings: document.querySelectorAll('[data-library-select]').length,
    selected: document.querySelector('[data-library-record]')?.dataset.libraryRecord,
    state: document.querySelector('.library-state')?.textContent.trim(),
    overflow: document.documentElement.scrollWidth > window.innerWidth
  })`);
  check(libraryInitial.holdings === 19 && libraryInitial.selected === "seven-day-reverse", "Library catalogue did not render all holdings.");
  check(!libraryInitial.overflow, "Library page has desktop horizontal overflow.");

  const libraryIme = await cdp.evaluate(`(async () => {
    const input = document.querySelector('[data-library-filters] input[name="query"]');
    input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, data: '' }));
    input.value = '滿月';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '滿月', inputType: 'insertCompositionText', isComposing: true }));
    const during = {
      value: document.querySelector('[data-library-filters] input[name="query"]').value,
      count: document.querySelectorAll('[data-library-select]').length
    };
    input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '滿月' }));
    await new Promise((resolve) => setTimeout(resolve, 180));
    return {
      during,
      value: document.querySelector('[data-library-filters] input[name="query"]').value,
      count: document.querySelectorAll('[data-library-select]').length
    };
  })()`);
  check(libraryIme.during.value === "滿月" && libraryIme.during.count === 19, "Library search rerendered during Chinese IME composition.");
  check(libraryIme.value === "滿月" && libraryIme.count > 0 && libraryIme.count < 19, "Library search did not apply committed Chinese IME text.");
  await cdp.evaluate(`(() => {
    const input = document.querySelector('[data-library-filters] input[name="query"]');
    input.value = '';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '', inputType: 'deleteContentBackward' }));
    return true;
  })()`);
  await eventually(() => cdp.evaluate("document.querySelectorAll('[data-library-select]').length === 19"));

  const circulation = await cdp.evaluate(`(async () => {
    document.querySelector('[data-library-select="seven-day-reverse"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
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
    const receiptDialog = document.querySelector('[data-library-receipt-dialog]');
    const receiptOpen = receiptDialog.open;
    window.__tuPrintCount = 0;
    window.print = () => { window.__tuPrintCount += 1; };
    receiptDialog.querySelector('[data-library-receipt-print]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const printText = document.querySelector('[data-tu-print-root]')?.textContent.trim().length || 0;
    const printCount = window.__tuPrintCount;
    window.dispatchEvent(new Event('afterprint'));
    document.querySelector('[data-library-receipt-close]').click();
    document.querySelector('[data-library-return="seven-day-reverse"]').click();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const returned = JSON.parse(localStorage.getItem('tu:library:loans'))[0];
    return { dueBefore, dueAfter, accountLoan, receiptOpen, printCount, printText, returned };
  })()`);
  check(circulation.dueAfter > circulation.dueBefore, "Library renewal did not extend the due date.");
  check(
    circulation.accountLoan && circulation.receiptOpen && circulation.printCount === 1 && circulation.printText > 120,
    "My Library receipt did not render into the shared print document.",
  );
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
    for (let attempt = 0; attempt < 40 && !document.querySelector('[data-search-dialog]').open; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
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

  await navigate("library.html#library-appraisal", "[data-appraisal-app]");
  const appraisalShelfPosition = await cdp.evaluate(`(async () => {
    document.querySelector('[data-appraisal-object="frozen-reader"]').click();
    await new Promise((resolve) => setTimeout(resolve, 2050));
    const target = document.querySelector('#appraisal-object-frozen-reader');
    return {
      hash: location.hash,
      target: Boolean(target),
      top: target?.getBoundingClientRect().top,
      header: document.querySelector('[data-header]')?.getBoundingClientRect().height || 0
    };
  })()`);
  check(
    appraisalShelfPosition.hash === "#appraisal-object-frozen-reader"
      && appraisalShelfPosition.target
      && appraisalShelfPosition.top >= appraisalShelfPosition.header - 4
      && appraisalShelfPosition.top <= appraisalShelfPosition.header + 48,
    `Appraisal shelf click did not settle on the selected workbench (${JSON.stringify(appraisalShelfPosition)}).`,
  );

  await navigate("library.html#appraisal-object-thermal-printer", "[data-appraisal-app]");
  await eventually(() => cdp.evaluate("document.querySelectorAll('[data-appraisal-object]').length === 8"));
  const appraisalObjectCount = await cdp.evaluate("document.querySelectorAll('[data-appraisal-object]').length");
  const supportedAppraisal = await cdp.evaluate(`(async () => {
    const settle = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    for (const selector of [
      '[data-appraisal-evidence="slot"]',
      '[data-appraisal-evidence="residue"]',
      '[data-appraisal-evidence="marks"]',
      '[data-appraisal-hypothesis="label-printer"]',
      '[data-appraisal-test="raking-light"]',
      '[data-appraisal-test="paper-scrap"]'
    ]) {
      document.querySelector(selector).click();
      await settle();
    }
    const use = document.querySelector('[data-appraisal-field="useId"]');
    use.value = 'shelf-labels';
    use.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();
    document.querySelector('[data-appraisal-destination="library"]').click();
    await settle();
    const note = document.querySelector('[data-appraisal-note]');
    note.value = '保留未知電壓與物流標籤重複序號，不能因紙屑變黑就直接接上河童發電機。';
    note.dispatchEvent(new InputEvent('input', { bubbles: true, data: note.value, inputType: 'insertText' }));
    await new Promise((resolve) => setTimeout(resolve, 240));
    document.querySelector('[data-appraisal-form]').requestSubmit();
    await settle();
    const records = JSON.parse(localStorage.getItem('tu:appraisal:records') || '[]');
    const ledger = JSON.parse(localStorage.getItem('tu:campus:ledger') || '[]');
    return {
      record: records.at(-1),
      recordVisible: Boolean(document.querySelector('.appraisal-record')),
      ledger: ledger.filter((event) => event.type.startsWith('appraisal.')).length,
      hash: location.hash
    };
  })()`);
  check(
    appraisalObjectCount === 8
      && supportedAppraisal.record?.verdict === "supported"
      && supportedAppraisal.record?.destinationId === "library"
      && supportedAppraisal.recordVisible
      && supportedAppraisal.ledger === 2
      && supportedAppraisal.hash.startsWith("#appraisal-record-"),
    "Supported drift-object appraisal did not save, catalogue, enter My TU ledger, or open its shareable record.",
  );

  await navigate("library.html#appraisal-object-single-earbud", "[data-appraisal-app]");
  const contestedAppraisal = await cdp.evaluate(`(async () => {
    const settle = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    for (const selector of [
      '[data-appraisal-evidence="mesh"]',
      '[data-appraisal-evidence="contacts"]',
      '[data-appraisal-hypothesis="dream-seed"]',
      '[data-appraisal-test="case-impression"]'
    ]) {
      document.querySelector(selector).click();
      await settle();
    }
    const use = document.querySelector('[data-appraisal-field="useId"]');
    use.value = 'quiet-exhibit';
    use.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();
    document.querySelector('[data-appraisal-destination="kourindou"]').click();
    await settle();
    const agency = document.querySelector('[data-appraisal-field="agencyId"]');
    agency.value = 'stirring';
    agency.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();
    document.querySelector('[data-appraisal-form]').requestSubmit();
    await new Promise((resolve) => setTimeout(resolve, 40));
    const dialog = document.querySelector('[data-appraisal-retention-dialog]');
    dialog.querySelector('select[name="reviewerId"]').value = 'kogasa';
    dialog.querySelector('textarea[name="retentionReason"]').value = '它把「只剩一半」理解成只播放一半夢境，雖然不成立，卻值得保留為遺忘工具如何描述缺失的證詞。';
    dialog.querySelector('input[name="confirmed"]').checked = true;
    dialog.querySelector('[data-appraisal-retention-form]').requestSubmit();
    await settle();
    const records = JSON.parse(localStorage.getItem('tu:appraisal:records') || '[]');
    return {
      dialogOpened: dialog.open === false,
      record: records.at(-1),
      warning: document.querySelector('.appraisal-contested-warning')?.textContent || '',
      hash: location.hash
    };
  })()`);
  check(
    contestedAppraisal.dialogOpened
      && contestedAppraisal.record?.disposition === "contested"
      && contestedAppraisal.record?.verdict === "unsupported"
      && contestedAppraisal.record?.reviewerId === "kogasa"
      && contestedAppraisal.warning.includes("未獲支持")
      && contestedAppraisal.hash.startsWith("#appraisal-record-"),
    "Unsupported drift-object theory was not explicitly retained as a visible contested record.",
  );

  await navigate("campus.html#bbs", "[data-bbs-list]");
  const appraisalBbs = await cdp.evaluate(`(() => {
    const posts = [...document.querySelectorAll('[data-bbs-id^="appraisal-"]')];
    posts[0]?.querySelector('.bbs-row-trigger')?.click();
    return {
      posts: posts.length,
      dialogOpen: document.querySelector('[data-info-dialog]').open,
      action: document.querySelector('[data-info-action]')?.textContent || ''
    };
  })()`);
  check(
    appraisalBbs.posts === 2 && appraisalBbs.dialogOpen && appraisalBbs.action.includes("漂流物"),
    "Completed drift-object appraisals did not generate linked BBS reactions.",
  );

  await navigate("research.html#spellcard-workshop", "[data-spellcard-workshop]");
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-spell-design-form]'))"));
  const spellcardDesignFlow = await cdp.evaluate(`(async () => {
    const settle = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const form = document.querySelector('[data-spell-design-form]');
    const name = form.elements.spellName;
    name.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    name.value = '霧符「讀報以前請先看退路」';
    name.dispatchEvent(new InputEvent('input', { bubbles: true, data: '路', inputType: 'insertCompositionText', isComposing: true }));
    name.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: name.value }));
    form.elements.patternId.value = 'wind-corridor';
    form.elements.patternId.dispatchEvent(new Event('change', { bubbles: true }));
    form.elements.venueId.value = 'misty-lake-bank';
    form.elements.venueId.dispatchEvent(new Event('change', { bubbles: true }));
    form.elements.cueId.value = 'ring-preview';
    form.elements.cueId.dispatchEvent(new Event('change', { bubbles: true }));
    form.elements.soundId.value = 'wood-chime';
    form.elements.soundId.dispatchEvent(new Event('change', { bubbles: true }));
    form.elements.corridorWidth.value = '38';
    form.elements.corridorWidth.dispatchEvent(new Event('input', { bubbles: true }));
    form.elements.seedLock.checked = true;
    form.elements.seedLock.dispatchEvent(new Event('change', { bubbles: true }));
    form.elements.stopSignal.checked = true;
    form.elements.stopSignal.dispatchEvent(new Event('change', { bubbles: true }));
    form.elements.audienceBriefing.checked = true;
    form.elements.audienceBriefing.dispatchEvent(new Event('change', { bubbles: true }));
    form.elements.fieldNote.value = '第二圈故意偏向新聞席，但最低走廊不得被頭版裁掉。';
    form.elements.fieldNote.dispatchEvent(new InputEvent('input', { bubbles: true, data: '。', inputType: 'insertText' }));
    await new Promise((resolve) => setTimeout(resolve, 240));
    form.requestSubmit();
    await settle();
    const designs = JSON.parse(localStorage.getItem('tu:spellcards:designs') || '[]');
    const design = designs.at(-1);
    await new Promise((resolve) => setTimeout(resolve, 2050));
    const target = document.querySelector('#spellcard-design-' + CSS.escape(design.id));
    window.__tuPrintCount = 0;
    window.print = () => { window.__tuPrintCount += 1; };
    document.querySelector('[data-spell-print]').click();
    await settle();
    const printText = document.querySelector('[data-tu-print-root]')?.textContent.trim().length || 0;
    const printCount = window.__tuPrintCount;
    window.dispatchEvent(new Event('afterprint'));
    return {
      design,
      reviewers: document.querySelectorAll('.spell-review').length,
      hash: location.hash,
      top: target?.getBoundingClientRect().top,
      header: document.querySelector('[data-header]')?.getBoundingClientRect().height || 0,
      printText,
      printCount
    };
  })()`);
  check(
    spellcardDesignFlow.design?.draft?.spellName === "霧符「讀報以前請先看退路」"
      && spellcardDesignFlow.reviewers === 6
      && spellcardDesignFlow.hash.startsWith("#spellcard-design-")
      && spellcardDesignFlow.top >= spellcardDesignFlow.header - 4
      && spellcardDesignFlow.top <= spellcardDesignFlow.header + 48,
    `Spell-card design was not saved, reviewed, or positioned at its exact file (${JSON.stringify(spellcardDesignFlow)}).`,
  );
  check(
    spellcardDesignFlow.printCount === 1 && spellcardDesignFlow.printText > 500,
    "Spell-card design did not render into the shared printable document.",
  );

  const spellcardDefenceFlow = await cdp.evaluate(`(async () => {
    const settle = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    document.querySelector('[data-spell-defend]').click();
    await settle();
    const form = document.querySelector('[data-spell-defence-form]');
    for (const name of ['rule', 'reproducibility', 'external']) {
      const choice = form.querySelector('input[name="' + name + '"]');
      choice.checked = true;
      choice.dispatchEvent(new Event('change', { bubbles: true }));
    }
    form.requestSubmit();
    await settle();
    const defences = JSON.parse(localStorage.getItem('tu:spellcards:defences') || '[]');
    const record = defences.at(-1);
    const ledger = JSON.parse(localStorage.getItem('tu:campus:ledger') || '[]');
    await new Promise((resolve) => setTimeout(resolve, 2050));
    const target = document.querySelector('#spellcard-defence-' + CSS.escape(record.id));
    window.__tuDefencePrintCount = 0;
    window.print = () => { window.__tuDefencePrintCount += 1; };
    document.querySelector('[data-spell-print-defence]').click();
    await settle();
    const printText = document.querySelector('[data-tu-print-root]')?.textContent.trim().length || 0;
    const printCount = window.__tuDefencePrintCount;
    window.dispatchEvent(new Event('afterprint'));
    return {
      record,
      panel: document.querySelectorAll('.spell-defence-panel article').length,
      votes: document.querySelectorAll('.spell-vote').length,
      dissent: Boolean(document.querySelector('.spell-dissent')),
      ledger: ledger.filter((event) => event.type.startsWith('spellcard.')).length,
      hash: location.hash,
      top: target?.getBoundingClientRect().top,
      header: document.querySelector('[data-header]')?.getBoundingClientRect().height || 0,
      printText,
      printCount
    };
  })()`);
  check(
    spellcardDefenceFlow.record?.votes?.length === 3
      && spellcardDefenceFlow.panel === 3
      && spellcardDefenceFlow.ledger === 2
      && spellcardDefenceFlow.hash.startsWith("#spellcard-defence-")
      && spellcardDefenceFlow.top >= spellcardDefenceFlow.header - 4
      && spellcardDefenceFlow.top <= spellcardDefenceFlow.header + 48
      && spellcardDefenceFlow.printCount === 1
      && spellcardDefenceFlow.printText > 800,
    `Public spell-card defence did not preserve its panel, ruling, ledger, or exact route (${JSON.stringify(spellcardDefenceFlow)}).`,
  );
  const spellcardBack = await cdp.evaluate(`(async () => {
    history.back();
    for (let attempt = 0; attempt < 80 && location.hash !== '#spellcard-workshop'; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return {
      hash: location.hash,
      designBench: Boolean(document.querySelector('[data-spell-design-form]')),
      focusedFile: Boolean(document.querySelector('[data-spell-defence-record]'))
    };
  })()`);
  check(
    spellcardBack.hash === "#spellcard-workshop" && spellcardBack.designBench && !spellcardBack.focusedFile,
    "Browser Back from a spell-card defence did not restore the design-bench origin.",
  );
  const spellcardLanguages = await cdp.evaluate(`(() => {
    document.querySelector('[data-lang="ja"]').click();
    const ja = document.querySelector('.spell-workshop-hero h2')?.textContent || '';
    document.querySelector('[data-lang="en"]').click();
    const en = document.querySelector('.spell-workshop-hero h2')?.textContent || '';
    document.querySelector('[data-lang="zh-Hant"]').click();
    const zh = document.querySelector('.spell-workshop-hero h2')?.textContent || '';
    return { ja, en, zh };
  })()`);
  check(
    spellcardLanguages.ja.includes("公平")
      && spellcardLanguages.en.includes("fairness")
      && spellcardLanguages.zh.includes("公平"),
    "Spell-card workshop did not rerender its public interface across Japanese, English, and Traditional Chinese.",
  );

  await navigate("campus.html#bbs", "[data-bbs-list]");
  const spellcardBbs = await cdp.evaluate(`(() => {
    const posts = [...document.querySelectorAll('.spellcard-post')];
    posts[0]?.querySelector('.bbs-row-trigger')?.click();
    return {
      posts: posts.length,
      linked: posts.every((post) => post.querySelector('.incident-linked')?.textContent.includes('符卡')),
      dialogOpen: document.querySelector('[data-info-dialog]').open,
      action: document.querySelector('[data-info-action]')?.textContent || ''
    };
  })()`);
  check(
    spellcardBbs.posts === 3 && spellcardBbs.linked && spellcardBbs.dialogOpen && spellcardBbs.action.includes("符卡"),
    "Public spell-card defence did not create three linked, reopenable BBS reactions.",
  );

  await navigate("housing.html#housing-residence-misty-north", "[data-housing-app]");
  const housingResidence = await cdp.evaluate(`({
    page: document.body.dataset.page,
    selected: document.querySelector('[data-residence-file]')?.dataset.residenceFile,
    residences: document.querySelectorAll('[data-residence-select]').length,
    rooms: document.querySelectorAll('.residence-room-features section:first-child li').length,
    overflow: document.documentElement.scrollWidth > window.innerWidth
  })`);
  check(housingResidence.page === "housing" && housingResidence.selected === "misty-north", "Housing residence deep link selected the wrong hall.");
  check(housingResidence.residences === 5 && housingResidence.rooms === 2, "Housing inventory did not render the residence files.");
  check(!housingResidence.overflow, "Housing page has desktop horizontal overflow.");

  await cdp.evaluate("document.querySelector('[data-housing-apply-residence=\"misty-north\"]').click(); true");
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-housing-form]'))"));
  const housingApplication = await cdp.evaluate(`(async () => {
    const form = document.querySelector('[data-housing-form]');
    form.elements.secondResidence.value = 'bamboo-lantern';
    form.elements.moon.value = 'sensitive';
    form.elements.water.value = 'near';
    form.elements.flight.value = 'small';
    form.elements.familiar.value = 'small';
    form.elements.note.value = '外界行李箱會在星期三變大。';
    form.elements.note.dispatchEvent(new InputEvent('input', { bubbles: true, data: '。', inputType: 'insertText' }));
    const draft = JSON.parse(localStorage.getItem('tu:housing:draft'));
    form.requestSubmit();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const applications = JSON.parse(localStorage.getItem('tu:housing:applications'));
    return {
      draft,
      applications,
      offers: document.querySelectorAll('[data-housing-offer]').length,
      hash: location.hash
    };
  })()`);
  check(housingApplication.draft.preferences.note.includes("星期三"), "Housing draft did not autosave.");
  check(housingApplication.applications.at(-1).offers.length === 3 && housingApplication.offers === 3, "Housing application did not generate three offers.");
  check(housingApplication.hash === "#housing-application", "Housing application lost its canonical route.");

  const housingAssignment = await cdp.evaluate(`(async () => {
    const offers = [...document.querySelectorAll('[data-housing-offer]')];
    offers[1].querySelector('[data-housing-decline]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    document.querySelector('[data-housing-accept]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const assignment = JSON.parse(localStorage.getItem('tu:housing:assignments')).at(-1);
    const agreement = document.querySelector('[data-housing-agreement]');
    agreement.checked = true;
    agreement.dispatchEvent(new Event('change', { bubbles: true }));
    const form = document.querySelector('[data-housing-change-form]');
    form.elements.reason.value = 'schedule';
    form.elements.urgency.value = 'soon';
    form.elements.note.value = '凌晨校報校對與夜診輪班現在每天互相叫醒。';
    form.requestSubmit();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return {
      assignment: JSON.parse(localStorage.getItem('tu:housing:assignments')).at(-1),
      changes: JSON.parse(localStorage.getItem('tu:housing:room-changes')),
      hash: location.hash,
      room: document.querySelector('.housing-room-card h3')?.textContent.trim(),
      history: document.querySelectorAll('.housing-change-history article').length
    };
  })()`);
  check(housingAssignment.assignment.status === "active" && housingAssignment.assignment.agreementChecked, "Housing assignment or shared-living agreement did not persist.");
  check(housingAssignment.changes.at(-1).status === "under-review" && housingAssignment.changes.at(-1).suggestion, "Housing transfer request did not retain a viable alternative.");
  check(housingAssignment.hash === "#housing-account" && housingAssignment.room && housingAssignment.history === 1, "My Housing did not render the accepted room and transfer history.");

  const housingLocale = await cdp.evaluate(`(() => {
    document.querySelector('[data-lang="ja"]').click();
    const ja = document.querySelector('.housing-view-heading h3')?.textContent.trim();
    document.querySelector('[data-lang="en"]').click();
    const en = document.querySelector('.housing-view-heading h3')?.textContent.trim();
    document.querySelector('[data-lang="zh-Hant"]').click();
    return { ja, en };
  })()`);
  check(housingLocale.ja === "自分の寮" && housingLocale.en === "My housing", "Housing did not rerender fully in Japanese and English.");

  await navigate("incidents.html#incident-case-late-bell-seven", "[data-incident-app]");
  const incidentInitial = await cdp.evaluate(`({
    page: document.body.dataset.page,
    cases: document.querySelectorAll('[data-incident-case]').length,
    evidence: document.querySelectorAll('[data-incident-evidence]').length,
    selected: document.querySelector('[data-incident-case].active')?.dataset.incidentCase,
    overflow: document.documentElement.scrollWidth > window.innerWidth
  })`);
  check(incidentInitial.page === "incidents" && incidentInitial.cases === 5, "Incident Centre did not render all case files.");
  check(incidentInitial.evidence === 4 && incidentInitial.selected === "late-bell-seven", "Incident case deep link selected the wrong dossier.");
  check(!incidentInitial.overflow, "Incident Centre has desktop horizontal overflow.");

  const incidentWorkbench = await cdp.evaluate(`(async () => {
    document.querySelector('[data-incident-evidence="tower-log"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    document.querySelector('[data-incident-evidence="roll-page"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    document.querySelector('[data-incident-testimony="nitori"]').click();
    document.querySelector('[data-incident-hypothesis="roster-lag"]').click();
    document.querySelector('[data-incident-action="freeze-roster"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const state = JSON.parse(localStorage.getItem('tu:incidents:workbench')).cases['late-bell-seven'];
    document.querySelector('[data-incident-open-lab]').click();
    return { state, hash: location.hash };
  })()`);
  check(incidentWorkbench.state.reviewedEvidence.length === 2 && incidentWorkbench.state.reviewedTestimony.includes("nitori"), "Incident dossier review state was not saved.");
  check(incidentWorkbench.state.selectedHypothesis === "roster-lag" && incidentWorkbench.state.selectedActions.includes("freeze-roster"), "Incident hypothesis or reversible response was not saved.");
  await eventually(() => cdp.evaluate("location.hash === '#incident-simulator' && Boolean(document.querySelector('[data-incident-design]'))"));

  const experimentFlow = await cdp.evaluate(`(async () => {
    const form = document.querySelector('[data-incident-design]');
    form.elements.sampleSize.value = '96';
    form.elements.repeats.value = '4';
    for (const name of ['control', 'randomize', 'calibration', 'versionLock']) form.elements[name].checked = true;
    form.requestSubmit();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const experiments = JSON.parse(localStorage.getItem('tu:incidents:experiments'));
    const latest = experiments.at(-1);
    const button = document.querySelector('[data-incident-resolve]');
    const resolvable = Boolean(button && !button.disabled);
    button?.click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return {
      latest,
      resolvable,
      resolutions: JSON.parse(localStorage.getItem('tu:incidents:resolutions')),
      hash: location.hash,
      bbsHref: document.querySelector('.incident-resolution-grid a[href*="bbs-"]')?.getAttribute('href')
    };
  })()`);
  check(experimentFlow.latest.quality >= 90 && experimentFlow.latest.verdict === "supports", "Well-controlled incident simulation did not identify the true hypothesis.");
  check(experimentFlow.resolvable && experimentFlow.resolutions.length === 1 && experimentFlow.hash === "#incident-records", "Incident resolution was not saved or did not open the archive.");
  check(experimentFlow.bbsHref?.includes("bbs-incident-"), "Incident closure did not expose a linked BBS deep link.");

  await navigate(experimentFlow.bbsHref, "#bbs");
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-info-dialog]')?.open)"));
  const incidentBbs = await cdp.evaluate(`({
    linkedPosts: document.querySelectorAll('.incident-post').length,
    dialogOpen: document.querySelector('[data-info-dialog]').open,
    action: document.querySelector('[data-info-action-label]')?.textContent.trim(),
    hash: location.hash
  })`);
  check(incidentBbs.linkedPosts === 3 && incidentBbs.dialogOpen, `Incident closure did not generate three BBS reactions: ${JSON.stringify(incidentBbs)}`);
  check(incidentBbs.action.includes("案卷") && incidentBbs.hash.startsWith("#bbs-incident-"), "Incident-linked BBS post cannot return to its case file.");

  await navigate("incidents.html#incident-case-fourth-lantern-loop", "[data-incident-app]");
  const contestedSetup = await cdp.evaluate(`(async () => {
    document.querySelector('[data-incident-hypothesis="tewi-label"]').click();
    document.querySelector('[data-incident-action="lock-firmware"]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    document.querySelector('[data-incident-open-lab]').click();
    return location.hash;
  })()`);
  check(contestedSetup === "#incident-simulator", "Unsupported incident hypothesis did not open in the simulator.");
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-incident-design]'))"));
  const contestedFlow = await cdp.evaluate(`(async () => {
    const form = document.querySelector('[data-incident-design]');
    form.elements.sampleSize.value = '96';
    form.elements.repeats.value = '4';
    for (const name of ['control', 'randomize', 'calibration', 'versionLock']) form.elements[name].checked = true;
    form.requestSubmit();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const experiments = JSON.parse(localStorage.getItem('tu:incidents:experiments'));
    const latest = experiments.at(-1);
    const ordinary = document.querySelector('[data-incident-resolve]');
    const retain = document.querySelector('[data-incident-retain]');
    retain?.click();
    const dialog = document.querySelector('[data-incident-retention-dialog]');
    const dialogOpen = Boolean(dialog?.open);
    dialog.querySelector('form').requestSubmit();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const blockedBeforeConfirm = dialog.open
      && JSON.parse(localStorage.getItem('tu:incidents:resolutions')).length === 1;
    dialog.querySelector('select[name="retentionReason"]').value = 'headline';
    dialog.querySelector('input[name="confirmation"]').checked = true;
    dialog.querySelector('form').requestSubmit();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const resolutions = JSON.parse(localStorage.getItem('tu:incidents:resolutions'));
    const record = resolutions.at(-1);
    return {
      latest,
      ordinary: Boolean(ordinary),
      retainReady: Boolean(retain && !retain.disabled),
      dialogOpen,
      blockedBeforeConfirm,
      record,
      hash: location.hash,
      archiveContested: Boolean(document.querySelector('.incident-resolution-grid article[data-disposition="contested"]')),
      bbsHref: document.querySelector('.incident-resolution-grid article[data-disposition="contested"] a[href*="bbs-"]')?.getAttribute('href')
    };
  })()`);
  check(contestedFlow.latest.verdict === "rejects" && !contestedFlow.ordinary && contestedFlow.retainReady, "Rejected incident result did not offer only the red-thread retention path.");
  check(
    contestedFlow.dialogOpen
      && contestedFlow.blockedBeforeConfirm
      && contestedFlow.record.disposition === "contested"
      && contestedFlow.record.reviewerId === "marisa"
      && contestedFlow.record.retentionReason === "headline"
      && contestedFlow.archiveContested
      && contestedFlow.hash === "#incident-records",
    "Explicitly confirmed contested closure was not preserved with its reviewer, reason, and visible disposition.",
  );

  await navigate(contestedFlow.bbsHref, "#bbs");
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-info-dialog]')?.open)"));
  const contestedBbs = await cdp.evaluate(`({
    posts: document.querySelectorAll('.contested-post.incident-post').length,
    label: document.querySelector('.contested-post.incident-post .incident-linked')?.textContent || '',
    warning: document.querySelector('[data-info-summary]')?.textContent || document.querySelector('[data-info-dialog]')?.textContent || ''
  })`);
  check(contestedBbs.posts === 3 && contestedBbs.label.includes("紅線"), "Contested closure did not generate three visibly red-thread BBS posts.");
  check(/沒有證實|未獲支持/.test(contestedBbs.warning), "Contested BBS discussion lost the warning that the claim was not established.");

  await navigate("index.html", "[data-news-track]");
  const incidentNews = await cdp.evaluate(`({
    dynamic: document.querySelectorAll('[data-news-id^="incident-news-"]').length,
    service: Boolean(document.querySelector('a[href^="incidents.html"]')),
    contested: [...document.querySelectorAll('[data-news-id^="incident-news-"]')].some((item) => /爭議性結案|紅線保留/.test(item.textContent))
  })`);
  check(incidentNews.dynamic >= 2 && incidentNews.service && incidentNews.contested, "Normal and contested incident closures did not both reach the campus wire.");

  await navigate("clinic.html#clinic", "[data-clinic-app]");
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('.clinic-queue-grid article'))"));
  const clinicDraft = await cdp.evaluate(`(async () => {
    const form = document.querySelector('[data-clinic-triage-form]');
    form.querySelector('input[value="magic-feedback"]').click();
    form.querySelector('input[value="mushroom-exposure"]').click();
    form.elements.intensity.value = '4';
    form.elements.mobility.value = 'shuttle';
    form.elements.residueContained.checked = false;
    form.elements.notes.value = '外界人類測試：蘑菇籃沒有日期，八卦爐仍在冒紫色的煙。';
    form.elements.notes.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 420));
    return JSON.parse(localStorage.getItem('tu:clinic:triage-draft') || 'null');
  })()`);
  check(
    clinicDraft?.answers?.complaints?.includes("magic-feedback")
      && clinicDraft.answers.notes.includes("外界人類測試"),
    "Clinic triage did not autosave Chinese input and selected complaints.",
  );
  await cdp.evaluate(`document.querySelector('[data-clinic-triage-form]').requestSubmit(); true`);
  await eventually(() => cdp.evaluate("JSON.parse(localStorage.getItem('tu:clinic:visits') || '[]').some((record) => record.status === 'waiting')"));
  const triageResult = await cdp.evaluate(`(() => {
    const visits = JSON.parse(localStorage.getItem('tu:clinic:visits') || '[]');
    const latest = visits.at(-1);
    return {
      active: Boolean(document.querySelector('.clinic-active-visit [data-clinic-consult]')),
      band: latest?.band,
      site: latest?.siteId,
      wait: latest?.waitMinutes,
      draftCleared: !localStorage.getItem('tu:clinic:triage-draft')
    };
  })()`);
  check(
    triageResult.active && triageResult.band === "urgent" && triageResult.site === "eientei"
      && triageResult.wait >= 2 && triageResult.draftCleared,
    "Clinic triage did not create a persistent urgent Eientei visit with a live wait.",
  );
  await cdp.evaluate(`document.querySelector('.clinic-active-visit [data-clinic-consult]').click(); true`);
  await eventually(() => cdp.evaluate("location.hash === '#clinic-pharmacy' && Boolean(document.querySelector('[data-clinic-dispense]'))"));
  await cdp.evaluate(`document.querySelector('[data-clinic-dispense]').click(); true`);
  await eventually(() => cdp.evaluate("JSON.parse(localStorage.getItem('tu:clinic:prescriptions') || '[]').at(-1)?.status === 'dispensed'"));
  for (let index = 0; index < 20; index += 1) {
    const recorded = await cdp.evaluate(`(() => {
      const button = document.querySelector('[data-clinic-dose]');
      if (!button) return false;
      button.click();
      return true;
    })()`);
    if (!recorded) break;
    await delay(40);
  }
  const prescriptionResult = await cdp.evaluate(`(() => {
    const prescriptions = JSON.parse(localStorage.getItem('tu:clinic:prescriptions') || '[]');
    const latest = prescriptions.at(-1);
    return {
      status: latest?.status,
      medicines: latest?.medicineIds?.length,
      doses: latest?.doseLog?.length,
      cards: document.querySelectorAll('.clinic-medicine-list a').length
    };
  })()`);
  check(
    prescriptionResult.status === "course-complete"
      && prescriptionResult.medicines >= 2
      && prescriptionResult.doses >= prescriptionResult.medicines
      && prescriptionResult.cards === 12,
    "Clinic pharmacy did not dispense, preserve, and complete the prescribed medicine course.",
  );
  await cdp.evaluate(`location.hash = 'clinic-recovery'; true`);
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-clinic-start-therapy]:not([disabled])'))"));
  await cdp.evaluate(`document.querySelector('[data-clinic-start-therapy]:not([disabled])').click(); true`);
  for (let index = 0; index < 6; index += 1) {
    const completed = await cdp.evaluate(`(() => {
      const button = document.querySelector('[data-clinic-care-step]');
      if (!button) return false;
      button.click();
      return true;
    })()`);
    if (!completed) break;
    await delay(40);
  }
  const recoveryResult = await cdp.evaluate(`(() => {
    const plans = JSON.parse(localStorage.getItem('tu:clinic:care-plans') || '[]');
    const latest = plans.at(-1);
    return { status: latest?.status, steps: latest?.completedSteps?.length, visible: document.querySelectorAll('.clinic-care-plans li.done').length };
  })()`);
  check(
    recoveryResult.status === "completed" && recoveryResult.steps === 4 && recoveryResult.visible === 4,
    "Clinic recovery did not retain and visibly complete all four therapy steps.",
  );
  await cdp.evaluate(`location.hash = 'clinic-account'; true`);
  await eventually(() => cdp.evaluate("Boolean(document.querySelector('[data-clinic-receipt]'))"));
  const clinicAccount = await cdp.evaluate(`(async () => {
    document.querySelector('[data-clinic-receipt]').click();
    const dialog = document.querySelector('[data-clinic-receipt-dialog]');
    window.__tuPrintCount = 0;
    window.print = () => { window.__tuPrintCount += 1; };
    dialog.querySelector('[data-clinic-receipt-print]').click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const printText = document.querySelector('[data-tu-print-root]')?.textContent.trim().length || 0;
    const printCount = window.__tuPrintCount;
    window.dispatchEvent(new Event('afterprint'));
    return {
      open: dialog.open,
      receipt: dialog.textContent.includes('TU-RX'),
      visits: document.querySelectorAll('.clinic-account-grid > section:first-child article').length,
      prescriptions: document.querySelectorAll('.clinic-account-grid > section:nth-child(2) article').length,
      plans: document.querySelectorAll('.clinic-account-grid > section:nth-child(3) article').length,
      printCount,
      printText
    };
  })()`);
  check(
    clinicAccount.open && clinicAccount.receipt && clinicAccount.visits >= 1
      && clinicAccount.prescriptions >= 1 && clinicAccount.plans >= 1,
    "Clinic account did not retain visits, prescriptions, recovery slips, and a printable receipt.",
  );
  check(clinicAccount.printCount === 1 && clinicAccount.printText > 160, "Clinic receipt did not render into the shared print document.");
  await cdp.evaluate(`document.querySelector('[data-clinic-receipt-close]').click(); true`);
  await navigate("campus.html#bbs", "#bbs");
  const clinicBbs = await cdp.evaluate(`({
    posts: document.querySelectorAll('.clinic-post').length,
    linked: [...document.querySelectorAll('.clinic-post .incident-linked')].every((node) => node.textContent.includes('校醫院'))
  })`);
  check(clinicBbs.posts >= 2 && clinicBbs.linked, "Dispensing and recovery did not create hospital-linked BBS reactions.");

  await navigate("mytu.html#my-tu", "#my-tu");
  const myTuLibrary = await cdp.evaluate(`(() => {
    const ledger = JSON.parse(localStorage.getItem('tu:campus:ledger') || '[]');
    return {
      libraryLink: document.querySelector('.mytu-summary a[href^="library.html"]')?.textContent || '',
      libraryEvents: ledger.filter((event) => event.type.startsWith('book.')).length,
      appraisalLink: document.querySelector('.mytu-summary a[href*="#appraisal-records"]')?.textContent || '',
      appraisalEvents: ledger.filter((event) => event.type.startsWith('appraisal.')).length,
      spellcardLink: document.querySelector('.mytu-summary a[href*="#spellcard-records"]')?.textContent || '',
      spellcardEvents: ledger.filter((event) => event.type.startsWith('spellcard.')).length,
      housingLink: document.querySelector('.mytu-summary a[href^="housing.html"]')?.textContent || '',
      housingEvents: ledger.filter((event) => event.type.startsWith('housing.')).length,
      incidentLink: document.querySelector('.mytu-summary a[href^="incidents.html"]')?.textContent || '',
      incidentEvents: ledger.filter((event) => event.type.startsWith('incident.')).length,
      clinicLink: document.querySelector('.mytu-summary a[href^="clinic.html"]')?.textContent || '',
      clinicEvents: ledger.filter((event) => event.type.startsWith('clinic.')).length,
      contestedEvent: ledger.some((event) => event.type === 'incident.resolved' && event.payload?.disposition === 'contested')
    };
  })()`);
  check(mytuLibraryLinkOkay(myTuLibrary.libraryLink), "My TU does not link to the library record.");
  check(myTuLibrary.libraryEvents >= 3, "Library actions are missing from the My TU campus ledger.");
  check(/鑑定|漂流物/.test(myTuLibrary.appraisalLink) && myTuLibrary.appraisalEvents >= 3, "Drift-object appraisal records are missing from My TU.");
  check(/符卡|答辯/.test(myTuLibrary.spellcardLink) && myTuLibrary.spellcardEvents === 2, "Spell-card design and defence are missing from My TU.");
  check(/宿舍|換房/.test(myTuLibrary.housingLink), "My TU does not link to the housing record.");
  check(myTuLibrary.housingEvents >= 3, "Housing actions are missing from the My TU campus ledger.");
  check(/事件研究|結案/.test(myTuLibrary.incidentLink) && myTuLibrary.incidentEvents >= 4 && myTuLibrary.contestedEvent, "Normal and contested incident work is missing from My TU.");
  check(/診療|處方|康復/.test(myTuLibrary.clinicLink) && myTuLibrary.clinicEvents >= 8, "Clinic care and its lifecycle events are missing from My TU.");

  await cdp.call("Page.navigate", { url: `${siteUrl}index.html#research-spellcard` });
  await eventually(() => cdp.evaluate("location.pathname.endsWith('/research.html') && Boolean(document.querySelector('[data-research-dialog]')?.open)"));
  check(await cdp.evaluate("location.hash === '#research-spellcard'"), "Legacy one-page research deep link was not redirected.");

  for (const page of ["index.html", "academics.html", "admissions.html", "research.html", "incidents.html", "campus.html", "mytu.html", "library.html", "clinic.html", "housing.html"]) {
    const response = await fetch(new URL(page, siteUrl));
    check(response.ok && (await response.text()).includes(`data-page=`), `${page} was not built as a complete page.`);
  }

  await navigate("clinic.html#%", "[data-clinic-app]");
  const malformedClinic = await cdp.evaluate(`(() => {
    document.querySelector('[data-lang="ja"]').click();
    const jaTitle = document.title;
    document.querySelector('[data-lang="en"]').click();
    const enTitle = document.title;
    document.querySelector('[data-lang="zh-Hant"]').click();
    return {
      page: document.body.dataset.page,
      care: Boolean(document.querySelector('.clinic-start-care')),
      jaTitle,
      enTitle,
      active: document.querySelector('[data-header] a[aria-current="page"]')?.getAttribute('href')
    };
  })()`);
  check(
    malformedClinic.page === "clinic"
      && malformedClinic.care
      && malformedClinic.jaTitle.includes("永遠亭")
      && malformedClinic.enTitle.includes("Eientei")
      && malformedClinic.active?.startsWith("clinic.html"),
    "Malformed clinic hash, localized title, or active navigation state regressed.",
  );

  const positionRoutes = [
    ["academics.html#faculty", "#faculty"],
    ["campus.html#map-eientei", "[data-eientei-focus]"],
    ["mytu.html#academic-grades", "#academic-grades"],
    ["clinic.html#clinic-recovery", "#clinic-recovery"],
    ["library.html#library-flying-index", "#library-flying-index"],
    ["library.html#appraisal-object-frozen-reader", "#appraisal-object-frozen-reader"],
    ["housing.html#housing-residence-misty-north", "#housing-residence-misty-north"],
    ["incidents.html#incident-case-fourth-lantern-loop", "#incident-case-fourth-lantern-loop"],
  ];
  for (const [url, selector] of positionRoutes) {
    await navigate(url, selector);
    await delay(2050);
    const position = await cdp.evaluate(`(() => {
      const target = document.querySelector(${JSON.stringify(selector)});
      return {
        top: target?.getBoundingClientRect().top,
        header: document.querySelector('[data-header]')?.getBoundingClientRect().height || 0
      };
    })()`);
    check(
      Number.isFinite(position.top) && position.top >= position.header - 4 && position.top <= position.header + 48,
      `${url} settled at the wrong vertical position (${JSON.stringify(position)}).`,
    );
  }

  await cdp.call("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  for (const page of ["index.html", "academics.html", "admissions.html", "research.html", "incidents.html", "campus.html", "mytu.html", "library.html", "clinic.html", "housing.html"]) {
    await navigate(page, "main");
    const mobile = await cdp.evaluate(`({
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      mainWidth: document.querySelector('main').getBoundingClientRect().width,
      viewport: window.innerWidth
    })`);
    check(!mobile.overflow && mobile.mainWidth <= mobile.viewport + 1, `${page} has narrow-mobile horizontal overflow.`);
  }
  await navigate("research.html#spellcard-workshop", "[data-spellcard-workshop]");
  const mobileSpellcard = await cdp.evaluate(`(() => {
    const canvas = document.querySelector('[data-spell-canvas]');
    const box = canvas?.getBoundingClientRect();
    return {
      canvas: Boolean(canvas),
      cssWidth: box?.width || 0,
      bitmapWidth: canvas?.width || 0,
      reviewers: document.querySelectorAll('.spell-review').length,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1
    };
  })()`);
  check(
    mobileSpellcard.canvas
      && mobileSpellcard.cssWidth <= 390
      && mobileSpellcard.bitmapWidth <= 390 * 1.5 + 1
      && mobileSpellcard.reviewers === 6
      && !mobileSpellcard.overflow,
    `Mobile spell-card sandbox exceeded its bounded rendering/layout budget (${JSON.stringify(mobileSpellcard)}).`,
  );
  const mobileMenu = await cdp.evaluate(`(() => {
    document.querySelector('[data-menu-toggle]').click();
    return {
      expanded: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded'),
      visible: !document.querySelector('[data-mobile-menu]').hidden,
      links: document.querySelectorAll('[data-mobile-menu] nav a').length,
      backgroundInert: document.querySelector('main').hasAttribute('inert')
    };
  })()`);
  await delay(40);
  const mobileFocus = await cdp.evaluate("document.activeElement?.matches('[data-mobile-menu] button, [data-mobile-menu] a')");
  check(
    mobileMenu.expanded === "true"
      && mobileMenu.visible
      && mobileMenu.links === 12
      && mobileMenu.backgroundInert
      && mobileFocus,
    "Mobile navigation did not open completely or move keyboard focus into its modal layer.",
  );

  if (errors.length) failures.push(`Browser console errors:\n${[...new Set(errors)].join("\n")}`);
  if (failures.length) {
    console.error(`Browser smoke test failed:\n- ${failures.join("\n- ")}`);
    process.exitCode = 1;
  } else {
    console.log("Browser smoke test passed: subpage buttons, persistent admissions, live routes/governance, coursework/exams/defence/transcript, spell-card design/flight/public defence, courses, library/appraisal, clinic care/prescriptions/recovery, housing, incident/BBS linkage, deep links, and responsive width.");
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
