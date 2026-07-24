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
    widthOkay: document.documentElement.scrollWidth <= window.innerWidth
  })`);
  check(initial.lang === "zh-Hant", "Default locale is not Traditional Chinese.");
  check(initial.services >= 8, "Campus service triggers are missing.");
  check(initial.research === 4, "Research file triggers are incomplete.");
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

  const application = await cdp.evaluate(`(() => {
    document.querySelector('[data-service="application"]').click();
    const dialog = document.querySelector('[data-service-dialog]');
    const form = dialog.querySelector('[data-application-form]');
    const values = {
      name: 'Usami Applicant',
      contact: 'applicant@example.test',
      origin: 'Outside World',
      identity: 'Human',
      school: 'Boundaries & Incidents',
      question: 'How do forgotten routes keep their direction?',
      method: 'Compare maps before and after each boundary crossing.',
      needs: 'Vegetarian meals'
    };
    for (const [name, value] of Object.entries(values)) form.elements[name].value = value;
    form.elements.consent.checked = true;
    form.requestSubmit();
    return {
      open: dialog.open,
      reference: dialog.querySelector('.service-success > strong')?.textContent || ''
    };
  })()`);
  check(application.open, "Application dialog did not open.");
  check(/^TU-A-/.test(application.reference), "Application submission did not create a reference.");

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

  const bbs = await cdp.evaluate(`(() => {
    document.querySelector('[data-research-close]').click();
    document.querySelector('[data-bbs-compose]').click();
    const form = document.querySelector('[data-bbs-form]');
    form.elements.category.value = 'course';
    form.elements.author.value = 'Boundary Student';
    form.elements.title.value = 'Field notes exchange';
    form.elements.body.value = 'Meet beside Boundary Hall after the fifth bell.';
    form.requestSubmit();
    return {
      saved: JSON.parse(localStorage.getItem('tu:bbs:posts') || '[]').length,
      rendered: document.querySelectorAll('[data-user-post]').length
    };
  })()`);
  check(bbs.saved === 1 && bbs.rendered === 1, "BBS post persistence or rendering failed.");

  const japanese = await cdp.evaluate(`(() => {
    document.querySelector('[data-lang="ja"]').click();
    document.querySelector('[data-map-place="library"]').click();
    return {
      lang: document.documentElement.lang,
      title: document.querySelector('#services-title').textContent.trim(),
      map: document.querySelector('[data-map-name]').textContent.trim()
    };
  })()`);
  check(japanese.lang === "ja", "Japanese locale switch failed.");
  check(japanese.title === "今日は何をしますか？", "Japanese static translation failed.");
  check(japanese.map === "霧の湖図書館", "Japanese dynamic map translation failed.");

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

console.log("Browser smoke test passed: i18n, application, rooms, research, BBS, and mobile navigation.");
