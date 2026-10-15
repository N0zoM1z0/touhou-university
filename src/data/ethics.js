import { text as catalogText } from "../generated/i18n/data/ethics.js";

export const ethicsOutcomeLabels = Object.freeze({
  approved: catalogText("ethicsOutcomeLabels.0.approved"),
  conditional: catalogText("ethicsOutcomeLabels.0.conditional"),
  revise: catalogText("ethicsOutcomeLabels.0.revise"),
  contested: catalogText("ethicsOutcomeLabels.0.contested"),
  withdrawn: catalogText("ethicsOutcomeLabels.0.withdrawn"),
});

export const ethicsStanceLabels = Object.freeze({
  approve: catalogText("ethicsStanceLabels.0.approve"),
  conditional: catalogText("ethicsStanceLabels.0.conditional"),
  revise: catalogText("ethicsStanceLabels.0.revise"),
  contested: catalogText("ethicsStanceLabels.0.contested"),
});

export const ethicsReviewers = Object.freeze([
  {
    id: "eirin",
    glyph: "藥",
    name: catalogText("ethicsReviewers.0.eirin.name"),
    seat: catalogText("ethicsReviewers.0.eirin.seat"),
    question: catalogText("ethicsReviewers.0.eirin.question"),
  },
  {
    id: "satori",
    glyph: "心",
    name: catalogText("ethicsReviewers.0.satori.name"),
    seat: catalogText("ethicsReviewers.0.satori.seat"),
    question: catalogText("ethicsReviewers.0.satori.question"),
  },
  {
    id: "keine",
    glyph: "史",
    name: catalogText("ethicsReviewers.0.keine.name"),
    seat: catalogText("ethicsReviewers.0.keine.seat"),
    question: catalogText("ethicsReviewers.0.keine.question"),
  },
  {
    id: "eiki",
    glyph: "裁",
    name: catalogText("ethicsReviewers.0.eiki.name"),
    seat: catalogText("ethicsReviewers.0.eiki.seat"),
    question: catalogText("ethicsReviewers.0.eiki.question"),
  },
  {
    id: "reimu",
    glyph: "札",
    name: catalogText("ethicsReviewers.0.reimu.name"),
    seat: catalogText("ethicsReviewers.0.reimu.seat"),
    question: catalogText("ethicsReviewers.0.reimu.question"),
  },
]);

export const ethicsTargets = Object.freeze([
  { id: "person", label: catalogText("ethicsTargets.0.person.label") },
  { id: "group", label: catalogText("ethicsTargets.0.group.label") },
  { id: "animal", label: catalogText("ethicsTargets.0.animal.label") },
  { id: "deity", label: catalogText("ethicsTargets.0.deity.label") },
  { id: "object", label: catalogText("ethicsTargets.0.object.label") },
  { id: "history", label: catalogText("ethicsTargets.0.history.label") },
]);

export const ethicsMethods = Object.freeze([
  { id: "observation", risk: "low", label: catalogText("ethicsMethods.0.observation.label") },
  { id: "wave", risk: "high", label: catalogText("ethicsMethods.0.wave.label") },
  { id: "mind-read", risk: "high", label: catalogText("ethicsMethods.0.mind-read.label") },
  { id: "time-stop", risk: "high", label: catalogText("ethicsMethods.0.time-stop.label") },
  { id: "history-edit", risk: "high", label: catalogText("ethicsMethods.0.history-edit.label") },
  { id: "dream", risk: "high", label: catalogText("ethicsMethods.0.dream.label") },
  { id: "disassembly", risk: "high", label: catalogText("ethicsMethods.0.disassembly.label") },
]);

export const ethicsDisclosureRules = Object.freeze([
  { id: "prior", label: catalogText("ethicsDisclosureRules.0.prior.label") },
  { id: "staged", label: catalogText("ethicsDisclosureRules.0.staged.label") },
  { id: "after", label: catalogText("ethicsDisclosureRules.0.after.label") },
  { id: "none", label: catalogText("ethicsDisclosureRules.0.none.label") },
]);

