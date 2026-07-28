import { academicAssignments } from "./academic-work.js";
import { appraisalObjects } from "./appraisal.js";
import { campusHistory } from "./campus-history.js";
import { newsItems, seededPosts } from "./community.js";
import { courseCatalogue } from "./courses.js";
import { facultyProfiles } from "./faculty.js";
import { governanceProposals } from "./governance.js";
import { residences } from "./housing.js";
import { incidentCases } from "./incidents.js";
import { libraryHoldings } from "./library.js";
import { researchFiles } from "./research.js";
import { spellPatterns } from "./spellcard-workshop.js";
import { ethicsCases } from "./ethics.js";
import {
  festivalGatePlans,
  festivalIncidentPool,
  festivalKinds,
  festivalPowerPlans,
  festivalReviewDesks,
  festivalRoutes,
} from "./festival.js";
import { fieldworkComplications, fieldworkStations } from "./fieldwork.js";
import { propertyItems } from "./property.js";
import { postSeedMessages } from "./post.js";
import { academicCalendarEvents } from "./academic-calendar.js";
import { alumniChapters, careerOpenings } from "./careers.js";
import { employmentJobs, employmentOutcomeKinds } from "./employment.js";

const l = (zhHant, ja, en) => ({ "zh-Hant": zhHant, ja, en });

const record = (id, kind, sourceType, sourceId, characters, annotation, extras = {}) => ({
  id,
  kind,
  source: { type: sourceType, id: sourceId, ...(extras.source || {}) },
  characters,
  annotation,
  ...Object.fromEntries(Object.entries(extras).filter(([key]) => key !== "source")),
});

export const knowledgeRecordKinds = Object.freeze({
  case: l("正式案卷", "正式案件", "Official file"),
  evidence: l("現場記錄", "現場記録", "Field record"),
  correction: l("訂正與異本", "訂正・異本", "Correction & variant"),
  report: l("新聞與傳聞", "報道・噂", "News & rumour"),
  governance: l("校務規章", "学務規程", "Governance"),
  community: l("學生側記", "学生側記", "Student account"),
  learning: l("課程與作業", "授業・課題", "Course & assignment"),
  research: l("研究檔案", "研究記録", "Research file"),
  archive: l("校史版本", "大学史版", "Chronicle version"),
  object: l("物證與館藏", "物証・蔵書", "Object & holding"),
  residence: l("共住記錄", "共同生活記録", "Residence record"),
  ethics: l("倫理審查", "倫理審査", "Ethics review"),
});

export const knowledgeCharacters = Object.freeze([
  {
    id: "akyuu",
    glyph: "稗",
    name: l("稗田阿求", "稗田阿求", "Hieda no Akyuu"),
    role: l("索引編纂、版本旁注，以及拒絕把矛盾擦乾淨", "索引編纂・版注・矛盾を消さない仕事", "Indexing, version notes, and refusing to erase contradictions"),
  },
  {
    id: "keine",
    glyph: "史",
    facultyId: "keine",
    name: facultyProfiles.keine.name,
    role: l("點名、史料訂正，以及追問昨天究竟是哪一版", "点呼・史料訂正・昨日が何版かの追及", "Roll calls, source corrections, and asking which edition yesterday was"),
  },
  {
    id: "aya",
    glyph: "文",
    facultyId: "aya",
    name: facultyProfiles.aya.name,
    role: l("最快抵達現場，也最快讓訂正欄有工作", "現場到着も訂正欄を働かせるのも最速", "First to the scene, and first to give Corrections more work"),
  },
  {
    id: "nitori",
    glyph: "河",
    facultyId: "nitori",
    name: facultyProfiles.nitori.name,
    role: l("設備 log、膠帶修復與不保證版本一致的韌體", "設備ログ・テープ修理・版一致を保証しないファームウェア", "Equipment logs, tape repairs, and firmware that promises no version agreement"),
  },
  {
    id: "eirin",
    glyph: "月",
    facultyId: "eirin",
    name: facultyProfiles.eirin.name,
    role: l("月相觀測、診療判讀與不讓大樣本掩蓋方法問題", "月相観測・診療判断・大標本で方法事故を隠さない", "Lunar observation, clinical judgement, and not letting sample size hide bad methods"),
  },
  {
    id: "reisen",
    glyph: "鈴",
    name: l("鈴仙・優曇華院・因幡", "鈴仙・優曇華院・イナバ", "Reisen Udongein Inaba"),
    role: l("月相感覺、竹林引導與被迫重畫的箭頭", "月相知覚・竹林誘導・描き直される矢印", "Lunar perception, bamboo guidance, and arrows that keep being redrawn"),
  },
  {
    id: "tewi",
    glyph: "兎",
    name: l("因幡帝", "因幡てゐ", "Tewi Inaba"),
    role: l("近路、票根，以及沒有承認是陷阱的路線設計", "近道・半券・罠とは認めない経路設計", "Shortcuts, ticket stubs, and route design that denies being a trap"),
  },
  {
    id: "koakuma",
    glyph: "書",
    name: l("小惡魔", "小悪魔", "Koakuma"),
    role: l("離架記錄、窗戶管理與會反駁的館藏編目", "離架記録・窓管理・反論する蔵書の目録", "Shelf-departure logs, window control, and cataloguing books that object"),
  },
  {
    id: "cirno",
    glyph: "冰",
    name: l("琪露諾", "チルノ", "Cirno"),
    role: l("目擊者、臨時冷藏，以及可靠度與自信完全不同的證詞", "目撃者・臨時冷却・信頼度と自信が別物の証言", "Witnessing, emergency refrigeration, and testimony whose confidence exceeds its reliability"),
  },
  {
    id: "patchouli",
    glyph: "七",
    facultyId: "patchouli",
    name: facultyProfiles.patchouli.name,
    role: l("魔導書閱讀、館際爭議與不准把書頁折成書籤", "魔導書読解・館間係争・頁を栞に折る行為の禁止", "Grimoire reading, interlibrary disputes, and banning folded-page bookmarks"),
  },
  {
    id: "reimu",
    glyph: "博",
    facultyId: "reimu",
    name: facultyProfiles.reimu.name,
    role: l("規則、退路，以及對過度複雜制度的最短意見", "規則・退路・複雑すぎる制度への最短意見", "Rules, exits, and the shortest opinion on overcomplicated systems"),
  },
  {
    id: "marisa",
    glyph: "魔",
    facultyId: "marisa",
    name: facultyProfiles.marisa.name,
    role: l("高出力實作、來源稍後補，以及值得保留的失敗", "高出力実習・出所は後記・保存に値する失敗", "High-output practice, provenance to be added later, and failures worth keeping"),
  },
  {
    id: "yukari",
    glyph: "境",
    facultyId: "yukari",
    name: facultyProfiles.yukari.name,
    role: l("邊界、規章縫隙與版本之間本來沒有的門", "境界・規程の隙間・版の間になかった扉", "Boundaries, regulatory gaps, and doors that were not between versions"),
  },
  {
    id: "rinnosuke",
    glyph: "香",
    name: l("森近霖之助", "森近霖之助", "Rinnosuke Morichika"),
    role: l("名稱、用途，以及寫完標價後仍然暫不出售", "名称・用途・値札を書いても当面非売品", "Names, purposes, and remaining not for sale after pricing"),
  },
  {
    id: "kogasa",
    glyph: "傘",
    name: l("多多良小傘", "多々良小傘", "Kogasa Tatara"),
    role: l("遺忘道具的當事物意見與突然發言權", "忘れられた道具の当事物意見・突然の発言権", "The forgotten object's own view, and sudden speaking rights"),
  },
  {
    id: "satori",
    glyph: "心",
    name: l("古明地覺", "古明地さとり", "Satori Komeiji"),
    role: l("精神隱私、沒有落筆的資料，以及要求讀心另填一份申請", "精神プライバシー・書かれないデータ・読心には別申請", "Mental privacy, unwritten data, and requiring a separate protocol for mind-reading"),
  },
  {
    id: "eiki",
    glyph: "裁",
    name: l("四季映姬・夜摩仙那度", "四季映姫・ヤマザナドゥ", "Eiki Shiki, Yamaxanadu"),
    role: l("同意、責任、申訴，以及不准所有權替別人放棄撤回", "同意・責任・不服申立て・所有権による撤回放棄の禁止", "Consent, responsibility, appeal, and refusing to let ownership waive another's withdrawal"),
  },
  {
    id: "sakuya",
    glyph: "時",
    name: l("十六夜咲夜", "十六夜咲夜", "Sakuya Izayoi"),
    role: l("停止時間、零分鐘對照，以及只有她那一側仍在走的鐘", "時間停止・0分対照・彼女側だけで進む時計", "Stopped time, zero-minute controls, and the clock still moving only on her side"),
  },
  {
    id: "kanako",
    glyph: "注",
    name: l("八坂神奈子", "八坂神奈子", "Kanako Yasaka"),
    role: l("穩定供電、注連繩施工，以及每一條電線究竟算誰的信仰設施", "安定給電・注連縄工事・各電線が誰の信仰設備かという争い", "Stable power, shimenawa works, and disputes over whose faith infrastructure each cable is"),
  },
  {
    id: "byakuren",
    glyph: "蓮",
    name: l("聖白蓮", "聖白蓮", "Byakuren Hijiri"),
    role: l("共同生活、夜間接納，以及把唯一正門留給不會飛的人", "共同生活・夜間受入れ・唯一正門を飛べない者へ残すこと", "Shared life, night welcome, and leaving the sole main gate to those who cannot fly"),
  },
  {
    id: "miko",
    glyph: "聽",
    name: l("豐聰耳神子", "豊聡耳神子", "Toyosatomimi no Miko"),
    role: l("同時聽十份開幕辭、公共秩序，以及堅稱正門先到先用", "十の開幕辞の同時聴取・公共秩序・正門は先着順という主張", "Hearing ten opening speeches at once, public order, and insisting the gate is first-come first-served"),
  },
  {
    id: "youmu",
    glyph: "半",
    name: l("魂魄妖夢", "魂魄妖夢", "Youmu Konpaku"),
    role: l("庭園值勤、幽靈點名，以及半人半靈究竟算一人還是一組", "庭園当番・幽霊点呼・半人半霊を一名か一組か数える問題", "Garden duty, phantom roll call, and whether half-human half-phantom counts as one or a pair"),
  },
  {
    id: "yuyuko",
    glyph: "幽",
    name: l("西行寺幽幽子", "西行寺幽々子", "Yuyuko Saigyouji"),
    role: l("白玉樓宴席、幽靈人口，以及在點名結束後才承認自己一直在場", "白玉楼の宴・幽霊人口・点呼後に最初から居たと認めること", "Hakugyokurou feasts, phantom populations, and admitting after roll call that she was present all along"),
  },
]);

