const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });

export const housingFacets = {
  roomTypes: {
    single: l("單人室", "一人室", "Single"),
    twin: l("雙人室", "二人室", "Twin"),
    cluster: l("三人組室", "三人ユニット", "Three-person cluster"),
  },
  features: {
    moonShield: l("遮月簾與低刺激燈", "遮月幕・低刺激灯", "Moon screen & low-stimulus lamps"),
    waterAccess: l("室內水道／近水平台", "室内水路・親水デッキ", "Indoor channel / waterside deck"),
    wideFlight: l("大翼展回旋廊", "大翼幅旋回廊", "Wide-span flight gallery"),
    broomRack: l("掃帚與飛具架", "箒・飛行具架", "Broom & flight rack"),
    phaseMarked: l("牆面穿越標線", "壁抜け標線", "Wall-passage markings"),
    familiarBay: l("使魔休息格", "使い魔休憩区画", "Familiar bay"),
    quietWard: l("夜間靜音結界", "夜間静音結界", "Night quiet ward"),
    workshop: l("耐爆工作桌", "耐爆作業机", "Blast-resistant workbench"),
    kitchen: l("共用小廚房", "共同簡易厨房", "Shared kitchenette"),
    garden: l("藥草／日照庭", "薬草・日照庭", "Herb and sun garden"),
  },
};

