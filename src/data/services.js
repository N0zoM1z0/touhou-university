export const mapPlaces = {
  gate: {
    index: "01 / MAIN GATE",
    name: { "zh-Hant": "博麗門", ja: "博麗門", en: "Hakurei Gate" },
    description: {
      "zh-Hant": "位於大結界內側的正門。外界生報到、訪客核驗與遺失物返回皆在此辦理。",
      ja: "大結界内側の正門。外界生の到着、来訪者確認、遺失物の返還を扱う。",
      en: "The main gate inside the Great Barrier. Outside-student arrivals, visitor checks, and lost-item returns are handled here.",
    },
    hours: "06:00—22:30",
    walk: { "zh-Hant": "起點", ja: "起点", en: "Origin" },
    air: { "zh-Hant": "低空禁飛", ja: "低空飛行禁止", en: "Low flight prohibited" },
  },
  library: {
    index: "02 / LIBRARY",
    name: { "zh-Hant": "霧湖圖書館", ja: "霧の湖図書館", en: "Misty Lake Library" },
    description: {
      "zh-Hant": "跨館藏借閱、魔導書特藏與夜間閱覽中心。會自行移動的書籍存放於北翼。",
      ja: "相互貸借、魔導書特蔵、夜間閲覧の中心。自走する本は北翼に収蔵される。",
      en: "Interlibrary loans, grimoire special collections, and night reading. Self-moving volumes are housed in the north wing.",
    },
    hours: "07:00—02:00",
    walk: { "zh-Hant": "自正門 8 分", ja: "正門から8分", en: "8 min from gate" },
    air: { "zh-Hant": "湖面上方單向", ja: "湖上は一方通行", en: "One-way above lake" },
  },
  boundary: {
    index: "03 / LECTURE HALL",
    name: { "zh-Hant": "境界講堂", ja: "境界講堂", en: "Boundary Hall" },
    description: {
      "zh-Hant": "全校共同必修、公開答辯與符卡式口試主場。座位數會依出席者邊界微調。",
      ja: "全学必修、公開討論、スペルカード式面接の会場。座席数は出席者の境界に合わせて微調整される。",
      en: "Home to common courses, public defences, and spell-card interviews. Seat count adjusts slightly to attendee boundaries.",
    },
    hours: "08:00—21:00",
    walk: { "zh-Hant": "自正門 12 分", ja: "正門から12分", en: "12 min from gate" },
    air: { "zh-Hant": "屋頂停泊 16 位", ja: "屋上停泊16枠", en: "16 roof berths" },
  },
  history: {
    index: "04 / ARCHIVE",
    name: { "zh-Hant": "稗田史學館", ja: "稗田史学館", en: "Hieda History Hall" },
    description: {
      "zh-Hant": "史料校勘、人里研究與口述歷史中心。滿月前後二樓部分檔案暫停調閱。",
      ja: "史料校勘、人里研究、口述史の中心。満月前後は二階資料の一部を閲覧停止とする。",
      en: "Centre for source criticism, village studies, and oral history. Some second-floor records close around the full moon.",
    },
    hours: "08:30—19:00",
    walk: { "zh-Hant": "自正門 15 分", ja: "正門から15分", en: "15 min from gate" },
    air: { "zh-Hant": "僅教職員", ja: "教職員のみ", en: "Faculty only" },
  },
  magic: {
    index: "05 / LABORATORY",
    name: { "zh-Hant": "七曜實驗塔", ja: "七曜実験塔", en: "Seven-Day Laboratory" },
    description: {
      "zh-Hant": "元素理論與高出力魔法實驗設施。紅燈亮起時請沿逆時針方向離開。",
      ja: "元素理論と高出力魔法の実験施設。赤灯点灯時は反時計回りに退避すること。",
      en: "Elemental theory and high-output magic facility. When the red lamp lights, leave counter-clockwise.",
    },
    hours: "08:00—23:00",
    walk: { "zh-Hant": "自正門 18 分", ja: "正門から18分", en: "18 min from gate" },
    air: { "zh-Hant": "實驗時封閉", ja: "実験中閉鎖", en: "Closed during trials" },
  },
  clinic: {
    index: "06 / CLINIC",
    name: { "zh-Hant": "永遠亭診療所", ja: "永遠亭診療所", en: "Eientei Clinic" },
    description: {
      "zh-Hant": "跨種族門診、藥局與月相感覺研究站。急診兔車由竹林東口進入。",
      ja: "種族横断外来、薬局、月相感覚研究所。救急兎車は竹林東口から入る。",
      en: "Cross-species outpatient care, pharmacy, and lunar sensory station. Emergency rabbit carts enter from the east bamboo gate.",
    },
    hours: "24 HOURS",
    walk: { "zh-Hant": "自正門 24 分", ja: "正門から24分", en: "24 min from gate" },
    air: { "zh-Hant": "醫療優先", ja: "医療優先", en: "Medical priority" },
  },
  kappa: {
    index: "07 / FIELD WORKSHOP",
    name: { "zh-Hant": "河童聯合工房", ja: "河童共同工房", en: "Kappa Joint Workshop" },
    description: {
      "zh-Hant": "水力、氣象與觀測儀器的山地實作站。雨具可借，原型機不可借。",
      ja: "水力、気象、観測機器の山地実習所。雨具は貸出可、試作機は貸出不可。",
      en: "Mountain field station for waterpower, weather, and instruments. Rain gear may be borrowed; prototypes may not.",
    },
    hours: "07:30—18:30",
    walk: { "zh-Hant": "自正門 31 分", ja: "正門から31分", en: "31 min from gate" },
    air: { "zh-Hant": "瀑布側降落", ja: "滝側へ着陸", en: "Land waterfall-side" },
  },
};

