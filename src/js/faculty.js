import { facultyProfiles } from "../data/faculty.js";
import { getLocale } from "./i18n.js";

export function initFaculty() {
  const dialog = document.querySelector("[data-faculty-dialog]");
  let currentProfile = null;

  function renderProfile(id) {
    const profile = facultyProfiles[id];
    if (!profile || !dialog) return;
    currentProfile = id;
    const locale = getLocale();
    dialog.querySelector("[data-dialog-field]").textContent = profile.field[locale];
    dialog.querySelector("[data-dialog-name]").textContent = profile.name[locale];
    dialog.querySelector("[data-dialog-role]").textContent = profile.role[locale];
    dialog.querySelector("[data-dialog-canon]").textContent = profile.expertise[locale];
    dialog.querySelector("[data-dialog-au]").textContent = profile.courses[locale];
    dialog.querySelector("[data-dialog-incident]").textContent = profile.incident[locale];
  }

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
      document.querySelectorAll(".faculty-card").forEach((card) => {
        card.classList.toggle("is-hidden", category !== "all" && card.dataset.category !== category);
      });
    });
  });

  document.querySelectorAll("[data-faculty]").forEach((button) => {
    button.addEventListener("click", () => {
      renderProfile(button.dataset.faculty);
      dialog?.showModal();
    });
  });
  document.querySelector("[data-dialog-close]")?.addEventListener("click", () => dialog?.close());
  window.addEventListener("tu:languagechange", () => {
    if (currentProfile) renderProfile(currentProfile);
  });
}
