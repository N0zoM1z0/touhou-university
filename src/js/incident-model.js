import {
  incidentById,
  incidentCases,
  incidentRetentionReasons,
  incidentRetentionReviewers,
} from "../data/incidents.js";

const WORKBENCH_KEY = "tu:incidents:workbench";
const EXPERIMENT_KEY = "tu:incidents:experiments";
const RESOLUTION_KEY = "tu:incidents:resolutions";
const MAX_EXPERIMENTS = 80;

function readJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function unique(values, allowed = null) {
  const filtered = Array.isArray(values) ? values.filter((value) => typeof value === "string") : [];
  const result = [...new Set(filtered)];
  return allowed ? result.filter((value) => allowed.has(value)) : result;
}

function hashValue(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableNoise(seed, amplitude) {
  const unit = (hashValue(seed) % 10_001) / 10_000;
  return (unit * 2 - 1) * amplitude;
}

function emitChange(detail) {
  window.dispatchEvent(new CustomEvent("tu:incidentchange", { detail }));
}

function normalizeCaseState(caseId, value = {}) {
  const incident = incidentById(caseId);
  const evidence = new Set(incident?.evidence.map((item) => item.id) || []);
  const testimony = new Set(incident?.testimony.map((item) => item.id) || []);
  const hypotheses = new Set(incident?.hypotheses.map((item) => item.id) || []);
  const actions = new Set(incident?.actions.map((item) => item.id) || []);
  return {
    reviewedEvidence: unique(value.reviewedEvidence, evidence),
    reviewedTestimony: unique(value.reviewedTestimony, testimony),
    selectedHypothesis: hypotheses.has(value.selectedHypothesis) ? value.selectedHypothesis : null,
    selectedActions: unique(value.selectedActions, actions).slice(0, 2),
    updatedAt: value.updatedAt || null,
  };
}

export function incidentWorkbench() {
  const stored = readJson(WORKBENCH_KEY, {});
  const cases = stored?.cases && typeof stored.cases === "object" ? stored.cases : {};
  return {
    schema: 1,
    cases: Object.fromEntries(
      incidentCases.map((incident) => [incident.id, normalizeCaseState(incident.id, cases[incident.id])]),
    ),
  };
}

export function incidentCaseState(caseId) {
  return incidentWorkbench().cases[caseId] || normalizeCaseState(caseId);
}

export function updateIncidentCase(caseId, patch = {}) {
  if (!incidentById(caseId)) return null;
  const workbench = incidentWorkbench();
  const current = workbench.cases[caseId];
  const next = normalizeCaseState(caseId, {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
  workbench.cases[caseId] = next;
  writeJson(WORKBENCH_KEY, workbench);
  emitChange({ type: "workbench", caseId });
  return next;
}

export function toggleIncidentEvidence(caseId, evidenceId) {
  const current = incidentCaseState(caseId);
  const values = new Set(current.reviewedEvidence);
  if (values.has(evidenceId)) values.delete(evidenceId);
  else values.add(evidenceId);
  return updateIncidentCase(caseId, { reviewedEvidence: [...values] });
}

export function toggleIncidentTestimony(caseId, testimonyId) {
  const current = incidentCaseState(caseId);
  const values = new Set(current.reviewedTestimony);
  if (values.has(testimonyId)) values.delete(testimonyId);
  else values.add(testimonyId);
  return updateIncidentCase(caseId, { reviewedTestimony: [...values] });
}

export function selectIncidentHypothesis(caseId, hypothesisId) {
  return updateIncidentCase(caseId, { selectedHypothesis: hypothesisId });
}

export function toggleIncidentAction(caseId, actionId) {
  const current = incidentCaseState(caseId);
  const values = current.selectedActions.slice();
  const index = values.indexOf(actionId);
  if (index >= 0) values.splice(index, 1);
  else if (values.length < 2) values.push(actionId);
  else return { ...current, limitReached: true };
  return updateIncidentCase(caseId, { selectedActions: values });
}

export function incidentExperiments() {
  const records = readJson(EXPERIMENT_KEY, []);
  return Array.isArray(records) ? records.filter((record) => incidentById(record?.caseId)) : [];
}

export function incidentResolutions() {
  const records = readJson(RESOLUTION_KEY, []);
  return Array.isArray(records) ? records.filter((record) => incidentById(record?.caseId)) : [];
}

export function resolutionForCase(caseId) {
  return incidentResolutions().findLast((record) => record.caseId === caseId) || null;
}

function actionReduction(incident, state) {
  return state.selectedActions.reduce((totals, actionId) => {
    const effects = incident.actions.find((item) => item.id === actionId)?.effects || {};
    Object.entries(effects).forEach(([key, value]) => {
      totals[key] = (totals[key] || 0) + finite(value);
    });
    return totals;
  }, {});
}

export function normalizeExperimentDesign(value = {}) {
  const allowedSamples = [12, 24, 48, 96];
  const requestedSample = finite(value.sampleSize, 24);
  const sampleSize = allowedSamples.includes(requestedSample) ? requestedSample : 24;
  return {
    sampleSize,
    repeats: Math.min(4, Math.max(1, Math.round(finite(value.repeats, 1)))),
    control: Boolean(value.control),
    randomize: Boolean(value.randomize),
    calibration: Boolean(value.calibration),
    versionLock: Boolean(value.versionLock),
  };
}

function designQuality(design) {
  const sample = { 12: 5, 24: 10, 48: 16, 96: 20 }[design.sampleSize];
  return Math.min(
    100,
    15
      + sample
      + design.repeats * 4
      + (design.control ? 15 : 0)
      + (design.randomize ? 12 : 0)
      + (design.calibration ? 14 : 0)
      + (design.versionLock ? 14 : 0),
  );
}

export function runIncidentExperiment(caseId, hypothesisId, requestedDesign = {}) {
  const incident = incidentById(caseId);
  const hypothesis = incident?.hypotheses.find((item) => item.id === hypothesisId);
  if (!incident || !hypothesis) return null;
  const state = incidentCaseState(caseId);
  const design = normalizeExperimentDesign(requestedDesign);
  const reductions = actionReduction(incident, state);
  const priorCount = incidentExperiments().filter((record) => record.caseId === caseId).length;
  const residualConfound = Math.max(0, incident.simulation.confound + finite(reductions.confound))
    * (design.control ? 0.18 : 1)
    * (design.randomize ? 0.65 : 1);
  const residualDrift = Math.max(0, incident.simulation.drift + finite(reductions.drift))
    * (design.calibration ? 0.15 : 1);
  const residualVersion = Math.max(0, incident.simulation.version + finite(reductions.version))
    * (design.versionLock ? 0.1 : 1);
  const residualMissing = Math.max(
    1,
    incident.simulation.missing
      + finite(reductions.missing)
      - (design.randomize ? 3 : 0)
      - (design.sampleSize >= 48 ? 3 : 0)
      - (design.repeats - 1) * 1.5,
  );
  const quality = designQuality(design);
  const isTruth = hypothesisId === incident.truthHypothesis;
  const trueEffect = incident.simulation.baseline * (isTruth ? 1 : 0.18);
  const seed = `${caseId}:${hypothesisId}:${JSON.stringify(design)}:${priorCount}`;
  const direction = hashValue(`${seed}:direction`) % 2 ? 1 : -1;
  const noiseAmplitude = 13 * Math.sqrt(24 / design.sampleSize) / Math.sqrt(design.repeats);
  const observed = trueEffect
    + direction * residualConfound * 0.54
    + stableNoise(`${seed}:drift`, residualDrift * 0.55)
    + stableNoise(`${seed}:version`, residualVersion * 0.6)
    + stableNoise(`${seed}:noise`, noiseAmplitude)
    - residualMissing * 0.08;
  const interval = Math.max(
    2.2,
    18 * Math.sqrt(24 / design.sampleSize) / Math.sqrt(design.repeats) + residualMissing * 0.16,
  );
  const hazards = [
    ...(!design.control || residualConfound > 5 ? ["confounding"] : []),
    ...(!design.calibration || residualDrift > 4 ? ["drift"] : []),
    ...(residualMissing > 6 ? ["missing"] : []),
    ...(!design.versionLock || residualVersion > 4 ? ["version"] : []),
  ];
  let verdict = "inconclusive";
  if (quality >= 68 && isTruth) verdict = "supports";
  else if (quality >= 68 && !isTruth) verdict = "rejects";
  else if (quality < 48 && Math.abs(observed) > incident.simulation.baseline * 0.72) verdict = "false-confidence";
  const createdAt = new Date().toISOString();
  const id = `TU-EX-${hashValue(`${seed}:${createdAt}`).toString(36).toUpperCase().padStart(7, "0").slice(-7)}`;
  const record = {
    schema: 1,
    id,
    caseId,
    hypothesisId,
    actionIds: state.selectedActions,
    design,
    quality,
    observed: Math.round(observed * 10) / 10,
    interval: Math.round(interval * 10) / 10,
    residuals: {
      confounding: Math.round(residualConfound * 10) / 10,
      drift: Math.round(residualDrift * 10) / 10,
      missing: Math.round(residualMissing * 10) / 10,
      version: Math.round(residualVersion * 10) / 10,
    },
    hazards: [...new Set(hazards)],
    verdict,
    createdAt,
  };
  const records = incidentExperiments();
  records.push(record);
  writeJson(EXPERIMENT_KEY, records.slice(-MAX_EXPERIMENTS));
  emitChange({ type: "experiment", caseId, id });
  return record;
}

export function resolveIncident(caseId, experimentId, options = {}) {
  const existing = resolutionForCase(caseId);
  if (existing) return { record: existing, alreadyResolved: true };
  const incident = incidentById(caseId);
  const state = incidentCaseState(caseId);
  const experiment = incidentExperiments().find((record) => record.id === experimentId && record.caseId === caseId);
  const established = experiment?.quality >= 60 && experiment?.verdict === "supports";
  const contested = Boolean(
    experiment
    && !established
    && options.retainContested === true
    && options.confirmed === true
    && incidentRetentionReviewers[options.reviewerId]
    && incidentRetentionReasons[options.retentionReason],
  );
  if (!incident || !experiment || !state.selectedActions.length || (!established && !contested)) {
    return { error: "not-ready" };
  }
  const resolvedAt = new Date().toISOString();
  const id = `TU-RC-${hashValue(`${caseId}:${experiment.id}`).toString(36).toUpperCase().padStart(6, "0").slice(-6)}`;
  const record = {
    schema: 1,
    id,
    caseId,
    caseCode: incident.code,
    hypothesisId: experiment.hypothesisId,
    actionIds: state.selectedActions,
    experimentId: experiment.id,
    quality: experiment.quality,
    verdict: experiment.verdict,
    disposition: contested ? "contested" : "established",
    reviewerId: contested ? options.reviewerId : null,
    retentionReason: contested ? options.retentionReason : null,
    confirmedContested: contested,
    resolvedAt,
    status: "resolved",
  };
  const records = incidentResolutions();
  records.push(record);
  writeJson(RESOLUTION_KEY, records);
  emitChange({ type: "resolution", caseId, id });
  return { record, alreadyResolved: false };
}

function interpolate(value, fields) {
  return String(value).replace(/\{(\w+)\}/g, (_, name) => fields[name] ?? `{${name}}`);
}

export function incidentCommunityPosts(locale) {
  return incidentResolutions()
    .slice()
    .reverse()
    .flatMap((resolution) => {
      const incident = incidentById(resolution.caseId);
      const hypothesis = incident?.hypotheses.find((item) => item.id === resolution.hypothesisId);
      const action = incident?.actions.find((item) => item.id === resolution.actionIds[0]);
      if (!incident || !hypothesis || !action) return [];
      const contested = resolution.disposition === "contested";
      const reviewer = incidentRetentionReviewers[resolution.reviewerId];
      const reason = incidentRetentionReasons[resolution.retentionReason];
      const contestedFinding = {
        "zh-Hant": `未獲支持但保留：${hypothesis.title["zh-Hant"]}`,
        ja: `支持されず保存：${hypothesis.title.ja}`,
        en: `Not supported, but retained: ${hypothesis.title.en}`,
      };
      const contestedNotice = contested
        ? {
            "zh-Hant": `【紅線爭議案卷】模擬結果為「${resolution.verdict}」，沒有證實這項主張。${reviewer?.name?.["zh-Hant"] || "審閱席"}仍以「${reason?.["zh-Hant"] || "保留異說"}」簽名保存。`,
            ja: `【赤糸係争記録】模擬結果は「${resolution.verdict}」で、この主張は立証されていない。${reviewer?.name?.ja || "査読席"}が「${reason?.ja || "異説保存"}」として署名保存した。`,
            en: `【RED-THREAD CONTESTED FILE】The simulation returned “${resolution.verdict}” and did not establish this claim. ${reviewer?.name?.en || "A reviewer"} signed to retain it as “${reason?.en || "a preserved dissent"}.”`,
          }[locale]
        : "";
      const fields = {
        finding: contested ? contestedFinding[locale] : hypothesis.title[locale],
        action: action.title[locale],
        quality: resolution.quality,
        ref: resolution.id,
      };
      const posts = incident.reactions.map((reaction, index) => ({
        id: `incident-${resolution.id.toLowerCase()}-${index + 1}`,
        incidentId: incident.id,
        resolutionId: resolution.id,
        category: reaction.category,
        author: reaction.author[locale],
        title: interpolate(reaction.title[locale], fields),
        body: interpolate(reaction.body[locale], fields),
        replies: 3 + (hashValue(`${resolution.id}:${index}`) % 47),
        createdAt: new Date(new Date(resolution.resolvedAt).getTime() + index * 90_000).toISOString(),
        generated: true,
        contested,
      }));
      return posts.map((post) => ({
        ...post,
        body: contestedNotice ? `${contestedNotice}\n\n${post.body}` : post.body,
      }));
    });
}

export function incidentCommunityNews() {
  return incidentResolutions()
    .slice()
    .reverse()
    .map((resolution) => {
      const incident = incidentById(resolution.caseId);
      const hypothesis = incident?.hypotheses.find((item) => item.id === resolution.hypothesisId);
      const action = incident?.actions.find((item) => item.id === resolution.actionIds[0]);
      if (!incident || !hypothesis || !action) return null;
      const contested = resolution.disposition === "contested";
      const reviewer = incidentRetentionReviewers[resolution.reviewerId];
      const reason = incidentRetentionReasons[resolution.retentionReason];
      const date = new Date(resolution.resolvedAt);
      const stamp = Number.isNaN(date.getTime())
        ? "NOW"
        : `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
      return {
        id: `incident-news-${resolution.id.toLowerCase()}`,
        date: stamp,
        incidentId: incident.id,
        category: {
          "zh-Hant": contested ? "爭議性結案" : "事件結案",
          ja: contested ? "係争終結" : "事案終結",
          en: contested ? "Contested closure" : "Case closed",
        },
        title: {
          "zh-Hant": `${incident.code} ${contested ? "紅線保留" : "結案"}：${hypothesis.title["zh-Hant"]}`,
          ja: `${incident.code} ${contested ? "赤糸保存" : "終結"}：${hypothesis.title.ja}`,
          en: `${incident.code} ${contested ? "retained under red thread" : "closed"}: ${hypothesis.title.en}`,
        },
        summary: {
          "zh-Hant": contested
            ? `研究模擬分辨度 ${resolution.quality}/100，結果為「${resolution.verdict}」，並未證實主張；${reviewer?.name?.["zh-Hant"] || "審閱席"}仍以「${reason?.["zh-Hant"] || "保留異說"}」簽名。BBS 已開始質疑這算結案還是裝訂。`
            : `研究模擬分辨度 ${resolution.quality}/100；先行措施為「${action.title["zh-Hant"]}」。結案沒有阻止相關人士繼續在 BBS 爭論。`,
          ja: contested
            ? `研究シミュレーション識別度 ${resolution.quality}/100、結果は「${resolution.verdict}」で主張は未立証。${reviewer?.name?.ja || "査読席"}が「${reason?.ja || "異説保存"}」として署名。BBSでは終結か製本かを議論中。`
            : `研究シミュレーションの識別度は ${resolution.quality}/100。先行措置は「${action.title.ja}」。終結後も関係者は BBS で議論中。`,
          en: contested
            ? `The simulation reached ${resolution.quality}/100 and returned “${resolution.verdict}”; the claim was not established. ${reviewer?.name?.en || "A reviewer"} signed it under “${reason?.en || "preserved dissent"}”. The BBS is debating whether this is closure or bookbinding.`
            : `The research simulation reached ${resolution.quality}/100 identifiability. The first response is “${action.title.en}”. Closure has not stopped the BBS argument.`,
        },
      };
    })
    .filter(Boolean);
}

export const incidentStorageKeys = {
  workbench: WORKBENCH_KEY,
  experiments: EXPERIMENT_KEY,
  resolutions: RESOLUTION_KEY,
};
