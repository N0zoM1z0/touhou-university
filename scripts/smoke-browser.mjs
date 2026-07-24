import { spawn, spawnSync } from "node:child_process";
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
const chromeCandidates = [
  process.env.CHROME_BIN,
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);
const chrome = chromeCandidates.find(existsSync);

if (!chrome) {
  console.error("Browser smoke test requires Google Chrome or Chromium.");
  process.exit(1);
}

const server = spawn("python3", ["-m", "http.server", String(sitePort), "--bind", "127.0.0.1"], {
  cwd: root,
  stdio: "ignore",
});
const browser = spawn(
  chrome,
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-extensions",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profile}`,
    "--window-size=1440,1000",
    siteUrl,
  ],
  { stdio: "ignore" },
);

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

try {
  await eventually(async () => {
    const response = await fetch(siteUrl);
    return response.ok;
  });

  const target = await eventually(async () => {
    const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await response.json();
    return targets.find((item) => item.type === "page" && item.url.startsWith(siteUrl));
  });

  cdp = new Cdp(target.webSocketDebuggerUrl);
  await cdp.open();
  cdp.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
    errors.push(exceptionDetails.exception?.description || exceptionDetails.text);
  });
  cdp.on("Log.entryAdded", ({ entry }) => {
    if (entry.level === "error") errors.push(entry.text);
  });
  await Promise.all([cdp.call("Runtime.enable"), cdp.call("Log.enable"), cdp.call("Page.enable")]);

  await eventually(() =>
    cdp.evaluate(`location.origin === 'http://127.0.0.1:${sitePort}' && document.readyState === 'complete'`),
  );
  await cdp.evaluate("localStorage.clear(); true");
  await cdp.call("Page.reload", { ignoreCache: true });
  await eventually(() => cdp.evaluate("document.readyState === 'complete'"));

  const initial = await cdp.evaluate(`({
    lang: document.documentElement.lang,
    services: document.querySelectorAll('[data-service]').length,
    research: document.querySelectorAll('[data-research]').length,
    schools: document.querySelectorAll('[data-school]').length,
    routeModes: document.querySelectorAll('[name="route-mode"]').length,
	    news: document.querySelectorAll('[data-news-id]').length,
	    examBanks: document.querySelectorAll('[data-exam-start]').length,
	    frictionNotes: document.querySelectorAll('[data-friction]').length,
	    faithFaculty: document.querySelectorAll('[data-faith-faculty]').length,
	    examTile: (() => {
	      const tile = document.querySelector('.service-tile-exam');
	      const style = getComputedStyle(tile);
	      return { text: tile.querySelector('strong').textContent.trim(), color: style.color, background: style.backgroundColor };
	    })(),
	    widthOkay: document.documentElement.scrollWidth <= window.innerWidth
	  })`);
  check(initial.lang === "zh-Hant", "Default locale is not Traditional Chinese.");
  check(initial.services >= 8, "Campus service triggers are missing.");
  check(initial.research === 5, "Research file triggers are incomplete.");
  check(initial.schools === 7, "School catalogue triggers are incomplete.");
  check(initial.routeModes === 4, "Campus transport modes are incomplete.");
  check(initial.news >= 12, "Rotating campus news did not render.");
	  check(initial.examBanks === 4, "Exam bank chooser is incomplete.");
	  check(initial.frictionNotes === 6, "Unresolved faculty case board is incomplete.");
	  check(initial.faithFaculty === 4, "Faith and Coexistence faculty roster is incomplete.");
	  check(
	    initial.examTile.text === "入學試驗" &&
	      initial.examTile.color.includes("255") &&
	      !initial.examTile.background.includes("255, 255, 255"),
	    "Entrance-exam service tile text is not visibly styled.",
	  );
	  check(initial.widthOkay, "Desktop layout has horizontal overflow.");

  const english = await cdp.evaluate(`(() => {
    document.querySelector('[data-lang="en"]').click();
    return {
      lang: document.documentElement.lang,
      title: document.querySelector('#services-title').textContent.trim(),
      map: document.querySelector('[data-map-name]').textContent.trim()
    };
  })()`);
  check(english.lang === "en", "English locale switch failed.");
  check(english.title === "What do you need today?", "English static translation failed.");
  check(english.map === "Hakurei Gate", "English dynamic map translation failed.");

  const school = await cdp.evaluate(`(() => {
    document.querySelector('[data-school="boundary"]').click();
    const dialog = document.querySelector('[data-school-dialog]');
    return {
      open: dialog.open,
      title: dialog.querySelector('h2').textContent.trim(),
      courses: dialog.querySelectorAll('.school-curriculum tbody tr').length,
      tuition: dialog.querySelector('.school-fact-tuition dd').textContent.trim()
    };
  })()`);
  check(school.open, "School catalogue dialog did not open.");
  check(school.title.includes("Boundaries"), "School catalogue did not use the current locale.");
  check(school.courses === 5, "School catalogue curriculum is incomplete.");
  check(school.tuition.includes("82,000"), "School catalogue tuition did not render.");

	  const route = await cdp.evaluate(`(() => {
	    document.querySelector('[data-school-close]').click();
	    const form = document.querySelector('[data-route-form]');
	    form.elements.from.value = 'gate';
	    form.elements.to.value = 'kappa';
	    const routes = {};
	    for (const mode of ['walk', 'broom', 'tengu', 'rabbit']) {
	      form.querySelector('[value="' + mode + '"]').checked = true;
	      form.requestSubmit();
	      routes[mode] = {
	        path: [...document.querySelectorAll('.route-itinerary strong')].map((node) => node.textContent.trim()).join(' > '),
	        kinds: [...document.querySelectorAll('.route-segment-badge')].map((node) => node.dataset.routeKind),
	        lines: document.querySelectorAll('.map-route-line').length,
	        stops: document.querySelectorAll('.route-itinerary li').length
	      };
	    }
	    return {
	      shown: !document.querySelector('[data-route-result]').hidden,
	      routes,
	      marked: document.querySelectorAll('.map-node.on-route').length,
	      estimate: document.querySelector('.route-result-summary strong').textContent.trim(),
	      notice: document.querySelector('.route-notice').textContent.trim()
	    };
	  })()`);
	  check(route.shown, "Campus route result did not open.");
	  check(
	    new Set(Object.values(route.routes).map((item) => item.path)).size === 4,
	    "Transport modes still resolve to the same campus path.",
	  );
	  check(
	    Object.entries(route.routes).every(
	      ([mode, item]) =>
	        item.stops >= 3 &&
	        item.lines === item.stops - 1 &&
	        (mode === "walk" || item.kinds.includes(mode)),
	    ),
	    "Mode-specific route segments or map lines are incomplete.",
	  );
	  check(route.marked === route.routes.rabbit.stops, "Campus route node markers do not match the active path.");
	  check(route.estimate.includes("min"), "Campus route estimate did not localize.");
	  check(route.notice.includes("Rabbit carts"), "Selected transport guidance did not render.");

	  const friction = await cdp.evaluate(`(() => {
	    document.querySelector('[data-friction]').click();
	    const dialog = document.querySelector('[data-info-dialog]');
	    const matter = {
	      open: dialog.open,
	      title: dialog.querySelector('[data-info-title]').textContent.trim(),
	      rows: dialog.querySelectorAll('[data-info-meta] > div').length
	    };
	    document.querySelector('[data-info-close]').click();
	    document.querySelector('[data-faith-faculty]').click();
	    const faith = {
	      open: dialog.open,
	      title: dialog.querySelector('[data-info-title]').textContent.trim(),
	      image: dialog.querySelector('[data-info-image]').getAttribute('src'),
	      rows: dialog.querySelectorAll('[data-info-meta] > div').length
	    };
	    document.querySelector('[data-info-close]').click();
	    document.querySelector('[data-faculty="aya"]').click();
	    const faculty = {
	      open: document.querySelector('[data-faculty-dialog]').open,
	      incident: document.querySelector('[data-dialog-incident]').textContent.trim()
	    };
	    document.querySelector('[data-dialog-close]').click();
	    return { matter, faith, faculty };
	  })()`);
	  check(friction.matter.open && friction.matter.rows === 3, "Unresolved faculty case did not open a complete file.");
	  check(
	    friction.faith.open && friction.faith.image.endsWith("faith-council.webp") && friction.faith.rows === 3,
	    "Faith faculty profile did not open with its illustration and details.",
	  );
	  check(friction.faculty.open && friction.faculty.incident.length > 40, "Faculty profile lacks its unresolved incident.");

  const application = await cdp.evaluate(`(async () => {
    document.querySelector('[data-school="boundary"]').click();
    document.querySelector('[data-school-apply]').click();
    const dialog = document.querySelector('[data-service-dialog]');
    let form = dialog.querySelector('[data-application-form]');
    const preselected = form.elements.school.value;
    const context = Boolean(dialog.querySelector('.application-school-context'));
    form.elements.school.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      clientX: 0,
      clientY: 0
    }));
    const selectStayedOpen = dialog.open;
    form.elements.name.value = 'Usami Applicant';
    form.elements.name.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 280));
    document.querySelector('[data-service-close]').click();
    document.querySelector('#services [data-service="application"]').click();
    form = dialog.querySelector('[data-application-form]');
    const draftRestored = form.elements.name.value;
    const values = {
      name: 'Usami Applicant',
      contact: 'applicant@example.test',
      origin: 'Outside World',
      identity: 'Human',
      school: 'boundary',
      question: 'How do forgotten routes keep their direction?',
      method: 'Compare maps before and after each boundary crossing.',
      needs: 'Vegetarian meals'
    };
    for (const [name, value] of Object.entries(values)) form.elements[name].value = value;
    form.elements.consent.checked = true;
    form.requestSubmit();
    return {
      open: dialog.open,
      selectStayedOpen,
      preselected,
      context,
      draftRestored,
      reference: dialog.querySelector('.service-success > strong')?.textContent || ''
    };
  })()`);
  check(application.open, "Application dialog did not open.");
  check(application.selectStayedOpen, "Selecting an application option closed the dialog.");
  check(application.preselected === "boundary" && application.context, "School catalogue did not preselect the application.");
  check(application.draftRestored === "Usami Applicant", "Application autosave did not restore the draft.");
  check(/^TU-A-/.test(application.reference), "Application submission did not create a reference.");

  const applicationRecords = await cdp.evaluate(`(() => {
    document.querySelector('.service-success [data-application-records]').click();
    const record = document.querySelector('.application-record-card');
    return {
      records: document.querySelectorAll('.application-record-card').length,
      reference: record?.querySelector('header strong')?.textContent || '',
      school: record?.querySelector('dl > div:last-child dd')?.textContent || '',
      stored: JSON.parse(localStorage.getItem('tu:application:submissions') || '[]').length
    };
  })()`);
  check(applicationRecords.records === 1 && applicationRecords.stored === 1, "Submitted application was not retained.");
  check(applicationRecords.reference === application.reference, "Saved application reference did not match.");
  check(applicationRecords.school.includes("Boundaries"), "Saved application school did not localize.");

  const rooms = await cdp.evaluate(`(() => {
    document.querySelector('[data-service-close]').click();
    document.querySelector('[data-service="availability"]').click();
    return document.querySelectorAll('.room-card').length;
  })()`);
  check(rooms === 6, "Room availability did not render all records.");

  const visit = await cdp.evaluate(`(async () => {
    document.querySelector('[data-service-close]').click();
    document.querySelector('[data-service="visit"]').click();
    let form = document.querySelector('[data-visit-form]');
    form.elements.name.value = 'Merry Visitor';
    form.elements.name.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 280));
    document.querySelector('[data-service-close]').click();
    document.querySelector('[data-service="visit"]').click();
    form = document.querySelector('[data-visit-form]');
    const draftRestored = form.elements.name.value;
    form.elements.contact.value = 'visitor@example.test';
    form.elements.party.value = '2';
    const date = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
    form.elements.date.value = date;
    form.elements.route.value = 'pier';
    form.elements.needs.value = 'Keep the moonlit gangway visible.';
    form.requestSubmit();
    const reference = document.querySelector('.service-success > strong')?.textContent || '';
    document.querySelector('.service-success [data-visit-records]').click();
    return {
      draftRestored,
      reference,
      records: document.querySelectorAll('[data-visit-record]').length,
      stored: JSON.parse(localStorage.getItem('tu:visits') || '[]').length,
      draftCleared: localStorage.getItem('tu:visit:draft') === null,
      route: document.querySelector('[data-visit-record] dl > div:last-child dd')?.textContent || ''
    };
  })()`);
  check(visit.draftRestored === "Merry Visitor", "Campus-visit autosave did not restore the draft.");
  check(/^TU-V-/.test(visit.reference), "Campus visit did not create a visitor-pass reference.");
  check(visit.records === 1 && visit.stored === 1 && visit.draftCleared, "Campus-visit record was not retained.");
  check(visit.route.includes("Misty Lake"), "Campus-visit route did not localize in the record archive.");

  const research = await cdp.evaluate(`(() => {
    document.querySelector('[data-service-close]').click();
    document.querySelector('[data-research="boundary"]').click();
    return {
      open: document.querySelector('[data-research-dialog]').open,
      title: document.querySelector('[data-research-title]').textContent,
      sections: document.querySelectorAll('.research-body section').length
    };
  })()`);
  check(research.open, "Research dialog did not open.");
  check(research.title.includes("Forgotten Objects"), "English research translation failed.");
  check(research.sections === 5, "Boundary research file is incomplete.");

  const spellcard = await cdp.evaluate(`(() => {
    document.querySelector('[data-research-close]').click();
    document.querySelector('[data-research="spellcard"]').click();
    return {
      open: document.querySelector('[data-research-dialog]').open,
      title: document.querySelector('[data-research-title]').textContent,
      sections: document.querySelectorAll('.research-body section').length,
      meta: document.querySelectorAll('.research-meta > div').length
    };
  })()`);
  check(spellcard.open, "Spell-card research dialog did not open.");
  check(spellcard.title.includes("Readability"), "Spell-card research did not use the current locale.");
  check(spellcard.sections === 6 && spellcard.meta === 4, "Spell-card research file is incomplete.");

  const club = await cdp.evaluate(`(() => {
    document.querySelector('[data-research-close]').click();
    document.querySelector('[data-club="bamboo"]').click();
    return {
      open: document.querySelector('[data-info-dialog]').open,
      title: document.querySelector('[data-info-title]').textContent,
      actionVisible: !document.querySelector('[data-info-action]').hidden
    };
  })()`);
  check(club.open, "Club detail interaction did not open.");
  check(club.title.includes("Bamboo Navigation"), "Club detail did not use the current locale.");
  check(club.actionVisible, "Club detail action is not available.");

  const news = await cdp.evaluate(`(() => {
    document.querySelector('[data-info-action]').click();
    const clubActionWorked = !document.querySelector('[data-info-dialog]').open &&
      document.querySelector('[data-bbs-filter="club"]').classList.contains('active');
    document.querySelector('[data-news-id]').click();
    return {
      open: document.querySelector('[data-info-dialog]').open,
      title: document.querySelector('[data-info-title]').textContent.trim().length,
      actionHidden: document.querySelector('[data-info-action]').hidden,
      clubActionWorked
    };
  })()`);
  check(news.open && news.title > 10, "Campus news detail interaction did not open.");
  check(news.actionHidden, "Actionless info card exposed an inert Continue button.");
  check(news.clubActionWorked, "Club info-card action did not reach the BBS.");

  const exam = await cdp.evaluate(`(() => {
    document.querySelector('[data-info-close]').click();
    document.querySelector('[data-exam-start="readiness"]').click();
    const total = document.querySelectorAll('[data-exam-jump]').length;
    for (let index = 0; index < total; index += 1) {
      document.querySelector('[data-exam-jump="' + index + '"]').click();
      document.querySelector('[data-exam-answer="0"]').click();
    }
    document.querySelector('[data-exam-submit]').click();
    const storedRecord = JSON.parse(localStorage.getItem('tu:exam:history') || '[]')[0];
    document.querySelector('[data-exam-records]').click();
    const archive = document.querySelectorAll('.exam-record-card').length;
    document.querySelector('[data-open-exam-record]').click();
    return {
      total,
      result: !document.querySelector('[data-exam-result]').hidden,
      review: document.querySelectorAll('.exam-review details').length,
      history: JSON.parse(localStorage.getItem('tu:exam:history') || '[]').length,
      answersStored: storedRecord.answers.length,
      archive,
      reopened: document.querySelectorAll('.exam-review details').length
    };
  })()`);
  check(exam.total === 8, "Exam did not render eight questions.");
  check(
    exam.result && exam.review === 8 && exam.history === 1 &&
      exam.answersStored === 8 && exam.archive === 1 && exam.reopened === 8,
    "Exam scoring, full-answer persistence, archive, or review reopening failed.",
  );

  const bbs = await cdp.evaluate(`(async () => {
    document.querySelector('[data-bbs-compose]').click();
    const dialog = document.querySelector('[data-compose-dialog]');
    const form = document.querySelector('[data-bbs-form]');
    form.elements.category.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      clientX: 0,
      clientY: 0
    }));
    const selectStayedOpen = dialog.open;
    form.elements.category.value = 'course';
    form.elements.author.value = 'Boundary Student';
    form.elements.title.value = 'Field notes exchange';
    form.elements.body.value = 'Meet beside Boundary Hall after the fifth bell.';
    form.elements.title.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 280));
    document.querySelector('[data-compose-close]').click();
    document.querySelector('[data-bbs-compose]').click();
    const draftRestored = form.elements.title.value;
    form.requestSubmit();
    document.querySelector('[data-user-post] .bbs-row-trigger').click();
    return {
      selectStayedOpen,
      draftRestored,
      saved: JSON.parse(localStorage.getItem('tu:bbs:posts') || '[]').length,
      rendered: document.querySelectorAll('[data-user-post]').length,
      mineActive: document.querySelector('[data-bbs-filter="mine"]').classList.contains('active'),
      visibleMine: !document.querySelector('[data-user-post]').hidden,
      localStatus: document.querySelector('[data-bbs-local]').textContent,
      detailOpen: document.querySelector('[data-info-dialog]').open,
      actionHidden: document.querySelector('[data-info-action]').hidden
    };
  })()`);
  check(bbs.selectStayedOpen, "Selecting a BBS board closed the compose dialog.");
  check(bbs.saved === 1 && bbs.rendered === 1, "BBS post persistence or rendering failed.");
  check(bbs.draftRestored === "Field notes exchange", "BBS autosave did not restore the draft.");
  check(bbs.mineActive && bbs.visibleMine, "Published BBS post was not revealed under My Posts.");
  check(bbs.localStatus.includes("1"), "BBS local record counter did not update.");
  check(bbs.detailOpen, "A deep-linked BBS post did not remain open in the shared information dialog.");
  check(bbs.actionHidden, "BBS detail exposed an inert Continue button.");

  const deepLinks = await cdp.evaluate(`(async () => {
    const bbsHash = location.hash;
    history.back();
    await new Promise((resolve) => setTimeout(resolve, 120));
    const backClosed = !document.querySelector('[data-info-dialog]').open;
    location.hash = 'research-spellcard';
    await new Promise((resolve) => setTimeout(resolve, 80));
    const directResearch = {
      open: document.querySelector('[data-research-dialog]').open,
      hash: location.hash,
      share: Boolean(document.querySelector('[data-research-dialog] [data-deep-link-share]'))
    };
    document.querySelector('[data-research-close]').click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    document.querySelector('[data-search-open]').click();
    const search = document.querySelector('[data-search-dialog]');
    const input = search.querySelector('[data-search-input]');
    input.value = 'spell card';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const searchCount = search.querySelectorAll('[data-search-route]').length;
    search.querySelector('[data-search-route="research-spellcard"]').click();
    await new Promise((resolve) => setTimeout(resolve, 80));
    return {
      bbsHash,
      backClosed,
      directResearch,
      searchCount,
      searchReachedResearch: location.hash === '#research-spellcard' &&
        document.querySelector('[data-research-dialog]').open
    };
  })()`);
  check(deepLinks.bbsHash.startsWith("#bbs-post-"), "BBS post did not synchronize its URL.");
  check(deepLinks.backClosed, "Browser Back did not close a deep-linked content card.");
  check(
    deepLinks.directResearch.open &&
      deepLinks.directResearch.hash === "#research-spellcard" &&
      deepLinks.directResearch.share,
    "Direct research deep link or share control failed.",
  );
  check(deepLinks.searchCount >= 2 && deepLinks.searchReachedResearch, "Full-site search did not reach a deep-linked result.");

  const audience = await cdp.evaluate(`(() => {
    const tabs = document.querySelectorAll('[data-audience]');
    document.querySelector('[data-audience="applicant"]').click();
    return {
      tabs: tabs.length,
      actions: document.querySelectorAll('.audience-route nav a').length,
      saved: localStorage.getItem('tu:audience'),
      gaokaoLink: Boolean(document.querySelector('.audience-route a[href="#gaokao"]'))
    };
  })()`);
  check(
    audience.tabs === 3 && audience.actions === 4 && audience.saved === "applicant" && audience.gaokaoLink,
    "Visitor/applicant/student campus pathways are incomplete.",
  );

  const eientei = await cdp.evaluate(`(async () => {
    document.querySelector('[data-research-close]').click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    location.hash = 'map-eientei';
    await new Promise((resolve) => setTimeout(resolve, 100));
    const focus = document.querySelector('[data-eientei-focus]');
    const actualOptions = focus.querySelectorAll('[data-eientei-phase] option').length;
    const activeBefore = focus.querySelectorAll('.eientei-edge.active').length;
    const phase = focus.querySelector('[data-eientei-phase]');
    phase.value = '4';
    phase.dispatchEvent(new Event('change', { bubbles: true }));
    const fullRoute = [...focus.querySelectorAll('.eientei-route-result li strong')].map((node) => node.textContent).join('>');
    focus.querySelector('[data-eientei-phase]').value = '0';
    focus.querySelector('[data-eientei-phase]').dispatchEvent(new Event('change', { bubbles: true }));
    const newRoute = [...focus.querySelectorAll('.eientei-route-result li strong')].map((node) => node.textContent).join('>');
    return {
      visible: !focus.hidden,
      actualOptions,
      activeBefore,
      fullRoute,
      newRoute,
      clock: focus.querySelector('[data-eientei-clock]').textContent.trim(),
      mapFocused: document.querySelector('#map').classList.contains('is-eientei-focused')
    };
  })()`);
  check(
    eientei.visible && eientei.actualOptions === 9 && eientei.activeBefore >= 3 && eientei.clock.length > 8,
    "Eientei focus map did not render its live lunar route state.",
  );
  check(eientei.fullRoute !== eientei.newRoute, "Changing the lunar phase did not change the Eientei route.");
  check(eientei.mapFocused, "Eientei detail did not put the campus map into focus mode.");

  await cdp.evaluate(`(() => {
    document.querySelector('[data-eientei-close]').click();
    location.hash = 'gaokao';
    document.querySelector('#gaokao').scrollIntoView();
    return true;
  })()`);
  await eventually(() => cdp.evaluate("document.querySelectorAll('[data-gaokao-start]').length === 2"));
  const unifiedExamName = await cdp.evaluate(`(() => {
    document.querySelector('[data-lang="zh-Hant"]').click();
    const eyebrow = document.querySelector('[data-gaokao-header] .eyebrow').textContent.trim();
    document.querySelector('[data-lang="en"]').click();
    return eyebrow;
  })()`);
  check(
    unifiedExamName.includes("幻想鄉統一學力試驗") && !unifiedExamName.includes("高考"),
    "The public Traditional Chinese unified-exam name is inconsistent.",
  );
  const gaokao = await cdp.evaluate(`(async () => {
    const difficultyTabs = document.querySelectorAll('[data-gaokao-difficulty]').length;
    document.querySelector('[data-gaokao-difficulty="lunatic"]').click();
    const lunaticCard = document.querySelector('.gaokao-track').textContent;
    document.querySelector('[data-gaokao-difficulty="extra"]').click();
    const paperLink = document.querySelector('.gaokao-downloads a').getAttribute('href');
    const answerLink = document.querySelectorAll('.gaokao-downloads a')[1].getAttribute('href');
    const paperOkay = (await fetch(paperLink)).ok;
    const answerHtml = await (await fetch(answerLink)).text();
    const chinesePaperHtml = await (await fetch('downloads/gaokao/gke-2026-zh-Hant-extra-humanities-paper.html')).text();
    const chineseNameOkay = chinesePaperHtml.includes('幻想鄉統一學力試驗') &&
      !chinesePaperHtml.includes('高考') &&
      !chinesePaperHtml.includes('高等學力');
    const rotatedExplanationOkay = answerHtml.includes('Answer: D') &&
      answerHtml.includes('G–W–E') &&
      !answerHtml.includes('option B');
    document.querySelector('[data-gaokao-start="humanities"]').click();
    const independentRule = [...document.querySelectorAll('.gaokao-cover li')]
      .some((item) => item.textContent.includes('live campus-map state'));
    const questions = document.querySelectorAll('.gaokao-question');
    const dossiers = document.querySelectorAll('.gaokao-evidence').length;
    questions[0].querySelector('input').click();
    const draftSaved = JSON.parse(localStorage.getItem('tu:gaokao:draft') || 'null');
    questions.forEach((question) => question.querySelector('input').click());
    document.querySelector('[data-gaokao-submit]').click();
    const storedRecord = JSON.parse(localStorage.getItem('tu:gaokao:attempts') || '[]')[0];
    document.querySelector('[data-gaokao-records]').click();
    const archive = document.querySelectorAll('.gaokao-record-card').length;
    document.querySelector('[data-open-gaokao-record]').click();
    return {
      difficultyTabs,
      lunaticCard,
      independentRule,
      paperOkay,
      chineseNameOkay,
      rotatedExplanationOkay,
      total: questions.length,
      dossiers,
      draftSaved: Boolean(draftSaved && draftSaved.difficultyId === 'extra' && Object.keys(draftSaved.answers).length === 1),
      result: Boolean(document.querySelector('.gaokao-result')),
      review: document.querySelectorAll('.gaokao-review details').length,
      attempts: JSON.parse(localStorage.getItem('tu:gaokao:attempts') || '[]').length,
      answersStored: Object.keys(storedRecord.answers || {}).length,
      archive,
      reopenedDifficulty: document.querySelector('.gaokao-result > header p')?.textContent || ''
    };
  })()`);
  check(gaokao.difficultyTabs === 4 && gaokao.lunaticCard.includes("12 questions"), "Four gaokao difficulties or LUNATIC paper metadata failed.");
  check(gaokao.independentRule, "Unified-exam rules do not distinguish question conditions from the live campus map.");
  check(gaokao.paperOkay, "Offline EXTRA Gensokyo examination paper is not downloadable.");
  check(gaokao.chineseNameOkay, "Offline Traditional Chinese papers use the old public examination name.");
  check(gaokao.rotatedExplanationOkay, "Offline EXTRA answer key contradicts its rotated correct choice.");
  check(gaokao.total === 12 && gaokao.dossiers === 12 && gaokao.draftSaved, "EXTRA paper dossiers or autosave are incomplete.");
  check(
    gaokao.result && gaokao.review === 12 && gaokao.attempts === 1 &&
      gaokao.answersStored === 12 && gaokao.archive === 1 && gaokao.reopenedDifficulty.includes("EXTRA"),
    "Gensokyo examination scoring, full-answer persistence, archive, or review reopening failed.",
  );

  const mytu = await cdp.evaluate(`(async () => {
    location.hash = 'my-tu';
    await new Promise((resolve) => setTimeout(resolve, 260));
    const form = document.querySelector('[data-mytu-profile-form]');
    form.elements.name.value = 'Usami Applicant';
    form.elements.kind.value = 'human';
    form.elements.origin.value = 'outside';
    form.elements.preferredSchool.value = 'boundary';
    form.elements.lunar.checked = true;
    form.elements.housing.value = 'A quiet room away from the fourth lantern.';
    form.requestSubmit();
    const identity = JSON.parse(localStorage.getItem('tu:identity') || 'null');
    const summaryBefore = [...document.querySelectorAll('.mytu-summary a strong')].map((node) => node.textContent.trim());
    document.querySelector('[data-mytu-review]').click();
    const review = JSON.parse(localStorage.getItem('tu:application:reviews') || '[]')[0];
    const reviewers = document.querySelectorAll('.mytu-reviewers article').length;
    const outcome = document.querySelector('.mytu-decision h4')?.textContent || '';
    document.querySelector('[data-mytu-document-open]').click();
    const documentDialog = document.querySelector('[data-mytu-document-dialog]');
    const documentText = documentDialog.querySelector('[data-mytu-document]').textContent;
    const weave = documentDialog.querySelectorAll('.mytu-verification i').length;
    documentDialog.querySelector('[data-mytu-document-close]').click();
    return {
      identityId: identity?.id || '',
      preferredSchool: identity?.preferredSchool || '',
      summaryBefore,
      reviewId: review?.id || '',
      reviewOutcome: review?.outcome || '',
      reviewers,
      outcome,
      documentOpen: documentDialog.open,
      documentText,
      weave,
      ledger: JSON.parse(localStorage.getItem('tu:campus:ledger') || '[]').length
    };
  })()`);
  check(/^TU-S-/.test(mytu.identityId) && mytu.preferredSchool === "boundary", "My TU identity was not retained.");
  check(mytu.summaryBefore.join("/") === "1/2/1/1", "My TU did not aggregate applications, exams, visits, and BBS records.");
  check(/^TU-R-/.test(mytu.reviewId) && mytu.reviewers === 3 && mytu.outcome.length > 4, "Joint faculty review is incomplete.");
  check(
    mytu.documentOpen === false &&
      mytu.documentText.includes(application.reference) &&
      mytu.documentText.includes(mytu.reviewId) &&
      mytu.weave === 121,
    "Printable admissions decision is incomplete or did not close.",
  );
  check(mytu.ledger >= 7, "Campus event ledger did not compile the student lifecycle.");

  const japanese = await cdp.evaluate(`(() => {
    document.querySelector('[data-lang="ja"]').click();
    document.querySelector('[data-map-place="library"]').click();
    return {
      lang: document.documentElement.lang,
      title: document.querySelector('#services-title').textContent.trim(),
      map: document.querySelector('[data-map-name]').textContent.trim(),
      mapImage: document.querySelector('[data-map-image]').getAttribute('src'),
      mapAlt: document.querySelector('[data-map-image]').getAttribute('alt')
    };
  })()`);
  check(japanese.lang === "ja", "Japanese locale switch failed.");
  check(japanese.title === "今日は何をしますか？", "Japanese static translation failed.");
  check(japanese.map === "霧の湖図書館", "Japanese dynamic map translation failed.");
  check(japanese.mapImage.endsWith("library.webp"), "Map place image did not change with the selected spot.");
  check(japanese.mapAlt.includes("霧の湖図書館"), "Map image alternative text did not localize.");

  await cdp.call("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  const mobileDeepLink = await cdp.evaluate(`(async () => {
    location.hash = 'campus';
    await new Promise((resolve) => setTimeout(resolve, 120));
    const trigger = document.querySelector('[data-campus-feature="library"]');
    const sourceY = Math.max(0, trigger.getBoundingClientRect().top + window.scrollY - 130);
    window.scrollTo(0, sourceY);
    await new Promise((resolve) => setTimeout(resolve, 80));
    const firstOriginY = window.scrollY;
    trigger.click();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const firstRoute = location.hash;
    document.querySelector('[data-info-close]').click();
    await new Promise((resolve) => setTimeout(resolve, 220));
    const firstReturn = { hash: location.hash, delta: Math.abs(window.scrollY - firstOriginY) };

    trigger.click();
    await new Promise((resolve) => setTimeout(resolve, 80));
    document.querySelector('[data-info-action]').click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const nestedRoute = location.hash;
    document.querySelector('[data-service-close]').click();
    await new Promise((resolve) => setTimeout(resolve, 220));
    return {
      firstRoute,
      firstReturn,
      nestedRoute,
      finalHash: location.hash,
      finalDelta: Math.abs(window.scrollY - firstOriginY),
      infoOpen: document.querySelector('[data-info-dialog]').open,
      serviceOpen: document.querySelector('[data-service-dialog]').open
    };
  })()`);
  check(
    mobileDeepLink.firstRoute === "#campus-library" &&
      mobileDeepLink.firstReturn.hash === "#campus" &&
      mobileDeepLink.firstReturn.delta <= 4,
    "Closing a mobile content card did not restore its exact page context.",
  );
  check(
    mobileDeepLink.nestedRoute === "#service-availability" &&
      mobileDeepLink.finalHash === "#campus" &&
      mobileDeepLink.finalDelta <= 4 &&
      !mobileDeepLink.infoOpen &&
      !mobileDeepLink.serviceOpen,
    "A nested mobile card action resurfaced a previous deep link or lost its scroll position.",
  );
  const mobile = await cdp.evaluate(`(() => {
    document.querySelector('[data-menu-toggle]').click();
    const label = document.querySelector('[data-map-place="clinic"] strong');
    return {
      menuOpen: !document.querySelector('[data-mobile-menu]').hidden,
      widthOkay: document.documentElement.scrollWidth <= window.innerWidth,
      mapLabelVisible: getComputedStyle(label).display !== 'none' && label.textContent.trim().length > 0
    };
  })()`);
  check(mobile.menuOpen, "Mobile navigation did not open.");
  check(mobile.widthOkay, "Mobile layout has horizontal overflow.");
  check(mobile.mapLabelVisible, "Mobile campus-map place names are not discoverable.");

  await cdp.call("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await cdp.call("Page.navigate", { url: `${siteUrl}#map-eientei` });
  await eventually(() =>
    cdp.evaluate("document.readyState === 'complete' && !document.querySelector('[data-eientei-focus]').hidden"),
  );
  await cdp.evaluate("import('./src/js/gaokao.js').then((module) => { module.initGaokao(); return true; })");
  await eventually(() => cdp.evaluate("document.querySelectorAll('[data-gaokao-start]').length === 2"));
  await delay(2300);
  const desktopDirectMap = await cdp.evaluate(`(() => {
    const target = document.querySelector('[data-eientei-focus]');
    const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    return {
      delta: Math.abs(target.getBoundingClientRect().top - offset),
      gaokaoLoaded: document.querySelectorAll('[data-gaokao-start]').length === 2,
      visible: !target.hidden
    };
  })()`);
  check(
    desktopDirectMap.visible && desktopDirectMap.gaokaoLoaded && desktopDirectMap.delta <= 6,
    `A cold desktop #map-eientei link drifted after lazy sections changed the page height: ${JSON.stringify(desktopDirectMap)}`,
  );

  await cdp.call("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await cdp.call("Page.navigate", { url: `${siteUrl}#map-eientei` });
  await eventually(() =>
    cdp.evaluate("document.readyState === 'complete' && !document.querySelector('[data-eientei-focus]').hidden"),
  );
  await cdp.evaluate("import('./src/js/gaokao.js').then((module) => { module.initGaokao(); return true; })");
  await eventually(() => cdp.evaluate("document.querySelectorAll('[data-gaokao-start]').length === 2"));
  await delay(2300);
  const mobileDirectMap = await cdp.evaluate(`(() => {
    const target = document.querySelector('[data-eientei-focus]');
    const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    return {
      delta: Math.abs(target.getBoundingClientRect().top - offset),
      gaokaoLoaded: document.querySelectorAll('[data-gaokao-start]').length === 2,
      visible: !target.hidden
    };
  })()`);
  check(
    mobileDirectMap.visible && mobileDirectMap.gaokaoLoaded && mobileDirectMap.delta <= 6,
    `A cold mobile #map-eientei link drifted into the unified-exam section: ${JSON.stringify(mobileDirectMap)}`,
  );

  const anchorAudit = await cdp.evaluate(`(async () => {
    const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    const measure = (selector) => {
      const target = document.querySelector(selector);
      const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const absoluteTop = window.scrollY + target.getBoundingClientRect().top;
      const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const expected = Math.min(maximum, Math.max(0, absoluteTop - offset));
      return {
        delta: Math.abs(window.scrollY - expected),
        scrollY: window.scrollY,
        expected,
        top: target.getBoundingClientRect().top,
        offset
      };
    };
    const staticRoutes = [...new Set(
      [...document.querySelectorAll('a[href^="#"]')]
        .map((link) => decodeURIComponent(link.hash.slice(1)))
        .filter((route) => route && document.getElementById(route))
    )];
    const staticResults = [];
    for (const route of staticRoutes) {
      location.hash = route;
      await wait(520);
      staticResults.push({ route, ...measure('#' + CSS.escape(route)) });
    }

    const firstBbsId = document.querySelector('[data-bbs-id]')?.dataset.bbsId;
    const deepRoutes = [
      ['school-boundary', '#academics', '[data-school-dialog]'],
      ['faculty-reimu', '#faculty', '[data-faculty-dialog]'],
      ['research-spellcard', '#research', '[data-research-dialog]'],
      ['campus-library', '#campus', '[data-info-dialog]'],
      ['club-grimoire', '#campus', '[data-info-dialog]'],
      ['service-availability', '#services', '[data-service-dialog]'],
      ['search', '#top', '[data-search-dialog]'],
      ...(firstBbsId ? [['bbs-' + firstBbsId, '#bbs', '[data-info-dialog]']] : []),
    ];
    const deepResults = [];
    for (const [route, anchor, dialogSelector] of deepRoutes) {
      location.hash = route;
      await wait(520);
      deepResults.push({
        route,
        ...measure(anchor),
        open: Boolean(document.querySelector(dialogSelector)?.open)
      });
    }
    return { staticResults, deepResults };
  })()`, 30000);
  check(
    anchorAudit.staticResults.length >= 12 &&
      anchorAudit.staticResults.every((result) => result.delta <= 6),
    `Static hash targets drifted: ${JSON.stringify(anchorAudit.staticResults.filter((result) => result.delta > 6))}`,
  );
  check(
    anchorAudit.deepResults.length === 8 &&
      anchorAudit.deepResults.every((result) => result.open && result.delta <= 6),
    `Deep-link families opened over the wrong section: ${JSON.stringify(anchorAudit.deepResults.filter((result) => !result.open || result.delta > 6))}`,
  );

  await delay(300);
  check(errors.length === 0, `Browser reported errors: ${errors.join(" | ")}`);
} finally {
  cdp?.close();
  browser.kill("SIGTERM");
  server.kill("SIGTERM");
  await delay(150);
  await rm(profile, { recursive: true, force: true });
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Browser smoke test passed: all hash/deep-link targets, mobile restoration, My TU, Eientei, both exams, persistence, i18n, and navigation.");
