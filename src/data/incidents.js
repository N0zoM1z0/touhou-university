const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });

const hypothesis = (id, title, rationale) => ({ id, title, rationale });
const evidence = (id, kind, title, body, source, reliability) => ({ id, kind, title, body, source, reliability });
const testimony = (id, speaker, role, statement, tension) => ({ id, speaker, role, statement, tension });
const action = (id, title, body, caution, effects) => ({ id, title, body, caution, effects, reversible: true });

export const incidentCases = [
  {
    id: "late-bell-seven",
    code: "TU-IR-142",
    mark: "鐘",
    severity: "amber",
    status: "open",
    reportedAt: "2026-07-25T00:42:00.000Z",
    location: l("境界講堂・校鐘塔", "境界講堂・鐘楼", "Boundary Hall · Bell Tower"),
    title: l("只對遲到者可聞的校鐘，被七名準時者聽見", "遅刻者だけに聞こえる鐘を、定刻の七名が聞いた", "Seven punctual students heard the latecomer-only bell"),
    lede: l(
      "試行首日，校鐘按規則只應傳給遲到者；七名出席紀錄正常的學生卻在不同位置聽見同一聲鐘，其中三人因此提早離開下一堂課。",
      "試行初日、鐘は遅刻者だけへ届くはずだった。出席記録が正常な七名が別々の場所で同じ鐘を聞き、うち三名は次の授業を早退した。",
      "On the first trial day, the bell should have reached only latecomers. Seven students with punctual records heard the same strike in different places; three then left their next class early.",
    ),
    dispatch: l("鐘樓暫停自動判定，但普通報時仍運作。不要為測試而故意遲到。", "自動判定を停止し、通常時報のみ継続。試験目的の意図的遅刻は禁止。", "Automatic judgment is suspended; ordinary timekeeping remains active. Do not be deliberately late for testing."),
    affected: l("7 名學生、2 門課、1 份堅稱無誤的點名冊", "学生7名・授業2件・誤りなしと主張する出席簿1冊", "7 students, 2 classes, and 1 roll book insisting it is correct"),
    signal: l("非目標者聽見鐘聲的比例", "非対象者の鐘聴取率", "Bell detection among non-targets"),
    unit: l("百分點", "パーセントポイント", "percentage points"),
    truthHypothesis: "roster-lag",
    simulation: { baseline: 31, confound: 17, drift: 9, missing: 14, version: 12 },
    hypotheses: [
      hypothesis("roster-lag", l("點名冊時間比鐘樓慢一刻", "出席簿の時刻が鐘楼より一刻遅い", "The roll clock lags behind the bell"), l("鐘樓讀取的是交卷時快照，教室則在慧音補記後顯示準時。", "鐘楼は提出時の写しを読み、教室側は慧音の追記後に定刻表示となった。", "The tower reads the submitted snapshot; classroom records show punctuality after Keine’s annotation.")),
      hypothesis("wing-reflection", l("大型翅翼把鐘聲反射給旁人", "大型翼が鐘音を周囲へ反射した", "Large wings reflected the bell to bystanders"), l("七人中四人靠近天狗進場線，聲音可能繞過個人化結界。", "七名中四名は天狗進入線付近におり、個別結界を回折した可能性がある。", "Four of seven stood near the tengu approach, where sound may have bypassed personal wards.")),
      hypothesis("expectation", l("速報先讓大家預期自己會聽見", "速報が先に聴取期待を作った", "The bulletin created an expectation of hearing it"), l("文文。校報在正式試行前九分鐘發出「遲到鐘已響」的號外。", "文々。学報は正式試行9分前に「遅刻鐘鳴る」の号外を出した。", "Bunbunmaru Campus News issued “Late Bell Rings” nine minutes before the trial.")),
    ],
    evidence: [
      evidence("tower-log", "instrument", l("鐘樓判定紀錄 v1.3", "鐘楼判定記録 v1.3", "Bell decision log v1.3"), l("七個學籍編號在 08:09:58 被標成遲到；教室點名頁顯示 08:09:41 到席。兩個系統的『08:10』不是同一個邊界。", "七番号を08:09:58に遅刻判定。教室簿は08:09:41着席。二系統の「08:10」は同じ境界ではない。", "Seven IDs were marked late at 08:09:58; the classroom roll shows 08:09:41. The two systems do not share the same boundary for 08:10."), l("河童鐘樓終端", "河童鐘楼端末", "Kappa tower terminal"), 92),
      evidence("roll-page", "record", l("慧音補記過的點名頁", "慧音の追記入り出席頁", "Roll page annotated by Keine"), l("墨水乾燥層顯示『準時』寫在鐘響後，但記錄所指的到席時間在鐘響前。補記是更正，不是時間旅行——至少慧音如此註明。", "「定刻」の墨は鐘後に乾いたが、記載された着席時刻は鐘前。追記は訂正で時間旅行ではない、と慧音注記。", "The “punctual” ink dried after the bell, but refers to an arrival before it. Keine notes this is a correction, not time travel."), l("歷史記錄學院", "歴史記録学部", "History & Records"), 86),
      evidence("roof-audio", "trace", l("屋頂四向錄音", "屋上四方向録音", "Four-way roof audio"), l("北側錄到 0.7 秒回聲，但只有兩名受影響者位於北側；翼面反射能解釋局部，不能單獨解釋七人。", "北側に0.7秒反響。ただし該当者は二名のみ。翼面反射は一部を説明するが七名全員ではない。", "A 0.7-second echo appears north; only two affected students were there. Wing reflection explains part, not all seven."), l("天狗觀測所", "天狗観測所", "Tengu Observatory"), 78),
      evidence("extra-edition", "media", l("比鐘聲早九分鐘的號外", "鐘より9分早い号外", "Extra edition nine minutes before the bell"), l("標題聲稱鐘已響，正文卻寫『預計於辰末試行』。文表示標題採用了『讀者抵達報紙時的現在』。", "見出しは鐘が鳴ったと断言、本文は「辰末に試行予定」。文は「読者が新聞へ到達する時点の現在」を採用したと説明。", "The headline says the bell rang; the body says it is due later. Aya says the headline used “the present when readers reach the paper.”"), l("文文。校報剪貼", "文々。学報切抜", "Bunbunmaru clipping"), 64),
    ],
    testimony: [
      testimony("student-17", l("外界交換生 17 號", "外界交換生17号", "Outside exchange student 17"), l("受影響者", "該当者", "Affected student"), l("我先看到號外，但當時覺得那是新聞時態；真正聽見鐘後，我才查點名頁。", "先に号外を見たが新聞時制だと思った。実際に鐘を聞いてから出席簿を確認した。", "I saw the extra first but assumed it was newspaper tense. I checked the roll only after hearing the actual bell."), l("不能排除期待效應，但他能描述鐘後的北向回聲。", "期待効果は除外できないが、鐘後の北向反響を記述できる。", "Expectation remains possible, but the student describes the northbound echo after the strike.")),
      testimony("aya", l("射命丸文", "射命丸文", "Aya Shameimaru"), l("發稿者／觀測者", "発行者・観測者", "Publisher / observer"), l("我沒有讓鐘提早響；我只是比鐘早知道它會響。兩件事在新聞學上差很多。", "鐘を早く鳴らしてはいない。鐘より先に鳴ると知っただけ。報道学上は大違いだ。", "I did not make the bell ring early. I merely knew it would ring before it did. Journalism treats those very differently."), l("她同時控制部分暴露與第一份公開敘事。", "曝露の一部と最初の公的叙述を同時に管理。", "She controls part of the exposure and the first public narrative.")),
      testimony("nitori", l("河城荷取", "河城にとり", "Nitori Kawashiro"), l("設備維護", "設備保守", "Equipment maintainer"), l("鐘樓時鐘絕對準。至於它讀的點名冊是不是今天那份，採購規格沒有要求我回答。", "鐘楼時計は絶対正確。ただし読む出席簿が今日の版かは調達仕様にない。", "The tower clock is absolutely accurate. Whether it reads today’s roll was not in my procurement specification."), l("設備時鐘與資料版本是兩個問題。", "設備時計と資料版は別問題。", "Instrument time and data version are separate questions.")),
    ],
    actions: [
      action("freeze-roster", l("凍結鐘樓點名冊版本", "鐘楼の出席簿版を固定", "Freeze the tower’s roll version"), l("讓一次測試全程使用同一份點名快照，結束後再接受慧音補記。", "一試行中は同一写しを使用し、慧音の追記は終了後に反映。", "Use one roll snapshot throughout a trial, accepting Keine’s annotations afterward."), l("會暫時顯示部分已更正的遲到。", "訂正済み遅刻が一時表示される。", "Some corrected lateness remains temporarily visible."), { version: -18 }),
      action("calibrate-clocks", l("同步鐘樓與教室邊界時刻", "鐘楼と教室の境界時刻を同期", "Synchronise tower and classroom boundaries"), l("用同一個脈衝標記兩邊的 08:10，不改動既有點名內容。", "同じパルスで両側の08:10を標識し、既存記録は変更しない。", "Mark 08:10 on both sides with one pulse without rewriting existing attendance."), l("紫要求先定義脈衝跨境時算哪一側。", "紫はパルス越境時の所属側を先に定義せよと要求。", "Yukari wants the pulse’s side defined while it crosses."), { drift: -14 }),
      action("quiet-trial", l("無速報盲測一個早晨", "速報なしで一朝盲検", "Run one morning without advance headlines"), l("新聞學院仍可觀測，但截稿在鐘響後；測量期待效應。", "報道学部は観測可、締切は鐘後。期待効果を測定。", "Journalism may observe, but publication waits until after the strike."), l("文已提交標題為『校方延遲重要資訊』的預備稿。", "文は「大学、重要情報を遅延」の予備稿を提出済み。", "Aya has pre-filed “University Delays Vital Information.”"), { confound: -15 }),
      action("move-berth", l("暫移北側大型翼停泊線", "北側大型翼停泊線を一時移設", "Temporarily move the north large-wing berth"), l("把翼面反射從下一輪中移除，再比較南北差異。", "次回から翼面反射を除き南北差を比較。", "Remove wing reflection from the next round and compare north with south."), l("天狗學生表示多走十二公尺本身會造成遲到。", "天狗学生は12メートル迂回自体が遅刻を生むと主張。", "Tengu students say the twelve-metre detour itself creates lateness."), { confound: -8 }),
    ],
    reactions: [
      { category: "notice", author: l("鐘樓事件聯絡室", "鐘楼事案連絡室", "Bell Incident Desk"), title: l("校鐘案已結案：{finding}", "鐘楼事案を終結：{finding}", "Bell case closed: {finding}"), body: l("採取措施：{action}。完整分辨度 {quality}/100，檔案 {ref}。", "措置：{action}。設計識別度 {quality}/100、記録 {ref}。", "Action: {action}. Design identifiability {quality}/100; file {ref}.") },
      { category: "course", author: l("準時但有點不服的七人", "定刻だが納得していない七名", "Seven punctual but unconvinced students"), title: l("所以我們到底算不算遲到？", "結局、私たちは遅刻なのか", "So were we late or not?"), body: l("研究說 {finding}，教務頁仍有兩種時間。有人知道申訴應該附鐘聲還是墨水嗎？", "研究は {finding}。学務頁には時刻が二つ。異議には鐘音と墨のどちらを添付？", "The study says {finding}; the registrar still has two times. Do appeals attach the bell or the ink?") },
      { category: "notice", author: l("文文。校報訂正欄", "文々。学報訂正欄", "Bunbunmaru Corrections"), title: l("訂正：本報沒有使鐘提早，只是標題早到", "訂正：本紙は鐘を早めず、見出しが早着した", "Correction: we did not advance the bell; the headline arrived early"), body: l("本報接受 {ref} 的部分結論，但保留對『早』字邊界的編輯權。", "{ref} の一部結論を受け入れるが、「早い」の境界編集権は留保。", "We accept part of {ref}, while reserving editorial control over the boundary of “early.”") },
    ],
  },
  {
    id: "fourth-lantern-loop",
    code: "TU-IR-147",
    mark: "竹",
    severity: "red",
    status: "open",
    reportedAt: "2026-07-25T02:18:00.000Z",
    location: l("迷途竹林・第四盞藍燈線", "迷いの竹林・第四青灯線", "Bamboo Forest · Fourth Blue Lantern Line"),
    title: l("兔車連續三班抵達同一盞『第四盞燈』", "兎車三便が同じ「第四灯」へ連続到着", "Three rabbit shuttles arrived at the same “fourth lantern”"),
    lede: l("三班兔車按不同路線出發，卻在十二分鐘內依次回到同一月台。車掌說月台移動；月台說車沒有離開。", "別経路で出た兎車三便が12分以内に同じ乗場へ戻った。車掌は乗場が動いたとし、乗場は車が出ていないと主張。", "Three shuttles left by different routes and returned to the same platform within twelve minutes. Conductors say the platform moved; the platform says the vehicles never left."),
    dispatch: l("兔車改走第五盞燈；若先看到另一盞第五燈，請不要同時使用兩盞。", "兎車は第五灯へ迂回。別の第五灯を先に見ても二つ同時に使わないこと。", "Rabbit shuttles divert via lantern five. If another fifth lantern appears first, do not use both."),
    affected: l("43 名乘客、3 班兔車、至少 1 座月台", "乗客43名・兎車3便・乗場最低1基", "43 passengers, 3 shuttles, at least 1 platform"),
    signal: l("正確抵達永遠亭的班次比例", "永遠亭へ正しく到着した便率", "Shuttles reaching Eientei correctly"),
    unit: l("百分點", "パーセントポイント", "percentage points"),
    truthHypothesis: "firmware-drift",
    simulation: { baseline: 38, confound: 12, drift: 21, missing: 11, version: 24 },
    hypotheses: [
      hypothesis("firmware-drift", l("三班車使用了不同燈號韌體", "三便が異なる灯番号ファームを使用", "The shuttles used different lantern firmware"), l("河童終端顯示 v3.1b、v3.1b-真的修好、v3.2-暫不發布三種版本。", "河童端末に v3.1b・v3.1b-本当に修正・v3.2-未公開の三版。", "Kappa terminals show v3.1b, v3.1b-really-fixed, and v3.2-do-not-release.")),
      hypothesis("tewi-label", l("因幡帝把三盞燈都貼成第四盞", "因幡てゐが三灯を第四灯と表示", "Tewi labelled three lanterns as number four"), l("現場找到兩張可移除的『四』字貼紙，第三張自稱是原廠銘牌。", "剥離可能な「四」札が二枚。三枚目は純正銘板を自称。", "Two removable ‘4’ labels were found; a third claims to be the factory plate.")),
      hypothesis("lunar-fold", l("下弦月把三條路折到同一月台", "下弦月が三経路を同じ乗場へ折った", "The waning moon folded three routes onto one platform"), l("路線異常只在月光穿過第四竹節時出現，但當夜雲量紀錄缺兩段。", "月光が第四竹節を通る時だけ異常。ただし当夜の雲量記録は二区間欠測。", "The anomaly appears when moonlight crosses the fourth bamboo joint, but two cloud-cover intervals are missing.")),
    ],
    evidence: [
      evidence("firmware-stubs", "instrument", l("三台終端的啟動畫面", "三端末の起動画面", "Boot screens from three terminals"), l("版本字串不同，路徑表校驗碼也不同；只有 v3.1b 把第五燈的座標叫作第四燈。", "版文字列と経路表チェックサムが異なる。v3.1bだけが第五灯座標を第四灯と呼ぶ。", "Version strings and route-table checksums differ. Only v3.1b calls lantern five’s coordinates lantern four."), l("河童交通終端", "河童交通端末", "Kappa transit terminals"), 95),
      evidence("paper-fours", "trace", l("兩張半『四』字貼紙", "「四」札二枚半", "Two and a half ‘4’ labels"), l("兩張有胡蘿蔔膠，半張貼在車掌帽內側。帝表示這只能證明有人很重視四。", "二枚は人参糊、半枚は車掌帽の裏。てゐは「四を重視する者」の証明に過ぎないと主張。", "Two use carrot paste; half a label sits inside a conductor’s cap. Tewi says this proves only that someone values four."), l("現場採集袋", "現場採取袋", "Scene collection bag"), 72),
      evidence("moon-log", "environment", l("月光與雲量紀錄", "月光・雲量記録", "Moonlight and cloud log"), l("兩段缺失剛好覆蓋第二、三班回轉；缺失由感測器休眠造成，休眠原因寫作『兔子坐在上面』。", "欠測二区間は第二・三便の回転と一致。センサー休眠理由は「兎が座った」。", "Two missing intervals cover the second and third returns. The sensor slept because “a rabbit sat on it.”"), l("永遠亭氣象架", "永遠亭気象架", "Eientei weather rack"), 58),
      evidence("ticket-times", "record", l("四十三張車票的打孔時間", "43枚の乗車券打刻", "Punch times on 43 tickets"), l("三班的乘車時間各差 37 秒，符合終端重算路徑的時間，不符合整座月台搬移。", "三便の所要差は各37秒。端末再計算時間に一致し、乗場全体の移動とは合わない。", "Trip times differ by 37 seconds each, matching terminal route recomputation rather than moving an entire platform."), l("兔車票務箱", "兎車運賃箱", "Rabbit shuttle fare box"), 89),
    ],
    testimony: [
      testimony("conductor", l("白兔車掌 08", "白兎車掌08", "White Rabbit Conductor 08"), l("第一班車掌", "第一便車掌", "First conductor"), l("我照終端箭頭走，箭頭每次都很有自信。這通常比它正確更麻煩。", "端末矢印に従った。矢印は毎回自信満々で、それは正しい時より厄介だ。", "I followed the terminal arrow. It was confident every time, which is often worse than being correct."), l("熟悉設備，但知道自己看見版本字串後才作證。", "設備に詳しいが、版文字列を見た後の証言。", "Experienced with equipment, but testified after seeing the version strings.")),
      testimony("tewi", l("因幡帝", "因幡てゐ", "Tewi Inaba"), l("臨時路線顧問（自稱）", "臨時経路顧問（自称）", "Temporary route adviser (self-appointed)"), l("如果貼紙真的能讓月台移動，河童早就向我買專利了。", "札で乗場が動くなら、河童はとっくに特許を買っている。", "If labels could move platforms, the kappa would already have bought my patent."), l("沒有否認貼貼紙，只是否認貼紙具有因果力。", "札を貼ったことは否定せず、因果力だけ否定。", "Does not deny placing labels, only that labels have causal force.")),
      testimony("eirin", l("八意永琳", "八意永琳", "Eirin Yagokoro"), l("永遠亭路線共同管理", "永遠亭経路共同管理", "Joint route manager"), l("月相可以折路，但不會替工程師命名版本。先把能修的修好，再討論不能修的。", "月相は道を折れるが版名は付けない。直せるものを先に直し、直せないものを後で議論する。", "Moon phase can fold roads, but it does not name firmware. Repair what can be repaired before debating what cannot."), l("傾向可操作解釋，但沒有排除月相交互作用。", "操作可能な説明を優先するが、月相交互作用は除外せず。", "Prefers actionable explanations without excluding lunar interaction.")),
    ],
    actions: [
      action("lock-firmware", l("三班車鎖定同一韌體", "三便を同一ファームへ固定", "Lock all shuttles to one firmware"), l("保留三份舊版影像，測試期間只讀同一條路徑表。", "旧版三種を保存し、試験中は同一路線表のみ読取。", "Archive all three old images and read one route table during the trial."), l("荷取要求版本名叫『final-final-這次真的』。", "にとりは版名を「final-final-今度こそ」と要求。", "Nitori requests the name final-final-really-this-time."), { version: -24 }),
      action("calibrate-lanterns", l("以實際座標重校燈號", "実座標で灯番号を再校正", "Recalibrate lantern numbers from coordinates"), l("不相信貼紙或自述，以測繪樁重新標號。", "札や自己申告を使わず測量杭で再番号付け。", "Renumber from survey posts, trusting neither labels nor self-description."), l("第三盞燈已申請保留被叫作第四盞的權利。", "第三灯は第四灯と呼ばれる権利を申請済み。", "Lantern three has applied to retain the right to be called four."), { drift: -19 }),
      action("cloud-control", l("補上月光對照班次", "月光対照便を追加", "Add moonlight control shuttles"), l("同一版本分別在遮月與未遮月路線行駛。", "同一版を遮月・非遮月経路で走行。", "Run the same version on moon-screened and unscreened routes."), l("遮月簾不得由會坐上感測器的兔子操作。", "遮月幕はセンサーに座る兎が操作してはならない。", "The moon screen may not be operated by rabbits who sit on sensors."), { confound: -12, missing: -8 }),
      action("remove-labels", l("封存所有可移動數字", "可動数字札を全て封印", "Seal all movable number labels"), l("每班前後清點標籤與胡蘿蔔膠殘留。", "各便前後に札と人参糊残留を点検。", "Count labels and carrot-paste residue before and after each run."), l("帝提出改用能自行走動的文字，規則尚未涵蓋。", "てゐは自走文字への変更を提案。規則未対応。", "Tewi proposes self-moving numerals, which the rule does not cover."), { confound: -10 }),
    ],
    reactions: [
      { category: "notice", author: l("竹林交通共同室", "竹林交通共同室", "Bamboo Transit Joint Desk"), title: l("第四盞燈案結案：{finding}", "第四灯事案を終結：{finding}", "Fourth Lantern case closed: {finding}"), body: l("先行措施：{action}。辨識度 {quality}/100；搭車前仍請看燈，也請看版本。", "先行措置：{action}。識別度 {quality}/100。乗車前は灯と版を確認。", "First action: {action}. Identifiability {quality}/100. Check both lantern and version before boarding.") },
      { category: "market", author: l("匿名但很幸運的兔子", "匿名だが幸運な兎", "Anonymous but fortunate rabbit"), title: l("出售兩張『四』字貼紙，事件後收藏版", "「四」札二枚、事案後記念版", "For sale: two post-incident number-four labels"), body: l("研究說 {finding}，所以貼紙理論上已失去交通功能。拒絕對收藏價值負責。", "研究は {finding}。札の交通機能は理論上消失。収集価値は保証しない。", "The study says {finding}, so the labels should have lost transit function. No warranty on collector value.") },
      { category: "club", author: l("竹林定向部", "竹林オリエンテーリング部", "Bamboo Navigation Club"), title: l("本週訓練：不用數字找回宿舍", "今週訓練：数字なしで帰寮", "This week: find your hall without numbers"), body: l("因 {ref} 提醒，集合點改以氣味、風向與一隻不保證可靠的兔子描述。", "{ref} を受け、集合点は匂い・風向・信頼性未保証の兎で記述。", "Following {ref}, the meeting point uses scent, wind, and one rabbit of unverified reliability.") },
    ],
  },
  {
    id: "flying-book-window",
    code: "TU-IR-151",
    mark: "書",
    severity: "amber",
    status: "open",
    reportedAt: "2026-07-25T03:06:00.000Z",
    location: l("霧湖圖書館・北翼窗區", "霧の湖図書館・北翼窓区", "Misty Lake Library · North windows"),
    title: l("四本會飛的館藏同時離架，只有一本真的想逃", "飛行蔵書四冊が同時離架、逃亡希望は一冊だけ", "Four flying books left together; only one meant to escape"),
    lede: l("開窗後四本自主館藏飛向湖面。三本在窗外盤旋後回館，第四本與妖精談判新書架位置。館員要求分清意志、氣流與從眾。", "開窓後、自律蔵書四冊が湖へ。三冊は旋回後帰館、四冊目は妖精と新棚を交渉。司書は意思・気流・追随の分離を要求。", "After a window opened, four autonomous holdings flew lakeward. Three circled back; the fourth negotiated a new shelf with fairies. Staff want volition separated from airflow and imitation."),
    dispatch: l("北翼窗開度限制十公分；捕網只對沒有主動返回意圖的書使用。", "北翼窓は10cmまで。捕獲網は自発帰還意思のない本にのみ使用。", "North windows are limited to ten centimetres. Nets are for books without an intention to return."),
    affected: l("4 本館藏、19 名讀者、1 場尚未結束的書架談判", "蔵書4冊・読者19名・未終結の棚交渉1件", "4 holdings, 19 readers, and 1 unfinished shelf negotiation"),
    signal: l("開窗後離架概率", "開窓後離架確率", "Probability of leaving shelf after window opening"),
    unit: l("百分點", "パーセントポイント", "percentage points"),
    truthHypothesis: "pressure-flock",
    simulation: { baseline: 27, confound: 22, drift: 7, missing: 16, version: 8 },
    hypotheses: [
      hypothesis("pressure-flock", l("氣壓先帶走一本，其餘三本跟飛", "気圧が一冊を運び、三冊が追随", "Pressure moved one book and three followed"), l("離架相差不到 0.4 秒，但第一本的書扣先受向外壓差。", "離架差は0.4秒未満。最初の一冊だけ留具に外向圧差。", "Departures differ by under 0.4 seconds, but only the first clasp experienced outward pressure first.")),
      hypothesis("shelf-protest", l("四本共同抗議北翼書架", "四冊による北翼棚への共同抗議", "A collective protest against the north shelf"), l("第四本曾提交移架請求，另外三本只在頁邊簽名，簽名效力有爭議。", "第四冊は移架申請済み。他三冊は欄外署名のみで効力係争中。", "The fourth filed for relocation; the other three only signed a margin, whose validity is disputed.")),
      hypothesis("fairy-lure", l("湖上妖精用故事結尾引書出窗", "湖上妖精が物語の結末で本を誘引", "Lake fairies lured books with story endings"), l("窗外錄到三個互相矛盾的結尾；只有第四本在目錄中標為『討厭未完』。", "窓外で矛盾する結末三種を録音。第四冊のみ目録に「未完嫌い」。", "Three contradictory endings were heard outside. Only the fourth is catalogued as disliking unfinished stories.")),
    ],
    evidence: [
      evidence("clasp-telemetry", "instrument", l("四個書扣的毫秒級張力", "四留具のミリ秒張力", "Millisecond clasp tension"), l("第一本先受 1.8N 外力，另外三本在 310–390ms 後主動解扣。", "一冊目に1.8N外力、他三冊は310–390ms後に自発解錠。", "Book one received 1.8 N outward force; the other three released themselves 310–390 ms later."), l("霧湖編目室", "霧の湖目録室", "Misty Lake Cataloguing"), 94),
      evidence("window-log", "environment", l("窗縫壓差與風向紙", "窓隙圧差・風向紙", "Window pressure and wind slips"), l("開窗瞬間壓差足以移動一本輕型館藏，不足以同時移動四本。", "開窓時圧差は軽量本一冊を動かせるが四冊同時には不足。", "The pressure could move one light holding, not four simultaneously."), l("河童設施組", "河童施設班", "Kappa Facilities"), 88),
      evidence("margin-petition", "record", l("《會飛的書》頁邊移架聯署", "『飛ぶ本』欄外移架連署", "Relocation signatures in Flying Books"), l("第四本寫了完整請求；另外三本的簽名墨跡出現在離架後兩分鐘。", "第四冊は完全な請求。他三冊の署名墨は離架二分後。", "The fourth wrote a complete request. The other signatures appeared two minutes after departure."), l("館員現場影本", "司書現場写し", "Librarian scene copy"), 83),
      evidence("fairy-audio", "trace", l("湖上三個故事結尾", "湖上の三つの結末", "Three story endings over the lake"), l("第一個結尾發生在離架後，第二個由一本書自己補完，第三個是妖精忘詞。", "第一結末は離架後、第二は本自身が補完、第三は妖精が失念。", "The first ending came after departure, the second was supplied by a book, and the fairy forgot the third."), l("北窗聲景錄音", "北窓音景録音", "North-window soundscape"), 76),
    ],
    testimony: [
      testimony("librarian", l("小惡魔", "小悪魔", "Koakuma"), l("當值館員", "当直司書", "Duty librarian"), l("一本書被風吹走是設施問題；三本書跟著飛是館藏行為；第四本拒絕回來是人事問題。", "一冊が風で出るのは施設、三冊が追うのは蔵書行動、四冊目が戻らないのは人事問題。", "One book blown out is facilities; three following is collection behaviour; the fourth refusing to return is personnel."), l("分類清楚，但可能在看過張力紀錄後重構順序。", "分類は明瞭だが張力記録確認後に順序を再構成した可能性。", "Clear classification, but sequence may have been reconstructed after telemetry.")),
      testimony("book-four", l("第四本館藏（以翻頁作答）", "第四蔵書（頁めくり回答）", "Fourth holding (answered by page turns)"), l("離架者", "離架者", "Departing holding"), l("它翻到『不是每一次離開都是逃跑』，接著把索書號朝圖書館方向展示。", "「すべての離脱が逃亡ではない」を開き、請求記号を図書館側へ示した。", "It opened to “not every departure is escape,” then displayed its call number toward the library."), l("書願意維持館籍，但仍要求搬架。", "館籍維持意思はあるが移架要求継続。", "It intends to remain in the collection while demanding relocation.")),
      testimony("cirno", l("琪露諾", "チルノ", "Cirno"), l("湖上目擊者", "湖上目撃者", "Lake witness"), l("我沒引誘書。我只是告訴它們最強的故事結尾一定有我。", "本を誘ってない。最強の物語の結末には必ず私がいると教えただけ。", "I did not lure the books. I only told them the strongest story endings always contain me."), l("否認行為與描述行為之間只差一個動詞。", "否認と行為説明の差が動詞一つ。", "Her denial and description differ by one verb.")),
    ],
    actions: [
      action("window-baffle", l("加裝可拆風壓導板", "着脱式風圧板を設置", "Fit removable pressure baffles"), l("保留通風，降低第一本被動離架的力量。", "換気を保ち最初の受動離架力を低減。", "Keep ventilation while reducing the force on the first book."), l("導板若寫上文字，可能被編入館藏。", "板に文字を書くと蔵書化する可能性。", "Writing on the baffle may cause it to join the collection."), { confound: -17 }),
      action("single-book-trials", l("逐本開窗對照", "一冊ずつ開窓対照", "Run one-book-at-a-time window controls"), l("把從眾與共同抗議分開測量，書可隨時拒絕。", "追随と共同抗議を分け、本は随時拒否可。", "Separate following from protest; books may refuse at any time."), l("帕秋莉要求拒絕本也計入缺失而非不合作。", "パチュリーは拒否本を非協力でなく欠測扱いと要求。", "Patchouli wants refusals counted as missing, not uncooperative."), { missing: -13, confound: -8 }),
      action("shelf-mediation", l("先完成第四本的移架調解", "第四冊の移架調停を先行", "Mediate the fourth book’s shelf request first"), l("在下一輪測試前處理長期不滿，避免把意志當雜訊。", "次試行前に長期不満を処理し、意思を雑音扱いしない。", "Address long-running dissatisfaction before the next trial instead of treating volition as noise."), l("原書架也要求參加調解。", "元の書架も調停参加を要求。", "The former shelf also requests representation."), { confound: -12 }),
      action("ending-silence", l("窗外故事結尾靜默一小時", "窓外の物語結末を一時間停止", "One hour without story endings outside"), l("妖精可以唱前文，但暫不說出結尾。", "妖精は本文を歌えるが結末は一時禁止。", "Fairies may sing the body, but postpone endings."), l("合唱團打算把結尾改名為前奏。", "合唱団は結末を前奏へ改称予定。", "The choir plans to rename endings as preludes."), { confound: -9 }),
    ],
    reactions: [
      { category: "notice", author: l("霧湖圖書館事件桌", "霧の湖図書館事案机", "Misty Lake Incident Desk"), title: l("北窗離架案結案：{finding}", "北窓離架事案を終結：{finding}", "North-window departure case closed: {finding}"), body: l("先行措施：{action}。檔案 {ref}；書本的移架意見仍屬有效意見。", "先行措置：{action}。記録 {ref}。本の移架意見は引き続き有効。", "First action: {action}. File {ref}. A book’s relocation request remains a valid request.") },
      { category: "course", author: l("自主館藏研究小組", "自律蔵書研究班", "Autonomous Holdings Group"), title: l("從眾算不算一本書的意志？徵期末報告", "追随は本の意思か？期末報告募集", "Is following another book an act of volition?"), body: l("{ref} 認為 {finding}。報告不得用捕網作為唯一操作定義。", "{ref} は {finding} と判断。捕獲網を唯一の操作定義にしないこと。", "{ref} found {finding}. Papers may not use the capture net as their only operational definition.") },
      { category: "club", author: l("妖精合唱團", "妖精合唱団", "Fairy Choir"), title: l("今晚只唱故事前 99%，歡迎書本旁聽", "今夜は物語の99%まで。本の聴講歓迎", "Tonight: only the first 99% of each story; books welcome"), body: l("配合 {action}，結尾暫存於一個不開窗的地方。請勿追問是哪裡。", "{action} に協力し、結末は窓のない場所へ保管。場所は質問しないこと。", "To support {action}, endings are stored somewhere without windows. Do not ask where.") },
    ],
  },
  {
    id: "headline-yesterday",
    code: "TU-IR-158",
    mark: "報",
    severity: "red",
    status: "open",
    reportedAt: "2026-07-25T04:12:00.000Z",
    location: l("天狗新聞樓・稗田史學館", "天狗新聞楼・稗田史学館", "Tengu Press Tower · Hieda History Hall"),
    title: l("校報刊出明日的事件，校史卻已把它列為昨日", "学報が明日の事件を掲載、大学史はすでに昨日として収録", "The paper published tomorrow’s event; the chronicle filed it as yesterday"),
    lede: l("一篇尚未發生的工房爆炸報導出現在晨報；工房隨後真的爆炸，但時間、原因與報導不同。校史索引又把兩個版本都編入昨日。", "未発生の工房爆発記事が朝刊へ。後に実際の爆発が起きたが時刻・原因は記事と異なる。大学史索引は両版を昨日へ収録。", "A report of an unoccurred workshop explosion appeared in the morning paper. A later explosion differed in time and cause, while the chronicle indexed both versions under yesterday."),
    dispatch: l("工房維持開放，但預言性報導不得當作安全檢查替代品。", "工房は開放継続。ただし予言的記事を安全点検の代用にしない。", "The workshop remains open, but prophetic reporting is not a substitute for safety checks."),
    affected: l("1 座工房、2 個事件版本、6 篇互相引用的訂正", "工房1棟・事案版2種・相互引用する訂正6件", "1 workshop, 2 incident versions, and 6 corrections citing each other"),
    signal: l("報導細節與實際事件一致率", "記事詳細と実事案の一致率", "Agreement between report details and actual event"),
    unit: l("百分點", "パーセントポイント", "percentage points"),
    truthHypothesis: "cache-mix",
    simulation: { baseline: 24, confound: 19, drift: 13, missing: 18, version: 29 },
    hypotheses: [
      hypothesis("cache-mix", l("校報排版快取混入上一輪模擬事件", "学報組版キャッシュに前回模擬事案が混入", "Layout cache mixed in a previous simulated incident"), l("報導的爆炸時間與研究課上週模擬資料一致，只有地點被自動替換成今日值班工房。", "記事時刻は先週の研究模擬と一致し、場所だけ当日当番工房へ自動置換。", "The report time matches last week’s simulation; only the location was replaced with today’s duty workshop.")),
      hypothesis("aya-forecast", l("文以風向與採訪推算出事件", "文が風向と取材から事案を予測", "Aya forecast the incident from wind and interviews"), l("她確實掌握壓力閥異音，但報導原因寫成蘑菇燃料，實際原因是齒輪蓮藕。", "圧力弁異音は把握していたが、記事は茸燃料、実際は歯車蓮根。", "She knew about valve noise, but blamed mushroom fuel; the actual trigger was gear-cut lotus root.")),
      hypothesis("history-pull", l("校史的昨日索引把事件拉向已寫版本", "大学史の昨日索引が事案を既述版へ引いた", "The chronicle’s yesterday index pulled events toward the written version"), l("索引建立後，工房事故細節與報紙相似度短暫上升，但順序可能反過來。", "索引作成後に類似度が一時上昇。ただし順序は逆かもしれない。", "Similarity rose briefly after indexing, though the causal order may run the other way.")),
    ],
    evidence: [
      evidence("layout-cache", "version", l("排版機快取目錄", "組版機キャッシュ目録", "Layout cache manifest"), l("檔名 `incident-final2-use-this` 建於上週研究課，今晨被模板誤判為最新批准版本。", "incident-final2-use-this は先週の研究授業作成。今朝テンプレートが最新承認版と誤認。", "`incident-final2-use-this` was created in last week’s lab and mistaken by the template for the latest approved version this morning."), l("天狗新聞樓排版機", "天狗新聞楼組版機", "Tengu Press layout machine"), 97),
      evidence("valve-audio", "trace", l("事故前壓力閥聲景", "事案前圧力弁音景", "Pre-incident valve soundscape"), l("異音在報導前已出現，可支持一般風險預測；但無法支持報導內的精確時刻與蘑菇原因。", "異音は記事前に存在し一般的リスク予測を支持。ただし正確な時刻・茸原因は支持せず。", "Noise existed before publication and supports generic risk prediction, not the exact time or mushroom cause."), l("文的個人錄音筆", "文の個人録音筆", "Aya’s recorder"), 81),
      evidence("lotus-gear", "material", l("卡在壓力閥的齒輪蓮藕", "圧力弁に詰まった歯車蓮根", "Gear-cut lotus lodged in the valve"), l("來自南食堂咖哩；工房學生把它當備用零件，與報導所稱蘑菇燃料無關。", "南食堂カレー由来。学生が予備部品に使用。記事の茸燃料とは無関係。", "It came from South Dining and was used as a spare part, unrelated to the report’s mushroom fuel."), l("河童工房封存袋", "河童工房封印袋", "Kappa Workshop evidence bag"), 93),
      evidence("chronicle-index", "record", l("『昨日』索引建立時間", "「昨日」索引作成時刻", "Creation time of the ‘yesterday’ index"), l("索引在排版快取被讀取後七分鐘建立，在真實爆炸前十九分鐘；它記錄了報導，未必造成報導。", "索引はキャッシュ読込7分後、実爆発19分前に作成。記事を記録したが記事を生んだとは限らない。", "The index was created seven minutes after cache load and nineteen before the real explosion. It records the report; it need not have caused it."), l("稗田史學館", "稗田史学館", "Hieda History Hall"), 90),
    ],
    testimony: [
      testimony("aya-press", l("射命丸文", "射命丸文", "Aya Shameimaru"), l("主筆", "主筆", "Editor"), l("快取只提供了細節，我提供了判斷。判斷後來部分正確，這在新聞上不能全算錯。", "キャッシュは細部、判断は私。判断は後に一部当たったので報道上全部誤りではない。", "The cache supplied details; I supplied judgment. The judgment later became partly right, which journalism cannot call wholly wrong."), l("把預測、模板事故與事後命中混在同一句。", "予測・テンプレ事故・事後的中を一文で混合。", "Combines forecast, template failure, and later coincidence in one sentence.")),
      testimony("akyuu", l("稗田阿求", "稗田阿求", "Hieda no Akyuu"), l("索引管理", "索引管理", "Index keeper"), l("校史記錄『昨日被報導』，不是『昨日發生』。有人把欄名截短了。", "大学史は「昨日報じられた」と記録し、「昨日発生」とはしていない。欄名が短縮された。", "The chronicle says “reported yesterday,” not “happened yesterday.” Someone shortened the column label."), l("索引語義被介面截斷，底本仍可查。", "索引意味がUIで切断、底本は確認可能。", "The interface truncates the index semantics; the source remains available.")),
      testimony("nitori-workshop", l("河城荷取", "河城にとり", "Nitori Kawashiro"), l("工房負責人", "工房責任者", "Workshop lead"), l("報紙說會爆炸後，大家檢查了蘑菇，沒人檢查午餐。預言有時會把安全檢查帶去錯的地方。", "爆発記事後、皆が茸を点検し昼食を見なかった。予言は安全点検を誤方向へ導く。", "After the prediction, everyone checked mushrooms and nobody checked lunch. Prophecy can point safety work the wrong way."), l("報導本身改變了後續檢查路徑。", "記事自体が後続点検経路を変更。", "The report changed the subsequent inspection path.")),
    ],
    actions: [
      action("purge-cache", l("封存並清空排版快取", "組版キャッシュを封印・消去", "Archive and clear the layout cache"), l("保留可追溯影像，模板只讀帶批准戳的版本。", "追跡可能な像を保存し、承認印付き版のみ読取。", "Keep traceable images and allow templates to read only stamped versions."), l("文要求保留『靈感來源』資料夾不受此限。", "文は「着想源」フォルダの除外を要求。", "Aya wants an exemption for the Inspiration Sources folder."), { version: -26 }),
      action("forecast-label", l("把預測與已發生報導分欄", "予測と発生済記事を別欄化", "Separate forecasts from occurred-event reports"), l("相同版面、不同標識，訂正不能把兩欄合併。", "同じ紙面で標識を分け、訂正時も統合不可。", "Use distinct labels on one page; corrections may not merge them."), l("讀者仍可能只轉發標題。", "読者は見出しだけ転送しうる。", "Readers may still forward only the headline."), { confound: -13 }),
      action("version-lock", l("研究模擬與新聞排版使用不同版本命名域", "研究模擬と新聞組版の版名領域を分離", "Separate naming domains for lab and newsroom versions"), l("模擬資料不能再叫 final；新聞資料不能再叫 maybe。", "模擬資料はfinal禁止、新聞資料はmaybe禁止。", "Lab files may no longer be final; newsroom files may no longer be maybe."), l("魔理沙已把自己的版本命名為 definitely-not-final。", "魔理沙は definitely-not-final と命名済み。", "Marisa has already named hers definitely-not-final."), { version: -18, drift: -6 }),
      action("independent-check", l("預言性報導觸發獨立安全清單", "予言記事で独立安全表を起動", "Trigger an independent safety checklist after predictive reports"), l("不沿用報導指向的原因，重新檢查材料、壓力與午餐。", "記事の原因を引き継がず、材料・圧力・昼食を再点検。", "Recheck materials, pressure, and lunch without inheriting the article’s proposed cause."), l("南食堂要求不要把所有午餐都列為危險材料。", "南食堂は全昼食を危険物扱いしないよう要求。", "South Dining asks not to classify every lunch as hazardous material."), { confound: -16 }),
    ],
    reactions: [
      { category: "notice", author: l("校史與新聞聯合訂正桌", "大学史・報道合同訂正机", "Chronicle–Press Joint Corrections"), title: l("明日爆炸報導案結案：{finding}", "明日爆発記事事案を終結：{finding}", "Tomorrow-explosion report case closed: {finding}"), body: l("先行措施：{action}。檔案 {ref}；『被報導』與『已發生』恢復為兩欄。", "先行措置：{action}。記録 {ref}。「報じられた」と「発生済」を二欄へ復元。", "First action: {action}. File {ref}. “Reported” and “occurred” are separate columns again.") },
      { category: "course", author: l("新聞資料方法課助教", "報道資料方法TA", "News Methods TA"), title: l("期末題：部分預測正確能否抵銷快取事故？", "期末問：部分的中はキャッシュ事故を相殺するか", "Final question: can partial prediction offset a cache failure?"), body: l("請引用 {ref}，並說明為什麼命中結果不能替代可識別方法。", "{ref} を引用し、的中結果が識別可能な方法を代替しない理由を説明。", "Cite {ref} and explain why a correct outcome does not replace an identifiable method.") },
      { category: "notice", author: l("文文。校報", "文々。学報", "Bunbunmaru Campus News"), title: l("本報新增『尚未發生但值得先寫』欄", "新欄「未発生だが先に書く価値あり」", "New column: Not Yet Happened but Worth Writing First"), body: l("依 {action} 加上明確標識。校方拒絕保證欄內事件不會因標識而發生。", "{action} に従い明示。欄内事案が表示により発生しない保証は大学が拒否。", "Clearly labelled under {action}. The university declines to guarantee the label will not make events occur.") },
    ],
  },
  {
    id: "dorm-window-chair",
    code: "TU-IR-163",
    mark: "椅",
    severity: "green",
    status: "open",
    reportedAt: "2026-07-25T05:24:00.000Z",
    location: l("境界別館・BA-YD 窗側", "境界別館・BA-YD窓側", "Boundary Annex · BA-YD window side"),
    title: l("共住協議中的窗邊椅，要求被列為第三位室友", "共同生活協定の窓辺椅子が第三同室者登録を要求", "The window chair in a roommate agreement applied as a third roommate"),
    lede: l("椅子在共住備忘生成後移到簽名欄下方，並用刮痕寫出『我也住這裡』。兩位住戶同意椅子有意見，但不同意它是否應分攤宿費。", "共同生活メモ生成後、椅子が署名欄下へ移動し「私も住む」と傷で記した。二名は意見の存在に同意、寮費分担は不一致。", "After a shared-living note was generated, the chair moved beneath the signature line and scratched “I live here too.” Both residents accept it has an opinion; they disagree on rent."),
    dispatch: l("椅子暫留原房，窗邊輪值表加上第三列，但不計入逃生人數。", "椅子は現室に留め、窓辺当番表へ第三欄追加。避難人数には未算入。", "The chair stays in place and gains a third rota row, but is not yet counted in evacuation totals."),
    affected: l("2 名住戶、1 張椅子、4 條需要重新解釋的共住規則", "居住者2名・椅子1脚・再解釈が必要な規則4条", "2 residents, 1 chair, and 4 shared rules needing reinterpretation"),
    signal: l("無人時自主移動次數", "無人時の自律移動回数", "Unattended self-movements"),
    unit: l("每夜", "回／夜", "per night"),
    truthHypothesis: "emergent-tsukumogami",
    simulation: { baseline: 19, confound: 24, drift: 11, missing: 20, version: 10 },
    hypotheses: [
      hypothesis("emergent-tsukumogami", l("長期使用與新協議促成付喪神覺醒", "長期使用と新協定が付喪神覚醒を促進", "Long use and the new agreement prompted tsukumogami awakening"), l("椅齡未知但至少九十九年；第一次被制度提及後出現穩定文字。", "椅齢不明だが最低99年。制度文書で初めて言及された後、安定した文字を示す。", "The chair is at least ninety-nine years old and produced stable writing after first being named in a formal rule.")),
      hypothesis("matoi-phasing", l("室友穿牆時無意把椅子帶過邊界", "同室者の壁抜けが椅子を境界越しに移動", "A roommate’s phasing unintentionally carried the chair"), l("境縫纏每晚穿過同一面牆，椅腳有相同邊界粉。", "境縫まといが毎晩同じ壁を抜け、椅子脚に同じ境界粉。", "Matoi phases through the same wall nightly; the chair legs carry matching boundary dust.")),
      hypothesis("familiar-prank", l("小型使魔替椅子寫字並推動它", "小型使い魔が椅子を動かし筆記", "A small familiar moved and wrote for the chair"), l("火鼠可在無人時進房，刮痕高度符合；但文字用的是家具第一人稱。", "火鼠は無人時に入室でき傷高も一致。ただし文は家具の一人称。", "A fire mouse can enter unattended and matches scratch height, but the wording uses a furniture first person.")),
    ],
    evidence: [
      evidence("night-grid", "trace", l("七夜粉筆座標", "七夜の白墨座標", "Seven-night chalk coordinates"), l("椅子有五夜移動；其中兩夜纏不在宿舍，一夜火鼠被鎖在神社活動。", "五夜移動。うち二夜まとい不在、一夜火鼠は神社行事で封鎖。", "The chair moved on five nights; Matoi was away for two, and the fire mouse was confined at a shrine event for one."), l("宿舍自治會", "寮自治会", "Hall council"), 87),
      evidence("scratch-text", "material", l("椅腳刮痕筆畫", "椅子脚の傷文字", "Lettering scratched by a chair leg"), l("每一筆起點都承受椅子全重，沒有爪尖壓痕；字形受地板縫限制。", "各画始点に椅子全重、爪先圧痕なし。字形は床目地に制約。", "Each stroke begins under the chair’s full weight with no claw-tip marks; letter shapes follow floor seams."), l("河童材料室", "河童材料室", "Kappa Materials Room"), 91),
      evidence("boundary-dust", "material", l("椅腳與牆縫的邊界粉", "椅子脚・壁隙の境界粉", "Boundary dust on chair and wall seam"), l("粉末同源，但椅子可能因多次靠牆取得，不能單獨證明被穿牆帶動。", "同源だが反復接触でも付着し、壁抜け移動の単独証拠ではない。", "The dust shares a source but could come from repeated wall contact; it does not alone prove phasing transport."), l("結界研究院", "境界・異変研究院", "Boundaries & Incidents"), 75),
      evidence("old-receipt", "record", l("香霖堂九十九年前的模糊收據", "香霖堂99年前の不鮮明領収書", "Faded Kourindou receipt from ninety-nine years ago"), l("品名只剩『長椅或短桌』，日期可信度高，物件對應仍有爭議。", "品名は「長椅子又は短机」のみ。日付は高信頼、物件対応は係争。", "The item reads only “long chair or short table.” The date is reliable; the object match is disputed."), l("住戶從椅墊下找到", "座面下から発見", "Found beneath the seat"), 66),
    ],
    testimony: [
      testimony("matoi-room", l("境縫纏", "境縫まとい", "Matoi Sakaime"), l("住戶", "居住者", "Resident"), l("我承認以前把它叫公共家具；它提出意見後，『公共』可能需要重談。但我沒有帶它穿牆。", "以前は共用家具と呼んだ。意見後は「共用」を再協議すべき。ただし壁抜けで運んでいない。", "I called it shared furniture. After it spoke, “shared” may need renegotiation. I did not carry it through a wall."), l("承認身分問題，不承認物理原因。", "身分問題は認め、物理原因は否認。", "Accepts the identity question, denies the physical cause.")),
      testimony("chacha", l("千夜茶々", "千夜ちゃちゃ", "Chacha Senya"), l("住戶／付喪神", "居住者・付喪神", "Resident / tsukumogami"), l("我以前也是長椅。它寫得很慢，但家具沒有手，這不等於沒有意見。", "私も元は長椅子。書くのは遅いが、家具に手がないことは意見がないことではない。", "I was a bench too. It writes slowly, but furniture lacking hands does not mean it lacks opinions."), l("具有相關經驗，也可能強烈投射自身歷史。", "関連経験がある一方、自身の歴史を強く投影する可能性。", "Relevant lived experience with possible strong projection.")),
      testimony("fire-mouse", l("小火鼠（由燒焦紙條翻譯）", "小火鼠（焦げ紙から翻訳）", "Fire mouse (translated from singed slips)"), l("被懷疑的使魔", "疑われた使い魔", "Suspected familiar"), l("『我只拿襪子。椅子太大。』", "「靴下だけ。椅子は大きすぎる」", "“I take socks. Chair too big.”"), l("陳述簡短一致；沒有回答是否代寫。", "短く一貫。代筆の有無は未回答。", "Brief and consistent; does not answer whether it wrote for the chair.")),
    ],
    actions: [
      action("empty-room-camera", l("無人房間低刺激觀察", "無人室の低刺激観察", "Low-stimulus unattended observation"), l("不固定椅子，只用不發光粉筆格與機械快門。", "椅子を固定せず、非発光白墨格子と機械式シャッターを使用。", "Do not restrain the chair; use a non-luminous chalk grid and mechanical shutter."), l("相機不得先假定椅子是物件還是受試者。", "カメラは椅子を物体・参加者のどちらとも先決しない。", "The camera may not pre-classify the chair as object or participant."), { missing: -15, confound: -8 }),
      action("phase-control", l("室友停止穿牆兩夜作對照", "同室者が二夜壁抜け停止で対照", "Two-night no-phasing control"), l("提供正常門鑰匙，對比椅子是否仍移動。", "通常鍵を提供し椅子移動を比較。", "Provide an ordinary key and compare whether the chair still moves."), l("纏表示使用門會讓她比平常晚到四秒。", "まといは扉使用で通常より4秒遅れると申告。", "Matoi says using a door makes her four seconds late."), { confound: -17 }),
      action("familiar-control", l("使魔留宿與不留宿交替", "使い魔在室・不在室を交互化", "Alternate familiar-present and familiar-absent nights"), l("預先登記火鼠位置，不以襪子失蹤代替追蹤。", "火鼠位置を事前登録し、靴下消失を追跡代用にしない。", "Register the fire mouse’s location rather than using missing socks as tracking."), l("火鼠拒絕佩戴比自己大的識別牌。", "火鼠は自身より大きい名札を拒否。", "The mouse refuses an ID tag larger than itself."), { confound: -14, missing: -7 }),
      action("provisional-seat", l("給椅子暫定住戶席", "椅子へ暫定居住者席", "Grant the chair a provisional resident seat"), l("在研究期間允許它參與家具輪值與共住協議，不先決定宿費。", "研究中は家具当番・協定参加を認め、寮費は未決。", "Allow it into furniture rotas and agreements during study without deciding rent."), l("會改變椅子的行為，卻避免把可能的住戶只當儀器。", "行動を変えるが、潜在的居住者を単なる計器扱いしない。", "May alter behaviour, but avoids treating a possible resident as mere apparatus."), { confound: -5 }),
    ],
    reactions: [
      { category: "notice", author: l("境界別館自治會", "境界別館自治会", "Boundary Annex Hall Council"), title: l("BA-YD 椅子案結案：{finding}", "BA-YD椅子事案を終結：{finding}", "BA-YD chair case closed: {finding}"), body: l("暫行措施：{action}。檔案 {ref}；宿費問題交給下一次不會散架的會議桌。", "暫定措置：{action}。記録 {ref}。寮費問題は次の壊れない会議机へ。", "Interim action: {action}. File {ref}. The rent question goes to the next meeting table that does not collapse.") },
      { category: "market", author: l("窗邊椅（由千夜代打字）", "窓辺椅子（千夜代筆）", "Window Chair (typed by Chacha)"), title: l("不出售，不交換，也不是公共資源", "非売・交換不可・共用資源でもない", "Not for sale, not for trade, not a common resource"), body: l("研究暫認 {finding}。另外，週二窗邊時段是我的。", "研究は暫定的に {finding}。なお火曜の窓辺枠は私のもの。", "The study provisionally finds {finding}. Also, the Tuesday window slot is mine.") },
      { category: "course", author: l("信仰與共生政策學院", "信仰・共生政策学部", "Faith & Coexistence Policy"), title: l("臨時講座：當家具成為利害關係人", "臨時講義：家具が利害関係者になる時", "Pop-up seminar: when furniture becomes a stakeholder"), body: l("以 {ref} 為案例。神奈子要求談基礎設施，白蓮要求談共生，神子要求椅子先說清楚欲望。", "{ref} を事例に、神奈子は基盤、白蓮は共生、神子は椅子の欲望説明を要求。", "Using {ref}: Kanako asks about infrastructure, Byakuren coexistence, and Miko wants the chair to state its desire.") },
    ],
  },
];

export const incidentSeverity = {
  green: l("觀察", "観察", "Observe"),
  amber: l("需處置", "要対応", "Action needed"),
  red: l("高影響", "高影響", "High impact"),
};

export const evidenceKinds = {
  instrument: l("儀器", "計器", "Instrument"),
  record: l("紀錄", "記録", "Record"),
  trace: l("痕跡", "痕跡", "Trace"),
  media: l("傳播", "報道", "Media"),
  environment: l("環境", "環境", "Environment"),
  version: l("版本", "版", "Version"),
  material: l("材料", "物証", "Material"),
};

export function incidentById(id) {
  return incidentCases.find((record) => record.id === id);
}
