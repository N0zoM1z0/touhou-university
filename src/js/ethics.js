import {
  ethicsCase,
  ethicsCases,
  ethicsConsentPaths,
  ethicsDataKinds,
  ethicsDisclosureRules,
  ethicsLocalized,
  ethicsMethods,
  ethicsOutcomeLabels,
  ethicsReviewers,
  ethicsRiskBands,
  ethicsStanceLabels,
  ethicsTargets,
} from "../data/ethics.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import {
  assessEthicsProtocol,
  ethicsDraft,
  ethicsDraftFromCase,
  ethicsProtocol,
  ethicsProtocolDescription,
  ethicsProtocols,
  ethicsReviewForProtocol,
  ethicsStats,
  prepareEthicsRevision,
  resetEthicsDraft,
  saveEthicsDraft,
  submitEthicsProtocol,
  withdrawEthicsProtocol,
} from "./ethics-model.js";
import { getLocale } from "./i18n.js";
import { printDocument } from "./print-document.js";
import { renderPreservingState } from "./render-state.js";
import { siteHref } from "./site-router.js";
import { showToast } from "./ui.js";

let root;
let view = "board";
let selectedCaseId = ethicsCases[0].id;
let selectedProtocolId = null;
let currentDraft = null;
let previewAssessment = null;
let saveTimer = 0;

