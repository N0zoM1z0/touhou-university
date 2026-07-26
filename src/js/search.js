import { getLocale } from "./i18n.js";
import { closeDeepLink, navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { currentPage, pageForRoute, siteHref } from "./site-router.js";
import { domainSearchEntries } from "./domain-registry.js";
import { phantasmEntranceHref } from "./phantasm-gate.js";

const dialog = document.querySelector("[data-search-dialog]");
const input = dialog?.querySelector("[data-search-input]");
const results = dialog?.querySelector("[data-search-results]");
const count = dialog?.querySelector("[data-search-count]");

const copy = {
  "zh-Hant": {
    kicker: "UNIVERSITY SEARCH",
    title: "搜尋整座校園",
    placeholder: "搜尋學院、教師、研究、服務、社團或 BBS…",
    label: "輸入關鍵字搜尋全站",
    hint: "試試「符卡」、「永遠亭」、「申請」或教師姓名",
    empty: "沒有找到相符結果。換一個詞，或少寫一點。",
    results: "項結果",
    popular: "常用入口",
    categories: {
      section: "校園入口",
      school: "學院",
      faculty: "教師",
      research: "研究",
      club: "社團",
      service: "校務服務",
      bbs: "BBS",
      map: "地圖",
      history: "校史",
      course: "課程",
      library: "館藏",
      housing: "住宿",
      incident: "事件",
      clinic: "校醫院",
      appraisal: "漂流物鑑定",
      workshop: "符卡工房",
      phantasm: "未登錄課表",
    },
  },
  ja: {
    kicker: "UNIVERSITY SEARCH",
    title: "キャンパス全体を検索",
    placeholder: "学部、教員、研究、サービス、団体、BBSを検索…",
    label: "キーワードでサイト全体を検索",
    hint: "「スペルカード」「永遠亭」「出願」や教員名を試してください",
    empty: "一致する項目がありません。別の語か、短い語で検索してください。",
    results: "件",
    popular: "よく使う入口",
    categories: {
      section: "キャンパス案内",
      school: "学部",
      faculty: "教員",
      research: "研究",
      club: "団体",
      service: "学務サービス",
      bbs: "BBS",
      map: "地図",
      history: "大学史",
      course: "科目",
      library: "蔵書",
      housing: "学生寮",
      incident: "事案",
      clinic: "校医院",
      appraisal: "漂流物鑑定",
      workshop: "スペルカード工房",
      phantasm: "未登録時間割",
    },
  },
  en: {
    kicker: "UNIVERSITY SEARCH",
    title: "Search the whole campus",
    placeholder: "Search schools, faculty, research, services, clubs, or BBS…",
    label: "Search the full site by keyword",
    hint: 'Try “spell card”, “Eientei”, “application”, or a faculty name',
    empty: "No matching records. Try another or shorter search term.",
    results: "results",
    popular: "Popular destinations",
    categories: {
      section: "Campus gateway",
      school: "School",
      faculty: "Faculty",
      research: "Research",
      club: "Club",
      service: "Campus service",
      bbs: "BBS",
      map: "Map",
      history: "Chronicle",
      course: "Course",
      library: "Library holding",
      housing: "Housing",
      incident: "Incident",
      clinic: "Medical center",
      appraisal: "Drift-object appraisal",
      workshop: "Spell-card workshop",
      phantasm: "Unregistered timetable",
    },
  },
};

const sectionEntries = [
  ["about", "section", ["學校介紹", "大学紹介", "About the university"], ["校訓、校服、校慶與辦學方式", "校訓・制服・大学祭・教育方針", "Motto, uniform, anniversary, and the university's approach"]],
  ["chronicle", "section", ["幻想鄉校史", "幻想郷大学史", "Gensokyo University Chronicle"], ["真實版本主旨、校務演變、訂正與頁邊補記", "実際の版主題・学務の変遷・訂正・欄外追記", "Real version subjects, campus evolution, corrections, and marginal notes"]],
  ["academics", "section", ["七所學院", "七つの学部", "Seven schools"], ["課程、學分、學費與畢業條件", "科目・単位・授業料・卒業要件", "Courses, credits, tuition, and progression"]],
  ["admissions", "section", ["招生與入學案內", "入試・入学案内", "Admissions"], ["入學路線、日期與線上填報", "選抜経路・日程・オンライン出願", "Entry routes, dates, and online application"]],
  ["my-tu", "section", ["My TU 幻想鄉學籍中心", "My TU 幻想郷学籍センター", "My TU Student Records"], ["本機身分、教授聯合審查、校園履歷與錄取通知書", "端末内身分・教員合同審査・履歴・合格通知", "On-device identity, joint faculty review, campus history, and decision letters"]],
  ["data-cabinet", "section", ["本機資料櫃", "端末内資料棚", "On-device Records Cabinet"], ["查看空間與可見範圍，封箱匯出、驗證匯入或銷毀個別卷宗", "使用量・可視範囲・箱詰め書出し・検証読込・個別廃棄", "Inspect usage and visibility, export a sealed box, validate imports, or destroy individual files"]],
  ["course-registration", "course", ["選課、課表與成績", "履修・時間割・成績", "Course registration, timetable & grades"], ["35 門課程、加退選、候補、衝堂與本機學業紀錄", "35科目・追加取消・補欠・重複・端末内成績", "35 courses, add/drop, waitlists, collisions, and on-device academic records"]],
  ["academic-work", "course", ["課程作業與答案評閱", "授業課題・答案評価", "Coursework & answer review"], ["草稿、提交、逐題判分與解析", "下書き・提出・設問別採点・解説", "Drafts, submissions, per-question scoring, and explanations"]],
  ["academic-exam", "course", ["限時課程考試", "計時授業試験", "Timed course examination"], ["本機計時、自動保存、交卷與即時判分", "端末計時・自動保存・提出・即時採点", "On-device timing, autosave, submission, and instant grading"]],
  ["academic-grades", "course", ["本機學業成績單", "端末内成績表", "On-device academic transcript"], ["作業、考試、答辯與可列印回條", "課題・試験・答弁・印刷用記録", "Assignments, exams, defences, and printable records"]],
  ["academic-defense", "course", ["論文／符卡答辯", "論文／スペルカード答弁", "Thesis / spell-card defence"], ["研究計畫、三人委員會、公開三問與裁定", "研究計画・三名委員会・公開三問・裁定", "Project dossier, three examiners, public questions, and ruling"]],
  ["library", "section", ["霧湖圖書館", "霧の湖図書館", "Misty Lake Library"], ["館藏搜尋、借閱、續借、歸還與預約", "蔵書検索・貸出・更新・返却・予約", "Search, borrow, renew, return, and place holds"]],
  ["library-appraisal", "appraisal", ["香霖堂 × 霧湖外界漂流物鑑定所", "香霖堂 × 霧の湖 外界漂流物鑑定所", "Kourindou × Misty Lake Drift-Object Appraisal Office"], ["觀察材質與磨損、提出原用途、進行非侵入測試並保存訂正", "材質・摩耗観察、元用途仮説、非侵襲試験、訂正保存", "Observe material and wear, propose original use, run non-invasive tests, and retain corrections"]],
  ["spellcard-workshop", "workshop", ["可操作的符卡設計與倫理工房", "操作できるスペルカード設計・倫理工房", "Interactive Spell-card Design & Ethics Workshop"], ["輕量試飛、六方獨立批註、版本封存與公開三問答辯", "軽量試飛・六者独立所見・版保存・公開三問答弁", "Lightweight flight tests, six independent reviews, version files, and a three-question public defence"]],
  ["spellcard-records", "workshop", ["我的符卡設計與答辯檔案", "自分のスペルカード設計・答弁記録", "My spell-card designs & defences"], ["保存在這台裝置的符卡版本、裁定、附帶條件與異議", "この端末に保存した版・裁定・条件・異議", "On-device versions, rulings, conditions, and dissent"]],
  ["clinic", "clinic", ["永遠亭校醫院與校醫務室", "永遠亭校医院・保健室", "Eientei Hospital & campus infirmary"], ["本機分診、動態候診、跨種族診療與轉介", "端末内トリアージ・動的待合・種族横断診療・紹介", "On-device triage, live queue, cross-species care, and referrals"]],
  ["clinic-pharmacy", "clinic", ["月藥調劑室與處方", "月薬調剤室・処方", "Lunar Pharmacy & prescriptions"], ["幻想鄉藥品、領藥、用藥記錄與可列印回條", "幻想郷薬・調剤・服用記録・印刷票", "Gensokyo medicines, dispensing, dose records, and printable slips"]],
  ["clinic-recovery", "clinic", ["康復療法與復診", "回復療法・再診", "Recovery therapies & follow-up"], ["彈幕肩翼、境界定位、月相降載、幽體同步與妖精核心", "弾幕肩翼・境界定位・月相低刺激・幽体同期・妖精核", "Danmaku shoulder-wing, boundary anchoring, lunar recovery, phantom sync, and fairy cores"]],
  ["clinic-account", "clinic", ["我的診療紀錄", "自分の診療記録", "My medical file"], ["掛號、診察、處方、領藥與康復回條", "受付・診察・処方・調剤・回復票", "Check-ins, consultations, prescriptions, dispensing, and recovery slips"]],
  ["housing", "housing", ["宿舍、房間與室友", "学生寮・部屋・同室者", "Housing, rooms & roommates"], ["住宿需求、房間配對、室友協議與換房", "入寮希望・配室・同室協定・転室", "Housing needs, allocation, roommate agreements, and transfers"]],
  ["housing-application", "housing", ["宿舍申請與配對", "入寮申請・配室", "Housing application & matching"], ["月相、翼展、水域、使魔、作息與相容度", "月相・翼幅・水域・使い魔・生活時間・適合度", "Moon phase, wingspan, water, familiars, schedules, and compatibility"]],
  ["housing-account", "housing", ["我的宿舍", "自分の寮", "My housing"], ["房號、室友、共住備忘與換房申請", "室番号・同室者・共同生活メモ・転室申請", "Room, roommate, shared-living note, and transfer request"]],
  ["incident-center", "incident", ["校園事件中心", "学内事案センター", "Campus Incident Centre"], ["證物、證詞、工作假說與可逆處置", "物証・証言・作業仮説・可逆的措置", "Evidence, testimony, working hypotheses, and reversible responses"]],
  ["incident-simulator", "incident", ["研究模擬器", "研究シミュレーター", "Research simulator"], ["對照、隨機化、校準與版本鎖定", "対照・無作為化・校正・版固定", "Controls, randomisation, calibration, and version locking"]],
  ["incident-records", "incident", ["事件結案與連動", "事案終結・連動", "Case closures & reactions"], ["本機結案檔案、模擬回條與事件連動 BBS", "端末内終結記録・実験票・事案連動 BBS", "On-device closures, experiment slips, and incident-linked BBS"]],
  ["live-campus", "section", ["動態校園運行盤", "動的キャンパス運行盤", "Live Campus operations board"], ["時間、月相與當值事件共同改動菜單、課表、空房與路線", "時刻・月相・当番事案が献立・時間割・空室・経路を共同変更", "Time, moon phase, and duty incidents jointly alter menus, classes, rooms, and routes"]],
  ["governance", "section", ["校務治理與議事鐘", "学務ガバナンス・議事鐘", "University governance & voting bell"], ["公開提案、利益關係人票數、規章後果與本機投票", "公開提案・利害票・規則の帰結・端末内投票", "Public proposals, stakeholder counts, policy consequences, and on-device voting"]],
  ["gaokao", "section", ["幻想鄉統一學力試驗", "幻想郷統一高等試験", "Gensokyo Unified Examination"], ["文科、理科、線上模擬與離線試卷", "文系・理系・オンライン模試・オフライン試験紙", "Humanities, sciences, online simulation, and offline papers"]],
  ["map", "map", ["校園地圖與路線", "キャンパスマップと経路", "Campus map and routes"], ["步行、掃帚、風路、兔車與時間估算", "徒歩・箒・風路・兎車と所要時間", "Walking, broom, windway, rabbit shuttle, and journey times"]],
  ["map-eientei", "map", ["永遠亭與迷途竹林詳圖", "永遠亭・迷いの竹林詳細図", "Eientei & Bamboo Forest detail map"], ["依日期、時間與月相改變的內部路線", "日付・時刻・月相で変わる内部経路", "Internal routes that change with date, time, and lunar phase"]],
  ["bbs", "section", ["校園 BBS", "学内 BBS", "Campus BBS"], ["課程、社團、交換與校務話題", "授業・団体・交換・学務の話題", "Course, club, exchange, and campus discussions"]],
];

const serviceEntries = [
  ["application", ["線上入學申請", "オンライン入学出願", "Online application"], ["填報、草稿與本機申請記錄", "出願・下書き・端末内記録", "Application, drafts, and on-device records"]],
  ["availability", ["館舍空閒查詢", "施設空き状況", "Room availability"], ["教室、研討室與工房", "教室・演習室・工房", "Classrooms, seminar rooms, and workshops"]],
  ["visit", ["進校預約", "来校予約", "Campus visit"], ["訪客通行與到校入口", "来訪者通行・到着入口", "Visitor passage and arrival gates"]],
  ["dining", ["今日食堂菜單", "本日の食堂メニュー", "Today's dining menu"], ["定食、竹林月見麵、河童咖哩", "定食・竹林月見そば・河童カレー", "Set meals, bamboo moon soba, and kappa curry"]],
  ["timetable", ["今日排課", "本日の時間割", "Class schedule"], ["課程、場地與授課教師", "科目・教室・担当教員", "Courses, rooms, and instructors"]],
  ["exams", ["考試日程", "試験日程", "Examination schedule"], ["日期、場地與考試形式", "日程・会場・試験形式", "Dates, venues, and formats"]],
];

function localeValue(values, locale) {
  return values[locale === "zh-Hant" ? 0 : locale === "ja" ? 1 : 2];
}

function flattenStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(flattenStrings);
  return [];
}

