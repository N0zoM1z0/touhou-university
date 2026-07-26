import {
  appraisalAgencyLevels,
  appraisalDestinations,
  appraisalObject,
  appraisalObjects,
  appraisalReviewers,
} from "../data/appraisal.js";
import {
  appraisalDeskStatus,
  appraisalDraft,
  appraisalDrafts,
  appraisalRecord,
  appraisalRecords,
  assessAppraisal,
  clearAppraisalDraft,
  completeAppraisal,
  latestAppraisalFor,
  saveAppraisalDraft,
} from "./appraisal-model.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { getLocale } from "./i18n.js";
import { bindImeSafeInput } from "./ime-input.js";
import { renderPreservingState } from "./render-state.js";
import { siteHref } from "./site-router.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

const copy = {
  "zh-Hant": {
    eyebrow: "KOURINDOU × MISTY LAKE LIBRARY",
    title: "外界漂流物鑑定所",
    lead: "名稱、原用途、現在能拿來做什麼，是三個不同問題。香霖堂看名字，圖書館保存證據，河童盯著接口；物品本身若有意見，也會被寫進案卷。",
    open: "鑑定桌開放中",
    closed: "今日鑑定桌已收起",
    libraryHours: "圖書館",
    queue: "待鑑定",
    queueUnit: "件",
    weekly: "本週漂流物",
    liveNotice: "木牌值班通告",
    desk: "鑑定台",
    archive: "我的案卷",
    draftCount: "份草稿",
    recordCount: "份案卷",
    selectObject: "漂流物送件架",
    scrollObjects: "送件架可左右翻動，共八件",
    selected: "目前在桌上",
    arrival: "發現與移交",
    condition: "到件狀態",
    lastRecord: "最近案卷",
    noRecord: "尚未結案",
    stepEvidence: "一、先看物，不要先看答案",
    evidenceLead: "勾選你真正採用的觀察。至少兩項；標記與磨損通常比直覺更會說實話。",
    reviewed: "已採用",
    stepHypothesis: "二、提出原用途假說",
    hypothesisLead: "霖之助能看出名稱與用途，卻不保證知道操作方式；你仍需讓證據接得上。",
    stepTests: "三、選擇非侵入式測試",
    testsLead: "至少一項、最多三項。鑑定所不會因為河童帶了螺絲刀就把拆殼算成必要步驟。",
    method: "方法",
    observation: "觀察結果",
    stepUse: "四、安排它在幻想鄉的下一段用途",
    currentUse: "新用途",
    chooseUse: "選擇一項可說明的現在用途",
    destination: "移交去處",
    agency: "物品意志觀察",
    fieldNote: "現場筆記",
    fieldPlaceholder: "記錄一項仍然不確定的地方、版本缺口，或物品對處置的反應……",
    autosaved: "草稿保存在這台裝置",
    clear: "清空這張草稿",
    submit: "送交四方鑑定會",
    incomplete: "還不能結案：至少採用兩項證據、一項測試，並填妥原用途、新用途、去處與意志觀察。",
    saved: "鑑定案卷已裝訂，My TU 與校園事件帳本也收到副本。",
    cleared: "桌面已清空；過去案卷沒有被丟掉。",
    supported: "用途獲得充分支持",
    provisional: "暫定用途，等待更多接口或版本證據",
    unsupported: "原用途未獲支持",
    contested: "紅鉛筆爭議保存",
    score: "鑑定完整度",
    evidence: "採用證據",
    tests: "完成測試",
    proposed: "你提出的原用途",
    identified: "鑑定所重建的原用途",
    operation: "可能操作方式",
    caution: "不得被結論洗掉的限制",
    nextUse: "幻想鄉新用途",
    assigned: "去處",
    agencyResult: "意志判讀",
    panel: "四方會議頁邊意見",
    correction: "本案同時訂正一份較早的爭議案卷",
    retainedBy: "同意保留者",
    retentionReason: "保存理由",
    share: "複製案卷連結",
    shared: "案卷連結已複製。",
    openBbs: "去看 BBS 怎麼吵",
    startAnother: "回到這件物品再做一次鑑定",
    archiveTitle: "這台裝置保存的鑑定案卷",
    archiveLead: "錯誤、暫定與訂正都留在原位置。重新鑑定會新增一份案卷，不會把舊用途改寫成從未存在。",
    noArchive: "尚無案卷。香霖堂說這代表所有東西都還可以暫不出售。",
    openRecord: "查看案卷",
    status: "結論",
    date: "裝訂時間",
    drafts: "未結草稿",
    continueDraft: "繼續鑑定",
    retentionTitle: "這個用途不成立。真的要留下嗎？",
    retentionLead: "證據沒有支持你選的原用途，但錯誤也可能保存一段幻想鄉如何理解外界。若堅持保留，案卷會永久標成爭議件並連動 BBS。",
    retentionWarning: "它不會因此變成正確答案。後續案卷、My TU 與 BBS 都會保留「未獲支持」標記。",
    reviewer: "願意署名保留的審閱者",
    reason: "為什麼值得保存",
    reasonPlaceholder: "例如：能保存一種具代表性的錯認、形成新的可測問題，或物品本人堅持這個用途……",
    confirm: "我明白這項原用途沒有得到證據支持，仍要求以爭議案卷保存。",
    cancel: "拿回桌上重做",
    bind: "用紅鉛筆裝訂，讓 BBS 自行負責",
    retentionIncomplete: "請選擇署名者、寫下保存理由並確認警告。",
    outsiderDesk: "外界物不是謎語道具；它們曾經被使用、淘汰、修不好，然後才抵達這裡。",
  },
  ja: {
    eyebrow: "KOURINDOU × MISTY LAKE LIBRARY",
    title: "外界漂流物鑑定所",
    lead: "名称、元の用途、幻想郷で今何に使うかは別の問い。香霖堂は名を見て、図書館は証拠を残し、河童は端子を見つめる。物が異議を唱えれば、それも記録する。",
    open: "鑑定机は受付中",
    closed: "本日の鑑定机は終了",
    libraryHours: "図書館",
    queue: "鑑定待ち",
    queueUnit: "点",
    weekly: "今週の漂流物",
    liveNotice: "木札当番告知",
    desk: "鑑定台",
    archive: "私の記録",
    draftCount: "件の下書き",
    recordCount: "件の記録",
    selectObject: "漂流物受付棚",
    scrollObjects: "棚は左右へ送れます・全八件",
    selected: "現在机上",
    arrival: "発見・移管",
    condition: "受入状態",
    lastRecord: "最新記録",
    noRecord: "未終結",
    stepEvidence: "一、答えより先に物を見る",
    evidenceLead: "実際に採用する観察を選択。最低二件。印と摩耗は直感よりよく語る。",
    reviewed: "採用済み",
    stepHypothesis: "二、元用途の仮説を立てる",
    hypothesisLead: "霖之助は名称と用途を知っても、操作法まで保証しない。証拠をつなぐ必要がある。",
    stepTests: "三、非侵襲試験を選ぶ",
    testsLead: "最低一件、最大三件。河童がドライバーを持参しただけで分解を必要工程にはしない。",
    method: "方法",
    observation: "観察結果",
    stepUse: "四、幻想郷での次の用途を決める",
    currentUse: "新用途",
    chooseUse: "説明できる現在用途を選択",
    destination: "移管先",
    agency: "物の意思観察",
    fieldNote: "現場メモ",
    fieldPlaceholder: "残る不確実性、版の欠落、または処置への物の反応を記録……",
    autosaved: "下書きはこの端末へ保存",
    clear: "この下書きを消去",
    submit: "四者鑑定会へ送る",
    incomplete: "終結不可：証拠二件、試験一件以上と、元用途・新用途・移管先・意思観察を入力してください。",
    saved: "鑑定記録を綴じ、My TU と学内事象帳にも副本を送りました。",
    cleared: "机を片付けました。過去記録は捨てていません。",
    supported: "用途は十分に支持",
    provisional: "暫定用途・追加端子または版証拠待ち",
    unsupported: "元用途は支持されず",
    contested: "赤鉛筆係争保存",
    score: "鑑定完成度",
    evidence: "採用証拠",
    tests: "実施試験",
    proposed: "提出した元用途",
    identified: "鑑定所が再構成した元用途",
    operation: "想定操作",
    caution: "結論で消してはいけない制限",
    nextUse: "幻想郷での新用途",
    assigned: "移管先",
    agencyResult: "意思判定",
    panel: "四者会議欄外意見",
    correction: "本記録は以前の係争記録一件も訂正",
    retainedBy: "保存署名者",
    retentionReason: "保存理由",
    share: "記録リンクをコピー",
    shared: "記録リンクをコピーしました。",
    openBbs: "BBS の議論を見る",
    startAnother: "この品を再鑑定",
    archiveTitle: "この端末に保存された鑑定記録",
    archiveLead: "誤り・暫定・訂正を元の位置に残す。再鑑定は新記録となり、旧用途をなかったことにしない。",
    noArchive: "記録はまだありません。香霖堂いわく、すべて当面非売品ということです。",
    openRecord: "記録を見る",
    status: "結論",
    date: "綴じ時刻",
    drafts: "未完下書き",
    continueDraft: "鑑定を続ける",
    retentionTitle: "この用途は成立しません。それでも残しますか？",
    retentionLead: "証拠は選択した元用途を支持しません。ただし誤りも、幻想郷が外界をどう理解したかを残せます。保存する場合は係争記録として永久表示し、BBSへ連動します。",
    retentionWarning: "正解には変わりません。後続記録・My TU・BBSにも「支持されず」を残します。",
    reviewer: "保存へ署名する査読者",
    reason: "保存する価値",
    reasonPlaceholder: "代表的な誤認、新たな検証問題、物自身が用途を主張した、など……",
    confirm: "この元用途が証拠で支持されないことを理解し、係争記録としての保存を求めます。",
    cancel: "机へ戻して再考",
    bind: "赤鉛筆で綴じ、BBSには自分で責任を取らせる",
    retentionIncomplete: "署名者・保存理由・警告確認を揃えてください。",
    outsiderDesk: "外界物は謎解きの小道具ではない。使われ、廃れ、直せなくなってから、ここへ来た。",
  },
  en: {
    eyebrow: "KOURINDOU × MISTY LAKE LIBRARY",
    title: "Outside World Drift-Object Appraisal Office",
    lead: "A name, an original purpose, and a useful life in Gensokyo are three different questions. Kourindou sees names, the library keeps evidence, and the kappa stare at ports. If the object objects, that enters the file too.",
    open: "Appraisal desk accepting cases",
    closed: "Appraisal desk closed for today",
    libraryHours: "Library",
    queue: "Awaiting appraisal",
    queueUnit: "objects",
    weekly: "Drift object of the week",
    liveNotice: "Duty notice on the wooden board",
    desk: "Appraisal bench",
    archive: "My case files",
    draftCount: "drafts",
    recordCount: "files",
    selectObject: "Drift-object intake shelf",
    scrollObjects: "Slide the shelf left or right · 8 files",
    selected: "Currently on the bench",
    arrival: "Recovery and transfer",
    condition: "Intake condition",
    lastRecord: "Latest file",
    noRecord: "Not yet closed",
    stepEvidence: "One — Look at the object before the answer",
    evidenceLead: "Select observations you actually use. At least two; markings and wear usually speak more reliably than intuition.",
    reviewed: "Used",
    stepHypothesis: "Two — Propose the original purpose",
    hypothesisLead: "Rinnosuke may see name and purpose without receiving an operating manual. Your evidence still has to connect.",
    stepTests: "Three — Choose non-invasive tests",
    testsLead: "At least one and at most three. A kappa bringing a screwdriver does not make disassembly necessary.",
    method: "Method",
    observation: "Observation",
    stepUse: "Four — Give it a next life in Gensokyo",
    currentUse: "New use",
    chooseUse: "Choose a present use you can explain",
    destination: "Destination",
    agency: "Object-agency observation",
    fieldNote: "Field note",
    fieldPlaceholder: "Record one remaining uncertainty, version gap, or the object’s reaction to its proposed treatment…",
    autosaved: "Draft saved on this device",
    clear: "Clear this draft",
    submit: "Send to the four-party appraisal meeting",
    incomplete: "The file cannot close: use at least two evidence items and one test, then complete original use, new use, destination, and agency observation.",
    saved: "The appraisal file is bound; My TU and the campus event ledger received copies.",
    cleared: "The bench is clear. Previous case files were not discarded.",
    supported: "Purpose well supported",
    provisional: "Provisional purpose pending more port or version evidence",
    unsupported: "Original-purpose claim unsupported",
    contested: "Red-pencil contested preservation",
    score: "Appraisal completeness",
    evidence: "Evidence used",
    tests: "Tests completed",
    proposed: "Your proposed original purpose",
    identified: "Original purpose reconstructed by the office",
    operation: "Likely operation",
    caution: "Limit the conclusion must not erase",
    nextUse: "New Gensokyo use",
    assigned: "Destination",
    agencyResult: "Agency reading",
    panel: "Four-party marginal opinions",
    correction: "This file also corrects an earlier contested appraisal",
    retainedBy: "Retention signatory",
    retentionReason: "Reason retained",
    share: "Copy file link",
    shared: "Case-file link copied.",
    openBbs: "See what the BBS did with it",
    startAnother: "Appraise this object again",
    archiveTitle: "Appraisal files retained on this device",
    archiveLead: "Errors, provisional readings, and corrections remain where they occurred. Reappraisal creates a new file rather than pretending an older purpose never existed.",
    noArchive: "No files yet. Kourindou says this means everything remains not for sale for now.",
    openRecord: "Open file",
    status: "Finding",
    date: "Bound",
    drafts: "Unfinished drafts",
    continueDraft: "Continue appraisal",
    retentionTitle: "This use did not hold. Keep it anyway?",
    retentionLead: "The evidence did not support the selected original purpose. An error can still preserve how Gensokyo understood an Outside object. If retained, it stays visibly contested and generates BBS reactions.",
    retentionWarning: "Retention does not make it correct. Later files, My TU, and BBS will all keep the UNSUPPORTED mark.",
    reviewer: "Reviewer willing to sign retention",
    reason: "Why it deserves a record",
    reasonPlaceholder: "For example: a representative misreading, a useful new test question, or the object itself insists on this use…",
    confirm: "I understand that evidence did not support this proposed original purpose and still request a contested record.",
    cancel: "Return it to the bench",
    bind: "Bind in red pencil and let the BBS answer for itself",
    retentionIncomplete: "Choose a signatory, state a reason, and confirm the warning.",
    outsiderDesk: "Outside objects are not riddle props. They were used, superseded, made unrepairable—and only then arrived here.",
  },
};

