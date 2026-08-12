import {
  clinicComplaint,
  clinicComplaints,
  clinicMedicine,
  clinicMedicines,
  clinicQueuePatients,
  clinicSites,
  clinicTherapy,
  clinicTherapies,
} from "../data/clinic.js";
import { liveCampusSnapshot } from "../data/live-campus.js";
import { festivalClinicPressure } from "./festival-model.js";

export const CLINIC_KEYS = {
  draft: "tu:clinic:triage-draft",
  visits: "tu:clinic:visits",
  prescriptions: "tu:clinic:prescriptions",
  plans: "tu:clinic:care-plans",
  identity: "tu:identity",
};

const MAX_RECORDS = 60;

export function readClinicJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeClinicJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("tu:clinicchange", { detail: { key } }));
  return value;
}

function hashValue(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function reference(prefix, source) {
  return `${prefix}-${hashValue(source).toString(36).slice(0, 7).toUpperCase().padEnd(7, "0")}`;
}

function dateValue(value, fallback = new Date().toISOString()) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
}

function normalizeComplaints(value) {
  const values = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
  return [...new Set(values.filter((id) => clinicComplaint(id)))].slice(0, 6);
}

function normalizeTriage(input = {}) {
  return {
    complaints: normalizeComplaints(input.complaints),
    intensity: Math.min(4, Math.max(1, Number(input.intensity) || 1)),
    onset: ["today", "yesterday", "week", "uncertain"].includes(input.onset) ? input.onset : "today",
    mobility: ["independent", "escort", "shuttle"].includes(input.mobility) ? input.mobility : "independent",
    lunarSensitive: Boolean(input.lunarSensitive),
    residueContained: input.residueContained !== false,
    notes: String(input.notes || "").slice(0, 500),
  };
}

export function clinicIdentity() {
  return readClinicJson(CLINIC_KEYS.identity, null);
}

export function clinicDraft() {
  const draft = readClinicJson(CLINIC_KEYS.draft, null);
  return draft?.answers ? { ...draft, answers: normalizeTriage(draft.answers) } : null;
}

export function saveClinicDraft(answers) {
  return writeClinicJson(CLINIC_KEYS.draft, {
    schema: 1,
    updatedAt: new Date().toISOString(),
    answers: normalizeTriage(answers),
  });
}

export function clearClinicDraft() {
  window.localStorage.removeItem(CLINIC_KEYS.draft);
  window.dispatchEvent(new CustomEvent("tu:clinicchange", { detail: { key: CLINIC_KEYS.draft } }));
}

export function clinicVisits() {
  const records = readClinicJson(CLINIC_KEYS.visits, []);
  return Array.isArray(records) ? records.map((record) => ({
    schema: 1,
    status: "waiting",
    ...record,
    answers: normalizeTriage(record.answers),
  })) : [];
}

export function clinicPrescriptions() {
  const records = readClinicJson(CLINIC_KEYS.prescriptions, []);
  return Array.isArray(records) ? records.map((record) => ({
    schema: 1,
    status: "issued",
    medicineIds: [],
    doseLog: [],
    ...record,
    medicineIds: (record.medicineIds || []).filter((id) => clinicMedicine(id)),
    doseLog: Array.isArray(record.doseLog) ? record.doseLog : [],
  })) : [];
}

export function clinicCarePlans() {
  const records = readClinicJson(CLINIC_KEYS.plans, []);
  return Array.isArray(records) ? records.map((record) => ({
    schema: 1,
    status: "active",
    completedSteps: [],
    ...record,
    completedSteps: [...new Set(record.completedSteps || [])],
  })) : [];
}

function operationalLoad(now = new Date()) {
  const state = liveCampusSnapshot(now);
  const festival = festivalClinicPressure();
  const lunarLoad = [3, 4, 5].includes(state.phase) ? 7 : 0;
  const eventLoad = [...state.activeEvents, ...state.calendar.activeEvents].reduce((total, event) => {
    if (event.route?.closedEdges?.some((edge) => edge.includes("clinic"))) return total + 6;
    if (event.route?.delays?.clinic) return total + Number(event.route.delays.clinic);
    return total + (event.severity === "high" ? 3 : 1);
  }, 0);
  return {
    state,
    festival,
    points: lunarLoad + eventLoad + state.slot * 2 + festival.points,
  };
}

