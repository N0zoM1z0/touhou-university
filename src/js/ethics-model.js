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
const l = (zhHant, ja, en) => ({ "zh-Hant": zhHant, ja, en });

const findingCopy = {
  eirin: {
    clear: l("風險上限、停止權與暴露長度可以在現場辨認。", "リスク上限・停止権・曝露時間を現場で識別できる。", "Risk ceiling, stopping authority, and exposure duration are identifiable in the field."),
    noStop: l("停止權仍在研究者手裡；受影響者先感到不適時，規則沒有立即出口。", "停止権が研究者側に残る。参加者が先に異常を感じても即時の出口がない。", "Stopping power remains with the researcher; participants have no immediate exit when they notice harm first."),
    zeroDose: l("『外部零分鐘』不是可用劑量。請另設不依賴被停止時鐘的暴露計量。", "「外部0分」は用量ではない。停止した時計に依存しない曝露測定が必要。", "“Zero outside minutes” is not a usable dose. Define exposure without relying on the stopped clock."),
    weakStop: l("停止條件必須早於傷害，而不是等出口消失、背板裂開或畫面熄滅才生效。", "停止条件は害より前に働くこと。出口消失・背板破損・画面消灯を待ってはならない。", "Stopping must occur before harm, not after an exit vanishes, a panel cracks, or a display dies."),
    highRisk: l("高風險方法可送審，但劑量上限與停止紀錄必須逐次留下。", "高リスク方法は審査可能だが、用量上限と停止記録を逐次残すこと。", "High-risk methods may proceed, but dose ceilings and every stop decision must be recorded."),
  },
  satori: {
    clear: l("精神資料的讀取邊界、告知時點與撤回方式可以分開辨認。", "精神情報の読取境界・説明時点・撤回方法を別々に識別できる。", "The boundary of mental access, timing of disclosure, and withdrawal route are separately identifiable."),
    covert: l("波長、讀心或夢境干預不能只靠事後告知取得同意；盲測需求不會自動成為讀取許可。", "波長・読心・夢介入は事後説明だけで同意にならない。盲検の必要性は読取許可を生まない。", "Wavelength, mind-reading, and dream interventions cannot obtain consent only afterward; blinding does not create permission to access."),
    noNotes: l("沒有落筆仍是資訊處理：它已改變追問、判斷或他人的處置。", "記録しなくても情報処理であり、追問・判断・他者の処置を変えている。", "No written note is still information processing when it changes questions, judgments, or actions."),
    deletion: l("請說明如何刪除由精神內容推得的判斷，而不只刪除原句。", "精神内容から導いた判断をどう削除するか。原文削除だけでは足りない。", "Explain how inferences made from mental content are deleted, not only the original words."),
  },
  keine: {
    clear: l("原文、訂正痕跡與刪除收據各有位置，沒有互相冒充。", "原文・訂正痕跡・削除受領票が別々の位置にあり、互いになりすまさない。", "Original content, correction traces, and deletion receipts occupy separate places without impersonating one another."),
    noReceipt: l("若連刪除曾發生的證明也消失，當事人將無法證明撤回被受理；此席保留異議。", "削除が行われた証明まで消すと、撤回受理を立証できない。本席は異議を留保する。", "If proof of deletion also vanishes, the participant cannot prove withdrawal was honored; this seat records dissent."),
    retention: l("匿名統計若仍能被版本、日期或事件索引重新連回當事人，就不是完整分離。", "匿名統計が版・日付・事案索引から本人へ戻れるなら、分離は不完全。", "Anonymous statistics are not separated if versions, dates, or event indexes can reconnect them to a participant."),
  },
  eiki: {
    clear: l("同意、責任與申訴不由同一扇門單方面控制。", "同意・責任・不服申立てを同じ窓口が一方的に支配していない。", "Consent, responsibility, and appeal are not unilaterally controlled by one gate."),
    noConsent: l("沒有同意的研究不能以『事後可以道歉』代替開始前的權利。", "同意のない研究は「後で謝れる」を開始前の権利の代わりにできない。", "A study without consent cannot replace rights before participation with an apology afterward."),
    objectRefusal: l("持有人同意與物品拒絕同時有效。所有權沒有把後者擦掉；本席要求以爭議案保存。", "所有者の同意と物の拒否は同時に有効。所有権は後者を消さない。係争案件として保存を求める。", "Holder consent and object refusal are both operative. Ownership does not erase the latter; retain this as contested."),
    weakAppeal: l("申訴不能只回到主持研究或主張所有權的同一窗口。", "不服申立てを研究責任者や所有権主張者と同じ窓口だけへ戻してはならない。", "Appeal cannot return only to the same desk running the study or claiming ownership."),
    proxy: l("代理同意必須保留當事人自己的停止與撤回權。", "代理同意でも本人の停止権・撤回権を残すこと。", "Proxy consent must retain the subject's own rights to stop and withdraw."),
  },
  reimu: {
    clear: l("現場人員能在一口氣內說完規則、停止訊號與退路。", "現場担当者が一息で規則・停止合図・退路を説明できる。", "Field staff can state the rule, stop signal, and exit in one breath."),
    noWitness: l("時間、波長或歷史被能力改動時，至少要有一個不依賴同一能力的見證方式。", "時間・波長・歴史を能力で変えるなら、同じ能力に依存しない立会方法が必要。", "When ability alters time, wavelength, or history, at least one witness must not depend on that same ability."),
    noExit: l("研究對象不能自己停下，就不算有退路；『去找窗口』不是現場停止訊號。", "対象者自身が止められないなら退路ではない。「窓口へ行く」は現場停止合図にならない。", "If the subject cannot stop the procedure, there is no exit; “visit the desk” is not a field stop signal."),
    erasedRule: l("一條執行後會刪除自己與申訴證明的規則，不能證明自己曾被遵守；保留異議。", "実行後に自分と申立て証明を消す規則は、守られたことを証明できない。異議を留保する。", "A rule that deletes itself and proof of appeal cannot show it was followed; dissent is recorded."),
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
      l("增加一個不依賴外部鐘面的最大操作次數或內部時序上限。", "外部時計に依存しない最大操作回数・内部順序上限を追加。", "Add a maximum operation count or internal sequence limit independent of outside clocks."),
    ]);
  }
  if (draft.stopRule.length < 12) {
    return opinion("eirin", "revise", "weakStop", [
      l("把最早可觀察的不良訊號與負責喊停的人寫進同一句。", "最初に観察できる有害兆候と停止担当者を同じ文に記す。", "Put the earliest observable harm signal and the person who stops the study in one rule."),
    ]);
  }
  if (draft.riskId === "high" && !draft.subjectCanStop) {
    return opinion("eirin", "revise", "noStop", [
      l("研究對象必須有不經研究者批准即可使用的停止訊號。", "研究対象が研究者の許可なく使える停止合図を設ける。", "Give subjects a stop signal usable without researcher approval."),
    ]);
  }
  if (draft.riskId === "high") {
    return opinion("eirin", "conditional", "highRisk", [
      l("每次能力介入都記錄開始、停止、暴露上限與提前中止原因。", "能力介入ごとに開始・停止・上限・早期中止理由を記録。", "Record start, stop, ceiling, and early-termination reason for every intervention."),
    ]);
  }
  return opinion("eirin", "approve", "clear");
}

