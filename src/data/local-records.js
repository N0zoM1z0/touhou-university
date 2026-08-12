const l = (zhHant, ja, en) => ({ "zh-Hant": zhHant, ja, en });

const record = (key, group, title, options = {}) => ({
  key,
  group,
  storage: "local",
  portable: true,
  kind: "record",
  scope: "device",
  encoding: "json",
  ...options,
  title,
});

export const localRecordGroups = [
  {
    id: "identity",
    mark: "籍",
    title: l("身分與學籍", "身分・学籍", "Identity & student record"),
    note: l(
      "My TU 身分、校園履歷與申請審查。",
      "My TU 身分、学内履歴、出願審査。",
      "My TU identity, campus history, and application reviews.",
    ),
  },
  {
    id: "admissions",
    mark: "願",
    title: l("招生與試驗", "入試・試験", "Admissions & examinations"),
    note: l(
      "申請、進校預約與兩類試驗的草稿和結果。",
      "出願、来校予約、二種類の試験の下書きと結果。",
      "Drafts and results for applications, visits, and both examination systems.",
    ),
  },
  {
    id: "academics",
    mark: "課",
    title: l("課業與校務", "課業・学務", "Academic work & governance"),
    note: l(
      "選課、成績、作業、答辯與治理投票。",
      "履修、成績、課題、答弁、学内投票。",
      "Registration, grades, coursework, defences, and governance votes.",
    ),
  },
  {
    id: "library",
    mark: "書",
    title: l("圖書館與鑑定", "図書館・鑑定", "Library & appraisal"),
    note: l(
      "借閱、預約及外界漂流物鑑定檔案。",
      "貸出、予約、外界漂流物の鑑定記録。",
      "Loans, holds, and Outside World drift-object appraisal files.",
    ),
  },
  {
    id: "campus",
    mark: "談",
    title: l("校園生活", "キャンパス生活", "Campus life"),
    note: l(
      "BBS、住宿、醫療、事件中心與祭典營運的本機紀錄。",
      "BBS、学生寮、医療、事案センター、祭典運営の端末内記録。",
      "On-device BBS, housing, healthcare, incident-centre, and festival-operations records.",
    ),
  },
  {
    id: "research",
    mark: "研",
    title: l("研究工房", "研究工房", "Research workshops"),
    note: l(
      "符卡設計、公開答辯與研究草稿。",
      "スペルカード設計、公開答弁、研究下書き。",
      "Spell-card designs, public defences, and research drafts.",
    ),
  },
  {
    id: "fieldwork",
    mark: "旅",
    title: l("境內實習護照", "境内実習旅券", "Fieldwork passport"),
    note: l(
      "派遣草稿、外勤處置、返校回報與二十四站印章。",
      "派遣下書き、現地初動、帰校報告、二十四実習所の印。",
      "Dispatch drafts, field responses, return reports, and seals from twenty-four stations.",
    ),
  },
  {
    id: "commons",
    mark: "便",
    title: l("物權、郵便與學年曆", "物権・郵便・学年暦", "Property, post & calendar"),
    note: l(
      "付喪神聽證、鴉天狗通知狀態、寄件卷與紅書籤曆葉。",
      "付喪神聴聞、鴉天狗通知状態、発送記録、赤い栞の暦葉。",
      "Tsukumogami hearings, tengu-post state, dispatch files, and red-bookmarked calendar leaves.",
    ),
  },
  {
    id: "careers",
    mark: "卒",
    title: l("卒業、進路與校友", "卒業・進路・同窓", "Graduation, careers & alumni"),
    note: l(
      "八席判定、學位、進路媒合、怪歷書、離校去向口供與百鬼夜行校友籍。",
      "八席判定、学位、進路照合、怪歴書、離校先証言、百鬼夜行校友籍。",
      "Eight-desk audits, degrees, career matching, odd résumés, whereabouts statements, and Hyakki Yagyo alumni files.",
    ),
  },
  {
    id: "preferences",
    mark: "栞",
    title: l("介面書籤", "画面の栞", "Interface bookmarks"),
    note: l(
      "語言、導覽入口與最後開啟位置；刪除後不會抹去正式紀錄。",
      "言語、案内入口、最後に開いた位置。削除しても正式記録は消えません。",
      "Language, audience route, and last-opened positions; deleting these does not erase formal records.",
    ),
  },
  {
    id: "system",
    mark: "簿",
    title: l("校務事件帳本", "学務イベント台帳", "Campus event ledger"),
    note: l(
      "My TU 用來串連各處室行動的去重事件索引。",
      "My TU が各部署の行動を結ぶ重複除去イベント索引。",
      "The deduplicated event index My TU uses to connect actions across offices.",
    ),
  },
  {
    id: "dream",
    mark: "夢",
    title: l("反面檔案", "裏面ファイル", "Reverse-side files"),
    note: l(
      "只在曾被寫入時出現，與正式學籍及事件帳本分開保存。",
      "書き込まれた場合のみ現れ、正式な学籍・イベント台帳とは分離されます。",
      "Shown only after being written and kept separate from formal records and the campus ledger.",
    ),
  },
  {
    id: "unknown",
    mark: "?",
    title: l("未登錄卷宗", "未登録ファイル", "Unregistered files"),
    note: l(
      "使用 tu: 前綴但尚未列入檔案目錄的新資料。",
      "tu: 接頭辞を持つものの、まだ目録へ登録されていない新しいデータ。",
      "New data using the tu: prefix that has not yet entered the archive catalogue.",
    ),
  },
];

