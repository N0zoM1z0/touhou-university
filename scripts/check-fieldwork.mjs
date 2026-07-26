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
globalThis.localStorage = globalThis.window.localStorage;

const {
  fieldworkComplications,
  fieldworkDisciplines,
  fieldworkRegions,
  fieldworkStations,
  fieldworkTravelModes,
} = await import("../src/data/fieldwork.js");
const {
  assessFieldworkDraft,
  checkInFieldwork,
  completeFieldworkReturn,
  defaultFieldworkDraft,
  fieldworkCommunityPosts,
  fieldworkDraft,
  fieldworkPassportSummary,
  fieldworkStorageKeys,
  fieldworkTravelEstimate,
  respondToFieldworkComplication,
  saveFieldworkDraft,
  submitFieldworkApplication,
} = await import("../src/js/fieldwork-model.js");
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

check(fieldworkStations.length === 24, `Fieldwork passport must expose exactly 24 stations, got ${fieldworkStations.length}.`);
check(new Set(fieldworkStations.map(({ id }) => id)).size === 24, "Fieldwork station ids are not unique.");
check(new Set(fieldworkStations.map(({ code }) => code)).size === 24, "Fieldwork station codes are not unique.");
check(fieldworkComplications.length >= 12, "Fieldwork needs at least twelve rotating complications.");
check(Object.keys(fieldworkRegions).length >= 8, "Fieldwork map needs at least eight regions.");
check(Object.keys(fieldworkDisciplines).length >= 10, "Fieldwork filters need at least ten disciplines.");
check(Object.keys(fieldworkTravelModes).length >= 5, "Fieldwork route desk needs at least five Gensokyo travel modes.");
check(site.pages.some(({ id, output }) => id === "fieldwork" && output === "fieldwork.html"), "Fieldwork page is missing from the generated site.");
check(pageForRoute("fieldwork-station-hakugyokurou") === "fieldwork", "Station deep links have no exact page owner.");
check(pageForRoute("fieldwork-placement-TU-FW-1") === "fieldwork", "Placement deep links have no exact page owner.");

fieldworkStations.forEach((station) => {
  ["name", "host", "supervisor", "companion", "placement", "premise", "access", "shift", "ethics", "wrinkle", "seal"]
    .forEach((key) => translated(station[key], `${station.id}/${key}`));
  check(station.equipment.length === 3, `${station.id}: expected three listed equipment items.`);
  check(station.tasks.length >= 3, `${station.id}: needs at least three substantive tasks.`);
  check(station.discipline.length >= 2, `${station.id}: needs cross-disciplinary indexing.`);
  check(fieldworkComplications.some(({ id }) => id === station.complicationId), `${station.id}: missing complication ${station.complicationId}.`);
});
fieldworkComplications.forEach((complication) => {
  translated(complication.title, `${complication.id}/title`);
  translated(complication.detail, `${complication.id}/detail`);
  check(complication.responses.length === 3, `${complication.id}: expected three non-equivalent first responses.`);
  check(new Set(complication.responses.map(([id]) => id)).size === 3, `${complication.id}: response ids are duplicated.`);
  complication.responses.forEach(([, label]) => translated(label, `${complication.id}/response`));
});

const scarlet = fieldworkStations.find(({ id }) => id === "scarlet-devil-mansion");
const hakugyokurou = fieldworkStations.find(({ id }) => id === "hakugyokurou");
check(scarlet && hakugyokurou, "Scarlet Devil Mansion and Hakugyokurou placements are required.");

const draft = {
  ...defaultFieldworkDraft(scarlet.id),
  fieldName: "外界實習生",
  purpose: "比較紅魔館值班簿的事件順序與外界鐘面時間，完整保留不一致之處。",
  equipment: [0, 1, 2],
  ethicsAcknowledged: true,
};
saveFieldworkDraft(draft);
check(fieldworkDraft().equipment.length === 3, "Numeric equipment selections were lost when restoring a saved draft.");
const assessment = assessFieldworkDraft(draft);
check(["approved", "conditional"].includes(assessment.outcome), `Complete dispatch was not issuable (${assessment.outcome}).`);
check(!("score" in assessment) && !("average" in assessment), "Fieldwork assessment must not average risk into a score.");

