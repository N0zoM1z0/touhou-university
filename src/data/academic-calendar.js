import { campusDayKey, campusLunarPhase, campusTimeBand } from "./campus-time.js";

const l = (zhHant, ja, en) => ({ "zh-Hant": zhHant, ja, en });
const edgeKey = (a, b) => [a, b].sort().join("--");

export const academicSeasons = {
  spring: {
    glyph: "花",
    name: l("花見與未融雪季", "花見・未融雪季", "Blossom & Unmelted Snow"),
    months: [2, 3, 4],
    note: l("春天已到；白玉樓尚未簽收。", "春は到着済み、白玉楼は未受領。", "Spring has arrived; Hakugyokurou has not signed for it."),
  },
  rain: {
    glyph: "雨",
    name: l("梅雨與紙張鎮壓季", "梅雨・紙押さえ季", "Rain & Paperweight Season"),
    months: [5],
    note: l("公告有效，但右下角的日期可能已流走。", "告知は有効。ただし右下の日付は流出した可能性。", "Notices remain valid; the date in the lower-right may have run off."),
  },
  summer: {
    glyph: "夜",
    name: l("夜雀晚食與夏夜實習季", "夜雀夜食・夏夜実習季", "Night-Sparrow Supper & Summer Field Season"),
    months: [6, 7],
    note: l("白天課少一點，夜間麻煩多一點。", "昼の授業は少なめ、夜の騒動は多め。", "Fewer daylight classes, more nocturnal complications."),
  },
  autumn: {
    glyph: "楓",
    name: l("紅葉、收穫與神社祭季", "紅葉・収穫・神社祭季", "Maple, Harvest & Shrine Festival Season"),
    months: [8, 9, 10],
    note: l("三方祭典共用一份日曆，但不共用正門。", "三祭典は暦を共有するが正門は共有しない。", "Three festivals share a calendar, not a main gate."),
  },
  winter: {
    glyph: "雪",
    name: l("冬眠與寒期實習季", "冬眠・寒期実習季", "Hibernation & Winter Placement Season"),
    months: [11, 0, 1],
    note: l("冬眠不算缺席；前提是睡前交了表。", "冬眠は欠席ではない。眠る前に届出済みなら。", "Hibernation is not absence if the form was filed before sleep."),
  },
};

const event = ({
  id,
  code,
  glyph,
  title,
  window,
  premise,
  details,
  impacts,
  tags,
  month,
  dayStart,
  dayEnd,
  lunar,
  timeBands,
  annual = true,
}) => ({
  id,
  code,
  glyph,
  title,
  window,
  premise,
  details,
  impacts,
  tags,
  month,
  dayStart,
  dayEnd,
  lunar,
  timeBands,
  annual,
});

