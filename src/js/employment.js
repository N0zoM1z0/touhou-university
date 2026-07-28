import {
  employmentApplicationDecisions,
  employmentCategoryOptions,
  employmentCountBases,
  employmentJob,
  employmentJobs,
  employmentLocalized,
  employmentObservationWindows,
  employmentOutcomeKinds,
  employmentPayKinds,
  employmentPosterImages,
  employmentScheduleOptions,
} from "../data/employment.js";
import {
  attestEmploymentOutcome,
  employmentApplication,
  employmentApplications,
  employmentAttestations,
  employmentDraft,
  employmentOutcomeSnapshot,
  employmentSummary,
  respondEmploymentApplication,
  saveEmploymentDraft,
  submitEmploymentApplication,
} from "./employment-model.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { getLocale } from "./i18n.js";
import { printDocument } from "./print-document.js";
import { showToast } from "./ui.js";

let root = null;
let selectedJobId = null;
let selectedApplicationId = null;
let categoryFilter = "all";
let scheduleFilter = "all";
let riskFilter = 5;
let basisId = "person";
let observationId = "noon";

const copy = {
  "zh-Hant": {
    eyebrow: "GENSOKYO EMPLOYMENT MARKET / 離校後仍有問題的人",
    title: "我們不公佈一個好看的就業率；先說清楚你打算怎麼數。",
    lead: "一名半靈算一位、兩位還是一份半？死後仍在三途川值班算留任還是轉生前待業？工作先變成異變又該算工作還是異變？進路室保留分母、口供與反對意見，招聘架則照常招人。",
    jobs: "張仍在招人的告示",
    applications: "份怪歷書已寄出",
    attestations: "份本機去向口供",
    outcomesNav: "離校去向回聲簿",
    marketNav: "招聘告示架",
    recordsNav: "我的投遞與回音",
    censusEyebrow: "COHORT 146 / DENOMINATOR HEARING",
    censusTitle: "同一屆畢業生，不同數法會得到不同的幻想鄉。",
    censusLead: "下列分類可以同時成立，總和故意不等於分母。阿求拒絕把重疊抹掉，慧音要求每次點名寫清日期，文則已經替最大的一個數字擬好標題。",
    basis: "這次按什麼數",
    observation: "在哪個時刻看",
    denominator: "本次分母",
    statements: "有效去向口供",
    overlap: "重疊／爭議席",
    notRate: "不是就業率",
    denominatorNote: "分母聽證",
    localAdded: "含這台裝置的口供",
    attestTitle: "把你的去向放進回聲簿",
    attestLead: "這份口供只保存在本機；它會加入目前的去向點名，也可能在 BBS 被另一位畢業生反對。",
    name: "你在這一版使用的名字",
    outcome: "目前最接近的去向",
    simultaneous: "這不是唯一去向；我同時還被另一處認領",
    note: "實際情況／哪一點不准被統計抹掉",
    attestSubmit: "留下本機口供",
    attested: "去向口供已夾入回聲簿；分母仍保留申訴權。",
    marketEyebrow: "CLASSIFIEDS / 會冒煙、會移動、可能已錄用你",
    marketTitle: "二十一張招聘告示，沒有一張保證工作比異變先開始。",
    marketLead: "先按麻煩種類、時間觀與風險過濾。點開職缺會得到可分享的固定連結、完整怪條款、試工題與一張真正能投遞的怪歷書。",
    category: "麻煩種類",
    schedule: "上班採用的時間觀",
    risk: "最多接受幾枚風險印",
    found: "張告示符合",
    open: "拆開招聘告示",
    pay: "結算",
    scheduleLabel: "時間",
    danger: "風險",
    dangerUnit: "枚",
    posterAlt: "幻想鄉招聘告示插畫",
    noResults: "沒有雇主承認符合這組條件。把風險加一，或等門換一邊再查。",
    fileEyebrow: "FULL RECRUITMENT FILE / 不構成命運保證",
    employer: "雇主",
    work: "實際工作",
    compensation: "薪資與交換",
    impossibleClause: "最容易被小字吃掉的條款",
    trial: "試工題",
    employerReply: "這家雇主通常怎麼回",
    print: "列印／另存這張告示",
    share: "分享此職缺",
    applyTitle: "寄出一份怪歷書",
    applyLead: "進路室不替你美化能力，也不把『願意吃苦』當作放棄界線。雇主會立刻回一份可爭議的初審。",
    degree: "學位號（沒有也可投；雇主會看見空白）",
    strength: "你真正做過、即使聽起來不像經驗的事",
    boundary: "你不願跨過的界線",
    desiredPay: "你希望如何結算",
    availability: "你能在哪一種時間裡到班",
    availabilityOptions: {
      ordinary: "一般連續時間",
      night: "夜班／地下時間",
      lunar: "月相排班",
      nonlinear: "非線性／停止時間",
      afterlife: "死後仍可商議",
    },
    nonlinearReady: "若時間停止，我仍要求班次有明確結束方式",
    clauseAccepted: "我已讀到上方怪條款；這只表示看見，不表示放棄申訴",
    submit: "交給鴉天狗寄發臺",
    draftSaved: "怪歷書草稿只保存在這台裝置",
    submitted: "怪歷書已寄出；雇主的第一版回音也已抵達。",
    formError: "請補上名字、至少八字的經驗與界線，並確認你確實看見怪條款。",
    responseTitle: "你要怎麼回這份回音？",
    responseLead: "接受試工不等於接受全部條款；要求訂正也不等於拒絕。相鄰時間線的錄用尤其需要本人在這一頁再表態一次。",
    responseNote: "要寫進第二版的備註",
    responses: {
      trial: "接受一班試工",
      correction: "要求訂正條款",
      adjacent: "暫認相鄰錄用",
      hold: "保留，等月相／日期",
      decline: "由我拒絕這一版",
    },
    responded: "第二版回音已保存，鴉天狗郵便與 BBS 會各自誤解一次。",
    recordsEyebrow: "MY APPLICATIONS / 只在這台裝置",
    recordsTitle: "投遞、初審與本人回覆都不會在關掉卡片後消失。",
    recordsLead: "每份回音保留職缺、初審版本與你的第二版表態；可在本機資料櫃一起匯出。",
    noRecords: "這台裝置尚未寄出怪歷書。",
    openRecord: "查看投遞卷",
    submittedAt: "寄出",
    status: "目前版次",
    reviewed: "雇主初審",
    responseSaved: "本人已回覆",
    attestationError: "請留下名字、去向與至少八字的實際情況。",
    shareCopied: "職缺連結已複製。",
  },
  ja: {
    eyebrow: "GENSOKYO EMPLOYMENT MARKET / 離校後も問題を抱える者へ",
    title: "見栄えのよい就職率は公表しない。まず、どう数えるかを書いてください。",
    lead: "半霊は一名、二名、一名半か。死後も三途川で勤務中なら在職か転生前失業か。仕事が先に異変化した場合は職か異変か。進路室は分母・証言・反対意見を残し、求人棚は通常どおり人を募る。",
    jobs: "件の募集中掲示",
    applications: "通の怪歴書を発送",
    attestations: "件の端末内進路証言",
    outcomesNav: "離校先反響簿",
    marketNav: "求人掲示棚",
    recordsNav: "自分の応募と返事",
    censusEyebrow: "COHORT 146 / 分母聴聞",
    censusTitle: "同じ卒業期でも、数え方ごとに別の幻想郷になる。",
    censusLead: "以下は同時成立できるため、合計は意図的に分母と一致しない。阿求は重複を消さず、慧音は点呼日を書かせ、文は最大値の見出しを既に準備した。",
    basis: "何を一単位にするか",
    observation: "いつ観測するか",
    denominator: "今回の分母",
    statements: "有効な進路証言",
    overlap: "重複・係争席",
    notRate: "就職率ではない",
    denominatorNote: "分母聴聞",
    localAdded: "この端末の証言を含む",
    attestTitle: "自分の進路を反響簿へ",
    attestLead: "証言は端末内保存。現在の点呼に加わり、BBSで別の卒業生から異議が出る場合もある。",
    name: "この版で使う名前",
    outcome: "現在最も近い進路",
    simultaneous: "唯一の進路ではなく、同時に別の雇主からも在籍扱い",
    note: "実情／統計に消させない点",
    attestSubmit: "端末内証言を残す",
    attested: "進路証言を反響簿へ綴じました。分母には不服申立権が残ります。",
    marketEyebrow: "CLASSIFIEDS / 発煙・移動・採用済みの可能性",
    marketTitle: "二十一の求人。仕事が異変より先に始まる保証は一つもない。",
    marketLead: "厄介事、時間観、危険印で絞込み。求人を開くと共有可能な固定リンク、全文小条項、試用課題、実際に送れる怪歴書が出る。",
    category: "厄介事の種類",
    schedule: "勤務時間観",
    risk: "許容する危険印",
    found: "件が該当",
    open: "求人掲示を開く",
    pay: "精算",
    scheduleLabel: "時間",
    danger: "危険",
    dangerUnit: "印",
    posterAlt: "幻想郷求人掲示の挿絵",
    noResults: "この条件を認める雇主はいません。危険を一段上げるか、門が反転してから再検索を。",
    fileEyebrow: "FULL RECRUITMENT FILE / 運命による採用保証ではない",
    employer: "雇主",
    work: "実務",
    compensation: "賃金・交換",
    impossibleClause: "小字に食われやすい条項",
    trial: "試用課題",
    employerReply: "通常の返事",
    print: "この掲示を印刷／PDF保存",
    share: "求人を共有",
    applyTitle: "怪歴書を発送",
    applyLead: "進路室は能力を美化せず、「苦労可」を境界放棄と解さない。雇主から争議可能な初審が直ちに返る。",
    degree: "学位番号（空欄でも応募可）",
    strength: "経験らしくなくても、実際にしたこと",
    boundary: "越えない境界",
    desiredPay: "希望する精算方法",
    availability: "勤務可能な時間",
    availabilityOptions: {
      ordinary: "通常の連続時間",
      night: "夜勤・地下時間",
      lunar: "月相勤務",
      nonlinear: "非線形・停止時間",
      afterlife: "死後も応相談",
    },
    nonlinearReady: "時間停止でも勤務に明確な終了方法を要求する",
    clauseAccepted: "上の怪条項を見た。申訴権を放棄する意味ではない",
    submit: "鴉天狗発送台へ渡す",
    draftSaved: "怪歴書の下書きはこの端末だけに保存",
    submitted: "怪歴書を発送。雇主の第一版回答も到着しました。",
    formError: "名前、八字以上の経験と境界を記し、怪条項を見たことを確認してください。",
    responseTitle: "この回答へどう返す？",
    responseLead: "試用承諾は全条項承諾ではなく、訂正要求も拒否ではない。隣接時間線採用は特に、この頁の本人が再回答する。",
    responseNote: "第二版へ残す注記",
    responses: {
      trial: "一勤務の試用を受諾",
      correction: "条項訂正を要求",
      adjacent: "隣接採用を暫定承認",
      hold: "月相・日付まで保留",
      decline: "この版は本人が拒否",
    },
    responded: "第二版回答を保存。鴉天狗郵便とBBSが各一度ずつ誤解します。",
    recordsEyebrow: "MY APPLICATIONS / この端末のみ",
    recordsTitle: "応募、初審、本人回答はカードを閉じても消えない。",
    recordsLead: "求人、初審版、本人の第二版を保存し、端末内資料棚からまとめて書き出せる。",
    noRecords: "この端末から怪歴書はまだ発送されていません。",
    openRecord: "応募記録を見る",
    submittedAt: "発送",
    status: "現在版",
    reviewed: "雇主初審",
    responseSaved: "本人回答済み",
    attestationError: "名前、進路、八字以上の実情を記してください。",
    shareCopied: "求人リンクをコピーしました。",
  },
  en: {
    eyebrow: "GENSOKYO EMPLOYMENT MARKET / FOR THOSE LEAVING WITH PROBLEMS",
    title: "We do not publish one flattering employment rate. First declare how you counted.",
    lead: "Is a half-phantom one graduate, two, or one and a half? Is posthumous Sanzu duty retention or pre-reincarnation unemployment? If work becomes an incident first, is it work or incident? Careers preserves denominators, testimony, and objections while the notice rack continues hiring.",
    jobs: "notices still hiring",
    applications: "odd résumés dispatched",
    attestations: "on-device whereabouts statements",
    outcomesNav: "Whereabouts Echo Roll",
    marketNav: "Recruitment Notice Rack",
    recordsNav: "My applications & replies",
    censusEyebrow: "COHORT 146 / DENOMINATOR HEARING",
    censusTitle: "One graduating cohort produces a different Gensokyo under every counting rule.",
    censusLead: "The categories may overlap, so their sum intentionally differs from the denominator. Akyuu keeps overlap, Keine demands a date on each roll, and Aya already drafted a headline for the largest number.",
    basis: "What counts as one",
    observation: "When to observe",
    denominator: "Current denominator",
    statements: "Valid whereabouts claims",
    overlap: "Overlap / contested seats",
    notRate: "Not an employment rate",
    denominatorNote: "Denominator hearing",
    localAdded: "Includes this device's statements",
    attestTitle: "Place your whereabouts in the echo roll",
    attestLead: "This statement stays on this device. It joins the current roll and may be disputed on BBS by another graduate.",
    name: "Name used by this edition of you",
    outcome: "Closest present whereabouts",
    simultaneous: "This is not exclusive; another employer simultaneously claims me",
    note: "Actual situation / what statistics must not erase",
    attestSubmit: "Leave an on-device statement",
    attested: "Your whereabouts statement entered the echo roll; the denominator retains appeal rights.",
    marketEyebrow: "CLASSIFIEDS / MAY SMOKE, MOVE, OR HAVE HIRED YOU",
    marketTitle: "Twenty-one notices; none promises the job begins before the incident.",
    marketLead: "Filter by trouble, view of time, and risk seals. Open a post for a shareable exact link, full strange clauses, a trial task, and an odd résumé that actually submits.",
    category: "Kind of trouble",
    schedule: "Employer's view of time",
    risk: "Maximum risk seals",
    found: "notices match",
    open: "Open recruitment notice",
    pay: "Settlement",
    scheduleLabel: "Time",
    danger: "Risk",
    dangerUnit: "seals",
    posterAlt: "Illustrated Gensokyo recruitment notice",
    noResults: "No employer admits matching these terms. Add one risk seal or wait for the gate to swap sides.",
    fileEyebrow: "FULL RECRUITMENT FILE / NOT A FATE GUARANTEE",
    employer: "Employer",
    work: "Actual work",
    compensation: "Wages & exchange",
    impossibleClause: "Clause most likely eaten by fine print",
    trial: "Trial task",
    employerReply: "Employer's usual reply",
    print: "Print / save this notice",
    share: "Share this vacancy",
    applyTitle: "Dispatch an odd résumé",
    applyLead: "Careers will not beautify abilities or interpret “willing to suffer” as surrendering boundaries. The employer returns an immediately disputable first review.",
    degree: "Degree number (blank applications remain valid)",
    strength: "Something you actually did, even if it sounds unlike experience",
    boundary: "A boundary you will not cross",
    desiredPay: "How you expect settlement",
    availability: "Time in which you can report",
    availabilityOptions: {
      ordinary: "Ordinary continuous time",
      night: "Night / underground time",
      lunar: "Lunar rota",
      nonlinear: "Non-linear / stopped time",
      afterlife: "Negotiable after death",
    },
    nonlinearReady: "Even if time stops, my shift requires an explicit ending",
    clauseAccepted: "I saw the strange clause; this does not waive appeal",
    submit: "Give to crow-tengu dispatch",
    draftSaved: "Odd résumé draft is stored only on this device",
    submitted: "Odd résumé dispatched; the employer's first-edition reply has arrived.",
    formError: "Add a name, at least eight characters of experience and boundaries, and confirm you saw the clause.",
    responseTitle: "How will you answer this reply?",
    responseLead: "Accepting a trial is not accepting every clause; requesting correction is not rejection. Adjacent-timeline hires especially require this page's applicant to answer again.",
    responseNote: "Note for edition two",
    responses: {
      trial: "Accept one-shift trial",
      correction: "Request clause correction",
      adjacent: "Provisionally accept adjacent hire",
      hold: "Hold for moon / date",
      decline: "I reject this edition",
    },
    responded: "Edition-two reply saved. Tengu Post and BBS will each misunderstand it once.",
    recordsEyebrow: "MY APPLICATIONS / THIS DEVICE ONLY",
    recordsTitle: "Applications, first reviews, and your replies survive closing the card.",
    recordsLead: "Each record retains the vacancy, employer review, and your edition-two response; export them together from the on-device cabinet.",
    noRecords: "No odd résumé has left this device yet.",
    openRecord: "Open application file",
    submittedAt: "Sent",
    status: "Current edition",
    reviewed: "Employer review",
    responseSaved: "Applicant replied",
    attestationError: "Add a name, whereabouts, and at least eight characters of actual context.",
    shareCopied: "Vacancy link copied.",
  },
};

