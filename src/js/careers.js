import { schools } from "../data/schools.js";
import {
  alumniChapter,
  alumniChapters,
  alumniStories,
  careerDomainOptions,
  careerOpening,
  careerOpenings,
  careerScheduleOptions,
  careersLocalized,
  graduationTrack,
  graduationTracks,
} from "../data/careers.js";
import {
  activateAlumniProfile,
  alumniNightSnapshot,
  alumniProfile,
  careerDraft,
  careerMatches,
  careerPlan,
  careerPlans,
  graduationAudit,
  graduationAudits,
  graduationDegree,
  graduationDegrees,
  graduationEvidence,
  graduationSummary,
  issueGraduationDegree,
  offerAlumniMentorship,
  requestGraduationAudit,
  rsvpAlumniReunion,
  saveCareerDraft,
  sendCareerReferral,
  submitCareerPlan,
} from "./careers-model.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { registerDeepLink, navigateToDeepLink } from "./deep-links.js";
import { getLocale } from "./i18n.js";
import { bindImeSafeInput } from "./ime-input.js";
import { printDocument } from "./print-document.js";
import { renderPreservingState } from "./render-state.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

let root = null;
let view = "graduation";
let selectedAuditId = null;
let selectedDegreeId = null;
let selectedOpeningId = null;
let selectedPlanId = null;
let selectedChapterId = null;
let graduationSchoolId = "boundary";