let app;
let retentionDialog;
let retentionForm;
let selectedObjectId;
let selectedRecordId = null;
let mode = "desk";
let message = "";
let clockTimer;

function localized(value, locale = getLocale()) {
  return value?.[locale] || value?.["zh-Hant"] || "";
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[character]));
}

function formatDate(value, locale = getLocale(), withTime = true) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, withTime
    ? { dateStyle: "medium", timeStyle: "short" }
    : { dateStyle: "medium" }).format(date);
}

function verdictLabel(record, c) {
  if (record.disposition === "contested") return c.contested;
  return record.verdict === "supported" ? c.supported : record.verdict === "unsupported" ? c.unsupported : c.provisional;
}

function statusPanel(locale, c) {
  const status = appraisalDeskStatus(locale);
  return `
    <aside class="appraisal-live-board ${status.open ? "is-open" : "is-closed"}">
      <div>
        <span>${status.open ? c.open : c.closed}</span>
        <strong>${status.library?.hours || "—"}</strong>
        <small>${c.libraryHours} · ${status.library?.note || "—"}</small>
      </div>
      <div><span>${c.queue}</span><strong>${status.queue}</strong><small>${c.queueUnit}</small></div>
      <div><span>${c.weekly}</span><strong>${escapeHtml(localized(status.weeklyObject.name, locale))}</strong><small>${escapeHtml(status.weeklyObject.code)}</small></div>
      <p><b>${c.liveNotice}</b>${escapeHtml(status.notice)}</p>
    </aside>`;
}