export function assessTriage(input, now = new Date()) {
  const answers = normalizeTriage(input);
  const complaints = answers.complaints.map(clinicComplaint).filter(Boolean);
  const base = complaints.reduce((total, complaint) => total + complaint.score, 0);
  const siteRequired = complaints.some((complaint) => complaint.site === "eientei");
  const critical =
    answers.intensity >= 4
    || (!answers.residueContained && complaints.some((complaint) => ["magic-feedback", "fairy-core-flicker", "boundary-vertigo"].includes(complaint.id)))
    || (answers.mobility === "shuttle" && answers.intensity >= 3);
  const score = Math.min(
    24,
    base
      + answers.intensity * 2
      + (answers.lunarSensitive && complaints.some((complaint) => complaint.id === "lunar-overload") ? 3 : 0)
      + (answers.onset === "week" ? 2 : 0)
      + (answers.onset === "uncertain" ? 1 : 0)
      + (answers.mobility === "escort" ? 1 : answers.mobility === "shuttle" ? 3 : 0)
      + (!answers.residueContained ? 3 : 0),
  );
  const band = critical || score >= 17 ? "urgent" : score >= 10 ? "priority" : "routine";
  const siteId = band !== "routine" || siteRequired ? "eientei" : "infirmary";
  const { state, festival, points } = operationalLoad(now);
  const baseWait = band === "urgent" ? 3 : band === "priority" ? 11 : 19;
  const waitMinutes = Math.max(2, baseWait + Math.round(points / (band === "urgent" ? 4 : 2)));
  const medicines = [...new Set(complaints.flatMap((complaint) => complaint.medicineIds))]
    .filter((id) => clinicMedicine(id))
    .slice(0, band === "urgent" ? 3 : 2);
  const therapies = [...new Set(complaints.flatMap((complaint) => complaint.therapyIds))]
    .filter((id) => clinicTherapy(id))
    .slice(0, 2);
  const clinicians = siteId === "eientei"
    ? ["eirin", "reisen", "eirin"]
    : ["duty", "reisen-trainee", "duty"];
  const clinicianId = clinicians[hashValue(`${state.key}:${complaints.map((item) => item.id).join(":")}`) % clinicians.length];
  return {
    answers,
    score,
    band,
    siteId,
    waitMinutes,
    medicineIds: medicines,
    therapyIds: therapies,
    clinicianId,
    snapshotKey: `${state.dayKey}:${state.slot}`,
    phase: state.phase,
    weather: state.weather,
    rules: [
      ...state.activeEvents.map((event) => event.rule),
      ...(festival.active ? [{
        "zh-Hant": `祭典現場執行單預估另有 ${festival.expected} 人需要急救或候診。`,
        ja: `祭典運行票は救護・受診 ${festival.expected} 人を追加予測。`,
        en: `The live festival slip adds ${festival.expected} expected aid or clinic presentations.`,
      }] : []),
    ],
  };
}

export function submitClinicTriage(input, now = new Date()) {
  const assessment = assessTriage(input, now);
  if (!assessment.answers.complaints.length) return null;
  const checkedInAt = now.toISOString();
  const identity = clinicIdentity();
  const id = reference("TU-MV", `${identity?.id || "local"}:${checkedInAt}:${JSON.stringify(assessment.answers)}`);
  const visit = {
    schema: 1,
    id,
    identityId: identity?.id || null,
    patientLabel: identity?.name || "LOCAL PATIENT",
    status: "waiting",
    checkedInAt,
    updatedAt: checkedInAt,
    ...assessment,
  };
  const records = clinicVisits();
  records.push(visit);
  writeClinicJson(CLINIC_KEYS.visits, records.slice(-MAX_RECORDS));
  clearClinicDraft();
  return visit;
}

