const l = (zhHant, ja, en) => ({ "zh-Hant": zhHant, ja, en });

export const orientationSeason = Object.freeze({
  id: "first-bell-2026",
  code: "FIRST BELL 2026",
  window: l("十月十一日至十八日", "10月11日—18日", "11–18 October"),
  title: l("第一鐘・新生到着週", "第一鐘・新入生到着週", "First Bell · New Student Arrival Week"),
  premise: l(
    "錄取只表示校方同意你進門；報到要確認你找得到門、退路，以及願意共同生活的人。",
    "合格は大学が入門を認めたというだけ。手続では、門と退路、そして共に暮らす相手を自分で確かめます。",
    "Admission means the university will let you in. Arrival means knowing the gate, the way back, and the people with whom you will share campus.",
  ),
});

export const orientationSchoolDestinations = Object.freeze({
  boundary: "boundary",
  history: "history",
  magic: "magic",
  medicine: "clinic",
  engineering: "kappa",
  journalism: "history",
  coexistence: "boundary",
});

export const orientationStopSignals = Object.freeze([
  {
    id: "wood-bell",
    glyph: "鐘",
    name: l("三聲木鐘", "三打の木鐘", "Three wooden bells"),
    detail: l(
      "第一聲停下，第二聲看清最近的朱繩，第三聲才移動。聽不見木鐘的人不要選這一項。",
      "一打目で止まり、二打目で最寄りの朱縄を確認し、三打目で移動します。木鐘を聞き取れない人には向きません。",
      "Stop at the first bell, find the nearest vermilion cord at the second, and move only on the third. Do not choose this if you cannot reliably hear it.",
    ),
  },
  {
    id: "red-white-lamps",
    glyph: "灯",
    name: l("紅白退路燈", "紅白退路灯", "Red-and-white exit lamps"),
    detail: l(
      "紅燈表示原路停止使用，白燈沿可通行邊界逐盞亮起；不以顏色辨識時，燈座會同時震動。",
      "赤灯で元の経路を停止し、白灯が通行可能な境界に沿って順に点灯します。色を使わない案内では灯台も振動します。",
      "Red closes the original route; white lights advance along a passable boundary. The lamp bases also pulse when colour is not a usable cue.",
    ),
  },
  {
    id: "paired-cord",
    glyph: "結",
    name: l("雙人朱繩", "二人朱縄", "Paired vermilion cord"),
    detail: l(
      "兩人各持一端，只有彼此都回應才改道。繩子負責保持聯絡，不負責替任何人作決定。",
      "二人で両端を持ち、双方の応答がそろった時だけ経路を変えます。縄は連絡を保ちますが、本人の代わりに判断しません。",
      "Each person holds one end and the route changes only after both answer. The cord preserves contact; it does not decide for either person.",
    ),
  },
]);

export const orientationNoticePlans = Object.freeze([
  {
    id: "archive-board",
    glyph: "板",
    name: l("木板公告＋稗田留底", "木札掲示＋稗田控え", "Notice board + Hieda copy"),
    detail: l(
      "適合每天會經過博麗門的人。公告可以換版，原版仍留在史料館。",
      "毎日博麗門を通る人向け。掲示は差し替えられますが、旧版は史料館に残ります。",
      "For anyone passing Hakurei Gate each day. The board may be replaced; the previous version remains at the archive.",
    ),
  },
  {
    id: "tengu-correction",
    glyph: "訂",
    name: l("鴉天狗郵便＋公開訂正", "鴉天狗郵便＋公開訂正", "Tengu post + public correction"),
    detail: l(
      "送得最快，也最可能比決定早到。每一版都要保留時間與訂正關係。",
      "最速ですが、決定より先に届くこともあります。各版の時刻と訂正関係を残します。",
      "Fastest, and therefore capable of arriving before the decision. Every edition retains its time and correction trail.",
    ),
  },
  {
    id: "named-buddy",
    glyph: "伴",
    name: l("指定同路人＋本人覆核", "同行者指定＋本人確認", "Named companion + personal check"),
    detail: l(
      "同路人可以轉述改道，但最後仍由你確認。即使對方能讀心，也不能代替你的回覆。",
      "同行者は迂回を伝えられますが、最後は本人が確認します。心を読めても返答の代行はできません。",
      "A companion may relay a detour, but you make the final confirmation. Mind-reading still does not count as your reply.",
    ),
  },
]);

export const orientationFirstStops = Object.freeze([
  {
    id: "first-course",
    glyph: "課",
    route: "course-registration",
    name: l("把第一門課放進生活", "最初の一科目を生活へ", "Put the first course into your life"),
    detail: l(
      "課號可以先選；教室、月相與不普通衝堂仍要在課表上逐項確認。",
      "科目番号は選べますが、教室・月相・普通でない重複は時間割で一つずつ確認します。",
      "Choose the course first; room, lunar phase, and non-ordinary clashes still need checking on the timetable.",
    ),
  },
  {
    id: "first-room",
    glyph: "寮",
    route: "housing-application",
    name: l("把共同生活條件談清楚", "共同生活の条件を先に話す", "State the terms of living together"),
    detail: l(
      "適合的房間不是沒有麻煩，而是月相、翼展、水域、穿牆與作息能先被看見。",
      "合う部屋とは問題のない部屋ではなく、月相・翼幅・水域・壁抜け・生活時間を先に確認できる部屋です。",
      "A suitable room is not trouble-free; it makes lunar, wingspan, water, phasing, and schedule needs visible early.",
    ),
  },
  {
    id: "first-club",
    glyph: "朋",
    route: "campus",
    name: l("去聽《四季同時發生》", "『四季同時発生』を聴きに行く", "Hear Four Seasons at Once"),
    detail: l(
      "妖精合唱團允許忘詞後重新加入；其他社團也各有一條不會為迎新方便而取消的規矩。",
      "妖精合唱団は歌詞を忘れても戻れます。ほかの団体にも、新歓の都合では消えない規則があります。",
      "The Fairy Choir lets a singer re-enter after forgetting a phrase. Every other society also keeps one rule it will not waive for recruitment.",
    ),
  },
  {
    id: "first-gate",
    glyph: "祭",
    route: "festival-operations",
    name: l("先看三扇唯一正門怎麼開", "三つの唯一正門が開くところを見る", "Watch three sole main gates open"),
    detail: l(
      "營運室不會讓新生替六桌代簽；你可以先讀清楚誰在爭門、誰負責讓人平安回來。",
      "運営室は新入生に六机の代署をさせません。誰が門を争い、誰が無事の帰還を担うかは先に読めます。",
      "The operations room will not let a newcomer sign for six desks. You may still learn who disputes the gate and who is responsible for getting people home.",
    ),
  },
]);

export function orientationLocalized(value, locale = "zh-Hant") {
  return value?.[locale] ?? value?.["zh-Hant"] ?? "";
}

export function orientationStopSignal(id) {
  return orientationStopSignals.find((entry) => entry.id === id) || null;
}

export function orientationNoticePlan(id) {
  return orientationNoticePlans.find((entry) => entry.id === id) || null;
}

export function orientationFirstStop(id) {
  return orientationFirstStops.find((entry) => entry.id === id) || null;
}