export const localRecordRegistry = [
  record("tu:identity", "identity", l("My TU 本機身分", "My TU 端末内身分", "My TU on-device identity")),
  record("tu:application:reviews", "identity", l("教授聯合審查", "教員合同審査", "Joint faculty reviews")),

  record("tu:application:draft", "admissions", l("入學申請草稿", "入学願書の下書き", "Application draft"), { kind: "draft" }),
  record("tu:application:submissions", "admissions", l("入學申請送件", "入学願書の提出", "Submitted applications")),
  record("tu:visit:draft", "admissions", l("進校預約草稿", "来校予約の下書き", "Campus-visit draft"), { kind: "draft" }),
  record("tu:visits", "admissions", l("進校預約", "来校予約", "Campus visits")),
  record("tu:exam:history", "admissions", l("入學試驗成績", "入学試験成績", "Entrance-exam results")),
  record("tu:gaokao:draft", "admissions", l("統一試驗答題草稿", "統一試験の解答下書き", "Unified-exam draft"), { kind: "draft" }),
  record("tu:gaokao:attempts", "admissions", l("統一試驗作答紀錄", "統一試験の受験記録", "Unified-exam attempts")),

  record("tu:courses:registration", "academics", l("本學期選課", "今学期の履修", "Current registration")),
  record("tu:courses:transcript", "academics", l("課程成績單", "履修成績表", "Course transcript")),
  record("tu:academics:drafts", "academics", l("課程作業草稿", "課題の下書き", "Coursework drafts"), { kind: "draft" }),
  record("tu:academics:submissions", "academics", l("課程作業繳交", "課題提出", "Coursework submissions")),
  record("tu:academics:exam-session", "academics", l("進行中的課程考試", "進行中の科目試験", "Active course examination"), { kind: "draft" }),
  record("tu:academics:exam-attempts", "academics", l("課程考試紀錄", "科目試験記録", "Course examination attempts")),
  record("tu:academics:projects", "academics", l("論文／符卡專題", "論文／スペルカード研究", "Thesis / spell-card projects")),
  record("tu:academics:defences", "academics", l("課業公開答辯", "課業公開答弁", "Academic defences")),
  record("tu:governance:votes", "academics", l("校務治理投票", "学務ガバナンス投票", "Governance votes")),

  record("tu:library:loans", "library", l("圖書借閱", "図書貸出", "Library loans")),
  record("tu:library:holds", "library", l("圖書預約", "図書予約", "Library holds")),
  record("tu:appraisal:drafts", "library", l("漂流物鑑定草稿", "漂流物鑑定の下書き", "Appraisal drafts"), { kind: "draft" }),
  record("tu:appraisal:records", "library", l("漂流物鑑定檔案", "漂流物鑑定記録", "Appraisal records")),

  record("tu:bbs:draft", "campus", l("BBS 發帖草稿", "BBS 投稿下書き", "BBS post draft"), { kind: "draft" }),
  record("tu:bbs:posts", "campus", l("我的 BBS 發帖", "自分の BBS 投稿", "My BBS posts")),
  record("tu:housing:draft", "campus", l("宿舍申請草稿", "学生寮申請の下書き", "Housing draft"), { kind: "draft" }),
  record("tu:housing:applications", "campus", l("宿舍申請", "学生寮申請", "Housing applications")),
  record("tu:housing:assignments", "campus", l("房間與室友分配", "部屋・同室者の割当", "Room and roommate assignments")),
  record("tu:housing:room-changes", "campus", l("換房申請", "転室申請", "Room-change requests")),
  record("tu:clinic:triage-draft", "campus", l("分診草稿", "トリアージ下書き", "Triage draft"), { kind: "draft" }),
  record("tu:clinic:visits", "campus", l("診療紀錄", "診療記録", "Clinic visits")),
  record("tu:clinic:prescriptions", "campus", l("處方與領藥", "処方・調剤", "Prescriptions and dispensing")),
  record("tu:clinic:care-plans", "campus", l("康復療程", "回復療程", "Recovery plans")),
  record("tu:incidents:workbench", "campus", l("事件工作台", "事案ワークベンチ", "Incident workbench"), { kind: "draft" }),
  record("tu:incidents:experiments", "campus", l("研究模擬回條", "研究シミュレーション票", "Research simulation slips")),
  record("tu:incidents:resolutions", "campus", l("事件結案卷", "事案終結記録", "Incident resolutions")),
  record("tu:festival:draft", "campus", l("祭典營運草案", "祭典運営下書き", "Festival operations draft"), { kind: "draft" }),
  record("tu:festival:plans", "campus", l("六桌祭典許可", "六机祭典許可", "Six-desk festival permits")),
  record("tu:festival:operations", "campus", l("值班與結祭卷", "当番・閉祭記録", "Festival duty and closure files")),

  record("tu:spellcards:draft", "research", l("符卡設計草稿", "スペルカード設計下書き", "Spell-card design draft"), { kind: "draft" }),
  record("tu:spellcards:designs", "research", l("封存符卡設計", "封印済みスペルカード設計", "Sealed spell-card designs")),
  record("tu:spellcards:defences", "research", l("符卡公開答辯", "スペルカード公開答弁", "Spell-card public defences")),
  record("tu:ethics:drafts", "research", l("研究倫理送審草稿", "研究倫理申請下書き", "Research ethics drafts"), { kind: "draft" }),
  record("tu:ethics:protocols", "research", l("研究倫理計畫與版本", "研究倫理計画・版", "Research ethics protocols & versions")),
  record("tu:ethics:reviews", "research", l("五席倫理審查意見", "五席倫理審査意見", "Five-seat ethics reviews")),

  record("tu:fieldwork:draft", "fieldwork", l("境內實習派遣草稿", "境内実習派遣下書き", "Fieldwork dispatch draft"), { kind: "draft" }),
  record("tu:fieldwork:placements", "fieldwork", l("派遣、外勤與返校卷", "派遣・現地当番・帰校記録", "Dispatch, field duty & return files")),
  record("tu:fieldwork:passport", "fieldwork", l("田野調查護照與場地印", "フィールド調査旅券・現地印", "Field inquiry passport & station seals")),

  record("tu:property:claims", "commons", l("付喪神物權聽證與裁定", "付喪神物権聴聞・裁定", "Tsukumogami property hearings & rulings")),
  record("tu:post:state", "commons", l("鴉天狗通知已讀、釘選與訂正狀態", "鴉天狗通知の既読・固定・訂正状態", "Tengu-post read, pin & correction state")),
  record("tu:post:dispatches", "commons", l("校園郵便寄件卷", "学内郵便発送記録", "Campus-post dispatch files")),
  record("tu:calendar:bookmarks", "commons", l("學年曆紅書籤", "学年暦の赤い栞", "Academic-calendar red bookmarks")),

  record("tu:graduation:audits", "careers", l("八席卒業判定卷", "八席卒業判定記録", "Eight-desk graduation audits")),
  record("tu:graduation:degrees", "careers", l("開封學位證書", "開封済み学位証書", "Unsealed degree records")),
  record("tu:careers:draft", "careers", l("進路志望草稿", "進路希望下書き", "Career preference draft"), { kind: "draft" }),
  record("tu:careers:plans", "careers", l("進路媒合與推薦卷", "進路照合・推薦記録", "Career matching & referral files")),
  record("tu:employment:draft", "careers", l("幻想鄉怪歷書草稿", "幻想郷怪歴書下書き", "Gensokyo odd-résumé draft"), { kind: "draft" }),
  record("tu:employment:applications", "careers", l("招聘投遞、初審與本人回覆", "求人応募・初審・本人返信", "Recruitment applications, reviews & replies")),
  record("tu:employment:attestations", "careers", l("離校去向本機口供", "離校先の端末内証言", "On-device graduate whereabouts statements")),
  record("tu:alumni:profile", "careers", l("百鬼夜行校友籍", "百鬼夜行校友籍", "Hyakki Yagyo alumni file")),

  record("tu:locale", "preferences", l("網站語言", "サイト言語", "Site language"), { kind: "preference", scope: "interface", encoding: "text" }),
  record("tu:audience", "preferences", l("訪客導覽入口", "訪問者向け案内入口", "Audience path"), { kind: "preference", scope: "interface", encoding: "text" }),
  record("tu:mytu:selected-application", "preferences", l("My TU 最後檢視申請", "My TU 最終表示願書", "Last My TU application"), { kind: "preference", scope: "interface", encoding: "text" }),
  record("tu:academics:selected-assignment", "preferences", l("最後開啟作業", "最後に開いた課題", "Last-opened assignment"), { kind: "preference", scope: "interface", encoding: "text" }),
  record("tu:academics:selected-project", "preferences", l("最後開啟專題", "最後に開いた研究", "Last-opened project"), { kind: "preference", scope: "interface", encoding: "text" }),
  record("tu:governance:selected", "preferences", l("最後開啟議案", "最後に開いた議案", "Last-opened proposal"), { kind: "preference", scope: "interface", encoding: "text" }),
  record("tu:incidents:last-case", "preferences", l("最後開啟事件", "最後に開いた事案", "Last-opened incident"), { kind: "preference", scope: "interface", encoding: "text" }),

  record("tu:campus:ledger", "system", l("校務事件帳本", "学務イベント台帳", "Campus event ledger"), { kind: "ledger" }),

  record("tu:phantasm:state", "dream", l("第九節課程狀態", "第九時限の履修状態", "Ninth-period course state"), { scope: "dream" }),
  record("tu:phantasm:transcripts", "dream", l("反面成績紙", "裏面成績票", "Reverse-side transcripts"), { scope: "dream" }),
  record("tu:phantasm:boundary", "dream", l("邊界探門痕跡", "境界を探った痕跡", "Boundary-door traces"), { scope: "dream" }),
  record(
    "tu:phantasm:pass",
    "dream",
    l("短時紙縫通行條", "短時間の紙の隙間通行票", "Short-lived paper-seam pass"),
    { storage: "session", portable: false, kind: "session", scope: "session" },
  ),
];

