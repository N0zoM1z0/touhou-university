import { libraryFacets, libraryHolding, libraryHoldings } from "../data/library.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { getLocale } from "./i18n.js";
import { bindImeSafeInput } from "./ime-input.js";
import { renderPreservingState } from "./render-state.js";
import { showToast } from "./ui.js";

const LOANS_KEY = "tu:library:loans";
const HOLDS_KEY = "tu:library:holds";
const IDENTITY_KEY = "tu:identity";
const REGISTRATION_KEY = "tu:courses:registration";
const TRANSCRIPT_KEY = "tu:courses:transcript";
const MAX_LOANS = 5;

const copy = {
  "zh-Hant": {
    eyebrow: "MISTY LAKE LIBRARY / 霧湖圖書館",
    title: "書不一定安靜，但借閱紀錄必須說得清楚。",
    lead: "搜尋館藏、借出在架書、為外借或離架中的書排隊，並在期限內續借。所有操作只保存在這台裝置。",
    open: "今日開館",
    hours: "08:10—月上樹梢",
    holdings: "可檢索館藏",
    available: "目前在架",
    strange: "異常書況",
    desk: "借閱桌",
    catalogue: "館藏目錄",
    myLibrary: "我的借閱",
    activeBadge: "項進行中",
    search: "搜尋題名、作者、索書號、主題或館員備註",
    allSchools: "全部分類",
    allStates: "所有書況",
    allDangers: "所有風險",
    result: "筆館藏",
    reset: "清除篩選",
    openRecord: "查看館藏",
    noResults: "沒有書願意承認自己符合這組條件。少寫一點，或把風險篩選放寬。",
    details: "館藏檔案",
    callNumber: "索書號",
    author: "責任者",
    subject: "主題",
    edition: "版本",
    origin: "來源",
    location: "館藏地",
    disposition: "自主傾向",
    danger: "閱覽風險",
    state: "目前書況",
    terms: "借閱條件",
    days: "日",
    renewals: "次續借",
    courseGate: "指定課程",
    courseGateBody: "完成或正在修讀下列任一課程後，借閱櫃檯才會解開書扣：",
    eligible: "資格已確認",
    ineligible: "尚未取得借閱資格",
    borrow: "借閱本書",
    placeHold: "排入預約",
    renew: "續借",
    return: "歸還",
    cancelHold: "取消預約",
    reference: "僅供館內閱覽",
    unavailable: "目前不可借閱或預約",
    identityNeeded: "建立 My TU 身分後即可借閱與預約；目錄仍可自由查看。",
    createIdentity: "建立 My TU 身分",
    maxLoans: "一次最多借閱 5 項館藏；請先歸還一本。",
    courseNeeded: "這本書的書扣只認指定課程的修讀記錄。",
    alreadyLoaned: "這本書已在你的借閱袋裡。",
    alreadyHeld: "你已經在這本書的預約隊列中。",
    borrowed: "借閱完成。館員在回條上多蓋了一個看不懂的月亮。",
    held: "已排入預約。書抵達借閱桌後，紙鶴會在本頁留下通知。",
    renewed: "續借完成；新的期限已寫回本機借閱證。",
    returned: "已歸還。書架暫時同意收下它。",
    holdCancelled: "預約已取消；隊列向前挪了一格。",
    renewalLimit: "本書已用完可續借次數。",
    renewalBlocked: "已有讀者預約此書，不能再續借。",
    due: "到期",
    overdue: "逾期",
    borrowedOn: "借於",
    holdPlaced: "預約於",
    queue: "預約順位",
    activeLoans: "借閱中的館藏",
    activeHolds: "等待中的預約",
    history: "借閱與預約歷史",
    noLoans: "借閱袋目前是空的，只有一張不知誰放進去的香霖堂收據。",
    noHolds: "沒有等待中的預約。",
    noHistory: "尚無借閱歷史。館員對此保持禮貌，但略感無聊。",
    returnedStatus: "已歸還",
    cancelledStatus: "已取消",
    printReceipt: "開啟借閱回條",
    receiptTitle: "霧湖圖書館借閱回條",
    receiptSubtitle: "本機借閱證副本",
    borrower: "借閱人",
    libraryCard: "借閱證號",
    issued: "列印日期",
    receiptNote: "書籍若自行移架，歸還地仍以借閱回條所列霧湖圖書館為準。此回條由目前瀏覽器中的借閱記錄生成。",
    print: "列印／另存 PDF",
    closeReceipt: "返回圖書館",
    lunarNotice: "滿月書況由館員在當夜更新；手電筒不算月相。",
    holdPosition: "本機預約第 1 位",
  },
  ja: {
    eyebrow: "MISTY LAKE LIBRARY / 霧の湖図書館",
    title: "本は静かとは限らない。貸出記録は明確でなければならない。",
    lead: "蔵書を検索し、在架本を借り、貸出中・離架中の本を予約し、期限内に更新できます。操作はこの端末だけに保存されます。",
    open: "本日開館",
    hours: "08:10—月が梢へ昇るまで",
    holdings: "検索可能資料",
    available: "現在在架",
    strange: "異常状態",
    desk: "貸出カウンター",
    catalogue: "蔵書検索",
    myLibrary: "利用状況",
    activeBadge: "件進行中",
    search: "書名、著者、請求記号、主題、司書注記を検索",
    allSchools: "全分類",
    allStates: "全資料状態",
    allDangers: "全リスク",
    result: "件",
    reset: "絞り込み解除",
    openRecord: "資料を見る",
    noResults: "この条件に該当すると認める本がありません。語を短くするか、リスク条件を広げてください。",
    details: "蔵書ファイル",
    callNumber: "請求記号",
    author: "責任表示",
    subject: "主題",
    edition: "版",
    origin: "由来",
    location: "所在",
    disposition: "自律傾向",
    danger: "閲覧リスク",
    state: "現在状態",
    terms: "貸出条件",
    days: "日",
    renewals: "回更新",
    courseGate: "指定科目",
    courseGateBody: "次のいずれかを修得または履修中の場合、カウンターが留め具を解除します：",
    eligible: "資格確認済",
    ineligible: "貸出資格未取得",
    borrow: "この本を借りる",
    placeHold: "予約列へ入る",
    renew: "貸出更新",
    return: "返却",
    cancelHold: "予約取消",
    reference: "館内閲覧のみ",
    unavailable: "現在は貸出・予約不可",
    identityNeeded: "My TU身分を作成すると貸出・予約できます。検索は自由に利用できます。",
    createIdentity: "My TU身分を作成",
    maxLoans: "同時貸出は5点までです。先に一冊返却してください。",
    courseNeeded: "この本の留め具は指定科目の履修記録だけを認めます。",
    alreadyLoaned: "この本はすでに貸出袋に入っています。",
    alreadyHeld: "この本の予約列へ登録済みです。",
    borrowed: "貸出完了。司書が読めない月印を一つ余分に押しました。",
    held: "予約しました。本がカウンターへ着くと紙鶴がこの頁へ通知を残します。",
    renewed: "更新完了。新しい期限を端末内貸出券へ記録しました。",
    returned: "返却しました。書架は一旦受入れに同意しました。",
    holdCancelled: "予約を取り消しました。列が一つ進みました。",
    renewalLimit: "この本は更新回数を使い切りました。",
    renewalBlocked: "予約者がいるため更新できません。",
    due: "返却期限",
    overdue: "延滞",
    borrowedOn: "貸出日",
    holdPlaced: "予約日",
    queue: "予約順位",
    activeLoans: "貸出中資料",
    activeHolds: "予約中資料",
    history: "貸出・予約履歴",
    noLoans: "貸出袋は空です。誰かが入れた香霖堂の領収書だけがあります。",
    noHolds: "予約中の資料はありません。",
    noHistory: "貸出履歴はまだありません。司書は丁寧ですが少し退屈そうです。",
    returnedStatus: "返却済",
    cancelledStatus: "取消済",
    printReceipt: "貸出票を開く",
    receiptTitle: "霧の湖図書館 貸出票",
    receiptSubtitle: "端末内利用券控え",
    borrower: "利用者",
    libraryCard: "利用券番号",
    issued: "印刷日",
    receiptNote: "本が自ら移架しても返却先は貸出票記載の霧の湖図書館です。この票は現在のブラウザ内貸出記録から生成されます。",
    print: "印刷／PDF保存",
    closeReceipt: "図書館へ戻る",
    lunarNotice: "満月資料は当夜に司書が更新します。懐中電灯は月相ではありません。",
    holdPosition: "端末内予約 1番",
  },
  en: {
    eyebrow: "MISTY LAKE LIBRARY",
    title: "Books need not be quiet. Their circulation records do.",
    lead: "Search the collection, borrow available books, queue for items away from the shelf, and renew before they are due. Every action stays on this device.",
    open: "Open today",
    hours: "08:10—moon above the trees",
    holdings: "Searchable holdings",
    available: "On shelf now",
    strange: "Unusual states",
    desk: "Circulation desk",
    catalogue: "Catalogue",
    myLibrary: "My library",
    activeBadge: "active",
    search: "Search title, author, call number, subject, or staff note",
    allSchools: "All collections",
    allStates: "All item states",
    allDangers: "All risks",
    result: "holdings",
    reset: "Clear filters",
    openRecord: "View holding",
    noResults: "No book admits to matching those conditions. Try fewer words or a wider risk filter.",
    details: "Holding record",
    callNumber: "Call number",
    author: "Responsibility",
    subject: "Subject",
    edition: "Edition",
    origin: "Provenance",
    location: "Location",
    disposition: "Autonomous tendency",
    danger: "Reading risk",
    state: "Current state",
    terms: "Loan terms",
    days: "days",
    renewals: "renewals",
    courseGate: "Course reserve",
    courseGateBody: "The desk releases this book clasp after you complete or enrol in one of:",
    eligible: "Eligibility confirmed",
    ineligible: "Borrowing eligibility missing",
    borrow: "Borrow this book",
    placeHold: "Place a hold",
    renew: "Renew",
    return: "Return",
    cancelHold: "Cancel hold",
    reference: "Library use only",
    unavailable: "Not available to borrow or hold",
    identityNeeded: "Create a My TU identity to borrow or place holds. The catalogue remains open to everyone.",
    createIdentity: "Create My TU identity",
    maxLoans: "You may borrow five holdings at once. Return one first.",
    courseNeeded: "This book clasp accepts only the specified course record.",
    alreadyLoaned: "This book is already in your loan bag.",
    alreadyHeld: "You are already in this book's hold queue.",
    borrowed: "Checked out. The librarian added one extra moon-shaped stamp nobody can read.",
    held: "Hold placed. When the book reaches the desk, a paper crane will leave a notice on this page.",
    renewed: "Renewed. The new due date is written into your on-device library card.",
    returned: "Returned. The shelf has provisionally agreed to take it.",
    holdCancelled: "Hold cancelled. The queue moved forward by one.",
    renewalLimit: "This book has used all permitted renewals.",
    renewalBlocked: "Another reader has a hold, so this loan cannot be renewed.",
    due: "Due",
    overdue: "Overdue",
    borrowedOn: "Borrowed",
    holdPlaced: "Placed",
    queue: "Queue",
    activeLoans: "Items on loan",
    activeHolds: "Waiting holds",
    history: "Loan & hold history",
    noLoans: "Your loan bag is empty except for a Kourindou receipt nobody remembers adding.",
    noHolds: "No holds are waiting.",
    noHistory: "No circulation history yet. The librarian is polite but slightly bored.",
    returnedStatus: "Returned",
    cancelledStatus: "Cancelled",
    printReceipt: "Open loan receipt",
    receiptTitle: "Misty Lake Library loan receipt",
    receiptSubtitle: "On-device library-card copy",
    borrower: "Borrower",
    libraryCard: "Library card",
    issued: "Printed",
    receiptNote: "If a book shelves itself elsewhere, its return destination remains Misty Lake Library. This receipt is generated from records in the current browser.",
    print: "Print / save PDF",
    closeReceipt: "Back to library",
    lunarNotice: "Full-moon states are updated by staff that night. A torch does not count as a lunar phase.",
    holdPosition: "On-device queue position 1",
  },
};

