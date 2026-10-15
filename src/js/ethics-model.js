import { text as catalogText, trees as catalogTrees } from "../generated/i18n/ui/ethics-model.js";
import {
  ethicsCase,
  ethicsCases,
  ethicsConsent,
  ethicsConsentPaths,
  ethicsDataKinds,
  ethicsDisclosure,
  ethicsDisclosureRules,
  ethicsLocalized,
  ethicsMethod,
  ethicsMethods,
  ethicsOutcomeLabels,
  ethicsReviewer,
  ethicsReviewers,
  ethicsRisk,
  ethicsRiskBands,
  ethicsStanceLabels,
  ethicsTarget,
  ethicsTargets,
} from "../data/ethics.js";

const DRAFT_KEY = "tu:ethics:drafts";
const PROTOCOL_KEY = "tu:ethics:protocols";
const REVIEW_KEY = "tu:ethics:reviews";
const MAX_PROTOCOLS = 80;

const findingCopy = {
  eirin: {
    clear: catalogText("findingCopy.eirin.clear"),
    noStop: catalogText("findingCopy.eirin.noStop"),
    zeroDose: catalogText("findingCopy.eirin.zeroDose"),
    weakStop: catalogText("findingCopy.eirin.weakStop"),
    highRisk: catalogText("findingCopy.eirin.highRisk"),
  },
  satori: {
    clear: catalogText("findingCopy.satori.clear"),
    covert: catalogText("findingCopy.satori.covert"),
    noNotes: catalogText("findingCopy.satori.noNotes"),
    deletion: catalogText("findingCopy.satori.deletion"),
  },
  keine: {
    clear: catalogText("findingCopy.keine.clear"),
    noReceipt: catalogText("findingCopy.keine.noReceipt"),
    retention: catalogText("findingCopy.keine.retention"),
  },
  eiki: {
    clear: catalogText("findingCopy.eiki.clear"),
    noConsent: catalogText("findingCopy.eiki.noConsent"),
    objectRefusal: catalogText("findingCopy.eiki.objectRefusal"),
    weakAppeal: catalogText("findingCopy.eiki.weakAppeal"),
    proxy: catalogText("findingCopy.eiki.proxy"),
  },
  reimu: {
    clear: catalogText("findingCopy.reimu.clear"),
    noWitness: catalogText("findingCopy.reimu.noWitness"),
    noExit: catalogText("findingCopy.reimu.noExit"),
    erasedRule: catalogText("findingCopy.reimu.erasedRule"),
  },
};

function storage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function readJson(key, fallback) {
  try {
    const value = JSON.parse(storage()?.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  storage()?.setItem(key, JSON.stringify(value));
}

function text(value, maximum = 1600) {
  return String(value ?? "").trim().slice(0, maximum);
}

function validDate(value, fallback = new Date().toISOString()) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
}

function known(value, records, fallback) {
  return records.some((record) => record.id === value) ? value : fallback;
}

function unique(values, records) {
  const allowed = new Set(records.map(({ id }) => id));
  return [...new Set(Array.isArray(values) ? values : [])].filter((value) => allowed.has(value));
}

function makeId(prefix, now, sequence) {
  return `${prefix}-${now.getTime().toString(36).toUpperCase()}-${String(sequence).padStart(2, "0")}`;
}

function emit(action, detail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("tu:ethicschange", { detail: { action, ...detail } }));
}

