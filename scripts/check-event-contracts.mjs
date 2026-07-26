import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  campusEventContracts,
  createCampusEventEnvelope,
  upgradeCampusEvent,
  validateCampusEvent,
  validateCampusEventContract,
} from "../src/data/event-contracts.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const contracts = Object.values(campusEventContracts);
const contractTypes = new Set(contracts.map(({ type }) => type));
check(contractTypes.size === contracts.length, "Campus event contract types must be unique.");
contracts.forEach((contract) => failures.push(...validateCampusEventContract(contract)));
check(!contracts.some(({ type }) => type.startsWith("phantasm.")), "PHANTASM must not enter the official campus event registry.");

const jsDirectory = path.join(root, "src", "js");
const jsFiles = (await readdir(jsDirectory)).filter((file) => file.endsWith(".js"));
const producerTypes = new Set();
for (const file of jsFiles) {
  const source = await readFile(path.join(jsDirectory, file), "utf8");
  for (const match of source.matchAll(/recordCampusEvent\s*\(\s*([^\n,]+)/g)) {
    for (const literal of match[1].matchAll(/["']([a-z][a-z0-9-]*(?:\.[a-z0-9-]+)+)["']/g)) {
      producerTypes.add(literal[1]);
    }
  }
}

const unregistered = [...producerTypes].filter((type) => !contractTypes.has(type));
const unused = [...contractTypes].filter((type) => !producerTypes.has(type));
check(!unregistered.length, `Event producers without contracts: ${unregistered.join(", ")}`);
check(!unused.length, `Event contracts without producers: ${unused.join(", ")}`);

let tick = 0;
const history = [];
function add(type, payload, id = `${type}:test-${tick + 1}`) {
  tick += 1;
  const event = createCampusEventEnvelope({
    id,
    type,
    actor: "TU-TEST",
    timestamp: new Date(Date.UTC(2026, 6, 26, 0, tick)).toISOString(),
    payload,
  }, history);
  failures.push(...validateCampusEvent(event, history));
  history.push(event);
  return event;
}

function expectCause(event, expected, message) {
  check(event.causationId === expected.id, `${message}: expected ${expected.id}, got ${event.causationId}`);
}

const application = add("application.submitted", { applicationId: "TU-A-1", school: "boundary" });
const review = add("application.reviewed", {
  applicationId: "TU-A-1", reviewId: "TU-R-1", school: "boundary", outcome: "conditional",
});
expectCause(review, application, "Application review causation");
const applicationDeleted = add("application.deleted", { applicationId: "TU-A-1" });
expectCause(applicationDeleted, review, "Application deletion causation");

const visit = add("visit.reserved", { visitId: "TU-V-1", route: "hakurei", date: "2026-07-27" });
expectCause(add("visit.deleted", { visitId: "TU-V-1" }), visit, "Visit deletion causation");
const exam = add("exam.completed", { examId: "TU-E-1", bankId: "normal", percent: 88 });
expectCause(add("exam.deleted", { examId: "TU-E-1" }), exam, "Entrance-exam deletion causation");
const unified = add("gaokao.completed", { examId: "TU-G-1", difficultyId: "lunatic", trackId: "science" });
expectCause(add("gaokao.deleted", { examId: "TU-G-1" }), unified, "Unified-exam deletion causation");

const enrolled = add("course.enrolled", { courseCode: "BND-101", term: "2026-fall", credits: 3 });
expectCause(add("course.dropped", { courseCode: "BND-101", term: "2026-fall" }), enrolled, "Course drop causation");
const waitlisted = add("course.waitlisted", { courseCode: "MAG-204", term: "2026-fall", position: 2 });
expectCause(add("course.waitlist.cancelled", { courseCode: "MAG-204", term: "2026-fall" }), waitlisted, "Waitlist cancellation causation");

const borrowed = add("book.borrowed", { loanId: "TU-L-1", holdingId: "ML-01" });
const renewed = add("book.renewed", { loanId: "TU-L-1", holdingId: "ML-01" });
expectCause(renewed, borrowed, "Library renewal causation");
expectCause(add("book.returned", { loanId: "TU-L-1", holdingId: "ML-01" }), renewed, "Library return causation");
const hold = add("book.held", { holdId: "TU-H-1", holdingId: "ML-02" });
expectCause(add("book.hold.cancelled", { holdId: "TU-H-1", holdingId: "ML-02" }), hold, "Library hold cancellation causation");

const housingApplication = add("housing.application.submitted", {
  applicationId: "TU-HA-1", firstResidence: "misty", term: "2026-fall",
});
const assignment = add("housing.assignment.accepted", {
  assignmentId: "TU-HR-1",
  applicationId: "TU-HA-1",
  offerId: "TU-HO-1",
  roomId: "M-201",
  residenceId: "misty",
});
expectCause(assignment, housingApplication, "Housing assignment causation");
const transfer = add("housing.change.requested", { requestId: "TU-HC-1", assignmentId: "TU-HR-1" });
expectCause(transfer, assignment, "Housing transfer causation");
expectCause(
  add("housing.change.cancelled", { requestId: "TU-HC-1", assignmentId: "TU-HR-1" }),
  transfer,
  "Housing transfer cancellation causation",
);

const experiment = add("incident.experiment.completed", {
  experimentId: "TU-IX-1", caseId: "CASE-1", hypothesisId: "mist",
});
expectCause(
  add("incident.resolved", { resolutionId: "TU-IR-1", caseId: "CASE-1" }),
  experiment,
  "Incident resolution causation",
);

const academicExam = add("academic.exam.started", { attemptId: "TU-AE-1", examId: "EX-1" });
expectCause(
  add("academic.exam.completed", { attemptId: "TU-AE-1", examId: "EX-1", percent: 91 }),
  academicExam,
  "Academic exam causation",
);
const project = add("academic.project.submitted", { projectId: "TU-P-1", projectType: "spellcard" });
expectCause(
  add("academic.defence.completed", { projectId: "TU-P-1", defenceId: "TU-D-1" }),
  project,
  "Academic defence causation",
);

const clinicVisit = add("clinic.visit.checked-in", { visitId: "TU-CV-1", siteId: "eientei" });
const consultation = add("clinic.consultation.completed", {
  visitId: "TU-CV-1", prescriptionId: "TU-CP-1", siteId: "eientei",
});
expectCause(consultation, clinicVisit, "Clinic consultation causation");
const dispensed = add("clinic.prescription.dispensed", {
  prescriptionId: "TU-CP-1", visitId: "TU-CV-1", medicineIds: ["moon-drop"],
});
expectCause(dispensed, consultation, "Prescription dispensing causation");
expectCause(
  add("clinic.dose.recorded", {
    doseId: "TU-CD-1", prescriptionId: "TU-CP-1", visitId: "TU-CV-1", medicineId: "moon-drop", sequence: 1,
  }),
  dispensed,
  "Dose causation",
);
const therapy = add("clinic.therapy.started", {
  planId: "TU-CT-1", therapyId: "boundary-anchor", visitId: "TU-CV-1",
});
expectCause(therapy, consultation, "Recovery therapy causation");
const therapyStep = add("clinic.therapy.step.completed", {
  planId: "TU-CT-1", therapyId: "boundary-anchor", visitId: "TU-CV-1", step: 1,
});
expectCause(therapyStep, therapy, "Recovery step causation");
expectCause(
  add("clinic.therapy.completed", {
    planId: "TU-CT-1", therapyId: "boundary-anchor", visitId: "TU-CV-1",
  }),
  therapyStep,
  "Recovery completion causation",
);

const appraisal = add("appraisal.completed", { appraisalId: "TU-AP-1", objectId: "OBJ-1" });
expectCause(
  add("appraisal.catalogued", { appraisalId: "TU-AP-1", objectId: "OBJ-1", destinationId: "library" }),
  appraisal,
  "Appraisal catalogue causation",
);
const design = add("spellcard.design.saved", { designId: "TU-SD-1", patternId: "ring" });
expectCause(
  add("spellcard.defence.completed", { designId: "TU-SD-1", defenceId: "TU-SF-1" }),
  design,
  "Spell-card defence causation",
);

add("identity.created", { identityId: "TU-I-1", preferredSchool: "boundary" });
add("identity.updated", { identityId: "TU-I-1", preferredSchool: "magic" });
add("bbs.posted", { postId: "TU-B-1", category: "notice" });
add("housing.offer.declined", { applicationId: "TU-HA-2", offerId: "TU-HO-2" });
add("governance.vote.cast", { voteId: "TU-GV-1", proposalId: "PROP-1", choiceId: "yes" });
add("academic.assignment.graded", { submissionId: "TU-AS-1", assignmentId: "AS-1", courseCode: "BND-101" });

const upgraded = upgradeCampusEvent({
  schema: 1,
  id: "application.submitted:legacy",
  type: "application.submitted",
  actor: "student-local",
  timestamp: "2026-07-24T00:00:00.000Z",
  payload: { applicationId: "legacy", school: "history" },
}, []);
check(upgraded.schema === 2, "Legacy event did not upgrade to schema 2.");
check(upgraded.subject?.id === "legacy", "Legacy event subject was not reconstructed.");

for (const event of history) {
  if (!event.causationId) continue;
  const eventIndex = history.findIndex(({ id }) => id === event.id);
  const causeIndex = history.findIndex(({ id }) => id === event.causationId);
  check(causeIndex >= 0 && causeIndex < eventIndex, `${event.id}: causation must point to an earlier event.`);
}

if (failures.length) {
  console.error(`Campus event contract failures:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Campus event contracts valid: ${contracts.length} registered types, `
  + `${producerTypes.size} producer types, ${history.length} relationship fixtures.`,
);
