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
    return {
      total,
      result: !document.querySelector('[data-exam-result]').hidden,
      review: document.querySelectorAll('.exam-review details').length,
      history: JSON.parse(localStorage.getItem('tu:exam:history') || '[]').length
    };
  })()`);
  check(exam.total === 8, "Exam did not render eight questions.");
  check(exam.result && exam.review === 8 && exam.history === 1, "Exam scoring, review, or history failed.");

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
      actionHidden: document.querySelector('[data-info-action]').hidden
    };
  })()`);
  check(bbs.selectStayedOpen, "Selecting a BBS board closed the compose dialog.");
  check(bbs.saved === 1 && bbs.rendered === 1, "BBS post persistence or rendering failed.");
  check(bbs.draftRestored === "Field notes exchange", "BBS autosave did not restore the draft.");
  check(bbs.mineActive && bbs.visibleMine, "Published BBS post was not revealed under My Posts.");
  check(bbs.localStatus.includes("1"), "BBS local record counter did not update.");
  check(bbs.actionHidden, "BBS detail exposed an inert Continue button.");

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
  const mobile = await cdp.evaluate(`(() => {
    document.querySelector('[data-menu-toggle]').click();
    return {
      menuOpen: !document.querySelector('[data-mobile-menu]').hidden,
      widthOkay: document.documentElement.scrollWidth <= window.innerWidth
    };
  })()`);
  check(mobile.menuOpen, "Mobile navigation did not open.");
  check(mobile.widthOkay, "Mobile layout has horizontal overflow.");

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

console.log("Browser smoke test passed: schools, routes, research, selects, i18n, map cards, news, clubs, exams, BBS, and mobile navigation.");
