import {
  campusDayKey as liveCampusDayKey,
  campusLunarPhase as liveCampusLunarPhase,
  campusTimeBand as liveCampusTimeBand,
} from "./campus-time.js";

export { liveCampusDayKey, liveCampusLunarPhase, liveCampusTimeBand };

const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });

function hashValue(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function dayOrdinal(date) {
  return Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 86_400_000);
}

function edgeKey(a, b) {
  return [a, b].sort().join("--");
}

export const liveCampusEvents = {
  crosswind: {
    glyph: "風",
    severity: "amber",
    title: l("天狗風路正在做沒有事先通知的側風測試", "天狗風路、予告なしの横風試験中", "Tengu windways are running an unannounced crosswind trial"),
    body: l(
      "掃帚空路暫停；天狗急行仍行駛，但每一面旗都堅稱自己是順風。",
      "箒空路は停止。天狗急行は運行中だが、すべての旗が自分を追い風だと主張している。",
      "Broom airways are paused. Tengu Express still runs, although every flag claims to be a tailwind.",
    ),
    rule: l("掃帚路網停用；天狗風路加 2 分鐘", "箒網停止・天狗風路は2分増", "Broom network closed; add 2 minutes to tengu windways"),
    closedModes: ["broom"],
    modeDelay: { tengu: 2 },
  },
  kappaTape: {
    glyph: "補",
    severity: "amber",
    title: l("瀑布送材線再次進入「永久臨時修復」", "滝資材線、再び「恒久的仮修理」へ", "Waterfall Supply Line returns to “permanent temporary repair”"),
    body: l(
      "七曜塔至河童工房的直達段封閉。膠帶顏色從藍換成紅，不構成工程驗收。",
      "七曜塔―河童工房の直通区間を閉鎖。テープが青から赤へ変わっても検収にはならない。",
      "The Seven-Day–Kappa direct segment is closed. Changing tape from blue to red does not constitute inspection.",
    ),
    rule: l("七曜塔—河童工房直達段封閉", "七曜塔―河童工房直通閉鎖", "Seven-Day–Kappa direct link closed"),
    closedEdges: [edgeKey("magic", "kappa")],
  },
  bambooMist: {
    glyph: "霧",
    severity: "blue",
    title: l("迷途竹林的霧把三個路標排成了評議委員會", "迷いの竹林の霧、三標識を評議会に配置", "Bamboo mist has arranged three signs into a review committee"),
    body: l(
      "所有經永遠亭的地面路線增加七分鐘。少數意見指向昨天，暫不採納。",
      "永遠亭経由の地上経路は7分増。少数意見は昨日を指すため保留。",
      "All ground routes through Eientei gain seven minutes. The minority opinion points to yesterday and is tabled.",
    ),
    rule: l("永遠亭地面路段加 7 分鐘", "永遠亭地上区間は7分増", "Add 7 minutes to ground links through Eientei"),
    edgeDelay: {
      [edgeKey("boundary", "clinic")]: 7,
      [edgeKey("history", "clinic")]: 7,
      [edgeKey("magic", "clinic")]: 7,
      [edgeKey("clinic", "kappa")]: 7,
    },
  },
  danmakuPractical: {
    glyph: "弾",
    severity: "red",
    title: l("境界講堂上空進行補考彈幕實作", "境界講堂上空で追試弾幕実習", "Make-up danmaku practical above Boundary Hall"),
    body: l(
      "講堂屋頂停泊取消至本時段末。步行入口開放，但請不要把答案寫在躲避路線上。",
      "講堂屋上の駐機は本時限終了まで停止。徒歩入口は開放、回避経路へ解答を書かないこと。",
      "Roof berthing is cancelled until the end of this period. Walking access remains open; do not write answers on dodge paths.",
    ),
    rule: l("所有經境界講堂的空路停用", "境界講堂経由の空路停止", "Air links through Boundary Hall closed"),
    closedTransitNodes: ["boundary"],
  },
  bookFlock: {
    glyph: "書",
    severity: "blue",
    title: l("霧湖圖書館北翼正在清點返航館藏", "霧の湖北翼、帰航資料を点呼中", "Misty Lake North Wing is counting returning holdings"),
    body: l(
      "兩間閱覽室暫作著陸緩衝區；館員保證空房查詢比書群可靠一點。",
      "閲覧室二室を着陸緩衝区へ転用。司書は空室検索の方が本の群れより少し信頼できると保証。",
      "Two reading rooms are temporary landing buffers. Staff promise the room finder is slightly more reliable than the flock.",
    ),
    rule: l("霧湖閱覽席減少 18 席", "霧の湖閲覧席を18席減", "Misty Lake reading capacity reduced by 18"),
    roomSeatDelta: { library: -18 },
  },
  faithProcession: {
    glyph: "祭",
    severity: "green",
    title: l("三方信仰遊行同時申報了同一條「唯一正門」", "三信仰行列、同じ「唯一の正門」を同時申請", "Three faith processions filed for the same “only true gate”"),
    body: l(
      "博麗門至境界講堂改為單向步行。神奈子、白蓮與神子均表示自己願意禮讓到對方先撤回。",
      "博麗門―境界講堂は一方通行。神奈子・白蓮・神子は相手が撤回するまで譲ると表明。",
      "Hakurei Gate–Boundary Hall is one-way on foot. Kanako, Byakuren, and Miko will yield until someone else withdraws.",
    ),
    rule: l("正門—境界講堂步行加 4 分鐘", "正門―境界講堂徒歩は4分増", "Add 4 minutes to Gate–Boundary walking"),
    edgeDelay: { [edgeKey("gate", "boundary")]: 4 },
  },
  nightSparrow: {
    glyph: "膳",
    severity: "green",
    title: l("夜雀把晚食窗口提前，並否認這與排練有關", "夜雀、夜食窓口を前倒し。稽古との関係は否定", "The night sparrow opened supper early and denies any link to rehearsal"),
    body: l(
      "八目鰻與梅飯糰自今日黃昏供應；演唱音量不列入營養標示。",
      "八目鰻と梅おにぎりは本日夕刻から。歌唱音量は栄養表示に含まれない。",
      "Lamprey and plum rice balls are served from dusk. Singing volume is not nutritional information.",
    ),
    rule: l("晚食窗口提早 40 分鐘", "夜食窓口を40分前倒し", "Supper opens 40 minutes early"),
    diningFlag: "early-supper",
  },
};

