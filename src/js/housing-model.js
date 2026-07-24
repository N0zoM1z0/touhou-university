import {
  housingRoom,
  housingRooms,
  residenceById,
  roommateById,
} from "../data/housing.js";

export const HOUSING_KEYS = {
  draft: "tu:housing:draft",
  applications: "tu:housing:applications",
  assignments: "tu:housing:assignments",
  changes: "tu:housing:room-changes",
  identity: "tu:identity",
};

const MAX_RECORDS = 40;

export function readHousingJson(key, fallback) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "null");
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeHousingJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("tu:housingchange", { detail: { key } }));
  return value;
}

function hashValue(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function reference(prefix, source) {
  return `${prefix}-${hashValue(source).toString(36).slice(0, 7).toUpperCase().padEnd(7, "0")}`;
}

export function housingIdentity() {
  return readHousingJson(HOUSING_KEYS.identity, null);
}

export function housingDraft() {
  return readHousingJson(HOUSING_KEYS.draft, null);
}

export function housingApplications() {
  const records = readHousingJson(HOUSING_KEYS.applications, []);
  return Array.isArray(records) ? records : [];
}

export function housingAssignments() {
  const records = readHousingJson(HOUSING_KEYS.assignments, []);
  return Array.isArray(records) ? records : [];
}

export function housingRoomChanges() {
  const records = readHousingJson(HOUSING_KEYS.changes, []);
  return Array.isArray(records) ? records : [];
}

export function activeHousingAssignment() {
  return housingAssignments().findLast((record) => record.status === "active") || null;
}

export function saveHousingDraft(preferences) {
  return writeHousingJson(HOUSING_KEYS.draft, {
    schema: 1,
    term: "2026-autumn",
    updatedAt: new Date().toISOString(),
    preferences,
  });
}

export function clearHousingDraft() {
  window.localStorage.removeItem(HOUSING_KEYS.draft);
  window.dispatchEvent(new CustomEvent("tu:housingchange", { detail: { key: HOUSING_KEYS.draft } }));
}

const preferenceWeights = {
  sleep: 13,
  noise: 12,
  cleanliness: 10,
  cooking: 6,
  moon: 12,
  water: 9,
  flight: 9,
  wall: 8,
  familiar: 7,
  danmaku: 8,
};

function fieldScore(field, student, roommate) {
  if (student === roommate) return preferenceWeights[field];
  if (field === "sleep" && (student === "shifting" || roommate === "shifting")) return 5;
  if (field === "moon" && student === "ordinary" && roommate === "active") return 5;
  if (field === "water" && student === "near" && roommate === "must") return 6;
  if (field === "flight" && student === "small" && roommate === "large") return 4;
  if (field === "familiar" && student === "small" && roommate === "large") return 3;
  if (field === "danmaku" && student === "outdoors" && roommate === "none") return 5;
  return 0;
}

function roomRequirement(preferences, room, positive, friction) {
  let score = 0;
  const has = (feature) => room.features.includes(feature);
  const add = (condition, points, yes, no) => {
    if (condition) {
      score += points;
      if (yes) positive.push(yes);
    } else if (no) {
      score -= points;
      friction.push(no);
    }
  };
  if (preferences.moon === "sensitive") add(has("moonShield"), 14, "moonProtected", "moonUnshielded");
  if (preferences.water === "must") add(has("waterAccess"), 13, "waterAccess", "waterMissing");
  else if (preferences.water === "near" && has("waterAccess")) {
    score += 6;
    positive.push("waterNearby");
  }
  if (preferences.flight === "large") add(has("wideFlight"), 12, "wingSpace", "wingTight");
  else if (preferences.flight === "small" && (has("wideFlight") || has("broomRack"))) {
    score += 5;
    positive.push("flightStorage");
  }
  if (preferences.wall === "phase") add(has("phaseMarked"), 10, "phaseSafe", "phaseUnmarked");
  if (preferences.familiar === "large") add(has("familiarBay"), 9, "familiarWelcome", "familiarCrowded");
  else if (preferences.familiar === "small" && has("familiarBay")) {
    score += 4;
    positive.push("familiarBay");
  }
  if (preferences.danmaku === "indoor") add(has("workshop"), 8, "blastDesk", "danmakuOutside");
  if (preferences.noise === "quiet" && has("quietWard")) {
    score += 6;
    positive.push("quietWard");
  }
  return score;
}

function roommateScore(preferences, candidate, positive, friction) {
  if (!candidate) {
    positive.push("singleRoom");
    return preferences.roomType === "single" ? 26 : 14;
  }
  let score = 0;
  for (const field of Object.keys(preferenceWeights)) {
    const points = fieldScore(field, preferences[field], candidate.habits[field]);
    score += points;
    if (points === preferenceWeights[field]) {
      if (["sleep", "noise", "cleanliness", "cooking"].includes(field)) positive.push(`${field}Match`);
    } else if (points === 0 && ["sleep", "noise", "cleanliness", "moon", "water", "flight", "wall", "familiar", "danmaku"].includes(field)) {
      friction.push(`${field}Conflict`);
    }
  }
  return score;
}

function buildOffer(preferences, room, applicationId) {
  const residence = residenceById(room.residence);
  const roommate = roommateById(room.roommate);
  const positive = [];
  const friction = [];
  let score = 38;
  const firstChoice = preferences.firstResidence === room.residence;
  const secondChoice = preferences.secondResidence === room.residence;
  if (firstChoice) {
    score += 18;
    positive.push("firstResidence");
  } else if (secondChoice) {
    score += 10;
    positive.push("secondResidence");
  }
  if (preferences.roomType === "any" || preferences.roomType === room.type) {
    score += 10;
    positive.push("roomType");
  } else {
    score -= 5;
    friction.push("roomTypeDifferent");
  }
  const budget = Number(preferences.budget) || 18000;
  if (room.fee <= budget) {
    score += Math.min(10, Math.round((budget - room.fee) / 1000) + 4);
    positive.push("withinBudget");
  } else {
    score -= Math.min(18, Math.ceil((room.fee - budget) / 700));
    friction.push("overBudget");
  }
  score += roomRequirement(preferences, room, positive, friction);
  score += roommateScore(preferences, roommate, positive, friction);
  const tieBreaker = hashValue(`${applicationId}:${room.id}`) % 7;
  score = Math.max(24, Math.min(99, Math.round(score / 1.55) + tieBreaker));
  return {
    id: reference("TU-HO", `${applicationId}:${room.id}`),
    roomId: room.id,
    residenceId: residence.id,
    roommateId: roommate?.id || null,
    score,
    positive: [...new Set(positive)].slice(0, 5),
    friction: [...new Set(friction)].slice(0, 3),
    fee: room.fee,
  };
}

export function matchHousingOffers(preferences, applicationId, { excludeRoomId = null } = {}) {
  return housingRooms
    .filter((room) => room.openBeds > 0 && room.id !== excludeRoomId)
    .map((room) => buildOffer(preferences, room, applicationId))
    .sort((a, b) => b.score - a.score || a.fee - b.fee)
    .filter((offer, index, offers) => {
      if (index < 2) return true;
      return !offers.slice(0, index).some((candidate) => candidate.residenceId === offer.residenceId);
    })
    .slice(0, 3);
}

export function submitHousingApplication(preferences) {
  const submittedAt = new Date().toISOString();
  const identity = housingIdentity();
  const id = reference("TU-HA", `${identity?.id || "local"}:${submittedAt}:${JSON.stringify(preferences)}`);
  const application = {
    schema: 1,
    id,
    identityId: identity?.id || null,
    term: "2026-autumn",
    status: "matching",
    submittedAt,
    updatedAt: submittedAt,
    preferences,
    offers: matchHousingOffers(preferences, id),
    declinedOfferIds: [],
  };
  const records = housingApplications();
  records.push(application);
  writeHousingJson(HOUSING_KEYS.applications, records.slice(-MAX_RECORDS));
  clearHousingDraft();
  return application;
}

export function declineHousingOffer(applicationId, offerId) {
  const records = housingApplications();
  const application = records.find((record) => record.id === applicationId);
  if (!application || !application.offers.some((offer) => offer.id === offerId)) return null;
  application.declinedOfferIds = [...new Set([...(application.declinedOfferIds || []), offerId])];
  application.status = application.declinedOfferIds.length >= application.offers.length ? "offers-declined" : "matching";
  application.updatedAt = new Date().toISOString();
  writeHousingJson(HOUSING_KEYS.applications, records);
  return application;
}

function incidentCodes(offer, preferences) {
  const roommate = roommateById(offer.roommateId);
  const codes = ["doorName"];
  if (!roommate) codes.push("singleVisitor");
  if (roommate?.habits.sleep !== preferences.sleep) codes.push("quietHours");
  if (roommate?.habits.cooking === "night" || preferences.cooking === "night") codes.push("nightKitchen");
  if (preferences.moon === "sensitive" || roommate?.habits.moon === "sensitive") codes.push("fullMoon");
  if (preferences.familiar !== "none" || roommate?.habits.familiar !== "none") codes.push("familiarChair");
  if (preferences.wall === "phase" || roommate?.habits.wall === "phase") codes.push("wallKnock");
  if (preferences.water === "must" || roommate?.habits.water === "must") codes.push("waterSchedule");
  if (preferences.flight !== "ground" || roommate?.habits.flight !== "ground") codes.push("windowRunway");
  if (preferences.danmaku === "indoor" || roommate?.habits.danmaku === "indoor") codes.push("danmakuTape");
  return [...new Set(codes)].slice(0, 4);
}

export function acceptHousingOffer(applicationId, offerId) {
  const applications = housingApplications();
  const application = applications.find((record) => record.id === applicationId);
  const offer = application?.offers?.find((record) => record.id === offerId);
  if (!application || !offer || application.declinedOfferIds?.includes(offerId)) return null;
  const acceptedAt = new Date().toISOString();
  const assignments = housingAssignments();
  assignments.forEach((record) => {
    if (record.status === "active") {
      record.status = "superseded";
      record.endedAt = acceptedAt;
    }
  });
  const assignment = {
    schema: 1,
    id: reference("TU-HR", `${applicationId}:${offerId}:${acceptedAt}`),
    applicationId,
    offerId,
    identityId: application.identityId,
    term: application.term,
    status: "active",
    acceptedAt,
    roomId: offer.roomId,
    residenceId: offer.residenceId,
    roommateId: offer.roommateId,
    fee: offer.fee,
    score: offer.score,
    incidentCodes: incidentCodes(offer, application.preferences),
    agreementChecked: false,
  };
  assignments.push(assignment);
  application.status = "assigned";
  application.acceptedOfferId = offerId;
  application.updatedAt = acceptedAt;
  writeHousingJson(HOUSING_KEYS.assignments, assignments.slice(-MAX_RECORDS));
  writeHousingJson(HOUSING_KEYS.applications, applications);
  return assignment;
}

export function confirmHousingAgreement(assignmentId, checked) {
  const records = housingAssignments();
  const assignment = records.find((record) => record.id === assignmentId);
  if (!assignment) return null;
  assignment.agreementChecked = Boolean(checked);
  assignment.agreementAt = checked ? new Date().toISOString() : null;
  writeHousingJson(HOUSING_KEYS.assignments, records);
  return assignment;
}

export function submitHousingRoomChange({ reason, urgency, note }) {
  const assignment = activeHousingAssignment();
  if (!assignment) return null;
  const applications = housingApplications();
  const source = applications.find((record) => record.id === assignment.applicationId);
  if (!source) return null;
  const submittedAt = new Date().toISOString();
  const id = reference("TU-HC", `${assignment.id}:${submittedAt}:${reason}`);
  const suggestion = matchHousingOffers(source.preferences, id, { excludeRoomId: assignment.roomId })[0] || null;
  const request = {
    schema: 1,
    id,
    assignmentId: assignment.id,
    status: "under-review",
    reason,
    urgency,
    note,
    submittedAt,
    suggestion,
  };
  const records = housingRoomChanges();
  records.push(request);
  writeHousingJson(HOUSING_KEYS.changes, records.slice(-MAX_RECORDS));
  return request;
}

export function cancelHousingRoomChange(requestId) {
  const records = housingRoomChanges();
  const request = records.find((record) => record.id === requestId);
  if (!request || request.status !== "under-review") return null;
  request.status = "cancelled";
  request.cancelledAt = new Date().toISOString();
  writeHousingJson(HOUSING_KEYS.changes, records);
  return request;
}

export function latestHousingApplication() {
  return housingApplications().at(-1) || null;
}

export function roomForAssignment(assignment) {
  return assignment ? housingRoom(assignment.roomId) : null;
}
