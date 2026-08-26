// Calendar fixtures use explicit Gensokyo (+08:00) civil times. Keep their
// month and time-band assertions stable when maintainers run checks in UTC.
process.env.TZ = "Asia/Singapore";

class MemoryStorage {
  #values = new Map();

  getItem(key) {
    return this.#values.has(key) ? this.#values.get(key) : null;
  }

  setItem(key, value) {
    this.#values.set(key, String(value));
  }

  removeItem(key) {
    this.#values.delete(key);
  }
}

globalThis.CustomEvent ??= class CustomEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.detail = options.detail;
  }
};
globalThis.window = { localStorage: new MemoryStorage(), dispatchEvent() {} };
globalThis.localStorage = globalThis.window.localStorage;

const {
  propertyArbiters,
  propertyItems,
} = await import("../src/data/property.js");
const {
  postSeedMessages,
} = await import("../src/data/post.js");
const {
  academicCalendarEvents,
  academicCalendarSnapshot,
} = await import("../src/data/academic-calendar.js");
const {
  propertyClaims,
  propertyOpinions,
  propertyStorageKeys,
  resolvePropertyClaim,
  submitPropertyClaim,
} = await import("../src/js/property-model.js");
const {
  acknowledgePost,
  postMessages,
  postStorageKeys,
  sendPostNotice,
} = await import("../src/js/post-model.js");
const {
  academicCalendarBookmarks,
  academicCalendarIcs,
  academicCalendarStorageKeys,
  toggleAcademicCalendarBookmark,
} = await import("../src/js/academic-calendar-model.js");
const { liveCampusSnapshot, liveFacilityStatus, liveTimetable } = await import("../src/data/live-campus.js");
const { campusEventContracts } = await import("../src/data/event-contracts.js");
const { localRecordRegistry } = await import("../src/data/local-records.js");
const { campusDomain } = await import("../src/js/domain-registry.js");
const { pageForRoute } = await import("../src/js/site-router.js");
const { site } = await import("../site.config.mjs");

const locales = ["zh-Hant", "ja", "en"];
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const translated = (value, label) => locales.forEach((locale) => check(
  typeof value?.[locale] === "string" && value[locale].trim(),
  `${label}: missing ${locale}.`,
));

check(propertyItems.length >= 10, `Expected at least ten disputing objects, got ${propertyItems.length}.`);
check(propertyArbiters.length === 4, "Property hearings must keep exactly four independent seats.");
check(new Set(propertyItems.map(({ id }) => id)).size === propertyItems.length, "Property item ids are duplicated.");
propertyItems.forEach((item) => {
  ["name", "foundAt", "foundBy", "condition", "statement", "dispute"].forEach((key) =>
    translated(item[key], `${item.id}/${key}`));
  check(item.evidence.length >= 3, `${item.id}: expected at least three evidence lines.`);
  check(item.responses.length === 3, `${item.id}: expected three non-equivalent dispositions.`);
});

const filed = submitPropertyClaim("umbrella-rain-claim", {
  claimant: "外界申請生",
  relationship: "holder",
  evidence: "我保留了十九個晴日的保養記錄、傘柄磨損拓印，以及小傘在雨停後留下的具名目擊。",
  requestedDisposition: "return",
  acceptsObjectVoice: true,
  acceptsConditions: true,
}, new Date("2026-07-27T09:00:00+08:00"));
check(filed.claim?.status === "hearing", "A complete property claim did not enter hearing.");
check(propertyOpinions(filed.claim.id).length === 4, "The four property seats were averaged or lost.");
const ruled = resolvePropertyClaim(filed.claim.id, "return", new Date("2026-07-27T09:30:00+08:00"));
check(ruled.claim?.status === "resolved" && ruled.claim.rulingNumber, "Property ruling did not seal.");
check(propertyClaims().length === 1, "Property claim was not retained locally.");

check(postSeedMessages.length >= 8, "Tengu Post needs at least eight out-of-order seeded notices.");
const inbox = postMessages("zh-Hant", new Date("2026-07-27T10:00:00+08:00"));
check(inbox.some(({ id }) => id.startsWith(`property-${filed.claim.id}`)), "Property hearing did not project into Tengu Post.");
const acknowledged = acknowledgePost(inbox[0].id, new Date("2026-07-27T10:05:00+08:00"));
check(acknowledged.read && acknowledged.acknowledgedAt, "Message acknowledgement did not persist.");
const dispatched = sendPostNotice({
  recipient: "霧湖圖書館",
  subject: "請替會飛的催還信留一格",
  body: "本通知公開到校園 BBS，但請勿由妖精在閱覽室朗讀全文。",
  channelId: "tengu-express",
  visibility: "public",
}, new Date("2026-07-27T10:10:00+08:00"));
check(dispatched.dispatch?.visibility === "public", "Outgoing Tengu Post dispatch did not persist.");

