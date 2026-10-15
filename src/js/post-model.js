import { text as catalogText } from "../generated/i18n/ui/post-model.js";
import {
  postDeliveryChannels,
  postLocalized,
  postSeedMessages,
} from "../data/post.js";
import { academicCalendarEvent, academicCalendarSnapshot } from "../data/academic-calendar.js";
import { propertyClaimSummary, propertyClaims } from "./property-model.js";
import { employmentPostMessages } from "./employment-model.js";

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
      source: catalogText("propertyMessages.0.source")[locale],
      sourceKind: "system",
      trust: "sealed",
      version: 1,
      subject: resolved
        ? catalogText("propertyMessages.0.subject", { [locale]: locale === "ja" ? {value0: summary.item.code, value1: summary.disposition} : locale === "en" ? {value0: summary.item.code, value1: summary.disposition} : {value0: summary.item.code, value1: summary.disposition} })[locale]
        : catalogText("propertyMessages.0.subject.2", { [locale]: locale === "ja" ? {value0: summary.item.code} : locale === "en" ? {value0: summary.item.code} : {value0: summary.item.code} })[locale],
      body: resolved
        ? catalogText("propertyMessages.0.body", { [locale]: locale === "ja" ? {value0: claim.claimant, value1: summary.disposition} : locale === "en" ? {value0: claim.claimant, value1: summary.disposition} : {value0: claim.claimant, value1: summary.disposition} })[locale]
        : catalogText("propertyMessages.0.body.2", { [locale]: locale === "ja" ? {value0: claim.claimant} : locale === "en" ? {value0: claim.claimant} : {value0: claim.claimant} })[locale],
      ordering: resolved ? "normal" : "early",
      correction: resolved
        ? null
        : catalogText("propertyMessages.0.correction")[locale],
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
      source: catalogText("saved.0.source")[locale],
      sourceKind: "system",
      trust: "sealed",
      version: 1,
      subject: catalogText("saved.0.subject", { [locale]: locale === "ja" ? {value0: postLocalized(entry.title, locale)} : locale === "en" ? {value0: postLocalized(entry.title, locale)} : {value0: postLocalized(entry.title, locale)} })[locale],
      body: `${postLocalized(entry.window, locale)} · ${postLocalized(entry.premise, locale)}`,
      ordering: "normal",
      correction: null,
      route: `calendar-event-${entry.id}`,
      createdAt: record.savedAt,
    }));
  const active = academicCalendarSnapshot(now).activeEvents.slice(0, 2).map((entry) => ({
    id: `calendar-live-${entry.id}`,
    glyph: entry.glyph,
    source: catalogText("active.0.source")[locale],
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
    source: catalogText("dispatches.0.source", { [locale]: locale === "ja" ? {value0: record.recipient} : locale === "en" ? {value0: record.recipient} : {value0: record.recipient} })[locale],
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
  return [...employmentPostMessages(locale), ...propertyMessages(locale), ...calendarMessages(locale, now), ...dispatches, ...seeds]
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
      author: catalogText("postCommunityPosts.0.author", { [locale]: locale === "ja" ? {value0: record.recipient} : locale === "en" ? {value0: record.recipient} : {value0: record.recipient} })[locale],
      title: record.subject,
      body: record.body,
      createdAt: record.sentAt,
      seedOrder: index,
    }));
}