const copy = {
  "zh-Hant": {
    eyebrow: "RESEARCH ETHICS / 幻想鄉研究倫理審查委員會",
    title: "能做到，並不等於已經取得同意。",
    lead: "研究開始前，把能力、資料、停止規則與撤回方式攤在五席面前。阿求負責裝訂；她沒有把五張不同的意見平均成一張比較方便的許可。",
    board: "五宗示範案件",
    boardLead: "選一宗案卷，沿用爭點送出自己的版本。示範答案不是標準答案；它們只是已經開始吵架的地方。",
    form: "送審桌",
    records: "我的倫理案卷",
    reviewers: "五席獨立審查",
    reviewersLead: "每席只對自己的問題負責。阻擋、條件與少數意見都不會被多數票或平均分抹掉。",
    openCase: "打開並送審",
    related: "相關原始卷宗",
    expected: "示範案目前預審",
    voices: "案邊原話",
    sourceCase: "本次爭點",
    protocolTitle: "研究計畫名稱",
    researcher: "申請人／研究小組（可留白）",
    target: "研究對象",
    method: "能力或方法",
    disclosure: "告知時點",
    consent: "同意由誰作出",
    risk: "申報風險",
    exposure: "最大暴露／操作分鐘",
    data: "將會接觸的資料",
    safeguards: "四張現場保命紙",
    subjectStop: "研究對象能不經批准立即喊停",
    independent: "有不依賴同一能力的見證／計時方式",
    audit: "刪除後保留不含內容的受理收據",
    assent: "物品／付喪神本人也明確同意",
    stopRule: "停止規則",
    controlPlan: "對照與獨立見證",
    withdrawalPlan: "撤回方式",
    deletionPlan: "刪除與保留方式",
    appealPlan: "申訴與責任窗口",
    rationale: "為何必須這樣研究",
    save: "把草稿壓在桌角",
    saved: "草稿已壓好；河童膠帶沒有碰到同意欄。",
    preview: "敲五席預審鐘",
    submit: "正式送交五席審查",
    reset: "換回示範原稿",
    required: "研究計畫名稱至少需要四個字元。",
    previewTitle: "五席預審",
    previewLead: "這不是總分。最嚴格的一席可以阻擋開始；少數意見也會留在正式案卷。",
    conditions: "條件／異議",
    noConditions: "本席沒有追加條件。",
    decision: "委員會決議",
    decisionNote: "決議依阻擋條件、不可化約爭議與逐席意見形成，不計算平均倫理分。",
    protocol: "正式倫理案卷",
    revision: "版本",
    status: "卷宗狀態",
    active: "有效版本",
    superseded: "已由後續版本取代",
    withdrawn: "已撤回",
    submittedAt: "送審時間",
    print: "列印／另存正式審查案卷",
    revise: "按五席意見修訂",
    withdraw: "撤回這一版本",
    withdrawReason: "撤回理由（會留在本機版本鏈）",
    confirmWithdraw: "我知道撤回不會刪除既有審查意見",
    withdrawAction: "蓋撤回印",
    share: "複製這份案卷連結",
    shared: "案卷門牌已複製。",
    noRecords: "這台裝置還沒有正式送審紀錄。五席目前正用空白紙墊茶杯。",
    openProtocol: "閱讀案卷",
    versionChain: "同一計畫的版本鏈",
    localOnly: "草稿、送審與審查只保存在這個瀏覽器；正式事件索引會出現在 My TU，本機資料可由資料櫃匯出。",
    browseCabinet: "打開本機資料櫃",
    browseMyTu: "查看 My TU 履歷",
    committeeFiled: "五席意見已分開入卷。",
    amended: "修訂版已送審；上一版本沒有被擦掉。",
    withdrawnToast: "撤回印已蓋上；既有意見仍留在版本鏈。",
    documentTitle: "研究倫理審查決議書",
    documentNotice: "本決議不得以多數票摘要取代逐席條件；撤回、修訂與少數意見均屬案卷的一部分。",
    originalCase: "所依示範案",
    plan: "研究計畫",
    pageBoard: "案件架",
    pageForm: "送審桌",
    pageRecords: "本機卷宗",
  },
  ja: {
    eyebrow: "RESEARCH ETHICS / 幻想郷研究倫理審査委員会",
    title: "できることは、同意を得たことではない。",
    lead: "研究開始前に、能力・データ・停止規則・撤回方法を五席へ広げる。阿求は綴じるだけで、異なる五意見を便利な一枚へ平均しない。",
    board: "五つの模範案件",
    boardLead: "案件を一つ選び、争点を引き継いで自分の版を提出する。模範案は正解ではなく、既に議論が始まっている場所。",
    form: "申請机",
    records: "自分の倫理案件",
    reviewers: "五席独立審査",
    reviewersLead: "各席は自分の問いだけに責任を持つ。差戻し・条件・少数意見は多数票や平均点で消えない。",
    openCase: "開いて申請",
    related: "関連原記録",
    expected: "模範案の予備審査",
    voices: "欄外の原話",
    sourceCase: "今回の争点",
    protocolTitle: "研究計画名",
    researcher: "申請者／研究班（空欄可）",
    target: "研究対象",
    method: "能力・方法",
    disclosure: "説明時点",
    consent: "同意者",
    risk: "申告リスク",
    exposure: "最大曝露／操作時間（分）",
    data: "接触するデータ",
    safeguards: "現場を守る四枚",
    subjectStop: "研究対象が許可なく即時停止できる",
    independent: "同じ能力に依存しない立会／計時がある",
    audit: "削除後に内容を含まない受理票を残す",
    assent: "物／付喪神本人も明確に同意",
    stopRule: "停止規則",
    controlPlan: "対照・独立立会",
    withdrawalPlan: "撤回方法",
    deletionPlan: "削除・保存方法",
    appealPlan: "不服申立て・責任窓口",
    rationale: "この方法が必要な理由",
    save: "下書きを机の角へ留める",
    saved: "下書きを固定。河童テープは同意欄に触れていない。",
    preview: "五席予備審査の鐘を鳴らす",
    submit: "五席へ正式提出",
    reset: "模範原稿へ戻す",
    required: "研究計画名は4文字以上必要です。",
    previewTitle: "五席予備審査",
    previewLead: "総合点ではない。最も厳しい一席が開始を止め、少数意見も正式記録へ残る。",
    conditions: "条件／異議",
    noConditions: "本席の追加条件なし。",
    decision: "委員会決定",
    decisionNote: "差戻し条件・不可約な争い・各席意見から形成し、倫理平均点は計算しない。",
    protocol: "正式倫理案件",
    revision: "版",
    status: "状態",
    active: "有効版",
    superseded: "後続版に置換",
    withdrawn: "取下げ済み",
    submittedAt: "提出時刻",
    print: "正式審査記録を印刷／PDF保存",
    revise: "五席意見に沿って修正",
    withdraw: "この版を取り下げる",
    withdrawReason: "取下げ理由（端末内の版鎖に残る）",
    confirmWithdraw: "取下げても既存審査意見は削除されないと理解した",
    withdrawAction: "取下げ印を押す",
    share: "案件リンクをコピー",
    shared: "案件の住所をコピーしました。",
    noRecords: "この端末に正式提出はまだない。五席は白紙を茶托にしている。",
    openProtocol: "案件を読む",
    versionChain: "同一計画の版鎖",
    localOnly: "下書き・提出・審査はこのブラウザだけに保存。正式イベント索引は My TU に現れ、資料棚から書き出せます。",
    browseCabinet: "端末内資料棚を開く",
    browseMyTu: "My TU 履歴を見る",
    committeeFiled: "五席意見を別々に綴じました。",
    amended: "修正版を提出。前版は消していません。",
    withdrawnToast: "取下げ印を押しました。既存意見は版鎖に残ります。",
    documentTitle: "研究倫理審査決定書",
    documentNotice: "多数票の要約で各席条件を置換してはならない。取下げ・修正・少数意見も案件の一部。",
    originalCase: "参照模範案",
    plan: "研究計画",
    pageBoard: "案件棚",
    pageForm: "申請机",
    pageRecords: "端末内案件",
  },
  en: {
    eyebrow: "RESEARCH ETHICS / GENSOKYO RESEARCH ETHICS REVIEW BOARD",
    title: "Being able to do it is not consent to do it.",
    lead: "Before research starts, lay ability use, data, stop rules, and withdrawal before five seats. Akyuu binds the file; she does not average five disagreements into one convenient permit.",
    board: "Five specimen cases",
    boardLead: "Choose a file and submit your own version of its dispute. The specimens are not model answers; they are places where the argument has already started.",
    form: "Submission desk",
    records: "My ethics files",
    reviewers: "Five independent review seats",
    reviewersLead: "Each seat answers only its own question. Blocks, conditions, and minority opinions survive majorities and averages.",
    openCase: "Open and submit",
    related: "Related source files",
    expected: "Specimen pre-review",
    voices: "Words in the margin",
    sourceCase: "Dispute under review",
    protocolTitle: "Protocol title",
    researcher: "Applicant / research group (optional)",
    target: "Research subject",
    method: "Ability or method",
    disclosure: "Timing of disclosure",
    consent: "Who gives consent",
    risk: "Declared risk",
    exposure: "Maximum exposure / operation minutes",
    data: "Data to be accessed",
    safeguards: "Four field safeguards",
    subjectStop: "Subject can stop immediately without approval",
    independent: "Witness / clock independent of the same ability",
    audit: "Content-free receipt survives deletion",
    assent: "Object / tsukumogami explicitly assents",
    stopRule: "Stopping rule",
    controlPlan: "Control and independent witness",
    withdrawalPlan: "Withdrawal route",
    deletionPlan: "Deletion and retention",
    appealPlan: "Appeal and responsible office",
    rationale: "Why this method is necessary",
    save: "Pin draft to the desk",
    saved: "Draft pinned down; kappa tape did not touch the consent field.",
    preview: "Ring the five-seat pre-review bell",
    submit: "Submit for formal five-seat review",
    reset: "Restore the specimen draft",
    required: "The protocol title needs at least four characters.",
    previewTitle: "Five-seat pre-review",
    previewLead: "This is not a total score. One blocking seat can stop the start; minority opinions enter the formal file.",
    conditions: "Conditions / dissent",
    noConditions: "This seat adds no condition.",
    decision: "Board decision",
    decisionNote: "The decision follows blocking conditions, irreducible disputes, and each seat's opinion; no average ethics score is calculated.",
    protocol: "Formal ethics file",
    revision: "Revision",
    status: "File status",
    active: "Active version",
    superseded: "Superseded by a later version",
    withdrawn: "Withdrawn",
    submittedAt: "Submitted",
    print: "Print / save formal review as PDF",
    revise: "Revise from the five opinions",
    withdraw: "Withdraw this version",
    withdrawReason: "Reason for withdrawal (retained in the on-device version chain)",
    confirmWithdraw: "I understand withdrawal does not delete existing review opinions",
    withdrawAction: "Stamp withdrawn",
    share: "Copy this file link",
    shared: "The file address was copied.",
    noRecords: "No formal submission exists on this device. The five seats are using blank paper as tea coasters.",
    openProtocol: "Read file",
    versionChain: "Version chain for this protocol",
    localOnly: "Drafts, submissions, and reviews stay in this browser. Formal event indexes appear in My TU and can be exported through the records cabinet.",
    browseCabinet: "Open records cabinet",
    browseMyTu: "View My TU history",
    committeeFiled: "All five opinions were filed separately.",
    amended: "The amendment was reviewed; the previous version was not erased.",
    withdrawnToast: "Withdrawal stamped; existing opinions remain in the version chain.",
    documentTitle: "Research Ethics Review Decision",
    documentNotice: "A majority summary may not replace seat-level conditions. Withdrawal, amendment, and minority opinions remain part of the file.",
    originalCase: "Specimen source case",
    plan: "Research plan",
    pageBoard: "Case shelf",
    pageForm: "Submission desk",
    pageRecords: "On-device files",
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

const localized = (value, locale) => ethicsLocalized(value, locale);

function formatDate(value, locale) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function selected(value, expected) {
  return value === expected ? "selected" : "";
}

function checked(value) {
  return value ? "checked" : "";
}

function currentRoute() {
  try {
    return decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return window.location.hash.slice(1);
  }
}

function statusLabel(protocol, c) {
  if (protocol.status === "withdrawn") return c.withdrawn;
  if (protocol.status === "superseded") return c.superseded;
  return c.active;
}

function outcomeLabel(outcome, locale) {
  return localized(ethicsOutcomeLabels[outcome], locale);
}

function stanceLabel(stance, locale) {
  return localized(ethicsStanceLabels[stance], locale);
}

function modeNav(c) {
  return `
    <nav class="ethics-mode-nav" aria-label="${escapeHtml(c.eyebrow)}">
      <a href="#ethics-board" class="${view === "board" ? "is-active" : ""}"><span>01</span>${escapeHtml(c.pageBoard)}</a>
      <a href="#ethics-case-${escapeHtml(selectedCaseId)}" class="${view === "form" ? "is-active" : ""}"><span>02</span>${escapeHtml(c.pageForm)}</a>
      <a href="#ethics-records" class="${["records", "protocol"].includes(view) ? "is-active" : ""}"><span>03</span>${escapeHtml(c.pageRecords)}</a>
    </nav>`;
}

function pageHero(locale, c) {
  const stats = ethicsStats();
  return `
    <header class="ethics-hero">
      <div>
        <p>${escapeHtml(c.eyebrow)}</p>
        <h2>${escapeHtml(c.title)}</h2>
        <span>${escapeHtml(c.lead)}</span>
      </div>
      <aside aria-label="${escapeHtml(c.reviewers)}">
        <b>五</b>
        <p>${escapeHtml(c.reviewers)}</p>
        <dl>
          <div><dt>${ethicsCases.length}</dt><dd>${escapeHtml(c.board)}</dd></div>
          <div><dt>${stats.protocols}</dt><dd>${escapeHtml(c.records)}</dd></div>
        </dl>
      </aside>
    </header>
    ${modeNav(c)}`;
}

function reviewerSeats(locale, c) {
  return `
    <section class="ethics-reviewer-section" aria-labelledby="ethics-reviewers-title">
      <header>
        <p>FIVE SEATS / NO AVERAGE</p>
        <h3 id="ethics-reviewers-title">${escapeHtml(c.reviewers)}</h3>
        <span>${escapeHtml(c.reviewersLead)}</span>
      </header>
      <div class="ethics-reviewer-ribbon" data-preserve-scroll="ethics-reviewers">
        ${ethicsReviewers.map((reviewer, index) => `
          <article>
            <i>${escapeHtml(reviewer.glyph)}</i>
            <small>0${index + 1} / ${escapeHtml(localized(reviewer.seat, locale))}</small>
            <h4>${escapeHtml(localized(reviewer.name, locale))}</h4>
            <p>${escapeHtml(localized(reviewer.question, locale))}</p>
          </article>`).join("")}
      </div>
    </section>`;
}

function relatedLinks(caseFile, locale, c) {
  return `
    <div class="ethics-related">
      <strong>${escapeHtml(c.related)}</strong>
      ${caseFile.relatedRoutes.map((route, index) => `
        <a href="${escapeHtml(siteHref(route))}">
          ${escapeHtml(index === 0 ? caseFile.code : `${caseFile.code} / ${String(index + 1).padStart(2, "0")}`)}
          <span aria-hidden="true">↗</span>
        </a>`).join("")}
    </div>`;
}

function caseCard(caseFile, locale, c) {
  return `
    <article class="ethics-case-card" id="ethics-case-card-${escapeHtml(caseFile.id)}">
      <header>
        <span>${escapeHtml(caseFile.code)}</span>
        <b>${escapeHtml(caseFile.mark)}</b>
      </header>
      <h4>${escapeHtml(localized(caseFile.title, locale))}</h4>
      <p>${escapeHtml(localized(caseFile.lede, locale))}</p>
      <blockquote>${escapeHtml(localized(caseFile.conflict, locale))}</blockquote>
      <footer>
        <small>${escapeHtml(c.expected)} · <strong data-outcome="${escapeHtml(caseFile.expectedOutcome)}">${escapeHtml(outcomeLabel(caseFile.expectedOutcome, locale))}</strong></small>
        <button type="button" data-ethics-case="${escapeHtml(caseFile.id)}">${escapeHtml(c.openCase)} <span aria-hidden="true">→</span></button>
      </footer>
    </article>`;
}

function boardView(locale, c) {
  return `
    <section class="ethics-case-shelf" aria-labelledby="ethics-cases-title">
      <header>
        <div><p>SPECIMEN FILES / 01—05</p><h3 id="ethics-cases-title">${escapeHtml(c.board)}</h3></div>
        <span>${escapeHtml(c.boardLead)}</span>
      </header>
      <div class="ethics-case-grid">${ethicsCases.map((caseFile) => caseCard(caseFile, locale, c)).join("")}</div>
    </section>
    ${reviewerSeats(locale, c)}
    <aside class="ethics-local-note">
      <span aria-hidden="true">端</span>
      <p>${escapeHtml(c.localOnly)}</p>
      <div><a href="records.html#data-cabinet">${escapeHtml(c.browseCabinet)} ↗</a><a href="mytu.html#my-tu">${escapeHtml(c.browseMyTu)} ↗</a></div>
    </aside>`;
}

function voices(caseFile, locale, c) {
  return `
    <div class="ethics-voices">
      <strong>${escapeHtml(c.voices)}</strong>
      ${caseFile.voices.map((voice) => `
        <blockquote>
          <p>${escapeHtml(localized(voice.statement, locale))}</p>
          <cite>— ${escapeHtml(localized(voice.speaker, locale))}</cite>
        </blockquote>`).join("")}
    </div>`;
}

function selectOptions(records, value, locale) {
  return records.map((record) => `
    <option value="${escapeHtml(record.id)}" ${selected(value, record.id)}>${escapeHtml(localized(record.label, locale))}</option>`).join("");
}

function draftFromForm(form) {
  const data = new FormData(form);
  return {
    ...currentDraft,
    caseId: selectedCaseId,
    title: data.get("title"),
    researcher: data.get("researcher"),
    targetId: data.get("targetId"),
    methodId: data.get("methodId"),
    disclosureId: data.get("disclosureId"),
    consentId: data.get("consentId"),
    riskId: data.get("riskId"),
    maxExposure: data.get("maxExposure"),
    dataIds: data.getAll("dataIds"),
    subjectCanStop: data.has("subjectCanStop"),
    independentMonitor: data.has("independentMonitor"),
    auditStub: data.has("auditStub"),
    objectAssent: data.has("objectAssent"),
    stopRule: data.get("stopRule"),
    controlPlan: data.get("controlPlan"),
    withdrawalPlan: data.get("withdrawalPlan"),
    deletionPlan: data.get("deletionPlan"),
    appealPlan: data.get("appealPlan"),
    rationale: data.get("rationale"),
  };
}

function formField(name, label, value, rows = 3) {
  return `
    <label class="ethics-field ethics-field-wide">
      <span>${escapeHtml(label)}</span>
      <textarea name="${escapeHtml(name)}" rows="${rows}" data-preserve-focus="ethics-${escapeHtml(name)}">${escapeHtml(value)}</textarea>
    </label>`;
}

function assessmentPanel(assessment, locale, c, { formal = false } = {}) {
  return `
    <section class="ethics-assessment ${formal ? "is-formal" : ""}" data-ethics-assessment>
      <header>
        <div><p>${formal ? "FORMAL RULING" : "PRE-REVIEW"}</p><h3>${escapeHtml(formal ? c.decision : c.previewTitle)}</h3></div>
        <strong data-outcome="${escapeHtml(assessment.outcome)}">${escapeHtml(outcomeLabel(assessment.outcome, locale))}</strong>
        <span>${escapeHtml(formal ? c.decisionNote : c.previewLead)}</span>
      </header>
      <div class="ethics-opinions">
        ${assessment.opinions.map((entry, index) => {
          const reviewer = ethicsReviewers.find(({ id }) => id === entry.reviewerId);
          return `
            <article data-stance="${escapeHtml(entry.stance)}">
              <header>
                <i>${escapeHtml(reviewer.glyph)}</i>
                <div><small>0${index + 1} · ${escapeHtml(localized(reviewer.seat, locale))}</small><h4>${escapeHtml(localized(reviewer.name, locale))}</h4></div>
                <b>${escapeHtml(stanceLabel(entry.stance, locale))}</b>
              </header>
              <p>${escapeHtml(localized(entry.statement, locale))}</p>
              <div>
                <strong>${escapeHtml(c.conditions)}</strong>
                ${entry.conditions.length
                  ? `<ul>${entry.conditions.map((condition) => `<li>${escapeHtml(localized(condition, locale))}</li>`).join("")}</ul>`
                  : `<span>${escapeHtml(c.noConditions)}</span>`}
              </div>
            </article>`;
        }).join("")}
      </div>
    </section>`;
}

function formView(locale, c) {
  const caseFile = ethicsCase(selectedCaseId) || ethicsCases[0];
  currentDraft ||= ethicsDraft(caseFile.id, locale);
  const draft = currentDraft;
  const assessment = previewAssessment || assessEthicsProtocol(draft, locale);
  return `
    <section class="ethics-submission" id="ethics-case-${escapeHtml(caseFile.id)}">
      <aside class="ethics-case-brief">
        <header><span>${escapeHtml(caseFile.code)}</span><b>${escapeHtml(caseFile.mark)}</b></header>
        <p>${escapeHtml(c.sourceCase)}</p>
        <h3>${escapeHtml(localized(caseFile.title, locale))}</h3>
        <blockquote>${escapeHtml(localized(caseFile.conflict, locale))}</blockquote>
        ${voices(caseFile, locale, c)}
        ${relatedLinks(caseFile, locale, c)}
      </aside>
      <form class="ethics-form" data-ethics-form>
        <header>
          <p>PROTOCOL / ${escapeHtml(caseFile.code)}</p>
          <h3>${escapeHtml(c.form)}</h3>
          ${draft.revisionOf ? `<span>${escapeHtml(c.revision)} · ${escapeHtml(draft.revisionOf)}</span>` : ""}
        </header>
        <div class="ethics-form-grid">
          <label class="ethics-field ethics-field-wide">
            <span>${escapeHtml(c.protocolTitle)}</span>
            <input name="title" value="${escapeHtml(draft.title)}" maxlength="140" required data-preserve-focus="ethics-title">
          </label>
          <label class="ethics-field ethics-field-wide">
            <span>${escapeHtml(c.researcher)}</span>
            <input name="researcher" value="${escapeHtml(draft.researcher)}" maxlength="80" data-preserve-focus="ethics-researcher">
          </label>
          <label class="ethics-field"><span>${escapeHtml(c.target)}</span><select name="targetId">${selectOptions(ethicsTargets, draft.targetId, locale)}</select></label>
          <label class="ethics-field"><span>${escapeHtml(c.method)}</span><select name="methodId">${selectOptions(ethicsMethods, draft.methodId, locale)}</select></label>
          <label class="ethics-field"><span>${escapeHtml(c.disclosure)}</span><select name="disclosureId">${selectOptions(ethicsDisclosureRules, draft.disclosureId, locale)}</select></label>
          <label class="ethics-field"><span>${escapeHtml(c.consent)}</span><select name="consentId">${selectOptions(ethicsConsentPaths, draft.consentId, locale)}</select></label>
          <label class="ethics-field"><span>${escapeHtml(c.risk)}</span><select name="riskId">${selectOptions(ethicsRiskBands, draft.riskId, locale)}</select></label>
          <label class="ethics-field"><span>${escapeHtml(c.exposure)}</span><input type="number" name="maxExposure" value="${escapeHtml(draft.maxExposure)}" min="0" max="720"></label>
        </div>
        <fieldset class="ethics-check-grid">
          <legend>${escapeHtml(c.data)}</legend>
          ${ethicsDataKinds.map((kind) => `
            <label><input type="checkbox" name="dataIds" value="${escapeHtml(kind.id)}" ${checked(draft.dataIds.includes(kind.id))}><span>${escapeHtml(localized(kind.label, locale))}</span></label>`).join("")}
        </fieldset>
        <fieldset class="ethics-safeguards">
          <legend>${escapeHtml(c.safeguards)}</legend>
          <label><input type="checkbox" name="subjectCanStop" ${checked(draft.subjectCanStop)}><span>${escapeHtml(c.subjectStop)}</span></label>
          <label><input type="checkbox" name="independentMonitor" ${checked(draft.independentMonitor)}><span>${escapeHtml(c.independent)}</span></label>
          <label><input type="checkbox" name="auditStub" ${checked(draft.auditStub)}><span>${escapeHtml(c.audit)}</span></label>
          <label><input type="checkbox" name="objectAssent" ${checked(draft.objectAssent)}><span>${escapeHtml(c.assent)}</span></label>
        </fieldset>
        <div class="ethics-form-grid">
          ${formField("stopRule", c.stopRule, draft.stopRule)}
          ${formField("controlPlan", c.controlPlan, draft.controlPlan)}
          ${formField("withdrawalPlan", c.withdrawalPlan, draft.withdrawalPlan)}
          ${formField("deletionPlan", c.deletionPlan, draft.deletionPlan)}
          ${formField("appealPlan", c.appealPlan, draft.appealPlan)}
          ${formField("rationale", c.rationale, draft.rationale, 4)}
        </div>
        <footer class="ethics-form-actions">
          <button type="button" class="button" data-ethics-reset>${escapeHtml(c.reset)}</button>
          <button type="button" class="button" data-ethics-save>${escapeHtml(c.save)}</button>
          <button type="button" class="button" data-ethics-preview>${escapeHtml(c.preview)}</button>
          <button type="submit" class="button button-primary">${escapeHtml(c.submit)} <span aria-hidden="true">→</span></button>
        </footer>
      </form>
    </section>
    ${assessmentPanel(assessment, locale, c)}`;
}

function protocolSummary(protocol, locale, c) {
  const description = ethicsProtocolDescription(protocol, locale);
  const draft = protocol.draft;
  const dataLabels = draft.dataIds.map((id) => ethicsDataKinds.find((entry) => entry.id === id))
    .filter(Boolean)
    .map((entry) => localized(entry.label, locale));
  return `
    <section class="ethics-protocol-summary">
      <header><p>${escapeHtml(c.plan)}</p><h3>${escapeHtml(draft.title)}</h3>${draft.researcher ? `<span>${escapeHtml(draft.researcher)}</span>` : ""}</header>
      <dl>
        <div><dt>${escapeHtml(c.target)}</dt><dd>${escapeHtml(localized(description.target?.label, locale))}</dd></div>
        <div><dt>${escapeHtml(c.method)}</dt><dd>${escapeHtml(localized(description.method?.label, locale))}</dd></div>
        <div><dt>${escapeHtml(c.disclosure)}</dt><dd>${escapeHtml(localized(description.disclosure?.label, locale))}</dd></div>
        <div><dt>${escapeHtml(c.consent)}</dt><dd>${escapeHtml(localized(description.consent?.label, locale))}</dd></div>
        <div><dt>${escapeHtml(c.risk)}</dt><dd>${escapeHtml(localized(description.risk?.label, locale))}</dd></div>
        <div><dt>${escapeHtml(c.exposure)}</dt><dd>${escapeHtml(draft.maxExposure)}</dd></div>
        <div class="is-wide"><dt>${escapeHtml(c.data)}</dt><dd>${escapeHtml(dataLabels.join(" · ") || "—")}</dd></div>
      </dl>
      <div class="ethics-plan-pages">
        <article><strong>${escapeHtml(c.stopRule)}</strong><p>${escapeHtml(draft.stopRule)}</p></article>
        <article><strong>${escapeHtml(c.controlPlan)}</strong><p>${escapeHtml(draft.controlPlan)}</p></article>
        <article><strong>${escapeHtml(c.withdrawalPlan)}</strong><p>${escapeHtml(draft.withdrawalPlan)}</p></article>
        <article><strong>${escapeHtml(c.deletionPlan)}</strong><p>${escapeHtml(draft.deletionPlan)}</p></article>
        <article><strong>${escapeHtml(c.appealPlan)}</strong><p>${escapeHtml(draft.appealPlan)}</p></article>
        <article><strong>${escapeHtml(c.rationale)}</strong><p>${escapeHtml(draft.rationale)}</p></article>
      </div>
    </section>`;
}

function protocolAssessment(protocol) {
  const review = ethicsReviewForProtocol(protocol.id);
  return {
    draft: protocol.draft,
    outcome: protocol.status === "withdrawn" ? "withdrawn" : protocol.outcome,
    opinions: review?.opinions || [],
  };
}

function versionChain(protocol, locale, c) {
  const versions = ethicsProtocols()
    .filter(({ rootProtocolId }) => rootProtocolId === protocol.rootProtocolId)
    .sort((a, b) => a.revision - b.revision);
  return `
    <section class="ethics-version-chain">
      <h3>${escapeHtml(c.versionChain)}</h3>
      <ol>
        ${versions.map((version) => `
          <li class="${version.id === protocol.id ? "is-current" : ""}">
            <a href="#ethics-protocol-${escapeHtml(version.id)}">
              <span>v${escapeHtml(version.revision)}</span>
              <strong>${escapeHtml(version.draft.title)}</strong>
              <small>${escapeHtml(statusLabel(version, c))} · ${escapeHtml(outcomeLabel(version.status === "withdrawn" ? "withdrawn" : version.outcome, locale))}</small>
            </a>
          </li>`).join("")}
      </ol>
    </section>`;
}

function protocolView(locale, c) {
  const protocol = ethicsProtocol(selectedProtocolId);
  if (!protocol) {
    view = "records";
    return recordsView(locale, c);
  }
  const caseFile = ethicsCase(protocol.draft.caseId);
  const assessment = protocolAssessment(protocol);
  return `
    <article class="ethics-protocol-file" id="ethics-protocol-${escapeHtml(protocol.id)}" data-ethics-protocol-file>
      <header class="ethics-protocol-heading">
        <div>
          <p>${escapeHtml(c.protocol)} · ${escapeHtml(caseFile?.code || "")}</p>
          <h3>${escapeHtml(protocol.id)}</h3>
          <span>${escapeHtml(c.submittedAt)} · ${escapeHtml(formatDate(protocol.createdAt, locale))}</span>
        </div>
        <div class="ethics-file-stamps">
          <b data-outcome="${escapeHtml(protocol.status === "withdrawn" ? "withdrawn" : protocol.outcome)}">${escapeHtml(outcomeLabel(protocol.status === "withdrawn" ? "withdrawn" : protocol.outcome, locale))}</b>
          <i>v${escapeHtml(protocol.revision)}</i>
        </div>
      </header>
      <div class="ethics-file-meta">
        <span>${escapeHtml(c.status)} · <strong>${escapeHtml(statusLabel(protocol, c))}</strong></span>
        <span>${escapeHtml(c.originalCase)} · <a href="#ethics-case-${escapeHtml(caseFile?.id || selectedCaseId)}">${escapeHtml(localized(caseFile?.shortTitle, locale))}</a></span>
      </div>
      ${protocolSummary(protocol, locale, c)}
      ${assessmentPanel(assessment, locale, c, { formal: true })}
      ${protocol.withdrawalReason ? `<blockquote class="ethics-withdrawal-note"><strong>${escapeHtml(c.withdrawReason)}</strong><p>${escapeHtml(protocol.withdrawalReason)}</p></blockquote>` : ""}
      <footer class="ethics-protocol-actions" data-print-exclude>
        <button type="button" class="button" data-ethics-share>${escapeHtml(c.share)}</button>
        <button type="button" class="button" data-ethics-print="${escapeHtml(protocol.id)}">${escapeHtml(c.print)}</button>
        ${protocol.status === "active" ? `<button type="button" class="button button-primary" data-ethics-revise="${escapeHtml(protocol.id)}">${escapeHtml(c.revise)} <span aria-hidden="true">→</span></button>` : ""}
      </footer>
      ${protocol.status === "active" ? `
        <details class="ethics-withdraw-panel" data-print-exclude>
          <summary>${escapeHtml(c.withdraw)}</summary>
          <form data-ethics-withdraw-form="${escapeHtml(protocol.id)}">
            <label><span>${escapeHtml(c.withdrawReason)}</span><textarea name="reason" rows="3" required></textarea></label>
            <label><input type="checkbox" name="confirm" required><span>${escapeHtml(c.confirmWithdraw)}</span></label>
            <button class="button" type="submit">${escapeHtml(c.withdrawAction)}</button>
          </form>
        </details>` : ""}
    </article>
    ${versionChain(protocol, locale, c)}`;
}

function recordsView(locale, c) {
  const protocols = ethicsProtocols().slice().reverse();
  return `
    <section class="ethics-records" id="ethics-records">
      <header>
        <div><p>ON-DEVICE ETHICS FILES</p><h3>${escapeHtml(c.records)}</h3></div>
        <span>${escapeHtml(c.localOnly)}</span>
      </header>
      ${protocols.length ? `
        <div class="ethics-record-list">
          ${protocols.map((protocol) => `
            <article data-status="${escapeHtml(protocol.status)}">
              <div>
                <small>${escapeHtml(protocol.id)} · v${escapeHtml(protocol.revision)}</small>
                <h4>${escapeHtml(protocol.draft.title)}</h4>
                <p>${escapeHtml(formatDate(protocol.createdAt, locale))} · ${escapeHtml(statusLabel(protocol, c))}</p>
              </div>
              <strong data-outcome="${escapeHtml(protocol.status === "withdrawn" ? "withdrawn" : protocol.outcome)}">${escapeHtml(outcomeLabel(protocol.status === "withdrawn" ? "withdrawn" : protocol.outcome, locale))}</strong>
              <a href="#ethics-protocol-${escapeHtml(protocol.id)}">${escapeHtml(c.openProtocol)} <span aria-hidden="true">→</span></a>
            </article>`).join("")}
        </div>` : `<div class="ethics-empty"><span aria-hidden="true">白</span><p>${escapeHtml(c.noRecords)}</p></div>`}
      <footer><a href="records.html#data-cabinet">${escapeHtml(c.browseCabinet)} ↗</a><a href="mytu.html#my-tu">${escapeHtml(c.browseMyTu)} ↗</a></footer>
    </section>`;
}

function printableProtocol(protocol, locale, c) {
  const wrapper = document.createElement("article");
  wrapper.className = "ethics-print-document";
  const caseFile = ethicsCase(protocol.draft.caseId);
  wrapper.innerHTML = `
    <header>
      <p>TOUHOU UNIVERSITY · GENSOKYO RESEARCH ETHICS REVIEW BOARD</p>
      <h1>${escapeHtml(c.documentTitle)}</h1>
      <strong>${escapeHtml(protocol.id)} · v${escapeHtml(protocol.revision)}</strong>
    </header>
    <section>
      <dl>
        <div><dt>${escapeHtml(c.originalCase)}</dt><dd>${escapeHtml(localized(caseFile?.title, locale))}</dd></div>
        <div><dt>${escapeHtml(c.submittedAt)}</dt><dd>${escapeHtml(formatDate(protocol.createdAt, locale))}</dd></div>
        <div><dt>${escapeHtml(c.status)}</dt><dd>${escapeHtml(statusLabel(protocol, c))}</dd></div>
        <div><dt>${escapeHtml(c.decision)}</dt><dd>${escapeHtml(outcomeLabel(protocol.status === "withdrawn" ? "withdrawn" : protocol.outcome, locale))}</dd></div>
      </dl>
    </section>
    ${protocolSummary(protocol, locale, c)}
    ${assessmentPanel(protocolAssessment(protocol), locale, c, { formal: true })}
    ${protocol.withdrawalReason ? `<blockquote><strong>${escapeHtml(c.withdrawReason)}</strong><p>${escapeHtml(protocol.withdrawalReason)}</p></blockquote>` : ""}
    <footer><p>${escapeHtml(c.documentNotice)}</p><span>${escapeHtml(protocol.reviewId)}</span></footer>`;
  return wrapper;
}

function render({ preserveWindow = true } = {}) {
  if (!root) return;
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  renderPreservingState(root, () => {
    const content = view === "form"
      ? formView(locale, c)
      : view === "records"
        ? recordsView(locale, c)
        : view === "protocol"
          ? protocolView(locale, c)
          : boardView(locale, c);
    root.innerHTML = `${pageHero(locale, c)}<div class="ethics-body">${content}</div>`;
  }, { preserveWindow });
}

function showCase(caseId, { navigate = true } = {}) {
  const caseFile = ethicsCase(caseId);
  if (!caseFile) return;
  selectedCaseId = caseFile.id;
  selectedProtocolId = null;
  currentDraft = ethicsDraft(caseFile.id, getLocale());
  previewAssessment = null;
  view = "form";
  render({ preserveWindow: false });
  if (navigate) navigateToDeepLink(`ethics-case-${caseFile.id}`);
}

function showProtocol(protocolId, { navigate = true } = {}) {
  const protocol = ethicsProtocol(protocolId);
  if (!protocol) return;
  selectedProtocolId = protocol.id;
  selectedCaseId = protocol.draft.caseId;
  view = "protocol";
  render({ preserveWindow: false });
  if (navigate) navigateToDeepLink(`ethics-protocol-${protocol.id}`);
}

function recordProtocolEvents(protocol, review) {
  const payload = {
    protocolId: protocol.id,
    rootProtocolId: protocol.rootProtocolId,
    caseId: protocol.draft.caseId,
    revisionOf: protocol.revisionOf,
    outcome: protocol.outcome,
  };
  if (protocol.revisionOf) {
    recordCampusEvent("ethics.protocol.amended", payload, {
      id: `ethics.protocol.amended:${protocol.id}`,
      timestamp: protocol.createdAt,
    });
  } else {
    recordCampusEvent("ethics.protocol.submitted", payload, {
      id: `ethics.protocol.submitted:${protocol.id}`,
      timestamp: protocol.createdAt,
    });
  }
  recordCampusEvent("ethics.review.completed", {
    protocolId: protocol.id,
    rootProtocolId: protocol.rootProtocolId,
    reviewId: review.id,
    caseId: protocol.draft.caseId,
    outcome: review.outcome,
    reviewerIds: review.opinions.map(({ reviewerId }) => reviewerId),
  }, {
    id: `ethics.review.completed:${review.id}`,
    timestamp: review.createdAt,
  });
}

async function copyLink(c) {
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch {
    const field = document.createElement("input");
    field.value = window.location.href;
    document.body.append(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
  showToast(c.shared);
}

function bindEvents() {
  root.addEventListener("input", (event) => {
    const form = event.target.closest("[data-ethics-form]");
    if (!form) return;
    window.clearTimeout(saveTimer);
    currentDraft = draftFromForm(form);
    previewAssessment = null;
    saveTimer = window.setTimeout(() => {
      currentDraft = saveEthicsDraft(currentDraft, getLocale());
    }, 320);
  });

  root.addEventListener("click", async (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    const caseButton = event.target.closest("[data-ethics-case]");
    if (caseButton) {
      showCase(caseButton.dataset.ethicsCase);
      return;
    }
    if (event.target.closest("[data-ethics-save]")) {
      const form = root.querySelector("[data-ethics-form]");
      if (!form) return;
      currentDraft = saveEthicsDraft(draftFromForm(form), locale);
      showToast(c.saved);
      return;
    }
    if (event.target.closest("[data-ethics-reset]")) {
      currentDraft = resetEthicsDraft(selectedCaseId, locale);
      previewAssessment = assessEthicsProtocol(currentDraft, locale);
      render();
      return;
    }
    if (event.target.closest("[data-ethics-preview]")) {
      const form = root.querySelector("[data-ethics-form]");
      if (!form) return;
      currentDraft = saveEthicsDraft(draftFromForm(form), locale);
      previewAssessment = assessEthicsProtocol(currentDraft, locale);
      render();
      root.querySelector("[data-ethics-assessment]")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const revise = event.target.closest("[data-ethics-revise]");
    if (revise) {
      const draft = prepareEthicsRevision(revise.dataset.ethicsRevise, locale);
      if (!draft) return;
      currentDraft = draft;
      previewAssessment = assessEthicsProtocol(draft, locale);
      selectedCaseId = draft.caseId;
      view = "form";
      navigateToDeepLink(`ethics-case-${draft.caseId}`);
      return;
    }
    const print = event.target.closest("[data-ethics-print]");
    if (print) {
      const protocol = ethicsProtocol(print.dataset.ethicsPrint);
      const documentBody = protocol ? printableProtocol(protocol, locale, c) : null;
      if (documentBody) printDocument(documentBody, { title: `${protocol.id} · ${c.documentTitle}` });
      return;
    }
    if (event.target.closest("[data-ethics-share]")) await copyLink(c);
  });

  root.addEventListener("submit", (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    const protocolForm = event.target.closest("[data-ethics-form]");
    if (protocolForm) {
      event.preventDefault();
      window.clearTimeout(saveTimer);
      currentDraft = saveEthicsDraft(draftFromForm(protocolForm), locale);
      const result = submitEthicsProtocol(currentDraft, new Date(), locale);
      if (result.error) {
        showToast(c.required);
        protocolForm.elements.title?.focus();
        return;
      }
      recordProtocolEvents(result.protocol, result.review);
      selectedProtocolId = result.protocol.id;
      selectedCaseId = result.protocol.draft.caseId;
      view = "protocol";
      previewAssessment = null;
      navigateToDeepLink(`ethics-protocol-${result.protocol.id}`);
      showToast(result.protocol.revisionOf ? c.amended : c.committeeFiled);
      return;
    }
    const withdrawForm = event.target.closest("[data-ethics-withdraw-form]");
    if (withdrawForm) {
      event.preventDefault();
      if (!withdrawForm.reportValidity()) return;
      const protocol = withdrawEthicsProtocol(
        withdrawForm.dataset.ethicsWithdrawForm,
        new FormData(withdrawForm).get("reason"),
        new Date(),
      );
      if (!protocol) return;
      recordCampusEvent("ethics.protocol.withdrawn", {
        protocolId: protocol.id,
        rootProtocolId: protocol.rootProtocolId,
        caseId: protocol.draft.caseId,
        reason: protocol.withdrawalReason,
      }, {
        id: `ethics.protocol.withdrawn:${protocol.id}`,
        timestamp: protocol.withdrawnAt,
      });
      render();
      showToast(c.withdrawnToast);
    }
  });
}

function initialView() {
  const route = currentRoute();
  if (route.startsWith("ethics-case-")) {
    const caseId = route.slice("ethics-case-".length);
    if (ethicsCase(caseId)) {
      selectedCaseId = caseId;
      currentDraft = ethicsDraft(caseId, getLocale());
      view = "form";
      return;
    }
  }
  if (route.startsWith("ethics-protocol-")) {
    const protocol = ethicsProtocol(route.slice("ethics-protocol-".length));
    if (protocol) {
      selectedProtocolId = protocol.id;
      selectedCaseId = protocol.draft.caseId;
      view = "protocol";
      return;
    }
  }
  if (route === "ethics-records") view = "records";
}

export function initEthics() {
  root = document.querySelector("[data-ethics-app]");
  if (!root) return;
  initialView();
  render({ preserveWindow: false });
  bindEvents();

  registerDeepLink("ethics-board", {
    anchor: "#ethics-board",
    position: "always",
    open() {
      view = "board";
      selectedProtocolId = null;
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("ethics-records", {
    anchor: () => document.getElementById("ethics-records") || root,
    position: "always",
    open() {
      view = "records";
      selectedProtocolId = null;
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("ethics-case-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "ethics-review-focus",
    position: "always",
    open(id) {
      if (!ethicsCase(id)) return;
      selectedCaseId = id;
      selectedProtocolId = null;
      currentDraft = ethicsDraft(id, getLocale());
      previewAssessment = null;
      view = "form";
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("ethics-protocol-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "ethics-review-focus",
    position: "always",
    open(id) {
      const protocol = ethicsProtocol(id);
      if (!protocol) return;
      selectedProtocolId = protocol.id;
      selectedCaseId = protocol.draft.caseId;
      view = "protocol";
      render({ preserveWindow: false });
    },
  });
  window.addEventListener("tu:languagechange", () => {
    if (view === "form" && currentDraft) currentDraft = saveEthicsDraft(currentDraft, getLocale());
    render();
  });
}