function objectShelf(locale, c) {
  return `
    <section class="appraisal-object-shelf">
      <header>
        <div><p>INTAKE / SERIES O-77</p><h3>${c.selectObject}</h3></div>
        <span>${c.outsiderDesk}<small>${c.scrollObjects} →</small></span>
      </header>
      <div data-preserve-scroll="appraisal-objects">
        ${appraisalObjects.map((object) => {
          const active = object.id === selectedObjectId;
          const latest = latestAppraisalFor(object.id);
          return `
            <button type="button" data-appraisal-object="${object.id}" aria-pressed="${active}">
              <i aria-hidden="true">${object.glyph}</i>
              <span><small>${object.code}</small><strong>${escapeHtml(localized(object.name, locale))}</strong></span>
              <b>${latest ? latest.disposition === "contested" ? "?" : "✓" : "·"}</b>
            </button>`;
        }).join("")}
      </div>
    </section>`;
}

function evidenceCards(object, draft, locale, c) {
  return object.evidence.map((item, index) => {
    const active = draft.evidenceIds.includes(item.id);
    return `
      <button type="button" class="appraisal-evidence-card" data-appraisal-evidence="${item.id}" aria-pressed="${active}">
        <span>0${index + 1}</span>
        <div><strong>${escapeHtml(localized(item.label, locale))}</strong><p>${escapeHtml(localized(item.detail, locale))}</p></div>
        <b>${active ? c.reviewed : "+"}</b>
      </button>`;
  }).join("");
}