const copy = {
  "zh-Hant": {
    eyebrow: "GRADUATION × CAREERS × HYAKKI YAGYO ALUMNI",
    title: "學位不會替你解決所有問題；它只證明你已學會把問題完整帶走。",
    lead: "八個案頭逐一核對學分、方法、答辯、倫理、田野、館藏、退宿與爭議；進路室不承諾工作正常，校友會則歡迎畢業後仍有問題的人。",
    graduation: "卒業判定",
    careers: "進路室",
    alumni: "百鬼夜行校友會",
    audits: "判定卷",
    degrees: "已開封學位",
    plans: "進路卷",
    referrals: "已寄推薦",
    alumniStatus: "校友籍",
    sealed: "未開封",
    active: "已開封",
    auditTitle: "八席卒業判定會議",
    auditLead: "每席只簽自己看得懂的部分；附帶條件與爭議會原樣印到學位檔案。",
    school: "申請學院",
    track: "時間與壽命學籍",
    enrolmentYear: "入學年份",
    graduationYear: "申請畢業年份",
    priorCredits: "先前學期已登錄學分",
    priorCreditsHelp: "只填這台裝置尚未保存的舊學期學分；須附來源。",
    archiveCores: "舊卷補記的核心課",
    provenance: "舊學分／核心課來源",
    provenancePlaceholder: "例如：稗田館第七櫃、幻想曆 140 春季成績拓印與經手人……",
    attachments: "我同意把未清事項作為附件保留，不把它們寫成已解決。",
    libraryDispute: "館藏拒絕歸還時的異議說明",
    checkout: "宿舍退宿／延後搬離方案",
    dispute: "未結事件、物權與年代爭議附件",
    unresolved: "畢業後仍要繼續追問什麼？",
    submitAudit: "送交八席判定",
    identityNeeded: "先在 My TU 建立本機學籍，畢業判定才知道要把證書寄給哪一版的你。",
    openMyTu: "前往 My TU",
    recentAudits: "我的判定卷",
    noAudits: "尚無判定卷。預審可以失敗；失敗的理由也會保存。",
    statusClear: "已清",
    statusConditional: "附條件",
    statusContested: "有爭議",
    statusMissing: "尚缺",
    outcomeReady: "可以開封學位",
    outcomeConditional: "可以附條件開封",
    outcomeContested: "可以附爭議開封",
    outcomeNotReady: "本輪不能開封",
    requirementCredits: "學分與核心課",
    requirementMethods: "作業與方法考試",
    requirementDefence: "論文／符卡公開答辯",
    requirementEthics: "研究倫理卷宗",
    requirementFieldwork: "境內實習與田野護照",
    requirementLibrary: "圖書館歸還與物件異議",
    requirementHousing: "宿舍退宿與換房案",
    requirementDisputes: "未結事件、物權與年代",
    repair: "前往補件",
    printAudit: "列印判定卷",
    acceptDegree: "我接受所有附帶條件、少數意見與未結附件",
    issueDegree: "開封學位",
    issued: "學位已開封；校友會在你點擊前九分鐘已收到名冊。",
    auditSaved: "判定卷已保存。缺件不會因關掉頁面而消失。",
    errorIdentity: "需要 My TU 本機學籍。",
    errorProvenance: "舊學分或核心課補記需要至少十八字的來源。",
    errorQuestion: "請留下一件至少十二字、畢業後仍值得追問的問題。",
    errorConditions: "請明確接受附帶條件與爭議附件。",
    degreeTitle: "幻想鄉立東方大學學位證書",
    standing: "判定",
    issuedAt: "開封日期",
    degreeNo: "學位編號",
    unresolvedQuestion: "畢業後仍未解決",
    reverseSide: "證書背面",
    reverseTrace: "夢境課程不計入正式學分；紙背仍透出",
    printDegree: "列印學位證書",
    back: "返回",
    careersTitle: "進路室：哪一份麻煩值得帶去上班？",
    careersLead: "十二個去向都有具體工作、報酬、出勤校鐘、摩擦與不能跨過的界線。媒合會解釋理由，不替你假裝一切適合。",
    domains: "想做的事（最多四項）",
    schedule: "能接受的出勤校鐘",
    compensation: "希望主要報酬",
    travel: "熟悉的通勤方式",
    chaos: "現場麻煩承受度",
    refusal: "即使被錄取，也拒絕做什麼？",
    careerQuestion: "面試時你想反問什麼？",
    submitPlan: "生成進路媒合卷",
    browseOpenings: "十二份去向卷",
    recommendation: "強烈相合",
    promising: "值得投遞",
    conversation: "先談清楚",
    incident: "很可能先成為事件",
    friction: "已知摩擦",
    duties: "真正要做的事",
    boundary: "不能跨過的界線",
    interview: "面試追問",
    compensationLabel: "報酬",
    scheduleLabel: "出勤",
    host: "現場主持",
    openFile: "展開去向卷",
    planSaved: "進路媒合卷已保存。",
    planError: "請分別寫下拒絕事項與面試反問，至少各八字。",
    reasons: "相合證據",
    cautions: "先談清楚",
    referralNote: "給現場主持的推薦附言",
    sendReferral: "交給鴉天狗寄發",
    referralSent: "推薦已寄出；收件時間不保證晚於面試。",
    referralError: "推薦附言至少十二字，且同一職缺只寄一次。",
    printPlan: "列印進路卷",
    alumniTitle: "百鬼夜行校友會",
    alumniLead: "校友會不按物種、壽命或死亡狀態分屆；按還願意共同追問的問題分支部。",
    tonight: "今夜提燈路線",
    invitation: "邀請函版次",
    assembly: "集合",
    closing: "最後一站",
    chapters: "八個校友支部",
    stories: "名冊邊角",
    unresolvedMatter: "本支部仍未解決",
    meeting: "聚會校鐘",
    steward: "名冊保管",
    openChapter: "翻開支部卷",
    activateAlumni: "開封我的校友籍",
    noDegree: "公共校友會可以旁聽；個人校友籍需先開封一份正式或附爭議學位。",
    displayName: "提燈名",
    chooseChapter: "主要支部",
    activate: "寫入校友名冊",
    activated: "校友籍已開封；若日期早於畢業，阿求會保留兩個版本。",
    attending: "參加下一次百鬼夜行",
    notAttending: "本輪不參加，但保留名牌",
    reunionNote: "攜帶物／遲到理由",
    saveRsvp: "回覆提燈席",
    rsvpSaved: "百鬼夜行回覆已保存。",
    mentor: "回校實習導師",
    mentorTopics: "願意帶的題目",
    mentorNote: "不替學生做什麼",
    offerMentor: "登記導師資格",
    mentorSaved: "導師資格已登記；學生仍有權選別人。",
    mentorError: "請選至少一項題目，並寫下至少十二字的邊界。",
  },
  ja: {
    eyebrow: "GRADUATION × CAREERS × HYAKKI YAGYO ALUMNI",
    title: "学位は問題を解決しない。問題を完全なまま持ち帰る方法を学んだ証明である。",
    lead: "八席が単位、方法、答弁、倫理、現地、蔵書、退寮、争議を別々に確認。進路室は正常な職場を保証せず、同窓会は卒業後も問いを持つ者を歓迎します。",
    graduation: "卒業判定", careers: "進路室", alumni: "百鬼夜行同窓会",
    audits: "判定記録", degrees: "開封学位", plans: "進路記録", referrals: "発送推薦", alumniStatus: "校友籍", sealed: "未開封", active: "開封済み",
    auditTitle: "八席卒業判定会議", auditLead: "各席は自分の欄だけ署名。条件と争議は学位資料へそのまま印刷。",
    school: "申請学部", track: "時間・寿命学籍", enrolmentYear: "入学年", graduationYear: "卒業申請年",
    priorCredits: "旧学期登録単位", priorCreditsHelp: "この端末にない旧学期分のみ。出典必須。",
    archiveCores: "旧記録から補記する必修", provenance: "旧単位／必修の出典",
    provenancePlaceholder: "例：稗田館第七棚、幻想暦140春の成績拓本と取扱者……",
    attachments: "未清算事項を添付として残し、解決済みに書き換えないことへ同意する。",
    libraryDispute: "蔵書が返却を拒む場合の異議", checkout: "退寮／退去延期計画", dispute: "未結事案・物権・年代争議添付",
    unresolved: "卒業後も何を問い続ける？", submitAudit: "八席へ提出",
    identityNeeded: "まず My TU で端末内学籍を作成。証書をどの版のあなたへ送るか決めます。", openMyTu: "My TU へ",
    recentAudits: "自分の判定記録", noAudits: "判定記録なし。予審は不合格でも、その理由を保存します。",
    statusClear: "清算済み", statusConditional: "条件付", statusContested: "争議付", statusMissing: "不足",
    outcomeReady: "学位開封可", outcomeConditional: "条件付開封可", outcomeContested: "争議付開封可", outcomeNotReady: "今回は開封不可",
    requirementCredits: "単位・必修", requirementMethods: "課題・方法試験", requirementDefence: "論文／スペル公開答弁",
    requirementEthics: "研究倫理記録", requirementFieldwork: "国内実習旅券", requirementLibrary: "図書返却・物の異議",
    requirementHousing: "退寮・転室", requirementDisputes: "未結事案・物権・年代",
    repair: "補記へ", printAudit: "判定記録を印刷", acceptDegree: "全条件・少数意見・未結添付を受諾する", issueDegree: "学位を開封",
    issued: "学位を開封。同窓会は九分前に名簿を受領済み。", auditSaved: "判定記録を保存。不足は閉じても消えません。",
    errorIdentity: "My TU 学籍が必要。", errorProvenance: "旧単位／必修補記は18字以上の出典が必要。",
    errorQuestion: "卒業後も問う12字以上の問いを記入。", errorConditions: "条件・争議添付を明示受諾してください。",
    degreeTitle: "幻想郷立東方大学 学位証書", standing: "判定", issuedAt: "開封日", degreeNo: "学位番号",
    unresolvedQuestion: "卒業後も未解決", reverseSide: "証書裏面", reverseTrace: "夢境科目は正式単位外。紙背に透ける", printDegree: "学位証書を印刷", back: "戻る",
    careersTitle: "進路室：どの面倒を職場へ持っていく？", careersLead: "十二の進路に実務、報酬、勤務鐘、摩擦、越えない境界があります。理由を説明し、適合を装いません。",
    domains: "希望業務（4つまで）", schedule: "対応できる勤務鐘", compensation: "希望する主報酬", travel: "慣れた通勤",
    chaos: "現場混乱許容度", refusal: "採用されても拒むこと", careerQuestion: "面接で聞き返すこと", submitPlan: "進路照合記録を作成",
    browseOpenings: "十二の進路記録", recommendation: "強く一致", promising: "応募価値あり", conversation: "要相談", incident: "先に事件になりそう",
    friction: "既知の摩擦", duties: "実際の業務", boundary: "越えない境界", interview: "面接追問", compensationLabel: "報酬", scheduleLabel: "勤務", host: "現場担当", openFile: "進路記録を開く",
    planSaved: "進路記録を保存。", planError: "拒否事項と面接質問を各8字以上で。", reasons: "一致証拠", cautions: "要相談",
    referralError: "添書は12字以上。同一求人へ一度のみ。", printPlan: "進路記録を印刷",
    alumniTitle: "百鬼夜行同窓会", alumniLead: "種族・寿命・生死で期を分けず、卒業後も共に問う問題で支部を分けます。",
    tonight: "今夜の提灯経路", invitation: "招待状版", assembly: "集合", closing: "終点", chapters: "八支部", stories: "名簿の余白",
    unresolvedMatter: "支部の未解決", meeting: "会合校鐘", steward: "名簿担当", openChapter: "支部記録を開く",
    activateAlumni: "校友籍を開封", noDegree: "公開会は聴講可。個人校友籍は正式または争議付学位が必要。",
    displayName: "提灯名", chooseChapter: "主支部", activate: "同窓名簿へ", activated: "校友籍を開封。日付が卒業前なら二版を保存。",
    attending: "次回百鬼夜行へ参加", notAttending: "不参加、名札は保存", reunionNote: "持参物／遅刻理由", saveRsvp: "提灯席へ返信", rsvpSaved: "返信を保存。",
    mentor: "帰校実習指導", mentorTopics: "指導できる題目", mentorNote: "学生の代わりにしないこと", offerMentor: "指導資格を登録",
    mentorSaved: "指導資格を登録。学生は別の指導者を選べます。", mentorError: "題目を一つ以上選び、12字以上の境界を記入。",
  },
  en: {
    eyebrow: "GRADUATION × CAREERS × HYAKKI YAGYO ALUMNI",
    title: "A degree does not solve every problem. It proves you learned to carry one home intact.",
    lead: "Eight desks separately inspect credits, methods, defence, ethics, fieldwork, books, housing, and disputes. Careers does not promise normal work; Alumni welcomes questions that outlive graduation.",
    graduation: "Graduation audit", careers: "Careers Office", alumni: "Hyakki Yagyo Alumni",
    audits: "Audit files", degrees: "Unsealed degrees", plans: "Career files", referrals: "Referrals sent", alumniStatus: "Alumni file", sealed: "Sealed", active: "Unsealed",
    auditTitle: "Eight-desk Graduation Board", auditLead: "Each desk signs only its own field. Conditions and disputes print unchanged in the degree file.",
    school: "School", track: "Time & lifespan record", enrolmentYear: "Enrolment year", graduationYear: "Proposed graduation year",
    priorCredits: "Earlier registered credits", priorCreditsHelp: "Only earlier terms absent from this device; provenance is required.",
    archiveCores: "Core courses back-entered from old files", provenance: "Source for earlier credits / cores",
    provenancePlaceholder: "Example: Hieda shelf seven, Gensokyo 140 spring transcript rubbing and custodian…",
    attachments: "I accept unresolved matters as attachments and will not rewrite them as resolved.",
    libraryDispute: "Objection when a holding refuses return", checkout: "Residence departure / delayed move plan", dispute: "Open incident, property, and chronology annex",
    unresolved: "What remains worth asking after graduation?", submitAudit: "Submit to all eight desks",
    identityNeeded: "Create an on-device My TU identity so the diploma knows which version of you receives it.", openMyTu: "Open My TU",
    recentAudits: "My audit files", noAudits: "No audit yet. A preliminary audit may fail; its reasons remain.",
    statusClear: "Cleared", statusConditional: "Conditional", statusContested: "Contested", statusMissing: "Missing",
    outcomeReady: "Degree may be unsealed", outcomeConditional: "May unseal with conditions", outcomeContested: "May unseal with disputes", outcomeNotReady: "Cannot unseal this round",
    requirementCredits: "Credits & core courses", requirementMethods: "Coursework & methods exam", requirementDefence: "Thesis / spell-card public defence",
    requirementEthics: "Research ethics file", requirementFieldwork: "Domestic fieldwork passport", requirementLibrary: "Library return & object objection",
    requirementHousing: "Residence departure & transfer", requirementDisputes: "Open incidents, property & chronology",
    repair: "Complete evidence", printAudit: "Print audit file", acceptDegree: "I accept all conditions, minority opinions, and unresolved annexes", issueDegree: "Unseal degree",
    issued: "Degree unsealed; Alumni received the roll nine minutes ago.", auditSaved: "Audit saved. Closing the page does not erase missing evidence.",
    errorIdentity: "An on-device My TU identity is required.", errorProvenance: "Earlier credits or cores need at least 18 characters of provenance.",
    errorQuestion: "Leave a question of at least 12 characters worth pursuing after graduation.", errorConditions: "Explicitly accept the conditions and disputed annexes.",
    degreeTitle: "Touhou University of Gensokyo Degree", standing: "Standing", issuedAt: "Unsealed", degreeNo: "Degree number",
    unresolvedQuestion: "Still unresolved after graduation", reverseSide: "Reverse side", reverseTrace: "Dream courses do not count officially; the paper still shows", printDegree: "Print degree", back: "Back",
    careersTitle: "Careers Office: which trouble is worth taking to work?", careersLead: "Twelve destinations state real work, compensation, duty bell, friction, and boundaries. Matching explains rather than pretending everything fits.",
    domains: "Desired work (up to four)", schedule: "Acceptable duty bell", compensation: "Preferred main compensation", travel: "Familiar commute",
    chaos: "Trouble tolerance", refusal: "What will you refuse even if hired?", careerQuestion: "What will you ask the interviewer?", submitPlan: "Create career matching file",
    browseOpenings: "Twelve destination files", recommendation: "Strong match", promising: "Worth applying", conversation: "Discuss first", incident: "Likely an incident first",
    friction: "Known friction", duties: "Actual work", boundary: "Boundary not to cross", interview: "Interview question", compensationLabel: "Compensation", scheduleLabel: "Duty", host: "Host", openFile: "Open destination",
    planSaved: "Career matching file saved.", planError: "Write at least eight characters for both refusal and interview question.", reasons: "Evidence of fit", cautions: "Discuss first",
    referralNote: "Referral note to the host", sendReferral: "Send by crow-tengu post", referralSent: "Referral sent; receipt may precede the interview.",
    referralError: "Referral note needs 12 characters and each opening accepts one dispatch.", printPlan: "Print career file",
    alumniTitle: "Hyakki Yagyo Alumni Association", alumniLead: "Cohorts are not divided by species, lifespan, or death. Chapters follow questions members still ask.",
    tonight: "Tonight's lantern route", invitation: "Invitation version", assembly: "Assembly", closing: "Final stop", chapters: "Eight alumni chapters", stories: "Roll margins",
    unresolvedMatter: "Still unresolved here", meeting: "Meeting bell", steward: "Roll keeper", openChapter: "Open chapter file",
    activateAlumni: "Unseal my alumni file", noDegree: "The public association is open to auditors; a personal file requires a formal or contested degree.",
    displayName: "Lantern name", chooseChapter: "Primary chapter", activate: "Enter alumni roll", activated: "Alumni file unsealed; if it predates graduation, Akyuu keeps both versions.",
    attending: "Attend the next Hyakki Yagyo", notAttending: "Not this round; retain my badge", reunionNote: "What I bring / why I am late", saveRsvp: "Reply to lantern desk", rsvpSaved: "Hyakki Yagyo reply saved.",
    mentor: "Returning fieldwork mentor", mentorTopics: "Topics I can guide", mentorNote: "What I will not do for a student", offerMentor: "Register mentorship",
    mentorSaved: "Mentorship registered; students may still choose someone else.", mentorError: "Select a topic and state a boundary of at least 12 characters.",
  },
};