function satoriOpinion(draft) {
  const mental = ["wave", "mind-read", "dream"].includes(draft.methodId);
  const subjectConsent = ["subject", "both", "community", "proxy"].includes(draft.consentId);
  if (mental && (!subjectConsent || ["after", "none"].includes(draft.disclosureId))) {
    return opinion("satori", "revise", "covert", [
      l("至少事前說明會使用能力、可能讀取的範圍與拒絕後不受損失。", "能力使用・読取範囲・拒否による不利益なしを事前説明。", "Disclose ability use, scope of access, and penalty-free refusal before participation."),
    ]);
  }
  if (draft.methodId === "mind-read" && draft.dataIds.includes("thought")) {
    return opinion("satori", "conditional", "noNotes", [
      l("把『讀取但不落筆』列為一次資料處理，並允許當事人要求推論失效。", "「読取・非記録」を情報処理として記録し、推論の無効化請求を認める。", "Record read-without-writing as processing and allow subjects to invalidate resulting inferences."),
    ]);
  }
  if (draft.dataIds.includes("thought") && draft.deletionPlan.length < 18) {
    return opinion("satori", "conditional", "deletion", [
      l("補寫衍生判斷、標籤與追問紀錄的刪除方式。", "派生判断・ラベル・追問記録の削除方法を追記。", "Add deletion rules for derived judgments, labels, and follow-up questions."),
    ]);
  }
  return opinion("satori", "approve", "clear");
}

