const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });
const evidence = (id, label, detail) => ({ id, label: l(...label), detail: l(...detail) });
const hypothesis = (id, title, claim, isIntended = false) => ({
  id,
  title: l(...title),
  claim: l(...claim),
  isIntended,
});
const test = (id, title, method, result, supports = []) => ({
  id,
  title: l(...title),
  method: l(...method),
  result: l(...result),
  supports,
});
const use = (id, title, note) => ({ id, title: l(...title), note: l(...note) });

export const appraisalDestinations = {
  library: {
    glyph: "書",
    name: l("霧湖圖書館外界物櫃", "霧の湖図書館・外界物庫", "Misty Lake Outside-Object Cabinet"),
    note: l("保留來源、異議與操作限制，開放查閱。", "来歴・異議・操作制限を残して閲覧公開。", "Retain provenance, dissent, and operating limits for reference access."),
  },
  kourindou: {
    glyph: "香",
    name: l("香霖堂寄售架", "香霖堂委託棚", "Kourindou Consignment Shelf"),
    note: l("可以標價，但霖之助仍有權寫上「暫不出售」。", "値札は付けられるが、霖之助は「当面非売品」と書ける。", "It may receive a price, though Rinnosuke may still mark it “not for sale yet.”"),
  },
  kappa: {
    glyph: "河",
    name: l("河童工房可逆改裝台", "河童工房・可逆改造台", "Kappa Reversible Retrofit Bench"),
    note: l("只批准可拆回原狀的轉接件；膠帶不自動算可逆。", "元へ戻せる接続部品のみ承認。テープは自動的に可逆とは見なさない。", "Only removable adapters are approved; tape is not automatically reversible."),
  },
  museum: {
    glyph: "稗",
    name: l("稗田史學館生活史櫃", "稗田史学館・生活史庫", "Hieda Everyday-History Cabinet"),
    note: l("不必恢復功能，也能保存一段外界生活。", "機能を戻さなくても、外界の暮らしは保存できる。", "An Outside life may be preserved without restoring operation."),
  },
  sealed: {
    glyph: "封",
    name: l("暫緩操作封存袋", "操作保留封印袋", "Deferred-Operation Seal Bag"),
    note: l("涉及私密內容、未知能源或開始表達拒絕時使用。", "私的内容・未知の動力・拒否反応がある場合に使用。", "Used for private contents, unknown power, or an object beginning to refuse."),
  },
};

export const appraisalAgencyLevels = {
  none: l("未見自主反應", "自律反応なし", "No autonomous response observed"),
  watch: l("需要繼續觀察", "継続観察が必要", "Continued observation required"),
  stirring: l("疑似開始形成意志", "意思形成の兆候", "Possible will formation"),
  objected: l("已明確反對處置", "処置へ明確に異議", "Explicitly objected to disposition"),
};

export const appraisalReviewers = {
  rinnosuke: {
    name: l("森近霖之助", "森近霖之助", "Rinnosuke Morichika"),
    role: l("名稱與用途鑑別", "名称・用途鑑別", "Name and purpose examiner"),
  },
  ran: {
    name: l("八雲藍", "八雲藍", "Ran Yakumo"),
    role: l("跨界來源與版本編目", "越境来歴・版目録", "Boundary provenance and version cataloguing"),
  },
  nitori: {
    name: l("河城荷取", "河城にとり", "Nitori Kawashiro"),
    role: l("機構與可逆改裝", "機構・可逆改造", "Mechanism and reversible retrofit"),
  },
  kogasa: {
    name: l("多多良小傘", "多々良小傘", "Kogasa Tatara"),
    role: l("遺忘工具當事物顧問", "忘れられた道具の当事物顧問", "Forgotten-tool lived-experience adviser"),
  },
};

