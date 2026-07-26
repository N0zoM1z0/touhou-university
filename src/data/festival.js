const l = (zhHant, ja, en) => ({ "zh-Hant": zhHant, ja, en });

export const festivalKinds = Object.freeze([
  {
    id: "spring-lantern",
    glyph: "燈",
    code: "TU-FEST-SPRING",
    name: l("春季符卡燈會", "春季スペルカード灯会", "Spring Spell-card Lantern Festival"),
    short: l("把夜空借給學生一晚", "夜空を一晩、学生へ貸す", "Lend the night sky to students"),
    premise: l(
      "二十四組社團以非攻擊性光彈、手作燈籠與聲景編排校園夜空；所有光路都必須留出肉眼可辨的退場方向。",
      "二十四組の団体が非攻撃性光弾、手作り灯籠、音景で夜空を編成。すべての光路に肉眼で分かる退場方向を残す。",
      "Twenty-four student groups compose the campus sky with non-aggressive light danmaku, handmade lanterns, and soundscapes. Every light route must leave a visibly legible exit.",
    ),
  },
  {
    id: "boundary-opening",
    glyph: "界",
    code: "TU-FEST-OPEN",
    name: l("境界開學祭", "境界開学祭", "Boundary Matriculation Festival"),
    short: l("讓新生穿過一扇不完全同意自己是門的門", "門であることに完全同意しない門を新入生が通る", "New students pass through a gate not fully persuaded it is a gate"),
    premise: l(
      "新生、人里訪客與校內勢力沿朱繩路入場；三個信仰團體都提交了唯一正門申請，而紫提交了一張沒有正反面的門。",
      "新入生・里の来訪者・学内勢力が朱縄路から入場。三つの信仰勢力は全て「唯一の正門」を申請し、紫は表裏のない門を提出した。",
      "New students, village visitors, and campus factions enter along the Vermilion Cord Walk. Three faith groups each file for the sole main gate; Yukari files a gate with no front or back.",
    ),
  },
]);

export const festivalRoutes = Object.freeze([
  {
    id: "lake-ring",
    glyph: "湖",
    name: l("霧湖環燈線", "霧湖環灯線", "Misty Lake Lantern Ring"),
    detail: l("博麗門—霧湖—境界講堂；水面倒影算第二場演出，但不另售票。", "博麗門—霧の湖—境界講堂。水面反射は第二公演扱いだが別料金なし。", "Hakurei Gate–Misty Lake–Boundary Hall. The reflection counts as a second show but receives no separate ticket."),
    path: ["gate", "library", "boundary"],
    closedEdges: ["boundary--library"],
    delay: 5,
    capacity: 560,
  },
  {
    id: "vermilion-procession",
    glyph: "朱",
    name: l("朱繩迎新遊行", "朱縄迎新行列", "Vermilion Cord Matriculation Procession"),
    detail: l("博麗門直上境界講堂；主路留給新生，返程被迫承認湖畔書架坡存在。", "博麗門から境界講堂へ直進。主路は新入生用、帰路は湖畔書架坂の存在を認める。", "A direct Hakurei Gate–Boundary Hall procession. The main walk belongs to new students; return traffic must acknowledge Lakeside Stack Slope."),
    path: ["gate", "boundary", "history"],
    closedEdges: ["boundary--gate"],
    delay: 7,
    capacity: 720,
  },
  {
    id: "mountain-circuit",
    glyph: "山",
    name: l("妖怪山風燈巡迴", "妖怪の山・風灯巡回", "Youkai Mountain Wind-Lantern Circuit"),
    detail: l("工房物資與天狗觀眾共用山線；快訊通常比遊行先抵達終點。", "工房資材と天狗観客が山路を共有。速報はたいてい行列より先に到着。", "Workshop freight and tengu spectators share the mountain line. The extra edition normally reaches the finish first."),
    path: ["kappa", "magic", "boundary"],
    closedEdges: ["boundary--kappa"],
    delay: 10,
    capacity: 440,
  },
  {
    id: "three-faith-loop",
    glyph: "祀",
    name: l("三信仰輪值門線", "三信仰輪番門線", "Three-Faith Rotating Gate Line"),
    detail: l("每一校鐘更換一次象徵正門；實際入口不動，解說牌與爭論移動。", "校鐘ごとに象徴正門を交代。実際の入口は動かず、説明板と論争だけが移動。", "The symbolic main gate changes every bell. The physical entrance stays put; the signboards and arguments move."),
    path: ["gate", "history", "boundary", "library"],
    closedEdges: ["history--library"],
    delay: 8,
    capacity: 620,
  },
]);

