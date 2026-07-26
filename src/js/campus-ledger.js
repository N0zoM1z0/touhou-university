import {
  campusEventContract,
  createCampusEventEnvelope,
  upgradeCampusEvent,
  validateCampusEvent,
} from "../data/event-contracts.js";

const LEDGER_KEY = "tu:campus:ledger";
const IDENTITY_KEY = "tu:identity";
const MAX_EVENTS = 500;

function readJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function validDate(value, fallback = new Date().toISOString()) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

export function campusLedger() {
  const records = readJson(LEDGER_KEY, []);
  if (!Array.isArray(records)) return [];
  return records
    .slice()
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .reduce((history, record) => {
      history.push(upgradeCampusEvent(record, history));
      return history;
    }, []);
}

export function recordCampusEvent(type, payload = {}, options = {}) {
  if (!type) return null;
  if (!campusEventContract(type)) {
    console.error(`Unregistered campus event type: ${type}`);
    return null;
  }
  const records = campusLedger();
  const entity = options.entityId || payload.id || payload.reference || "";
  const id = options.id || `${type}:${entity || Date.now().toString(36)}`;
  const existing = records.find((record) => record.id === id);
  if (existing) return existing;
  const identity = readJson(IDENTITY_KEY, null);
  const event = createCampusEventEnvelope({
    id,
    type,
    actor: identity?.id || "student-local",
    timestamp: validDate(options.timestamp),
    payload,
    causationId: options.causationId || null,
    correlationId: options.correlationId || null,
    subject: options.subject || null,
    references: options.references || [],
  }, records);
  const errors = validateCampusEvent(event, records);
  if (errors.length) {
    console.error(`Invalid campus event:\n${errors.join("\n")}`);
    return null;
  }
  records.push(event);
  records.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  window.localStorage.setItem(LEDGER_KEY, JSON.stringify(records.slice(-MAX_EVENTS)));
  window.dispatchEvent(new CustomEvent("tu:ledgerchange", { detail: event }));
  return event;
}

