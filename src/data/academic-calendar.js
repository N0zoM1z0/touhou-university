import { text as catalogText } from "../generated/i18n/data/academic-calendar.js";
import { campusDayKey, campusLunarPhase, campusTimeBand } from "./campus-time.js";

const edgeKey = (a, b) => [a, b].sort().join("--");

export const academicSeasons = {
  spring: {
    glyph: "花",
    name: catalogText("academicSeasons.spring.name"),
    months: [2, 3, 4],
    note: catalogText("academicSeasons.spring.note"),
  },
  rain: {
    glyph: "雨",
    name: catalogText("academicSeasons.rain.name"),
    months: [5],
    note: catalogText("academicSeasons.rain.note"),
  },
  summer: {
    glyph: "夜",
    name: catalogText("academicSeasons.summer.name"),
    months: [6, 7],
    note: catalogText("academicSeasons.summer.note"),
  },
  autumn: {
    glyph: "楓",
    name: catalogText("academicSeasons.autumn.name"),
    months: [8, 9, 10],
    note: catalogText("academicSeasons.autumn.note"),
  },
  winter: {
    glyph: "雪",
    name: catalogText("academicSeasons.winter.name"),
    months: [11, 0, 1],
    note: catalogText("academicSeasons.winter.note"),
  },
};

const event = ({
  id,
  code,
  glyph,
  title,
  window,
  premise,
  details,
  impacts,
  tags,
  month,
  dayStart,
  dayEnd,
  lunar,
  timeBands,
  annual = true,
}) => ({
  id,
  code,
  glyph,
  title,
  window,
  premise,
  details,
  impacts,
  tags,
  month,
  dayStart,
  dayEnd,
  lunar,
  timeBands,
  annual,
});