const scheduleLabels = Object.fromEntries(employmentScheduleOptions);

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[character]);
}

const t = (value, locale) => employmentLocalized(value, locale);
const formatDate = (value, locale) => new Intl.DateTimeFormat(
  locale === "zh-Hant" ? "zh-TW" : locale,
  { dateStyle: "medium", timeStyle: "short" },
).format(new Date(value));

function optionMarkup(options, selected, locale) {
  return options.map(([value, label]) => `
    <option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(t(label, locale))}</option>
  `).join("");
}

function hero(locale, c) {
  const summary = employmentSummary();
  return `
    <header class="employment-hero">
      <div>
        <p>${c.eyebrow}</p>
        <h2 id="employment-title">${c.title}</h2>
        <span>${c.lead}</span>
      </div>
      <dl>
        <div><dt>${c.jobs}</dt><dd>${employmentJobs.length}</dd></div>
        <div><dt>${c.applications}</dt><dd>${summary.applications}</dd></div>
        <div><dt>${c.attestations}</dt><dd>${summary.attestations}</dd></div>
      </dl>
    </header>
    <nav class="employment-jump-nav" aria-label="${c.eyebrow}">
      <a href="#employment-outcomes"><span>01</span>${c.outcomesNav}</a>
      <a href="#employment-job-board"><span>02</span>${c.marketNav}</a>
      <a href="#employment-records"><span>03</span>${c.recordsNav}</a>
    </nav>
  `;
}