export const academicCalendarEvents = [
  event({
    id: "winter-placement-return",
    code: "AC-01",
    glyph: "旅",
    title: l("寒期實習返校與雪靴來源核驗", "寒期実習帰校・雪靴来歴確認", "Winter placement return & snow-boot provenance"),
    window: l("一月 6—18 日", "1月6—18日", "6–18 January"),
    premise: l("返校生帶回的雪、幽靈與工具不得在同一張『無攜入物』表上一起否認。", "帰校生の雪・幽霊・工具を一枚の「持込なし」票で同時否認しない。", "Returning snow, phantoms, and tools may not all be denied on one ‘nothing imported’ form."),
    details: l("稗田館延長護照驗收；校醫院開設凍結魔力回溫桌；河童工房只收乾燥後仍會動的器材。", "稗田館は旅券検収を延長。校医院は凍結魔力再温机を開設。河童工房は乾燥後も動く器材のみ受付。", "Hieda extends passport inspection; the clinic opens a frozen-magic warming desk; Kappa Workshop accepts only equipment still moving after drying."),
    impacts: {
      course: l("上午課延後一校鐘，田野回報取代第一節", "午前授業を一校鐘遅延、第一時限は帰校報告", "Morning classes shift one bell; field reports replace first period"),
      transport: l("博麗門—稗田館步行加 3 分鐘", "博麗門―稗田館徒歩は3分増", "Add 3 minutes between Hakurei Gate and Hieda Hall"),
      library: l("田野史料櫃延長至 22:30", "フィールド史料棚は22:30まで延長", "Field archive stays open until 22:30"),
      medicine: l("凍結魔力回溫桌增開", "凍結魔力再温机を増設", "Frozen-magic warming desk opens"),
    },
    tags: ["fieldwork", "library", "clinic"],
    month: 0,
    dayStart: 6,
    dayEnd: 18,
  }),
  event({
    id: "hibernation-registration",
    code: "AC-02",
    glyph: "眠",
    title: l("冬眠登記與不在場選課", "冬眠届・不在履修", "Hibernation filing & absent registration"),
    window: l("二月 1—12 日", "2月1—12日", "1–12 February"),
    premise: l("冬眠者可由夢話代理加退選；夢話若選了八門課，醒來仍需自己處理。", "冬眠者は寝言による履修変更可。八科目選んでも起床後は本人が処理。", "Hibernators may add and drop by sleep-talking; if the dream enrols in eight courses, waking responsibility remains theirs."),
    details: l("宿舍夜間桌收取枕邊申請；My TU 標記為『本人可能不知道』；教授不得以敲鍋代替正式喚醒。", "寮夜間机が枕元申請を受領。My TU は「本人未認識の可能性」。教員は鍋叩きを正式覚醒としない。", "Residence desks accept bedside forms; My TU marks ‘student may not know’; instructors may not use pot-banging as formal awakening."),
    impacts: {
      course: l("候補席每日黃昏重算一次", "補欠席は毎夕再計算", "Waitlists recalculate each dusk"),
      transport: l("冬眠棟周邊改為靜音步道", "冬眠棟周辺は静音歩道", "Quiet footways apply around hibernation wings"),
      library: l("枕邊借閱可延長一次", "枕元貸出は一回延長可", "Bedside loans receive one renewal"),
      medicine: l("夢行症狀改至宿舍巡診", "夢遊症状は寮巡診へ", "Sleepwalking cases move to residence rounds"),
    },
    tags: ["courses", "housing", "library"],
    month: 1,
    dayStart: 1,
    dayEnd: 12,
  }),
  event({
    id: "spring-snow-dispute",
    code: "AC-03",
    glyph: "雪",
    title: l("春季開學與白玉樓未融雪異議", "春学期開始・白玉楼未融雪異議", "Spring term opening & Hakugyokurou unmelted-snow objection"),
    window: l("三月 18 日—四月 7 日", "3月18日—4月7日", "18 March–7 April"),
    premise: l("校方宣布春季開學；白玉樓以仍有積雪為由申請延後，幽幽子已先辦花見。", "大学は春学期開始を宣言。白玉楼は積雪を理由に延期申請、幽々子は先に花見を開催。", "The university declares spring term; Hakugyokurou petitions delay for snow while Yuyuko holds hanami first."),
    details: l("第一週課程同時存在春季與冬季版；妖夢在兩份課表間巡邏；紫拒絕說哪一側比較早。", "初週の授業は春版と冬版が併存。妖夢は二時間割間を巡回。紫はどちらが先か答えない。", "Week one has spring and winter timetables; Youmu patrols between them; Yukari declines to say which is earlier."),
    impacts: {
      course: l("白玉樓遠距課保留冬季時刻", "白玉楼遠隔授業は冬時刻を維持", "Hakugyokurou remote classes keep winter time"),
      transport: l("彼岸／白玉樓路段加 8 分鐘", "彼岸・白玉楼経路は8分増", "Add 8 minutes to Higan/Hakugyokurou routes"),
      library: l("春季指定書與冬季續借同時有效", "春指定図書と冬季延長が同時有効", "Spring reserves and winter renewals overlap"),
      medicine: l("花粉與凍傷分診不可合併", "花粉・凍傷トリアージを統合しない", "Pollen and frostbite triage stay separate"),
    },
    tags: ["term", "transport", "clinic"],
    month: [2, 3],
    dayStart: 18,
    dayEnd: 7,
  }),
  event({
    id: "boundary-matriculation",
    code: "AC-04",
    glyph: "門",
    title: l("境界開學式與三扇唯一正門", "境界入学式・三つの唯一正門", "Boundary matriculation & three sole main gates"),
    window: l("四月第二個星期", "4月第2週", "Second week of April"),
    premise: l("新生依是否會飛、信仰路線與能否看見境界，從三扇『唯一正門』分流。", "新入生は飛行、信仰経路、境界視認により三つの「唯一正門」へ分流。", "New students split among three ‘sole’ gates by flight, faith route, and boundary visibility."),
    details: l("靈夢主持校名揭牌；文提前九分鐘刊出出席人數；小傘負責讓沒注意到校門的人注意到。", "霊夢が校名板を除幕。文は九分早く出席数を発行。小傘は門に気づかない者を驚かす。", "Reimu unveils the nameboard; Aya publishes attendance nine minutes early; Kogasa startles those who missed the gates."),
    impacts: {
      course: l("新生導覽取代上午課", "新入生案内が午前授業を代替", "Orientation replaces morning classes"),
      transport: l("博麗門—境界講堂單向步行", "博麗門―境界講堂は一方通行", "Hakurei Gate–Boundary Hall becomes one-way"),
      library: l("新生借閱證現場換發", "新入生利用証を現地発行", "New library cards issued on site"),
      medicine: l("迷路、飛行暈眩與驚嚇分診增開", "迷子・飛行酔い・驚愕トリアージ増設", "Extra triage for lostness, flight sickness, and surprise"),
    },
    tags: ["admissions", "festival", "transport"],
    month: 3,
    dayStart: 8,
    dayEnd: 14,
  }),
  event({
    id: "spring-lanterns",
    code: "AC-05",
    glyph: "燈",
    title: l("春季符卡燈會", "春季スペルカード灯会", "Spring Spell-card Lantern Festival"),
    window: l("五月第一個滿月前後", "5月最初の満月前後", "Around May’s first full moon"),
    premise: l("燈籠需要風、符卡需要空域、河童電箱需要每個人別碰那條紅膠帶。", "灯籠には風、スペルには空域、河童配電箱には赤テープへ触れない人が必要。", "Lanterns need wind, spell cards need airspace, and kappa power boxes need nobody touching the red tape."),
    details: l("六桌許可各自有效；一席否決即可停祭；夜雀晚食、校醫急救與圖書返航書群同時運作。", "六机許可は個別に有効。一席差戻しで停止。夜雀夜食、救護、帰航書群が同時稼働。", "Six permits remain independent; one return stops opening; night food, aid, and returning book flocks operate together."),
    impacts: {
      course: l("符卡實作改為公開展演", "スペル実習を公開演技へ", "Spell-card practicals become public demonstrations"),
      transport: l("講堂上空與湖岸分時封路", "講堂上空・湖岸を時間帯閉鎖", "Timed closures above the hall and along the lake"),
      library: l("北翼延長開放，返航區減 18 席", "北翼延長、帰航区で18席減", "North Wing extends; returning zone loses 18 seats"),
      medicine: l("校醫急救站與永遠亭後送線啟動", "救護所・永遠亭搬送線を起動", "First-aid post and Eientei transfer line activate"),
    },
    tags: ["festival", "spellcard", "clinic"],
    month: 4,
    dayStart: 1,
    dayEnd: 31,
    lunar: [4],
  }),
  event({
    id: "rainy-paper-revision",
    code: "AC-06",
    glyph: "雨",
    title: l("梅雨校報訂正月", "梅雨学報訂正月", "Rainy-season campus-paper corrections"),
    window: l("六月全月", "6月全月", "All June"),
    premise: l("雨水把標題沖到內文，內文把日期推到明天；文認為這提高了版面流動性。", "雨が見出しを本文へ流し、本文が日付を明日へ押す。文は紙面流動性が向上したと主張。", "Rain washes headlines into body copy and pushes dates to tomorrow; Aya calls it improved layout mobility."),
    details: l("所有紙本通知需附版本號與乾燥狀態；木板公告以釘子數量作可信度；圖書館提供壓紙石借閱。", "紙告知は版番号と乾燥状態を附記。木札は釘数を信頼度とし、図書館は文鎮石を貸出。", "Paper notices carry version and dryness; board credibility is counted in nails; the library lends paperweight stones."),
    impacts: {
      course: l("新聞課每天提交一份可讀訂正版", "報道科は毎日、可読訂正版を提出", "Journalism submits one legible correction daily"),
      transport: l("山側紙鳶便停用，天狗口述便加班", "山側紙鳶便停止、天狗口述便増便", "Mountain kite post closes; tengu oral delivery expands"),
      library: l("壓紙石借閱；濕書隔離架開放", "文鎮石貸出・濡れ本隔離棚開設", "Paperweight loans and wet-book quarantine open"),
      medicine: l("濕翅、墨水過敏門診增加", "濡れ翼・墨アレルギー外来増設", "Extra wet-wing and ink-allergy clinic"),
    },
    tags: ["post", "library", "journalism"],
    month: 5,
    dayStart: 1,
    dayEnd: 30,
  }),
  event({
    id: "night-sparrow-term",
    code: "AC-07",
    glyph: "膳",
    title: l("夏夜課與夜雀晚食學期", "夏夜授業・夜雀夜食学期", "Summer night classes & night-sparrow supper term"),
    window: l("七月 10 日—八月 31 日", "7月10日—8月31日", "10 July–31 August"),
    premise: l("黃昏後才開課；米斯蒂婭堅稱歌聲是校鐘，不是噪音。", "授業は夕刻後。ミスティアは歌声が校鐘であり騒音ではないと主張。", "Classes begin after dusk; Mystia insists her singing is a bell, not noise."),
    details: l("夜間課改用提燈點名；食堂供應八目鰻；宿舍夜聲桌把演唱與申訴分開登記。", "夜間授業は提灯点呼。食堂は八目鰻。寮夜間机は歌唱と申立を分けて記録。", "Night classes take lantern attendance; dining serves lamprey; housing records performance and complaints separately."),
    impacts: {
      course: l("下午課後移兩校鐘；夜間田野課增加", "午後授業を二校鐘後送、夜間実習増設", "Afternoon classes shift two bells; night fieldwork expands"),
      transport: l("夜雀提燈步道開放，掃帚需低空慢行", "夜雀提灯歩道開放、箒は低空徐行", "Night-sparrow lantern path opens; brooms fly low and slow"),
      library: l("夜間閱覽室開至 02:00", "夜間閲覧室は02:00まで", "Night reading room stays open until 02:00"),
      medicine: l("夜盲與歌聲殘留門診延長", "夜盲・歌声残留外来を延長", "Night-blindness and song-residue clinic extends"),
    },
    tags: ["courses", "dining", "housing"],
    month: [6, 7],
    dayStart: 10,
    dayEnd: 31,
    timeBands: ["evening", "night"],
  }),
  event({
    id: "seasonal-energy-surge",
    code: "AC-08",
    glyph: "季",
    title: l("季節能量偏差觀測週", "季節エネルギー偏差観測週", "Seasonal-energy anomaly observation week"),
    window: l("八月第三週", "8月第3週", "Third week of August"),
    premise: l("四季能量在校園同時出現；天空璋課程要求先記錄，不准先猜犯人。", "四季エネルギーが学内へ同時出現。天空璋科目は犯人推定より先に記録を要求。", "Four seasonal energies appear together; the seasonal-anomaly course demands records before culprit guesses."),
    details: l("教室一角開花、一角結霜；河童量測器把秋葉當作韌體更新；校醫院分開處理熱、寒與情緒高揚。", "教室の一角は開花、一角は結霜。河童計器は紅葉を更新データと誤認。校医院は熱・寒・高揚を別診。", "One classroom corner blooms, another frosts; kappa meters treat maple leaves as firmware; the clinic separates heat, cold, and elation."),
    impacts: {
      course: l("跨院觀測取代兩節普通課", "学際観測が通常授業二時限を代替", "Cross-school observation replaces two ordinary periods"),
      transport: l("受影響路段每三小時更換通行季節", "影響経路は三時間ごとに通行季節を変更", "Affected routes change their traversable season every three hours"),
      library: l("四季資料同時列入指定書", "四季資料を同時指定図書へ", "All four seasons enter course reserves"),
      medicine: l("校醫負載上升；不得用平均體溫結案", "校医負荷上昇。平均体温で終結しない", "Clinic load rises; do not close cases by average temperature"),
    },
    tags: ["research", "clinic", "transport"],
    month: 7,
    dayStart: 15,
    dayEnd: 23,
  }),
  event({
    id: "higan-field-week",
    code: "AC-09",
    glyph: "彼",
    title: l("秋彼岸生死交通田野週", "秋彼岸・生死交通フィールド週", "Autumn Higan life-death transit field week"),
    window: l("九月 20—26 日", "9月20—26日", "20–26 September"),
    premise: l("彼岸候車線不按生死排序，按是否帶齊回程印排序；小町對此沒有正式意見。", "彼岸待合列は生死ではなく帰路印の有無で整列。小町に正式見解はない。", "Higan queues sort not by life or death but return seals; Komachi has no official view."),
    details: l("映姬開設物權與因果責任特講；妖夢核對半靈人數；所有田野生須在日落前證明自己打算回來。", "映姫が物権・因果責任特講。妖夢は半霊数を確認。実習生は日没前に帰還意思を証明。", "Eiki teaches property and causal responsibility; Youmu counts phantom halves; field students prove intent to return before sunset."),
    impacts: {
      course: l("法政、歷史與田野課合班", "法政・歴史・実習を合同実施", "Law, history, and fieldwork combine"),
      transport: l("彼岸渡船候時增加 12 分鐘", "彼岸渡船待ち12分増", "Add 12 minutes to Higan ferry waits"),
      library: l("亡者名冊只可館內閱覽", "亡者名簿は館内閲覧のみ", "Deceased rolls become reading-room only"),
      medicine: l("存在狀態不明者先分診，不先填死亡欄", "存在状態不明者は死亡欄より先に分診", "Uncertain-existence cases receive triage before mortality fields"),
    },
    tags: ["fieldwork", "property", "history"],
    month: 8,
    dayStart: 20,
    dayEnd: 26,
  }),
  event({
    id: "harvest-shrine-contest",
    code: "AC-10",
    glyph: "穫",
    title: l("秋收、神社祭與三方信仰攤位競標", "秋収・神社祭・三信仰屋台入札", "Harvest, shrine festival & three-faith stall bidding"),
    window: l("十月 7—20 日", "10月7—20日", "7–20 October"),
    premise: l("守矢要電力、命蓮寺要公共通道、博麗神社要香油錢；神子已聽見三方都說自己沒有競爭。", "守矢は電力、命蓮寺は公共動線、博麗神社は賽銭。神子は三者の「競争していない」を既に聞いた。", "Moriya wants power, Myouren wants public passage, Hakurei wants offerings; Miko hears all three deny competing."),
    details: l("信仰與共生政策學院主持公開聽證；攤位不得用奇蹟、功德或『免費試吃』規避費用欄。", "信仰共生政策学院が公開聴聞。奇跡・功徳・「無料試食」で費用欄を回避しない。", "Faith & Coexistence hosts public hearings; miracles, merit, and “free samples” do not bypass fees."),
    impacts: {
      course: l("公共治理課改在三座祭場輪流上課", "公共統治授業を三祭場で輪番実施", "Public-governance class rotates through three grounds"),
      transport: l("正門周邊單向；山路天狗便增班", "正門周辺は一方通行、山路天狗便増発", "One-way gates; extra mountain tengu service"),
      library: l("祭典法規與食譜借閱增加", "祭典規則・料理本の貸出増", "Festival rules and cookbooks see heavy loans"),
      medicine: l("過食、奇蹟眩暈與信仰爭執分流", "過食・奇跡酔い・信仰口論を分流", "Separate queues for overeating, miracle vertigo, and faith disputes"),
    },
    tags: ["faith", "festival", "governance"],
    month: 9,
    dayStart: 7,
    dayEnd: 20,
  }),
  event({
    id: "maple-archive-month",
    code: "AC-11",
    glyph: "楓",
    title: l("紅葉校史訂正與落葉版本月", "紅葉大学史訂正・落葉版月間", "Maple chronicle correction & fallen-leaf versions"),
    window: l("十一月全月", "11月全月", "All November"),
    premise: l("每片落葉都像一個版本；慧音要求先判斷是新增、刪除，還是樹自己做的 merge。", "落葉一枚ごとに一版。慧音は追加・削除・樹自身の merge を先に判定するよう要求。", "Every leaf resembles a version; Keine asks whether it is an addition, deletion, or the tree’s own merge."),
    details: l("稗田索引開放紅線工作桌；實際提交與合併紀錄分開；文可以報導 merge，但不准把它寫成當日唯一提交。", "稗田索引は赤糸机を開放。実提交と merge 記録は分離。文は merge を報道できるが当日唯一の提交とは書けない。", "Hieda opens the red-thread desk; real commits remain distinct from merges; Aya may report a merge but not call it the day’s only commit."),
    impacts: {
      course: l("校史課以版本追蹤代替期中摘要", "大学史は中間要約を版追跡へ変更", "Chronicle classes replace midterm summaries with version tracing"),
      transport: l("落葉覆蓋山路，步行加 4 分鐘", "落葉で山路徒歩4分増", "Maple-covered mountain paths add 4 minutes"),
      library: l("版本比較席增開，普通閱覽少 6 席", "版比較席を増設、一般閲覧6席減", "Version-comparison desks open; six general seats close"),
      medicine: l("葉片過敏與校史焦慮門診", "葉アレルギー・大学史不安外来", "Leaf-allergy and chronicle-anxiety clinic"),
    },
    tags: ["history", "hieda", "library"],
    month: 10,
    dayStart: 1,
    dayEnd: 30,
  }),
  event({
    id: "winter-seal-week",
    code: "AC-12",
    glyph: "封",
    title: l("冬季封印、圖書冬眠與年度結卷", "冬季封印・図書冬眠・年度閉巻", "Winter seals, book hibernation & year-end closure"),
    window: l("十二月 18—31 日", "12月18—31日", "18–31 December"),
    premise: l("會冬眠的書先簽出席，會醒來的封印先簽離校；年終卷宗只承認第一條時間線。", "冬眠する本は先に出席、目覚める封印は先に退出。年末記録は第一時間線のみ認証。", "Hibernating books sign attendance first; waking seals sign out first; year-end files recognise only the first timeline."),
    details: l("圖書館逐架點名；魔法塔降載；校醫院發放冬眠須知；宿舍接受來年春天才會讀到的留言。", "図書館は棚別点呼。魔法塔は減載。校医院は冬眠案内配布。寮は来春読む伝言を受付。", "The library calls shelves; the magic tower reduces load; the clinic issues hibernation guidance; housing accepts notes read next spring."),
    impacts: {
      course: l("課程結卷；未完成作業可申請冬眠中狀態", "科目閉巻。未完課題は冬眠中状態を申請可", "Courses close; unfinished work may enter hibernation status"),
      transport: l("夜間掃帚空路縮減，地面靜音線開放", "夜間箒空路縮小、地上静音線開放", "Night broom routes contract; quiet ground routes open"),
      library: l("部分館藏冬眠，預約順延至解凍", "一部資料が冬眠、予約は解凍後へ", "Some holdings hibernate; holds defer until thaw"),
      medicine: l("冬眠評估與低溫藥局延長", "冬眠評価・低温薬局を延長", "Hibernation assessment and cold pharmacy extend"),
    },
    tags: ["library", "clinic", "housing"],
    month: 11,
    dayStart: 18,
    dayEnd: 31,
  }),
  event({
    id: "full-moon-special",
    code: "AC-L4",
    glyph: "月",
    title: l("滿月特別課：月相、藥理與身份偏差", "満月特別授業：月相・薬理・身分偏差", "Full-moon special: lunar phase, pharmacology & identity variance"),
    window: l("每個滿月的黃昏與夜間", "毎満月の夕刻・夜間", "Every full moon, dusk and night"),
    premise: l("滿月會改變藥效、路線、獸性與某些人對出席名冊的看法；不得用平均值把它們洗掉。", "満月は薬効・経路・獣性・出席簿への見解を変える。平均値で消さない。", "Full moons alter medicine, routes, beast traits, and attendance; averages may not wash differences away."),
    details: l("永琳與慧音共同上課但分開簽名；鈴仙提供波長演示；帝出售『保證不受月亮影響』護符，收據不保證。", "永琳と慧音が共同授業、署名は別々。鈴仙が波長実演。てゐは「月の影響なし」札を販売、領収書は保証外。", "Eirin and Keine co-teach but sign separately; Reisen demonstrates wavelengths; Tewi sells “moon-proof” charms whose receipts guarantee nothing."),
    impacts: {
      course: l("夜間特講取代普通自習", "夜間特講が通常自習を代替", "Special night class replaces ordinary study"),
      transport: l("永遠亭地面路線加 7 分鐘", "永遠亭地上経路は7分増", "Ground routes through Eientei add 7 minutes"),
      library: l("滿月可見館藏開架，普通席減 10", "満月可視資料を開架、一般席10減", "Full-moon holdings open; ten ordinary seats close"),
      medicine: l("月相敏感分診負載上升", "月相感受性トリアージ負荷上昇", "Lunar-sensitive triage load rises"),
    },
    tags: ["moon", "clinic", "courses"],
    lunar: [4],
    timeBands: ["evening", "night"],
    annual: false,
  }),
  event({
    id: "new-moon-boundary-audit",
    code: "AC-L0",
    glyph: "界",
    title: l("朔月不可見境界盤點", "新月不可視境界棚卸", "New-moon invisible-boundary inventory"),
    window: l("每個朔月夜間", "毎新月夜間", "Every new-moon night"),
    premise: l("看不見的境界不等於不存在；看見紫站在旁邊也不等於盤點完成。", "見えない境界は不存在ではなく、紫が横に見えても棚卸完了ではない。", "An unseen boundary is not absent; seeing Yukari nearby does not complete inventory."),
    details: l("結界學院步測所有入口；不會飛者聯絡道保留；任何『近路』需有出發與抵達兩端共同簽名。", "結界学院は全入口を歩測。飛べない者連絡路は維持。「近道」は出発・到着両端署名必須。", "Boundary Studies walks every entrance; non-flier links remain; every shortcut needs signatures at both ends."),
    impacts: {
      course: l("結界實作移至夜間", "境界実習を夜間へ", "Boundary practical moves to night"),
      transport: l("掃帚空路停用，步行路加 2 分鐘", "箒空路停止、徒歩2分増", "Broom airways close; walking adds 2 minutes"),
      library: l("結界地圖只在閱覽桌攤開", "境界地図は閲覧机のみ展開", "Boundary maps unfold only at reading desks"),
      medicine: l("迷向與邊界暈眩巡診增開", "方向喪失・境界眩暈巡診増設", "Extra disorientation and boundary-vertigo rounds"),
    },
    tags: ["boundary", "transport", "research"],
    lunar: [0],
    timeBands: ["night"],
    annual: false,
  }),
];

