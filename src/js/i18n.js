import { canonicalText, messages, textTranslations } from "../data/i18n.js";

const supportedLocales = ["zh-Hant", "ja", "en"];
const savedLocale = window.localStorage.getItem("tu:locale");
let locale = supportedLocales.includes(savedLocale) ? savedLocale : "zh-Hant";
const originalText = new WeakMap();

function normalize(value) {
  return canonicalText(value);
}

function translateTextNodes(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!normalize(node.nodeValue || "")) return NodeFilter.FILTER_REJECT;
      if (node.parentElement?.closest("script, style, template")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const source = originalText.get(node);
    const key = normalize(source);
    const translated = textTranslations[locale][key];
    if (!translated) {
      node.nodeValue = source;
      continue;
    }
    const leading = source.match(/^\s*/)?.[0] || "";
    const trailing = source.match(/\s*$/)?.[0] || "";
    node.nodeValue = `${leading}${translated}${trailing}`;
  }
}

function translateAttributes() {
  const attributeCopy = {
    "zh-Hant": {
      "開啟選單": "開啟選單",
      "關閉選單": "關閉選單",
      "關閉校務服務": "關閉校務服務",
      "關閉研究檔案": "關閉研究檔案",
      "關閉發帖視窗": "關閉發帖視窗",
      "關閉簡介": "關閉簡介",
      "關閉入學案內": "關閉入學案內",
      "關閉內容卡片": "關閉內容卡片",
      "關閉學院目錄": "關閉學院目錄",
      "校園路線規劃": "校園路線規劃",
      "交換出發地與目的地": "交換出發地與目的地",
      "校務概覽": "校務概覽",
      "招生路線": "招生路線",
      "BBS 板面": "BBS 板面",
      "主要導覽": "主要導覽",
      "行動版導覽": "行動版導覽",
      "查看上白澤慧音簡介": "查看上白澤慧音簡介",
      "查看八意永琳簡介": "查看八意永琳簡介",
      "查看八雲紫簡介": "查看八雲紫簡介",
      "查看博麗靈夢簡介": "查看博麗靈夢簡介",
      "查看射命丸文簡介": "查看射命丸文簡介",
      "查看帕秋莉簡介": "查看帕秋莉簡介",
      "查看河城荷取簡介": "查看河城荷取簡介",
      "查看霧雨魔理沙簡介": "查看霧雨魔理沙簡介",
      "篩選教師": "篩選教師",
      "幻想鄉立東方大學校園地圖": "幻想鄉立東方大學校園地圖",
      "校務快訊": "校務快訊",
      "用一句話說清楚你想討論的事": "用一句話說清楚你想討論的事",
      "補充時間、地點與需要的協助": "補充時間、地點與需要的協助",
      "上白澤慧音教授": "上白澤慧音教授",
      "八意永琳教授": "八意永琳教授",
      "八雲紫教授": "八雲紫教授",
      "博麗靈夢教授": "博麗靈夢教授",
      "射命丸文教授": "射命丸文教授",
      "帕秋莉・諾蕾姬教授": "帕秋莉・諾蕾姬教授",
      "河城荷取教授": "河城荷取教授",
      "霧雨魔理沙教授": "霧雨魔理沙教授",
      "東方大學冬季與夏季制服展示": "東方大學冬季與夏季制服展示",
      "夜間校園燈會，學生在鳥居與櫻花下欣賞符卡形狀的煙火": "夜間校園燈會，學生在鳥居與櫻花下欣賞符卡形狀的煙火",
      "妖怪山瀑布旁的河童工房，學生正在測試水力機械": "妖怪山瀑布旁的河童工房，學生正在測試水力機械",
      "暮色中的霧湖圖書館，長桌、書架與黃銅天球儀被暖光照亮": "暮色中的霧湖圖書館，長桌、書架與黃銅天球儀被暖光照亮",
      "查看霧湖圖書館夜間閱覽詳情": "查看霧湖圖書館夜間閱覽詳情",
      "查看河童聯合工房詳情": "查看河童聯合工房詳情",
      "查看春季符卡燈會詳情": "查看春季符卡燈會詳情",
      "搜尋全站": "搜尋全站",
      "SEARCH / 搜尋全站": "SEARCH / 搜尋全站",
      "關閉全站搜尋": "關閉全站搜尋",
      "關閉校務文件": "關閉校務文件",
      "關閉教務文件": "關閉教務文件",
      "校史檔案": "校史檔案",
      "關閉校史檔案": "關閉校史檔案",
      "關閉借閱回條": "關閉借閱回條",
      "頁面位置": "頁面位置",
    },
    ja: {
      "開啟選單": "メニューを開く",
      "關閉選單": "メニューを閉じる",
      "關閉校務服務": "学務サービスを閉じる",
      "關閉研究檔案": "研究ファイルを閉じる",
      "關閉發帖視窗": "投稿画面を閉じる",
      "關閉簡介": "プロフィールを閉じる",
      "關閉入學案內": "入学案内を閉じる",
      "關閉內容卡片": "コンテンツカードを閉じる",
      "關閉學院目錄": "学部案内を閉じる",
      "校園路線規劃": "キャンパス経路検索",
      "交換出發地與目的地": "出発地と目的地を入れ替える",
      "校務概覽": "大学概要",
      "招生路線": "入試経路",
      "BBS 板面": "BBS 掲示板",
      "主要導覽": "メインナビゲーション",
      "行動版導覽": "モバイルナビゲーション",
      "查看上白澤慧音簡介": "上白沢慧音のプロフィールを見る",
      "查看八意永琳簡介": "八意永琳のプロフィールを見る",
      "查看八雲紫簡介": "八雲紫のプロフィールを見る",
      "查看博麗靈夢簡介": "博麗霊夢のプロフィールを見る",
      "查看射命丸文簡介": "射命丸文のプロフィールを見る",
      "查看帕秋莉簡介": "パチュリーのプロフィールを見る",
      "查看河城荷取簡介": "河城にとりのプロフィールを見る",
      "查看霧雨魔理沙簡介": "霧雨魔理沙のプロフィールを見る",
      "篩選教師": "教員を絞り込む",
      "幻想鄉立東方大學校園地圖": "幻想郷立東方大学キャンパスマップ",
      "校務快訊": "大学ニュース",
      "用一句話說清楚你想討論的事": "議題を一文で明確にしてください",
      "補充時間、地點與需要的協助": "日時、場所、必要な支援を補足してください",
      "上白澤慧音教授": "上白沢慧音教授",
      "八意永琳教授": "八意永琳教授",
      "八雲紫教授": "八雲紫教授",
      "博麗靈夢教授": "博麗霊夢教授",
      "射命丸文教授": "射命丸文教授",
      "帕秋莉・諾蕾姬教授": "パチュリー・ノーレッジ教授",
      "河城荷取教授": "河城にとり教授",
      "霧雨魔理沙教授": "霧雨魔理沙教授",
      "東方大學冬季與夏季制服展示": "東方大学の冬服と夏服",
      "夜間校園燈會，學生在鳥居與櫻花下欣賞符卡形狀的煙火": "夜の学園灯会で鳥居と桜の下からスペルカード形の花火を見る学生",
      "妖怪山瀑布旁的河童工房，學生正在測試水力機械": "妖怪の山の滝そばの河童工房で水力機械を試験する学生",
      "暮色中的霧湖圖書館，長桌、書架與黃銅天球儀被暖光照亮": "夕暮れの霧の湖図書館、長机と書架と真鍮の天球儀を暖かな光が照らす",
      "查看霧湖圖書館夜間閱覽詳情": "霧の湖図書館・夜間閲覧の詳細を見る",
      "查看河童聯合工房詳情": "河童共同工房の詳細を見る",
      "查看春季符卡燈會詳情": "春季スペルカード灯会の詳細を見る",
      "搜尋全站": "サイト内検索",
      "SEARCH / 搜尋全站": "SEARCH / サイト内検索",
      "關閉全站搜尋": "サイト内検索を閉じる",
      "關閉校務文件": "学務文書を閉じる",
      "關閉教務文件": "教務書類を閉じる",
      "校史檔案": "大学史記録",
      "關閉校史檔案": "大学史記録を閉じる",
      "關閉借閱回條": "貸出票を閉じる",
      "頁面位置": "現在位置",
    },
    en: {
      "開啟選單": "Open menu",
      "關閉選單": "Close menu",
      "關閉校務服務": "Close campus service",
      "關閉研究檔案": "Close research file",
      "關閉發帖視窗": "Close post form",
      "關閉簡介": "Close profile",
      "關閉入學案內": "Close admissions guide",
      "關閉內容卡片": "Close content card",
      "關閉學院目錄": "Close school catalogue",
      "校園路線規劃": "Campus route planner",
      "交換出發地與目的地": "Swap origin and destination",
      "校務概覽": "University overview",
      "招生路線": "Admissions routes",
      "BBS 板面": "BBS boards",
      "主要導覽": "Main navigation",
      "行動版導覽": "Mobile navigation",
      "查看上白澤慧音簡介": "View Keine Kamishirasawa profile",
      "查看八意永琳簡介": "View Eirin Yagokoro profile",
      "查看八雲紫簡介": "View Yukari Yakumo profile",
      "查看博麗靈夢簡介": "View Reimu Hakurei profile",
      "查看射命丸文簡介": "View Aya Shameimaru profile",
      "查看帕秋莉簡介": "View Patchouli Knowledge profile",
      "查看河城荷取簡介": "View Nitori Kawashiro profile",
      "查看霧雨魔理沙簡介": "View Marisa Kirisame profile",
      "篩選教師": "Filter faculty",
      "幻想鄉立東方大學校園地圖": "Touhou University of Gensokyo campus map",
      "校務快訊": "Campus news",
      "用一句話說清楚你想討論的事": "State the topic clearly in one sentence",
      "補充時間、地點與需要的協助": "Add the time, place, and assistance needed",
      "上白澤慧音教授": "Professor Keine Kamishirasawa",
      "八意永琳教授": "Professor Eirin Yagokoro",
      "八雲紫教授": "Professor Yukari Yakumo",
      "博麗靈夢教授": "Professor Reimu Hakurei",
      "射命丸文教授": "Professor Aya Shameimaru",
      "帕秋莉・諾蕾姬教授": "Professor Patchouli Knowledge",
      "河城荷取教授": "Professor Nitori Kawashiro",
      "霧雨魔理沙教授": "Professor Marisa Kirisame",
      "東方大學冬季與夏季制服展示": "Touhou University winter and summer uniforms",
      "夜間校園燈會，學生在鳥居與櫻花下欣賞符卡形狀的煙火": "Students watch spell-card fireworks beneath shrine gates and cherry trees at the night festival",
      "妖怪山瀑布旁的河童工房，學生正在測試水力機械": "Students test hydropower machinery at a kappa workshop beside a Youkai Mountain waterfall",
      "暮色中的霧湖圖書館，長桌、書架與黃銅天球儀被暖光照亮": "Warm light fills the long tables, shelves, and brass orrery of Misty Lake Library at dusk",
      "查看霧湖圖書館夜間閱覽詳情": "View Misty Lake Library night-reading details",
      "查看河童聯合工房詳情": "View Kappa Joint Workshop details",
      "查看春季符卡燈會詳情": "View Spring Spell-card Lantern Festival details",
      "搜尋全站": "Search the site",
      "SEARCH / 搜尋全站": "SEARCH / Search the site",
      "關閉全站搜尋": "Close site search",
      "關閉校務文件": "Close university document",
      "關閉教務文件": "Close registrar document",
      "校史檔案": "University chronicle",
      "關閉校史檔案": "Close university chronicle",
      "關閉借閱回條": "Close library receipt",
      "頁面位置": "Page location",
    },
  };

  const attributes = [
    ["aria-label", "originalAria"],
    ["placeholder", "originalPlaceholder"],
    ["alt", "originalAlt"],
  ];
  attributes.forEach(([attribute, dataKey]) => {
    document.querySelectorAll(`[${attribute}]`).forEach((element) => {
      if (!element.dataset[dataKey]) element.dataset[dataKey] = element.getAttribute(attribute);
      const source = element.dataset[dataKey];
      element.setAttribute(attribute, attributeCopy[locale][source] || source);
    });
  });
}