export const festivalStages = Object.freeze([
  {
    id: "boundary-roof",
    name: l("境界講堂屋頂", "境界講堂屋上", "Boundary Hall Roof"),
    capacity: 620,
    power: 32,
    clinic: 4,
    dormNoise: 1,
    note: l("視野最好，退路最需要真的畫出來。", "視界は最高、退路は本当に描く必要あり。", "Best sightlines; exits must actually be drawn."),
  },
  {
    id: "lake-bank",
    name: l("霧湖南岸臨水舞台", "霧の湖南岸・水辺舞台", "Misty Lake South-Bank Stage"),
    capacity: 520,
    power: 24,
    clinic: 3,
    dormNoise: 2,
    note: l("水面會複製燈光，妖精會把複製品算作追加名額。", "水面が灯を複製し、妖精は複製分を追加枠と数える。", "The lake duplicates lights; fairies count the copies as extra entries."),
  },
  {
    id: "hakurei-yard",
    name: l("博麗門前臨時庭台", "博麗門前仮設庭台", "Hakurei Gate Temporary Yard"),
    capacity: 380,
    power: 18,
    clinic: 2,
    dormNoise: 0,
    note: l("靈夢容易喊停；捐款箱也容易被列入攤位收入。", "霊夢が止めやすい。賽銭箱も屋台収入へ算入されやすい。", "Reimu can stop it quickly. The donation box is also easily counted as stall revenue."),
  },
  {
    id: "history-court",
    name: l("稗田史庭", "稗田史庭", "Hieda Chronicle Court"),
    capacity: 300,
    power: 14,
    clinic: 1,
    dormNoise: 3,
    note: l("每一節目都留下版本；幽靈宿舍認為掌聲不需空氣傳播。", "全演目に版が残る。幽霊寮は拍手に空気伝播は不要と主張。", "Every act leaves a version. The ghost residence argues applause need not travel through air."),
  },
]);

export const festivalPowerPlans = Object.freeze([
  {
    id: "kappa-grid",
    name: l("河童水輪獨立供電", "河童水車単独給電", "Kappa Turbine Grid"),
    capacity: 72,
    backup: 18,
    owner: l("河童聯合工房", "河童共同工房", "Kappa Joint Workshop"),
    dispute: l("韌體版本寫在膠帶下面。", "ファームウェア版はテープの下。", "The firmware version is under the tape."),
  },
  {
    id: "moriya-grid",
    name: l("守矢神德穩壓", "守矢神徳安定化", "Moriya Divine-Voltage Regulation"),
    capacity: 94,
    backup: 24,
    owner: l("守矢神社", "守矢神社", "Moriya Shrine"),
    dispute: l("輸出穩定，但每座配電箱突然多了一面奉納牌。", "出力は安定するが、配電箱ごとに奉納札が増える。", "Output is stable, but every distribution box acquires a votive plaque."),
  },
  {
    id: "mixed-grid",
    name: l("河童主網＋三方手搖備援", "河童主網＋三者手回し予備", "Kappa Main Grid + Three-Party Hand-Crank Backup"),
    capacity: 84,
    backup: 36,
    owner: l("河童／博麗／命蓮寺共同值班", "河童・博麗・命蓮寺共同当番", "Kappa / Hakurei / Myouren joint duty"),
    dispute: l("比較慢，但沒有任何一方能獨自把插頭帶走。", "遅いが、誰も単独でプラグを持ち去れない。", "Slower, but no one party can leave with the plug."),
  },
  {
    id: "mini-reactors",
    name: l("河童試作小型爐列", "河童試作小型炉列", "Kappa Prototype Micro-Reactor Row"),
    capacity: 116,
    backup: 8,
    owner: l("非想天則研究會", "非想天則研究会", "Hisoutensoku Research Society"),
    dispute: l("容量最大；「試作」兩字被貼紙折到背面。", "最大容量。「試作」の二字はラベルの裏へ折られている。", "Highest capacity. The word “prototype” is folded behind the label."),
  },
]);

