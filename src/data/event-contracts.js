import { text as catalogText } from "../generated/i18n/data/event-contracts.js";
const locales = ["zh-Hant", "ja", "en"];

const reference = (kind, id) => {
  const value = String(id ?? "").trim();
  return value ? { kind, id: value } : null;
};

const by = (kind, key) => (payload) => reference(kind, payload?.[key]);
const related = (...entries) => (payload) => entries
  .map(([kind, key]) => {
    const value = payload?.[key];
    if (Array.isArray(value)) return value.map((id) => reference(kind, id)).filter(Boolean);
    return reference(kind, value);
  })
  .flat()
  .filter(Boolean);

const courseReference = (payload) => reference(
  "course",
  payload?.term && payload?.courseCode ? `${payload.term}:${payload.courseCode}` : payload?.courseCode,
);

const doseReference = (payload) => reference(
  "clinic-dose",
  payload?.doseId || (
    payload?.prescriptionId && payload?.sequence
      ? `${payload.prescriptionId}:${payload.sequence}`
      : ""
  ),
);

function define(type, label, {
  subject,
  correlation = null,
  causedBy = [],
  references = () => [],
  required = [],
} = {}) {
  return {
    type,
    version: 1,
    label,
    subject,
    correlation: correlation || ((payload) => {
      const value = subject?.(payload);
      return value ? `${value.kind}:${value.id}` : null;
    }),
    causedBy,
    references,
    required,
  };
}

