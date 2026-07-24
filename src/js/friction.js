import { faithFaculty, faithReview, unresolvedMatters } from "../data/friction.js";
import { getLocale } from "./i18n.js";
import { openInfoDialog } from "./info-dialog.js";

const faithImage = "assets/images/faculty/faith-council.webp";

const copy = {
  "zh-Hant": {
    open: "打開案卷",
    course: "本學期課程",
    friction: "目前衝突",
    office: "所屬議席",
    officeValue: "信仰與共生政策學院・臨時會議室",
    review: "校外申訴審查",
    imageAlt: "聖白蓮、八坂神奈子、豐聰耳神子與東風谷早苗在破舊會議室裡爭論祭典資源圖",
  },
  ja: {
    open: "案件を開く",
    course: "今学期の授業",
    friction: "現在の対立",
    office: "所属議席",
    officeValue: "信仰・共生政策学部・仮会議室",
    review: "学外異議審査",
    imageAlt: "古びた会議室で祭礼資源図をめぐり議論する聖白蓮、八坂神奈子、豊聡耳神子、東風谷早苗",
  },
  en: {
    open: "Open case file",
    course: "Course this term",
    friction: "Current friction",
    office: "Council seat",
    officeValue: "Faith & Coexistence Policy · Temporary Meeting Room",
    review: "External appeals review",
    imageAlt: "Byakuren, Kanako, Miko, and Sanae argue over a festival resource map in a shabby meeting room",
  },
};

function showMatter(id) {
  const matter = unresolvedMatters[id];
  if (!matter) return;
  const locale = getLocale();
  openInfoDialog({
    kicker: `OFFICE OF UNRESOLVED MATTERS · ${matter.stamp[locale]}`,
    title: matter.title[locale],
    summary: matter.summary[locale],
    meta: matter.details.map((value) => (typeof value === "object" ? value[locale] : value)),
  });
}

function showFaithFaculty(id) {
  const member = faithFaculty[id];
  if (!member) return;
  const locale = getLocale();
  const labels = copy[locale];
  openInfoDialog({
    kicker: `FAITH & COEXISTENCE FACULTY · ${member.glyph}`,
    title: member.name[locale],
    summary: member.summary[locale],
    image: faithImage,
    imageAlt: labels.imageAlt,
    meta: [
      labels.office,
      labels.officeValue,
      labels.course,
      member.course[locale],
      labels.friction,
      member.tension[locale],
    ],
  });
}

function renderFrictionBoard() {
  const locale = getLocale();
  const labels = copy[locale];
  const board = document.querySelector("[data-friction-board]");
  if (!board) return;
  board.replaceChildren(
    ...Object.entries(unresolvedMatters).map(([id, matter], index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `friction-note friction-note-${(index % 4) + 1}`;
      button.dataset.friction = id;
      button.innerHTML = `
        <span>${matter.stamp[locale]}</span>
        <strong>${matter.title[locale]}</strong>
        <small>${labels.open} ↗</small>
      `;
      button.addEventListener("click", () => showMatter(id));
      return button;
    }),
  );
}

function renderFaithCouncil() {
  const locale = getLocale();
  document.querySelector("[data-faith-council-image]")?.setAttribute("alt", copy[locale].imageAlt);
  const roster = document.querySelector("[data-faith-roster]");
  if (roster) {
    roster.replaceChildren(
      ...Object.entries(faithFaculty).map(([id, member]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.faithFaculty = id;
        button.innerHTML = `
          <span aria-hidden="true">${member.glyph}</span>
          <b>${member.name[locale]}</b>
          <small>${member.role[locale]}</small>
        `;
        button.addEventListener("click", () => showFaithFaculty(id));
        return button;
      }),
    );
  }

  const review = document.querySelector("[data-faith-review]");
  if (review) {
    review.querySelector("strong").textContent = faithReview.name[locale];
    review.querySelector("span").textContent = faithReview.role[locale];
    review.querySelector("p").textContent = faithReview.note[locale];
  }
}

export function initFacultyFriction() {
  renderFrictionBoard();
  renderFaithCouncil();
  window.addEventListener("tu:languagechange", () => {
    renderFrictionBoard();
    renderFaithCouncil();
  });
}