function hypothesisCards(object, draft, locale) {
  return object.hypotheses.map((item) => {
    const active = draft.hypothesisId === item.id;
    return `
      <button type="button" data-appraisal-hypothesis="${item.id}" aria-pressed="${active}">
        <strong>${escapeHtml(localized(item.title, locale))}</strong>
        <span>${escapeHtml(localized(item.claim, locale))}</span>
        <i aria-hidden="true">${active ? "●" : "○"}</i>
      </button>`;
  }).join("");
}

function testCards(object, draft, locale, c) {
  return object.tests.map((item, index) => {
    const active = draft.testIds.includes(item.id);
    return `
      <article class="appraisal-test-card ${active ? "is-run" : ""}">
        <button type="button" data-appraisal-test="${item.id}" aria-pressed="${active}">
          <span>T-${index + 1}</span><strong>${escapeHtml(localized(item.title, locale))}</strong><i aria-hidden="true">${active ? "−" : "+"}</i>
        </button>
        <div>
          <p><b>${c.method}</b>${escapeHtml(localized(item.method, locale))}</p>
          ${active ? `<p class="appraisal-test-result"><b>${c.observation}</b>${escapeHtml(localized(item.result, locale))}</p>` : ""}
        </div>
      </article>`;
  }).join("");
}

function useOptions(object, draft, locale, c) {
  return `
    <label>${c.currentUse}
      <select name="useId" data-appraisal-field="useId" data-preserve-focus="appraisal-use">
        <option value="">${c.chooseUse}</option>
        ${object.uses.map((item) => `<option value="${item.id}" ${draft.useId === item.id ? "selected" : ""}>${escapeHtml(localized(item.title, locale))}</option>`).join("")}
      </select>
    </label>
    ${draft.useId ? `<p class="appraisal-use-note">${escapeHtml(localized(object.uses.find((item) => item.id === draft.useId)?.note, locale))}</p>` : ""}`;
}

function destinationCards(draft, locale) {
  return Object.entries(appraisalDestinations).map(([id, destination]) => {
    const active = draft.destinationId === id;
    return `
      <button type="button" data-appraisal-destination="${id}" aria-pressed="${active}">
        <i aria-hidden="true">${destination.glyph}</i>
        <span><strong>${escapeHtml(localized(destination.name, locale))}</strong><small>${escapeHtml(localized(destination.note, locale))}</small></span>
      </button>`;
  }).join("");
}