const compensationLabels = {
  yen: ["日圓", "円", "Yen"],
  offerings: ["賽錢／實物", "賽銭／現物", "Offerings / in kind"],
  tea: ["茶點與館內食宿", "茶菓・館内滞在", "Tea & lodging"],
  cucumber: ["日圓＋黃瓜折算", "円＋胡瓜換算", "Yen + cucumber equivalent"],
  rice: ["米糧與日圓", "米穀・円", "Rice & yen"],
  faith: ["日圓＋神德（分欄）", "円＋神徳（別欄）", "Yen + merit (separate)"],
  coal: ["日圓＋地熱配額", "円＋地熱枠", "Yen + geothermal quota"],
  barter: ["以物易物", "物々交換", "Barter"],
};

const travelLabels = {
  foot: ["步行／提燈", "徒歩／提灯", "Foot / lantern"],
  broom: ["掃帚", "箒", "Broom"],
  tengu: ["天狗風路", "天狗風路", "Tengu wind route"],
  shuttle: ["月兔接駁", "月兎便", "Moon-rabbit shuttle"],
  ferry: ["三途／幽靈渡船", "三途／幽霊渡し", "Sanzu / phantom ferry"],
};

const requirementLinks = {
  credits: "mytu.html#course-registration",
  methods: "mytu.html#academic-work",
  defence: "mytu.html#academic-defense",
  ethics: "ethics.html#ethics-board",
  fieldwork: "fieldwork.html#fieldwork-dispatch",
  library: "library.html#library-account",
  housing: "housing.html#housing-account",
  disputes: "incidents.html#incident-records",
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;",
  })[character]);
}

const t = (value, locale) => careersLocalized(value, locale);
const localeIndex = (locale) => locale === "ja" ? 1 : locale === "en" ? 2 : 0;
const formatDate = (value, locale) => new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(value));

function statusLabel(status, c) {
  return {
    clear: c.statusClear,
    conditional: c.statusConditional,
    contested: c.statusContested,
    missing: c.statusMissing,
  }[status];
}

function outcomeLabel(outcome, c) {
  return {
    ready: c.outcomeReady,
    conditional: c.outcomeConditional,
    contested: c.outcomeContested,
    "not-ready": c.outcomeNotReady,
  }[outcome];
}

function requirementTitle(id, c) {
  return c[`requirement${id[0].toUpperCase()}${id.slice(1)}`];
}

