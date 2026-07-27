import {
  postDeliveryChannels,
  postLocalized,
  postSeedMessages,
} from "../data/post.js";
import { academicCalendarEvent, academicCalendarSnapshot } from "../data/academic-calendar.js";
import { propertyClaimSummary, propertyClaims } from "./property-model.js";

const STATE_KEY = "tu:post:state";
const DISPATCH_KEY = "tu:post:dispatches";
const CALENDAR_KEY = "tu:calendar:bookmarks";
const MAX_DISPATCHES = 50;

export const postStorageKeys = Object.freeze({
  state: STATE_KEY,
  dispatches: DISPATCH_KEY,
});

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function validDate(value, fallback = new Date().toISOString()) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function text(value, limit = 1200) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function emit(reason, detail = {}) {
  window.dispatchEvent(new CustomEvent("tu:postchange", {
    detail: { reason, ...detail },
  }));
}

function normalizeState(value) {
  const messages = value && typeof value.messages === "object" ? value.messages : {};
  return {
    schema: 1,
    messages: Object.fromEntries(Object.entries(messages).map(([id, item]) => [id, {
      read: Boolean(item?.read),
      pinned: Boolean(item?.pinned),
      acknowledgedAt: item?.acknowledgedAt ? validDate(item.acknowledgedAt) : null,
      correctionRequestedAt: item?.correctionRequestedAt ? validDate(item.correctionRequestedAt) : null,
      readAloudAt: item?.readAloudAt ? validDate(item.readAloudAt) : null,
    }])),
  };
}

export function postState() {
  return normalizeState(readJson(STATE_KEY, null));
}

function updateMessageState(messageId, change, reason) {
  const state = postState();
  state.messages[messageId] = {
    read: false,
    pinned: false,
    acknowledgedAt: null,
    correctionRequestedAt: null,
    readAloudAt: null,
    ...(state.messages[messageId] || {}),
    ...change,
  };
  writeJson(STATE_KEY, state);
  emit(reason, { messageId });
  return state.messages[messageId];
}

function seededDate(entry, index, now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const minute = (1_440 - ((entry.ageMinutes || 30) + index * 17)) % 1_440;
  const stamp = new Date(start.getTime() + minute * 60_000);
  if (stamp > now) stamp.setDate(stamp.getDate() - 1);
  return stamp.toISOString();
}

function propertyMessages(locale) {
  return propertyClaims().slice(-8).map((claim) => {
    const summary = propertyClaimSummary(claim, locale);
    const resolved = claim.status === "resolved";
    return {
      id: `property-${claim.id}`,
      glyph: resolved ? "判" : "聽",
      source: locale === "ja" ? "付喪神物権仲裁所" : locale === "en" ? "Tsukumogami Property Tribunal" : "付喪神物權仲裁處",
      sourceKind: "system",
      trust: "sealed",
      version: 1,
      subject: resolved
        ? locale === "ja"
          ? `${summary.item.code} 裁定：${summary.disposition}`
          : locale === "en"
            ? `${summary.item.code} ruling: ${summary.disposition}`
            : `${summary.item.code} 裁定：${summary.disposition}`
        : locale === "ja"
          ? `${summary.item.code} 聴聞通知：物件本人の席を空けてください`
          : locale === "en"
            ? `${summary.item.code} hearing: leave a seat for the object`
            : `${summary.item.code} 聽證通知：請替物件本人留一張椅子`,
      body: resolved
        ? locale === "ja"
          ? `${claim.claimant} の請求は ${summary.disposition} で終結。ただし四席意見は統合されず、不服申立は残ります。`
          : locale === "en"
            ? `${claim.claimant}'s claim closed as ${summary.disposition}. Four seat opinions remain separate and appeal remains available.`
            : `${claim.claimant} 的申請以「${summary.disposition}」結案；四席意見仍分開保存，也仍可申訴。`
        : locale === "ja"
          ? `${claim.claimant} の請求を受領。領収書だけでなく、物件の陳述と来歴訂正を持参してください。`
          : locale === "en"
            ? `${claim.claimant}'s claim was received. Bring not only receipts but the object's statement and provenance corrections.`
            : `已收到 ${claim.claimant} 的申請。請別只帶收據，也要帶物件陳述與來源訂正。`,
      ordering: resolved ? "normal" : "early",
      correction: resolved
        ? null
        : locale === "ja"
          ? "聴聞時刻は物件が出席を拒んだ場合に再送されます。"
          : locale === "en"
            ? "Hearing time will be re-sent if the object refuses attendance."
            : "若物件拒絕出席，聽證時間會重新寄送。",
      route: `property-claim-${claim.id}`,
      createdAt: resolved ? claim.resolvedAt : claim.submittedAt,
    };
  });
}

