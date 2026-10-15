import { text as catalogText } from "../generated/i18n/data/live-campus.js";
import {
  campusDayKey as liveCampusDayKey,
  campusLunarPhase as liveCampusLunarPhase,
  campusTimeBand as liveCampusTimeBand,
} from "./campus-time.js";
import { academicCalendarSnapshot } from "./academic-calendar.js";

export { liveCampusDayKey, liveCampusLunarPhase, liveCampusTimeBand };


function hashValue(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function dayOrdinal(date) {
  return Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 86_400_000);
}

function edgeKey(a, b) {
  return [a, b].sort().join("--");
}

export const liveCampusEvents = {
  crosswind: {
    glyph: "風",
    severity: "amber",
    title: catalogText("liveCampusEvents.crosswind.title"),
    body: catalogText("liveCampusEvents.crosswind.body"),
    rule: catalogText("liveCampusEvents.crosswind.rule"),
    closedModes: ["broom"],
    modeDelay: { tengu: 2 },
  },
  kappaTape: {
    glyph: "補",
    severity: "amber",
    title: catalogText("liveCampusEvents.kappaTape.title"),
    body: catalogText("liveCampusEvents.kappaTape.body"),
    rule: catalogText("liveCampusEvents.kappaTape.rule"),
    closedEdges: [edgeKey("magic", "kappa")],
  },
  bambooMist: {
    glyph: "霧",
    severity: "blue",
    title: catalogText("liveCampusEvents.bambooMist.title"),
    body: catalogText("liveCampusEvents.bambooMist.body"),
    rule: catalogText("liveCampusEvents.bambooMist.rule"),
    edgeDelay: {
      [edgeKey("boundary", "clinic")]: 7,
      [edgeKey("history", "clinic")]: 7,
      [edgeKey("magic", "clinic")]: 7,
      [edgeKey("clinic", "kappa")]: 7,
    },
  },
  danmakuPractical: {
    glyph: "弾",
    severity: "red",
    title: catalogText("liveCampusEvents.danmakuPractical.title"),
    body: catalogText("liveCampusEvents.danmakuPractical.body"),
    rule: catalogText("liveCampusEvents.danmakuPractical.rule"),
    closedTransitNodes: ["boundary"],
  },
  bookFlock: {
    glyph: "書",
    severity: "blue",
    title: catalogText("liveCampusEvents.bookFlock.title"),
    body: catalogText("liveCampusEvents.bookFlock.body"),
    rule: catalogText("liveCampusEvents.bookFlock.rule"),
    roomSeatDelta: { library: -18 },
  },
  faithProcession: {
    glyph: "祭",
    severity: "green",
    title: catalogText("liveCampusEvents.faithProcession.title"),
    body: catalogText("liveCampusEvents.faithProcession.body"),
    rule: catalogText("liveCampusEvents.faithProcession.rule"),
    edgeDelay: { [edgeKey("gate", "boundary")]: 4 },
  },
  nightSparrow: {
    glyph: "膳",
    severity: "green",
    title: catalogText("liveCampusEvents.nightSparrow.title"),
    body: catalogText("liveCampusEvents.nightSparrow.body"),
    rule: catalogText("liveCampusEvents.nightSparrow.rule"),
    diningFlag: "early-supper",
  },
};

const eventIds = Object.keys(liveCampusEvents);

