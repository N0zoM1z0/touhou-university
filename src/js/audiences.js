import { getLocale } from "./i18n.js";

const paths = {
  visitor: {
    glyph: "門",
    label: { "zh-Hant": "訪客", ja: "来訪者", en: "Visitor" },
    title: { "zh-Hant": "第一次來幻想鄉立東方大學", ja: "幻想郷立東方大学を初めて訪れる", en: "Your first visit to Touhou University" },
    lead: {
      "zh-Hant": "先看校園怎麼運作，再安排一條不會把你送進上週的參觀路線。",
      ja: "大学の仕組みを知り、先週へ迷い込まない見学経路を組みましょう。",
      en: "See how campus works, then plan a visit route that does not deposit you in last week.",
    },
    actions: [
      ["about", { "zh-Hant": "認識學校", ja: "大学を知る", en: "Meet the university" }],
      ["map", { "zh-Hant": "打開校園地圖", ja: "地図を開く", en: "Open campus map" }],
      ["service-visit", { "zh-Hant": "預約進校", ja: "来校予約", en: "Reserve a visit" }],
      ["campus", { "zh-Hant": "看看校園生活", ja: "キャンパスライフ", en: "Explore campus life" }],
    ],
  },
  applicant: {
    glyph: "願",
    label: { "zh-Hant": "申請生", ja: "志願者", en: "Applicant" },
    title: { "zh-Hant": "把志願、題目與試卷放在同一條路上", ja: "志望・問い・試験を一つの経路へ", en: "Put your school, question, and exam on one path" },
    lead: {
      "zh-Hant": "比較七所學院、完成模擬試驗，再把選好的學院直接帶進申請表。",
      ja: "七学部を比較し、模試を受け、選んだ学部をそのまま出願票へ。",
      en: "Compare seven schools, take a simulation, then carry your choice into the application.",
    },
    actions: [
      ["academics", { "zh-Hant": "比較七所學院", ja: "七学部を比較", en: "Compare seven schools" }],
      ["entrance-exam", { "zh-Hant": "挑戰入學試驗", ja: "入学試験に挑戦", en: "Try the entrance exam" }],
      ["gaokao", { "zh-Hant": "參加幻想鄉統一學力試驗", ja: "幻想郷統一試験", en: "Take the Gensokyo exam" }],
      ["service-application", { "zh-Hant": "開始線上填報", ja: "オンライン出願", en: "Start application" }],
    ],
  },
  student: {
    glyph: "學",
    label: { "zh-Hant": "在校生", ja: "在学生", en: "Current Student" },
    title: { "zh-Hant": "今天的課、空教室與校園風聲", ja: "今日の授業、空き教室、キャンパスの風聞", en: "Today's classes, free rooms, and campus rumours" },
    lead: {
      "zh-Hant": "這裡不替你交作業，但會告訴你教室是否還存在，以及午餐還剩什麼。",
      ja: "課題の提出は代行しませんが、教室がまだ存在するか、昼食が残っているかは分かります。",
      en: "It will not submit your work, but it can tell you whether the room still exists and what lunch remains.",
    },
    actions: [
      ["service-timetable", { "zh-Hant": "今日排課", ja: "今日の時間割", en: "Today's timetable" }],
      ["service-availability", { "zh-Hant": "找空教室", ja: "空き教室", en: "Find a free room" }],
      ["service-dining", { "zh-Hant": "查看食堂", ja: "食堂を見る", en: "Check dining" }],
      ["bbs", { "zh-Hant": "進入校園 BBS", ja: "学内 BBS へ", en: "Enter Campus BBS" }],
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
        <h2>${locale === "zh-Hant" ? "你今天以什麼身分進校？" : locale === "ja" ? "今日はどの立場で大学へ？" : "How are you entering campus today?"}</h2>
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
            <a href="#${route}"><span>${String(index + 1).padStart(2, "0")}</span>${label[locale]}<i aria-hidden="true">→</i></a>
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
