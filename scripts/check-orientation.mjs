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

  clear() {
    this.#values.clear();
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
  orientationFirstStops,
  orientationNoticePlans,
  orientationSeason,
  orientationStopSignals,
} = await import("../src/data/orientation.js");
const {
  completeOrientation,
  confirmOrientationArrival,
  confirmOrientationBoundary,
  orientationCommunityPosts,
  orientationDossiers,
  orientationEligibility,
  orientationStorageKeys,
  startOrientationDossier,
} = await import("../src/js/orientation-model.js");
const { campusEventContracts } = await import("../src/data/event-contracts.js");
const { localRecordRegistry } = await import("../src/data/local-records.js");
const { campusDomain } = await import("../src/js/domain-registry.js");
const { pageForRoute } = await import("../src/js/site-router.js");
const { site } = await import("../site.config.mjs");

const failures = [];
const locales = ["zh-Hant", "ja", "en"];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const translated = (value, label) => locales.forEach((locale) => check(
  typeof value?.[locale] === "string" && value[locale].trim(),
  `${label}: missing ${locale}.`,
));

translated(orientationSeason.title, "season title");
translated(orientationSeason.premise, "season premise");
check(orientationStopSignals.length === 3, "First Bell must offer three materially different stop signals.");
check(orientationNoticePlans.length === 3, "First Bell must keep stop signals separate from three notice plans.");
check(orientationFirstStops.length === 4, "First Bell must open four real campus destinations.");
[...orientationStopSignals, ...orientationNoticePlans, ...orientationFirstStops].forEach((entry) => {
  translated(entry.name, `${entry.id} name`);
  translated(entry.detail, `${entry.id} detail`);
});

check(site.pages.some(({ id, output }) => id === "orientation" && output === "welcome.html"), "First Bell page is missing from generated pages.");
check(pageForRoute("orientation-dossier-TU-FIRST-1") === "orientation", "Arrival-file deep links have no exact page owner.");
check(pageForRoute("welcome") === "orientation", "The public welcome route has no exact page owner.");

check(orientationEligibility().status === "identity-missing", "An empty device should expose a public blank file, not an eligible record.");
window.localStorage.setItem("tu:identity", JSON.stringify({
  id: "TU-S-ORIENTATION", name: "紅葉", preferredSchool: "boundary",
}));
window.localStorage.setItem("tu:application:submissions", JSON.stringify([{
  id: "TU-A-ORIENTATION", school: "boundary", question: "門變多時，哪一條退路仍算共同的？",
}]));
window.localStorage.setItem("tu:application:reviews", JSON.stringify([{
  id: "TU-R-ORIENTATION", applicationId: "TU-A-ORIENTATION", school: "boundary", outcome: "conditional",
}]));
check(orientationEligibility().status === "conditional", "Conditional admission must not silently become formal arrival eligibility.");

window.localStorage.setItem("tu:application:reviews", JSON.stringify([{
  id: "TU-R-ORIENTATION", applicationId: "TU-A-ORIENTATION", school: "boundary", outcome: "admitted",
}]));
check(orientationEligibility().eligible, "A formal admitted review should open the arrival file.");

const opened = startOrientationDossier(new Date("2026-10-12T08:00:00+08:00"));
check(opened.dossier?.status === "open", "Opening First Bell did not persist an arrival dossier.");
check(startOrientationDossier().dossier?.id === opened.dossier?.id, "Reopening First Bell duplicated the active admission file.");
const storedOpen = window.localStorage.getItem(orientationStorageKeys.dossiers) || "";
check(!storedOpen.includes("紅葉") && !storedOpen.includes("門變多"), "The arrival file copied identity or application prose instead of retaining stable references.");

const arrived = confirmOrientationArrival(opened.dossier.id, "walk", new Date("2026-10-12T08:05:00+08:00"));
check(arrived.dossier?.arrival?.path?.[0] === "gate", "Arrival routing did not begin at Hakurei Gate.");
check(arrived.dossier?.arrival?.destinationId === "boundary", "Arrival routing did not resolve the admitting school destination.");
const bounded = confirmOrientationBoundary(opened.dossier.id, {
  signalId: "wood-bell",
  noticeId: "tengu-correction",
}, new Date("2026-10-12T08:10:00+08:00"));
check(bounded.dossier?.boundary?.signalId === "wood-bell", "Personally recognisable stop signal was not retained.");
check(bounded.dossier?.boundary?.noticeId === "tengu-correction", "Detour notice was not retained separately.");
const completed = completeOrientation(opened.dossier.id, "first-course", new Date("2026-10-12T08:15:00+08:00"));
check(completed.dossier?.status === "matriculated", "First Bell did not establish the arrival record.");
check(orientationDossiers().length === 1, "The lifecycle did not retain exactly one referenced arrival file.");

const eventTypes = [
  "orientation.dossier.opened",
  "orientation.arrival.confirmed",
  "orientation.boundary.confirmed",
  "orientation.matriculated",
];
eventTypes.forEach((type) => check(campusEventContracts[type], `Missing campus event contract ${type}.`));
const registeredKeys = new Set(localRecordRegistry.map(({ key }) => key));
check(registeredKeys.has(orientationStorageKeys.dossiers), "Records cabinet is missing the First Bell arrival file.");

const domain = campusDomain("orientation");
check(domain?.search("ja").some(({ route }) => route === `orientation-dossier-${opened.dossier.id}`), "Filed arrival is missing from shared search.");
check(domain?.community("en").some(({ orientationRoute }) => orientationRoute === `orientation-dossier-${opened.dossier.id}`), "Arrival did not produce a nameless BBS projection.");
check(orientationCommunityPosts("zh-Hant").every((post) => !post.title.includes("紅葉") && !post.body.includes("紅葉")), "The public BBS projection leaked the student's known name.");

if (failures.length) {
  console.error(`First Bell orientation check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`First Bell ready: ${orientationStopSignals.length} stop signals, ${orientationNoticePlans.length} notice plans, ${orientationFirstStops.length} real first destinations, and ${eventTypes.length} causal events.`);
