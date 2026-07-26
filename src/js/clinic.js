import {
  clinicCategories,
  clinicComplaint,
  clinicComplaints,
  clinicMedicine,
  clinicMedicines,
  clinicSites,
  clinicTherapy,
  clinicTherapies,
} from "../data/clinic.js";
import { recordCampusEvent } from "./campus-ledger.js";
import {
  CLINIC_KEYS,
  clinicCarePlans,
  clinicCommunityPosts,
  clinicDraft,
  clinicIdentity,
  clinicOperationalBoard,
  clinicPrescriptions,
  clinicStats,
  clinicVisits,
  completeClinicCareStep,
  completeClinicConsultation,
  dispenseClinicPrescription,
  prescriptionCourse,
  recordClinicDose,
  saveClinicDraft,
  startClinicCarePlan,
  submitClinicTriage,
} from "./clinic-model.js";
import { bindImeSafeInput } from "./ime-input.js";
import { getLocale } from "./i18n.js";
import { renderPreservingState } from "./render-state.js";
import { printDocument } from "./print-document.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

const copy = {
  "zh-Hant": {
    eyebrow: "EIENTEI UNIVERSITY HOSPITAL / 校醫療網",
    title: "先把哪裡不對說清楚。路和藥，可以之後再吵。",
    lead: "本部醫務室處理日常傷勢；永遠亭承接跨種族、月相、境界與魔法材料暴露。分診、診察、處方、領藥與康復進度只保存在這台裝置。",
    open: "此刻開診",
    startCare: "開始診療",
    startCareLead: "先做 1 分鐘本機分診",
    load: "候診負荷",
    moon: "月相",
    localRecords: "本機診療紀錄",
    light: "兔車空一排",
    steady: "號碼正常前進",
    high: "滿月分流中",
    navTriage: "分診與候診",
    navPharmacy: "藥局與處方",
    navRecovery: "康復療法",
    navAccount: "我的診療紀錄",
    careNetwork: "兩處院區，一張會被帝換位置的轉診單。",
    careNetworkLead: "不是每次擦傷都要穿過迷途竹林；也不是寫了「沒事」就能留在本部。",
    hours: "看診時間",
    scope: "收治範圍",
    staff: "當值",
    map: "查看永遠亭路線",
    waitingBoard: "此刻候診板",
    waitingLead: "病友資料由當值號碼牌顯示；時間會隨月相、當值事件與兔車路況變動。",
    token: "號碼",
    estimated: "估計還要",
    minutes: "分鐘",
    detail: "病友附註",
    takeVisit: "接受診察",
    triage: "本機分診台",
    triageLead: "可先保存再回來；掛號不要求 My TU 身分，已有身分時則會編入校園履歷。",
    complaint: "目前符合哪些情況？",
    complaintHint: "至少選一項；可以同時選擇多項。",
    intensity: "目前影響程度",
    intensityOptions: ["仍能照常上課", "需要減少活動", "已無法完成原計畫", "症狀或殘留正在擴大"],
    onset: "何時開始",
    onsetOptions: { today: "今天／剛剛", yesterday: "昨日", week: "持續一週以上", uncertain: "日期互相矛盾" },
    mobility: "前往診療地",
    mobilityOptions: { independent: "可以自行前往", escort: "需要同伴陪同", shuttle: "需要急診兔車" },
    lunarSensitive: "月相、月光或波長會加重症狀",
    residueContained: "彈幕、魔力、孢子或季節外洩目前已停止擴散",
    notes: "補充現象／材料批次／哪一扇門不對",
    notesPlaceholder: "例如：蘑菇籃沒有標日期；第四盞燈只在回程出現……",
    saveDraft: "保存分診草稿",
    checkIn: "完成分診並掛號",
    draftSaved: "分診草稿已留在這台裝置。",
    visitCreated: "掛號完成；號碼牌已加入候診板。",
    needsComplaint: "至少選擇一項症狀，分診鐘才知道要叫哪一科。",
    activeVisit: "你的待診號碼",
    priority: { routine: "一般候診", priority: "優先分流", urgent: "急診兔車／即刻處理" },
    site: "建議院區",
    wait: "估計候診",
    clinician: "建議診察席",
    clinicians: { eirin: "八意永琳", reisen: "鈴仙・優曇華院・因幡", duty: "本部當值校醫", "reisen-trainee": "月兔實習分診席" },
    assessment: "分診判讀",
    consultation: "完成診察並開立處方",
    consulted: "診察完成；處方已送到月藥調劑室。",
    pharmacyEyebrow: "LUNAR PHARMACY / 月藥與校園藥櫃",
    pharmacyTitle: "藥袋上的單位可能是校鐘、轉角或日照。不要擅自相加。",
    pharmacyLead: "搜尋十二種幻想鄉藥品與醫材，查看來源、用法與那些通常被寫在背面的注意事項。",
    searchMedicine: "搜尋藥名、用途、配製者或注意事項",
    allCategories: "全部劑型",
    medicineCount: "項藥品／醫材",
    noMedicine: "沒有藥品承認符合這組條件。帝建議翻抽屜底；藥師不建議。",
    indication: "用途",
    directions: "用法",
    caution: "注意",
    maker: "配製與來源",
    courseUnits: "完整一程",
    units: "次記錄",
    openMedicine: "查看藥檔",
    myPrescriptions: "我的處方",
    noPrescriptions: "尚無處方。先完成一次分診與診察，藥局才會收到可讀的單子。",
    issued: "待領藥",
    dispensed: "療程中",
    completed: "已完成",
    dispense: "領取這張處方",
    recordDose: "記錄一次",
    doneDose: "本項完成",
    dosageRecorded: "本次用藥已記入本機藥袋。",
    prescriptionDispensed: "領藥完成；請先數藥，再數一次帝的號碼牌。",
    progress: "療程進度",
    printSlip: "開啟診療／處方回條",
    recoveryEyebrow: "RECOVERY CORRIDOR / 康復走廊",
    recoveryTitle: "康復不是把進度條拖到右邊。",
    recoveryLead: "每套療法都有四個能單獨確認的步驟；做到一半可以離開，回來後仍從原來那一格繼續。",
    prescribedTherapies: "診察建議",
    therapyClinician: "帶領",
    steps: "四步回條",
    startTherapy: "開始這套療法",
    therapyStarted: "康復回條已建立。",
    activePlans: "進行中的康復回條",
    noPlans: "尚無康復療程。可以依處方建議開始，也可以直接選一套需要的。",
    markStep: "完成並蓋章",
    stepDone: "已完成",
    planComplete: "康復療程完成；BBS 很快就會對「完全恢復」提出不同版本。",
    accountEyebrow: "MY MEDICAL FILE / 本機診療袋",
    accountTitle: "號碼牌會被藏起來，診療回條不會。",
    accountLead: "掛號、診察、處方、每次記錄與康復步驟依時間保存。較早的版本不因重新分診而消失。",
    visits: "診療紀錄",
    prescriptions: "處方",
    plans: "康復回條",
    waiting: "候診中",
    consultedStatus: "已完成診察",
    noVisits: "尚無掛號紀錄。",
    noAccountPrescriptions: "尚無處方紀錄。",
    noAccountPlans: "尚無康復紀錄。",
    checkedIn: "掛號",
    issuedAt: "開方",
    startedAt: "開始",
    completedAt: "完成",
    recordId: "回條編號",
    conditions: "主訴",
    bbsEchoes: "病友牆回聲",
    bbsLead: "領藥與完成療法後，永遠亭藥局和康復走廊會生成校園 BBS 回應。",
    openBbs: "前往校園 BBS",
    receipt: {
      university: "幻想鄉立東方大學・永遠亭附屬校醫院",
      title: "本機診療與處方回條",
      patient: "病友／學籍",
      visit: "診療編號",
      prescription: "處方編號",
      site: "診療地",
      clinician: "診察席",
      issued: "開立時間",
      medicines: "處方內容",
      care: "康復建議",
      note: "本回條由目前瀏覽器保存的診療紀錄生成。叫號牌遺失不影響回條，但被帝換成幸運號碼不構成優先看診。",
      print: "列印／另存 PDF",
      close: "返回診療紀錄",
    },
  },
  ja: {
    eyebrow: "EIENTEI UNIVERSITY HOSPITAL / 学内医療網",
    title: "まず、どこが違うかを言葉にする。道と薬の議論はその後。",
    lead: "本部保健室は日常傷、永遠亭は種族横断・月相・境界・魔法素材曝露を担当。トリアージ、診察、処方、調剤、回復記録はこの端末だけに保存します。",
    open: "現在診療中", startCare: "診療を始める", startCareLead: "まず1分の端末トリアージ", load: "待合負荷", moon: "月相", localRecords: "端末内診療記録",
    light: "兎車に空席あり", steady: "番号は通常進行", high: "満月分流中",
    navTriage: "トリアージ・待合", navPharmacy: "薬局・処方", navRecovery: "回復療法", navAccount: "自分の診療記録",
    careNetwork: "二つの診療所、一枚のてゐが場所を替える紹介票。",
    careNetworkLead: "すべての擦り傷に竹林横断は不要。「平気」と書くだけで本部に残れるわけでもありません。",
    hours: "診療時間", scope: "対象", staff: "当直", map: "永遠亭経路を見る",
    waitingBoard: "現在の待合板",
    waitingLead: "当番番号札が表示。時間は月相、当番事案、兎車経路で変化します。",
    token: "番号", estimated: "見込み", minutes: "分", detail: "患者メモ", takeVisit: "診察を受ける",
    triage: "端末内トリアージ",
    triageLead: "途中保存可。受付に My TU 身分は不要ですが、既存身分があれば学内履歴へ編入します。",
    complaint: "現在当てはまる状態", complaintHint: "一つ以上。複数選択可。",
    intensity: "現在の影響", intensityOptions: ["通常どおり受講可能", "活動を減らす必要", "予定を完了できない", "症状・残留が拡大中"],
    onset: "発症時期", onsetOptions: { today: "今日／たった今", yesterday: "昨日", week: "一週間以上", uncertain: "日付が矛盾" },
    mobility: "診療地への移動", mobilityOptions: { independent: "自力で行ける", escort: "同行が必要", shuttle: "救急兎車が必要" },
    lunarSensitive: "月相・月光・波長で悪化する",
    residueContained: "弾幕・魔力・胞子・季節漏出は現在拡大していない",
    notes: "補足現象／材料ロット／おかしい扉",
    notesPlaceholder: "例：茸籠に日付なし、四つ目の灯は帰路だけ出現……",
    saveDraft: "下書き保存", checkIn: "トリアージ完了・受付",
    draftSaved: "トリアージ下書きをこの端末へ保存しました。",
    visitCreated: "受付完了。番号札を待合板へ追加しました。",
    needsComplaint: "一つ以上選ばないと、トリアージ鐘が診療科を呼べません。",
    activeVisit: "自分の待合番号",
    priority: { routine: "通常待合", priority: "優先分流", urgent: "救急兎車／即時対応" },
    site: "推奨診療地", wait: "待合見込み", clinician: "推奨診察席",
    clinicians: { eirin: "八意永琳", reisen: "鈴仙・優曇華院・イナバ", duty: "本部当直校医", "reisen-trainee": "月兎実習トリアージ" },
    assessment: "トリアージ判定", consultation: "診察完了・処方発行",
    consulted: "診察完了。処方を月薬調剤室へ送りました。",
    pharmacyEyebrow: "LUNAR PHARMACY / 月薬・学内薬棚",
    pharmacyTitle: "薬袋の単位は校鐘、角、日照かもしれない。勝手に足さない。",
    pharmacyLead: "幻想郷の薬品・医材十二種を検索し、由来、使用法、裏面に回されがちな注意を確認。",
    searchMedicine: "薬名、用途、調製者、注意を検索", allCategories: "全剤形", medicineCount: "点",
    noMedicine: "該当を認める薬がありません。てゐは引出し底を勧め、薬師は勧めません。",
    indication: "用途", directions: "用法", caution: "注意", maker: "調製・由来", courseUnits: "一程", units: "回記録",
    openMedicine: "薬歴を見る", myPrescriptions: "自分の処方",
    noPrescriptions: "処方はまだありません。トリアージと診察後、薬局へ読める票が届きます。",
    issued: "調剤待ち", dispensed: "服用中", completed: "完了", dispense: "この処方を受取",
    recordDose: "一回記録", doneDose: "完了", dosageRecorded: "今回分を端末内薬袋へ記録しました。",
    prescriptionDispensed: "調剤完了。薬を数え、てゐの番号札ももう一度数えてください。",
    progress: "進捗", printSlip: "診療／処方票を開く",
    recoveryEyebrow: "RECOVERY CORRIDOR / 回復廊", recoveryTitle: "回復は進捗バーを右へ動かすことではない。",
    recoveryLead: "各療法は個別確認できる四段階。途中で離れても、戻れば元の欄から続けられます。",
    prescribedTherapies: "診察推奨", therapyClinician: "担当", steps: "四段階票", startTherapy: "この療法を開始",
    therapyStarted: "回復票を作成しました。", activePlans: "進行中の回復票",
    noPlans: "回復療法はまだありません。処方推奨または必要な療法を直接選べます。",
    markStep: "完了・押印", stepDone: "完了",
    planComplete: "回復療法完了。BBSはすぐ「完全回復」の別版を出すでしょう。",
    accountEyebrow: "MY MEDICAL FILE / 端末内診療袋", accountTitle: "番号札は隠されても、診療票は残る。",
    accountLead: "受付、診察、処方、各記録、回復段階を時系列保存。再トリアージで以前の版は消えません。",
    visits: "診療記録", prescriptions: "処方", plans: "回復票", waiting: "待合中", consultedStatus: "診察済み",
    noVisits: "受付記録なし。", noAccountPrescriptions: "処方記録なし。", noAccountPlans: "回復記録なし。",
    checkedIn: "受付", issuedAt: "処方", startedAt: "開始", completedAt: "完了", recordId: "票番号", conditions: "主訴",
    bbsEchoes: "患者壁の反響", bbsLead: "調剤・療法完了後、薬局と回復廊が学内 BBS 反応を生成します。", openBbs: "学内 BBS へ",
    receipt: {
      university: "幻想郷立東方大学・永遠亭附属校医院", title: "端末内診療・処方票", patient: "患者／学籍",
      visit: "診療番号", prescription: "処方番号", site: "診療地", clinician: "診察席", issued: "発行時刻",
      medicines: "処方内容", care: "回復推奨",
      note: "現在のブラウザ内診療記録から生成。番号札紛失は票へ影響しませんが、てゐが幸運番号へ替えても優先診療にはなりません。",
      print: "印刷／PDF保存", close: "診療記録へ戻る",
    },
  },
  en: {
    eyebrow: "EIENTEI UNIVERSITY HOSPITAL / CAMPUS CARE NETWORK",
    title: "First say what is wrong. The route and medicine may argue later.",
    lead: "The main infirmary handles everyday injuries; Eientei takes cross-species, lunar, boundary, and magical-material cases. Triage, consultations, prescriptions, dispensing, and recovery stay on this device.",
    open: "Open now", startCare: "Start care", startCareLead: "Begin with a one-minute on-device triage", load: "Queue load", moon: "Moon phase", localRecords: "On-device records",
    light: "A rabbit-shuttle row is empty", steady: "Tokens advancing normally", high: "Full-moon diversion active",
    navTriage: "Triage & queue", navPharmacy: "Pharmacy & prescriptions", navRecovery: "Recovery", navAccount: "My medical file",
    careNetwork: "Two care sites and one referral slip Tewi keeps relocating.",
    careNetworkLead: "Not every scrape requires crossing the Bamboo Forest. Writing “fine” does not guarantee the infirmary will keep the case.",
    hours: "Hours", scope: "Scope", staff: "On duty", map: "Open Eientei route",
    waitingBoard: "Live waiting board", waitingLead: "Duty tokens only. Times shift with lunar phase, live incidents, and rabbit-shuttle conditions.",
    token: "Token", estimated: "Estimated", minutes: "min", detail: "Patient note", takeVisit: "Enter consultation",
    triage: "On-device triage", triageLead: "Save and return later. Check-in never requires a My TU identity; an existing identity adds the record to campus history.",
    complaint: "Which conditions apply now?", complaintHint: "Choose at least one; multiple selections are welcome.",
    intensity: "Current impact", intensityOptions: ["Can attend class normally", "Need reduced activity", "Cannot complete the original plan", "Symptoms or residue are expanding"],
    onset: "When it began", onsetOptions: { today: "Today / just now", yesterday: "Yesterday", week: "One week or longer", uncertain: "Dates disagree" },
    mobility: "Getting to care", mobilityOptions: { independent: "Can travel independently", escort: "Need an escort", shuttle: "Need an emergency rabbit shuttle" },
    lunarSensitive: "Moon phase, moonlight, or wavelength makes this worse",
    residueContained: "Danmaku, magic, spores, or seasonal leakage has stopped spreading",
    notes: "Extra phenomena / material batch / which door is wrong",
    notesPlaceholder: "Example: mushroom basket has no date; fourth lantern appears only on return…",
    saveDraft: "Save triage draft", checkIn: "Complete triage & check in",
    draftSaved: "Triage draft saved on this device.", visitCreated: "Checked in; the token is on the waiting board.",
    needsComplaint: "Choose at least one condition so the triage bell knows which desk to call.",
    activeVisit: "Your waiting token", priority: { routine: "Routine queue", priority: "Priority diversion", urgent: "Emergency shuttle / immediate care" },
    site: "Recommended site", wait: "Estimated wait", clinician: "Recommended desk",
    clinicians: { eirin: "Eirin Yagokoro", reisen: "Reisen Udongein Inaba", duty: "Main-campus duty clinician", "reisen-trainee": "Moon-rabbit trainee triage" },
    assessment: "Triage assessment", consultation: "Complete consultation & issue prescription",
    consulted: "Consultation complete; prescription sent to the Lunar Pharmacy.",
    pharmacyEyebrow: "LUNAR PHARMACY / CAMPUS MEDICINE CABINET",
    pharmacyTitle: "The bag may use bells, corners, or daylight. Do not add the units yourself.",
    pharmacyLead: "Search twelve Gensokyo medicines and aids, including provenance, directions, and cautions usually written on the reverse.",
    searchMedicine: "Search medicine, use, maker, or caution", allCategories: "All forms", medicineCount: "medicines / aids",
    noMedicine: "No medicine admits to matching. Tewi suggests the drawer bottom; Pharmacy does not.",
    indication: "Use", directions: "Directions", caution: "Caution", maker: "Preparation & provenance", courseUnits: "Full course", units: "records",
    openMedicine: "Open medicine file", myPrescriptions: "My prescriptions",
    noPrescriptions: "No prescription yet. Complete triage and consultation so Pharmacy receives a legible slip.",
    issued: "Awaiting collection", dispensed: "Course active", completed: "Complete", dispense: "Collect prescription",
    recordDose: "Record one", doneDose: "Complete", dosageRecorded: "Dose recorded in the on-device medicine bag.",
    prescriptionDispensed: "Dispensed. Count the medicine, then count Tewi’s tokens again.",
    progress: "Course progress", printSlip: "Open clinical / prescription slip",
    recoveryEyebrow: "RECOVERY CORRIDOR", recoveryTitle: "Recovery is not dragging a progress bar to the right.",
    recoveryLead: "Every therapy has four independently confirmable steps. Leave halfway and the original box will still be waiting.",
    prescribedTherapies: "Consultation suggestions", therapyClinician: "Led by", steps: "Four-step slip", startTherapy: "Start this therapy",
    therapyStarted: "Recovery slip created.", activePlans: "Active recovery slips",
    noPlans: "No recovery course yet. Start from a prescription suggestion or choose one directly.",
    markStep: "Complete & stamp", stepDone: "Complete",
    planComplete: "Recovery course complete. BBS will soon publish another version of “fully recovered.”",
    accountEyebrow: "MY MEDICAL FILE / ON-DEVICE CLINICAL BAG", accountTitle: "Queue tokens may be hidden. Clinical slips are not.",
    accountLead: "Check-ins, consultations, prescriptions, each dose, and recovery steps remain chronological. Retriage does not erase earlier versions.",
    visits: "Visits", prescriptions: "Prescriptions", plans: "Recovery slips", waiting: "Waiting", consultedStatus: "Consulted",
    noVisits: "No check-in records.", noAccountPrescriptions: "No prescription records.", noAccountPlans: "No recovery records.",
    checkedIn: "Checked in", issuedAt: "Issued", startedAt: "Started", completedAt: "Completed", recordId: "Slip reference", conditions: "Complaints",
    bbsEchoes: "Patient-wall echoes", bbsLead: "Dispensing and completed therapy generate campus BBS reactions from Pharmacy and the Recovery Corridor.", openBbs: "Open Campus BBS",
    receipt: {
      university: "TOUHOU UNIVERSITY OF GENSOKYO · EIENTEI UNIVERSITY HOSPITAL", title: "ON-DEVICE CLINICAL & PRESCRIPTION SLIP",
      patient: "Patient / record", visit: "Visit reference", prescription: "Prescription reference", site: "Care site", clinician: "Clinical desk", issued: "Issued",
      medicines: "Prescription", care: "Recovery suggestions",
      note: "Generated from clinical records in this browser. Losing the queue token does not alter the slip; Tewi replacing it with a lucky number does not grant priority care.",
      print: "Print / save PDF", close: "Back to medical file",
    },
  },
};

