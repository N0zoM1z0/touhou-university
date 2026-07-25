const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });

export const governanceProposals = [
  {
    id: "airspace-practicals",
    code: "TU-SEN-26-041",
    glyph: "空",
    sponsor: l("飛行安全聯席會（文表示自己只是記錄）", "飛行安全合同会（文は記録のみと主張）", "Joint Flight Safety Council (Aya says she only records it)"),
    title: l("補考彈幕期間，誰有權關閉境界講堂空域？", "追試弾幕中、誰が境界講堂空域を閉鎖できるか", "Who may close Boundary Hall airspace during make-up danmaku?"),
    summary: l(
      "現行規章要求教務、講堂與風路三方同意；但三方的信使上週在同一股風裡互相等待。",
      "現行規程は教務・講堂・風路の三者同意を要求。しかし先週、三者の使者は同じ風で互いを待った。",
      "Rules require agreement from Academic Affairs, the hall, and Windway Control. Last week all three messengers waited for each other in the same gust.",
    ),
    choices: [
      { id: "registrar", label: l("教務可先封一時段，事後補三方簽名", "教務が一時限を先行閉鎖、後日三者署名", "Registrar may close one period, signatures follow"), consequence: l("反應快；慧音會留下誰補簽得最慢。", "迅速。慧音が最後の追認者を記録する。", "Fast; Keine records who ratified last.") },
      { id: "reimu", label: l("由靈夢現場判定；她可選擇不來", "霊夢が現場判断。ただし来ない選択可", "Reimu decides on site; attendance optional"), consequence: l("邊界判斷最直接，行政可預測性最低。", "境界判断は直截、行政予測性は最低。", "Direct boundary judgment, minimal administrative predictability.") },
      { id: "aya", label: l("讓文發布『已封閉』，若沒封再刊訂正", "文が「閉鎖済」を発行、未閉鎖なら訂正", "Aya publishes “closed”; correct later if needed"), consequence: l("消息最快；因果順序交由新聞學院答辯。", "情報最速。因果順序は新聞学部の答弁へ。", "Fastest information; causality goes to a journalism defence.") },
    ],
    reaction: l("空域案投票後，三個單位都宣布自己只是被諮詢", "空域案投票後、三機関すべてが「諮問されただけ」と発表", "After the airspace vote, all three offices say they were merely consulted"),
  },
  {
    id: "fullmoon-library",
    code: "TU-SEN-26-044",
    glyph: "月",
    sponsor: l("霧湖圖書館與滿月讀者臨時席", "霧の湖図書館・満月読者臨時席", "Misty Lake Library and Provisional Full-Moon Readers"),
    title: l("滿月夜間閱覽應延長，還是讓館藏先休息？", "満月夜間閲覧を延長するか、蔵書を先に休ませるか", "Extend full-moon reading, or let the holdings rest first?"),
    summary: l(
      "部分書只在滿月顯字，另一些書在滿月拒絕被讀。兩方都要求圖書館把自己列為無障礙服務。",
      "満月だけ文字を出す本と、満月は読まれるのを拒む本がある。双方が自分をアクセシビリティ対象と主張。",
      "Some books reveal text only at full moon; others refuse readers then. Both claim accessibility status.",
    ),
    choices: [
      { id: "split", label: l("北翼延長、南翼熄燈，書可自行換翼", "北翼延長・南翼消灯、本は自分で移動可", "North Wing extends; South goes dark; books may move"), consequence: l("兼顧兩方；會飛的館藏取得制度優勢。", "双方に配慮。飛行資料が制度上有利。", "Balances both; flying holdings gain an institutional advantage.") },
      { id: "appointment", label: l("滿月顯字本改採預約閱讀", "満月可視本は予約閲覧へ", "Moon-visible books by appointment"), consequence: l("可控，但預約單本身只在朔月顯字。", "管理可能。ただし予約票は新月のみ可視。", "Manageable, except the booking form appears only at new moon.") },
      { id: "books-vote", label: l("讓館藏投票；索書號算學號", "蔵書投票・請求番号を学籍番号扱い", "Let holdings vote; call numbers count as student IDs"), consequence: l("最具共生精神；書架要求列為選區。", "共生的。書架は選挙区認定を要求。", "Most coexistential; shelves demand constituency status.") },
    ],
    reaction: l("圖書館滿月案開票，三本棄權書要求先定義棄權是否被借出", "図書館満月案開票、棄権三冊が「棄権は貸出中か」を質問", "Full-moon library count opens; three abstaining books ask whether abstention is checked out"),
  },
  {
    id: "red-thread-appeal",
    code: "TU-SEN-26-047",
    glyph: "糸",
    sponsor: l("紅線案卷審閱席與校報訂正欄", "赤糸記録査読席・学報訂正欄", "Red-Thread Review Desk and Campus Corrections"),
    title: l("爭議性結案被引用時，警告要多大才算看得見？", "係争終結を引用する際、警告はどの大きさなら可視か", "How large must the warning be when citing a contested closure?"),
    summary: l(
      "慧音要求警告與標題同字級；文認為這會使警告變成第二個標題，反而需要自己的訂正。",
      "慧音は警告を見出し同寸に要求。文は警告が第二見出しとなり、独自訂正が必要だと主張。",
      "Keine wants warnings as large as headlines. Aya says that makes the warning a second headline requiring its own correction.",
    ),
    choices: [
      { id: "same-size", label: l("與主張同字級、同一畫面", "主張と同寸・同画面", "Same size and same view as the claim"), consequence: l("最難忽略；校報版面減少四成。", "最も見落としにくい。紙面は四割減。", "Hardest to miss; newspaper space falls forty percent.") },
      { id: "red-border", label: l("紅框＋審閱者＋原始 verdict", "赤枠＋査読者＋元 verdict", "Red border + reviewer + original verdict"), consequence: l("保留上下文；紫要求先定義框內外。", "文脈保持。紫は枠内外の定義を要求。", "Keeps context; Yukari asks where the border itself belongs.") },
      { id: "headline", label: l("由文自行決定，但錯一次停刊一刻鐘", "文が決定、誤り一回で十五分休刊", "Aya decides; one error pauses publication 15 minutes"), consequence: l("速度最快；停刊期間通常已有號外。", "最速。休刊中には通常号外が出る。", "Fastest; an extra edition usually appears during the pause.") },
    ],
    reaction: l("紅線警告字級案進入二讀，文先發出了『大學限制字體自由』", "赤糸警告字級案が二読へ、文は先に「大学、書体自由を制限」", "Red-thread warning bill reaches second reading; Aya preprints “University limits font freedom”"),
  },
  {
    id: "canteen-names",
    code: "TU-SEN-26-050",
    glyph: "膳",
    sponsor: l("食堂命名委員會（午餐後成立）", "食堂命名委員会（昼食後設置）", "Dining Naming Committee (formed after lunch)"),
    title: l("菜單名稱是否必須能推論出主要食材？", "献立名から主材料を推論できるべきか", "Must a menu name allow inference of its main ingredient?"),
    summary: l(
      "「境界蓋飯」昨日裝的是豆腐，今天裝的是碗內與碗外的分界。營養室拒絕為後者計算蛋白質。",
      "「境界丼」は昨日豆腐、今日は椀内外の境界。栄養室は後者の蛋白質計算を拒否。",
      "Yesterday Boundary Bowl contained tofu; today it contains the boundary between bowl and outside. Nutrition refuses to calculate protein for the latter.",
    ),
    choices: [
      { id: "ingredient", label: l("名稱至少列一項可食材料", "名称に可食材料を一つ以上", "Name at least one edible ingredient"), consequence: l("外界生最安心；妖夢申請「半份」算材料。", "外界生に安心。妖夢は「半分」を材料申請。", "Safest for outsiders; Youmu files “half” as an ingredient.") },
      { id: "footnote", label: l("保留詩意名稱，但加可追溯腳註", "詩的名称を維持、追跡可能な注記", "Keep poetic names with a traceable footnote"), consequence: l("食堂同意；腳註今日比菜名長。", "食堂同意。注記は本日、名称より長い。", "Dining agrees; today’s footnote is longer than the name.") },
      { id: "mystery", label: l("每日保留一道不可推論料理", "一日一品は推論不能料理", "Keep one non-inferable dish each day"), consequence: l("研究價值最高；過敏原辦公室投反對。", "研究価値最大。アレルギー室は反対。", "Highest research value; Allergies Office votes no.") },
    ],
    reaction: l("食堂命名案投票開始，「今日特餐」要求以利益關係人身分發言", "献立命名案の投票開始、「本日の特餐」が利害関係者発言を要求", "Dining-name vote opens; Today’s Special requests stakeholder speaking time"),
  },
];

export function governanceProposal(id) {
  return governanceProposals.find((proposal) => proposal.id === id);
}
