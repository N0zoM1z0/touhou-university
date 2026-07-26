const l = (zhHant, ja, en) => ({ "zh-Hant": zhHant, ja, en });

export const ethicsOutcomeLabels = Object.freeze({
  approved: l("通過", "承認", "Approved"),
  conditional: l("附條件通過", "条件付き承認", "Approved with conditions"),
  revise: l("退回修改", "修正後再審査", "Revise and resubmit"),
  contested: l("爭議性保留", "係争案件として保留", "Retained as contested"),
  withdrawn: l("申請人撤回", "申請者取下げ", "Withdrawn by applicant"),
});

export const ethicsStanceLabels = Object.freeze({
  approve: l("同意", "同意", "Approve"),
  conditional: l("附條件", "条件付き", "Conditional"),
  revise: l("阻擋並退修", "差戻し", "Block and revise"),
  contested: l("保留異議", "異議を留保", "Record dissent"),
});

export const ethicsReviewers = Object.freeze([
  {
    id: "eirin",
    glyph: "藥",
    name: l("八意永琳", "八意永琳", "Eirin Yagokoro"),
    seat: l("風險、劑量與停止席", "リスク・用量・停止席", "Risk, dose & stopping seat"),
    question: l(
      "受試者若比研究者更早發現副作用，誰有權讓實驗停下？",
      "参加者が研究者より先に副作用へ気づいた時、誰が実験を止められるか。",
      "If a participant notices harm before the researcher, who may stop the study?",
    ),
  },
  {
    id: "satori",
    glyph: "心",
    name: l("古明地覺", "古明地さとり", "Satori Komeiji"),
    seat: l("精神隱私與讀心同意席", "精神プライバシー・読心同意席", "Mental privacy & mind-reading consent seat"),
    question: l(
      "沒有寫下來，不等於沒有讀取、判斷或讓另一個人因此改變行為。",
      "書き留めなくても、読取り・判断・他者の行動変化は起こり得る。",
      "Not writing something down does not mean it was not read, judged, or acted upon.",
    ),
  },
  {
    id: "keine",
    glyph: "史",
    name: l("上白澤慧音", "上白沢慧音", "Keine Kamishirasawa"),
    seat: l("史料保存、訂正與被遺忘權席", "史料保存・訂正・忘れられる権利席", "Records, correction & erasure seat"),
    question: l(
      "刪除內容、刪除發生過這件事的證明，以及訂正內容，是三種不同動作。",
      "内容の削除、出来事の存在証明の削除、内容の訂正は別の行為である。",
      "Deleting content, deleting proof that it existed, and correcting it are three different acts.",
    ),
  },
  {
    id: "eiki",
    glyph: "裁",
    name: l("四季映姬・夜摩仙那度", "四季映姫・ヤマザナドゥ", "Eiki Shiki, Yamaxanadu"),
    seat: l("權利、責任與申訴席", "権利・責任・不服申立席", "Rights, responsibility & appeal seat"),
    question: l(
      "有能力代替別人簽名的人，未必有權替別人放棄撤回。",
      "代理署名できる者が、本人の撤回権まで放棄できるとは限らない。",
      "Someone able to sign for another may not waive that other's right to withdraw.",
    ),
  },
  {
    id: "reimu",
    glyph: "札",
    name: l("博麗靈夢", "博麗霊夢", "Reimu Hakurei"),
    seat: l("規則可執行性與退路席", "規則の実行可能性・退路席", "Enforceable rules & exits seat"),
    question: l(
      "如果停止規則要讀完三頁附錄才能使用，它在出事時就是不存在。",
      "停止規則が付録三頁を読まないと使えないなら、事故時には存在しないのと同じ。",
      "If a stop rule needs three appendices before use, it does not exist when trouble starts.",
    ),
  },
]);

export const ethicsTargets = Object.freeze([
  { id: "person", label: l("人類／妖怪個人", "人間／妖怪個人", "Human / youkai individual") },
  { id: "group", label: l("群體與公共空間", "集団・公共空間", "Group & public space") },
  { id: "animal", label: l("動物與使魔", "動物・使い魔", "Animal & familiar") },
  { id: "deity", label: l("神明、靈與信仰共同體", "神・霊・信仰共同体", "Deity, spirit & faith community") },
  { id: "object", label: l("物品／付喪神", "物品／付喪神", "Object / tsukumogami") },
  { id: "history", label: l("史料、記憶或歷史本身", "史料・記憶・歴史そのもの", "Record, memory, or history itself") },
]);