const app = document.querySelector("[data-clinic-app]");
let medicineSearch = "";
let medicineCategory = "all";
let draftTimer;
let clockTimer;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value, locale, withTime = true) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(date);
}

function currentRoute() {
  return safeDecodeFragment(window.location.hash.slice(1) || "clinic");
}

function modeForRoute(route) {
  if (route === "clinic-pharmacy" || route.startsWith("clinic-medicine-")) return "pharmacy";
  if (route === "clinic-recovery") return "recovery";
  if (route === "clinic-account" || route.startsWith("clinic-visit-") || route.startsWith("clinic-prescription-")) return "account";
  return "triage";
}

function phaseName(phase, locale) {
  const values = {
    "zh-Hant": ["朔月", "眉月", "上弦月", "盈凸月", "滿月", "虧凸月", "下弦月", "殘月"],
    ja: ["新月", "三日月", "上弦", "十三夜", "満月", "寝待月", "下弦", "有明月"],
    en: ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"],
  };
  return values[locale][phase] || values[locale][0];
}

function clinicHeader(locale, c, board, mode) {
  const stats = clinicStats();
  return `
    <header class="clinic-hero">
      <div class="clinic-hero-media">
        <img src="assets/images/map/eientei-clinic.webp" srcset="assets/images/map/eientei-clinic-mobile.webp 640w, assets/images/map/eientei-clinic.webp 1280w" sizes="(max-width: 700px) 100vw, 48vw" alt="" width="1280" height="853">
        <span>24H · TU-MED-88</span>
      </div>
      <div class="clinic-hero-copy">
        <p>${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
        <a class="clinic-start-care" href="#clinic-triage-desk"><strong>${c.startCare}</strong><small>${c.startCareLead}</small><i aria-hidden="true">↓</i></a>
        <dl>
          <div><dt>${c.open}</dt><dd><i></i>${clinicSites.eientei.hours[locale].split("；")[0].split("・")[0].split(";")[0]}</dd></div>
          <div><dt>${c.load}</dt><dd>${c[board.load]}</dd></div>
          <div><dt>${c.moon}</dt><dd>${phaseName(board.snapshot.phase, locale)}</dd></div>
          <div><dt>${c.localRecords}</dt><dd>${stats.visits + stats.prescriptions + stats.activePlans + stats.completedPlans}</dd></div>
        </dl>
      </div>
    </header>
    <nav class="clinic-tabs" aria-label="${c.eyebrow}">
      <a href="#clinic" ${mode === "triage" ? 'aria-current="page"' : ""}>${c.navTriage}<span>${stats.waiting}</span></a>
      <a href="#clinic-pharmacy" ${mode === "pharmacy" ? 'aria-current="page"' : ""}>${c.navPharmacy}<span>${stats.activePrescriptions}</span></a>
      <a href="#clinic-recovery" ${mode === "recovery" ? 'aria-current="page"' : ""}>${c.navRecovery}<span>${stats.activePlans}</span></a>
      <a href="#clinic-account" ${mode === "account" ? 'aria-current="page"' : ""}>${c.navAccount}<span>${stats.visits}</span></a>
    </nav>`;
}

