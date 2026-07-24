import { getLocale } from "./i18n.js";
import { closeDeepLink, registerDeepLink } from "./deep-links.js";

const root = document.querySelector("[data-eientei-focus]");
const app = root?.querySelector("[data-eientei-app]");

const nodes = {
  eastGate: { x: 82, y: 444, glyph: "東" },
  rabbitStop: { x: 194, y: 385, glyph: "兎" },
  lanternFork: { x: 294, y: 289, glyph: "灯" },
  falseClearing: { x: 223, y: 145, glyph: "偽" },
  eienteiGate: { x: 430, y: 341, glyph: "門" },
  mainHall: { x: 552, y: 347, glyph: "亭" },
  pharmacy: { x: 625, y: 238, glyph: "薬" },
  clinic: { x: 735, y: 361, glyph: "診" },
  courtyard: { x: 606, y: 98, glyph: "月" },
  storehouse: { x: 782, y: 163, glyph: "蔵" },
};

const names = {
  "zh-Hant": {
    eastGate: "竹林東口", rabbitStop: "兔車候車棚", lanternFork: "三盞燈岔路", falseClearing: "昨日的空地",
    eienteiGate: "永遠亭表門", mainHall: "永遠亭本館", pharmacy: "月藥調劑室", clinic: "跨種族診療所",
    courtyard: "望月中庭", storehouse: "月塵冷藏庫",
  },
  ja: {
    eastGate: "竹林東口", rabbitStop: "兎車待合所", lanternFork: "三灯分岐", falseClearing: "昨日の空地",
    eienteiGate: "永遠亭表門", mainHall: "永遠亭本館", pharmacy: "月薬調剤室", clinic: "種族横断診療所",
    courtyard: "望月中庭", storehouse: "月塵冷蔵庫",
  },
  en: {
    eastGate: "East Bamboo Gate", rabbitStop: "Rabbit Shuttle Shelter", lanternFork: "Three-Lantern Fork",
    falseClearing: "Yesterday's Clearing", eienteiGate: "Eientei Front Gate", mainHall: "Eientei Main House",
    pharmacy: "Lunar Pharmacy", clinic: "Cross-Species Clinic", courtyard: "Moon-Viewing Court",
    storehouse: "Lunar-Dust Cold Store",
  },
};

const moonNames = {
  "zh-Hant": ["朔月", "眉月", "上弦月", "盈凸月", "滿月", "虧凸月", "下弦月", "殘月"],
  ja: ["新月", "三日月", "上弦", "十三夜", "満月", "寝待月", "下弦", "有明月"],
  en: ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"],
};

const moonGlyphs = ["●", "◔", "◑", "◕", "○", "◕", "◐", "◔"];