let app;
let selectedId = libraryHoldings[0]?.id;
let tab = "catalogue";
let filters = { query: "", school: "", state: "", danger: "" };

function readJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function localeText(value, locale = getLocale()) {
  return value?.[locale] ?? value?.["zh-Hant"] ?? value ?? "";
}

function formatDate(value, locale = getLocale(), withTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, withTime
    ? { dateStyle: "medium", timeStyle: "short" }
    : { dateStyle: "medium" }).format(date);
}

function addDays(value, days) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function makeId(prefix, holdingId) {
  return `${prefix}-${holdingId}-${Date.now().toString(36).toUpperCase()}`;
}

function loans() {
  const records = readJson(LOANS_KEY, []);
  return Array.isArray(records) ? records : [];
}

function holds() {
  const records = readJson(HOLDS_KEY, []);
  return Array.isArray(records) ? records : [];
}

function activeLoan(holdingId) {
  return loans().find((record) => record.holdingId === holdingId && record.status === "active");
}

function activeHold(holdingId) {
  return holds().find((record) => record.holdingId === holdingId && record.status === "active");
}

function activeLoanCount() {
  return loans().filter((record) => record.status === "active").length;
}

function activeHoldCount() {
  return holds().filter((record) => record.status === "active").length;
}

function effectiveState(holding) {
  if (activeLoan(holding.id)) return "onLoan";
  return holding.state;
}