function siteCards(locale, c) {
  return `
    <section class="clinic-network">
      <header><div><p>CARE SITES / TU-MED</p><h3>${c.careNetwork}</h3></div><span>${c.careNetworkLead}</span></header>
      <div>${Object.values(clinicSites).map((site) => `
        <article>
          <header><i>${site.glyph}</i><div><small>${site.code}</small><h4>${site.name[locale]}</h4><span>${site.location[locale]}</span></div></header>
          <dl>
            <div><dt>${c.hours}</dt><dd>${site.hours[locale]}</dd></div>
            <div><dt>${c.scope}</dt><dd>${site.scope[locale]}</dd></div>
            <div><dt>${c.staff}</dt><dd>${site.staff[locale]}</dd></div>
          </dl>
          ${site.id === "eientei" ? `<a href="campus.html#map-eientei">${c.map}<span>↗</span></a>` : ""}
        </article>`).join("")}</div>
    </section>`;
}

function queueBoard(locale, c, board) {
  return `
    <section class="clinic-queue">
      <header><div><p>LIVE WAITING BOARD</p><h3>${c.waitingBoard}</h3></div><span>${c.waitingLead}</span></header>
      <div class="clinic-queue-grid" data-preserve-scroll="clinic-queue">
        ${board.queue.map((patient) => `
          <article class="${patient.local ? "local" : ""}">
            <span class="clinic-token"><i>${patient.glyph}</i><small>${c.token}</small><b>${escapeHtml(patient.token)}</b></span>
            <div><h4>${escapeHtml(patient.name[locale])}</h4><p>${escapeHtml(patient.reason[locale])}</p>
              <details><summary>${c.detail}</summary><span>${escapeHtml(patient.note[locale])}</span></details>
            </div>
            <strong>${c.estimated}<b>${patient.minutes}</b>${c.minutes}</strong>
            ${patient.visitId ? `<button type="button" data-clinic-consult="${escapeHtml(patient.visitId)}">${c.takeVisit}<span>→</span></button>` : ""}
          </article>`).join("")}
      </div>
    </section>`;
}

