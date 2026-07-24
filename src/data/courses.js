import { schools } from "./schools.js";

const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });
const m = (instructor, day, period, room, capacity, occupied, prerequisites, note, extras = {}) => ({
  instructor,
  day,
  period,
  room,
  capacity,
  occupied,
  prerequisites,
  note,
  ...extras,
});

export const courseTerm = {
  id: "2026-autumn",
  label: l("幻想曆 142・秋季", "幻想暦142年・秋学期", "Gensokyo 142 · Autumn"),
  addDeadline: l("加選至 9 月 14 日", "履修追加は9月14日まで", "Add through 14 September"),
  dropDeadline: l("退選至 10 月 5 日", "履修取消は10月5日まで", "Drop through 5 October"),
  creditLimit: 18,
};

export const courseDays = {
  mon: l("週一", "月曜", "Monday"),
  tue: l("週二", "火曜", "Tuesday"),
  wed: l("週三", "水曜", "Wednesday"),
  thu: l("週四", "木曜", "Thursday"),
  fri: l("週五", "金曜", "Friday"),
  sat: l("週六", "土曜", "Saturday"),
  lunar: l("月相指定日", "月相指定日", "Lunar session"),
  boundary: l("邊界相鄰日", "境界隣接日", "Boundary-adjacent day"),
};

export const coursePeriods = {
  p1: ["08:30", "10:00"],
  p2: ["10:20", "11:50"],
  p3: ["13:10", "14:40"],
  p4: ["15:00", "16:30"],
  p5: ["17:20", "18:50"],
  p6: ["19:10", "20:40"],
};

const teachers = {
  reimu: l("博麗 靈夢", "博麗 霊夢", "Reimu Hakurei"),
  yukari: l("八雲 紫", "八雲 紫", "Yukari Yakumo"),
  keine: l("上白澤 慧音", "上白沢 慧音", "Keine Kamishirasawa"),
  akyuu: l("稗田 阿求", "稗田 阿求", "Hieda no Akyuu"),
  patchouli: l("帕秋莉・諾蕾姬", "パチュリー・ノーレッジ", "Patchouli Knowledge"),
  marisa: l("霧雨 魔理沙", "霧雨 魔理沙", "Marisa Kirisame"),
  alice: l("愛麗絲・瑪格特洛依德", "アリス・マーガトロイド", "Alice Margatroid"),
  eirin: l("八意 永琳", "八意 永琳", "Eirin Yagokoro"),
  reisen: l("鈴仙・優曇華院・因幡", "鈴仙・優曇華院・イナバ", "Reisen Udongein Inaba"),
  nitori: l("河城 荷取", "河城 にとり", "Nitori Kawashiro"),
  aya: l("射命丸 文", "射命丸 文", "Aya Shameimaru"),
  hatate: l("姬海棠 果", "姫海棠 はたて", "Hatate Himekaidou"),
  sanae: l("東風谷 早苗", "東風谷 早苗", "Sanae Kochiya"),
  byakuren: l("聖 白蓮", "聖 白蓮", "Byakuren Hijiri"),
  miko: l("豐聰耳 神子", "豊聡耳 神子", "Toyosatomimi no Miko"),
};

