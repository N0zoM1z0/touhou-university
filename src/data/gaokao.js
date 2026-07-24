const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });
const q = (id, points, prompt, options, answer, explanation) => ({
  id,
  points,
  prompt,
  options,
  answer,
  explanation,
});

export const gaokaoSubjects = {
  language: {
    code: "GKL-01",
    name: l("幻想鄉語文", "幻想郷語文", "Gensokyo Language & Letters"),
    note: l("閱讀、史料表述、公告與新聞修辭", "読解・史料表現・告知・報道修辞", "Reading, source expression, notices, and news rhetoric"),
    questions: [
      q(
        "L01", 6,
        l("校報先刊出「北側風路已永久修復」，隔日訂正為「河童膠帶仍算臨時修復」。這則訂正最主要補足了什麼？", "学報が「北側風路は恒久修理済み」と報じ、翌日「河童テープはなお仮修理」と訂正した。訂正が最も補ったものは何か。", "The paper first reports “North windway permanently repaired,” then corrects it to “kappa tape still counts as temporary.” What does the correction chiefly restore?"),
        [l("句子的押韻", "文の韻", "The sentence's rhyme"), l("維修狀態與判定標準", "修理状態と判定基準", "The repair status and its standard"), l("風路的海拔", "風路の標高", "The windway altitude"), l("記者的飛行速度", "記者の飛行速度", "The reporter's flight speed")], 1,
        l("訂正改變的不是語氣，而是「永久／臨時」的事實判定，讓讀者能正確安排通行與風險。", "訂正は語調ではなく「恒久／仮」の事実認定を変え、通行と危険判断を可能にする。", "The changed fact is whether the repair is permanent or temporary, which affects travel and risk decisions."),
      ),
      q(
        "L02", 6,
        l("讀竹林告示：「看到第二個一模一樣的集合點時不要停，那是上週的。」最合理的閱讀方式是？", "竹林掲示「同じ集合点を二度目に見ても止まらないこと。先週のものです。」最も妥当な読み方は。", "A bamboo notice says: “Do not stop at the second identical meeting point; it is last week's.” What is the soundest reading?"),
        [l("所有集合點都不可用", "集合点はすべて使用不能", "No meeting point can be used"), l("時間錯位是路徑辨識的一部分", "時間のずれも経路識別の一部", "Temporal displacement is part of route identification"), l("告示要求原路折返", "掲示は引き返しを命じる", "The notice orders a return"), l("第二個集合點一定更近", "二つ目は必ず近い", "The second point is always nearer")], 1,
        l("告示同時提供空間與時間線索；「相同外觀」不足以證明是同一地點。", "掲示は空間と時間の手掛かりを併用し、同じ外観だけでは同一地点を証明できない。", "The notice combines spatial and temporal evidence; identical appearance does not prove identical place."),
      ),
      q(
        "L03", 6,
        l("下列哪一句最適合寫進研究現場紀錄？", "研究のフィールドノートに最も適する文はどれか。", "Which sentence is best suited to a research field record?"),
        [l("大家都知道妖精不可靠", "妖精は皆、信用できないと知っている", "Everyone knows fairies are unreliable"), l("第三次鐘響後，東側五盞燈中有兩盞熄滅", "三回目の鐘の後、東側五灯のうち二灯が消えた", "After the third bell, two of five eastern lamps went out"), l("這肯定又是異變", "これは絶対また異変だ", "This is definitely another incident"), l("聽說昨天更糟", "昨日はもっとひどかったらしい", "Yesterday was supposedly worse")], 1,
        l("它標明時間、方向、總數與變化，可被下一位觀察者核對。", "時刻・方向・総数・変化が記され、次の観察者が照合できる。", "It records time, direction, total count, and change, allowing later verification."),
      ),
      q(
        "L04", 6,
        l("同一場小型異變，哪個標題最少把推測寫成事實？", "同じ小規模異変について、推測を事実として扱わない見出しはどれか。", "For the same minor incident, which headline least presents conjecture as fact?"),
        [l("妖怪山蓄意停止全校時鐘", "妖怪の山、意図的に全学時計を停止", "Youkai Mountain Deliberately Stops Every Campus Clock"), l("全校時鐘停擺，原因調查中", "全学時計停止、原因を調査中", "Campus Clocks Stop; Cause Under Investigation"), l("河童承認時間已經結束", "河童、時間の終了を認める", "Kappa Admit Time Has Ended"), l("史上最慢的一分鐘降臨", "史上最遅の一分が到来", "History's Slowest Minute Arrives")], 1,
        l("「停擺」是已知現象，「原因調查中」明確保留未知部分。", "「停止」は確認済みで、「原因を調査中」が未知部分を明示する。", "The stoppage is observed, while “under investigation” clearly marks the cause as unknown."),
      ),
      q(
        "L05", 6,
        l("史料寫：「門在而徑亡，客循鈴聲乃至。」其中「亡」最接近下列哪個意思？", "史料「門在れど径亡び、客は鈴声に循いて至る」の「亡」に最も近い意味は。", "A source reads, “The gate remained but the path was lost; visitors followed the bell.” What does “lost” chiefly mean here?"),
        [l("死亡", "死亡", "Died"), l("逃跑", "逃走", "Fled"), l("消失、不再可循", "消失し、辿れない", "Vanished and could no longer be followed"), l("被人借走", "借り出された", "Was borrowed")], 2,
        l("上下文以門仍在、路徑不可循形成對比，因此是「消失」。", "門は残るが道を辿れないという対比から「消失」の意。", "The contrast is between a remaining gate and an untraceable path, so the sense is disappearance."),
      ),
      q(
        "L06", 6,
        l("要把錯誤校務快訊改成可追溯的訂正，哪個順序最完整？①說明影響範圍 ②保留原標題 ③標出錯誤 ④提供正確資訊與時間", "誤った学務速報を追跡可能な訂正にする最も完全な順序は。①影響範囲 ②元見出し保存 ③誤り明示 ④正しい情報と時刻", "Which sequence makes a mistaken campus alert into the most traceable correction? ① impact scope ② preserve original headline ③ identify error ④ give correct information and time"),
        [l("②③④①", "②③④①", "②③④①"), l("④②①③", "④②①③", "④②①③"), l("③①②④", "③①②④", "③①②④"), l("只需要④", "④のみ", "④ only")], 0,
        l("先保留原文，才能指出改了什麼；再給正確資訊，最後說明誰受影響。", "原文を保存して変更点を示し、正しい情報を提示した上で影響範囲を明らかにする。", "Preserve the original, identify the error, supply corrected dated information, then state the affected scope."),
      ),
    ],
  },
  mathematics: {
    code: "GKM-02",
    name: l("結界算術", "境界数学", "Boundary Mathematics"),
    note: l("比例、路網、月相週期與彈幕幾何", "比例・経路網・月相周期・弾幕幾何", "Ratios, route networks, lunar cycles, and danmaku geometry"),
    questions: [
      q("M01", 7, l("某月相週期以 29.5 日估算。59 日約等於幾個完整週期？", "月相周期を29.5日とする。59日は約何周期か。", "Using a 29.5-day lunar cycle, about how many complete cycles are 59 days?"), [l("1", "1", "1"), l("1.5", "1.5", "1.5"), l("2", "2", "2"), l("2.5", "2.5", "2.5")], 2, l("59 ÷ 29.5 = 2。", "59÷29.5＝2。", "59 ÷ 29.5 = 2.")),
      q("M02", 7, l("水輪原型每分鐘輸出由 80 單位提高到 100 單位，增幅是多少？", "水車試作の毎分出力が80から100へ増えた。増加率は。", "A turbine rises from 80 to 100 output units per minute. What is the percentage increase?"), [l("20%", "20%", "20%"), l("25%", "25%", "25%"), l("40%", "40%", "40%"), l("80%", "80%", "80%")], 1, l("增加 20，以原值 80 為基準：20 ÷ 80 = 25%。", "増加20を元の80で割り、25％。", "The increase is 20; 20 ÷ 80 = 25%.")),
      q("M03", 7, l("從博麗門到工房：步行 31 分；步行 6 分到風路站、候車 4 分、風路 12 分、再步行 5 分。選風路可節省幾分鐘？", "博麗門から工房は徒歩31分。風路は徒歩6分、待ち4分、風路12分、徒歩5分。何分短縮か。", "Gate to workshop takes 31 minutes walking. Windway: walk 6, wait 4, ride 12, walk 5. How many minutes are saved?"), [l("4", "4", "4"), l("5", "5", "5"), l("6", "6", "6"), l("8", "8", "8")], 0, l("風路總時間 6+4+12+5=27 分，節省 31−27=4 分。", "合計27分、31−27＝4分短縮。", "The windway total is 27 minutes, saving 31 − 27 = 4.")),
      q("M04", 7, l("八個方向各放 3 枚等距彈幕，不計中心，共有幾枚？", "8方向に等間隔で各3弾を置き、中心を数えない。合計は。", "Three equally spaced bullets are placed in each of eight directions, excluding the centre. How many bullets?"), [l("11", "11", "11"), l("16", "16", "16"), l("24", "24", "24"), l("27", "27", "27")], 2, l("8 個方向 × 每方向 3 枚 = 24 枚。", "8方向×3弾＝24弾。", "8 directions × 3 bullets = 24.")),
      q("M05", 7, l("藥方為每公斤 0.15 單位，受試者質量 48 公斤。總劑量是多少？", "処方は1kgあたり0.15単位、被験者48kg。総量は。", "A prescription is 0.15 units per kilogram for a 48 kg participant. What is the total dose?"), [l("6.2", "6.2", "6.2"), l("7.2", "7.2", "7.2"), l("8.0", "8.0", "8.0"), l("32", "32", "32")], 1, l("0.15 × 48 = 7.2。單位仍應寫在正式答案中。", "0.15×48＝7.2。正式答案では単位も記す。", "0.15 × 48 = 7.2; the unit should remain attached in formal work.")),
      q("M06", 7, l("結界鏡映把點 (3, −2) 變成 (−3, −2)。這是關於哪一條線的鏡射？", "点(3,−2)が(−3,−2)へ移る鏡映は、どの直線に関するものか。", "A barrier reflection maps (3, −2) to (−3, −2). Across which line is it reflected?"), [l("x 軸", "x軸", "x-axis"), l("y 軸", "y軸", "y-axis"), l("y=x", "y=x", "y=x"), l("x=−2", "x=−2", "x=−2")], 1, l("x 座標變號、y 座標不變，是關於 y 軸的鏡射。", "xのみ符号が変わり、yは不変なのでy軸対称。", "Only x changes sign, so the reflection is across the y-axis.")),
    ],
  },
  common: {
    code: "GKC-03",
    name: l("幻想鄉共同常識", "幻想郷共通常識", "Shared Gensokyo Knowledge"),
    note: l("規則、校園判斷、異變與共同生活", "規則・学内判断・異変・共同生活", "Rules, campus judgment, incidents, and shared life"),
    questions: [
      q("C01", 5, l("一場符卡式交鋒在開始前最不可缺少的是？", "スペルカード式勝負の開始前に最も欠かせないものは。", "What is most indispensable before a spell-card contest begins?"), [l("更大的火力", "より大きな火力", "Greater firepower"), l("名稱、規則與可辨認的退路", "名称・規則・識別可能な退路", "A name, rules, and a legible exit"), l("匿名觀眾", "匿名観客", "Anonymous spectators"), l("新聞號外", "新聞号外", "A newspaper extra")], 1, l("符卡規則使交鋒可辨認、可結束；單純提高火力不能建立規則。", "名称・規則・退路が勝負を識別可能かつ終了可能にする。", "These elements make the contest identifiable and endable; raw power does not create rules.")),
      q("C02", 5, l("在霧湖圖書館發現一本會自行飛向窗外的館藏，最合適的第一步是？", "霧の湖図書館で窓へ飛ぶ蔵書を見つけた。最初の対応は。", "A library book starts flying toward an open window. What is the best first step?"), [l("打開更多窗戶", "窓をさらに開ける", "Open more windows"), l("記下書號並通知館員，先關閉鄰近窗戶", "請求番号を記録し司書へ連絡、近くの窓を閉める", "Note the call number, alert staff, and close nearby windows"), l("當場施加未知封印", "未知の封印を即座に施す", "Apply an unknown seal immediately"), l("把它列為自由館藏", "自由蔵書に分類", "Declare it a free-range collection")], 1, l("先控制可逆的環境風險並留下識別資訊，再交由熟悉館藏者處理。", "可逆的な環境危険を抑え識別情報を残し、蔵書に詳しい者へ引き継ぐ。", "Control the reversible environmental risk, preserve identification, and involve the responsible staff.")),
      q("C03", 5, l("看到河童原型機冒出藍色火花，但說明紙寫著「正常為綠色」，應如何處理？", "河童試作機が青い火花を出すが説明紙は「正常は緑」。どうするか。", "A kappa prototype sparks blue while its note says normal sparks are green. What should you do?"), [l("假定是新功能並繼續", "新機能とみなし続行", "Assume a new feature and continue"), l("停止操作、保留現場並找工房值班者", "操作を止め、現場を保ち、工房当番を呼ぶ", "Stop, preserve the scene, and call workshop duty staff"), l("用河童膠帶遮住火花", "河童テープで火花を隠す", "Cover the sparks with kappa tape"), l("把說明紙改成藍色", "説明紙を青へ書き換える", "Edit the note to say blue")], 1, l("顏色偏離既定狀態是可觀察的異常；先停機比改寫標準安全。", "規定状態からの色ずれは観察可能な異常。基準を書き換える前に停止する。", "The colour differs from the documented normal state; stop before rewriting the standard.")),
      q("C04", 5, l("新聞標題已造成誤解，作者同時是訂正課教師。最合理的處理是？", "誤解を招く見出しを書いた本人が訂正授業の教員でもある。最も妥当な処理は。", "A misleading headline was written by the corrections lecturer. What is the soundest response?"), [l("教師身分自動免除訂正", "教員なので訂正不要", "Faculty status waives correction"), l("公開訂正，並把利益衝突寫進案例", "公開訂正し、利害衝突も事例に記す", "Publish a correction and record the conflict in the case"), l("只在課堂口頭承認", "授業内で口頭のみ認める", "Admit it only in class"), l("刪除整期校報", "学報一学期分を削除", "Delete the whole term's paper")], 1, l("角色身分正是需要可見訂正與利益衝突說明的原因，不是豁免。", "教員という立場こそ可視的な訂正と利害説明を必要とし、免除理由ではない。", "Her institutional role increases the need for a visible correction and conflict disclosure; it does not waive it.")),
      q("C05", 5, l("滿月夜前往永遠亭門診，校園詳圖提示本館直廊封閉。應選哪條路？", "満月夜に永遠亭外来へ。詳細図で本館直廊は閉鎖。どの経路を選ぶか。", "On a full-moon clinic visit, the main corridor is closed. Which route should be used?"), [l("本館直衝診療所", "本館から診療所へ直進", "Main House straight to Clinic"), l("本館—調劑室—診療所", "本館―調剤室―診療所", "Main House—Pharmacy—Clinic"), l("昨日的空地—校鐘", "昨日の空地―学鐘", "Yesterday's Clearing—campus bell"), l("沿第四盞燈走", "四つ目の灯を追う", "Follow the fourth lantern")], 1, l("滿月管制把門診人流經調劑室分流；第四盞燈不屬於可靠夜間指引。", "満月時は調剤室経由へ分流。四つ目の灯は信頼できる案内ではない。", "Full-moon flow diverts through Pharmacy; a fourth lantern is not reliable guidance.")),
      q("C06", 5, l("八雲紫把教室移到「出席與缺席之間」。學生首先應確認哪一項？", "八雲紫が教室を「出席と欠席の間」へ移した。学生がまず確認すべきものは。", "Yukari moves a classroom “between presence and absence.” What should a student verify first?"), [l("規章是否只定義了校內地址", "規程が学内住所のみを定義したか", "Whether policy defines only on-campus addresses"), l("魔理沙的材料箱", "魔理沙の素材箱", "Marisa's materials box"), l("食堂今日甜點", "食堂の本日デザート", "Today's dessert"), l("Aya 的標題字數", "文の見出し字数", "Aya's headline length")], 0, l("這個事件的核心是制度對位置與出席的定義邊界；先讀定義才能判斷漏洞。", "事件の核心は場所と出席の制度的定義。まず定義を確認して抜けを判断する。", "The issue turns on institutional definitions of location and attendance; inspect those boundaries first.")),
    ],
  },
  humanities: {
    code: "GKH-04",
    name: l("文科綜合", "文系総合", "Humanities Comprehensive"),
    note: l("歷史、地理、新聞與信仰公共生活", "歴史・地理・報道・信仰と公共生活", "History, geography, journalism, faith, and public life"),
    questions: [
      q("H01", 7, l("三份史料對同一異變日期不一致。最好的歷史研究方法是？", "同じ異変の日付が三史料で異なる。最善の歴史研究法は。", "Three sources disagree on an incident date. What is the best historical method?"), [l("選字最漂亮的一份", "最も美文の一つを選ぶ", "Choose the best-written source"), l("比較成文時間、作者位置與各自使用的曆法", "成立時期・作者の位置・暦法を比較", "Compare date of composition, author position, and calendars used"), l("把三個日期平均", "三日付を平均", "Average the dates"), l("刪除最晚的史料", "最も遅い史料を削除", "Delete the latest source")], 1, l("差異本身是證據；來源條件與曆法能解釋差異如何形成。", "差異自体が証拠であり、成立条件と暦法がその形成を説明する。", "The disagreement is evidence; source conditions and calendars can explain how it arose.")),
      q("H02", 7, l("神社、寺院與道觀爭用同一筆公共活動預算。哪個方案最能顯示真正的公共協商？", "神社・寺・道観が同じ公共行事予算を争う。公共協議を最も示す案は。", "Shrine, temple, and hermitage contest one public-event budget. Which plan best demonstrates public negotiation?"), [l("平均分配後禁止再談", "均等配分し再議禁止", "Split equally and forbid further debate"), l("公開各方目的、不可讓步處與共同設施成本，再記錄異議", "各者の目的・譲れない点・共通設備費を公開し、異議も記録", "Publish aims, non-negotiables, shared infrastructure costs, and dissent"), l("交給聲音最大者", "最も声の大きい者へ", "Give it to the loudest"), l("把桌子再縮小", "会議机をさらに小さく", "Make the table smaller")], 1, l("協商不是假裝沒有衝突，而是讓資源、立場與未解決異議可見。", "協議は対立を消すふりではなく、資源・立場・未解決異議を可視化する。", "Negotiation makes resources, positions, and unresolved dissent visible instead of pretending conflict vanished.")),
      q("H03", 7, l("迷途竹林地圖每天偏移，但永遠亭表門相對穩定。製圖時應如何表示？", "迷いの竹林は日々ずれるが永遠亭表門は比較的安定。地図表現は。", "The Bamboo Forest shifts daily while Eientei's gate is relatively stable. How should a map represent this?"), [l("所有線條都畫成永久道路", "全線を恒久道路として描く", "Draw every line as permanent"), l("區分固定錨點、條件路徑與更新時間", "固定基準点・条件経路・更新時刻を区別", "Distinguish fixed anchors, conditional routes, and update time"), l("只畫最漂亮的竹子", "最も美しい竹だけ描く", "Draw only the prettiest bamboo"), l("取消比例尺即可", "縮尺を外すだけ", "Simply remove scale")], 1, l("條件地理需要同時表達穩定程度與資料時效，不能把暫時路徑偽裝成固定。", "条件地理は安定度と情報時効を示し、暫定経路を固定として扱わない。", "Conditional geography must communicate stability and freshness, not disguise temporary routes as fixed."),
      ),
      q("H04", 7, l("慧音的課要求區分「發生、記錄、被允許記得」。這三者的關係最接近？", "慧音の授業は「発生・記録・記憶を許されたこと」を区別する。関係は。", "Keine distinguishes what happened, what was recorded, and what was permitted to remain remembered. Which relation is closest?"), [l("三者必然完全相同", "三者は必ず同一", "They are necessarily identical"), l("記錄與記憶都可能受權力、媒介與遺失影響", "記録と記憶は権力・媒体・喪失の影響を受ける", "Records and memory can be shaped by power, medium, and loss"), l("只有發生不重要", "発生だけが重要でない", "Only the event is unimportant"), l("被記得就等於真實", "記憶されれば真実", "Being remembered makes it true")], 1, l("歷史方法要分析從事件到記錄、再到公共記憶的選擇與損失。", "事件から記録、公共記憶へ至る選択と喪失を分析するのが歴史方法。", "Historical method studies selections and losses between event, record, and public memory.")),
      q("H05", 7, l("Aya 為搶速報先刊標題、後補查證。這個做法最大的制度風險是？", "文が速報を優先し、見出しを先に出して後で検証する。最大の制度的危険は。", "Aya publishes the headline first and verifies later. What is the largest institutional risk?"), [l("標題太短", "見出しが短すぎる", "The headline is too short"), l("錯誤在訂正前已形成行動與名譽後果", "訂正前に行動・評判への影響が生じる", "The error shapes action and reputation before correction"), l("紙張用量下降", "紙使用量が減る", "Paper use falls"), l("讀者更快", "読者が速くなる", "Readers become faster")], 1, l("事後訂正不能自動撤回已發生的疏散、指控或資源配置。", "事後訂正は既に起きた避難・非難・資源配分を自動的に戻せない。", "A later correction cannot automatically reverse evacuations, accusations, or resource decisions already made.")),
      q("H06", 7, l("博麗神社捐款箱常被搬離校園。若要研究此事，哪個問題最有分析力？", "博麗神社の賽銭箱が頻繁に学外へ移る。研究上最も分析力のある問いは。", "The Hakurei donation box repeatedly leaves campus. Which research question is most analytical?"), [l("箱子是不是任性", "箱はわがままか", "Is the box capricious?"), l("所有權、用途與所在規則在神社與大學間如何衝突", "所有・用途・所在規則が神社と大学でどう衝突するか", "How ownership, purpose, and location rules conflict between shrine and university"), l("紅色是否更快", "赤は速いか", "Is red faster?"), l("誰最會畫箭頭", "誰が矢印を最も上手に描くか", "Who draws the best arrows?")], 1, l("它把反覆事件放回兩個制度的權利主張，而不是把物件人格化後停止分析。", "反復事件を二制度の権利主張へ戻し、物の擬人化だけで分析を止めない。", "It locates the recurring event in competing institutional claims instead of ending with personification.")),
    ],
  },
  science: {
    code: "GKS-04",
    name: l("理科綜合", "理系総合", "Sciences Comprehensive"),
    note: l("魔法實驗、水力、光學、藥理與量測", "魔法実験・水力・光学・薬理・計測", "Magic experiments, hydropower, optics, pharmacology, and measurement"),
    questions: [
      q("S01", 7, l("比較兩種星光魔法材料時，哪個設計最能判斷材料造成的差異？", "二種の星光魔法素材を比較する。素材差を最も判断できる設計は。", "Which design best isolates the effect of two starlight-magic materials?"), [l("同時改變施術者、咒式與場地", "術者・呪式・場所も同時変更", "Also change caster, spell, and site"), l("保持施術者、咒式、距離與量測器相同，只替換材料", "術者・呪式・距離・計器を同じにし、素材のみ交換", "Keep caster, spell, distance, and instrument fixed; change only material"), l("只記錄成功的一次", "成功例のみ記録", "Record only a success"), l("讓材料自行選擇", "素材に選ばせる", "Let materials choose")], 1, l("控制其他變量，才能把觀察差異主要歸於材料。", "他変数を統制して初めて、差を主に素材へ帰属できる。", "Controlling other variables lets the observed difference be attributed chiefly to material.")),
      q("S02", 7, l("月光指引使用兩種波長。若短波訊號在霧中散射更強，實務上可能造成什麼？", "月光案内の短波信号が霧で強く散乱する。実務上起こりうることは。", "If the shorter-wavelength guide signal scatters more strongly in mist, what practical effect is likely?"), [l("遠距離輪廓更清楚", "遠距離輪郭が明瞭", "Clearer long-distance contours"), l("近處光暈更亮但遠方方向較難辨認", "近くの光暈は明るいが遠方方向は判別困難", "A brighter nearby glow but poorer distant direction"), l("所有光都停止", "全光が停止", "All light stops"), l("路徑長度變為零", "経路長がゼロ", "Path length becomes zero")], 1, l("較強散射會增加近場亮度與霧幕，同時削弱直達的方向資訊。", "強い散乱は近場の明るさと霧幕を増し、直進する方向情報を弱める。", "Stronger scattering brightens the near haze while weakening directional light from farther away.")),
      q("S03", 7, l("在落差不變時，水輪輸出明顯下降。最先應量測哪一項？", "落差一定なのに水車出力が低下。最初に測るべきものは。", "A turbine loses output while head remains constant. What should be measured first?"), [l("記者人數", "記者数", "Number of reporters"), l("流量與葉輪阻塞", "流量と羽根車の閉塞", "Flow rate and runner blockage"), l("月相名稱字數", "月相名の文字数", "Length of lunar phase name"), l("校服顏色", "制服の色", "Uniform colour")], 1, l("水力輸出與流量相關；落差固定時，流量下降或機械阻塞是直接候選原因。", "水力出力は流量に依存。落差一定なら流量低下や機械的閉塞が直接候補。", "Hydraulic power depends on flow; with head fixed, reduced flow or mechanical blockage are direct candidates.")),
      q("S04", 7, l("研究滿月對空間判斷的影響，哪個對照最重要？", "満月が空間判断へ与える影響を研究する。最重要の対照は。", "When studying full-moon effects on spatial judgment, which comparison is most important?"), [l("只測滿月夜一次", "満月夜を一回だけ測る", "Measure only one full-moon night"), l("同類參與者在非滿月、相近時間與相同路段的表現", "同種参加者の非満月・近い時刻・同じ経路での成績", "Comparable participants on the same route and time under a non-full moon"), l("換一座完全不同的山", "全く別の山へ変更", "Use a completely different mountain"), l("公布參與者能力", "参加者の能力を公開", "Publish participants' abilities")], 1, l("對照要盡量只改變月相，保留時間、路段與參與者條件。", "月相だけを主に変え、時刻・経路・参加条件を保つ対照が必要。", "The comparison should chiefly vary lunar phase while holding time, route, and participant conditions similar.")),
      q("S05", 7, l("魔理沙能精確重現爆炸，但材料來源只寫「森林裡撿的」。這最妨礙哪一項？", "魔理沙は爆発を精密再現するが素材出典は「森で拾った」のみ。最も妨げるものは。", "Marisa reproduces an explosion precisely, but records the material source only as “found in the forest.” What is most impaired?"), [l("爆炸亮度", "爆発の明るさ", "Explosion brightness"), l("他人取得等同材料並獨立重現", "他者が同等素材を得て独立再現すること", "Others obtaining equivalent material for independent replication"), l("她的飛行速度", "彼女の飛行速度", "Her flight speed"), l("研究標題長度", "研究題名の長さ", "Study-title length")], 1, l("操作可重複不等於材料可追溯；來源不足使獨立重現無法判定等同性。", "操作の反復性と素材の追跡可能性は別。出典不足で同等性を判定できない。", "Repeatable procedure is not traceable material; provenance is needed to establish equivalence for independent replication.")),
      q("S06", 7, l("竹林導航器在白天準確、夜間頻繁偏向第四盞燈。最有效的下一步是？", "竹林ナビが昼は正確だが夜は四つ目の灯へ偏る。最も有効な次の手順は。", "A bamboo navigator is accurate by day but drifts toward a fourth lantern at night. What is the best next step?"), [l("刪除夜間資料", "夜間データを削除", "Delete night data"), l("記錄感測器光譜、燈數與時間，做遮光及三燈對照試驗", "センサー波長・灯数・時刻を記録し、遮光と三灯対照試験", "Record sensor spectrum, lamp count, and time; run shielded and three-lamp controls"), l("把第四盞燈命名為目的地", "四灯目を目的地と命名", "Rename the fourth lantern as destination"), l("增加播報音量", "案内音量を上げる", "Increase announcement volume")], 1, l("問題與夜間光源相關；量測並設對照能區分感測器干擾與路徑本身變動。", "夜間光源との関連を測り、対照でセンサー干渉と経路変動を分ける。", "The failure correlates with night lighting; measurements and controls can separate sensor interference from route movement.")),
    ],
  },
};

export const gaokaoTracks = {
  humanities: {
    glyph: "文",
    name: l("文科組", "文系", "Humanities Track"),
    subjects: ["language", "mathematics", "common", "humanities"],
  },
  science: {
    glyph: "理",
    name: l("理科組", "理系", "Sciences Track"),
    subjects: ["language", "mathematics", "common", "science"],
  },
};

export const gaokaoMeta = {
  year: 2026,
  edition: "GKE-2026-A",
  duration: 90 * 60,
  total: 150,
};