function recordView(record, locale, c, { embedded = false } = {}) {
  if (!record) return "";
  const object = appraisalObject(record.objectId);
  const hypothesis = object?.hypotheses.find((item) => item.id === record.hypothesisId);
  const useChoice = object?.uses.find((item) => item.id === record.useId);
  const destination = appraisalDestinations[record.destinationId];
  const agency = appraisalAgencyLevels[record.agencyId];
  const reviewer = appraisalReviewers[record.reviewerId];
  return `
    <article class="appraisal-record ${record.disposition === "contested" ? "is-contested" : ""}${embedded ? " is-embedded" : ""}" id="appraisal-record-${escapeHtml(record.id)}">
      <header>
        <div><p>${escapeHtml(object?.code || record.objectId)} · ${escapeHtml(record.id)}</p><h3>${escapeHtml(localized(object?.name, locale))}</h3></div>
        <span data-verdict="${record.disposition === "contested" ? "contested" : record.verdict}">${verdictLabel(record, c)}</span>
      </header>
      ${record.disposition === "contested" ? `<div class="appraisal-contested-warning"><strong>${c.unsupported}</strong><p>${c.retentionWarning}</p></div>` : ""}
      <div class="appraisal-record-score"><span>${c.score}</span><strong>${record.score}</strong><small>/ 100</small></div>
      <dl class="appraisal-record-findings">
        <div><dt>${c.proposed}</dt><dd>${escapeHtml(localized(hypothesis?.title, locale))}</dd></div>
        <div><dt>${c.identified}</dt><dd>${escapeHtml(localized(object?.truth.intended, locale))}</dd></div>
        <div><dt>${c.operation}</dt><dd>${escapeHtml(localized(object?.truth.operation, locale))}</dd></div>
        <div class="warning"><dt>${c.caution}</dt><dd>${escapeHtml(localized(object?.truth.caution, locale))}</dd></div>
        <div><dt>${c.nextUse}</dt><dd>${escapeHtml(localized(useChoice?.title, locale))}</dd></div>
        <div><dt>${c.assigned}</dt><dd>${escapeHtml(localized(destination?.name, locale))}</dd></div>
        <div><dt>${c.agencyResult}</dt><dd>${escapeHtml(localized(agency, locale))}</dd></div>
        <div><dt>${c.evidence} / ${c.tests}</dt><dd>${record.evidenceIds.length}/${object?.evidence.length || 0} · ${record.testIds.length}/${object?.tests.length || 0}</dd></div>
      </dl>
      ${record.fieldNote ? `<blockquote class="appraisal-field-note">${escapeHtml(record.fieldNote)}</blockquote>` : ""}
      ${record.correctionOf ? `<p class="appraisal-correction">${c.correction} · <code>${escapeHtml(record.correctionOf)}</code></p>` : ""}
      ${reviewer ? `<div class="appraisal-retention-meta"><span>${c.retainedBy}</span><strong>${escapeHtml(localized(reviewer.name, locale))}</strong><span>${c.retentionReason}</span><p>${escapeHtml(record.retentionReason)}</p></div>` : ""}
      <section class="appraisal-panel-notes">
        <h4>${c.panel}</h4>
        <div>${Object.entries(appraisalReviewers).map(([id, member]) => `
          <article>
            <header><i aria-hidden="true">${id === "rinnosuke" ? "香" : id === "ran" ? "藍" : id === "nitori" ? "河" : "傘"}</i><div><strong>${escapeHtml(localized(member.name, locale))}</strong><span>${escapeHtml(localized(member.role, locale))}</span></div></header>
            <p>「${escapeHtml(localized(object?.panel[id], locale))}」</p>
          </article>`).join("")}</div>
      </section>
      <footer>
        <time datetime="${escapeHtml(record.createdAt)}">${c.date} · ${formatDate(record.createdAt, locale)}</time>
        <div>
          <button class="button button-secondary" type="button" data-appraisal-share="${escapeHtml(record.id)}">${c.share}</button>
          <a class="button button-secondary" href="${siteHref(`bbs-appraisal-${record.id}`)}">${c.openBbs}</a>
          <button class="button button-primary" type="button" data-appraisal-restart="${escapeHtml(record.objectId)}">${c.startAnother}</button>
        </div>
      </footer>
    </article>`;
}