function triageForm(locale, c) {
  const draft = clinicDraft()?.answers || {
    complaints: [],
    intensity: 1,
    onset: "today",
    mobility: "independent",
    lunarSensitive: false,
    residueContained: true,
    notes: "",
  };
  return `
    <section class="clinic-triage" id="clinic-triage-desk">
      <header><div><p>TRIAGE DESK / 端末 01</p><h3>${c.triage}</h3></div><span>${c.triageLead}</span></header>
      <form data-clinic-triage-form>
        <fieldset class="clinic-complaints">
          <legend>${c.complaint}<small>${c.complaintHint}</small></legend>
          <div>${Object.values(clinicComplaints).map((complaint) => `
            <label>
              <input type="checkbox" name="complaints" value="${complaint.id}" ${draft.complaints.includes(complaint.id) ? "checked" : ""}>
              <i>${complaint.glyph}</i><span><strong>${complaint.name[locale]}</strong><small>${complaint.prompt[locale]}</small></span>
            </label>`).join("")}</div>
        </fieldset>
        <div class="clinic-triage-fields">
          <label>${c.intensity}
            <select name="intensity">${c.intensityOptions.map((label, index) => `<option value="${index + 1}" ${draft.intensity === index + 1 ? "selected" : ""}>${index + 1} · ${label}</option>`).join("")}</select>
          </label>
          <label>${c.onset}
            <select name="onset">${Object.entries(c.onsetOptions).map(([id, label]) => `<option value="${id}" ${draft.onset === id ? "selected" : ""}>${label}</option>`).join("")}</select>
          </label>
          <label>${c.mobility}
            <select name="mobility">${Object.entries(c.mobilityOptions).map(([id, label]) => `<option value="${id}" ${draft.mobility === id ? "selected" : ""}>${label}</option>`).join("")}</select>
          </label>
          <label class="clinic-triage-check"><input type="checkbox" name="lunarSensitive" ${draft.lunarSensitive ? "checked" : ""}><span>${c.lunarSensitive}</span></label>
          <label class="clinic-triage-check"><input type="checkbox" name="residueContained" ${draft.residueContained ? "checked" : ""}><span>${c.residueContained}</span></label>
          <label class="clinic-triage-notes">${c.notes}<textarea name="notes" rows="4" maxlength="500" placeholder="${c.notesPlaceholder}">${escapeHtml(draft.notes)}</textarea></label>
        </div>
        <footer>
          <span>${clinicIdentity()?.id ? `${escapeHtml(clinicIdentity().name)} · ${escapeHtml(clinicIdentity().id)}` : "LOCAL PATIENT · NO UPLOAD"}</span>
          <button class="button button-secondary" type="button" data-clinic-save-draft>${c.saveDraft}</button>
          <button class="button button-primary" type="submit">${c.checkIn}<span>→</span></button>
        </footer>
      </form>
    </section>`;
}