function completedCourses() {
  const transcript = readJson(TRANSCRIPT_KEY, []);
  if (Array.isArray(transcript)) {
    return new Set(transcript.map((entry) => entry.courseCode || entry.code).filter(Boolean));
  }
  return new Set((transcript?.entries || []).map((entry) => entry.courseCode || entry.code).filter(Boolean));
}

function currentCourses() {
  const registration = readJson(REGISTRATION_KEY, []);
  const entries = Array.isArray(registration) ? registration : registration?.entries || [];
  return new Set(entries.filter((entry) => entry.status === "enrolled").map((entry) => entry.courseCode).filter(Boolean));
}

function hasCourseAccess(holding) {
  if (!holding.accessCourses?.length) return true;
  const eligible = new Set([...completedCourses(), ...currentCourses()]);
  return holding.accessCourses.some((code) => eligible.has(code));
}

function canHold(holding) {
  return holding.circulation === "loan" && ["onLoan", "flight", "negotiating"].includes(effectiveState(holding));
}

function filterHoldings(locale) {
  const terms = filters.query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return libraryHoldings.filter((holding) => {
    const haystack = [
      holding.callNumber,
      ...Object.values(holding.title),
      ...Object.values(holding.author),
      ...Object.values(holding.subject),
      ...Object.values(holding.note),
    ].join(" ").toLocaleLowerCase();
    return (!terms.length || terms.every((term) => haystack.includes(term)))
      && (!filters.school || holding.school === filters.school)
      && (!filters.state || effectiveState(holding) === filters.state)
      && (!filters.danger || holding.danger === filters.danger);
  });
}