export const festivalFoodCourts = Object.freeze([
  {
    id: "village-court",
    name: l("人里夜市長桌", "人里夜市長卓", "Human Village Night-Market Tables"),
    capacity: 480,
    routeNode: "history",
    note: l("最能容納外來訪客；燒烤煙會自行申請風向。", "外来客向け最大。焼煙が自分で風向申請する。", "Best visitor capacity; grill smoke files its own wind request."),
  },
  {
    id: "lake-stalls",
    name: l("霧湖浮燈攤線", "霧の湖・浮灯屋台線", "Misty Lake Floating-Stall Line"),
    capacity: 360,
    routeNode: "library",
    note: l("夜雀食堂離舞台最近；菜單可能被唱到換行。", "夜雀食堂が舞台最寄り。献立が歌で改行される。", "Closest to the Night Sparrow kitchen; songs may reflow the menu."),
  },
  {
    id: "boundary-yard",
    name: l("境界講堂外庭", "境界講堂外庭", "Boundary Hall Forecourt"),
    capacity: 300,
    routeNode: "boundary",
    note: l("轉場最快；攤販與彈幕必須重新爭論哪一邊算地面。", "転換は最速。屋台と弾幕がどちらを地面と呼ぶか再協議。", "Fastest changeovers; stalls and danmaku must renegotiate which side counts as ground."),
  },
]);

export const festivalFairyZones = Object.freeze([
  {
    id: "lake-lawn",
    name: l("霧湖妖精自由草坪", "霧の湖・妖精自由芝生", "Misty Lake Fairy Free Lawn"),
    drift: 1,
    noise: 2,
    note: l("邊界畫得清楚，妖精仍會把線當成遊戲道具。", "境界線は明瞭だが、妖精は線を遊具として扱う。", "The boundary is clear; fairies still treat it as play equipment."),
  },
  {
    id: "history-court",
    name: l("史庭低光表演區", "史庭・低照度演技区", "Chronicle Court Low-Light Zone"),
    drift: 0,
    noise: 1,
    note: l("容易點名，難以判斷同一隻妖精是否重複登記。", "点呼しやすいが、同じ妖精の重複登録判定は難しい。", "Easy roll call; difficult to tell whether one fairy registered twice."),
  },
  {
    id: "mobile-cloud",
    name: l("移動雲台", "移動雲台", "Mobile Cloud Platform"),
    drift: 4,
    noise: 3,
    note: l("表演最自由；場地本人拒絕承諾留在圖上。", "最も自由。会場自体が地図上に残る約束を拒否。", "Most freedom; the venue itself refuses to stay on the map."),
  },
]);

export const festivalAidPlans = Object.freeze([
  {
    id: "gate-infirmary",
    name: l("博麗門醫務室單站", "博麗門医務室・単站", "Hakurei Gate Infirmary Only"),
    capacity: 12,
    travel: 4,
    note: l("喊停快，重症轉送竹林慢。", "停止は早いが、重症の竹林搬送は遅い。", "Fast stopping; slow transfer to the bamboo forest."),
  },
  {
    id: "eientei-station",
    name: l("永遠亭月兔巡迴站", "永遠亭月兎巡回站", "Eientei Moon-Rabbit Roaming Station"),
    capacity: 20,
    travel: 8,
    note: l("處置完整；滿月時巡迴路線先問鈴仙。", "処置は充実。満月の巡回路は鈴仙へ先に確認。", "Full treatment; ask Reisen before setting a full-moon patrol route."),
  },
  {
    id: "dual-station",
    name: l("門前醫務室＋永遠亭雙站", "門前医務室＋永遠亭二站", "Gate Infirmary + Eientei Dual Stations"),
    capacity: 32,
    travel: 3,
    note: l("容量最高；兩邊對「先觀察」的意思不同。", "最大容量。両者で「まず観察」の意味が違う。", "Highest capacity; the two desks mean different things by “observe first.”"),
  },
]);