export const appraisalObjects = [
  {
    id: "thermal-printer",
    code: "KML-O-077-18",
    glyph: "票",
    name: l("無墨的小型列印機", "インクのない小型印刷機", "Small printer with no ink"),
    workingTitle: l("會吐出空白籤紙的盒子", "白紙のおみくじを吐く箱", "Box that issues blank fortune slips"),
    arrival: l("妖怪獸道旁，與一卷褪色黏紙一同拾得", "妖怪獣道脇、色褪せた粘着紙一巻と共に採取", "Recovered beside the Beast Path with a faded adhesive-paper roll"),
    condition: l("缺電源，切刀鈍化，機身貼有半張外界物流標籤", "電源欠品、刃は鈍化、外界物流ラベル半片あり", "Power supply missing; cutter dulled; half an Outside shipping label remains"),
    evidence: [
      evidence("slot", ["狹縫後方有橡膠滾輪與細齒切刀", "細い排出口の奥にゴムローラーと鋸刃", "Rubber roller and fine toothed cutter behind a narrow slot"], ["不像墨水能通過的路徑；比較像連續紙材。", "インク経路ではなく連続紙材向け。", "The path suits continuous paper rather than liquid ink."]),
      evidence("residue", ["內壁沒有墨跡，滾輪上有受熱變黑的紙屑", "内壁にインク跡なし、ローラーに熱で黒化した紙片", "No ink residue; heat-darkened paper fibres cling to the roller"], ["空白不一定代表耗材用盡，也可能是紙種錯誤。", "白紙は消耗品切れでなく、紙種違いかもしれない。", "Blank output may indicate the wrong paper rather than missing ink."]),
      evidence("marks", ["底部標記含 DC、USB 與垃圾桶叉號", "底面にDC・USB・廃棄禁止表示", "Underside marks show DC, USB, and a crossed-out bin"], ["它需要外部供電與另一台設備發送內容。", "外部電源と別機器からのデータを要する。", "It expects external power and content from another device."]),
    ],
    hypotheses: [
      hypothesis("fortune", ["自動抽籤與裁紙的神社籤筒", "自動で籤を選び切る神社用筒", "Shrine tube that selects and cuts fortunes"], ["黏紙可防籤文被風吹走，空白則交由神明補寫。", "粘着紙は籤の飛散防止、白紙は神が追記する。", "Adhesive paper prevents fortunes blowing away; the gods supply the writing."]),
      hypothesis("label-printer", ["感熱式標籤列印機", "感熱式ラベルプリンター", "Thermal label printer"], ["以加熱而非墨水顯字，連續列印後由齒刀裁下。", "インクでなく加熱で印字し、連続紙を鋸刃で切る。", "It prints by heating special stock, then cuts the continuous strip."], true),
      hypothesis("name-stamper", ["替遺失物重新印上名字的封名器", "失せ物へ名を戻す封名器", "Name-sealer for objects that have lost their names"], ["USB 標記可能是外界用來傳入真名的簡寫。", "USBは真名を送る外界式の略号かもしれない。", "USB may be an Outside abbreviation for transmitting true names."]),
    ],
    tests: [
      test("raking-light", ["斜光檢查紙路", "斜光による紙路検査", "Raking-light paper-path inspection"], ["不拆殼，以斜光追蹤滾輪、感測器與切刀。", "分解せず、斜光でローラー・センサー・刃を追う。", "Trace roller, sensor, and cutter under angled light without opening the shell."], ["發現一條紙捲直達線狀陶瓷元件，沒有墨匣空間。", "紙巻きから線状セラミック部品へ直結、インク室なし。", "The roll path reaches a linear ceramic element; there is no ink chamber."], ["label-printer"]),
      test("paper-scrap", ["館藏紙屑比對", "収蔵紙片との比較", "Catalogue paper-scrap comparison"], ["只加熱已脫落紙屑，不向本體通電。", "脱落済み紙片のみ加熱し、本体へは通電しない。", "Warm only a detached fibre sample; do not power the object."], ["紙屑均勻變黑。霊夢撤回了『神明補寫』的預算申請。", "紙片は均一に黒化。霊夢は「神が追記」予算を撤回。", "The scrap blackens evenly. Reimu withdraws the budget request for divine handwriting."], ["label-printer"]),
      test("passive-port", ["被動端口形狀比對", "受動端子形状照合", "Passive port-shape comparison"], ["以木製量規量測，不插入河童轉接器。", "木製ゲージで測り、河童アダプターは挿さない。", "Measure with a wooden gauge; insert no kappa adapter."], ["端口符合舊式資料連接規格；荷取仍聲稱自己的水壓接口『差一點就合』。", "旧式データ端子と一致。にとりは水圧端子も「ほぼ合う」と主張。", "The port matches an older data connector. Nitori says her hydraulic plug was “nearly right.”"], ["label-printer", "name-stamper"]),
    ],
    uses: [
      use("shelf-labels", ["替會移動的書架印臨時索書標", "動く書架の仮請求ラベル", "Temporary call labels for moving shelves"], ["標籤失效前，至少知道書架昨天在哪裡。", "剥がれるまでは棚が昨日どこにいたか分かる。", "Until the label peels off, staff know where the shelf was yesterday."]),
      use("fortune-corrections", ["只印御神籤訂正欄", "おみくじ訂正欄専用", "Fortune-slip corrections only"], ["靈夢同意，前提是訂正欄不得比籤文本體昂貴。", "霊夢は、訂正欄が籤本体より高くない条件で同意。", "Reimu agrees if corrections do not cost more than the fortune itself."]),
      use("valve-tags", ["河童水閥警告牌", "河童水栓の警告札", "Kappa valve warning labels"], ["荷取保證警告牌會在漏水前貼好，沒有保證更早。", "にとりは漏水前に貼ると保証。どれほど前かは不明。", "Nitori promises labels before leakage, without saying how long before."]),
    ],
    truth: {
      intended: l("外界物流與商店用感熱標籤列印機", "外界の物流・店舗用感熱ラベルプリンター", "Outside logistics and retail thermal label printer"),
      operation: l("由外部設備傳入文字，線狀熱頭使感熱紙局部變黑。", "外部機器から文字を受け、線状熱ヘッドで感熱紙を黒化。", "An external device sends text; a linear thermal head darkens heat-sensitive stock."),
      caution: l("未知電源規格；恢復運作前不可直接接河童發電機。", "電源仕様不明。復旧前に河童発電機へ直結しない。", "Power requirements are unknown; do not connect directly to a kappa generator."),
    },
    panel: {
      rinnosuke: l("名稱與用途沒有問題。問題是外界人為何先發明標籤，再大量製造會失去標籤的貨物。", "名称と用途は明白だ。問題は、外界人がラベルを発明した後でラベルを失う品を大量に作る理由だ。", "The name and purpose are clear. What is unclear is why Outsiders invented labels, then mass-produced goods that lose them."),
      ran: l("第十八件與第五版目錄的第十二件共用一個序號。先保留兩條來源，不要替外界修掉矛盾。", "第18点と第五版目録第12点が同じ番号を持つ。外界の矛盾を勝手に直さず、来歴を二本残す。", "Object 18 shares a serial with item 12 in the fifth catalogue. Keep both provenances; do not repair the Outside World’s contradiction."),
      nitori: l("我可以做一個可拆式電源盒。『可拆式』指拿扳手三分鐘，不是圖書館說的徒手可逆。", "着脱式電源箱なら作れる。「着脱」はレンチ三分で、図書館のいう素手可逆ではない。", "I can make a removable power box. “Removable” means three minutes with a wrench, not the library’s bare-hand standard."),
      kogasa: l("它不是因為沒墨被忘記，是因為連需要什麼紙都沒人記得。這種忘法比較安靜，也比較深。", "インク切れで忘れられたんじゃない。必要な紙まで誰も覚えていない。静かで、深い忘れ方だよ。", "It was not forgotten for lacking ink. Nobody remembers what paper it needs. That is a quieter, deeper kind of forgetting."),
    },
    agencyBase: 1,
  },
  {
    id: "single-earbud",
    code: "KML-O-077-31",
    glyph: "聽",
    name: l("只剩右邊的白色耳塞", "右側だけ残った白い耳栓", "White earpiece, right side only"),
    workingTitle: l("把半句話藏進耳朵的豆子", "半分の言葉を耳へ隠す豆", "Bean that hides half a sentence in the ear"),
    arrival: l("博麗神社賽錢箱底，與三枚外界硬幣同袋", "博麗神社の賽銭箱底、外界硬貨三枚と同袋", "Found beneath the Hakurei donation box with three Outside coins"),
    condition: l("配對物與充電盒缺失，網罩有細塵，偶爾發出短促提示音", "対になる品と充電箱なし、網に微塵、時折短い通知音", "Partner and charging case missing; mesh dusty; emits an occasional brief tone"),
    evidence: [
      evidence("mesh", ["一側有聲孔與耳垢防護網", "片面に音孔と防汚メッシュ", "One face has an acoustic port and debris mesh"], ["形狀針對耳廓，不像種子或護符。", "耳介向けの形で、種子や護符ではない。", "Its geometry fits an ear, not a seed or charm."]),
      evidence("contacts", ["底部兩個金屬接點磨損一致", "底面の金属接点二つが均等に摩耗", "Two underside contacts show even wear"], ["它曾反覆放入某個缺失容器。", "失われた容器へ反復収納されていた。", "It was repeatedly seated in a missing container."]),
      evidence("letter", ["內側有極小的 R 字與序號", "内側に小さなR字と番号", "A tiny R and serial appear inside"], ["R 可能是右側，不必立刻解讀為霊夢所有。", "Rは右側の可能性があり、霊夢所有と即断しない。", "R may mean right; do not immediately assign ownership to Reimu."]),
    ],
    hypotheses: [
      hypothesis("whisper-charm", ["把遠方悄悄話塞進耳中的通訊護符", "遠方の囁きを耳へ入れる通信護符", "Communication charm that places distant whispers in the ear"], ["提示音是另一端敲門，但配對儀式已遺失。", "通知音は向こう側のノックだが、対の儀式が失われた。", "The tone is a knock from elsewhere; the pairing rite is lost."]),
      hypothesis("wireless-earbud", ["成對使用的無線耳機右側", "対で使う無線イヤホン右側", "Right half of a paired wireless earbud"], ["接收外部設備的聲音，並由缺失的盒子補充電力。", "外部機器の音を受け、失われた箱で充電する。", "It receives sound from another device and recharges in the missing case."], true),
      hypothesis("dream-seed", ["只播放前半段夢境的睡眠種子", "夢の前半だけ再生する睡眠種", "Sleep seed that plays only the first half of a dream"], ["只剩右側，因此醒來的人永遠不知道左邊結局。", "右側しかなく、目覚めた者は左側の結末を知らない。", "Only the right remains, so the sleeper never hears the left-hand ending."]),
    ],
    tests: [
      test("acoustic", ["無接觸聲學記錄", "非接触音響記録", "Contactless acoustic recording"], ["將它置於軟墊隔音盒，不放入任何人的耳朵。", "軟台の遮音箱へ置き、誰の耳にも入れない。", "Place it in a padded sound box; put it in nobody’s ear."], ["提示音由微型振膜產生，頻率不像蟲鳴。莉格露仍要求列為昆蟲少數意見。", "微小振動板が通知音を発生。虫声ではないが、リグルは昆虫少数意見を要求。", "A tiny diaphragm makes the tone. It is unlike an insect, though Wriggle files a minority opinion."], ["wireless-earbud", "whisper-charm"]),
      test("magnetic-map", ["弱磁場輪廓測繪", "弱磁場輪郭測定", "Weak-field magnetic mapping"], ["只讀取靜態磁性，不發送配對訊號。", "静的磁性のみ測り、接続信号は送らない。", "Read static magnetism only; transmit no pairing signal."], ["接點旁有小型儲能元件，內部另有磁鐵協助定位。", "接点脇に小型蓄電部、内部磁石は位置決め用。", "A small cell sits by the contacts; internal magnets assist seating."], ["wireless-earbud"]),
      test("case-impression", ["盒痕與磨損方向比對", "箱跡・摩耗方向照合", "Case-impression wear comparison"], ["以黏土製作外部負形，不接觸網罩。", "粘土で外形負型を取り、メッシュへ触れない。", "Take an external clay negative without touching the mesh."], ["接點與側壁磨損顯示它曾斜放進專用盒，而非埋入土中。", "接点と側壁の摩耗は専用箱への斜め収納を示し、土中埋設ではない。", "Wear shows angled seating in a dedicated case, not burial in soil."], ["wireless-earbud", "dream-seed"]),
    ],
    uses: [
      use("lost-pair-beacon", ["失物處配對物尋回信標", "遺失物係の対用品探索標", "Lost-and-found partner beacon"], ["不主動連線，只展示形狀與序號等待另一半。", "自動接続せず、形と番号だけで相方を待つ。", "Make no connection; display shape and serial while awaiting its counterpart."]),
      use("quiet-exhibit", ["「只剩一半仍能被編目」展品", "「半分でも目録できる」展示", "“Half an object can still be catalogued” exhibit"], ["圖書館拒絕把缺失的一半填成『推定已飛走』。", "図書館は欠けた半分を「推定飛去」と記入することを拒否。", "The library refuses to catalogue the missing half as “presumed flown.”"]),
      use("fairy-metronome", ["妖精合唱單耳節拍器", "妖精合唱の片耳メトロノーム", "One-ear fairy-choir metronome"], ["必須先找到安全音量與真正的充電方式。", "安全音量と正しい充電法の確認が先。", "Safe volume and an actual charging method come first."]),
    ],
    truth: {
      intended: l("成對無線耳機的右側單體", "左右一組の無線イヤホン右側単体", "Right unit from a paired set of wireless earbuds"),
      operation: l("與外部播放設備及專用充電盒配對；單體仍可能保留少量電力。", "外部再生機器と専用充電箱に接続。単体に少量の電力が残る場合がある。", "Pairs with a playback device and dedicated charging case; the single unit may retain a small charge."),
      caution: l("未知配對資料與音量；不得直接放入耳中測試。", "接続情報・音量不明。耳へ直接入れて試験しない。", "Pairing data and volume are unknown; do not test in an ear."),
    },
    panel: {
      rinnosuke: l("我知道它叫無線耳機，也知道用途是聽聲音。能力沒有附贈另一半放在哪裡。", "無線イヤホンという名と音を聴く用途は分かる。能力は相方の所在まで付けてくれない。", "I know it is a wireless earbud and that it is for listening. My ability does not include the location of its other half."),
      ran: l("R 的解讀有三個版本：右側、型號或所有者姓名。目錄應保存三者，不必選最有戲劇性的一個。", "Rの解釈は右・型番・所有者名の三説。目録は三説を残し、最も劇的な一つを選ばない。", "R has three readings: right, model mark, or owner initial. The catalogue should retain all three, not choose the most dramatic."),
      nitori: l("理論上能做充電座。實務上我得先知道電壓，這句請用比『理論上能』更大的字印。", "理論上は充電台を作れる。実務では電圧が先。この一文を「理論上」より大きく印刷して。", "In theory I can make a charger. In practice I need the voltage first. Print that sentence larger than “in theory.”"),
      kogasa: l("成對的工具最怕被當成只壞了一半。它也可能只是一直在等，而不是壞。", "対の道具は「半分壊れた」と扱われるのが一番つらい。壊れず、待っているだけかも。", "Paired tools hate being treated as half-broken. It may simply be waiting, not broken."),
    },
    agencyBase: 2,
  },
  {
    id: "transit-card",
    code: "KML-O-077-44",
    glyph: "乘",
    name: l("已停用的外界交通卡", "使用停止の外界交通カード", "Deactivated Outside transit card"),
    workingTitle: l("曾經讓門自己打開的薄片", "かつて門を自ら開かせた薄片", "Thin plate that once made gates open"),
    arrival: l("無緣塚邊緣，夾在破損票夾與乾燥楓葉之間", "無縁塚の縁、破損した定期入れと乾いた楓葉の間", "Recovered at Muenzuka between a torn pass case and a dry maple leaf"),
    condition: l("表面磨損，印有路線圖碎片；內部線圈完整但服務已失效", "表面摩耗、路線図断片あり。内部コイルは健全だがサービス停止", "Surface worn; fragmentary route map printed; internal coil intact but service retired"),
    evidence: [
      evidence("route", ["表面有站名、線色與有效期限殘字", "表面に駅名・路線色・期限の残字", "Station names, line colours, and remnants of an expiry date"], ["它曾屬於大規模公共通行系統。", "大規模な公共通行制度に属していた。", "It belonged to a large public passage system."]),
      evidence("coil", ["透光可見矩形線圈，沒有可替換電池", "透光で矩形コイル、交換電池なし", "Transmitted light reveals a rectangular coil and no replaceable battery"], ["讀取裝置可能以近距離場供能。", "読取機が近距離場で給電した可能性。", "A reader likely powered it through a near field."]),
      evidence("wear", ["一角磨亮，邊緣有反覆抽取痕", "一角が光り、縁に反復抜き差し痕", "One corner is polished; edges show repeated removal"], ["它常被迅速取出，但未必插進機器。", "頻繁に取り出されたが、機械へ挿したとは限らない。", "It was often drawn quickly, though not necessarily inserted."]),
    ],
    hypotheses: [
      hypothesis("fare-card", ["記錄車資與通行資格的非接觸交通卡", "運賃・通行資格を記録する非接触交通券", "Contactless transit fare and access card"], ["靠近閘門即可驗證資格並扣除儲值。", "改札へ近づけると資格確認と残額処理を行う。", "Presented near a gate, it verifies access and deducts stored value."], true),
      hypothesis("boundary-pass", ["一次性穿越境界的外界護符", "一度だけ境界を渡る外界護符", "Outside charm for one boundary crossing"], ["期限過後才漂入幻想鄉，或許通行效果只延遲了一次。", "期限後に幻想入りしたため、通行効果が一度だけ遅れたのかもしれない。", "It reached Gensokyo after expiry; perhaps its one passage was merely delayed."]),
      hypothesis("luck-card", ["把每日運氣存進線圈的抽籤卡", "日々の運をコイルへ貯める抽選札", "Lottery card that stores daily luck in its coil"], ["磨亮的一角是長期摸取好運的結果。", "光る角は長年運を撫で取った跡。", "The polished corner records years of rubbing for luck."]),
    ],
    tests: [
      test("field-response", ["低能量近場回應", "低出力近接場応答", "Low-energy near-field response"], ["以館方隔離讀取器詢問是否存在，不讀取個人資料區。", "館の隔離読取器で存在のみ照会し、個人領域は読まない。", "Ask only whether the card exists using an isolated reader; do not read personal fields."], ["線圈回應固定識別框架，但服務金鑰已失效。", "コイルは固定識別枠へ応答するが、サービス鍵は失効。", "The coil answers with an identifier frame, but service keys have expired."], ["fare-card", "boundary-pass"]),
      test("route-archive", ["外界路線圖版式比對", "外界路線図様式照合", "Outside route-map layout comparison"], ["與《七十七件》第五版圖版比對，不磨除表面。", "『77点』第五版図版と照合し、表面を研磨しない。", "Compare with the fifth catalogue plates without polishing the surface."], ["殘留線色與通勤鐵路圖例一致；藍稱這只是來源證據，不是餘額證據。", "残色は通勤鉄道凡例と一致。藍は来歴証拠であり残額証拠ではないと注記。", "The colours match commuter rail legends. Ran notes this proves provenance, not remaining balance."], ["fare-card"]),
      test("boundary-reflection", ["境界反射觀察", "境界反射観察", "Boundary-reflection observation"], ["隔著封袋靠近校門結界，不實際刷卡。", "封袋越しに校門結界へ近づけ、実際には通さない。", "Approach the campus boundary through a seal bag; do not tap through."], ["結界把它判為『過期但很有自信』，沒有開門。紫拒絕說明欄位定義。", "結界は「期限切れだが自信あり」と判定し、門は開かず。紫は項目定義を説明しない。", "The boundary classifies it as “expired but confident” and keeps the gate shut. Yukari declines to define the field."], ["boundary-pass", "fare-card"]),
    ],
    uses: [
      use("route-history", ["外界通勤生活史樣本", "外界通勤生活史標本", "Outside commuting-history specimen"], ["保存磨損與過期日期，不恢復任何餘額。", "摩耗と期限を保存し、残額は復元しない。", "Preserve wear and expiry; restore no balance."]),
      use("shuttle-token", ["兔車候車順序牌", "兎車の待ち順札", "Rabbit-shuttle queue token"], ["只借用形狀，不宣稱原服務仍有效。", "形だけ借り、元サービスが有効とは称さない。", "Reuse the form without claiming the original service remains active."]),
      use("gate-teaching", ["結界通行課程反例", "結界通行授業の反例", "Boundary-access teaching counterexample"], ["示範『能被讀取』與『仍有權限』不是同一件事。", "「読める」と「権限がある」は別だと示す。", "Demonstrate that readable and authorized are not the same condition."]),
    ],
    truth: {
      intended: l("外界大眾運輸用非接觸式儲值／通行卡", "外界公共交通用の非接触式運賃・通行カード", "Outside public-transport contactless fare and access card"),
      operation: l("由閘機近場供能，讀取識別與服務資料後更新車資狀態。", "改札の近接場で給電され、識別・サービス情報を読み運賃状態を更新。", "A gate powers it by near field, reads identity and service data, then updates fare state."),
      caution: l("服務已停用且可能含舊持有人資料；只准隔離、最小讀取。", "サービス停止済みで旧利用者情報の可能性。隔離・最小読取のみ。", "The service is retired and may contain former-holder data; isolated minimum reading only."),
    },
    panel: {
      rinnosuke: l("它的用途確實是通行。至於為何已經不能通行，我的能力不負責外界公司的倒閉。", "用途は通行で間違いない。なぜ通れないかまで、私の能力は外界企業の廃業を担当しない。", "Its purpose is passage. My ability is not responsible for Outside companies going out of service."),
      ran: l("讀得到序號不代表有權讀完。目錄只保存服務種類與過期狀態，舊持有人留在封袋裡。", "番号が読めても全読権限ではない。目録はサービス種別と失効状態だけ残し、旧利用者は封袋の中へ。", "A readable serial is not permission to read all of it. Catalogue the service class and expiry; leave the former holder inside the seal."),
      nitori: l("線圈還能用，拿來做水位感應——好，我聽見『可逆』了。我做夾具，不焊。", "コイルは水位検知に使える——はい、「可逆」は聞こえた。半田でなく治具にする。", "The coil could sense water level—yes, I heard “reversible.” I will use a clamp, not solder."),
      kogasa: l("過期卡很奇怪：它還記得每天去哪裡，門卻假裝不認識它。", "期限切れの札は変だね。毎日どこへ行ったか覚えてるのに、門だけが知らないふりをする。", "Expired cards are strange. They remember where they went every day, while the gate pretends not to know them."),
    },
    agencyBase: 1,
  },
  {
    id: "unreadable-disc",
    code: "KML-O-077-52",
    glyph: "盤",
    name: l("無法讀取的彩虹圓盤", "読めない虹色円盤", "Unreadable rainbow disc"),
    workingTitle: l("把夏天封在反光面裡的薄月", "夏を反射面へ封じた薄い月", "Thin moon with a summer sealed in its surface"),
    arrival: l("香霖堂紙箱底層，套袋寫有「2009 夏 最終 最終2」", "香霖堂の箱底、袋に「2009夏 最終 最終2」", "Bottom of a Kourindou crate; sleeve says “SUMMER 2009 FINAL FINAL2”"),
    condition: l("外圈刮傷，記錄面有指紋；內容未知且讀取設備缺失", "外周に傷、記録面に指紋。内容不明、読取機欠品", "Outer ring scratched; fingerprints on record face; contents unknown and reader missing"),
    evidence: [
      evidence("rings", ["反光面可見由內向外的連續細環", "反射面に内から外へ連続する細環", "Fine continuous rings run from centre outward"], ["資訊可能沿單一路徑記錄，不是符陣。", "情報は単一路へ記録され、魔法陣ではない可能性。", "Information may follow one path rather than a magic circle."]),
      evidence("sleeve", ["手寫標題被劃改兩次，日期早於漂流", "手書き題名は二度訂正、日付は漂流以前", "Handwritten title is corrected twice and predates the crossing"], ["『最終』是版本聲明，不是內容已完成的證據。", "「最終」は版の主張で、内容完成の証拠ではない。", "“Final” is a version claim, not proof that the contents were finished."]),
      evidence("fingerprints", ["三組不同方向的指紋跨過讀取面", "三方向の指紋が読取面を横切る", "Three differently oriented prints cross the reading face"], ["它曾被多人拿取；不能推定套袋作者就是內容作者。", "複数人が扱った。袋の筆者を内容作者と推定できない。", "Several people handled it; the sleeve writer need not be the content author."]),
    ],
    hypotheses: [
      hypothesis("music-disc", ["保存外界音樂的光學唱片", "外界音楽を収めた光学盤", "Optical disc containing Outside music"], ["細環由光讀取，套袋的夏天可能是演奏或祭典。", "細環を光で読み、袋の夏は演奏や祭りかもしれない。", "Light reads the rings; “summer” may name a performance or festival."]),
      hypothesis("data-disc", ["保存數位檔案的可寫入光碟", "デジタル資料を記録した書込式光盤", "Recordable optical data disc"], ["手寫版本名與指紋更像私人檔案備份。", "手書き版名と指紋は個人資料の保存らしい。", "The handwritten version label and prints resemble a private data backup."], true),
      hypothesis("moon-fragment", ["被壓薄並記錄夏季的月亮碎片", "夏を記録して薄く圧した月片", "Moon fragment pressed thin and made to remember summer"], ["彩虹來自月光被外界塑料困住。", "虹は月光が外界樹脂へ閉じ込められたもの。", "The rainbow is moonlight trapped in Outside resin."]),
    ],
    tests: [
      test("spectral", ["低照度反射光譜", "低照度反射分光", "Low-light reflection spectrum"], ["使用不聚焦冷光，避免加熱與強光寫入。", "非集光の冷光を使い、加熱・強光書込を避ける。", "Use diffuse cold light to avoid heating or optical writing."], ["彩虹來自細密結構繞射，不含月質樣本。永琳說這不能排除月都塑料。", "虹は微細構造の回折で、月質試料なし。永琳は月都樹脂を否定できないと注記。", "The rainbow is structural diffraction; no lunar material is found. Eirin notes this does not exclude Lunar resin."], ["data-disc", "music-disc"]),
      test("track-map", ["不讀內容的軌道邊界圖", "内容を読まない軌道境界図", "Track-boundary map without content reading"], ["只測已記錄區與空白區的反射差，不解碼。", "記録域と空白域の反射差だけ測り、復号しない。", "Measure reflectance differences between written and blank regions; decode nothing."], ["約七成區域曾被寫入，外圈損傷跨過末段。", "約七割が記録済み、外周傷は末尾区間を横断。", "Roughly seventy percent was written; outer damage crosses the final region."], ["data-disc"]),
      test("sleeve-history", ["紙套筆跡與版本比對", "紙袋筆跡・版照合", "Sleeve handwriting and version comparison"], ["只比對館藏中的外界格式，不識別書寫者。", "外界書式とのみ照合し、筆者は特定しない。", "Compare only with Outside formatting samples; identify no writer."], ["『FINAL2』常出現在反覆修改的私人資料，並不表示第二個終結。", "「FINAL2」は反復修正された私的資料に多く、第二の終末を意味しない。", "“FINAL2” commonly marks repeatedly revised private files, not a second ending."], ["data-disc"]),
    ],
    uses: [
      use("sealed-archive", ["不解碼的私人資料封存樣本", "未復号の私的資料封印標本", "Sealed private-data specimen without decoding"], ["保存媒介史，不把未知內容變成公共館藏。", "媒体史は保存し、未知内容を公開蔵書にしない。", "Preserve media history without turning unknown contents into a public holding."]),
      use("version-teaching", ["版本命名失敗教材", "版名失敗の教材", "Version-naming failure teaching aid"], ["只展示紙套，不需要讀出內容。", "紙袋だけ展示し、内容を読む必要はない。", "Display the sleeve; reading the contents is unnecessary."]),
      use("light-mobile", ["妖精冷光吊飾", "妖精の冷光モビール", "Fairy cold-light mobile"], ["必須使用複製品；原件不得打孔。", "複製品のみ使用し、原品へ穴を開けない。", "Use a replica only; do not pierce the original."]),
    ],
    truth: {
      intended: l("外界用可寫入式光學資料碟片", "外界の書込式光学データディスク", "Outside recordable optical data disc"),
      operation: l("雷射沿螺旋軌道讀寫數位資料；目前內容格式與權限均未知。", "レーザーが螺旋軌道のデジタル情報を読書き。現在は形式・権限とも不明。", "A laser reads and writes digital data along a spiral track; format and permission are unknown."),
      caution: l("未知私人內容不得因技術上可恢復就自動解碼。", "技術的に復元可能でも、未知の私的内容を自動復号しない。", "Unknown private content is not automatically decoded merely because recovery may be possible."),
    },
    panel: {
      rinnosuke: l("名稱是可寫入光碟，用途是保存資料。『最終2』不在能力說明範圍內，我也不認為外界人能說明。", "名は書込式光盤、用途は資料保存。「最終2」は能力の範囲外で、外界人にも説明できないと思う。", "Its name is recordable optical disc and its purpose is data storage. “FINAL2” lies outside my ability, and perhaps outside Outsiders’ explanations."),
      ran: l("可恢復不等於可讀。先建立權限缺口，再建立資料缺口；順序不能反過來。", "復元可能は閲覧許可ではない。まず権限の欠落、次にデータの欠落を記録する。順序を逆にしない。", "Recoverable does not mean readable. Record the permission gap before the data gap; do not reverse them."),
      nitori: l("我有讀盤機——不，我沒有說現在就接上。我只是在爭取讓『有設備』被記進會議紀錄。", "読取機はある——今すぐ繋ぐとは言ってない。「設備あり」を議事録へ入れたいだけ。", "I have a reader—no, I did not say connect it now. I only want “equipment available” entered in the minutes."),
      kogasa: l("大家都想知道裡面是什麼，卻沒人問它是不是故意不讓最後一圈被讀到。", "中身を知りたがるけど、最後の一周を読ませないのがわざとかは誰も聞かない。", "Everyone wants to know what is inside. Nobody asks whether it means to keep the final ring unread."),
    },
    agencyBase: 1,
  },
  {
    id: "disposable-camera",
    code: "KML-O-077-61",
    glyph: "影",
    name: l("尚有三格的拋棄式相機", "残り三枚の使い切りカメラ", "Single-use camera with three frames remaining"),
    workingTitle: l("不知道拍過誰的紙盒眼睛", "誰を写したか分からない紙箱の目", "Cardboard eye that may remember strangers"),
    arrival: l("迷途竹林排水溝上方，被兔子用乾布包住", "迷いの竹林の排水溝上、兎が乾布で包んでいた", "Recovered above a Bamboo Forest drain, wrapped in dry cloth by rabbits"),
    condition: l("外殼受潮但未開裂，計數窗顯示 3，閃光電容狀態未知", "外装は湿気あり未破損、計数窓3、フラッシュ蓄電部不明", "Case damp but intact; counter shows 3; flash capacitor condition unknown"),
    evidence: [
      evidence("lens", ["固定焦距塑料鏡片與簡易取景窗", "固定焦点樹脂レンズと簡易ファインダー", "Fixed-focus plastic lens and simple viewfinder"], ["用於記錄影像，而非直接觀看遠處。", "遠方を見るより画像記録用。", "Designed to record images rather than view distant scenes."]),
      evidence("counter", ["頂部計數窗由 4 跳至 3 的磨痕", "上面の計数窓に4から3へ進んだ摩耗", "Counter wear traces movement from 4 to 3"], ["內部仍可能有未曝光底片。", "内部に未露光フィルムが残る可能性。", "Unexposed film may remain inside."]),
      evidence("warning", ["背面圖示要求避光拆解並標示高壓", "裏面図示は暗所分解と高電圧を表示", "Rear diagrams require dark opening and warn of high voltage"], ["拆開既會破壞剩餘影像，也可能觸及儲能元件。", "開封は残り画像を損ね、蓄電部へ触れる危険。", "Opening may ruin remaining images and expose stored energy."]),
    ],
    hypotheses: [
      hypothesis("spirit-box", ["將被攝者一部分魂魄封進紙盒的器具", "被写体の魂の一部を紙箱へ封じる器具", "Device that seals part of a subject’s soul in cardboard"], ["還剩三格代表還能容納三份影子。", "残り三枚は影を三つ収められる印。", "Three remaining frames mean room for three more shadows."]),
      hypothesis("single-use-camera", ["預裝底片的一次性相機", "フィルム内蔵の使い切りカメラ", "Preloaded single-use film camera"], ["拍攝至計數歸零後，由暗房取出底片沖洗。", "計数が尽きた後、暗室でフィルムを取り出し現像。", "After the counter reaches zero, a darkroom removes and develops the film."], true),
      hypothesis("memory-counter", ["只能保存固定數量記憶的外界眼睛", "一定数の記憶だけ保存する外界の目", "Outside eye that stores a fixed number of memories"], ["計數窗不是剩餘照片，而是它願意再記住幾次。", "計数窓は写真残数でなく、あと何度覚える意思があるか。", "The counter is not remaining photos, but how many more times it agrees to remember."]),
    ],
    tests: [
      test("dark-bag", ["暗袋外部機構觸診", "暗袋内の外部機構触診", "External mechanism check inside a dark bag"], ["不拆殼，只確認捲片輪與快門是否卡死。", "開封せず、巻上げ輪とシャッター固着のみ確認。", "Do not open; check only whether wind wheel and shutter are seized."], ["捲片輪停在已上片位置，快門可動；館員禁止按下。", "巻上げは準備位置、シャッター可動。司書は押下を禁止。", "The film is wound and shutter mobile; librarians prohibit pressing it."], ["single-use-camera", "memory-counter"]),
      test("capacitor-field", ["閃光電容被動場檢查", "フラッシュ蓄電部の受動場検査", "Passive flash-capacitor field check"], ["不啟動閃光，只測外殼附近殘餘電場。", "フラッシュを起動せず、外装付近の残留場だけ測る。", "Do not trigger flash; measure residual field near the case."], ["沒有可測殘壓，但不代表內部可以徒手拆。永琳把這句寫了兩遍。", "測定可能な残圧なし。ただし素手分解可を意味しない。永琳が二度記載。", "No measurable residual charge; that does not make bare-hand opening safe. Eirin writes this twice."], ["single-use-camera"]),
      test("privacy-provenance", ["來源與拍攝權限盤點", "来歴・撮影権限の棚卸し", "Provenance and image-permission inventory"], ["記錄發現位置、包裹方式與未知拍攝者，不顯影。", "発見位置・包み方・撮影者不明を記録し、現像しない。", "Record location, wrapping, and unknown photographer; develop nothing."], ["無法建立拍攝者或被攝者同意鏈。三張剩餘底片也不構成使用許可。", "撮影者・被写体の同意連鎖を確立できず。残り三枚も使用許可ではない。", "No consent chain can be established for photographer or subjects. Three unused frames are not permission to use them."], ["single-use-camera", "spirit-box"]),
    ],
    uses: [
      use("sealed-history", ["封存為外界日常攝影史樣本", "外界の日常写真史標本として封印", "Seal as an Outside everyday-photography specimen"], ["不顯影、不再拍攝，保留未知。", "現像も追加撮影もせず、未知を残す。", "Develop nothing, take nothing, preserve the unknown."]),
      use("camera-teaching", ["影像倫理與機構雙重教材", "画像倫理・機構の二重教材", "Combined image-ethics and mechanism teaching aid"], ["使用外殼圖與複製件教學，原件留在暗袋。", "外装図と複製品で教え、原品は暗袋へ。", "Teach from diagrams and replicas; keep the original in a dark bag."]),
      use("three-consented-frames", ["三張明確同意的校慶照片", "明示同意による学祭写真三枚", "Three explicitly consented festival photographs"], ["需先確認機構安全，且每位被攝者可選擇不顯影。", "機構安全を確認し、各被写体は現像拒否可。", "First establish mechanism safety; every subject may decline development."]),
    ],
    truth: {
      intended: l("預裝底片、拍完後整機交付沖洗的一次性相機", "フィルム内蔵、撮影後に本体ごと現像へ出す使い切りカメラ", "Preloaded single-use camera returned whole for film processing"),
      operation: l("固定鏡頭將光投到底片；捲片、快門與閃光由簡化機構控制。", "固定レンズで光をフィルムへ結像し、巻上げ・シャッター・閃光を簡易機構で制御。", "A fixed lens exposes film; simple mechanisms control winding, shutter, and flash."),
      caution: l("未知影像涉及隱私，剩餘底片涉及同意，閃光電容涉及安全。", "未知画像は私権、残りフィルムは同意、閃光蓄電部は安全問題。", "Unknown images raise privacy, unused frames require consent, and the flash capacitor raises safety concerns."),
    },
    panel: {
      rinnosuke: l("它的名稱與用途我能說明，但已拍內容不屬於『用途』。別把能力當成偷看照片的暗房。", "名と用途は説明できるが、撮影済み内容は「用途」ではない。能力を覗き見暗室にしないでほしい。", "I can state its name and purpose. Exposed contents are not “purpose.” Do not turn my ability into a darkroom for peeking."),
      ran: l("來源鏈在兔子乾布處中斷。中斷不是空白授權，而是一條應被保留的未知。", "来歴は兎の乾布で途切れる。途切れは白紙委任でなく、保存すべき未知だ。", "The provenance chain stops at the rabbit’s dry cloth. A gap is not blanket permission; it is an unknown to preserve."),
      nitori: l("不拆也能知道機構還沒完全死。這次我同意封存，因為『還能動』不是『現在應該動』。", "開けずとも機構が完全には死んでいないと分かる。今回は封印に賛成。「動ける」は「今動かすべき」ではない。", "We can tell the mechanism is not entirely dead without opening it. I support sealing this one: “can move” is not “should move now.”"),
      kogasa: l("相機最會驚嚇人的是突然看見以前的自己。可惜這次沒有人答應被驚嚇。", "カメラの一番の驚きは昔の自分を見ること。でも今回は誰も驚かされることに同意してない。", "A camera’s best surprise is suddenly meeting your former self. Unfortunately, nobody agreed to that surprise this time."),
    },
    agencyBase: 2,
  },
  {
    id: "orphan-controller",
    code: "KML-O-077-68",
    glyph: "遊",
    name: l("沒有主機的遊戲控制器", "本体のないゲームコントローラー", "Game controller without its console"),
    workingTitle: l("按了很多次也不肯承認輸入的雙柄", "何度押しても入力を認めない双柄", "Twin-handled device that refuses to admit input"),
    arrival: l("河童舊貨交換會退貨籃，附紙條「不防水，差評」", "河童中古交換会の返品籠、「防水でない、低評価」札付き", "Kappa swap-meet return basket with note: “not waterproof, poor rating”"),
    condition: l("按鍵完整，線纜末端規格陌生，握柄內有可移動配重", "ボタン健全、端子規格不明、握り内部に可動重り", "Buttons intact; cable end unfamiliar; moving mass inside grips"),
    evidence: [
      evidence("layout", ["十餘按鍵圍繞兩支可回中的小桿", "十数ボタンと自動復帰する二本の小棒", "More than ten buttons surround two self-centring sticks"], ["設計用於雙手連續輸入，而非單一開關。", "単一スイッチでなく両手連続入力用。", "Designed for continuous two-handed input, not a single switch."]),
      evidence("cable", ["線纜末端有定向金屬接點與防呆缺口", "端子に方向付き金属接点と誤挿入防止溝", "Cable end has directional contacts and a keyed notch"], ["它依賴缺失的對應設備。", "失われた対応機器に依存する。", "It depends on a missing matching device."]),
      evidence("mass", ["晃動時兩側握柄各有一個偏心轉子", "振ると両握りに偏心回転子", "Each grip contains an eccentric rotor"], ["它可能主動回饋使用者，而不只接收按壓。", "押下を受けるだけでなく利用者へ返答する可能性。", "It may answer the user rather than merely receive presses."]),
    ],
    hypotheses: [
      hypothesis("danmaku-trainer", ["外界用雙手操縱彈幕幻影的訓練器", "外界で弾幕幻影を両手操作する訓練器", "Outside trainer for two-handed danmaku illusions"], ["按鍵對應射擊、閃避與暫停，震動則表示被擊中。", "ボタンは射撃・回避・停止、振動は被弾を示す。", "Buttons map to shooting, evasion, and pause; vibration signals a hit."]),
      hypothesis("game-controller", ["供電子遊戲主機輸入的控制器", "電子ゲーム機への入力コントローラー", "Input controller for an electronic game console"], ["按鍵與小桿傳送操作，內部馬達提供觸覺回饋。", "ボタンと棒で操作を送り、内部モーターが触覚を返す。", "Buttons and sticks send input; internal motors provide tactile feedback."], true),
      hypothesis("remote-shikigami", ["失去式神本體的遠端使役器", "式神本体を失った遠隔使役器", "Remote shikigami command device whose familiar is missing"], ["它持續等待一個不再回應的主機，如同斷線的式。", "応答しない本体を待ち続け、接続を失った式のようだ。", "It keeps waiting for an unresponsive host, like a shikigami whose link was severed."]),
    ],
    tests: [
      test("continuity", ["無供電按鍵矩陣測繪", "無給電ボタン行列測定", "Unpowered button-matrix mapping"], ["以高阻量具讀取開關通斷，不向端口供電。", "高抵抗計器でスイッチ導通のみ読み、端子へ給電しない。", "Read switch continuity with a high-impedance tool; supply no port power."], ["按鍵形成掃描矩陣，兩支小桿輸出連續位置。", "ボタンは走査行列、二本の棒は連続位置を出力。", "Buttons form a scanned matrix; the two sticks output continuous position."], ["game-controller", "danmaku-trainer"]),
      test("mass-map", ["握柄配重影像", "握り内部質量像", "Grip mass imaging"], ["以低強度妖力透視，不驅動轉子。", "低強度妖力で透視し、回転子を駆動しない。", "Use low-strength youkai imaging without driving the rotors."], ["兩枚偏心馬達可造成不同強度震動，不是鬆脫螺絲。", "偏心モーター二基が強弱振動を作り、緩んだねじではない。", "Two eccentric motors can create graded vibration; they are not loose screws."], ["game-controller"]),
      test("adapter-fit", ["可逆木模端口配合", "可逆木型端子合わせ", "Reversible wooden port fitting"], ["只做木製負形，不連接電線。", "木製の負型だけ作り、配線しない。", "Make a wooden negative only; connect no wires."], ["端口屬於特定世代主機。荷取的通用轉接頭多出兩個水孔。", "端子は特定世代機用。にとりの万能変換器には水穴が二つ余る。", "The plug belongs to a specific console generation. Nitori’s universal adapter has two surplus water holes."], ["game-controller", "remote-shikigami"]),
    ],
    uses: [
      use("input-teaching", ["人機輸入與回饋教材", "人機入力・反応教材", "Human-machine input and feedback teaching aid"], ["不需要恢復完整遊戲，也能研究按鍵、位置與震動。", "ゲーム全体を復元せず、ボタン・位置・振動を研究できる。", "Buttons, position, and vibration can be studied without restoring a whole game."]),
      use("danmaku-access", ["低動作幅彈幕訓練輸入器", "小動作弾幕訓練入力器", "Low-motion danmaku training input"], ["需另做隔離轉接器，且不能假裝震動等於受傷。", "隔離変換器が必要で、振動を負傷と見なさない。", "Requires an isolated adapter; vibration must not be treated as injury."]),
      use("kappa-prototype", ["河童多閥門遙控原型", "河童多弁遠隔操作試作", "Kappa multi-valve remote prototype"], ["所有改裝都在外接盒進行，不剪原線。", "改造は外付箱のみで行い、原線を切らない。", "All modification stays in an external box; cut no original wire."]),
    ],
    truth: {
      intended: l("特定電子遊戲主機用有線控制器", "特定電子ゲーム機用の有線コントローラー", "Wired controller for a particular electronic game console"),
      operation: l("將按鍵與搖桿狀態傳給主機，並接收指令驅動震動馬達。", "ボタン・棒の状態を本体へ送り、指令を受け振動モーターを駆動。", "Sends button and stick state to a console and receives commands for vibration motors."),
      caution: l("未知端口電壓；任何轉接必須隔離且可拆除。", "端子電圧不明。変換は絶縁・着脱式に限る。", "Port voltage is unknown; any adapter must be isolated and removable."),
    },
    panel: {
      rinnosuke: l("它叫遊戲控制器，用途是操縱遊戲。這句話沒有回答遊戲去了哪裡，正如知道鑰匙也不會附贈房子。", "ゲームコントローラーで、用途はゲーム操作。だがゲームの所在は分からない。鍵の名を知っても家は付かない。", "It is a game controller, for controlling a game. That does not locate the game, just as naming a key does not provide a house."),
      ran: l("控制器、主機、軟體與版本是四個不同缺口。只寫『主機遺失』會讓後人以為其餘三項存在。", "操作器・本体・ソフト・版は四つの欠落。「本体なし」だけでは残り三つがあるように見える。", "Controller, console, software, and version are four separate gaps. “Console missing” falsely implies the other three remain."),
      nitori: l("這個矩陣很漂亮。我要做的是外接轉接盒，不是『順便』把原線剪掉；請把剪線鉗從桌上拿走。", "この行列はきれいだ。作るのは外付変換箱で、「ついで」に原線を切るんじゃない。ニッパーをどけて。", "This matrix is elegant. I am building an external adapter, not “incidentally” cutting the original cable. Move the cutters."),
      kogasa: l("它每個按鍵都等著造成什麼事，現在按下去卻什麼也沒有。這比按鍵壞掉更容易讓工具生氣。", "どのボタンも何かを起こすためにあるのに、今は押しても何もない。壊れるより道具が怒りやすい。", "Every button expects to cause something, yet now nothing happens. That can anger a tool more than being broken."),
    },
    agencyBase: 2,
  },
  {
    id: "orphan-cable",
    code: "KML-O-077-72",
    glyph: "線",
    name: l("找不到接口的白色充電線", "合う端子のない白い充電線", "White charging cable with no matching socket"),
    workingTitle: l("兩頭都知道去哪裡，桌上卻沒有目的地", "両端は行先を知るのに、机に目的地がない", "Both ends know where to go; the desk has neither destination"),
    arrival: l("霧之湖岸漂流瓶內，與一張褪色購物清單同存", "霧の湖岸の漂流瓶、色褪せた買物メモと同封", "Inside a drift bottle on the Misty Lake shore with a faded shopping list"),
    condition: l("外皮泛黃但無裂口，一端為通用矩形，另一端為停產規格", "被覆は黄変、亀裂なし。一端は汎用矩形、他端は廃止規格", "Jacket yellowed but intact; one end broadly standard, the other discontinued"),
    evidence: [
      evidence("ends", ["兩端尺寸與接點數不同", "両端の寸法・接点数が異なる", "The ends differ in size and contact count"], ["它在兩種設備之間傳送電力或資料。", "二種機器間で電力または情報を運ぶ。", "It carried power or data between two device types."]),
      evidence("strain", ["小端根部有反覆彎折的白化痕", "小端根元に反復屈曲の白化", "Repeated bending has whitened the small-end strain relief"], ["小端常接在會被拿起移動的物品上。", "小端は持ち運ぶ品へ頻繁に接続された。", "The small end often attached to something lifted and moved."]),
      evidence("shield", ["弱磁檢查顯示內有多股線與屏蔽層", "弱磁検査で複数線と遮蔽層", "Weak-field inspection shows multiple conductors and shielding"], ["它不只是單純繩索或單線供電。", "単なる紐や単線給電ではない。", "It is more than a cord or single-wire power lead."]),
    ],
    hypotheses: [
      hypothesis("charging-data", ["舊式行動設備的充電與資料線", "旧式携帯機器の充電・データ線", "Charging and data cable for an older mobile device"], ["大端接電源或電腦，小端接已不在場的裝置。", "大端は電源・計算機、小端は失われた携帯機器へ。", "The large end met power or computer; the small end met the missing device."], true),
      hypothesis("boundary-thread", ["固定兩處境界端點的有線結界", "二つの境界端を固定する有線結界", "Wired boundary tying two endpoints together"], ["屏蔽層防止中途世界滲入資料。", "遮蔽層は途中の世界が情報へ染み込むのを防ぐ。", "Shielding prevents intervening worlds from leaking into the data."]),
      hypothesis("familiar-leash", ["防止小型式神走失的資料牽繩", "小型式神の迷子防止データ綱", "Data leash preventing a small familiar from wandering"], ["小端磨損表示式神經常想掙脫。", "小端摩耗は式神が頻繁に逃げようとした跡。", "Wear at the small end shows the familiar often tried to escape."]),
    ],
    tests: [
      test("conductor-map", ["無供電導線映射", "無給電導線写像", "Unpowered conductor map"], ["從兩端以微弱測量訊號確認對應，不施加工作電壓。", "微弱測定信号で両端対応を確認し、動作電圧は加えない。", "Map end-to-end continuity with a tiny test signal, not operating voltage."], ["包含電力線與多組資料線，沒有斷路。", "電力線と複数データ線を含み、断線なし。", "Power and several data conductors are present, with no open circuit."], ["charging-data", "boundary-thread"]),
      test("connector-catalogue", ["停產接口圖錄比對", "廃止端子図録照合", "Discontinued connector catalogue comparison"], ["與《七十七件》端口拓片比對，不強行插入。", "『77点』端子拓本と照合し、無理に挿さない。", "Compare against catalogue rubbings; force it into nothing."], ["小端符合一類已停產行動設備，三種外形近似版本仍需保留。", "小端は廃止携帯機器群に合うが、外形類似三版を併記。", "The small end matches a discontinued mobile family; three look-alike versions remain possible."], ["charging-data"]),
      test("shield-test", ["屏蔽層被動檢查", "遮蔽層の受動検査", "Passive shielding check"], ["不傳輸內容，只比較外部雜訊穿透。", "内容を送らず、外部雑音の透過だけ比較。", "Transmit no content; compare only external noise penetration."], ["屏蔽針對電磁干擾，對紫打開的間隙沒有作用。", "遮蔽は電磁雑音向けで、紫の隙間には効かない。", "The shield blocks electromagnetic noise, not a gap opened by Yukari."], ["charging-data", "boundary-thread"]),
    ],
    uses: [
      use("connector-history", ["停產接口與維修斷鏈教材", "廃止端子・修理断絶教材", "Discontinued-port and repair-chain teaching aid"], ["失去配對設備後，完好的線也會失去用途。", "相手機器を失うと、健全な線も用途を失う。", "A sound cable loses purpose when its matching device disappears."]),
      use("reversible-adapter", ["河童可逆轉接研究樣本", "河童可逆変換研究標本", "Kappa reversible-adapter study sample"], ["只夾接外部拓片，不切除停產端。", "外部拓片へ挟み、廃止端を切らない。", "Clamp onto an external replica; do not cut the obsolete end."]),
      use("catalogue-tether", ["會飛館藏的非通電書籤繩", "飛ぶ蔵書の無通電しおり紐", "Unpowered bookmark tether for flying holdings"], ["不把它接上任何設備，避免書架學會資料傳輸。", "機器へ接続せず、棚にデータ転送を覚えさせない。", "Connect it to no device, lest the shelves learn data transfer."]),
    ],
    truth: {
      intended: l("舊式行動電子設備用充電與資料傳輸線", "旧式携帯電子機器用の充電・データ転送ケーブル", "Charging and data cable for an older mobile electronic device"),
      operation: l("在主機／電源與特定停產設備之間傳送電力及序列資料。", "主機・電源と特定廃止機器の間で電力・直列データを運ぶ。", "Carries power and serial data between a host or supply and a particular obsolete device."),
      caution: l("外形相似接口可能電壓與接線不同，不得試插猜測。", "似た外形でも電圧・配線が異なる。試し挿し禁止。", "Similar-looking connectors may differ in voltage and wiring; no trial insertion."),
    },
    panel: {
      rinnosuke: l("它叫充電資料線。用途需要兩端共同成立，所以失去一端後，能力給出的答案也只剩半句。", "充電データ線という。用途は両端で成立するから、一端を失えば能力の答えも半文になる。", "It is a charging data cable. Its purpose requires both ends, so with one end lost my answer becomes half a sentence."),
      ran: l("『通用端』只是後來仍常見，不代表另一端錯了。目錄不要讓勝出的規格改寫失敗規格的歷史。", "「汎用端」は後世に残っただけで、他端が誤りではない。勝った規格に敗れた規格の歴史を書き換えさせない。", "The “universal end” merely survived longer; the other end is not wrong. Do not let the winning standard rewrite the losing one’s history."),
      nitori: l("我能做轉接器，但先說好：做出來只證明我們能接，不證明應該把未知設備通電。", "変換器は作れる。ただし、接続可能は未知機器へ給電すべき証明ではない。", "I can make an adapter. That proves we can connect, not that we should power an unknown device."),
      kogasa: l("線最怕的不是斷掉，是兩頭都完整，卻再也沒有任何東西需要它。", "線が一番怖いのは切れることじゃない。両端が無事なのに、もう何も必要としないこと。", "The worst thing for a cable is not breaking. It is keeping both ends while nothing needs either."),
    },
    agencyBase: 1,
  },
  {
    id: "frozen-reader",
    code: "KML-O-077-77",
    glyph: "頁",
    name: l("停在同一頁的電子閱讀器", "同じ頁で止まった電子書籍端末", "Electronic reader frozen on one page"),
    workingTitle: l("沒電後仍拒絕闔上的一本書", "電池切れでも閉じることを拒む本", "Book that refuses to close after losing power"),
    arrival: l("香霖堂窗台，據稱已在同一頁停留七年", "香霖堂の窓辺、同じ頁のまま七年とされる", "Kourindou windowsill; reportedly unchanged on the same page for seven years"),
    condition: l("無法開機，螢幕仍顯示半頁文字；充電接口與電池狀態未知", "起動不能、画面に半頁の文字が残る。充電端子・電池状態不明", "Will not start; half a page remains visible; charging port and battery condition unknown"),
    evidence: [
      evidence("persistent-page", ["無供電多年仍保留灰階頁面", "無給電で多年、灰階頁面を保持", "Greyscale page persists after years without power"], ["顯示材料只在翻頁時耗能，不等於仍在運作。", "表示材は更新時のみ電力を使い、動作中とは限らない。", "The display may consume power only when changing; persistence is not operation."]),
      evidence("bezel", ["邊框有翻頁鍵與凹陷接口", "枠に頁送りキーと recessed 端子", "Bezel carries page-turn keys and a recessed port"], ["它是可更新的閱讀設備，不是印刷單頁。", "更新可能な読書機器で、印刷一枚ではない。", "It is an updateable reading device, not a printed sheet."]),
      evidence("page", ["畫面文字停在句中，頁碼為 214/389", "文章は文中で止まり、頁番号214/389", "Text stops mid-sentence at page 214 of 389"], ["可見內容不是完整作品，也不能代表讀者讀到此處。", "見える内容は作品全体でなく、読者がここまで読んだ証拠でもない。", "Visible content is not the whole work, nor proof that a reader reached it."]),
    ],
    hypotheses: [
      hypothesis("e-reader", ["以低耗電紙感螢幕閱讀多本書的裝置", "低消費の紙状画面で複数冊を読む端末", "Device for reading many books on a low-power paper-like screen"], ["電力只在換頁與管理書庫時大量使用。", "電力は頁更新・書庫管理時に主に使う。", "Power is used chiefly when changing pages and managing a collection."], true),
      hypothesis("book-prison", ["把三百八十九頁壓進同一塊板的書牢", "389頁を一枚へ押し込めた本の牢", "Book-prison compressing 389 pages into one slab"], ["按鍵決定哪一頁獲准浮到表面。", "ボタンが表面へ出る頁を許可する。", "Buttons decide which page may rise to the surface."]),
      hypothesis("sentence-talisman", ["把未完成句子永久懸置的外界符", "未完の文を永遠に保留する外界符", "Outside talisman suspending an unfinished sentence forever"], ["只要句子不結束，讀者就不能真正離開書。", "文が終わらない限り、読者は本から離れられない。", "As long as the sentence never ends, the reader cannot truly leave the book."]),
    ],
    tests: [
      test("polarization", ["低照度偏光觀察", "低照度偏光観察", "Low-light polarization observation"], ["比較顯示粒子方向，不刷新畫面。", "表示粒子の向きを比較し、画面更新しない。", "Compare display-particle orientation without refreshing the page."], ["黑白粒子被固定在不同位置，符合雙穩態電子紙。", "白黒粒子が別位置で固定され、双安定電子紙と一致。", "Black and white particles remain in distinct positions, consistent with bistable electronic paper."], ["e-reader", "book-prison"]),
      test("port-rubbing", ["接口拓片與灰塵層次", "端子拓本・埃層序", "Port rubbing and dust stratigraphy"], ["以軟紙拓外形，不插線；記錄灰塵是否曾被打擾。", "軟紙で形を取り、挿線せず、埃の乱れを記録。", "Take a soft-paper rubbing; insert no cable; note disturbed dust."], ["接口多年未插入，規格與外界舊式閱讀器相符。", "多年未使用、外界旧式読書端末の端子と一致。", "The port has been unused for years and matches an older Outside reader family."], ["e-reader"]),
      test("page-catalogue", ["可見頁書目比對", "可視頁の書誌照合", "Visible-page bibliographic comparison"], ["只抄錄短片段與頁碼特徵，不嘗試恢復整本內容。", "短い断片と頁番号特徴だけ記録し、全内容復元を試みない。", "Record only a short fragment and pagination traits; attempt no full recovery."], ["片段與館藏任何完整作品都不完全一致，可能是不同版本或私人文件。", "断片は既存蔵書と完全一致せず、異版または私文書の可能性。", "The fragment matches no complete holding exactly; it may be another edition or private document."], ["e-reader", "sentence-talisman"]),
    ],
    uses: [
      use("media-history", ["不喚醒的電子紙媒介史樣本", "起動しない電子紙媒体史標本", "Unawakened electronic-paper media specimen"], ["讓停住的頁面保留為到達時狀態。", "止まった頁を到着時状態のまま残す。", "Keep the frozen page in its arrival state."]),
      use("recovery-project", ["可撤回電源恢復研究", "撤回可能な電源復旧研究", "Reversible power-recovery study"], ["先做隔離電池模型；不得以翻頁成功當成內容公開許可。", "隔離電池模型から始め、頁更新成功を内容公開許可としない。", "Begin with an isolated battery model; a successful page turn is not permission to expose contents."]),
      use("unfinished-sentence", ["圖書館閉館前最後一句展示", "図書館閉館前の最後の一文展示", "Last sentence before library closing exhibit"], ["每天只展示它本來就露出的半句，不替作者補完。", "元から見える半文だけ展示し、作者の続きを書かない。", "Show only the existing half-sentence; write no ending for its author."]),
    ],
    truth: {
      intended: l("使用雙穩態電子紙顯示多份數位文本的電子閱讀器", "双安定電子紙で複数のデジタル文書を読む電子書籍端末", "Electronic reader using bistable electronic paper for multiple digital texts"),
      operation: l("儲存數位文件，翻頁時重排帶電顏料粒子；靜止頁面幾乎不需供電。", "デジタル文書を保存し、頁更新時に帯電顔料粒子を並べ替える。静止表示はほぼ無給電。", "Stores digital documents and rearranges charged pigment particles on page turns; a static page needs almost no power."),
      caution: l("未知電池可能膨脹，畫面內容來源與權限也未知；喚醒前先隔離檢查。", "未知電池は膨張の恐れ、画面内容の来歴・権限も不明。起動前に隔離検査。", "The unknown battery may swell, and content provenance is unclear; isolate and inspect before waking."),
    },
    panel: {
      rinnosuke: l("它叫電子書籍閱讀器，用途是讀書。紙頁不需要電才能存在，所以它沒電後仍顯示，並不比普通書更神秘。", "電子書籍端末で、用途は読書。紙頁も存在に電力を要しない。電池切れで表示が残るのは普通の本より神秘的ではない。", "It is an electronic book reader, used for reading. Paper pages need no power to exist either; persisting after power loss is no more mysterious than an ordinary book."),
      ran: l("畫面顯示的是一個版本的一個頁面，不是整件館藏。編目時必須把裝置、文件、版本與可見頁分開。", "画面は一版の一頁で、蔵書全体ではない。端末・文書・版・可視頁を分けて目録する。", "The display is one page of one version, not the whole holding. Catalogue device, document, edition, and visible page separately."),
      nitori: l("我想讓它翻一頁，也想知道自己為什麼想。這通常表示先做電池模型，而不是拿現成電源碰碰運氣。", "一頁めくりたいし、なぜそうしたいかも考える。こういう時は既製電源で賭けず、電池模型からだ。", "I want to turn one page, and I want to know why I want that. This usually means building a battery model instead of gambling with a handy supply."),
      kogasa: l("它七年都停在一句話中間。也許不是不能翻頁，只是終於有人願意等它把這一頁待完。", "七年も文の途中にいる。めくれないんじゃなく、ようやく誰かがこの頁を居終えるまで待ってくれたのかも。", "It has spent seven years inside one sentence. Perhaps it cannot turn—or perhaps someone finally agreed to wait until it finishes being on this page."),
    },
    agencyBase: 3,
  },
];

export function appraisalObject(id) {
  return appraisalObjects.find((item) => item.id === id);
}
