import { schools } from "../data/schools.js";
import { facultyProfiles } from "../data/faculty.js";
import { researchFiles } from "../data/research.js";
import { campusFeatures, clubs } from "../data/campus.js";
import { seededPosts } from "../data/community.js";
import { campusHistory } from "../data/campus-history.js";
import { courseCatalogue } from "../data/courses.js";
import { getLocale } from "./i18n.js";
import { closeDeepLink, navigateToDeepLink, registerDeepLink } from "./deep-links.js";

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
    },
  },
};

const sectionEntries = [
  ["about", "section", ["學校介紹", "大学紹介", "About the university"], ["校訓、校服、校慶與辦學方式", "校訓・制服・大学祭・教育方針", "Motto, uniform, anniversary, and the university's approach"]],
  ["chronicle", "section", ["幻想鄉校史", "幻想郷大学史", "Gensokyo University Chronicle"], ["真實版本主旨、校務演變、訂正與頁邊補記", "実際の版主題・学務の変遷・訂正・欄外追記", "Real version subjects, campus evolution, corrections, and marginal notes"]],
  ["academics", "section", ["七所學院", "七つの学部", "Seven schools"], ["課程、學分、學費與畢業條件", "科目・単位・授業料・卒業要件", "Courses, credits, tuition, and progression"]],
  ["admissions", "section", ["招生與入學案內", "入試・入学案内", "Admissions"], ["入學路線、日期與線上填報", "選抜経路・日程・オンライン出願", "Entry routes, dates, and online application"]],
  ["my-tu", "section", ["My TU 幻想鄉學籍中心", "My TU 幻想郷学籍センター", "My TU Student Records"], ["本機身分、教授聯合審查、校園履歷與錄取通知書", "端末内身分・教員合同審査・履歴・合格通知", "On-device identity, joint faculty review, campus history, and decision letters"]],
  ["course-registration", "course", ["選課、課表與成績", "履修・時間割・成績", "Course registration, timetable & grades"], ["35 門課程、加退選、候補、衝堂與本機學業紀錄", "35科目・追加取消・補欠・重複・端末内成績", "35 courses, add/drop, waitlists, collisions, and on-device academic records"]],
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

  Object.entries(schools).forEach(([id, school]) => {
    index.push(makeEntry({
      route: `school-${id}`,
      category: "school",
      title: school.name[locale],
      description: school.overview[locale],
      source: school,
      priority: 80,
    }));
  });
  Object.entries(facultyProfiles).forEach(([id, profile]) => {
    index.push(makeEntry({
      route: `faculty-${id}`,
      category: "faculty",
      title: profile.name[locale],
      description: profile.role[locale],
      source: profile,
      priority: 75,
    }));
  });
  Object.entries(researchFiles).forEach(([id, file]) => {
    index.push(makeEntry({
      route: `research-${id}`,
      category: "research",
      title: file.title[locale],
      description: file.summary[locale],
      source: file,
      priority: 70,
    }));
  });
  Object.entries(clubs).forEach(([id, club]) => {
    index.push(makeEntry({
      route: `club-${id}`,
      category: "club",
      title: club.name[locale],
      description: club.description[locale],
      source: club,
      priority: 45,
    }));
  });
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
  seededPosts.forEach(([category, author, title, body], id) => {
    index.push(makeEntry({
      route: `bbs-seed-${id}`,
      category: "bbs",
      title: title[locale],
      description: `${author[locale]} · ${body[locale]}`,
      source: [author, title, body, category],
      priority: 20,
    }));
  });
  Object.entries(campusFeatures).forEach(([id, feature]) => {
    index.push(makeEntry({
      route: `campus-${id}`,
      category: "section",
      title: feature.title[locale],
      description: feature.summary[locale],
      source: feature,
      priority: 35,
    }));
  });
  campusHistory.forEach((entry) => {
    index.push(makeEntry({
      route: `chronicle-${entry.id}`,
      category: "history",
      title: entry.title[locale],
      description: `${entry.era[locale]} · ${entry.summary[locale]}`,
      source: entry,
      priority: 55,
    }));
  });
  courseCatalogue.forEach((course) => {
    index.push(makeEntry({
      route: `course-${course.code}`,
      category: "course",
      title: `${course.code} · ${course.title[locale]}`,
      description: `${course.instructor[locale]} · ${course.note[locale]}`,
      source: course,
      priority: 72,
    }));
  });
  return index;
}

function openResult(route) {
  if (/^(?:school|faculty|research|club|bbs|campus|service)-|^map-eientei$|^chronicle(?:-|$)/.test(route)) {
    navigateToDeepLink(route);
  } else {
    window.location.hash = route;
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
        <a href="#${entry.route}" data-search-route="${entry.route}">
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