function requirementDetail(item, locale) {
  if (item.id === "credits") {
    return locale === "ja"
      ? `${item.current}/${item.target} 単位 · 必修 ${item.recognizedCoreCodes.length}/${item.requiredCoreCodes.length}`
      : locale === "en"
        ? `${item.current}/${item.target} credits · cores ${item.recognizedCoreCodes.length}/${item.requiredCoreCodes.length}`
        : `${item.current}/${item.target} 學分 · 核心課 ${item.recognizedCoreCodes.length}/${item.requiredCoreCodes.length}`;
  }
  if (item.id === "methods") return locale === "ja" ? `課題 ${item.assignments} · 試験 ${item.exams}` : locale === "en" ? `${item.assignments} assignments · ${item.exams} exams` : `作業 ${item.assignments} · 方法考 ${item.exams}`;
  if (item.id === "defence") return `${String(item.outcome).toUpperCase()}${item.percent === null ? "" : ` · ${item.percent}%`}`;
  if (item.id === "ethics") return `${String(item.outcome).toUpperCase()} · ${item.activeProtocols}`;
  if (item.id === "fieldwork") return locale === "ja" ? `${item.distinctStations} 現地 · ${item.visits} 回` : locale === "en" ? `${item.distinctStations} sites · ${item.visits} visits` : `${item.distinctStations} 場地 · ${item.visits} 次返校`;
  if (item.id === "library") return locale === "ja" ? `貸出中 ${item.activeLoans}` : locale === "en" ? `${item.activeLoans} active loans` : `未還館藏 ${item.activeLoans}`;
  if (item.id === "housing") return locale === "ja" ? `在寮 ${item.assignmentId ? 1 : 0} · 転室 ${item.roomChanges}` : locale === "en" ? `${item.assignmentId ? 1 : 0} active room · ${item.roomChanges} transfers` : `在住宿舍 ${item.assignmentId ? 1 : 0} · 換房案 ${item.roomChanges}`;
  return locale === "ja"
    ? `物権 ${item.openClaims} · 争議結案 ${item.contestedIncidents} · 年代逆転 ${item.chronologyReversed ? "あり" : "なし"}`
    : locale === "en"
      ? `${item.openClaims} property · ${item.contestedIncidents} contested closures · chronology ${item.chronologyReversed ? "reversed" : "ordinary"}`
      : `物權 ${item.openClaims} · 爭議結案 ${item.contestedIncidents} · 年代${item.chronologyReversed ? "倒置" : "順行"}`;
}

function hero(locale, c) {
  const summary = graduationSummary();
  return `
    <header class="careers-hero" id="graduation-careers-top">
      <div>
        <p>${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
      </div>
      <dl>
        <div><dt>${c.audits}</dt><dd>${summary.audits}</dd></div>
        <div><dt>${c.degrees}</dt><dd>${summary.degrees}</dd></div>
        <div><dt>${c.referrals}</dt><dd>${summary.referrals}</dd></div>
        <div><dt>${c.alumniStatus}</dt><dd>${summary.alumni ? c.active : c.sealed}</dd></div>
      </dl>
    </header>
    <nav class="careers-tabs" aria-label="${escapeHtml(c.title)}">
      <button type="button" class="${["graduation", "audit", "degree"].includes(view) ? "active" : ""}" data-careers-view="graduation"><span>卒</span>${c.graduation}</button>
      <button type="button" class="${["career", "opening", "plan"].includes(view) ? "active" : ""}" data-careers-view="career"><span>路</span>${c.careers}</button>
      <button type="button" class="${["alumni", "chapter"].includes(view) ? "active" : ""}" data-careers-view="alumni"><span>夜</span>${c.alumni}</button>
    </nav>`;
}

function schoolOptions(locale, selected) {
  return Object.entries(schools).map(([id, school]) =>
    `<option value="${id}" ${selected === id ? "selected" : ""}>${school.code} · ${escapeHtml(school.name[locale])}</option>`).join("");
}

function coreCheckboxes(locale, schoolId) {
  return schools[schoolId].courses.map(([code, title]) => `
    <label><input type="checkbox" name="archivedCoreCodes" value="${code}"><span><b>${code}</b>${escapeHtml(title[locale])}</span></label>`).join("");
}

function graduationForm(locale, c) {
  const evidence = graduationEvidence({ schoolId: graduationSchoolId });
  const identity = (() => {
    try { return JSON.parse(localStorage.getItem("tu:identity") || "null"); } catch { return null; }
  })();
  if (!identity?.id) {
    return `<aside class="careers-identity"><p>${c.identityNeeded}</p><a href="mytu.html#my-tu">${c.openMyTu}<b>→</b></a></aside>`;
  }
  return `
    <form class="graduation-form" data-graduation-form>
      <div class="graduation-form-grid">
        <label><span>${c.school}</span><select name="schoolId" data-graduation-school>${schoolOptions(locale, graduationSchoolId)}</select></label>
        <label><span>${c.track}</span><select name="trackId">${graduationTracks.map((entry) => `<option value="${entry.id}">${entry.glyph} · ${escapeHtml(t(entry.title, locale))}</option>`).join("")}</select></label>
        <label><span>${c.enrolmentYear}</span><input type="number" name="enrolmentYear" value="142" min="1" max="9999"></label>
        <label><span>${c.graduationYear}</span><input type="number" name="graduationYear" value="146" min="1" max="9999"></label>
        <label><span>${c.priorCredits}</span><input type="number" name="priorCredits" value="0" min="0" max="${evidence.requiredCredits}"><small>${c.priorCreditsHelp}</small></label>
      </div>
      <fieldset class="graduation-cores"><legend>${c.archiveCores}</legend>${coreCheckboxes(locale, graduationSchoolId)}</fieldset>
      <label class="full"><span>${c.provenance}</span><textarea name="provenance" rows="3" placeholder="${escapeHtml(c.provenancePlaceholder)}"></textarea></label>
      <div class="graduation-annexes">
        <label><span>${c.libraryDispute}</span><textarea name="libraryDisputeNote" rows="3"></textarea></label>
        <label><span>${c.checkout}</span><textarea name="checkoutPlan" rows="3"></textarea></label>
        <label><span>${c.dispute}</span><textarea name="unresolvedNote" rows="3"></textarea></label>
        <label><span>${c.unresolved}</span><textarea name="unresolvedQuestion" rows="3" required></textarea></label>
      </div>
      <label class="graduation-accept"><input type="checkbox" name="acceptsAttachments"><span>${c.attachments}</span></label>
      <button class="careers-primary" type="submit">${c.submitAudit}<b>→</b></button>
    </form>`;
}

function auditCards(locale, c) {
  const audits = graduationAudits().slice().reverse();
  return `
    <section class="careers-records" id="graduation-records">
      <header><p>LOCAL GRADUATION FILES</p><h3>${c.recentAudits}</h3></header>
      ${audits.length ? audits.map((audit) => `
        <button type="button" data-graduation-audit="${audit.id}">
          <span>${schools[audit.schoolId].glyph}</span>
          <div><p>${formatDate(audit.requestedAt, locale)} · ${graduationTrack(audit.input.trackId).glyph}</p><h4>${escapeHtml(schools[audit.schoolId].degree[locale])}</h4><small>${outcomeLabel(audit.outcome, c)} · ${audit.earnedCredits}/${audit.requiredCredits}</small></div>
          <b>↗</b>
        </button>`).join("") : `<p class="careers-empty">${c.noAudits}</p>`}
    </section>`;
}

function graduationView(locale, c) {
  return `
    <section class="careers-heading" id="graduation-audit">
      <div><p>EIGHT DESKS / NO PROXY SIGNATURES</p><h3>${c.auditTitle}</h3><span>${c.auditLead}</span></div>
      <div class="graduation-stamp">卒<small>${graduationEvidence({ schoolId: graduationSchoolId }).requiredCredits}</small></div>
    </section>
    ${graduationForm(locale, c)}
    ${auditCards(locale, c)}`;
}

