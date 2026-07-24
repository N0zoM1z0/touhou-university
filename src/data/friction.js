const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });

export const unresolvedMatters = {
  ayaCorrection: {
    stamp: l("第 11 次訂正", "訂正 第11版", "CORRECTION 11"),
    title: l(
      "院長親授公開訂正；本週需要訂正的頭條也由院長親擬。",
      "学部長が公開訂正を直々に指導。今週訂正が必要な見出しも学部長の直筆。",
      "The dean teaches public corrections. The headline needing correction this week is also hers.",
    ),
    summary: l(
      "《文文。校報》把「三名學生遲到」改成「竹林集體失蹤事件」。當事人全數在食堂，Aya 主張食堂也位於竹林敘事範圍內。",
      "『文々。学報』は「学生三名遅刻」を「竹林集団失踪事件」に変更。当人は全員食堂にいたが、文は食堂も竹林の物語圏だと主張。",
      "Bunbunmaru Campus News turned “three late students” into “Mass Bamboo Disappearance.” All three were in the dining hall; Aya argues the hall lies within bamboo narrative territory.",
    ),
    details: [
      l("承辦", "担当", "Owner"),
      l("天狗新聞傳播學院・更正桌", "天狗新聞報道学部・訂正机", "Tengu Journalism · Correction Desk"),
      l("目前處置", "現在の処置", "Current action"),
      l("標題保留，字級縮小；第十二版正由 Hatate 審讀", "見出しは縮小して存続。第12版をはたてが査読中", "Headline retained at smaller type; Hatate is reviewing version twelve"),
      l("爭點", "争点", "Point of dispute"),
      l("「戲劇性」到底是不是可量化的公共利益", "「劇的であること」は公共利益として測定可能か", "Whether dramatic value is a measurable public benefit"),
    ],
  },
  marisaMaterials: {
    stamp: l("來源欄退件", "出典欄・差戻し", "SOURCE RETURNED"),
    title: l(
      "可重現實驗第七次補件：材料來源仍寫著「森林裡撿的」。",
      "再現実験の第7回追補。素材出典は依然「森で拾った」。",
      "Reproducibility filing, revision seven: material source still says “found it in the forest.”",
    ),
    summary: l(
      "Marisa 已重現三次同樣的爆炸，卻拒絕把兩本魔導書列為借用物，理由是「書自己跟來的」。Patchouli 在每一份複本上蓋了不同顏色的拒絕章。",
      "魔理沙は同じ爆発を三度再現したが、魔導書二冊を借用品に記載せず、「本が勝手についてきた」と説明。パチュリーは全ての写しに別色の却下印を押した。",
      "Marisa reproduced the same explosion three times but refuses to list two grimoires as borrowed because “the books followed me.” Patchouli stamped every copy REJECTED in a different colour.",
    ),
    details: [
      l("承辦", "担当", "Owner"),
      l("七曜實驗塔・材料來源櫃", "七曜実験塔・素材出典棚", "Seven-Day Laboratory · Materials Shelf"),
      l("目前處置", "現在の処置", "Current action"),
      l("實驗准予繼續；書籍不准離開原地，但原地的邊界尚有爭議", "実験は継続可。本は現位置から移動不可。ただし現位置の境界は係争中", "Experiment may continue; books may not leave their current location, whose boundary is disputed"),
      l("爭點", "争点", "Point of dispute"),
      l("「之後會還」能否構成採購方式", "「あとで返す」は調達方式になり得るか", "Whether “I’ll return it later” counts as procurement"),
    ],
  },
  yukariRoom: {
    stamp: l("空間異議", "空間異議", "SPATIAL APPEAL"),
    title: l(
      "4-B 教室昨日被重新分類為「出席與缺席之間」。",
      "4-B教室、昨日「出席と欠席の間」に再分類。",
      "Room 4-B was reclassified yesterday as “between present and absent.”",
    ),
    summary: l(
      "八雲教授認為規章只要求人在教室內，未規定教室必須位於校內。七名學生準時抵達，出席系統卻把他們記在下週。",
      "八雲教授は規程が「教室内」を求めるだけで、「教室が学内」とは定めていないと主張。学生七名は定刻に到着したが、出席記録は来週に付いた。",
      "Professor Yakumo notes that rules require students to be inside the room, not the room to be on campus. Seven arrived on time; attendance recorded them next week.",
    ),
    details: [
      l("承辦", "担当", "Owner"),
      l("結界與異變研究院・不存在的二樓", "境界・異変研究院・存在しない二階", "Boundaries & Incidents · Nonexistent Second Floor"),
      l("目前處置", "現在の処置", "Current action"),
      l("補課時間已公告，但公告貼在教室內側", "補講時刻は告知済み。ただし掲示は教室の内側", "Make-up time posted—on the inside of the room"),
      l("爭點", "争点", "Point of dispute"),
      l("制度能否對故意移動的定義點名", "意図的に移動する定義へ制度は出席を取れるか", "Whether policy can take attendance from a definition that moves on purpose"),
    ],
  },
  nitoriTape: {
    stamp: l("臨修第 129 日", "仮修理129日目", "TEMP REPAIR · DAY 129"),
    title: l(
      "河童膠帶列為承重構件後，保固條款突然變得很有創意。",
      "河童テープを耐荷重部材に数えた途端、保証規定が急に創造的になった。",
      "Once kappa tape became a load-bearing part, the warranty wording became highly inventive.",
    ),
    summary: l(
      "Nitori 堅稱北側水管只是「還沒決定何時永久化的臨時版本」。漏水已被接去驅動走廊的小水輪，因此工程院申請把水漬改列為發電設施。",
      "にとりは北側配管を「いつ恒久化するか未定の暫定版」と主張。漏水は廊下の小水車へ接続され、工学部は水染みを発電設備として登録申請中。",
      "Nitori calls the north pipe “a temporary version with an undecided date of permanence.” Its leak now powers a corridor turbine, so Engineering applied to list the damp patch as generation infrastructure.",
    ),
    details: [
      l("承辦", "担当", "Owner"),
      l("河童工程學院・真的只是暫時修一下組", "河童工学部・本当に仮修理班", "Kappa Engineering · Honestly Temporary Repairs"),
      l("目前處置", "現在の処置", "Current action"),
      l("請勿撕膠帶；其中一條目前負責接地", "テープを剥がさないこと。一枚は現在アース線を担当", "Do not remove the tape; one strip currently provides grounding"),
      l("爭點", "争点", "Point of dispute"),
      l("會發電的漏水算事故、設備，還是展示成果", "発電する漏水は事故・設備・展示成果のどれか", "Whether a power-generating leak is an incident, a facility, or an exhibit"),
    ],
  },
  reimuDonation: {
    stamp: l("募金箱追蹤", "賽銭箱追跡", "DONATION BOX TRACE"),
    title: l(
      "博麗門修繕募金箱被靈夢本人搬回神社：『放那邊比較有用。』",
      "博麗門修繕用の賽銭箱を霊夢本人が神社へ移動。「あっちに置くほうが役に立つ」",
      "Reimu moved the Hakurei Gate repair box back to the shrine: “It works better over there.”",
    ),
    summary: l(
      "總務處要求分開「校門修繕」與「巫女生活維持」。Reimu 回覆兩者在雨天是一回事，並附上一張屋頂漏水滴進茶杯的素描。",
      "総務は「校門修繕」と「巫女の生活維持」の分離を要求。霊夢は雨天なら同じことだと答え、屋根の雫が湯呑みに落ちる絵を添えた。",
      "Administration asked her to separate “gate repair” from “shrine maiden upkeep.” Reimu replied that they are the same thing in rain and attached a sketch of roof water dripping into her tea.",
    ),
    details: [
      l("承辦", "担当", "Owner"),
      l("博麗神社・緣側右邊", "博麗神社・縁側の右", "Hakurei Shrine · Right Side of Veranda"),
      l("目前處置", "現在の処置", "Current action"),
      l("募金箱每週二回校；雨天停課時不回", "賽銭箱は週二回登校。雨天休講時は来ない", "The box attends campus twice weekly, except on rain cancellations"),
      l("爭點", "争点", "Point of dispute"),
      l("神社屋頂是否屬於校門的上游設施", "神社屋根は校門の上流設備か", "Whether the shrine roof is upstream infrastructure for the gate"),
    ],
  },
  patchouliLoan: {
    stamp: l("館藏僵局", "蔵書膠着", "STACKS DEADLOCK"),
    title: l(
      "圖書館要求歸還逾期魔導書；帕秋莉要求先歸還被借走的一百二十年。",
      "図書館は延滞魔導書の返却を要求。パチュリーは先に借りられた百二十年を返すよう要求。",
      "The library requests overdue grimoires. Patchouli requests the return of the 120 years borrowed from them.",
    ),
    summary: l(
      "館際互借辦法寫著「稀有館藏不得永久占有」，紅魔館回函在「永久」二字旁註明：對誰而言？案件目前卡在壽命換算表第三頁。",
      "相互貸借規程は「稀覯本を永久占有してはならない」と定める。紅魔館は「永久」の横に「誰にとって？」と注記。案件は寿命換算表3頁で停止中。",
      "Interlibrary policy forbids permanent possession of rare holdings. Scarlet Library annotated “permanent” with “for whom?” The case is stuck on page three of the lifespan conversion table.",
    ),
    details: [
      l("承辦", "担当", "Owner"),
      l("霧湖圖書館・長命種借閱桌", "霧の湖図書館・長命種貸出机", "Misty Lake Library · Long-Life Loans"),
      l("目前處置", "現在の処置", "Current action"),
      l("雙方各自封存對方的催還函", "双方が相手の督促状を封印保存", "Both sides have sealed the other's recall notice"),
      l("爭點", "争点", "Point of dispute"),
      l("借閱期限應以讀者、館員，還是書本的時間感計算", "貸出期限は読者・司書・本の時間感覚のどれで計るか", "Whether loan time follows the reader, librarian, or book"),
    ],
  },
};