const eventIds = Object.keys(liveCampusEvents);

export function liveCampusSnapshot(date = new Date()) {
  const day = dayOrdinal(date);
  const band = liveCampusTimeBand(date);
  const phase = liveCampusLunarPhase(date);
  const slot = Math.floor(date.getHours() / 3);
  const seed = hashValue(`${liveCampusDayKey(date)}:${slot}`);
  const first = eventIds[seed % eventIds.length];
  let second = eventIds[(seed >>> 8) % eventIds.length];
  if (second === first) second = eventIds[(eventIds.indexOf(first) + 3) % eventIds.length];
  const ids = [first, second];
  if ((phase === 4 || phase === 0) && !ids.includes("bambooMist")) ids[1] = "bambooMist";
  if ((band === "evening" || band === "night") && !ids.includes("nightSparrow")) ids[1] = "nightSparrow";
  const activeEvents = [...new Set(ids)].map((id) => ({ id, ...liveCampusEvents[id] }));
  const routeRules = {
    closedModes: [],
    closedEdges: [],
    closedTransitNodes: [],
    modeDelay: {},
    edgeDelay: {},
  };
  activeEvents.forEach((event) => {
    routeRules.closedModes.push(...(event.closedModes || []));
    routeRules.closedEdges.push(...(event.closedEdges || []));
    routeRules.closedTransitNodes.push(...(event.closedTransitNodes || []));
    Object.entries(event.modeDelay || {}).forEach(([id, value]) => {
      routeRules.modeDelay[id] = (routeRules.modeDelay[id] || 0) + value;
    });
    Object.entries(event.edgeDelay || {}).forEach(([id, value]) => {
      routeRules.edgeDelay[id] = (routeRules.edgeDelay[id] || 0) + value;
    });
  });
  return {
    dayKey: liveCampusDayKey(date),
    day,
    slot,
    seed,
    band,
    phase,
    academicDay: ((day % 5) + 5) % 5,
    activeEvents,
    routeRules,
    weather: [
      l("薄霧・湖風平穩", "薄霧・湖風安定", "Light mist · steady lake wind"),
      l("山側陣風・紙張需鎮住", "山側突風・紙を固定", "Mountain gusts · secure loose papers"),
      l("竹林濕氣・路標字跡暈開", "竹林湿気・標識の墨にじみ", "Bamboo humidity · signs bleeding"),
      l("晴間・妖精局部降水", "晴れ間・妖精性局地雨", "Sunny intervals · fairy-local rain"),
    ][seed % 4],
    online: 72 + (seed % 97),
    topics: 48 + ((seed >>> 5) % 83),
  };
}