export const residences = [
  {
    id: "hakurei-east",
    mark: "博",
    name: l("博麗東寮", "博麗東寮", "Hakurei East Hall"),
    area: l("博麗門外・舊參道", "博麗門外・旧参道", "Old approach beyond Hakurei Gate"),
    description: l(
      "從兩間舊參拜客棧拼成的木造宿舍，離共同講堂最近。雨天屋簷會漏一條很準的直線，自治會堅稱那是天然時鐘。",
      "二軒の旧参拝宿を繋いだ木造寮。共通講堂に最も近い。雨の日は軒から正確な一本線で漏り、自治会は天然時計だと主張する。",
      "A timber hall joined from two former pilgrim inns, closest to the common lecture rooms. In rain, one eave leaks in a perfectly straight line; the hall council calls it a natural clock.",
    ),
    warden: l("舍監：博麗靈夢（每週實際出席約兩日）", "寮監：博麗霊夢（実出勤は週およそ二日）", "Warden: Reimu Hakurei (physically present about two days a week)"),
    notice: l("賽錢箱不是洗衣費投入口。上週投入的三枚硬幣恕不退還。", "賽銭箱は洗濯代投入口ではありません。先週の三枚は返却しません。", "The donation box is not the laundry payment slot. Last week’s three coins will not be returned."),
    distance: l("共同講堂步行 4 分", "共通講堂 徒歩4分", "4 min walk to Common Hall"),
    features: ["quietWard", "kitchen", "garden", "broomRack"],
  },
  {
    id: "misty-north",
    mark: "霧",
    name: l("霧湖北寮", "霧湖北寮", "Misty Lake North Hall"),
    area: l("霧之湖北岸・圖書館後側", "霧の湖北岸・図書館裏", "North shore, behind the library"),
    description: l(
      "半座在岸上，半座由河童樁柱撐在水面。水生住戶可從下層水門回房；旱生住戶必須記得哪扇門底下真的有地板。",
      "半分は岸、半分は河童の杭で水上に立つ。水棲の居住者は下階水門から帰室可能。陸棲者は、どの扉の下に本当に床があるか覚えること。",
      "Half rests on shore and half on kappa piles over the lake. Aquatic residents may enter through the lower water gate; terrestrial residents must remember which doors genuinely have floors beneath them.",
    ),
    warden: l("舍監：大妖精／維修：河童第六水班", "寮監：大妖精／整備：河童第六水班", "Warden: Daiyousei / Maintenance: Kappa Water Crew Six"),
    notice: l("凌晨後禁止在廊橋上試飛。吸血鬼不在「鳥類例外」內。", "深夜の渡り廊下試飛は禁止。吸血鬼は「鳥類例外」に含みません。", "No test flights on the bridge after midnight. Vampires do not qualify for the bird exception."),
    distance: l("霧湖圖書館步行 2 分", "霧の湖図書館 徒歩2分", "2 min walk to Misty Lake Library"),
    features: ["waterAccess", "wideFlight", "familiarBay", "kitchen"],
  },
  {
    id: "bamboo-lantern",
    mark: "竹",
    name: l("竹燈寮", "竹灯寮", "Bamboo Lantern Hall"),
    area: l("迷途竹林・第四盞藍燈後", "迷いの竹林・第四青灯の先", "Past the fourth blue lantern, Bamboo Forest"),
    description: l(
      "永遠亭與本校共管的夜間宿舍，設有遮月簾、藥草庭與兔車末班接駁。第四盞燈偶爾自稱第三盞，遲到證明需由至少兩隻兔子簽名。",
      "永遠亭と本学が共同管理する夜間寮。遮月幕、薬草庭、兎車最終便あり。第四灯は時々第三灯を名乗るため、遅刻証明には兎二名以上の署名が必要。",
      "A night residence jointly managed with Eientei, with moon screens, herb gardens, and the last rabbit shuttle. The fourth lantern sometimes claims to be the third; lateness slips require two rabbit signatures.",
    ),
    warden: l("舍監：鈴仙・優曇華院・因幡／值夜：因幡帝自行排班", "寮監：鈴仙・優曇華院・イナバ／宿直：てゐが自称編成", "Warden: Reisen Udongein Inaba / Night rota: allegedly arranged by Tewi"),
    notice: l("滿月前後三夜，東翼談話室改為低刺激區。撲克牌聲不屬於醫療警報。", "満月前後三夜、東翼談話室は低刺激区画。トランプの音は医療警報ではありません。", "For three nights around the full moon, the east lounge becomes low-stimulus. Card-game noises are not medical alarms."),
    distance: l("永遠亭夜診步行 6 分／兔車 3 分", "永遠亭夜診 徒歩6分／兎車3分", "6 min walk / 3 min rabbit shuttle to Eientei"),
    features: ["moonShield", "quietWard", "garden", "familiarBay"],
  },
  {
    id: "youkai-workshop",
    mark: "工",
    name: l("妖怪山工房寮", "妖怪山工房寮", "Youkai Mountain Workshop Hall"),
    area: l("妖怪山中腹・舊索道站", "妖怪の山中腹・旧索道駅", "Old cable station, mid-mountain"),
    description: l(
      "由廢棄索道站、兩節外界貨車與一段尚在運轉的水管構成。工房層二十四小時可用，但每次爆炸後都必須把『預定內／預定外』貼紙貼對。",
      "廃索道駅、外の貨車二両、まだ稼働中の水管で構成。工房階は24時間利用可。ただし爆発後は「予定内／予定外」の札を正しく貼ること。",
      "Built from an abandoned cable station, two Outside freight cars, and one pipe still in service. The workshop floor is open all day; after any explosion, place the “planned / unplanned” label correctly.",
    ),
    warden: l("舍監：河城荷取／實際鑰匙持有人：至少九名", "寮監：河城にとり／実際の鍵所持者：最低九名", "Warden: Nitori Kawashiro / Actual key holders: at least nine"),
    notice: l("北梯仍以河童膠帶維修。『已撐過一百三十日』不是永久修復認證。", "北階段は河童テープで仮修理中。「130日耐えた」は恒久修理認証ではありません。", "The north stair remains repaired with kappa tape. “It lasted 130 days” is not permanent certification."),
    distance: l("工程院風路 5 分／步行 19 分", "工学部 風路5分／徒歩19分", "5 min by windway / 19 min on foot to Engineering"),
    features: ["workshop", "wideFlight", "broomRack", "waterAccess"],
  },
  {
    id: "boundary-annex",
    mark: "界",
    name: l("境界別館", "境界別館", "Boundary Annex"),
    area: l("本部西側・地址背面", "本部西側・住所の裏", "West of Main Hall, behind its address"),
    description: l(
      "正面看有三層，從後門進去偶爾是四層。牆面穿越標線、失物回送縫與跨時區廚房都經過校務處『暫時承認』，但房間坪數仍拒絕相加。",
      "正面は三階建て、裏口から入ると時々四階。壁抜け標線、忘れ物返送隙間、時差厨房は学務課が「暫定承認」。ただし各室面積は足し算を拒む。",
      "It appears three storeys from the front and occasionally four from the rear door. Wall-passage markings, a lost-property return seam, and a cross-time-zone kitchen are “provisionally recognised”; the room areas still refuse to add up.",
    ),
    warden: l("舍監：八雲藍／房號顧問：八雲紫（未受邀）", "寮監：八雲藍／室番号顧問：八雲紫（非招請）", "Warden: Ran Yakumo / Room-number consultant: Yukari Yakumo (uninvited)"),
    notice: l("請勿穿過貼有紅叉的牆。紅叉若在另一側，請先向那一側申請。", "赤い×印の壁を抜けないこと。印が反対側にある場合、先に反対側へ申請してください。", "Do not pass through walls marked with a red X. If the X is on the other side, apply from that side first."),
    distance: l("My TU 櫃檯步行 3 分（同一日期內）", "My TU窓口 徒歩3分（同一日付内）", "3 min to My TU desk (within the same date)"),
    features: ["phaseMarked", "quietWard", "familiarBay", "kitchen"],
  },
];