export const knowledgeDossiers = Object.freeze([
  {
    id: "late-bell-seven",
    glyph: "鐘",
    code: "HIEDA / 01",
    title: l("遲到鐘事件：準時者為何聽見了？", "遅刻鐘事件：定刻者にはなぜ聞こえたか", "The late-bell case: why did punctual students hear it?"),
    lead: l(
      "同一聲鐘在設備、點名頁、號外與本機結案裡有不同的發生時間。阿求沒有替它們選出一個比較聽話的昨天。",
      "同じ鐘が設備・点呼頁・号外・端末内終結で別の発生時刻を持つ。阿求は、より従順な昨日を一つ選ばなかった。",
      "The same bell has different times in equipment logs, roll sheets, an extra edition, and local closures. Akyuu declines to choose the most obedient yesterday.",
    ),
    tension: l(
      "慧音的點名頁說七人準時；文的號外在鐘響前九分鐘完成排版；荷取的塔鐘卻堅稱自己只執行過一次正確指令。",
      "慧音の点呼頁では七名が定刻。文の号外は鐘より九分早く組版済み。にとりの鐘楼は正しい命令を一度だけ実行したと言い張る。",
      "Keine's roll marks seven punctual; Aya's extra was typeset nine minutes before the bell; Nitori's tower insists it executed one correct instruction.",
    ),
    characters: ["akyuu", "keine", "aya", "nitori", "reimu"],
    versions: ["five-cases-three-headlines", "three-hour-bell-and-public-defence", "translation-keys-tie-the-red-ledger-thread", "five-records-share-one-red-thread"],
    eventQueries: [
      { types: ["incident.experiment.completed", "incident.resolved"], refs: ["incident-case:late-bell-seven"] },
      { types: ["governance.vote.cast"], refs: ["governance-proposal:airspace-practicals"] },
      { types: ["course.enrolled", "course.waitlisted", "course.dropped"], refs: ["course:2026-autumn:BIS-132"] },
    ],
    records: [
      record("official-case", "case", "incident", "late-bell-seven", ["reimu", "akyuu"], l("事件聯絡室只承認這是案卷起點，不承認它是故事結尾。", "事案連絡室は案件の起点とは認めるが、物語の終点とは認めない。", "The Incident Desk accepts this as the case's beginning, not the story's ending.")),
      record("tower-log", "evidence", "incident-evidence", "tower-log", ["nitori"], l("設備時間穩定；韌體版本欄卻被河童膠帶貼住一半。", "設備時刻は安定。ファームウェア版欄は河童テープで半分隠れている。", "The equipment time is stable; half the firmware-version field is under kappa tape."), { source: { caseId: "late-bell-seven" } }),
      record("roll-page", "correction", "incident-evidence", "roll-page", ["keine"], l("慧音把『遲到』劃掉兩次；第二次的墨比第一次更早乾。", "慧音は「遅刻」を二度消した。二度目の墨の方が先に乾いている。", "Keine crossed out “late” twice; the second ink dried first."), { source: { caseId: "late-bell-seven" } }),
      record("extra-edition", "report", "incident-evidence", "extra-edition", ["aya"], l("標題沒有錯過鐘聲，只是鐘聲錯過了截稿。", "見出しは鐘を逃さず、鐘の方が締切に遅れた。", "The headline did not miss the bell; the bell missed deadline."), { source: { caseId: "late-bell-seven" } }),
      record("airspace-rule", "governance", "governance", "airspace-practicals", ["aya", "reimu"], l("空域規章沒有處理時間先後，只規定誰能在大家互等時關門。", "空域規程は時間順を扱わず、全員が待ち合う時に誰が閉鎖できるかだけ定める。", "Airspace rules do not settle sequence; they only say who may close things while everyone waits.")),
      record("airspace-bbs", "community", "bbs-seed", "9", ["aya"], l("學生先問能不能停在鐘上方，沒有先問鐘是否位於今天。", "学生はまず鐘の上で停止できるか尋ね、鐘が今日にあるかは尋ねなかった。", "Students first ask whether they may hover above the bell, not whether the bell is in today.")),
      record("three-reports", "research", "research", "reports", ["aya", "keine"], l("研究檔案允許三份互相不服的報導同時被引用。", "研究記録は、互いに納得しない三本の報道を同時に引用可能とする。", "The research file permits three mutually unconvinced reports to be cited together.")),
    ],
  },
  {
    id: "flying-book-window",
    glyph: "書",
    code: "HIEDA / 02",
    title: l("離架事件：四本書，只有一本想逃", "離架事件：四冊のうち逃げたいのは一冊だけ", "Shelf departure: four books, only one wanted to escape"),
    lead: l(
      "窗戶 log 說它一直關著，書扣遙測說四本都動了，第四本則以翻頁提出一份不願回到原位的請願。",
      "窓ログは終始閉鎖、留め具計測は四冊の移動を記録。第四冊は頁をめくって元位置への帰還を拒否した。",
      "The window log says closed, clasp telemetry says all four moved, and the fourth book petitioned by turning pages not to return.",
    ),
    tension: l(
      "圖書館把它記為離架；小惡魔記為設備異常；館藏自己只承認『位置協商』。琪露諾的證詞全部大寫。",
      "図書館は離架、小悪魔は設備異常、蔵書自身は「位置交渉」とだけ記録。チルノの証言は全て大文字。",
      "The library records departure, Koakuma records equipment failure, and the holding accepts only “location negotiation.” Cirno's testimony is all caps.",
    ),
    characters: ["akyuu", "koakuma", "cirno", "patchouli", "marisa"],
    versions: ["seven-doors-and-misty-desk", "five-cases-three-headlines", "translation-keys-tie-the-red-ledger-thread", "five-records-share-one-red-thread"],
    eventQueries: [
      { types: ["incident.experiment.completed", "incident.resolved"], refs: ["incident-case:flying-book-window"] },
      { types: ["book.borrowed", "book.renewed", "book.returned", "book.held", "book.hold.cancelled"], refs: ["library-holding:flying-index", "library-holding:shelf-negotiation-minutes"] },
      { types: ["governance.vote.cast"], refs: ["governance-proposal:fullmoon-library"] },
    ],
    records: [
      record("official-case", "case", "incident", "flying-book-window", ["koakuma", "cirno"], l("案卷使用『離架』一詞，以免在結案前把任何一本書定性為逃犯。", "終結前に本を逃亡犯扱いしないため、案件は「離架」と記す。", "The file says “shelf departure” so no book is called a fugitive before closure.")),
      record("margin-petition", "evidence", "incident-evidence", "margin-petition", ["koakuma"], l("請願寫在頁邊；編目規則說頁邊屬於館藏，治理規則說請願屬於發言。", "請願は欄外。目録規則では蔵書、統治規則では発言に属する。", "The petition is in a margin: cataloguing calls it holding, governance calls it speech."), { source: { caseId: "flying-book-window" } }),
      record("flying-index", "object", "library", "flying-index", ["patchouli", "koakuma"], l("這本書專門解釋會飛的書如何仍有索書號，並拒絕示範。", "飛ぶ本にも請求記号がある理由を説明し、実演は拒否する。", "This book explains why flying books retain call numbers, and refuses to demonstrate.")),
      record("library-rule", "governance", "governance", "fullmoon-library", ["patchouli"], l("議案爭論滿月閱覽是否延長；書則要求先決定讀者能否被續借。", "議案は満月閲覧延長を論じるが、本は読者を更新貸出できるか先に決めよと要求。", "The motion debates longer full-moon reading; the book asks whether readers may be renewed first.")),
      record("window-bbs", "community", "bbs-seed", "5", ["koakuma"], l("館員的告示非常清楚；窗邊座位仍然每晚有人問一次。", "司書の掲示は明快だが、窓際席では毎晩一度同じ質問が出る。", "The librarian's notice is clear; someone at the window seats still asks nightly.")),
      record("grimoire-course", "learning", "course", "MTP-143", ["patchouli"], l("課程教閱讀與反讀，沒有教如何追回已讀完讀者的書。", "授業は読解と反読を教えるが、読者を読み終えた本の追跡は教えない。", "The course teaches reading and counter-reading, not how to recover a book that finished its reader.")),
      record("shelf-minutes", "correction", "library", "shelf-negotiation-minutes", ["akyuu", "koakuma"], l("第一二九日會議仍未決定『原位置』是否可以自行搬家。", "第129日会議でも「元位置」が自ら移動できるか未決。", "Day 129 still did not decide whether an “original location” may move itself.")),
    ],
  },
  {
    id: "headline-yesterday",
    glyph: "昨",
    code: "HIEDA / 03",
    title: l("昨日號外：明日的事件為何已入校史", "昨日号外：明日の事件がなぜ大学史入りしたか", "Yesterday extra: why tomorrow's incident was already archived"),
    lead: l(
      "排版快取、史料索引與閥門錄音都各有一個日期，而且三個日期對單獨閱讀的人都很合理。",
      "組版キャッシュ・史料索引・弁音声には別々の日付があり、単独で読めばどれも筋が通る。",
      "Layout cache, archive index, and valve audio each have a date, and each date is reasonable when read alone.",
    ),
    tension: l(
      "文說新聞只是早到；阿求說校史只是晚寫；慧音要求兩人先在『昨日』旁標版本號。紫把日期欄剪開。",
      "文は報道が早着しただけ、阿求は大学史が遅筆だっただけと主張。慧音はまず「昨日」に版番号を付けよと要求。紫は日付欄を切り開いた。",
      "Aya says the news merely arrived early; Akyuu says the chronicle was merely written late. Keine asks both to version “yesterday.” Yukari cuts open the date field.",
    ),
    characters: ["akyuu", "aya", "keine", "nitori", "yukari"],
    versions: ["living-version-chronicle", "five-cases-three-headlines", "red-thread-preservation-desk", "translation-keys-tie-the-red-ledger-thread", "five-records-share-one-red-thread"],
    eventQueries: [
      { types: ["incident.experiment.completed", "incident.resolved"], refs: ["incident-case:headline-yesterday"] },
      { types: ["academic.assignment.graded"], refs: ["assignment:his-yesterday-editions"] },
      { types: ["governance.vote.cast"], refs: ["governance-proposal:red-thread-appeal"] },
      { types: ["book.borrowed", "book.renewed", "book.returned", "book.held"], refs: ["library-holding:corrections-headlines", "library-holding:three-yesterdays"] },
    ],
    records: [
      record("official-case", "case", "incident", "headline-yesterday", ["aya", "akyuu", "nitori"], l("案卷狀態寫著處理中；校史引用欄卻已留下處理後頁碼。", "案件は処理中だが、大学史の引用欄には処理後の頁番号がある。", "The case says in progress; the chronicle citation already has its post-closure page.")),
      record("layout-cache", "report", "incident-evidence", "layout-cache", ["aya"], l("快取證明標題何時排好，沒有證明事件答應在那時發生。", "キャッシュは見出しの組版時刻を示すが、事件がその時刻に同意した証明ではない。", "The cache proves when the headline was set, not that the incident agreed to occur then."), { source: { caseId: "headline-yesterday" } }),
      record("chronicle-index", "correction", "incident-evidence", "chronicle-index", ["akyuu", "keine"], l("索引頁碼有效；頁碼指向的紙在本案打開後才出現。", "索引頁番号は有効だが、参照先の紙は案件を開いた後に現れた。", "The index page number is valid; its paper appeared only after the case opened."), { source: { caseId: "headline-yesterday" } }),
      record("reports-research", "research", "research", "reports", ["aya", "keine"], l("研究把『先報、後發生』列為可觀測順序，不列為因果結論。", "研究は「先に報道、後に発生」を観測順として記し、因果結論とはしない。", "Research records “reported first, occurred later” as an observed order, not a causal finding.")),
      record("yesterday-assignment", "learning", "assignment", "his-yesterday-editions", ["keine", "akyuu"], l("作業禁止選一個比較有感情的昨天；必須保留兩份來源。", "課題は感情的に好ましい昨日の選択を禁じ、二つの出所を残す。", "The assignment forbids choosing the more emotionally satisfying yesterday; both sources stay.")),
      record("red-thread-rule", "governance", "governance", "red-thread-appeal", ["aya", "akyuu"], l("議案只決定警告要多大，沒決定爭議內容要不要安靜。", "議案は警告の大きさだけを決め、係争内容を静かにするかは決めない。", "The motion decides warning size, not whether contested content should quiet down.")),
      record("headline-holding", "object", "library", "corrections-headlines", ["aya", "akyuu"], l("館藏的訂正附錄總比正文厚一頁；那一頁偶爾是明天補上的。", "訂正付録は本文より常に一頁厚く、その一頁は時々明日追加される。", "Its corrections appendix is always one page thicker than the text; sometimes tomorrow adds it.")),
    ],
  },
  {
    id: "fourth-lantern-loop",
    glyph: "燈",
    code: "HIEDA / 04",
    title: l("第四盞燈：三班兔車抵達同一個轉彎", "第四の灯：三便の兎車が同じ曲がり角へ到着", "The fourth lantern: three rabbit coaches reach one bend"),
    lead: l(
      "竹林裡每一盞都說自己是第四盞；票根、月相與韌體則對『三班』是否先後發生有不同看法。",
      "竹林では全ての灯が自分を第四と名乗る。半券・月相・ファームウェアは「三便」の前後関係に別の見解を持つ。",
      "Every lantern in the bamboo claims to be fourth. Tickets, moon phase, and firmware disagree on whether the three coaches happened in sequence.",
    ),
    tension: l(
      "帝把循環稱為近路；永琳稱為重複暴露；荷取稱為舊韌體相容層。鈴仙又把指示箭頭轉回去了。",
      "てゐはループを近道、永琳は反復曝露、にとりは旧ファーム互換層と呼ぶ。鈴仙は案内矢印をまた元へ戻した。",
      "Tewi calls the loop a shortcut, Eirin repeated exposure, and Nitori a legacy compatibility layer. Reisen turned the arrow back again.",
    ),
    characters: ["akyuu", "eirin", "reisen", "tewi", "nitori"],
    versions: ["five-cases-three-headlines", "two-clinics-and-one-missing-token", "three-hour-bell-and-public-defence", "five-records-share-one-red-thread"],
    eventQueries: [
      { types: ["incident.experiment.completed", "incident.resolved"], refs: ["incident-case:fourth-lantern-loop"] },
      { types: ["book.borrowed", "book.renewed", "book.returned", "book.held"], refs: ["library-holding:fourth-lantern-manual"] },
    ],
    records: [
      record("official-case", "case", "incident", "fourth-lantern-loop", ["eirin", "tewi"], l("案卷先把三班車分開編號；竹林隔天把號碼交換。", "案件は三便を別番号にしたが、竹林は翌日その番号を交換した。", "The file numbers three coaches separately; the bamboo swaps their numbers next day.")),
      record("firmware-stubs", "evidence", "incident-evidence", "firmware-stubs", ["nitori", "tewi"], l("票根有三個時間戳，韌體只有一個『仍在前往』狀態。", "半券には三つの時刻印、ファームには一つの「移動中」状態だけ。", "Tickets have three timestamps; firmware has one “still en route” state."), { source: { caseId: "fourth-lantern-loop" } }),
      record("moon-log", "correction", "incident-evidence", "moon-log", ["eirin", "reisen"], l("月相記錄沒有重複；記錄月相的人走過同一盞燈三次。", "月相記録は重複しないが、記録者は同じ灯を三回通った。", "The lunar log has no duplicate; its recorder passed the same lantern three times."), { source: { caseId: "fourth-lantern-loop" } }),
      record("lantern-manual", "object", "library", "fourth-lantern-manual", ["nitori"], l("手冊版本 3.1b 的第一頁要求先確認自己沒有在讀 3.1b。", "手引3.1bの第一頁は、まず3.1bを読んでいないことの確認を求める。", "Manual 3.1b begins by asking you to verify you are not reading 3.1b.")),
      record("bamboo-bbs", "community", "bbs-seed", "2", ["tewi", "reisen"], l("定向部承諾本週不保證同一條回程；這句是唯一準時抵達的告示。", "定向部は今週、同じ帰路を保証しない。これだけが定刻に届いた掲示。", "Orienteering promises no identical return route this week; that notice alone arrived on time.")),
      record("clinic-route-course", "learning", "course", "LML-351", ["eirin", "reisen"], l("課程學分不因走三次增加，但缺席判定可能增加。", "三周しても単位は増えないが、欠席判定は増えることがある。", "Three loops add no credits, though they may add absences.")),
      record("clinic-route-news", "report", "news", "clinic-route", ["eirin", "reisen"], l("低刺激引導線已啟用；帝在旁邊貼了一張『更低刺激近路』。", "低刺激誘導線は開通。てゐは隣に「さらに低刺激の近道」を貼った。", "The low-stimulus route is open; Tewi posted an “even lower-stimulus shortcut” beside it.")),
    ],
  },
  {
    id: "dorm-window-chair",
    glyph: "椅",
    code: "HIEDA / 05",
    title: l("窗邊椅：共住協議的第三位室友", "窓際の椅子：共同生活協定の第三の同室者", "The window chair: third roommate to a co-living agreement"),
    lead: l(
      "房間申請寫兩人，夜間格線量到三個固定位置；椅背刮痕則要求在輪值表中加入自己的名字。",
      "入寮申請は二名、夜間格子は三つの定位置を計測。椅子背の傷は当番表に自分の名を加えるよう求める。",
      "The housing form says two people, the night grid measures three fixed positions, and scratches on the chair request a rota entry.",
    ),
    tension: l(
      "宿舍處說家具不占床位；紫說邊界不一定占空間；椅子用一張舊收據證明自己比其中一位室友先入住。",
      "寮務は家具に寝床なし、紫は境界が空間を占めるとは限らないと言う。椅子は古い領収書で同室者の一人より先に入居したと証明。",
      "Housing says furniture takes no bed; Yukari says boundaries need not take space. An old receipt says the chair moved in before one roommate.",
    ),
    characters: ["akyuu", "yukari", "reimu", "kogasa", "aya"],
    versions: ["five-halls-and-one-chair", "five-cases-three-headlines", "red-thread-preservation-desk", "five-records-share-one-red-thread"],
    eventQueries: [
      { types: ["incident.experiment.completed", "incident.resolved"], refs: ["incident-case:dorm-window-chair"] },
      { types: ["housing.application.submitted", "housing.assignment.accepted"], refs: ["residence:hakurei-east"] },
      { types: ["governance.vote.cast"], refs: ["governance-proposal:red-thread-appeal"] },
    ],
    records: [
      record("official-case", "case", "incident", "dorm-window-chair", ["yukari", "kogasa"], l("事件中心把椅子列在影響對象，不列在證人欄；椅子已就此提出異議。", "事案センターは椅子を影響対象に載せ、証人欄には載せない。椅子は異議申立済み。", "The Incident Centre lists the chair as affected, not witness. The chair has appealed.")),
      record("scratch-text", "evidence", "incident-evidence", "scratch-text", ["kogasa"], l("刮痕能讀成名字，也能讀成『不要再把外套放我身上』。", "傷は名前にも「もう上着を置くな」にも読める。", "The scratches read as a name, or “stop putting coats on me.”"), { source: { caseId: "dorm-window-chair" } }),
      record("old-receipt", "correction", "incident-evidence", "old-receipt", ["akyuu"], l("收據日期比宿舍改建早；品名欄只寫『一位，木製』。", "領収日付は寮改築前。品名欄は「一名、木製」とだけある。", "The receipt predates the dorm conversion; item says only “one, wooden.”"), { source: { caseId: "dorm-window-chair" } }),
      record("hakurei-east", "residence", "residence", "hakurei-east", ["reimu"], l("漏雨直線被自治會列為天然時鐘，椅子堅稱那是自己的窗簾。", "雨漏り線は自治会が天然時計と認定。椅子は自分のカーテンだと主張。", "The hall calls its rain leak a natural clock; the chair calls it curtains.")),
      record("boundary-course", "learning", "course", "BIS-271", ["yukari"], l("課程討論通行治理；這份作業改問誰有權通過椅背。", "授業は通行統治を扱い、この課題は誰が椅子の背を通れるかを問う。", "The course studies passage governance; this assignment asks who may pass through a chair back.")),
      record("red-thread-rule", "governance", "governance", "red-thread-appeal", ["akyuu", "aya"], l("椅子要求警告與自己同高；學生會回覆尚未測量椅子的閱讀距離。", "椅子は自分と同じ高さの警告を要求。学生会は椅子の読書距離未測定と回答。", "The chair wants a warning its own height; council has not measured a chair's reading distance.")),
      record("shelf-negotiation", "object", "library", "shelf-negotiation-minutes", ["kogasa", "akyuu"], l("書架拒絕原位置的會議紀錄，被宿舍處引用為家具發言權先例。", "書架の原位置拒否議事録を、寮務が家具発言権の先例として引用。", "Housing cites shelf-location negotiations as precedent for furniture speaking rights.")),
    ],
  },
  {
    id: "drift-reader-77",
    glyph: "漂",
    code: "HIEDA / 06",
    title: l("第七十七號漂流物：停在同一頁的閱讀器", "漂流物第77号：同じ頁で止まる読書端末", "Drift Object 77: the reader frozen on one page"),
    lead: l(
      "香霖堂認為它是讀書工具，霧湖館認為它是一冊書，河童認為它只是缺一條線；螢幕上的角色認為自己還沒被讀完。",
      "香霖堂は読書道具、霧の湖は一冊の本、河童は線一本不足と判断。画面の人物はまだ読み終えられていないと考える。",
      "Kourindou calls it a reading tool, Misty Lake a book, and the kappa a missing cable. The character on screen says they have not been finished.",
    ),
    tension: l(
      "用途鑑定要求可操作測試；保存規則禁止為測試抹掉那一頁。小傘提醒所有人先問物品是否反對。",
      "用途鑑定は操作試験を要求するが、保存規則は試験のための頁消去を禁じる。小傘はまず物の異議を尋ねよと注意。",
      "Purpose appraisal wants an operating test; preservation forbids erasing the page to test it. Kogasa asks whether the object objects.",
    ),
    characters: ["akyuu", "rinnosuke", "nitori", "kogasa", "yukari", "reimu"],
    versions: ["eight-objects-on-a-seven-object-shelf", "kappa-cabinets-reveal-their-drawers", "translation-keys-tie-the-red-ledger-thread", "five-records-share-one-red-thread"],
    eventQueries: [
      { types: ["appraisal.completed", "appraisal.catalogued"], refs: ["appraisal-object:frozen-reader"] },
      { types: ["book.borrowed", "book.renewed", "book.returned", "book.held"], refs: ["library-holding:outside-drift-catalogue"] },
      { types: ["course.enrolled", "course.waitlisted", "course.dropped"], refs: ["course:2026-autumn:BIS-271"] },
    ],
    records: [
      record("object-file", "object", "appraisal", "frozen-reader", ["rinnosuke", "nitori", "kogasa"], l("編號七十七不是總數；是架上那張紙拒絕讓下一件叫七十八。", "77は総数ではない。棚の札が次の品を78と呼ぶことを拒んだ。", "Seventy-seven is not a count; the shelf slip refused to call the next object seventy-eight.")),
      record("drift-research", "research", "research", "boundary", ["yukari", "akyuu"], l("漂移索引記錄被遺忘後的語義變化，不替外界說明書恢復名譽。", "漂流索引は忘却後の意味変化を記録し、外界説明書の名誉回復はしない。", "The drift index records semantic change after forgetting; it does not rehabilitate manuals.")),
      record("drift-catalogue", "object", "library", "outside-drift-catalogue", ["akyuu", "rinnosuke"], l("館藏標題寫七十七件，附件裡已經有第七十八張空白卡。", "蔵書名は77件だが、付録には78枚目の白紙カードがある。", "The holding says seventy-seven objects; its appendix already has a blank card 78.")),
      record("boundary-course", "learning", "course", "BIS-271", ["yukari"], l("學生先決定它跨過哪條邊界，再發現充電接口也有邊界。", "学生は越えた境界を先に決め、充電端子にも境界があると気づく。", "Students identify the crossed boundary, then discover the charging port has one too.")),
      record("wire-bbs", "community", "bbs-seed", "11", ["nitori", "rinnosuke"], l("香霖堂旁聽生免費送線；鑑定所要求先證明線不是另一件漂流物。", "香霖堂聴講生は線を無料提供。鑑定所は線自体が別の漂流物でない証明を要求。", "A Kourindou auditor offers free cables; Appraisal first wants proof the cable is not another drift object.")),
      record("lost-umbrella-news", "report", "news", "unknown-umbrella", ["kogasa", "reimu"], l("失物處說傘沒走失；傘說失物處才是被找到的那一方。", "遺失物係は傘は迷子でないと言い、傘は係の方が発見された側だと言う。", "Lost Property says the umbrella is not lost; the umbrella says the desk is what got found.")),
      record("appraisal-history", "archive", "history", "eight-objects-on-a-seven-object-shelf", ["akyuu", "rinnosuke", "nitori", "kogasa"], l("校史保存開桌的版本，也保存第七件之後為何忽然出現七十七號。", "大学史は開所版と、第七件の後に突然77号が現れた理由をともに保存。", "The chronicle keeps the opening version and why object 77 followed object seven.")),
    ],
  },
  {
    id: "spellcard-six-seals",
    glyph: "符",
    code: "HIEDA / 07",
    title: l("六印答辯：漂亮的彈幕是否仍有退路", "六印答弁：美しい弾幕にまだ退路はあるか", "Six-seal defence: does beautiful danmaku still leave an exit?"),
    lead: l(
      "設計稿、試飛場、研究方法、公開答辯與觀眾側記都給同一張符卡不同分數；校方拒絕把六枚印章平均成一個數。",
      "設計稿・試飛場・研究方法・公開答弁・観客側記は同じスペルへ別々の点を付ける。大学は六印の平均化を拒否。",
      "Design, sandbox, methods, public defence, and audience notes score the same spell differently. The university refuses to average six seals.",
    ),
    tension: l(
      "靈夢只問退路；魔理沙只問火力；文先寫標題；荷取量到 frame drop。四人都說自己沒有改題。",
      "霊夢は退路、魔理沙は火力、文は先に見出し、にとりはフレーム落ちを測る。四人とも問題は変えていないと言う。",
      "Reimu asks exits, Marisa output, Aya writes the headline first, and Nitori measures frame drops. All deny changing the question.",
    ),
    characters: ["akyuu", "reimu", "marisa", "aya", "nitori"],
    versions: ["six-seals-refuse-one-average", "three-hour-bell-and-public-defence", "translation-keys-tie-the-red-ledger-thread", "five-records-share-one-red-thread"],
    eventQueries: [
      { types: ["spellcard.design.saved", "spellcard.defence.completed"], refs: [] },
      { types: ["course.enrolled", "course.waitlisted", "course.dropped"], refs: ["course:2026-autumn:BIS-204"] },
    ],
    records: [
      record("pattern", "case", "spell-pattern", "amulet-fan", ["reimu", "marisa"], l("設計承諾留下數道門；第二波開始後，門與設計者對『留下』意見不同。", "設計は複数の門を残すと約束。第二波後、門と設計者で「残る」の解釈が違う。", "The design promises several gates; after wave two, gates and designer disagree on “remain.”")),
      record("spellcard-research", "research", "research", "spellcard", ["reimu", "marisa", "nitori"], l("研究分開記錄可讀性、公平與退路，不讓一個漂亮總分把它們吃掉。", "研究は可読性・公平・退路を別記し、美しい総合点に飲ませない。", "Research records readability, fairness, and exits separately so one pretty total cannot swallow them.")),
      record("spellcard-course", "learning", "course", "BIS-204", ["reimu"], l("退路設計占四成；畫成賽錢箱形狀依然不加分。", "退路設計は四割。賽銭箱型でも加点なし。", "Exit design is forty percent; donation-box shapes still earn no bonus.")),
      record("telegraph-holding", "object", "library", "spellcard-telegraph", ["reimu", "nitori"], l("五十組預兆圖裡有四十九組可讀；第五十組堅稱讀者站錯版本。", "50組中49組は可読。50組目は読者が誤った版に立つと主張。", "Forty-nine of fifty telegraphs are readable; the fiftieth says the reader stands in the wrong version.")),
      record("red-thread-rule", "governance", "governance", "red-thread-appeal", ["aya", "akyuu"], l("答辯失敗仍可保存，但紅線警告不能被彈幕特效蓋住。", "答弁失敗は保存可能だが、赤糸警告を弾幕演出で隠してはならない。", "A failed defence may be kept, but danmaku effects may not cover its red-thread warning.")),
      record("lantern-call", "report", "news", "spell-lantern", ["aya", "reimu"], l("徵件要求低噪音；妖精合唱團詢問『低』是音量、音高還是排名。", "募集は低騒音を要求。妖精合唱団は「低」が音量・音高・順位のどれか質問。", "The call asks for low noise; the fairy choir asks whether low means volume, pitch, or rank.")),
      record("workshop-history", "archive", "history", "six-seals-refuse-one-average", ["akyuu", "reimu", "marisa", "aya", "nitori"], l("校史記下第一座試飛場，也記下六枚印章為何拒絕平均。", "大学史は最初の試飛場と、六印が平均を拒んだ理由を記す。", "The chronicle records the first sandbox and why six seals refused one average.")),
    ],
  },
  {
    id: "consent-five-seats",
    glyph: "諾",
    code: "HIEDA / 08",
    title: l(
      "同意的五個門口：誰有權讓研究開始？",
      "同意の五つの入口：誰が研究開始を許せるか",
      "Five gates of consent: who may let research begin?",
    ),
    lead: l(
      "波長、讀心、停止時間、歷史刪除與漂流物拆機都能被完成；五席只追問一件更麻煩的事：完成它的人是否已經取得這樣做的權利。",
      "波長・読心・時間停止・歴史削除・漂流物分解は実行できる。五席が問うのは、実行者にその権利があるか。",
      "Wavelengths, mind-reading, stopped time, historical erasure, and drift-object disassembly can all be done. Five seats ask whether the person doing them has the right.",
    ),
    tension: l(
      "永琳要停止規則，覺說沒有落筆仍是讀取，慧音拒絕讓刪除收據也被刪，映姬不接受所有權代替同意，靈夢要求現場規則一口氣說得完。",
      "永琳は停止規則、さとりは非記録でも読取り、慧音は削除受領票の削除を拒否、映姫は所有権を同意の代用にせず、霊夢は現場規則を一息で言えるよう求める。",
      "Eirin asks for stopping rules; Satori says unwritten access is still access; Keine refuses to erase the deletion receipt; Eiki rejects ownership as consent; Reimu wants a field rule spoken in one breath.",
    ),
    characters: ["akyuu", "eirin", "satori", "keine", "eiki", "reimu", "sakuya", "reisen", "rinnosuke", "kogasa"],
    versions: ["six-seals-refuse-one-average", "five-records-share-one-red-thread", "five-seats-refuse-one-average"],
    eventQueries: [
      {
        types: ["ethics.protocol.submitted", "ethics.review.completed", "ethics.protocol.amended", "ethics.protocol.withdrawn"],
        refs: [
          "ethics-case:reisen-undisclosed-wave",
          "ethics-case:satori-no-notes",
          "ethics-case:sakuya-frozen-control",
          "ethics-case:keine-history-deletion",
          "ethics-case:drift-object-refusal",
        ],
      },
    ],
    records: [
      record("reisen-consent", "case", "ethics-case", "reisen-undisclosed-wave", ["eirin", "reisen", "reimu"], l("盲測能遮住研究問題，不能順便遮住參與者的拒絕權。", "盲検は研究問題を隠せても、参加者の拒否権まで隠せない。", "Blinding may hide the research question; it may not hide the right to refuse.")),
      record("satori-processing", "evidence", "ethics-case", "satori-no-notes", ["satori", "eiki", "akyuu"], l("覺沒有留下原念；阿求仍替『讀取曾發生』留了一張不含內容的索引紙。", "さとりは元の思念を残さず、阿求は「読取りがあった」ことだけを内容なしで索引。", "Satori retains no raw thought; Akyuu keeps a content-free slip that access occurred.")),
      record("sakuya-control", "research", "ethics-case", "sakuya-frozen-control", ["sakuya", "eirin", "reimu"], l("外界鐘面寫零分鐘；咲夜的操作順序寫了十七行。兩者沒有被平均成八點五行。", "外部時計は0分、咲夜の操作順序は17行。二つを平均して8.5行にはしない。", "The outside clock says zero minutes; Sakuya's operation sequence has seventeen lines. Nobody averages them into eight and a half.")),
      record("keine-receipt", "correction", "ethics-case", "keine-history-deletion", ["keine", "eiki", "akyuu"], l("內容可按請求刪除；刪除被受理的收據只證明權利曾被執行，不保存原文。", "内容は削除できるが、受理票は権利行使だけを証明し原文を保存しない。", "Content may be deleted; the receipt proves only that the right was exercised and retains no original text.")),
      record("object-assent", "object", "ethics-case", "drift-object-refusal", ["rinnosuke", "kogasa", "eiki"], l("拾得票讓香霖堂保管閱讀器；畫面上的『不要拆』仍然是一份沒有被票根吃掉的意見。", "拾得票は香霖堂の保管を認めるが、画面の「分解しないで」は半券に飲まれない意見。", "The salvage slip grants custody; “do not disassemble” remains an opinion the ticket stub cannot swallow.")),
      record("ethics-history", "archive", "history", "five-seats-refuse-one-average", ["akyuu", "eirin", "satori", "keine", "eiki", "reimu"], l("校史記下五席開會，也記下第一項決議是禁止使用平均釘書機。", "大学史は五席の開会と、最初の決定が平均ホチキス禁止だったことを記す。", "The chronicle records the five-seat opening and its first ruling: no averaging stapler.")),
    ],
  },
  {
    id: "festival-six-desks",
    glyph: "祭",
    code: "HIEDA / 09",
    title: l(
      "六桌一夜：到底有幾扇唯一正門？",
      "六机一夜：唯一の正門はいくつあるのか",
      "Six desks, one night: how many sole main gates exist?",
    ),
    lead: l(
      "同一場燈會在安全桌是退路，在河童桌是負載，在永遠亭是候診，在文的紙上已經提前開幕；三個信仰勢力則都帶來了唯一正門的鑰匙。",
      "同じ灯会が安全机では退路、河童机では負荷、永遠亭では待合、文の紙面では既に開幕済み。三つの信仰勢力は全て唯一正門の鍵を持参した。",
      "The same lantern festival is an exit plan at Safety, a load curve to the kappa, a clinic queue at Eientei, and already open in Aya's paper. Three faiths each arrive with the key to the sole main gate.",
    ),
    tension: l(
      "靈夢要一口氣說完停止規則；荷取要先知道神奈子會不會把備援也變成奉納；永琳把滿月當醫療條件；文堅稱提前九分鐘發布只是讓消息準時抵達。",
      "霊夢は停止規則を一息で、にとりは神奈子が予備電源まで奉納にしないか確認、永琳は満月を医療条件に、文は九分前の発行を情報の定刻到着だと主張。",
      "Reimu wants the stop rule in one breath; Nitori wants to know whether Kanako will turn the backup supply into an offering; Eirin treats the full moon as a medical condition; Aya calls publishing nine minutes early punctual delivery.",
    ),
    characters: ["akyuu", "reimu", "nitori", "eirin", "aya", "yukari", "kanako", "byakuren", "miko"],
    versions: ["six-desks-open-one-contested-gate", "translation-keys-tie-the-red-ledger-thread", "five-records-share-one-red-thread"],
    eventQueries: [
      {
        types: [
          "festival.plan.submitted",
          "festival.permit.issued",
          "festival.shift.started",
          "festival.incident.resolved",
          "festival.report.closed",
        ],
        refs: [],
      },
    ],
    records: [
      record("festival-brief", "case", "festival-kind", "spring-lantern", ["reimu", "aya", "akyuu"], l("徵件寫非攻擊性光彈；安全桌另附一張紙，詢問光彈知不知道自己不是攻擊。", "募集要項は非攻撃光弾。安全机は別紙で、光弾自身が非攻撃だと知っているか質問。", "The call says non-aggressive light danmaku; Safety attaches a sheet asking whether the danmaku knows that.")),
      record("six-desk-sheet", "governance", "festival-desk", "faith", ["kanako", "byakuren", "miko", "reimu"], l("信仰桌沒有表決誰比較唯一；它把三份開幕辭按同一分鐘排好，讓爭議準時發生。", "信仰机は誰がより唯一か採決せず、三つの開幕辞を同時刻へ並べて争いを定刻開催。", "The faith desk does not vote on who is more sole; it schedules three opening addresses for the same minute so the dispute begins on time.")),
      record("procession-line", "evidence", "festival-route", "three-faith-loop", ["yukari", "reimu", "byakuren"], l("路線圖有一個入口、三個標成正門的箭頭，以及一條只供不會飛者使用但常被掃帚抄近路的地線。", "経路図は入口一つ、正門と記した矢印三つ、飛べない者専用だが箒が近道に使う地上線一本。", "The route has one entrance, three arrows marked main gate, and one ground line for non-fliers that brooms keep using as a shortcut.")),
      record("mixed-power", "evidence", "festival-power", "mixed-grid", ["nitori", "kanako"], l("河童負責把電送到燈；守矢負責說明燈為何亮。停電時雙方各自證明不是自己的那一半。", "河童は灯へ電気を送り、守矢は灯が光る理由を説明。停電時は双方が自分の半分ではないと証明。", "Kappa deliver power to the lanterns; Moriya explains why they shine. During an outage, each proves it was not their half.")),
      record("aya-opening", "report", "festival-incident", "aya-early-opening", ["aya", "akyuu", "reimu"], l("號外在許可前九分鐘寫『如期開幕』；訂正欄在許可後九分鐘補上『如哪一期』。", "号外は許可九分前に「予定通り開幕」。訂正欄は九分後に「どの予定か」を追記。", "The extra says “opened as scheduled” nine minutes before approval; Corrections adds “which schedule” nine minutes after.")),
      record("gate-claim", "correction", "festival-gate", "rotating", ["kanako", "byakuren", "miko", "yukari"], l("輪值表每二十分鐘更換唯一正門。紫在分鐘之間加了一條境界，於是同一瞬間仍保留兩個唯一。", "当番表は二十分ごとに唯一正門を交代。紫が分の間へ境界を足し、同じ瞬間に唯一が二つ残る。", "The rota changes the sole gate every twenty minutes. Yukari inserts a boundary between minutes, leaving two sole gates in the same instant.")),
      record("festival-history", "archive", "history", "six-desks-open-one-contested-gate", ["akyuu", "reimu", "nitori", "eirin", "aya", "kanako", "byakuren", "miko"], l("校史記下運營室開桌，也把結祭後仍未解決的正門異議夾在下一屆申請表前。", "大学史は運営室の開机と、閉祭後も未解決の正門異議を次年度申請書の前へ綴じた。", "The chronicle records the operations room opening and files the unresolved gate objection ahead of next year's application.")),
    ],
  },
  {
    id: "fieldwork-twenty-four-seals",
    glyph: "旅",
    code: "HIEDA / 10",
    title: l(
      "二十四枚場地印：哪一枚證明你真的回來？",
      "二十四の現地印：どの印が本当に帰った証明か",
      "Twenty-four field seals: which one proves you truly returned?",
    ),
    lead: l(
      "紅魔館的值班簿、白玉樓的幽靈點名與香霖堂的物件陳述都可成為田野來源；沒有一份能替另一份承認你看見了什麼。",
      "紅魔館の当直簿、白玉楼の幽霊点呼、香霖堂の物件陳述はいずれも現地資料となるが、互いに観察内容を承認することはできない。",
      "The Scarlet duty log, Hakugyokurou phantom roll, and Kourindou object testimony may all be field sources; none can certify what another says you observed.",
    ),
    tension: l(
      "慧音要出發前寫清問題；咲夜的零分鐘值班卻讓日期失效；妖夢數完幽靈後，幽幽子又問自己是否算在宴席裡；阿求只好把爭議用紅線和印章一起裝訂。",
      "慧音は出発前の問いを要求するが、咲夜の0分当番は日付を無効にする。妖夢が幽霊を数え終えると、幽々子は自分が宴席人数に入るか尋ねる。阿求は争議を赤糸と印で綴じる。",
      "Keine requires a question before departure; Sakuya's zero-minute shift voids the date; after Youmu counts the phantoms, Yuyuko asks whether she was included at dinner. Akyuu binds the dispute beside the seal.",
    ),
    characters: ["akyuu", "keine", "sakuya", "patchouli", "rinnosuke", "satori", "youmu", "yuyuko"],
    versions: ["twenty-four-seals-return-with-red-thread", "translation-keys-tie-the-red-ledger-thread", "five-records-share-one-red-thread"],
    eventQueries: [{
      types: [
        "fieldwork.application.submitted",
        "fieldwork.departure.checked",
        "fieldwork.complication.handled",
        "fieldwork.observation.logged",
        "fieldwork.return.certified",
      ],
      refs: [],
    }],
    records: [
      record("scarlet-duty", "evidence", "fieldwork-station", "scarlet-devil-mansion", ["sakuya", "patchouli"], l("咲夜的值班簿有完整順序卻沒有經過時間；帕秋莉要求實習生不要把兩者平均成『大概準時』。", "咲夜の当直簿は順序が完全だが経過時間はない。パチュリーは二つを平均して「だいたい定刻」にしないよう要求。", "Sakuya's duty book has a complete sequence and no elapsed time; Patchouli forbids averaging both into “roughly punctual.”")),
      record("phantom-roll", "evidence", "fieldwork-station", "hakugyokurou", ["youmu", "yuyuko"], l("妖夢把幽靈分成在場、穿過、正在被吃與堅稱只是花瓣四欄；幽幽子在第五欄簽名。", "妖夢は幽霊を在席・通過・食事中・花弁だと主張の四欄へ分類。幽々子は第五欄に署名。", "Youmu sorts phantoms into present, passing, being eaten, and insisting they are petals; Yuyuko signs a fifth column.")),
      record("object-statement", "object", "fieldwork-station", "kourindou", ["rinnosuke"], l("霖之助可鑑定名稱；用途仍由磨損、物件意見與一張過度自信的標價互相爭論。", "霖之助は名称を鑑定できるが、用途は摩耗・物件の意見・自信過剰な値札が争う。", "Rinnosuke may identify a name; wear, the object's view, and an overconfident price tag still dispute its use.")),
      record("unsubmitted-thought", "ethics", "fieldwork-station", "chireiden", ["satori"], l("覺讀到的內容不會因沒有落筆而不存在；也不會因她讀到了就自動取得研究用途。", "さとりが読んだ内容は非記録でも不存在にはならず、読まれたことで研究利用可能にもならない。", "What Satori reads does not cease to exist because unwritten, nor become research-eligible merely because she read it.")),
      record("ghost-headcount", "correction", "fieldwork-complication", "ghost-headcount", ["youmu", "yuyuko", "akyuu"], l("幽靈名冊在點名後多出三位、少掉兩份半靈；訂正沒有改總數，只把數法夾在旁邊。", "幽霊名簿は点呼後に三名増え半霊二体減少。訂正は総数を変えず数え方を横へ綴じた。", "The phantom roll gains three and loses two half-phantoms after call; Corrections preserves the total and files the counting method beside it.")),
      record("fieldwork-history", "archive", "history", "twenty-four-seals-return-with-red-thread", ["akyuu", "keine", "sakuya", "youmu"], l("校史只把派遣、偏差、來源與返校印串成前因；它沒有把蓋章改寫成現場同意你的結論。", "大学史は派遣・偏差・資料源・帰校印を前因で結ぶだけで、押印を現地による結論同意へ書き換えない。", "The chronicle links dispatch, complication, provenance, and return seal by cause; it does not rewrite stamping as the field agreeing with your conclusion.")),
    ],
  },
  {
    id: "commons-early-letter",
    glyph: "便",
    code: "HIEDA / 11",
    title: l(
      "一把傘拒絕回家、一封裁定提早抵達，而春天仍未簽收",
      "傘は帰宅を拒み、裁定は早着し、春はまだ未受領",
      "An umbrella refuses home, a ruling arrives early, and spring remains unsigned",
    ),
    lead: l(
      "同一件事在物件陳述、領回單、四席裁定、鴉天狗版次、木板訂正與學年曆上留下六種時間；阿求拒絕替它們選一個最方便的。",
      "同じ事柄が物件陳述、受取票、四席裁定、鴉天狗版、木札訂正、学年暦へ六つの時刻を残す。阿求は都合のよい一つを選ばない。",
      "One matter leaves six times across object testimony, collection form, four-seat ruling, tengu version, wooden correction, and calendar. Akyuu refuses to choose the convenient one.",
    ),
    tension: l(
      "小傘問物件是否被冷落，霖之助問磨損是否支持名稱，映姬問誰能保管與申訴；文只問標題能否在聽證前九分鐘刊出。慧音最後發現，郵件日期正落在白玉樓拒絕承認的春季。",
      "小傘は放置、霖之助は名称と摩耗、映姫は保管と不服申立を問う。文だけは聴聞九分前に見出しを出せるか尋ねる。慧音は郵便日が白玉楼の拒む春にあると気づく。",
      "Kogasa asks about neglect, Rinnosuke about name and wear, Eiki about custody and appeal; Aya asks only whether the headline can run nine minutes before hearing. Keine finds the post dated in the spring Hakugyokurou rejects.",
    ),
    characters: ["kogasa", "rinnosuke", "akyuu", "eiki", "aya", "keine", "yukari"],
    versions: ["lost-things-appeal-mail-arrives-before-spring", "twenty-four-seals-return-with-red-thread", "five-records-share-one-red-thread"],
    eventQueries: [{
      types: [
        "property.claim.submitted",
        "property.ruling.issued",
        "post.message.acknowledged",
        "post.correction.requested",
        "post.notice.dispatched",
        "calendar.event.saved",
        "calendar.event.removed",
      ],
      refs: [],
    }],
    records: [
      record("sunny-umbrella", "object", "property-item", "umbrella-rain-claim", ["kogasa", "rinnosuke", "akyuu", "eiki"], l("傘的收據證明購買，十九個晴日證明冷落；兩份證據都是真的，卻要求不同去向。", "領収書は購入を、晴天十九日は放置を証明。両方とも真だが異なる行先を求める。", "The receipt proves purchase and nineteen sunny days prove neglect. Both are true and ask for different destinations.")),
      record("early-admission", "report", "post-message", "admission-before-application", ["aya", "akyuu"], l("錄取信早於申請抵達；第二版把『有條件』從信封背面移回標題，第一版仍留在訂正欄。", "合格通知は願書より早着。第二版は「条件付」を封筒裏から件名へ戻し、第一版は訂正欄へ残る。", "The offer precedes the application. Version two restores “conditional” from the back; version one remains in Corrections.")),
      record("spring-not-received", "correction", "calendar-event", "spring-snow-dispute", ["keine", "yukari"], l("校務曆宣布春季開始，白玉樓仍以積雪拒收；課表因此同時保留冬季與春季版。", "学務暦は春開始を宣言、白玉楼は積雪で受領拒否。時間割は冬版・春版を併存。", "The calendar declares spring; Hakugyokurou refuses delivery for snow, leaving winter and spring timetables together.")),
      record("full-moon-mail", "evidence", "calendar-event", "full-moon-special", ["keine", "aya"], l("滿月特講依月亮越過竹梢生效；文文。號外的發刊時間不能代替月亮抵達。", "満月特講は月が竹梢を越えて発効。文々。号外の発行時刻は月の到着を代替しない。", "The full-moon class activates when the moon clears bamboo; Bunbunmaru publication time cannot substitute for lunar arrival.")),
      record("same-serial-ear", "object", "property-item", "outside-earbud", ["rinnosuke", "akyuu", "aya"], l("兩件左耳耳機共享序號並各自收信；仲裁處把序號本身列為失物，郵便處仍想把兩件都當收件箱。", "同一番号の左耳二点が各自受信。仲裁所は番号自体を遺失物へ、郵便は両方を受信箱にしたい。", "Two left earbuds share a serial and receive separately. Property lists the serial as lost while Post wants both as inboxes.")),
      record("commons-history", "archive", "history", "lost-things-appeal-mail-arrives-before-spring", ["akyuu", "kogasa", "aya", "keine"], l("校史把物件、郵便與學年曆接上同一條紅線，卻沒有把送達順序改寫成因果順序。", "大学史は物件・郵便・学年暦を一本の赤糸へ結ぶが、配達順を因果順へ書き換えない。", "The chronicle ties object, post, and calendar with one red thread without rewriting delivery order as causal order.")),
    ],
  },
  {
    id: "graduation-before-enrolment",
    glyph: "卒",
    code: "HIEDA / 12",
    title: l(
      "一份學位、十二條進路與早到九分鐘的校友名冊",
      "一つの学位、十二の進路、九分早着した同窓名簿",
      "One degree, twelve paths, and an alumni roll nine minutes early",
    ),
    lead: l(
      "卒業判定證明八張案頭都看過自己的欄，沒有證明學籍、時間與本人會在同一版本裡抵達。",
      "卒業判定は八机が各欄を見た証明であり、学籍・時間・本人が同じ版へ到着する証明ではない。",
      "Graduation proves eight desks saw their own fields; it does not prove record, time, and graduate arrive in the same edition.",
    ),
    tension: l(
      "慧音要求核心課與年代可追溯，阿求卻找到一份晚於卒業才登錄的入學卷；文已刊出校友名冊，紫則把學位年份翻到紙背。進路室只能問：這一版的你，明天願意拒絕做什麼？",
      "慧音は必修と年代の追跡を要求するが、阿求は卒業後に登録された入学記録を発見。文は同窓名簿を発行済み、紫は学位年を紙背へ移す。進路室が問えるのは、この版のあなたが明日何を拒むかだけ。",
      "Keine demands traceable cores and chronology; Akyuu finds an admission entered after graduation. Aya has published the alumni roll, while Yukari moves the degree year to the reverse. Careers can only ask what this edition of you will refuse tomorrow.",
    ),
    characters: ["akyuu", "keine", "aya", "yukari", "eiki", "reimu", "sakuya", "youmu", "yuyuko"],
    versions: ["employment-denominator-refuses-one-rate", "degree-arrives-nine-minutes-after-alumni-invitation", "lost-things-appeal-mail-arrives-before-spring", "five-records-share-one-red-thread"],
    eventQueries: [{
      types: [
        "graduation.audit.requested",
        "graduation.degree.issued",
        "career.plan.submitted",
        "career.referral.sent",
        "employment.application.submitted",
        "employment.application.responded",
        "employment.outcome.attested",
        "alumni.profile.activated",
        "alumni.reunion.rsvp",
        "alumni.mentorship.offered",
      ],
      refs: [],
    }],
    records: [
      record("graduation-capstone", "learning", "course", "HRS-410", ["akyuu", "keine"], l("卒業檔案必須保留一份本人不相信、卻不能刪除的版本；判定席也不得把它改成較好看的平均值。", "卒業資料には本人が信じないが削除できない版を残す。判定席も見栄えのよい平均へ変えてはならない。", "The capstone keeps one version the graduate distrusts but may not delete; the board may not average it into a prettier result.")),
      record("missing-year-job", "case", "career-opening", "terakoya-missing-year", ["keine", "akyuu"], l("進路卷要求補上被刪除的週三，卻禁止把想像的課堂寫成親見；職缺因此同時缺人與缺一天。", "進路記録は削除された水曜の補講を求めるが、想像の授業を直接観察として書くことは禁止。求人は人と一日の両方を欠く。", "The role restores deleted Wednesdays but forbids recording imagined lessons as observed; the vacancy lacks both a person and a day.")),
      record("zero-minute-recruitment", "report", "employment-job", "scarlet-zero-minute-maid", ["sakuya", "akyuu", "eiki"], l("紅魔館把衣食住、零分鐘夜班與停止時間不計加班寫在同一張廣告；阿求保存初版，映姬要求後半句不得只用紅圈代替裁定。", "紅魔館は衣食住・0分夜勤・停止時間の残業不算入を同じ求人へ記す。阿求は初版を保存し、映姫は後半を赤丸だけで裁定したことにしない。", "The Scarlet notice puts room and board, a zero-minute night shift, and stopped-time overtime on one sheet. Akyuu keeps version one; Eiki refuses to treat a red circle as a ruling.")),
      record("denominator-hearing", "correction", "employment-outcome", "multiple", ["akyuu", "keine", "aya", "yukari", "youmu", "yuyuko"], l("同一屆一四六人留下多於一四六份有效去向：半靈分開簽到、兩個雇主同時認領、死後仍在職，以及一條拒絕被觀測的路線。這不是計算錯誤，而是計算規則正在被當事人反對。", "同じ146名から146を超える有効進路が残る。半霊の別签到、二雇主の同時在籍、死後勤務、観測拒否経路。計算誤りではなく、計数規則へ当事者が異議を出している。", "One cohort of 146 leaves more than 146 valid whereabouts: separate half-phantom check-ins, dual employer claims, posthumous duty, and a route refusing observation. The arithmetic is not broken; its subjects dispute the counting rule.")),
      record("late-arrival-alumni", "community", "alumni-chapter", "higan-late-arrivals", ["eiki", "akyuu"], l("彼岸支部準時在彼岸週結束後集合，仍在爭論已死但尚未入學者能否補登校友籍。", "彼岸支部は彼岸週終了後に定刻集合し、死亡済み未入学者の校友補記をなお議論する。", "The Higan chapter starts punctually after Higan week and still debates alumni status for the deceased but not yet enrolled.")),
      record("early-invitation", "report", "post-message", "admission-before-application", ["aya", "akyuu"], l("早於申請抵達的錄取信成為早於卒業抵達的校友邀請之先例；訂正版沒有撤回第一版，只把前因寄到後面。", "出願より先に届く合格通知が、卒業前に届く同窓招待の先例となる。訂正版は初版を撤回せず、原因を後から郵送した。", "The offer arriving before application becomes precedent for an alumni invitation arriving before graduation; correction mails the cause later without withdrawing version one.")),
      record("phantom-count", "evidence", "fieldwork-station", "hakugyokurou", ["youmu", "yuyuko"], l("白玉樓場地印只證明妖夢把名冊帶回；不證明半靈算一人、兩人，或幽幽子點名後才追加的一席。", "白玉楼印は妖夢が名簿を持ち帰った証明であり、半霊が一名か二名か、幽々子が点呼後に足した一席かは証明しない。", "The Hakugyokurou seal proves Youmu returned with a roll, not whether a half-phantom counts as one, two, or Yuyuko's post-roll extra seat.")),
      record("graduation-history", "archive", "history", "degree-arrives-nine-minutes-after-alumni-invitation", ["akyuu", "keine", "aya", "yukari"], l("校史把判定、學位、進路與校友事件按 first-parent 實際版本串起來；邀請函的送達順序仍留在另一欄反對。", "大学史は判定・学位・進路・同窓イベントを first-parent の実版で結ぶ。招待状の配達順は別欄で反対を続ける。", "The chronicle links audit, degree, careers, and alumni by actual first-parent versions; invitation delivery order continues objecting in another column.")),
    ],
  },
]);