export function liveCampusSnapshot(date = new Date()) {
  const day = dayOrdinal(date);
  const band = liveCampusTimeBand(date);
  const phase = liveCampusLunarPhase(date);
  const slot = Math.floor(date.getHours() / 3);
  const seed = hashValue(`${liveCampusDayKey(date)}:${slot}`);
  const first = eventIds[seed % eventIds.length];
  let second = eventIds[(seed >>> 8) % eventIds.length];
  if (second === first) second = eventIds[(eventIds.indexOf(first) + 3) % eventIds.length];
  const ids = [first, second];
  if ((phase === 4 || phase === 0) && !ids.includes("bambooMist")) ids[1] = "bambooMist";
  if ((band === "evening" || band === "night") && !ids.includes("nightSparrow")) ids[1] = "nightSparrow";
  const calendar = academicCalendarSnapshot(date);
  const activeEvents = [...new Set(ids)].map((id) => ({ id, ...liveCampusEvents[id] }));
  const routeRules = {
    closedModes: [],
    closedEdges: [],
    closedTransitNodes: [],
    modeDelay: {},
    edgeDelay: {},
  };
  activeEvents.forEach((event) => {
    routeRules.closedModes.push(...(event.closedModes || []));
    routeRules.closedEdges.push(...(event.closedEdges || []));
    routeRules.closedTransitNodes.push(...(event.closedTransitNodes || []));
    Object.entries(event.modeDelay || {}).forEach(([id, value]) => {
      routeRules.modeDelay[id] = (routeRules.modeDelay[id] || 0) + value;
    });
    Object.entries(event.edgeDelay || {}).forEach(([id, value]) => {
      routeRules.edgeDelay[id] = (routeRules.edgeDelay[id] || 0) + value;
    });
  });
  routeRules.closedModes.push(...calendar.routeRules.closedModes);
  routeRules.closedEdges.push(...calendar.routeRules.closedEdges);
  routeRules.closedTransitNodes.push(...calendar.routeRules.closedTransitNodes);
  Object.entries(calendar.routeRules.modeDelay).forEach(([id, value]) => {
    routeRules.modeDelay[id] = (routeRules.modeDelay[id] || 0) + value;
  });
  Object.entries(calendar.routeRules.edgeDelay).forEach(([id, value]) => {
    routeRules.edgeDelay[id] = (routeRules.edgeDelay[id] || 0) + value;
  });
  routeRules.closedModes = [...new Set(routeRules.closedModes)];
  routeRules.closedEdges = [...new Set(routeRules.closedEdges)];
  routeRules.closedTransitNodes = [...new Set(routeRules.closedTransitNodes)];
  return {
    dayKey: liveCampusDayKey(date),
    day,
    slot,
    seed,
    band,
    phase,
    calendar,
    academicDay: ((day % 5) + 5) % 5,
    activeEvents,
    routeRules,
    weather: [
      catalogText("liveCampusSnapshot.weather.0"),
      catalogText("liveCampusSnapshot.weather.1"),
      catalogText("liveCampusSnapshot.weather.2"),
      catalogText("liveCampusSnapshot.weather.3"),
    ][seed % 4],
    online: 72 + (seed % 97),
    topics: 48 + ((seed >>> 5) % 83),
  };
}

const facilityProfiles = {
  library: { start: 7 * 60, end: 2 * 60, capacity: 60 },
  boundary: { start: 8 * 60, end: 21 * 60, capacity: 48 },
  history: { start: 8 * 60 + 30, end: 19 * 60, capacity: 30 },
  magic: { start: 8 * 60, end: 23 * 60, capacity: 24 },
  kappa: { start: 7 * 60 + 30, end: 18 * 60 + 30, capacity: 20 },
};