function activeVisitCard(locale, c) {
  const visit = clinicVisits().findLast((record) => record.status === "waiting");
  if (!visit) return "";
  return `
    <section class="clinic-active-visit" data-priority="${visit.band}">
      <span aria-hidden="true">${visit.band === "urgent" ? "急" : visit.band === "priority" ? "優" : "診"}</span>
      <div><p>${c.activeVisit} · ${escapeHtml(visit.id)}</p><h3>${c.priority[visit.band]}</h3>
        <dl>
          <div><dt>${c.site}</dt><dd>${clinicSites[visit.siteId].name[locale]}</dd></div>
          <div><dt>${c.wait}</dt><dd>${visit.waitMinutes} ${c.minutes}</dd></div>
          <div><dt>${c.clinician}</dt><dd>${c.clinicians[visit.clinicianId]}</dd></div>
          <div><dt>${c.assessment}</dt><dd>${visit.answers.complaints.map((id) => clinicComplaint(id)?.name[locale]).filter(Boolean).join("、")}</dd></div>
        </dl>
      </div>
      <button class="button button-primary" type="button" data-clinic-consult="${escapeHtml(visit.id)}">${c.consultation}<span>→</span></button>
    </section>`;
}

function renderTriage(locale, c, board) {
  return `${activeVisitCard(locale, c)}${siteCards(locale, c)}${queueBoard(locale, c, board)}${triageForm(locale, c)}`;
}

function selectedMedicineId(route) {
  const id = route.replace(/^clinic-medicine-/, "");
  return clinicMedicine(id) ? id : Object.keys(clinicMedicines)[0];
}

function medicineHaystack(medicine) {
  return Object.values(medicine).flatMap((value) => {
    if (typeof value === "string") return [value];
    if (value && typeof value === "object") return Object.values(value).filter((item) => typeof item === "string");
    return [];
  }).join(" ").toLocaleLowerCase();
}

function prescriptionsView(locale, c) {
  const prescriptions = clinicPrescriptions().slice().reverse();
  return `
    <section class="clinic-prescriptions">
      <header><div><p>MY PRESCRIPTIONS</p><h3>${c.myPrescriptions}</h3></div><span>${prescriptions.length}</span></header>
      ${prescriptions.length ? `<div>${prescriptions.map((prescription) => {
        const course = prescriptionCourse(prescription);
        const status = prescription.status === "issued" ? c.issued : prescription.status === "course-complete" ? c.completed : c.dispensed;
        return `
          <article>
            <header><div><small>${escapeHtml(prescription.id)}</small><h4>${clinicSites[prescription.siteId]?.short[locale] || prescription.siteId}</h4></div><b data-status="${prescription.status}">${status}</b></header>
            <div class="clinic-rx-progress"><span><i style="width:${course.percent}%"></i></span><b>${course.completed}/${course.required}</b><small>${c.progress}</small></div>
            <ul>${prescription.medicineIds.map((id) => {
              const medicine = clinicMedicine(id);
              const count = prescription.doseLog.filter((dose) => dose.medicineId === id).length;
              return `<li><i>${medicine.glyph}</i><span><strong>${medicine.name[locale]}</strong><small>${count}/${medicine.courseUnits} · ${medicine.directions[locale]}</small></span>
                ${prescription.status === "dispensed" && count < medicine.courseUnits ? `<button type="button" data-clinic-dose="${id}" data-prescription-id="${prescription.id}">${c.recordDose}</button>` : `<b>✓ ${c.doneDose}</b>`}
              </li>`;
            }).join("")}</ul>
            <footer>
              ${prescription.status === "issued" ? `<button class="button button-primary" type="button" data-clinic-dispense="${prescription.id}">${c.dispense}<span>→</span></button>` : ""}
              <button class="button button-secondary" type="button" data-clinic-receipt="${prescription.id}">${c.printSlip}</button>
            </footer>
          </article>`;
      }).join("")}</div>` : `<p class="clinic-empty">${c.noPrescriptions}</p>`}
    </section>`;
}