function calendarMessages(locale, now) {
  const bookmarks = readJson(CALENDAR_KEY, []);
  const saved = (Array.isArray(bookmarks) ? bookmarks : [])
    .map((record) => ({ record, entry: academicCalendarEvent(record.eventId) }))
    .filter(({ entry }) => entry)
    .slice(-5)
    .map(({ record, entry }) => ({
      id: `calendar-${record.eventId}`,
      glyph: entry.glyph,
      source: locale === "ja" ? "幻想郷学年暦掛" : locale === "en" ? "Gensokyo Academic Calendar Desk" : "幻想鄉學年曆掛",
      sourceKind: "system",
      trust: "sealed",
      version: 1,
      subject: locale === "ja"
        ? `栞を挟みました：${postLocalized(entry.title, locale)}`
        : locale === "en"
          ? `Calendar leaf saved: ${postLocalized(entry.title, locale)}`
          : `已夾入曆葉：${postLocalized(entry.title, locale)}`,
      body: `${postLocalized(entry.window, locale)} · ${postLocalized(entry.premise, locale)}`,
      ordering: "normal",
      correction: null,
      route: `calendar-event-${entry.id}`,
      createdAt: record.savedAt,
    }));
  const active = academicCalendarSnapshot(now).activeEvents.slice(0, 2).map((entry) => ({
    id: `calendar-live-${entry.id}`,
    glyph: entry.glyph,
    source: locale === "ja" ? "本日の学年暦投影" : locale === "en" ? "Today's calendar projection" : "今日學年曆投影",
    sourceKind: "system",
    trust: "witnessed",
    version: 1,
    subject: postLocalized(entry.title, locale),
    body: postLocalized(entry.impacts.transport, locale),
    ordering: "live",
    correction: null,
    route: `calendar-event-${entry.id}`,
    createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6).toISOString(),
  }));
  return [...active, ...saved];
}

function normalizeDispatch(value) {
  if (!value || typeof value !== "object" || !value.id) return null;
  const channel = postDeliveryChannels.find((entry) => entry.id === value.channelId) || postDeliveryChannels[0];
  return {
    schema: 1,
    id: text(value.id, 100),
    recipient: text(value.recipient, 100),
    subject: text(value.subject, 200),
    body: text(value.body, 1800),
    channelId: channel.id,
    visibility: ["private", "campus", "public"].includes(value.visibility) ? value.visibility : "private",
    sentAt: validDate(value.sentAt),
    version: Math.max(1, Number(value.version) || 1),
  };
}

export function postDispatches() {
  const values = readJson(DISPATCH_KEY, []);
  return (Array.isArray(values) ? values : []).map(normalizeDispatch).filter(Boolean);
}

export function postMessages(locale = "zh-Hant", now = new Date()) {
  const state = postState();
  const seeds = postSeedMessages.map((entry, index) => ({
    ...entry,
    source: postLocalized(entry.source, locale),
    subject: postLocalized(entry.subject, locale),
    body: postLocalized(entry.body, locale),
    correction: entry.correction ? postLocalized(entry.correction, locale) : null,
    createdAt: seededDate(entry, index, now),
  }));
  const dispatches = postDispatches().map((record) => ({
    id: `dispatch-${record.id}`,
    glyph: "送",
    source: locale === "ja" ? `自分から ${record.recipient}` : locale === "en" ? `You → ${record.recipient}` : `你 → ${record.recipient}`,
    sourceKind: "tengu",
    trust: "witnessed",
    version: record.version,
    subject: record.subject,
    body: record.body,
    ordering: "sent",
    correction: null,
    route: `post-dispatch-${record.id}`,
    createdAt: record.sentAt,
  }));
  return [...propertyMessages(locale), ...calendarMessages(locale, now), ...dispatches, ...seeds]
    .map((message) => ({
      ...message,
      state: state.messages[message.id] || {
        read: false,
        pinned: false,
        acknowledgedAt: null,
        correctionRequestedAt: null,
        readAloudAt: null,
      },
    }))
    .sort((a, b) => {
      if (a.state.pinned !== b.state.pinned) return a.state.pinned ? -1 : 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
}

export function postMessage(id, locale = "zh-Hant", now = new Date()) {
  return postMessages(locale, now).find((message) => message.id === id) || null;
}

export function togglePostRead(messageId) {
  const current = postState().messages[messageId];
  return updateMessageState(messageId, { read: !current?.read }, "message-read");
}

export function togglePostPin(messageId) {
  const current = postState().messages[messageId];
  return updateMessageState(messageId, { pinned: !current?.pinned }, "message-pinned");
}

export function acknowledgePost(messageId, now = new Date()) {
  return updateMessageState(messageId, { read: true, acknowledgedAt: now.toISOString() }, "message-acknowledged");
}

export function requestPostCorrection(messageId, now = new Date()) {
  return updateMessageState(messageId, { correctionRequestedAt: now.toISOString() }, "correction-requested");
}

export function readPostAloud(messageId, now = new Date()) {
  return updateMessageState(messageId, { read: true, readAloudAt: now.toISOString() }, "message-read-aloud");
}

export function sendPostNotice(input, now = new Date()) {
  const recipient = text(input?.recipient, 100);
  const subject = text(input?.subject, 200);
  const body = text(input?.body, 1800);
  if (recipient.length < 2) return { error: "recipient" };
  if (subject.length < 3) return { error: "subject" };
  if (body.length < 12) return { error: "body" };
  const dispatches = postDispatches();
  const record = normalizeDispatch({
    schema: 1,
    id: `TU-POST-${now.getTime().toString(36).toUpperCase()}`,
    recipient,
    subject,
    body,
    channelId: input.channelId,
    visibility: input.visibility,
    sentAt: now.toISOString(),
    version: 1,
  });
  writeJson(DISPATCH_KEY, [...dispatches, record].slice(-MAX_DISPATCHES));
  emit("notice-sent", { dispatchId: record.id });
  return { dispatch: record };
}

export function postCommunityPosts(locale = "zh-Hant") {
  return postDispatches()
    .filter((record) => record.visibility === "public")
    .slice(-4)
    .reverse()
    .map((record, index) => ({
      id: `post-dispatch-${record.id}`,
      category: "campus",
      author: locale === "ja" ? `鴉天狗郵便／${record.recipient} 宛` : locale === "en" ? `Tengu Post / to ${record.recipient}` : `鴉天狗郵便／寄往 ${record.recipient}`,
      title: record.subject,
      body: record.body,
      createdAt: record.sentAt,
      seedOrder: index,
    }));
}