const copy = {
  "zh-Hant": {
    kicker: "EIENTEI FOCUS MAP / 永遠亭・迷途竹林",
    title: "路每天都在，位置不一定。",
    lead: "聚焦圖使用這台裝置的日期、時間與月相。竹林岔路會按日輪替；入夜點亮兔燈，滿月時診療動線改由調劑室分流。",
    back: "返回主校區",
    now: "本機時間",
    phase: "月相",
    dayShift: "今日竹向",
    auto: "跟隨今日月相",
    preview: "月相預覽",
    from: "從哪裡出發",
    to: "要去哪裡",
    route: "計算竹林路線",
    minutes: "分鐘",
    steps: "段路",
    status: "今晚的路況",
    day: "日間：紙牌路標可讀，昨日的空地不保證存在。",
    dusk: "黃昏：兔燈正在點亮，東口候車時間增加一分鐘。",
    night: "夜間：跟三盞燈走，不要跟第四盞燈走。",
    full: "滿月管制：本館至診療所直廊封閉，先經調劑室。",
    new: "朔月捷徑：三盞燈岔路至調劑室的藥香小徑開放。",
    shift: ["竹葉向東，北側舊路縮短。", "竹葉向南，昨日的空地向西移一格。", "竹葉向西，兔車道較乾燥。"],
    start: "起點",
    arrive: "抵達",
    noRoute: "這個時刻沒有可靠路線。請回東口等一輛寫著今日日期的兔車。",
  },
  ja: {
    kicker: "EIENTEI FOCUS MAP / 永遠亭・迷いの竹林",
    title: "道は毎日ある。位置は毎日同じとは限らない。",
    lead: "端末の日付・時刻・月相で変化する詳細図。竹林分岐は日替わり、夜は兎灯、満月は調剤室経由の診療動線になります。",
    back: "メインキャンパスへ",
    now: "端末時刻",
    phase: "月相",
    dayShift: "本日の竹向き",
    auto: "今日の月相に従う",
    preview: "月相プレビュー",
    from: "出発地",
    to: "目的地",
    route: "竹林経路を計算",
    minutes: "分",
    steps: "区間",
    status: "今夜の経路状況",
    day: "昼：紙の道標は読めます。昨日の空地は存在を保証しません。",
    dusk: "夕刻：兎灯を点灯中。東口の待ち時間が1分増えます。",
    night: "夜：三つの灯を追い、四つ目は追わないでください。",
    full: "満月規制：本館―診療所直廊を閉鎖し、調剤室を経由。",
    new: "新月近道：三灯分岐―調剤室の薬香小径が開きます。",
    shift: ["竹葉は東向き。北側旧道が短縮。", "竹葉は南向き。昨日の空地が西へ一目移動。", "竹葉は西向き。兎車道は比較的乾燥。"],
    start: "出発",
    arrive: "到着",
    noRoute: "信頼できる経路がありません。東口で今日の日付を掲げた兎車を待ってください。",
  },
  en: {
    kicker: "EIENTEI FOCUS MAP / EIENTEI & BAMBOO FOREST",
    title: "The road exists every day. Its location may not.",
    lead: "This detail map follows your device date, time, and lunar phase. Bamboo forks rotate daily; rabbit lamps appear at night; full-moon clinic traffic diverts through the pharmacy.",
    back: "Back to main campus",
    now: "Device time",
    phase: "Lunar phase",
    dayShift: "Today's bamboo",
    auto: "Follow today's moon",
    preview: "Moon preview",
    from: "Starting point",
    to: "Destination",
    route: "Calculate bamboo route",
    minutes: "min",
    steps: "segments",
    status: "Tonight's route status",
    day: "Day: paper signs are legible. Yesterday's Clearing is not guaranteed to exist.",
    dusk: "Dusk: rabbit lamps are being lit; add one minute at the east gate.",
    night: "Night: follow three lanterns. Do not follow a fourth.",
    full: "Full-moon control: the main-house clinic corridor is closed; divert through Pharmacy.",
    new: "New-moon shortcut: the scented path from Three-Lantern Fork to Pharmacy is open.",
    shift: ["Leaves point east; the old north path is shorter.", "Leaves point south; Yesterday's Clearing shifts one square west.", "Leaves point west; the rabbit road is drier."],
    start: "Start",
    arrive: "Arrive",
    noRoute: "No reliable route at this hour. Return east and wait for a rabbit shuttle displaying today's date.",
  },
};

let phaseOverride = "auto";
let currentRoute = null;
let clockTimer;

function lunarPhase(date) {
  const synodic = 29.530588853;
  const epoch = Date.UTC(2000, 0, 6, 18, 14);
  const age = (((date.getTime() - epoch) / 86_400_000) % synodic + synodic) % synodic;
  return Math.round((age / synodic) * 8) % 8;
}

function timeBand(date) {
  const hour = date.getHours() + date.getMinutes() / 60;
  if (hour >= 17 && hour < 19.5) return "dusk";
  if (hour >= 19.5 || hour < 5) return "night";
  return "day";
}

function dayIndex(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86_400_000) % 3;
}

function edgesFor(date, phase) {
  const band = timeBand(date);
  const shift = dayIndex(date);
  const edges = [
    ["eastGate", "rabbitStop", 4 + (band === "dusk" ? 1 : 0), "walk"],
    ["rabbitStop", "lanternFork", 4 + (band === "night" ? 1 : 0), "lamp"],
    ["lanternFork", "eienteiGate", 7 - (shift === 0 ? 1 : 0), "bamboo"],
    ["rabbitStop", "eienteiGate", 10 - (shift === 2 ? 2 : 0), "rabbit"],
    ["lanternFork", "falseClearing", 4 + shift, "bamboo"],
    ["falseClearing", "courtyard", 8 - (band === "night" ? 2 : 0), "moon"],
    ["eienteiGate", "mainHall", 2, "corridor"],
    ["mainHall", "pharmacy", 3, "corridor"],
    ["pharmacy", "clinic", 2, "corridor"],
    ["pharmacy", "courtyard", 4, "corridor"],
    ["courtyard", "storehouse", 4 + (phase === 4 ? 0 : 2), "moon"],
    ["clinic", "storehouse", 4, "corridor"],
  ];
  if (phase !== 4) edges.push(["mainHall", "clinic", 3, "corridor"]);
  if (phase === 0 || phase === 7) edges.push(["lanternFork", "pharmacy", 5, "scent"]);
  return edges;
}

