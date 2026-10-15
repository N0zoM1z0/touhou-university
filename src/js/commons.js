import { trees as catalogTrees } from "../generated/i18n/ui/commons.js";
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

const copy = catalogTrees["copy"];

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