function keineOpinion(draft) {
  if (draft.methodId === "history-edit" && !draft.auditStub) {
    return opinion("keine", "contested", "noReceipt", [
      l("只保留一張不含原文的撤回收據：誰提出、何時受理、哪個版本不再可用。", "原文を含まない撤回受領票だけを残す：申請者・受理時刻・無効版。", "Retain a content-free withdrawal receipt: requester, acceptance time, and invalidated version."),
    ]);
  }
  if (draft.dataIds.includes("history") && draft.deletionPlan.length < 18) {
    return opinion("keine", "conditional", "retention", [
      l("列出匿名統計可能重新連回當事人的日期、版本與事件索引。", "匿名統計から本人へ戻り得る日付・版・事案索引を列挙。", "List dates, versions, and event indexes that could reconnect anonymous statistics to a subject."),
    ]);
  }
  return opinion("keine", "approve", "clear");
}

function eikiOpinion(draft) {
  if (draft.consentId === "none") {
    return opinion("eiki", "revise", "noConsent", [
      l("在任何能力介入前取得可拒絕、可撤回且不減損服務的同意。", "能力介入前に、拒否・撤回可能でサービス不利益のない同意を得る。", "Obtain refusal- and withdrawal-capable consent without loss of services before intervention."),
    ]);
  }
  if (draft.targetId === "object" && (!draft.objectAssent || draft.consentId === "holder")) {
    return opinion("eiki", "contested", "objectRefusal", [
      l("不可逆操作必須同時取得持有人與物品／付喪神的同意；任一方拒絕即改用非侵入檢查。", "不可逆操作は所有者と物／付喪神双方の同意が必要。一方が拒否すれば非侵入検査へ。", "Irreversible work requires both holder and object/tsukumogami consent; either refusal triggers non-invasive methods."),
    ]);
  }
  if (draft.appealPlan.length < 18 || ["holder", "proxy"].includes(draft.consentId)) {
    return opinion("eiki", "conditional", draft.consentId === "proxy" ? "proxy" : "weakAppeal", [
      l("指定一名不主持研究、不主張所有權的獨立申訴人。", "研究責任者でも所有権主張者でもない独立申立人を指定。", "Name an independent advocate who neither runs the study nor claims ownership."),
    ]);
  }
  return opinion("eiki", "approve", "clear");
}

function reimuOpinion(draft) {
  if (["time-stop", "wave", "history-edit"].includes(draft.methodId) && !draft.independentMonitor) {
    return opinion("reimu", "revise", "noWitness", [
      l("準備一個不靠同一能力運作的鐘、標記人或紙面計數器。", "同じ能力に依存しない時計・立会人・紙の計数器を用意。", "Provide a clock, witness, or paper counter that does not rely on the same ability."),
    ]);
  }
  if (draft.methodId === "history-edit" && !draft.auditStub) {
    return opinion("reimu", "contested", "erasedRule", [
      l("規則可以刪內容，不能把自己曾經生效與如何申訴一併刪掉。", "規則は内容を消しても、自らの発効と申立方法まで消してはならない。", "The rule may delete content, not its own operation and the route of appeal."),
    ]);
  }
  if (!draft.subjectCanStop) {
    return opinion("reimu", "conditional", "noExit", [
      l("把一句話的停止口令直接印在參與說明與現場告示上。", "一文の停止合図を参加説明と現場掲示へ直接印刷。", "Print a one-sentence stop signal on both participation instructions and the field notice."),
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

const communityCopy = {
  "zh-Hant": {
    aya: "文文。研究許可速報",
    minority: "研究倫理委員會・少數意見欄",
    withdrew: "訂正：申請人已撤回本案；先前審查仍留作版本記錄。",
    headline: "倫理案卷完成五席審查",
    conditions: "五席沒有平均；紅字條件與少數意見仍各自有效。",
    noDissent: "本輪沒有少數異議，但每席條件仍分開保存。",
  },
  ja: {
    aya: "文々。研究許可速報",
    minority: "研究倫理委員会・少数意見欄",
    withdrew: "訂正：申請者が本件を取り下げた。先の審査は版記録として残る。",
    headline: "倫理案件、五席審査を完了",
    conditions: "五席は平均されず、赤字条件と少数意見はそれぞれ有効。",
    noDissent: "今回は少数異議なし。ただし各席条件は別々に保存。",
  },
  en: {
    aya: "Bunbunmaru Research Permit Extra",
    minority: "Research Ethics Board · Minority Opinions",
    withdrew: "Correction: the applicant withdrew this file; the earlier review remains as version history.",
    headline: "Ethics file completes five-seat review",
    conditions: "The five seats were not averaged; red-letter conditions and minority opinions remain independently operative.",
    noDissent: "No minority dissent this round; every seat's conditions remain separately recorded.",
  },
};

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