function routeBetween(from, to, date, phase) {
  const edges = edgesFor(date, phase);
  const distances = new Map(Object.keys(nodes).map((id) => [id, Infinity]));
  const previous = new Map();
  const unvisited = new Set(Object.keys(nodes));
  distances.set(from, 0);
  while (unvisited.size) {
    const current = [...unvisited].sort((a, b) => distances.get(a) - distances.get(b))[0];
    if (!current || distances.get(current) === Infinity) break;
    unvisited.delete(current);
    if (current === to) break;
    edges.forEach(([a, b, minutes, kind]) => {
      if (a !== current && b !== current) return;
      const next = a === current ? b : a;
      if (!unvisited.has(next)) return;
      const candidate = distances.get(current) + minutes;
      if (candidate < distances.get(next)) {
        distances.set(next, candidate);
        previous.set(next, { node: current, edge: [a, b, minutes, kind] });
      }
    });
  }
  if (distances.get(to) === Infinity) return null;
  const path = [to];
  const usedEdges = [];
  while (path[0] !== from) {
    const step = previous.get(path[0]);
    if (!step) return null;
    usedEdges.unshift(step.edge);
    path.unshift(step.node);
  }
  return { path, edges: usedEdges, minutes: distances.get(to) };
}

function stateNow() {
  const date = new Date();
  const actualPhase = lunarPhase(date);
  return {
    date,
    phase: phaseOverride === "auto" ? actualPhase : Number(phaseOverride),
    actualPhase,
    band: timeBand(date),
    shift: dayIndex(date),
  };
}

function edgeKey(a, b) {
  return [a, b].sort().join("--");
}

function mapSvg(state, route) {
  const locale = getLocale();
  const edges = edgesFor(state.date, state.phase);
  const active = new Set((route?.edges || []).map(([a, b]) => edgeKey(a, b)));
  return `
    <svg viewBox="0 0 860 510" role="img" aria-label="${copy[locale].kicker}">
      <defs>
        <pattern id="bamboo-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M16 0v32M0 16h32" stroke="currentColor" stroke-opacity=".08" stroke-width="1"/>
        </pattern>
        <filter id="soft-glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="860" height="510" fill="url(#bamboo-grid)"/>
      <path class="eientei-bamboo-mass" d="M0 0h390v510H0zM390 0h470v76H520l-64 73-66 80z"/>
      <path class="eientei-roof" d="M388 291l120-70 181 57 131-6 28 176H400z"/>
      ${edges.map(([a, b, , kind]) => {
        const from = nodes[a];
        const to = nodes[b];
        const key = edgeKey(a, b);
        const curve = kind === "bamboo" || kind === "scent" ? 28 : 0;
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2 - curve;
        return `<path class="eientei-edge edge-${kind}${active.has(key) ? " active" : ""}" data-eientei-edge="${key}"
          d="M${from.x} ${from.y} Q${midX} ${midY} ${to.x} ${to.y}"/>`;
      }).join("")}
      ${Object.entries(nodes).map(([id, node]) => `
        <g class="eientei-node${route?.path.includes(id) ? " active" : ""}" transform="translate(${node.x} ${node.y})">
          <circle r="17"/><text text-anchor="middle" dominant-baseline="central">${node.glyph}</text>
          <foreignObject x="-68" y="23" width="136" height="42">
            <div xmlns="http://www.w3.org/1999/xhtml">${names[locale][id]}</div>
          </foreignObject>
        </g>`).join("")}
      <g class="eientei-moon" transform="translate(800 48)">
        <circle r="29"/><text text-anchor="middle" dominant-baseline="central">${moonGlyphs[state.phase]}</text>
      </g>
    </svg>`;
}

