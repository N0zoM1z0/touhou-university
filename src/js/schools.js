import { schools } from "../data/schools.js";
import { getLocale } from "./i18n.js";
import { closeDeepLink, navigateToDeepLink, registerDeepLink } from "./deep-links.js";

const labels = {
  "zh-Hant": {
    catalogue: "UNDERGRADUATE CATALOGUE · 2026",
    degree: "學位",
    duration: "修業年限",
    credits: "畢業學分",
    intake: "招生名額",
    tuition: "每學期學費",
    overview: "學院介紹",
    courses: "核心課程節選",
    course: "課號／課程",
    courseCredits: "學分",
    studios: "分流與工房",
    fieldwork: "實地學習",
    progression: "畢業條件",
    costs: "費用說明",
    outcomes: "畢業去向",
    apply: "以此學院開始填報",
    note: "學費按學期收取；共同必修與跨院選修已包含在畢業學分內。",
  },
  ja: {
    catalogue: "UNDERGRADUATE CATALOGUE · 2026",
    degree: "学位",
    duration: "修業年限",
    credits: "卒業単位",
    intake: "募集人数",
    tuition: "学期授業料",
    overview: "学部紹介",
    courses: "主要科目",
    course: "科目番号／授業",
    courseCredits: "単位",
    studios: "専攻・工房",
    fieldwork: "実地学習",
    progression: "卒業要件",
    costs: "費用案内",
    outcomes: "進路",
    apply: "この学部で出願を始める",
    note: "授業料は学期ごと。全学必修と学部横断選択は卒業単位に含まれます。",
  },
  en: {
    catalogue: "UNDERGRADUATE CATALOGUE · 2026",
    degree: "Award",
    duration: "Duration",
    credits: "Credits",
    intake: "Intake",
    tuition: "Tuition per term",
    overview: "About the school",
    courses: "Selected core courses",
    course: "Code / course",
    courseCredits: "Credits",
    studios: "Pathways & studios",
    fieldwork: "Field learning",
    progression: "Graduation requirements",
    costs: "Additional costs",
    outcomes: "Where graduates go",
    apply: "Apply to this school",
    note: "Tuition is charged by term. University core and cross-school electives count toward the graduation total.",
  },
};

export function initSchools() {
  const dialog = document.querySelector("[data-school-dialog]");
  const content = dialog?.querySelector("[data-school-content]");
  let currentSchool = null;

  function render(id) {
    const school = schools[id];
    if (!school || !content) return;
    currentSchool = id;
    const locale = getLocale();
    const c = labels[locale];
    content.innerHTML = `
      <header class="school-dialog-hero" style="--school-accent: ${school.accent}">
        <div class="school-dialog-mark" aria-hidden="true">${school.glyph}</div>
        <div>
          <p>${school.index} / ${c.catalogue}</p>
          <h2>${school.name[locale]}</h2>
          <span>${school.englishName}</span>
          <strong>${school.director[locale]}</strong>
        </div>
      </header>
      <div class="school-dialog-body">
        <dl class="school-facts">
          <div><dt>${c.degree}</dt><dd>${school.degree[locale]}</dd></div>
          <div><dt>${c.duration}</dt><dd>${school.duration[locale]}</dd></div>
          <div><dt>${c.credits}</dt><dd>${school.credits}</dd></div>
          <div><dt>${c.intake}</dt><dd>${school.intake[locale]}</dd></div>
          <div class="school-fact-tuition"><dt>${c.tuition}</dt><dd>${school.tuition[locale]}</dd></div>
        </dl>
        <section class="school-overview">
          <p>${c.overview}</p>
          <h3>${school.overview[locale]}</h3>
        </section>
        <section class="school-curriculum">
          <div class="school-section-heading">
            <p>${c.courses}</p>
            <span>${school.code} / CORE</span>
          </div>
          <div class="school-table-wrap">
            <table>
              <thead><tr><th>${c.course}</th><th>${c.courseCredits}</th></tr></thead>
              <tbody>
                ${school.courses
                  .map(
                    ([code, name, credits]) =>
                      `<tr><td><span>${code}</span><strong>${name[locale]}</strong></td><td>${credits}</td></tr>`,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </section>
        <div class="school-detail-grid">
          <section><p>${c.studios}</p><h3>${school.studios[locale]}</h3></section>
          <section><p>${c.fieldwork}</p><h3>${school.fieldwork[locale]}</h3></section>
          <section><p>${c.progression}</p><h3>${school.progression[locale]}</h3></section>
          <section><p>${c.costs}</p><h3>${school.costs[locale]}</h3></section>
          <section class="school-outcomes"><p>${c.outcomes}</p><h3>${school.outcomes[locale]}</h3></section>
        </div>
        <footer class="school-dialog-footer">
          <p>${c.note}</p>
          <a
            class="button button-primary"
            data-school-apply
            href="index.html#service-application--${id}"
          >
            ${c.apply} <span aria-hidden="true">→</span>
          </a>
        </footer>
      </div>
    `;
    dialog.setAttribute("aria-label", school.name[locale]);
  }

  document.querySelectorAll("[data-school]").forEach((button) => {
    button.addEventListener("click", () => {
      navigateToDeepLink(`school-${button.dataset.school}`);
    });
  });
  registerDeepLink("school-", {
    anchor: "#academics",
    dialog,
    open(id) {
      if (!schools[id]) return;
      render(id);
      if (!dialog.open) dialog.showModal();
    },
    close() {
      if (dialog?.open) dialog.close();
    },
  });
  dialog?.querySelector("[data-school-close]")?.addEventListener("click", () => {
    closeDeepLink("school-", "#academics");
  });
  dialog?.addEventListener("close", () => closeDeepLink("school-", "#academics"));
  window.addEventListener("tu:languagechange", () => {
    if (currentSchool) render(currentSchool);
  });
}