const contracts = [
  define("identity.created", catalogText("contracts.0.identity.created.1"), {
    subject: by("identity", "identityId"), required: ["identityId"],
    references: related(["school", "preferredSchool"]),
  }),
  define("identity.updated", catalogText("contracts.1.identity.updated.1"), {
    subject: by("identity", "identityId"), required: ["identityId"], causedBy: ["identity.created", "identity.updated"],
    references: related(["school", "preferredSchool"]),
  }),
  define("application.submitted", catalogText("contracts.2.application.submitted.1"), {
    subject: by("application", "applicationId"), required: ["applicationId"], references: related(["school", "school"]),
  }),
  define("application.reviewed", catalogText("contracts.3.application.reviewed.1"), {
    subject: by("application", "applicationId"), required: ["applicationId", "reviewId"],
    causedBy: ["application.submitted"], references: related(["review", "reviewId"], ["school", "school"]),
  }),
  define("application.deleted", catalogText("contracts.4.application.deleted.1"), {
    subject: by("application", "applicationId"), required: ["applicationId"],
    causedBy: ["application.reviewed", "application.submitted"],
  }),
  define("orientation.dossier.opened", catalogText("contracts.5.orientation.dossier.opened.1"), {
    subject: by("orientation-dossier", "dossierId"), correlation: (payload) => `orientation:${payload.dossierId || ""}`,
    required: ["dossierId", "identityId", "applicationId", "schoolId"],
    references: related(["identity", "identityId"], ["application", "applicationId"], ["school", "schoolId"]),
  }),
  define("orientation.arrival.confirmed", catalogText("contracts.6.orientation.arrival.confirmed.1"), {
    subject: by("orientation-dossier", "dossierId"), correlation: (payload) => `orientation:${payload.dossierId || ""}`,
    required: ["dossierId", "modeId", "destinationId"], causedBy: ["orientation.dossier.opened"],
    references: related(["transport-mode", "modeId"], ["campus-place", "destinationId"]),
  }),
  define("orientation.boundary.confirmed", catalogText("contracts.7.orientation.boundary.confirmed.1"), {
    subject: by("orientation-dossier", "dossierId"), correlation: (payload) => `orientation:${payload.dossierId || ""}`,
    required: ["dossierId", "signalId", "noticeId"], causedBy: ["orientation.arrival.confirmed"],
    references: related(["orientation-signal", "signalId"], ["orientation-notice", "noticeId"]),
  }),
  define("orientation.matriculated", catalogText("contracts.8.orientation.matriculated.1"), {
    subject: by("orientation-dossier", "dossierId"), correlation: (payload) => `orientation:${payload.dossierId || ""}`,
    required: ["dossierId", "schoolId", "firstStopId"], causedBy: ["orientation.boundary.confirmed"],
    references: related(["school", "schoolId"], ["orientation-first-stop", "firstStopId"]),
  }),
  define("visit.reserved", catalogText("contracts.9.visit.reserved.1"), {
    subject: by("visit", "visitId"), required: ["visitId"], references: related(["campus-route", "route"]),
  }),
  define("visit.deleted", catalogText("contracts.10.visit.deleted.1"), {
    subject: by("visit", "visitId"), required: ["visitId"], causedBy: ["visit.reserved"],
  }),
  define("exam.completed", catalogText("contracts.11.exam.completed.1"), {
    subject: by("entrance-exam-attempt", "examId"), required: ["examId"], references: related(["exam-bank", "bankId"]),
  }),
  define("exam.deleted", catalogText("contracts.12.exam.deleted.1"), {
    subject: by("entrance-exam-attempt", "examId"), required: ["examId"], causedBy: ["exam.completed"],
  }),
  define("gaokao.completed", catalogText("contracts.13.gaokao.completed.1"), {
    subject: by("unified-exam-attempt", "examId"), required: ["examId"],
    references: related(["difficulty", "difficultyId"], ["track", "trackId"]),
  }),
  define("gaokao.deleted", catalogText("contracts.14.gaokao.deleted.1"), {
    subject: by("unified-exam-attempt", "examId"), required: ["examId"], causedBy: ["gaokao.completed"],
  }),
  define("bbs.posted", catalogText("contracts.15.bbs.posted.1"), {
    subject: by("bbs-post", "postId"), required: ["postId"], references: related(["bbs-board", "category"]),
  }),
  define("course.enrolled", catalogText("contracts.16.course.enrolled.1"), {
    subject: courseReference, correlation: (payload) => `course:${courseReference(payload)?.id || ""}`,
    required: ["courseCode", "term"],
  }),
  define("course.waitlisted", catalogText("contracts.17.course.waitlisted.1"), {
    subject: courseReference, correlation: (payload) => `course:${courseReference(payload)?.id || ""}`,
    required: ["courseCode", "term"],
  }),
  define("course.dropped", catalogText("contracts.18.course.dropped.1"), {
    subject: courseReference, correlation: (payload) => `course:${courseReference(payload)?.id || ""}`,
    required: ["courseCode", "term"], causedBy: ["course.enrolled"],
  }),
  define("course.waitlist.cancelled", catalogText("contracts.19.course.waitlist.cancelled.1"), {
    subject: courseReference, correlation: (payload) => `course:${courseReference(payload)?.id || ""}`,
    required: ["courseCode", "term"], causedBy: ["course.waitlisted"],
  }),
  define("book.borrowed", catalogText("contracts.20.book.borrowed.1"), {
    subject: by("library-loan", "loanId"), required: ["loanId", "holdingId"],
    references: related(["library-holding", "holdingId"]),
  }),
  define("book.renewed", catalogText("contracts.21.book.renewed.1"), {
    subject: by("library-loan", "loanId"), required: ["loanId", "holdingId"], causedBy: ["book.borrowed", "book.renewed"],
    references: related(["library-holding", "holdingId"]),
  }),
  define("book.returned", catalogText("contracts.22.book.returned.1"), {
    subject: by("library-loan", "loanId"), required: ["loanId", "holdingId"], causedBy: ["book.renewed", "book.borrowed"],
    references: related(["library-holding", "holdingId"]),
  }),
  define("book.held", catalogText("contracts.23.book.held.1"), {
    subject: by("library-hold", "holdId"), required: ["holdId", "holdingId"],
    references: related(["library-holding", "holdingId"]),
  }),
  define("book.hold.cancelled", catalogText("contracts.24.book.hold.cancelled.1"), {
    subject: by("library-hold", "holdId"), required: ["holdId", "holdingId"], causedBy: ["book.held"],
    references: related(["library-holding", "holdingId"]),
  }),
  define("housing.application.submitted", catalogText("contracts.25.housing.application.submitted.1"), {
    subject: by("housing-application", "applicationId"), required: ["applicationId"],
    references: related(["residence", "firstResidence"], ["term", "term"]),
  }),
  define("housing.offer.declined", catalogText("contracts.26.housing.offer.declined.1"), {
    subject: by("housing-application", "applicationId"), required: ["applicationId", "offerId"],
    causedBy: ["housing.application.submitted", "housing.offer.declined"], references: related(["housing-offer", "offerId"]),
  }),
  define("housing.assignment.accepted", catalogText("contracts.27.housing.assignment.accepted.1"), {
    subject: by("housing-assignment", "assignmentId"), required: ["assignmentId", "roomId"],
    correlation: (payload) => payload?.applicationId
      ? `housing-application:${payload.applicationId}`
      : `housing-assignment:${payload?.assignmentId || ""}`,
    causedBy: ["housing.application.submitted", "housing.offer.declined"],
    references: related(["housing-application", "applicationId"], ["housing-offer", "offerId"], ["housing-room", "roomId"], ["residence", "residenceId"]),
  }),
  define("housing.change.requested", catalogText("contracts.28.housing.change.requested.1"), {
    subject: by("housing-change", "requestId"), required: ["requestId", "assignmentId"],
    correlation: (payload) => `housing-assignment:${payload?.assignmentId || ""}`,
    causedBy: ["housing.assignment.accepted"], references: related(["housing-assignment", "assignmentId"]),
  }),
  define("housing.change.cancelled", catalogText("contracts.29.housing.change.cancelled.1"), {
    subject: by("housing-change", "requestId"), required: ["requestId", "assignmentId"],
    correlation: (payload) => `housing-assignment:${payload?.assignmentId || ""}`,
    causedBy: ["housing.change.requested"], references: related(["housing-assignment", "assignmentId"]),
  }),
  define("incident.experiment.completed", catalogText("contracts.30.incident.experiment.completed.1"), {
    subject: by("incident-experiment", "experimentId"), required: ["experimentId", "caseId"],
    correlation: (payload) => `incident-case:${payload?.caseId || ""}`,
    references: related(["incident-case", "caseId"], ["incident-hypothesis", "hypothesisId"]),
  }),
  define("incident.resolved", catalogText("contracts.31.incident.resolved.1"), {
    subject: by("incident-resolution", "resolutionId"), required: ["resolutionId", "caseId"],
    correlation: (payload) => `incident-case:${payload?.caseId || ""}`,
    causedBy: ["incident.experiment.completed"], references: related(["incident-case", "caseId"]),
  }),
  define("governance.vote.cast", catalogText("contracts.32.governance.vote.cast.1"), {
    subject: by("governance-vote", "voteId"), required: ["voteId", "proposalId"],
    references: related(["governance-proposal", "proposalId"], ["governance-choice", "choiceId"]),
  }),
  define("academic.assignment.graded", catalogText("contracts.33.academic.assignment.graded.1"), {
    subject: by("academic-submission", "submissionId"), required: ["submissionId", "assignmentId"],
    references: related(["assignment", "assignmentId"], ["course", "courseCode"]),
  }),
  define("academic.exam.started", catalogText("contracts.34.academic.exam.started.1"), {
    subject: by("academic-exam-attempt", "attemptId"), required: ["attemptId", "examId"],
    references: related(["academic-exam", "examId"]),
  }),
  define("academic.exam.completed", catalogText("contracts.35.academic.exam.completed.1"), {
    subject: by("academic-exam-attempt", "attemptId"), required: ["attemptId", "examId"],
    causedBy: ["academic.exam.started"], references: related(["academic-exam", "examId"]),
  }),
  define("academic.project.submitted", catalogText("contracts.36.academic.project.submitted.1"), {
    subject: by("academic-project", "projectId"), required: ["projectId"],
    references: related(["academic-project-type", "projectType"]),
  }),
  define("academic.defence.completed", catalogText("contracts.37.academic.defence.completed.1"), {
    subject: by("academic-project", "projectId"), required: ["projectId", "defenceId"],
    causedBy: ["academic.project.submitted"], references: related(["academic-defence", "defenceId"]),
  }),
  define("clinic.visit.checked-in", catalogText("contracts.38.clinic.visit.checked-in.1"), {
    subject: by("clinic-visit", "visitId"), required: ["visitId"], references: related(["clinic-site", "siteId"]),
  }),
  define("clinic.consultation.completed", catalogText("contracts.39.clinic.consultation.completed.1"), {
    subject: by("clinic-visit", "visitId"), required: ["visitId", "prescriptionId"],
    causedBy: ["clinic.visit.checked-in"], references: related(["clinic-prescription", "prescriptionId"], ["clinic-site", "siteId"]),
  }),
  define("clinic.prescription.dispensed", catalogText("contracts.40.clinic.prescription.dispensed.1"), {
    subject: by("clinic-prescription", "prescriptionId"), required: ["prescriptionId"],
    correlation: (payload) => payload?.visitId
      ? `clinic-visit:${payload.visitId}`
      : `clinic-prescription:${payload?.prescriptionId || ""}`,
    causedBy: ["clinic.consultation.completed"],
    references: related(["clinic-visit", "visitId"], ["clinic-medicine", "medicineIds"]),
  }),
  define("clinic.dose.recorded", catalogText("contracts.41.clinic.dose.recorded.1"), {
    subject: doseReference, required: ["prescriptionId", "medicineId", "sequence"],
    correlation: (payload) => `clinic-prescription:${payload?.prescriptionId || ""}`,
    causedBy: ["clinic.prescription.dispensed", "clinic.dose.recorded"],
    references: related(["clinic-prescription", "prescriptionId"], ["clinic-medicine", "medicineId"], ["clinic-visit", "visitId"]),
  }),
  define("clinic.therapy.started", catalogText("contracts.42.clinic.therapy.started.1"), {
    subject: by("clinic-care-plan", "planId"), required: ["planId", "therapyId"],
    causedBy: ["clinic.consultation.completed"],
    references: related(["clinic-therapy", "therapyId"], ["clinic-visit", "visitId"]),
  }),
  define("clinic.therapy.step.completed", catalogText("contracts.43.clinic.therapy.step.completed.1"), {
    subject: by("clinic-care-plan", "planId"), required: ["planId", "therapyId", "step"],
    causedBy: ["clinic.therapy.started", "clinic.therapy.step.completed"],
    references: related(["clinic-therapy", "therapyId"], ["clinic-visit", "visitId"]),
  }),
  define("clinic.therapy.completed", catalogText("contracts.44.clinic.therapy.completed.1"), {
    subject: by("clinic-care-plan", "planId"), required: ["planId", "therapyId"],
    causedBy: ["clinic.therapy.step.completed", "clinic.therapy.started"],
    references: related(["clinic-therapy", "therapyId"], ["clinic-visit", "visitId"]),
  }),
  define("appraisal.completed", catalogText("contracts.45.appraisal.completed.1"), {
    subject: by("appraisal", "appraisalId"), required: ["appraisalId", "objectId"],
    references: related(["appraisal-object", "objectId"]),
  }),
  define("appraisal.catalogued", catalogText("contracts.46.appraisal.catalogued.1"), {
    subject: by("appraisal", "appraisalId"), required: ["appraisalId", "objectId"],
    causedBy: ["appraisal.completed"], references: related(["appraisal-object", "objectId"], ["appraisal-destination", "destinationId"]),
  }),
  define("spellcard.design.saved", catalogText("contracts.47.spellcard.design.saved.1"), {
    subject: by("spellcard-design", "designId"), required: ["designId"],
    references: related(["spell-pattern", "patternId"], ["spellcard-design", "revisionOf"]),
  }),
  define("spellcard.defence.completed", catalogText("contracts.48.spellcard.defence.completed.1"), {
    subject: by("spellcard-design", "designId"), required: ["designId", "defenceId"],
    causedBy: ["spellcard.design.saved"], references: related(["spellcard-defence", "defenceId"]),
  }),
  define("festival.plan.submitted", catalogText("contracts.49.festival.plan.submitted.1"), {
    subject: by("festival-plan", "planId"), required: ["planId", "kindId", "outcome"],
    references: related(["festival-kind", "kindId"]),
  }),
  define("festival.permit.issued", catalogText("contracts.50.festival.permit.issued.1"), {
    subject: by("festival-plan", "planId"), required: ["planId", "kindId", "outcome"],
    causedBy: ["festival.plan.submitted"],
    references: related(["festival-kind", "kindId"], ["festival-review-desk", "deskIds"]),
  }),
  define("festival.shift.started", catalogText("contracts.51.festival.shift.started.1"), {
    subject: by("festival-operation", "operationId"), required: ["operationId", "planId", "role"],
    correlation: (payload) => `festival-plan:${payload?.planId || ""}`,
    causedBy: ["festival.permit.issued"],
    references: related(["festival-plan", "planId"], ["festival-route", "routeId"]),
  }),
  define("festival.incident.resolved", catalogText("contracts.52.festival.incident.resolved.1"), {
    subject: (payload) => reference("festival-incident-response", `${payload?.operationId || ""}:${payload?.incidentId || ""}`),
    required: ["operationId", "planId", "incidentId", "responseId"],
    correlation: (payload) => `festival-plan:${payload?.planId || ""}`,
    causedBy: ["festival.shift.started", "festival.incident.resolved"],
    references: related(["festival-operation", "operationId"], ["festival-response", "responseId"]),
  }),
  define("festival.report.closed", catalogText("contracts.53.festival.report.closed.1"), {
    subject: by("festival-operation", "operationId"), required: ["operationId", "planId", "attendance"],
    correlation: (payload) => `festival-plan:${payload?.planId || ""}`,
    causedBy: ["festival.incident.resolved", "festival.shift.started"],
    references: related(["festival-plan", "planId"]),
  }),
  define("ethics.protocol.submitted", catalogText("contracts.54.ethics.protocol.submitted.1"), {
    subject: by("ethics-protocol", "protocolId"), required: ["protocolId", "rootProtocolId", "caseId"],
    correlation: (payload) => `ethics-protocol:${payload?.rootProtocolId || payload?.protocolId || ""}`,
    references: related(["ethics-case", "caseId"]),
  }),
  define("ethics.review.completed", catalogText("contracts.55.ethics.review.completed.1"), {
    subject: by("ethics-review", "reviewId"), required: ["protocolId", "rootProtocolId", "reviewId", "outcome"],
    correlation: (payload) => `ethics-protocol:${payload?.rootProtocolId || payload?.protocolId || ""}`,
    causedBy: ["ethics.protocol.submitted", "ethics.protocol.amended"],
    references: related(["ethics-protocol", "protocolId"], ["ethics-case", "caseId"], ["ethics-reviewer", "reviewerIds"]),
  }),
  define("ethics.protocol.amended", catalogText("contracts.56.ethics.protocol.amended.1"), {
    subject: by("ethics-protocol", "protocolId"), required: ["protocolId", "rootProtocolId", "caseId", "revisionOf"],
    correlation: (payload) => `ethics-protocol:${payload?.rootProtocolId || payload?.protocolId || ""}`,
    causedBy: ["ethics.review.completed"],
    references: related(["ethics-protocol", "revisionOf"], ["ethics-case", "caseId"]),
  }),
  define("ethics.protocol.withdrawn", catalogText("contracts.57.ethics.protocol.withdrawn.1"), {
    subject: by("ethics-protocol", "protocolId"), required: ["protocolId", "rootProtocolId", "caseId"],
    correlation: (payload) => `ethics-protocol:${payload?.rootProtocolId || payload?.protocolId || ""}`,
    causedBy: ["ethics.review.completed"],
    references: related(["ethics-case", "caseId"]),
  }),
  define("property.claim.submitted", catalogText("contracts.58.property.claim.submitted.1"), {
    subject: by("property-claim", "claimId"), required: ["claimId", "itemId", "requestedDisposition"],
    correlation: (payload) => `property-claim:${payload?.claimId || ""}`,
    references: related(["property-item", "itemId"], ["property-disposition", "requestedDisposition"]),
  }),
  define("property.ruling.issued", catalogText("contracts.59.property.ruling.issued.1"), {
    subject: by("property-claim", "claimId"), required: ["claimId", "itemId", "disposition", "rulingNumber"],
    correlation: (payload) => `property-claim:${payload?.claimId || ""}`,
    causedBy: ["property.claim.submitted"],
    references: related(["property-item", "itemId"], ["property-disposition", "disposition"]),
  }),
  define("post.message.acknowledged", catalogText("contracts.60.post.message.acknowledged.1"), {
    subject: by("post-message", "messageId"), required: ["messageId", "version"],
    references: related(["post-version", "version"]),
  }),
  define("post.correction.requested", catalogText("contracts.61.post.correction.requested.1"), {
    subject: by("post-message", "messageId"), required: ["messageId"],
  }),
  define("post.notice.dispatched", catalogText("contracts.62.post.notice.dispatched.1"), {
    subject: by("post-dispatch", "dispatchId"), required: ["dispatchId", "channelId", "visibility"],
    references: related(["post-channel", "channelId"]),
  }),
  define("calendar.event.saved", catalogText("contracts.63.calendar.event.saved.1"), {
    subject: by("calendar-event", "eventId"), required: ["eventId"],
    correlation: (payload) => `calendar-event:${payload?.eventId || ""}`,
  }),
  define("calendar.event.removed", catalogText("contracts.64.calendar.event.removed.1"), {
    subject: by("calendar-event", "eventId"), required: ["eventId"],
    correlation: (payload) => `calendar-event:${payload?.eventId || ""}`,
    causedBy: ["calendar.event.saved"],
  }),
  define("fieldwork.application.submitted", catalogText("contracts.65.fieldwork.application.submitted.1"), {
    subject: by("fieldwork-placement", "placementId"), required: ["placementId", "stationId", "outcome"],
    correlation: (payload) => `fieldwork-placement:${payload?.placementId || ""}`,
    references: related(["fieldwork-station", "stationId"]),
  }),
  define("fieldwork.departure.checked", catalogText("contracts.66.fieldwork.departure.checked.1"), {
    subject: by("fieldwork-placement", "placementId"), required: ["placementId", "stationId", "travelMode"],
    correlation: (payload) => `fieldwork-placement:${payload?.placementId || ""}`,
    causedBy: ["fieldwork.application.submitted"],
    references: related(["fieldwork-station", "stationId"], ["fieldwork-travel-mode", "travelMode"]),
  }),
  define("fieldwork.complication.handled", catalogText("contracts.67.fieldwork.complication.handled.1"), {
    subject: by("fieldwork-placement", "placementId"), required: ["placementId", "stationId", "complicationId", "responseId"],
    correlation: (payload) => `fieldwork-placement:${payload?.placementId || ""}`,
    causedBy: ["fieldwork.departure.checked"],
    references: related(["fieldwork-station", "stationId"], ["fieldwork-complication", "complicationId"], ["fieldwork-response", "responseId"]),
  }),
  define("fieldwork.observation.logged", catalogText("contracts.68.fieldwork.observation.logged.1"), {
    subject: by("fieldwork-placement", "placementId"), required: ["placementId", "stationId", "sourceKind", "incidentKind"],
    correlation: (payload) => `fieldwork-placement:${payload?.placementId || ""}`,
    causedBy: ["fieldwork.complication.handled"],
    references: related(["fieldwork-station", "stationId"], ["fieldwork-source-kind", "sourceKind"], ["fieldwork-incident-kind", "incidentKind"]),
  }),
  define("fieldwork.return.certified", catalogText("contracts.69.fieldwork.return.certified.1"), {
    subject: by("fieldwork-placement", "placementId"), required: ["placementId", "stationId", "stampId", "standing"],
    correlation: (payload) => `fieldwork-placement:${payload?.placementId || ""}`,
    causedBy: ["fieldwork.observation.logged"],
    references: related(["fieldwork-station", "stationId"], ["fieldwork-passport-stamp", "stampId"]),
  }),
  define("graduation.audit.requested", catalogText("contracts.70.graduation.audit.requested.1"), {
    subject: by("graduation-audit", "auditId"), required: ["auditId", "schoolId", "outcome"],
    correlation: (payload) => `graduation-audit:${payload?.auditId || ""}`,
    references: related(["school", "schoolId"], ["graduation-outcome", "outcome"]),
  }),
  define("graduation.degree.issued", catalogText("contracts.71.graduation.degree.issued.1"), {
    subject: by("graduation-degree", "degreeId"), required: ["degreeId", "auditId", "schoolId", "standing"],
    correlation: (payload) => `graduation-audit:${payload?.auditId || ""}`,
    causedBy: ["graduation.audit.requested"],
    references: related(["graduation-audit", "auditId"], ["school", "schoolId"]),
  }),
  define("career.plan.submitted", catalogText("contracts.72.career.plan.submitted.1"), {
    subject: by("career-plan", "planId"), required: ["planId", "schoolId", "openingIds"],
    correlation: (payload) => `career-plan:${payload?.planId || ""}`,
    references: related(["school", "schoolId"], ["career-opening", "openingIds"]),
  }),
  define("career.referral.sent", catalogText("contracts.73.career.referral.sent.1"), {
    subject: by("career-referral", "referralId"), required: ["referralId", "planId", "openingId"],
    correlation: (payload) => `career-plan:${payload?.planId || ""}`,
    causedBy: ["career.plan.submitted"],
    references: related(["career-plan", "planId"], ["career-opening", "openingId"]),
  }),
  define("employment.application.submitted", catalogText("contracts.74.employment.application.submitted.1"), {
    subject: by("employment-application", "applicationId"), required: ["applicationId", "jobId", "decisionId"],
    correlation: (payload) => `employment-application:${payload?.applicationId || ""}`,
    references: related(["employment-job", "jobId"], ["employment-decision", "decisionId"]),
  }),
  define("employment.application.responded", catalogText("contracts.75.employment.application.responded.1"), {
    subject: by("employment-application", "applicationId"), required: ["applicationId", "jobId", "response"],
    correlation: (payload) => `employment-application:${payload?.applicationId || ""}`,
    causedBy: ["employment.application.submitted"],
    references: related(["employment-job", "jobId"], ["employment-response", "response"]),
  }),
  define("employment.outcome.attested", catalogText("contracts.76.employment.outcome.attested.1"), {
    subject: by("employment-attestation", "attestationId"), required: ["attestationId", "outcomeId", "simultaneous"],
    correlation: (payload) => `employment-attestation:${payload?.attestationId || ""}`,
    references: related(["employment-outcome", "outcomeId"]),
  }),
  define("alumni.profile.activated", catalogText("contracts.77.alumni.profile.activated.1"), {
    subject: by("alumni-profile", "alumniId"), required: ["alumniId", "degreeId", "chapterId"],
    correlation: (payload) => `graduation-degree:${payload?.degreeId || ""}`,
    causedBy: ["graduation.degree.issued"],
    references: related(["graduation-degree", "degreeId"], ["alumni-chapter", "chapterId"]),
  }),
  define("alumni.reunion.rsvp", catalogText("contracts.78.alumni.reunion.rsvp.1"), {
    subject: by("alumni-profile", "alumniId"), required: ["alumniId", "chapterId", "attending"],
    correlation: (payload) => `alumni-profile:${payload?.alumniId || ""}`,
    causedBy: ["alumni.profile.activated"],
    references: related(["alumni-chapter", "chapterId"]),
  }),
  define("alumni.mentorship.offered", catalogText("contracts.79.alumni.mentorship.offered.1"), {
    subject: by("alumni-profile", "alumniId"), required: ["alumniId", "chapterId", "topicIds"],
    correlation: (payload) => `alumni-profile:${payload?.alumniId || ""}`,
    causedBy: ["alumni.profile.activated"],
    references: related(["alumni-chapter", "chapterId"], ["career-domain", "topicIds"]),
  }),
];

