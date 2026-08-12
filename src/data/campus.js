const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });

export const campusFeatures = {
  library: {
    kicker: "01 / STUDY · MISTY LAKE",
    title: l("霧湖圖書館・夜間閱覽", "霧の湖図書館・夜間閲覧", "Misty Lake Library · Night Reading"),
    summary: l(
      "北翼閱覽室開放至丑時二刻；會自行移動的館藏，請在最後一次看見的位置留下書籤。",
      "北翼閲覧室は丑二刻まで開館。自走する蔵書には、最後に見た場所へ栞を残してください。",
      "The north-wing reading room stays open until the second quarter of the Ox hour. Leave a bookmark where you last saw any self-moving volume.",
    ),
    details: [
      l("本夜席位", "今夜の座席", "Seats tonight"),
      "36",
      l("特別服務", "特別サービス", "Special service"),
      l("跨館魔導書調閱", "魔導書相互貸借", "Grimoire interlibrary loans"),
    ],
    action: l("查詢閱覽室", "閲覧室を検索", "Find a reading room"),
    service: "availability",
  },
  workshop: {
    kicker: "02 / FIELDWORK · YOUKAI MOUNTAIN",
    title: l("妖怪山・河童聯合工房", "妖怪の山・河童共同工房", "Youkai Mountain · Kappa Joint Workshop"),
    summary: l(
      "水輪試驗渠、風速塔與防水原型間對學生開放。任何會轉動的零件，在下水前都要能徒手停機。",
      "水車試験水路、風速塔、防水試作室を学生に開放。回転部品は進水前に手動停止できること。",
      "The turbine channel, wind tower, and waterproof prototype rooms are open to students. Every moving part must be stoppable by hand before launch.",
    ),
    details: [
      l("今日風況", "本日の風況", "Wind today"),
      l("山谷風 3 級", "谷風 3級", "Valley wind, force 3"),
      l("借用裝備", "貸出装備", "Loan equipment"),
      l("雨具・護目鏡", "雨具・保護眼鏡", "Rain gear · goggles"),
    ],
    action: l("查看工房空間", "工房の空きを見る", "View workshop rooms"),
    service: "availability",
  },
  festival: {
    kicker: "03 / FESTIVAL · SPRING TERM",
    title: l("春季符卡燈會", "春季スペルカード灯会", "Spring Spell-card Lantern Festival"),
    summary: l(
      "學生社團以非攻擊性光彈設計校園夜空；每組作品必須申報終止條件、觀眾距離與落下物回收方法。",
      "学生団体が非攻撃性光弾で夜空を設計。各作品は終了条件、観客距離、落下物回収方法を申告します。",
      "Student groups design the night sky with non-aggressive light danmaku. Every entry declares its stop condition, audience distance, and debris recovery plan.",
    ),
    details: [
      l("下次舉行", "次回開催", "Next event"),
      l("四月第一個滿月", "四月最初の満月", "First full moon of April"),
      l("參展名額", "出展枠", "Exhibition places"),
      l("24 組", "24組", "24 teams"),
    ],
    action: l("進入祭典營運室", "祭典運営室へ", "Enter festival operations"),
    route: "festival-operations",
  },
};