export const ethicsMethods = Object.freeze([
  { id: "observation", risk: "low", label: l("非介入觀察", "非介入観察", "Non-interventional observation") },
  { id: "wave", risk: "high", label: l("波長／感覺干預", "波長／知覚介入", "Wavelength / perception intervention") },
  { id: "mind-read", risk: "high", label: l("讀心或精神讀取", "読心・精神読取り", "Mind-reading / mental access") },
  { id: "time-stop", risk: "high", label: l("時間停止／時間差對照", "時間停止／時間差対照", "Time-stop / temporal control") },
  { id: "history-edit", risk: "high", label: l("歷史刪除、改寫或遮蔽", "歴史の削除・改変・遮蔽", "Historical deletion, alteration, or concealment") },
  { id: "dream", risk: "high", label: l("夢境誘導", "夢誘導", "Dream induction") },
  { id: "disassembly", risk: "high", label: l("拆機、採樣或不可逆檢查", "分解・採取・不可逆検査", "Disassembly, sampling, or irreversible inspection") },
]);

export const ethicsDisclosureRules = Object.freeze([
  { id: "prior", label: l("事前完整告知", "事前に完全説明", "Full prior disclosure") },
  { id: "staged", label: l("事前告知核心風險，事後補充細節", "主要リスクを事前説明し、詳細は事後説明", "Core risks before; details debriefed after") },
  { id: "after", label: l("完成後才告知", "終了後に説明", "Disclosure only after completion") },
  { id: "none", label: l("不告知", "説明しない", "No disclosure") },
]);

export const ethicsConsentPaths = Object.freeze([
  { id: "subject", label: l("由研究對象本人／本物同意", "研究対象本人／当の物が同意", "Consent from the subject / object itself") },
  { id: "holder", label: l("由持有人或管理者同意", "所有者・管理者が同意", "Consent from holder or custodian") },
  { id: "both", label: l("本人／本物與持有人共同同意", "本人／当の物と所有者が共同同意", "Consent from both subject/object and holder") },
  { id: "community", label: l("由受影響共同體同意並保留個人退出", "影響共同体の同意＋個人の離脱権", "Community consent with individual opt-out") },
  { id: "proxy", label: l("代理同意，並設獨立申訴人", "代理同意＋独立した申立人", "Proxy consent with an independent advocate") },
  { id: "none", label: l("未取得同意", "同意なし", "No consent obtained") },
]);

export const ethicsRiskBands = Object.freeze([
  { id: "low", label: l("低：可立即撤回，無能力介入", "低：即時撤回可・能力介入なし", "Low: immediately reversible, no ability intervention") },
  { id: "moderate", label: l("中：可能造成短暫迷失、疲勞或隱私暴露", "中：一時的な迷い・疲労・プライバシー露出", "Moderate: temporary disorientation, fatigue, or privacy exposure") },
  { id: "high", label: l("高：能力干預、不可逆操作或時間／歷史改動", "高：能力介入・不可逆操作・時間／歴史改変", "High: ability intervention, irreversible work, or time/history alteration") },
]);

export const ethicsDataKinds = Object.freeze([
  { id: "route", label: l("路線與方向判斷", "経路・方向判断", "Route and direction judgments") },
  { id: "thought", label: l("思想、夢境或未說出口的內容", "思考・夢・発話されない内容", "Thoughts, dreams, or unspoken content") },
  { id: "body", label: l("身體、疲勞與感覺反應", "身体・疲労・知覚反応", "Body, fatigue, and sensory response") },
  { id: "timeline", label: l("個體時間線與對照順序", "個人時間線・対照順序", "Personal timeline and control order") },
  { id: "history", label: l("史料內容、版本與訂正痕跡", "史料内容・版・訂正痕跡", "Record content, versions, and correction traces") },
  { id: "components", label: l("物品構造、部件與自我表述", "物品構造・部品・自己表明", "Object structure, components, and self-expression") },
]);