const facilityProfiles = {
  library: { start: 7 * 60, end: 2 * 60, capacity: 60 },
  boundary: { start: 8 * 60, end: 21 * 60, capacity: 48 },
  history: { start: 8 * 60 + 30, end: 19 * 60, capacity: 30 },
  magic: { start: 8 * 60, end: 23 * 60, capacity: 24 },
  kappa: { start: 7 * 60 + 30, end: 18 * 60 + 30, capacity: 20 },
};

function minuteStamp(value) {
  return `${String(Math.floor(value / 60) % 24).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function isWithinHours(minute, start, end) {
  if (end < start) return minute >= start || minute < end;
  return minute >= start && minute < end;
}

export function liveFacilityStatus(placeId, locale = "zh-Hant", date = new Date()) {
  const profile = facilityProfiles[placeId];
  if (!profile) return null;
  const state = liveCampusSnapshot(date);
  const hasEvent = (id) => state.activeEvents.some((event) => event.id === id);
  let { start, end, capacity } = profile;
  let note = l("依校鐘正常開放", "校鐘どおり通常開館", "Operating by the ordinary bell schedule");

  if (placeId === "library" && hasEvent("bookFlock")) {
    end = 30;
    capacity -= 18;
    note = l("北翼改作返航館藏緩衝區", "北翼を帰航資料の緩衝区へ転用", "North Wing is a landing buffer for returning holdings");
  } else if (placeId === "boundary" && hasEvent("danmakuPractical")) {
    start = 10 * 60;
    capacity -= 16;
    note = l("屋頂補考，前兩排改作退路", "屋上追試のため前二列を退避路へ", "Roof make-up practical; front rows are exit lanes");
  } else if (placeId === "history" && state.phase === 4) {
    end = 17 * 60 + 30;
    capacity -= 8;
    note = l("滿月檔案櫃提前點名", "満月書庫は早めに点呼", "Full-moon archive cabinets take early attendance");
  } else if (placeId === "magic" && hasEvent("crosswind")) {
    end = 21 * 60 + 30;
    capacity -= 6;
    note = l("高層窗封閉，兩間實驗室降載", "高層窓を閉鎖、実験室二室を減載", "Upper windows closed; two laboratories are load-limited");
  } else if (placeId === "kappa" && hasEvent("kappaTape")) {
    start = 8 * 60 + 30;
    end = 17 * 60;
    capacity -= 10;
    note = l("直達線維修，半數工作台拿去壓膠帶", "直通線修理、作業台半数はテープの重し", "Direct link repair; half the benches are holding tape down");
  }

  const minute = date.getHours() * 60 + date.getMinutes();
  const open = isWithinHours(minute, start, end);
  const occupancy = open ? hashValue(`${state.dayKey}:${state.slot}:${placeId}`) % Math.max(3, capacity - 2) : capacity;
  const availableSeats = open ? Math.max(0, capacity - occupancy) : 0;
  return {
    id: placeId,
    open,
    hours: `${minuteStamp(start)}—${minuteStamp(end)}`,
    capacity,
    availableSeats,
    note: note[locale],
    snapshotKey: `${state.dayKey}:${state.slot}`,
  };
}

export function liveFacilityBoard(locale = "zh-Hant", date = new Date()) {
  return Object.keys(facilityProfiles).map((id) => liveFacilityStatus(id, locale, date));
}

const mapNoticePool = [
  l(
    "捐款箱暫代失物箱。靈夢表示這不代表失物可以暫代捐款。",
    "賽銭箱は一時的に遺失物箱。霊夢曰く、遺失物が賽銭の代わりになるわけではない。",
    "The donation box is temporarily Lost Property. Reimu says lost property is not temporarily a donation.",
  ),
  l(
    "今日第四條「近路」比正路多十一分鐘；竹林定向部拒絕撤銷近路資格。",
    "本日四本目の「近道」は通常路より十一分長い。竹林オリエン部は近道資格の取消を拒否。",
    "Today’s fourth “shortcut” is eleven minutes longer. Bamboo Orienteering refuses to revoke its shortcut status.",
  ),
  l(
    "被雨淋皺的校報仍標明明日日期。文稱這只能證明雨下得比較早。",
    "雨で皺んだ学報の日付はまだ明日。文は雨が早く降った証拠にすぎないと主張。",
    "The rain-wrinkled campus paper is still dated tomorrow. Aya says this proves only that the rain arrived early.",
  ),
  l(
    "北側木牌的錯字已訂正三次；目前錯的是訂正日期。",
    "北側木札の誤字は三度訂正済み。現在誤っているのは訂正日。",
    "The north sign’s typo has been corrected three times. The correction date is now wrong.",
  ),
];

export function liveMapNotice(locale = "zh-Hant", date = new Date()) {
  const state = liveCampusSnapshot(date);
  const event = state.activeEvents[(state.seed >>> 4) % state.activeEvents.length];
  const useEvent = (state.seed & 1) === 0;
  return {
    label: l("今日木板", "本日の木札", "TODAY'S WOODEN NOTICE")[locale],
    text: useEvent ? `${event.title[locale]}：${event.rule[locale]}` : mapNoticePool[(state.seed >>> 7) % mapNoticePool.length][locale],
    snapshotKey: `${state.dayKey}:${state.slot}`,
  };
}

const menuPool = [
  ["hakurei", l("博麗定食", "博麗定食", "Hakurei Set"), l("山菜飯、烤豆腐、味噌湯、醃蘿蔔", "山菜ご飯、焼き豆腐、味噌汁、たくあん", "Mountain rice, grilled tofu, miso soup, pickled radish"), "540", l("人氣", "人気", "Popular")],
  ["bamboo", l("竹林月見麵", "竹林月見そば", "Bamboo Moon Soba"), l("蕎麥麵、溫泉蛋、竹筍、紫蘇", "蕎麦、温泉卵、筍、大葉", "Soba, soft egg, bamboo shoot, shiso"), "480", l("素食可", "菜食可", "Veg option")],
  ["kappa", l("河童工房咖哩", "河童工房カレー", "Kappa Workshop Curry"), l("深綠蔬菜咖哩、齒輪蓮藕、米飯", "深緑野菜カレー、歯車れんこん、ご飯", "Green vegetable curry, gear-cut lotus, rice"), "620", l("微辣", "中辛", "Medium")],
  ["sparrow", l("夜雀晚食", "夜雀夜食", "Night-Sparrow Supper"), l("烤八目鰻、梅飯糰、夜茶", "焼き八目鰻、梅おにぎり、夜茶", "Grilled lamprey, plum rice ball, night tea"), "700", l("黃昏後", "夕刻以降", "After dusk")],
  ["fairy", l("妖精份水果盅", "妖精サイズ果物鉢", "Fairy Fruit Bowl"), l("當季莓果、薄荷、蜂蜜露", "季節のベリー、ミント、蜂蜜露", "Seasonal berries, mint, honey dew"), "260", l("小份", "小", "Small")],
  ["scarlet", l("紅魔館鐘塔焗飯", "紅魔館鐘楼ドリア", "Scarlet Clocktower Gratin"), l("紅醬米飯、蘑菇、刻度起司", "赤ソース飯、茸、目盛チーズ", "Tomato rice, mushrooms, calibrated cheese"), "680", l("出餐時間不保證線性", "提供時間は非線形", "Service time may be nonlinear")],
  ["moriya", l("守矢風祝飯糰", "守矢風祝おにぎり", "Moriya Wind-Priestess Rice Ball"), l("山椒味噌、蕎麥籽、被風吹歪的海苔", "山椒味噌、蕎麦実、風で傾いた海苔", "Pepper miso, buckwheat, wind-tilted nori"), "390", l("神德不計入熱量", "神徳は熱量外", "Divine merit not in calories")],
  ["myouren", l("命蓮寺精進鍋", "命蓮寺精進鍋", "Myouren Temple Shōjin Pot"), l("豆皮、山菇、蓮根、辯論後剩下的白菜", "湯葉、山茸、蓮根、討論後の白菜", "Tofu skin, mountain mushrooms, lotus, post-debate cabbage"), "560", l("全素", "完全菜食", "Vegan")],
  ["moon", l("月都無菌布丁", "月都無菌プリン", "Lunar Sterile Custard"), l("月兔奶、銀糖、沒有被批准的焦糖一滴", "月兎乳、銀糖、未承認カラメル一滴", "Moon-rabbit milk, silver sugar, one unapproved drop of caramel"), "430", l("限量", "数量限定", "Limited")],
  ["forest", l("魔法森林拾穗派", "魔法の森拾穂パイ", "Magic Forest Forager Pie"), l("今日可識別菇類、洋蔥、酥皮", "本日識別済み茸、玉葱、パイ皮", "Today’s identified mushrooms, onion, pastry"), "590", l("每批配方不同", "ロット別配合", "Recipe varies by batch")],
  ["cirno", l("霧湖九號刨冰", "霧の湖⑨かき氷", "Misty Lake Nine Shaved Ice"), l("九種藍色糖漿，味道實際只有三種", "青い蜜九種、実味は三種", "Nine blue syrups, three actual flavours"), "320", l("融化後不受理退餐", "融解後返品不可", "No returns after melting")],
  ["history", l("稗田抄本茶泡飯", "稗田写本茶漬け", "Hieda Copyist Ochazuke"), l("烘茶、梅、海苔、可食用訂正紙", "焙じ茶、梅、海苔、可食訂正紙", "Roasted tea, plum, nori, edible correction slip"), "510", l("附一處勘誤", "訂正一箇所付", "Includes one correction")],
];

export function liveDiningMenu(locale, date = new Date()) {
  const state = liveCampusSnapshot(date);
  const mandatory = state.band === "evening" || state.band === "night" ? "sparrow" : "hakurei";
  const rotated = menuPool
    .filter(([id]) => id !== mandatory)
    .sort((a, b) => hashValue(`${state.dayKey}:${a[0]}`) - hashValue(`${state.dayKey}:${b[0]}`))
    .slice(0, 5);
  const selected = [menuPool.find(([id]) => id === mandatory), ...rotated];
  return selected.map(([, name, contents, price, note]) => [
    name[locale],
    contents[locale],
    locale === "en" ? `¥${price}` : `${price} ${locale === "zh-Hant" ? "円" : "円"}`,
    note[locale],
  ]);
}

const timetablePool = [
  ["08:30", l("幻想鄉通史", "幻想郷通史", "History of Gensokyo"), "HH-302", l("上白澤慧音", "上白沢慧音", "Keine Kamishirasawa")],
  ["09:10", l("結界可識別性", "境界識別可能性", "Boundary Identifiability"), "BH-108", l("八雲紫", "八雲紫", "Yukari Yakumo")],
  ["10:20", l("七曜元素論 II", "七曜元素論 II", "Seven-Day Elemental Theory II"), "SD-07", l("帕秋莉・諾蕾姬", "パチュリー・ノーレッジ", "Patchouli Knowledge")],
  ["11:40", l("信仰與公共空間", "信仰と公共空間", "Faith and Public Space"), "BH-204", l("聖白蓮／八坂神奈子", "聖白蓮／八坂神奈子", "Byakuren Hijiri / Kanako Yasaka")],
  ["13:10", l("低落差水輪", "低落差水車", "Low-Head Turbines"), "KW-W2", l("河城荷取", "河城にとり", "Nitori Kawashiro")],
  ["14:20", l("藥理與月相偏差", "薬理と月相偏差", "Pharmacology and Lunar Bias"), "EI-C3", l("八意永琳", "八意永琳", "Eirin Yagokoro")],
  ["15:00", l("消息來源倫理", "情報源倫理", "Source Ethics"), "BN-201", l("射命丸文", "射命丸文", "Aya Shameimaru")],
  ["16:10", l("可重現魔法實作", "再現可能魔法実習", "Reproducible Magic Practice"), "SD-11", l("霧雨魔理沙", "霧雨魔理沙", "Marisa Kirisame")],
  ["17:20", l("符卡式答辯", "スペルカード式討論", "Spell-card Defence"), "BH-108", l("博麗靈夢", "博麗霊夢", "Reimu Hakurei")],
  ["18:10", l("校報訂正工房", "学報訂正工房", "Campus Corrections Workshop"), "BN-201", l("射命丸文／匿名訂正員", "射命丸文／匿名訂正員", "Aya Shameimaru / anonymous corrector")],
];

export function liveTimetable(locale, date = new Date()) {
  const state = liveCampusSnapshot(date);
  const ordered = timetablePool
    .slice(state.academicDay * 2)
    .concat(timetablePool.slice(0, state.academicDay * 2))
    .slice(0, 6);
  return ordered
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([time, course, room, teacher]) => {
      let dynamicRoom = room;
      let note = l("照常", "通常", "As scheduled")[locale];
      if (state.activeEvents.some((event) => event.id === "danmakuPractical") && room.startsWith("BH-")) {
        dynamicRoom = "HH-201";
        note = l("因補考彈幕移至稗田館", "追試弾幕のため稗田館へ", "Moved to Hieda during make-up danmaku")[locale];
      }
      if (state.activeEvents.some((event) => event.id === "kappaTape") && room.startsWith("KW-")) {
        dynamicRoom = "KW-YARD";
        note = l("工房直達線封閉，改在前院", "工房直通閉鎖・前庭へ", "Workshop link closed; meet in yard")[locale];
      }
      return [time, course[locale], dynamicRoom, teacher[locale], note];
    });
}

const roomBase = [
  ["ML-204", "library", 24, "reading"],
  ["BH-108", "boundary", 48, "classroom"],
  ["HH-302", "history", 18, "seminar"],
  ["SD-07", "magic", 12, "lab"],
  ["KW-W2", "kappa", 16, "workshop"],
  ["ML-NIGHT", "library", 36, "reading"],
];

export function liveRoomAvailability(date = new Date()) {
  const state = liveCampusSnapshot(date);
  const minute = date.getHours() * 60 + date.getMinutes();
  return roomBase.map(([code, building, seats, kind], index) => {
    const facility = liveFacilityStatus(building, "en", date);
    const freeMinutes = 35 + (hashValue(`${state.dayKey}:${state.slot}:${code}`) % 190);
    const until = Math.min(23 * 60 + 50, minute + freeMinutes);
    const delta = state.activeEvents.reduce((sum, event) => sum + (event.roomSeatDelta?.[building] || 0), 0);
    return {
      code,
      building,
      seats: Math.min(
        Math.max(0, seats + (building === "library" ? delta : 0)),
        facility?.availableSeats ?? seats,
      ),
      freeUntil: `${String(Math.floor(until / 60)).padStart(2, "0")}:${String(until % 60).padStart(2, "0")}`,
      kind,
      available: Boolean(facility?.open) && (facility?.availableSeats || 0) > 0 && (hashValue(`${state.seed}:${index}`) % 5) !== 0,
    };
  });
}

export function liveExamSchedule(locale, date = new Date()) {
  const exams = [
    [2, l("符卡式口試", "スペルカード式口試", "Spell-card Oral"), l("境界講堂", "境界講堂", "Boundary Hall"), l("三段宣言＋停止條件", "三段宣言＋停止条件", "Three declarations + stop condition")],
    [5, l("七曜元素論 II", "七曜元素論 II", "Seven-Day Elemental Theory II"), l("七曜實驗塔", "七曜実験塔", "Seven-Day Laboratory"), l("筆試＋安全實作", "筆記＋安全実習", "Written + safety practicum")],
    [8, l("幻想鄉通史", "幻想郷通史", "History of Gensokyo"), l("稗田史學館", "稗田史学館", "Hieda History Hall"), l("開卷史料批判", "資料持込・史料批判", "Open-source criticism")],
    [11, l("低落差水輪", "低落差水車", "Low-Head Turbines"), l("河童聯合工房", "河童共同工房", "Kappa Joint Workshop"), l("現場拆裝；膠帶不得作答案", "現地分解・テープは解答不可", "Field disassembly; tape is not an answer")],
    [14, l("消息來源倫理", "情報源倫理", "Source Ethics"), l("天狗新聞館", "天狗新聞館", "Tengu News Hall"), l("訂正稿與衝突揭露", "訂正版・利益相反開示", "Correction copy + conflict disclosure")],
  ];
  return exams.map(([offset, title, venue, format]) => {
    const when = new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
    const stamp = `${String(when.getMonth() + 1).padStart(2, "0")}.${String(when.getDate()).padStart(2, "0")}`;
    return [stamp, title[locale], venue[locale], format[locale]];
  });
}

export function seededPostCreatedAt(index, position, date = new Date()) {
  const elapsedToday = Math.max(8, date.getHours() * 60 + date.getMinutes());
  const ageMinutes = 4 + (hashValue(`${liveCampusDayKey(date)}:${index}:${position}`) % Math.min(1_380, elapsedToday + 180));
  return new Date(date.getTime() - ageMinutes * 60_000).toISOString();
}