export const faithFaculty = {
  byakuren: {
    glyph: "蓮",
    name: l("聖 白蓮", "聖 白蓮", "Byakuren Hijiri"),
    role: l("宗教共生與寺院公共生活教授", "宗教共生・寺院公共生活 教授", "Professor of Religious Coexistence & Temple Public Life"),
    summary: l(
      "她主張妖怪與人類能在同一張桌上吃飯，但也會當場指出：歡迎並不代表寺院必須為每一種方便讓路。她和神子共同授課時，課程名稱通常在開課前改三次。",
      "人間と妖怪が同じ食卓を囲めると説く一方、「歓迎」は寺が全ての都合に譲ることではないとその場で指摘する。神子との共同授業は開講前に科目名が三度変わりがち。",
      "She argues that humans and youkai can share one table, while insisting that welcome does not make the temple serve every convenience. Courses co-taught with Miko usually change title three times before opening.",
    ),
    course: l("FCP-214 寺院、妖怪與晚餐後的爭論", "FCP-214 寺・妖怪・夕食後の議論", "FCP-214 Temples, Youkai & Arguments After Supper"),
    tension: l("拒絕把共生做成漂亮口號，也拒絕讓招生宣傳借用寺院法會當背景。", "共生を美辞麗句にせず、入試広報が法会を背景に使うことも拒む。", "Refuses to turn coexistence into a slogan—or let admissions use temple rites as scenery."),
  },
  kanako: {
    glyph: "柱",
    name: l("八坂 神奈子", "八坂 神奈子", "Kanako Yasaka"),
    role: l("信仰基礎設施與公共工程教授", "信仰基盤・公共事業 教授", "Professor of Faith Infrastructure & Public Works"),
    summary: l(
      "她帶著索道、供水與祭典動線圖進教室，喜歡把反對意見直接寫進第二版計畫。問題是第一版往往已經動工；河童工程院稱這叫『具有神速決策力的前期調查』。",
      "索道・給水・祭礼動線図を教室へ持ち込み、反対意見を第2案へ直接書き込む。問題は第1案がすでに着工済みなこと。河童工学部は「神速な意思決定を伴う事前調査」と呼ぶ。",
      "She brings ropeway, water, and festival-flow plans to class and writes objections straight into version two. The problem is that version one is often already under construction; Kappa Engineering calls it “preliminary research with divine-speed decisions.”",
    ),
    course: l("FCP-241 信仰經濟與不肯等預算的工程", "FCP-241 信仰経済と予算を待たない工事", "FCP-241 Faith Economies & Projects That Won't Wait for Budget"),
    tension: l("要求一切傳統證明能活下去；其他教席則要求她別先把證明蓋成索道。", "伝統に存続可能性の証明を求める。他教員は、証明を先に索道として建てないよう求める。", "Asks every tradition to prove it can survive; colleagues ask her not to build the proof as a ropeway first."),
  },
  miko: {
    glyph: "聽",
    name: l("豐聰耳 神子", "豊聡耳 神子", "Toyosatomimi no Miko"),
    role: l("公共欲望、代表與領導修辭教授", "公共欲望・代表・指導修辞 教授", "Professor of Public Desire, Representation & Leadership"),
    summary: l(
      "她能同時聽見十個人的欲望，並在第十一個人開口前給出漂亮總結。學生最重要的作業不是被她聽見，而是把那份過度漂亮的總結逐句駁回。",
      "十人の欲を同時に聞き、十一人目が口を開く前に美しい要約を出す。学生の最重要課題は聞かれることではなく、その整いすぎた要約へ一文ずつ反論すること。",
      "She can hear ten desires at once and produce an elegant summary before person eleven speaks. The key assignment is not to be heard, but to rebut that too-perfect summary line by line.",
    ),
    course: l("FCP-266 聽見十個人不等於代表十個人", "FCP-266 十人を聞くことは十人を代表しない", "FCP-266 Hearing Ten People Is Not Representing Ten People"),
    tension: l("她真心願意修正判斷，但通常要有人先在全場面前證明她判斷得太快。", "判断を改める意志は本物だが、まず誰かが公衆の前で性急さを証明する必要がある。", "She genuinely revises a judgment—but usually only after someone proves in public that she judged too quickly."),
  },
  sanae: {
    glyph: "奇",
    name: l("東風谷 早苗", "東風谷 早苗", "Sanae Kochiya"),
    role: l("祭典設計與外界文化轉譯講師", "祭礼設計・外界文化翻訳 講師", "Lecturer in Festival Design & Outside-World Translation"),
    summary: l(
      "她會做表格、借擴音器、畫排隊線，也會興奮地保證『外界的大學都這樣』。當全院發現外界根本不這樣時，她會認真貼出訂正——再立刻提出更大的奇蹟示範。",
      "表を作り、拡声器を借り、待機列を引き、「外の大学はみんなこうです」と元気に保証する。違うと判明すれば真剣に訂正を貼り、その直後さらに大きな奇跡実演を提案する。",
      "She makes spreadsheets, borrows loudspeakers, paints queue lines, and cheerfully promises that “Outside universities all do this.” When they do not, she posts an earnest correction—then immediately proposes a larger miracle demonstration.",
    ),
    course: l("FCP-118 奇蹟、擴音器與被雨淋掉的流程表", "FCP-118 奇跡・拡声器・雨で滲んだ進行表", "FCP-118 Miracles, Megaphones & Rain-Smeared Run Sheets"),
    tension: l("她負責讓四個宗教勢力準時開會；四個勢力都認為準時是對自己的特殊要求。", "四宗教勢力を定刻に集める担当。四勢力とも定刻は自分だけへの特別要求だと思っている。", "She gets four religious blocs to meetings on time; each bloc thinks punctuality is a special demand placed only on them."),
  },
};

export const faithReview = {
  name: l("四季映姬・夜摩仙那度", "四季映姫・ヤマザナドゥ", "Eiki Shiki, Yamaxanadu"),
  role: l("校外申訴審查・每月最後一個彼岸日到校", "学外異議審査・毎月最後の彼岸日に来校", "External appeals examiner · visits on the last Higan day each month"),
  note: l(
    "她不替任何教席調停理念，只會把行為、理由與後果分成三欄。上月最長的判詞只有一句：「你們每一方都少聽了一個人。」",
    "理念の仲裁はせず、行為・理由・結果を三欄に分ける。先月最長の判決文は一文だけ。「全員が一人ずつ聞き落としています。」",
    "She does not mediate doctrine; she separates action, reason, and consequence into three columns. Last month's longest ruling was one sentence: “Every side failed to hear one person.”",
  ),
};