const submitted = submitFieldworkApplication(draft, new Date("2026-07-26T08:00:00+08:00"));
check(submitted.placement?.stationId === scarlet.id, "Scarlet placement was not filed.");
const checked = checkInFieldwork(submitted.placement.id, new Date("2026-07-26T08:05:00+08:00"));
check(checked.placement?.status === "deployed", "Dispatch could not check in.");
const blockedSecond = submitFieldworkApplication(
  { ...draft, stationId: hakugyokurou.id },
  new Date("2026-07-26T08:06:00+08:00"),
);
check(blockedSecond.error === "active-placement", "A second placement opened before the first returned.");
const complication = fieldworkComplications.find(({ id }) => id === checked.placement.complicationId);
const response = respondToFieldworkComplication(
  checked.placement.id,
  complication.responses[0][0],
  new Date("2026-07-26T08:20:00+08:00"),
);
check(response.placement?.status === "responded", "Field response did not enter the provenance chain.");
const returned = completeFieldworkReturn(
  checked.placement.id,
  {
    observation: "我先按值班簿記下事件順序，再以外界鐘面另列經過時間；咲夜在兩次讀值之間完成了七項工作，因此沒有把零分鐘改寫成沒有工作。",
    sourceKind: "mixed",
    sourceNote: "紅魔館東側值班簿第七版、門廳外界機械鐘與咲夜本人分開陳述；三者未合併。",
    evidenceCode: "FW-06-OBS-01",
    incidentKind: "publication",
    incidentNote: "帕秋莉要求所有引用保留版本，文文。新聞則在返校前已寫成『零分鐘實習』。",
    researchChoice: "allowed",
  },
  new Date("2026-07-26T12:00:00+08:00"),
);
check(returned.placement?.status === "completed", "Return could not be certified.");
check(returned.stamp?.credits === scarlet.credits, "First visit did not receive the station's field credit.");
check(fieldworkPassportSummary().distinctStations === 1, "Passport did not count the first distinct station.");

const revisit = submitFieldworkApplication(draft, new Date("2026-07-27T08:00:00+08:00"));
check(revisit.placement, "A return placement could not open after the first was stamped.");
checkInFieldwork(revisit.placement.id, new Date("2026-07-27T08:05:00+08:00"));
const revisitComplication = fieldworkComplications.find(({ id }) => id === revisit.placement.complicationId);
respondToFieldworkComplication(revisit.placement.id, revisitComplication.responses[1][0], new Date("2026-07-27T08:20:00+08:00"));
const revisited = completeFieldworkReturn(
  revisit.placement.id,
  {
    observation: "再訪時以同一版本值班簿重作順序核對，另記錄門廳鐘面與走廊內鐘面的差異，沒有覆寫首訪卷。",
    sourceKind: "archive",
    sourceNote: "紅魔館東側值班簿第七版再訪頁，與首訪證物代碼分開保存。",
    evidenceCode: "FW-06-OBS-02",
    incidentKind: "none",
    incidentNote: "無事故；零分鐘問題仍作偏差保留。",
    researchChoice: "teaching",
  },
  new Date("2026-07-27T12:00:00+08:00"),
);
check(revisited.stamp?.repeated && revisited.stamp.credits === 0.25, "Repeat visit did not receive the smaller return seal.");

const foot = fieldworkTravelEstimate("hakugyokurou", "foot", new Date("2026-07-26T09:00:00+08:00"));
const gap = fieldworkTravelEstimate("hakugyokurou", "gap", new Date("2026-07-26T09:00:00+08:00"));
check(foot.minutes !== gap.minutes, "Travel mode did not materially alter field route duration.");

const eventTypes = [
  "fieldwork.application.submitted",
  "fieldwork.departure.checked",
  "fieldwork.complication.handled",
  "fieldwork.observation.logged",
  "fieldwork.return.certified",
];
eventTypes.forEach((type) => check(campusEventContracts[type], `Missing campus event contract ${type}.`));
const registeredKeys = new Set(localRecordRegistry.map(({ key }) => key));
Object.values(fieldworkStorageKeys).forEach((key) => check(registeredKeys.has(key), `Records cabinet is missing ${key}.`));
const domain = campusDomain("fieldwork");
check(domain, "Fieldwork is missing from the shared domain registry.");
locales.forEach((locale) => {
  const entries = domain?.search(locale) || [];
  check(entries.filter(({ route }) => route.startsWith("fieldwork-station-")).length === 24, `${locale}: search does not expose all 24 stations.`);
  check((fieldworkCommunityPosts(locale) || []).some(({ fieldworkRoute }) => fieldworkRoute), `${locale}: BBS has no fieldwork projection.`);
});

if (failures.length) {
  console.error(`Fieldwork passport check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Fieldwork passport ready: ${fieldworkStations.length} stations, `
  + `${fieldworkComplications.length} complications, ${fieldworkTravelModes ? Object.keys(fieldworkTravelModes).length : 0} travel modes, `
  + `${eventTypes.length} causal event types, and repeat seals retain prior visits.`,
);