function eventMatchesDate(entry, date) {
  const month = date.getMonth();
  const day = date.getDate();
  const phase = campusLunarPhase(date);
  const band = campusTimeBand(date);
  if (entry.lunar && !entry.lunar.includes(phase)) return false;
  if (entry.timeBands && !entry.timeBands.includes(band)) return false;
  if (entry.month === undefined) return true;
  const months = Array.isArray(entry.month) ? entry.month : [entry.month];
  if (!months.includes(month)) return false;
  if (months.length === 1) return day >= (entry.dayStart || 1) && day <= (entry.dayEnd || 31);
  if (month === months[0]) return day >= (entry.dayStart || 1);
  if (month === months.at(-1)) return day <= (entry.dayEnd || 31);
  return true;
}

function currentSeason(month) {
  return Object.entries(academicSeasons).find(([, season]) => season.months.includes(month))?.[0] || "spring";
}

function eventRouteRules(entries) {
  const rules = {
    closedModes: [],
    closedEdges: [],
    closedTransitNodes: [],
    modeDelay: {},
    edgeDelay: {},
  };
  entries.forEach((entry) => {
    if (entry.id === "spring-snow-dispute") {
      rules.edgeDelay[edgeKey("history", "clinic")] = 3;
      rules.edgeDelay[edgeKey("boundary", "clinic")] = 5;
    }
    if (entry.id === "boundary-matriculation") rules.edgeDelay[edgeKey("gate", "boundary")] = 5;
    if (entry.id === "spring-lanterns") rules.closedTransitNodes.push("boundary");
    if (entry.id === "rainy-paper-revision") rules.modeDelay.tengu = 4;
    if (entry.id === "night-sparrow-term") rules.modeDelay.broom = 3;
    if (entry.id === "seasonal-energy-surge") rules.modeDelay.foot = 5;
    if (entry.id === "higan-field-week") rules.modeDelay.ferry = 12;
    if (entry.id === "harvest-shrine-contest") rules.edgeDelay[edgeKey("gate", "boundary")] = 4;
    if (entry.id === "maple-archive-month") rules.modeDelay.foot = (rules.modeDelay.foot || 0) + 4;
    if (entry.id === "winter-seal-week") rules.modeDelay.broom = (rules.modeDelay.broom || 0) + 5;
    if (entry.id === "full-moon-special") {
      [
        edgeKey("boundary", "clinic"),
        edgeKey("history", "clinic"),
        edgeKey("magic", "clinic"),
        edgeKey("clinic", "kappa"),
      ].forEach((key) => {
        rules.edgeDelay[key] = (rules.edgeDelay[key] || 0) + 7;
      });
    }
    if (entry.id === "new-moon-boundary-audit") {
      rules.closedModes.push("broom");
      rules.modeDelay.foot = (rules.modeDelay.foot || 0) + 2;
    }
  });
  rules.closedModes = [...new Set(rules.closedModes)];
  rules.closedTransitNodes = [...new Set(rules.closedTransitNodes)];
  return rules;
}

export function academicCalendarSnapshot(date = new Date()) {
  const seasonId = currentSeason(date.getMonth());
  const entries = academicCalendarEvents.filter((entry) => eventMatchesDate(entry, date));
  return {
    dayKey: campusDayKey(date),
    seasonId,
    season: academicSeasons[seasonId],
    phase: campusLunarPhase(date),
    band: campusTimeBand(date),
    activeEvents: entries,
    routeRules: eventRouteRules(entries),
  };
}

export function academicCalendarEvent(id) {
  return academicCalendarEvents.find((entry) => entry.id === id) || null;
}

export function academicCalendarLocalized(value, locale = "zh-Hant") {
  return value?.[locale] || value?.["zh-Hant"] || value || "";
}
