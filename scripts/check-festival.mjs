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
globalThis.window = {
  localStorage: new MemoryStorage(),
  dispatchEvent() {},
};

const {
  festivalGatePlans,
  festivalIncidentPool,
  festivalKinds,
  festivalReviewDesks,
  festivalRoutes,
} = await import("../src/data/festival.js");
const {
  assessFestivalPlan,
  closeFestivalOperation,
  defaultFestivalDraft,
  festivalClinicPressure,
  festivalOperation,
  festivalOutcomeLabels,
  festivalRouteOverlay,
  festivalStanceLabels,
  festivalStorageKeys,
  respondFestivalIncident,
  startFestivalOperation,
  submitFestivalPlan,
} = await import("../src/js/festival-model.js");
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
const translated = (value, label) => {
  locales.forEach((locale) => check(
    typeof value?.[locale] === "string" && value[locale].trim(),
    `${label}: missing ${locale}.`,
  ));
};

check(festivalKinds.length === 2, "Festival operations must retain both opening dossiers.");
check(festivalRoutes.length === 4, "Festival operations must retain four materially different procession routes.");
check(festivalReviewDesks.length === 6, "Festival permits must retain six independent desks.");
check(festivalIncidentPool.length >= 7, "Festival field operations need at least seven incident sources.");
check(new Set(festivalReviewDesks.map(({ id }) => id)).size === 6, "Festival review desk ids are not unique.");
check(new Set(festivalIncidentPool.map(({ id }) => id)).size === festivalIncidentPool.length, "Festival incident ids are not unique.");
check(site.pages.some(({ id, output }) => id === "festival" && output === "festival.html"), "Festival page is missing from the generated site.");
check(pageForRoute("festival-operation-TU-FEST-LIVE-1") === "festival", "Festival operation routes have no exact page owner.");

[...Object.values(festivalOutcomeLabels), ...Object.values(festivalStanceLabels)]
  .forEach((label, index) => translated(label, `festival label ${index}`));
festivalKinds.forEach((kind) => {
  translated(kind.name, `${kind.id} name`);
  translated(kind.premise, `${kind.id} premise`);
});
festivalRoutes.forEach((route) => {
  translated(route.name, `${route.id} name`);
  translated(route.detail, `${route.id} detail`);
  check(route.path.length >= 3, `${route.id}: procession route is too short to affect campus navigation.`);
});
festivalReviewDesks.forEach((desk) => {
  translated(desk.name, `${desk.id} desk name`);
  translated(desk.question, `${desk.id} desk question`);
});
festivalIncidentPool.forEach((incident) => {
  translated(incident.title, `${incident.id} title`);
  translated(incident.body, `${incident.id} body`);
  check(incident.responses.length === 3, `${incident.id}: each field case must retain three non-equivalent first responses.`);
  incident.responses.forEach((response) => translated(response.label, `${incident.id}/${response.id}`));
});

const draft = defaultFestivalDraft(new Date("2026-03-14T09:00:00+08:00"));
const assessment = assessFestivalPlan(draft);
check(assessment.opinions.length === 6, "The permit did not receive six independent desk opinions.");
check(new Set(assessment.opinions.map(({ deskId }) => deskId)).size === 6, "A festival desk was duplicated or averaged away.");
check(!("score" in assessment) && !("average" in assessment), "Festival assessment must not expose a total score or average.");
check(
  assessment.programme.length >= 6 && assessment.programme.every(({ at, title, place }) => at && title && place),
  "Festival programme generation is incomplete.",
);
const unsafe = assessFestivalPlan({
  ...draft,
  routeId: "lake-ring",
  stageId: "hakurei-yard",
  visitorCapacity: 1200,
  density: 5,
  cueSeconds: 0,
  rainPlan: false,
  debrisCrew: false,
  independentCounter: false,
  powerId: "kappa-grid",
  aidPlanId: "gate-infirmary",
  musicPlanId: "ghost-afterhours",
});
check(unsafe.outcome === "revision", `Manifestly unworkable plan should be returned, got ${unsafe.outcome}.`);
check(unsafe.opinions.some(({ stance }) => stance === "revise"), "Returned festival has no desk willing to sign the return.");

const plan = submitFestivalPlan(draft, new Date("2026-03-14T09:05:00+08:00"));
const opened = startFestivalOperation(
  plan.id,
  { role: "organiser", acknowledged: true },
  new Date("2026-03-14T09:06:00+08:00"),
);
check(opened.operation?.scenarioIds.length === 4, "Opening did not issue four field cases.");
check(festivalRouteOverlay().active, "A live festival did not enter the campus routing overlay.");
check(festivalClinicPressure().active, "A live festival did not enter the Eientei pressure model.");
opened.operation.scenarioIds.forEach((incidentId, index) => {
  const responseId = festivalIncidentPool.find(({ id }) => id === incidentId)?.responses[0]?.id;
  respondFestivalIncident(
    opened.operation.id,
    incidentId,
    responseId,
    new Date(`2026-03-14T09:${String(10 + index).padStart(2, "0")}:00+08:00`),
  );
});
const closed = closeFestivalOperation(opened.operation.id, new Date("2026-03-14T09:20:00+08:00"));
check(closed.operation?.status === "closed" && closed.operation.report, "Festival could not close after all field cases were resolved.");
check(festivalOperation(opened.operation.id)?.responses.length === 4, "Festival response records were not retained.");
check(!festivalRouteOverlay().active, "Closing did not release the festival route overlay.");
check(!festivalClinicPressure().active, "Closing did not release the Eientei pressure overlay.");

const eventTypes = [
  "festival.plan.submitted",
  "festival.permit.issued",
  "festival.shift.started",
  "festival.incident.resolved",
  "festival.report.closed",
];
eventTypes.forEach((type) => check(campusEventContracts[type], `Missing campus event contract ${type}.`));
const registeredKeys = new Set(localRecordRegistry.map(({ key }) => key));
Object.values(festivalStorageKeys).forEach((key) => check(registeredKeys.has(key), `Records cabinet is missing ${key}.`));
const domain = campusDomain("festival");
check(domain, "Festival operations is missing from the shared domain registry.");
locales.forEach((locale) => {
  const entries = domain?.search(locale) || [];
  check(entries.some(({ route }) => route === `festival-plan-${plan.id}`), `Filed festival is missing from ${locale} search.`);
  check((domain?.community(locale) || []).some(({ festivalRoute }) => festivalRoute), `Festival BBS projection is missing in ${locale}.`);
});
check(festivalGatePlans.some(({ id }) => id === "rotating"), "Three-faith rotating gate plan is missing.");

if (failures.length) {
  console.error(`Festival operations check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Festival operations ready: ${festivalReviewDesks.length} independent desks, `
  + `${festivalIncidentPool.length} field incidents, ${festivalRoutes.length} route plans, `
  + `${eventTypes.length} causal event types, and no averaged permit.`,
);