export const festivalGatePlans = Object.freeze([
  {
    id: "hakurei",
    name: l("博麗大結界正門", "博麗大結界正門", "Hakurei Great Barrier Main Gate"),
    claimant: l("博麗神社", "博麗神社", "Hakurei Shrine"),
    dispute: 2,
  },
  {
    id: "moriya",
    name: l("守矢風祝迎賓門", "守矢風祝迎賓門", "Moriya Wind-Priestess Welcome Gate"),
    claimant: l("守矢神社", "守矢神社", "Moriya Shrine"),
    dispute: 3,
  },
  {
    id: "myouren",
    name: l("命蓮寺眾生共門", "命蓮寺衆生共門", "Myouren Gate for All Beings"),
    claimant: l("命蓮寺", "命蓮寺", "Myouren Temple"),
    dispute: 3,
  },
  {
    id: "rotating",
    name: l("每一校鐘輪值一次", "校鐘ごとの輪番", "Rotate Every Campus Bell"),
    claimant: l("三方共同但互不承認", "三者共同・相互未承認", "Jointly held, mutually unrecognised"),
    dispute: 0,
  },
]);

export const festivalPressPlans = Object.freeze([
  {
    id: "aya-live",
    name: l("文文。即時號外", "文々。即時号外", "Bunbunmaru Live Extras"),
    early: true,
    reach: 5,
    note: l("最快；核准前九分鐘已準備好「盛大開幕」。", "最速。承認9分前に「盛大開幕」を準備済み。", "Fastest. “Grand Opening” is ready nine minutes before approval."),
  },
  {
    id: "joint-desk",
    name: l("校報／天狗共同通報", "学報・天狗共同通報", "Campus Paper / Tengu Joint Wire"),
    early: false,
    reach: 3,
    note: l("要等兩份標題同意，通常比節目表慢一鐘。", "二つの見出しの合意待ちで、番組表より一鐘遅い。", "Waits for two headlines to agree and normally trails the programme by one bell."),
  },
  {
    id: "notice-only",
    name: l("只發正式木板公告", "正式木札のみ", "Official Noticeboard Only"),
    early: false,
    reach: 1,
    note: l("不會搶跑；妖精把木板搬走後也不會追上。", "先走りしない。妖精が木札を運び去っても追わない。", "Never jumps the start; also never catches a noticeboard carried away by fairies."),
  },
]);

export const festivalMusicPlans = Object.freeze([
  {
    id: "sunset-only",
    name: l("日落鐘前結束", "日没鐘前に終了", "Finish Before the Sunset Bell"),
    endOffset: 190,
    noise: 0,
  },
  {
    id: "prismriver-evening",
    name: l("騷靈樂團晚場", "騒霊楽団・夜公演", "Prismriver Evening Set"),
    endOffset: 270,
    noise: 2,
  },
  {
    id: "ghost-afterhours",
    name: l("幽靈宿舍深夜加演", "幽霊寮・深夜追加公演", "Ghost Residence After-Hours Encore"),
    endOffset: 360,
    noise: 5,
  },
]);

export const festivalReviewDesks = Object.freeze([
  {
    id: "reimu",
    glyph: "退",
    name: l("博麗退路桌", "博麗退路机", "Hakurei Exit Desk"),
    question: l("觀眾看得見停止訊號，也真的走得到出口嗎？", "観客は停止合図を見て、実際に出口へ行けるか。", "Can spectators see the stop signal and actually reach an exit?"),
  },
  {
    id: "nitori",
    glyph: "電",
    name: l("河童供電與回收桌", "河童給電・回収机", "Kappa Power & Recovery Desk"),
    question: l("燈、舞台、攤位與備援是不是接在同一張誠實的圖上？", "灯・舞台・屋台・予備電源は同じ正直な図にあるか。", "Are lights, stages, stalls, and backups on the same honest diagram?"),
  },
  {
    id: "eirin",
    glyph: "診",
    name: l("永遠亭急救桌", "永遠亭救護机", "Eientei Medical Desk"),
    question: l("月相、密度、容量與最近能喊停的人是否一起計算？", "月相・密度・収容・最寄りの停止者を一緒に数えたか。", "Were moon, density, capacity, and the nearest person who can stop it counted together?"),
  },
  {
    id: "aya",
    glyph: "号",
    name: l("文文。通報桌", "文々。広報机", "Bunbunmaru Wire Desk"),
    question: l("公眾先看到核准內容，還是先看到文已經寫好的結論？", "公衆が先に見るのは承認内容か、文の用意済み結論か。", "Will the public see the permit or Aya's prewritten conclusion first?"),
  },
  {
    id: "faith",
    glyph: "門",
    name: l("三信仰正門會議", "三信仰正門会議", "Three-Faith Main-Gate Council"),
    question: l("唯一正門是一個交通安排，還是一份沒寫進預算的主辦權？", "唯一の正門は交通計画か、予算にない主催権か。", "Is the sole main gate traffic control or unbudgeted ownership of the festival?"),
  },
  {
    id: "residence",
    glyph: "夜",
    name: l("宿舍與妖精共同夜桌", "学生寮・妖精共同夜机", "Residence & Fairy Night Desk"),
    question: l("夜裡共享的聲音、雲與草坪，誰有能力承諾它們會留在原處？", "夜に共有する音・雲・芝生を、誰が元の場所に留めると約束できるか。", "Who can promise that shared sound, clouds, and lawns will stay where filed?"),
  },
]);