function outcomePanel(locale, c) {
  const snapshot = employmentOutcomeSnapshot(basisId, observationId);
  const maximum = Math.max(...snapshot.counts.map(({ count }) => count));
  const attestations = employmentAttestations();
  return `
    <section class="employment-census" id="employment-outcomes" aria-labelledby="employment-outcomes-title">
      <header class="employment-heading">
        <p>${c.censusEyebrow}</p>
        <h3 id="employment-outcomes-title">${c.censusTitle}</h3>
        <span>${c.censusLead}</span>
      </header>
      <div class="employment-census-controls">
        <label>${c.basis}
          <select data-employment-basis>
            ${employmentCountBases.map((entry) => `
              <option value="${entry.id}" ${entry.id === snapshot.basis.id ? "selected" : ""}>${entry.glyph} · ${escapeHtml(t(entry.title, locale))}</option>
            `).join("")}
          </select>
        </label>
        <label>${c.observation}
          <select data-employment-observation>
            ${employmentObservationWindows.map((entry) => `
              <option value="${entry.id}" ${entry.id === snapshot.observation.id ? "selected" : ""}>${escapeHtml(t(entry.title, locale))}</option>
            `).join("")}
          </select>
        </label>
      </div>
      <div class="employment-denominator">
        <div><span>${c.denominator}</span><strong>${snapshot.denominator}</strong></div>
        <div><span>${c.statements}</span><strong>${snapshot.statements}</strong></div>
        <div><span>${c.overlap}</span><strong>+${snapshot.overlap}</strong></div>
        <p><b>${c.notRate}</b> · ${escapeHtml(t(snapshot.basis.note, locale))} ${escapeHtml(t(snapshot.observation.note, locale))}</p>
      </div>
      <div class="employment-outcome-list">
        ${snapshot.counts.map((outcome) => `
          <article class="employment-outcome-card">
            <div class="employment-outcome-mark">${outcome.glyph}</div>
            <div>
              <header><h4>${escapeHtml(t(outcome.title, locale))}</h4><strong>${outcome.count}</strong></header>
              <div class="employment-outcome-bar" aria-hidden="true"><span style="width:${Math.max(5, outcome.count / maximum * 100)}%"></span></div>
              <p>${escapeHtml(t(outcome.note, locale))}${outcome.local ? ` · ${c.localAdded} +${outcome.local}` : ""}</p>
            </div>
          </article>
        `).join("")}
      </div>
      <aside class="employment-attestation">
        <div>
          <span>${c.denominatorNote} / LOCAL ECHO</span>
          <h4>${c.attestTitle}</h4>
          <p>${c.attestLead}</p>
          ${attestations.length ? `<small>${c.localAdded}：${attestations.length}</small>` : ""}
        </div>
        <form data-employment-attest>
          <label>${c.name}<input name="displayName" autocomplete="name" required></label>
          <label>${c.outcome}
            <select name="outcomeId">
              ${employmentOutcomeKinds.map((entry) => `<option value="${entry.id}">${entry.glyph} · ${escapeHtml(t(entry.title, locale))}</option>`).join("")}
            </select>
          </label>
          <label class="employment-checkbox"><input type="checkbox" name="simultaneous"> <span>${c.simultaneous}</span></label>
          <label>${c.note}<textarea name="note" rows="3" required></textarea></label>
          <button class="button button-primary" type="submit">${c.attestSubmit}</button>
        </form>
      </aside>
    </section>
  `;
}