function buttonFor(holding, locale, c) {
  const identity = readJson(IDENTITY_KEY, null);
  const loan = activeLoan(holding.id);
  const hold = activeHold(holding.id);
  if (loan) {
    const blocked = loan.renewals >= holding.renewalLimit || holds().some((record) => record.holdingId === holding.id && record.status === "active");
    const reason = loan.renewals >= holding.renewalLimit ? c.renewalLimit : c.renewalBlocked;
    return `
      <div class="library-detail-actions">
        <button class="button button-secondary" type="button" data-library-renew="${holding.id}" ${blocked ? `disabled title="${escapeHtml(reason)}"` : ""}>${c.renew} · ${formatDate(loan.dueAt, locale)}</button>
        <button class="button button-primary" type="button" data-library-return="${holding.id}">${c.return} <span aria-hidden="true">↩</span></button>
      </div>`;
  }
  if (hold) {
    return `
      <div class="library-detail-actions">
        <span class="library-queue-ticket">${c.holdPosition}</span>
        <button class="button button-secondary" type="button" data-library-cancel-hold="${holding.id}">${c.cancelHold}</button>
      </div>`;
  }
  if (!identity) {
    return `
      <div class="library-gate">
        <p>${c.identityNeeded}</p>
        <a class="button button-primary" href="mytu.html#my-tu">${c.createIdentity} <span aria-hidden="true">→</span></a>
      </div>`;
  }
  if (!hasCourseAccess(holding)) {
    return `<button class="button button-secondary library-wide-action" type="button" disabled title="${escapeHtml(c.courseNeeded)}">${c.courseNeeded}</button>`;
  }
  if (effectiveState(holding) === "available" && holding.circulation === "loan") {
    const blocked = activeLoanCount() >= MAX_LOANS;
    return `<button class="button button-primary library-wide-action" type="button" data-library-borrow="${holding.id}" ${blocked ? `disabled title="${escapeHtml(c.maxLoans)}"` : ""}>${c.borrow} <span aria-hidden="true">→</span></button>`;
  }
  if (canHold(holding)) {
    return `<button class="button button-primary library-wide-action" type="button" data-library-hold="${holding.id}">${c.placeHold} <span aria-hidden="true">＋</span></button>`;
  }
  return `<button class="button button-secondary library-wide-action" type="button" disabled>${holding.circulation === "reference" ? c.reference : c.unavailable}</button>`;
}

function detailRecord(holding, locale, c) {
  const state = effectiveState(holding);
  const stateLabel = localeText(libraryFacets.states[state], locale);
  const courseGate = holding.accessCourses?.length
    ? `<aside class="library-course-gate ${hasCourseAccess(holding) ? "is-open" : ""}">
        <div aria-hidden="true">${hasCourseAccess(holding) ? "✓" : "封"}</div>
        <p><strong>${c.courseGate} · ${hasCourseAccess(holding) ? c.eligible : c.ineligible}</strong><span>${c.courseGateBody} ${holding.accessCourses.join(" / ")}</span></p>
      </aside>`
    : "";
  return `
    <article class="library-record" data-library-record="${holding.id}">
      <header>
        <p>${c.details} / ${escapeHtml(holding.callNumber)}</p>
        <span class="library-state" data-state="${state}">${escapeHtml(stateLabel)}</span>
        <h2>${escapeHtml(localeText(holding.title, locale))}</h2>
        <strong>${escapeHtml(localeText(holding.author, locale))}</strong>
      </header>
      <blockquote>${escapeHtml(localeText(holding.note, locale))}</blockquote>
      <dl>
        <div><dt>${c.callNumber}</dt><dd><code>${escapeHtml(holding.callNumber)}</code></dd></div>
        <div><dt>${c.subject}</dt><dd>${escapeHtml(localeText(holding.subject, locale))}</dd></div>
        <div><dt>${c.edition}</dt><dd>${escapeHtml(localeText(holding.edition, locale))}</dd></div>
        <div><dt>${c.origin}</dt><dd>${escapeHtml(localeText(holding.origin, locale))}</dd></div>
        <div><dt>${c.location}</dt><dd>${escapeHtml(localeText(holding.location, locale))}</dd></div>
        <div><dt>${c.disposition}</dt><dd>${escapeHtml(localeText(libraryFacets.wills[holding.will], locale))}</dd></div>
        <div><dt>${c.danger}</dt><dd>${escapeHtml(localeText(libraryFacets.dangers[holding.danger], locale))}</dd></div>
        <div><dt>${c.terms}</dt><dd>${holding.circulation === "loan" ? `${holding.loanDays} ${c.days} · ${holding.renewalLimit} ${c.renewals}` : c.reference}</dd></div>
      </dl>
      ${courseGate}
      ${state === "moon" ? `<p class="library-lunar-note">☾ ${c.lunarNotice}</p>` : ""}
      ${buttonFor(holding, locale, c)}
    </article>`;
}

