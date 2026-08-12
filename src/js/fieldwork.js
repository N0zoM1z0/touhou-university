import {
  fieldworkComplication,
  fieldworkDisciplines,
  fieldworkIncidentKinds,
  fieldworkLocalized,
  fieldworkRegions,
  fieldworkResearchChoices,
  fieldworkRiskLabels,
  fieldworkSourceKinds,
  fieldworkStation,
  fieldworkStations,
  fieldworkTravelModes,
} from "../data/fieldwork.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import {
  assessFieldworkDraft,
  checkInFieldwork,
  clearFieldworkDraft,
  completeFieldworkReturn,
  fieldworkDraft,
  fieldworkPassportSummary,
  fieldworkPlacement,
  fieldworkPlacements,
  fieldworkTravelEstimate,
  respondToFieldworkComplication,
  saveFieldworkDraft,
  submitFieldworkApplication,
} from "./fieldwork-model.js";
import { bindImeSafeInput } from "./ime-input.js";
import { getLocale } from "./i18n.js";
import { printDocument } from "./print-document.js";
import { renderPreservingState } from "./render-state.js";
import { siteHref } from "./site-router.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

let root;
let view = "stations";
let selectedStationId = "hakurei-shrine";
let selectedPlacementId = null;
let currentDraft = null;
let saveTimer = 0;
const filters = { query: "", region: "all", discipline: "all" };