function jobCard(entry, locale, c) {
  const image = employmentPosterImages[entry.poster];
  return `
    <article class="employment-job-card ${image ? "has-poster" : "classified"}" id="employment-job-card-${entry.id}">
      ${image ? `
        <img src="${image}" alt="${escapeHtml(`${t(entry.employer, locale)} — ${c.posterAlt}`)}" width="760" height="1188" loading="lazy" decoding="async">
      ` : `<div class="employment-classified-glyph" aria-hidden="true">${entry.glyph}</div>`}
      <div class="employment-job-copy">
        <span>${entry.code}</span>
        <p>${escapeHtml(t(entry.employer, locale))}</p>
        <h4>${escapeHtml(t(entry.title, locale))}</h4>
        <small>${escapeHtml(t(entry.summary, locale))}</small>
        <dl>
          <div><dt>${c.pay}</dt><dd>${escapeHtml(t(employmentPayKinds[entry.payKind], locale))}</dd></div>
          <div><dt>${c.danger}</dt><dd>${"●".repeat(entry.risk)}${"○".repeat(5 - entry.risk)}</dd></div>
        </dl>
        <a href="#employment-job-${entry.id}" data-employment-job="${entry.id}">${c.open}<span aria-hidden="true">↗</span></a>
      </div>
    </article>
  `;
}