function makeEntry({ route, category, title, description, source, priority = 0 }) {
  return {
    route,
    category,
    title,
    description,
    priority,
    haystack: flattenStrings(source || [title, description]).join(" ").toLocaleLowerCase(),
  };
}

function buildIndex() {
  const locale = getLocale();
  const index = sectionEntries.map(([route, category, title, description], position) =>
    makeEntry({
      route,
      category,
      title: localeValue(title, locale),
      description: localeValue(description, locale),
      source: [title, description],
      priority: 100 - position,
    }),
  );
  serviceEntries.forEach(([id, title, description]) => {
    index.push(makeEntry({
      route: `service-${id}`,
      category: "service",
      title: localeValue(title, locale),
      description: localeValue(description, locale),
      source: [title, description],
      priority: 65,
    }));
  });
  domainSearchEntries(locale).forEach((record) => index.push(makeEntry(record)));
  return index;
}

function openResult(route) {
  if (route.startsWith("phantasm-")) {
    window.location.assign(phantasmEntranceHref("search", route));
    return;
  }
  if (pageForRoute(route) !== currentPage()) {
    window.location.assign(siteHref(route));
    return;
  }
  if (/^(?:school|faculty|research|club|bbs|campus|service)-|^map-eientei$|^chronicle(?:-|$)/.test(route)) {
    navigateToDeepLink(route);
  } else {
    const previousUrl = window.location.href;
    const nextUrl = new URL(previousUrl);
    nextUrl.hash = route;
    window.history.replaceState({ ...(window.history.state || {}), route }, "", nextUrl);
    if (dialog?.open) dialog.close();
    window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL: previousUrl, newURL: nextUrl.href }));
  }
}