export const festivalIncidentPool = Object.freeze([
  {
    id: "aya-early-opening",
    glyph: "早",
    title: l("號外宣布活動已盛大開幕，但靈夢還沒蓋章", "号外は盛大開幕を宣言、霊夢はまだ未押印", "Extra declares a grand opening; Reimu has not stamped it"),
    body: l("訪客已依文文。的九分鐘前報導向正門移動。", "来訪者は文々。の9分前報道で正門へ移動中。", "Visitors are already moving toward the main gate on Bunbunmaru's nine-minute-early report."),
    responses: [
      {
        id: "correction-slip",
        label: l("讓文親自貼訂正並保留原標題", "文に訂正を貼らせ原見出しも保存", "Make Aya post a correction and retain the old headline"),
        effects: { delay: 6, attendance: -20, clinic: 0, power: 0, dispute: 0 },
      },
      {
        id: "open-early",
        label: l("承認新聞比許可先到，提前開門", "報道が許可より早いと認め前倒し開門", "Admit the news arrived before permission and open early"),
        effects: { delay: -4, attendance: 90, clinic: 3, power: 8, dispute: 1 },
      },
      {
        id: "ask-keine",
        label: l("請慧音判定現在是否已經算開幕", "慧音に現在が開幕後か判定依頼", "Ask Keine whether it already counts as open"),
        effects: { delay: 12, attendance: 10, clinic: 0, power: 1, dispute: 2 },
      },
    ],
  },
  {
    id: "power-votive-plaques",
    glyph: "電",
    title: l("每座配電箱都長出奉納牌，負載表開始用信仰計量", "配電箱に奉納札、負荷表が信仰単位へ", "Every power box sprouts a votive plaque; load is now measured in faith"),
    body: l("守矢稱輸出更穩定，荷取稱監測欄位已不再可重現。", "守矢は安定化を主張、にとりは監視項目が再現不能と主張。", "Moriya claims greater stability; Nitori says the telemetry is no longer reproducible."),
    responses: [
      {
        id: "shed-lantern-row",
        label: l("關閉一排湖燈並保留共同儀表", "湖灯一列を停止し共同計器を維持", "Shed one lake-lantern row and retain the shared meter"),
        effects: { delay: 2, attendance: -10, clinic: -1, power: -18, dispute: 0 },
      },
      {
        id: "grant-shrine-stage",
        label: l("交換一段守矢舞台署名", "守矢舞台の一枠と交換", "Trade one programme slot for Moriya stage credit"),
        effects: { delay: 0, attendance: 25, clinic: 0, power: -10, dispute: 2 },
      },
      {
        id: "hand-crank",
        label: l("切換三方手搖備援，讓爭議負責發電", "三者手回し予備へ切替、論争で発電", "Switch to three-party hand-crank backup and make the dispute generate power"),
        effects: { delay: 8, attendance: 0, clinic: 1, power: -24, dispute: 0 },
      },
    ],
  },
  {
    id: "fairy-lantern-drift",
    glyph: "妖",
    title: l("妖精表演區連同雲台漂入觀眾退路", "妖精演技区と雲台が観客退路へ漂流", "The fairy zone and its cloud drift into the audience exit"),
    body: l("妖精表示場地先移動，她們只是忠實留在場地裡。", "妖精は会場が先に動き、自分たちは忠実に残ったと主張。", "The fairies say the venue moved first and they faithfully stayed inside it."),
    responses: [
      {
        id: "widen-exit",
        label: l("暫停主舞台，拓寬實體退路", "主舞台を停止し物理退路を拡幅", "Pause the main stage and widen the physical exit"),
        effects: { delay: 9, attendance: -15, clinic: -3, power: -4, dispute: 0, closeExtraEdge: "boundary--magic" },
      },
      {
        id: "parade-cloud",
        label: l("把漂流改列臨時遊行並派兩名引導", "漂流を臨時行列へ変更し誘導二名", "Reclassify the drift as an impromptu parade with two guides"),
        effects: { delay: 3, attendance: 35, clinic: 2, power: 2, dispute: 1 },
      },
      {
        id: "ring-recall",
        label: l("敲回收鐘；承認只有三成妖精認得它", "回収鐘を鳴らし、認識妖精は三割と認める", "Ring the recall bell and admit only thirty percent of fairies recognise it"),
        effects: { delay: 5, attendance: 5, clinic: 1, power: 0, dispute: 1 },
      },
    ],
  },
  {
    id: "prismriver-airless-noise",
    glyph: "音",
    title: l("幽靈宿舍投訴深夜噪音；騷靈樂團要求證明聲音經空氣傳播", "幽霊寮が深夜騒音を申立て、騒霊楽団は空気伝播の立証を要求", "Ghost residence files a noise complaint; Prismriver asks whether sound used air"),
    body: l("宿舍窗戶沒有震動，住民的夢與牆內照片都在跟拍。", "寮窓は振動せず、住民の夢と壁内写真だけが拍子を取る。", "No windows vibrate; residents' dreams and photographs inside the walls keep time."),
    responses: [
      {
        id: "end-encore",
        label: l("結束加演並把未演曲目列入下屆", "追加公演を終了、未演曲を次回へ", "End the encore and list unplayed pieces for next year"),
        effects: { delay: 0, attendance: -30, clinic: -1, power: -7, dispute: 0 },
      },
      {
        id: "move-lake",
        label: l("移到霧湖水面，請圖書館替反射聲辦證", "霧の湖水面へ移動、図書館に反響の登録依頼", "Move to the lake and ask the library to register the reflected sound"),
        effects: { delay: 11, attendance: 20, clinic: 1, power: 5, dispute: 1, closeExtraEdge: "gate--library" },
      },
      {
        id: "silent-ruling",
        label: l("裁定無空氣傳播不等於沒有共享負擔", "空気伝播なしでも共有負担ありと裁定", "Rule that no airborne transmission does not mean no shared burden"),
        effects: { delay: 4, attendance: 0, clinic: 0, power: 0, dispute: 2 },
      },
    ],
  },
  {
    id: "full-moon-book-flock",
    glyph: "本",
    title: l("滿月特藏離館參加燈會，圖書館要求計入觀眾容量", "満月特蔵が灯会へ外出、図書館は観客数算入を要求", "Full-moon special collections attend the festival; the library wants them counted"),
    body: l("十七冊書在空域裡排成自己的節目表，沒有一冊攜帶訪客票。", "十七冊が空域で独自番組を編成、来訪券は一冊も不携帯。", "Seventeen books form their own programme in the air; none carries a visitor ticket."),
    responses: [
      {
        id: "count-spines",
        label: l("按書脊逐冊計入容量並開一條返館線", "背表紙ごとに収容数へ算入し帰館線を開く", "Count every spine toward capacity and open a return lane"),
        effects: { delay: 3, attendance: 17, clinic: 0, power: 1, dispute: 0 },
      },
      {
        id: "performers",
        label: l("列為臨時表演者，不佔觀眾名額", "臨時出演者として観客枠外", "Register them as impromptu performers, outside audience capacity"),
        effects: { delay: 1, attendance: 0, clinic: 1, power: 3, dispute: 1 },
      },
      {
        id: "library-recall",
        label: l("請圖書館發出到期通知，不保證書服從", "図書館に返却期限通知、従う保証なし", "Ask the library to issue due notices without promising compliance"),
        effects: { delay: 7, attendance: -12, clinic: 0, power: 0, dispute: 1 },
      },
    ],
  },
  {
    id: "rain-border-pocket",
    glyph: "雨",
    title: l("妖精局部降雨只落在正式雨備區之外", "妖精局地雨が正式雨天区画の外だけに降る", "Fairy-local rain falls only outside the official wet-weather zone"),
    body: l("紫提議移動『之外』；後勤組要求先知道帳篷算哪一邊。", "紫は「外」を移動する案、後勤班はテントがどちら側か先に要求。", "Yukari offers to move “outside”; logistics first wants to know which side contains the tents."),
    responses: [
      {
        id: "move-boundary",
        label: l("移動雨備區邊界，不移動觀眾", "雨天区画境界を移動、観客は動かさない", "Move the wet-weather boundary, not the audience"),
        effects: { delay: 4, attendance: 0, clinic: -1, power: 4, dispute: 2 },
      },
      {
        id: "paper-capes",
        label: l("發校報防雨披；文保留頭版可讀面", "学報雨合羽を配布、文は一面の可読面を確保", "Issue campus-paper rain capes; Aya reserves the readable front page"),
        effects: { delay: 6, attendance: -5, clinic: 0, power: 0, dispute: 1 },
      },
      {
        id: "pause-lanterns",
        label: l("熄燈一刻，等雨承認活動區", "灯を一刻停止、雨が会場を認めるまで待つ", "Pause lanterns for one watch until the rain acknowledges the site"),
        effects: { delay: 14, attendance: -25, clinic: -2, power: -12, dispute: 0 },
      },
    ],
  },
  {
    id: "gate-claimants",
    glyph: "門",
    title: l("三個『唯一正門』同時開始剪綵", "三つの「唯一正門」が同時にテープカット", "Three “sole main gates” begin ribbon-cutting at once"),
    body: l("遊行隊伍停在一條沒有交通壅塞、只有神學壅塞的路上。", "行列は交通渋滞ではなく神学渋滞の道で停止。", "The procession stops in a road with no traffic congestion, only theological congestion."),
    responses: [
      {
        id: "rotate-bell",
        label: l("依校鐘輪值，剪刀也輪值", "校鐘輪番、鋏も輪番", "Rotate by campus bell; rotate the scissors too"),
        effects: { delay: 8, attendance: 0, clinic: 0, power: 0, dispute: 0 },
      },
      {
        id: "three-ribbons",
        label: l("剪三條不同方向的緞帶", "三方向のリボンを切る", "Cut three ribbons facing different directions"),
        effects: { delay: 5, attendance: 20, clinic: 0, power: 2, dispute: 2 },
      },
      {
        id: "yukari-gate",
        label: l("採用紫沒有正反面的第四扇門", "紫の表裏なき第四門を採用", "Use Yukari's fourth gate with no front or back"),
        effects: { delay: 2, attendance: 35, clinic: 2, power: 3, dispute: 4, closeExtraEdge: "boundary--history" },
      },
    ],
  },
]);

