import { trees as catalogTrees } from "../generated/i18n/ui/research.js";
import { researchFiles } from "../data/research.js";
import { getLocale } from "./i18n.js";
import { closeDeepLink, navigateToDeepLink, registerDeepLink } from "./deep-links.js";



export function initResearch() {
  const dialog = document.querySelector("[data-research-dialog]");
  let currentFile = null;

  function render(id) {
    const file = researchFiles[id];
    if (!file || !dialog) return;
    currentFile = id;
    const locale = getLocale();
    const labels = catalogTrees["labels"];
    dialog.querySelector("[data-research-kicker]").textContent = file.kicker;
    dialog.querySelector("[data-research-title]").textContent = file.title[locale];
    dialog.querySelector("[data-research-summary]").textContent = file.summary[locale];
    dialog.querySelector("[data-research-meta]").innerHTML = file.meta
      .map(([key, value]) => {
        return `<div><span>${typeof key === "string" ? key : key[locale]}</span><strong>${typeof value === "string" ? value : value[locale]}</strong></div>`;
      })
      .join("");
    dialog.querySelector("[data-research-body]").innerHTML = file.sections[locale]
      .map(
        ([title, body], index) => `
          <section>
            <p>${String(index + 1).padStart(2, "0")} / ${labels[locale][1]}</p>
            <h3>${title}</h3>
            <p>${body}</p>
          </section>`,
      )
      .join("");
    dialog.setAttribute("aria-label", labels[locale][0]);
  }

  document.querySelectorAll("[data-research]").forEach((button) => {
    button.addEventListener("click", () => {
      navigateToDeepLink(`research-${button.dataset.research}`);
    });
  });
  registerDeepLink("research-", {
    anchor: "#research",
    dialog,
    open(id) {
      if (!researchFiles[id]) return;
      render(id);
      if (!dialog.open) dialog.showModal();
    },
    close() {
      if (dialog?.open) dialog.close();
    },
  });
  document.querySelector("[data-research-close]")?.addEventListener("click", () => {
    closeDeepLink("research-", "#research");
  });
  dialog?.addEventListener("close", () => closeDeepLink("research-", "#research"));
  window.addEventListener("tu:languagechange", () => {
    if (currentFile) render(currentFile);
  });
}