function consultationNote(visit) {
  const signature = hashValue(`${visit.id}:${visit.score}`) % 3;
  return {
    "zh-Hant": [
      "永琳將主訴拆成能被處理的部分，並把「大概沒事」退回重寫。",
      "鈴仙完成波長與月相分診；帝把叫號牌放回了另一個抽屜。",
      "本部醫務室先處理可逆傷勢，並以三個驚嘆號轉介永遠亭覆核。",
    ][signature],
    ja: [
      "永琳は主訴を処置可能な部分へ分け、「たぶん平気」を書き直しに戻した。",
      "鈴仙が波長・月相トリアージを完了。てゐは番号札を別の引出しへ戻した。",
      "本部保健室が可逆的損傷を先に処置し、感嘆符三つで永遠亭へ照会した。",
    ][signature],
    en: [
      "Eirin separated the complaint into treatable parts and returned “probably fine” for revision.",
      "Reisen completed wavelength and lunar triage; Tewi returned the token to a different drawer.",
      "The infirmary treated reversible injuries first and referred the file to Eientei with three exclamation points.",
    ][signature],
  };
}

export function completeClinicConsultation(visitId, now = new Date()) {
  const visits = clinicVisits();
  const visit = visits.find((record) => record.id === visitId);
  if (!visit || visit.status !== "waiting") return null;
  const completedAt = now.toISOString();
  visit.status = "consulted";
  visit.consultedAt = completedAt;
  visit.updatedAt = completedAt;
  visit.consultationNote = consultationNote(visit);
  writeClinicJson(CLINIC_KEYS.visits, visits);

  const prescriptions = clinicPrescriptions();
  const prescriptionId = reference("TU-RX", `${visit.id}:${completedAt}`);
  const prescription = {
    schema: 1,
    id: prescriptionId,
    visitId: visit.id,
    patientLabel: visit.patientLabel,
    siteId: visit.siteId,
    clinicianId: visit.clinicianId,
    status: "issued",
    medicineIds: visit.medicineIds,
    therapyIds: visit.therapyIds,
    issuedAt: completedAt,
    updatedAt: completedAt,
    doseLog: [],
  };
  prescriptions.push(prescription);
  writeClinicJson(CLINIC_KEYS.prescriptions, prescriptions.slice(-MAX_RECORDS));
  return { visit, prescription };
}

export function dispenseClinicPrescription(prescriptionId, now = new Date()) {
  const prescriptions = clinicPrescriptions();
  const prescription = prescriptions.find((record) => record.id === prescriptionId);
  if (!prescription || prescription.status !== "issued") return null;
  prescription.status = "dispensed";
  prescription.dispensedAt = now.toISOString();
  prescription.updatedAt = prescription.dispensedAt;
  writeClinicJson(CLINIC_KEYS.prescriptions, prescriptions);
  return prescription;
}

export function prescriptionCourse(prescription) {
  const required = prescription.medicineIds.reduce((total, id) => total + (clinicMedicine(id)?.courseUnits || 0), 0);
  return {
    required,
    completed: prescription.doseLog.length,
    percent: required ? Math.min(100, Math.round((prescription.doseLog.length / required) * 100)) : 100,
  };
}

export function recordClinicDose(prescriptionId, medicineId, now = new Date()) {
  const prescriptions = clinicPrescriptions();
  const prescription = prescriptions.find((record) => record.id === prescriptionId);
  const medicine = clinicMedicine(medicineId);
  if (!prescription || prescription.status !== "dispensed" || !medicine || !prescription.medicineIds.includes(medicineId)) return null;
  const takenForMedicine = prescription.doseLog.filter((dose) => dose.medicineId === medicineId).length;
  if (takenForMedicine >= medicine.courseUnits) return null;
  const dose = {
    id: reference("TU-DOSE", `${prescription.id}:${medicineId}:${now.toISOString()}:${takenForMedicine}`),
    medicineId,
    recordedAt: now.toISOString(),
    sequence: takenForMedicine + 1,
  };
  prescription.doseLog.push(dose);
  prescription.updatedAt = dose.recordedAt;
  const course = prescriptionCourse(prescription);
  if (course.percent >= 100) {
    prescription.status = "course-complete";
    prescription.completedAt = dose.recordedAt;
  }
  writeClinicJson(CLINIC_KEYS.prescriptions, prescriptions);
  return { prescription, dose };
}