function minuteStamp(value) {
  return `${String(Math.floor(value / 60) % 24).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function isWithinHours(minute, start, end) {
  if (end < start) return minute >= start || minute < end;
  return minute >= start && minute < end;
}

export function liveFacilityStatus(placeId, locale = "zh-Hant", date = new Date()) {
  const profile = facilityProfiles[placeId];
  if (!profile) return null;
  const state = liveCampusSnapshot(date);
  const hasEvent = (id) => (
    state.activeEvents.some((event) => event.id === id)
    || state.calendar.activeEvents.some((event) => event.id === id)
  );
  let { start, end, capacity } = profile;
  let note = catalogText("note");

  if (placeId === "library" && hasEvent("bookFlock")) {
    end = 30;
    capacity -= 18;
    note = catalogText("liveFacilityStatus");
  } else if (placeId === "boundary" && hasEvent("danmakuPractical")) {
    start = 10 * 60;
    capacity -= 16;
    note = catalogText("liveFacilityStatus.2");
  } else if (placeId === "history" && state.phase === 4) {
    end = 17 * 60 + 30;
    capacity -= 8;
    note = catalogText("liveFacilityStatus.3");
  } else if (placeId === "magic" && hasEvent("crosswind")) {
    end = 21 * 60 + 30;
    capacity -= 6;
    note = catalogText("liveFacilityStatus.4");
  } else if (placeId === "kappa" && hasEvent("kappaTape")) {
    start = 8 * 60 + 30;
    end = 17 * 60;
    capacity -= 10;
    note = catalogText("liveFacilityStatus.5");
  }
  if (placeId === "library" && hasEvent("rainy-paper-revision")) {
    capacity -= 8;
    note = catalogText("liveFacilityStatus.6");
  }
  if (placeId === "library" && hasEvent("maple-archive-month")) {
    capacity -= 6;
    note = catalogText("liveFacilityStatus.7");
  }
  if (placeId === "library" && hasEvent("full-moon-special")) {
    capacity -= 10;
    note = catalogText("liveFacilityStatus.8");
  }
  if (placeId === "magic" && hasEvent("winter-seal-week")) {
    capacity -= 5;
    end = Math.min(end, 20 * 60);
    note = catalogText("liveFacilityStatus.9");
  }

  const minute = date.getHours() * 60 + date.getMinutes();
  const open = isWithinHours(minute, start, end);
  const occupancy = open ? hashValue(`${state.dayKey}:${state.slot}:${placeId}`) % Math.max(3, capacity - 2) : capacity;
  const availableSeats = open ? Math.max(0, capacity - occupancy) : 0;
  return {
    id: placeId,
    open,
    hours: `${minuteStamp(start)}—${minuteStamp(end)}`,
    capacity,
    availableSeats,
    note: note[locale],
    snapshotKey: `${state.dayKey}:${state.slot}`,
  };
}

export function liveFacilityBoard(locale = "zh-Hant", date = new Date()) {
  return Object.keys(facilityProfiles).map((id) => liveFacilityStatus(id, locale, date));
}

const mapNoticePool = [
  catalogText("mapNoticePool.0"),
  catalogText("mapNoticePool.1"),
  catalogText("mapNoticePool.2"),
  catalogText("mapNoticePool.3"),
];

export function liveMapNotice(locale = "zh-Hant", date = new Date()) {
  const state = liveCampusSnapshot(date);
  const events = [
    ...state.activeEvents,
    ...state.calendar.activeEvents.map((event) => ({
      ...event,
      rule: event.impacts.transport,
    })),
  ];
  const event = events[(state.seed >>> 4) % events.length];
  const useEvent = (state.seed & 1) === 0;
  return {
    label: catalogText("liveMapNotice.label")[locale],
    text: useEvent ? `${event.title[locale]}：${event.rule[locale]}` : mapNoticePool[(state.seed >>> 7) % mapNoticePool.length][locale],
    snapshotKey: `${state.dayKey}:${state.slot}`,
  };
}

const menuPool = [
  ["hakurei", catalogText("menuPool.0.1"), catalogText("menuPool.0.2"), "540", catalogText("menuPool.0.4")],
  ["bamboo", catalogText("menuPool.1.1"), catalogText("menuPool.1.2"), "480", catalogText("menuPool.1.4")],
  ["kappa", catalogText("menuPool.2.1"), catalogText("menuPool.2.2"), "620", catalogText("menuPool.2.4")],
  ["sparrow", catalogText("menuPool.3.1"), catalogText("menuPool.3.2"), "700", catalogText("menuPool.3.4")],
  ["fairy", catalogText("menuPool.4.1"), catalogText("menuPool.4.2"), "260", catalogText("menuPool.4.4")],
  ["scarlet", catalogText("menuPool.5.1"), catalogText("menuPool.5.2"), "680", catalogText("menuPool.5.4")],
  ["moriya", catalogText("menuPool.6.1"), catalogText("menuPool.6.2"), "390", catalogText("menuPool.6.4")],
  ["myouren", catalogText("menuPool.7.1"), catalogText("menuPool.7.2"), "560", catalogText("menuPool.7.4")],
  ["moon", catalogText("menuPool.8.1"), catalogText("menuPool.8.2"), "430", catalogText("menuPool.8.4")],
  ["forest", catalogText("menuPool.9.1"), catalogText("menuPool.9.2"), "590", catalogText("menuPool.9.4")],
  ["cirno", catalogText("menuPool.10.1"), catalogText("menuPool.10.2"), "320", catalogText("menuPool.10.4")],
  ["history", catalogText("menuPool.11.1"), catalogText("menuPool.11.2"), "510", catalogText("menuPool.11.4")],
];

export function liveDiningMenu(locale, date = new Date()) {
  const state = liveCampusSnapshot(date);
  const mandatory = state.band === "evening"
    || state.band === "night"
    || state.calendar.activeEvents.some((event) => event.id === "night-sparrow-term")
    ? "sparrow"
    : "hakurei";
  const rotated = menuPool
    .filter(([id]) => id !== mandatory)
    .sort((a, b) => hashValue(`${state.dayKey}:${a[0]}`) - hashValue(`${state.dayKey}:${b[0]}`))
    .slice(0, 5);
  const selected = [menuPool.find(([id]) => id === mandatory), ...rotated];
  return selected.map(([, name, contents, price, note]) => [
    name[locale],
    contents[locale],
    locale === "en" ? `¥${price}` : `${price} ${locale === "zh-Hant" ? "円" : "円"}`,
    note[locale],
  ]);
}

const timetablePool = [
  ["08:30", catalogText("timetablePool.0.1"), "HH-302", catalogText("timetablePool.0.3")],
  ["09:10", catalogText("timetablePool.1.1"), "BH-108", catalogText("timetablePool.1.3")],
  ["10:20", catalogText("timetablePool.2.1"), "SD-07", catalogText("timetablePool.2.3")],
  ["11:40", catalogText("timetablePool.3.1"), "BH-204", catalogText("timetablePool.3.3")],
  ["13:10", catalogText("timetablePool.4.1"), "KW-W2", catalogText("timetablePool.4.3")],
  ["14:20", catalogText("timetablePool.5.1"), "EI-C3", catalogText("timetablePool.5.3")],
  ["15:00", catalogText("timetablePool.6.1"), "BN-201", catalogText("timetablePool.6.3")],
  ["16:10", catalogText("timetablePool.7.1"), "SD-11", catalogText("timetablePool.7.3")],
  ["17:20", catalogText("timetablePool.8.1"), "BH-108", catalogText("timetablePool.8.3")],
  ["18:10", catalogText("timetablePool.9.1"), "BN-201", catalogText("timetablePool.9.3")],
];

export function liveTimetable(locale, date = new Date()) {
  const state = liveCampusSnapshot(date);
  const hasEvent = (id) => (
    state.activeEvents.some((event) => event.id === id)
    || state.calendar.activeEvents.some((event) => event.id === id)
  );
  const ordered = timetablePool
    .slice(state.academicDay * 2)
    .concat(timetablePool.slice(0, state.academicDay * 2))
    .slice(0, 6);
  return ordered
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([time, course, room, teacher]) => {
      let dynamicTime = time;
      let dynamicRoom = room;
      let note = catalogText("note.2")[locale];
      if (hasEvent("danmakuPractical") && room.startsWith("BH-")) {
        dynamicRoom = "HH-201";
        note = catalogText("liveTimetable.0")[locale];
      }
      if (hasEvent("kappaTape") && room.startsWith("KW-")) {
        dynamicRoom = "KW-YARD";
        note = catalogText("liveTimetable.0.2")[locale];
      }
      if (hasEvent("night-sparrow-term")) {
        const [hours, minutes] = time.split(":").map(Number);
        dynamicTime = `${String((hours + 4) % 24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        note = catalogText("liveTimetable.0.3")[locale];
      }
      if (hasEvent("winter-placement-return") && time < "10:30") {
        note = catalogText("liveTimetable.0.4")[locale];
      }
      return [dynamicTime, course[locale], dynamicRoom, teacher[locale], note];
    });
}