const sourceCollections = {
  incident: incidentCases,
  governance: governanceProposals,
  news: newsItems,
  course: courseCatalogue,
  assignment: academicAssignments,
  library: libraryHoldings,
  appraisal: appraisalObjects,
  residence: residences,
  history: campusHistory,
  "spell-pattern": spellPatterns,
  "ethics-case": ethicsCases,
  "festival-kind": festivalKinds,
  "festival-route": festivalRoutes,
  "festival-power": festivalPowerPlans,
  "festival-gate": festivalGatePlans,
  "festival-desk": festivalReviewDesks,
  "festival-incident": festivalIncidentPool,
  "fieldwork-station": fieldworkStations,
  "fieldwork-complication": fieldworkComplications,
  "property-item": propertyItems,
  "post-message": postSeedMessages,
  "calendar-event": academicCalendarEvents,
  "career-opening": careerOpenings,
  "employment-job": employmentJobs,
  "employment-outcome": employmentOutcomeKinds,
  "alumni-chapter": alumniChapters,
};

const localized = (value, locale) => value?.[locale] || value?.["zh-Hant"] || value || "";

function routeForSource(source) {
  const routes = {
    incident: `incident-case-${source.id}`,
    "incident-evidence": `incident-case-${source.caseId}`,
    governance: `governance-${source.id}`,
    "bbs-seed": `bbs-seed-${source.id}`,
    news: `news-${source.id}`,
    course: `course-${source.id}`,
    assignment: "academic-work",
    research: `research-${source.id}`,
    library: `library-${source.id}`,
    appraisal: `appraisal-object-${source.id}`,
    residence: `housing-residence-${source.id}`,
    history: `chronicle-${source.id}`,
    "spell-pattern": `spellcard-pattern-${source.id}`,
    "ethics-case": `ethics-case-${source.id}`,
    "festival-kind": "festival-operations",
    "festival-route": "festival-operations",
    "festival-power": "festival-operations",
    "festival-gate": "festival-operations",
    "festival-desk": "festival-operations",
    "festival-incident": "festival-operations",
    "fieldwork-station": `fieldwork-station-${source.id}`,
    "fieldwork-complication": "fieldwork-stations",
    "property-item": `property-item-${source.id}`,
    "post-message": `post-message-${source.id}`,
    "calendar-event": `calendar-event-${source.id}`,
    "career-opening": `career-opening-${source.id}`,
    "employment-job": `employment-job-${source.id}`,
    "employment-outcome": "employment-outcomes",
    "alumni-chapter": `alumni-chapter-${source.id}`,
  };
  return routes[source.type] || "top";
}

