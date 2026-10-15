import { text as catalogText } from "../generated/i18n/data/orientation.js";

export const orientationSeason = Object.freeze({
  id: "first-bell-2026",
  code: "FIRST BELL 2026",
  window: catalogText("orientationSeason.0.window"),
  title: catalogText("orientationSeason.0.title"),
  premise: catalogText("orientationSeason.0.premise"),
});

export const orientationSchoolDestinations = Object.freeze({
  boundary: "boundary",
  history: "history",
  magic: "magic",
  medicine: "clinic",
  engineering: "kappa",
  journalism: "history",
  coexistence: "boundary",
});

export const orientationStopSignals = Object.freeze([
  {
    id: "wood-bell",
    glyph: "鐘",
    name: catalogText("orientationStopSignals.0.wood-bell.name"),
    detail: catalogText("orientationStopSignals.0.wood-bell.detail"),
  },
  {
    id: "red-white-lamps",
    glyph: "灯",
    name: catalogText("orientationStopSignals.0.red-white-lamps.name"),
    detail: catalogText("orientationStopSignals.0.red-white-lamps.detail"),
  },
  {
    id: "paired-cord",
    glyph: "結",
    name: catalogText("orientationStopSignals.0.paired-cord.name"),
    detail: catalogText("orientationStopSignals.0.paired-cord.detail"),
  },
]);

export const orientationNoticePlans = Object.freeze([
  {
    id: "archive-board",
    glyph: "板",
    name: catalogText("orientationNoticePlans.0.archive-board.name"),
    detail: catalogText("orientationNoticePlans.0.archive-board.detail"),
  },
  {
    id: "tengu-correction",
    glyph: "訂",
    name: catalogText("orientationNoticePlans.0.tengu-correction.name"),
    detail: catalogText("orientationNoticePlans.0.tengu-correction.detail"),
  },
  {
    id: "named-buddy",
    glyph: "伴",
    name: catalogText("orientationNoticePlans.0.named-buddy.name"),
    detail: catalogText("orientationNoticePlans.0.named-buddy.detail"),
  },
]);

export const orientationFirstStops = Object.freeze([
  {
    id: "first-course",
    glyph: "課",
    route: "course-registration",
    name: catalogText("orientationFirstStops.0.first-course.name"),
    detail: catalogText("orientationFirstStops.0.first-course.detail"),
  },
  {
    id: "first-room",
    glyph: "寮",
    route: "housing-application",
    name: catalogText("orientationFirstStops.0.first-room.name"),
    detail: catalogText("orientationFirstStops.0.first-room.detail"),
  },
  {
    id: "first-club",
    glyph: "朋",
    route: "campus",
    name: catalogText("orientationFirstStops.0.first-club.name"),
    detail: catalogText("orientationFirstStops.0.first-club.detail"),
  },
  {
    id: "first-gate",
    glyph: "祭",
    route: "festival-operations",
    name: catalogText("orientationFirstStops.0.first-gate.name"),
    detail: catalogText("orientationFirstStops.0.first-gate.detail"),
  },
]);

export function orientationLocalized(value, locale = "zh-Hant") {
  return value?.[locale] ?? value?.["zh-Hant"] ?? "";
}

export function orientationStopSignal(id) {
  return orientationStopSignals.find((entry) => entry.id === id) || null;
}

export function orientationNoticePlan(id) {
  return orientationNoticePlans.find((entry) => entry.id === id) || null;
}

export function orientationFirstStop(id) {
  return orientationFirstStops.find((entry) => entry.id === id) || null;
}