function workbench(locale, c) {
  const object = appraisalObject(selectedObjectId) || appraisalObjects[0];
  const draft = appraisalDraft(object.id);
  const latest = latestAppraisalFor(object.id);
  const assessment = assessAppraisal(object.id, draft);
  return `
    <section class="appraisal-workbench" id="appraisal-object-${object.id}" data-appraisal-workbench>
      <header class="appraisal-case-heading">
        <div class="appraisal-object-seal" aria-hidden="true">${object.glyph}</div>
        <div><p>${object.code} · ${c.selected}</p><h3>${escapeHtml(localized(object.name, locale))}</h3><span>${escapeHtml(localized(object.workingTitle, locale))}</span></div>
        <dl>
          <div><dt>${c.arrival}</dt><dd>${escapeHtml(localized(object.arrival, locale))}</dd></div>
          <div><dt>${c.condition}</dt><dd>${escapeHtml(localized(object.condition, locale))}</dd></div>
          <div><dt>${c.lastRecord}</dt><dd>${latest ? `${verdictLabel(latest, c)} · ${formatDate(latest.createdAt, locale, false)}` : c.noRecord}</dd></div>
        </dl>
      </header>
      ${message ? `<p class="appraisal-message" role="status">${escapeHtml(message)}</p>` : ""}
      <form data-appraisal-form>
        <fieldset class="appraisal-stage">
          <legend><span>01</span><strong>${c.stepEvidence}</strong><small>${c.evidenceLead}</small></legend>
          <div class="appraisal-evidence-grid">${evidenceCards(object, draft, locale, c)}</div>
        </fieldset>
        <fieldset class="appraisal-stage">
          <legend><span>02</span><strong>${c.stepHypothesis}</strong><small>${c.hypothesisLead}</small></legend>
          <div class="appraisal-hypotheses">${hypothesisCards(object, draft, locale)}</div>
        </fieldset>
        <fieldset class="appraisal-stage">
          <legend><span>03</span><strong>${c.stepTests}</strong><small>${c.testsLead}</small></legend>
          <div class="appraisal-tests">${testCards(object, draft, locale, c)}</div>
        </fieldset>
        <fieldset class="appraisal-stage appraisal-disposition">
          <legend><span>04</span><strong>${c.stepUse}</strong><small>${escapeHtml(localized(object.truth.caution, locale))}</small></legend>
          <div class="appraisal-use-fields">
            <div>${useOptions(object, draft, locale, c)}</div>
            <label>${c.agency}
              <select name="agencyId" data-appraisal-field="agencyId" data-preserve-focus="appraisal-agency">
                ${Object.entries(appraisalAgencyLevels).map(([id, label]) => `<option value="${id}" ${draft.agencyId === id ? "selected" : ""}>${escapeHtml(localized(label, locale))}</option>`).join("")}
              </select>
            </label>
          </div>
          <h4>${c.destination}</h4>
          <div class="appraisal-destinations">${destinationCards(draft, locale)}</div>
          <label class="appraisal-note">${c.fieldNote}
            <textarea name="fieldNote" rows="4" maxlength="800" data-appraisal-note data-preserve-focus="appraisal-note" placeholder="${escapeHtml(c.fieldPlaceholder)}">${escapeHtml(draft.fieldNote)}</textarea>
          </label>
        </fieldset>
        <footer class="appraisal-submit">
          <span><i aria-hidden="true">✓</i>${c.autosaved}<b>${assessment?.score || 0}/100</b></span>
          <button class="button button-secondary" type="button" data-appraisal-clear>${c.clear}</button>
          <button class="button button-primary" type="submit">${c.submit} <span aria-hidden="true">→</span></button>
        </footer>
      </form>
      ${latest ? recordView(latest, locale, c, { embedded: true }) : ""}
    </section>`;
}

function archiveView(locale, c) {
  const records = appraisalRecords().slice().reverse();
  const drafts = Object.values(appraisalDrafts()).filter((draft) => draft?.objectId);
  const selected = selectedRecordId ? appraisalRecord(selectedRecordId) : null;
  return `
    <section class="appraisal-archive">
      <header><div><p>LOCAL APPRAISAL REGISTER</p><h3>${c.archiveTitle}</h3></div><span>${c.archiveLead}</span></header>
      ${selected ? recordView(selected, locale, c) : ""}
      ${drafts.length ? `
        <section class="appraisal-draft-register">
          <h4>${c.drafts} · ${drafts.length}</h4>
          <div>${drafts.map((draft) => {
            const object = appraisalObject(draft.objectId);
            return `<button type="button" data-appraisal-continue="${draft.objectId}"><i aria-hidden="true">${object?.glyph || "物"}</i><span><strong>${escapeHtml(localized(object?.name, locale))}</strong><small>${formatDate(draft.updatedAt, locale)}</small></span><b>${c.continueDraft} →</b></button>`;
          }).join("")}</div>
        </section>` : ""}
      <div class="appraisal-register">
        ${records.length ? records.map((record) => {
          const object = appraisalObject(record.objectId);
          return `
            <article class="${record.disposition === "contested" ? "is-contested" : ""}">
              <i aria-hidden="true">${object?.glyph || "物"}</i>
              <div><p>${escapeHtml(record.id)} · ${escapeHtml(object?.code || "")}</p><h4>${escapeHtml(localized(object?.name, locale))}</h4><span>${c.status} · ${verdictLabel(record, c)}</span></div>
              <time datetime="${escapeHtml(record.createdAt)}">${formatDate(record.createdAt, locale)}</time>
              <button type="button" data-appraisal-record="${escapeHtml(record.id)}">${c.openRecord}</button>
            </article>`;
        }).join("") : `<p class="appraisal-empty">${c.noArchive}</p>`}
      </div>
    </section>`;
}

