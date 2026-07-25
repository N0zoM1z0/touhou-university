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
  return Array.isArray(records) ? records : [];
}

export function recordCampusEvent(type, payload = {}, options = {}) {
  if (!type) return null;
  const records = campusLedger();
  const entity = options.entityId || payload.id || payload.reference || "";
  const id = options.id || `${type}:${entity || Date.now().toString(36)}`;
  const existing = records.find((record) => record.id === id);
  if (existing) return existing;
  const identity = readJson(IDENTITY_KEY, null);
  const event = {
    schema: 1,
    id,
    type,
    actor: identity?.id || "student-local",
    timestamp: validDate(options.timestamp),
    payload,
  };
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
      },
    });
  }
  return events;
}

export function syncCampusLedger() {
  const records = campusLedger();
  const ids = new Set(records.map((record) => record.id));
  let changed = false;
  for (const event of legacyEvents()) {
    if (!event.id || ids.has(event.id)) continue;
    records.push({
      schema: 1,
      actor: "student-local",
      ...event,
      timestamp: validDate(event.timestamp),
    });
    ids.add(event.id);
    changed = true;
  }
  if (!changed) return records;
  records.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  window.localStorage.setItem(LEDGER_KEY, JSON.stringify(records.slice(-MAX_EVENTS)));
  window.dispatchEvent(new CustomEvent("tu:ledgerchange", { detail: { type: "ledger.synced" } }));
  return records;
}