function requirementRows(audit, locale, c) {
  return audit.requirements.map((item, index) => `
    <article class="graduation-requirement status-${item.status}">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div><p>${statusLabel(item.status, c)}</p><h4>${requirementTitle(item.id, c)}</h4><small>${escapeHtml(requirementDetail(item, locale))}</small></div>
      <a href="${requirementLinks[item.id]}">${c.repair} ↗</a>
    </article>`).join("");
}

function auditView(locale, c) {
  const audit = graduationAudit(selectedAuditId);
  if (!audit) return graduationView(locale, c);
  const canIssue = audit.canIssue && !audit.degreeId;
  return `
    <button type="button" class="careers-back" data-careers-view="graduation">← ${c.back}</button>
    <article class="graduation-document" id="graduation-audit-${audit.id}">
      <header>
        <span>${schools[audit.schoolId].glyph}</span>
        <div><p>${audit.id} · ${formatDate(audit.requestedAt, locale)}</p><h3>${escapeHtml(schools[audit.schoolId].degree[locale])}</h3><small>${escapeHtml(t(graduationTrack(audit.input.trackId).title, locale))}</small></div>
        <b class="outcome-${audit.outcome}">${outcomeLabel(audit.outcome, c)}</b>
      </header>
      <div class="graduation-requirements">${requirementRows(audit, locale, c)}</div>
      <blockquote><small>${c.unresolvedQuestion}</small>${escapeHtml(audit.input.unresolvedQuestion)}</blockquote>
      ${audit.dream.count ? `<aside><b>${c.reverseSide}</b><span>${c.reverseTrace} ${audit.dream.reverseCredits > 0 ? "+" : ""}${audit.dream.reverseCredits}</span></aside>` : ""}
      <footer data-print-exclude>
        <button type="button" data-print-audit>${c.printAudit}</button>
        ${audit.degreeId ? `<button type="button" data-graduation-degree="${audit.degreeId}">${c.printDegree} ↗</button>` : ""}
      </footer>
    </article>
    ${canIssue ? `
      <form class="degree-issue" data-degree-issue="${audit.id}">
        <label><input type="checkbox" name="acceptsConditions"><span>${c.acceptDegree}</span></label>
        <button class="careers-primary" type="submit">${c.issueDegree}<b>印</b></button>
      </form>` : ""}`;
}

function degreeView(locale, c) {
  const degree = graduationDegree(selectedDegreeId);
  if (!degree) return graduationView(locale, c);
  return `
    <button type="button" class="careers-back" data-careers-view="graduation">← ${c.back}</button>
    <article class="degree-document" id="graduation-degree-${degree.id}">
      <div class="degree-seal"><span>${schools[degree.schoolId].glyph}</span><small>TOUHOU UNIVERSITY</small></div>
      <p>${c.degreeNo} · ${escapeHtml(degree.degreeNumber)}</p>
      <h3>${c.degreeTitle}</h3>
      <strong>${escapeHtml(degree.studentName || degree.studentId)}</strong>
      <span>${escapeHtml(schools[degree.schoolId].degree[locale])}</span>
      <dl>
        <div><dt>${c.standing}</dt><dd>${statusLabel(degree.standing === "clear" ? "clear" : degree.standing, c)}</dd></div>
        <div><dt>${c.issuedAt}</dt><dd>${formatDate(degree.issuedAt, locale)}</dd></div>
      </dl>
      <blockquote><small>${c.unresolvedQuestion}</small>${escapeHtml(degree.unresolvedQuestion)}</blockquote>
      ${degree.dream.count ? `<aside><b>${c.reverseSide}</b><span>${c.reverseTrace} ${degree.dream.reverseCredits > 0 ? "+" : ""}${degree.dream.reverseCredits}</span></aside>` : ""}
      <footer data-print-exclude><button type="button" data-print-degree>${c.printDegree}</button><button type="button" data-careers-view="alumni">${c.activateAlumni} →</button></footer>
    </article>`;
}

function openingCard(opening, locale, c, match = null) {
  const band = match?.band || "conversation";
  return `
    <article class="career-opening-card" id="career-opening-${opening.id}">
      <header><span>${opening.glyph}</span><div><p>${opening.code} · ${escapeHtml(t(opening.region, locale))}</p><h4>${escapeHtml(t(opening.title, locale))}</h4></div>${match ? `<b class="match-${band}">${{ recommended: c.recommendation, promising: c.promising, conversation: c.conversation, incident: c.incident }[band]}</b>` : ""}</header>
      <p>${escapeHtml(t(opening.premise, locale))}</p>
      <dl><div><dt>${c.host}</dt><dd>${escapeHtml(t(opening.host, locale))}</dd></div><div><dt>${c.compensationLabel}</dt><dd>${compensationLabels[opening.compensation][localeIndex(locale)]}</dd></div></dl>
      <button type="button" data-career-opening="${opening.id}">${c.openFile}<b>↗</b></button>
    </article>`;
}

function careerForm(locale, c) {
  const draft = careerDraft();
  return `
    <form class="career-form" data-career-form>
      <label><span>${c.school}</span><select name="schoolId">${schoolOptions(locale, draft.schoolId)}</select></label>
      <fieldset><legend>${c.domains}</legend>${careerDomainOptions.map(([id, title]) => `<label><input type="checkbox" name="domainIds" value="${id}" ${draft.domainIds.includes(id) ? "checked" : ""}><span>${escapeHtml(t(title, locale))}</span></label>`).join("")}</fieldset>
      <div class="career-form-grid">
        <label><span>${c.schedule}</span><select name="scheduleId">${careerScheduleOptions.map(([id, title]) => `<option value="${id}" ${draft.scheduleId === id ? "selected" : ""}>${escapeHtml(t(title, locale))}</option>`).join("")}</select></label>
        <label><span>${c.compensation}</span><select name="compensationId">${Object.entries(compensationLabels).map(([id, labels]) => `<option value="${id}" ${draft.compensationId === id ? "selected" : ""}>${labels[localeIndex(locale)]}</option>`).join("")}</select></label>
        <label><span>${c.travel}</span><select name="travelId">${Object.entries(travelLabels).map(([id, labels]) => `<option value="${id}" ${draft.travelId === id ? "selected" : ""}>${labels[localeIndex(locale)]}</option>`).join("")}</select></label>
        <label><span>${c.chaos}</span><input type="range" name="chaosTolerance" min="1" max="4" value="${draft.chaosTolerance}"><output>${draft.chaosTolerance}/4</output></label>
      </div>
      <label class="full"><span>${c.refusal}</span><textarea name="refusal" rows="3" data-preserve-focus="career-refusal">${escapeHtml(draft.refusal)}</textarea></label>
      <label class="full"><span>${c.careerQuestion}</span><textarea name="question" rows="3" data-preserve-focus="career-question">${escapeHtml(draft.question)}</textarea></label>
      <button class="careers-primary" type="submit">${c.submitPlan}<b>→</b></button>
    </form>`;
}

function careersView(locale, c) {
  const matches = careerMatches(careerDraft(), locale);
  return `
    <section class="careers-heading career-heading" id="career-office">
      <div><p>CAREERS OFFICE / EXPLAINED FRICTION</p><h3>${c.careersTitle}</h3><span>${c.careersLead}</span></div>
      <div class="graduation-stamp">路<small>12</small></div>
    </section>
    ${careerForm(locale, c)}
    <section class="career-openings">
      <header><p>TWELVE DESTINATIONS</p><h3>${c.browseOpenings}</h3></header>
      <div>${careerOpenings.map((opening) => openingCard(opening, locale, c, matches.find(({ openingId }) => openingId === opening.id))).join("")}</div>
    </section>`;
}

