import { mapPlaces } from "../data/services.js";
import { getLocale } from "./i18n.js";

export function initCampusMap() {
  const detail = document.querySelector(".map-detail");
  let currentPlace = "gate";

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
  window.addEventListener("tu:languagechange", () => render(currentPlace));
  render(currentPlace);
}
