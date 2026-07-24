import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argumentsMap = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((argument) => argument.startsWith("--") && argument.includes("="))
    .map((argument) => argument.slice(2).split(/=(.*)/s).slice(0, 2)),
);
const section = (argumentsMap.section || "main").replace(/^#/, "");
const page = argumentsMap.page || "index.html";
if (page.includes("..") || /^[a-z]+:/i.test(page)) {
  console.error("--page must be a repository-relative HTML path.");
  process.exit(1);
}
const clickSelector = argumentsMap.click || "";
const clickSelectors = clickSelector.split(";;").map((value) => value.trim()).filter(Boolean);
let storageSeed = null;
if (argumentsMap.storage) {
  try {
    storageSeed = JSON.parse(argumentsMap.storage);
  } catch {
    console.error("--storage must be a JSON object whose values will be saved to localStorage.");
    process.exit(1);
  }
}
const width = Number(argumentsMap.width || 1440);
const height = Number(argumentsMap.height || 1000);
const pageLabel = page.split(/[?#]/)[0].replace(/\.html$/, "") || "index";
const output = path.resolve(argumentsMap.output || `/tmp/touhou-university-${pageLabel}-${section}-${width}x${height}.png`);
const sitePort = Number(process.env.CAPTURE_SITE_PORT || 4192);
const debugPort = Number(process.env.CAPTURE_DEBUG_PORT || 9335);
const siteUrl = `http://127.0.0.1:${sitePort}/`;
const chrome = [
  process.env.CHROME_BIN,
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean).find(existsSync);

if (!chrome) {
  console.error("UI capture requires Google Chrome or Chromium.");
  process.exit(1);
}
if (!Number.isFinite(width) || !Number.isFinite(height) || width < 320 || height < 320) {
  console.error("Width and height must be numeric values of at least 320.");
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
    "--hide-scrollbars",
    `--remote-debugging-port=${debugPort}`,
    `--window-size=${width},${height}`,
    new URL(page, siteUrl).href,
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
    this.socket = new WebSocket(url);
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    });
  }

  call(method, parameters = {}) {
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params: parameters }));
    });
  }

  async evaluate(expression) {
    const response = await this.call("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
    return response.result.value;
  }

  close() {
    this.socket.close();
  }
}

let cdp;
try {
  await eventually(async () => (await fetch(siteUrl)).ok);
  const target = await eventually(async () => {
    const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
    return targets.find((item) => item.type === "page" && item.url.startsWith(siteUrl));
  });
  cdp = new Cdp(target.webSocketDebuggerUrl);
  await cdp.open();
  await Promise.all([cdp.call("Runtime.enable"), cdp.call("Page.enable")]);
  await eventually(() => cdp.evaluate("document.readyState === 'complete'"));
  if (storageSeed && typeof storageSeed === "object" && !Array.isArray(storageSeed)) {
    await cdp.evaluate(`(() => {
      const seed = ${JSON.stringify(storageSeed)};
      Object.entries(seed).forEach(([key, value]) => {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      });
      return true;
    })()`);
    await cdp.call("Page.reload");
    await eventually(() => cdp.evaluate("document.readyState === 'complete'"));
  }
  await cdp.call("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 760,
  });
  const found = await cdp.evaluate(`(() => {
    const target = document.querySelector(${JSON.stringify(section === "main" ? "main" : `#${section}`)});
    if (!target) return false;
    document.documentElement.style.scrollBehavior = "auto";
    target.classList.add("is-visible");
    target.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
    window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY);
    return true;
  })()`);
  if (!found) throw new Error(`Section "#${section}" was not found.`);
  for (const selector of clickSelectors) {
    await eventually(() =>
      cdp.evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`),
    );
    const clicked = await cdp.evaluate(`(() => {
      const trigger = document.querySelector(${JSON.stringify(selector)});
      if (!trigger) return false;
      trigger.click();
      return true;
    })()`);
    if (!clicked) throw new Error(`Click target "${selector}" was not found.`);
    await delay(180);
  }
  await delay(650);
  const screenshot = await cdp.call("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(output, Buffer.from(screenshot.data, "base64"));
  console.log(`Captured ${page} #${section} at ${width}x${height}: ${output}`);
} finally {
  cdp?.close();
  browser.kill("SIGTERM");
  server.kill("SIGTERM");
}
