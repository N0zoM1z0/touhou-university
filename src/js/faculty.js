import { facultyProfiles } from "../data/faculty.js";
import { getLocale } from "./i18n.js";
import { closeDeepLink, navigateToDeepLink, registerDeepLink } from "./deep-links.js";

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
      document.querySelectorAll("[data-filter]").forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      document.querySelectorAll(".faculty-card").forEach((card) => {
        card.classList.toggle("is-hidden", category !== "all" && card.dataset.category !== category);
      });
    });
  });

  document.querySelectorAll("[data-faculty]").forEach((button) => {
    button.addEventListener("click", () => {
      navigateToDeepLink(`faculty-${button.dataset.faculty}`);
    });
  });
  registerDeepLink("faculty-", {
    anchor: "#faculty",
    dialog,
    open(id) {
      if (!facultyProfiles[id]) return;
      renderProfile(id);
      if (!dialog.open) dialog.showModal();
    },
    close() {
      if (dialog?.open) dialog.close();
    },
  });
  document.querySelector("[data-dialog-close]")?.addEventListener("click", () => {
    closeDeepLink("faculty-", "#faculty");
  });
  dialog?.addEventListener("close", () => closeDeepLink("faculty-", "#faculty"));
  window.addEventListener("tu:languagechange", () => {
    if (currentProfile) renderProfile(currentProfile);
  });
}