const copy = {
  "zh-Hant": {
    eyebrow: "FIELDWORK PASSPORT / 境內實習 × 田野調查",
    title: "地圖告訴你怎麼去；護照還要記得你為什麼去、看見了什麼，以及誰不同意。",
    lead: "二十四個實習站各有自己的入口規矩、帶隊人與麻煩。取得派遣令、現場報到、處理一宗不肯照表發生的事，再把觀察、來源鏈與研究使用決定一起帶回來。",
    stationsTab: "二十四站",
    dispatchTab: "派遣桌",
    passportTab: "我的護照",
    recordsTab: "派遣與回報",
    stations: "實習站",
    stamps: "枚場地印",
    hours: "小時",
    credits: "田野學分",
    active: "值勤中",
    routeDesk: "今日路線桌",
    routeNote: "月相、時段與交通方式會改變預估；『很快』不是時間單位。",
    search: "搜尋站名、帶隊人或工作",
    allRegions: "全部地域",
    allDisciplines: "全部領域",
    show: "打開站務檔案",
    apply: "以此站準備派遣",
    mapHint: "點選木印；場地不保證和地圖維持相同意見。",
    supervisor: "現場指導",
    companion: "協作／麻煩來源",
    shift: "值勤時段",
    risk: "風險與停止",
    access: "入口規矩",
    ethics: "現場倫理",
    equipment: "指定裝備",
    tasks: "本次可做的工作",
    wrinkle: "頁邊預告",
    travel: "出發方式",
    estimated: "預估",
    min: "分鐘",
    moon: "今日月相",
    duty: "當值時段",
    dispatchTitle: "填寫境內實習派遣令",
    station: "實習站",
    fieldName: "護照署名／值勤稱呼",
    purpose: "這次要回答的田野問題",
    purposePlaceholder: "例：比較紅魔館值班簿與相對時間線，保留兩者不一致之處。",
    departure: "預定出發日",
    ability: "能力使用計畫",
    emergency: "返校／退場計畫",
    chooseGear: "隨行裝備（少帶可附條件核准，不會假裝已經帶齊）",
    acknowledge: "我已讀過本站風險、入口規矩與倫理說明；現場的人、妖怪、神靈、幽靈與物件仍可拒絕。",
    submit: "送交派遣桌",
    clear: "換一張空白派遣令",
    purposeError: "田野問題至少寫十二個字；『去看看』會被原樣退回。",
    ethicsError: "先確認已讀本站倫理與拒絕規則。",
    activeError: "已有一份護照正在外勤；先返校蓋章再開下一條路。",
    approved: "核准派遣",
    conditional: "附條件派遣",
    conditions: "出發前附件",
    permit: "境內實習派遣令",
    permitLead: "這張紙允許你去工作，不允許你把所有看見的東西帶回來。",
    printPermit: "列印派遣令／另存 PDF",
    checkin: "核驗入口，開始值勤",
    checkinNote: "報到後會揭開本站今天留給你的現場麻煩。",
    fieldCase: "現場偏差回報",
    chooseResponse: "選擇第一處置；沒有一個選項會把現場變成整齊的成功分數。",
    responded: "第一處置已寫入來源鏈",
    returnLog: "返校觀察與來源回報",
    observation: "親眼觀察／實際完成",
    observationPlaceholder: "把看到的、聽來的與推測的分開寫；也可以明確留下不知道。",
    sourceKind: "主要來源形式",
    sourceNote: "來源、版本與取得方式",
    sourcePlaceholder: "誰說的、哪一版、哪個儀器，或物件如何表達；不要只寫『現場資料』。",
    evidenceCode: "證物／頁碼／儀器版本代碼",
    incident: "偏差或事故類型",
    incidentNote: "事故、醫療、同意或來源鏈附件",
    incidentPlaceholder: "若沒有事故，寫下仍存在的偏差；若有事故，記停止與通報。",
    research: "這份日誌是否可成為正式研究資料",
    complete: "提交返校回報並請指導者蓋章",
    observationError: "觀察至少二十個字；空白不能替現場作證。",
    sourceError: "請留下可追溯的來源說明。",
    report: "返校認證與指導評語",
    standing: "指導評定",
    strengths: "保留得好的部分",
    cautions: "仍需夾在印章旁的問題",
    researchDisposition: "研究資料去向",
    printReport: "列印返校卷／另存 PDF",
    openBbs: "查看校園 BBS 的外勤風聲",
    openMap: "打開校園出發地圖",
    backStations: "回二十四站",
    passportTitle: "境內實習與田野調查護照",
    passportLead: "印章證明你帶回了可追溯的學習，不證明每一場爭議都已解決。",
    noStamps: "護照尚未蓋章。第一個站務檔案不會自己走進護照。",
    distinct: "個不同站",
    disciplines: "個領域",
    researchReady: "份可申請研究使用",
    contestedCount: "枚帶紅線",
    repeated: "再訪章",
    first: "首訪章",
    printPassport: "列印護照／另存 PDF",
    recordsTitle: "派遣令、外勤與返校卷",
    noRecords: "尚無派遣紀錄；你可以先在地圖上挑一個會惹麻煩的地方。",
    openRecord: "開啟卷宗",
    statusApproved: "待出發",
    statusConditional: "附條件・待出發",
    statusDeployed: "現場值勤",
    statusResponded: "待返校回報",
    statusCompleted: "已返校蓋章",
    copied: "護照卷宗連結已複製。",
    shared: "複製此卷宗連結",
    clearStanding: "清楚可追溯",
    conditionalStanding: "附條件保留",
    contestedStanding: "爭議隨章同行",
    saveHint: "草稿只保存在這台裝置；派遣、處置、觀察與印章會進入本機資料櫃及 My TU。",
    issued: "派遣令已保存；場地今天仍可能提出新條件。",
    departed: "入口核驗完成。現場現在開始不照表運作。",
    handled: "處置已寫入外勤票；返校時不要把爭議擦掉。",
    completedToast: "返校認證完成；印章與紅線都已進入護照。",
  },
  ja: {
    eyebrow: "FIELDWORK PASSPORT / 幻想郷域内実習 × フィールド調査",
    title: "地図は行き方を示す。旅券は、なぜ行き、何を見て、誰が異議を唱えたかまで覚える。",
    lead: "二十四の実習所には、それぞれ異なる入場規則と指導者、厄介事がある。派遣令を受け、現地で点呼し、予定どおりには起きない一件に対処したうえで、観察記録・来歴・研究利用の判断を持ち帰る。",
    stationsTab: "二十四実習所", dispatchTab: "派遣机", passportTab: "自分の旅券", recordsTab: "派遣・帰還記録",
    stations: "実習所", stamps: "現地印", hours: "時間", credits: "実習単位", active: "外勤中",
    routeDesk: "本日の経路机", routeNote: "月相・時刻・交通手段で所要時間が変わる。「すぐ」は時間単位ではない。",
    search: "実習所・指導者・仕事を検索", allRegions: "全地域", allDisciplines: "全分野", show: "実習所ファイルを開く", apply: "この実習所で派遣準備",
    mapHint: "木印を選択。現地は地図と同じ意見を保つとは限らない。",
    supervisor: "現地指導", companion: "協働／厄介事の源", shift: "当番時間", risk: "リスク・停止", access: "入口規則", ethics: "現地倫理",
    equipment: "指定装備", tasks: "今回可能な仕事", wrinkle: "欄外予告", travel: "出発手段", estimated: "推定", min: "分", moon: "本日の月相", duty: "当番帯",
    dispatchTitle: "幻想郷域内実習派遣令を記入", station: "実習所", fieldName: "旅券署名／当番名", purpose: "今回の現地調査で答える問い",
    purposePlaceholder: "例：紅魔館当直簿と相対時間線を比較し、不一致を残す。", departure: "出発予定日", ability: "能力使用計画", emergency: "帰校／退出計画",
    chooseGear: "携行装備（不足は条件付許可。持参済みとは扱わない）",
    acknowledge: "実習所のリスク、入口、倫理を読みました。現地の人・妖怪・神霊・幽霊・物件はなお拒否できます。",
    submit: "派遣机へ提出", clear: "空白派遣令へ", purposeError: "問いは十二文字以上。「見に行く」はそのまま差戻し。", ethicsError: "現地倫理と拒否規則を確認してください。",
    activeError: "外勤中の旅券があります。帰校押印後に次の経路を開いてください。",
    approved: "派遣許可", conditional: "条件付派遣", conditions: "出発前の附帯条件", permit: "幻想郷域内実習派遣令",
    permitLead: "この紙は仕事を許可するが、見たもの全ての持帰りを許可しない。", printPermit: "派遣令を印刷／PDF 保存", checkin: "入口確認・当番開始",
    checkinNote: "点呼後、本日この実習所が残した現場の厄介事が開く。", fieldCase: "現場偏差報告",
    chooseResponse: "初動を選択。現場を整った成功点へ変える選択肢はない。", responded: "初動を来歴鎖へ記録済み",
    returnLog: "帰校観察・情報源報告", observation: "直接観察／実施内容",
    observationPlaceholder: "見たこと、聞いたこと、推測を分ける。不明も残せる。", sourceKind: "主な情報源の種別", sourceNote: "情報源・版・入手方法",
    sourcePlaceholder: "誰の発言、どの版、どの計器、物がどう表明したか。「現地資料」だけは禁止。", evidenceCode: "証物／頁／計器版コード",
    incident: "偏差・事故種別", incidentNote: "事故・医療・同意・来歴附件",
    incidentPlaceholder: "事故なしでも偏差を記録。事故ありなら停止と通報を記す。", research: "正式研究資料としての扱い",
    complete: "帰校報告を提出し指導印を求める", observationError: "観察は二十文字以上。空白は現場の証言にならない。", sourceError: "追跡可能な資料源説明を残してください。",
    report: "帰校認証・指導評", standing: "指導判定", strengths: "保持できた点", cautions: "印の横に残す問題", researchDisposition: "研究資料の行先",
    printReport: "帰還記録を印刷／PDF 保存", openBbs: "BBS の外勤風聞を見る", openMap: "出発地図を開く", backStations: "二十四実習所へ",
    passportTitle: "幻想郷域内実習・フィールド調査パスポート", passportLead: "印は追跡可能な学びを持ち帰った証明で、全争議解決の証明ではない。",
    noStamps: "旅券は未押印。最初の実習所ファイルは自ら旅券へ歩いてこない。", distinct: "異なる実習所", disciplines: "分野", researchReady: "研究利用申請可",
    contestedCount: "赤糸付印", repeated: "再訪印", first: "初訪印", printPassport: "旅券を印刷／PDF 保存",
    recordsTitle: "派遣令・外勤・帰還記録", noRecords: "派遣記録なし。まず地図から厄介そうな場所を選べます。", openRecord: "記録を開く",
    statusApproved: "出発待ち", statusConditional: "条件付・出発待ち", statusDeployed: "現地当番", statusResponded: "帰校報告待ち", statusCompleted: "帰校押印済み",
    copied: "旅券記録リンクをコピーしました。", shared: "記録リンクをコピー", clearStanding: "明瞭・追跡可能", conditionalStanding: "条件付保持", contestedStanding: "争議は印と同行",
    saveHint: "下書きはこの端末のみ。派遣・初動・観察・印は資料棚と My TU へ入る。",
    issued: "派遣令を保存。現地は本日も新条件を出せる。", departed: "入口確認完了。現場はここから予定通りでなくなる。",
    handled: "初動を外勤票へ記録。帰校時に争議を消さないこと。", completedToast: "帰校認証完了。印と赤糸が旅券へ入りました。",
  },
  en: {
    eyebrow: "FIELDWORK PASSPORT / DOMESTIC PLACEMENT × FIELD INQUIRY",
    title: "A map says how to go. A passport remembers why, what you saw, and who disagreed.",
    lead: "Twenty-four stations have their own entry rules, supervisors, and complications. Obtain dispatch, check in, respond when something refuses to follow the plan, then return with observations, provenance, and a decision on research use.",
    stationsTab: "Twenty-four stations", dispatchTab: "Dispatch desk", passportTab: "My passport", recordsTab: "Dispatch & returns",
    stations: "stations", stamps: "field seals", hours: "hours", credits: "field credits", active: "on duty",
    routeDesk: "Today's route desk", routeNote: "Moon, duty band, and mode change estimates; 'soon' is not a unit of time.",
    search: "Search station, supervisor, or work", allRegions: "All regions", allDisciplines: "All fields", show: "Open station file", apply: "Prepare dispatch here",
    mapHint: "Choose a wooden seal; the place may not retain the map's opinion.",
    supervisor: "Field supervisor", companion: "Collaborator / source of trouble", shift: "Duty window", risk: "Risk & stopping", access: "Entry rule", ethics: "Field ethics",
    equipment: "Listed equipment", tasks: "Available work", wrinkle: "Marginal forecast", travel: "Travel mode", estimated: "Estimated", min: "min", moon: "Today's moon", duty: "Duty band",
    dispatchTitle: "Complete domestic-placement dispatch", station: "Station", fieldName: "Passport signature / duty name", purpose: "Field question for this visit",
    purposePlaceholder: "Example: compare the Scarlet duty log and relative timeline while retaining disagreement.", departure: "Planned departure", ability: "Ability-use plan", emergency: "Return / exit plan",
    chooseGear: "Carried equipment (missing items create conditions; they are not treated as packed)",
    acknowledge: "I have read this station's risk, entry, and ethics notes. People, youkai, gods, spirits, and objects may still refuse.",
    submit: "Submit to dispatch", clear: "New blank order", purposeError: "Write at least twelve characters of a field question; 'look around' returns unchanged.", ethicsError: "Confirm the field ethics and refusal rule.",
    activeError: "A passport is already in the field. Return for stamping before opening another route.",
    approved: "Dispatch approved", conditional: "Conditional dispatch", conditions: "Pre-departure annex", permit: "Domestic Placement Dispatch Order",
    permitLead: "This paper permits work; it does not permit bringing home everything you see.", printPermit: "Print dispatch / Save PDF", checkin: "Verify entry and begin duty",
    checkinNote: "Check-in reveals the complication this station kept for today.", fieldCase: "Field deviation report",
    chooseResponse: "Choose a first response. None turns the field into a tidy success score.", responded: "First response entered into provenance",
    returnLog: "Return observation & source report", observation: "Direct observation / work completed",
    observationPlaceholder: "Separate seen, reported, and inferred. You may explicitly retain the unknown.", sourceKind: "Primary source form", sourceNote: "Source, version, and acquisition",
    sourcePlaceholder: "Who said it, which version, which instrument, or how the object expressed itself; not merely 'field data'.", evidenceCode: "Evidence / page / instrument-version code",
    incident: "Deviation or incident", incidentNote: "Incident, medical, consent, or custody annex",
    incidentPlaceholder: "With no incident, retain deviation. With one, record stopping and notification.", research: "May this log become formal research data?",
    complete: "Submit return and request supervisor seal", observationError: "Observation needs twenty characters; blank cannot testify for the field.", sourceError: "Leave a traceable source description.",
    report: "Return certification & supervisor note", standing: "Supervisor standing", strengths: "What remained well", cautions: "What stays beside the seal", researchDisposition: "Research-data disposition",
    printReport: "Print return / Save PDF", openBbs: "Open field rumours on BBS", openMap: "Open campus departure map", backStations: "Back to twenty-four stations",
    passportTitle: "Domestic Placement & Field Inquiry Passport", passportLead: "A seal proves traceable learning returned; it does not prove every dispute was resolved.",
    noStamps: "No seals yet. The first station file will not walk into the passport by itself.", distinct: "distinct stations", disciplines: "fields", researchReady: "research-eligible logs",
    contestedCount: "red-thread seals", repeated: "return visit", first: "first visit", printPassport: "Print passport / Save PDF",
    recordsTitle: "Dispatch, field duty & return files", noRecords: "No dispatch files yet; choose somewhere likely to cause trouble.", openRecord: "Open file",
    statusApproved: "Awaiting departure", statusConditional: "Conditional · awaiting departure", statusDeployed: "Field duty", statusResponded: "Awaiting return report", statusCompleted: "Returned & stamped",
    copied: "Passport-file link copied.", shared: "Copy file link", clearStanding: "Clear & traceable", conditionalStanding: "Retained with conditions", contestedStanding: "Dispute travels with seal",
    saveHint: "Draft stays on this device. Dispatch, response, observation, and seals enter the records cabinet and My TU.",
    issued: "Dispatch saved; the site may still add today's condition.", departed: "Entry verified. The field now stops following the plan.",
    handled: "Response entered on the field slip; do not erase the dispute on return.", completedToast: "Return certified; seal and red thread entered the passport.",
  },
};