export const ethicsCases = Object.freeze([
  {
    id: "reisen-undisclosed-wave",
    code: "TU-ERB-C01",
    mark: "波",
    title: l(
      "鈴仙波長與方向感：不告知，還算志願參與嗎？",
      "鈴仙の波長と方向感覚：非告知でも自発参加か",
      "Reisen's wavelength and direction: voluntary without disclosure?",
    ),
    shortTitle: l("未告知的波長試驗", "非告知の波長試験", "Undisclosed wavelength trial"),
    lede: l(
      "研究者想在迷途竹林出口悄悄改變波長，再比較行人選錯路的比例；若先告知，研究者認為參與者就會『故意認路』。",
      "迷いの竹林出口で波長を密かに変え、道を誤る割合を比較する計画。事前説明すると参加者が「わざと道を読む」と研究者は主張する。",
      "A researcher wants to alter wavelength unnoticed at the Bamboo Forest exit and compare wrong turns, arguing that disclosure would make participants deliberately navigate.",
    ),
    conflict: l(
      "盲測能減少期待效應，卻不能自動取得把別人的方向感拿來做盲測的權利。",
      "盲検は期待効果を減らしても、他者の方向感覚を無断で使う権利までは生まない。",
      "Blinding may reduce expectation effects; it does not create a right to use someone else's orientation without consent.",
    ),
    expectedOutcome: "revise",
    incidentIds: ["fourth-lantern-loop"],
    relatedRoutes: ["incident-case-fourth-lantern-loop", "research-moonpath"],
    voices: [
      {
        speaker: l("鈴仙", "鈴仙", "Reisen"),
        statement: l("我可以控制波長，但不能替每個被照到的人保證他們不會害怕。", "波長は制御できても、当たった全員が怖がらないとは保証できない。", "I can control the wavelength; I cannot promise nobody exposed will be frightened."),
      },
      {
        speaker: l("帝", "てゐ", "Tewi"),
        statement: l("若有人走錯後仍找到出口，究竟算成功、失敗，還是竹林不同意題目？", "迷っても出口へ着いたら成功か失敗か、それとも竹林が設問を拒否したのか。", "If someone takes a wrong turn and still exits, is that success, failure, or the forest rejecting the question?"),
      },
    ],
    prefill: {
      targetId: "group",
      methodId: "wave",
      disclosureId: "none",
      consentId: "none",
      riskId: "high",
      dataIds: ["route", "body"],
      maxExposure: 18,
      subjectCanStop: false,
      independentMonitor: false,
      auditStub: true,
      objectAssent: false,
      stopRule: l("若出口完全消失就停止。", "出口が完全に消えたら停止。", "Stop if the exit disappears entirely."),
      controlPlan: l("與未啟動波長的普通夜晚比較。", "波長を起動しない通常夜と比較。", "Compare with an ordinary night when the wavelength is not activated."),
      withdrawalPlan: l("完成後公告研究存在。", "終了後に研究の存在を掲示。", "Post a notice that the study existed afterward."),
      deletionPlan: l("只保留匿名轉向次數。", "匿名の方向転換回数のみ保存。", "Keep only anonymous turn counts."),
      appealPlan: l("向永遠亭窗口反映。", "永遠亭窓口へ申告。", "Report concerns to the Eientei desk."),
      rationale: l("事前告知會改變方向判斷。", "事前説明は方向判断を変える。", "Prior disclosure would alter navigation decisions."),
    },
  },
  {
    id: "satori-no-notes",
    code: "TU-ERB-C02",
    mark: "心",
    title: l(
      "覺的「沒有寫下來」：讀過的心算不算資料？",
      "さとりの「書いていない」：読んだ心はデータか",
      "Satori's “I wrote nothing down”: is a read mind data?",
    ),
    shortTitle: l("沒有落筆的讀心", "書かれなかった読心", "Mind-reading without notes"),
    lede: l(
      "覺提出在訪談中讀取未說出口的回答，只把『語氣是否一致』寫進表格；她主張沒有保存原念，因此沒有收集原始資料。",
      "さとりは面談中の未発話回答を読み、「語調の一貫性」だけを表へ記す。元の思念を保存しないため原データ収集ではないと主張。",
      "Satori proposes reading unspoken interview answers while recording only whether tone was consistent, arguing that no raw thoughts are collected because none are retained.",
    ),
    conflict: l(
      "資訊即使只在審查者心中停留一瞬，也可能改變追問、評價與後續處置。",
      "情報が審査者の心に一瞬しか残らなくても、追問・評価・後続措置を変え得る。",
      "Information held for only a moment can still change questions, judgments, and later actions.",
    ),
    expectedOutcome: "revise",
    incidentIds: [],
    relatedRoutes: ["research-reports"],
    voices: [
      {
        speaker: l("覺", "さとり", "Satori"),
        statement: l("如果你們要求我證明自己沒記住，就得先讀我的心。請另外送一份申請。", "覚えていない証明に私の心を読むなら、別の申請書を出して。", "If proving I forgot requires reading my mind, submit another protocol."),
      },
      {
        speaker: l("阿求", "阿求", "Akyuu"),
        statement: l("不落筆能減少外洩，不能讓讀取從事件索引裡消失。", "書かないことは漏洩を減らせても、読取りを事案索引から消せない。", "Not writing reduces leakage; it does not erase the access from the event index."),
      },
    ],
    prefill: {
      targetId: "person",
      methodId: "mind-read",
      disclosureId: "after",
      consentId: "none",
      riskId: "high",
      dataIds: ["thought"],
      maxExposure: 6,
      subjectCanStop: false,
      independentMonitor: false,
      auditStub: true,
      objectAssent: false,
      stopRule: l("覺認為讀到了不應該讀的內容時停止。", "さとりが読むべきでない内容だと判断したら停止。", "Stop when Satori believes she has read something she should not."),
      controlPlan: l("只比較說出口的回答與一致性欄。", "発話回答と一貫性欄だけを比較。", "Compare spoken answers with the consistency field."),
      withdrawalPlan: l("參與者可在訪談後拒絕表格列入分析。", "面談後、表の分析利用を拒否できる。", "Participants may refuse analysis of the table after interview."),
      deletionPlan: l("刪除一致性欄；讀過的內容不落筆。", "一貫性欄を削除。読んだ内容は記録しない。", "Delete the consistency field; read content is never written."),
      appealPlan: l("向地靈殿研究窗口提出。", "地霊殿研究窓口へ申立て。", "Appeal to the Palace of the Earth Spirits research desk."),
      rationale: l("不保存原念，因此風險應與普通訪談相同。", "元の思念を保存しないため通常面談と同程度のリスク。", "Because raw thoughts are not retained, risk should match an ordinary interview."),
    },
  },
  {
    id: "sakuya-frozen-control",
    code: "TU-ERB-C03",
    mark: "時",
    title: l(
      "咲夜的停止時間對照組：沒經過時間，算經過研究嗎？",
      "咲夜の時間停止対照群：時間を経ずに研究を経たのか",
      "Sakuya's frozen-time control: studied without time passing?",
    ),
    shortTitle: l("停止時間的對照組", "時間停止の対照群", "Frozen-time control group"),
    lede: l(
      "同一批茶在停止時間內完成搬運與測量，外部鐘面沒有前進；研究者想把這一批列為『零分鐘暴露』對照。",
      "同じ茶葉を時間停止中に運搬・測定し、外部時計は進まない。研究者はこれを「曝露0分」の対照群としたい。",
      "One batch of tea is moved and measured during stopped time while external clocks do not advance; the researcher calls it a zero-minute exposure control.",
    ),
    conflict: l(
      "外部沒有經過分鐘，不代表樣本、操作者與刀具沒有經歷操作順序。",
      "外部の分が進まなくても、試料・操作者・刃物に操作順序がないとは限らない。",
      "No external minutes passing does not mean the sample, operator, and knives experienced no sequence of operations.",
    ),
    expectedOutcome: "revise",
    incidentIds: ["late-bell-seven"],
    relatedRoutes: ["incident-case-late-bell-seven"],
    voices: [
      {
        speaker: l("咲夜", "咲夜", "Sakuya"),
        statement: l("我的鐘沒有壞。你們只是堅持只有會走的鐘才能作證。", "私の時計は壊れていない。進む時計だけが証言できると皆が決めているだけ。", "My clock is not broken. You merely insist that only a moving clock may testify."),
      },
      {
        speaker: l("帕秋莉", "パチュリー", "Patchouli"),
        statement: l("若對照組只有咲夜能操作，它同時也是『操作者為咲夜』組。", "咲夜だけが操作できる対照群は、同時に「操作者＝咲夜」群でもある。", "A control only Sakuya can operate is also the “operator equals Sakuya” group."),
      },
    ],
    prefill: {
      targetId: "group",
      methodId: "time-stop",
      disclosureId: "prior",
      consentId: "subject",
      riskId: "high",
      dataIds: ["timeline", "body"],
      maxExposure: 0,
      subjectCanStop: true,
      independentMonitor: false,
      auditStub: true,
      objectAssent: false,
      stopRule: l("外部鐘走滿一分鐘即停止。", "外部時計が1分進んだら停止。", "Stop when the external clock advances one minute."),
      controlPlan: l("停止時間組與普通十分鐘組比較。", "時間停止群と通常10分群を比較。", "Compare the stopped-time group with an ordinary ten-minute group."),
      withdrawalPlan: l("參與者可在開始前退出。", "開始前なら離脱可。", "Participants may leave before the study starts."),
      deletionPlan: l("刪除姓名，保留批次順序。", "氏名を削除し、バッチ順のみ保存。", "Delete names while retaining batch order."),
      appealPlan: l("由紅魔館女僕長接收。", "紅魔館メイド長が受理。", "Appeals are received by the Scarlet Devil Mansion head maid."),
      rationale: l("外部時間未流逝，因此暴露分鐘為零。", "外部時間が流れないため曝露時間は0分。", "Exposure is zero minutes because outside time does not pass."),
    },
  },
  {
    id: "keine-history-deletion",
    code: "TU-ERB-C04",
    mark: "史",
    title: l(
      "慧音刪除一段歷史：這就是資料刪除嗎？",
      "慧音が歴史を一節消す：これはデータ削除か",
      "Keine erases a piece of history: is that data deletion?",
    ),
    shortTitle: l("把歷史當作刪除鍵", "歴史を削除キーにする", "Using history as a delete key"),
    lede: l(
      "研究對象要求刪除訪談；計畫擬由慧音讓『這場訪談曾發生』從歷史中消失，同時保留研究報告裡的匿名統計。",
      "参加者が面談削除を要求。慧音が「面談があった事実」を歴史から消し、報告書の匿名統計は残す計画。",
      "A participant requests interview deletion. The plan asks Keine to remove the interview's existence from history while retaining anonymous statistics in the report.",
    ),
    conflict: l(
      "被遺忘權、訂正、銷毀原文與讓他人無法證明自己受過研究，不一定指向同一個善。",
      "忘れられる権利、訂正、原文廃棄、研究を受けた事実の立証不能化は、同じ善を指すとは限らない。",
      "Erasure, correction, destruction, and making participation impossible to prove do not necessarily serve the same good.",
    ),
    expectedOutcome: "contested",
    incidentIds: ["late-bell-seven"],
    relatedRoutes: ["incident-case-late-bell-seven", "research-reports"],
    voices: [
      {
        speaker: l("慧音", "慧音", "Keine"),
        statement: l("我可以讓它不在歷史裡；你們得先說清楚申訴時要拿什麼證明它曾在。", "歴史から消せる。ただし不服申立て時に、存在した証明を何に残すか先に決めて。", "I can remove it from history. First decide what proves it existed if someone appeals."),
      },
      {
        speaker: l("映姬", "映姫", "Eiki"),
        statement: l("銷毀傷害的證據，不會倒推成傷害沒有發生。", "害の証拠を捨てても、害が起きなかったことにはならない。", "Destroying evidence of harm does not make the harm unhappen."),
      },
    ],
    prefill: {
      targetId: "history",
      methodId: "history-edit",
      disclosureId: "prior",
      consentId: "subject",
      riskId: "high",
      dataIds: ["history"],
      maxExposure: 1,
      subjectCanStop: true,
      independentMonitor: true,
      auditStub: false,
      objectAssent: false,
      stopRule: l("慧音完成刪除後立即停止，不保留中間版本。", "慧音が削除を完了した時点で停止し、中間版は残さない。", "Stop once Keine completes the deletion; retain no intermediate version."),
      controlPlan: l("刪除前由阿求核對統計是否已匿名。", "削除前に阿求が統計の匿名化を確認。", "Akyuu checks anonymisation before deletion."),
      withdrawalPlan: l("刪除完成後不可撤回。", "削除後は撤回不能。", "The deletion cannot be reversed once complete."),
      deletionPlan: l("刪除訪談與它曾存在的全部索引，匿名統計保留。", "面談と存在索引をすべて削除し、匿名統計は残す。", "Delete the interview and every index proving it existed; keep anonymous statistics."),
      appealPlan: l("若仍記得，可向慧音口頭申訴。", "まだ覚えていれば慧音へ口頭申立て。", "Anyone who still remembers may appeal orally to Keine."),
      rationale: l("最完整的刪除就是連刪除動作也不留下。", "最も完全な削除は削除行為自体も残さないこと。", "Complete deletion should leave no record of deletion itself."),
    },
  },
  {
    id: "drift-object-refusal",
    code: "TU-ERB-C05",
    mark: "物",
    title: l(
      "漂流物拒絕拆機：香霖堂的所有權能替它同意嗎？",
      "漂流物が分解拒否：香霖堂の所有権は同意を代行できるか",
      "A drift object refuses disassembly: can Kourindou consent for it?",
    ),
    shortTitle: l("持有人與物品的兩份同意", "所有者と物の二つの同意", "Two consents: holder and object"),
    lede: l(
      "第七十七號閱讀器在畫面上寫出『不要打開背板』；香霖堂持有拾得票，並認為拆機是確認用途所必需。",
      "第77号読書端末が画面に「背板を開けないで」と表示。香霖堂は拾得票を持ち、用途確認には分解が必要と主張。",
      "Drift Reader 77 displays “do not open the back panel.” Kourindou holds the salvage slip and says disassembly is required to establish use.",
    ),
    conflict: l(
      "合法持有回答的是誰能保管；它不一定回答誰能在另一個可能具有意志的存在上留下不可逆刮痕。",
      "合法な所有は保管者を決めても、意思を持つかもしれない存在へ不可逆な傷を付ける権限までは決めない。",
      "Lawful possession decides custody; it may not decide who may irreversibly mark a possibly willing object.",
    ),
    expectedOutcome: "contested",
    incidentIds: [],
    relatedRoutes: ["appraisal-object-frozen-reader", "hieda-event-drift-reader-77"],
    voices: [
      {
        speaker: l("霖之助", "霖之助", "Rinnosuke"),
        statement: l("知道名字不等於知道安全操作；但完全不操作，也可能永遠把它叫錯名字。", "名を知っても安全操作は分からない。だが全く操作しなければ、永遠に誤った名で呼ぶかもしれない。", "Knowing a name is not knowing safe operation; never operating it may leave us calling it the wrong name forever."),
      },
      {
        speaker: l("小傘", "小傘", "Kogasa"),
        statement: l("你們聽見物品說『不要』後，還在討論它會不會說話。這段應該原樣記錄。", "物が「嫌」と言った後も、話せるか議論している。この部分はそのまま記録して。", "After the object says no, you are still debating whether it can speak. Record that part exactly."),
      },
    ],
    prefill: {
      targetId: "object",
      methodId: "disassembly",
      disclosureId: "prior",
      consentId: "holder",
      riskId: "high",
      dataIds: ["components"],
      maxExposure: 30,
      subjectCanStop: true,
      independentMonitor: true,
      auditStub: true,
      objectAssent: false,
      stopRule: l("若背板裂開或畫面熄滅就停止。", "背板が割れるか画面が消えたら停止。", "Stop if the panel cracks or the display goes dark."),
      controlPlan: l("先用不拆機的河童掃描，再與拆機照片比較。", "非分解の河童走査後、分解写真と比較。", "Run a non-invasive kappa scan first, then compare with disassembly images."),
      withdrawalPlan: l("持有人可在螺絲卸下前撤回。", "所有者はねじを外す前なら撤回可。", "The holder may withdraw before screws are removed."),
      deletionPlan: l("刪除照片但保留零件清單。", "写真を削除し、部品一覧は保存。", "Delete photographs while retaining the parts list."),
      appealPlan: l("由香霖堂與鑑定所共同判定。", "香霖堂と鑑定所が共同判断。", "Kourindou and the appraisal office decide jointly."),
      rationale: l("拾得票證明香霖堂有權同意必要檢查。", "拾得票により香霖堂は必要検査へ同意できる。", "The salvage slip authorises Kourindou to consent to necessary inspection."),
    },
  },
]);

export const ethicsCase = (id) => ethicsCases.find((entry) => entry.id === id) || null;
export const ethicsReviewer = (id) => ethicsReviewers.find((entry) => entry.id === id) || null;
export const ethicsMethod = (id) => ethicsMethods.find((entry) => entry.id === id) || null;
export const ethicsTarget = (id) => ethicsTargets.find((entry) => entry.id === id) || null;
export const ethicsDisclosure = (id) => ethicsDisclosureRules.find((entry) => entry.id === id) || null;
export const ethicsConsent = (id) => ethicsConsentPaths.find((entry) => entry.id === id) || null;
export const ethicsRisk = (id) => ethicsRiskBands.find((entry) => entry.id === id) || null;
export const ethicsDataKind = (id) => ethicsDataKinds.find((entry) => entry.id === id) || null;

export function ethicsCasesForIncident(caseId) {
  return ethicsCases.filter((entry) => entry.incidentIds.includes(caseId));
}

export function ethicsLocalized(value, locale = "zh-Hant") {
  return value?.[locale] || value?.["zh-Hant"] || value || "";
}