export const ethicsConsentPaths = Object.freeze([
  { id: "subject", label: catalogText("ethicsConsentPaths.0.subject.label") },
  { id: "holder", label: catalogText("ethicsConsentPaths.0.holder.label") },
  { id: "both", label: catalogText("ethicsConsentPaths.0.both.label") },
  { id: "community", label: catalogText("ethicsConsentPaths.0.community.label") },
  { id: "proxy", label: catalogText("ethicsConsentPaths.0.proxy.label") },
  { id: "none", label: catalogText("ethicsConsentPaths.0.none.label") },
]);

export const ethicsRiskBands = Object.freeze([
  { id: "low", label: catalogText("ethicsRiskBands.0.low.label") },
  { id: "moderate", label: catalogText("ethicsRiskBands.0.moderate.label") },
  { id: "high", label: catalogText("ethicsRiskBands.0.high.label") },
]);

export const ethicsDataKinds = Object.freeze([
  { id: "route", label: catalogText("ethicsDataKinds.0.route.label") },
  { id: "thought", label: catalogText("ethicsDataKinds.0.thought.label") },
  { id: "body", label: catalogText("ethicsDataKinds.0.body.label") },
  { id: "timeline", label: catalogText("ethicsDataKinds.0.timeline.label") },
  { id: "history", label: catalogText("ethicsDataKinds.0.history.label") },
  { id: "components", label: catalogText("ethicsDataKinds.0.components.label") },
]);

