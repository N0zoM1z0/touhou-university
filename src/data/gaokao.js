import { advancedGaokaoQuestions } from "./gaokao-advanced.js";

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
        [l("把「永久」換成較保守的語氣，但未改變通行判斷", "「恒久」を慎重な語調へ替えたが、通行判断は変えていない", "A more cautious tone for “permanent,” without changing the access judgment"), l("維修狀態與採用的判定標準", "修理状態と、それに用いた判定基準", "The repair status and the standard used to classify it"), l("河童膠帶的材料名稱，但未說明目前是否可通行", "河童テープの素材名だけで、現在の通行可否は示していない", "The tape's material name, without stating whether passage is currently allowed"), l("報導發布的先後順序，但未修正永久與臨時的差別", "報道の発表順だけで、恒久と仮の差は直していない", "The publication sequence, without correcting the permanent–temporary distinction")], 1,
        l("訂正改變的不是語氣，而是「永久／臨時」的事實判定，讓讀者能正確安排通行與風險。", "訂正は語調ではなく「恒久／仮」の事実認定を変え、通行と危険判断を可能にする。", "The changed fact is whether the repair is permanent or temporary, which affects travel and risk decisions."),
      ),
      q(
        "L02", 6,
        l("讀竹林告示：「看到第二個一模一樣的集合點時不要停，那是上週的。」最合理的閱讀方式是？", "竹林掲示「同じ集合点を二度目に見ても止まらないこと。先週のものです。」最も妥当な読み方は。", "A bamboo notice says: “Do not stop at the second identical meeting point; it is last week's.” What is the soundest reading?"),
        [l("兩個集合點外觀相同，所以應把較晚遇到的那個視為備用點", "二つは同じ外観なので、後から現れた方を予備集合点とみなす", "Because they look identical, treat the later one as a reserve meeting point"), l("路徑辨識必須同時核對空間位置與所屬時間", "経路識別では空間的位置と属する時刻を同時に照合する", "Route identification must check both spatial position and associated time"), l("「第二個」表示走過頭，應立即沿原路返回第一個集合點", "「二度目」は通過しすぎを意味するので、最初の集合点へ引き返す", "“Second” means the traveller overshot and should return to the first point"), l("「上週的」只是告示更新日期，不影響眼前集合點的身分", "「先週の」は掲示の更新日だけを示し、目の前の地点には関係しない", "“Last week's” dates the notice and does not affect the point now in view")], 1,
        l("告示同時提供空間與時間線索；「相同外觀」不足以證明是同一地點。", "掲示は空間と時間の手掛かりを併用し、同じ外観だけでは同一地点を証明できない。", "The notice combines spatial and temporal evidence; identical appearance does not prove identical place."),
      ),
      q(
        "L03", 6,
        l("下列哪一句最適合寫進研究現場紀錄？", "研究のフィールドノートに最も適する文はどれか。", "Which sentence is best suited to a research field record?"),
        [l("東側的燈大概被妖精弄熄了，因為她們向來不可靠", "東側の灯は妖精が消したらしい。彼女らは信用できないからだ", "Fairies probably extinguished the eastern lamps, because they are usually unreliable"), l("第三次鐘響後，東側五盞燈中有兩盞熄滅", "三回目の鐘の後、東側五灯のうち二灯が消えた", "After the third bell, two of five eastern lamps went out"), l("第三次鐘響引發小型異變，並造成照明系統故障", "三回目の鐘が小規模異変を起こし、照明故障を生じさせた", "The third bell caused a minor incident and the lighting failure"), l("值班者說昨天熄滅更多盞，因此今日情況應屬正常", "当番によれば昨日はさらに多く消えたので、今日は正常範囲だ", "A duty worker says more failed yesterday, so today's condition should count as normal")], 1,
        l("它標明時間、方向、總數與變化，可被下一位觀察者核對。", "時刻・方向・総数・変化が記され、次の観察者が照合できる。", "It records time, direction, total count, and change, allowing later verification."),
      ),
      q(
        "L04", 6,
        l("同一場小型異變，哪個標題最少把推測寫成事實？", "同じ小規模異変について、推測を事実として扱わない見出しはどれか。", "For the same minor incident, which headline least presents conjecture as fact?"),
        [l("妖怪山工程導致全校時鐘停擺，校方追查責任", "妖怪の山の工事で全学時計停止、大学が責任を調査", "Mountain works stop campus clocks; university investigates responsibility"), l("全校時鐘停擺，原因仍在調查", "全学時計停止、原因はなお調査中", "Campus clocks stop; cause remains under investigation"), l("河童否認修改時間設定，校方因此排除設備問題", "河童は時刻設定の変更を否定、大学は設備問題を除外", "Kappa deny changing time settings, so the university rules out equipment failure"), l("停擺恰逢妖怪山試運轉，工程應是唯一原因", "停止は妖怪の山の試運転と一致、工事が唯一の原因か", "The stoppage coincides with a Mountain trial, making the works the sole cause")], 1,
        l("「停擺」是已知現象，「原因調查中」明確保留未知部分。", "「停止」は確認済みで、「原因を調査中」が未知部分を明示する。", "The stoppage is observed, while “under investigation” clearly marks the cause as unknown."),
      ),
      q(
        "L05", 6,
        l("史料寫：「門在而徑亡，客循鈴聲乃至。」其中「亡」最接近下列哪個意思？", "史料「門在れど径亡び、客は鈴声に循いて至る」の「亡」に最も近い意味は。", "A source reads, “The gate remained but the path was lost; visitors followed the bell.” What does “lost” chiefly mean here?"),
        [l("道路遭人破壞，因此旅客只能改聽鈴聲前進", "道が人為的に壊され、客は鈴を頼りに進んだ", "The road was destroyed, forcing visitors to navigate by the bell"), l("道路自行逃離原處，但仍可沿留下的痕跡追趕", "道が元の場所から逃げたが、痕跡を追うことはできた", "The road fled its former place but could still be followed by its traces"), l("道路消失，已經無法繼續循路前進", "道が消失し、もはやその経路を辿れなかった", "The road vanished and could no longer be followed"), l("道路暫借給別處使用，旅客需等待歸還後再通行", "道は別所へ貸し出され、返却まで通行を待つ必要があった", "The road was lent elsewhere, requiring visitors to wait for its return")], 2,
        l("上下文以門仍在、路徑不可循形成對比，因此是「消失」。", "門は残るが道を辿れないという対比から「消失」の意。", "The contrast is between a remaining gate and an untraceable path, so the sense is disappearance."),
      ),
      q(
        "L06", 6,
        l("要把錯誤校務快訊改成可追溯的訂正，哪個順序最完整？①說明影響範圍 ②保留原標題 ③標出錯誤 ④提供正確資訊與時間", "誤った学務速報を追跡可能な訂正にする最も完全な順序は。①影響範囲 ②元見出し保存 ③誤り明示 ④正しい情報と時刻", "Which sequence makes a mistaken campus alert into the most traceable correction? ① impact scope ② preserve original headline ③ identify error ④ give correct information and time"),
        [l("②③④①：先留存原文，再標錯、給出帶時間的正訊息與影響範圍", "②③④①：原文保存、誤り明示、時刻付き訂正、影響範囲の順", "②③④①: preserve, identify, give the timed correction, then state scope"), l("④②①③：先公布新訊息，再補存原文，最後才說哪裡錯", "④②①③：新情報を先に出し、原文保存後、最後に誤りを示す", "④②①③: publish the new information first and identify the error last"), l("③①②④：先標錯與影響，再回頭保存原文，最後才訂正", "③①②④：誤りと影響を先に示し、後から原文保存と訂正を行う", "③①②④: name the error and scope before preserving and correcting"), l("④①③②：立即給新訊息與影響，待事件結束後才保存原文", "④①③②：新情報と影響を先に示し、終結後に原文を保存する", "④①③②: give the update and scope now, preserving the original only afterward")], 0,
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
      q("C01", 5, l("一場符卡式交鋒在開始前最不可缺少的是？", "スペルカード式勝負の開始前に最も欠かせないものは。", "What is most indispensable before a spell-card contest begins?"), [l("公布名稱與回合數，勝負結束方式交由火力較高者決定", "名称と回数を公表し、終了方法は火力の高い側に委ねる", "Publish the name and round count, leaving termination to the side with greater firepower"), l("讓雙方確認名稱、規則，以及各自能辨認的退路", "双方が名称・規則・各自から見える退路を確認する", "Have both sides confirm the name, rules, and an exit each can identify"), l("由裁判保管完整規則，參與者只需知道開始訊號", "審判が完全な規則を持ち、参加者には開始信号だけ知らせる", "Let the referee hold the full rules while participants know only the start signal"), l("先指定名稱與退路，第一回合後再依彈幕補寫規則", "名称と退路だけ先に決め、初回後に弾幕へ合わせて規則を足す", "Set the name and exit first, then write the rules around the opening round")], 1, l("符卡規則使交鋒可辨認、可結束；單純提高火力不能建立規則。", "名称・規則・退路が勝負を識別可能かつ終了可能にする。", "These elements make the contest identifiable and endable; raw power does not create rules.")),
      q("C02", 5, l("在霧湖圖書館發現一本會自行飛向窗外的館藏，最合適的第一步是？", "霧の湖図書館で窓へ飛ぶ蔵書を見つけた。最初の対応は。", "A library book starts flying toward an open window. What is the best first step?"), [l("先關窗阻止飛失，事件結束後再憑封面回想是哪本書", "まず窓を閉め、事後に表紙の記憶から本を特定する", "Close the window first and identify the book later from memory of its cover"), l("記下書號、通知館員，並先關閉鄰近窗戶", "請求番号を記録し司書へ連絡、近くの窓を閉める", "Note the call number, alert staff, and close nearby windows"), l("使用最近的館藏封印壓住書本，再詢問該封印是否相容", "最寄りの蔵書封印で本を押さえ、後から適合性を確認する", "Restrain it with the nearest collection seal, then ask whether that seal was compatible"), l("把書移進空展示櫃單獨觀察，暫不驚動館員或其他讀者", "空の展示箱へ移して単独観察し、司書や利用者にはまだ知らせない", "Move it into an empty display case for observation without yet alerting staff or readers")], 1, l("先控制可逆的環境風險並留下識別資訊，再交由熟悉館藏者處理。", "可逆的な環境危険を抑え識別情報を残し、蔵書に詳しい者へ引き継ぐ。", "Control the reversible environmental risk, preserve identification, and involve the responsible staff.")),
      q("C03", 5, l("看到河童原型機冒出藍色火花，但說明紙寫著「正常為綠色」，應如何處理？", "河童試作機が青い火花を出すが説明紙は「正常は緑」。どうするか。", "A kappa prototype sparks blue while its note says normal sparks are green. What should you do?"), [l("記錄藍色火花後繼續低功率運轉，以確認是否只是新功能", "青い火花を記録し、低出力で続けて新機能か確認する", "Record the blue sparks and continue at low power to see whether they are a new feature"), l("停止操作、保留現場，並通知工房值班者", "操作を止め、現場を保ち、工房当番へ連絡する", "Stop operation, preserve the scene, and notify workshop duty staff"), l("立即拆除電源與外殼，先消除危險再補拍原始狀態", "直ちに電源と外装を外し、危険を除いてから元の状態を撮る", "Remove power and casing immediately, documenting the original state afterward"), l("隔離機器並把正常火花改記為藍色，等待下一班覆核", "機器を隔離し、正常火花を青へ改記して次の当番を待つ", "Quarantine the machine and revise the normal colour to blue pending the next shift")], 1, l("顏色偏離既定狀態是可觀察的異常；先停機比改寫標準安全。", "規定状態からの色ずれは観察可能な異常。基準を書き換える前に停止する。", "The colour differs from the documented normal state; stop before rewriting the standard.")),
      q("C04", 5, l("新聞標題已造成誤解，作者同時是訂正課教師。最合理的處理是？", "誤解を招く見出しを書いた本人が訂正授業の教員でもある。最も妥当な処理は。", "A misleading headline was written by the corrections lecturer. What is the soundest response?"), [l("公開更正事實，但不提作者身分，以免把訂正變成私人爭議", "事実は訂正するが、個人問題化を避けるため執筆者の立場は伏せる", "Correct the facts publicly but omit the author's role to avoid personalizing the issue"), l("公開訂正，並把作者的利益衝突寫進案例紀錄", "公開訂正し、執筆者の利害関係も事例記録へ残す", "Publish a correction and record the author's conflict of interest in the case"), l("先讓校內委員會審查，再以無痕更新取代原標題", "学内委員会の審査後、元見出しを痕跡なく更新する", "Wait for internal review, then silently replace the original headline"), l("保留原標題並公開作者身分，讓讀者自行判斷是否可信", "元見出しと執筆者の立場を示し、信頼性は読者判断に任せる", "Retain the headline and disclose the author's role, leaving credibility to readers")], 1, l("角色身分正是需要可見訂正與利益衝突說明的原因，不是豁免。", "教員という立場こそ可視的な訂正と利害説明を必要とし、免除理由ではない。", "Her institutional role increases the need for a visible correction and conflict disclosure; it does not waive it.")),
      q("C05", 5, l("滿月夜前往永遠亭門診，校園詳圖提示本館直廊封閉。應選哪條路？", "満月夜に永遠亭外来へ。詳細図で本館直廊は閉鎖。どの経路を選ぶか。", "On a full-moon clinic visit, the main corridor is closed. Which route should be used?"), [l("沿本館直廊到診療所，因為目的地仍在同一建築群", "本館直廊から診療所へ。同じ建物群なら通れると判断する", "Take the Main House corridor because the clinic remains in the same complex"), l("依滿月分流，由本館經調劑室前往診療所", "満月時の分流に従い、本館から調剤室経由で診療所へ", "Follow full-moon diversion from Main House through Pharmacy to the Clinic"), l("先到昨日的空地等校鐘，再由聲音反推診療所方向", "昨日の空地で学鐘を待ち、音から診療所の方向を推定する", "Wait at Yesterday's Clearing and infer the clinic direction from the campus bell"), l("沿第四盞燈繞過直廊，因為夜間燈號比詳圖更新更快", "四つ目の灯で直廊を迂回。夜間の灯は詳細図より新しいとみなす", "Bypass the corridor via the fourth lantern, treating night signals as fresher than the map")], 1, l("滿月管制把門診人流經調劑室分流；第四盞燈不屬於可靠夜間指引。", "満月時は調剤室経由へ分流。四つ目の灯は信頼できる案内ではない。", "Full-moon flow diverts through Pharmacy; a fourth lantern is not reliable guidance.")),
      q("C06", 5, l("八雲紫把教室移到「出席與缺席之間」。學生首先應確認哪一項？", "八雲紫が教室を「出席と欠席の間」へ移した。学生がまず確認すべきものは。", "Yukari moves a classroom “between presence and absence.” What should a student verify first?"), [l("規章中的上課位置與出席定義是否涵蓋這種地址", "規程の教室所在地と出席定義がこの住所を含むか", "Whether policy definitions of class location and attendance cover such an address"), l("教師口頭指定哪一側為教室，以該側暫代正式規章", "教員が口頭で教室側を指定し、それを規程の代わりにする", "Which side the teacher names as the room, using that declaration in place of policy"), l("校園路由器目前把訊號判定在校內還是校外", "学内ルーターが信号を学内・学外のどちらと判定するか", "Whether the campus router currently classifies the signal as on or off campus"), l("課後點名是否把學生記為缺席，再依結果決定位置", "授業後の点呼結果を見てから、その結果で教室位置を決める", "Whether the roll marks the student absent, then use that result to define the location")], 0, l("這個事件的核心是制度對位置與出席的定義邊界；先讀定義才能判斷漏洞。", "事件の核心は場所と出席の制度的定義。まず定義を確認して抜けを判断する。", "The issue turns on institutional definitions of location and attendance; inspect those boundaries first.")),
    ],
  },
  humanities: {
    code: "GKH-04",
    name: l("文科綜合", "文系総合", "Humanities Comprehensive"),
    note: l("歷史、地理、新聞與信仰公共生活", "歴史・地理・報道・信仰と公共生活", "History, geography, journalism, faith, and public life"),
    questions: [
      q("H01", 7, l("三份史料對同一異變日期不一致。最好的歷史研究方法是？", "同じ異変の日付が三史料で異なる。最善の歴史研究法は。", "Three sources disagree on an incident date. What is the best historical method?"), [l("先統一成同一曆法，再把三個日期平均為事件日期", "同じ暦へ換算し、三日付の平均を事件日とする", "Convert all dates to one calendar, then average them into an incident date"), l("比較成文時間、作者位置與各自使用的曆法", "成立時期・作者の位置・それぞれの暦法を比較する", "Compare composition date, author position, and the calendar each source used"), l("優先採用最早成文者，因為較少受到後世記憶影響", "最初に成立した史料を優先し、後世の記憶影響を避ける", "Prefer the earliest composition because it is less exposed to later memory"), l("暫時排除最晚史料，待其日期與前兩份一致再納入", "最も遅い史料を除外し、前二史料と日付が合えば戻す", "Exclude the latest source until its date can be made to agree with the other two")], 1, l("差異本身是證據；來源條件與曆法能解釋差異如何形成。", "差異自体が証拠であり、成立条件と暦法がその形成を説明する。", "The disagreement is evidence; source conditions and calendars can explain how it arose.")),
      q("H02", 7, l("神社、寺院與道觀爭用同一筆公共活動預算。哪個方案最能顯示真正的公共協商？", "神社・寺・道観が同じ公共行事予算を争う。公共協議を最も示す案は。", "Shrine, temple, and hermitage contest one public-event budget. Which plan best demonstrates public negotiation?"), [l("先平均分配，要求三方把不同目的調整到相同額度內", "先に均等配分し、三者の異なる目的を同額へ調整させる", "Split the budget equally first and require each party to fit its aims to that share"), l("公開各方目的、不可讓步處、共同設施成本與仍存異議", "各者の目的・譲れない点・共通設備費・残る異議を公開する", "Publish each party's aims, non-negotiables, shared costs, and remaining dissent"), l("依預估參加人數加權分配，最後公告只列通過的方案", "予想参加者数で配分し、最終告知には採択案だけを載せる", "Weight funding by forecast attendance and publish only the adopted plan"), l("三方各提完整方案後抽籤，落選者不得再要求共同設施", "三者の完成案から抽選し、落選側は共通設備を求めない", "Draw lots among complete proposals and deny shared facilities to the losing parties")], 1, l("協商不是假裝沒有衝突，而是讓資源、立場與未解決異議可見。", "協議は対立を消すふりではなく、資源・立場・未解決異議を可視化する。", "Negotiation makes resources, positions, and unresolved dissent visible instead of pretending conflict vanished.")),
      q("H03", 7, l("迷途竹林地圖每天偏移，但永遠亭表門相對穩定。製圖時應如何表示？", "迷いの竹林は日々ずれるが永遠亭表門は比較的安定。地図表現は。", "The Bamboo Forest shifts daily while Eientei's gate is relatively stable. How should a map represent this?"), [l("把最近測得的路徑畫成實線，表門則只作方向參考", "最新測量の道を実線にし、表門は方向の参考だけにする", "Draw the latest surveyed paths as solid lines and use the gate only for orientation"), l("區分固定錨點、條件路徑，並標示每層的更新時間", "固定基準点・条件経路を分け、各層の更新時刻を示す", "Distinguish fixed anchors from conditional routes and timestamp each layer"), l("只畫每日路徑並每天重印，以免固定錨點造成過度信任", "日々の経路だけを毎日印刷し、固定基準点への過信を避ける", "Print only each day's routes so fixed anchors do not create false confidence"), l("保留比例尺與表門，把竹林的不確定性統一寫在圖下注記", "縮尺と表門を残し、竹林の不確実性は地図下の注記へまとめる", "Keep scale and gate, placing all route uncertainty in a note below the map")], 1, l("條件地理需要同時表達穩定程度與資料時效，不能把暫時路徑偽裝成固定。", "条件地理は安定度と情報時効を示し、暫定経路を固定として扱わない。", "Conditional geography must communicate stability and freshness, not disguise temporary routes as fixed."),
      ),
      q("H04", 7, l("慧音的課要求區分「發生、記錄、被允許記得」。這三者的關係最接近？", "慧音の授業は「発生・記録・記憶を許されたこと」を区別する。関係は。", "Keine distinguishes what happened, what was recorded, and what was permitted to remain remembered. Which relation is closest?"), [l("三者若有兩項一致，就可用多數決還原唯一發生過的版本", "三者の二項が一致すれば、多数決で唯一の出来事を復元できる", "If two agree, a majority can reconstruct the single event that occurred"), l("記錄與記憶都可能受到權力、媒介選擇與遺失影響", "記録と記憶は権力・媒体の選択・喪失の影響を受けうる", "Records and memory can both be shaped by power, media selection, and loss"), l("最早留下的記錄最接近發生本身，沉默可視為事件不存在", "最古の記録が出来事に最も近く、沈黙は不在を示す", "The earliest surviving record is closest to the event, and silence indicates absence"), l("公共記憶經長期修正後比當時記錄可靠，可反過來裁定事件", "長期に修正された公共記憶は当時記録より信頼でき、出来事を裁定できる", "Long-corrected public memory is more reliable than contemporary records and can adjudicate the event")], 1, l("歷史方法要分析從事件到記錄、再到公共記憶的選擇與損失。", "事件から記録、公共記憶へ至る選択と喪失を分析するのが歴史方法。", "Historical method studies selections and losses between event, record, and public memory.")),
      q("H05", 7, l("Aya 為搶速報先刊標題、後補查證。這個做法最大的制度風險是？", "文が速報を優先し、見出しを先に出して後で検証する。最大の制度的危険は。", "Aya publishes the headline first and verifies later. What is the largest institutional risk?"), [l("讀者可能把後來改寫的標題誤認為另一場新事件", "読者が後の改題を別の新事件と誤認する可能性", "Readers may mistake the revised headline for a separate new incident"), l("校內單位可能依錯誤行動，訂正無法自動撤回其後果", "学内組織が誤報で行動し、訂正しても結果は自動で戻らない", "Campus units may act on the error before correction can reverse its effects"), l("其他報紙可能轉載原標題，卻不保留其最初版面格式", "他紙が元見出しを転載し、初版の紙面形式を保存しない可能性", "Other papers may repeat the headline without preserving its original layout"), l("作者之後必須用課堂時間說明訂正，減少正常授課時數", "執筆者が授業で訂正を説明し、通常の授業時間が減る可能性", "The author may spend class time explaining the correction, reducing regular instruction")], 1, l("事後訂正不能自動撤回已發生的疏散、指控或資源配置。", "事後訂正は既に起きた避難・非難・資源配分を自動的に戻せない。", "A later correction cannot automatically reverse evacuations, accusations, or resource decisions already made.")),
      q("H06", 7, l("博麗神社捐款箱常被搬離校園。若要研究此事，哪個問題最有分析力？", "博麗神社の賽銭箱が頻繁に学外へ移る。研究上最も分析力のある問いは。", "The Hakurei donation box repeatedly leaves campus. Which research question is most analytical?"), [l("移動是否由箱子自行開始，還是由最後接觸者搬動", "移動は箱自身が始めるか、最後の接触者が運ぶのか", "Whether the box initiates movement or is carried by the last person touching it"), l("神社與大學的所有權、用途和所在規則如何互相衝突", "神社と大学の所有・用途・所在規則がどう衝突するか", "How shrine and university rules of ownership, purpose, and location conflict"), l("紅色容器是否比其他顏色容器更常離開原來位置", "赤い容器は他色より元の場所を離れやすいか", "Whether red containers leave their assigned locations more often than others"), l("最後持有捐款箱的人是否應被視為當時的合法所有者", "最後に賽銭箱を持った者を、その時点の所有者とみなせるか", "Whether the last person holding the box should count as its lawful owner")], 1, l("它把反覆事件放回兩個制度的權利主張，而不是把物件人格化後停止分析。", "反復事件を二制度の権利主張へ戻し、物の擬人化だけで分析を止めない。", "It locates the recurring event in competing institutional claims instead of ending with personification.")),
    ],
  },
  science: {
    code: "GKS-04",
    name: l("理科綜合", "理系総合", "Sciences Comprehensive"),
    note: l("魔法實驗、水力、光學、藥理與量測", "魔法実験・水力・光学・薬理・計測", "Magic experiments, hydropower, optics, pharmacology, and measurement"),
    questions: [
      q("S01", 7, l("比較兩種星光魔法材料時，哪個設計最能判斷材料造成的差異？", "二種の星光魔法素材を比較する。素材差を最も判断できる設計は。", "Which design best isolates the effect of two starlight-magic materials?"), [l("保持施術者與場地相同，讓每種材料使用最適合自己的咒式", "術者と場所を揃え、各素材に最適な呪式を使う", "Keep caster and site fixed, but use the spell best suited to each material"), l("保持施術者、咒式、距離與量測器相同，只替換材料", "術者・呪式・距離・計器を同じにし、素材のみ交換する", "Keep caster, spell, distance, and instrument fixed; change only material"), l("保持咒式與量測器相同，在兩個最常使用各材料的場地測試", "呪式と計器を揃え、各素材が普段使われる別々の場所で試す", "Keep spell and instrument fixed, testing each material at its usual site"), l("交替測試兩種材料，但允許施術者依外觀調整距離與劑量", "二素材を交互に試すが、外観に応じて距離と量を調整できる", "Alternate materials, but let the caster adjust distance and dose after seeing each one")], 1, l("控制其他變量，才能把觀察差異主要歸於材料。", "他変数を統制して初めて、差を主に素材へ帰属できる。", "Controlling other variables lets the observed difference be attributed chiefly to material.")),
      q("S02", 7, l("月光指引使用兩種波長。若短波訊號在霧中散射更強，實務上可能造成什麼？", "月光案内の短波信号が霧で強く散乱する。実務上起こりうることは。", "If the shorter-wavelength guide signal scatters more strongly in mist, what practical effect is likely?"), [l("近處與遠處都更亮，因此方向判讀也會同步改善", "近距離も遠距離も明るくなり、方向判別も同時に改善する", "Both near and far views brighten, so directional judgment improves throughout"), l("近處光暈更亮，但遠方直達訊號與方向更難辨認", "近くの光暈は明るいが、遠方の直達信号と方向は判別しにくい", "The nearby glow brightens while distant direct signal and direction become harder to resolve"), l("近處亮度降低，但散射把更多訊號集中到遠方輪廓", "近くは暗くなるが、散乱が信号を遠方輪郭へ集中させる", "Nearby brightness falls while scattering concentrates more signal into distant outlines"), l("霧只改變觀察到的顏色，不會影響訊號到達方向的資訊", "霧は見える色だけを変え、信号の到来方向情報には影響しない", "Mist changes only perceived colour and leaves arrival-direction information unchanged")], 1, l("較強散射會增加近場亮度與霧幕，同時削弱直達的方向資訊。", "強い散乱は近場の明るさと霧幕を増し、直進する方向情報を弱める。", "Stronger scattering brightens the near haze while weakening directional light from farther away.")),
      q("S03", 7, l("在落差不變時，水輪輸出明顯下降。最先應量測哪一項？", "落差一定なのに水車出力が低下。最初に測るべきものは。", "A turbine loses output while head remains constant. What should be measured first?"), [l("再測一次落差，若仍相同就把下降歸因於量測誤差", "落差を再測し、同じなら出力低下を測定誤差とする", "Remeasure head and, if unchanged, attribute the loss to measurement error"), l("量測實際流量，並檢查葉輪是否有阻塞", "実流量を測り、羽根車に閉塞がないか確認する", "Measure actual flow and inspect the runner for blockage"), l("比較輸出表與月相紀錄，先檢查兩者是否同時下降", "出力表と月相記録を比べ、両者が同時に低下したか調べる", "Compare output with lunar records to see whether both declined together"), l("提高輸入流量直到輸出恢復，再用所需增量判定效率", "出力が戻るまで流量を上げ、必要な増分から効率を判定する", "Increase input flow until output recovers, then infer efficiency from the added flow")], 1, l("水力輸出與流量相關；落差固定時，流量下降或機械阻塞是直接候選原因。", "水力出力は流量に依存。落差一定なら流量低下や機械的閉塞が直接候補。", "Hydraulic power depends on flow; with head fixed, reduced flow or mechanical blockage are direct candidates.")),
      q("S04", 7, l("研究滿月對空間判斷的影響，哪個對照最重要？", "満月が空間判断へ与える影響を研究する。最重要の対照は。", "When studying full-moon effects on spatial judgment, which comparison is most important?"), [l("同一批參與者在滿月夜改走較簡單路段，以降低迷路風險", "同じ参加者が満月夜により簡単な経路を歩き、迷う危険を下げる", "Use the same participants on an easier full-moon route to reduce navigation risk"), l("同類參與者在非滿月、相近時間走相同路段的表現", "同種参加者が非満月の近い時刻に同じ経路を歩いた成績", "Comparable participants on the same route at a similar time under a non-full moon"), l("不同參與者在非滿月白天走另一條路，以取得清楚基準", "別の参加者が非満月の昼に別経路を歩き、明確な基準を作る", "Use different participants on another route in non-full-moon daylight for a clear baseline"), l("同一批參與者在滿月夜重走多次，以估計平均熟練效果", "同じ参加者が満月夜に繰り返し歩き、平均習熟効果を求める", "Repeat the full-moon route with the same participants to estimate average practice effects")], 1, l("對照要盡量只改變月相，保留時間、路段與參與者條件。", "月相だけを主に変え、時刻・経路・参加条件を保つ対照が必要。", "The comparison should chiefly vary lunar phase while holding time, route, and participant conditions similar.")),
      q("S05", 7, l("魔理沙能精確重現爆炸，但材料來源只寫「森林裡撿的」。這最妨礙哪一項？", "魔理沙は爆発を精密再現するが素材出典は「森で拾った」のみ。最も妨げるものは。", "Marisa reproduces an explosion precisely, but records the material source only as “found in the forest.” What is most impaired?"), [l("判斷每次爆炸是否使用了完全相同的施術動作", "各爆発で同じ術式動作が使われたか判断すること", "Determining whether exactly the same casting motions were used each time"), l("讓他人取得等同材料，並進行可判定的獨立重現", "他者が同等素材を得て、判定可能な独立再現を行うこと", "Enabling others to obtain equivalent material for an interpretable independent replication"), l("比較爆炸當下亮度與飛行速度之間是否具有相關性", "爆発時の明るさと飛行速度の相関を比較すること", "Comparing whether blast brightness correlates with flight speed"), l("確認森林中的材料是否比圖書館樣本更容易成功", "森の素材が図書館試料より成功しやすいか確認すること", "Establishing whether forest material succeeds more often than library samples")], 1, l("操作可重複不等於材料可追溯；來源不足使獨立重現無法判定等同性。", "操作の反復性と素材の追跡可能性は別。出典不足で同等性を判定できない。", "Repeatable procedure is not traceable material; provenance is needed to establish equivalence for independent replication.")),
      q("S06", 7, l("竹林導航器在白天準確、夜間頻繁偏向第四盞燈。最有效的下一步是？", "竹林ナビが昼は正確だが夜は四つ目の灯へ偏る。最も有効な次の手順は。", "A bamboo navigator is accurate by day but drifts toward a fourth lantern at night. What is the best next step?"), [l("保留夜間資料，將第四盞燈正式標為夜間替代目的地", "夜間データを残し、四つ目の灯を夜間の代替目的地と定める", "Retain the night data and designate the fourth lantern as the official night destination"), l("記錄感測器光譜、燈數與時間，做遮光及三燈對照", "センサー波長・灯数・時刻を記録し、遮光と三灯の対照を行う", "Record sensor spectrum, lamp count, and time; run shielded and three-lamp controls"), l("比較白天與夜間平均誤差，若夜間較大就判定竹林移動", "昼夜の平均誤差を比べ、夜が大きければ竹林移動と判定する", "Compare mean day and night error and infer forest movement if night error is larger"), l("提高語音播報音量並重測，以檢查導航器是否忽略指令", "音声案内を大きくして再試験し、指示を無視したか調べる", "Increase announcement volume and retest whether the navigator ignored instructions")], 1, l("問題與夜間光源相關；量測並設對照能區分感測器干擾與路徑本身變動。", "夜間光源との関連を測り、対照でセンサー干渉と経路変動を分ける。", "The failure correlates with night lighting; measurements and controls can separate sensor interference from route movement.")),
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
  edition: "GKE-2026",
  revision: 2,
  total: 150,
};

export const gaokaoDifficulties = {
  normal: {
    label: "NORMAL",
    glyph: "N",
    duration: 90 * 60,
    description: l(
      "基礎卷 · 24 題。讀懂告示、算清路程，別跟第四盞燈走。",
      "基礎・24問。掲示を読み、経路を計算し、第四の灯について行かないこと。",
      "Foundation · 24 questions. Read the notices, calculate the route, and do not follow the fourth lantern.",
    ),
  },
  hard: {
    label: "HARD",
    glyph: "H",
    duration: 105 * 60,
    description: l(
      "材料卷 · 12 題。每題都要合併兩項以上的記錄或條件。",
      "資料型・12問。各問で二つ以上の記録・条件を統合する。",
      "Source paper · 12 questions. Every item combines at least two records or conditions.",
    ),
  },
  lunatic: {
    label: "LUNATIC",
    glyph: "L",
    duration: 120 * 60,
    description: l(
      "交叉判讀 · 12 題。月相、版本、路網與互相打架的證詞會同時出現。",
      "交差判読・12問。月相、版、経路網、対立証言が同時に現れる。",
      "Cross-source reasoning · 12 questions. Lunar phases, versions, route graphs, and conflicting testimony arrive together.",
    ),
  },
  extra: {
    label: "EXTRA",
    glyph: "EX",
    duration: 135 * 60,
    description: l(
      "事件卷 · 12 題。追查資料生成、故障時間線與可識別的因果設計。",
      "事件型・12問。資料生成、故障時系列、識別可能な因果設計を追う。",
      "Incident paper · 12 questions. Trace data generation, fault timelines, and identifiable causal designs.",
    ),
  },
};

function rotateAnswer(question, target) {
  const shift = (target - question.answer + question.options.length) % question.options.length;
  const options = Array(question.options.length);
  question.options.forEach((option, index) => {
    options[(index + shift) % question.options.length] = option;
  });
  return { ...question, options, answer: target };
}

const answerSchedules = {
  humanities: {
    normal: [2, 0, 3, 1, 0, 2, 1, 3, 2, 0, 3, 1, 3, 1, 0, 2, 1, 3, 2, 0, 0, 2, 1, 3],
    hard: [2, 0, 3, 1, 3, 1, 0, 2, 1, 3, 2, 0],
    lunatic: [1, 3, 0, 2, 0, 2, 3, 1, 2, 0, 3, 1],
    extra: [3, 1, 0, 2, 1, 3, 2, 0, 2, 0, 3, 1],
  },
  science: {
    normal: [1, 3, 0, 2, 3, 1, 2, 0, 1, 3, 0, 2, 0, 2, 3, 1, 2, 0, 1, 3, 3, 1, 2, 0],
    hard: [1, 3, 0, 2, 0, 2, 3, 1, 2, 0, 1, 3],
    lunatic: [3, 0, 2, 1, 2, 1, 0, 3, 1, 3, 0, 2],
    extra: [0, 2, 3, 1, 3, 0, 1, 2, 1, 3, 0, 2],
  },
};

export function gaokaoQuestionsFor(trackId, difficultyId = "normal") {
  const track = gaokaoTracks[trackId];
  const difficulty = gaokaoDifficulties[difficultyId] ? difficultyId : "normal";
  if (!track) return [];
  const questions = track.subjects.flatMap((subjectId) => {
    const source =
      difficulty === "normal"
        ? gaokaoSubjects[subjectId].questions
        : advancedGaokaoQuestions[subjectId].filter((question) => question.difficulty === difficulty);
    return source.map((question) => ({ ...question, subjectId }));
  });
  const schedule = answerSchedules[trackId]?.[difficulty];
  return questions.map((question, index) => rotateAnswer(question, schedule?.[index] ?? index % 4));
}