function renderPharmacy(locale, c, route) {
  const selectedId = selectedMedicineId(route);
  const selected = clinicMedicine(selectedId);
  const normalizedSearch = medicineSearch.trim().toLocaleLowerCase();
  const filtered = Object.values(clinicMedicines).filter((medicine) => {
    const categoryMatch = medicineCategory === "all" || medicine.category === medicineCategory;
    const searchMatch = !normalizedSearch || medicineHaystack(medicine).includes(normalizedSearch);
    return categoryMatch && searchMatch;
  });
  return `
    <section class="clinic-pharmacy" id="clinic-pharmacy">
      <header class="clinic-section-heading"><div><p>${c.pharmacyEyebrow}</p><h3>${c.pharmacyTitle}</h3></div><span>${c.pharmacyLead}</span></header>
      <div class="clinic-medicine-toolbar">
        <label><span aria-hidden="true">⌕</span><input type="search" value="${escapeHtml(medicineSearch)}" placeholder="${c.searchMedicine}" data-clinic-medicine-search data-preserve-focus="clinic-medicine-search"></label>
        <select data-clinic-category>${`<option value="all">${c.allCategories}</option>` + Object.entries(clinicCategories).map(([id, label]) => `<option value="${id}" ${medicineCategory === id ? "selected" : ""}>${label[locale]}</option>`).join("")}</select>
        <b>${filtered.length} ${c.medicineCount}</b>
      </div>
      <div class="clinic-pharmacy-layout">
        <nav class="clinic-medicine-list" data-preserve-scroll="clinic-medicines">
          ${filtered.length ? filtered.map((medicine) => `
            <a href="#clinic-medicine-${medicine.id}" class="${medicine.id === selectedId ? "active" : ""}">
              <i>${medicine.glyph}</i><span><small>${medicine.code} · ${clinicCategories[medicine.category][locale]}</small><strong>${medicine.name[locale]}</strong></span><b>→</b>
            </a>`).join("") : `<p>${c.noMedicine}</p>`}
        </nav>
        <article class="clinic-medicine-file">
          <header><i>${selected.glyph}</i><div><p>${selected.code} · ${clinicCategories[selected.category][locale]}</p><h4>${selected.name[locale]}</h4></div></header>
          <dl>
            <div><dt>${c.maker}</dt><dd>${selected.maker[locale]}</dd></div>
            <div><dt>${c.indication}</dt><dd>${selected.indication[locale]}</dd></div>
            <div><dt>${c.directions}</dt><dd>${selected.directions[locale]}</dd></div>
            <div class="caution"><dt>${c.caution}</dt><dd>${selected.caution[locale]}</dd></div>
            <div><dt>${c.courseUnits}</dt><dd>${selected.courseUnits} ${c.units}</dd></div>
          </dl>
        </article>
      </div>
    </section>
    ${prescriptionsView(locale, c)}`;
}

function suggestedTherapies() {
  return [...new Set(clinicPrescriptions().flatMap((record) => record.therapyIds || []))];
}

function renderRecovery(locale, c) {
  const plans = clinicCarePlans().slice().reverse();
  const suggested = new Set(suggestedTherapies());
  return `
    <section class="clinic-recovery" id="clinic-recovery">
      <header class="clinic-section-heading"><div><p>${c.recoveryEyebrow}</p><h3>${c.recoveryTitle}</h3></div><span>${c.recoveryLead}</span></header>
      <div class="clinic-therapy-catalogue">
        ${Object.values(clinicTherapies).map((therapy) => {
          const active = plans.some((plan) => plan.therapyId === therapy.id && plan.status === "active");
          return `<article class="${suggested.has(therapy.id) ? "suggested" : ""}">
            <header><i>${therapy.glyph}</i><div>${suggested.has(therapy.id) ? `<small>${c.prescribedTherapies}</small>` : ""}<h4>${therapy.name[locale]}</h4></div></header>
            <p>${therapy.lead[locale]}</p>
            <dl><div><dt>${c.therapyClinician}</dt><dd>${therapy.clinician[locale]}</dd></div><div><dt>${c.steps}</dt><dd>${therapy.steps.length}</dd></div></dl>
            <button class="button ${active ? "button-secondary" : "button-primary"}" type="button" data-clinic-start-therapy="${therapy.id}" ${active ? "disabled" : ""}>${active ? c.activePlans : c.startTherapy}<span>→</span></button>
          </article>`;
        }).join("")}
      </div>
      <section class="clinic-care-plans">
        <header><div><p>ACTIVE CARE SLIPS</p><h3>${c.activePlans}</h3></div><span>${plans.filter((plan) => plan.status === "active").length}</span></header>
        ${plans.length ? plans.map((plan) => {
          const therapy = clinicTherapy(plan.therapyId);
          const progress = Math.round((plan.completedSteps.length / therapy.steps.length) * 100);
          return `<article class="${plan.status === "completed" ? "completed" : ""}">
            <header><div><small>${escapeHtml(plan.id)}</small><h4>${therapy.name[locale]}</h4><span>${therapy.clinician[locale]}</span></div><strong>${progress}%</strong></header>
            <ol>${therapy.steps.map((step, index) => {
              const done = plan.completedSteps.includes(index);
              return `<li class="${done ? "done" : ""}"><span>${done ? "✓" : String(index + 1).padStart(2, "0")}</span><p>${step[locale]}</p>
                ${!done && plan.status === "active" ? `<button type="button" data-clinic-care-step="${index}" data-plan-id="${plan.id}">${c.markStep}</button>` : `<b>${c.stepDone}</b>`}
              </li>`;
            }).join("")}</ol>
          </article>`;
        }).join("") : `<p class="clinic-empty">${c.noPlans}</p>`}
      </section>
    </section>`;
}