function applicationForm(entry, locale, c) {
  const draft = employmentDraft(entry.id);
  return `
    <form class="employment-application-form" data-employment-apply="${entry.id}">
      <header>
        <span>ODD RÉSUMÉ / 怪歷書</span>
        <h4>${c.applyTitle}</h4>
        <p>${c.applyLead}</p>
      </header>
      <div class="employment-form-grid">
        <label>${c.name}<input name="displayName" value="${escapeHtml(draft.displayName)}" autocomplete="name" required></label>
        <label>${c.degree}<input name="degreeNumber" value="${escapeHtml(draft.degreeNumber)}"></label>
      </div>
      <label>${c.strength}<textarea name="strength" rows="3" required>${escapeHtml(draft.strength)}</textarea></label>
      <label>${c.boundary}<textarea name="boundary" rows="3" required>${escapeHtml(draft.boundary)}</textarea></label>
      <div class="employment-form-grid">
        <label>${c.desiredPay}<input name="desiredPay" value="${escapeHtml(draft.desiredPay)}"></label>
        <label>${c.availability}
          <select name="availability">
            ${Object.entries(c.availabilityOptions).map(([value, label]) => `<option value="${value}" ${value === draft.availability ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </label>
      </div>
      <label class="employment-checkbox"><input type="checkbox" name="nonlinearReady" ${draft.nonlinearReady ? "checked" : ""}> <span>${c.nonlinearReady}</span></label>
      <label class="employment-checkbox employment-clause-check"><input type="checkbox" name="clauseAccepted" ${draft.clauseAccepted ? "checked" : ""} required> <span>${c.clauseAccepted}</span></label>
      <footer>
        <small>${c.draftSaved}</small>
        <button class="button button-primary" type="submit">${c.submit}</button>
      </footer>
    </form>
  `;
}

function jobFile(entry, locale, c) {
  if (!entry) return "";
  const image = employmentPosterImages[entry.poster];
  return `
    <article class="employment-job-file" id="employment-job-${entry.id}">
      <header class="employment-file-heading">
        <div>
          <p>${c.fileEyebrow}</p>
          <span>${entry.code}</span>
          <h3>${escapeHtml(t(entry.title, locale))}</h3>
          <b>${escapeHtml(t(entry.employer, locale))}</b>
        </div>
        <div class="employment-file-actions" data-print-exclude>
          <button type="button" class="button button-secondary" data-employment-print>${c.print}</button>
          <button type="button" class="button button-secondary" data-employment-share>${c.share}</button>
        </div>
      </header>
      <div class="employment-file-layout">
        ${image ? `
          <figure class="employment-poster-sheet">
            <img src="${image}" alt="${escapeHtml(`${t(entry.employer, locale)} — ${c.posterAlt}`)}" width="760" height="1188" decoding="async">
            <figcaption><span>${entry.code}</span><strong>${escapeHtml(t(entry.title, locale))}</strong></figcaption>
          </figure>
        ` : `
          <div class="employment-poster-sheet text-poster">
            <span>${entry.glyph}</span><strong>${escapeHtml(t(entry.title, locale))}</strong><small>${escapeHtml(t(entry.employer, locale))}</small>
          </div>
        `}
        <div class="employment-job-terms">
          <p class="employment-file-lede">${escapeHtml(t(entry.summary, locale))}</p>
          <dl>
            <div><dt>${c.work}</dt><dd>${escapeHtml(t(entry.duty, locale))}</dd></div>
            <div><dt>${c.compensation}</dt><dd>${escapeHtml(t(entry.pay, locale))}</dd></div>
            <div class="danger"><dt>${c.impossibleClause}</dt><dd>${escapeHtml(t(entry.clause, locale))}</dd></div>
            <div><dt>${c.trial}</dt><dd>${escapeHtml(t(entry.trial, locale))}</dd></div>
            <div><dt>${c.employerReply}</dt><dd>${escapeHtml(t(entry.reply, locale))}</dd></div>
          </dl>
          <div class="employment-job-meta">
            <span>${c.scheduleLabel} · ${escapeHtml(t(scheduleLabels[entry.schedule], locale))}</span>
            <span>${c.pay} · ${escapeHtml(t(employmentPayKinds[entry.payKind], locale))}</span>
            <span>${c.danger} · ${entry.risk} ${c.dangerUnit}</span>
          </div>
        </div>
      </div>
      ${applicationForm(entry, locale, c)}
    </article>
  `;
}

function marketPanel(locale, c) {
  const matches = employmentJobs.filter((entry) => (
    (categoryFilter === "all" || entry.category === categoryFilter)
    && (scheduleFilter === "all" || entry.schedule === scheduleFilter)
    && entry.risk <= riskFilter
  ));
  const selected = employmentJob(selectedJobId);
  return `
    <section class="employment-market" id="employment-job-board" aria-labelledby="employment-market-title">
      <header class="employment-heading">
        <p>${c.marketEyebrow}</p>
        <h3 id="employment-market-title">${c.marketTitle}</h3>
        <span>${c.marketLead}</span>
      </header>
      <div class="employment-filters">
        <label>${c.category}<select data-employment-category>${optionMarkup(employmentCategoryOptions, categoryFilter, locale)}</select></label>
        <label>${c.schedule}<select data-employment-schedule>${optionMarkup(employmentScheduleOptions, scheduleFilter, locale)}</select></label>
        <label>${c.risk}<input type="range" min="1" max="5" value="${riskFilter}" data-employment-risk><output>${riskFilter} / 5</output></label>
        <strong>${matches.length} ${c.found}</strong>
      </div>
      ${matches.length ? `<div class="employment-job-grid">${matches.map((entry) => jobCard(entry, locale, c)).join("")}</div>` : `<p class="employment-empty">${c.noResults}</p>`}
      ${jobFile(selected, locale, c)}
    </section>
  `;
}

function responseForm(application, c) {
  if (application.response) {
    return `
      <div class="employment-response-saved">
        <span>${c.responseSaved}</span>
        <strong>${c.responses[application.response.kind]}</strong>
        <p>${escapeHtml(application.response.note || "—")}</p>
      </div>
    `;
  }
  return `
    <form class="employment-response-form" data-employment-response="${application.id}">
      <header><h4>${c.responseTitle}</h4><p>${c.responseLead}</p></header>
      <div class="employment-response-actions">
        ${Object.entries(c.responses).map(([value, label]) => `
          <label><input type="radio" name="kind" value="${value}" ${value === "trial" ? "checked" : ""}><span>${label}</span></label>
        `).join("")}
      </div>
      <label>${c.responseNote}<textarea name="note" rows="3"></textarea></label>
      <button class="button button-primary" type="submit">${c.responseTitle}</button>
    </form>
  `;
}

function applicationFile(application, locale, c) {
  if (!application) return "";
  const entry = employmentJob(application.jobId);
  const decision = employmentApplicationDecisions.find(({ id }) => id === application.decisionId);
  return `
    <article class="employment-application-file" id="employment-application-${application.id}">
      <header>
        <div><span>${application.id}</span><h4>${escapeHtml(t(entry.title, locale))}</h4><p>${escapeHtml(t(entry.employer, locale))}</p></div>
        <strong>${decision.glyph} · ${escapeHtml(t(decision.title, locale))}</strong>
      </header>
      <div class="employment-application-verdict">
        <p>${escapeHtml(t(decision.note, locale))}</p>
        <blockquote>${escapeHtml(t(entry.reply, locale))}</blockquote>
      </div>
      <dl>
        <div><dt>${c.name}</dt><dd>${escapeHtml(application.profile.displayName)}</dd></div>
        <div><dt>${c.strength}</dt><dd>${escapeHtml(application.profile.strength)}</dd></div>
        <div><dt>${c.boundary}</dt><dd>${escapeHtml(application.profile.boundary)}</dd></div>
        <div><dt>${c.submittedAt}</dt><dd>${formatDate(application.submittedAt, locale)}</dd></div>
      </dl>
      ${responseForm(application, c)}
    </article>
  `;
}

function recordsPanel(locale, c) {
  const applications = employmentApplications().slice().reverse();
  const selected = employmentApplication(selectedApplicationId);
  return `
    <section class="employment-records" id="employment-records" aria-labelledby="employment-records-title">
      <header class="employment-heading">
        <p>${c.recordsEyebrow}</p>
        <h3 id="employment-records-title">${c.recordsTitle}</h3>
        <span>${c.recordsLead}</span>
      </header>
      ${applications.length ? `
        <div class="employment-record-list">
          ${applications.map((application) => {
            const entry = employmentJob(application.jobId);
            const decision = employmentApplicationDecisions.find(({ id }) => id === application.decisionId);
            return `
              <a href="#employment-application-${application.id}" data-employment-record="${application.id}">
                <span>${decision.glyph}</span>
                <div><strong>${escapeHtml(t(entry.title, locale))}</strong><small>${application.id} · ${formatDate(application.submittedAt, locale)}</small></div>
                <b>${application.response ? c.responseSaved : c.reviewed} ↗</b>
              </a>
            `;
          }).join("")}
        </div>
      ` : `<p class="employment-empty">${c.noRecords}</p>`}
      ${applicationFile(selected, locale, c)}
    </section>
  `;
}

function render({ preserveWindow = true } = {}) {
  if (!root) return;
  const position = preserveWindow ? window.scrollY : null;
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  root.innerHTML = `<div class="employment-workspace">${hero(locale, c)}${outcomePanel(locale, c)}${marketPanel(locale, c)}${recordsPanel(locale, c)}</div>`;
  if (position !== null) requestAnimationFrame(() => window.scrollTo({ top: position, behavior: "instant" }));
}

function applicationInput(form) {
  const data = new FormData(form);
  return {
    jobId: form.dataset.employmentApply,
    displayName: data.get("displayName"),
    degreeNumber: data.get("degreeNumber"),
    strength: data.get("strength"),
    boundary: data.get("boundary"),
    desiredPay: data.get("desiredPay"),
    availability: data.get("availability"),
    nonlinearReady: data.has("nonlinearReady"),
    clauseAccepted: data.has("clauseAccepted"),
  };
}

function bind() {
  root.addEventListener("change", (event) => {
    if (event.target.matches("[data-employment-basis]")) {
      basisId = event.target.value;
      render();
    }
    if (event.target.matches("[data-employment-observation]")) {
      observationId = event.target.value;
      render();
    }
    if (event.target.matches("[data-employment-category]")) {
      categoryFilter = event.target.value;
      render();
    }
    if (event.target.matches("[data-employment-schedule]")) {
      scheduleFilter = event.target.value;
      render();
    }
  });
  root.addEventListener("input", (event) => {
    if (event.target.matches("[data-employment-risk]")) {
      riskFilter = Number(event.target.value);
      event.target.nextElementSibling.textContent = `${riskFilter} / 5`;
      const position = window.scrollY;
      render();
      requestAnimationFrame(() => window.scrollTo({ top: position, behavior: "instant" }));
      return;
    }
    const form = event.target.closest("[data-employment-apply]");
    if (form) saveEmploymentDraft(applicationInput(form));
  });
  root.addEventListener("submit", (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    if (event.target.matches("[data-employment-apply]")) {
      event.preventDefault();
      const result = submitEmploymentApplication(applicationInput(event.target));
      if (result.error) return showToast(c.formError);
      recordCampusEvent("employment.application.submitted", {
        applicationId: result.record.id,
        jobId: result.record.jobId,
        decisionId: result.record.decisionId,
      }, {
        id: `employment.application.submitted:${result.record.id}`,
        timestamp: result.record.submittedAt,
      });
      selectedApplicationId = result.record.id;
      showToast(c.submitted);
      render({ preserveWindow: false });
      navigateToDeepLink(`employment-application-${result.record.id}`);
      return;
    }
    if (event.target.matches("[data-employment-response]")) {
      event.preventDefault();
      const data = new FormData(event.target);
      const result = respondEmploymentApplication(event.target.dataset.employmentResponse, data.get("kind"), data.get("note"));
      if (result.error) return;
      recordCampusEvent("employment.application.responded", {
        applicationId: result.record.id,
        jobId: result.record.jobId,
        response: result.record.response.kind,
      }, {
        id: `employment.application.responded:${result.record.id}:${result.record.response.respondedAt}`,
        timestamp: result.record.response.respondedAt,
        causationId: `employment.application.submitted:${result.record.id}`,
      });
      showToast(c.responded);
      render();
      return;
    }
    if (event.target.matches("[data-employment-attest]")) {
      event.preventDefault();
      const data = new FormData(event.target);
      const result = attestEmploymentOutcome({
        displayName: data.get("displayName"),
        outcomeId: data.get("outcomeId"),
        simultaneous: data.has("simultaneous"),
        note: data.get("note"),
      });
      if (result.error) return showToast(c.attestationError);
      recordCampusEvent("employment.outcome.attested", {
        attestationId: result.record.id,
        outcomeId: result.record.outcomeId,
        simultaneous: result.record.simultaneous,
      }, {
        id: `employment.outcome.attested:${result.record.id}`,
        timestamp: result.record.attestedAt,
      });
      showToast(c.attested);
      render();
    }
  });
  root.addEventListener("click", async (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    if (event.target.closest("[data-employment-print]")) {
      printDocument(root.querySelector(".employment-job-file"), {
        title: root.querySelector(".employment-job-file h3")?.textContent || document.title,
      });
      return;
    }
    if (event.target.closest("[data-employment-share]")) {
      await navigator.clipboard?.writeText(window.location.href);
      showToast(c.shareCopied);
    }
  });
}

function initialState() {
  let route = "";
  try { route = decodeURIComponent(location.hash.slice(1)); } catch { route = location.hash.slice(1); }
  if (route.startsWith("employment-job-")) selectedJobId = route.slice("employment-job-".length);
  if (route.startsWith("employment-application-")) selectedApplicationId = route.slice("employment-application-".length);
}

export function initEmployment() {
  root = document.querySelector("[data-employment-app]");
  if (!root) return;
  initialState();
  render({ preserveWindow: false });
  bind();
  registerDeepLink("employment-application-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "employment-application",
    position: "always",
    open(id) {
      selectedApplicationId = id;
      render({ preserveWindow: false });
    },
  });
  registerDeepLink("employment-job-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "employment-job",
    position: "always",
    open(id) {
      selectedJobId = id;
      render({ preserveWindow: false });
    },
  });
  ["employment-market", "employment-job-board", "employment-outcomes", "employment-records"].forEach((route) => {
    registerDeepLink(route, {
      anchor: () => document.getElementById(route) || root,
      position: "always",
      open() {
        render({ preserveWindow: false });
      },
    });
  });
  window.addEventListener("tu:languagechange", () => render({ preserveWindow: false }));
  window.addEventListener("tu:recordschange", () => render());
}