export const housingRooms = [
  { id: "HE-203", residence: "hakurei-east", type: "twin", fee: 16800, beds: 2, openBeds: 1, features: ["quietWard", "kitchen", "broomRack"], roommate: "sumire" },
  { id: "HE-108", residence: "hakurei-east", type: "single", fee: 22600, beds: 1, openBeds: 1, features: ["quietWard", "garden"], roommate: null },
  { id: "HE-305", residence: "hakurei-east", type: "cluster", fee: 14200, beds: 3, openBeds: 1, features: ["kitchen", "broomRack", "familiarBay"], roommate: "rin" },
  { id: "MN-W12", residence: "misty-north", type: "twin", fee: 18100, beds: 2, openBeds: 1, features: ["waterAccess", "wideFlight"], roommate: "nagi" },
  { id: "MN-A07", residence: "misty-north", type: "cluster", fee: 15300, beds: 3, openBeds: 1, features: ["waterAccess", "familiarBay", "kitchen"], roommate: "lumi" },
  { id: "BL-E16", residence: "bamboo-lantern", type: "twin", fee: 17400, beds: 2, openBeds: 1, features: ["moonShield", "quietWard", "garden"], roommate: "tsukino" },
  { id: "BL-S03", residence: "bamboo-lantern", type: "single", fee: 23900, beds: 1, openBeds: 1, features: ["moonShield", "quietWard"], roommate: null },
  { id: "YW-C4", residence: "youkai-workshop", type: "cluster", fee: 14900, beds: 3, openBeds: 1, features: ["workshop", "wideFlight", "broomRack"], roommate: "kuroha" },
  { id: "YW-F9", residence: "youkai-workshop", type: "twin", fee: 18800, beds: 2, openBeds: 1, features: ["workshop", "waterAccess"], roommate: "suzu" },
  { id: "BA-2.5", residence: "boundary-annex", type: "twin", fee: 19300, beds: 2, openBeds: 1, features: ["phaseMarked", "quietWard", "familiarBay"], roommate: "matoi" },
  { id: "BA-404", residence: "boundary-annex", type: "single", fee: 24100, beds: 1, openBeds: 1, features: ["phaseMarked", "kitchen"], roommate: null },
  { id: "BA-YD", residence: "boundary-annex", type: "cluster", fee: 15700, beds: 3, openBeds: 1, features: ["phaseMarked", "familiarBay", "kitchen"], roommate: "chiya" },
];