function legacyEvents() {
  const applications = readJson("tu:application:submissions", []);
  const reviews = readJson("tu:application:reviews", []);
  const visits = readJson("tu:visits", []);
  const entranceExams = readJson("tu:exam:history", []);
  const unifiedExams = readJson("tu:gaokao:attempts", []);
  const posts = readJson("tu:bbs:posts", []);
  const registration = readJson("tu:courses:registration", null);
  const libraryLoans = readJson("tu:library:loans", []);
  const libraryHolds = readJson("tu:library:holds", []);
  const housingApplications = readJson("tu:housing:applications", []);
  const housingAssignments = readJson("tu:housing:assignments", []);
  const housingChanges = readJson("tu:housing:room-changes", []);
  const incidentExperiments = readJson("tu:incidents:experiments", []);
  const incidentResolutions = readJson("tu:incidents:resolutions", []);
  const governanceVotes = readJson("tu:governance:votes", []);
  const academicSubmissions = readJson("tu:academics:submissions", []);
  const academicExamAttempts = readJson("tu:academics:exam-attempts", []);
  const academicProjects = readJson("tu:academics:projects", []);
  const academicDefences = readJson("tu:academics:defences", []);
  const clinicVisits = readJson("tu:clinic:visits", []);
  const clinicPrescriptions = readJson("tu:clinic:prescriptions", []);
  const clinicPlans = readJson("tu:clinic:care-plans", []);
  const appraisalRecords = readJson("tu:appraisal:records", []);
  const spellcardDesigns = readJson("tu:spellcards:designs", []);
  const spellcardDefences = readJson("tu:spellcards:defences", []);
  const ethicsProtocols = readJson("tu:ethics:protocols", []);
  const ethicsReviews = readJson("tu:ethics:reviews", []);
  const festivalPlans = readJson("tu:festival:plans", []);
  const festivalOperations = readJson("tu:festival:operations", []);
  const fieldworkPlacements = readJson("tu:fieldwork:placements", []);
  const identity = readJson(IDENTITY_KEY, null);
  const events = [];

  if (identity?.id) {
    events.push({
      id: `identity.created:${identity.id}`,
      type: "identity.created",
      timestamp: identity.createdAt,
      payload: { identityId: identity.id, preferredSchool: identity.preferredSchool },
    });
  }
  for (const record of Array.isArray(applications) ? applications : []) {
    events.push({
      id: `application.submitted:${record.id}`,
      type: "application.submitted",
      timestamp: record.submittedAt,
      payload: { applicationId: record.id, school: record.school },
    });
  }
  for (const review of Array.isArray(reviews) ? reviews : []) {
    events.push({
      id: `application.reviewed:${review.applicationId}`,
      type: "application.reviewed",
      timestamp: review.reviewedAt,
      payload: {
        applicationId: review.applicationId,
        reviewId: review.id,
        outcome: review.outcome,
        school: review.school,
      },
    });
  }
  for (const record of Array.isArray(visits) ? visits : []) {
    events.push({
      id: `visit.reserved:${record.id}`,
      type: "visit.reserved",
      timestamp: record.submittedAt,
      payload: { visitId: record.id, route: record.route, date: record.date },
    });
  }
  for (const record of Array.isArray(entranceExams) ? entranceExams : []) {
    const entityId = record.id || record.completedAt;
    events.push({
      id: `exam.completed:${entityId}`,
      type: "exam.completed",
      timestamp: record.completedAt,
      payload: { examId: entityId, bankId: record.bankId, percent: record.percent },
    });
  }
  for (const record of Array.isArray(unifiedExams) ? unifiedExams : []) {
    const entityId = record.id || record.completedAt;
    events.push({
      id: `gaokao.completed:${entityId}`,
      type: "gaokao.completed",
      timestamp: record.completedAt,
      payload: {
        examId: entityId,
        difficultyId: record.difficultyId || "normal",
        trackId: record.trackId,
        score: record.score,
        total: record.total || 150,
      },
    });
  }
  for (const post of Array.isArray(posts) ? posts : []) {
    events.push({
      id: `bbs.posted:${post.id}`,
      type: "bbs.posted",
      timestamp: post.createdAt,
      payload: { postId: post.id, category: post.category, title: post.title },
    });
  }
  for (const entry of Array.isArray(registration) ? registration : Array.isArray(registration?.entries) ? registration.entries : []) {
    if (!entry?.courseCode || !entry?.createdAt) continue;
    const type = entry.status === "waitlisted" ? "course.waitlisted" : "course.enrolled";
    events.push({
      id: `${type}:2026-autumn:${entry.courseCode}`,
      type,
      timestamp: entry.createdAt,
      payload: {
        courseCode: entry.courseCode,
        term: registration?.term || "2026-autumn",
        position: entry.position,
      },
    });
  }
  for (const loan of Array.isArray(libraryLoans) ? libraryLoans : []) {
    if (!loan?.id || !loan?.holdingId || !loan?.borrowedAt) continue;
    events.push({
      id: `book.borrowed:${loan.id}`,
      type: "book.borrowed",
      timestamp: loan.borrowedAt,
      payload: { loanId: loan.id, holdingId: loan.holdingId, dueAt: loan.dueAt },
    });
    if (loan.renewedAt && loan.renewals) {
      events.push({
        id: `book.renewed:${loan.id}:${loan.renewals}`,
        type: "book.renewed",
        timestamp: loan.renewedAt,
        payload: { loanId: loan.id, holdingId: loan.holdingId, dueAt: loan.dueAt, renewals: loan.renewals },
      });
    }
    if (loan.status === "returned" && loan.returnedAt) {
      events.push({
        id: `book.returned:${loan.id}`,
        type: "book.returned",
        timestamp: loan.returnedAt,
        payload: { loanId: loan.id, holdingId: loan.holdingId },
      });
    }
  }
  for (const hold of Array.isArray(libraryHolds) ? libraryHolds : []) {
    if (!hold?.id || !hold?.holdingId || !hold?.placedAt) continue;
    events.push({
      id: `book.held:${hold.id}`,
      type: "book.held",
      timestamp: hold.placedAt,
      payload: { holdId: hold.id, holdingId: hold.holdingId, position: hold.position || 1 },
    });
    if (hold.status === "cancelled" && hold.cancelledAt) {
      events.push({
        id: `book.hold.cancelled:${hold.id}`,
        type: "book.hold.cancelled",
        timestamp: hold.cancelledAt,
        payload: { holdId: hold.id, holdingId: hold.holdingId },
      });
    }
  }
  for (const application of Array.isArray(housingApplications) ? housingApplications : []) {
    if (!application?.id || !application?.submittedAt) continue;
    events.push({
      id: `housing.application.submitted:${application.id}`,
      type: "housing.application.submitted",
      timestamp: application.submittedAt,
      payload: {
        applicationId: application.id,
        firstResidence: application.preferences?.firstResidence,
        term: application.term,
      },
    });
    for (const offerId of application.declinedOfferIds || []) {
      events.push({
        id: `housing.offer.declined:${application.id}:${offerId}`,
        type: "housing.offer.declined",
        timestamp: application.updatedAt,
        payload: { applicationId: application.id, offerId },
      });
    }
  }
  for (const assignment of Array.isArray(housingAssignments) ? housingAssignments : []) {
    if (!assignment?.id || !assignment?.acceptedAt) continue;
    events.push({
      id: `housing.assignment.accepted:${assignment.id}`,
      type: "housing.assignment.accepted",
      timestamp: assignment.acceptedAt,
      payload: {
        assignmentId: assignment.id,
        applicationId: assignment.applicationId,
        offerId: assignment.offerId,
        roomId: assignment.roomId,
        residenceId: assignment.residenceId,
      },
    });
  }
  for (const request of Array.isArray(housingChanges) ? housingChanges : []) {
    if (!request?.id || !request?.submittedAt) continue;
    events.push({
      id: `housing.change.requested:${request.id}`,
      type: "housing.change.requested",
      timestamp: request.submittedAt,
      payload: { requestId: request.id, assignmentId: request.assignmentId, reason: request.reason },
    });
    if (request.status === "cancelled" && request.cancelledAt) {
      events.push({
        id: `housing.change.cancelled:${request.id}`,
        type: "housing.change.cancelled",
        timestamp: request.cancelledAt,
        payload: { requestId: request.id, assignmentId: request.assignmentId },
      });
    }
  }
  for (const experiment of Array.isArray(incidentExperiments) ? incidentExperiments : []) {
    if (!experiment?.id || !experiment?.createdAt) continue;
    events.push({
      id: `incident.experiment.completed:${experiment.id}`,
      type: "incident.experiment.completed",
      timestamp: experiment.createdAt,
      payload: {
        experimentId: experiment.id,
        caseId: experiment.caseId,
        hypothesisId: experiment.hypothesisId,
        quality: experiment.quality,
        verdict: experiment.verdict,
      },
    });
  }
  for (const resolution of Array.isArray(incidentResolutions) ? incidentResolutions : []) {
    if (!resolution?.id || !resolution?.resolvedAt) continue;
    events.push({
      id: `incident.resolved:${resolution.id}`,
      type: "incident.resolved",
      timestamp: resolution.resolvedAt,
      payload: {
        resolutionId: resolution.id,
        caseId: resolution.caseId,
        quality: resolution.quality,
        disposition: resolution.disposition || "established",
        reviewerId: resolution.reviewerId || null,
        retentionReason: resolution.retentionReason || null,
      },
    });
  }
  for (const vote of Array.isArray(governanceVotes) ? governanceVotes : []) {
    if (!vote?.id || !vote?.castAt) continue;
    events.push({
      id: `governance.vote.cast:${vote.proposalId}`,
      type: "governance.vote.cast",
      timestamp: vote.castAt,
      payload: { proposalId: vote.proposalId, choiceId: vote.choiceId, voteId: vote.id },
    });
  }
  for (const submission of Array.isArray(academicSubmissions) ? academicSubmissions : []) {
    if (!submission?.id || !submission?.submittedAt) continue;
    events.push({
      id: `academic.assignment.graded:${submission.id}`,
      type: "academic.assignment.graded",
      timestamp: submission.submittedAt,
      payload: {
        assignmentId: submission.assignmentId,
        submissionId: submission.id,
        courseCode: submission.courseCode,
        percent: submission.percent,
      },
    });
  }
  for (const attempt of Array.isArray(academicExamAttempts) ? academicExamAttempts : []) {
    if (!attempt?.id || !attempt?.completedAt) continue;
    events.push({
      id: `academic.exam.completed:${attempt.id}`,
      type: "academic.exam.completed",
      timestamp: attempt.completedAt,
      payload: {
        examId: attempt.examId,
        attemptId: attempt.id,
        percent: attempt.percent,
        timedOut: Boolean(attempt.timedOut),
      },
    });
  }
  for (const project of Array.isArray(academicProjects) ? academicProjects : []) {
    if (!project?.id || !project?.submittedAt) continue;
    events.push({
      id: `academic.project.submitted:${project.id}`,
      type: "academic.project.submitted",
      timestamp: project.submittedAt,
      payload: { projectId: project.id, projectType: project.type },
    });
  }
  for (const defence of Array.isArray(academicDefences) ? academicDefences : []) {
    if (!defence?.id || !defence?.completedAt) continue;
    events.push({
      id: `academic.defence.completed:${defence.id}`,
      type: "academic.defence.completed",
      timestamp: defence.completedAt,
      payload: {
        projectId: defence.projectId,
        defenceId: defence.id,
        outcome: defence.outcome,
        percent: defence.percent,
      },
    });
  }
  for (const visit of Array.isArray(clinicVisits) ? clinicVisits : []) {
    if (!visit?.id || !visit?.checkedInAt) continue;
    events.push({
      id: `clinic.visit.checked-in:${visit.id}`,
      type: "clinic.visit.checked-in",
      timestamp: visit.checkedInAt,
      payload: {
        visitId: visit.id,
        siteId: visit.siteId,
        band: visit.band,
        waitMinutes: visit.waitMinutes,
      },
    });
    if (visit.consultedAt) {
      const prescription = (Array.isArray(clinicPrescriptions) ? clinicPrescriptions : [])
        .find((record) => record.visitId === visit.id);
      events.push({
        id: `clinic.consultation.completed:${visit.id}`,
        type: "clinic.consultation.completed",
        timestamp: visit.consultedAt,
        payload: {
          visitId: visit.id,
          prescriptionId: prescription?.id || null,
          siteId: visit.siteId,
        },
      });
    }
  }
  for (const prescription of Array.isArray(clinicPrescriptions) ? clinicPrescriptions : []) {
    if (!prescription?.id) continue;
    if (prescription.dispensedAt) {
      events.push({
        id: `clinic.prescription.dispensed:${prescription.id}`,
        type: "clinic.prescription.dispensed",
        timestamp: prescription.dispensedAt,
        payload: {
          prescriptionId: prescription.id,
          visitId: prescription.visitId,
          medicineIds: prescription.medicineIds || [],
        },
      });
    }
    for (const dose of Array.isArray(prescription.doseLog) ? prescription.doseLog : []) {
      if (!dose?.id || !dose?.recordedAt) continue;
      events.push({
        id: `clinic.dose.recorded:${dose.id}`,
        type: "clinic.dose.recorded",
        timestamp: dose.recordedAt,
        payload: {
          doseId: dose.id,
          prescriptionId: prescription.id,
          visitId: prescription.visitId,
          medicineId: dose.medicineId,
          sequence: dose.sequence,
        },
      });
    }
  }
  for (const plan of Array.isArray(clinicPlans) ? clinicPlans : []) {
    if (!plan?.id || !plan?.startedAt) continue;
    events.push({
      id: `clinic.therapy.started:${plan.id}`,
      type: "clinic.therapy.started",
      timestamp: plan.startedAt,
      payload: { planId: plan.id, therapyId: plan.therapyId, visitId: plan.visitId },
    });
    for (const step of Array.isArray(plan.completedSteps) ? plan.completedSteps : []) {
      if (plan.status === "completed" && step === Math.max(...plan.completedSteps)) continue;
      events.push({
        id: `clinic.therapy.step.completed:${plan.id}:${step}`,
        type: "clinic.therapy.step.completed",
        timestamp: plan.updatedAt || plan.completedAt || plan.startedAt,
        payload: { planId: plan.id, therapyId: plan.therapyId, visitId: plan.visitId, step },
      });
    }
    if (plan.completedAt) {
      events.push({
        id: `clinic.therapy.completed:${plan.id}`,
        type: "clinic.therapy.completed",
        timestamp: plan.completedAt,
        payload: { planId: plan.id, therapyId: plan.therapyId, visitId: plan.visitId },
      });
    }
  }
  for (const record of Array.isArray(appraisalRecords) ? appraisalRecords : []) {
    if (!record?.id || !record?.createdAt || !record?.objectId) continue;
    events.push({
      id: `appraisal.completed:${record.id}`,
      type: "appraisal.completed",
      timestamp: record.createdAt,
      payload: {
        appraisalId: record.id,
        objectId: record.objectId,
        verdict: record.verdict,
        disposition: record.disposition || "ordinary",
        destinationId: record.destinationId,
      },
    });
    if (record.destinationId === "library") {
      events.push({
        id: `appraisal.catalogued:${record.id}`,
        type: "appraisal.catalogued",
        timestamp: record.createdAt,
        payload: { appraisalId: record.id, objectId: record.objectId, destinationId: record.destinationId },
      });
    }
  }
  for (const design of Array.isArray(spellcardDesigns) ? spellcardDesigns : []) {
    if (!design?.id || !design?.createdAt) continue;
    events.push({
      id: `spellcard.design.saved:${design.id}`,
      type: "spellcard.design.saved",
      timestamp: design.createdAt,
      payload: {
        designId: design.id,
        spellName: design.draft?.spellName,
        patternId: design.draft?.patternId,
        revisionOf: design.revisionOf,
      },
    });
  }
  for (const defence of Array.isArray(spellcardDefences) ? spellcardDefences : []) {
    if (!defence?.id || !defence?.designId || !defence?.createdAt) continue;
    const design = (Array.isArray(spellcardDesigns) ? spellcardDesigns : [])
      .find((candidate) => candidate?.id === defence.designId);
    events.push({
      id: `spellcard.defence.completed:${defence.id}`,
      type: "spellcard.defence.completed",
      timestamp: defence.createdAt,
      payload: {
        defenceId: defence.id,
        designId: defence.designId,
        spellName: design?.draft?.spellName,
        ruling: defence.ruling,
      },
    });
  }
  for (const protocol of Array.isArray(ethicsProtocols) ? ethicsProtocols : []) {
    if (!protocol?.id || !protocol?.createdAt || !protocol?.draft?.caseId) continue;
    const type = protocol.revisionOf ? "ethics.protocol.amended" : "ethics.protocol.submitted";
    events.push({
      id: `${type}:${protocol.id}`,
      type,
      timestamp: protocol.createdAt,
      payload: {
        protocolId: protocol.id,
        rootProtocolId: protocol.rootProtocolId || protocol.id,
        caseId: protocol.draft.caseId,
        revisionOf: protocol.revisionOf || null,
        outcome: protocol.outcome,
      },
    });
    if (protocol.status === "withdrawn" && protocol.withdrawnAt) {
      events.push({
        id: `ethics.protocol.withdrawn:${protocol.id}`,
        type: "ethics.protocol.withdrawn",
        timestamp: protocol.withdrawnAt,
        payload: {
          protocolId: protocol.id,
          rootProtocolId: protocol.rootProtocolId || protocol.id,
          caseId: protocol.draft.caseId,
          reason: protocol.withdrawalReason,
        },
      });
    }
  }
  for (const review of Array.isArray(ethicsReviews) ? ethicsReviews : []) {
    if (!review?.id || !review?.protocolId || !review?.createdAt) continue;
    const protocol = (Array.isArray(ethicsProtocols) ? ethicsProtocols : [])
      .find((candidate) => candidate?.id === review.protocolId);
    events.push({
      id: `ethics.review.completed:${review.id}`,
      type: "ethics.review.completed",
      timestamp: review.createdAt,
      payload: {
        protocolId: review.protocolId,
        rootProtocolId: review.rootProtocolId || protocol?.rootProtocolId || review.protocolId,
        reviewId: review.id,
        caseId: protocol?.draft?.caseId,
        outcome: review.outcome,
        reviewerIds: (review.opinions || []).map(({ reviewerId }) => reviewerId),
      },
    });
  }
  for (const plan of Array.isArray(festivalPlans) ? festivalPlans : []) {
    if (!plan?.id || !plan?.createdAt || !plan?.draft?.kindId) continue;
    const payload = {
      planId: plan.id,
      kindId: plan.draft.kindId,
      outcome: plan.outcome,
      startsAt: plan.draft.startsAt,
    };
    events.push({
      id: `festival.plan.submitted:${plan.id}`,
      type: "festival.plan.submitted",
      timestamp: plan.createdAt,
      payload,
    });
    events.push({
      id: `festival.permit.issued:${plan.id}`,
      type: "festival.permit.issued",
      timestamp: new Date(new Date(plan.createdAt).getTime() + 1).toISOString(),
      payload: {
        ...payload,
        deskIds: (plan.opinions || []).map(({ deskId }) => deskId),
      },
    });
  }
  for (const operation of Array.isArray(festivalOperations) ? festivalOperations : []) {
    if (!operation?.id || !operation?.planId || !operation?.openedAt) continue;
    const plan = (Array.isArray(festivalPlans) ? festivalPlans : [])
      .find((candidate) => candidate?.id === operation.planId);
    events.push({
      id: `festival.shift.started:${operation.id}`,
      type: "festival.shift.started",
      timestamp: operation.openedAt,
      payload: {
        operationId: operation.id,
        planId: operation.planId,
        role: operation.role,
        routeId: plan?.draft?.routeId,
      },
    });
    for (const response of Array.isArray(operation.responses) ? operation.responses : []) {
      if (!response?.incidentId || !response?.responseId || !response?.resolvedAt) continue;
      events.push({
        id: `festival.incident.resolved:${operation.id}:${response.incidentId}`,
        type: "festival.incident.resolved",
        timestamp: response.resolvedAt,
        payload: {
          operationId: operation.id,
          planId: operation.planId,
          incidentId: response.incidentId,
          responseId: response.responseId,
        },
      });
    }
    if (operation.status === "closed" && operation.closedAt && operation.report) {
      events.push({
        id: `festival.report.closed:${operation.id}`,
        type: "festival.report.closed",
        timestamp: operation.closedAt,
        payload: {
          operationId: operation.id,
          planId: operation.planId,
          attendance: operation.report.attendance,
          clinicArrivals: operation.report.clinicArrivals,
          disposition: operation.report.disputes ? "contested" : "closed",
        },
      });
    }
  }
  for (const placement of Array.isArray(fieldworkPlacements) ? fieldworkPlacements : []) {
    if (!placement?.id || !placement?.stationId || !placement?.createdAt) continue;
    const base = {
      placementId: placement.id,
      stationId: placement.stationId,
    };
    events.push({
      id: `fieldwork.application.submitted:${placement.id}`,
      type: "fieldwork.application.submitted",
      timestamp: placement.createdAt,
      payload: {
        ...base,
        outcome: placement.permit?.outcome || placement.status || "conditional",
        departureDate: placement.draft?.departureDate,
      },
    });
    if (placement.startedAt) {
      events.push({
        id: `fieldwork.departure.checked:${placement.id}`,
        type: "fieldwork.departure.checked",
        timestamp: placement.startedAt,
        payload: { ...base, travelMode: placement.draft?.travelMode || "foot" },
      });
    }
    if (placement.respondedAt && placement.complicationId && placement.responseId) {
      events.push({
        id: `fieldwork.complication.handled:${placement.id}`,
        type: "fieldwork.complication.handled",
        timestamp: placement.respondedAt,
        payload: {
          ...base,
          complicationId: placement.complicationId,
          responseId: placement.responseId,
          standing: placement.responseOutcome,
        },
      });
    }
    if (placement.log?.submittedAt) {
      events.push({
        id: `fieldwork.observation.logged:${placement.id}`,
        type: "fieldwork.observation.logged",
        timestamp: placement.log.submittedAt,
        payload: {
          ...base,
          sourceKind: placement.log.sourceKind,
          incidentKind: placement.log.incidentKind,
          researchChoice: placement.log.researchChoice,
        },
      });
    }
    if (placement.completedAt && placement.stampId) {
      events.push({
        id: `fieldwork.return.certified:${placement.id}`,
        type: "fieldwork.return.certified",
        timestamp: new Date(new Date(placement.completedAt).getTime() + 1).toISOString(),
        payload: {
          ...base,
          stampId: placement.stampId,
          standing: placement.review?.standing || "conditional",
          credits: placement.credits || 0,
        },
      });
    }
  }
  return events;
}

export function syncCampusLedger() {
  const stored = readJson(LEDGER_KEY, []);
  const records = Array.isArray(stored) ? stored.slice() : [];
  const ids = new Set(records.map((record) => record?.id).filter(Boolean));
  for (const event of legacyEvents()) {
    if (!event.id || ids.has(event.id)) continue;
    records.push({
      actor: "student-local",
      ...event,
      timestamp: validDate(event.timestamp),
    });
    ids.add(event.id);
  }
  records.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const normalized = records.reduce((history, record) => {
    history.push(upgradeCampusEvent(record, history));
    return history;
  }, []).slice(-MAX_EVENTS);
  const before = JSON.stringify(Array.isArray(stored) ? stored : []);
  const after = JSON.stringify(normalized);
  if (before !== after) {
    window.localStorage.setItem(LEDGER_KEY, after);
    window.dispatchEvent(new CustomEvent("tu:ledgerchange", { detail: { type: "ledger.synced" } }));
  }
  return normalized;
}
