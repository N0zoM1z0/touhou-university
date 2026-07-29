import { access, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const storage = new Map();
globalThis.localStorage = {
  getItem(key) { return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { storage.set(key, String(value)); },
  removeItem(key) { storage.delete(key); },
  clear() { storage.clear(); },
  key(index) { return [...storage.keys()][index] ?? null; },
  get length() { return storage.size; },
};
globalThis.window = new EventTarget();

const {
  employmentJobs,
  employmentOutcomeKinds,
  employmentPosterImages,
} = await import("../src/data/employment.js");
const {
  attestEmploymentOutcome,
  employmentApplications,
  employmentAttestations,
  employmentOutcomeSnapshot,
  employmentStorageKeys,
  respondEmploymentApplication,
  submitEmploymentApplication,
} = await import("../src/js/employment-model.js");
const { campusEventContract } = await import("../src/data/event-contracts.js");
const { localRecordRegistry } = await import("../src/data/local-records.js");
const { pageForRoute } = await import("../src/js/site-router.js");

check(employmentJobs.length === 21, "The recruitment rack must contain twenty-one substantial vacancies.");
check(new Set(employmentJobs.map(({ id }) => id)).size === employmentJobs.length, "Employment job ids are not unique.");
check(employmentOutcomeKinds.length === 8, "The whereabouts roll must preserve eight overlapping outcome kinds.");
check(Object.keys(employmentPosterImages).length === employmentJobs.length, "Every vacancy must own one illustrated notice.");

for (const job of employmentJobs) {
  for (const locale of ["zh-Hant", "ja", "en"]) {
    for (const field of ["employer", "title", "summary", "duty", "pay", "clause", "trial", "reply"]) {
      check(Boolean(job[field]?.[locale]), `${job.id}.${field} is missing ${locale}.`);
    }
  }
  check(job.risk >= 1 && job.risk <= 5, `${job.id} has an invalid risk seal count.`);
  check(Boolean(employmentPosterImages[job.poster]), `${job.id} has no mapped recruitment poster.`);
  check(pageForRoute(`employment-job-${job.id}`) === "careers", `${job.id} does not route to careers.html.`);
}

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const image of Object.values(employmentPosterImages)) {
  const target = path.join(projectRoot, image);
  await access(target);
  check((await stat(target)).size < 300_000, `${image} is too large for a notice-rack asset.`);
}

const personNoon = employmentOutcomeSnapshot("person", "noon");
const employerHigan = employmentOutcomeSnapshot("employer", "higan");
check(personNoon.statements > personNoon.denominator, "Overlapping whereabouts must be allowed to exceed the denominator.");
check(
  employerHigan.denominator !== personNoon.denominator && employerHigan.statements !== personNoon.statements,
  "Changing counting basis and observation window must materially alter the roll.",
);

const missingClause = submitEmploymentApplication({
  jobId: "scarlet-zero-minute-maid",
  displayName: "外界試工生",
  strength: "曾在停止時間裡把三份表按版本排好",
  boundary: "不接受沒有結束方式的停止時間班次",
  clauseAccepted: false,
});
check(missingClause.error === "clause", "The strange clause acknowledgement must not be silently skipped.");

const submitted = submitEmploymentApplication({
  jobId: "scarlet-zero-minute-maid",
  displayName: "外界試工生",
  degreeNumber: "TU-DEG-OUTSIDE",
  strength: "曾在停止時間裡把三份表按版本排好",
  boundary: "不接受沒有結束方式的停止時間班次",
  desiredPay: "工資與停時加班分欄",
  availability: "nonlinear",
  nonlinearReady: true,
  clauseAccepted: true,
}, new Date("2026-07-29T03:00:00Z"));
check(Boolean(submitted.record?.id), "A complete odd résumé was not persisted.");
check(employmentApplications().length === 1, "The submitted application did not return from local storage.");

const responded = respondEmploymentApplication(
  submitted.record.id,
  "correction",
  "請把零分鐘不計加班與不扣休息寫成兩個可申訴欄。",
  new Date("2026-07-29T03:09:00Z"),
);
check(responded.record?.response?.kind === "correction", "The applicant's edition-two response was not persisted.");

const attested = attestEmploymentOutcome({
  displayName: "外界試工生",
  outcomeId: "multiple",
  simultaneous: true,
  note: "同時被紅魔館與昨日線認領，但兩邊都尚未收到同一版的我。",
}, new Date("2026-07-29T03:12:00Z"));
check(Boolean(attested.record?.id) && employmentAttestations().length === 1, "The on-device whereabouts statement was not persisted.");

const registeredKeys = new Set(localRecordRegistry.map(({ key }) => key));
Object.values(employmentStorageKeys).forEach((key) => {
  check(registeredKeys.has(key), `Missing local-record registry entry ${key}.`);
});
[
  "employment.application.submitted",
  "employment.application.responded",
  "employment.outcome.attested",
].forEach((type) => check(Boolean(campusEventContract(type)), `Missing causal event contract ${type}.`));

if (failures.length) {
  console.error(`Employment check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("Employment market valid: 21 strange vacancies, 5 counting bases, 5 observation windows, 21 compressed poster sheets, 3 local files, and 3 causal events.");