function openingView(locale, c) {
  const opening = careerOpening(selectedOpeningId);
  if (!opening) return careersView(locale, c);
  return `
    <button type="button" class="careers-back" data-careers-view="career">← ${c.back}</button>
    <article class="career-opening-file" id="career-opening-${opening.id}">
      <header><span>${opening.glyph}</span><div><p>${opening.code} · ${escapeHtml(t(opening.institution, locale))}</p><h3>${escapeHtml(t(opening.title, locale))}</h3><small>${c.host} · ${escapeHtml(t(opening.host, locale))}</small></div></header>
      <blockquote>${escapeHtml(t(opening.premise, locale))}</blockquote>
      <dl><div><dt>${c.scheduleLabel}</dt><dd>${escapeHtml(t(careerScheduleOptions.find(([id]) => id === opening.schedule)[1], locale))}</dd></div><div><dt>${c.compensationLabel}</dt><dd>${compensationLabels[opening.compensation][localeIndex(locale)]}</dd></div><div><dt>${c.travel}</dt><dd>${travelLabels[opening.travel][localeIndex(locale)]}</dd></div></dl>
      <section><p>${c.duties}</p><ol>${opening.duties.map((entry) => `<li>${escapeHtml(t(entry, locale))}</li>`).join("")}</ol></section>
      <section class="career-friction"><p>${c.friction}</p><strong>${escapeHtml(t(opening.friction, locale))}</strong></section>
      <section><p>${c.boundary}</p><blockquote>${escapeHtml(t(opening.boundary, locale))}</blockquote></section>
      <section><p>${c.interview}</p><strong>${escapeHtml(t(opening.interview, locale))}</strong></section>
      <footer><button type="button" data-careers-view="career">${c.back}</button></footer>
    </article>`;
}

function planView(locale, c) {
  const plan = careerPlan(selectedPlanId);
  if (!plan) return careersView(locale, c);
  const localizedMatches = new Map(
    careerMatches(plan.profile, locale).map((match) => [match.openingId, match]),
  );
  return `
    <button type="button" class="careers-back" data-careers-view="career">← ${c.back}</button>
    <article class="career-plan-document" id="career-plan-${plan.id}">
      <header><p>${plan.id} · ${formatDate(plan.createdAt, locale)}</p><h3>${c.submitPlan}</h3><span>${schools[plan.profile.schoolId].name[locale]}</span></header>
      <div>${plan.matches.map((match, index) => {
        const opening = careerOpening(match.openingId);
        const localizedMatch = localizedMatches.get(match.openingId) || match;
        const referral = plan.referrals.find((entry) => entry.openingId === opening.id);
        return `<section class="career-match">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div><p>${{ recommended: c.recommendation, promising: c.promising, conversation: c.conversation, incident: c.incident }[match.band]}</p><h4>${escapeHtml(t(opening.title, locale))}</h4>
            <dl><div><dt>${c.reasons}</dt><dd>${localizedMatch.reasons.map(escapeHtml).join(" · ") || "—"}</dd></div><div><dt>${c.cautions}</dt><dd>${localizedMatch.cautions.map(escapeHtml).join(" · ") || "—"}</dd></div></dl>
            ${referral ? `<strong class="referral-sent">${c.referralSent} · ${formatDate(referral.sentAt, locale)}</strong>` : `<form data-career-referral="${opening.id}"><textarea name="note" rows="2" placeholder="${escapeHtml(c.referralNote)}"></textarea><button type="submit">${c.sendReferral}</button></form>`}
          </div>
          <button type="button" data-career-opening="${opening.id}">↗</button>
        </section>`;
      }).join("")}</div>
      <footer data-print-exclude><button type="button" data-print-plan>${c.printPlan}</button></footer>
    </article>`;
}

function chapterCard(chapter, locale, c) {
  return `
    <article class="alumni-chapter-card" id="alumni-chapter-${chapter.id}">
      <span>${chapter.glyph}</span><div><p>${escapeHtml(t(chapter.meeting, locale))}</p><h4>${escapeHtml(t(chapter.title, locale))}</h4><small>${escapeHtml(t(chapter.unresolved, locale))}</small></div>
      <button type="button" data-alumni-chapter="${chapter.id}">${c.openChapter} ↗</button>
    </article>`;
}

function alumniProfilePanel(locale, c) {
  const profile = alumniProfile();
  const degrees = graduationDegrees();
  if (!profile && !degrees.length) return `<aside class="alumni-locked"><span>封</span><p>${c.noDegree}</p><button type="button" data-careers-view="graduation">${c.graduation} →</button></aside>`;
  if (!profile) {
    const degree = degrees.at(-1);
    return `
      <form class="alumni-activate" data-alumni-activate>
        <p>ALUMNI FILE / ${degree.degreeNumber}</p><h3>${c.activateAlumni}</h3>
        <input type="hidden" name="degreeId" value="${degree.id}">
        <label><span>${c.displayName}</span><input name="displayName" value="${escapeHtml(degree.studentName)}" required></label>
        <label><span>${c.chooseChapter}</span><select name="chapterId">${alumniChapters.map((entry) => `<option value="${entry.id}">${entry.glyph} · ${escapeHtml(t(entry.title, locale))}</option>`).join("")}</select></label>
        <label><span>${c.unresolved}</span><textarea name="unresolvedQuestion" rows="3">${escapeHtml(degree.unresolvedQuestion)}</textarea></label>
        <button class="careers-primary" type="submit">${c.activate}<b>夜</b></button>
      </form>`;
  }
  const chapter = alumniChapter(profile.chapterId);
  return `
    <section class="alumni-profile" id="alumni-profile">
      <header><span>${chapter.glyph}</span><div><p>${profile.id}</p><h3>${escapeHtml(profile.displayName)}</h3><small>${escapeHtml(t(chapter.title, locale))}</small></div></header>
      <blockquote>${escapeHtml(profile.unresolvedQuestion)}</blockquote>
      <div class="alumni-actions">
        <form data-alumni-rsvp>
          <h4>${c.tonight}</h4>
          <label><input type="radio" name="attending" value="yes" ${profile.reunion?.attending ? "checked" : ""}>${c.attending}</label>
          <label><input type="radio" name="attending" value="no" ${profile.reunion && !profile.reunion.attending ? "checked" : ""}>${c.notAttending}</label>
          <textarea name="note" rows="2" placeholder="${escapeHtml(c.reunionNote)}">${escapeHtml(profile.reunion?.note || "")}</textarea>
          <button type="submit">${c.saveRsvp}</button>
        </form>
        <form data-alumni-mentor>
          <h4>${c.mentor}</h4>
          <fieldset><legend>${c.mentorTopics}</legend>${careerDomainOptions.map(([id, title]) => `<label><input type="checkbox" name="topicIds" value="${id}" ${profile.mentorship?.topicIds.includes(id) ? "checked" : ""}>${escapeHtml(t(title, locale))}</label>`).join("")}</fieldset>
          <textarea name="note" rows="2" placeholder="${escapeHtml(c.mentorNote)}">${escapeHtml(profile.mentorship?.note || "")}</textarea>
          <button type="submit">${c.offerMentor}</button>
        </form>
      </div>
    </section>`;
}

