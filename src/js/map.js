import { mapPlaces } from "../data/services.js";
import { findCampusRoute, transportModes } from "../data/routes.js";
import { getLocale } from "./i18n.js";

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
      route: "建議路線",
      transfer: "含候車／停泊",
      same: "你已經在目的地了。抬頭看看校牌。",
      segment: "經",
    },
    ja: {
      from: "出発地",
      to: "目的地",
      mode: "交通手段",
      plan: "経路を検索",
      min: "分",
      metres: "メートル",
      arrival: "到着予定",
      route: "推奨ルート",
      transfer: "待ち時間・駐機込み",
      same: "すでに目的地です。校名板を見上げてください。",
      segment: "経由",
    },
    en: {
      from: "From",
      to: "To",
      mode: "Travel mode",
      plan: "Plan route",
      min: "min",
      metres: "metres",
      arrival: "Estimated arrival",
      route: "Suggested route",
      transfer: "includes wait / berthing",
      same: "You are already there. Look up at the building sign.",
      segment: "via",
    },
  };

  function render(placeId) {
    const place = mapPlaces[placeId];
    if (!place || !detail) return;
    currentPlace = placeId;
    const locale = getLocale();
    detail.querySelector("[data-map-index]").textContent = place.index;
    detail.querySelector("[data-map-name]").textContent = place.name[locale];
    detail.querySelector("[data-map-description]").textContent = place.description[locale];
    detail.querySelector("[data-map-type]").textContent = place.type[locale];
    const image = detail.querySelector("[data-map-image]");
    image.src = place.image;
    image.alt = place.imageAlt[locale];
    detail.querySelector("[data-map-hours]").textContent = place.hours;
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
    node.addEventListener("click", () => render(node.dataset.mapPlace));
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
        label.innerHTML = `
          <input type="radio" name="route-mode" value="${id}" ${id === selectedMode ? "checked" : ""}>
          <span class="route-mode-icon" aria-hidden="true">${mode.icon}</span>
          <span><strong>${mode.name[locale]}</strong><small>${mode.summary[locale]}</small></span>
        `;
        return label;
      }),
    );

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

  function calculateRoute({ preserveTime = false } = {}) {
    if (!planner) return;
    const locale = getLocale();
    const labels = copy[locale];
    const from = planner.querySelector("[data-route-from]").value;
    const to = planner.querySelector("[data-route-to]").value;
    const mode = planner.querySelector('input[name="route-mode"]:checked')?.value || "walk";
    const result = findCampusRoute(from, to, mode);
    if (!result) return;
    const timestamp = preserveTime && currentRoute?.timestamp ? currentRoute.timestamp : Date.now();
    currentRoute = { from, to, mode, timestamp };
    const modeData = transportModes[mode];
    const resultElement = planner.querySelector("[data-route-result]");
    const routeNames = result.path.map((id) => mapPlaces[id].name[locale]);
    const edgeNames = result.edges.map((edge) => edge.name[locale]);
    const samePlace = result.path.length === 1;

    resultElement.innerHTML = `
      <div class="route-result-summary">
        <span class="route-result-mode">${modeData.icon}</span>
        <div>
          <p>${modeData.name[locale]} · ${labels.transfer}</p>
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
                    <div><strong>${name}</strong>${
                      edgeNames[index] ? `<small>${labels.segment} ${edgeNames[index]}</small>` : ""
                    }</div>
                  </li>`,
              )
              .join("")}</ol>`
      }
      <p class="route-notice">${modeData.notice[locale]}</p>
    `;
    resultElement.hidden = false;
    markRoute(result.path);
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
  });
  render(currentPlace);
  renderPlanner();
}
