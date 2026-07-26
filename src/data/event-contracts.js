const locales = ["zh-Hant", "ja", "en"];
const l = (zhHant, ja, en) => ({ "zh-Hant": zhHant, ja, en });

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
  define("identity.created", l("建立本機校園身分", "端末内キャンパス身分を作成", "Created on-device campus identity"), {
    subject: by("identity", "identityId"), required: ["identityId"],
    references: related(["school", "preferredSchool"]),
  }),
  define("identity.updated", l("更新本機身分資料", "端末内身分情報を更新", "Updated on-device identity"), {
    subject: by("identity", "identityId"), required: ["identityId"], causedBy: ["identity.created", "identity.updated"],
    references: related(["school", "preferredSchool"]),
  }),
  define("application.submitted", l("提交入學申請", "入学出願を提出", "Submitted an application"), {
    subject: by("application", "applicationId"), required: ["applicationId"], references: related(["school", "school"]),
  }),
  define("application.reviewed", l("完成教授聯合審查", "教員合同審査を完了", "Completed joint faculty review"), {
    subject: by("application", "applicationId"), required: ["applicationId", "reviewId"],
    causedBy: ["application.submitted"], references: related(["review", "reviewId"], ["school", "school"]),
  }),
  define("application.deleted", l("從本機申請檔案移除記錄", "端末内出願ファイルから記録を削除", "Removed a record from the on-device application file"), {
    subject: by("application", "applicationId"), required: ["applicationId"],
    causedBy: ["application.reviewed", "application.submitted"],
  }),
  define("visit.reserved", l("登記進校預約", "来校予約を登録", "Reserved a campus visit"), {
    subject: by("visit", "visitId"), required: ["visitId"], references: related(["campus-route", "route"]),
  }),
  define("visit.deleted", l("從本機預約檔案移除記錄", "端末内予約ファイルから記録を削除", "Removed a record from the on-device visit file"), {
    subject: by("visit", "visitId"), required: ["visitId"], causedBy: ["visit.reserved"],
  }),
  define("exam.completed", l("完成入學試驗", "入学試験を完了", "Completed an entrance exam"), {
    subject: by("entrance-exam-attempt", "examId"), required: ["examId"], references: related(["exam-bank", "bankId"]),
  }),
  define("exam.deleted", l("從本機試驗檔案移除成績", "端末内試験ファイルから成績を削除", "Removed a score from the on-device entrance-exam file"), {
    subject: by("entrance-exam-attempt", "examId"), required: ["examId"], causedBy: ["exam.completed"],
  }),
  define("gaokao.completed", l("完成幻想鄉統一學力試驗", "幻想郷統一試験を完了", "Completed the Gensokyo unified exam"), {
    subject: by("unified-exam-attempt", "examId"), required: ["examId"],
    references: related(["difficulty", "difficultyId"], ["track", "trackId"]),
  }),
  define("gaokao.deleted", l("從本機統一試驗檔案移除成績", "端末内統一試験ファイルから成績を削除", "Removed a score from the on-device unified-exam file"), {
    subject: by("unified-exam-attempt", "examId"), required: ["examId"], causedBy: ["gaokao.completed"],
  }),
  define("bbs.posted", l("在校園 BBS 發帖", "学内 BBS へ投稿", "Published to Campus BBS"), {
    subject: by("bbs-post", "postId"), required: ["postId"], references: related(["bbs-board", "category"]),
  }),
  define("course.enrolled", l("加入本學期課表", "今学期の時間割へ追加", "Added a course to the term timetable"), {
    subject: courseReference, correlation: (payload) => `course:${courseReference(payload)?.id || ""}`,
    required: ["courseCode", "term"],
  }),
  define("course.waitlisted", l("加入課程候補", "科目補欠へ登録", "Joined a course waitlist"), {
    subject: courseReference, correlation: (payload) => `course:${courseReference(payload)?.id || ""}`,
    required: ["courseCode", "term"],
  }),
  define("course.dropped", l("退選本學期課程", "今学期の履修を取消", "Dropped a current course"), {
    subject: courseReference, correlation: (payload) => `course:${courseReference(payload)?.id || ""}`,
    required: ["courseCode", "term"], causedBy: ["course.enrolled"],
  }),
  define("course.waitlist.cancelled", l("取消課程候補", "科目補欠を取消", "Left a course waitlist"), {
    subject: courseReference, correlation: (payload) => `course:${courseReference(payload)?.id || ""}`,
    required: ["courseCode", "term"], causedBy: ["course.waitlisted"],
  }),
  define("book.borrowed", l("借出霧湖館藏", "霧の湖資料を貸出", "Borrowed library holding"), {
    subject: by("library-loan", "loanId"), required: ["loanId", "holdingId"],
    references: related(["library-holding", "holdingId"]),
  }),
  define("book.renewed", l("續借霧湖館藏", "霧の湖資料を更新", "Renewed library holding"), {
    subject: by("library-loan", "loanId"), required: ["loanId", "holdingId"], causedBy: ["book.borrowed", "book.renewed"],
    references: related(["library-holding", "holdingId"]),
  }),
  define("book.returned", l("歸還霧湖館藏", "霧の湖資料を返却", "Returned library holding"), {
    subject: by("library-loan", "loanId"), required: ["loanId", "holdingId"], causedBy: ["book.renewed", "book.borrowed"],
    references: related(["library-holding", "holdingId"]),
  }),
  define("book.held", l("預約霧湖館藏", "霧の湖資料を予約", "Placed library hold"), {
    subject: by("library-hold", "holdId"), required: ["holdId", "holdingId"],
    references: related(["library-holding", "holdingId"]),
  }),
  define("book.hold.cancelled", l("取消館藏預約", "資料予約を取消", "Cancelled library hold"), {
    subject: by("library-hold", "holdId"), required: ["holdId", "holdingId"], causedBy: ["book.held"],
    references: related(["library-holding", "holdingId"]),
  }),
  define("housing.application.submitted", l("提交住宿需求", "入寮希望を提出", "Submitted housing needs"), {
    subject: by("housing-application", "applicationId"), required: ["applicationId"],
    references: related(["residence", "firstResidence"], ["term", "term"]),
  }),
  define("housing.offer.declined", l("略過分房建議", "配室案を見送る", "Passed on a room offer"), {
    subject: by("housing-application", "applicationId"), required: ["applicationId", "offerId"],
    causedBy: ["housing.application.submitted", "housing.offer.declined"], references: related(["housing-offer", "offerId"]),
  }),
  define("housing.assignment.accepted", l("接受宿舍房間", "学生寮の部屋を受諾", "Accepted a residence room"), {
    subject: by("housing-assignment", "assignmentId"), required: ["assignmentId", "roomId"],
    correlation: (payload) => payload?.applicationId
      ? `housing-application:${payload.applicationId}`
      : `housing-assignment:${payload?.assignmentId || ""}`,
    causedBy: ["housing.application.submitted", "housing.offer.declined"],
    references: related(["housing-application", "applicationId"], ["housing-offer", "offerId"], ["housing-room", "roomId"], ["residence", "residenceId"]),
  }),
  define("housing.change.requested", l("提交換房請求", "転室依頼を提出", "Submitted a room-transfer request"), {
    subject: by("housing-change", "requestId"), required: ["requestId", "assignmentId"],
    correlation: (payload) => `housing-assignment:${payload?.assignmentId || ""}`,
    causedBy: ["housing.assignment.accepted"], references: related(["housing-assignment", "assignmentId"]),
  }),
  define("housing.change.cancelled", l("撤回換房請求", "転室依頼を撤回", "Withdrew a room-transfer request"), {
    subject: by("housing-change", "requestId"), required: ["requestId", "assignmentId"],
    correlation: (payload) => `housing-assignment:${payload?.assignmentId || ""}`,
    causedBy: ["housing.change.requested"], references: related(["housing-assignment", "assignmentId"]),
  }),
  define("incident.experiment.completed", l("完成事件研究模擬", "事案研究シミュレーションを完了", "Completed an incident research simulation"), {
    subject: by("incident-experiment", "experimentId"), required: ["experimentId", "caseId"],
    correlation: (payload) => `incident-case:${payload?.caseId || ""}`,
    references: related(["incident-case", "caseId"], ["incident-hypothesis", "hypothesisId"]),
  }),
  define("incident.resolved", l("結案並發布事件連動", "事案を終結し連動を公開", "Closed a case and published linked reactions"), {
    subject: by("incident-resolution", "resolutionId"), required: ["resolutionId", "caseId"],
    correlation: (payload) => `incident-case:${payload?.caseId || ""}`,
    causedBy: ["incident.experiment.completed"], references: related(["incident-case", "caseId"]),
  }),
  define("governance.vote.cast", l("投下本機校務議事票", "端末内学務議事票を投票", "Cast an on-device governance vote"), {
    subject: by("governance-vote", "voteId"), required: ["voteId", "proposalId"],
    references: related(["governance-proposal", "proposalId"], ["governance-choice", "choiceId"]),
  }),
  define("academic.assignment.graded", l("提交課程作業並完成判分", "授業課題を提出・採点", "Submitted and graded course work"), {
    subject: by("academic-submission", "submissionId"), required: ["submissionId", "assignmentId"],
    references: related(["assignment", "assignmentId"], ["course", "courseCode"]),
  }),
  define("academic.exam.started", l("開始限時課程考試", "計時授業試験を開始", "Started a timed course exam"), {
    subject: by("academic-exam-attempt", "attemptId"), required: ["attemptId", "examId"],
    references: related(["academic-exam", "examId"]),
  }),
  define("academic.exam.completed", l("完成限時課程考試", "計時授業試験を完了", "Completed a timed course exam"), {
    subject: by("academic-exam-attempt", "attemptId"), required: ["attemptId", "examId"],
    causedBy: ["academic.exam.started"], references: related(["academic-exam", "examId"]),
  }),
  define("academic.project.submitted", l("提交論文／符卡研究計畫", "論文／スペルカード研究計画を提出", "Submitted a thesis / spell-card project"), {
    subject: by("academic-project", "projectId"), required: ["projectId"],
    references: related(["academic-project-type", "projectType"]),
  }),
  define("academic.defence.completed", l("完成論文／符卡答辯", "論文／スペルカード答弁を完了", "Completed a thesis / spell-card defence"), {
    subject: by("academic-project", "projectId"), required: ["projectId", "defenceId"],
    causedBy: ["academic.project.submitted"], references: related(["academic-defence", "defenceId"]),
  }),
  define("clinic.visit.checked-in", l("完成校醫院分診掛號", "校医院トリアージ受付を完了", "Completed campus-hospital triage check-in"), {
    subject: by("clinic-visit", "visitId"), required: ["visitId"], references: related(["clinic-site", "siteId"]),
  }),
  define("clinic.consultation.completed", l("完成診察並開立處方", "診察完了・処方発行", "Completed consultation and received a prescription"), {
    subject: by("clinic-visit", "visitId"), required: ["visitId", "prescriptionId"],
    causedBy: ["clinic.visit.checked-in"], references: related(["clinic-prescription", "prescriptionId"], ["clinic-site", "siteId"]),
  }),
  define("clinic.prescription.dispensed", l("領取校醫院處方", "校医院処方を受取", "Collected a campus-hospital prescription"), {
    subject: by("clinic-prescription", "prescriptionId"), required: ["prescriptionId"],
    correlation: (payload) => payload?.visitId
      ? `clinic-visit:${payload.visitId}`
      : `clinic-prescription:${payload?.prescriptionId || ""}`,
    causedBy: ["clinic.consultation.completed"],
    references: related(["clinic-visit", "visitId"], ["clinic-medicine", "medicineIds"]),
  }),
  define("clinic.dose.recorded", l("記錄一次本機用藥", "端末内服用を一回記録", "Recorded one on-device dose"), {
    subject: doseReference, required: ["prescriptionId", "medicineId", "sequence"],
    correlation: (payload) => `clinic-prescription:${payload?.prescriptionId || ""}`,
    causedBy: ["clinic.prescription.dispensed", "clinic.dose.recorded"],
    references: related(["clinic-prescription", "prescriptionId"], ["clinic-medicine", "medicineId"], ["clinic-visit", "visitId"]),
  }),
  define("clinic.therapy.started", l("開始康復療法", "回復療法を開始", "Started a recovery therapy"), {
    subject: by("clinic-care-plan", "planId"), required: ["planId", "therapyId"],
    causedBy: ["clinic.consultation.completed"],
    references: related(["clinic-therapy", "therapyId"], ["clinic-visit", "visitId"]),
  }),
  define("clinic.therapy.step.completed", l("完成一項康復步驟", "回復段階を一つ完了", "Completed one recovery step"), {
    subject: by("clinic-care-plan", "planId"), required: ["planId", "therapyId", "step"],
    causedBy: ["clinic.therapy.started", "clinic.therapy.step.completed"],
    references: related(["clinic-therapy", "therapyId"], ["clinic-visit", "visitId"]),
  }),
  define("clinic.therapy.completed", l("完成康復療程", "回復療法を完了", "Completed a recovery course"), {
    subject: by("clinic-care-plan", "planId"), required: ["planId", "therapyId"],
    causedBy: ["clinic.therapy.step.completed", "clinic.therapy.started"],
    references: related(["clinic-therapy", "therapyId"], ["clinic-visit", "visitId"]),
  }),
  define("appraisal.completed", l("完成外界漂流物鑑定", "外界漂流物鑑定を完了", "Completed an Outside drift-object appraisal"), {
    subject: by("appraisal", "appraisalId"), required: ["appraisalId", "objectId"],
    references: related(["appraisal-object", "objectId"]),
  }),
  define("appraisal.catalogued", l("將漂流物編入霧湖館藏", "漂流物を霧の湖蔵書へ編入", "Catalogued a drift object at Misty Lake"), {
    subject: by("appraisal", "appraisalId"), required: ["appraisalId", "objectId"],
    causedBy: ["appraisal.completed"], references: related(["appraisal-object", "objectId"], ["appraisal-destination", "destinationId"]),
  }),
  define("spellcard.design.saved", l("封存一版符卡設計", "スペルカード設計版を保存", "Archived a spell-card design version"), {
    subject: by("spellcard-design", "designId"), required: ["designId"],
    references: related(["spell-pattern", "patternId"], ["spellcard-design", "revisionOf"]),
  }),
  define("spellcard.defence.completed", l("完成符卡公開答辯", "スペルカード公開答弁を完了", "Completed a public spell-card defence"), {
    subject: by("spellcard-design", "designId"), required: ["designId", "defenceId"],
    causedBy: ["spellcard.design.saved"], references: related(["spellcard-defence", "defenceId"]),
  }),
  define("festival.plan.submitted", l("提交祭典運營方案", "祭典運営案を提出", "Submitted a festival operations plan"), {
    subject: by("festival-plan", "planId"), required: ["planId", "kindId", "outcome"],
    references: related(["festival-kind", "kindId"]),
  }),
  define("festival.permit.issued", l("取得六桌祭典許可", "六机祭典許可を取得", "Received a six-desk festival permit"), {
    subject: by("festival-plan", "planId"), required: ["planId", "kindId", "outcome"],
    causedBy: ["festival.plan.submitted"],
    references: related(["festival-kind", "kindId"], ["festival-review-desk", "deskIds"]),
  }),
  define("festival.shift.started", l("敲鐘開祭並領取值班牌", "開祭鐘を鳴らし当番札を受取", "Rang the opening bell and took a duty badge"), {
    subject: by("festival-operation", "operationId"), required: ["operationId", "planId", "role"],
    correlation: (payload) => `festival-plan:${payload?.planId || ""}`,
    causedBy: ["festival.permit.issued"],
    references: related(["festival-plan", "planId"], ["festival-route", "routeId"]),
  }),
  define("festival.incident.resolved", l("處置一宗祭典現場事件", "祭典現場案件を処置", "Resolved a festival field case"), {
    subject: (payload) => reference("festival-incident-response", `${payload?.operationId || ""}:${payload?.incidentId || ""}`),
    required: ["operationId", "planId", "incidentId", "responseId"],
    correlation: (payload) => `festival-plan:${payload?.planId || ""}`,
    causedBy: ["festival.shift.started", "festival.incident.resolved"],
    references: related(["festival-operation", "operationId"], ["festival-response", "responseId"]),
  }),
  define("festival.report.closed", l("完成回收並封存結祭報告", "回収を終え閉祭報告を封印", "Completed recovery and filed the festival closing report"), {
    subject: by("festival-operation", "operationId"), required: ["operationId", "planId", "attendance"],
    correlation: (payload) => `festival-plan:${payload?.planId || ""}`,
    causedBy: ["festival.incident.resolved", "festival.shift.started"],
    references: related(["festival-plan", "planId"]),
  }),
  define("ethics.protocol.submitted", l("提交研究倫理計畫", "研究倫理計画を提出", "Submitted a research ethics protocol"), {
    subject: by("ethics-protocol", "protocolId"), required: ["protocolId", "rootProtocolId", "caseId"],
    correlation: (payload) => `ethics-protocol:${payload?.rootProtocolId || payload?.protocolId || ""}`,
    references: related(["ethics-case", "caseId"]),
  }),
  define("ethics.review.completed", l("完成五席研究倫理審查", "五席研究倫理審査を完了", "Completed five-seat research ethics review"), {
    subject: by("ethics-review", "reviewId"), required: ["protocolId", "rootProtocolId", "reviewId", "outcome"],
    correlation: (payload) => `ethics-protocol:${payload?.rootProtocolId || payload?.protocolId || ""}`,
    causedBy: ["ethics.protocol.submitted", "ethics.protocol.amended"],
    references: related(["ethics-protocol", "protocolId"], ["ethics-case", "caseId"], ["ethics-reviewer", "reviewerIds"]),
  }),
  define("ethics.protocol.amended", l("提交研究倫理修訂版", "研究倫理修正版を提出", "Submitted a research ethics amendment"), {
    subject: by("ethics-protocol", "protocolId"), required: ["protocolId", "rootProtocolId", "caseId", "revisionOf"],
    correlation: (payload) => `ethics-protocol:${payload?.rootProtocolId || payload?.protocolId || ""}`,
    causedBy: ["ethics.review.completed"],
    references: related(["ethics-protocol", "revisionOf"], ["ethics-case", "caseId"]),
  }),
  define("ethics.protocol.withdrawn", l("撤回研究倫理計畫", "研究倫理計画を取り下げ", "Withdrew a research ethics protocol"), {
    subject: by("ethics-protocol", "protocolId"), required: ["protocolId", "rootProtocolId", "caseId"],
    correlation: (payload) => `ethics-protocol:${payload?.rootProtocolId || payload?.protocolId || ""}`,
    causedBy: ["ethics.review.completed"],
    references: related(["ethics-case", "caseId"]),
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