function alumniView(locale, c) {
  const night = alumniNightSnapshot();
  return `
    <section class="careers-heading alumni-heading" id="alumni-association">
      <div><p>HYAKKI YAGYO ALUMNI / QUESTIONS OUTLIVE DEGREES</p><h3>${c.alumniTitle}</h3><span>${c.alumniLead}</span></div>
      <div class="graduation-stamp">夜<small>v${night.invitationVersion}</small></div>
    </section>
    <section class="alumni-night">
      <header><p>${c.tonight} · ${night.dayKey}</p><h3>${escapeHtml(t(night.assembly.title, locale))} → ${escapeHtml(t(night.closing.title, locale))}</h3><span>${c.invitation} ${night.invitationVersion}</span></header>
      <ol>${night.route.map((chapter, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><b>${chapter.glyph}</b><strong>${escapeHtml(t(chapter.title, locale))}</strong></li>`).join("")}</ol>
    </section>
    ${alumniProfilePanel(locale, c)}
    <section class="alumni-chapters"><header><p>CHAPTER ROLLS</p><h3>${c.chapters}</h3></header><div>${alumniChapters.map((chapter) => chapterCard(chapter, locale, c)).join("")}</div></section>
    <section class="alumni-stories"><header><p>ROLL MARGINS</p><h3>${c.stories}</h3></header><div>${alumniStories.map((story) => `<article><span>${story.glyph}</span><h4>${escapeHtml(t(story.name, locale))}</h4><p>${escapeHtml(t(story.line, locale))}</p></article>`).join("")}</div></section>`;
}

function chapterView(locale, c) {
  const chapter = alumniChapter(selectedChapterId);
  if (!chapter) return alumniView(locale, c);
  return `
    <button type="button" class="careers-back" data-careers-view="alumni">← ${c.back}</button>
    <article class="alumni-chapter-file" id="alumni-chapter-${chapter.id}">
      <header><span>${chapter.glyph}</span><div><p>HYAKKI YAGYO CHAPTER</p><h3>${escapeHtml(t(chapter.title, locale))}</h3></div></header>
      <dl><div><dt>${c.meeting}</dt><dd>${escapeHtml(t(chapter.meeting, locale))}</dd></div><div><dt>${c.steward}</dt><dd>${escapeHtml(t(chapter.steward, locale))}</dd></div></dl>
      <section><p>${c.unresolvedMatter}</p><blockquote>${escapeHtml(t(chapter.unresolved, locale))}</blockquote></section>
      <footer><button type="button" data-careers-view="alumni">${c.back}</button></footer>
    </article>`;
}

function content(locale, c) {
  if (view === "audit") return auditView(locale, c);
  if (view === "degree") return degreeView(locale, c);
  if (view === "career") return careersView(locale, c);
  if (view === "opening") return openingView(locale, c);
  if (view === "plan") return planView(locale, c);
  if (view === "alumni") return alumniView(locale, c);
  if (view === "chapter") return chapterView(locale, c);
  return graduationView(locale, c);
}

function render({ preserveWindow = true } = {}) {
  if (!root) return;
  const locale = getLocale();
  const c = copy[locale];
  renderPreservingState(root, () => {
    root.innerHTML = `${hero(locale, c)}<div class="careers-workspace">${content(locale, c)}</div>`;
  }, { preserveWindow });
}

function formValues(form) {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

function graduationInput(form) {
  const data = new FormData(form);
  return {
    schoolId: data.get("schoolId"),
    trackId: data.get("trackId"),
    enrolmentYear: data.get("enrolmentYear"),
    graduationYear: data.get("graduationYear"),
    priorCredits: data.get("priorCredits"),
    archivedCoreCodes: data.getAll("archivedCoreCodes"),
    provenance: data.get("provenance"),
    libraryDisputeNote: data.get("libraryDisputeNote"),
    checkoutPlan: data.get("checkoutPlan"),
    unresolvedNote: data.get("unresolvedNote"),
    unresolvedQuestion: data.get("unresolvedQuestion"),
    acceptsAttachments: data.has("acceptsAttachments"),
  };
}

function careerInput(form) {
  const data = new FormData(form);
  return {
    schoolId: data.get("schoolId"),
    domainIds: data.getAll("domainIds"),
    scheduleId: data.get("scheduleId"),
    compensationId: data.get("compensationId"),
    travelId: data.get("travelId"),
    chaosTolerance: data.get("chaosTolerance"),
    refusal: data.get("refusal"),
    question: data.get("question"),
  };
}

function showView(next, route = next) {
  view = next;
  render({ preserveWindow: false });
  navigateToDeepLink(route);
}

function bind() {
  root.addEventListener("click", (event) => {
    const viewButton = event.target.closest("[data-careers-view]");
    if (viewButton) {
      const next = viewButton.dataset.careersView;
      showView(next, next === "career" ? "career-office" : next === "alumni" ? "alumni-association" : "graduation-audit");
      return;
    }
    const audit = event.target.closest("[data-graduation-audit]");
    if (audit) {
      selectedAuditId = audit.dataset.graduationAudit;
      view = "audit";
      render({ preserveWindow: false });
      navigateToDeepLink(`graduation-audit-${selectedAuditId}`);
      return;
    }
    const degree = event.target.closest("[data-graduation-degree]");
    if (degree) {
      selectedDegreeId = degree.dataset.graduationDegree;
      view = "degree";
      render({ preserveWindow: false });
      navigateToDeepLink(`graduation-degree-${selectedDegreeId}`);
      return;
    }
    const opening = event.target.closest("[data-career-opening]");
    if (opening) {
      selectedOpeningId = opening.dataset.careerOpening;
      view = "opening";
      render({ preserveWindow: false });
      navigateToDeepLink(`career-opening-${selectedOpeningId}`);
      return;
    }
    const chapter = event.target.closest("[data-alumni-chapter]");
    if (chapter) {
      selectedChapterId = chapter.dataset.alumniChapter;
      view = "chapter";
      render({ preserveWindow: false });
      navigateToDeepLink(`alumni-chapter-${selectedChapterId}`);
      return;
    }
    if (event.target.closest("[data-print-audit]")) printDocument(".graduation-document", { title: `${copy[getLocale()].auditTitle} · Touhou University` });
    if (event.target.closest("[data-print-degree]")) printDocument(".degree-document", { title: `${copy[getLocale()].degreeTitle} · Touhou University` });
    if (event.target.closest("[data-print-plan]")) printDocument(".career-plan-document", { title: `${copy[getLocale()].careersTitle} · Touhou University` });
  });

  root.addEventListener("change", (event) => {
    if (event.target.matches("[data-graduation-school]")) {
      graduationSchoolId = event.target.value;
      const form = event.target.closest("[data-graduation-form]");
      const cores = form?.querySelector(".graduation-cores");
      if (cores) cores.innerHTML = `<legend>${copy[getLocale()].archiveCores}</legend>${coreCheckboxes(getLocale(), graduationSchoolId)}`;
      const priorCredits = form?.elements.namedItem("priorCredits");
      if (priorCredits) priorCredits.max = graduationEvidence({ schoolId: graduationSchoolId }).requiredCredits;
      return;
    }
    const form = event.target.closest("[data-career-form]");
    if (form) {
      saveCareerDraft(careerInput(form));
      if (event.target.type === "range") {
        event.target.nextElementSibling.textContent = `${event.target.value}/4`;
      }
    }
  });

  root.addEventListener("input", (event) => {
    const form = event.target.closest("[data-career-form]");
    if (form && !event.isComposing) saveCareerDraft(careerInput(form));
  });

  root.addEventListener("submit", (event) => {
    event.preventDefault();
    const locale = getLocale();
    const c = copy[locale];
    if (event.target.matches("[data-graduation-form]")) {
      const result = requestGraduationAudit(graduationInput(event.target));
      if (result.error) {
        showToast({ identity: c.errorIdentity, provenance: c.errorProvenance, question: c.errorQuestion }[result.error] || c.outcomeNotReady);
        return;
      }
      const campusEvent = recordCampusEvent("graduation.audit.requested", {
        auditId: result.record.id,
        schoolId: result.record.schoolId,
        outcome: result.record.outcome,
      }, { id: `graduation.audit.requested:${result.record.id}`, timestamp: result.record.requestedAt });
      selectedAuditId = result.record.id;
      view = "audit";
      showToast(c.auditSaved);
      render({ preserveWindow: false });
      navigateToDeepLink(`graduation-audit-${result.record.id}`);
      return;
    }
    if (event.target.matches("[data-degree-issue]")) {
      const auditId = event.target.dataset.degreeIssue;
      const result = issueGraduationDegree(auditId, new FormData(event.target).has("acceptsConditions"));
      if (result.error) {
        showToast(result.error === "conditions" ? c.errorConditions : c.outcomeNotReady);
        return;
      }
      recordCampusEvent("graduation.degree.issued", {
        degreeId: result.record.id,
        auditId,
        schoolId: result.record.schoolId,
        standing: result.record.standing,
      }, {
        id: `graduation.degree.issued:${result.record.id}`,
        timestamp: result.record.issuedAt,
        causationId: `graduation.audit.requested:${auditId}`,
      });
      selectedDegreeId = result.record.id;
      view = "degree";
      showToast(c.issued);
      render({ preserveWindow: false });
      navigateToDeepLink(`graduation-degree-${result.record.id}`);
      return;
    }
    if (event.target.matches("[data-career-form]")) {
      const result = submitCareerPlan(careerInput(event.target), locale);
      if (result.error) return showToast(c.planError);
      recordCampusEvent("career.plan.submitted", {
        planId: result.record.id,
        schoolId: result.record.profile.schoolId,
        openingIds: result.record.matches.map(({ openingId }) => openingId),
      }, { id: `career.plan.submitted:${result.record.id}`, timestamp: result.record.createdAt });
      selectedPlanId = result.record.id;
      view = "plan";
      showToast(c.planSaved);
      render({ preserveWindow: false });
      navigateToDeepLink(`career-plan-${result.record.id}`);
      return;
    }
    if (event.target.matches("[data-career-referral]")) {
      const openingId = event.target.dataset.careerReferral;
      const result = sendCareerReferral(selectedPlanId, openingId, new FormData(event.target).get("note"));
      if (result.error) return showToast(c.referralError);
      recordCampusEvent("career.referral.sent", {
        referralId: result.referral.id,
        planId: result.plan.id,
        openingId,
      }, {
        id: `career.referral.sent:${result.referral.id}`,
        timestamp: result.referral.sentAt,
        causationId: `career.plan.submitted:${result.plan.id}`,
      });
      showToast(c.referralSent);
      render();
      return;
    }
    if (event.target.matches("[data-alumni-activate]")) {
      const result = activateAlumniProfile(formValues(event.target));
      if (result.error) return showToast(c.noDegree);
      if (result.created) {
        recordCampusEvent("alumni.profile.activated", {
          alumniId: result.record.id,
          degreeId: result.record.degreeId,
          chapterId: result.record.chapterId,
        }, {
          id: `alumni.profile.activated:${result.record.id}`,
          timestamp: result.record.activatedAt,
          causationId: `graduation.degree.issued:${result.record.degreeId}`,
        });
      }
      showToast(c.activated);
      render();
      return;
    }
    if (event.target.matches("[data-alumni-rsvp]")) {
      const data = new FormData(event.target);
      const result = rsvpAlumniReunion(data.get("attending") === "yes", data.get("note"));
      if (result.error) return;
      recordCampusEvent("alumni.reunion.rsvp", {
        alumniId: result.record.id,
        attending: result.record.reunion.attending,
        chapterId: result.record.chapterId,
      }, {
        id: `alumni.reunion.rsvp:${result.record.id}:${result.record.reunion.updatedAt}`,
        timestamp: result.record.reunion.updatedAt,
        causationId: `alumni.profile.activated:${result.record.id}`,
      });
      showToast(c.rsvpSaved);
      render();
      return;
    }
    if (event.target.matches("[data-alumni-mentor]")) {
      const data = new FormData(event.target);
      const result = offerAlumniMentorship(data.getAll("topicIds"), data.get("note"));
      if (result.error) return showToast(c.mentorError);
      recordCampusEvent("alumni.mentorship.offered", {
        alumniId: result.record.id,
        topicIds: result.record.mentorship.topicIds,
        chapterId: result.record.chapterId,
      }, {
        id: `alumni.mentorship.offered:${result.record.id}:${result.record.mentorship.offeredAt}`,
        timestamp: result.record.mentorship.offeredAt,
        causationId: `alumni.profile.activated:${result.record.id}`,
      });
      showToast(c.mentorSaved);
      render();
    }
  });
}

function initialView() {
  const route = safeDecodeFragment();
  if (route === "career-office") view = "career";
  if (route === "alumni-association" || route === "alumni-profile") view = "alumni";
  if (route.startsWith("graduation-audit-")) {
    selectedAuditId = route.slice("graduation-audit-".length);
    view = "audit";
  }
  if (route.startsWith("graduation-degree-")) {
    selectedDegreeId = route.slice("graduation-degree-".length);
    view = "degree";
  }
  if (route.startsWith("career-opening-")) {
    selectedOpeningId = route.slice("career-opening-".length);
    view = "opening";
  }
  if (route.startsWith("career-plan-")) {
    selectedPlanId = route.slice("career-plan-".length);
    view = "plan";
  }
  if (route.startsWith("alumni-chapter-")) {
    selectedChapterId = route.slice("alumni-chapter-".length);
    view = "chapter";
  }
}

export function initCareers() {
  root = document.querySelector("[data-careers-app]");
  if (!root) return;
  const identity = (() => {
    try { return JSON.parse(localStorage.getItem("tu:identity") || "null"); } catch { return null; }
  })();
  graduationSchoolId = Object.hasOwn(schools, identity?.preferredSchool) ? identity.preferredSchool : "boundary";
  initialView();
  render({ preserveWindow: false });
  bind();
  root.querySelectorAll("textarea").forEach((field, index) => {
    if (!field.dataset.preserveFocus) field.dataset.preserveFocus = `careers-text-${index}`;
    bindImeSafeInput(field, () => {});
  });
  [
    ["graduation-audit-", "audit", (id) => { selectedAuditId = id; }],
    ["graduation-degree-", "degree", (id) => { selectedDegreeId = id; }],
    ["career-opening-", "opening", (id) => { selectedOpeningId = id; }],
    ["career-plan-", "plan", (id) => { selectedPlanId = id; }],
    ["alumni-chapter-", "chapter", (id) => { selectedChapterId = id; }],
  ].forEach(([prefix, next, select]) => registerDeepLink(prefix, {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: ({
      audit: "graduation-focus",
      degree: "graduation-focus",
      opening: "career-focus",
      plan: "career-focus",
      chapter: "alumni-focus",
    })[next],
    position: "always",
    open(id) {
      select(id);
      view = next;
      render({ preserveWindow: false });
    },
  }));
  [
    ["graduation-audit", "graduation"],
    ["graduation-records", "graduation"],
    ["career-office", "career"],
    ["alumni-association", "alumni"],
    ["alumni-profile", "alumni"],
  ].forEach(([route, next]) => registerDeepLink(route, {
    anchor: () => document.getElementById(route) || root,
    position: "always",
    open() {
      view = next;
      render({ preserveWindow: false });
    },
  }));
  window.addEventListener("tu:languagechange", () => render({ preserveWindow: false }));
  window.addEventListener("tu:recordschange", () => render());
}