function renderResult(route, state) {
  const locale = getLocale();
  const c = copy[locale];
  if (!route) return `<p class="eientei-no-route">${c.noRoute}</p>`;
  return `
    <div class="eientei-route-summary">
      <strong>${route.minutes}<small>${c.minutes}</small></strong>
      <span>${route.edges.length} ${c.steps}</span>
    </div>
    <ol>
      ${route.path.map((id, index) => `
        <li>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div><strong>${names[locale][id]}</strong><small>${index === 0 ? c.start : index === route.path.length - 1 ? c.arrive : `${route.edges[index - 1][2]} ${c.minutes}`}</small></div>
        </li>`).join("")}
    </ol>
    <p>${state.phase === 4 ? c.full : state.phase === 0 ? c.new : c[state.band]}</p>`;
}

function render({ preserveSelection = true } = {}) {
  if (!app) return;
  const locale = getLocale();
  const c = copy[locale];
  const state = stateNow();
  const previousFrom = preserveSelection ? app.querySelector("[data-eientei-from]")?.value : null;
  const previousTo = preserveSelection ? app.querySelector("[data-eientei-to]")?.value : null;
  const from = previousFrom && nodes[previousFrom] ? previousFrom : "eastGate";
  const to = previousTo && nodes[previousTo] ? previousTo : "clinic";
  currentRoute = routeBetween(from, to, state.date, state.phase);
  const time = new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "short" }).format(state.date);
  app.innerHTML = `
    <header class="eientei-head">
      <div>
        <p>${c.kicker}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
      </div>
      <button type="button" data-eientei-close>← ${c.back}</button>
    </header>
    <div class="eientei-state">
      <div><span>${c.now}</span><strong data-eientei-clock>${time}</strong></div>
      <div><span>${c.phase}</span><strong>${moonGlyphs[state.phase]} ${moonNames[locale][state.phase]}</strong></div>
      <div><span>${c.dayShift}</span><strong>${c.shift[state.shift]}</strong></div>
    </div>
    <div class="eientei-layout eientei-time-${state.band} eientei-phase-${state.phase}">
      <div class="eientei-map-frame">${mapSvg(state, currentRoute)}</div>
      <aside class="eientei-controls">
        <label>${c.preview}
          <select data-eientei-phase>
            <option value="auto">${c.auto}</option>
            ${moonNames[locale].map((name, index) => `<option value="${index}">${moonGlyphs[index]} ${name}</option>`).join("")}
          </select>
        </label>
        <form data-eientei-route-form>
          <label>${c.from}<select data-eientei-from>${Object.keys(nodes).map((id) => `<option value="${id}">${names[locale][id]}</option>`).join("")}</select></label>
          <label>${c.to}<select data-eientei-to>${Object.keys(nodes).map((id) => `<option value="${id}">${names[locale][id]}</option>`).join("")}</select></label>
          <button type="submit">${c.route} <span>→</span></button>
        </form>
        <section class="eientei-route-result" aria-live="polite">
          <h3>${c.status}</h3>
          ${renderResult(currentRoute, state)}
        </section>
      </aside>
    </div>`;
  app.querySelector("[data-eientei-phase]").value = phaseOverride;
  app.querySelector("[data-eientei-from]").value = from;
  app.querySelector("[data-eientei-to]").value = to;
  app.querySelector("[data-eientei-close]").addEventListener("click", () => closeDeepLink("map-eientei", "#map"));
  app.querySelector("[data-eientei-phase]").addEventListener("change", (event) => {
    phaseOverride = event.target.value;
    render();
  });
  app.querySelector("[data-eientei-route-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });
}

function open() {
  if (!root) return;
  root.hidden = false;
  document.querySelector("#map")?.classList.add("is-eientei-focused");
  render({ preserveSelection: false });
  window.clearInterval(clockTimer);
  clockTimer = window.setInterval(() => render(), 60_000);
  window.setTimeout(() => root.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
}

function close() {
  if (!root) return;
  root.hidden = true;
  document.querySelector("#map")?.classList.remove("is-eientei-focused");
  window.clearInterval(clockTimer);
}

export function initEienteiMap() {
  registerDeepLink("map-eientei", { open, close });
  window.addEventListener("tu:languagechange", () => {
    if (!root?.hidden) render();
  });
}