function catalogueView(locale, c) {
  const matches = filterHoldings(locale);
  if (!matches.some((holding) => holding.id === selectedId)) selectedId = matches[0]?.id || null;
  const selected = libraryHolding(selectedId);
  return `
    <form class="library-filters" data-library-filters>
      <label class="library-search"><span aria-hidden="true">⌕</span><input type="search" name="query" value="${escapeHtml(filters.query)}" placeholder="${escapeHtml(c.search)}" data-preserve-focus="library-query"></label>
      <label><span class="visually-hidden">${c.allSchools}</span><select name="school" data-preserve-focus="library-school">
        <option value="">${c.allSchools}</option>
        ${Object.entries(libraryFacets.schools).map(([id, label]) => `<option value="${id}" ${filters.school === id ? "selected" : ""}>${escapeHtml(localeText(label, locale))}</option>`).join("")}
      </select></label>
      <label><span class="visually-hidden">${c.allStates}</span><select name="state" data-preserve-focus="library-state">
        <option value="">${c.allStates}</option>
        ${Object.entries(libraryFacets.states).map(([id, label]) => `<option value="${id}" ${filters.state === id ? "selected" : ""}>${escapeHtml(localeText(label, locale))}</option>`).join("")}
      </select></label>
      <label><span class="visually-hidden">${c.allDangers}</span><select name="danger" data-preserve-focus="library-danger">
        <option value="">${c.allDangers}</option>
        ${Object.entries(libraryFacets.dangers).map(([id, label]) => `<option value="${id}" ${filters.danger === id ? "selected" : ""}>${escapeHtml(localeText(label, locale))}</option>`).join("")}
      </select></label>
    </form>
    <div class="library-result-line"><strong>${matches.length} ${c.result}</strong><button type="button" data-library-reset>${c.reset}</button></div>
    <div class="library-catalogue-layout">
      <div class="library-list" role="list" data-preserve-scroll="library-list">
        ${matches.length ? matches.map((holding) => {
          const state = effectiveState(holding);
          return `
            <button class="${holding.id === selectedId ? "is-active" : ""}" type="button" role="listitem" data-library-select="${holding.id}">
              <span class="library-call">${escapeHtml(holding.callNumber)}</span>
              <strong>${escapeHtml(localeText(holding.title, locale))}</strong>
              <small>${escapeHtml(localeText(holding.author, locale))}</small>
              <i data-state="${state}">${escapeHtml(localeText(libraryFacets.states[state], locale))}</i>
              <b aria-hidden="true">→</b>
            </button>`;
        }).join("") : `<p class="library-empty">${c.noResults}</p>`}
      </div>
      <div class="library-detail">${selected && matches.length ? detailRecord(selected, locale, c) : ""}</div>
    </div>`;
}

function loanCard(record, locale, c) {
  const holding = libraryHolding(record.holdingId);
  if (!holding) return "";
  const overdue = record.status === "active" && new Date(record.dueAt) < new Date();
  return `
    <article class="library-loan-card ${overdue ? "is-overdue" : ""}">
      <div>
        <code>${escapeHtml(holding.callNumber)}</code>
        <h4>${escapeHtml(localeText(holding.title, locale))}</h4>
        <p>${c.borrowedOn} ${formatDate(record.borrowedAt, locale)} · <strong>${overdue ? c.overdue : c.due} ${formatDate(record.dueAt, locale)}</strong></p>
      </div>
      ${record.status === "active" ? `
        <div>
          <button type="button" data-library-renew="${holding.id}" ${record.renewals >= holding.renewalLimit ? "disabled" : ""}>${c.renew} ${record.renewals}/${holding.renewalLimit}</button>
          <button type="button" data-library-return="${holding.id}">${c.return}</button>
        </div>` : `<span>${c.returnedStatus} · ${formatDate(record.returnedAt, locale)}</span>`}
    </article>`;
}