export const localRecordKinds = {
  record: l("正式卷宗", "正式ファイル", "Record"),
  draft: l("未完成草稿", "未完了の下書き", "Draft"),
  preference: l("介面書籤", "画面の栞", "Interface bookmark"),
  ledger: l("衍生索引", "派生索引", "Derived index"),
  session: l("本次分頁", "このタブのみ", "This tab only"),
};

export const localRecordScopes = {
  device: l(
    "只對目前瀏覽器設定檔、這個網站來源可見；關閉分頁後仍保留。",
    "現在のブラウザプロファイルとこのサイトのオリジンだけから見え、タブを閉じても残ります。",
    "Visible only to this browser profile and site origin; retained after the tab closes.",
  ),
  interface: l(
    "只保存介面偏好與最後位置，不含主要校務內容。",
    "画面設定と最終位置のみを保存し、主要な学務内容は含みません。",
    "Stores interface preferences and last positions only, not primary campus records.",
  ),
  dream: l(
    "只在目前瀏覽器的反面檔案中可見，不會進入正式學籍或校務事件帳本。",
    "現在のブラウザの裏面ファイルだけから見え、正式な学籍・学務イベント台帳には入りません。",
    "Visible only in this browser's reverse-side files and never enters formal records or the campus ledger.",
  ),
  session: l(
    "只在目前分頁工作階段有效；關閉分頁或明確醒來後失效，也不會匯出。",
    "現在のタブセッションだけで有効。タブを閉じるか明示的に目覚めると失効し、書き出しもされません。",
    "Valid only for this tab session; expires when the tab closes or after waking and is never exported.",
  ),
};