export function getLocale() {
  return locale;
}

export function t(key) {
  return messages[locale]?.[key] || messages["zh-Hant"]?.[key] || key;
}

export function setLocale(nextLocale, { persist = true } = {}) {
  if (!supportedLocales.includes(nextLocale)) return;
  locale = nextLocale;
  document.documentElement.lang = locale;
  const pageTitleKey = {
    academics: "pageAcademicsTitle",
    admissions: "pageAdmissionsTitle",
    research: "pageResearchTitle",
    campus: "pageCampusTitle",
    mytu: "pageMyTuTitle",
    library: "pageLibraryTitle",
    housing: "pageHousingTitle",
    incidents: "pageIncidentsTitle",
  }[document.body?.dataset.page];
  const university =
    locale === "ja" ? "幻想郷立東方大学" : locale === "en" ? "Touhou University" : "幻想鄉立東方大學";
  document.title = pageTitleKey
    ? `${messages[locale][pageTitleKey]}｜${university}`
    : locale === "ja"
      ? "幻想郷立東方大学｜境界を越えて、知を拓く"
      : locale === "en"
        ? "Touhou University of Gensokyo | Knowledge Beyond the Border"
        : "幻想鄉立東方大學｜越境而學，知行幻想";
  if (persist) window.localStorage.setItem("tu:locale", locale);
  translateTextNodes();
  translateAttributes();
  document.querySelectorAll("[data-lang]").forEach((button) => {
    const active = button.dataset.lang === locale;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  window.dispatchEvent(new CustomEvent("tu:languagechange", { detail: { locale } }));
}

export function initI18n() {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => setLocale(button.dataset.lang));
  });
  setLocale(locale, { persist: false });
}
