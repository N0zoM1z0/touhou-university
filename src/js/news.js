import { newsItems } from "../data/community.js";
import { getLocale } from "./i18n.js";
import { openInfoDialog } from "./info-dialog.js";
import { incidentCommunityNews } from "./incident-model.js";
import { siteHref } from "./site-router.js";

const track = document.querySelector("[data-news-track]");
let selectedIds = [];
let rotationTimer;

function shuffle(values) {
  const copy = values.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const random = crypto.getRandomValues(new Uint32Array(1))[0] % (index + 1);
    [copy[index], copy[random]] = [copy[random], copy[index]];
  }
  return copy;
}

function chooseNews() {
  const incidentItems = incidentCommunityNews();
  const dynamicIds = incidentItems.slice(0, 2).map((item) => item.id);
  const remaining = shuffle(newsItems.map((item) => item.id)).slice(0, 6 - dynamicIds.length);
  selectedIds = [...dynamicIds, ...remaining];
}

function showNews(id) {
  const item = [...incidentCommunityNews(), ...newsItems].find((news) => news.id === id);
  if (!item) return;
  const locale = getLocale();
  const labels = {
    "zh-Hant": ["發布", "分類"],
    ja: ["公開日", "分類"],
    en: ["Published", "Category"],
  }[locale];
  openInfoDialog({
    kicker: "TU NEWS · CAMPUS WIRE",
    title: item.title[locale],
    summary: item.summary[locale],
    meta: [labels[0], item.date, labels[1], item.category[locale]],
    action: item.incidentId
      ? {
          label: {
            "zh-Hant": "查看結案案卷",
            ja: "終結記録を見る",
            en: "Open closure record",
          }[locale],
          handler: () => window.location.assign(siteHref(`incident-case-${item.incidentId}`)),
        }
      : undefined,
  });
}

function renderNews() {
  if (!track) return;
  const locale = getLocale();
  const allItems = [...incidentCommunityNews(), ...newsItems];
  const selected = selectedIds
    .map((id) => allItems.find((item) => item.id === id))
    .filter(Boolean);
  const buildContent = (hidden = false) => {
    const content = document.createElement("div");
    content.className = "ticker-content";
    if (hidden) content.setAttribute("aria-hidden", "true");
    selected.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.newsId = item.id;
      const date = document.createElement("b");
      date.textContent = item.date;
      button.append(date, ` ${item.title[locale]}`);
      const sparkle = document.createElement("i");
      sparkle.textContent = "✦";
      content.append(button, sparkle);
    });
    return content;
  };
  track.replaceChildren(buildContent(), buildContent(true));
  track.querySelectorAll("[data-news-id]").forEach((button) => {
    button.addEventListener("click", () => showNews(button.dataset.newsId));
  });
}

export function initNews() {
  chooseNews();
  renderNews();
  rotationTimer = window.setInterval(() => {
    chooseNews();
    renderNews();
  }, 45000);
  window.addEventListener("tu:languagechange", renderNews);
  window.addEventListener("tu:incidentchange", () => {
    chooseNews();
    renderNews();
  });
  window.addEventListener("pagehide", () => window.clearInterval(rotationTimer), { once: true });
}