export const campusEventContracts = Object.freeze(
  Object.fromEntries(contracts.map((contract) => [contract.type, Object.freeze(contract)])),
);

function referenceKey(value) {
  return value?.kind && value?.id ? `${value.kind}:${value.id}` : "";
}

function uniqueReferences(values) {
  const found = new Map();
  values.filter(Boolean).forEach((value) => found.set(referenceKey(value), value));
  found.delete("");
  return [...found.values()];
}

function relationshipSet(event) {
  return new Set([
    referenceKey(event?.subject),
    ...(event?.relations || []).map((relation) => referenceKey(relation.target)),
  ].filter(Boolean));
}

function sharesReference(left, right) {
  const leftReferences = relationshipSet(left);
  return [...relationshipSet(right)].some((value) => leftReferences.has(value));
}

export function campusEventContract(type) {
  return campusEventContracts[type] || null;
}

export function campusEventLabel(type, locale = "zh-Hant") {
  const contract = campusEventContract(type);
  return contract?.label?.[locale] || contract?.label?.["zh-Hant"] || type;
}

export function describeCampusEvent(type, payload = {}, options = {}) {
  const contract = campusEventContract(type);
  if (!contract) throw new RangeError(`Unknown campus event type: ${type}`);
  const subject = options.subject || contract.subject?.(payload) || null;
  const correlationId = options.correlationId || contract.correlation?.(payload) || referenceKey(subject) || null;
  const references = uniqueReferences([
    ...(contract.references?.(payload) || []),
    ...(options.references || []),
  ]).filter((value) => referenceKey(value) !== referenceKey(subject));
  return {
    subject,
    correlationId,
    relations: references.map((target) => ({ kind: "references", target })),
  };
}