check(academicCalendarEvents.length >= 14, `Expected at least fourteen date/lunar events, got ${academicCalendarEvents.length}.`);
academicCalendarEvents.forEach((event) => {
  ["title", "window", "premise", "details"].forEach((key) =>
    translated(event[key], `${event.id}/${key}`));
  ["course", "transport", "library", "medicine"].forEach((key) =>
    translated(event.impacts[key], `${event.id}/impact/${key}`));
});
const fullMoonNight = new Date("2026-07-29T20:00:00+08:00");
const moonState = academicCalendarSnapshot(fullMoonNight);
check(moonState.activeEvents.length >= 1, "A dated calendar snapshot had no active projections.");
const summerState = academicCalendarSnapshot(new Date("2026-07-27T20:00:00+08:00"));
check(summerState.activeEvents.some(({ id }) => id === "night-sparrow-term"), "Summer night term did not activate.");
const liveSummer = liveCampusSnapshot(new Date("2026-07-27T20:00:00+08:00"));
check(liveSummer.calendar?.seasonId === "summer", "Academic calendar did not project into live campus.");
check(liveTimetable("zh-Hant", new Date("2026-07-27T20:00:00+08:00")).some(([, , , , note]) => note.includes("夏夜")), "Calendar did not change the live timetable.");
check(liveFacilityStatus("library", "zh-Hant", new Date("2026-11-10T12:00:00+08:00")).note.includes("版本"), "Autumn calendar did not change library capacity notes.");

const saved = toggleAcademicCalendarBookmark("spring-snow-dispute", new Date("2026-07-27T10:20:00+08:00"));
check(saved.bookmarked && academicCalendarBookmarks().length === 1, "Calendar bookmark was not saved.");
check(academicCalendarIcs("en", 2026).includes("BEGIN:VCALENDAR"), "Portable iCalendar output is invalid.");
check(postMessages("zh-Hant").some(({ id }) => id === "calendar-spring-snow-dispute"), "Saved calendar leaf did not project into Tengu Post.");

check(site.pages.some(({ id, output }) => id === "commons" && output === "commons.html"), "Commons page is missing from generated pages.");
check(site.pages.some(({ id, output }) => id === "calendar" && output === "calendar.html"), "Calendar page is missing from generated pages.");
check(pageForRoute("property-item-umbrella-rain-claim") === "commons", "Property deep links have no exact owner.");
check(pageForRoute("post-message-admission-before-application") === "commons", "Post deep links have no exact owner.");
check(pageForRoute("calendar-event-spring-snow-dispute") === "calendar", "Calendar deep links have no exact owner.");

const eventTypes = [
  "property.claim.submitted",
  "property.ruling.issued",
  "post.message.acknowledged",
  "post.correction.requested",
  "post.notice.dispatched",
  "calendar.event.saved",
  "calendar.event.removed",
];
eventTypes.forEach((type) => check(campusEventContracts[type], `Missing campus event contract ${type}.`));
const registered = new Set(localRecordRegistry.map(({ key }) => key));
[
  ...Object.values(propertyStorageKeys),
  ...Object.values(postStorageKeys),
  ...Object.values(academicCalendarStorageKeys),
].forEach((key) => check(registered.has(key), `Records cabinet is missing ${key}.`));

const commonsDomain = campusDomain("commons");
const calendarDomain = campusDomain("calendar");
check(commonsDomain?.search("zh-Hant").some(({ route }) => route === "property-item-umbrella-rain-claim"), "Commons search does not expose property files.");
check(calendarDomain?.search("ja").length === academicCalendarEvents.length, "Calendar search does not expose every event.");

if (failures.length) {
  console.error(`Commons and calendar check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Campus commons ready: ${propertyItems.length} disputing objects, ${postSeedMessages.length} seeded notices, `
  + `${academicCalendarEvents.length} academic-calendar events, four separate arbiters, and live campus projections.`,
);