export const roommateProfiles = [
  {
    id: "sumire", seal: "鈴", name: l("鈴庭菫", "鈴庭すみれ", "Sumire Suzuniwa"), kind: l("人類", "人間", "Human"),
    school: l("歷史記錄學院・二年", "歴史記録学部・2年", "History & Records · Year 2"),
    bio: l("寺子屋出身的校報校對，早睡，但會在清晨把昨日的錯字貼到門上。", "寺子屋出身の校報校正。早寝だが、早朝に昨日の誤植を扉へ貼る。", "A terakoya-trained campus-paper proofreader. Sleeps early, then posts yesterday’s typos on the door at dawn."),
    habits: { sleep: "early", noise: "quiet", cleanliness: "neat", cooking: "shared", moon: "ordinary", water: "dry", flight: "ground", wall: "solid", familiar: "small", danmaku: "outdoors" },
  },
  {
    id: "rin", seal: "燐", name: l("火野燐", "火野りん", "Rin Hino"), kind: l("妖怪獸", "妖獣", "Youkai beast"),
    school: l("信仰與共生政策學院・一年", "信仰・共生政策学部・1年", "Faith & Coexistence · Year 1"),
    bio: l("負責神社、寺院與道觀活動的失物交換；她的小火鼠把襪子當作公共資源。", "神社・寺・道観行事の遺失物交換担当。小さな火鼠は靴下を公共資源だと思っている。", "Runs lost-property exchanges between shrine, temple, and mausoleum events. Her tiny fire mouse regards socks as public resources."),
    habits: { sleep: "shifting", noise: "social", cleanliness: "relaxed", cooking: "night", moon: "ordinary", water: "dry", flight: "ground", wall: "solid", familiar: "small", danmaku: "indoor" },
  },
  {
    id: "nagi", seal: "凪", name: l("水綾凪", "水綾なぎ", "Nagi Mizua"), kind: l("河童", "河童", "Kappa"),
    school: l("河童工程學院・三年", "河童工学部・3年", "Kappa Engineering · Year 3"),
    bio: l("維修宿舍下層水門，睡眠時間由水壓決定；會把淋浴間的異音列成工單。", "寮下層水門を整備し、水圧で睡眠時刻が決まる。浴室の異音はすべて作業票にする。", "Maintains the lower water gate and sleeps according to water pressure. Every strange shower noise becomes a maintenance ticket."),
    habits: { sleep: "shifting", noise: "quiet", cleanliness: "neat", cooking: "shared", moon: "ordinary", water: "must", flight: "ground", wall: "solid", familiar: "none", danmaku: "outdoors" },
  },
  {
    id: "lumi", seal: "灯", name: l("露米・暮光", "ルミ・トワイライト", "Lumi Twilight"), kind: l("夜雀", "夜雀", "Night sparrow"),
    school: l("天狗新聞傳播學院・一年", "天狗新聞報道学部・1年", "Tengu Journalism · Year 1"),
    bio: l("凌晨錄製湖畔聲景，白天睡覺；保證歌聲不超過走廊第四盞燈，測量方法未公開。", "深夜に湖畔音景を収録し、昼に眠る。歌声は廊下の第四灯を越えないと保証するが、測定法は非公開。", "Records lakeside soundscapes after midnight and sleeps by day. Promises her singing never passes the fourth corridor lamp; the method is unpublished."),
    habits: { sleep: "late", noise: "social", cleanliness: "relaxed", cooking: "night", moon: "active", water: "near", flight: "small", wall: "solid", familiar: "none", danmaku: "outdoors" },
  },
  {
    id: "tsukino", seal: "月", name: l("月野澄", "月野すみ", "Sumi Tsukino"), kind: l("月兔", "月兎", "Moon rabbit"),
    school: l("月都醫藥生命學院・二年", "月都医薬生命学部・2年", "Lunar Medicine & Life · Year 2"),
    bio: l("永遠亭夜診輪值，對滿月與高頻聲敏感；房內藥箱分類精確到誰偷偷挪過一格。", "永遠亭夜診当番。満月と高周波音に敏感。室内薬箱は、誰が一目盛動かしたか分かる精度で分類。", "Works Eientei night-clinic rotations and is sensitive to full moons and high frequencies. Her medicine box is arranged precisely enough to reveal who moved anything one notch."),
    habits: { sleep: "shifting", noise: "quiet", cleanliness: "neat", cooking: "shared", moon: "sensitive", water: "dry", flight: "ground", wall: "solid", familiar: "none", danmaku: "none" },
  },
  {
    id: "kuroha", seal: "羽", name: l("黑羽疾", "黒羽はやて", "Hayate Kuroha"), kind: l("鴉天狗", "鴉天狗", "Crow tengu"),
    school: l("天狗新聞傳播學院・三年", "天狗新聞報道学部・3年", "Tengu Journalism · Year 3"),
    bio: l("晨報攝影記者，大翼展，鬧鐘是從窗外俯衝；承諾不拍室友，除非室友成為公共事件。", "朝刊写真記者で大翼幅。目覚ましは窓外からの急降下。同室者は撮らない、公共事件にならない限り。", "A morning-paper photographer with a wide wingspan. His alarm is a dive past the window. He will not photograph roommates unless they become a public incident."),
    habits: { sleep: "early", noise: "social", cleanliness: "relaxed", cooking: "no", moon: "ordinary", water: "dry", flight: "large", wall: "solid", familiar: "none", danmaku: "outdoors" },
  },
  {
    id: "suzu", seal: "河", name: l("川瀨鈴", "川瀬すず", "Suzu Kawase"), kind: l("河童", "河童", "Kappa"),
    school: l("河童工程學院・二年", "河童工学部・2年", "Kappa Engineering · Year 2"),
    bio: l("研究把漏水轉成第二輸出；房間很整齊，因為所有未分類物都暫存在走廊。", "漏水を第二出力へ変える研究中。部屋は整然、未分類品はすべて廊下へ仮置きするため。", "Studies how leaks become secondary output. Her room is immaculate because every unclassified object is temporarily stored in the corridor."),
    habits: { sleep: "late", noise: "social", cleanliness: "neat", cooking: "night", moon: "ordinary", water: "must", flight: "ground", wall: "solid", familiar: "none", danmaku: "indoor" },
  },
  {
    id: "matoi", seal: "縫", name: l("境縫纏", "境縫まとい", "Matoi Sakaime"), kind: l("隙間妖怪", "隙間妖怪", "Gap youkai"),
    school: l("結界與異變研究院・三年", "境界・異変研究院・3年", "Boundaries & Incidents · Year 3"),
    bio: l("用牆縫送還失物，從不開門；堅稱穿牆前敲牆等同敲門，宿舍委員會尚未表決。", "壁の隙間から遺失物を返し、扉は開けない。壁抜け前のノックは扉のノックと同等と主張し、寮委員会は未採決。", "Returns lost property through wall seams and never opens doors. Claims knocking before phasing is equivalent to knocking on a door; the hall council has not voted."),
    habits: { sleep: "shifting", noise: "quiet", cleanliness: "relaxed", cooking: "no", moon: "ordinary", water: "dry", flight: "ground", wall: "phase", familiar: "none", danmaku: "none" },
  },
  {
    id: "chiya", seal: "茶", name: l("千夜茶々", "千夜ちゃちゃ", "Chacha Senya"), kind: l("付喪神", "付喪神", "Tsukumogami"),
    school: l("歷史記錄學院・一年", "歴史記録学部・1年", "History & Records · Year 1"),
    bio: l("原本是茶屋的長椅，現在收集外界杯子；非常安靜，但使魔與杯子常把窗台排滿。", "元は茶屋の長椅子。今は外のカップを収集。本人は静かだが、使い魔と杯で窓台が埋まる。", "Formerly a teahouse bench, now a collector of Outside cups. Personally quiet, though familiars and cups fill every sill."),
    habits: { sleep: "early", noise: "quiet", cleanliness: "relaxed", cooking: "shared", moon: "ordinary", water: "near", flight: "ground", wall: "phase", familiar: "large", danmaku: "none" },
  },
];

export function residenceById(id) {
  return residences.find((residence) => residence.id === id);
}

export function housingRoom(id) {
  return housingRooms.find((room) => room.id === id);
}

export function roommateById(id) {
  return roommateProfiles.find((profile) => profile.id === id);
}