function holdCard(record, locale, c) {
  const holding = libraryHolding(record.holdingId);
  if (!holding) return "";
  return `
    <article class="library-loan-card library-hold-card">
      <div>
        <code>${escapeHtml(holding.callNumber)}</code>
        <h4>${escapeHtml(localeText(holding.title, locale))}</h4>
        <p>${c.holdPlaced} ${formatDate(record.placedAt, locale)} · ${record.status === "active" ? c.holdPosition : c.cancelledStatus}</p>
      </div>
      ${record.status === "active" ? `<button type="button" data-library-cancel-hold="${holding.id}">${c.cancelHold}</button>` : `<span>${c.cancelledStatus} · ${formatDate(record.cancelledAt, locale)}</span>`}
    </article>`;
}

function myLibraryView(locale, c) {
  const loanRecords = loans();
  const holdRecords = holds();
  const activeLoans = loanRecords.filter((record) => record.status === "active");
  const activeHolds = holdRecords.filter((record) => record.status === "active");
  const history = [
    ...loanRecords.filter((record) => record.status !== "active").map((record) => ({ ...record, kind: "loan", date: record.returnedAt })),
    ...holdRecords.filter((record) => record.status !== "active").map((record) => ({ ...record, kind: "hold", date: record.cancelledAt })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
  const identity = readJson(IDENTITY_KEY, null);
  if (!identity) {
    return `<div class="library-account-gate"><span aria-hidden="true">借</span><h3>${c.identityNeeded}</h3><a class="button button-primary" href="mytu.html#my-tu">${c.createIdentity} <span aria-hidden="true">→</span></a></div>`;
  }
  return `
    <div class="library-account-heading">
      <div><p>${c.libraryCard}</p><h3>${escapeHtml(identity.name)}</h3><code>${escapeHtml(identity.id)}</code></div>
      <button class="button button-secondary" type="button" data-library-receipt>${c.printReceipt} <span aria-hidden="true">↗</span></button>
    </div>
    <div class="library-account-grid">
      <section><header><span>LOANS</span><h3>${c.activeLoans}</h3><b>${activeLoans.length}/${MAX_LOANS}</b></header>${activeLoans.length ? activeLoans.map((record) => loanCard(record, locale, c)).join("") : `<p class="library-empty">${c.noLoans}</p>`}</section>
      <section><header><span>HOLDS</span><h3>${c.activeHolds}</h3><b>${activeHolds.length}</b></header>${activeHolds.length ? activeHolds.map((record) => holdCard(record, locale, c)).join("") : `<p class="library-empty">${c.noHolds}</p>`}</section>
    </div>
    <section class="library-history">
      <header><span>HISTORY</span><h3>${c.history}</h3></header>
      ${history.length ? history.map((record) => record.kind === "loan" ? loanCard(record, locale, c) : holdCard(record, locale, c)).join("") : `<p class="library-empty">${c.noHistory}</p>`}
    </section>`;
}

function renderContent() {
  if (!app) return;
  const locale = getLocale();
  const c = copy[locale];
  const available = libraryHoldings.filter((holding) => effectiveState(holding) === "available").length;
  const strange = libraryHoldings.length - available;
  const active = activeLoanCount() + activeHoldCount();
  app.innerHTML = `
    <header class="library-hero">
      <div class="library-hero-image"><img src="assets/images/library.webp" width="1280" height="853" alt="" loading="eager"><span>${c.open}<strong>${c.hours}</strong></span></div>
      <div class="library-hero-copy">
        <p>${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
        <dl>
          <div><dt>${c.holdings}</dt><dd>${libraryHoldings.length}</dd></div>
          <div><dt>${c.available}</dt><dd>${available}</dd></div>
          <div><dt>${c.strange}</dt><dd>${strange}</dd></div>
        </dl>
      </div>
    </header>
    <nav class="library-tabs" aria-label="${escapeHtml(c.desk)}">
      <button type="button" data-library-tab="catalogue" aria-selected="${tab === "catalogue"}"><span>目</span>${c.catalogue}</button>
      <button type="button" data-library-tab="account" aria-selected="${tab === "account"}"><span>借</span>${c.myLibrary}<b>${active} ${c.activeBadge}</b></button>
    </nav>
    <div class="library-view">${tab === "catalogue" ? catalogueView(locale, c) : myLibraryView(locale, c)}</div>`;
  bind();
}

function render() {
  if (!app) return;
  renderPreservingState(app, renderContent, { preserveWindow: true });
}

function selectHolding(id) {
  if (!libraryHolding(id)) return;
  selectedId = id;
  const nextUrl = `${window.location.pathname}${window.location.search}#library-${id}`;
  window.history.replaceState({ route: `library-${id}` }, "", nextUrl);
  render();
  app.querySelector(".library-record")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function borrow(holdingId) {
  const locale = getLocale();
  const c = copy[locale];
  const holding = libraryHolding(holdingId);
  if (!holding || activeLoan(holdingId)) return showToast(c.alreadyLoaned);
  if (!readJson(IDENTITY_KEY, null)) return showToast(c.identityNeeded);
  if (!hasCourseAccess(holding)) return showToast(c.courseNeeded);
  if (activeLoanCount() >= MAX_LOANS) return showToast(c.maxLoans);
  if (effectiveState(holding) !== "available" || holding.circulation !== "loan") return;
  const borrowedAt = new Date().toISOString();
  const record = {
    schema: 1,
    id: makeId("TU-L", holdingId),
    holdingId,
    status: "active",
    borrowedAt,
    dueAt: addDays(borrowedAt, holding.loanDays),
    renewals: 0,
    returnedAt: null,
  };
  writeJson(LOANS_KEY, [...loans(), record]);
  recordCampusEvent("book.borrowed", { loanId: record.id, holdingId, callNumber: holding.callNumber, dueAt: record.dueAt }, { id: `book.borrowed:${record.id}`, timestamp: borrowedAt });
  showToast(c.borrowed);
  render();
}

function placeHold(holdingId) {
  const c = copy[getLocale()];
  const holding = libraryHolding(holdingId);
  if (!holding || activeHold(holdingId)) return showToast(c.alreadyHeld);
  if (!readJson(IDENTITY_KEY, null)) return showToast(c.identityNeeded);
  if (!hasCourseAccess(holding)) return showToast(c.courseNeeded);
  if (!canHold(holding)) return;
  const placedAt = new Date().toISOString();
  const record = { schema: 1, id: makeId("TU-H", holdingId), holdingId, status: "active", placedAt, position: 1, cancelledAt: null };
  writeJson(HOLDS_KEY, [...holds(), record]);
  recordCampusEvent("book.held", { holdId: record.id, holdingId, callNumber: holding.callNumber, position: 1 }, { id: `book.held:${record.id}`, timestamp: placedAt });
  showToast(c.held);
  render();
}

function renew(holdingId) {
  const c = copy[getLocale()];
  const holding = libraryHolding(holdingId);
  const records = loans();
  const index = records.findIndex((record) => record.holdingId === holdingId && record.status === "active");
  if (!holding || index < 0) return;
  if (records[index].renewals >= holding.renewalLimit) return showToast(c.renewalLimit);
  if (holds().some((record) => record.holdingId === holdingId && record.status === "active")) return showToast(c.renewalBlocked);
  const renewedAt = new Date().toISOString();
  records[index] = {
    ...records[index],
    dueAt: addDays(records[index].dueAt, holding.loanDays),
    renewals: records[index].renewals + 1,
    renewedAt,
  };
  writeJson(LOANS_KEY, records);
  recordCampusEvent("book.renewed", { loanId: records[index].id, holdingId, dueAt: records[index].dueAt, renewals: records[index].renewals }, { id: `book.renewed:${records[index].id}:${records[index].renewals}`, timestamp: renewedAt });
  showToast(c.renewed);
  render();
}

function returnLoan(holdingId) {
  const c = copy[getLocale()];
  const records = loans();
  const index = records.findIndex((record) => record.holdingId === holdingId && record.status === "active");
  if (index < 0) return;
  const returnedAt = new Date().toISOString();
  records[index] = { ...records[index], status: "returned", returnedAt };
  writeJson(LOANS_KEY, records);
  recordCampusEvent("book.returned", { loanId: records[index].id, holdingId }, { id: `book.returned:${records[index].id}`, timestamp: returnedAt });
  showToast(c.returned);
  render();
}

function cancelHold(holdingId) {
  const c = copy[getLocale()];
  const records = holds();
  const index = records.findIndex((record) => record.holdingId === holdingId && record.status === "active");
  if (index < 0) return;
  const cancelledAt = new Date().toISOString();
  records[index] = { ...records[index], status: "cancelled", cancelledAt };
  writeJson(HOLDS_KEY, records);
  recordCampusEvent("book.hold.cancelled", { holdId: records[index].id, holdingId }, { id: `book.hold.cancelled:${records[index].id}`, timestamp: cancelledAt });
  showToast(c.holdCancelled);
  render();
}

function renderReceipt() {
  const dialog = document.querySelector("[data-library-receipt-dialog]");
  const body = dialog?.querySelector("[data-library-receipt-body]");
  const identity = readJson(IDENTITY_KEY, null);
  if (!dialog || !body || !identity) return;
  const locale = getLocale();
  const c = copy[locale];
  const active = loans().filter((record) => record.status === "active");
  body.innerHTML = `
    <header><div class="library-receipt-seal" aria-hidden="true">書</div><div><p>MISTY LAKE LIBRARY</p><h2>${c.receiptTitle}</h2><span>${c.receiptSubtitle}</span></div></header>
    <dl><div><dt>${c.borrower}</dt><dd>${escapeHtml(identity.name)}</dd></div><div><dt>${c.libraryCard}</dt><dd><code>${escapeHtml(identity.id)}</code></dd></div><div><dt>${c.issued}</dt><dd>${formatDate(new Date().toISOString(), locale, true)}</dd></div></dl>
    <table><thead><tr><th>${c.callNumber}</th><th>${c.catalogue}</th><th>${c.due}</th></tr></thead><tbody>
      ${active.length ? active.map((record) => {
        const holding = libraryHolding(record.holdingId);
        return `<tr><td><code>${escapeHtml(holding?.callNumber || record.holdingId)}</code></td><td>${escapeHtml(localeText(holding?.title, locale))}</td><td>${formatDate(record.dueAt, locale)}</td></tr>`;
      }).join("") : `<tr><td colspan="3">${c.noLoans}</td></tr>`}
    </tbody></table>
    <p>${c.receiptNote}</p>`;
  dialog.querySelectorAll("[data-library-receipt-close]").forEach((button) => {
    if (!button.classList.contains("dialog-close")) button.textContent = c.closeReceipt;
    button.setAttribute("aria-label", c.closeReceipt);
  });
  const print = dialog.querySelector("[data-library-receipt-print]");
  if (print) print.firstChild.textContent = `${c.print} `;
  dialog.showModal();
}

function bind() {
  app.querySelectorAll("[data-library-tab]").forEach((button) => button.addEventListener("click", () => {
    tab = button.dataset.libraryTab;
    render();
  }));
  const filterForm = app.querySelector("[data-library-filters]");
  const updateFilters = () => {
    const form = filterForm;
    if (!form) return;
    filters = {
      query: form.elements.query.value,
      school: form.elements.school.value,
      state: form.elements.state.value,
      danger: form.elements.danger.value,
    };
    render();
  };
  bindImeSafeInput(filterForm?.elements.query, updateFilters);
  filterForm?.addEventListener("change", (event) => {
    if (event.target.matches("select")) updateFilters();
  });
  app.querySelector("[data-library-reset]")?.addEventListener("click", () => {
    filters = { query: "", school: "", state: "", danger: "" };
    render();
  });
  app.querySelectorAll("[data-library-select]").forEach((button) => button.addEventListener("click", () => selectHolding(button.dataset.librarySelect)));
  app.querySelectorAll("[data-library-borrow]").forEach((button) => button.addEventListener("click", () => borrow(button.dataset.libraryBorrow)));
  app.querySelectorAll("[data-library-hold]").forEach((button) => button.addEventListener("click", () => placeHold(button.dataset.libraryHold)));
  app.querySelectorAll("[data-library-renew]").forEach((button) => button.addEventListener("click", () => renew(button.dataset.libraryRenew)));
  app.querySelectorAll("[data-library-return]").forEach((button) => button.addEventListener("click", () => returnLoan(button.dataset.libraryReturn)));
  app.querySelectorAll("[data-library-cancel-hold]").forEach((button) => button.addEventListener("click", () => cancelHold(button.dataset.libraryCancelHold)));
  app.querySelector("[data-library-receipt]")?.addEventListener("click", renderReceipt);
}

function initialHoldingFromHash() {
  const match = window.location.hash.match(/^#library-(.+)$/);
  if (match && libraryHolding(decodeURIComponent(match[1]))) selectedId = decodeURIComponent(match[1]);
}

export function initLibrary() {
  app = document.querySelector("[data-library-app]");
  if (!app) return;
  initialHoldingFromHash();
  render();
  window.addEventListener("tu:languagechange", render);
  window.addEventListener("storage", (event) => {
    if ([LOANS_KEY, HOLDS_KEY, IDENTITY_KEY, REGISTRATION_KEY, TRANSCRIPT_KEY].includes(event.key)) render();
  });
  window.addEventListener("hashchange", () => {
    const before = selectedId;
    initialHoldingFromHash();
    if (before !== selectedId) render();
  });
  document.querySelectorAll("[data-library-receipt-close]").forEach((button) => button.addEventListener("click", () => document.querySelector("[data-library-receipt-dialog]")?.close()));
  document.querySelector("[data-library-receipt-print]")?.addEventListener("click", () => window.print());
}