function renderAccount(locale, c) {
  const visits = clinicVisits().slice().reverse();
  const prescriptions = clinicPrescriptions().slice().reverse();
  const plans = clinicCarePlans().slice().reverse();
  const posts = clinicCommunityPosts(locale);
  return `
    <section class="clinic-account" id="clinic-account">
      <header class="clinic-section-heading"><div><p>${c.accountEyebrow}</p><h3>${c.accountTitle}</h3></div><span>${c.accountLead}</span></header>
      <div class="clinic-account-grid">
        <section><header><h4>${c.visits}</h4><b>${visits.length}</b></header>
          ${visits.length ? visits.map((visit) => `<article>
            <span data-status="${visit.status}">${visit.status === "waiting" ? c.waiting : c.consultedStatus}</span>
            <h5>${escapeHtml(visit.id)}</h5>
            <p>${visit.answers.complaints.map((id) => clinicComplaint(id)?.name[locale]).filter(Boolean).join("、")}</p>
            <dl><div><dt>${c.site}</dt><dd>${clinicSites[visit.siteId]?.short[locale]}</dd></div><div><dt>${c.checkedIn}</dt><dd>${formatDate(visit.checkedInAt, locale)}</dd></div></dl>
            ${visit.status === "waiting" ? `<button type="button" data-clinic-consult="${visit.id}">${c.takeVisit}<span>→</span></button>` : ""}
          </article>`).join("") : `<p class="clinic-empty">${c.noVisits}</p>`}
        </section>
        <section><header><h4>${c.prescriptions}</h4><b>${prescriptions.length}</b></header>
          ${prescriptions.length ? prescriptions.map((prescription) => {
            const course = prescriptionCourse(prescription);
            return `<article><span data-status="${prescription.status}">${prescription.status === "issued" ? c.issued : prescription.status === "course-complete" ? c.completed : c.dispensed}</span>
              <h5>${escapeHtml(prescription.id)}</h5><p>${prescription.medicineIds.map((id) => clinicMedicine(id)?.name[locale]).join("、")}</p>
              <dl><div><dt>${c.issuedAt}</dt><dd>${formatDate(prescription.issuedAt, locale)}</dd></div><div><dt>${c.progress}</dt><dd>${course.percent}%</dd></div></dl>
              <button type="button" data-clinic-receipt="${prescription.id}">${c.printSlip}<span>↗</span></button>
            </article>`;
          }).join("") : `<p class="clinic-empty">${c.noAccountPrescriptions}</p>`}
        </section>
        <section><header><h4>${c.plans}</h4><b>${plans.length}</b></header>
          ${plans.length ? plans.map((plan) => {
            const therapy = clinicTherapy(plan.therapyId);
            return `<article><span data-status="${plan.status}">${plan.status === "completed" ? c.completed : c.activePlans}</span>
              <h5>${escapeHtml(plan.id)}</h5><p>${therapy.name[locale]}</p>
              <dl><div><dt>${c.startedAt}</dt><dd>${formatDate(plan.startedAt, locale)}</dd></div><div><dt>${c.progress}</dt><dd>${plan.completedSteps.length}/${therapy.steps.length}</dd></div></dl>
              <a href="#clinic-recovery">${c.navRecovery}<span>→</span></a>
            </article>`;
          }).join("") : `<p class="clinic-empty">${c.noAccountPlans}</p>`}
        </section>
      </div>
      <section class="clinic-bbs-echoes">
        <header><div><p>CAMPUS BBS / MEDICAL ECHOES</p><h3>${c.bbsEchoes}</h3></div><span>${c.bbsLead}</span></header>
        <div>${posts.length ? posts.slice(0, 4).map((post) => `<article><span>${post.category.toUpperCase()}</span><h4>${escapeHtml(post.title)}</h4><p>${escapeHtml(post.body)}</p><small>${escapeHtml(post.author)} · ${formatDate(post.createdAt, locale)}</small></article>`).join("") : `<p class="clinic-empty">${c.bbsLead}</p>`}</div>
        <a class="button button-primary" href="campus.html#bbs">${c.openBbs}<span>→</span></a>
      </section>
    </section>`;
}

function triageAnswers(form) {
  const formData = new FormData(form);
  return {
    complaints: formData.getAll("complaints"),
    intensity: Number(formData.get("intensity")),
    onset: formData.get("onset"),
    mobility: formData.get("mobility"),
    lunarSensitive: form.elements.lunarSensitive.checked,
    residueContained: form.elements.residueContained.checked,
    notes: formData.get("notes"),
  };
}

function recordVisitEvent(visit) {
  recordCampusEvent(
    "clinic.visit.checked-in",
    { visitId: visit.id, siteId: visit.siteId, band: visit.band, waitMinutes: visit.waitMinutes },
    { id: `clinic.visit.checked-in:${visit.id}`, timestamp: visit.checkedInAt },
  );
}

function handleConsultation(visitId, c) {
  const result = completeClinicConsultation(visitId);
  if (!result) return;
  recordCampusEvent(
    "clinic.consultation.completed",
    { visitId: result.visit.id, prescriptionId: result.prescription.id, siteId: result.visit.siteId },
    { id: `clinic.consultation.completed:${result.visit.id}`, timestamp: result.visit.consultedAt },
  );
  showToast(c.consulted);
  window.location.hash = "clinic-pharmacy";
}

function renderReceipt(prescriptionId) {
  const prescription = clinicPrescriptions().find((record) => record.id === prescriptionId);
  const visit = clinicVisits().find((record) => record.id === prescription?.visitId);
  if (!prescription || !visit) return;
  const locale = getLocale();
  const c = copy[locale];
  const d = c.receipt;
  const dialog = app.querySelector("[data-clinic-receipt-dialog]");
  const identity = clinicIdentity();
  dialog.querySelector("[data-clinic-receipt-body]").innerHTML = `
    <header><div class="clinic-receipt-mark">診</div><div><p>${d.university}</p><span>TU-MED · LOCAL CLINICAL COPY</span></div><code>${escapeHtml(prescription.id)}</code></header>
    <section><p>${d.title}</p><h2>${escapeHtml(identity?.name || visit.patientLabel)}</h2><span>${escapeHtml(identity?.id || "LOCAL PATIENT")}</span></section>
    <dl>
      <div><dt>${d.visit}</dt><dd>${escapeHtml(visit.id)}</dd></div>
      <div><dt>${d.prescription}</dt><dd>${escapeHtml(prescription.id)}</dd></div>
      <div><dt>${d.site}</dt><dd>${clinicSites[visit.siteId].name[locale]}</dd></div>
      <div><dt>${d.clinician}</dt><dd>${c.clinicians[visit.clinicianId]}</dd></div>
      <div><dt>${d.issued}</dt><dd>${formatDate(prescription.issuedAt, locale)}</dd></div>
      <div><dt>${c.priority[visit.band]}</dt><dd>${visit.answers.complaints.map((id) => clinicComplaint(id)?.name[locale]).filter(Boolean).join("、")}</dd></div>
    </dl>
    <section class="clinic-receipt-rx"><h3>${d.medicines}</h3>${prescription.medicineIds.map((id) => {
      const medicine = clinicMedicine(id);
      return `<article><i>${medicine.glyph}</i><div><strong>${medicine.name[locale]}</strong><span>${medicine.directions[locale]}</span><small>${medicine.caution[locale]}</small></div></article>`;
    }).join("")}</section>
    <section class="clinic-receipt-care"><h3>${d.care}</h3><ul>${(prescription.therapyIds || []).map((id) => `<li>${clinicTherapy(id)?.name[locale]}</li>`).join("") || "<li>—</li>"}</ul></section>
    <footer><p>${d.note}</p><span>${escapeHtml(visit.snapshotKey)}</span></footer>`;
  dialog.querySelectorAll("[data-clinic-receipt-close]").forEach((button) => {
    button.setAttribute("aria-label", d.close);
    button.textContent = button.classList.contains("dialog-close") ? "×" : d.close;
  });
  dialog.querySelector("[data-clinic-receipt-print]").childNodes[0].nodeValue = `${d.print} `;
  if (!dialog.open) dialog.showModal();
}