function renderContent() {
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  const stats = {
    drafts: Object.keys(appraisalDrafts()).length,
    records: appraisalRecords().length,
  };
  app.innerHTML = `
    <header class="appraisal-hero">
      <div>
        <p>${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
      </div>
      <blockquote>${c.outsiderDesk}</blockquote>
    </header>
    ${statusPanel(locale, c)}
    <nav class="appraisal-tabs" aria-label="${escapeHtml(c.title)}">
      <button type="button" data-appraisal-mode="desk" aria-selected="${mode === "desk"}"><span>01</span><strong>${c.desk}</strong><b>${stats.drafts} ${c.draftCount}</b></button>
      <button type="button" data-appraisal-mode="archive" aria-selected="${mode === "archive"}"><span>02</span><strong>${c.archive}</strong><b>${stats.records} ${c.recordCount}</b></button>
    </nav>
    ${mode === "desk" ? `${objectShelf(locale, c)}${workbench(locale, c)}` : archiveView(locale, c)}`;
}

function render({ preserveWindow = true } = {}) {
  if (!app) return;
  renderPreservingState(app, renderContent, { preserveWindow });
  bindControls();
}

function saveToggle(field, value) {
  const draft = appraisalDraft(selectedObjectId);
  const values = new Set(draft[field] || []);
  if (values.has(value)) values.delete(value);
  else values.add(value);
  saveAppraisalDraft(selectedObjectId, { [field]: [...values] });
  message = "";
  render();
}

function completeOrdinary() {
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  const result = completeAppraisal(selectedObjectId, appraisalDraft(selectedObjectId));
  if (result.error === "incomplete") {
    message = c.incomplete;
    render();
    return;
  }
  if (result.requiresContested) {
    openRetentionDialog();
    return;
  }
  finishRecord(result.record, c);
}

function finishRecord(record, c) {
  recordCampusEvent(
    "appraisal.completed",
    {
      appraisalId: record.id,
      objectId: record.objectId,
      verdict: record.verdict,
      disposition: record.disposition,
      destinationId: record.destinationId,
    },
    { id: `appraisal.completed:${record.id}`, timestamp: record.createdAt },
  );
  if (record.destinationId === "library") {
    recordCampusEvent(
      "appraisal.catalogued",
      { appraisalId: record.id, objectId: record.objectId, destinationId: record.destinationId },
      { id: `appraisal.catalogued:${record.id}`, timestamp: record.createdAt },
    );
  }
  selectedRecordId = record.id;
  mode = "archive";
  message = "";
  navigateToDeepLink(`appraisal-record-${record.id}`);
  render({ preserveWindow: false });
  showToast(c.saved);
}

function openRetentionDialog() {
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  const assessment = assessAppraisal(selectedObjectId, appraisalDraft(selectedObjectId));
  const content = retentionDialog?.querySelector("[data-appraisal-retention-content]");
  if (!assessment || !content) return;
  content.innerHTML = `
    <p class="appraisal-retention-kicker">RED-PENCIL DESK · ${escapeHtml(assessment.object.code)}</p>
    <h2>${c.retentionTitle}</h2>
    <p>${c.retentionLead}</p>
    <div class="appraisal-retention-warning"><strong>${c.unsupported}</strong><span>${c.retentionWarning}</span></div>
    <label>${c.reviewer}
      <select name="reviewerId" required>
        <option value="">—</option>
        ${Object.entries(appraisalReviewers).map(([id, reviewer]) => `<option value="${id}">${escapeHtml(localized(reviewer.name, locale))} · ${escapeHtml(localized(reviewer.role, locale))}</option>`).join("")}
      </select>
    </label>
    <label>${c.reason}
      <textarea name="retentionReason" rows="4" maxlength="600" required placeholder="${escapeHtml(c.reasonPlaceholder)}"></textarea>
    </label>
    <label class="appraisal-retention-check"><input type="checkbox" name="confirmed" required><span>${c.confirm}</span></label>
    <p class="appraisal-retention-error" data-appraisal-retention-error role="alert"></p>
    <footer>
      <button class="button button-secondary" type="button" data-appraisal-retention-cancel>${c.cancel}</button>
      <button class="button button-primary" type="submit">${c.bind}</button>
    </footer>`;
  retentionDialog.showModal();
}