function renderResults() {
  if (!results || !count || !input) return;
  const locale = getLocale();
  const c = copy[locale];
  const terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const matches = buildIndex()
    .filter((entry) => terms.every((term) => entry.haystack.includes(term)))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, terms.length ? 28 : 9);
  count.textContent = terms.length ? `${matches.length} ${c.results}` : c.popular;
  if (!matches.length) {
    results.innerHTML = `<p class="search-empty">${c.empty}</p>`;
    return;
  }
  results.innerHTML = matches
    .map(
      (entry) => `
        <a href="${entry.route.startsWith("phantasm-") ? phantasmEntranceHref("search", entry.route) : siteHref(entry.route)}" data-search-route="${entry.route}">
          <span>${c.categories[entry.category]}</span>
          <strong>${entry.title}</strong>
          <p>${entry.description}</p>
          <i aria-hidden="true">→</i>
        </a>`,
    )
    .join("");
  results.querySelectorAll("[data-search-route]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openResult(link.dataset.searchRoute);
    });
  });
}

function localize() {
  if (!dialog || !input) return;
  const c = copy[getLocale()];
  dialog.querySelector("[data-search-kicker]").textContent = c.kicker;
  dialog.querySelector("[data-search-title]").textContent = c.title;
  dialog.querySelector("[data-search-hint]").textContent = c.hint;
  input.placeholder = c.placeholder;
  input.setAttribute("aria-label", c.label);
  renderResults();
}

export function initSearch() {
  if (!dialog || !input) return;
  document.querySelectorAll("[data-search-open]").forEach((button) => {
    button.addEventListener("click", () => navigateToDeepLink("search"));
  });
  dialog.querySelector("[data-search-close]")?.addEventListener("click", () => {
    closeDeepLink("search", "#top");
  });
  dialog.addEventListener("close", () => closeDeepLink("search", "#top"));
  input.addEventListener("input", renderResults);
  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
    if ((event.key === "/" && !isTyping) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")) {
      event.preventDefault();
      navigateToDeepLink("search");
    }
  });
  registerDeepLink("search", {
    anchor: "#top",
    dialog,
    open() {
      localize();
      if (!dialog.open) dialog.showModal();
      window.setTimeout(() => input.focus(), 40);
    },
    close() {
      if (dialog.open) dialog.close();
    },
  });
  window.addEventListener("tu:languagechange", localize);
  localize();
}