export const festivalKind = (id) => festivalKinds.find((entry) => entry.id === id) || festivalKinds[0];
export const festivalRoute = (id) => festivalRoutes.find((entry) => entry.id === id) || festivalRoutes[0];
export const festivalStage = (id) => festivalStages.find((entry) => entry.id === id) || festivalStages[0];
export const festivalPower = (id) => festivalPowerPlans.find((entry) => entry.id === id) || festivalPowerPlans[0];
export const festivalFoodCourt = (id) => festivalFoodCourts.find((entry) => entry.id === id) || festivalFoodCourts[0];
export const festivalFairyZone = (id) => festivalFairyZones.find((entry) => entry.id === id) || festivalFairyZones[0];
export const festivalAidPlan = (id) => festivalAidPlans.find((entry) => entry.id === id) || festivalAidPlans[0];
export const festivalGatePlan = (id) => festivalGatePlans.find((entry) => entry.id === id) || festivalGatePlans[0];
export const festivalPressPlan = (id) => festivalPressPlans.find((entry) => entry.id === id) || festivalPressPlans[0];
export const festivalMusicPlan = (id) => festivalMusicPlans.find((entry) => entry.id === id) || festivalMusicPlans[0];
export const festivalIncident = (id) => festivalIncidentPool.find((entry) => entry.id === id) || null;

export function festivalLocalized(value, locale = "zh-Hant") {
  return value?.[locale] || value?.["zh-Hant"] || value || "";
}