const abilityOptions = {
  none: ["本次不使用能力", "今回は能力を使用しない", "No ability use"],
  declared: ["事前聲明用途與停止口令", "用途・停止号令を事前申告", "Purpose and stop command declared"],
  supervised: ["只在指導者在場時使用", "指導者同席時のみ使用", "Supervisor-present use only"],
  sealed: ["出發前封印，返校後共同解封", "出発前封印・帰校後共同解除", "Sealed before departure; jointly released after return"],
};

const emergencyOptions = {
  "return-bell": ["三聲返校鈴", "三音帰校鈴", "Three-tone return bell"],
  "buddy-rope": ["雙人回程繩", "二人帰還縄", "Buddy return rope"],
  "host-escort": ["場地主持陪同撤離", "現地主催者同行退出", "Host-escorted exit"],
  "clinic-route": ["永遠亭／校醫務室預先路線", "永遠亭・校医務室事前経路", "Pre-filed Eientei / infirmary route"],
};

const statusKey = {
  approved: "statusApproved",
  conditional: "statusConditional",
  deployed: "statusDeployed",
  responded: "statusResponded",
  completed: "statusCompleted",
};

const standingKey = {
  clear: "clearStanding",
  conditional: "conditionalStanding",
  contested: "contestedStanding",
};

const reviewItemLabels = {
  observation: ["親眼觀察與推測分開保存", "直接観察と推測を分けて保存", "Direct observation remained separate from inference"],
  provenance: ["主要來源留下了可追溯版本", "主要資料源に追跡可能な版が残った", "The primary source retained a traceable version"],
  "response-chain": ["現場處置已接回來源鏈", "現場初動が来歴鎖へ接続された", "The field response was joined to the provenance chain"],
  "research-consent": ["研究使用範圍已明確選擇", "研究利用範囲が明示的に選択された", "Research-use scope was chosen explicitly"],
  "unresolved-dispute": ["現場爭議仍未解決，不得改寫成共識", "現場争議は未解決。合意へ書き換えない", "The field dispute remains unresolved and must not be rewritten as consensus"],
  "reported-deviation": ["偏差／事故附件須與主卷同行", "偏差・事故附件は本記録と同行", "The deviation or incident annex must travel with the main file"],
};

function reviewLabel(value, locale) {
  return t(reviewItemLabels[value] || [value, value, value], locale);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function t(value, locale) {
  return fieldworkLocalized(value, locale);
}

function optionList(values, selected, locale) {
  return Object.entries(values).map(([id, labels]) =>
    `<option value="${escapeHtml(id)}"${id === selected ? " selected" : ""}>${escapeHtml(labels[locale === "zh-Hant" ? 0 : locale === "ja" ? 1 : 2])}</option>`,
  ).join("");
}

function localizedOptions(values, selected, locale) {
  return Object.entries(values).map(([id, label]) =>
    `<option value="${escapeHtml(id)}"${id === selected ? " selected" : ""}>${escapeHtml(t(label, locale))}</option>`,
  ).join("");
}

function formatDate(value, locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: value?.includes?.("T") ? "short" : undefined }).format(date);
}

function filteredStations() {
  const locale = getLocale();
  const query = filters.query.trim().toLocaleLowerCase(locale);
  return fieldworkStations.filter((station) => {
    if (filters.region !== "all" && station.region !== filters.region) return false;
    if (filters.discipline !== "all" && !station.discipline.includes(filters.discipline)) return false;
    if (!query) return true;
    return [
      station.code,
      t(station.name, locale),
      t(station.supervisor, locale),
      t(station.placement, locale),
      t(station.host, locale),
    ].join(" ").toLocaleLowerCase(locale).includes(query);
  });
}

function hero(locale, c) {
  const passport = fieldworkPassportSummary();
  const placements = fieldworkPlacements();
  const active = placements.filter(({ status }) => ["deployed", "responded"].includes(status)).length;
  return `
    <header class="fieldwork-hero">
      <div class="fieldwork-hero-copy">
        <p>${escapeHtml(c.eyebrow)}</p>
        <h2>${escapeHtml(c.title)}</h2>
        <span>${escapeHtml(c.lead)}</span>
        <div class="fieldwork-hero-stats">
          <div><strong>24</strong><small>${escapeHtml(c.stations)}</small></div>
          <div><strong>${passport.totalVisits}</strong><small>${escapeHtml(c.stamps)}</small></div>
          <div><strong>${passport.hours}</strong><small>${escapeHtml(c.hours)}</small></div>
          <div><strong>${active}</strong><small>${escapeHtml(c.active)}</small></div>
        </div>
      </div>
      <div class="fieldwork-passport-cover" aria-hidden="true">
        <div><small>幻想鄉立東方大學</small><b>境 内<br>実 習</b><i>FIELDWORK<br>PASSPORT</i></div>
        <span>二十四<br>現場印</span>
        <em>東</em>
      </div>
    </header>`;
}