export function ethicsDraftFromCase(caseId = ethicsCases[0].id, locale = "zh-Hant") {
  const source = ethicsCase(caseId) || ethicsCases[0];
  const prefill = source.prefill;
  return {
    schema: 1,
    caseId: source.id,
    title: ethicsLocalized(source.shortTitle, locale),
    researcher: "",
    targetId: prefill.targetId,
    methodId: prefill.methodId,
    disclosureId: prefill.disclosureId,
    consentId: prefill.consentId,
    riskId: prefill.riskId,
    dataIds: [...prefill.dataIds],
    maxExposure: prefill.maxExposure,
    subjectCanStop: Boolean(prefill.subjectCanStop),
    independentMonitor: Boolean(prefill.independentMonitor),
    auditStub: Boolean(prefill.auditStub),
    objectAssent: Boolean(prefill.objectAssent),
    stopRule: ethicsLocalized(prefill.stopRule, locale),
    controlPlan: ethicsLocalized(prefill.controlPlan, locale),
    withdrawalPlan: ethicsLocalized(prefill.withdrawalPlan, locale),
    deletionPlan: ethicsLocalized(prefill.deletionPlan, locale),
    appealPlan: ethicsLocalized(prefill.appealPlan, locale),
    rationale: ethicsLocalized(prefill.rationale, locale),
    revisionOf: null,
    rootProtocolId: null,
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeEthicsDraft(value = {}, locale = "zh-Hant") {
  const caseId = known(value.caseId, ethicsCases, ethicsCases[0].id);
  const fallback = ethicsDraftFromCase(caseId, locale);
  return {
    schema: 1,
    caseId,
    title: text(value.title || fallback.title, 140),
    researcher: text(value.researcher, 80),
    targetId: known(value.targetId, ethicsTargets, fallback.targetId),
    methodId: known(value.methodId, ethicsMethods, fallback.methodId),
    disclosureId: known(value.disclosureId, ethicsDisclosureRules, fallback.disclosureId),
    consentId: known(value.consentId, ethicsConsentPaths, fallback.consentId),
    riskId: known(value.riskId, ethicsRiskBands, fallback.riskId),
    dataIds: unique(value.dataIds ?? fallback.dataIds, ethicsDataKinds),
    maxExposure: Math.max(0, Math.min(720, Number(value.maxExposure) || 0)),
    subjectCanStop: Boolean(value.subjectCanStop),
    independentMonitor: Boolean(value.independentMonitor),
    auditStub: Boolean(value.auditStub),
    objectAssent: Boolean(value.objectAssent),
    stopRule: text(value.stopRule || fallback.stopRule),
    controlPlan: text(value.controlPlan || fallback.controlPlan),
    withdrawalPlan: text(value.withdrawalPlan || fallback.withdrawalPlan),
    deletionPlan: text(value.deletionPlan || fallback.deletionPlan),
    appealPlan: text(value.appealPlan || fallback.appealPlan),
    rationale: text(value.rationale || fallback.rationale),
    revisionOf: text(value.revisionOf, 120) || null,
    rootProtocolId: text(value.rootProtocolId, 120) || null,
    updatedAt: validDate(value.updatedAt),
  };
}

function draftStore() {
  const value = readJson(DRAFT_KEY, null);
  if (!value || typeof value !== "object") return { schema: 1, activeCaseId: ethicsCases[0].id, byCase: {} };
  if (!value.byCase) {
    const draft = normalizeEthicsDraft(value);
    return { schema: 1, activeCaseId: draft.caseId, byCase: { [draft.caseId]: draft } };
  }
  const byCase = {};
  Object.entries(value.byCase).forEach(([caseId, draft]) => {
    if (!ethicsCase(caseId)) return;
    byCase[caseId] = normalizeEthicsDraft({ ...draft, caseId });
  });
  return {
    schema: 1,
    activeCaseId: ethicsCase(value.activeCaseId) ? value.activeCaseId : ethicsCases[0].id,
    byCase,
  };
}

export function ethicsDraft(caseId = draftStore().activeCaseId, locale = "zh-Hant") {
  const store = draftStore();
  return store.byCase[caseId] || ethicsDraftFromCase(caseId, locale);
}

export function saveEthicsDraft(value, locale = "zh-Hant") {
  const draft = normalizeEthicsDraft({ ...value, updatedAt: new Date().toISOString() }, locale);
  const store = draftStore();
  store.activeCaseId = draft.caseId;
  store.byCase[draft.caseId] = draft;
  writeJson(DRAFT_KEY, store);
  emit("draft-saved", { caseId: draft.caseId });
  return draft;
}

export function resetEthicsDraft(caseId, locale = "zh-Hant") {
  const store = draftStore();
  const draft = ethicsDraftFromCase(caseId, locale);
  store.activeCaseId = draft.caseId;
  store.byCase[draft.caseId] = draft;
  writeJson(DRAFT_KEY, store);
  emit("draft-reset", { caseId: draft.caseId });
  return draft;
}

function opinion(reviewerId, stance, findingId, conditions = []) {
  return {
    reviewerId,
    stance,
    findingId,
    statement: findingCopy[reviewerId][findingId],
    conditions,
  };
}

function eirinOpinion(draft) {
  if (draft.riskId === "high" && draft.maxExposure <= 0) {
    return opinion("eirin", "revise", "zeroDose", [
      catalogText("eirinOpinion.eirin.3.0"),
    ]);
  }
  if (draft.stopRule.length < 12) {
    return opinion("eirin", "revise", "weakStop", [
      catalogText("eirinOpinion.eirin.3.0.2"),
    ]);
  }
  if (draft.riskId === "high" && !draft.subjectCanStop) {
    return opinion("eirin", "revise", "noStop", [
      catalogText("eirinOpinion.eirin.3.0.3"),
    ]);
  }
  if (draft.riskId === "high") {
    return opinion("eirin", "conditional", "highRisk", [
      catalogText("eirinOpinion.eirin.3.0.4"),
    ]);
  }
  return opinion("eirin", "approve", "clear");
}

function satoriOpinion(draft) {
  const mental = ["wave", "mind-read", "dream"].includes(draft.methodId);
  const subjectConsent = ["subject", "both", "community", "proxy"].includes(draft.consentId);
  if (mental && (!subjectConsent || ["after", "none"].includes(draft.disclosureId))) {
    return opinion("satori", "revise", "covert", [
      catalogText("satoriOpinion.satori.3.0"),
    ]);
  }
  if (draft.methodId === "mind-read" && draft.dataIds.includes("thought")) {
    return opinion("satori", "conditional", "noNotes", [
      catalogText("satoriOpinion.satori.3.0.2"),
    ]);
  }
  if (draft.dataIds.includes("thought") && draft.deletionPlan.length < 18) {
    return opinion("satori", "conditional", "deletion", [
      catalogText("satoriOpinion.satori.3.0.3"),
    ]);
  }
  return opinion("satori", "approve", "clear");
}

function keineOpinion(draft) {
  if (draft.methodId === "history-edit" && !draft.auditStub) {
    return opinion("keine", "contested", "noReceipt", [
      catalogText("keineOpinion.keine.3.0"),
    ]);
  }
  if (draft.dataIds.includes("history") && draft.deletionPlan.length < 18) {
    return opinion("keine", "conditional", "retention", [
      catalogText("keineOpinion.keine.3.0.2"),
    ]);
  }
  return opinion("keine", "approve", "clear");
}

function eikiOpinion(draft) {
  if (draft.consentId === "none") {
    return opinion("eiki", "revise", "noConsent", [
      catalogText("eikiOpinion.eiki.3.0"),
    ]);
  }
  if (draft.targetId === "object" && (!draft.objectAssent || draft.consentId === "holder")) {
    return opinion("eiki", "contested", "objectRefusal", [
      catalogText("eikiOpinion.eiki.3.0.2"),
    ]);
  }
  if (draft.appealPlan.length < 18 || ["holder", "proxy"].includes(draft.consentId)) {
    return opinion("eiki", "conditional", draft.consentId === "proxy" ? "proxy" : "weakAppeal", [
      catalogText("eikiOpinion.eiki.3.0.3"),
    ]);
  }
  return opinion("eiki", "approve", "clear");
}

function reimuOpinion(draft) {
  if (["time-stop", "wave", "history-edit"].includes(draft.methodId) && !draft.independentMonitor) {
    return opinion("reimu", "revise", "noWitness", [
      catalogText("reimuOpinion.reimu.3.0"),
    ]);
  }
  if (draft.methodId === "history-edit" && !draft.auditStub) {
    return opinion("reimu", "contested", "erasedRule", [
      catalogText("reimuOpinion.reimu.3.0.2"),
    ]);
  }
  if (!draft.subjectCanStop) {
    return opinion("reimu", "conditional", "noExit", [
      catalogText("reimuOpinion.reimu.3.0.3"),
    ]);
  }
  return opinion("reimu", "approve", "clear");
}

export function assessEthicsProtocol(value = {}, locale = "zh-Hant") {
  const draft = normalizeEthicsDraft(value, locale);
  const opinions = [
    eirinOpinion(draft),
    satoriOpinion(draft),
    keineOpinion(draft),
    eikiOpinion(draft),
    reimuOpinion(draft),
  ];
  let outcome = "approved";
  if (opinions.some(({ stance }) => stance === "revise")) outcome = "revise";
  else if (opinions.some(({ stance }) => stance === "contested")) outcome = "contested";
  else if (opinions.some(({ stance }) => stance === "conditional")) outcome = "conditional";
  return {
    draft,
    outcome,
    opinions,
    counts: Object.fromEntries(["approve", "conditional", "revise", "contested"].map((stance) => [
      stance,
      opinions.filter((opinionEntry) => opinionEntry.stance === stance).length,
    ])),
  };
}

function normalizeOpinion(value = {}) {
  const reviewerId = ethicsReviewer(value.reviewerId)?.id || ethicsReviewers[0].id;
  const stance = ethicsStanceLabels[value.stance] ? value.stance : "revise";
  const findingId = findingCopy[reviewerId]?.[value.findingId] ? value.findingId : "clear";
  return {
    reviewerId,
    stance,
    findingId,
    statement: findingCopy[reviewerId][findingId],
    conditions: Array.isArray(value.conditions) ? value.conditions : [],
  };
}

function normalizeReview(value = {}) {
  return {
    schema: 1,
    id: text(value.id, 120),
    protocolId: text(value.protocolId, 120),
    rootProtocolId: text(value.rootProtocolId, 120) || text(value.protocolId, 120),
    createdAt: validDate(value.createdAt),
    outcome: ethicsOutcomeLabels[value.outcome] ? value.outcome : "revise",
    opinions: (Array.isArray(value.opinions) ? value.opinions : []).map(normalizeOpinion).slice(0, ethicsReviewers.length),
  };
}

function normalizeProtocol(value = {}) {
  const draft = normalizeEthicsDraft(value.draft || value);
  const outcome = ethicsOutcomeLabels[value.outcome] ? value.outcome : "revise";
  return {
    schema: 1,
    id: text(value.id, 120),
    rootProtocolId: text(value.rootProtocolId, 120) || text(value.id, 120),
    revisionOf: text(value.revisionOf, 120) || null,
    revision: Math.max(1, Number(value.revision) || 1),
    createdAt: validDate(value.createdAt),
    reviewedAt: validDate(value.reviewedAt || value.createdAt),
    status: ["active", "superseded", "withdrawn"].includes(value.status) ? value.status : "active",
    supersededBy: text(value.supersededBy, 120) || null,
    withdrawnAt: value.withdrawnAt ? validDate(value.withdrawnAt) : null,
    withdrawalReason: text(value.withdrawalReason, 800),
    outcome,
    reviewId: text(value.reviewId, 120),
    draft,
  };
}

export function ethicsProtocols() {
  const values = readJson(PROTOCOL_KEY, []);
  return (Array.isArray(values) ? values : []).map(normalizeProtocol).filter(({ id }) => id);
}

export function ethicsProtocol(id) {
  return ethicsProtocols().find((record) => record.id === id) || null;
}

export function ethicsReviews() {
  const values = readJson(REVIEW_KEY, []);
  return (Array.isArray(values) ? values : []).map(normalizeReview).filter(({ id, protocolId }) => id && protocolId);
}

export function ethicsReviewForProtocol(protocolId) {
  return ethicsReviews().find((record) => record.protocolId === protocolId) || null;
}

export function submitEthicsProtocol(value, now = new Date(), locale = "zh-Hant") {
  const assessment = assessEthicsProtocol(value, locale);
  if (assessment.draft.title.length < 4) return { error: "title", assessment };
  const protocols = ethicsProtocols();
  const reviews = ethicsReviews();
  const previous = assessment.draft.revisionOf ? protocols.find(({ id }) => id === assessment.draft.revisionOf) : null;
  const protocolId = makeId("TU-ERB-P", now, protocols.length + 1);
  const rootProtocolId = previous?.rootProtocolId || previous?.id || protocolId;
  const reviewId = makeId("TU-ERB-R", now, reviews.length + 1);
  const reviewedAt = new Date(now.getTime() + 1).toISOString();
  const protocol = normalizeProtocol({
    id: protocolId,
    rootProtocolId,
    revisionOf: previous?.id || null,
    revision: previous ? previous.revision + 1 : 1,
    createdAt: now.toISOString(),
    reviewedAt,
    status: "active",
    outcome: assessment.outcome,
    reviewId,
    draft: assessment.draft,
  });
  if (previous) {
    const index = protocols.findIndex(({ id }) => id === previous.id);
    protocols[index] = normalizeProtocol({ ...previous, status: "superseded", supersededBy: protocol.id });
  }
  protocols.push(protocol);
  const review = normalizeReview({
    id: reviewId,
    protocolId: protocol.id,
    rootProtocolId,
    createdAt: reviewedAt,
    outcome: assessment.outcome,
    opinions: assessment.opinions,
  });
  reviews.push(review);
  writeJson(PROTOCOL_KEY, protocols.slice(-MAX_PROTOCOLS));
  writeJson(REVIEW_KEY, reviews.slice(-MAX_PROTOCOLS));
  saveEthicsDraft({
    ...protocol.draft,
    revisionOf: protocol.id,
    rootProtocolId,
    updatedAt: reviewedAt,
  }, locale);
  emit(previous ? "protocol-amended" : "protocol-submitted", {
    protocolId: protocol.id,
    reviewId: review.id,
    outcome: protocol.outcome,
  });
  return { protocol, review, assessment };
}

export function prepareEthicsRevision(protocolId, locale = "zh-Hant") {
  const protocol = ethicsProtocol(protocolId);
  if (!protocol) return null;
  return saveEthicsDraft({
    ...protocol.draft,
    revisionOf: protocol.id,
    rootProtocolId: protocol.rootProtocolId,
    updatedAt: new Date().toISOString(),
  }, locale);
}

export function withdrawEthicsProtocol(protocolId, reason = "", now = new Date()) {
  const protocols = ethicsProtocols();
  const index = protocols.findIndex(({ id }) => id === protocolId);
  if (index < 0 || protocols[index].status === "withdrawn") return null;
  protocols[index] = normalizeProtocol({
    ...protocols[index],
    status: "withdrawn",
    withdrawnAt: now.toISOString(),
    withdrawalReason: text(reason, 800),
  });
  writeJson(PROTOCOL_KEY, protocols);
  emit("protocol-withdrawn", { protocolId });
  return protocols[index];
}

const communityCopy = catalogTrees["communityCopy"];

export function ethicsCommunityPosts(locale = "zh-Hant") {
  const c = communityCopy[locale] || communityCopy["zh-Hant"];
  return ethicsProtocols().slice(-8).reverse().flatMap((protocol, index) => {
    const review = ethicsReviewForProtocol(protocol.id);
    if (!review) return [];
    const outcome = ethicsLocalized(
      protocol.status === "withdrawn" ? ethicsOutcomeLabels.withdrawn : ethicsOutcomeLabels[protocol.outcome],
      locale,
    );
    const dissents = review.opinions.filter(({ stance }) => ["revise", "contested"].includes(stance));
    const dissentNames = dissents.map(({ reviewerId }) => ethicsLocalized(ethicsReviewer(reviewerId)?.name, locale)).join("、");
    const route = `ethics-protocol-${protocol.id}`;
    return [
      {
        id: `ethics-aya-${protocol.id}`,
        category: "notice",
        author: c.aya,
        title: `${c.headline}：${protocol.draft.title}`,
        body: `${outcome}${locale === "en" ? ". " : "。"}${protocol.status === "withdrawn" ? c.withdrew : c.conditions}`,
        replies: 9 + index,
        createdAt: protocol.reviewedAt,
        generated: true,
        ethics: true,
        ethicsRoute: route,
      },
      {
        id: `ethics-minority-${protocol.id}`,
        category: "course",
        author: c.minority,
        title: `${outcome} · ${protocol.draft.title}`,
        body: dissentNames
          ? `${dissentNames}${locale === "en" ? ": " : "："}${c.conditions}`
          : c.noDissent,
        replies: 5 + dissents.length,
        createdAt: protocol.reviewedAt,
        generated: true,
        ethics: true,
        ethicsRoute: route,
      },
    ];
  });
}

export function ethicsStats() {
  const protocols = ethicsProtocols();
  return {
    protocols: protocols.length,
    active: protocols.filter(({ status }) => status === "active").length,
    contested: protocols.filter(({ outcome }) => outcome === "contested").length,
    withdrawn: protocols.filter(({ status }) => status === "withdrawn").length,
  };
}

export function ethicsProtocolDescription(protocol, locale = "zh-Hant") {
  return {
    case: ethicsCase(protocol.draft.caseId),
    target: ethicsTarget(protocol.draft.targetId),
    method: ethicsMethod(protocol.draft.methodId),
    disclosure: ethicsDisclosure(protocol.draft.disclosureId),
    consent: ethicsConsent(protocol.draft.consentId),
    risk: ethicsRisk(protocol.draft.riskId),
    outcome: protocol.status === "withdrawn" ? ethicsOutcomeLabels.withdrawn : ethicsOutcomeLabels[protocol.outcome],
    review: ethicsReviewForProtocol(protocol.id),
    locale,
  };
}

export const ethicsStorageKeys = Object.freeze({
  drafts: DRAFT_KEY,
  protocols: PROTOCOL_KEY,
  reviews: REVIEW_KEY,
});