const meta = {
  "BIS-101": m(teachers.reimu, "mon", "p1", "BH-108", 48, 31, [], l("第一堂先畫退路；畫成賽錢箱形狀不加分。", "初回は退路を描く。賽銭箱型でも加点なし。", "The first class draws exits. Donation-box shapes earn no bonus.")),
  "BIS-132": m(teachers.keine, "tue", "p3", "BH-203", 36, 36, ["BIS-101"], l("現場筆記須保留第一版，即使第二版比較不丟臉。", "現場記録は初版を保存。第二版の方が恥ずかしくなくても同様。", "Keep the first field note even when the second is less embarrassing.")),
  "BIS-204": m(teachers.reimu, "thu", "p4", "BH-RING", 28, 19, ["BIS-101"], l("退路設計占 40%；漂亮但不能停下來的符卡不及格。", "退路設計40%。美しくても停止不能なスペルは不可。", "Exit design is 40%; a beautiful spell that cannot stop fails.")),
  "BIS-271": m(teachers.yukari, "boundary", "p2", "BH-∞", 24, 17, ["BIS-101"], l("教室與所有教室邊界相鄰，系統只提出警告，不敢替你判斷。", "教室は全教室と境界隣接。システムは警告のみで判断を避ける。", "The room borders every room. The system warns but declines to decide."), { boundaryAdjacent: true }),
  "BIS-401": m(teachers.yukari, "fri", "p3", "FIELD", 12, 12, ["BIS-132", "BIS-204"], l("滿班後只接受由異變本人簽名的加簽單。", "満員後は異変本人の署名入り追加票のみ受付。", "Once full, overrides require the incident's own signature."), { noWaitlist: true }),

  "HRS-100": m(teachers.keine, "mon", "p2", "HH-302", 56, 56, [], l("同一事件可交三個版本；請勿把三份都寫成最後真相。", "同じ事件を三版提出可。ただし全てを最終真実としないこと。", "Three versions of one event are welcome; do not call all three final truth.")),
  "HRS-126": m(teachers.akyuu, "tue", "p2", "ML-INNER", 18, 18, ["HRS-100"], l("教室位於《缺頁學》原書內部，與魔導書閱讀課構成非普通衝堂。", "教室は『欠頁学』原本の内部。魔導書読解と非通常の重複を起こす。", "The room sits inside the source volume and unusually conflicts with Grimoire Reading."), { conflictsWith: ["MTP-143"] }),
  "HRS-208": m(teachers.keine, "wed", "p4", "HH-204", 24, 11, ["HRS-100"], l("訪談超過三百年者時，『小時候』必須另附年代範圍。", "三百歳超への聞取では「子供の頃」に年代幅を添える。", "For narrators over 300, “when I was young” needs a date range.")),
  "HRS-250": m(teachers.keine, "wed", "p1", "TK-01", 30, 26, ["HRS-100"], l("若某個週三被歷史刪除，補課日在兩份校曆中擇一有效。", "水曜が歴史から消えた場合、二つの学暦の一方で補講。", "If a Wednesday is erased, the make-up occurs in one of two valid calendars.")),
  "HRS-410": m(teachers.akyuu, "fri", "p5", "HH-VAULT", 10, 8, ["HRS-126", "HRS-208"], l("畢業檔案必須容納一份你不相信、但不能刪掉的版本。", "卒業資料には信じないが削除できない版を一つ含める。", "The capstone must preserve one version you distrust but cannot delete.")),

  "MTP-111": m(teachers.patchouli, "mon", "p3", "SD-07", 40, 28, [], l("元素順序寫錯不會立刻扣分；桌子先長出剪刀時才會。", "元素順を誤っても即減点ではない。机から鋏が生えた時点で減点。", "A wrong element order is not penalized until the desk grows scissors.")),
  "MTP-143": m(teachers.patchouli, "thu", "p1", "ML-BOOK", 12, 12, ["MTP-111"], l("本課教室是一本會移架的書，與 HRS-126 不得同修。", "教室は移架する本。HRS-126との同時履修不可。", "The classroom is a shelving book and cannot be taken with HRS-126."), { conflictsWith: ["HRS-126"] }),
  "MTP-220": m(teachers.alice, "tue", "p4", "SD-DOLL", 24, 16, ["MTP-111"], l("遠端人偶代為點名無效；人偶若能回答追問則另案討論。", "人形による代返は無効。追問へ答えられる場合は別途審議。", "A doll cannot answer roll call unless it can also answer the follow-up.")),
  "MTP-308": m(teachers.marisa, "fri", "p2", "SD-BLAST", 20, 20, ["MTP-111", "BIS-101"], l("材料來源欄不可只寫『森林裡撿的』，最多占半格。", "素材出典「森で拾った」は半欄まで。", "“Found in the forest” may occupy at most half the provenance field.")),
  "MTP-430": m(teachers.marisa, "sat", "p3", "SD-STAR", 10, 7, ["MTP-220", "MTP-308"], l("期末作品須由不知情同學依說明書重現；爆炸方向也算結果。", "期末作は未説明の学生が手順書から再現。爆発方向も結果に含む。", "An uninformed peer reproduces the final; blast direction counts as a result.")),

  "LML-102": m(teachers.eirin, "mon", "p4", "EI-A1", 32, 21, [], l("第一週禁止假設所有人的脈搏、翅膀或生死狀態相同。", "初週は脈・翼・生死状態が全員同じとの仮定を禁止。", "Week one forbids assuming identical pulses, wings, or life states.")),
  "LML-166": m(teachers.reisen, "lunar", "p6", "EI-MOON", 20, 20, ["LML-102"], l("滿月與非滿月各上一次；只出席比較舒服的一次不算對照。", "満月・非満月に各一回。楽な方だけの出席は対照にならない。", "Meet once under full and non-full moons; attending only the easier one is not a control.")),
  "LML-240": m(teachers.eirin, "tue", "p5", "EI-SEALED", 16, 9, ["LML-102"], l("任何『永久』主張都要先定義對誰、維持多久。", "「永久」の主張は誰に、どれだけ続くかを先に定義。", "Every claim of permanence must say for whom and for how long.")),
  "LML-351": m(teachers.reisen, "thu", "p6", "EI-EAST", 24, 18, ["LML-102", "BIS-101"], l("導航考核會放置四盞燈；第四盞不是加分題。", "ナビ試験には四灯を置く。第四灯は加点問題ではない。", "Four lanterns appear in the navigation trial; the fourth is not bonus credit.")),
  "LML-602": m(teachers.eirin, "sat", "p6", "EI-CLINIC", 8, 8, ["LML-240", "LML-351"], l("夜診輪值不設候補；病人不按教務處排隊。", "夜診に補欠なし。患者は教務課順に並ばない。", "The night clinic has no waitlist; patients do not queue by registrar order."), { noWaitlist: true }),

  "KPE-110": m(teachers.nitori, "mon", "p1", "KW-W2", 64, 47, [], l("實驗水輪漏水不必然失敗；若它驅動了另一台水輪，須重寫目的。", "漏水は必ずしも失敗ではない。別の水車を駆動したら目的を書き直す。", "A leaking turbine is not always failure; if it powers another, revise the objective.")),
  "KPE-148": m(teachers.nitori, "tue", "p1", "KW-MET", 36, 30, ["KPE-110"], l("每個數字都要帶單位、時間戳與儀器上那塊膠帶的批次。", "数値には単位・時刻・計器のテープロットを付す。", "Every number needs units, timestamp, and the instrument's tape batch.")),
  "KPE-215": m(teachers.nitori, "wed", "p3", "KW-REPAIR", 28, 28, ["KPE-110"], l("打不開的盒子不算可維修，即使裡面仍在正常冒煙。", "開かない箱は整備可能としない。正常に煙が出ていても同じ。", "A box that cannot open is not repairable even when smoking normally.")),
  "KPE-322": m(teachers.nitori, "thu", "p3", "VILLAGE-3", 20, 13, ["KPE-148", "KPE-215"], l("村落試運轉須讓真正使用者碰按鈕；河童演示不算使用者測試。", "里の試運転では利用者がボタンを押す。河童実演は利用者試験ではない。", "Village users must touch the controls; a kappa demo is not user testing.")),
  "KPE-440": m(teachers.nitori, "sat", "p2", "KW-FALL", 12, 10, ["KPE-322"], l("作品需連續運轉三十日；把故障日從日曆撕掉不延長連續性。", "30日連続稼働。故障日を暦から破っても連続にはならない。", "The build must run 30 days; tearing failures from the calendar does not restore continuity.")),

  "TJM-105": m(teachers.aya, "mon", "p6", "BN-201", 52, 39, [], l("消息來源飛到鏡頭前仍可要求匿名；速度不構成同意。", "情報源がレンズ前へ飛んでも匿名を求められる。速度は同意ではない。", "A source may fly into frame and still request anonymity; speed is not consent.")),
  "TJM-144": m(teachers.aya, "tue", "p3", "BN-ROOF", 24, 22, ["TJM-105"], l("拍得到與應不應刊出分開評分；院長對此常提出異議。", "撮れるか、載せるべきかを別採点。学部長はしばしば異議。", "Can photograph and should publish are graded separately; the dean often objects.")),
  "TJM-212": m(teachers.hatate, "boundary", "p4", "BN-DESK", 20, 20, ["TJM-105"], l("異變發生時上課時間會移向異變；候補者須自備能追上的交通。", "異変発生時、授業時刻は異変へ移動。補欠者は追いつく交通を用意。", "During an incident, class time moves toward it; waitlisted students provide pursuit transport."), { boundaryAdjacent: true }),
  "TJM-301": m(teachers.aya, "fri", "p1", "BN-CORR", 30, 14, ["TJM-105"], l("本週案例可能是教師今早刊出的標題；訂正速度不保證比原文快。", "今週の事例は教員が今朝出した見出しかもしれない。訂正は原文より遅い。", "This week's case may be the teacher's morning headline; correction is rarely faster.")),
  "TJM-420": m(teachers.aya, "sat", "p4", "BN-PRESS", 12, 12, ["TJM-144", "TJM-301"], l("三報須互相矛盾得有證據，不能只靠三個不同標題。", "三報の矛盾には証拠が必要。見出し三種だけでは不可。", "Three reports need evidenced disagreement, not merely three headlines.")),

  "FCP-104": m(teachers.sanae, "tue", "p2", "FP-101", 44, 29, [], l("田野圖要標示神社、寺院，也要標示不想被任何一方招募的人。", "現地図には社寺と、どちらにも勧誘されたくない者を記す。", "Map shrines and temples—and people who want recruitment from neither.")),
  "FCP-160": m(teachers.byakuren, "wed", "p5", "FP-CIRCLE", 24, 24, ["FCP-104"], l("散會也是主持的一部分；把爭論帶回宿舍不算延長討論。", "閉会も進行の一部。議論を寮へ持ち帰っても延長とはしない。", "Ending the meeting is facilitation; carrying it to the dorm does not extend class.")),
  "FCP-233": m(teachers.miko, "thu", "p2", "FP-HEAR", 32, 23, ["FCP-104"], l("聽見十一種願望後仍須公開哪些不會被滿足。", "十一の望みを聞いても、満たさないものを公開する。", "After hearing eleven wishes, disclose which will not be met.")),
  "FCP-310": m(teachers.sanae, "fri", "p4", "FESTIVAL", 36, 31, ["FCP-104", "BIS-101"], l("三個宗教傳統可能同時預約主舞台；本課不接受『多蓋一座』作唯一答案。", "三伝統が同時に主舞台を予約し得る。「もう一つ建てる」だけでは不可。", "Three traditions may book one stage; “build another” is not a complete answer.")),
  "FCP-402": m(teachers.byakuren, "sat", "p5", "FP-TABLE", 12, 6, ["FCP-160", "FCP-233"], l("協議需三方簽字，反對意見附在正文後且不得縮成較小字。", "協定は三者署名。反対意見を本文後に同じ字級で付す。", "The agreement needs three signatures; dissent follows in equal-sized type.")),
};

export const courseCatalogue = Object.entries(schools).flatMap(([schoolId, school]) =>
  school.courses.map(([code, title, credits]) => ({
    code,
    title,
    credits,
    schoolId,
    school: school.name,
    ...meta[code],
  })),
);

export function courseByCode(code) {
  return courseCatalogue.find((course) => course.code === code);
}
