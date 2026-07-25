import {
  clinicCategories,
  clinicComplaints,
  clinicMedicines,
  clinicQueuePatients,
  clinicSites,
  clinicTherapies,
} from "../src/data/clinic.js";

const locales = ["zh-Hant", "ja", "en"];
const errors = [];

function localized(value, path) {
  if (!value || typeof value !== "object") {
    errors.push(`${path} must be localized`);
    return;
  }
  for (const locale of locales) {
    if (typeof value[locale] !== "string" || !value[locale].trim()) errors.push(`${path}.${locale} is missing`);
  }
}

function uniqueRecords(records, label) {
  const ids = new Set();
  for (const [key, record] of Object.entries(records)) {
    if (!record.id || record.id !== key) errors.push(`${label}.${key}.id must equal its key`);
    if (ids.has(record.id)) errors.push(`${label}.${key}.id is duplicated`);
    ids.add(record.id);
  }
}

uniqueRecords(clinicSites, "sites");
uniqueRecords(clinicComplaints, "complaints");
uniqueRecords(clinicMedicines, "medicines");
uniqueRecords(clinicTherapies, "therapies");

if (Object.keys(clinicSites).length !== 2) errors.push(`expected 2 care sites, found ${Object.keys(clinicSites).length}`);
if (Object.keys(clinicComplaints).length !== 8) errors.push(`expected 8 complaint groups, found ${Object.keys(clinicComplaints).length}`);
if (Object.keys(clinicMedicines).length !== 12) errors.push(`expected 12 medicines/aids, found ${Object.keys(clinicMedicines).length}`);
if (Object.keys(clinicTherapies).length !== 6) errors.push(`expected 6 therapies, found ${Object.keys(clinicTherapies).length}`);
if (clinicQueuePatients.length !== 7) errors.push(`expected 7 queue patients, found ${clinicQueuePatients.length}`);

for (const [id, site] of Object.entries(clinicSites)) {
  for (const field of ["name", "short", "location", "hours", "scope", "staff"]) localized(site[field], `sites.${id}.${field}`);
}

for (const [id, complaint] of Object.entries(clinicComplaints)) {
  for (const field of ["name", "prompt"]) localized(complaint[field], `complaints.${id}.${field}`);
  if (!clinicSites[complaint.site]) errors.push(`complaints.${id}.site is unknown`);
  if (!Number.isInteger(complaint.score) || complaint.score < 1) errors.push(`complaints.${id}.score is invalid`);
  if (!complaint.medicineIds?.length) errors.push(`complaints.${id} needs medicine recommendations`);
  if (!complaint.therapyIds?.length) errors.push(`complaints.${id} needs therapy recommendations`);
  for (const medicineId of complaint.medicineIds || []) {
    if (!clinicMedicines[medicineId]) errors.push(`complaints.${id} references unknown medicine ${medicineId}`);
  }
  for (const therapyId of complaint.therapyIds || []) {
    if (!clinicTherapies[therapyId]) errors.push(`complaints.${id} references unknown therapy ${therapyId}`);
  }
}

const medicineCodes = new Set();
for (const [id, medicine] of Object.entries(clinicMedicines)) {
  for (const field of ["name", "maker", "indication", "directions", "caution"]) localized(medicine[field], `medicines.${id}.${field}`);
  if (!medicine.code || medicineCodes.has(medicine.code)) errors.push(`medicines.${id}.code is missing or duplicated`);
  medicineCodes.add(medicine.code);
  if (!clinicCategories[medicine.category]) errors.push(`medicines.${id}.category is unknown`);
  if (!Number.isInteger(medicine.courseUnits) || medicine.courseUnits < 1) errors.push(`medicines.${id}.courseUnits is invalid`);
}

for (const [id, therapy] of Object.entries(clinicTherapies)) {
  for (const field of ["name", "lead", "clinician"]) localized(therapy[field], `therapies.${id}.${field}`);
  if (!Array.isArray(therapy.steps) || therapy.steps.length !== 4) errors.push(`therapies.${id} must have exactly 4 steps`);
  therapy.steps?.forEach((step, index) => localized(step, `therapies.${id}.steps[${index}]`));
}

for (const [index, patient] of clinicQueuePatients.entries()) {
  for (const field of ["name", "reason", "note"]) localized(patient[field], `queue[${index}].${field}`);
  if (!patient.id || !patient.token || !Number.isFinite(patient.baseWait)) errors.push(`queue[${index}] lacks id, token, or wait`);
}

for (const [id, label] of Object.entries(clinicCategories)) localized(label, `categories.${id}`);

if (errors.length) {
  console.error(`Clinic validation failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Clinic data valid: ${Object.keys(clinicSites).length} sites, ${Object.keys(clinicComplaints).length} complaint groups, `
  + `${Object.keys(clinicMedicines).length} medicines/aids, ${Object.keys(clinicTherapies).length} therapies, `
  + `${clinicQueuePatients.length} rotating patients.`,
);
