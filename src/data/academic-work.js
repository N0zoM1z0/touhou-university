const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });

const choice = (id, label) => ({ id, label });
const question = (id, type, prompt, options, answer, points, explanation) => ({
  id,
  type,
  prompt,
  options,
  answer,
  points,
  explanation,
});

export const academicAssignments = [
  {
    id: "his-yesterday-editions",
    courseCode: "HIS-204",
    kind: "assignment",
    dueOffset: 2,
    title: l("〈昨日〉兩個版本的校勘回條", "二つの「昨日」版の校勘票", "Collation slip for two editions of Yesterday"),
    brief: l(
      "不要決定哪個昨日比較有感情；先用版本、時間與可追溯來源說明哪一項主張能被支持。",
      "どちらの昨日が感情的に正しいか決めず、版・時刻・追跡可能な出所で支持可能な主張を示す。",
      "Do not choose the more emotionally convincing yesterday. Use versions, time, and traceable sources to state what can be supported.",
    ),
    teacher: l("上白澤慧音", "上白沢慧音", "Keine Kamishirasawa"),
    questions: [
      question(
        "sequence",
        "choice",
        l("校報排版快取建立於事故前，但正式批准戳在事故後。哪個敘述最嚴謹？", "組版キャッシュは事故前、正式承認印は事故後。最も厳密な記述は。", "A layout cache predates the accident, while its approval stamp follows it. Which statement is most rigorous?"),
        [
          choice("caused", l("快取必然造成事故", "キャッシュが必ず事故を起こした", "The cache necessarily caused the accident")),
          choice("sequence", l("快取先存在；批准與事故的因果仍待識別", "キャッシュは先行。承認と事故の因果は未識別", "The cache existed first; causality among approval and accident remains unidentified")),
          choice("stamp", l("批准戳能把快取改成事故後建立", "承認印がキャッシュを事故後作成に変える", "The stamp makes the cache postdate the accident")),
        ],
        "sequence",
        10,
        l("時間順序只能排除部分因果方向，不能自動證實剩下的方向。", "時間順序は一部の因果方向を除外するだけで、残りを自動立証しない。", "Temporal order excludes some causal directions; it does not confirm the remainder."),
      ),
      question(
        "citation",
        "choice",
        l("兩份互相引用的訂正都聲稱自己是第一份。下一步應先查什麼？", "相互引用する訂正二件が双方「第一」と主張。最初に確認するものは。", "Two corrections cite each other and both claim to be first. What should be checked first?"),
        [
          choice("font", l("字體大小", "書体の大きさ", "Font size")),
          choice("provenance", l("不可變時間戳、排版版本與發行載體", "不変時刻印・組版版・発行媒体", "Immutable timestamps, layout versions, and publication media")),
          choice("aya", l("問文哪份標題比較好", "文に良い見出しを聞く", "Ask Aya which headline is better")),
        ],
        "provenance",
        10,
        l("互引內容不能獨立建立順序；需要引用鏈以外的版本證據。", "相互引用だけでは順序を独立確定できず、鎖外の版証拠が必要。", "Mutual citations cannot independently establish order; version evidence outside the chain is needed."),
      ),
      question(
        "memo",
        "text",
        l("用一句話寫入校史：必須同時提到「版本／版」與「時間／時刻」，且不得把推測寫成證實。", "大学史へ一文。必ず「版」と「時刻」を含め、推測を立証済みにしないこと。", "Write one chronicle sentence containing both “version” and “time”, without turning inference into confirmation."),
        [],
        { keywordGroups: [["版本", "版", "version"], ["時間", "時刻", "time"]], minLength: 18 },
        10,
        l("合格句需要保留版本與時間兩個軸；字多不等於證據多。", "合格文は版と時刻の二軸を保持する。字数は証拠量ではない。", "A passing sentence preserves both version and time; word count is not evidence count."),
      ),
    ],
  },
  {
    id: "mag-material-provenance",
    courseCode: "MAG-221",
    kind: "assignment",
    dueOffset: 3,
    title: l("來源不明蘑菇的可重現魔法實作", "出所不明茸の再現可能魔法実習", "Reproducible magic with mushrooms of unclear provenance"),
    brief: l(
      "魔理沙提供了能成功三次的材料，卻把採集地寫成「森林那邊」。你的工作是讓第四個人能失敗得有意義。",
      "魔理沙の材料は三回成功したが採取地は「森の方」。第四者が意味ある失敗をできる記録を作る。",
      "Marisa’s material worked three times, but its source says “that bit of forest.” Make a record in which a fourth person can fail meaningfully.",
    ),
    teacher: l("霧雨魔理沙", "霧雨魔理沙", "Marisa Kirisame"),
    questions: [
      question(
        "minimum",
        "choice",
        l("最少還要補哪一組資料？", "最低限追加すべき情報は。", "What is the minimum additional information?"),
        [
          choice("colour", l("蘑菇看起來多漂亮", "茸の見た目の美しさ", "How pretty the mushroom looked")),
          choice("batch", l("採集位置、時間、批次與保存條件", "採取位置・時刻・ロット・保存条件", "Collection location, time, batch, and storage conditions")),
          choice("owner", l("誰先說那是自己的", "最初に所有を主張した者", "Who first claimed ownership")),
        ],
        "batch",
        12,
        l("可重現需要能辨識材料批次與處理差異，而不是只保留成功敘事。", "再現には材料ロットと処理差を識別できる記録が必要。", "Reproduction needs identifiable material batches and handling differences, not only a success story."),
      ),
      question(
        "replicates",
        "number",
        l("三批材料各做 4 次，另設 4 次空白對照。總實驗單位是多少？", "三ロット各4回、空白対照4回。総実験単位は。", "Three batches receive 4 trials each, plus 4 blank controls. How many experimental units?"),
        [],
        { value: 16, tolerance: 0 },
        8,
        l("3×4＋4＝16；把對照忘掉會讓漂亮的成功率失去參照。", "3×4＋4＝16。対照を忘れると成功率の基準を失う。", "3×4+4=16; omitting controls removes the reference for the attractive success rate."),
      ),
      question(
        "stop",
        "choice",
        l("第四輪出現未記錄的紫色煙霧，最合適的處置是？", "第四回に未記録の紫煙。最適な対応は。", "An undocumented violet smoke appears in round four. Best response?"),
        [
          choice("continue", l("為了樣本數繼續", "標本数のため続行", "Continue for sample size")),
          choice("stop", l("停止、封存批次與環境記錄，再決定是否重啟", "停止しロットと環境記録を封存、再開を再判断", "Stop, preserve batch and environment records, then decide whether to restart")),
          choice("rename", l("把它命名成預期煙霧", "予期煙と改名", "Rename it expected smoke")),
        ],
        "stop",
        10,
        l("停止條件必須能在結果不合心意時仍然生效。", "停止条件は望まない結果でも発動しなければならない。", "A stop condition must still operate when the result is inconvenient."),
      ),
    ],
  },
  {
    id: "eng-waterwheel-power",
    courseCode: "ENG-231",
    kind: "assignment",
    dueOffset: 4,
    title: l("低落差水輪：別把膠帶算進效率", "低落差水車：テープを効率へ算入しない", "Low-head turbine: do not count tape as efficiency"),
    brief: l("河童工房要求同時交計算、單位與停止測試的條件。寫 final-final 不算版本控制。", "河童工房は計算・単位・停止条件を同時提出。final-final は版管理ではない。", "The kappa workshop requires calculation, units, and a stop condition. final-final is not version control."),
    teacher: l("河城荷取", "河城にとり", "Nitori Kawashiro"),
    questions: [
      question(
        "power",
        "number",
        l("ρ=1000 kg/m³、g=9.8 m/s²、流量 0.5 m³/s、落差 2 m、效率 0.60。輸出功率是多少 W？", "ρ=1000、g=9.8、流量0.5、落差2、効率0.60。出力は何W。", "ρ=1000 kg/m³, g=9.8 m/s², flow=0.5 m³/s, head=2 m, efficiency=.60. Output power in W?"),
        [],
        { value: 5880, tolerance: 30 },
        15,
        l("P=ρgQHη=5880 W；接受量測四捨五入，不接受把膠帶黏性當 η。", "P=ρgQHη=5880W。測定丸めは可、テープ粘着をη扱い不可。", "P=ρgQHη=5880 W. Measurement rounding is accepted; tape adhesion is not η."),
      ),
      question(
        "comparison",
        "choice",
        l("換成更大樣本的流量讀數，能自動修好未校準的水位尺嗎？", "流量標本を増やせば未校正水位計は自動修正されるか。", "Will more flow readings automatically repair an uncalibrated gauge?"),
        [
          choice("yes", l("會，資料多就是真", "はい、データ量は真実", "Yes; more data is truth")),
          choice("no", l("不會；隨機誤差變小，系統偏差仍在", "いいえ。偶然誤差は縮むが系統偏差は残る", "No; random error shrinks while systematic bias remains")),
          choice("tape", l("只要換新膠帶就會", "新しいテープなら直る", "Only with fresh tape")),
        ],
        "no",
        10,
        l("樣本量不能洗掉校準問題。", "標本数は校正問題を洗い流さない。", "Sample size cannot wash away calibration failure."),
      ),
      question(
        "shutdown",
        "choice",
        l("哪個停止條件可在測試前判定？", "試験前に判定可能な停止条件は。", "Which stop condition can be decided before testing?"),
        [
          choice("bad", l("結果看起來不好時", "結果が悪く見えた時", "When results look bad")),
          choice("threshold", l("軸承溫度超過 82°C 或振動連續三次超限", "軸受温度82℃超または振動三回連続超過", "Bearing temperature above 82°C or vibration over limit three times")),
          choice("nitori", l("荷取說真的沒事時", "にとりが本当に大丈夫と言った時", "When Nitori says it is really fine")),
        ],
        "threshold",
        5,
        l("可操作閾值比事後感覺可靠，也更容易讓設備活到下一堂課。", "操作可能な閾値は事後感想より信頼でき、設備も次回まで残る。", "Operational thresholds beat hindsight and help the equipment survive until next class."),
      ),
    ],
  },
  {
    id: "jrn-correction-chain",
    courseCode: "JRN-210",
    kind: "assignment",
    dueOffset: 5,
    title: l("一則尚未發生新聞的訂正鏈", "未発生記事の訂正連鎖", "Correction chain for news that has not happened"),
    brief: l("文先交標題，再要求你查證。請在不把速度完全消滅的前提下，讓讀者知道什麼仍是未知。", "文が先に見出しを提出。速度を全廃せず、未知を読者へ示す。", "Aya filed the headline first. Preserve some speed while telling readers what remains unknown."),
    teacher: l("射命丸文", "射命丸文", "Aya Shameimaru"),
    questions: [
      question(
        "headline",
        "choice",
        l("唯一來源說「可能有爆炸」，哪個標題最合適？", "単一情報源が「爆発の可能性」。最適な見出しは。", "One source says an explosion is possible. Best headline?"),
        [
          choice("certain", l("工房爆炸，校方沉默", "工房爆発、大学沈黙", "Workshop explodes; university silent")),
          choice("qualified", l("工房傳出異響；爆炸原因尚未確認", "工房で異音、爆発原因は未確認", "Unusual workshop noise; explosive cause unconfirmed")),
          choice("future", l("明日的事故今天證實", "明日の事故を本日確認", "Tomorrow’s accident confirmed today")),
        ],
        "qualified",
        10,
        l("標題可保留速度，但必須讓不確定性與已知事實同時可見。", "速度を保っても、不確実性と既知事実を同時に可視化する。", "A fast headline can still make uncertainty and known facts visible together."),
      ),
      question(
        "conflict",
        "choice",
        l("記者本人提供了觸發事件的號外。報導中至少要補什麼？", "記者本人の号外が事案を誘発。記事へ最低限追加するものは。", "The reporter’s own extra edition helped trigger the event. What must the report add?"),
        [
          choice("disclose", l("揭露記者角色並提供獨立時間線", "記者の役割開示と独立時系列", "Disclose the reporter’s role and provide an independent timeline")),
          choice("hide", l("刪除號外，當作沒發生", "号外を削除し無かったことにする", "Delete the extra and pretend it did not happen")),
          choice("award", l("加上獨家標章", "独占印を追加", "Add an exclusive badge")),
        ],
        "disclose",
        10,
        l("利益衝突不必自動取消報導，但必須可見並接受獨立核對。", "利益相反は報道を自動取消しないが、可視化と独立照合が必要。", "A conflict need not cancel reporting, but it must be visible and independently checkable."),
      ),
      question(
        "correction",
        "text",
        l("寫一行訂正，須含「未確認／未確認／unconfirmed」其中之一，至少 16 字元。", "「未確認」または unconfirmed を含む訂正文を16字以上で。", "Write a correction of at least 16 characters containing 未確認 or “unconfirmed”."),
        [],
        { keywordGroups: [["未確認", "unconfirmed"]], minLength: 16 },
        10,
        l("訂正要能指出原說法哪裡超出證據，而不是只說造成誤會。", "訂正は「誤解を招いた」だけでなく、証拠を越えた箇所を示す。", "A correction identifies where the original exceeded evidence, rather than merely regretting confusion."),
      ),
    ],
  },
];
export const academicExams = [
  {
    id: "methods-midterm",
    code: "TU-MID-M01",
    durationMinutes: 18,
    title: l("跨學院方法論中間試驗", "学部横断方法論中間試験", "Cross-School Methods Midterm"),
    lead: l("開卷；書若自行離場，計時不停止。每題判分後保留答案與解析。", "開巻。書が自ら退出しても計時継続。採点後は答案と解説を保存。", "Open book. If the book leaves, the timer continues. Answers and explanations remain after grading."),
    questions: [
      question("m1", "choice", l("大樣本最直接改善什麼？", "大標本が直接改善するものは。", "What does a larger sample most directly improve?"), [
        choice("chance", l("隨機誤差的精度", "偶然誤差の精度", "Precision against random error")),
        choice("bias", l("所有系統偏差", "全系統偏差", "Every systematic bias")),
        choice("ethics", l("研究倫理", "研究倫理", "Research ethics")),
      ], "chance", 15, l("大樣本縮窄隨機不確定性；設計錯誤不因此消失。", "大標本は偶然不確実性を縮小するが設計誤りは消さない。", "Larger samples narrow random uncertainty; design errors remain.")),
      question("m2", "choice", l("路線演算法只把步行時間乘 0.5，卻沒有掃帚停泊點。主要問題是？", "徒歩時間を0.5倍しただけで箒駐機点なし。主問題は。", "A route algorithm halves walking time but has no broom berths. Main problem?"), [
        choice("network", l("沒有建模真正可使用的交通網路", "実際に利用可能な交通網をモデル化していない", "It does not model the usable transport network")),
        choice("fast", l("掃帚不夠快", "箒が遅い", "The broom is not fast enough")),
        choice("colour", l("地圖顏色錯誤", "地図色が誤り", "The map colour is wrong")),
      ], "network", 15, l("交通方式必須改變可走的邊與轉乘，不只是共用路徑的倍率。", "交通手段は共通経路の倍率でなく辺と乗換を変える。", "A transport mode changes available edges and transfers, not only a multiplier.")),
      question("m3", "number", l("觀測 24 次、重複 3 輪，共有多少筆計畫觀測？", "24観測を3反復。計画観測数は。", "24 observations across 3 replicate rounds: how many planned observations?"), [], { value: 72, tolerance: 0 }, 15, l("24×3＝72。對照若另設，必須另外計數。", "24×3＝72。別対照は別途計数。", "24×3=72. A separate control must be counted separately.")),
      question("m4", "choice", l("錯誤假說很有趣，最誠實的保存方式是？", "誤仮説が興味深い。最も誠実な保存法は。", "A wrong hypothesis is interesting. Most honest way to preserve it?"), [
        choice("confirm", l("改寫成已證實", "立証済みに書換", "Rewrite it as confirmed")),
        choice("contested", l("保留原 verdict、審閱者、理由與未獲支持警告", "元 verdict・査読者・理由・未支持警告を保持", "Keep original verdict, reviewer, reason, and unsupported warning")),
        choice("delete", l("刪掉所有失敗", "失敗を全削除", "Delete every failure")),
      ], "contested", 15, l("保存異說不能洗掉它被推翻或證據不足的狀態。", "異説保存は棄却・証拠不足を洗い流さない。", "Preserving dissent must not erase rejection or insufficient evidence.")),
      question("m5", "choice", l("兩個角色證詞衝突時，第一步是？", "二証言が矛盾。第一歩は。", "Two character testimonies conflict. First step?"), [
        choice("popular", l("選人氣較高的", "人気の高い方", "Choose the more popular")),
        choice("positions", l("保留各自角色、暴露、利益與可核對部分", "各役割・曝露・利害・照合可能部を保持", "Retain each role, exposure, interest, and checkable component")),
        choice("average", l("把句子平均", "文を平均", "Average the sentences")),
      ], "positions", 20, l("衝突本身是資料；先定位來源，再決定可識別的主張。", "矛盾自体が資料。出所を位置付けて識別可能な主張を決める。", "Conflict is data. Locate the sources before deciding what claim is identifiable.")),
      question("m6", "choice", l("哪個停止規則最差？", "最も悪い停止規則は。", "Which stop rule is worst?"), [
        choice("threshold", l("儀器超過預先閾值", "計器が事前閾値超過", "Instrument crosses a pre-set threshold")),
        choice("harm", l("出現預定義傷害訊號", "定義済み有害信号", "A predefined harm signal appears")),
        choice("nice", l("結果終於看起來漂亮", "結果がようやく綺麗に見える", "The result finally looks attractive")),
      ], "nice", 20, l("依結果美觀停止會製造選擇性結論。", "結果の美しさで停止すると選択的結論を作る。", "Stopping when results look attractive manufactures a selected conclusion.")),
    ],
  },
];

