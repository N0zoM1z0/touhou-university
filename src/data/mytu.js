const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });

export const identityKinds = {
  human: l("人類", "人間", "Human"),
  youkai: l("妖怪", "妖怪", "Youkai"),
  fairy: l("妖精", "妖精", "Fairy"),
  magician: l("魔法使", "魔法使い", "Magician"),
  spirit: l("幽靈／靈體", "幽霊・霊体", "Ghost / spirit"),
  lunar: l("月之民／月兔", "月人・月兎", "Lunarian / moon rabbit"),
  other: l("其他／尚未決定", "その他・未定", "Other / undecided"),
};

export const originKinds = {
  gensokyo: l("幻想鄉居民", "幻想郷在住", "Gensokyo resident"),
  outside: l("外界來訪者", "外の世界から", "Outside World visitor"),
  lunar: l("月面與月都", "月面・月の都", "Moon / Lunar Capital"),
  shifting: l("居所會移動", "住居が移動する", "Residence moves"),
};

export const committeeBySchool = {
  boundary: ["yukari", "reimu", "keine"],
  history: ["keine", "aya", "reimu"],
  magic: ["patchouli", "marisa", "reimu"],
  medicine: ["eirin", "reimu", "keine"],
  engineering: ["nitori", "marisa", "aya"],
  journalism: ["aya", "keine", "reimu"],
  policy: ["byakuren", "kanako", "miko"],
};