export const clubs = {
  grimoire: {
    glyph: "本",
    name: l("魔導書修復會", "魔導書修復会", "Grimoire Restoration Society"),
    focus: l("紙張、裝幀與會咬人的書角", "紙・製本・噛みつく本の角", "Paper, binding, and books that bite"),
    description: l(
      "修補受潮、灼傷與自行改寫頁碼的魔導書。新生第一堂不是施法，而是學會辨認什麼時候應該把書合上。",
      "湿気、焦げ、自動改頁に傷んだ魔導書を修復。新入生の初回は魔法ではなく、本を閉じるべき時を学びます。",
      "Repairs grimoires damaged by damp, burns, and self-rewriting page numbers. A new member's first lesson is not magic, but knowing when to close the book.",
    ),
    meeting: l("週二・霧湖圖書館北翼", "火曜・霧の湖図書館北翼", "Tuesdays · Misty Lake Library north wing"),
    members: "18",
    project: l("百年索引卡除魅計畫", "百年目録カード除魅計画", "Century-old catalogue-card de-charming"),
  },
  hisoutensoku: {
    glyph: "則",
    name: l("非想天則研究會", "非想天則研究会", "Hisoutensoku Research Society"),
    focus: l("巨大機構、目擊史與尺寸爭議", "巨大機構・目撃史・寸法論争", "Giant mechanisms, sightings, and size disputes"),
    description: l(
      "工程生、史學生與熱情過剩的目擊者共同校勘巨型機構紀錄。社規第一條：沒有比例尺的照片只能算氣氛證據。",
      "工学・史学の学生と熱心すぎる目撃者が巨大機構の記録を照合。会則第一条：縮尺のない写真は雰囲気資料です。",
      "Engineering and history students compare giant-machine records with extremely enthusiastic witnesses. Rule one: a photo without scale is atmospheric evidence only.",
    ),
    meeting: l("隔週四・境界講堂 108", "隔週木曜・境界講堂108", "Alternate Thursdays · Boundary Hall 108"),
    members: "31",
    project: l("校園鐘樓高度對照觀測", "校内時計塔の高度比較観測", "Campus clocktower height comparison"),
  },
  bamboo: {
    glyph: "竹",
    name: l("竹林定向部", "竹林オリエンテーリング部", "Bamboo Navigation Club"),
    focus: l("不依賴直線的方向感", "直線に頼らない方向感覚", "Direction without relying on straight lines"),
    description: l(
      "練習在道路、記憶與月光都不可靠時安全回返。活動不競速；能帶完整隊伍回來才算完成。",
      "道、記憶、月光が頼れない時の安全な帰還を練習。競走ではなく、全員で戻って初めて完了です。",
      "Practises safe return when roads, memory, and moonlight are unreliable. It is not a race; the route is complete only when the whole team returns.",
    ),
    meeting: l("週六黎明・竹林東口", "土曜明け方・竹林東口", "Saturday dawn · east bamboo gate"),
    members: "27",
    project: l("十八支無字引導樁測試", "十八本の無文字案内杭試験", "Eighteen non-text guide-post trial"),
  },
  fairyChoir: {
    glyph: "唱",
    name: l("妖精合唱團", "妖精合唱団", "Fairy Choir"),
    focus: l("短期記憶、複調與重新開始", "短期記憶・複調・再開始", "Short memory, polyphony, and starting again"),
    description: l(
      "曲目被設計成即使忘記上一段，也能從風聲或鄰座重新加入。每次排練通常有三個不同版本的結尾。",
      "前節を忘れても風音や隣席から戻れる曲を練習。毎回の稽古には通常、三種類の終わりがあります。",
      "Music is designed so anyone who forgets the last phrase can re-enter from the wind or a neighbour. Most rehearsals produce three different endings.",
    ),
    meeting: l("週三黃昏・霧湖水上台", "水曜夕暮れ・霧の湖水上舞台", "Wednesday dusk · Misty Lake floating stage"),
    members: "46",
    project: l("《四季同時發生》新生公演", "『四季同時発生』新歓公演", "Four Seasons at Once welcome concert"),
  },
  teaNews: {
    glyph: "訂",
    name: l("茶與新聞倫理社", "茶と報道倫理会", "Tea & News Ethics Society"),
    focus: l("慢速報、標題與公開訂正", "遅い速報・見出し・公開訂正", "Slow breaking news, headlines, and corrections"),
    description: l(
      "每週挑一則看起來非立刻刊出不可的消息，泡完第二壺茶後再決定標題。錯字與錯判分開訂正。",
      "毎週「今すぐ出すべき」に見えるニュースを選び、二煎目の茶の後で見出しを決定。誤字と誤判断は別々に訂正します。",
      "Each week the society picks one story that seems impossible to delay, then chooses the headline after a second pot of tea. Typos and bad judgment receive separate corrections.",
    ),
    meeting: l("週五・天狗新聞館露台", "金曜・天狗新聞館テラス", "Fridays · Tengu News Hall terrace"),
    members: "22",
    project: l("校慶速報延遲十分鐘實驗", "大学祭速報10分遅延実験", "Ten-minute anniversary-news delay trial"),
  },
  nightSparrow: {
    glyph: "膳",
    name: l("夜雀音樂食堂", "夜雀音楽食堂", "Night-Sparrow Music Dining Hall"),
    focus: l("晚食、音場與不看菜單點餐", "夜食・音場・メニューを見ない注文", "Supper, sound fields, and ordering without sight"),
    description: l(
      "把音樂實作與深夜供餐放在同一張排程上。演出太響時，湯麵暫停供應；八目鰻永遠有備份。",
      "音楽実習と深夜食を同じ時間割に配置。演奏が大きすぎる時は汁麺を停止、八目鰻は常に予備があります。",
      "Music practice and late-night meals share one timetable. Soup noodles pause when the set gets too loud; lamprey always has a backup.",
    ),
    meeting: l("每日 17:30 後・南食堂", "毎日17:30以降・南食堂", "Daily after 17:30 · South Dining Hall"),
    members: "39",
    project: l("滿月低刺激晚餐場", "満月低刺激ディナー", "Low-stimulus full-moon supper"),
  },
  ufo: {
    glyph: "空",
    name: l("不明飛行物觀測會", "未確認飛行物体観測会", "Unidentified Flying Object Society"),
    focus: l("先觀測，再決定是不是盤子", "観測してから皿か決める", "Observe first, decide whether it is a plate later"),
    description: l(
      "共享望遠鏡、素描本與極嚴格的『不知道』欄位。任何結論至少要排除天狗、傘、雲和真的飛碟。",
      "望遠鏡、スケッチ帳、厳格な「不明」欄を共有。結論前に天狗、傘、雲、本物の飛皿を除外します。",
      "Shares telescopes, sketchbooks, and a very strict unknown field. Any conclusion must first rule out tengu, umbrellas, clouds, and actual flying saucers.",
    ),
    meeting: l("晴夜・七曜實驗塔屋頂", "晴夜・七曜実験塔屋上", "Clear nights · Seven-Day Laboratory roof"),
    members: "24",
    project: l("夏季無主光點年表", "夏季無主光点年表", "Summer unclaimed-light chronology"),
  },
  ordinaryMagic: {
    glyph: "星",
    name: l("普通的魔法實驗社", "普通の魔法実験会", "Ordinary Magic Laboratory Society"),
    focus: l("可重現失敗與星光火花", "再現可能な失敗・星光火花", "Reproducible failure and starlight sparks"),
    description: l(
      "不以火力排序，只看實驗能否被另一個人照著筆記重現。借來的材料必須寫進來源欄。",
      "火力では順位を付けず、他者が記録から再現できるかを評価。借りた材料は出典欄へ記載します。",
      "Ranks no one by firepower; an experiment succeeds when someone else can reproduce it from the notes. Borrowed materials must appear in the source field.",
    ),
    meeting: l("週一・七曜實驗塔側棟", "月曜・七曜実験塔別棟", "Mondays · Seven-Day Laboratory annex"),
    members: "33",
    project: l("一百種熄火方式公開展", "百通りの消火方法公開展", "One Hundred Ways to Extinguish public show"),
  },
};