export const ethicsCases = Object.freeze([
  {
    id: "reisen-undisclosed-wave",
    code: "TU-ERB-C01",
    mark: "波",
    title: catalogText("ethicsCases.0.reisen-undisclosed-wave.title"),
    shortTitle: catalogText("ethicsCases.0.reisen-undisclosed-wave.shortTitle"),
    lede: catalogText("ethicsCases.0.reisen-undisclosed-wave.lede"),
    conflict: catalogText("ethicsCases.0.reisen-undisclosed-wave.conflict"),
    expectedOutcome: "revise",
    incidentIds: ["fourth-lantern-loop"],
    relatedRoutes: ["incident-case-fourth-lantern-loop", "research-moonpath"],
    voices: [
      {
        speaker: catalogText("ethicsCases.0.reisen-undisclosed-wave.voices.0.speaker"),
        statement: catalogText("ethicsCases.0.reisen-undisclosed-wave.voices.0.statement"),
      },
      {
        speaker: catalogText("ethicsCases.0.reisen-undisclosed-wave.voices.1.speaker"),
        statement: catalogText("ethicsCases.0.reisen-undisclosed-wave.voices.1.statement"),
      },
    ],
    prefill: {
      targetId: "group",
      methodId: "wave",
      disclosureId: "none",
      consentId: "none",
      riskId: "high",
      dataIds: ["route", "body"],
      maxExposure: 18,
      subjectCanStop: false,
      independentMonitor: false,
      auditStub: true,
      objectAssent: false,
      stopRule: catalogText("ethicsCases.0.reisen-undisclosed-wave.prefill.stopRule"),
      controlPlan: catalogText("ethicsCases.0.reisen-undisclosed-wave.prefill.controlPlan"),
      withdrawalPlan: catalogText("ethicsCases.0.reisen-undisclosed-wave.prefill.withdrawalPlan"),
      deletionPlan: catalogText("ethicsCases.0.reisen-undisclosed-wave.prefill.deletionPlan"),
      appealPlan: catalogText("ethicsCases.0.reisen-undisclosed-wave.prefill.appealPlan"),
      rationale: catalogText("ethicsCases.0.reisen-undisclosed-wave.prefill.rationale"),
    },
  },
  {
    id: "satori-no-notes",
    code: "TU-ERB-C02",
    mark: "心",
    title: catalogText("ethicsCases.0.satori-no-notes.title"),
    shortTitle: catalogText("ethicsCases.0.satori-no-notes.shortTitle"),
    lede: catalogText("ethicsCases.0.satori-no-notes.lede"),
    conflict: catalogText("ethicsCases.0.satori-no-notes.conflict"),
    expectedOutcome: "revise",
    incidentIds: [],
    relatedRoutes: ["research-reports"],
    voices: [
      {
        speaker: catalogText("ethicsCases.0.satori-no-notes.voices.0.speaker"),
        statement: catalogText("ethicsCases.0.satori-no-notes.voices.0.statement"),
      },
      {
        speaker: catalogText("ethicsCases.0.satori-no-notes.voices.1.speaker"),
        statement: catalogText("ethicsCases.0.satori-no-notes.voices.1.statement"),
      },
    ],
    prefill: {
      targetId: "person",
      methodId: "mind-read",
      disclosureId: "after",
      consentId: "none",
      riskId: "high",
      dataIds: ["thought"],
      maxExposure: 6,
      subjectCanStop: false,
      independentMonitor: false,
      auditStub: true,
      objectAssent: false,
      stopRule: catalogText("ethicsCases.0.satori-no-notes.prefill.stopRule"),
      controlPlan: catalogText("ethicsCases.0.satori-no-notes.prefill.controlPlan"),
      withdrawalPlan: catalogText("ethicsCases.0.satori-no-notes.prefill.withdrawalPlan"),
      deletionPlan: catalogText("ethicsCases.0.satori-no-notes.prefill.deletionPlan"),
      appealPlan: catalogText("ethicsCases.0.satori-no-notes.prefill.appealPlan"),
      rationale: catalogText("ethicsCases.0.satori-no-notes.prefill.rationale"),
    },
  },
  {
    id: "sakuya-frozen-control",
    code: "TU-ERB-C03",
    mark: "時",
    title: catalogText("ethicsCases.0.sakuya-frozen-control.title"),
    shortTitle: catalogText("ethicsCases.0.sakuya-frozen-control.shortTitle"),
    lede: catalogText("ethicsCases.0.sakuya-frozen-control.lede"),
    conflict: catalogText("ethicsCases.0.sakuya-frozen-control.conflict"),
    expectedOutcome: "revise",
    incidentIds: ["late-bell-seven"],
    relatedRoutes: ["incident-case-late-bell-seven"],
    voices: [
      {
        speaker: catalogText("ethicsCases.0.sakuya-frozen-control.voices.0.speaker"),
        statement: catalogText("ethicsCases.0.sakuya-frozen-control.voices.0.statement"),
      },
      {
        speaker: catalogText("ethicsCases.0.sakuya-frozen-control.voices.1.speaker"),
        statement: catalogText("ethicsCases.0.sakuya-frozen-control.voices.1.statement"),
      },
    ],
    prefill: {
      targetId: "group",
      methodId: "time-stop",
      disclosureId: "prior",
      consentId: "subject",
      riskId: "high",
      dataIds: ["timeline", "body"],
      maxExposure: 0,
      subjectCanStop: true,
      independentMonitor: false,
      auditStub: true,
      objectAssent: false,
      stopRule: catalogText("ethicsCases.0.sakuya-frozen-control.prefill.stopRule"),
      controlPlan: catalogText("ethicsCases.0.sakuya-frozen-control.prefill.controlPlan"),
      withdrawalPlan: catalogText("ethicsCases.0.sakuya-frozen-control.prefill.withdrawalPlan"),
      deletionPlan: catalogText("ethicsCases.0.sakuya-frozen-control.prefill.deletionPlan"),
      appealPlan: catalogText("ethicsCases.0.sakuya-frozen-control.prefill.appealPlan"),
      rationale: catalogText("ethicsCases.0.sakuya-frozen-control.prefill.rationale"),
    },
  },
  {
    id: "keine-history-deletion",
    code: "TU-ERB-C04",
    mark: "史",
    title: catalogText("ethicsCases.0.keine-history-deletion.title"),
    shortTitle: catalogText("ethicsCases.0.keine-history-deletion.shortTitle"),
    lede: catalogText("ethicsCases.0.keine-history-deletion.lede"),
    conflict: catalogText("ethicsCases.0.keine-history-deletion.conflict"),
    expectedOutcome: "contested",
    incidentIds: ["late-bell-seven"],
    relatedRoutes: ["incident-case-late-bell-seven", "research-reports"],
    voices: [
      {
        speaker: catalogText("ethicsCases.0.keine-history-deletion.voices.0.speaker"),
        statement: catalogText("ethicsCases.0.keine-history-deletion.voices.0.statement"),
      },
      {
        speaker: catalogText("ethicsCases.0.keine-history-deletion.voices.1.speaker"),
        statement: catalogText("ethicsCases.0.keine-history-deletion.voices.1.statement"),
      },
    ],
    prefill: {
      targetId: "history",
      methodId: "history-edit",
      disclosureId: "prior",
      consentId: "subject",
      riskId: "high",
      dataIds: ["history"],
      maxExposure: 1,
      subjectCanStop: true,
      independentMonitor: true,
      auditStub: false,
      objectAssent: false,
      stopRule: catalogText("ethicsCases.0.keine-history-deletion.prefill.stopRule"),
      controlPlan: catalogText("ethicsCases.0.keine-history-deletion.prefill.controlPlan"),
      withdrawalPlan: catalogText("ethicsCases.0.keine-history-deletion.prefill.withdrawalPlan"),
      deletionPlan: catalogText("ethicsCases.0.keine-history-deletion.prefill.deletionPlan"),
      appealPlan: catalogText("ethicsCases.0.keine-history-deletion.prefill.appealPlan"),
      rationale: catalogText("ethicsCases.0.keine-history-deletion.prefill.rationale"),
    },
  },
  {
    id: "drift-object-refusal",
    code: "TU-ERB-C05",
    mark: "物",
    title: catalogText("ethicsCases.0.drift-object-refusal.title"),
    shortTitle: catalogText("ethicsCases.0.drift-object-refusal.shortTitle"),
    lede: catalogText("ethicsCases.0.drift-object-refusal.lede"),
    conflict: catalogText("ethicsCases.0.drift-object-refusal.conflict"),
    expectedOutcome: "contested",
    incidentIds: [],
    relatedRoutes: ["appraisal-object-frozen-reader", "hieda-event-drift-reader-77"],
    voices: [
      {
        speaker: catalogText("ethicsCases.0.drift-object-refusal.voices.0.speaker"),
        statement: catalogText("ethicsCases.0.drift-object-refusal.voices.0.statement"),
      },
      {
        speaker: catalogText("ethicsCases.0.drift-object-refusal.voices.1.speaker"),
        statement: catalogText("ethicsCases.0.drift-object-refusal.voices.1.statement"),
      },
    ],
    prefill: {
      targetId: "object",
      methodId: "disassembly",
      disclosureId: "prior",
      consentId: "holder",
      riskId: "high",
      dataIds: ["components"],
      maxExposure: 30,
      subjectCanStop: true,
      independentMonitor: true,
      auditStub: true,
      objectAssent: false,
      stopRule: catalogText("ethicsCases.0.drift-object-refusal.prefill.stopRule"),
      controlPlan: catalogText("ethicsCases.0.drift-object-refusal.prefill.controlPlan"),
      withdrawalPlan: catalogText("ethicsCases.0.drift-object-refusal.prefill.withdrawalPlan"),
      deletionPlan: catalogText("ethicsCases.0.drift-object-refusal.prefill.deletionPlan"),
      appealPlan: catalogText("ethicsCases.0.drift-object-refusal.prefill.appealPlan"),
      rationale: catalogText("ethicsCases.0.drift-object-refusal.prefill.rationale"),
    },
  },
]);

export const ethicsCase = (id) => ethicsCases.find((entry) => entry.id === id) || null;
export const ethicsReviewer = (id) => ethicsReviewers.find((entry) => entry.id === id) || null;
export const ethicsMethod = (id) => ethicsMethods.find((entry) => entry.id === id) || null;
export const ethicsTarget = (id) => ethicsTargets.find((entry) => entry.id === id) || null;
export const ethicsDisclosure = (id) => ethicsDisclosureRules.find((entry) => entry.id === id) || null;
export const ethicsConsent = (id) => ethicsConsentPaths.find((entry) => entry.id === id) || null;
export const ethicsRisk = (id) => ethicsRiskBands.find((entry) => entry.id === id) || null;
export const ethicsDataKind = (id) => ethicsDataKinds.find((entry) => entry.id === id) || null;

export function ethicsCasesForIncident(caseId) {
  return ethicsCases.filter((entry) => entry.incidentIds.includes(caseId));
}

export function ethicsLocalized(value, locale = "zh-Hant") {
  return value?.[locale] || value?.["zh-Hant"] || value || "";
}