export const roomAvailability = [
  { code: "ML-204", building: "library", seats: 24, freeUntil: "14:30", kind: "reading" },
  { code: "BH-108", building: "boundary", seats: 48, freeUntil: "16:00", kind: "classroom" },
  { code: "HH-302", building: "history", seats: 18, freeUntil: "15:10", kind: "seminar" },
  { code: "SD-07", building: "magic", seats: 12, freeUntil: "13:40", kind: "lab" },
  { code: "KW-W2", building: "kappa", seats: 16, freeUntil: "17:20", kind: "workshop" },
  { code: "ML-NIGHT", building: "library", seats: 36, freeUntil: "02:00", kind: "reading" },
];

export const diningMenus = {
  "zh-Hant": [
    ["博麗定食", "山菜飯、烤豆腐、味噌湯、醃蘿蔔", "540 円", "人氣"],
    ["竹林月見麵", "蕎麥麵、溫泉蛋、竹筍、紫蘇", "480 円", "素食可"],
    ["河童工房咖哩", "深綠蔬菜咖哩、齒輪蓮藕、米飯", "620 円", "微辣"],
    ["夜雀晚食", "烤八目鰻、梅飯糰、夜茶", "700 円", "17:30 後"],
    ["妖精份水果盅", "當季莓果、薄荷、蜂蜜露", "260 円", "小份"],
  ],
  ja: [
    ["博麗定食", "山菜ご飯、焼き豆腐、味噌汁、たくあん", "540円", "人気"],
    ["竹林月見そば", "蕎麦、温泉卵、筍、大葉", "480円", "菜食可"],
    ["河童工房カレー", "深緑野菜カレー、歯車れんこん、ご飯", "620円", "中辛"],
    ["夜雀夜食", "焼き八目鰻、梅おにぎり、夜茶", "700円", "17:30以降"],
    ["妖精サイズ果物鉢", "季節のベリー、ミント、蜂蜜露", "260円", "小"],
  ],
  en: [
    ["Hakurei Set", "Mountain rice, grilled tofu, miso soup, pickled radish", "¥540", "Popular"],
    ["Bamboo Moon Soba", "Soba, soft egg, bamboo shoot, shiso", "¥480", "Veg option"],
    ["Kappa Workshop Curry", "Green vegetable curry, gear-cut lotus, rice", "¥620", "Medium"],
    ["Night-Sparrow Supper", "Grilled lamprey, plum rice ball, night tea", "¥700", "After 17:30"],
    ["Fairy Fruit Bowl", "Seasonal berries, mint, honey dew", "¥260", "Small"],
  ],
};

const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });

export const timetable = [
  ["08:30", l("幻想鄉通史", "幻想郷通史", "History of Gensokyo"), "HH-302", l("上白澤慧音", "上白沢慧音", "Keine Kamishirasawa")],
  ["10:20", l("七曜元素論 II", "七曜元素論 II", "Seven-Day Elemental Theory II"), "SD-07", l("帕秋莉・諾蕾姬", "パチュリー・ノーレッジ", "Patchouli Knowledge")],
  ["13:10", l("低落差水輪", "低落差水車", "Low-Head Turbines"), "KW-W2", l("河城荷取", "河城にとり", "Nitori Kawashiro")],
  ["15:00", l("消息來源倫理", "情報源倫理", "Source Ethics"), "BN-201", l("射命丸文", "射命丸文", "Aya Shameimaru")],
  ["17:20", l("符卡式答辯", "スペルカード式討論", "Spell-card Debate"), "BH-108", l("博麗靈夢", "博麗霊夢", "Reimu Hakurei")],
];

export const exams = [
  ["09.28", l("符卡式口試", "スペルカード式面接", "Spell-card Interview"), l("境界講堂", "境界講堂", "Boundary Hall"), l("全體申請生", "全志願者", "All applicants")],
  ["10.03", l("七曜元素論 II", "七曜元素論 II", "Seven-Day Elemental Theory II"), l("七曜實驗塔", "七曜実験塔", "Seven-Day Laboratory"), l("筆試＋安全實作", "筆記＋安全実習", "Written + safety practicum")],
  ["10.05", l("幻想鄉通史", "幻想郷通史", "History of Gensokyo"), l("稗田史學館", "稗田史学館", "Hieda History Hall"), l("開卷史料批判", "資料持込・史料批判", "Open-source criticism")],
  ["10.07", l("低落差水輪", "低落差水車", "Low-Head Turbines"), l("河童聯合工房", "河童共同工房", "Kappa Joint Workshop"), l("現場拆裝", "現地分解組立", "Field disassembly")],
  ["10.09", l("消息來源倫理", "情報源倫理", "Source Ethics"), l("天狗新聞館", "天狗新聞館", "Tengu News Hall"), l("訂正稿提交", "訂正版提出", "Correction submission")],
];
