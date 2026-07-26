import { mapPlaces } from "../data/services.js";
import { findCampusRoute, transportModes } from "../data/routes.js";
import { getLocale } from "./i18n.js";
import { navigateToDeepLink } from "./deep-links.js";
import { liveCampusSnapshot, liveFacilityStatus, liveMapNotice } from "../data/live-campus.js";
import { phantasmGateHint, phantasmGateProgress } from "./phantasm-gate.js";

export function initCampusMap() {
  const detail = document.querySelector(".map-detail");
  const planner = document.querySelector("[data-route-planner]");
  let currentPlace = "gate";
  let currentRoute = null;

  const copy = {
    "zh-Hant": {
      from: "出發地",
      to: "目的地",
      mode: "交通方式",
      plan: "規劃路線",
      min: "分鐘",
      metres: "公尺",
      arrival: "預計抵達",
      route: "路線距離",
      transfer: "含步行接駁／候車",
      walkingOnly: "本段仍以步行較快",
      same: "你已經在目的地了。抬頭看看校牌。",
      start: "從這裡出發",
      live: "此刻校園路況",
      unavailable: "本時段停用",
      restrictions: "動態限制已納入路線計算",
      openNow: "開放中",
      closedNow: "目前閉館",
      seatsFree: "空位",
    },
    ja: {
      from: "出発地",
      to: "目的地",
      mode: "交通手段",
      plan: "経路を検索",
      min: "分",
      metres: "メートル",
      arrival: "到着予定",
      route: "経路距離",
      transfer: "徒歩接続・待ち時間込み",
      walkingOnly: "この区間は徒歩のほうが速い",
      same: "すでに目的地です。校名板を見上げてください。",
      start: "ここから出発",
      live: "現在のキャンパス経路",
      unavailable: "この時間は停止",
      restrictions: "動的規制を経路計算へ反映済み",
      openNow: "開館中",
      closedNow: "現在閉館",
      seatsFree: "空席",
    },
    en: {
      from: "From",
      to: "To",
      mode: "Travel mode",
      plan: "Plan route",
      min: "min",
      metres: "metres",
      arrival: "Estimated arrival",
      route: "Route distance",
      transfer: "includes walking links / waiting",
      walkingOnly: "Walking is still faster for this trip",
      same: "You are already there. Look up at the building sign.",
      start: "Start here",
      live: "Live campus conditions",
      unavailable: "Unavailable this period",
      restrictions: "Live restrictions are included in this route",
      openNow: "Open now",
      closedNow: "Currently closed",
      seatsFree: "places free",
    },
  };

  function render(placeId) {
    const place = mapPlaces[placeId];
    if (!place || !detail) return;
    currentPlace = placeId;
    const locale = getLocale();
    const c = copy[locale];
    const facility = liveFacilityStatus(placeId, locale);
    detail.querySelector("[data-map-index]").textContent = place.index;
    detail.querySelector("[data-map-name]").textContent = place.name[locale];
    detail.querySelector("[data-map-description]").textContent = place.description[locale];
    detail.querySelector("[data-map-type]").textContent = place.type[locale];
    const image = detail.querySelector("[data-map-image]");
    image.src = place.image;
    image.srcset = `${place.imageMobile || place.image} 640w, ${place.image} 1280w`;
    image.sizes = "(max-width: 700px) 92vw, 36vw";
    image.alt = place.imageAlt[locale];
    detail.querySelector("[data-map-hours]").textContent = facility?.hours || place.hours;
    detail.querySelector("[data-map-live]").textContent = facility
      ? `${facility.open ? c.openNow : c.closedNow} · ${facility.availableSeats} ${c.seatsFree}`
      : place.hours;
    detail.querySelector("[data-map-walk]").textContent = place.walk[locale];
    detail.querySelector("[data-map-air]").textContent = place.air[locale];
    document.querySelectorAll("[data-map-place]").forEach((node) => {
      const selected = node.dataset.mapPlace === placeId;
      node.classList.toggle("active", selected);
      node.setAttribute("aria-pressed", String(selected));
      const name = mapPlaces[node.dataset.mapPlace]?.name[locale];
      if (name) node.querySelector("strong").textContent = name;
    });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      detail.animate(
        [
          { opacity: 0.55, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 280, easing: "cubic-bezier(.2,.7,.2,1)" },
      );
    }
  }

  document.querySelectorAll("[data-map-place]").forEach((node) => {
    node.addEventListener("click", () => {
      render(node.dataset.mapPlace);
      if (node.dataset.mapPlace === "clinic") navigateToDeepLink("map-eientei");
    });
  });

  function renderPlanner() {
    if (!planner) return;
    const locale = getLocale();
    const labels = copy[locale];
    const fromSelect = planner.querySelector("[data-route-from]");
    const toSelect = planner.querySelector("[data-route-to]");
    const selectedFrom = fromSelect.value || "gate";
    const selectedTo = toSelect.value || "kappa";
    const selectedMode =
      planner.querySelector('input[name="route-mode"]:checked')?.value || currentRoute?.mode || "walk";
    const liveState = liveCampusSnapshot();

    for (const [select, value] of [
      [fromSelect, selectedFrom],
      [toSelect, selectedTo],
    ]) {
      select.replaceChildren(
        ...Object.entries(mapPlaces).map(([id, place]) => {
          const option = document.createElement("option");
          option.value = id;
          option.textContent = place.name[locale];
          return option;
        }),
      );
      select.value = value;
    }

    planner.querySelector("[data-route-from]").closest("label").querySelector("span").textContent = labels.from;
    planner.querySelector("[data-route-to]").closest("label").querySelector("span").textContent = labels.to;
    planner.querySelector("legend").textContent = labels.mode;
    planner.querySelector(".route-submit").childNodes[0].nodeValue = `${labels.plan} `;
    planner.querySelector("[data-route-modes]").replaceChildren(
      ...Object.entries(transportModes).map(([id, mode]) => {
        const label = document.createElement("label");
        label.className = "route-mode";
        const unavailable = liveState.routeRules.closedModes.includes(id);
        label.innerHTML = `
          <input type="radio" name="route-mode" value="${id}" ${id === selectedMode ? "checked" : ""} ${unavailable ? "disabled" : ""}>
          <span class="route-mode-icon" aria-hidden="true">${mode.icon}</span>
          <span><strong>${mode.name[locale]}</strong><small>${unavailable ? labels.unavailable : mode.summary[locale]}</small></span>
        `;
        return label;
      }),
    );
    const live = planner.querySelector("[data-route-live]");
    live.innerHTML = `
      <strong><i></i>${labels.live}</strong>
      <span>${liveState.weather[locale]}</span>
      <ul>${liveState.activeEvents.map((item) => `<li><b>${item.glyph}</b>${item.rule[locale]}</li>`).join("")}</ul>`;

    if (currentRoute) calculateRoute({ preserveTime: true });
  }

  function formatArrival(minutes, locale, timestamp = Date.now()) {
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(timestamp + minutes * 60_000));
  }

  function markRoute(path) {
    document.querySelectorAll("[data-map-place]").forEach((node) => {
      const order = path.indexOf(node.dataset.mapPlace);
      node.classList.toggle("on-route", order >= 0);
      node.classList.toggle("route-origin", order === 0);
      node.classList.toggle("route-destination", order === path.length - 1);
      if (order >= 0) node.style.setProperty("--route-order", `"${order + 1}"`);
      else node.style.removeProperty("--route-order");
    });
  }

  function drawRoute(result) {
    const canvas = document.querySelector(".map-canvas");
    const layer = canvas?.querySelector("[data-map-route-layer]");
    if (!canvas || !layer) return;
    layer.replaceChildren();
    if (result.path.length < 2) return;

    const canvasRect = canvas.getBoundingClientRect();
    const width = Math.max(1, canvasRect.width);
    const height = Math.max(1, canvasRect.height);
    layer.setAttribute("viewBox", `0 0 ${width} ${height}`);

    result.edges.forEach((edge, index) => {
      const fromNode = canvas.querySelector(`[data-map-place="${edge.from}"]`);
      const toNode = canvas.querySelector(`[data-map-place="${edge.to}"]`);
      if (!fromNode || !toNode) return;
      const fromRect = fromNode.getBoundingClientRect();
      const toRect = toNode.getBoundingClientRect();
      const x1 = fromRect.left + fromRect.width / 2 - canvasRect.left;
      const y1 = fromRect.top + fromRect.height / 2 - canvasRect.top;
      const x2 = toRect.left + toRect.width / 2 - canvasRect.left;
      const y2 = toRect.top + toRect.height / 2 - canvasRect.top;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.max(1, Math.hypot(dx, dy));
      const bend = edge.kind === "walk" ? 0 : Math.min(42, length * 0.14) * (index % 2 ? -1 : 1);
      const midX = (x1 + x2) / 2 - (dy / length) * bend;
      const midY = (y1 + y2) / 2 + (dx / length) * bend;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`);
      path.setAttribute("class", `map-route-line map-route-line-${edge.kind}`);
      path.setAttribute("data-route-kind", edge.kind);
      layer.append(path);
    });
  }

  function calculateRoute({ preserveTime = false } = {}) {
    if (!planner) return;
    const locale = getLocale();
    const labels = copy[locale];
    const from = planner.querySelector("[data-route-from]").value;
    const to = planner.querySelector("[data-route-to]").value;
    const mode = planner.querySelector('input[name="route-mode"]:checked')?.value || "walk";
    const liveState = liveCampusSnapshot();
    const result = findCampusRoute(from, to, mode, liveState.routeRules);
    if (!result) return;
    const timestamp = preserveTime && currentRoute?.timestamp ? currentRoute.timestamp : Date.now();
    currentRoute = { from, to, mode, timestamp };
    const modeData = transportModes[mode];
    const resultElement = planner.querySelector("[data-route-result]");
    const routeNames = result.path.map((id) => mapPlaces[id].name[locale]);
    const samePlace = result.path.length === 1;
    const usesRequestedMode = mode === "walk" || result.edges.some((edge) => edge.kind === mode);

    resultElement.innerHTML = `
      <div class="route-result-summary">
        <span class="route-result-mode">${modeData.icon}</span>
        <div>
          <p>${modeData.name[locale]} · ${usesRequestedMode ? labels.transfer : labels.walkingOnly}</p>
          <strong>${result.minutes}<small>${labels.min}</small></strong>
        </div>
        <dl>
          <div><dt>${labels.arrival}</dt><dd>${formatArrival(result.minutes, locale, timestamp)}</dd></div>
          <div><dt>${labels.route}</dt><dd>${result.distance} ${labels.metres}</dd></div>
        </dl>
      </div>
      ${
        samePlace
          ? `<p class="route-same-place">${labels.same}</p>`
          : `<ol class="route-itinerary">${routeNames
              .map(
                (name, index) => `
                  <li>
                    <span>${String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>${name}</strong>
                      ${
                        index === 0
                          ? `<small>${labels.start}</small>`
                          : `<small>
                              <b class="route-segment-badge route-segment-${result.edges[index - 1].kind}" data-route-kind="${result.edges[index - 1].kind}">
                                ${transportModes[result.edges[index - 1].kind].icon}
                                ${transportModes[result.edges[index - 1].kind].name[locale]}
                              </b>
                              ${result.edges[index - 1].name[locale]} · ${result.edges[index - 1].minutes} ${labels.min}
                            </small>`
                      }
                    </div>
                  </li>`,
              )
              .join("")}</ol>`
      }
      <p class="route-notice">${modeData.notice[locale]}<br><b>${labels.restrictions}：</b>${liveState.activeEvents.map((item) => item.rule[locale]).join(" · ")}</p>
    `;
    resultElement.hidden = false;
    markRoute(result.path);
    drawRoute(result);
  }

  planner?.querySelector("[data-route-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    calculateRoute();
  });
  planner?.querySelector("[data-route-swap]")?.addEventListener("click", () => {
    const from = planner.querySelector("[data-route-from]");
    const to = planner.querySelector("[data-route-to]");
    [from.value, to.value] = [to.value, from.value];
    calculateRoute();
  });
  planner?.querySelector("[data-route-modes]")?.addEventListener("change", () => calculateRoute());
  window.addEventListener("tu:languagechange", () => {
    render(currentPlace);
    renderPlanner();
    renderNotice();
  });
  const renderNotice = () => {
    const notice = liveMapNotice(getLocale());
    const trace = phantasmGateProgress();
    const locale = getLocale();
    const hint = phantasmGateHint(locale, "map");
    const ninth = trace.count >= 3
      ? (locale === "ja"
        ? `　欄外：北階段の第九打は本日の通行時間へ算入しない（裏面の印 ${trace.count}）。`
        : locale === "en"
          ? ` Marginal note: the north stair's ninth strike does not count toward today's journey time (${trace.count} seals on reverse).`
          : `　頁邊補記：北樓梯第九響不計入本日通行時間（背面 ${trace.count} 枚印）。`)
      : "";
    const label = document.querySelector("[data-map-notice-label]");
    const text = document.querySelector("[data-map-notice]");
    const entrance = document.querySelector("[data-phantasm-map-entrance]");
    if (label) label.textContent = notice.label;
    if (text) text.textContent = `${notice.text}${ninth}`;
    if (entrance) {
      entrance.hidden = !hint.href;
      entrance.href = hint.href || "";
      entrance.textContent = locale === "ja"
        ? "折り目の裏を確認する ↘"
        : locale === "en"
          ? "Inspect behind the crease ↘"
          : "沿折痕查看背面 ↘";
      entrance.dataset.resonant = hint.resonant ? "true" : "false";
      entrance.title = hint.text;
    }
  };
  window.addEventListener("resize", () => {
    if (!currentRoute) return;
    const result = findCampusRoute(currentRoute.from, currentRoute.to, currentRoute.mode, liveCampusSnapshot().routeRules);
    if (result) drawRoute(result);
  });
  render(currentPlace);
  renderPlanner();
  renderNotice();
}