function tabs(c) {
  return `
    <nav class="fieldwork-tabs" aria-label="${escapeHtml(c.passportTitle)}">
      <button type="button" data-fieldwork-view="stations"${view === "stations" || view === "station" ? " class=\"active\"" : ""}>${escapeHtml(c.stationsTab)}</button>
      <button type="button" data-fieldwork-view="dispatch"${view === "dispatch" ? " class=\"active\"" : ""}>${escapeHtml(c.dispatchTab)}</button>
      <button type="button" data-fieldwork-view="passport"${view === "passport" ? " class=\"active\"" : ""}>${escapeHtml(c.passportTab)}</button>
      <button type="button" data-fieldwork-view="records"${view === "records" || view === "placement" ? " class=\"active\"" : ""}>${escapeHtml(c.recordsTab)}</button>
    </nav>`;
}

function filtersView(locale, c) {
  return `
    <div class="fieldwork-filters">
      <label><span>${escapeHtml(c.search)}</span><input type="search" value="${escapeHtml(filters.query)}" placeholder="${escapeHtml(c.search)}" data-fieldwork-query data-preserve-focus="fieldwork-query"></label>
      <label><span>${escapeHtml(c.allRegions)}</span><select data-fieldwork-region>
        <option value="all">${escapeHtml(c.allRegions)}</option>
        ${Object.entries(fieldworkRegions).map(([id, label]) => `<option value="${id}"${filters.region === id ? " selected" : ""}>${escapeHtml(t(label, locale))}</option>`).join("")}
      </select></label>
      <label><span>${escapeHtml(c.allDisciplines)}</span><select data-fieldwork-discipline>
        <option value="all">${escapeHtml(c.allDisciplines)}</option>
        ${Object.entries(fieldworkDisciplines).map(([id, label]) => `<option value="${id}"${filters.discipline === id ? " selected" : ""}>${escapeHtml(t(label, locale))}</option>`).join("")}
      </select></label>
    </div>`;
}

function mapView(locale, c) {
  const visible = new Set(filteredStations().map(({ id }) => id));
  return `
    <section class="fieldwork-map-panel">
      <header><p>DOMESTIC PLACEMENT NETWORK / 24</p><h3>${escapeHtml(c.routeDesk)}</h3><span>${escapeHtml(c.mapHint)}</span></header>
      <div class="fieldwork-map" data-preserve-scroll="fieldwork-map">
        <span class="fieldwork-map-line line-a"></span><span class="fieldwork-map-line line-b"></span><span class="fieldwork-map-line line-c"></span>
        ${fieldworkStations.map((station) => `
          <button
            type="button"
            class="fieldwork-map-node${station.id === selectedStationId ? " selected" : ""}${visible.has(station.id) ? "" : " filtered"}"
            style="--x:${station.x}%;--y:${station.y}%"
            data-fieldwork-station="${escapeHtml(station.id)}"
            aria-label="${escapeHtml(t(station.name, locale))}"
            title="${escapeHtml(`${station.code} · ${t(station.name, locale)}`)}"
          ><b>${escapeHtml(station.glyph)}</b><small>${escapeHtml(station.code.replace("FW-", ""))}</small></button>`).join("")}
        <div class="fieldwork-map-key">${Object.entries(fieldworkRegions).map(([id, label]) => `<span data-region="${id}">${escapeHtml(t(label, locale))}</span>`).join("")}</div>
      </div>
    </section>`;
}

function stationCard(station, locale, c) {
  return `
    <article class="fieldwork-station-card" data-region="${escapeHtml(station.region)}">
      <header><span>${escapeHtml(station.glyph)}</span><div><small>${escapeHtml(station.code)} · ${escapeHtml(t(fieldworkRegions[station.region], locale))}</small><h4>${escapeHtml(t(station.name, locale))}</h4></div></header>
      <p>${escapeHtml(t(station.placement, locale))}</p>
      <dl>
        <div><dt>${escapeHtml(c.supervisor)}</dt><dd>${escapeHtml(t(station.supervisor, locale))}</dd></div>
        <div><dt>${escapeHtml(c.shift)}</dt><dd>${escapeHtml(t(station.shift, locale))}</dd></div>
      </dl>
      <footer>
        <span>${station.hours}h · ${station.credits} cr</span>
        <button type="button" data-fieldwork-station="${escapeHtml(station.id)}">${escapeHtml(c.show)} ↗</button>
      </footer>
    </article>`;
}

function stationsView(locale, c) {
  const stations = filteredStations();
  return `
    <section class="fieldwork-stations-view" id="fieldwork-stations">
      ${filtersView(locale, c)}
      ${mapView(locale, c)}
      <div class="fieldwork-station-grid" data-preserve-scroll="fieldwork-stations">
        ${stations.map((station) => stationCard(station, locale, c)).join("")}
      </div>
    </section>`;
}

function routeDesk(station, locale, c, modeId = currentDraft?.travelMode || "foot") {
  const estimate = fieldworkTravelEstimate(station.id, modeId);
  return `
    <aside class="fieldwork-route-slip">
      <header><span>路</span><div><small>${escapeHtml(c.routeDesk)}</small><strong>${escapeHtml(t(fieldworkTravelModes[modeId].name, locale))}</strong></div></header>
      <div><b>${estimate.minutes}</b><span>${escapeHtml(c.min)}</span></div>
      <dl>
        <div><dt>${escapeHtml(c.moon)}</dt><dd>${escapeHtml(t(estimate.lunar, locale))}</dd></div>
        <div><dt>${escapeHtml(c.duty)}</dt><dd>${escapeHtml(t(estimate.duty, locale))}</dd></div>
      </dl>
      <p>${escapeHtml(t(fieldworkTravelModes[modeId].note, locale))}</p>
      ${estimate.notes.map((note) => `<small>${escapeHtml(t(note, locale))}</small>`).join("")}
    </aside>`;
}

function stationView(locale, c) {
  const station = fieldworkStation(selectedStationId) || fieldworkStations[0];
  return `
    <article class="fieldwork-station-file" id="fieldwork-station-${escapeHtml(station.id)}">
      <header class="fieldwork-file-heading">
        <div><p>${escapeHtml(station.code)} · ${escapeHtml(t(fieldworkRegions[station.region], locale))}</p><h3>${escapeHtml(t(station.name, locale))}</h3><span>${escapeHtml(t(station.host, locale))}</span></div>
        <b>${escapeHtml(station.glyph)}</b>
      </header>
      <div class="fieldwork-file-lead">
        <p>${escapeHtml(t(station.premise, locale))}</p>
        <span>${station.hours} ${escapeHtml(c.hours)} · ${station.credits} ${escapeHtml(c.credits)}</span>
      </div>
      <div class="fieldwork-file-grid">
        <section>
          <h4>${escapeHtml(c.supervisor)}</h4>
          <strong>${escapeHtml(t(station.supervisor, locale))}</strong>
          <p>${escapeHtml(t(station.companion, locale))}</p>
        </section>
        <section>
          <h4>${escapeHtml(c.access)}</h4>
          <p>${escapeHtml(t(station.access, locale))}</p>
        </section>
        <section>
          <h4>${escapeHtml(c.risk)}</h4>
          <strong>${escapeHtml(t(fieldworkRiskLabels[station.risk], locale))}</strong>
          <p>${escapeHtml(t(station.shift, locale))}</p>
        </section>
        <section>
          <h4>${escapeHtml(c.ethics)}</h4>
          <p>${escapeHtml(t(station.ethics, locale))}</p>
        </section>
      </div>
      <div class="fieldwork-file-lists">
        <section><h4>${escapeHtml(c.equipment)}</h4><ol>${station.equipment.map((item) => `<li>${escapeHtml(t(item, locale))}</li>`).join("")}</ol></section>
        <section><h4>${escapeHtml(c.tasks)}</h4><ol>${station.tasks.map((item) => `<li>${escapeHtml(t(item, locale))}</li>`).join("")}</ol></section>
      </div>
      <blockquote><small>${escapeHtml(c.wrinkle)}</small><p>${escapeHtml(t(station.wrinkle, locale))}</p></blockquote>
      <div class="fieldwork-route-chooser">
        <label><span>${escapeHtml(c.travel)}</span><select data-fieldwork-route-mode>
          ${localizedOptions(Object.fromEntries(Object.entries(fieldworkTravelModes).map(([id, mode]) => [id, mode.name])), currentDraft?.travelMode || "foot", locale)}
        </select></label>
        ${routeDesk(station, locale, c)}
      </div>
      <footer class="fieldwork-file-actions">
        <button type="button" class="paper-button" data-fieldwork-view="stations">← ${escapeHtml(c.backStations)}</button>
        <button type="button" class="primary-button" data-fieldwork-apply="${escapeHtml(station.id)}">${escapeHtml(c.apply)} →</button>
      </footer>
    </article>`;
}