export const academicCalendarEvents = [
  event({
    id: "winter-placement-return",
    code: "AC-01",
    glyph: "旅",
    title: catalogText("academicCalendarEvents.0.0.title"),
    window: catalogText("academicCalendarEvents.0.0.window"),
    premise: catalogText("academicCalendarEvents.0.0.premise"),
    details: catalogText("academicCalendarEvents.0.0.details"),
    impacts: {
      course: catalogText("academicCalendarEvents.0.0.impacts.course"),
      transport: catalogText("academicCalendarEvents.0.0.impacts.transport"),
      library: catalogText("academicCalendarEvents.0.0.impacts.library"),
      medicine: catalogText("academicCalendarEvents.0.0.impacts.medicine"),
    },
    tags: ["fieldwork", "library", "clinic"],
    month: 0,
    dayStart: 6,
    dayEnd: 18,
  }),
  event({
    id: "hibernation-registration",
    code: "AC-02",
    glyph: "眠",
    title: catalogText("academicCalendarEvents.1.0.title"),
    window: catalogText("academicCalendarEvents.1.0.window"),
    premise: catalogText("academicCalendarEvents.1.0.premise"),
    details: catalogText("academicCalendarEvents.1.0.details"),
    impacts: {
      course: catalogText("academicCalendarEvents.1.0.impacts.course"),
      transport: catalogText("academicCalendarEvents.1.0.impacts.transport"),
      library: catalogText("academicCalendarEvents.1.0.impacts.library"),
      medicine: catalogText("academicCalendarEvents.1.0.impacts.medicine"),
    },
    tags: ["courses", "housing", "library"],
    month: 1,
    dayStart: 1,
    dayEnd: 12,
  }),
  event({
    id: "spring-snow-dispute",
    code: "AC-03",
    glyph: "雪",
    title: catalogText("academicCalendarEvents.2.0.title"),
    window: catalogText("academicCalendarEvents.2.0.window"),
    premise: catalogText("academicCalendarEvents.2.0.premise"),
    details: catalogText("academicCalendarEvents.2.0.details"),
    impacts: {
      course: catalogText("academicCalendarEvents.2.0.impacts.course"),
      transport: catalogText("academicCalendarEvents.2.0.impacts.transport"),
      library: catalogText("academicCalendarEvents.2.0.impacts.library"),
      medicine: catalogText("academicCalendarEvents.2.0.impacts.medicine"),
    },
    tags: ["term", "transport", "clinic"],
    month: [2, 3],
    dayStart: 18,
    dayEnd: 7,
  }),
  event({
    id: "boundary-matriculation",
    code: "AC-04",
    glyph: "門",
    title: catalogText("academicCalendarEvents.3.0.title"),
    window: catalogText("academicCalendarEvents.3.0.window"),
    premise: catalogText("academicCalendarEvents.3.0.premise"),
    details: catalogText("academicCalendarEvents.3.0.details"),
    impacts: {
      course: catalogText("academicCalendarEvents.3.0.impacts.course"),
      transport: catalogText("academicCalendarEvents.3.0.impacts.transport"),
      library: catalogText("academicCalendarEvents.3.0.impacts.library"),
      medicine: catalogText("academicCalendarEvents.3.0.impacts.medicine"),
    },
    tags: ["admissions", "festival", "transport"],
    month: 3,
    dayStart: 8,
    dayEnd: 14,
  }),
  event({
    id: "spring-lanterns",
    code: "AC-05",
    glyph: "燈",
    title: catalogText("academicCalendarEvents.4.0.title"),
    window: catalogText("academicCalendarEvents.4.0.window"),
    premise: catalogText("academicCalendarEvents.4.0.premise"),
    details: catalogText("academicCalendarEvents.4.0.details"),
    impacts: {
      course: catalogText("academicCalendarEvents.4.0.impacts.course"),
      transport: catalogText("academicCalendarEvents.4.0.impacts.transport"),
      library: catalogText("academicCalendarEvents.4.0.impacts.library"),
      medicine: catalogText("academicCalendarEvents.4.0.impacts.medicine"),
    },
    tags: ["festival", "spellcard", "clinic"],
    month: 4,
    dayStart: 1,
    dayEnd: 31,
    lunar: [4],
  }),
  event({
    id: "rainy-paper-revision",
    code: "AC-06",
    glyph: "雨",
    title: catalogText("academicCalendarEvents.5.0.title"),
    window: catalogText("academicCalendarEvents.5.0.window"),
    premise: catalogText("academicCalendarEvents.5.0.premise"),
    details: catalogText("academicCalendarEvents.5.0.details"),
    impacts: {
      course: catalogText("academicCalendarEvents.5.0.impacts.course"),
      transport: catalogText("academicCalendarEvents.5.0.impacts.transport"),
      library: catalogText("academicCalendarEvents.5.0.impacts.library"),
      medicine: catalogText("academicCalendarEvents.5.0.impacts.medicine"),
    },
    tags: ["post", "library", "journalism"],
    month: 5,
    dayStart: 1,
    dayEnd: 30,
  }),
  event({
    id: "night-sparrow-term",
    code: "AC-07",
    glyph: "膳",
    title: catalogText("academicCalendarEvents.6.0.title"),
    window: catalogText("academicCalendarEvents.6.0.window"),
    premise: catalogText("academicCalendarEvents.6.0.premise"),
    details: catalogText("academicCalendarEvents.6.0.details"),
    impacts: {
      course: catalogText("academicCalendarEvents.6.0.impacts.course"),
      transport: catalogText("academicCalendarEvents.6.0.impacts.transport"),
      library: catalogText("academicCalendarEvents.6.0.impacts.library"),
      medicine: catalogText("academicCalendarEvents.6.0.impacts.medicine"),
    },
    tags: ["courses", "dining", "housing"],
    month: [6, 7],
    dayStart: 10,
    dayEnd: 31,
    timeBands: ["evening", "night"],
  }),
  event({
    id: "seasonal-energy-surge",
    code: "AC-08",
    glyph: "季",
    title: catalogText("academicCalendarEvents.7.0.title"),
    window: catalogText("academicCalendarEvents.7.0.window"),
    premise: catalogText("academicCalendarEvents.7.0.premise"),
    details: catalogText("academicCalendarEvents.7.0.details"),
    impacts: {
      course: catalogText("academicCalendarEvents.7.0.impacts.course"),
      transport: catalogText("academicCalendarEvents.7.0.impacts.transport"),
      library: catalogText("academicCalendarEvents.7.0.impacts.library"),
      medicine: catalogText("academicCalendarEvents.7.0.impacts.medicine"),
    },
    tags: ["research", "clinic", "transport"],
    month: 7,
    dayStart: 15,
    dayEnd: 23,
  }),
  event({
    id: "higan-field-week",
    code: "AC-09",
    glyph: "彼",
    title: catalogText("academicCalendarEvents.8.0.title"),
    window: catalogText("academicCalendarEvents.8.0.window"),
    premise: catalogText("academicCalendarEvents.8.0.premise"),
    details: catalogText("academicCalendarEvents.8.0.details"),
    impacts: {
      course: catalogText("academicCalendarEvents.8.0.impacts.course"),
      transport: catalogText("academicCalendarEvents.8.0.impacts.transport"),
      library: catalogText("academicCalendarEvents.8.0.impacts.library"),
      medicine: catalogText("academicCalendarEvents.8.0.impacts.medicine"),
    },
    tags: ["fieldwork", "property", "history"],
    month: 8,
    dayStart: 20,
    dayEnd: 26,
  }),
  event({
    id: "harvest-shrine-contest",
    code: "AC-10",
    glyph: "穫",
    title: catalogText("academicCalendarEvents.9.0.title"),
    window: catalogText("academicCalendarEvents.9.0.window"),
    premise: catalogText("academicCalendarEvents.9.0.premise"),
    details: catalogText("academicCalendarEvents.9.0.details"),
    impacts: {
      course: catalogText("academicCalendarEvents.9.0.impacts.course"),
      transport: catalogText("academicCalendarEvents.9.0.impacts.transport"),
      library: catalogText("academicCalendarEvents.9.0.impacts.library"),
      medicine: catalogText("academicCalendarEvents.9.0.impacts.medicine"),
    },
    tags: ["faith", "festival", "governance"],
    month: 9,
    dayStart: 7,
    dayEnd: 20,
  }),
  event({
    id: "maple-archive-month",
    code: "AC-11",
    glyph: "楓",
    title: catalogText("academicCalendarEvents.10.0.title"),
    window: catalogText("academicCalendarEvents.10.0.window"),
    premise: catalogText("academicCalendarEvents.10.0.premise"),
    details: catalogText("academicCalendarEvents.10.0.details"),
    impacts: {
      course: catalogText("academicCalendarEvents.10.0.impacts.course"),
      transport: catalogText("academicCalendarEvents.10.0.impacts.transport"),
      library: catalogText("academicCalendarEvents.10.0.impacts.library"),
      medicine: catalogText("academicCalendarEvents.10.0.impacts.medicine"),
    },
    tags: ["history", "hieda", "library"],
    month: 10,
    dayStart: 1,
    dayEnd: 30,
  }),
  event({
    id: "winter-seal-week",
    code: "AC-12",
    glyph: "封",
    title: catalogText("academicCalendarEvents.11.0.title"),
    window: catalogText("academicCalendarEvents.11.0.window"),
    premise: catalogText("academicCalendarEvents.11.0.premise"),
    details: catalogText("academicCalendarEvents.11.0.details"),
    impacts: {
      course: catalogText("academicCalendarEvents.11.0.impacts.course"),
      transport: catalogText("academicCalendarEvents.11.0.impacts.transport"),
      library: catalogText("academicCalendarEvents.11.0.impacts.library"),
      medicine: catalogText("academicCalendarEvents.11.0.impacts.medicine"),
    },
    tags: ["library", "clinic", "housing"],
    month: 11,
    dayStart: 18,
    dayEnd: 31,
  }),
  event({
    id: "full-moon-special",
    code: "AC-L4",
    glyph: "月",
    title: catalogText("academicCalendarEvents.12.0.title"),
    window: catalogText("academicCalendarEvents.12.0.window"),
    premise: catalogText("academicCalendarEvents.12.0.premise"),
    details: catalogText("academicCalendarEvents.12.0.details"),
    impacts: {
      course: catalogText("academicCalendarEvents.12.0.impacts.course"),
      transport: catalogText("academicCalendarEvents.12.0.impacts.transport"),
      library: catalogText("academicCalendarEvents.12.0.impacts.library"),
      medicine: catalogText("academicCalendarEvents.12.0.impacts.medicine"),
    },
    tags: ["moon", "clinic", "courses"],
    lunar: [4],
    timeBands: ["evening", "night"],
    annual: false,
  }),
  event({
    id: "new-moon-boundary-audit",
    code: "AC-L0",
    glyph: "界",
    title: catalogText("academicCalendarEvents.13.0.title"),
    window: catalogText("academicCalendarEvents.13.0.window"),
    premise: catalogText("academicCalendarEvents.13.0.premise"),
    details: catalogText("academicCalendarEvents.13.0.details"),
    impacts: {
      course: catalogText("academicCalendarEvents.13.0.impacts.course"),
      transport: catalogText("academicCalendarEvents.13.0.impacts.transport"),
      library: catalogText("academicCalendarEvents.13.0.impacts.library"),
      medicine: catalogText("academicCalendarEvents.13.0.impacts.medicine"),
    },
    tags: ["boundary", "transport", "research"],
    lunar: [0],
    timeBands: ["night"],
    annual: false,
  }),
];