function bind(locale, c, mode) {
  const form = app.querySelector("[data-clinic-triage-form]");
  const saveDraft = () => {
    if (!form) return;
    saveClinicDraft(triageAnswers(form));
  };
  form?.addEventListener("input", () => {
    window.clearTimeout(draftTimer);
    draftTimer = window.setTimeout(saveDraft, 260);
  });
  form?.addEventListener("change", saveDraft);
  app.querySelector("[data-clinic-save-draft]")?.addEventListener("click", () => {
    saveDraft();
    showToast(c.draftSaved);
  });
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const answers = triageAnswers(form);
    if (!answers.complaints.length) {
      showToast(c.needsComplaint);
      form.querySelector(".clinic-complaints").focus?.();
      return;
    }
    const visit = submitClinicTriage(answers);
    if (!visit) return;
    recordVisitEvent(visit);
    showToast(c.visitCreated);
    render();
  });
  app.querySelectorAll("[data-clinic-consult]").forEach((button) => {
    button.addEventListener("click", () => handleConsultation(button.dataset.clinicConsult, c));
  });
  const medicineInput = app.querySelector("[data-clinic-medicine-search]");
  if (medicineInput) {
    bindImeSafeInput(medicineInput, (value) => {
      medicineSearch = value;
      render();
    });
  }
  app.querySelector("[data-clinic-category]")?.addEventListener("change", (event) => {
    medicineCategory = event.currentTarget.value;
    render();
  });
  app.querySelectorAll("[data-clinic-dispense]").forEach((button) => {
    button.addEventListener("click", () => {
      const prescription = dispenseClinicPrescription(button.dataset.clinicDispense);
      if (!prescription) return;
      recordCampusEvent(
        "clinic.prescription.dispensed",
        { prescriptionId: prescription.id, visitId: prescription.visitId, medicineIds: prescription.medicineIds },
        { id: `clinic.prescription.dispensed:${prescription.id}`, timestamp: prescription.dispensedAt },
      );
      showToast(c.prescriptionDispensed);
      render();
    });
  });
  app.querySelectorAll("[data-clinic-dose]").forEach((button) => {
    button.addEventListener("click", () => {
      const result = recordClinicDose(button.dataset.prescriptionId, button.dataset.clinicDose);
      if (!result) return;
      recordCampusEvent(
        "clinic.dose.recorded",
        {
          doseId: result.dose.id,
          prescriptionId: result.prescription.id,
          visitId: result.prescription.visitId,
          medicineId: result.dose.medicineId,
          sequence: result.dose.sequence,
        },
        { id: `clinic.dose.recorded:${result.dose.id}`, timestamp: result.dose.recordedAt },
      );
      showToast(c.dosageRecorded);
      render();
    });
  });
  app.querySelectorAll("[data-clinic-start-therapy]").forEach((button) => {
    button.addEventListener("click", () => {
      const recentVisit = clinicVisits().findLast((record) => record.status === "consulted");
      const plan = startClinicCarePlan(button.dataset.clinicStartTherapy, { visitId: recentVisit?.id || null });
      if (!plan) return;
      recordCampusEvent(
        "clinic.therapy.started",
        { planId: plan.id, therapyId: plan.therapyId, visitId: plan.visitId },
        { id: `clinic.therapy.started:${plan.id}`, timestamp: plan.startedAt },
      );
      showToast(c.therapyStarted);
      render();
    });
  });
  app.querySelectorAll("[data-clinic-care-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const result = completeClinicCareStep(button.dataset.planId, Number(button.dataset.clinicCareStep));
      if (!result || !result.plan) return;
      recordCampusEvent(
        result.completedNow ? "clinic.therapy.completed" : "clinic.therapy.step.completed",
        {
          planId: result.plan.id,
          therapyId: result.plan.therapyId,
          visitId: result.plan.visitId,
          step: Number(button.dataset.clinicCareStep),
        },
        {
          id: result.completedNow
            ? `clinic.therapy.completed:${result.plan.id}`
            : `clinic.therapy.step.completed:${result.plan.id}:${button.dataset.clinicCareStep}`,
          timestamp: result.plan.updatedAt,
        },
      );
      if (result.completedNow) showToast(c.planComplete);
      render();
    });
  });
  app.querySelectorAll("[data-clinic-receipt]").forEach((button) => {
    button.addEventListener("click", () => renderReceipt(button.dataset.clinicReceipt));
  });
  const receiptDialog = app.querySelector("[data-clinic-receipt-dialog]");
  receiptDialog?.querySelectorAll("[data-clinic-receipt-close]").forEach((button) => {
    button.addEventListener("click", () => receiptDialog.close());
  });
  receiptDialog?.addEventListener("click", (event) => {
    if (event.target === receiptDialog) receiptDialog.close();
  });
  receiptDialog?.querySelector("[data-clinic-receipt-print]")?.addEventListener("click", () => {
    printDocument(receiptDialog.querySelector("[data-clinic-receipt-body]"), {
      title: receiptDialog.querySelector("h1, h2")?.textContent || document.title,
    });
  });
}

function render() {
  if (!app) return;
  const locale = getLocale();
  const c = copy[locale];
  const route = currentRoute();
  const mode = modeForRoute(route);
  const board = clinicOperationalBoard();
  renderPreservingState(app, () => {
    app.innerHTML = `
      ${clinicHeader(locale, c, board, mode)}
      ${mode === "triage" ? renderTriage(locale, c, board) : mode === "pharmacy" ? renderPharmacy(locale, c, route) : mode === "recovery" ? renderRecovery(locale, c) : renderAccount(locale, c)}
      <dialog class="clinic-receipt-dialog" data-clinic-receipt-dialog>
        <button class="dialog-close" type="button" aria-label="${c.receipt.close}" data-clinic-receipt-close>×</button>
        <div class="clinic-receipt" data-clinic-receipt-body></div>
        <footer><button class="button button-secondary" type="button" data-clinic-receipt-close>${c.receipt.close}</button><button class="button button-primary" type="button" data-clinic-receipt-print>${c.receipt.print} <span>↗</span></button></footer>
      </dialog>`;
  }, { preserveWindow: true });
  bind(locale, c, mode);
}

export function initClinic() {
  if (!app) return;
  window.addEventListener("tu:languagechange", render);
  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#clinic")) render();
  });
  clockTimer = window.setInterval(() => {
    if (modeForRoute(currentRoute()) === "triage") render();
  }, 60_000);
  window.addEventListener("pagehide", () => {
    window.clearInterval(clockTimer);
    window.clearTimeout(draftTimer);
  }, { once: true });
  render();
}