export const reviewers = {
  reimu: {
    name: l("博麗 靈夢", "博麗 霊夢", "Reimu Hakurei"),
    role: l("異變應對實務教授", "異変対応実務 教授", "Professor of Incident Response"),
    stance: "condition",
    note: l(
      "可以做，但禁止以「異變處理」名義跳過退路與 no-Bomb 條件。若測試打穿神社結界，研究室自己修。",
      "実施は可。ただし「異変対応」を理由に退路や no-Bomb 条件を省略しないこと。神社の結界を破損した場合は研究室で修復。",
      "Proceed, but incident response is not an excuse to skip exit conditions or a no-Bomb constraint. If the shrine barrier breaks, the lab repairs it.",
    ),
  },
  yukari: {
    name: l("八雲 紫", "八雲 紫", "Yukari Yakumo"),
    role: l("結界研究創院教授", "境界研究 創設教授", "Founding Professor of Boundary Studies"),
    stance: "approve",
    note: l(
      "問題已經碰到一條值得研究的邊界。批准進入面試；至於面試在校內還是校外，屆時再定義。",
      "研究に値する境界へ到達している。面接へ進める。ただし面接が学内か学外かは当日に定義する。",
      "The question has reached a boundary worth studying. Approved for interview; whether the interview is inside or outside campus will be defined that day.",
    ),
  },
  keine: {
    name: l("上白澤 慧音", "上白沢 慧音", "Keine Kamishirasawa"),
    role: l("歷史記錄學院院長", "歴史記録学部長", "Dean of History and Records"),
    stance: "revise",
    note: l(
      "請把「發生了什麼」「誰留下記錄」與「哪一版被允許保存」分成三欄。現在的方法仍會把後來的敘述當成當時的證據。",
      "「何が起きたか」「誰が記録したか」「どの版が保存を許されたか」を三欄に分けること。現状では後世の叙述を当時の証拠として扱ってしまう。",
      "Separate what happened, who recorded it, and which version was allowed to remain. The current method still treats later narration as contemporary evidence.",
    ),
  },
  patchouli: {
    name: l("帕秋莉・諾蕾姬", "パチュリー・ノーレッジ", "Patchouli Knowledge"),
    role: l("元素理論教授", "元素理論 教授", "Professor of Elemental Theory"),
    stance: "revise",
    note: l(
      "「很難」不是可操作變量。請區分彈幕可讀性、控制延遲、路徑求解與資源限制，再說明哪一項能被反證。",
      "「難しい」は操作可能な変数ではない。弾幕の可読性、操作遅延、経路探索、資源制約を分け、反証可能な項目を示すこと。",
      "“Difficult” is not an operational variable. Separate danmaku readability, control latency, route solving, and resource limits, then identify what can be falsified.",
    ),
  },
  marisa: {
    name: l("霧雨 魔理沙", "霧雨 魔理沙", "Marisa Kirisame"),
    role: l("應用魔法教授", "応用魔法 教授", "Professor of Applied Magic"),
    stance: "approve",
    note: l(
      "方法能跑就先跑。正式試驗前交三次可重現失敗，還有材料來源；「森林裡撿的」這次只能算半欄。",
      "動く方法ならまず試せ。正式実験前に再現可能な失敗を三回と素材出典を提出。「森で拾った」は今回は半欄扱い。",
      "If the method runs, run it. Submit three reproducible failures and material provenance before the formal trial; “found in the forest” counts as half a field.",
    ),
  },
  eirin: {
    name: l("八意 永琳", "八意 永琳", "Eirin Yagokoro"),
    role: l("月都醫藥生命學院院長", "月都医薬生命学部長", "Dean of Lunar Medicine"),
    stance: "approve",
    note: l(
      "研究問題可以進入下一階段。月相反應與疲勞必須各自記錄；住宿暫排竹林診療線附近，不得跟隨第四盞燈。",
      "次段階へ進める。月相反応と疲労は別々に記録すること。住居は竹林診療経路付近を仮指定し、第四の灯りには従わないこと。",
      "The question may proceed. Record lunar response separately from fatigue. Housing is provisionally near the bamboo clinic route; do not follow the fourth lantern.",
    ),
  },
  nitori: {
    name: l("河城 荷取", "河城 にとり", "Nitori Kawashiro"),
    role: l("河童工程學院院長", "河童工学部長", "Dean of Kappa Engineering"),
    stance: "approve",
    note: l(
      "原型可以做。請把輸入、輸出、故障時間戳和膠帶批次一起記；如果盒子打不開，就不算可維修。",
      "試作可。入力、出力、故障時刻、テープのロットを同時に記録すること。箱が開かなければ整備可能とは認めない。",
      "Prototype approved. Log inputs, outputs, failure timestamps, and tape batch together. If the box cannot be opened, it is not maintainable.",
    ),
  },
  aya: {
    name: l("射命丸 文", "射命丸 文", "Aya Shameimaru"),
    role: l("天狗新聞傳播學院院長", "天狗新聞報道学部長", "Dean of Tengu Journalism"),
    stance: "revise",
    note: l(
      "摘要很適合頭版，因此尤其需要先縮小主張。請在我替你想好標題之前補上來源鏈與公開訂正方案。",
      "一面向きの要旨だからこそ主張を絞る必要がある。こちらが見出しを決める前に、情報源の連鎖と公開訂正計画を追加すること。",
      "The abstract belongs on page one, which is exactly why its claim must shrink. Add a source chain and public-correction plan before I invent the headline.",
    ),
  },
  byakuren: {
    name: l("聖 白蓮", "聖 白蓮", "Byakuren Hijiri"),
    role: l("共生實務輪值教授", "共生実務 輪番教授", "Rotating Professor of Coexistence Practice"),
    stance: "approve",
    note: l(
      "問題願意看見不同身體與壽命承擔的成本，可以繼續。下一版請把不會留下文字的人也列入方法。",
      "異なる身体と寿命が負う費用を見ている点を評価する。次稿では文字を残さない者も方法に含めること。",
      "The question recognizes costs borne by different bodies and lifespans. Proceed, but include those who leave no written record in the next method.",
    ),
  },
  kanako: {
    name: l("八坂 神奈子", "八坂 神奈子", "Kanako Yasaka"),
    role: l("信仰基礎設施輪值教授", "信仰基盤 輪番教授", "Rotating Professor of Faith Infrastructure"),
    stance: "condition",
    note: l(
      "理念可以，資源表不行。請補上誰供電、誰維修、誰在祭典日取得優先權；信仰不會替缺少的預算欄供能。",
      "理念はよいが資源表が足りない。給電、整備、祭日の優先権を誰が担うか追記すること。信仰は空欄の予算を発電しない。",
      "The principle is sound; the resource table is not. Name who powers, repairs, and receives festival priority. Faith does not generate an omitted budget line.",
    ),
  },
  miko: {
    name: l("豐聰耳 神子", "豊聡耳 神子", "Toyosatomimi no Miko"),
    role: l("公共領導輪值教授", "公共指導 輪番教授", "Rotating Professor of Public Leadership"),
    stance: "revise",
    note: l(
      "我聽見了十一種願望，但申請只回答了其中三種。請公開你不準備滿足哪些要求，以及由誰承擔這個決定。",
      "十一の望みが聞こえるが、出願は三つにしか答えていない。満たさない要求と、その判断を誰が負うかを公開すること。",
      "I hear eleven desires, but the application answers only three. State which requests you will not satisfy and who bears that decision.",
    ),
  },
};