async function copyRecordLink(recordId) {
  const c = copy[getLocale()] || copy["zh-Hant"];
  const url = new URL(window.location.href);
  url.hash = `appraisal-record-${recordId}`;
  try {
    await navigator.clipboard.writeText(url.href);
  } catch {
    const field = document.createElement("textarea");
    field.value = url.href;
    document.body.append(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
  showToast(c.shared);
}

function bindControls() {
  app.querySelectorAll("[data-appraisal-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      mode = button.dataset.appraisalMode;
      selectedRecordId = null;
      message = "";
      render();
    });
  });
  app.querySelectorAll("[data-appraisal-object]").forEach((button) => {
    button.addEventListener("click", () => navigateToDeepLink(`appraisal-object-${button.dataset.appraisalObject}`));
  });
  app.querySelectorAll("[data-appraisal-evidence]").forEach((button) => {
    button.addEventListener("click", () => saveToggle("evidenceIds", button.dataset.appraisalEvidence));
  });
  app.querySelectorAll("[data-appraisal-hypothesis]").forEach((button) => {
    button.addEventListener("click", () => {
      saveAppraisalDraft(selectedObjectId, { hypothesisId: button.dataset.appraisalHypothesis });
      message = "";
      render();
    });
  });
  app.querySelectorAll("[data-appraisal-test]").forEach((button) => {
    button.addEventListener("click", () => {
      const draft = appraisalDraft(selectedObjectId);
      if (!draft.testIds.includes(button.dataset.appraisalTest) && draft.testIds.length >= 3) return;
      saveToggle("testIds", button.dataset.appraisalTest);
    });
  });
  app.querySelectorAll("[data-appraisal-destination]").forEach((button) => {
    button.addEventListener("click", () => {
      saveAppraisalDraft(selectedObjectId, { destinationId: button.dataset.appraisalDestination });
      message = "";
      render();
    });
  });
  app.querySelectorAll("[data-appraisal-field]").forEach((field) => {
    field.addEventListener("change", () => {
      saveAppraisalDraft(selectedObjectId, { [field.dataset.appraisalField]: field.value });
      message = "";
      render();
    });
  });
  const note = app.querySelector("[data-appraisal-note]");
  bindImeSafeInput(note, () => saveAppraisalDraft(selectedObjectId, { fieldNote: note.value }), { debounce: 180 });
  app.querySelector("[data-appraisal-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (note) saveAppraisalDraft(selectedObjectId, { fieldNote: note.value });
    completeOrdinary();
  });
  app.querySelector("[data-appraisal-clear]")?.addEventListener("click", () => {
    const c = copy[getLocale()] || copy["zh-Hant"];
    clearAppraisalDraft(selectedObjectId);
    message = c.cleared;
    render();
  });
  app.querySelectorAll("[data-appraisal-record]").forEach((button) => {
    button.addEventListener("click", () => navigateToDeepLink(`appraisal-record-${button.dataset.appraisalRecord}`));
  });
  app.querySelectorAll("[data-appraisal-continue], [data-appraisal-restart]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.appraisalContinue || button.dataset.appraisalRestart;
      navigateToDeepLink(`appraisal-object-${id}`);
    });
  });
  app.querySelectorAll("[data-appraisal-share]").forEach((button) => {
    button.addEventListener("click", () => copyRecordLink(button.dataset.appraisalShare));
  });
}

function bindRetentionDialog() {
  retentionDialog?.querySelector("[data-appraisal-retention-close]")?.addEventListener("click", () => retentionDialog.close());
  retentionDialog?.addEventListener("click", (event) => {
    if (event.target === retentionDialog) retentionDialog.close();
  });
  retentionForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const c = copy[getLocale()] || copy["zh-Hant"];
    const values = Object.fromEntries(new FormData(retentionForm).entries());
    const result = completeAppraisal(selectedObjectId, appraisalDraft(selectedObjectId), {
      disposition: "contested",
      reviewerId: values.reviewerId,
      retentionReason: values.retentionReason,
      confirmed: values.confirmed === "on",
    });
    if (!result.record) {
      const error = retentionForm.querySelector("[data-appraisal-retention-error]");
      if (error) error.textContent = c.retentionIncomplete;
      return;
    }
    retentionDialog.close();
    finishRecord(result.record, c);
  });
  retentionDialog?.addEventListener("click", (event) => {
    if (event.target.closest("[data-appraisal-retention-cancel]")) retentionDialog.close();
  });
}

function initialState() {
  const route = safeDecodeFragment();
  const recordId = route.startsWith("appraisal-record-") ? route.slice("appraisal-record-".length) : "";
  const objectId = route.startsWith("appraisal-object-") ? route.slice("appraisal-object-".length) : "";
  const desk = appraisalDeskStatus(getLocale());
  if (recordId && appraisalRecord(recordId)) {
    selectedRecordId = recordId;
    selectedObjectId = appraisalRecord(recordId).objectId;
    mode = "archive";
    return;
  }
  selectedObjectId = appraisalObject(objectId)?.id || desk.weeklyObject.id;
  mode = route === "appraisal-records" ? "archive" : "desk";
}

export function initAppraisal() {
  app = document.querySelector("[data-appraisal-app]");
  retentionDialog = document.querySelector("[data-appraisal-retention-dialog]");
  retentionForm = document.querySelector("[data-appraisal-retention-form]");
  if (!app) return;
  initialState();
  render({ preserveWindow: false });
  bindRetentionDialog();
  registerDeepLink("appraisal-object-", {
    anchor: (route) => document.getElementById(route) || app,
    position: "always",
    open(id) {
      const object = appraisalObject(id);
      if (!object) return;
      selectedObjectId = object.id;
      selectedRecordId = null;
      mode = "desk";
      message = "";
      render();
    },
    close() {},
  });
  registerDeepLink("appraisal-record-", {
    anchor: (route) => document.getElementById(route) || app,
    position: "always",
    open(id) {
      const record = appraisalRecord(id);
      if (!record) return;
      selectedRecordId = record.id;
      selectedObjectId = record.objectId;
      mode = "archive";
      message = "";
      render();
    },
    close() {},
  });
  window.addEventListener("tu:languagechange", () => render());
  clockTimer = window.setInterval(() => render(), 60_000);
  window.addEventListener("pagehide", () => window.clearInterval(clockTimer), { once: true });
}
