import { text as catalogText } from "../generated/i18n/ui/audiences.js";
import { getLocale } from "./i18n.js";
import { siteHref } from "./site-router.js";

const paths = {
  visitor: {
    glyph: "門",
    label: catalogText("paths.visitor.label"),
    title: catalogText("paths.visitor.title"),
    lead: catalogText("paths.visitor.lead"),
    actions: [
      ["about", catalogText("paths.visitor.actions.0.1")],
      ["map", catalogText("paths.visitor.actions.1.1")],
      ["service-visit", catalogText("paths.visitor.actions.2.1")],
      ["campus", catalogText("paths.visitor.actions.3.1")],
    ],
  },
  applicant: {
    glyph: "願",
    label: catalogText("paths.applicant.label"),
    title: catalogText("paths.applicant.title"),
    lead: catalogText("paths.applicant.lead"),
    actions: [
      ["academics", catalogText("paths.applicant.actions.0.1")],
      ["entrance-exam", catalogText("paths.applicant.actions.1.1")],
      ["gaokao", catalogText("paths.applicant.actions.2.1")],
      ["service-application", catalogText("paths.applicant.actions.3.1")],
    ],
  },
  newcomer: {
    glyph: "鐘",
    label: catalogText("paths.newcomer.label"),
    title: catalogText("paths.newcomer.title"),
    lead: catalogText("paths.newcomer.lead"),
    actions: [
      ["welcome", catalogText("paths.newcomer.actions.0.1")],
      ["my-tu", catalogText("paths.newcomer.actions.1.1")],
      ["map", catalogText("paths.newcomer.actions.2.1")],
      ["housing-application", catalogText("paths.newcomer.actions.3.1")],
    ],
  },
  student: {
    glyph: "學",
    label: catalogText("paths.student.label"),
    title: catalogText("paths.student.title"),
    lead: catalogText("paths.student.lead"),
    actions: [
      ["service-timetable", catalogText("paths.student.actions.0.1")],
      ["housing-account", catalogText("paths.student.actions.1.1")],
      ["service-availability", catalogText("paths.student.actions.2.1")],
      ["bbs", catalogText("paths.student.actions.3.1")],
    ],
  },
};

export function initAudiencePaths() {
  const app = document.querySelector("[data-audience-app]");
  if (!app) return;
  let active = window.localStorage.getItem("tu:audience");
  if (!paths[active]) active = "visitor";

  function render() {
    const locale = getLocale();
    const selected = paths[active];
    app.innerHTML = `
      <div class="audience-heading">
        <p>START HERE / CAMPUS PATHS</p>
        <h2>${catalogText("render")[locale]}</h2>
      </div>
      <div class="audience-tabs" role="tablist">
        ${Object.entries(paths).map(([id, path]) => `
          <button type="button" role="tab" aria-selected="${id === active}" class="${id === active ? "active" : ""}" data-audience="${id}">
            <span aria-hidden="true">${path.glyph}</span><strong>${path.label[locale]}</strong>
          </button>`).join("")}
      </div>
      <section class="audience-route" aria-live="polite">
        <div><span>${selected.glyph}</span><p>${selected.label[locale]} / CAMPUS ROUTE</p></div>
        <h3>${selected.title[locale]}</h3>
        <p>${selected.lead[locale]}</p>
        <nav aria-label="${selected.label[locale]}">
          ${selected.actions.map(([route, label], index) => `
            <a href="${siteHref(route)}"><span>${String(index + 1).padStart(2, "0")}</span>${label[locale]}<i aria-hidden="true">→</i></a>
          `).join("")}
        </nav>
      </section>`;
    app.querySelectorAll("[data-audience]").forEach((button) => {
      button.addEventListener("click", () => {
        active = button.dataset.audience;
        window.localStorage.setItem("tu:audience", active);
        render();
      });
    });
  }

  window.addEventListener("tu:languagechange", render);
  render();
}