function eventMatchesDate(entry, date) {
  const month = date.getMonth();
  const day = date.getDate();
  const phase = campusLunarPhase(date);
  const band = campusTimeBand(date);
  if (entry.lunar && !entry.lunar.includes(phase)) return false;
  if (entry.timeBands && !entry.timeBands.includes(band)) return false;
  if (entry.month === undefined) return true;
  const months = Array.isArray(entry.month) ? entry.month : [entry.month];
  if (!months.includes(month)) return false;
  if (months.length === 1) return day >= (entry.dayStart || 1) && day <= (entry.dayEnd || 31);
  if (month === months[0]) return day >= (entry.dayStart || 1);
  if (month === months.at(-1)) return day <= (entry.dayEnd || 31);
  return true;
}

function currentSeason(month) {
  return Object.entries(academicSeasons).find(([, season]) => season.months.includes(month))?.[0] || "spring";
}

function eventRouteRules(entries) {
  const rules = {
    closedModes: [],
    closedEdges: [],
    closedTransitNodes: [],
    modeDelay: {},
    edgeDelay: {},
  };
  entries.forEach((entry) => {
    if (entry.id === "spring-snow-dispute") {
      rules.edgeDelay[edgeKey("history", "clinic")] = 3;
      rules.edgeDelay[edgeKey("boundary", "clinic")] = 5;
    }
    if (entry.id === "boundary-matriculation") rules.edgeDelay[edgeKey("gate", "boundary")] = 5;
    if (entry.id === "spring-lanterns") rules.closedTransitNodes.push("boundary");
    if (entry.id === "rainy-paper-revision") rules.modeDelay.tengu = 4;
    if (entry.id === "night-sparrow-term") rules.modeDelay.broom = 3;
    if (entry.id === "seasonal-energy-surge") rules.modeDelay.foot = 5;
    if (entry.id === "higan-field-week") rules.modeDelay.ferry = 12;
    if (entry.id === "harvest-shrine-contest") rules.edgeDelay[edgeKey("gate", "boundary")] = 4;
    if (entry.id === "maple-archive-month") rules.modeDelay.foot = (rules.modeDelay.foot || 0) + 4;
    if (entry.id === "winter-seal-week") rules.modeDelay.broom = (rules.modeDelay.broom || 0) + 5;
    if (entry.id === "full-moon-special") {
      [
        edgeKey("boundary", "clinic"),
        edgeKey("history", "clinic"),
        edgeKey("magic", "clinic"),
        edgeKey("clinic", "kappa"),
      ].forEach((key) => {
        rules.edgeDelay[key] = (rules.edgeDelay[key] || 0) + 7;
      });
    }
    if (entry.id === "new-moon-boundary-audit") {
      rules.closedModes.push("broom");
      rules.modeDelay.foot = (rules.modeDelay.foot || 0) + 2;
    }
  });
  rules.closedModes = [...new Set(rules.closedModes)];
  rules.closedTransitNodes = [...new Set(rules.closedTransitNodes)];
  return rules;
}

export function academicCalendarSnapshot(date = new Date()) {
  const seasonId = currentSeason(date.getMonth());
  const entries = academicCalendarEvents.filter((entry) => eventMatchesDate(entry, date));
  return {
    dayKey: campusDayKey(date),
    seasonId,
    season: academicSeasons[seasonId],
    phase: campusLunarPhase(date),
    band: campusTimeBand(date),
    activeEvents: entries,
    routeRules: eventRouteRules(entries),
  };
}

export function academicCalendarEvent(id) {
  return academicCalendarEvents.find((entry) => entry.id === id) || null;
}

export function academicCalendarLocalized(value, locale = "zh-Hant") {
  return value?.[locale] || value?.["zh-Hant"] || value || "";
}
