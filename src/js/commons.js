import {
  propertyDispositionLabels,
  propertyItem,
  propertyItems,
  propertyJurisdictions,
  propertyLocalized,
} from "../data/property.js";
import {
  postDeliveryChannels,
  postLocalized,
  postSourceKinds,
  postTrustLabels,
} from "../data/post.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { bindImeSafeInput } from "./ime-input.js";
import { getLocale } from "./i18n.js";
import {
  propertyClaim,
  propertyClaims,
  propertyOpinions,
  resolvePropertyClaim,
  submitPropertyClaim,
} from "./property-model.js";
import {
  acknowledgePost,
  postDispatches,
  postMessage,
  postMessages,
  readPostAloud,
  requestPostCorrection,
  sendPostNotice,
  togglePostPin,
  togglePostRead,
} from "./post-model.js";
import { printDocument } from "./print-document.js";
import { renderPreservingState } from "./render-state.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

let root;
let view = "property";
let selectedItemId = propertyItems[0].id;
let selectedClaimId = null;
let selectedMessageId = null;
let propertyQuery = "";
let postQuery = "";

const copy = {
  "zh-Hant": {
    eyebrow: "CAMPUS COMMONS / 付喪神物權 × 鴉天狗郵便",
    title: "東西被弄丟之後可能有自己的意見；通知被送到之後，也未必還是同一個版本。",
    lead: "在物權庭，收據、磨損、來源與物件本人分席陳述；在郵便中心，每封信都留下來源、可信度、版次、送達順序與訂正。兩邊的卷宗會互相寄信。",
    propertyTab: "失物與物權",
    postTab: "郵便與通知",
    propertyDesk: "付喪神失物招領與物權仲裁處",
    propertyLead: "失物可以否認自己遺失，原持有人也可以申訴；但誰都不能把物件的陳述縮成「有點舊」。",
    items: "待審物件",
    hearings: "我的聽證",
    resolved: "已有裁定",
    searchProperty: "搜尋物件、地點、陳述或案號",
    openFile: "打開物件案卷",
    foundAt: "拾得位置",
    foundBy: "拾得記錄",
    condition: "現況",
    dispute: "爭點",
    statement: "物件本人陳述",
    evidence: "現有證物",
    jurisdiction: "重疊管轄",
    claim: "提出領回／去向申請",
    claimant: "申請人或物件姓名",
    relationship: "你與物件的關係",
    relationHolder: "前／現持有人",
    relationFinder: "拾得人",
    relationCustodian: "保管單位",
    relationObject: "我就是這件物件",
    relationWitness: "目擊者",
    relationOther: "其他關係",
    claimEvidence: "請說明使用痕跡、時間、目擊、照護或來源；只寫「是我的」不夠",
    requested: "希望的去向",
    hearVoice: "我已讀過物件陳述，不會把它當作沒有意見的附件",
    acceptConditions: "我接受返還、保管或自主去向可能附帶照護與申訴條件",
    submitClaim: "送入四席聽證",
    claimantError: "申請人名稱至少需要兩個字元。",
    evidenceError: "請留下至少 18 個字元、可以被追溯的理由。",
    voiceError: "要先承認物件本人在這宗案子裡有一張椅子。",
    hearingTitle: "四席各自留下意見",
    hearingLead: "這裡沒有平均分；四席的問題與異議會一起進入裁定。",
    chooseRuling: "作出暫行裁定",
    issueRuling: "蓋下裁定紅印",
    conditionsError: "這個去向需要接受後續條件；否則只能追加聽證或留置保管。",
    ruling: "物權裁定書",
    printRuling: "列印／另存裁定書",
    noClaims: "這台裝置尚未提交物權申請。",
    submitted: "申請已進入四席聽證；鴉天狗通知也到了。",
    ruled: "裁定已封存；物件仍保留申訴權。",
    postDesk: "鴉天狗校園郵便與通知中心",
    postLead: "入學通知可以早於申請，取消信可以晚於補考；至少讓來源、版次與訂正別一起失蹤。",
    inbox: "收件箱",
    compose: "寄發通知",
    sent: "寄件卷",
    searchPost: "搜尋主旨、來源或內文",
    unread: "未讀",
    pinned: "釘在木板上",
    source: "來源",
    trust: "可信度",
    version: "版次",
    delivery: "送達順序",
    correction: "訂正／版本說明",
    noCorrection: "這一版沒有另附訂正；不代表標題可靠。",
    openLetter: "拆信",
    markRead: "切換已讀",
    pin: "釘選／取消釘選",
    acknowledge: "簽收這一版",
    correctionRequest: "要求寄送訂正版",
    readAloud: "讓妖精朗讀全信",
    readAloudWarning: "已朗讀：這會把私人信件變成一場很公開的演出。",
    correctionRequested: "訂正請求已送出；文聲稱這證明原標題很成功。",
    acknowledged: "已簽收目前版次，不代表同意內容。",
    recipient: "收件人／處室",
    subject: "主旨",
    body: "正文",
    channel: "投遞方式",
    visibility: "可見範圍",
    private: "私人信件",
    campus: "校內可見",
    public: "公開到校園 BBS",
    send: "封口並交給鴉天狗",
    recipientError: "請寫一位收件人。",
    subjectError: "主旨至少需要三個字元。",
    bodyError: "正文至少需要十二個字元。",
    dispatched: "郵件已投遞；是否按順序抵達另議。",
    noSent: "這台裝置尚未寄出通知。",
    minutesAgo: "分鐘前",
    hoursAgo: "小時前",
    daysAgo: "天前",
    justNow: "剛剛",
    share: "複製這份案卷網址",
    copied: "網址已複製。",
    back: "回到案卷架",
  },
  ja: {
    eyebrow: "CAMPUS COMMONS / 付喪神物権 × 鴉天狗郵便",
    title: "物が失われた後には意見があり、通知が届いた後には別の版かもしれない。",
    lead: "物権所では領収書・摩耗・来歴・物件本人が別席で陳述。郵便では資料源、信頼度、版、配達順、訂正を保存し、両方の記録が互いに手紙を送ります。",
    propertyTab: "遺失物・物権",
    postTab: "郵便・通知",
    propertyDesk: "付喪神遺失物取扱・物権仲裁所",
    propertyLead: "遺失物は紛失を否認でき、旧持主も不服申立できます。ただし物件の陳述を「少し古い」に縮められません。",
    items: "審理待ち物件",
    hearings: "自分の聴聞",
    resolved: "裁定済み",
    searchProperty: "物件・場所・陳述・番号を検索",
    openFile: "物件記録を開く",
    foundAt: "拾得場所",
    foundBy: "拾得記録",
    condition: "現況",
    dispute: "争点",
    statement: "物件本人の陳述",
    evidence: "現有証物",
    jurisdiction: "重複管轄",
    claim: "受取／行先申請",
    claimant: "申請人または物件名",
    relationship: "物件との関係",
    relationHolder: "前／現持主",
    relationFinder: "拾得人",
    relationCustodian: "保管部署",
    relationObject: "私がこの物件です",
    relationWitness: "目撃者",
    relationOther: "その他",
    claimEvidence: "使用痕、時刻、目撃、手入れ、来歴を記述。「自分の物」だけでは不足",
    requested: "希望する行先",
    hearVoice: "物件の陳述を読み、意見のない附属物として扱いません",
    acceptConditions: "返還・保管・自主行先に手入れと不服申立条件が付く場合があります",
    submitClaim: "四席聴聞へ送る",
    claimantError: "申請人名は二文字以上必要です。",
    evidenceError: "追跡可能な理由を18文字以上残してください。",
    voiceError: "まず物件本人の席を認めてください。",
    hearingTitle: "四席が別々に意見を残す",
    hearingLead: "平均点はありません。四席の問いと異議がそのまま裁定へ入ります。",
    chooseRuling: "暫定裁定を選択",
    issueRuling: "裁定の赤印を押す",
    conditionsError: "この行先には条件受諾が必要です。拒否する場合は追加聴聞か留置のみ。",
    ruling: "物権裁定書",
    printRuling: "裁定書を印刷／PDF 保存",
    noClaims: "この端末からの物権申請はありません。",
    submitted: "申請は四席聴聞へ入り、鴉天狗通知も到着しました。",
    ruled: "裁定を封印保存。物件の不服申立権は残ります。",
    postDesk: "鴉天狗学内郵便・通知センター",
    postLead: "合格通知は願書より早く、取消状は追試より遅く届くことがあります。資料源・版・訂正まで失わないでください。",
    inbox: "受信箱",
    compose: "通知を送る",
    sent: "送信記録",
    searchPost: "件名・資料源・本文を検索",
    unread: "未読",
    pinned: "木札へ固定",
    source: "資料源",
    trust: "信頼度",
    version: "版",
    delivery: "配達順",
    correction: "訂正・版説明",
    noCorrection: "この版に訂正はありません。見出しが正しいとは限りません。",
    openLetter: "開封",
    markRead: "既読切替",
    pin: "固定／解除",
    acknowledge: "この版を受領",
    correctionRequest: "訂正版を要求",
    readAloud: "妖精に全文朗読させる",
    readAloudWarning: "朗読済み。私信がかなり公開の演奏になりました。",
    correctionRequested: "訂正要求を送信。文は元見出しが成功した証拠だと主張。",
    acknowledged: "現版を受領。内容への同意ではありません。",
    recipient: "宛先／部署",
    subject: "件名",
    body: "本文",
    channel: "配達方法",
    visibility: "公開範囲",
    private: "私信",
    campus: "学内公開",
    public: "学内 BBS へ公開",
    send: "封をして鴉天狗へ",
    recipientError: "宛先を記入してください。",
    subjectError: "件名は三文字以上必要です。",
    bodyError: "本文は十二文字以上必要です。",
    dispatched: "投函しました。順番どおり届くかは別問題です。",
    noSent: "この端末から送った通知はありません。",
    minutesAgo: "分前",
    hoursAgo: "時間前",
    daysAgo: "日前",
    justNow: "たった今",
    share: "記録 URL をコピー",
    copied: "URL をコピーしました。",
    back: "記録棚へ戻る",
  },
  en: {
    eyebrow: "CAMPUS COMMONS / TSUKUMOGAMI TITLE × TENGU POST",
    title: "A thing may have an opinion after being lost; a notice may be another version after delivery.",
    lead: "At Property, receipts, wear, provenance, and the object testify separately. At Post, every letter retains source, trust, version, order, and correction. The two offices mail one another.",
    propertyTab: "Lost property & title",
    postTab: "Post & notices",
    propertyDesk: "Tsukumogami Lost Property & Title Tribunal",
    propertyLead: "Lost things may deny being lost and former holders may appeal; nobody may reduce an object's testimony to “a bit old”.",
    items: "Objects awaiting review",
    hearings: "My hearings",
    resolved: "Rulings",
    searchProperty: "Search object, place, statement, or code",
    openFile: "Open object file",
    foundAt: "Found at",
    foundBy: "Finding record",
    condition: "Condition",
    dispute: "Dispute",
    statement: "Object's own statement",
    evidence: "Evidence on file",
    jurisdiction: "Overlapping jurisdiction",
    claim: "File a return / destination claim",
    claimant: "Claimant or object name",
    relationship: "Relationship to the object",
    relationHolder: "Former / current holder",
    relationFinder: "Finder",
    relationCustodian: "Custodial office",
    relationObject: "I am this object",
    relationWitness: "Witness",
    relationOther: "Other",
    claimEvidence: "Describe wear, time, witness, care, or provenance; “mine” is insufficient",
    requested: "Requested destination",
    hearVoice: "I read the object's statement and will not treat it as an opinionless accessory",
    acceptConditions: "I accept that return, custody, or autonomy may carry care and appeal conditions",
    submitClaim: "Send to four-seat hearing",
    claimantError: "The claimant name needs at least two characters.",
    evidenceError: "Leave at least 18 characters of traceable reasoning.",
    voiceError: "First recognise that the object has a chair in this case.",
    hearingTitle: "Four seats leave separate opinions",
    hearingLead: "There is no average score. Every question and objection enters the ruling.",
    chooseRuling: "Choose an interim ruling",
    issueRuling: "Stamp the ruling",
    conditionsError: "That destination requires follow-up conditions; otherwise choose further hearing or protective hold.",
    ruling: "Property ruling",
    printRuling: "Print / save ruling",
    noClaims: "No property claim has been filed on this device.",
    submitted: "The claim entered four-seat hearing; its tengu notice has also arrived.",
    ruled: "The ruling is filed; the object retains its right of appeal.",
    postDesk: "Crow-Tengu Campus Post & Notification Centre",
    postLead: "An offer may precede an application and cancellation may follow the make-up. At least keep source, version, and correction from vanishing together.",
    inbox: "Inbox",
    compose: "Send a notice",
    sent: "Dispatch files",
    searchPost: "Search subject, source, or body",
    unread: "Unread",
    pinned: "Pinned to board",
    source: "Source",
    trust: "Trust",
    version: "Version",
    delivery: "Delivery order",
    correction: "Correction / version note",
    noCorrection: "No correction accompanies this version; the headline may still be wrong.",
    openLetter: "Open letter",
    markRead: "Toggle read",
    pin: "Pin / unpin",
    acknowledge: "Acknowledge this version",
    correctionRequest: "Request corrected copy",
    readAloud: "Let a fairy read it aloud",
    readAloudWarning: "Read aloud: this private letter is now a rather public performance.",
    correctionRequested: "Correction requested; Aya says this proves the original headline worked.",
    acknowledged: "Current version acknowledged; contents not necessarily accepted.",
    recipient: "Recipient / office",
    subject: "Subject",
    body: "Body",
    channel: "Delivery channel",
    visibility: "Visibility",
    private: "Private letter",
    campus: "Campus-visible",
    public: "Publish to campus BBS",
    send: "Seal and hand to a crow tengu",
    recipientError: "Name a recipient.",
    subjectError: "The subject needs at least three characters.",
    bodyError: "The body needs at least twelve characters.",
    dispatched: "Dispatched; arrival order remains negotiable.",
    noSent: "No notice has been sent from this device.",
    minutesAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",
    justNow: "just now",
    share: "Copy this file URL",
    copied: "URL copied.",
    back: "Back to file rack",
  },
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  })[character]);
}