function findSource(source) {
  if (source.type === "incident-evidence") {
    return incidentCases
      .find((incident) => incident.id === source.caseId)
      ?.evidence.find((item) => item.id === source.id);
  }
  if (source.type === "bbs-seed") return seededPosts[Number(source.id)] || null;
  if (source.type === "research") return researchFiles[source.id] || null;
  return sourceCollections[source.type]?.find((item) => item.id === source.id || item.code === source.id) || null;
}

export function resolveKnowledgeRecord(recordEntry, locale = "zh-Hant") {
  const source = findSource(recordEntry.source);
  if (!source) return null;
  let title = "";
  let detail = "";

  switch (recordEntry.source.type) {
    case "incident":
      title = localized(source.title, locale);
      detail = `${source.code} · ${localized(source.location, locale)}`;
      break;
    case "incident-evidence":
      title = localized(source.title, locale);
      detail = `${localized(source.source, locale)} · ${localized(source.reliability, locale)}`;
      break;
    case "governance":
      title = localized(source.title, locale);
      detail = `${source.code} · ${localized(source.sponsor, locale)}`;
      break;
    case "bbs-seed":
      title = localized(source[2], locale);
      detail = `${localized(source[1], locale)} · BBS`;
      break;
    case "news":
      title = localized(source.title, locale);
      detail = `${source.date} · ${localized(source.category, locale)}`;
      break;
    case "course":
      title = `${source.code} · ${localized(source.title, locale)}`;
      detail = localized(source.instructor, locale);
      break;
    case "assignment":
      title = localized(source.title, locale);
      detail = `${source.courseCode} · ${localized(source.teacher, locale)}`;
      break;
    case "research":
      title = localized(source.title, locale);
      detail = source.kicker;
      break;
    case "library":
      title = localized(source.title, locale);
      detail = `${source.callNumber} · ${localized(source.author, locale)}`;
      break;
    case "appraisal":
      title = localized(source.name, locale);
      detail = `${source.code} · ${localized(source.workingTitle, locale)}`;
      break;
    case "residence":
      title = localized(source.name, locale);
      detail = localized(source.area, locale);
      break;
    case "history":
      title = localized(source.title, locale);
      detail = `${source.archiveId} · ${localized(source.era, locale)}`;
      break;
    case "spell-pattern":
      title = localized(source.name, locale);
      detail = localized(source.premise, locale);
      break;
    case "ethics-case":
      title = localized(source.title, locale);
      detail = `${source.code} · ${localized(source.conflict, locale)}`;
      break;
    case "festival-kind":
      title = localized(source.name, locale);
      detail = `${source.code} · ${localized(source.short, locale)}`;
      break;
    case "festival-route":
      title = localized(source.name, locale);
      detail = localized(source.detail, locale);
      break;
    case "festival-power":
      title = localized(source.name, locale);
      detail = `${localized(source.owner, locale)} · ${localized(source.dispute, locale)}`;
      break;
    case "festival-gate":
      title = localized(source.name, locale);
      detail = localized(source.claimant, locale);
      break;
    case "festival-desk":
      title = localized(source.name, locale);
      detail = localized(source.question, locale);
      break;
    case "festival-incident":
      title = localized(source.title, locale);
      detail = localized(source.body, locale);
      break;
    case "fieldwork-station":
      title = localized(source.name, locale);
      detail = `${source.code} · ${localized(source.supervisor, locale)}`;
      break;
    case "fieldwork-complication":
      title = localized(source.title, locale);
      detail = localized(source.detail, locale);
      break;
    case "property-item":
      title = localized(source.name, locale);
      detail = `${source.code} · ${localized(source.statement, locale)}`;
      break;
    case "post-message":
      title = localized(source.subject, locale);
      detail = `${localized(source.source, locale)} · v${source.version}`;
      break;
    case "calendar-event":
      title = localized(source.title, locale);
      detail = `${source.code} · ${localized(source.window, locale)}`;
      break;
    case "career-opening":
      title = localized(source.title, locale);
      detail = `${source.code} · ${localized(source.institution, locale)}`;
      break;
    case "employment-job":
      title = localized(source.title, locale);
      detail = `${source.code} · ${localized(source.employer, locale)}`;
      break;
    case "employment-outcome":
      title = localized(source.title, locale);
      detail = localized(source.note, locale);
      break;
    case "alumni-chapter":
      title = localized(source.title, locale);
      detail = `${localized(source.steward, locale)} · ${localized(source.meeting, locale)}`;
      break;
    default:
      return null;
  }

  return {
    ...recordEntry,
    route: routeForSource(recordEntry.source),
    title,
    detail,
    annotation: localized(recordEntry.annotation, locale),
    kindLabel: localized(knowledgeRecordKinds[recordEntry.kind], locale),
    source,
  };
}