export function startClinicCarePlan(therapyId, { visitId = null } = {}, now = new Date()) {
  const therapy = clinicTherapy(therapyId);
  if (!therapy) return null;
  const plans = clinicCarePlans();
  const existing = plans.find((record) => record.therapyId === therapyId && record.status === "active");
  if (existing) return existing;
  const startedAt = now.toISOString();
  const id = reference("TU-CR", `${clinicIdentity()?.id || "local"}:${therapyId}:${startedAt}`);
  const plan = {
    schema: 1,
    id,
    visitId,
    therapyId,
    status: "active",
    startedAt,
    updatedAt: startedAt,
    completedSteps: [],
  };
  plans.push(plan);
  writeClinicJson(CLINIC_KEYS.plans, plans.slice(-MAX_RECORDS));
  return plan;
}

export function completeClinicCareStep(planId, stepIndex, now = new Date()) {
  const plans = clinicCarePlans();
  const plan = plans.find((record) => record.id === planId);
  const therapy = clinicTherapy(plan?.therapyId);
  const index = Number(stepIndex);
  if (!plan || plan.status !== "active" || !therapy || !Number.isInteger(index) || !therapy.steps[index]) return null;
  if (plan.completedSteps.includes(index)) return { plan, completedNow: false };
  plan.completedSteps.push(index);
  plan.completedSteps.sort((a, b) => a - b);
  plan.updatedAt = now.toISOString();
  const completedNow = plan.completedSteps.length >= therapy.steps.length;
  if (completedNow) {
    plan.status = "completed";
    plan.completedAt = plan.updatedAt;
  }
  writeClinicJson(CLINIC_KEYS.plans, plans);
  return { plan, completedNow };
}

export function clinicOperationalBoard(now = new Date()) {
  const { state, points } = operationalLoad(now);
  const visits = clinicVisits().filter((visit) => visit.status === "waiting");
  const shiftIndex = (state.day + state.slot) % clinicQueuePatients.length;
  const seeded = Array.from({ length: 4 }, (_, index) => clinicQueuePatients[(shiftIndex + index * 2) % clinicQueuePatients.length])
    .map((patient, index) => ({
      ...patient,
      minutes: Math.max(2, patient.baseWait + Math.round(points / 3) + index * 3),
      local: false,
    }));
  const local = visits.slice(-2).map((visit) => ({
    id: visit.id,
    token: visit.id.slice(-5),
    glyph: visit.band === "urgent" ? "急" : visit.band === "priority" ? "優" : "診",
    name: {
      "zh-Hant": visit.patientLabel === "LOCAL PATIENT" ? "本機病友" : visit.patientLabel,
      ja: visit.patientLabel === "LOCAL PATIENT" ? "端末内患者" : visit.patientLabel,
      en: visit.patientLabel === "LOCAL PATIENT" ? "On-device patient" : visit.patientLabel,
    },
    reason: Object.fromEntries(["zh-Hant", "ja", "en"].map((locale) => [
      locale,
      visit.answers.complaints.map((id) => clinicComplaint(id)?.name[locale]).filter(Boolean).join("、"),
    ])),
    note: {
      "zh-Hant": "這張號碼牌來自本機分診，候診時間會保留到完成診察。",
      ja: "この番号札は端末内トリアージから作成。診察完了まで保存される。",
      en: "This token came from on-device triage and remains until consultation is completed.",
    },
    minutes: visit.waitMinutes,
    local: true,
    visitId: visit.id,
  }));
  return {
    snapshot: state,
    load: points >= 14 ? "high" : points >= 8 ? "steady" : "light",
    queue: [...local, ...seeded],
    eienteiWait: Math.max(4, 9 + Math.round(points / 2)),
    infirmaryWait: Math.max(3, 6 + Math.round(points / 3)),
  };
}