const t = (value, locale) => propertyLocalized(value, locale);

function relativeTime(value, locale, c) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60_000));
  if (minutes < 2) return c.justNow;
  if (minutes < 60) return `${minutes} ${c.minutesAgo}`;
  if (minutes < 1_440) return `${Math.round(minutes / 60)} ${c.hoursAgo}`;
  return `${Math.round(minutes / 1_440)} ${c.daysAgo}`;
}

function formatDate(value, locale) {
  return new Intl.DateTimeFormat(locale === "zh-Hant" ? "zh-TW" : locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function hero(c) {
  const claims = propertyClaims();
  const messages = postMessages(getLocale());
  return `
    <header class="commons-hero" id="campus-commons-top">
      <div>
        <p>${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
      </div>
      <dl>
        <div><dt>${c.items}</dt><dd>${propertyItems.length}</dd></div>
        <div><dt>${c.hearings}</dt><dd>${claims.filter((claim) => claim.status === "hearing").length}</dd></div>
        <div><dt>${c.unread}</dt><dd>${messages.filter((message) => !message.state.read).length}</dd></div>
      </dl>
    </header>`;
}

function topTabs(c) {
  return `
    <nav class="commons-tabs" aria-label="${escapeHtml(c.eyebrow)}">
      <button type="button" class="${view.startsWith("property") ? "active" : ""}" data-commons-view="property"><span>物</span>${c.propertyTab}</button>
      <button type="button" class="${view.startsWith("post") ? "active" : ""}" data-commons-view="post"><span>便</span>${c.postTab}</button>
    </nav>`;
}

function propertySubnav(c) {
  return `
    <div class="commons-subnav">
      <button type="button" class="${view === "property" || view === "property-item" ? "active" : ""}" data-commons-view="property">${c.items}</button>
      <button type="button" class="${view === "property-records" || view === "property-claim" ? "active" : ""}" data-commons-view="property-records">${c.hearings}</button>
    </div>`;
}

function propertyCard(item, locale, c) {
  return `
    <article class="property-card" id="property-item-${item.id}">
      <span class="property-card-glyph">${item.glyph}</span>
      <div>
        <p>${item.code} · ${item.jurisdictions.map((id) => t(propertyJurisdictions[id], locale)).join(" / ")}</p>
        <h4>${t(item.name, locale)}</h4>
        <span>${t(item.statement, locale)}</span>
      </div>
      <button type="button" data-property-item="${item.id}">${c.openFile}<b>↗</b></button>
    </article>`;
}

function propertyRack(locale, c) {
  const query = propertyQuery.trim().toLocaleLowerCase(locale);
  const filtered = propertyItems.filter((item) => {
    if (!query) return true;
    return [
      item.code,
      t(item.name, locale),
      t(item.foundAt, locale),
      t(item.statement, locale),
      t(item.dispute, locale),
    ].join(" ").toLocaleLowerCase(locale).includes(query);
  });
  return `
    <section class="commons-desk-heading" id="property-desk">
      <div><p>TSUKUMOGAMI PROPERTY TRIBUNAL</p><h3>${c.propertyDesk}</h3><span>${c.propertyLead}</span></div>
      <label class="commons-search"><span aria-hidden="true">⌕</span><input type="search" data-property-query value="${escapeHtml(propertyQuery)}" placeholder="${escapeHtml(c.searchProperty)}"></label>
    </section>
    ${propertySubnav(c)}
    <div class="property-rack">${filtered.map((item) => propertyCard(item, locale, c)).join("")}</div>`;
}

function claimForm(item, locale, c) {
  const relationOptions = [
    ["holder", c.relationHolder],
    ["finder", c.relationFinder],
    ["custodian", c.relationCustodian],
    ["object", c.relationObject],
    ["witness", c.relationWitness],
    ["other", c.relationOther],
  ];
  return `
    <form class="property-claim-form" data-property-claim-form="${item.id}">
      <div class="commons-form-heading"><span>申</span><div><p>${item.code}</p><h4>${c.claim}</h4></div></div>
      <div class="form-grid">
        <label><span>${c.claimant}</span><input name="claimant" required maxlength="100"></label>
        <label><span>${c.relationship}</span><select name="relationship">${relationOptions.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}</select></label>
        <label class="wide"><span>${c.claimEvidence}</span><textarea name="evidence" required rows="5" maxlength="1600"></textarea></label>
        <label class="wide"><span>${c.requested}</span><select name="requestedDisposition">${item.responses.map(([id, label]) => `<option value="${id}">${t(label, locale)}</option>`).join("")}</select></label>
      </div>
      <label class="commons-check"><input type="checkbox" name="acceptsObjectVoice" required><span>${c.hearVoice}</span></label>
      <label class="commons-check"><input type="checkbox" name="acceptsConditions"><span>${c.acceptConditions}</span></label>
      <button class="commons-primary" type="submit">${c.submitClaim}<span>→</span></button>
    </form>`;
}

function propertyItemView(locale, c) {
  const item = propertyItem(selectedItemId) || propertyItems[0];
  return `
    <button class="commons-back" type="button" data-commons-view="property">← ${c.back}</button>
    <article class="property-file" id="property-item-${item.id}">
      <header><span>${item.glyph}</span><div><p>${item.code} / OBJECT TESTIMONY</p><h3>${t(item.name, locale)}</h3><em>${t(item.condition, locale)}</em></div></header>
      <blockquote><b>${c.statement}</b>${t(item.statement, locale)}</blockquote>
      <div class="property-facts">
        <section><h4>${c.foundAt}</h4><p>${t(item.foundAt, locale)}</p></section>
        <section><h4>${c.foundBy}</h4><p>${t(item.foundBy, locale)}</p></section>
        <section class="wide"><h4>${c.dispute}</h4><p>${t(item.dispute, locale)}</p></section>
      </div>
      <section class="property-evidence"><h4>${c.evidence}</h4><ol>${item.evidence.map((entry) => `<li>${t(entry, locale)}</li>`).join("")}</ol></section>
      <section class="property-jurisdictions"><h4>${c.jurisdiction}</h4><div>${item.jurisdictions.map((id) => `<span>${t(propertyJurisdictions[id], locale)}</span>`).join("")}</div></section>
    </article>
    ${claimForm(item, locale, c)}`;
}

function opinionCard(opinion, locale) {
  return `
    <article class="property-opinion" data-standing="${opinion.standing}">
      <header><span>${opinion.glyph}</span><div><p>${t(opinion.seat, locale)}</p><h4>${t(opinion.name, locale)}</h4></div></header>
      <b>${t(opinion.question, locale)}</b>
      <p>${t(opinion.note, locale)}</p>
      <small>${opinion.standing.toUpperCase()}</small>
    </article>`;
}

function propertyClaimView(locale, c) {
  const claim = propertyClaim(selectedClaimId);
  if (!claim) return propertyRecordsView(locale, c);
  const item = propertyItem(claim.itemId);
  const opinions = propertyOpinions(claim.id);
  const chosen = claim.disposition || claim.requestedDisposition;
  return `
    <button class="commons-back" type="button" data-commons-view="property-records">← ${c.back}</button>
    <article class="property-hearing" id="property-claim-${claim.id}">
      <header>
        <div><p>${claim.id} · ${item.code}</p><h3>${claim.status === "resolved" ? c.ruling : c.hearingTitle}</h3><span>${t(item.name, locale)}</span></div>
        <strong>${claim.status === "resolved" ? t(propertyDispositionLabels[claim.disposition], locale) : c.hearings}</strong>
      </header>
      <div class="property-claim-summary">
        <p><b>${c.claimant}</b>${escapeHtml(claim.claimant)}</p>
        <p><b>${c.requested}</b>${t(propertyDispositionLabels[claim.requestedDisposition], locale)}</p>
        <blockquote>${escapeHtml(claim.evidence)}</blockquote>
      </div>
      <section><div class="commons-section-title"><p>FOUR SEATS / NO AVERAGE</p><h4>${c.hearingTitle}</h4><span>${c.hearingLead}</span></div><div class="property-opinions">${opinions.map((opinion) => opinionCard(opinion, locale)).join("")}</div></section>
      ${claim.status === "resolved" ? `
        <section class="property-ruling-document" data-property-print-document>
          <p>TOUHOU UNIVERSITY · ${claim.rulingNumber}</p>
          <h4>${c.ruling}</h4>
          <dl>
            <div><dt>${c.claimant}</dt><dd>${escapeHtml(claim.claimant)}</dd></div>
            <div><dt>${c.statement}</dt><dd>${t(item.statement, locale)}</dd></div>
            <div><dt>${c.ruling}</dt><dd>${t(propertyDispositionLabels[claim.disposition], locale)}</dd></div>
            <div><dt>DATE</dt><dd>${formatDate(claim.resolvedAt, locale)}</dd></div>
          </dl>
          <p>${item.responses.find(([id]) => id === claim.disposition)?.[1]?.[locale] || ""}</p>
          <footer>多多良小傘 ／ 森近霖之助 ／ 稗田阿求 ／ 四季映姬</footer>
        </section>
        <button class="commons-primary" type="button" data-property-print>${c.printRuling}<span>↗</span></button>
      ` : `
        <form class="property-ruling-form" data-property-ruling="${claim.id}">
          <label><span>${c.chooseRuling}</span><select name="disposition">${item.responses.map(([id, label]) => `<option value="${id}" ${id === chosen ? "selected" : ""}>${t(label, locale)}</option>`).join("")}</select></label>
          <button class="commons-primary" type="submit">${c.issueRuling}<span>判</span></button>
        </form>
      `}
      <button class="commons-share" type="button" data-copy-url>${c.share}</button>
    </article>`;
}

function propertyRecordsView(locale, c) {
  const claims = propertyClaims().slice().reverse();
  return `
    <section class="commons-desk-heading" id="property-records"><div><p>LOCAL HEARING LEDGER</p><h3>${c.hearings}</h3><span>${c.propertyLead}</span></div></section>
    ${propertySubnav(c)}
    <div class="commons-record-list">${claims.length ? claims.map((claim) => {
      const item = propertyItem(claim.itemId);
      return `
        <button type="button" class="commons-record" data-property-claim="${claim.id}">
          <span>${item.glyph}</span><div><p>${claim.id}</p><h4>${t(item.name, locale)}</h4><small>${escapeHtml(claim.claimant)} · ${formatDate(claim.submittedAt, locale)}</small></div>
          <b>${claim.status === "resolved" ? t(propertyDispositionLabels[claim.disposition], locale) : c.hearings} ↗</b>
        </button>`;
    }).join("") : `<p class="commons-empty">${c.noClaims}</p>`}</div>`;
}

function postSubnav(c) {
  return `
    <div class="commons-subnav">
      <button type="button" class="${view === "post" || view === "post-message" ? "active" : ""}" data-commons-view="post">${c.inbox}</button>
      <button type="button" class="${view === "post-compose" ? "active" : ""}" data-commons-view="post-compose">${c.compose}</button>
      <button type="button" class="${view === "post-sent" ? "active" : ""}" data-commons-view="post-sent">${c.sent}</button>
    </div>`;
}

function messageCard(message, locale, c) {
  return `
    <button type="button" class="post-message-row ${message.state.read ? "read" : "unread"} ${message.state.pinned ? "pinned" : ""}" id="post-message-${message.id}" data-post-message="${message.id}">
      <span class="post-message-glyph">${message.glyph}</span>
      <div>
        <p>${escapeHtml(message.source)} · v${message.version} ${message.state.pinned ? `· ${c.pinned}` : ""}</p>
        <h4>${escapeHtml(message.subject)}</h4>
        <small>${relativeTime(message.createdAt, locale, c)} · ${t(postTrustLabels[message.trust] || postTrustLabels.witnessed, locale)}</small>
      </div>
      <b>${message.state.read ? "○" : "●"}</b>
    </button>`;
}

function postInbox(locale, c) {
  const query = postQuery.trim().toLocaleLowerCase(locale);
  const messages = postMessages(locale).filter((message) => {
    if (!query) return true;
    return [message.subject, message.source, message.body].join(" ").toLocaleLowerCase(locale).includes(query);
  });
  return `
    <section class="commons-desk-heading post-heading" id="post-inbox">
      <div><p>CROW-TENGU CAMPUS POST</p><h3>${c.postDesk}</h3><span>${c.postLead}</span></div>
      <label class="commons-search"><span aria-hidden="true">⌕</span><input type="search" data-post-query value="${escapeHtml(postQuery)}" placeholder="${escapeHtml(c.searchPost)}"></label>
    </section>
    ${postSubnav(c)}
    <div class="post-inbox">${messages.map((message) => messageCard(message, locale, c)).join("")}</div>`;
}

function postMessageView(locale, c) {
  const message = postMessage(selectedMessageId, locale);
  if (!message) return postInbox(locale, c);
  return `
    <button class="commons-back" type="button" data-commons-view="post">← ${c.back}</button>
    <article class="post-letter ${message.state.readAloudAt ? "read-aloud" : ""}" id="post-message-${message.id}">
      <header>
        <span>${message.glyph}</span>
        <div><p>${escapeHtml(message.source)} · ${relativeTime(message.createdAt, locale, c)}</p><h3>${escapeHtml(message.subject)}</h3></div>
        <b>v${message.version}</b>
      </header>
      <div class="post-metadata">
        <p><b>${c.source}</b>${t(postSourceKinds[message.sourceKind] || postSourceKinds.system, locale)}</p>
        <p><b>${c.trust}</b>${t(postTrustLabels[message.trust] || postTrustLabels.witnessed, locale)}</p>
        <p><b>${c.version}</b>v${message.version}</p>
        <p><b>${c.delivery}</b>${escapeHtml(message.ordering || "normal")}</p>
      </div>
      <div class="post-body">${escapeHtml(message.body).replace(/\n/g, "<br>")}</div>
      <aside><b>${c.correction}</b><p>${escapeHtml(message.correction || c.noCorrection)}</p></aside>
      ${message.state.readAloudAt ? `<p class="post-read-aloud">${c.readAloudWarning}</p>` : ""}
      <footer>
        <button type="button" data-post-read="${message.id}">${c.markRead}</button>
        <button type="button" data-post-pin="${message.id}">${c.pin}</button>
        <button type="button" data-post-ack="${message.id}">${c.acknowledge}</button>
        <button type="button" data-post-correction="${message.id}">${c.correctionRequest}</button>
        <button type="button" data-post-aloud="${message.id}">${c.readAloud}</button>
      </footer>
      <button class="commons-share" type="button" data-copy-url>${c.share}</button>
    </article>`;
}

function postCompose(locale, c) {
  return `
    <section class="commons-desk-heading" id="post-compose"><div><p>OUTGOING POUCH</p><h3>${c.compose}</h3><span>${c.postLead}</span></div></section>
    ${postSubnav(c)}
    <form class="post-compose" data-post-compose>
      <div class="form-grid">
        <label><span>${c.recipient}</span><input name="recipient" required maxlength="100"></label>
        <label><span>${c.subject}</span><input name="subject" required maxlength="200"></label>
        <label><span>${c.channel}</span><select name="channelId">${postDeliveryChannels.map((channel) => `<option value="${channel.id}">${channel.glyph} · ${t(channel.name, locale)} — ${t(channel.speed, locale)}</option>`).join("")}</select></label>
        <label><span>${c.visibility}</span><select name="visibility"><option value="private">${c.private}</option><option value="campus">${c.campus}</option><option value="public">${c.public}</option></select></label>
        <label class="wide"><span>${c.body}</span><textarea name="body" rows="8" required maxlength="1800"></textarea></label>
      </div>
      <button class="commons-primary" type="submit">${c.send}<span>鴉</span></button>
    </form>`;
}

function postSent(locale, c) {
  const dispatches = postDispatches().slice().reverse();
  return `
    <section class="commons-desk-heading" id="post-records"><div><p>DISPATCH LEDGER</p><h3>${c.sent}</h3><span>${c.postLead}</span></div></section>
    ${postSubnav(c)}
    <div class="commons-record-list">${dispatches.length ? dispatches.map((record) => `
      <button type="button" class="commons-record" id="post-dispatch-${record.id}" data-post-message="dispatch-${record.id}">
        <span>送</span><div><p>${record.id} · ${record.channelId}</p><h4>${escapeHtml(record.subject)}</h4><small>${escapeHtml(record.recipient)} · ${formatDate(record.sentAt, locale)}</small></div><b>v${record.version} ↗</b>
      </button>`).join("") : `<p class="commons-empty">${c.noSent}</p>`}</div>`;
}

function render(options = {}) {
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  renderPreservingState(root, () => {
    let body = propertyRack(locale, c);
    if (view === "property-item") body = propertyItemView(locale, c);
    if (view === "property-records") body = propertyRecordsView(locale, c);
    if (view === "property-claim") body = propertyClaimView(locale, c);
    if (view === "post") body = postInbox(locale, c);
    if (view === "post-message") body = postMessageView(locale, c);
    if (view === "post-compose") body = postCompose(locale, c);
    if (view === "post-sent") body = postSent(locale, c);
    root.innerHTML = `${hero(c)}${topTabs(c)}<div class="commons-workspace">${body}</div>`;
  }, { preserveWindow: options.preserveWindow ?? true });
  bindFilters();
}

function bindFilters() {
  const propertyInput = root.querySelector("[data-property-query]");
  if (propertyInput) bindImeSafeInput(propertyInput, (event) => {
    propertyQuery = event.currentTarget.value;
    render();
  });
  const postInput = root.querySelector("[data-post-query]");
  if (postInput) bindImeSafeInput(postInput, (event) => {
    postQuery = event.currentTarget.value;
    render();
  });
}

function showItem(id, navigate = true) {
  if (!propertyItem(id)) return;
  selectedItemId = id;
  view = "property-item";
  if (navigate) return navigateToDeepLink(`property-item-${id}`);
  render({ preserveWindow: false });
}

function showClaim(id, navigate = true) {
  const claim = propertyClaim(id);
  if (!claim) return;
  selectedClaimId = id;
  selectedItemId = claim.itemId;
  view = "property-claim";
  if (navigate) return navigateToDeepLink(`property-claim-${id}`);
  render({ preserveWindow: false });
}

function showMessage(id, navigate = true) {
  const locale = getLocale();
  if (!postMessage(id, locale)) return;
  selectedMessageId = id;
  view = "post-message";
  if (navigate) {
    const route = id.startsWith("dispatch-")
      ? `post-dispatch-${id.slice("dispatch-".length)}`
      : `post-message-${id}`;
    return navigateToDeepLink(route);
  }
  render({ preserveWindow: false });
}

function navigateView(next) {
  view = next;
  const route = {
    property: "property-desk",
    "property-records": "property-records",
    post: "post-inbox",
    "post-compose": "post-compose",
    "post-sent": "post-records",
  }[next];
  if (route) navigateToDeepLink(route);
}

function recordClaimSubmission(claim) {
  recordCampusEvent("property.claim.submitted", {
    claimId: claim.id,
    itemId: claim.itemId,
    requestedDisposition: claim.requestedDisposition,
  }, { id: `property.claim.submitted:${claim.id}`, timestamp: claim.submittedAt });
}

function recordRuling(claim) {
  recordCampusEvent("property.ruling.issued", {
    claimId: claim.id,
    itemId: claim.itemId,
    disposition: claim.disposition,
    rulingNumber: claim.rulingNumber,
  }, { id: `property.ruling.issued:${claim.id}`, timestamp: claim.resolvedAt });
}

function bindEvents() {
  root.addEventListener("click", async (event) => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    const viewButton = event.target.closest("[data-commons-view]");
    if (viewButton) {
      navigateView(viewButton.dataset.commonsView);
      return;
    }
    const itemButton = event.target.closest("[data-property-item]");
    if (itemButton) {
      showItem(itemButton.dataset.propertyItem);
      return;
    }
    const claimButton = event.target.closest("[data-property-claim]");
    if (claimButton) {
      showClaim(claimButton.dataset.propertyClaim);
      return;
    }
    const messageButton = event.target.closest("[data-post-message]");
    if (messageButton) {
      showMessage(messageButton.dataset.postMessage);
      return;
    }
    const read = event.target.closest("[data-post-read]");
    if (read) {
      togglePostRead(read.dataset.postRead);
      render();
      return;
    }
    const pin = event.target.closest("[data-post-pin]");
    if (pin) {
      togglePostPin(pin.dataset.postPin);
      render();
      return;
    }
    const ack = event.target.closest("[data-post-ack]");
    if (ack) {
      const state = acknowledgePost(ack.dataset.postAck);
      recordCampusEvent("post.message.acknowledged", {
        messageId: ack.dataset.postAck,
        version: postMessage(ack.dataset.postAck, locale)?.version || 1,
      }, { id: `post.message.acknowledged:${ack.dataset.postAck}`, timestamp: state.acknowledgedAt });
      showToast(c.acknowledged);
      render();
      return;
    }
    const correction = event.target.closest("[data-post-correction]");
    if (correction) {
      const state = requestPostCorrection(correction.dataset.postCorrection);
      recordCampusEvent("post.correction.requested", {
        messageId: correction.dataset.postCorrection,
      }, { id: `post.correction.requested:${correction.dataset.postCorrection}`, timestamp: state.correctionRequestedAt });
      showToast(c.correctionRequested);
      render();
      return;
    }
    const aloud = event.target.closest("[data-post-aloud]");
    if (aloud) {
      readPostAloud(aloud.dataset.postAloud);
      showToast(c.readAloudWarning);
      render();
      return;
    }
    if (event.target.closest("[data-property-print]")) {
      const documentElement = root.querySelector("[data-property-print-document]");
      if (documentElement) printDocument(documentElement, { title: `${c.ruling} · Touhou University` });
      return;
    }
    if (event.target.closest("[data-copy-url]")) {
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
    const claimForm = event.target.closest("[data-property-claim-form]");
    if (claimForm) {
      event.preventDefault();
      const data = new FormData(claimForm);
      const result = submitPropertyClaim(claimForm.dataset.propertyClaimForm, {
        claimant: data.get("claimant"),
        relationship: data.get("relationship"),
        evidence: data.get("evidence"),
        requestedDisposition: data.get("requestedDisposition"),
        acceptsObjectVoice: data.get("acceptsObjectVoice") === "on",
        acceptsConditions: data.get("acceptsConditions") === "on",
      });
      if (result.error) {
        showToast(result.error === "claimant" ? c.claimantError : result.error === "evidence" ? c.evidenceError : c.voiceError);
        return;
      }
      recordClaimSubmission(result.claim);
      showToast(c.submitted);
      showClaim(result.claim.id);
      return;
    }
    const rulingForm = event.target.closest("[data-property-ruling]");
    if (rulingForm) {
      event.preventDefault();
      const result = resolvePropertyClaim(rulingForm.dataset.propertyRuling, new FormData(rulingForm).get("disposition"));
      if (result.error) {
        showToast(c.conditionsError);
        return;
      }
      recordRuling(result.claim);
      showToast(c.ruled);
      showClaim(result.claim.id, false);
      return;
    }
    const composeForm = event.target.closest("[data-post-compose]");
    if (composeForm) {
      event.preventDefault();
      const data = new FormData(composeForm);
      const result = sendPostNotice({
        recipient: data.get("recipient"),
        subject: data.get("subject"),
        body: data.get("body"),
        channelId: data.get("channelId"),
        visibility: data.get("visibility"),
      });
      if (result.error) {
        showToast(result.error === "recipient" ? c.recipientError : result.error === "subject" ? c.subjectError : c.bodyError);
        return;
      }
      recordCampusEvent("post.notice.dispatched", {
        dispatchId: result.dispatch.id,
        channelId: result.dispatch.channelId,
        visibility: result.dispatch.visibility,
      }, { id: `post.notice.dispatched:${result.dispatch.id}`, timestamp: result.dispatch.sentAt });
      showToast(c.dispatched);
      view = "post-sent";
      navigateToDeepLink("post-records");
    }
  });
}

function initialView() {
  const route = safeDecodeFragment();
  if (route === "property-records") view = "property-records";
  if (route === "post-inbox") view = "post";
  if (route === "post-compose") view = "post-compose";
  if (route === "post-records") view = "post-sent";
  if (route.startsWith("property-item-")) {
    selectedItemId = route.slice("property-item-".length);
    view = "property-item";
  }
  if (route.startsWith("property-claim-")) {
    selectedClaimId = route.slice("property-claim-".length);
    const claim = propertyClaim(selectedClaimId);
    if (claim) {
      selectedItemId = claim.itemId;
      view = "property-claim";
    }
  }
  if (route.startsWith("post-message-")) {
    selectedMessageId = route.slice("post-message-".length);
    view = "post-message";
  }
  if (route.startsWith("post-dispatch-")) {
    selectedMessageId = `dispatch-${route.slice("post-dispatch-".length)}`;
    view = "post-message";
  }
}

export function initCommons() {
  root = document.querySelector("[data-commons-app]");
  if (!root) return;
  initialView();
  render({ preserveWindow: false });
  bindEvents();

  [
    ["property-desk", "property"],
    ["property-records", "property-records"],
    ["post-inbox", "post"],
    ["post-compose", "post-compose"],
    ["post-records", "post-sent"],
  ].forEach(([route, next]) => registerDeepLink(route, {
    anchor: () => document.getElementById(route) || root,
    position: "always",
    open() {
      view = next;
      render({ preserveWindow: false });
    },
  }));
  registerDeepLink("property-item-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "property-focus",
    position: "always",
    open(id) {
      showItem(id, false);
    },
  });
  registerDeepLink("property-claim-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "property-focus",
    position: "always",
    open(id) {
      showClaim(id, false);
    },
  });
  registerDeepLink("post-message-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "post-focus",
    position: "always",
    open(id) {
      showMessage(id, false);
    },
  });
  registerDeepLink("post-dispatch-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "post-focus",
    position: "always",
    open(id) {
      showMessage(`dispatch-${id}`, false);
    },
  });

  window.addEventListener("tu:languagechange", () => render({ preserveWindow: false }));
  window.addEventListener("tu:recordschange", () => render());
}