const roomBase = [
  ["ML-204", "library", 24, "reading"],
  ["BH-108", "boundary", 48, "classroom"],
  ["HH-302", "history", 18, "seminar"],
  ["SD-07", "magic", 12, "lab"],
  ["KW-W2", "kappa", 16, "workshop"],
  ["ML-NIGHT", "library", 36, "reading"],
];

export function liveRoomAvailability(date = new Date()) {
  const state = liveCampusSnapshot(date);
  const minute = date.getHours() * 60 + date.getMinutes();
  return roomBase.map(([code, building, seats, kind], index) => {
    const facility = liveFacilityStatus(building, "en", date);
    const freeMinutes = 35 + (hashValue(`${state.dayKey}:${state.slot}:${code}`) % 190);
    const until = Math.min(23 * 60 + 50, minute + freeMinutes);
    const delta = state.activeEvents.reduce((sum, event) => sum + (event.roomSeatDelta?.[building] || 0), 0);
    return {
      code,
      building,
      seats: Math.min(
        Math.max(0, seats + (building === "library" ? delta : 0)),
        facility?.availableSeats ?? seats,
      ),
      freeUntil: `${String(Math.floor(until / 60)).padStart(2, "0")}:${String(until % 60).padStart(2, "0")}`,
      kind,
      available: Boolean(facility?.open) && (facility?.availableSeats || 0) > 0 && (hashValue(`${state.seed}:${index}`) % 5) !== 0,
    };
  });
}

export function liveExamSchedule(locale, date = new Date()) {
  const exams = [
    [2, catalogText("exams.0.1"), catalogText("exams.0.2"), catalogText("exams.0.3")],
    [5, catalogText("exams.1.1"), catalogText("exams.1.2"), catalogText("exams.1.3")],
    [8, catalogText("exams.2.1"), catalogText("exams.2.2"), catalogText("exams.2.3")],
    [11, catalogText("exams.3.1"), catalogText("exams.3.2"), catalogText("exams.3.3")],
    [14, catalogText("exams.4.1"), catalogText("exams.4.2"), catalogText("exams.4.3")],
  ];
  return exams.map(([offset, title, venue, format]) => {
    const when = new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
    const stamp = `${String(when.getMonth() + 1).padStart(2, "0")}.${String(when.getDate()).padStart(2, "0")}`;
    return [stamp, title[locale], venue[locale], format[locale]];
  });
}

export function seededPostCreatedAt(index, position, date = new Date()) {
  const elapsedToday = Math.max(8, date.getHours() * 60 + date.getMinutes());
  const ageMinutes = 4 + (hashValue(`${liveCampusDayKey(date)}:${index}:${position}`) % Math.min(1_380, elapsedToday + 180));
  return new Date(date.getTime() - ageMinutes * 60_000).toISOString();
}
