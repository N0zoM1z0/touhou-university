import { evidenceKinds, incidentById, incidentCases, incidentSeverity } from "../data/incidents.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { getLocale } from "./i18n.js";
import {
  incidentCaseState,
  incidentCommunityPosts,
  incidentExperiments,
  incidentResolutions,
  resolutionForCase,
  resolveIncident,
  runIncidentExperiment,
  selectIncidentHypothesis,
  toggleIncidentAction,
  toggleIncidentEvidence,
  toggleIncidentTestimony,
} from "./incident-model.js";
import { renderPreservingState } from "./render-state.js";
import { siteHref } from "./site-router.js";
import { showToast } from "./ui.js";

const LAST_CASE_KEY = "tu:incidents:last-case";

const copy = {
  "zh-Hant": {
    eyebrow: "INCIDENT RESPONSE / 校園事件聯絡室",
    title: "先別急著宣布異變。",
    lead: "收證詞、拆開版本差異、選一項可撤回的處置，再讓研究設計決定我們究竟知道了什麼。結案後，校務快訊會寫得很克制；BBS 通常不會。",
    live: "處理中",
    resolved: "已結案",
    experiments: "次模擬",
    cases: "事件案卷",
    simulator: "研究模擬器",
    records: "結案與連動",
    dispatch: "當值通報",
    affected: "影響範圍",
    measure: "主要觀測量",
    dossier: "現場案卷",
    evidence: "證物與記錄",
    evidenceLead: "點一下標記已審閱；可靠度不等於結論正確，它只說明這份材料本身有多穩。",
    testimony: "證詞與麻煩",
    testimonyLead: "證人可能同時是設備維護者、新聞來源或事件的一部分。這不是淘汰證詞的理由，而是需要留下的位置。",
    reviewed: "已審閱",
    markReviewed: "標記審閱",
    source: "來源",
    reliability: "材料可靠度",
    tension: "需保留的矛盾",
    hypothesis: "工作假說",
    hypothesisLead: "先選一個可被推翻的解釋。模擬器會保留你猜錯的結果。",
    response: "可逆處置",
    responseLead: "最多先做兩項；如果研究推翻假說，處置可以撤回，不必把臨時規則寫成傳統。",
    reversible: "可撤回",
    caution: "現場反作用",
    selected: "已選",
    actionLimit: "先行處置最多兩項；先撤下一項再加新的。",
    openLab: "帶著這個假說進入模擬器",
    chooseHypothesis: "先選一個工作假說",
    readiness: "案卷準備度",
    reviewedEvidence: "份證物",
    reviewedWitnesses: "份證詞",
    labEyebrow: "METHODS LAB / 可識別性不是裝飾",
    labTitle: "把漂亮的結論逼到會失敗。",
    labLead: "樣本數能縮窄隨機誤差，卻不能自動修好混雜、漂移、缺失或昨天被換掉的河童韌體。處置本身也會改變現場，故一併納入模型。",
    activeCase: "目前案卷",
    testedHypothesis: "受測假說",
    sample: "觀測單位",
    sampleHelp: "更大的樣本降低隨機波動，不會清除系統性錯誤。",
    repeats: "重複輪次",
    control: "設置同時段對照組",
    randomize: "隨機分派觀測順序",
    calibration: "每輪重新校準儀器",
    versionLock: "鎖定設備與資料版本",
    run: "執行一輪模擬",
    result: "最新實驗回條",
    noResult: "這宗事件尚無模擬。選擇假說與設計後執行；失敗結果也會保存在本機。",
    identifiability: "設計分辨度",
    observed: "觀測差",
    interval: "不確定範圍",
    residuals: "仍未消除的干擾",
    confounding: "混雜",
    drift: "漂移",
    missing: "缺失",
    version: "版本變動",
    hazards: "尚在場的麻煩",
    noHazards: "主要結構性干擾已被壓低；仍不代表幻想鄉突然變得守規矩。",
    verdicts: {
      supports: "設計支持這個假說",
      rejects: "設計傾向推翻這個假說",
      inconclusive: "目前無法區分假說與干擾",
      "false-confidence": "數字很響亮，但設計正在製造假確信",
    },
    resolve: "以這份實驗結案並發布連動",
    resolvedAlready: "這宗事件已結案；BBS 還沒有。",
    notReady: "結案需要分辨度至少 60、結果支持受測假說，並選擇至少一項可逆處置。若結果推翻假說，請回案卷換一個解釋。",
    experimentSaved: "模擬回條已保存在這台裝置，並寫入 My TU 事件帳本。",
    resolutionSaved: "事件已結案；校務快訊與三篇 BBS 討論已出現。",
    archiveEyebrow: "CASE ARCHIVE / 結案不等於沒人反對",
    archiveTitle: "結論進入校務系統之後。",
    archiveLead: "結案檔案、模擬回條與由事件觸發的 BBS 討論都保存在這台裝置。官方紀錄只有一份；不服氣的標題通常有三份。",
    resolutionsTitle: "結案檔案",
    experimentHistory: "模擬回條",
    noResolutions: "尚無事件結案。從案卷選一個假說，到模擬器做出足以分辨的設計。",
    noExperiments: "尚無模擬回條。",
    finding: "暫定發現",
    responseUsed: "先行處置",
    published: "已發布",
    openBbs: "查看事件連動 BBS",
    reopenCase: "回看案卷",
    quality: "分辨度",
    design: "設計",
    samplesShort: "單位",
    roundsShort: "輪",
    bbsThreads: "篇連動討論",
    localOnly: "本機保存",
    resolvedOn: "結案時間",
  },
  ja: {
    eyebrow: "INCIDENT RESPONSE / 学内事案連絡室",
    title: "異変と発表するのは、まだ早い。",
    lead: "証言を集め、版の差を開き、撤回可能な措置を選び、研究設計に「何が分かったか」を決めさせます。終結後の大学速報は控えめですが、BBS は大抵そうではありません。",
    live: "対応中",
    resolved: "終結",
    experiments: "回の模擬",
    cases: "事案記録",
    simulator: "研究シミュレーター",
    records: "終結・連動",
    dispatch: "当番通報",
    affected: "影響範囲",
    measure: "主要観測量",
    dossier: "現場記録",
    evidence: "物証・記録",
    evidenceLead: "押すと確認済みになります。信頼度は結論の正しさではなく、資料そのものの安定性を示します。",
    testimony: "証言と厄介事",
    testimonyLead: "証人は保守担当、情報源、または事案の一部かもしれません。排除理由ではなく、位置を記録する理由です。",
    reviewed: "確認済み",
    markReviewed: "確認する",
    source: "出所",
    reliability: "資料信頼度",
    tension: "残すべき矛盾",
    hypothesis: "作業仮説",
    hypothesisLead: "反証可能な説明を一つ選びます。シミュレーターは外れた推測も保存します。",
    response: "可逆的措置",
    responseLead: "先行は二件まで。仮説が覆ったら撤回でき、臨時規則を伝統にする必要はありません。",
    reversible: "撤回可",
    caution: "現場の反作用",
    selected: "選択済み",
    actionLimit: "先行措置は二件まで。どれかを外してから追加してください。",
    openLab: "この仮説をシミュレーターへ",
    chooseHypothesis: "作業仮説を選択",
    readiness: "記録準備度",
    reviewedEvidence: "件の物証",
    reviewedWitnesses: "件の証言",
    labEyebrow: "METHODS LAB / 識別可能性は飾りではない",
    labTitle: "きれいな結論を、失敗できる形へ。",
    labLead: "標本数は偶然誤差を縮めますが、交絡、ドリフト、欠測、昨日交換された河童ファームウェアは直しません。措置が現場を変える効果もモデルへ入れます。",
    activeCase: "現在の事案",
    testedHypothesis: "検証仮説",
    sample: "観測単位",
    sampleHelp: "大標本は偶然変動を減らしますが、系統誤差は消しません。",
    repeats: "反復回数",
    control: "同時刻の対照群を置く",
    randomize: "観測順序を無作為化",
    calibration: "各回で機器を再校正",
    versionLock: "機器・データ版を固定",
    run: "シミュレーション実行",
    result: "最新実験票",
    noResult: "この事案の模擬はまだありません。仮説と設計を選んで実行してください。失敗も端末に保存されます。",
    identifiability: "設計識別度",
    observed: "観測差",
    interval: "不確実範囲",
    residuals: "残存する干渉",
    confounding: "交絡",
    drift: "ドリフト",
    missing: "欠測",
    version: "版変動",
    hazards: "現場に残る問題",
    noHazards: "主要な構造的干渉は低下。ただし幻想郷が急に規則的になったわけではありません。",
    verdicts: {
      supports: "設計はこの仮説を支持",
      rejects: "設計はこの仮説を棄却する傾向",
      inconclusive: "仮説と干渉をまだ区別不能",
      "false-confidence": "数字は大きいが、設計が偽の確信を作っている",
    },
    resolve: "この実験で終結し、連動を公開",
    resolvedAlready: "この事案は終結済み。BBS はまだです。",
    notReady: "終結には識別度 60 以上、仮説を支持する結果、可逆的措置一件以上が必要です。仮説が棄却された場合は記録へ戻り、別の説明を選んでください。",
    experimentSaved: "実験票をこの端末へ保存し、My TU 事案台帳にも記録しました。",
    resolutionSaved: "事案を終結。大学速報と BBS 三件が現れました。",
    archiveEyebrow: "CASE ARCHIVE / 終結しても反対は終わらない",
    archiveTitle: "結論が学務系へ入った後。",
    archiveLead: "終結記録、実験票、事案連動 BBS はこの端末に保存。公式記録は一件、不満な見出しは通常三件です。",
    resolutionsTitle: "終結記録",
    experimentHistory: "実験票",
    noResolutions: "終結済み事案はありません。記録から仮説を選び、識別可能な設計を作ってください。",
    noExperiments: "実験票はまだありません。",
    finding: "暫定所見",
    responseUsed: "先行措置",
    published: "公開済み",
    openBbs: "事案連動 BBS を見る",
    reopenCase: "事案記録へ",
    quality: "識別度",
    design: "設計",
    samplesShort: "単位",
    roundsShort: "回",
    bbsThreads: "件の連動投稿",
    localOnly: "端末保存",
    resolvedOn: "終結日時",
  },
  en: {
    eyebrow: "INCIDENT RESPONSE / CAMPUS INCIDENT DESK",
    title: "Do not declare an incident just yet.",
    lead: "Collect testimony, open the version history, choose a reversible response, then let the research design decide what is actually known. The campus wire will be restrained after closure; the BBS usually will not.",
    live: "Active",
    resolved: "Closed",
    experiments: "simulations",
    cases: "Case files",
    simulator: "Research simulator",
    records: "Closures & reactions",
    dispatch: "Duty dispatch",
    affected: "Scope affected",
    measure: "Primary measure",
    dossier: "Field dossier",
    evidence: "Evidence & records",
    evidenceLead: "Select an item to mark it reviewed. Reliability describes the material itself, not whether its conclusion is true.",
    testimony: "Testimony & trouble",
    testimonyLead: "A witness may also maintain the equipment, control the first headline, or be part of the incident. That is a position to record, not a reason to erase them.",
    reviewed: "Reviewed",
    markReviewed: "Mark reviewed",
    source: "Source",
    reliability: "Material reliability",
    tension: "Tension to retain",
    hypothesis: "Working hypothesis",
    hypothesisLead: "Choose one explanation that can be disproved. The simulator keeps wrong guesses.",
    response: "Reversible response",
    responseLead: "Choose up to two first moves. If the study overturns the hypothesis, they can be withdrawn instead of becoming tradition.",
    reversible: "Reversible",
    caution: "Field reaction",
    selected: "Selected",
    actionLimit: "Two first responses at most. Remove one before adding another.",
    openLab: "Take this hypothesis into the simulator",
    chooseHypothesis: "Choose a working hypothesis",
    readiness: "Dossier readiness",
    reviewedEvidence: "evidence items",
    reviewedWitnesses: "testimonies",
    labEyebrow: "METHODS LAB / IDENTIFIABILITY IS NOT DECORATION",
    labTitle: "Make the elegant conclusion capable of failing.",
    labLead: "A larger sample narrows chance error. It does not repair confounding, drift, missing records, or kappa firmware replaced yesterday. Responses also change the field, so they enter the model too.",
    activeCase: "Active case",
    testedHypothesis: "Hypothesis tested",
    sample: "Observation units",
    sampleHelp: "A larger sample reduces random variation, not systematic error.",
    repeats: "Replicate rounds",
    control: "Add a same-time control group",
    randomize: "Randomise observation order",
    calibration: "Recalibrate every round",
    versionLock: "Lock equipment and data versions",
    run: "Run simulation",
    result: "Latest experiment slip",
    noResult: "No simulation exists for this case. Choose a hypothesis and design, then run it; failures are saved too.",
    identifiability: "Design identifiability",
    observed: "Observed difference",
    interval: "Uncertainty range",
    residuals: "Interference still present",
    confounding: "Confounding",
    drift: "Drift",
    missing: "Missingness",
    version: "Version change",
    hazards: "Trouble still in the field",
    noHazards: "Major structural interference is low. This does not mean Gensokyo has suddenly become orderly.",
    verdicts: {
      supports: "The design supports this hypothesis",
      rejects: "The design tends to reject this hypothesis",
      inconclusive: "The design cannot yet separate hypothesis from interference",
      "false-confidence": "The number is loud, but the design is manufacturing confidence",
    },
    resolve: "Close with this experiment and publish reactions",
    resolvedAlready: "This case is closed. The BBS is not.",
    notReady: "Closure needs identifiability of at least 60, a result supporting the tested hypothesis, and one reversible response. If the hypothesis was rejected, return to the dossier and choose another explanation.",
    experimentSaved: "The experiment slip is saved on this device and recorded in the My TU ledger.",
    resolutionSaved: "Case closed. A campus-wire item and three BBS threads have appeared.",
    archiveEyebrow: "CASE ARCHIVE / CLOSURE DOES NOT END OBJECTIONS",
    archiveTitle: "After a finding enters the campus system.",
    archiveLead: "Closures, experiment slips, and incident-triggered BBS threads stay on this device. There is one official record and usually three dissatisfied headlines.",
    resolutionsTitle: "Closure records",
    experimentHistory: "Experiment slips",
    noResolutions: "No cases have closed. Choose a hypothesis from a case and build a design that can distinguish it.",
    noExperiments: "No experiment slips yet.",
    finding: "Provisional finding",
    responseUsed: "First response",
    published: "Published",
    openBbs: "Open linked BBS",
    reopenCase: "Reopen case file",
    quality: "Identifiability",
    design: "Design",
    samplesShort: "units",
    roundsShort: "rounds",
    bbsThreads: "linked threads",
    localOnly: "On-device",
    resolvedOn: "Closed",
  },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function localized(value, locale) {
  return value?.[locale] ?? value?.["zh-Hant"] ?? value ?? "";
}

function formatDate(value, locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function currentRoute() {
  return decodeURIComponent(window.location.hash.slice(1));
}

function viewForRoute(route) {
  if (route === "incident-simulator") return "simulator";
  if (route === "incident-records" || route.startsWith("incident-experiment-")) return "records";
  return "cases";
}

function caseFromRoute(route) {
  if (!route.startsWith("incident-case-")) return null;
  const id = route.slice("incident-case-".length);
  return incidentById(id) ? id : null;
}

function severityLabel(incident, locale) {
  return localized(incidentSeverity[incident.severity], locale);
}

function pageHero(locale, c, activeView) {
  const resolutions = incidentResolutions();
  const resolvedIds = new Set(resolutions.map((record) => record.caseId));
  const active = incidentCases.length - resolvedIds.size;
  return `
    <div class="incident-hero">
      <div class="incident-hero-mark" aria-hidden="true">
        <span>異</span><i></i><i></i><i></i><i></i>
        <b>CASE<br>DESK</b>
      </div>
      <div class="incident-hero-copy">
        <p>${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
        <dl>
          <div><dt>${c.live}</dt><dd>${active}</dd></div>
          <div><dt>${c.resolved}</dt><dd>${resolvedIds.size}</dd></div>
          <div><dt>${c.experiments}</dt><dd>${incidentExperiments().length}</dd></div>
        </dl>
      </div>
    </div>
    <nav class="incident-tabs" aria-label="${escapeHtml(c.eyebrow)}">
      <a href="#incident-center" ${activeView === "cases" ? 'aria-current="page"' : ""}><span>01</span>${c.cases}</a>
      <a href="#incident-simulator" ${activeView === "simulator" ? 'aria-current="page"' : ""}><span>02</span>${c.simulator}</a>
      <a href="#incident-records" ${activeView === "records" ? 'aria-current="page"' : ""}><span>03</span>${c.records}</a>
    </nav>`;
}

function caseList(locale, c, selectedId) {
  return `
    <aside class="incident-case-list" data-preserve-scroll="incident-cases">
      <header><span>OPEN CASE INDEX</span><b>${String(incidentCases.length).padStart(2, "0")}</b></header>
      ${incidentCases.map((incident) => {
        const state = incidentCaseState(incident.id);
        const resolved = resolutionForCase(incident.id);
        const reviewed = state.reviewedEvidence.length + state.reviewedTestimony.length;
        return `
          <button type="button" data-incident-case="${incident.id}" class="${incident.id === selectedId ? "active" : ""}" aria-pressed="${incident.id === selectedId}">
            <i data-severity="${incident.severity}">${escapeHtml(incident.mark)}</i>
            <span><small>${escapeHtml(incident.code)} · ${resolved ? c.resolved : severityLabel(incident, locale)}</small><strong>${escapeHtml(localized(incident.title, locale))}</strong><em>${reviewed}/7 ${c.reviewed}</em></span>
            <b aria-hidden="true">→</b>
          </button>`;
      }).join("")}
    </aside>`;
}

function evidenceCards(incident, state, locale, c) {
  return incident.evidence.map((item) => {
    const reviewed = state.reviewedEvidence.includes(item.id);
    return `
      <article class="incident-evidence-card ${reviewed ? "reviewed" : ""}">
        <header>
          <span>${escapeHtml(localized(evidenceKinds[item.kind], locale))}</span>
          <b>${item.reliability}%</b>
        </header>
        <h5>${escapeHtml(localized(item.title, locale))}</h5>
        <p>${escapeHtml(localized(item.body, locale))}</p>
        <footer>
          <small>${c.source} · ${escapeHtml(localized(item.source, locale))}</small>
          <button type="button" data-incident-evidence="${item.id}" aria-pressed="${reviewed}">
            ${reviewed ? `✓ ${c.reviewed}` : c.markReviewed}
          </button>
        </footer>
      </article>`;
  }).join("");
}

function testimonyCards(incident, state, locale, c) {
  return incident.testimony.map((item) => {
    const reviewed = state.reviewedTestimony.includes(item.id);
    return `
      <article class="incident-testimony-card ${reviewed ? "reviewed" : ""}">
        <header><div><strong>${escapeHtml(localized(item.speaker, locale))}</strong><span>${escapeHtml(localized(item.role, locale))}</span></div><button type="button" data-incident-testimony="${item.id}" aria-pressed="${reviewed}">${reviewed ? "✓" : "+"}</button></header>
        <blockquote>「${escapeHtml(localized(item.statement, locale))}」</blockquote>
        <p><b>${c.tension}</b>${escapeHtml(localized(item.tension, locale))}</p>
      </article>`;
  }).join("");
}

function hypothesisCards(incident, state, locale, c) {
  return incident.hypotheses.map((item, index) => {
    const selected = state.selectedHypothesis === item.id;
    return `
      <button type="button" class="${selected ? "selected" : ""}" data-incident-hypothesis="${item.id}" aria-pressed="${selected}">
        <span>H${index + 1}</span>
        <div><strong>${escapeHtml(localized(item.title, locale))}</strong><p>${escapeHtml(localized(item.rationale, locale))}</p></div>
        <i>${selected ? "●" : "○"}</i>
      </button>`;
  }).join("");
}

function actionCards(incident, state, locale, c) {
  return incident.actions.map((item, index) => {
    const selected = state.selectedActions.includes(item.id);
    return `
      <button type="button" class="${selected ? "selected" : ""}" data-incident-action="${item.id}" aria-pressed="${selected}">
        <span>A${index + 1}</span>
        <div>
          <header><strong>${escapeHtml(localized(item.title, locale))}</strong><em>${c.reversible}</em></header>
          <p>${escapeHtml(localized(item.body, locale))}</p>
          <small><b>${c.caution}</b>${escapeHtml(localized(item.caution, locale))}</small>
        </div>
        <i>${selected ? "✓" : "+"}</i>
      </button>`;
  }).join("");
}

function renderCases(locale, c, selectedId) {
  const incident = incidentById(selectedId) || incidentCases[0];
  const state = incidentCaseState(incident.id);
  const resolved = resolutionForCase(incident.id);
  return `
    <div class="incident-workspace" id="incident-case-${incident.id}">
      ${caseList(locale, c, incident.id)}
      <article class="incident-case-file">
        <header class="incident-file-heading">
          <div>
            <p><span data-severity="${incident.severity}"></span>${escapeHtml(incident.code)} · ${escapeHtml(severityLabel(incident, locale))}</p>
            <h3>${escapeHtml(localized(incident.title, locale))}</h3>
            <span>${escapeHtml(localized(incident.lede, locale))}</span>
          </div>
          <b>${escapeHtml(incident.mark)}</b>
        </header>
        <div class="incident-dispatch">
          <strong>${c.dispatch}</strong>
          <p>${escapeHtml(localized(incident.dispatch, locale))}</p>
          <dl>
            <div><dt>${c.affected}</dt><dd>${escapeHtml(localized(incident.affected, locale))}</dd></div>
            <div><dt>${c.measure}</dt><dd>${escapeHtml(localized(incident.signal, locale))} · ${escapeHtml(localized(incident.unit, locale))}</dd></div>
          </dl>
        </div>
        <section class="incident-dossier">
          <header><div><p>01 / MATERIALS</p><h4>${c.evidence}</h4></div><span>${c.evidenceLead}</span></header>
          <div class="incident-evidence-grid">${evidenceCards(incident, state, locale, c)}</div>
        </section>
        <section class="incident-dossier">
          <header><div><p>02 / TESTIMONY</p><h4>${c.testimony}</h4></div><span>${c.testimonyLead}</span></header>
          <div class="incident-testimony-grid">${testimonyCards(incident, state, locale, c)}</div>
        </section>
        <section class="incident-decision">
          <header><div><p>03 / FALSIFIABLE CLAIM</p><h4>${c.hypothesis}</h4></div><span>${c.hypothesisLead}</span></header>
          <div class="incident-hypotheses">${hypothesisCards(incident, state, locale, c)}</div>
        </section>
        <section class="incident-decision">
          <header><div><p>04 / FIRST RESPONSE</p><h4>${c.response}</h4></div><span>${c.responseLead}</span></header>
          <div class="incident-actions">${actionCards(incident, state, locale, c)}</div>
        </section>
        <footer class="incident-case-footer">
          <div>
            <span>${c.readiness}</span>
            <strong>${state.reviewedEvidence.length}/4 ${c.reviewedEvidence} · ${state.reviewedTestimony.length}/3 ${c.reviewedWitnesses}</strong>
          </div>
          ${resolved
            ? `<a class="button button-primary" href="#incident-records">${c.resolvedAlready} <span aria-hidden="true">→</span></a>`
            : `<button class="button button-primary" type="button" data-incident-open-lab ${state.selectedHypothesis ? "" : "disabled"}>${state.selectedHypothesis ? c.openLab : c.chooseHypothesis} <span aria-hidden="true">→</span></button>`}
        </footer>
      </article>
    </div>`;
}

function designCheckbox(name, label, checked = false) {
  return `<label><input type="checkbox" name="${name}" ${checked ? "checked" : ""}><span><i aria-hidden="true">✓</i>${label}</span></label>`;
}

function resultCard(experiment, incident, locale, c) {
  if (!experiment) return `<section class="incident-empty-result"><span>∅</span><p>${c.noResult}</p></section>`;
  const hypothesis = incident.hypotheses.find((item) => item.id === experiment.hypothesisId);
  const lower = Math.round((experiment.observed - experiment.interval) * 10) / 10;
  const upper = Math.round((experiment.observed + experiment.interval) * 10) / 10;
  const hazardNames = experiment.hazards.map((id) => c[id]);
  return `
    <section class="incident-result" data-verdict="${experiment.verdict}">
      <header><div><p>${experiment.id}</p><h4>${c.verdicts[experiment.verdict]}</h4></div><b>${experiment.quality}<small>/100</small></b></header>
      <p>${escapeHtml(localized(hypothesis.title, locale))}</p>
      <div class="incident-quality-track"><i style="width:${experiment.quality}%"></i><span style="left:${experiment.quality}%"></span></div>
      <dl>
        <div><dt>${c.observed}</dt><dd>${experiment.observed > 0 ? "+" : ""}${experiment.observed} ${escapeHtml(localized(incident.unit, locale))}</dd></div>
        <div><dt>${c.interval}</dt><dd>${lower}—${upper}</dd></div>
        <div><dt>${c.identifiability}</dt><dd>${experiment.quality}/100</dd></div>
      </dl>
      <div class="incident-residuals">
        <h5>${c.residuals}</h5>
        ${Object.entries(experiment.residuals).map(([id, value]) => `<div><span>${c[id]}</span><i><b style="width:${Math.min(100, value * 4)}%"></b></i><strong>${value}</strong></div>`).join("")}
      </div>
      <aside><b>${c.hazards}</b><p>${hazardNames.length ? hazardNames.join(" · ") : c.noHazards}</p></aside>
    </section>`;
}

function renderSimulator(locale, c, selectedId) {
  const incident = incidentById(selectedId) || incidentCases[0];
  const state = incidentCaseState(incident.id);
  const selectedHypothesis = incident.hypotheses.find((item) => item.id === state.selectedHypothesis);
  const experiments = incidentExperiments().filter((record) => record.caseId === incident.id);
  const latest = experiments.at(-1) || null;
  const resolved = resolutionForCase(incident.id);
  return `
    <div class="incident-lab" id="incident-simulator">
      <header class="incident-lab-heading"><div><p>${c.labEyebrow}</p><h3>${c.labTitle}</h3></div><span>${c.labLead}</span></header>
      <div class="incident-lab-layout">
        <form class="incident-design" data-incident-design>
          <label class="incident-design-case">${c.activeCase}
            <select name="caseId">
              ${incidentCases.map((item) => `<option value="${item.id}" ${item.id === incident.id ? "selected" : ""}>${escapeHtml(item.code)} · ${escapeHtml(localized(item.title, locale))}</option>`).join("")}
            </select>
          </label>
          <fieldset>
            <legend>${c.testedHypothesis}</legend>
            ${incident.hypotheses.map((item) => `<label class="incident-hypothesis-radio"><input type="radio" name="hypothesisId" value="${item.id}" ${item.id === (selectedHypothesis?.id || incident.hypotheses[0].id) ? "checked" : ""}><span><b>${escapeHtml(localized(item.title, locale))}</b><small>${escapeHtml(localized(item.rationale, locale))}</small></span></label>`).join("")}
          </fieldset>
          <div class="incident-design-numbers">
            <label>${c.sample}
              <select name="sampleSize"><option value="12">12</option><option value="24" selected>24</option><option value="48">48</option><option value="96">96</option></select>
              <small>${c.sampleHelp}</small>
            </label>
            <label>${c.repeats}
              <select name="repeats"><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
            </label>
          </div>
          <div class="incident-controls">
            ${designCheckbox("control", c.control)}
            ${designCheckbox("randomize", c.randomize)}
            ${designCheckbox("calibration", c.calibration)}
            ${designCheckbox("versionLock", c.versionLock)}
          </div>
          <button class="button button-primary" type="submit">${c.run} <span aria-hidden="true">↗</span></button>
          <small>${c.localOnly} · ${experiments.length} ${c.experiments}</small>
        </form>
        <div class="incident-result-column">
          <header><span>${c.result}</span><b>${latest ? formatDate(latest.createdAt, locale) : "—"}</b></header>
          ${resultCard(latest, incident, locale, c)}
          ${latest && !resolved
            ? `<button class="button button-primary incident-resolve" type="button" data-incident-resolve="${latest.id}" ${latest.quality >= 60 && latest.verdict === "supports" && state.selectedActions.length ? "" : "disabled"}>${c.resolve} <span aria-hidden="true">→</span></button><p class="incident-resolve-note">${c.notReady}</p>`
            : resolved
              ? `<a class="button button-primary incident-resolve" href="#incident-records">${c.resolvedAlready} <span aria-hidden="true">→</span></a>`
              : ""}
        </div>
      </div>
    </div>`;
}

function renderRecords(locale, c) {
  const resolutions = incidentResolutions().slice().reverse();
  const experiments = incidentExperiments().slice().reverse();
  return `
    <div class="incident-archive" id="incident-records">
      <header class="incident-archive-heading"><div><p>${c.archiveEyebrow}</p><h3>${c.archiveTitle}</h3></div><span>${c.archiveLead}</span></header>
      <section class="incident-resolution-section">
        <header><h4>${c.resolutionsTitle}</h4><b>${String(resolutions.length).padStart(2, "0")}</b></header>
        <div class="incident-resolution-grid">
          ${resolutions.length ? resolutions.map((record) => {
            const incident = incidentById(record.caseId);
            const hypothesis = incident.hypotheses.find((item) => item.id === record.hypothesisId);
            const actions = record.actionIds.map((id) => incident.actions.find((item) => item.id === id)).filter(Boolean);
            const firstPost = incidentCommunityPosts(locale).find((post) => post.resolutionId === record.id);
            return `
              <article>
                <header><div><span>${escapeHtml(incident.code)}</span><strong>${escapeHtml(record.id)}</strong></div><i>${c.published}</i></header>
                <h5>${escapeHtml(localized(incident.title, locale))}</h5>
                <dl>
                  <div><dt>${c.finding}</dt><dd>${escapeHtml(localized(hypothesis.title, locale))}</dd></div>
                  <div><dt>${c.responseUsed}</dt><dd>${actions.map((item) => escapeHtml(localized(item.title, locale))).join(" · ")}</dd></div>
                  <div><dt>${c.quality}</dt><dd>${record.quality}/100</dd></div>
                  <div><dt>${c.resolvedOn}</dt><dd>${formatDate(record.resolvedAt, locale)}</dd></div>
                </dl>
                <footer>
                  <a href="#incident-case-${incident.id}">${c.reopenCase}</a>
                  ${firstPost ? `<a href="${siteHref(`bbs-${firstPost.id}`)}">${c.openBbs} · 3 ${c.bbsThreads} <span aria-hidden="true">↗</span></a>` : ""}
                </footer>
              </article>`;
          }).join("") : `<p class="incident-archive-empty">${c.noResolutions}</p>`}
        </div>
      </section>
      <section class="incident-experiment-log">
        <header><h4>${c.experimentHistory}</h4><b>${String(experiments.length).padStart(2, "0")}</b></header>
        ${experiments.length ? `
          <div class="incident-log-table" data-preserve-scroll="incident-experiments">
            <table>
              <thead><tr><th>ID</th><th>${c.activeCase}</th><th>${c.design}</th><th>${c.quality}</th><th>${c.result}</th><th>${c.localOnly}</th></tr></thead>
              <tbody>${experiments.map((record) => {
                const incident = incidentById(record.caseId);
                return `<tr><td><code>${escapeHtml(record.id)}</code></td><td><a href="#incident-case-${record.caseId}">${escapeHtml(incident.code)}</a></td><td>${record.design.sampleSize} ${c.samplesShort} · ${record.design.repeats} ${c.roundsShort}</td><td><b>${record.quality}/100</b></td><td>${c.verdicts[record.verdict]}</td><td>${formatDate(record.createdAt, locale)}</td></tr>`;
              }).join("")}</tbody>
            </table>
          </div>` : `<p class="incident-archive-empty">${c.noExperiments}</p>`}
      </section>
    </div>`;
}

export function initIncidents() {
  const root = document.querySelector("[data-incident-app]");
  if (!root) return;
  const routeCase = caseFromRoute(currentRoute());
  let selectedCaseId = routeCase
    || (incidentById(window.localStorage.getItem(LAST_CASE_KEY)) ? window.localStorage.getItem(LAST_CASE_KEY) : incidentCases[0].id);

  function render({ preserveWindow = true } = {}) {
    const locale = getLocale();
    const c = copy[locale];
    const route = currentRoute();
    const routeSelected = caseFromRoute(route);
    if (routeSelected) selectedCaseId = routeSelected;
    const view = viewForRoute(route);
    renderPreservingState(root, () => {
      root.innerHTML = `
        ${pageHero(locale, c, view)}
        ${view === "simulator"
          ? renderSimulator(locale, c, selectedCaseId)
          : view === "records"
            ? renderRecords(locale, c)
            : renderCases(locale, c, selectedCaseId)}`;
    }, { preserveWindow });
  }

  root.addEventListener("click", (event) => {
    const caseButton = event.target.closest("[data-incident-case]");
    if (caseButton) {
      selectedCaseId = caseButton.dataset.incidentCase;
      window.localStorage.setItem(LAST_CASE_KEY, selectedCaseId);
      window.location.hash = `incident-case-${selectedCaseId}`;
      return;
    }
    const evidenceButton = event.target.closest("[data-incident-evidence]");
    if (evidenceButton) {
      toggleIncidentEvidence(selectedCaseId, evidenceButton.dataset.incidentEvidence);
      render();
      return;
    }
    const testimonyButton = event.target.closest("[data-incident-testimony]");
    if (testimonyButton) {
      toggleIncidentTestimony(selectedCaseId, testimonyButton.dataset.incidentTestimony);
      render();
      return;
    }
    const hypothesisButton = event.target.closest("[data-incident-hypothesis]");
    if (hypothesisButton) {
      selectIncidentHypothesis(selectedCaseId, hypothesisButton.dataset.incidentHypothesis);
      render();
      return;
    }
    const actionButton = event.target.closest("[data-incident-action]");
    if (actionButton) {
      const state = toggleIncidentAction(selectedCaseId, actionButton.dataset.incidentAction);
      if (state?.limitReached) showToast(copy[getLocale()].actionLimit);
      else render();
      return;
    }
    if (event.target.closest("[data-incident-open-lab]")) {
      window.location.hash = "incident-simulator";
      return;
    }
    const resolveButton = event.target.closest("[data-incident-resolve]");
    if (resolveButton) {
      const outcome = resolveIncident(selectedCaseId, resolveButton.dataset.incidentResolve);
      if (outcome.error) {
        showToast(copy[getLocale()].notReady);
        return;
      }
      if (!outcome.alreadyResolved) {
        recordCampusEvent(
          "incident.resolved",
          { caseId: selectedCaseId, resolutionId: outcome.record.id, quality: outcome.record.quality },
          { id: `incident.resolved:${outcome.record.id}`, timestamp: outcome.record.resolvedAt },
        );
      }
      showToast(copy[getLocale()].resolutionSaved);
      window.location.hash = "incident-records";
    }
  });

  root.addEventListener("change", (event) => {
    const caseSelect = event.target.closest('[data-incident-design] select[name="caseId"]');
    if (!caseSelect) return;
    selectedCaseId = caseSelect.value;
    window.localStorage.setItem(LAST_CASE_KEY, selectedCaseId);
    render();
  });

  root.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-incident-design]");
    if (!form) return;
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    const design = {
      sampleSize: Number(values.sampleSize),
      repeats: Number(values.repeats),
      control: values.control === "on",
      randomize: values.randomize === "on",
      calibration: values.calibration === "on",
      versionLock: values.versionLock === "on",
    };
    selectIncidentHypothesis(selectedCaseId, values.hypothesisId);
    const experiment = runIncidentExperiment(selectedCaseId, values.hypothesisId, design);
    if (!experiment) return;
    recordCampusEvent(
      "incident.experiment.completed",
      {
        experimentId: experiment.id,
        caseId: selectedCaseId,
        hypothesisId: experiment.hypothesisId,
        quality: experiment.quality,
        verdict: experiment.verdict,
      },
      { id: `incident.experiment.completed:${experiment.id}`, timestamp: experiment.createdAt },
    );
    showToast(copy[getLocale()].experimentSaved);
    render();
  });

  window.addEventListener("hashchange", () => render({ preserveWindow: false }));
  window.addEventListener("tu:languagechange", () => render());
  render({ preserveWindow: false });
}