export function findCampusEventCause(type, description, history = []) {
  const contract = campusEventContract(type);
  if (!contract?.causedBy?.length) return null;
  const probe = { subject: description.subject, relations: description.relations };
  return history
    .slice()
    .reverse()
    .find((candidate) => (
      contract.causedBy.includes(candidate.type)
      && (
        (description.correlationId && candidate.correlationId === description.correlationId)
        || sharesReference(probe, candidate)
      )
    )) || null;
}

export function createCampusEventEnvelope({
  id,
  type,
  actor = "student-local",
  timestamp = new Date().toISOString(),
  payload = {},
  causationId = null,
  ...options
}, history = []) {
  const contract = campusEventContract(type);
  if (!contract) throw new RangeError(`Unknown campus event type: ${type}`);
  const description = describeCampusEvent(type, payload, options);
  const cause = causationId ? null : findCampusEventCause(type, description, history);
  return {
    schema: 2,
    eventVersion: contract.version,
    id,
    type,
    actor,
    timestamp,
    subject: description.subject,
    correlationId: description.correlationId,
    causationId: causationId || cause?.id || null,
    relations: description.relations,
    payload,
  };
}

export function upgradeCampusEvent(record, history = []) {
  if (!record || typeof record !== "object" || !campusEventContract(record.type)) return record;
  return createCampusEventEnvelope({
    ...record,
    id: record.id,
    actor: record.actor || "student-local",
    causationId: record.causationId || null,
  }, history);
}

