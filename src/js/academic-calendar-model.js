import { text as catalogText } from "../generated/i18n/ui/academic-calendar-model.js";
import {
  academicCalendarEvent,
  academicCalendarEvents,
  academicCalendarLocalized,
} from "../data/academic-calendar.js";

const BOOKMARK_KEY = "tu:calendar:bookmarks";
const MAX_BOOKMARKS = 60;

export const academicCalendarStorageKeys = Object.freeze({ bookmarks: BOOKMARK_KEY });

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

function emit(reason, detail = {}) {
  window.dispatchEvent(new CustomEvent("tu:calendarchange", {
    detail: { reason, ...detail },
  }));
}

function normalizeBookmark(value) {
  if (!value || typeof value !== "object" || !academicCalendarEvent(value.eventId)) return null;
  return {
    schema: 1,
    eventId: value.eventId,
    savedAt: validDate(value.savedAt),
  };
}

export function academicCalendarBookmarks() {
  const records = readJson(BOOKMARK_KEY, []);
  return (Array.isArray(records) ? records : []).map(normalizeBookmark).filter(Boolean);
}

export function isAcademicCalendarBookmarked(eventId) {
  return academicCalendarBookmarks().some((entry) => entry.eventId === eventId);
}

export function toggleAcademicCalendarBookmark(eventId, now = new Date()) {
  if (!academicCalendarEvent(eventId)) return { error: "event" };
  const records = academicCalendarBookmarks();
  const existing = records.find((entry) => entry.eventId === eventId);
  const next = existing
    ? records.filter((entry) => entry.eventId !== eventId)
    : [...records, { schema: 1, eventId, savedAt: now.toISOString() }].slice(-MAX_BOOKMARKS);
  writeJson(BOOKMARK_KEY, next);
  emit(existing ? "bookmark-removed" : "bookmark-saved", { eventId });
  return { bookmarked: !existing, record: existing || next.at(-1) };
}

function eventDate(entry, year) {
  if (Array.isArray(entry.month)) {
    return new Date(year, entry.month[0], entry.dayStart || 1, 9);
  }
  if (Number.isInteger(entry.month)) return new Date(year, entry.month, entry.dayStart || 1, 9);
  if (entry.lunar?.includes(4)) {
    // The exact lunar projection remains dynamic on-site; the portable file
    // receives a yearly placeholder and keeps the lunar rule in its body.
    return new Date(year, 4, 15, 18);
  }
  return new Date(year, 0, 1, 18);
}

function icsStamp(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcs(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function academicCalendarIcs(locale = "zh-Hant", year = new Date().getFullYear()) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Touhou University//Gensokyo Academic Calendar//EN",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${escapeIcs(catalogText("lines.4.0")[locale])}`,
  ];
  academicCalendarEvents.forEach((entry) => {
    const start = eventDate(entry, year);
    const end = new Date(start.getTime() + 3 * 60 * 60_000);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${entry.id}.${year}@touhou-university`,
      `DTSTAMP:${icsStamp(new Date(year, 0, 1))}`,
      `DTSTART:${icsStamp(start)}`,
      `DTEND:${icsStamp(end)}`,
      `SUMMARY:${escapeIcs(academicCalendarLocalized(entry.title, locale))}`,
      `DESCRIPTION:${escapeIcs(`${academicCalendarLocalized(entry.window, locale)}\\n${academicCalendarLocalized(entry.premise, locale)}`)}`,
      `URL:https://n0zom1z0.github.io/touhou-university/calendar.html#calendar-event-${entry.id}`,
      "END:VEVENT",
    );
  });
  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}

export function academicCalendarCommunityPosts(locale = "zh-Hant") {
  return academicCalendarBookmarks()
    .slice(-3)
    .reverse()
    .map((bookmark, index) => {
      const entry = academicCalendarEvent(bookmark.eventId);
      return {
        id: `calendar-${bookmark.eventId}`,
        category: "campus",
        author: catalogText("academicCalendarCommunityPosts.0.author")[locale],
        title: academicCalendarLocalized(entry.title, locale),
        body: catalogText("academicCalendarCommunityPosts.0.body", { [locale]: locale === "ja" ? {value0: academicCalendarLocalized(entry.window, locale)} : locale === "en" ? {value0: academicCalendarLocalized(entry.window, locale)} : {value0: academicCalendarLocalized(entry.window, locale)} })[locale],
        createdAt: bookmark.savedAt,
        seedOrder: index,
      };
    });
}
