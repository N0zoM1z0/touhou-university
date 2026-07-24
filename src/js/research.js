import { researchFiles } from "../data/research.js";
import { getLocale } from "./i18n.js";

const metaTranslations = {
  ja: {
    "研究期間": "研究期間",
    "主持": "主宰",
    "樣本": "標本",
    "狀態": "状態",
    "效率": "効率",
    "維修工具": "整備工具",
    "停機": "停止",
    "授權": "公開方式",
    "觀察夜": "観察夜",
    "引導樁": "案内杭",
    "滿月模式": "満月モード",
    "對照文本": "比較資料",
    "公開訂正": "公開訂正",
    "照片撤回": "写真撤回",
    "測試彈幕": "試験弾幕",
    "參與者": "参加者",
    "退路預兆": "退路予兆",
    "幻想曆 137—141": "幻想暦 137—141",
    "八雲紫・森近霖之助・結界觀測所": "八雲紫・森近霖之助・境界観測所",
    "1,842 件無主漂移物": "所有者不明の漂流物 1,842点",
    "年度索引公開": "年次索引公開",
    "3 種": "3種",
    "暴雨日自動": "豪雨日に自動",
    "工房公開規格": "工房公開仕様",
    "低刺激": "低刺激",
    "八意永琳・鈴仙": "八意永琳・鈴仙",
    "射命丸文・稗田史料室": "射命丸文・稗田史料室",
    "96 組": "96組",
    "42 名・6 種移動方式": "42名・6種の移動方式",
    "最低 0.8 秒": "最低0.8秒",
    "博麗靈夢・霧雨魔理沙・符卡系統研究室": "博麗霊夢・霧雨魔理沙・スペルカードシステム研究室",
  },
  en: {
    "研究期間": "Research period",
    "主持": "Lead",
    "樣本": "Sample",
    "狀態": "Status",
    "效率": "Efficiency",
    "維修工具": "Repair tools",
    "停機": "Shutdown",
    "授權": "Release",
    "觀察夜": "Observation nights",
    "引導樁": "Guide posts",
    "滿月模式": "Full-moon mode",
    "對照文本": "Comparative texts",
    "公開訂正": "Public corrections",
    "照片撤回": "Photo withdrawals",
    "測試彈幕": "Test patterns",
    "參與者": "Participants",
    "退路預兆": "Exit telegraph",
    "幻想曆 137—141": "Gensokyo Calendar 137—141",
    "八雲紫・森近霖之助・結界觀測所": "Yukari Yakumo · Rinnosuke Morichika · Boundary Observatory",
    "1,842 件無主漂移物": "1,842 unclaimed drift objects",
    "年度索引公開": "Annual index published",
    "3 種": "3 tools",
    "暴雨日自動": "Automatic in heavy rain",
    "工房公開規格": "Open workshop specification",
    "低刺激": "Low stimulus",
    "八意永琳・鈴仙": "Eirin Yagokoro · Reisen",
    "射命丸文・稗田史料室": "Aya Shameimaru · Hieda Archive",
    "96 組": "96 patterns",
    "42 名・6 種移動方式": "42 · 6 movement modes",
    "最低 0.8 秒": "Minimum 0.8 seconds",
    "博麗靈夢・霧雨魔理沙・符卡系統研究室": "Reimu Hakurei · Marisa Kirisame · Spell-card Systems Lab",
  },
};

export function initResearch() {
  const dialog = document.querySelector("[data-research-dialog]");
  let currentFile = null;

  function render(id) {
    const file = researchFiles[id];
    if (!file || !dialog) return;
    currentFile = id;
    const locale = getLocale();
    const labels = {
      "zh-Hant": ["研究檔案", "資料欄"],
      ja: ["研究ファイル", "データ"],
      en: ["Research File", "Record"],
    };
    dialog.querySelector("[data-research-kicker]").textContent = file.kicker;
    dialog.querySelector("[data-research-title]").textContent = file.title[locale];
    dialog.querySelector("[data-research-summary]").textContent = file.summary[locale];
    dialog.querySelector("[data-research-meta]").innerHTML = file.meta
      .map(([key, value]) => {
        const translated = metaTranslations[locale] || {};
        return `<div><span>${translated[key] || key}</span><strong>${translated[value] || value}</strong></div>`;
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
      render(button.dataset.research);
      dialog?.showModal();
    });
  });
  document.querySelector("[data-research-close]")?.addEventListener("click", () => dialog?.close());
  window.addEventListener("tu:languagechange", () => {
    if (currentFile) render(currentFile);
  });
}