function draftFromForm(form) {
  const data = new FormData(form);
  return {
    stationId: data.get("stationId"),
    fieldName: data.get("fieldName"),
    purpose: data.get("purpose"),
    departureDate: data.get("departureDate"),
    travelMode: data.get("travelMode"),
    abilityPlan: data.get("abilityPlan"),
    emergencyPlan: data.get("emergencyPlan"),
    equipment: data.getAll("equipment"),
    ethicsAcknowledged: data.has("ethicsAcknowledged"),
  };
}

function dispatchView(locale, c) {
  const draft = currentDraft || fieldworkDraft(selectedStationId);
  const station = fieldworkStation(draft.stationId);
  const assessment = assessFieldworkDraft(draft, locale);
  return `
    <section class="fieldwork-dispatch-view" id="fieldwork-dispatch">
      <header><p>FORM TU-FW / 24-STATION EDITION</p><h3>${escapeHtml(c.dispatchTitle)}</h3><span>${escapeHtml(c.saveHint)}</span></header>
      <form data-fieldwork-form>
        <div class="fieldwork-form-grid">
          <label class="wide"><span>${escapeHtml(c.station)}</span><select name="stationId">
            ${fieldworkStations.map((entry) => `<option value="${escapeHtml(entry.id)}"${entry.id === station.id ? " selected" : ""}>${escapeHtml(`${entry.code} · ${t(entry.name, locale)}`)}</option>`).join("")}
          </select></label>
          <label><span>${escapeHtml(c.fieldName)}</span><input name="fieldName" value="${escapeHtml(draft.fieldName)}" maxlength="100"></label>
          <label><span>${escapeHtml(c.departure)}</span><input type="date" name="departureDate" value="${escapeHtml(draft.departureDate)}"></label>
          <label class="wide"><span>${escapeHtml(c.purpose)}</span><textarea name="purpose" rows="4" maxlength="800" placeholder="${escapeHtml(c.purposePlaceholder)}">${escapeHtml(draft.purpose)}</textarea></label>
          <label><span>${escapeHtml(c.travel)}</span><select name="travelMode">${localizedOptions(Object.fromEntries(Object.entries(fieldworkTravelModes).map(([id, mode]) => [id, mode.name])), draft.travelMode, locale)}</select></label>
          <label><span>${escapeHtml(c.ability)}</span><select name="abilityPlan">${optionList(abilityOptions, draft.abilityPlan, locale)}</select></label>
          <label class="wide"><span>${escapeHtml(c.emergency)}</span><select name="emergencyPlan">${optionList(emergencyOptions, draft.emergencyPlan, locale)}</select></label>
        </div>
        <fieldset class="fieldwork-gear">
          <legend>${escapeHtml(c.chooseGear)}</legend>
          ${station.equipment.map((item, index) => `<label><input type="checkbox" name="equipment" value="${index}"${draft.equipment.includes(index) ? " checked" : ""}><span><b>0${index + 1}</b>${escapeHtml(t(item, locale))}</span></label>`).join("")}
        </fieldset>
        <label class="fieldwork-ack"><input type="checkbox" name="ethicsAcknowledged"${draft.ethicsAcknowledged ? " checked" : ""}><span>${escapeHtml(c.acknowledge)}</span></label>
        <div class="fieldwork-preview">
          ${routeDesk(station, locale, c, draft.travelMode)}
          <article data-outcome="${assessment.outcome}">
            <small>${escapeHtml(c.permit)}</small>
            <strong>${escapeHtml(assessment.outcome === "approved" ? c.approved : c.conditional)}</strong>
            <p>${escapeHtml(t(station.ethics, locale))}</p>
            ${assessment.conditions.length ? `<ul>${assessment.conditions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
          </article>
        </div>
        <div class="fieldwork-form-actions">
          <button type="button" class="paper-button" data-fieldwork-clear>${escapeHtml(c.clear)}</button>
          <button type="submit" class="primary-button">${escapeHtml(c.submit)} →</button>
        </div>
      </form>
    </section>`;
}

function printableElement(selector) {
  return root.querySelector(selector);
}

function permitView(placement, station, locale, c) {
  const estimate = fieldworkTravelEstimate(station.id, placement.draft.travelMode, new Date(`${placement.draft.departureDate}T09:00:00`));
  return `
    <article class="fieldwork-official-file fieldwork-permit" data-fieldwork-document id="fieldwork-placement-${escapeHtml(placement.id)}">
      <header><div><small>TOUHOU UNIVERSITY · DOMESTIC PLACEMENT</small><h3>${escapeHtml(c.permit)}</h3><p>${escapeHtml(c.permitLead)}</p></div><b data-status="${escapeHtml(placement.status)}">${escapeHtml(c[statusKey[placement.status]])}</b></header>
      <div class="fieldwork-file-number"><span>${escapeHtml(placement.id)}</span><time>${escapeHtml(formatDate(placement.createdAt, locale))}</time></div>
      <section class="fieldwork-permit-station">
        <i>${escapeHtml(station.glyph)}</i>
        <div><small>${escapeHtml(station.code)}</small><h4>${escapeHtml(t(station.name, locale))}</h4><p>${escapeHtml(t(station.placement, locale))}</p></div>
      </section>
      <dl class="fieldwork-permit-grid">
        <div><dt>${escapeHtml(c.supervisor)}</dt><dd>${escapeHtml(t(station.supervisor, locale))}</dd></div>
        <div><dt>${escapeHtml(c.departure)}</dt><dd>${escapeHtml(placement.draft.departureDate)}</dd></div>
        <div><dt>${escapeHtml(c.travel)}</dt><dd>${escapeHtml(t(fieldworkTravelModes[placement.draft.travelMode].name, locale))} · ${estimate.minutes} ${escapeHtml(c.min)}</dd></div>
        <div><dt>${escapeHtml(c.risk)}</dt><dd>${escapeHtml(t(fieldworkRiskLabels[station.risk], locale))}</dd></div>
        <div class="wide"><dt>${escapeHtml(c.purpose)}</dt><dd>${escapeHtml(placement.draft.purpose)}</dd></div>
      </dl>
      ${placement.permit.conditions.length ? `<section class="fieldwork-permit-conditions"><h4>${escapeHtml(c.conditions)}</h4><ol>${placement.permit.conditions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol></section>` : ""}
      <footer>
        <div><span>${escapeHtml(t(station.seal, locale))}</span><b>${escapeHtml(station.glyph)}</b></div>
        <p>${escapeHtml(t(station.ethics, locale))}</p>
      </footer>
      <div class="fieldwork-document-actions" data-print-exclude>
        <button type="button" class="paper-button" data-fieldwork-print>${escapeHtml(c.printPermit)}</button>
        <button type="button" class="paper-button" data-fieldwork-share>${escapeHtml(c.shared)}</button>
        <button type="button" class="primary-button" data-fieldwork-checkin="${escapeHtml(placement.id)}">${escapeHtml(c.checkin)} →</button>
      </div>
      <small class="fieldwork-action-note" data-print-exclude>${escapeHtml(c.checkinNote)}</small>
    </article>`;
}

function complicationView(placement, station, locale, c) {
  const complication = fieldworkComplication(placement.complicationId);
  return `
    <article class="fieldwork-live-file" id="fieldwork-placement-${escapeHtml(placement.id)}">
      <header><div><small>${escapeHtml(placement.id)} · ${escapeHtml(station.code)}</small><h3>${escapeHtml(t(station.name, locale))}</h3><p>${escapeHtml(c.fieldCase)}</p></div><b>現</b></header>
      <section class="fieldwork-live-case">
        <small>${escapeHtml(c.fieldCase)} · ${escapeHtml(complication.id)}</small>
        <h4>${escapeHtml(t(complication.title, locale))}</h4>
        <p>${escapeHtml(t(complication.detail, locale))}</p>
      </section>
      <p class="fieldwork-choice-lead">${escapeHtml(c.chooseResponse)}</p>
      <div class="fieldwork-response-grid">
        ${complication.responses.map(([id, label, outcome], index) => `
          <button type="button" data-fieldwork-response="${escapeHtml(id)}" data-placement="${escapeHtml(placement.id)}">
            <b>0${index + 1}</b><span>${escapeHtml(t(label, locale))}</span><small>${escapeHtml(c[standingKey[outcome === "careful" ? "conditional" : outcome === "traceable" ? "clear" : "contested"]])}</small>
          </button>`).join("")}
      </div>
      <footer><a href="${siteHref("map")}">${escapeHtml(c.openMap)} ↗</a><span>${escapeHtml(t(station.wrinkle, locale))}</span></footer>
    </article>`;
}

function returnForm(placement, station, locale, c) {
  const complication = fieldworkComplication(placement.complicationId);
  const response = complication.responses.find(([id]) => id === placement.responseId);
  return `
    <section class="fieldwork-return-form" id="fieldwork-placement-${escapeHtml(placement.id)}">
      <header><div><small>${escapeHtml(c.responded)} · ${escapeHtml(placement.id)}</small><h3>${escapeHtml(c.returnLog)}</h3></div><span>${escapeHtml(t(response?.[1], locale))}</span></header>
      <form data-fieldwork-return="${escapeHtml(placement.id)}">
        <label><span>${escapeHtml(c.observation)}</span><textarea name="observation" rows="5" maxlength="2400" placeholder="${escapeHtml(c.observationPlaceholder)}"></textarea></label>
        <div class="fieldwork-return-grid">
          <label><span>${escapeHtml(c.sourceKind)}</span><select name="sourceKind">${localizedOptions(fieldworkSourceKinds, "observation", locale)}</select></label>
          <label><span>${escapeHtml(c.evidenceCode)}</span><input name="evidenceCode" maxlength="120" placeholder="${escapeHtml(station.code)}-OBS-01"></label>
          <label class="wide"><span>${escapeHtml(c.sourceNote)}</span><textarea name="sourceNote" rows="3" maxlength="1200" placeholder="${escapeHtml(c.sourcePlaceholder)}"></textarea></label>
          <label><span>${escapeHtml(c.incident)}</span><select name="incidentKind">${localizedOptions(fieldworkIncidentKinds, "none", locale)}</select></label>
          <label><span>${escapeHtml(c.research)}</span><select name="researchChoice">${localizedOptions(fieldworkResearchChoices, "teaching", locale)}</select></label>
          <label class="wide"><span>${escapeHtml(c.incidentNote)}</span><textarea name="incidentNote" rows="3" maxlength="1200" placeholder="${escapeHtml(c.incidentPlaceholder)}"></textarea></label>
        </div>
        <button type="submit" class="primary-button">${escapeHtml(c.complete)} →</button>
      </form>
    </section>`;
}

function completedView(placement, station, locale, c) {
  const stamp = fieldworkPassportSummary().stamps.find(({ id }) => id === placement.stampId);
  return `
    <article class="fieldwork-official-file fieldwork-report" data-fieldwork-document id="fieldwork-placement-${escapeHtml(placement.id)}">
      <header><div><small>RETURN CERTIFICATION · ${escapeHtml(station.code)}</small><h3>${escapeHtml(c.report)}</h3><p>${escapeHtml(t(station.name, locale))}</p></div><b data-standing="${escapeHtml(placement.review.standing)}">${escapeHtml(c[standingKey[placement.review.standing]])}</b></header>
      <div class="fieldwork-file-number"><span>${escapeHtml(placement.id)}</span><time>${escapeHtml(formatDate(placement.completedAt, locale))}</time></div>
      <blockquote>${escapeHtml(t(placement.review.note, locale))}</blockquote>
      <section class="fieldwork-return-observation">
        <small>${escapeHtml(c.observation)}</small><p>${escapeHtml(placement.log.observation)}</p>
      </section>
      <dl class="fieldwork-report-grid">
        <div><dt>${escapeHtml(c.sourceKind)}</dt><dd>${escapeHtml(t(fieldworkSourceKinds[placement.log.sourceKind], locale))}</dd></div>
        <div><dt>${escapeHtml(c.evidenceCode)}</dt><dd>${escapeHtml(placement.log.evidenceCode || "—")}</dd></div>
        <div class="wide"><dt>${escapeHtml(c.sourceNote)}</dt><dd>${escapeHtml(placement.log.sourceNote)}</dd></div>
        <div><dt>${escapeHtml(c.incident)}</dt><dd>${escapeHtml(t(fieldworkIncidentKinds[placement.log.incidentKind], locale))}</dd></div>
        <div><dt>${escapeHtml(c.researchDisposition)}</dt><dd>${escapeHtml(t(fieldworkResearchChoices[placement.review.research], locale))}</dd></div>
      </dl>
      <div class="fieldwork-review-columns">
        <section><h4>${escapeHtml(c.strengths)}</h4><ul>${placement.review.strengths.length ? placement.review.strengths.map((item) => `<li>${escapeHtml(reviewLabel(item, locale))}</li>`).join("") : "<li>—</li>"}</ul></section>
        <section><h4>${escapeHtml(c.cautions)}</h4><ul>${placement.review.cautions.length ? placement.review.cautions.map((item) => `<li>${escapeHtml(reviewLabel(item, locale))}</li>`).join("") : "<li>—</li>"}</ul></section>
      </div>
      <footer class="fieldwork-stamp-issued">
        <div><small>${escapeHtml(stamp?.repeated ? c.repeated : c.first)}</small><strong>${escapeHtml(t(station.seal, locale))}</strong><span>${stamp?.credits ?? station.credits} cr · ${station.hours} h</span></div>
        <b>${escapeHtml(station.glyph)}</b>
      </footer>
      <div class="fieldwork-document-actions" data-print-exclude>
        <button type="button" class="paper-button" data-fieldwork-print>${escapeHtml(c.printReport)}</button>
        <button type="button" class="paper-button" data-fieldwork-share>${escapeHtml(c.shared)}</button>
        <a class="paper-button" href="campus.html#bbs">${escapeHtml(c.openBbs)} ↗</a>
      </div>
    </article>`;
}

function placementView(locale, c) {
  const placement = fieldworkPlacement(selectedPlacementId);
  if (!placement) {
    view = "records";
    return recordsView(locale, c);
  }
  const station = fieldworkStation(placement.stationId);
  if (["approved", "conditional"].includes(placement.status)) return permitView(placement, station, locale, c);
  if (placement.status === "deployed") return complicationView(placement, station, locale, c);
  if (placement.status === "responded") return returnForm(placement, station, locale, c);
  return completedView(placement, station, locale, c);
}

function passportView(locale, c) {
  const passport = fieldworkPassportSummary();
  return `
    <article class="fieldwork-passport-book" id="fieldwork-passport-book" data-fieldwork-document>
      <header>
        <div><p>TOUHOU UNIVERSITY · FIELDWORK PASSPORT</p><h3>${escapeHtml(c.passportTitle)}</h3><span>${escapeHtml(c.passportLead)}</span></div>
        <b>旅</b>
      </header>
      <div class="fieldwork-passport-meta">
        <span>${escapeHtml(passport.number || "TU-PASSPORT / NOT YET ISSUED")}</span>
        <dl>
          <div><dt>${passport.distinctStations}</dt><dd>${escapeHtml(c.distinct)}</dd></div>
          <div><dt>${passport.hours}</dt><dd>${escapeHtml(c.hours)}</dd></div>
          <div><dt>${passport.credits}</dt><dd>${escapeHtml(c.credits)}</dd></div>
          <div><dt>${passport.disciplines}</dt><dd>${escapeHtml(c.disciplines)}</dd></div>
          <div><dt>${passport.researchReady}</dt><dd>${escapeHtml(c.researchReady)}</dd></div>
          <div><dt>${passport.contested}</dt><dd>${escapeHtml(c.contestedCount)}</dd></div>
        </dl>
      </div>
      ${passport.stamps.length ? `<div class="fieldwork-stamp-grid">${passport.stamps.slice().reverse().map((stamp) => {
        const station = fieldworkStation(stamp.stationId);
        return `<button type="button" data-fieldwork-placement-open="${escapeHtml(stamp.placementId)}" data-standing="${escapeHtml(stamp.standing)}">
          <i>${escapeHtml(station.glyph)}</i>
          <small>${escapeHtml(station.code)} · ${escapeHtml(formatDate(stamp.issuedAt, locale))}</small>
          <strong>${escapeHtml(t(station.seal, locale))}</strong>
          <span>${stamp.credits} cr · ${stamp.hours}h · ${escapeHtml(stamp.repeated ? c.repeated : c.first)}</span>
        </button>`;
      }).join("")}</div>` : `<p class="fieldwork-empty">${escapeHtml(c.noStamps)}</p>`}
      <footer data-print-exclude><button type="button" class="paper-button" data-fieldwork-print>${escapeHtml(c.printPassport)}</button></footer>
    </article>`;
}

function recordsView(locale, c) {
  const placements = fieldworkPlacements().slice().reverse();
  return `
    <section class="fieldwork-records" id="fieldwork-records">
      <header><div><p>ON-DEVICE FIELD FILES</p><h3>${escapeHtml(c.recordsTitle)}</h3></div><span>${placements.length}</span></header>
      ${placements.length ? `<div class="fieldwork-record-list">${placements.map((placement) => {
        const station = fieldworkStation(placement.stationId);
        return `<article>
          <i>${escapeHtml(station.glyph)}</i>
          <div><small>${escapeHtml(placement.id)} · ${escapeHtml(formatDate(placement.createdAt, locale))}</small><h4>${escapeHtml(t(station.name, locale))}</h4><p>${escapeHtml(placement.draft.purpose)}</p></div>
          <b data-status="${escapeHtml(placement.status)}">${escapeHtml(c[statusKey[placement.status]])}</b>
          <button type="button" data-fieldwork-placement-open="${escapeHtml(placement.id)}">${escapeHtml(c.openRecord)} →</button>
        </article>`;
      }).join("")}</div>` : `<p class="fieldwork-empty">${escapeHtml(c.noRecords)}</p>`}
    </section>`;
}

function render(options = {}) {
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  renderPreservingState(root, () => {
    let body = stationsView(locale, c);
    if (view === "station") body = stationView(locale, c);
    if (view === "dispatch") body = dispatchView(locale, c);
    if (view === "passport") body = passportView(locale, c);
    if (view === "records") body = recordsView(locale, c);
    if (view === "placement") body = placementView(locale, c);
    root.innerHTML = `${hero(locale, c)}${tabs(c)}<div class="fieldwork-workspace">${body}</div>`;
  }, { preserveWindow: options.preserveWindow ?? true });
  bindFilterControls();
}

function showStation(id, navigate = true) {
  const station = fieldworkStation(id);
  if (!station) return;
  selectedStationId = station.id;
  currentDraft = fieldworkDraft(station.id);
  view = "station";
  if (navigate) {
    navigateToDeepLink(`fieldwork-station-${station.id}`);
    return;
  }
  render({ preserveWindow: false });
}

function showPlacement(id, navigate = true) {
  const placement = fieldworkPlacement(id);
  if (!placement) return;
  selectedPlacementId = placement.id;
  selectedStationId = placement.stationId;
  view = "placement";
  if (navigate) {
    navigateToDeepLink(`fieldwork-placement-${placement.id}`);
    return;
  }
  render({ preserveWindow: false });
}

function bindFilterControls() {
  const query = root.querySelector("[data-fieldwork-query]");
  if (query) {
    bindImeSafeInput(query, (event) => {
      filters.query = event.currentTarget.value;
      render();
    });
  }
}

function scheduleDraftSave(form) {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    currentDraft = saveFieldworkDraft(draftFromForm(form));
  }, 180);
}

function recordApplication(placement) {
  recordCampusEvent("fieldwork.application.submitted", {
    placementId: placement.id,
    stationId: placement.stationId,
    outcome: placement.permit.outcome,
    departureDate: placement.draft.departureDate,
  }, {
    id: `fieldwork.application.submitted:${placement.id}`,
    timestamp: placement.createdAt,
  });
}

function recordDeparture(placement) {
  recordCampusEvent("fieldwork.departure.checked", {
    placementId: placement.id,
    stationId: placement.stationId,
    travelMode: placement.draft.travelMode,
  }, {
    id: `fieldwork.departure.checked:${placement.id}`,
    timestamp: placement.startedAt,
  });
}

function recordResponse(placement) {
  recordCampusEvent("fieldwork.complication.handled", {
    placementId: placement.id,
    stationId: placement.stationId,
    complicationId: placement.complicationId,
    responseId: placement.responseId,
    standing: placement.responseOutcome,
  }, {
    id: `fieldwork.complication.handled:${placement.id}`,
    timestamp: placement.respondedAt,
  });
}

function recordReturn(placement) {
  recordCampusEvent("fieldwork.observation.logged", {
    placementId: placement.id,
    stationId: placement.stationId,
    sourceKind: placement.log.sourceKind,
    incidentKind: placement.log.incidentKind,
    researchChoice: placement.log.researchChoice,
  }, {
    id: `fieldwork.observation.logged:${placement.id}`,
    timestamp: placement.log.submittedAt,
  });
  recordCampusEvent("fieldwork.return.certified", {
    placementId: placement.id,
    stationId: placement.stationId,
    stampId: placement.stampId,
    standing: placement.review.standing,
    credits: fieldworkPassportSummary().stamps.find(({ id }) => id === placement.stampId)?.credits || 0,
  }, {
    id: `fieldwork.return.certified:${placement.id}`,
    timestamp: new Date(new Date(placement.completedAt).getTime() + 1).toISOString(),
  });
}

function bindEvents() {
  root.addEventListener("input", (event) => {
    const form = event.target.closest("[data-fieldwork-form]");
    if (form && !event.isComposing) scheduleDraftSave(form);
  });
  root.addEventListener("change", (event) => {
    if (event.target.matches("[data-fieldwork-region]")) {
      filters.region = event.target.value;
      render();
      return;
    }
    if (event.target.matches("[data-fieldwork-discipline]")) {
      filters.discipline = event.target.value;
      render();
      return;
    }
    if (event.target.matches("[data-fieldwork-route-mode]")) {
      currentDraft = saveFieldworkDraft({ ...(currentDraft || fieldworkDraft(selectedStationId)), travelMode: event.target.value });
      render();
      return;
    }
    const form = event.target.closest("[data-fieldwork-form]");
    if (!form) return;
    const next = draftFromForm(form);
    if (next.stationId !== currentDraft?.stationId) next.equipment = [];
    currentDraft = saveFieldworkDraft(next);
    selectedStationId = currentDraft.stationId;
    render();
  });
  root.addEventListener("click", async (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    const viewButton = event.target.closest("[data-fieldwork-view]");
    if (viewButton) {
      const next = viewButton.dataset.fieldworkView;
      view = next;
      selectedPlacementId = null;
      if (next === "stations") navigateToDeepLink("fieldwork-stations");
      if (next === "dispatch") navigateToDeepLink("fieldwork-dispatch");
      if (next === "passport") navigateToDeepLink("fieldwork-passport");
      if (next === "records") navigateToDeepLink("fieldwork-records");
      return;
    }
    const stationButton = event.target.closest("[data-fieldwork-station]");
    if (stationButton) {
      showStation(stationButton.dataset.fieldworkStation);
      return;
    }
    const apply = event.target.closest("[data-fieldwork-apply]");
    if (apply) {
      selectedStationId = apply.dataset.fieldworkApply;
      currentDraft = fieldworkDraft(selectedStationId);
      view = "dispatch";
      navigateToDeepLink("fieldwork-dispatch");
      return;
    }
    const clear = event.target.closest("[data-fieldwork-clear]");
    if (clear) {
      currentDraft = clearFieldworkDraft(selectedStationId);
      render();
      return;
    }
    const openPlacement = event.target.closest("[data-fieldwork-placement-open]");
    if (openPlacement) {
      showPlacement(openPlacement.dataset.fieldworkPlacementOpen);
      return;
    }
    const checkin = event.target.closest("[data-fieldwork-checkin]");
    if (checkin) {
      const result = checkInFieldwork(checkin.dataset.fieldworkCheckin);
      if (result.error) {
        showToast(result.error === "active-placement" ? c.activeError : c.noRecords);
        return;
      }
      recordDeparture(result.placement);
      showToast(c.departed);
      showPlacement(result.placement.id);
      return;
    }
    const response = event.target.closest("[data-fieldwork-response]");
    if (response) {
      const result = respondToFieldworkComplication(response.dataset.placement, response.dataset.fieldworkResponse);
      if (result.error) return;
      recordResponse(result.placement);
      showToast(c.handled);
      showPlacement(result.placement.id);
      return;
    }
    if (event.target.closest("[data-fieldwork-print]")) {
      const documentElement = printableElement("[data-fieldwork-document]");
      if (documentElement) printDocument(documentElement, { title: `${c.passportTitle} · Touhou University` });
      return;
    }
    if (event.target.closest("[data-fieldwork-share]")) {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch {
        const input = document.createElement("input");
        input.value = window.location.href;
        document.body.append(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      showToast(c.copied);
    }
  });
  root.addEventListener("submit", (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    const form = event.target.closest("[data-fieldwork-form]");
    if (form) {
      event.preventDefault();
      window.clearTimeout(saveTimer);
      currentDraft = saveFieldworkDraft(draftFromForm(form));
      const result = submitFieldworkApplication(currentDraft, new Date(), locale);
      if (result.error) {
        const message = result.error === "purpose"
          ? c.purposeError
          : result.error === "ethics"
            ? c.ethicsError
            : result.error === "active-placement"
              ? c.activeError
              : c.noRecords;
        showToast(message);
        return;
      }
      recordApplication(result.placement);
      showToast(c.issued);
      showPlacement(result.placement.id);
      return;
    }
    const returnForm = event.target.closest("[data-fieldwork-return]");
    if (returnForm) {
      event.preventDefault();
      const data = new FormData(returnForm);
      const result = completeFieldworkReturn(returnForm.dataset.fieldworkReturn, {
        observation: data.get("observation"),
        sourceKind: data.get("sourceKind"),
        sourceNote: data.get("sourceNote"),
        evidenceCode: data.get("evidenceCode"),
        incidentKind: data.get("incidentKind"),
        incidentNote: data.get("incidentNote"),
        researchChoice: data.get("researchChoice"),
      });
      if (result.error) {
        showToast(result.error === "observation" ? c.observationError : c.sourceError);
        return;
      }
      recordReturn(result.placement);
      showToast(c.completedToast);
      showPlacement(result.placement.id);
    }
  });
}

function initialView() {
  const route = safeDecodeFragment();
  if (route === "fieldwork-passport") {
    view = "passport";
    return;
  }
  if (route === "fieldwork-dispatch") {
    view = "dispatch";
    return;
  }
  if (route === "fieldwork-records") {
    view = "records";
    return;
  }
  if (route.startsWith("fieldwork-station-")) {
    const station = fieldworkStation(route.slice("fieldwork-station-".length));
    if (station) {
      selectedStationId = station.id;
      view = "station";
    }
    return;
  }
  if (route.startsWith("fieldwork-placement-")) {
    const placement = fieldworkPlacement(route.slice("fieldwork-placement-".length));
    if (placement) {
      selectedPlacementId = placement.id;
      selectedStationId = placement.stationId;
      view = "placement";
    }
  }
}

export function initFieldwork() {
  root = document.querySelector("[data-fieldwork-app]");
  if (!root) return;
  initialView();
  currentDraft = fieldworkDraft(selectedStationId);
  render({ preserveWindow: false });
  bindEvents();

  registerDeepLink("fieldwork-stations", {
    anchor: "#fieldwork-stations",
    position: "always",
    open() {
      view = "stations";
      selectedPlacementId = null;
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("fieldwork-passport", {
    anchor: () => document.getElementById("fieldwork-passport-book") || root,
    position: "always",
    open() {
      view = "passport";
      selectedPlacementId = null;
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("fieldwork-dispatch", {
    anchor: "#fieldwork-dispatch",
    position: "always",
    open() {
      view = "dispatch";
      currentDraft = fieldworkDraft(selectedStationId);
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("fieldwork-records", {
    anchor: "#fieldwork-records",
    position: "always",
    open() {
      view = "records";
      selectedPlacementId = null;
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("fieldwork-station-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "fieldwork-focus",
    position: "always",
    open(id) {
      showStation(id, false);
    },
  });
  registerDeepLink("fieldwork-placement-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "fieldwork-focus",
    position: "always",
    open(id) {
      showPlacement(id, false);
    },
  });

  window.addEventListener("tu:languagechange", () => render({ preserveWindow: false }));
  window.addEventListener("tu:recordschange", () => render());
}