export function validateCampusEvent(event, history = []) {
  const errors = [];
  const contract = campusEventContract(event?.type);
  if (!contract) return [`Unknown campus event type: ${event?.type || "(missing)"}`];
  if (event.schema !== 2) errors.push(`${event.type}: expected schema 2`);
  if (event.eventVersion !== contract.version) errors.push(`${event.type}: unexpected event version`);
  if (!event.id) errors.push(`${event.type}: missing id`);
  if (!event.actor) errors.push(`${event.type}: missing actor`);
  if (Number.isNaN(new Date(event.timestamp).getTime())) errors.push(`${event.type}: invalid timestamp`);
  if (!event.subject?.kind || !event.subject?.id) errors.push(`${event.type}: missing subject reference`);
  if (!event.correlationId) errors.push(`${event.type}: missing correlation id`);
  for (const key of contract.required) {
    if (event.payload?.[key] === undefined || event.payload?.[key] === null || event.payload?.[key] === "") {
      errors.push(`${event.type}: payload.${key} is required`);
    }
  }
  if (event.causationId) {
    const cause = history.find((candidate) => candidate.id === event.causationId);
    if (!cause) errors.push(`${event.type}: causation event ${event.causationId} was not found earlier`);
    else if (!contract.causedBy.includes(cause.type)) {
      errors.push(`${event.type}: ${cause.type} is not an allowed cause`);
    }
  }
  return errors;
}

export function validateCampusEventContract(contract) {
  const errors = [];
  if (!contract?.type) errors.push("event contract is missing type");
  if (!Number.isInteger(contract?.version) || contract.version < 1) errors.push(`${contract?.type}: invalid version`);
  for (const locale of locales) {
    if (!contract?.label?.[locale]) errors.push(`${contract?.type}: missing ${locale} label`);
  }
  if (typeof contract?.subject !== "function") errors.push(`${contract?.type}: missing subject resolver`);
  if (typeof contract?.correlation !== "function") errors.push(`${contract?.type}: missing correlation resolver`);
  return errors;
}