export const defenceRounds = [
  {
    id: "claim",
    examiner: l("八雲紫", "八雲紫", "Yukari Yakumo"),
    role: l("主張邊界", "主張境界", "Boundary of claim"),
    prompt: l("你的結果在哪一條邊界之外就不再成立？", "結果はどの境界外で成立しなくなるか。", "Beyond which boundary does your result stop holding?"),
    choices: [
      choice("universal", l("在任何世界、月相與版本都成立", "全世界・月相・版で成立", "It holds in every world, moon phase, and version")),
      choice("scope", l("明確列出族群、場地、月相與版本範圍", "集団・場所・月相・版の範囲を明示", "State population, place, moon phase, and version scope")),
      choice("gap", l("不回答，從問題與答案間隙離場", "無回答で問答の隙間から退出", "Leave through the gap between question and answer")),
    ],
    scores: { universal: 4, scope: 20, gap: 8 },
  },
  {
    id: "method",
    examiner: l("霧雨魔理沙", "霧雨魔理沙", "Marisa Kirisame"),
    role: l("材料與重現", "材料・再現", "Materials & reproduction"),
    prompt: l("下一個人怎樣才能重現你的成功，或至少重現你的失敗？", "次の者が成功、少なくとも失敗を再現するには。", "How can the next person reproduce your success—or at least your failure?"),
    choices: [
      choice("secret", l("把關鍵材料寫成「同上」並鎖進抽屜", "主要材料を「同上」として引出しへ", "Write “as above” for materials and lock the drawer")),
      choice("record", l("保存材料批次、程序版本、環境與停止條件", "材料ロット・手順版・環境・停止条件を保存", "Preserve material batch, procedure version, environment, and stop rules")),
      choice("borrow", l("讓大家直接借我的，來源之後再說", "自分の材料を貸し、出所は後で", "Let everyone borrow mine; provenance can wait")),
    ],
    scores: { secret: 2, record: 20, borrow: 7 },
  },
  {
    id: "stop",
    examiner: l("博麗靈夢", "博麗霊夢", "Reimu Hakurei"),
    role: l("停止條件／符卡裁定", "停止条件・スペルカード裁定", "Stop rule / spell-card ruling"),
    prompt: l("如果答辯現場本身變成異變，你在什麼時候停？", "答弁会場自体が異変化したら、いつ止めるか。", "If the defence itself becomes an incident, when do you stop?"),
    choices: [
      choice("bored", l("靈夢覺得麻煩時", "霊夢が面倒と思った時", "When Reimu finds it troublesome")),
      choice("precommit", l("預先列出的傷害、失控或不可逆閾值一旦觸發", "事前の有害・制御不能・不可逆閾値で停止", "When a precommitted harm, loss-of-control, or irreversible threshold triggers")),
      choice("audience", l("觀眾開始鼓掌時", "観客が拍手を始めた時", "When the audience starts applauding")),
    ],
    scores: { bored: 9, precommit: 20, audience: 3 },
  },
];

export const academicGradeBands = [
  { min: 90, id: "A", label: l("卓越／可公開示範", "秀・公開実演可", "Excellent / public demonstration") },
  { min: 80, id: "B", label: l("良好／可進下一階", "優・次段階可", "Good / may progress") },
  { min: 70, id: "C", label: l("通過／需補一處方法", "良・方法一箇所補正", "Pass / one method correction") },
  { min: 60, id: "D", label: l("有條件通過", "条件付可", "Conditional pass") },
  { min: 0, id: "F", label: l("退回重做，但保留失敗回條", "再提出・失敗票は保存", "Revise and resubmit; failure slip retained") },
];