function localizedPost(locale, record, values) {
  return {
    id: values.id,
    category: values.category || "notice",
    author: values.author[locale],
    title: values.title[locale],
    body: values.body[locale],
    replies: values.replies,
    createdAt: values.createdAt,
    generated: true,
    clinic: true,
    clinicRoute: values.clinicRoute,
    sourceId: record.id,
  };
}

export function clinicCommunityPosts(locale) {
  const posts = [];
  for (const prescription of clinicPrescriptions().slice(-4)) {
    if (!prescription.dispensedAt) continue;
    const medicines = prescription.medicineIds.map((id) => clinicMedicine(id)?.name[locale]).filter(Boolean);
    posts.push(localizedPost(locale, prescription, {
      id: `clinic-rx-${prescription.id}`,
      author: {
        "zh-Hant": "永遠亭月藥調劑室",
        ja: "永遠亭月薬調剤室",
        en: "Eientei Lunar Pharmacy",
      },
      title: {
        "zh-Hant": `處方 ${prescription.id} 已領藥；帝經手的數量請自行再數一次`,
        ja: `処方 ${prescription.id} 調剤済み・てゐ経由分は再計数を`,
        en: `Prescription ${prescription.id} dispensed; recount anything Tewi handled`,
      },
      body: {
        "zh-Hant": `本次調劑：${medicines.join("、")}。藥袋已寫明校鐘／轉角／日照單位；請勿把三種單位自行加總。`,
        ja: `今回：${medicines.join("、")}。薬袋の単位は校鐘・角・日照。三種を独自に合算しないこと。`,
        en: `Dispensed: ${medicines.join(", ")}. The bag uses bell, corner, and daylight units; do not add those units together.`,
      },
      replies: 2 + (hashValue(prescription.id) % 8),
      createdAt: prescription.dispensedAt,
      clinicRoute: "clinic-pharmacy",
    }));
  }
  for (const plan of clinicCarePlans().slice(-4)) {
    if (!plan.completedAt) continue;
    const therapy = clinicTherapy(plan.therapyId);
    posts.push(localizedPost(locale, plan, {
      id: `clinic-care-${plan.id}`,
      category: "club",
      author: {
        "zh-Hant": "校醫院康復走廊",
        ja: "校医院回復廊",
        en: "Campus Hospital Recovery Corridor",
      },
      title: {
        "zh-Hant": `${therapy.name[locale]}完成；旁觀者與本人對「完全恢復」仍有一格分歧`,
        ja: `${therapy.name[locale]}完了・「完全回復」は本人と観察者で一欄不一致`,
        en: `${therapy.name[locale]} complete; patient and observer differ by one box on “fully recovered”`,
      },
      body: {
        "zh-Hant": "四步回條全部蓋章。若復發，請帶原回條回診；文的剪報不視為病歷副本。",
        ja: "四段階すべて押印。再発時は原票を持参。文の切抜きは診療録控えではない。",
        en: "All four steps are stamped. Bring the original slip if symptoms recur; Aya’s clipping is not a medical-record copy.",
      },
      replies: 4 + (hashValue(plan.id) % 11),
      createdAt: plan.completedAt,
      clinicRoute: "clinic-recovery",
    }));
  }
  return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
}

export function clinicStats() {
  const visits = clinicVisits();
  const prescriptions = clinicPrescriptions();
  const plans = clinicCarePlans();
  return {
    visits: visits.length,
    waiting: visits.filter((record) => record.status === "waiting").length,
    prescriptions: prescriptions.length,
    activePrescriptions: prescriptions.filter((record) => record.status === "dispensed").length,
    activePlans: plans.filter((record) => record.status === "active").length,
    completedPlans: plans.filter((record) => record.status === "completed").length,
  };
}

export const clinicModelCatalogues = {
  complaints: clinicComplaints,
  medicines: clinicMedicines,
  therapies: clinicTherapies,
  sites: clinicSites,
};