export function knowledgeDossier(id) {
  return knowledgeDossiers.find((dossier) => dossier.id === id) || null;
}

export function knowledgeCharacter(id) {
  return knowledgeCharacters.find((character) => character.id === id) || null;
}

export function knowledgeVersions() {
  const ids = new Set(knowledgeDossiers.flatMap((dossier) => dossier.versions));
  return campusHistory.filter((entry) => ids.has(entry.id));
}

function eventReferenceKeys(event) {
  return new Set([
    event?.subject?.kind && event?.subject?.id ? `${event.subject.kind}:${event.subject.id}` : "",
    ...(event?.relations || []).map((relation) => (
      relation?.target?.kind && relation?.target?.id
        ? `${relation.target.kind}:${relation.target.id}`
        : ""
    )),
  ].filter(Boolean));
}

export function dossierMatchesEvent(dossier, event) {
  const references = eventReferenceKeys(event);
  return dossier.eventQueries.some((query) => (
    query.types.includes(event.type)
    && (!query.refs.length || query.refs.some((reference) => references.has(reference)))
  ));
}

export function dossiersForCharacter(characterId) {
  return knowledgeDossiers.filter((dossier) => dossier.characters.includes(characterId));
}

export function dossiersForVersion(versionId) {
  return knowledgeDossiers.filter((dossier) => dossier.versions.includes(versionId));
}
